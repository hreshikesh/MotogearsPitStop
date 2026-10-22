// HeroSection.jsx
import React from 'react';
import HeroCarousel from '@/components/HeroCarousel';

const HeroSection = () => {
  return (
    <section className="relative w-full bg-black">
      <HeroCarousel />
    </section>
  );
};

export default HeroSection;