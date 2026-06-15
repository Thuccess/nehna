import { Suspense } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import BusinessesView from '@/features/businesses/components/BusinessesView';

export const metadata = {
  title: 'Businesses — Nehna Kampala Directory',
};

export default function BusinessesPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav md:pb-8 flex-1">
      <Breadcrumb segments={[{ label: 'businesses' }]} />

      <Suspense fallback={<div className="text-black/60 text-sm">Loading...</div>}>
        <BusinessesView />
      </Suspense>
    </main>
  );
}
