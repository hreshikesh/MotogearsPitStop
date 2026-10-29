import React, { useEffect } from 'react';
import SeoHead from '@/components/SeoHead';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { WHATSAPP_COMMUNITY_URL } from '@/config/contact';
import { buildTitle } from '@/utils/seoText';

const JoinCommunity = () => {
  useEffect(() => {
    window.location.replace(WHATSAPP_COMMUNITY_URL);
  }, []);

  return (
    <>
      <SeoHead
        title={buildTitle('Join Our WhatsApp Community')}
        description="Join the MotoGearsPitstop riders community on WhatsApp for weekend rides, exclusive offers and more."
        canonicalPath="/community"
        robots="noindex, follow"
      />
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-white px-6 text-center">
        <WhatsAppIcon className="h-14 w-14 fill-[#25D366]" />
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Opening our WhatsApp community…</h1>
        <p className="max-w-sm text-sm text-gray-600">
          If WhatsApp doesn&apos;t open automatically, tap the button below.
        </p>
        <a
          href={WHATSAPP_COMMUNITY_URL}
          className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-gray-950 shadow-lg shadow-[#25D366]/25 transition-colors hover:bg-[#1ebe5b]"
        >
          <WhatsAppIcon className="h-5 w-5 shrink-0 fill-gray-950" />
          Join the Community
        </a>
      </div>
    </>
  );
};

export default JoinCommunity;
