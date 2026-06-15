import Breadcrumb from '@/components/layout/Breadcrumb';
import RegisterChoiceView from '@/features/auth/components/RegisterChoiceView';

export const metadata = {
  title: 'Create Account — Nehna',
};

export default function RegisterPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav md:pb-8 flex-1">
      <Breadcrumb segments={[{ label: 'register' }]} />
      <RegisterChoiceView />
    </main>
  );
}
