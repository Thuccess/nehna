import Breadcrumb from '@/components/layout/Breadcrumb';
import BuyerRegisterView from '@/features/auth/components/BuyerRegisterView';

export const metadata = {
  title: 'Buyer Registration — NehnaX',
};

export default function BuyerRegisterPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav md:pb-8 flex-1">
      <Breadcrumb segments={[{ label: 'register', href: '/register' }, { label: 'buyer' }]} />
      <BuyerRegisterView />
    </main>
  );
}
