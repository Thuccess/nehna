import Breadcrumb from '@/components/layout/Breadcrumb';
import SellerOnboardingView from '@/features/auth/components/SellerOnboardingView';

export const metadata = {
  title: 'Register Business — Nehna',
};

export default function BusinessOnboardingPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav md:pb-8 flex-1">
      <Breadcrumb segments={[{ label: 'Register business' }]} />
      <SellerOnboardingView />
    </main>
  );
}
