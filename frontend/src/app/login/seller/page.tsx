import Breadcrumb from '@/components/layout/Breadcrumb';
import { SellerLoginView } from '@/features/auth/components/LoginViews';

export const metadata = {
  title: 'Seller Sign in — Nehna',
};

export default function SellerLoginPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav md:pb-8 flex-1">
      <Breadcrumb segments={[{ label: 'login', href: '/login' }, { label: 'seller' }]} />
      <SellerLoginView />
    </main>
  );
}
