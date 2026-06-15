'use client';

import { useState } from 'react';
import { Search, MapPin, Layers, X } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import {
  MARKETPLACE_CATEGORIES,
  MARKETPLACE_NEIGHBORHOODS,
  scrollToMarketplaceResults,
} from '@/lib/marketplaceFilters';

interface SidebarFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  onFilterChange?: () => void;
}

export default function SidebarFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  onFilterChange,
}: SidebarFiltersProps) {
  const { language, t } = useLanguage();

  const categoryLabels: Record<string, string> = {
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

  const categories = [
    { value: '', label: t.categorySelector },
    ...MARKETPLACE_CATEGORIES.map((value) => ({
      value,
      label: categoryLabels[value] ?? value,
    })),
  ];

  const locations = [
    { value: '', label: t.allNeighborhoods },
    ...MARKETPLACE_NEIGHBORHOODS.map((value) => ({ value, label: value })),
  ];

  const notifyFilterChange = () => {
    onFilterChange?.();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedLocation('');
    notifyFilterChange();
  };

  const hasActiveFilters =
    searchQuery !== '' || selectedCategory !== '' || selectedLocation !== '';
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const activeCategoryLabel =
    categories.find((c) => c.value === selectedCategory)?.label ?? t.categorySelector;
  const activeLocationLabel =
    locations.find((l) => l.value === selectedLocation)?.label ?? t.allNeighborhoods;

  return (
    <>
      <div
        className="lg:hidden sticky z-30 flex items-center gap-2 overflow-x-auto scrollbar-none py-2 mb-3 -mx-1 px-1 bg-white/95 backdrop-blur-sm border-b border-black/5"
        style={{ top: 'var(--mobile-header-offset)' }}
      >
        <button
          type="button"
          onClick={() => setIsMobileExpanded(true)}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border touch-manipulation min-h-[36px] ${
            isMobileExpanded || hasActiveFilters
              ? 'bg-sky-500/10 text-sky-600 border-sky-500/25'
              : 'bg-black/5 text-black/70 border-black/10'
          }`}
        >
          <Search className="h-3.5 w-3.5" />
          {language === 'en' ? 'Filters' : 'መጻረዪታት'}
        </button>
        {selectedCategory && (
          <span className="shrink-0 px-3 py-2 rounded-full text-xs font-mono font-bold bg-sky-600 text-white">
            {activeCategoryLabel}
          </span>
        )}
        {selectedLocation && (
          <span className="shrink-0 px-3 py-2 rounded-full text-xs font-mono font-bold bg-black/5 text-black/80 border border-black/10">
            {activeLocationLabel}
          </span>
        )}
        {searchQuery && (
          <span className="shrink-0 px-3 py-2 rounded-full text-xs font-mono text-black/70 bg-black/5 border border-black/10 truncate max-w-[120px]">
            &quot;{searchQuery}&quot;
          </span>
        )}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="shrink-0 px-3 py-2 rounded-full text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 touch-manipulation"
          >
            {language === 'en' ? 'Clear' : 'ንጹር'}
          </button>
        )}
      </div>

    <div
      className="bg-white text-black rounded-2xl border border-black/10 shadow-2xl overflow-hidden"
      id="sidebar-filters-panel"
    >
      <button
        onClick={() => setIsMobileExpanded(!isMobileExpanded)}
        className="w-full lg:hidden flex items-center justify-between p-4 bg-slate-50/80 font-mono text-xs font-bold text-sky-500 hover:text-sky-400 border-b border-black/5 transition-all text-left"
        type="button"
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span>
            {language === 'en'
              ? isMobileExpanded
                ? 'Hide Search Filters'
                : 'Show Search Filters'
              : isMobileExpanded
                ? 'መጻረዪታት ሓብእ'
                : 'መጻረዪታት ኣርኢ'}
          </span>
          {hasActiveFilters && (
            <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
          )}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wide bg-sky-500/10 border border-sky-500/25 px-2 py-0.5 rounded-md">
          {isMobileExpanded ? '▲' : '▼'}
        </span>
      </button>

      <div className={`p-5 space-y-6 ${isMobileExpanded ? 'block' : 'hidden lg:block'}`}>
        <div>
          <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-2 font-mono">
            {language === 'en' ? 'Quick Keyword Search' : 'ብቕጽበት ብመፍትሕ ቃል ድለዩ'}
          </label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              notifyFilterChange();
              scrollToMarketplaceResults();
            }}
          >
            <div className="relative">
              <input
                type="search"
                id="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50/80 border border-black/10 focus:border-sky-500/50 focus:bg-white focus:outline-none rounded-xl text-base md:text-sm text-black transition-all placeholder-black/30"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-black/40" />
            </div>
          </form>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-black/50 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              <span>{t.categorySelector}</span>
            </label>
          </div>

          <div className="hidden lg:flex flex-col gap-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  id={`filter-cat-${cat.value || 'all'}`}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    notifyFilterChange();
                    scrollToMarketplaceResults();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-600/10 text-sky-500 border-l-4 border-sky-600 font-semibold'
                      : 'text-black/70 hover:bg-black/5 hover:text-black'
                  }`}
                >
                  <span>{cat.label}</span>
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-sky-500"></span>}
                </button>
              );
            })}
          </div>

          <select
            id="category-select-mobile"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              notifyFilterChange();
              scrollToMarketplaceResults();
            }}
            className="lg:hidden w-full px-3 py-2.5 bg-white border border-black/10 text-black rounded-xl text-base md:text-xs font-medium focus:outline-none focus:border-sky-500"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value} className="text-black bg-white">
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>{t.locationSelector}</span>
          </label>

          <div className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-1">
            {locations.map((loc) => {
              const isSelected = selectedLocation === loc.value;
              return (
                <button
                  key={loc.value}
                  id={`filter-loc-${loc.value || 'all'}`}
                  onClick={() => {
                    setSelectedLocation(loc.value);
                    notifyFilterChange();
                    scrollToMarketplaceResults();
                  }}
                  className={`px-3 py-1.5 lg:px-3 lg:py-2 rounded-xl text-left text-xs font-medium cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-600 text-white font-semibold'
                      : 'bg-black/5 hover:bg-black/5 text-black/75 lg:bg-transparent lg:hover:bg-black/5 lg:text-black/70'
                  }`}
                >
                  {loc.label}
                </button>
              );
            })}
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-black/5 border border-black/10 text-black/85 hover:bg-black/5 transition-all text-xs font-semibold rounded-xl cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'Reset All Filters' : 'ምጽራይ ኣስተኻኽል'}</span>
          </button>
        )}

        <div className="pt-4 border-t border-black/10 text-[11px] text-black/50 font-sans leading-relaxed space-y-1.5">
          <p className="font-semibold text-black/85">{t.bilingualNotice}</p>
          <p>{t.contactSellersDirect}</p>
        </div>
      </div>
    </div>
    </>
  );
}
