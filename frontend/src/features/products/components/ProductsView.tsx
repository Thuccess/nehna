'use client';

import MarketplaceMain from './MarketplaceMain';
import SidebarFilters from './SidebarFilters';
import RegisterCtaCard from '@/components/forms/RegisterCtaCard';
import { useBusinesses, useFavorites, useProducts } from '@/lib/queries';
import { useSyncedMarketplaceFilters } from '@/lib/hooks/useMarketplaceFilters';

export default function ProductsView() {
  const {
    searchQuery,
    selectedCategory,
    selectedLocation,
    setSearchQuery,
    setSelectedCategory,
    setSelectedLocation,
  } = useSyncedMarketplaceFilters();

  const { data: businesses = [] } = useBusinesses({ status: 'all' });
  const { data: products = [] } = useProducts();
  const { data: favorites = [] } = useFavorites();

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
        />
        <RegisterCtaCard />
      </aside>

      <div className="lg:col-span-9">
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
  );
}
