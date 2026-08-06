// HeroSection.jsx
import React from 'react';
import HeroCarousel from '@/components/HeroCarousel';

const HeroSection = ({ headerHeight = 0 }) => {
  return (
    <section
      className="relative w-full bg-black"
      style={{
        marginTop: `${headerHeight}px`,
        transition: 'margin-top 0.3s ease-in-out',
      }}
    >
      <HeroCarousel />
    </section>
  );
};

export default HeroSection;