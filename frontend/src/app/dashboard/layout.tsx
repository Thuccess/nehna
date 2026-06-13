'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  Heart,
  Inbox,
  UserCog,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';

interface DashboardTab {
  href: string;
  label: string;
  Icon: typeof LayoutDashboard;
  exact?: boolean;
}

const tabs: DashboardTab[] = [
  { href: '/dashboard', label: 'Overview', Icon: LayoutDashboard, exact: true },
  { href: '/dashboard/favorites', label: 'Favorites', Icon: Heart },
  { href: '/dashboard/orders', label: 'Orders', Icon: Inbox },
  { href: '/dashboard/profile', label: 'Profile', Icon: UserCog },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login/buyer?next=/dashboard');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="animate-pulse text-black/50 text-sm">Loading dashboard...</div>
      </main>
    );
  }

  if (!user) return null;

  const isActive = (tab: DashboardTab) =>
    tab.exact ? pathname === tab.href : (pathname?.startsWith(tab.href) ?? false);

  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav md:pb-8 flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3 space-y-2 lg:sticky lg:top-24 self-start">
          <div className="hidden lg:block">
            <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/50 px-2 mb-2">
              My Account
            </h2>
            <nav className="flex flex-col gap-1 bg-white border border-black/10 rounded-2xl p-2 shadow-sm">
              {tabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition ${
                    isActive(tab)
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'text-black/70 hover:text-black hover:bg-black/5 border border-transparent'
                  }`}
                >
                  <tab.Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </Link>
              ))}
            </nav>

            {user.role === 'seller' && (
              <Link
                href="/seller"
                className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-white border border-black/10 hover:border-sky-300 hover:bg-sky-50/40 text-black/80 hover:text-sky-700 transition"
              >
                <Briefcase className="h-4 w-4" />
                <span>{t.navSeller}</span>
              </Link>
            )}
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-white border border-black/10 hover:border-sky-300 hover:bg-sky-50/40 text-black/80 hover:text-sky-700 transition"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>{t.navAdmin}</span>
              </Link>
            )}
          </div>

          <nav className="lg:hidden -mx-1 flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-2 mb-4 pb-1">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`snap-start shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 min-h-11 touch-manipulation ${
                  isActive(tab)
                    ? 'bg-sky-600 text-white'
                    : 'text-black/70 bg-black/5 border border-black/10'
                }`}
              >
                <tab.Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <section className="lg:col-span-9">{children}</section>
      </div>
    </main>
  );
}
