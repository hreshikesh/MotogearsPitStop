import React from 'react';
import SeoHead from '@/components/SeoHead';
import HeroSection from '@/components/home/HeroSection';
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE } from '@/config/seo';
import { buildTitle } from '@/utils/seoText';
import { organizationSchema, websiteSchema } from '@/utils/jsonLd';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import FeaturedDealsBanner from '@/components/home/FeaturedDealsBanner';
import ShopByBrands from '@/components/home/ShopByBrands';
import ShopBySpecificBike from '@/components/home/ShopBySpecificBike';
import NewArrivals from '@/components/home/NewArrivals';
import ShopBySpecificBrands from '@/components/home/ShopBySpecificBrands';
import ShopByBikeShowcase from '@/components/home/ShopByBikeShowcase';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import ShopShowcaseSection from '@/components/home/ShopShowcaseSection';
import ModernTechSection from '@/components/home/ModernTechSection';
import RidingGearShowcase from '@/components/home/RidingGearShowcase';
import TouringShowcase from '@/components/home/TouringShowcase';
import TrustBenefits from '@/components/home/TrustBenefits';
import FirstPurchasePromoModal from '@/components/home/FirstPurchasePromoModal';
import useHeaderHeight from '@/hooks/useHeaderHeight';

const HomePage = ({ headerRef }) => {
  // Calculate dynamic header height using the passed headerRef
  const headerHeight = useHeaderHeight(headerRef);

  return (
    <>
      <SeoHead
        title={buildTitle('Premium Motorcycle Accessories & Riding Gear for Indian Riders')}
        description={DEFAULT_DESCRIPTION}
        canonicalPath="/"
        ogImage={DEFAULT_OG_IMAGE}
        jsonLd={[organizationSchema(), websiteSchema()]}
      />
      <FirstPurchasePromoModal />
      <div className="bg-white min-h-screen">
        <HeroSection headerHeight={headerHeight} />
        <CategoryShowcase />
        <FeaturedDealsBanner />
        <ShopByBrands />
        <ShopBySpecificBike />
        <NewArrivals />
        <ShopBySpecificBrands />
        <ShopByBikeShowcase />
        <FeaturedCollections />
        <ShopShowcaseSection />
        <ModernTechSection />
        <RidingGearShowcase />
        <TouringShowcase />
        <TrustBenefits />
      </div>
    </>
  );
};

export default HomePage;
