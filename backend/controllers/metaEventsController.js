import asyncHandler from 'express-async-handler';
import {
  buildHashedUserData,
  buildMetaEvent,
  sendMetaEvents,
} from '../utils/metaCapi.js';

const ALLOWED_EVENTS = new Set([
  'ViewContent',
  'Search',
  'AddToWishlist',
  'AddToCart',
  'InitiateCheckout',
  'AddPaymentInfo',
  'CompleteRegistration',
  'Contact',
  'FindLocation',
]);

const normalizeEventName = (name) => {
  const map = {
    'View content': 'ViewContent',
    'Add to wishlist': 'AddToWishlist',
    'Add to cart': 'AddToCart',
    'Initiate checkout': 'InitiateCheckout',
    'Add payment info': 'AddPaymentInfo',
    'Complete registration': 'CompleteRegistration',
    'Find location': 'FindLocation',
  };
  const trimmed = String(name || '').trim();
  return map[trimmed] || trimmed;
};

// @POST /api/meta/events — browser events relayed for Conversions API (+ Pixel dedup via event_id)
export const ingestMetaEvents = asyncHandler(async (req, res) => {
  const { events } = req.body;
  if (!Array.isArray(events) || events.length === 0) {
    res.status(400);
    throw new Error('events array is required');
  }
  if (events.length > 20) {
    res.status(400);
    throw new Error('Too many events in one request');
  }

  const clientUserAgent = req.headers['user-agent'];
  const clientIpAddress = req.ip;

  const payloadEvents = events.map((raw) => {
    const eventName = normalizeEventName(raw.eventName);
    if (!ALLOWED_EVENTS.has(eventName)) {
      res.status(400);
      throw new Error(`Event not allowed: ${raw.eventName}`);
    }

    const ud = raw.userData || {};
    const userData = buildHashedUserData({
      email: ud.email,
      phone: ud.phone,
      firstName: ud.firstName,
      lastName: ud.lastName,
      city: ud.city,
      state: ud.state,
      zip: ud.zip,
      gender: ud.gender,
      clientUserAgent: ud.clientUserAgent || clientUserAgent,
      clientIpAddress: ud.clientIpAddress || clientIpAddress,
      fbp: ud.fbp || raw.fbp,
      fbc: ud.fbc || raw.fbc,
      externalId: ud.externalId,
    });

    return buildMetaEvent({
      eventName,
      eventTime: raw.eventTime,
      eventSourceUrl: raw.eventSourceUrl,
      eventId: raw.eventId,
      customData: raw.customData,
      userData,
    });
  });

  await sendMetaEvents(payloadEvents);
  res.json({ success: true });
});
