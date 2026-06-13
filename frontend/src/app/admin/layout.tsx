'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import AdminLoginView from '@/features/admin/components/AdminLoginView';

const tabs = [
  { href: '/admin', label: 'Overview', exact: true },
  { href: '/admin/businesses', label: 'Approvals' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/products', label: 'Listings' },
  { href: '/admin/transactions', label: 'Transactions' },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { language } = useLanguage();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 pb-mobile-nav md:pb-8 flex-1">
        <div className="text-center text-black/60 text-sm">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 pb-mobile-nav md:pb-8 flex-1">
        <AdminLoginView />
      </main>
    );
  }

  if (user.role !== 'admin') {
    return (
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 pb-mobile-nav md:pb-8 flex-1">
        <div className="bg-slate-50 p-12 text-center rounded-2xl border border-black/10 max-w-md mx-auto">
          <Shield className="h-10 w-10 text-black/20 mx-auto mb-3" />
          <h3 className="text-base font-black text-black">
            {language === 'en' ? 'Access denied' : 'ኣብ ርእሲ ኣይተፈቐደን'}
          </h3>
          <p className="text-black/55 text-xs mt-1">
            {language === 'en'
              ? 'This area is for platform administrators only.'
              : 'እዚ ንምሕደራ ጥራይ እዩ።'}
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-4 py-2 bg-black/5 hover:bg-black/10 text-black font-bold rounded-xl text-xs"
          >
            {language === 'en' ? 'Back to home' : 'ናብ መእተዊ'}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav md:pb-8 flex-1">
      <nav className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-2 mb-6 border-b border-black/10 pb-4 -mx-1 px-1">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`snap-start shrink-0 px-4 py-2.5 rounded-2xl font-mono text-xs font-bold uppercase transition-all min-h-11 touch-manipulation ${
              isActive(tab.href, 'exact' in tab ? tab.exact : false)
                ? 'bg-sky-500 text-black shadow-lg shadow-sky-500/10'
                : 'text-black/70 hover:text-black bg-black/5 border border-black/5 hover:border-black/10'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      {children}
    </main>
  );
}
