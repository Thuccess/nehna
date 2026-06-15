'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useBusinesses, useProducts } from '@/lib/queries';
import BrandTagline from '@/components/brand/BrandTagline';
import HeroQuickChips from '@/components/brand/HeroQuickChips';
import { Button, ButtonLink } from '@/components/ui/Button';

const FOOD_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=900';
const COMMUNITY_IMAGE =
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600';

interface HomeHeroProps {
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  onSearchSubmit?: (query: string) => void;
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}

export default function HomeHero({
  searchQuery: externalSearchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  selectedCategory = '',
  onCategorySelect,
}: HomeHeroProps = {}) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [internalSearchQuery, setInternalSearchQuery] = useState('');

  const searchQuery = externalSearchQuery ?? internalSearchQuery;
  const setSearchQuery = onSearchQueryChange ?? setInternalSearchQuery;

  const { data: businesses = [] } = useBusinesses({ status: 'all' });
  const { data: products = [] } = useProducts();
  const verifiedSellers = businesses.filter((b) => b.status === 'approved').length;
  const neighborhoods = new Set(businesses.map((b) => b.neighborhood)).size;

  const submit = () => {
    const q = searchQuery.trim();
    if (onSearchSubmit) {
      onSearchSubmit(q);
      return;
    }
    if (q) {
      router.push(`/products?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/products');
    }
  };

  const handleCategorySelect = (category: string) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    } else if (category) {
      router.push(`/products?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div
      className="relative overflow-hidden border-b border-black/5 bg-gradient-to-b from-flag-blue-50/80 via-white to-white py-10 md:py-16 lg:py-20 text-left"
      id="homepage-hero"
    >
      {/* Layered background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(5,19,38,0.06) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-flag-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-1/4 h-96 w-96 rounded-full bg-flag-green-200/30 blur-3xl" />
      <div className="pointer-events-none absolute right-[12%] top-8 h-32 w-32 rounded-full border-2 border-flag-green-400/20" />
      <div className="pointer-events-none absolute left-[8%] bottom-12 h-48 w-48 rounded-full border border-flag-blue-400/15" />
      <div className="pointer-events-none absolute right-[20%] bottom-[18%] h-20 w-20 rounded-full border-2 border-flag-gold-400/25" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
        {/* Copy column */}
        <div className="space-y-5 lg:col-span-7 lg:space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <BrandTagline size="md" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/45">
              Kampala · 2026
            </span>
          </div>

          <h1 className="text-balance text-4xl font-serif font-black tracking-tight text-black leading-[1.05] md:text-5xl lg:text-6xl">
            {language === 'en' ? 'The trusted home for ' : 'ቤት ናይ '}
            <span className="bg-gradient-to-r from-flag-red-500 via-flag-green-500 to-flag-blue-500 bg-clip-text text-transparent">
              {language === 'en' ? 'Eritrean shops' : 'ኤርትራውያን ድኳናት'}
            </span>{' '}
            {language === 'en' ? 'in Kampala.' : 'ኣብ ካምፓላ።'}
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-black/65 md:text-base">
            {language === 'en'
              ? 'Browse verified habesha cafes, grocery hubs, fashion tailors, salons, and housing. Add to cart and message sellers on Nehna — zero commissions, zero hassle.'
              : 'ብቕዓት ዘለዎም Nehna ድኳናት ኣብ ካርት ወስኽ ኣብ Nehna ርክብ ግበር።'}
          </p>

          {/* Mobile visual strip */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FOOD_IMAGE}
              alt=""
              className="h-20 w-20 shrink-0 rounded-2xl border border-black/10 object-cover shadow-md"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col gap-2 min-w-0">
              <MiniTrustPill
                icon={BadgeCheck}
                label={language === 'en' ? 'Verified sellers' : 'ዝተረጋገጹ'}
                accent="sky"
              />
              <MiniTrustPill
                icon={MessageCircle}
                label={language === 'en' ? 'Nehna messaging' : 'መልእኽቲ Nehna'}
                accent="emerald"
              />
            </div>
          </div>

          {/* Search card */}
          <div className="space-y-3 max-w-xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="rounded-2xl border border-black/5 bg-white/90 p-2 shadow-xl shadow-flag-blue-500/10 ring-1 ring-black/5 backdrop-blur-md transition-all duration-300 focus-within:ring-2 focus-within:ring-flag-blue-500/30"
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-transparent py-3.5 pl-10 pr-4 text-base text-black placeholder-black/40 focus:outline-none md:text-sm font-sans"
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                  {t.searchBtn}
                </Button>
              </div>
            </form>

            {onCategorySelect && (
              <HeroQuickChips
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
              />
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <ButtonLink
                href="/products"
                variant="ghost"
                size="sm"
                icon={ArrowRight}
                iconPosition="right"
                className="text-black/70 font-bold"
              >
                {t.seeAllCategories}
              </ButtonLink>
              <ButtonLink
                href="/register/seller"
                variant="primary"
                size="lg"
                icon={Store}
                className="shadow-lg shadow-flag-green-500/20"
              >
                {t.addYourBusiness}
              </ButtonLink>
            </div>
          </div>

          {/* Trust stats strip */}
          <div className="grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-0 sm:rounded-2xl sm:border sm:border-black/10 sm:bg-white/70 sm:backdrop-blur sm:shadow-sm">
            <Stat
              value={verifiedSellers}
              label={language === 'en' ? 'Verified sellers' : 'ዝተረጋገጹ'}
              Icon={BadgeCheck}
              accent="sky"
            />
            <Stat
              value={products.length}
              label={language === 'en' ? 'Listings' : 'ኣቑሑት'}
              Icon={ShieldCheck}
              accent="emerald"
              divider
            />
            <Stat
              value={neighborhoods}
              label={language === 'en' ? 'Neighborhoods' : 'ዓዳጋታት'}
              Icon={MapPin}
              accent="gold"
              divider
            />
          </div>
        </div>

        {/* Desktop bento column */}
        <div className="hidden lg:col-span-5 lg:block">
          <div className="relative rounded-3xl p-1 ring-2 ring-flag-gold-400/30">
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 overflow-hidden rounded-2xl border border-black/10 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={FOOD_IMAGE}
                  alt="Eritrean cuisine"
                  className="aspect-[16/10] w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="overflow-hidden rounded-2xl border-2 border-flag-green-400/40 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={COMMUNITY_IMAGE}
                  alt="Community marketplace"
                  className="aspect-square w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-center gap-2 rounded-2xl border border-flag-blue-200 bg-flag-blue-50/80 p-4 backdrop-blur-sm">
                <FloatingBadge
                  icon={BadgeCheck}
                  title={language === 'en' ? 'Admin-verified sellers' : 'ኣመሓዳሪ ዘጽደቐ ሸቓጦ'}
                  body={
                    language === 'en'
                      ? 'Every business is reviewed before going live.'
                      : 'ኩሉ ድኳን ቅድሚ ምዕባይ ይምስራሕ።'
                  }
                  accent="sky"
                />
                <FloatingBadge
                  icon={MessageCircle}
                  title={language === 'en' ? 'Nehna messaging' : 'መልእኽቲ Nehna'}
                  body={
                    language === 'en' ? 'Zero commissions, zero middlemen.' : 'ክፍሊት የብሉን።'
                  }
                  accent="emerald"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatProps {
  value: number;
  label: string;
  Icon: typeof BadgeCheck;
  accent: 'sky' | 'emerald' | 'gold';
  divider?: boolean;
}

function Stat({ value, label, Icon, accent, divider }: StatProps) {
  const accentMap = {
    sky: 'text-sky-700 bg-sky-50 border-sky-200',
    emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    gold: 'text-flag-gold-800 bg-flag-gold-50 border-flag-gold-300',
  } as const;

  return (
    <div
      className={`flex items-center gap-2.5 rounded-2xl border border-black/10 bg-white/70 p-3 backdrop-blur sm:border-0 sm:bg-transparent sm:rounded-none sm:px-4 sm:py-3 ${
        divider ? 'sm:border-l sm:border-black/10' : ''
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${accentMap[accent]}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="leading-tight">
        <div className="font-mono text-xl font-black text-black">{value}</div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-black/55">{label}</div>
      </div>
    </div>
  );
}

interface MiniTrustPillProps {
  icon: typeof BadgeCheck;
  label: string;
  accent: 'sky' | 'emerald';
}

function MiniTrustPill({ icon: Icon, label, accent }: MiniTrustPillProps) {
  const accentMap = {
    sky: 'bg-sky-50 border-sky-200 text-sky-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  } as const;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-black shadow-sm backdrop-blur-sm">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full border ${accentMap[accent]}`}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="truncate">{label}</span>
    </div>
  );
}

interface FloatingBadgeProps {
  icon: typeof BadgeCheck;
  title: string;
  body: string;
  accent: 'sky' | 'emerald';
}

function FloatingBadge({ icon: Icon, title, body, accent }: FloatingBadgeProps) {
  const accentMap = {
    sky: 'bg-sky-50 border-sky-200 text-sky-600',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  } as const;

  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-black/5 bg-white/90 p-3 shadow-lg backdrop-blur-sm">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${accentMap[accent]}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 text-xs">
        <p className="font-extrabold leading-tight text-black">{title}</p>
        <p className="mt-0.5 text-[11px] leading-snug text-black/55">{body}</p>
      </div>
    </div>
  );
}
