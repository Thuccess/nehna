'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  Heart,
  Home,
  Languages,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Package,
  PlusCircle,
  Shield,
  ShoppingBag,
  Store,
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import { useFavorites } from '@/lib/queries';
import { useMobileMore } from '@/providers/MobileMoreProvider';
import UserName from '@/components/users/UserName';
import NehnaXLogo from '@/components/layout/NehnaXLogo';
import { isPending } from '@/lib/userStatus';
import { Button, ButtonLink } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface NavLinkConfig {
  href: string;
  label: string;
  Icon: typeof Home;
}

export default function Navbar() {
  const { language, t, toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { data: favorites = [] } = useFavorites();
  const { itemCount, openCart } = useCart();
  const { open: openMore } = useMobileMore();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const navItems: NavLinkConfig[] = [
    { href: '/', label: t.navHome, Icon: Home },
    { href: '/businesses', label: t.navBusinesses, Icon: Store },
    { href: '/products', label: t.navProducts, Icon: Package },
    { href: '/favorites', label: t.navFavorites, Icon: Heart },
  ];

  if (user?.role === 'seller') {
    navItems.push({ href: '/seller', label: t.navSeller, Icon: Briefcase });
  }

  return (
    <header
      className="bg-white border-b border-black/10 sticky top-0 z-40 shadow-sm pt-[var(--safe-top)]"
      id="main-navigation-bar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
        <NehnaXLogo linkToHome priority />

        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer relative',
                isActive(item.href)
                  ? 'bg-sky-500/10 text-sky-600 border border-sky-500/25 font-bold'
                  : 'text-black/70 hover:text-black hover:bg-black/5 border border-transparent',
              )}
            >
              <item.Icon className="app-icon app-icon-sm" strokeWidth={2.25} />
              <span className="truncate max-w-[7rem]">{item.label}</span>
              {item.href === '/favorites' && favorites.length > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-flag-red-600 text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-mono font-extrabold">
                  {favorites.length}
                </span>
              )}
            </Link>
          ))}

          {user?.role === 'admin' && (
            <ButtonLink href="/admin" variant="sky" size="sm" icon={Shield}>
              {t.navAdmin}
            </ButtonLink>
          )}
        </nav>

        <div className="flex items-center gap-1.5 md:gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="hidden md:inline-flex border border-black/10 bg-black/[0.03] font-mono text-xs"
            title="Toggle English / Tigrinya"
          >
            <Languages className="app-icon app-icon-md text-sky-600" strokeWidth={2.25} />
            <span className="font-bold text-[10px] hidden lg:inline">
              {language === 'en' ? 'TI' : 'EN'}
            </span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={openCart}
            className="relative"
            aria-label={t.navCart}
          >
            <ShoppingBag className="app-icon app-icon-lg text-black/70" strokeWidth={2.25} />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 bg-flag-red-600 text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-mono font-extrabold">
                {itemCount}
              </span>
            )}
          </Button>

          <div className="flex md:hidden items-center gap-0.5">
            {!user && (
              <ButtonLink href="/login" variant="ghost" size="icon" aria-label={t.loginBtn}>
                <LogIn className="app-icon app-icon-lg text-sky-600" strokeWidth={2.25} />
              </ButtonLink>
            )}
            <Button type="button" variant="ghost" size="icon" onClick={openMore} aria-label="More">
              <Menu className="app-icon app-icon-lg text-black/70" strokeWidth={2.25} />
            </Button>
          </div>

          {user ? (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/dashboard"
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition min-h-9',
                  isPending(user)
                    ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100',
                )}
                title={t.navDashboard}
              >
                <LayoutDashboard className="app-icon app-icon-sm" strokeWidth={2.25} />
                <UserName user={user} className="truncate max-w-[120px]" showFirstName />
              </Link>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => logout()}
                icon={LogOut}
                aria-label={t.logoutBtn}
              />
            </div>
          ) : (
            <ButtonLink
              href="/register"
              variant="primary"
              size="sm"
              icon={PlusCircle}
              className="hidden lg:inline-flex"
            >
              {t.registerBtn}
            </ButtonLink>
          )}
        </div>
      </div>
    </header>
  );
}
