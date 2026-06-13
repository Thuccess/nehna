'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  buildMarketplaceSearchParams,
  buildMarketplaceSearchUrl,
  parseMarketplaceFiltersFromSearchParams,
  type MarketplaceFilterState,
} from '@/lib/marketplaceFilters';

function filtersEqual(a: MarketplaceFilterState, b: MarketplaceFilterState): boolean {
  return (
    a.searchQuery === b.searchQuery &&
    a.selectedCategory === b.selectedCategory &&
    a.selectedLocation === b.selectedLocation
  );
}

function useMarketplaceFilterState(
  initial: MarketplaceFilterState | (() => MarketplaceFilterState),
) {
  const [filters, setFilters] = useState<MarketplaceFilterState>(initial);

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
    filters,
    setFilters,
    setSearchQuery,
    setSelectedCategory,
    setSelectedLocation,
    clearFilters,
    applyFilters: applyPatch,
  };
}

/** Local filter state only — safe without a Suspense boundary. */
export function useMarketplaceFilters() {
  const {
    filters,
    setSearchQuery,
    setSelectedCategory,
    setSelectedLocation,
    clearFilters,
    applyFilters,
  } = useMarketplaceFilterState({
    searchQuery: '',
    selectedCategory: '',
    selectedLocation: '',
  });

  return {
    searchQuery: filters.searchQuery,
    selectedCategory: filters.selectedCategory,
    selectedLocation: filters.selectedLocation,
    setSearchQuery,
    setSelectedCategory,
    setSelectedLocation,
    clearFilters,
    applyFilters,
  };
}

/** Syncs filters with URL search params — wrap the consumer in Suspense. */
export function useSyncedMarketplaceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    filters,
    setFilters,
    setSearchQuery,
    setSelectedCategory,
    setSelectedLocation,
    clearFilters,
    applyFilters,
  } = useMarketplaceFilterState(() => parseMarketplaceFiltersFromSearchParams(searchParams));

  // URL → state (back/forward, external links)
  useEffect(() => {
    const fromUrl = parseMarketplaceFiltersFromSearchParams(searchParams);
    setFilters((prev) => (filtersEqual(prev, fromUrl) ? prev : fromUrl));
  }, [searchParams]);

  // state → URL (user filter changes)
  useEffect(() => {
    const targetQs = buildMarketplaceSearchParams(filters).toString();
    const currentQs = searchParams.toString();
    if (targetQs === currentQs) return;
    router.replace(buildMarketplaceSearchUrl(pathname, filters), { scroll: false });
  }, [filters, pathname, router, searchParams]);

  return {
    searchQuery: filters.searchQuery,
    selectedCategory: filters.selectedCategory,
    selectedLocation: filters.selectedLocation,
    setSearchQuery,
    setSelectedCategory,
    setSelectedLocation,
    clearFilters,
    applyFilters,
  };
}
