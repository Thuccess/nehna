'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building, Inbox, Package } from 'lucide-react';

const tabs = [
  { href: '/seller/businesses', label: 'Profile', Icon: Building },
  { href: '/seller/products', label: 'Products', Icon: Package },
  { href: '/seller/orders', label: 'Orders', Icon: Inbox },
] as const;

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || (pathname?.startsWith(`${href}/`) ?? false);

  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav md:pb-8 flex-1">
      <nav className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-2 mb-6 border-b border-black/10 pb-4 -mx-1 px-1">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`snap-start shrink-0 px-4 py-2.5 rounded-2xl font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 min-h-11 touch-manipulation ${
              isActive(tab.href)
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                : 'text-black/70 hover:text-black bg-black/5 border border-black/5 hover:border-black/10'
            }`}
          >
            <tab.Icon className="app-icon app-icon-sm" strokeWidth={2.25} />
            <span>{tab.label}</span>
          </Link>
        ))}
      </nav>
      {children}
    </main>
  );
}
