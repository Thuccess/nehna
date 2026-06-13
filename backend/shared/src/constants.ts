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
  'Food',
  'Groceries',
  'Housing',
  'Jobs',
  'Electronics',
  'Fashion',
  'Beauty',
  'Services',
] as const;

export type Neighborhood = (typeof NEIGHBORHOODS)[number];
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_TRANSLATION_KEYS = {
  Food: 'catFood',
  Groceries: 'catGroceries',
  Housing: 'catHousing',
  Jobs: 'catJobs',
  Electronics: 'catElectronics',
  Fashion: 'catFashion',
  Beauty: 'catBeauty',
  Services: 'catServices',
} as const satisfies Record<Category, string>;

export type CategoryTranslationKey =
  (typeof CATEGORY_TRANSLATION_KEYS)[keyof typeof CATEGORY_TRANSLATION_KEYS];
