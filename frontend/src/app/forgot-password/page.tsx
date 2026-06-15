import Breadcrumb from '@/components/layout/Breadcrumb';
import ForgotPasswordView from '@/features/auth/components/ForgotPasswordView';

export const metadata = {
  title: 'Forgot Password — Nehna',
};

export default function ForgotPasswordPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav md:pb-8 flex-1">
      <Breadcrumb segments={[{ label: 'Forgot password' }]} />
      <ForgotPasswordView />
    </main>
  );
}
