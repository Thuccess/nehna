import Breadcrumb from '@/components/layout/Breadcrumb';
import { BuyerLoginView } from '@/features/auth/components/LoginViews';

export const metadata = {
  title: 'Buyer Sign in — Nehna',
};

export default function BuyerLoginPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav md:pb-8 flex-1">
      <Breadcrumb segments={[{ label: 'login', href: '/login' }, { label: 'buyer' }]} />
      <BuyerLoginView />
    </main>
  );
}
