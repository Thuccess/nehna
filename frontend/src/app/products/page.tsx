import { Suspense } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductsView from '@/features/products/components/ProductsView';

export const metadata = {
  title: 'Products — Nehna Marketplace',
};

export default function ProductsPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav md:pb-8 flex-1">
      <Breadcrumb segments={[{ label: 'products' }]} />
      <Suspense fallback={<div className="text-black/60 text-sm">Loading...</div>}>
        <ProductsView />
      </Suspense>
    </main>
  );
}
