'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  buildMarketplaceSearchParams,
  buildMarketplaceSearchUrl,
  parseMarketplaceFiltersFromSearchParams,
  type MarketplaceFilterState,
} from '@/lib/marketplaceFilters';

interface UseMarketplaceFiltersOptions {
  syncUrl?: boolean;
}

function filtersEqual(a: MarketplaceFilterState, b: MarketplaceFilterState): boolean {
  return (
    a.searchQuery === b.searchQuery &&
    a.selectedCategory === b.selectedCategory &&
    a.selectedLocation === b.selectedLocation
  );
}

export function useMarketplaceFilters(options: UseMarketplaceFiltersOptions = {}) {
  const { syncUrl = false } = options;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<MarketplaceFilterState>(() =>
    syncUrl
      ? parseMarketplaceFiltersFromSearchParams(searchParams)
      : { searchQuery: '', selectedCategory: '', selectedLocation: '' },
  );

  // URL → state (back/forward, external links)
  useEffect(() => {
    if (!syncUrl) return;
    const fromUrl = parseMarketplaceFiltersFromSearchParams(searchParams);
    setFilters((prev) => (filtersEqual(prev, fromUrl) ? prev : fromUrl));
  }, [syncUrl, searchParams]);

  // state → URL (user filter changes)
  useEffect(() => {
    if (!syncUrl) return;
    const targetQs = buildMarketplaceSearchParams(filters).toString();
    const currentQs = searchParams.toString();
    if (targetQs === currentQs) return;
    router.replace(buildMarketplaceSearchUrl(pathname, filters), { scroll: false });
  }, [filters, syncUrl, pathname, router, searchParams]);

  const applyPatch = useCallback((patch: Partial<MarketplaceFilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const setSearchQuery = useCallback(
    (searchQuery: string) => applyPatch({ searchQuery }),
    [applyPatch],
  );

  const setSelectedCategory = useCallback(
    (selectedCategory: string) => applyPatch({ selectedCategory }),
    [applyPatch],
  );

  const setSelectedLocation = useCallback(
    (selectedLocation: string) => applyPatch({ selectedLocation }),
    [applyPatch],
  );

  const clearFilters = useCallback(
    () => applyPatch({ searchQuery: '', selectedCategory: '', selectedLocation: '' }),
    [applyPatch],
  );

  return {
    searchQuery: filters.searchQuery,
    selectedCategory: filters.selectedCategory,
    selectedLocation: filters.selectedLocation,
    setSearchQuery,
    setSelectedCategory,
    setSelectedLocation,
    clearFilters,
    applyFilters: applyPatch,
  };
}
