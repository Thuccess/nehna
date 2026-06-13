'use client';

import { useRouter } from 'next/navigation';
import FeaturedSection from '@/features/businesses/components/FeaturedSection';
import MarketplaceMain from '@/features/products/components/MarketplaceMain';
import SidebarFilters from '@/features/products/components/SidebarFilters';
import RegisterCtaCard from '@/components/forms/RegisterCtaCard';
import HomeHero from './HomeHero';
import HowItWorks from './HowItWorks';
import TrustedSellersRail from './TrustedSellersRail';
import { useBusinesses, useProducts, useFavorites } from '@/lib/queries';
import { useMarketplaceFilters } from '@/lib/hooks/useMarketplaceFilters';
import { scrollToMarketplaceResults } from '@/lib/marketplaceFilters';
import type { Business } from '@adulis/shared';

export default function HomeView() {
  const router = useRouter();
  const {
    searchQuery,
    selectedCategory,
    selectedLocation,
    setSearchQuery,
    setSelectedCategory,
    setSelectedLocation,
  } = useMarketplaceFilters();

  const { data: businesses = [] } = useBusinesses({ status: 'all' });
  const { data: products = [] } = useProducts();
  const { data: favorites = [] } = useFavorites();

  const handleExploreBusiness = (biz: Business) => {
    const params = new URLSearchParams();
    params.set('category', biz.category);
    params.set('neighborhood', biz.neighborhood);
    router.push(`/products?${params.toString()}`);
  };

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    scrollToMarketplaceResults();
  };

  const handleHeroCategorySelect = (category: string) => {
    setSelectedCategory(category);
    scrollToMarketplaceResults();
  };

  return (
    <>
      <HomeHero
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearchSubmit={handleHeroSearch}
        selectedCategory={selectedCategory}
        onCategorySelect={handleHeroCategorySelect}
      />
      <HowItWorks />
      <TrustedSellersRail businesses={businesses} />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 pb-mobile-nav md:pb-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-24 self-start">
            <SidebarFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              onFilterChange={scrollToMarketplaceResults}
            />
            <RegisterCtaCard />
          </aside>

          <div className="lg:col-span-9 space-y-10">
            <FeaturedSection businesses={businesses} onExploreBusiness={handleExploreBusiness} />
            <MarketplaceMain
              products={products}
              businesses={businesses}
              favorites={favorites}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedLocation={selectedLocation}
            />
          </div>
        </div>
      </main>
    </>
  );
}
