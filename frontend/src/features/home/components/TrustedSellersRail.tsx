'use client';

import Link from 'next/link';
import { ArrowRight, BadgeCheck, MapPin } from 'lucide-react';
import type { Business } from '@adulis/shared';
import { useLanguage } from '@/providers/LanguageProvider';

interface TrustedSellersRailProps {
  businesses: Business[];
}

export default function TrustedSellersRail({ businesses }: TrustedSellersRailProps) {
  const { language } = useLanguage();
  const verified = businesses.filter((b) => b.status === 'approved').slice(0, 6);

  if (verified.length === 0) return null;

  return (
    <section className="py-10 md:py-12 bg-gradient-to-b from-white to-flag-blue-50/30 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-flag-gold-500/15 text-flag-gold-800 border border-flag-gold-400/35 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest">
              <BadgeCheck className="h-3 w-3" />
              {language === 'en' ? 'Verified sellers' : 'ዝተረጋገጹ ሸቓጦ'}
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-black tracking-tight mt-3">
              {language === 'en' ? 'Trusted by the community' : 'ብማሕበረሰብ ዝተኣምነ'}
            </h2>
          </div>
          <Link
            href="/businesses"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-600"
          >
            {language === 'en' ? 'See all sellers' : 'ኩሉ ርአ'}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="max-md:flex max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:scrollbar-none max-md:gap-3 max-md:pb-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {verified.map((biz) => (
            <Link
              key={biz.id}
              href={`/businesses/${biz.id}`}
              className="group bg-white border border-black/10 rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md hover:border-sky-300 transition flex flex-col items-center text-center gap-2 max-md:snap-start max-md:shrink-0 max-md:w-[42vw] max-md:min-w-[140px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={biz.logo}
                alt={biz.name}
                className="h-14 w-14 rounded-2xl object-cover border border-black/10 bg-white"
                referrerPolicy="no-referrer"
              />
              <p className="text-[11px] sm:text-xs font-extrabold text-black leading-tight line-clamp-2 group-hover:text-sky-700 transition-colors">
                {biz.name}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-black/55 font-mono">
                <MapPin className="h-2.5 w-2.5" />
                <span className="truncate max-w-[90px]">{biz.neighborhood}</span>
              </div>
              <span className="inline-flex items-center gap-1 bg-sky-50 border border-sky-200 text-sky-700 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase">
                <BadgeCheck className="h-2.5 w-2.5" />
                {language === 'en' ? 'Verified' : 'ተረጋጊጹ'}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <Link
            href="/businesses"
            className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-600"
          >
            {language === 'en' ? 'See all sellers' : 'ኩሉ ርአ'}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
