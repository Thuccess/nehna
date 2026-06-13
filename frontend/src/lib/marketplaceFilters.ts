import type { Business, Product } from '@adulis/shared';

export const MARKETPLACE_CATEGORIES = [
  'Food',
  'Groceries',
  'Housing',
  'Jobs',
  'Electronics',
  'Fashion',
  'Beauty',
  'Services',
] as const;

export type MarketplaceCategory = (typeof MARKETPLACE_CATEGORIES)[number];

export const MARKETPLACE_NEIGHBORHOODS = [
  'Kansanga',
  'Kabalagala',
  'Bunga',
  'Buziga',
  'Konge',
  'Soya',
] as const;

/** Maps common search terms (from placeholder) to marketplace categories. */
export const CATEGORY_SEARCH_SYNONYMS: Record<MarketplaceCategory, string[]> = {
  Food: ['injera', 'food', 'cafe', 'cafes', 'coffee', 'restaurant', 'dining', 'habesha'],
  Groceries: ['grocery', 'groceries', 'berbere', 'spice', 'shiro'],
  Housing: ['apartment', 'apartments', 'room', 'rooms', 'rent', 'housing', 'studio', 'flat'],
  Jobs: ['job', 'jobs', 'gig', 'gigs', 'work', 'employment'],
  Electronics: ['phone', 'phones', 'mobile', 'laptop', 'electronics', 'tablet', 'charger'],
  Fashion: ['fashion', 'dress', 'clothes', 'zuria', 'tailor', 'wear'],
  Beauty: ['barber', 'barbers', 'salon', 'salons', 'hair', 'beauty', 'spa'],
  Services: ['service', 'services', 'transport', 'driver', 'delivery'],
};

export interface MarketplaceFilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedLocation: string;
}

export function buildMarketplaceSearchParams(filters: MarketplaceFilterState): URLSearchParams {
  const params = new URLSearchParams();
  const q = filters.searchQuery.trim();
  if (q) params.set('q', q);
  if (filters.selectedCategory) params.set('category', filters.selectedCategory);
  if (filters.selectedLocation) params.set('neighborhood', filters.selectedLocation);
  return params;
}

export function buildMarketplaceSearchUrl(
  basePath: string,
  filters: MarketplaceFilterState,
): string {
  const params = buildMarketplaceSearchParams(filters);
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function parseMarketplaceFiltersFromSearchParams(
  sp: URLSearchParams,
): MarketplaceFilterState {
  return {
    searchQuery: sp.get('q') ?? '',
    selectedCategory: sp.get('category') ?? '',
    selectedLocation: sp.get('neighborhood') ?? '',
  };
}

function expandSearchTerms(query: string): string[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const terms = new Set<string>([normalized]);
  const tokens = normalized.split(/\s+/).filter(Boolean);

  for (const token of tokens) {
    terms.add(token);
    for (const [category, synonyms] of Object.entries(CATEGORY_SEARCH_SYNONYMS)) {
      const hit = synonyms.some(
        (syn) => syn === token || syn.includes(token) || token.includes(syn),
      );
      if (hit) {
        terms.add(category.toLowerCase());
        for (const syn of synonyms) terms.add(syn);
      }
    }
  }

  for (const [category, synonyms] of Object.entries(CATEGORY_SEARCH_SYNONYMS)) {
    const hit = synonyms.some(
      (syn) => normalized.includes(syn) || syn.includes(normalized),
    );
    if (hit) {
      terms.add(category.toLowerCase());
    }
  }

  return [...terms];
}

function textMatchesSearchTerms(text: string, terms: string[]): boolean {
  const lowered = text.toLowerCase();
  return terms.some((term) => lowered.includes(term));
}

export function productMatchesSearch(
  product: Product,
  business: Business | undefined,
  searchQuery: string,
): boolean {
  const terms = expandSearchTerms(searchQuery);
  if (terms.length === 0) return true;

  const blob = [
    product.name,
    product.description,
    product.category,
    business?.name ?? '',
    business?.description ?? '',
    business?.category ?? '',
    business?.neighborhood ?? '',
  ].join(' ');

  return textMatchesSearchTerms(blob, terms);
}

export function businessMatchesSearch(business: Business, searchQuery: string): boolean {
  const terms = expandSearchTerms(searchQuery);
  if (terms.length === 0) return true;

  const blob = [
    business.name,
    business.description,
    business.category,
    business.neighborhood,
  ].join(' ');

  return textMatchesSearchTerms(blob, terms);
}

export function filterMarketplaceProducts(
  products: Product[],
  businesses: Business[],
  filters: MarketplaceFilterState,
): Product[] {
  return products.filter((prod) => {
    const biz = businesses.find((b) => b.id === prod.businessId);
    if (!biz || biz.status !== 'approved') return false;

    if (!productMatchesSearch(prod, biz, filters.searchQuery)) return false;

    if (filters.selectedCategory) {
      const category = filters.selectedCategory;
      if (prod.category !== category && biz.category !== category) return false;
    }

    if (filters.selectedLocation && biz.neighborhood !== filters.selectedLocation) {
      return false;
    }

    return true;
  });
}

export function filterMarketplaceBusinesses(
  businesses: Business[],
  filters: MarketplaceFilterState,
): Business[] {
  return businesses.filter((biz) => {
    if (biz.status !== 'approved') return false;
    if (!businessMatchesSearch(biz, filters.searchQuery)) return false;
    if (filters.selectedCategory && biz.category !== filters.selectedCategory) return false;
    if (filters.selectedLocation && biz.neighborhood !== filters.selectedLocation) {
      return false;
    }
    return true;
  });
}

export function scrollToMarketplaceResults(): void {
  const el = document.getElementById('marketplace-main-section');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
