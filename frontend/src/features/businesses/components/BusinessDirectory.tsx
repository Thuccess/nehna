'use client';

import { Store } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useBusinesses, useProducts } from '@/lib/queries';
import { filterMarketplaceBusinesses } from '@/lib/marketplaceFilters';
import BusinessCard from './BusinessCard';

interface BusinessDirectoryProps {
  searchQuery: string;
  selectedCategory: string;
  selectedLocation: string;
}

export default function BusinessDirectory({
  searchQuery,
  selectedCategory,
  selectedLocation,
}: BusinessDirectoryProps) {
  const { language, t } = useLanguage();

  const { data: businesses = [], isLoading } = useBusinesses({ status: 'approved' });
  const { data: products = [] } = useProducts();

  const filteredBizs = filterMarketplaceBusinesses(businesses, {
    searchQuery,
    selectedCategory,
    selectedLocation,
  });

  return (
    <div className="space-y-8" id="viewspace-directories">
      <div className="relative overflow-hidden bg-gradient-to-r from-white via-slate-50 to-white border border-black/10 p-6 rounded-3xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/[0.015] to-transparent pointer-events-none"></div>
        <div>
          <h2 className="text-xl md:text-2xl font-serif font-black text-black uppercase tracking-tight flex items-center gap-2">
            <span>
              {language === 'en'
                ? 'Eritrean Businesses Kampala Directory'
                : 'ማህደረ ሓበሬታ ትካላት'}
            </span>
          </h2>
          <p className="text-xs text-black/60 mt-1 max-w-xl">
            {language === 'en'
              ? 'Certified traditional habesha operators, food outlets, specialized services, and wholesale hubs in Kampala.'
              : 'ኣብ ካምፓላ ዝርከቡ ኩሎም ፍሉጣት ናይ መግቢ ቦታታትን ካልኦት ኣገልግሎት ዝህቡ ትካላትን ብቐሊሉ ድለዩ።'}
          </p>
        </div>
        {filteredBizs.length > 0 && (
          <span className="text-xs font-mono text-sky-500 bg-sky-500/10 border border-sky-500/20 px-3.5 py-1.5 rounded-2xl font-bold self-start sm:self-center shrink-0">
            ⚡ {filteredBizs.length}{' '}
            {language === 'en' ? 'shops on record' : 'ዝተረኽቡ ትካላት'}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="text-center text-black/60 text-sm py-10">Loading directory...</div>
      ) : filteredBizs.length === 0 ? (
        <div
          className="bg-white/95 rounded-3xl border border-black/10 p-16 text-center max-w-md mx-auto shadow-2xl"
          id="no-directory-results"
        >
          <div className="h-14 w-14 bg-black/5 border border-black/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="h-6 w-6 text-black/40" />
          </div>
          <h4 className="text-sm font-bold text-black uppercase tracking-wide">
            {language === 'en' ? 'No Matching Shops' : 'ምስለይን ዝተረኽበ ትካል የለን'}
          </h4>
          <p className="text-black/60 text-xs mt-2 leading-relaxed">{t.noMatches}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredBizs.map((biz) => {
            const productCount = products.filter((p) => p.businessId === biz.id).length;
            return (
              <BusinessCard
                key={biz.id}
                biz={biz}
                productCount={productCount}
                language={language}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
