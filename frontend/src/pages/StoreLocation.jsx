import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Mail, ExternalLink } from 'lucide-react';
import SeoHead from '@/components/SeoHead';
import {
  BUSINESS_ADDRESS_LINES,
  BUSINESS_EMAIL_PRIMARY,
  BUSINESS_HOURS_TEXT,
  BUSINESS_NAME,
  BUSINESS_PHONE_DISPLAY,
  STORE_LOCATION_PATH,
  getGoogleMapsDirectionsUrl,
} from '@/config/business';
import { getWhatsAppUrl, INSTAGRAM_URL } from '@/config/contact';
import { localBusinessSchema, breadcrumbSchema, organizationSchema } from '@/utils/jsonLd';
import { buildTitle, truncateMeta } from '@/utils/seoText';
import { productsUrl } from '@/utils/urlUtils';

const STORE_FAQ = [
  {
    q: 'Where is the MotoGearsPitstop store located?',
    a: 'Our showroom is on Varthur Main Road in Whitefield, Bengaluru (near Dmart), Karnataka 560066.',
  },
  {
    q: 'Can I pick up an online order at the store?',
    a: 'Contact us on WhatsApp or phone before visiting so we can confirm product availability and prepare your order.',
  },
  {
    q: 'What products can I find at the store?',
    a: 'We stock riding gear, helmets, bike accessories, touring essentials, and performance parts — selection varies by availability.',
  },
];

const StoreLocation = () => {
  const title = buildTitle('Motorcycle Accessories Store — Whitefield, Bengaluru');
  const description = truncateMeta(
    'Visit MotoGearsPitstop in Whitefield, Bengaluru for motorcycle riding gear, helmets, accessories and touring products. Directions, hours, phone and WhatsApp support.',
  );

  const jsonLd = [
    organizationSchema(),
    localBusinessSchema(),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Store — Whitefield', path: STORE_LOCATION_PATH },
    ]),
  ];

  return (
    <>
      <SeoHead
        title={title}
        description={description}
        canonicalPath={STORE_LOCATION_PATH}
        jsonLd={jsonLd}
      />

      <div className="min-h-screen bg-white py-6 px-4 pb-16">
        <div className="max-w-[1100px] mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Store — Whitefield</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {BUSINESS_NAME} — Whitefield Store
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Shop motorcycle accessories, riding gear, helmets, and touring essentials at our
              Whitefield showroom or order online for delivery across India.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            <section className="space-y-6">
              <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50">
                <div className="flex gap-3 mb-3">
                  <MapPin className="text-[#e63946] shrink-0" />
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">Address</h2>
                    <address className="not-italic text-gray-700 leading-relaxed mt-2">
                      {BUSINESS_ADDRESS_LINES.map((line) => (
                        <span key={line} className="block">{line}</span>
                      ))}
                    </address>
                  </div>
                </div>
                <a
                  href={getGoogleMapsDirectionsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#e63946] font-semibold text-sm mt-2 hover:underline"
                >
                  Get directions on Google Maps
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="p-6 rounded-2xl border border-gray-200">
                <div className="flex gap-3">
                  <Clock className="text-[#e63946] shrink-0" />
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">Opening hours</h2>
                    <p className="text-gray-700 mt-2">{BUSINESS_HOURS_TEXT.weekday}</p>
                    <p className="text-gray-700">{BUSINESS_HOURS_TEXT.sunday}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex gap-3 items-center">
                  <Phone className="text-[#25D366]" size={20} />
                  <a href={getWhatsAppUrl()} className="text-gray-900 font-medium hover:text-[#25D366]">
                    {BUSINESS_PHONE_DISPLAY}
                  </a>
                </div>
                <div className="flex gap-3 items-center">
                  <Mail className="text-[#e63946]" size={20} />
                  <a href={`mailto:${BUSINESS_EMAIL_PRIMARY}`} className="text-gray-900 hover:text-[#e63946]">
                    {BUSINESS_EMAIL_PRIMARY}
                  </a>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop categories online</h2>
              <ul className="space-y-2 text-gray-700">
                {[
                  { label: 'Helmets', subcategory: 'Helmets' },
                  { label: 'Riding jackets', subcategory: 'Jackets' },
                  { label: 'Crash guards', subcategory: 'Crash Guards' },
                  { label: 'Touring accessories', category: 'Touring' },
                ].map(({ label, subcategory, category }) => (
                  <li key={label}>
                    <Link
                      to={productsUrl(subcategory ? { subcategory } : { category })}
                      className="text-[#e63946] hover:underline"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-gray-500">
                Follow updates on{' '}
                <a href={INSTAGRAM_URL} className="text-[#e63946] hover:underline" rel="noopener noreferrer" target="_blank">
                  Instagram
                </a>
                .
              </p>
            </section>
          </div>

          <section className="border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Store visit FAQs</h2>
            <dl className="space-y-6">
              {STORE_FAQ.map(({ q, a }) => (
                <div key={q}>
                  <dt className="font-semibold text-gray-900">{q}</dt>
                  <dd className="text-gray-600 mt-1">{a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </>
  );
};

export default StoreLocation;
