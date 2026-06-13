'use client';

import Link from 'next/link';
import { MapPin, Phone, ShoppingBag, Award, ExternalLink, Star, Sparkles } from 'lucide-react';
import type { Business } from '@adulis/shared';
import { useLanguage } from '@/providers/LanguageProvider';

interface FeaturedSectionProps {
  businesses: Business[];
  onExploreBusiness: (biz: Business) => void;
}

export default function FeaturedSection({ businesses, onExploreBusiness }: FeaturedSectionProps) {
  const { language, t } = useLanguage();

  const premiumBizs = businesses.filter(
    (b) =>
      b.status === 'approved' &&
      (b.package === 'top_featured' || b.package === 'featured' || b.package === 'premium'),
  );

  if (premiumBizs.length === 0) return null;

  return (
    <section className="my-12" id="featured-businesses-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 border-b border-black/5 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-flag-gold-500/15 text-flag-gold-800 border border-flag-gold-400/40 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase mb-1">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>{language === 'en' ? 'Sponsor Showcases' : 'ፍሉያት ድኳናት'}</span>
          </div>
          <h2 className="text-xl md:text-3xl font-serif font-black text-black tracking-tight flex items-center gap-2">
            <Award className="h-7 w-7 text-flag-gold-600 fill-flag-gold-500/20" />
            <span>{t.featuredBusinesses}</span>
          </h2>
        </div>
        <span className="text-xs font-mono text-black/50 bg-black/5 border border-black/10 px-3 py-1.5 rounded-xl self-start sm:self-center">
          ⚡ {premiumBizs.length} {language === 'en' ? 'Kampala Gold Partners' : 'ንጡፋት መሻርኽቲ'}
        </span>
      </div>

      <div className="max-md:flex max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:scrollbar-none max-md:gap-4 max-md:pb-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {premiumBizs.map((biz) => {
          const isTop = biz.package === 'top_featured';

          return (
            <div
              key={biz.id}
              id={`featured-card-${biz.id}`}
              className={`max-md:snap-start max-md:shrink-0 max-md:w-[85vw] max-md:max-w-sm bg-white/60 rounded-3xl overflow-hidden shadow-2xl hover:shadow-sky-500/10 transition-all duration-300 border relative flex flex-col group ${
                isTop
                  ? 'border-sky-500/45 bg-gradient-to-b from-sky-500/[0.04] to-transparent ring-1 ring-sky-500/20 shadow-sky-500/[0.02]'
                  : 'border-black/15 hover:border-sky-500/35 bg-black/5'
              }`}
            >
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                <span className="bg-white/90 backdrop-blur-md text-black text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-lg border border-black/10 font-mono shadow-md">
                  📍 {biz.neighborhood}
                </span>

                {isTop && (
                  <span className="bg-flag-gold-500 text-black text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg border border-flag-gold-400">
                    <Star className="h-3 w-3 fill-current" />
                    <span>GOLD BRAND</span>
                  </span>
                )}
              </div>

              <div className="h-48 w-full relative overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    biz.coverImage ||
                    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600'
                  }
                  alt={biz.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-transparent"></div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3 z-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      biz.logo ||
                      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=150'
                    }
                    alt={`${biz.name} logo`}
                    className="h-14 w-14 rounded-2xl object-cover border-2 border-sky-500/30 bg-slate-50 shadow-xl shrink-0 group-hover:border-sky-500 transition duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="mb-1 overflow-hidden">
                    <span className="inline-block text-[9px] font-black text-sky-500 uppercase tracking-widest font-mono bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20 mb-1">
                      {biz.category}
                    </span>
                    <h3 className="text-base font-serif font-black text-black leading-snug drop-shadow-md truncate">
                      {biz.name}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-black/75 text-xs leading-relaxed font-sans min-h-[48px] line-clamp-3">
                    {biz.description}
                  </p>

                  <div className="space-y-2 mt-auto text-xs text-black/60 font-sans border-t border-black/5 pt-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-black/40 shrink-0 mt-0.5" />
                      <span className="line-clamp-1 text-black/70">{biz.address}</span>
                    </div>
                    {biz.features && biz.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {biz.features.slice(0, 3).map((feat: string, index: number) => (
                          <span
                            key={index}
                            className="bg-black/5 border border-black/10 text-black/95 text-[10px] px-2.5 py-0.5 rounded-lg font-medium shadow-sm"
                          >
                            ✨ {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2 pt-4 border-t border-black/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={`tel:${biz.phone}`}
                      title={t.callSeller}
                      className="p-2 border border-black/15 hover:border-black/20 hover:bg-black/5 text-black/90 rounded-2xl transition-all duration-300 cursor-pointer"
                    >
                      <Phone className="h-4 w-4" />
                    </a>

                    <Link
                      href={`/businesses/${biz.id}`}
                      title={language === 'en' ? 'Shop on Nehna' : 'ኣብ Nehna ዕዳግ'}
                      className="p-2 bg-flag-blue-50 hover:bg-flag-blue-100 border border-flag-blue-200 text-flag-blue-700 rounded-2xl transition-all duration-300 cursor-pointer"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </Link>
                  </div>

                  <button
                    onClick={() => onExploreBusiness(biz)}
                    className="flex items-center gap-1 text-xs font-bold text-sky-500 hover:text-sky-400 group/btn bg-sky-500/5 hover:bg-sky-500/10 border border-sky-500/20 px-3.5 py-1.5 rounded-2xl cursor-pointer transition-all duration-300"
                  >
                    <span>{language === 'en' ? 'Explore Store' : 'ድኳን ርአ'}</span>
                    <ExternalLink className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
