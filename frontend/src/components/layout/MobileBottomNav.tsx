'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Home, Menu, ShoppingBag, Store } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useFavorites } from '@/lib/queries';
import { useMobileMore } from '@/providers/MobileMoreProvider';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { language, t } = useLanguage();
  const { data: favorites = [] } = useFavorites();
  const { open, isOpen } = useMobileMore();

  const items: Array<{
    href: string;
    label: string;
    Icon: typeof Home;
    badge?: number;
  }> = [
    { href: '/', label: t.navHome, Icon: Home },
    { href: '/businesses', label: t.navBusinesses, Icon: Store },
    { href: '/products', label: language === 'en' ? 'Shop' : 'ዕዳጋ', Icon: ShoppingBag },
    {
      href: '/favorites',
      label: language === 'en' ? 'Favs' : 'ዝተፈተዉ',
      Icon: Heart,
      badge: favorites.length,
    },
  ];

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href));

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-black/10 pt-2 px-2 md:hidden flex items-center justify-around shadow-2xl"
      style={{ paddingBottom: 'calc(0.5rem + var(--safe-bottom))' }}
    >
      {items.map(({ href, label, Icon, badge }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 px-2 rounded-2xl transition cursor-pointer relative touch-manipulation ${
            isActive(href)
              ? 'text-sky-600 font-bold bg-sky-500/10'
              : 'text-black/60 hover:text-black'
          }`}
        >
          <Icon className="app-icon app-icon-lg" strokeWidth={2.25} />
          <span className="text-[10px] font-sans mt-0.5 leading-tight">{label}</span>
          {badge !== undefined && badge > 0 && (
            <span className="absolute top-0.5 right-1 bg-flag-red-600 text-white text-[8px] h-3.5 w-3.5 rounded-full flex items-center justify-center font-mono font-bold">
              {badge}
            </span>
          )}
        </Link>
      ))}

      <button
        type="button"
        onClick={open}
        className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 px-2 rounded-2xl transition cursor-pointer touch-manipulation ${
          isOpen ? 'text-sky-600 font-bold bg-sky-500/10' : 'text-black/60 hover:text-black'
        }`}
        aria-label={language === 'en' ? 'More options' : 'ተወሳኺ ኣማራጺታት'}
        aria-expanded={isOpen}
      >
        <Menu className="app-icon app-icon-lg" strokeWidth={2.25} />
        <span className="text-[10px] font-sans mt-0.5 leading-tight">
          {language === 'en' ? 'More' : 'ተወሳኺ'}
        </span>
      </button>
    </div>
  );
}
