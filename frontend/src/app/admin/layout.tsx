'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/admin', label: 'Overview', exact: true },
  { href: '/admin/businesses', label: 'Approvals' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/products', label: 'Listings' },
  { href: '/admin/transactions', label: 'Transactions' },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

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
