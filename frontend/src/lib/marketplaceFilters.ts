import type { Business, Product } from '@adulis/shared';
import { CATEGORIES, normalizeCategory, type Category } from '@adulis/shared/constants';

export const MARKETPLACE_CATEGORIES = CATEGORIES;

export type MarketplaceCategory = Category;

export const MARKETPLACE_NEIGHBORHOODS = [
  'Kansanga',
  'Kabalagala',
  'Bunga',
  'Buziga',
  'Konge',
  'Soya',
] as const;

/** Maps common search terms to marketplace categories. */
export const CATEGORY_SEARCH_SYNONYMS: Record<MarketplaceCategory, string[]> = {
  Electronics: ['phone', 'phones', 'mobile', 'laptop', 'electronics', 'tablet', 'charger', 'tv'],
  Schools: ['school', 'schools', 'education', 'tuition', 'academy', 'kindergarten'],
  Travel: ['travel', 'tour', 'flight', 'ticket', 'visa', 'agency'],
  Rentals: ['apartment', 'rent', 'rental', 'housing', 'room', 'rooms', 'studio', 'flat'],
  Hotels: ['hotel', 'hotels', 'lodging', 'guesthouse', 'bnb'],
  Fashion: ['fashion', 'dress', 'clothes', 'zuria', 'tailor', 'wear'],
  Beauty: ['barber', 'salon', 'hair', 'beauty', 'spa', 'nails'],
  Services: ['service', 'services', 'transport', 'driver', 'delivery', 'professional'],
  Jobs: ['job', 'jobs', 'gig', 'gigs', 'work', 'employment'],
  Restaurants: ['food', 'cafe', 'restaurant', 'injera', 'habesha', 'dining', 'groceries', 'grocery'],
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
  const rawCategory = sp.get('category') ?? '';
  return {
    searchQuery: sp.get('q') ?? '',
    selectedCategory: rawCategory ? normalizeCategory(rawCategory) : '',
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

function categoryMatches(
  productCategory: string,
  businessCategory: string,
  filterCategory: string,
): boolean {
  const normalizedFilter = normalizeCategory(filterCategory);
  return (
    normalizeCategory(productCategory) === normalizedFilter ||
    normalizeCategory(businessCategory) === normalizedFilter
  );
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
      if (!categoryMatches(prod.category, biz.category, filters.selectedCategory)) {
        return false;
      }
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
    if (
      filters.selectedCategory &&
      normalizeCategory(biz.category) !== normalizeCategory(filters.selectedCategory)
    ) {
      return false;
    }
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
