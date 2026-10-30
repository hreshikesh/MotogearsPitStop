import crypto from 'crypto';
import axios from 'axios';

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

export const hashEmail = (email) => {
  if (!email) return undefined;
  const normalized = String(email).trim().toLowerCase();
  return normalized ? sha256(normalized) : undefined;
};

/** Meta expects digits only, with country code (India → 91). */
export const hashPhone = (phone) => {
  if (!phone) return undefined;
  let digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) digits = `91${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) digits = `91${digits.slice(1)}`;
  return digits.length >= 10 ? sha256(digits) : undefined;
};

const hashNamePart = (value) => {
  if (!value) return undefined;
  const normalized = String(value).trim().toLowerCase().replace(/[^a-z]/g, '');
  return normalized ? sha256(normalized) : undefined;
};

const hashCity = (value) => {
  if (!value) return undefined;
  const normalized = String(value).trim().toLowerCase().replace(/\s+/g, '');
  return normalized ? sha256(normalized) : undefined;
};

const hashState = hashCity;

const hashZip = (value) => {
  if (!value) return undefined;
  const normalized = String(value).trim().toLowerCase().replace(/\s|-/g, '');
  return normalized ? sha256(normalized) : undefined;
};

export const buildHashedUserData = ({
  email,
  phone,
  firstName,
  lastName,
  city,
  state,
  zip,
  gender,
  clientUserAgent,
  clientIpAddress,
  fbp,
  fbc,
  externalId,
}) => {
  const user_data = {};

  const em = hashEmail(email);
  if (em) user_data.em = [em];
  const ph = hashPhone(phone);
  if (ph) user_data.ph = [ph];

  const fn = hashNamePart(firstName);
  if (fn) user_data.fn = [fn];
  const ln = hashNamePart(lastName);
  if (ln) user_data.ln = [ln];
  const ct = hashCity(city);
  if (ct) user_data.ct = [ct];
  const st = hashState(state);
  if (st) user_data.st = [st];
  const zp = hashZip(zip);
  if (zp) user_data.zp = [zp];

  if (gender) {
    const g = String(gender).trim().toLowerCase().charAt(0);
    if (g === 'm' || g === 'f') user_data.ge = [sha256(g)];
  }

  if (clientUserAgent) user_data.client_user_agent = clientUserAgent;
  if (clientIpAddress) user_data.client_ip_address = clientIpAddress;
  if (fbp) user_data.fbp = fbp;
  if (fbc) user_data.fbc = fbc;
  if (externalId) user_data.external_id = [sha256(String(externalId))];

  return user_data;
};

export const buildMetaEvent = ({
  eventName,
  eventTime = Math.floor(Date.now() / 1000),
  eventSourceUrl,
  actionSource = 'website',
  eventId,
  customData,
  userData,
}) => {
  const event = {
    event_name: eventName,
    event_time: eventTime,
    action_source: actionSource,
  };
  if (eventSourceUrl) event.event_source_url = eventSourceUrl;
  if (eventId) event.event_id = eventId;
  if (userData && Object.keys(userData).length > 0) event.user_data = userData;
  if (customData && Object.keys(customData).length > 0) event.custom_data = customData;
  return event;
};

export async function sendMetaEvents(events) {
  const pixelId = process.env.META_PIXEL_ID?.trim();
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  if (!pixelId || !accessToken || !Array.isArray(events) || events.length === 0) {
    return { skipped: true };
  }

  const apiVersion = process.env.META_GRAPH_API_VERSION?.trim() || 'v21.0';
  const payload = {
    data: events,
    access_token: accessToken,
  };
  const testCode = process.env.META_CAPI_TEST_EVENT_CODE?.trim();
  if (testCode) payload.test_event_code = testCode;

  const url = `https://graph.facebook.com/${apiVersion}/${pixelId}/events`;
  const { data } = await axios.post(url, payload, { timeout: 15000 });
  return data;
}

export function sendMetaPurchaseFromOrder({ order, user, metaTracking = {}, req }) {
  const contentIds = (order.items || []).map(
    (item) => String(item.product || item.externalProductId || item._id || ''),
  ).filter(Boolean);

  const nameParts = String(order.shippingAddress?.fullName || user?.name || '').trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

  const userData = buildHashedUserData({
    email: user?.email,
    phone: order.shippingAddress?.phone || user?.phone,
    firstName,
    lastName,
    city: order.shippingAddress?.city,
    state: order.shippingAddress?.state,
    zip: order.shippingAddress?.pincode,
    clientUserAgent: metaTracking.clientUserAgent || req?.headers?.['user-agent'],
    clientIpAddress: metaTracking.clientIpAddress || req?.ip,
    fbp: metaTracking.fbp,
    fbc: metaTracking.fbc,
    externalId: user?._id?.toString(),
  });

  const event = buildMetaEvent({
    eventName: 'Purchase',
    eventId: metaTracking.eventId,
    eventSourceUrl: metaTracking.eventSourceUrl,
    customData: {
      currency: 'INR',
      value: Number(order.totalPrice || 0),
      order_id: String(order._id),
      content_ids: contentIds,
      content_type: 'product',
      num_items: (order.items || []).reduce((n, i) => n + (i.quantity || 0), 0),
    },
    userData,
  });

  return sendMetaEvents([event]).catch((err) => {
    console.error('Meta CAPI Purchase failed:', err.response?.data || err.message);
  });
}
