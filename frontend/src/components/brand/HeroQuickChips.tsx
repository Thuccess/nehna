'use client';

import { useLanguage } from '@/providers/LanguageProvider';
import {
  MARKETPLACE_CATEGORIES,
  type MarketplaceCategory,
} from '@/lib/marketplaceFilters';

interface HeroQuickChipsProps {
  selectedCategory?: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}

const CHIP_ACCENTS: Record<MarketplaceCategory, string> = {
  Electronics:
    'hover:border-flag-blue-300 hover:bg-flag-blue-50 hover:text-flag-blue-700 data-[active=true]:border-flag-blue-400 data-[active=true]:bg-flag-blue-50 data-[active=true]:text-flag-blue-700',
  Schools:
    'hover:border-nehnax-navy-300 hover:bg-nehnax-navy-50 hover:text-nehnax-navy-500 data-[active=true]:border-nehnax-navy-400 data-[active=true]:bg-nehnax-navy-50 data-[active=true]:text-nehnax-navy-500',
  Travel:
    'hover:border-flag-gold-400 hover:bg-flag-gold-50 hover:text-flag-gold-800 data-[active=true]:border-flag-gold-500 data-[active=true]:bg-flag-gold-50 data-[active=true]:text-flag-gold-800',
  Rentals:
    'hover:border-flag-blue-300 hover:bg-flag-blue-50 hover:text-flag-blue-700 data-[active=true]:border-flag-blue-400 data-[active=true]:bg-flag-blue-50 data-[active=true]:text-flag-blue-700',
  Hotels:
    'hover:border-flag-red-300 hover:bg-flag-red-50 hover:text-flag-red-700 data-[active=true]:border-flag-red-400 data-[active=true]:bg-flag-red-50 data-[active=true]:text-flag-red-700',
  Fashion:
    'hover:border-flag-green-300 hover:bg-flag-green-50 hover:text-flag-green-700 data-[active=true]:border-flag-green-400 data-[active=true]:bg-flag-green-50 data-[active=true]:text-flag-green-700',
  Beauty:
    'hover:border-flag-red-300 hover:bg-flag-red-50 hover:text-flag-red-700 data-[active=true]:border-flag-red-400 data-[active=true]:bg-flag-red-50 data-[active=true]:text-flag-red-700',
  Services:
    'hover:border-flag-green-300 hover:bg-flag-green-50 hover:text-flag-green-700 data-[active=true]:border-flag-green-400 data-[active=true]:bg-flag-green-50 data-[active=true]:text-flag-green-700',
  Jobs: 'hover:border-nehnax-navy-300 hover:bg-nehnax-navy-50 hover:text-nehnax-navy-500 data-[active=true]:border-nehnax-navy-400 data-[active=true]:bg-nehnax-navy-50 data-[active=true]:text-nehnax-navy-500',
  Restaurants:
    'hover:border-flag-gold-400 hover:bg-flag-gold-50 hover:text-flag-gold-800 data-[active=true]:border-flag-gold-500 data-[active=true]:bg-flag-gold-50 data-[active=true]:text-flag-gold-800',
};

export default function HeroQuickChips({
  selectedCategory = '',
  onSelectCategory,
  className = '',
}: HeroQuickChipsProps) {
  const { language, t } = useLanguage();

  const labels: Record<MarketplaceCategory, string> = {
    Electronics: t.catElectronics,
    Schools: t.catSchools,
    Travel: t.catTravel,
    Rentals: t.catRentals,
    Hotels: t.catHotels,
    Fashion: t.catFashion,
    Beauty: t.catBeauty,
    Services: t.catServices,
    Jobs: t.catJobs,
    Restaurants: t.catRestaurants,
  };

  return (
    <div className={className}>
      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/45 mb-2">
        {language === 'en' ? 'Quick browse' : 'ብቕጽበት ድለዩ'}
      </p>
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
        {MARKETPLACE_CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              data-active={isActive}
              onClick={() => onSelectCategory(isActive ? '' : category)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-[11px] font-bold border border-black/10 bg-white/80 text-black/70 transition-all touch-manipulation min-h-[36px] ${CHIP_ACCENTS[category]}`}
            >
              {labels[category]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
