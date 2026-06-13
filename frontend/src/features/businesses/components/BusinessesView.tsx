'use client';

import BusinessDirectory from '@/features/businesses/components/BusinessDirectory';
import SidebarFilters from '@/features/products/components/SidebarFilters';
import RegisterCtaCard from '@/components/forms/RegisterCtaCard';
import { useMarketplaceFilters } from '@/lib/hooks/useMarketplaceFilters';
import { scrollToMarketplaceResults } from '@/lib/marketplaceFilters';

export default function BusinessesView() {
  const {
    searchQuery,
    selectedCategory,
    selectedLocation,
    setSearchQuery,
    setSelectedCategory,
    setSelectedLocation,
  } = useMarketplaceFilters({ syncUrl: true });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <aside className="lg:col-span-3 space-y-6">
        <SidebarFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          onFilterChange={() => scrollToMarketplaceResults()}
        />
        <RegisterCtaCard />
      </aside>
      <div className="lg:col-span-9" id="marketplace-main-section">
        <BusinessDirectory
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedLocation={selectedLocation}
        />
      </div>
    </div>
  );
}
