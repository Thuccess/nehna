import Breadcrumb from '@/components/layout/Breadcrumb';
import FavoritesView from '@/features/favorites/components/FavoritesView';

export const metadata = {
  title: 'Favorites — Nehna Marketplace',
};

export default function FavoritesPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav md:pb-8 flex-1">
      <Breadcrumb segments={[{ label: 'favorites' }]} />
      <FavoritesView />
    </main>
  );
}
