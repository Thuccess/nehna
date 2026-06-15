import Breadcrumb from '@/components/layout/Breadcrumb';
import SellerRegisterView from '@/features/auth/components/SellerRegisterView';

export const metadata = {
  title: 'Seller Registration — Nehna',
};

export default function SellerRegisterPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav md:pb-8 flex-1">
      <Breadcrumb segments={[{ label: 'register', href: '/register' }, { label: 'seller' }]} />
      <SellerRegisterView />
    </main>
  );
}
