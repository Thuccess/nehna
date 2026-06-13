import Breadcrumb from '@/components/layout/Breadcrumb';
import LoginChoiceView from '@/features/auth/components/LoginChoiceView';

export const metadata = {
  title: 'Sign in — NehnaX',
};

export default function LoginPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav md:pb-8 flex-1">
      <Breadcrumb segments={[{ label: 'login' }]} />
      <LoginChoiceView />
    </main>
  );
}
