export const NEIGHBORHOODS = [
  'Kansanga',
  'Bunga',
  'Kabalagala',
  'Buziga',
  'Konge',
  'Soya',
  'Other',
] as const;

/** Default images when seller skips logo/cover during onboarding. */
export const DEFAULT_BUSINESS_LOGO =
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop';

export const DEFAULT_BUSINESS_COVER =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop';

export const CATEGORIES = [
  'Electronics',
  'Schools',
  'Travel',
  'Rentals',
  'Hotels',
  'Fashion',
  'Beauty',
  'Services',
  'Jobs',
  'Restaurants',
] as const;

/** Maps legacy category keys to current taxonomy. */
export const LEGACY_CATEGORY_MAP: Record<string, Category> = {
  Food: 'Restaurants',
  Groceries: 'Restaurants',
  Housing: 'Rentals',
};

export function normalizeCategory(value: string): string {
  return LEGACY_CATEGORY_MAP[value] ?? value;
}

export type Neighborhood = (typeof NEIGHBORHOODS)[number];
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_TRANSLATION_KEYS = {
  Electronics: 'catElectronics',
  Schools: 'catSchools',
  Travel: 'catTravel',
  Rentals: 'catRentals',
  Hotels: 'catHotels',
  Fashion: 'catFashion',
  Beauty: 'catBeauty',
  Services: 'catServices',
  Jobs: 'catJobs',
  Restaurants: 'catRestaurants',
} as const satisfies Record<Category, string>;

export type CategoryTranslationKey =
  (typeof CATEGORY_TRANSLATION_KEYS)[keyof typeof CATEGORY_TRANSLATION_KEYS];
