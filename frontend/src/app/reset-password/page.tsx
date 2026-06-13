import Breadcrumb from '@/components/layout/Breadcrumb';
import ResetPasswordView from '@/features/auth/components/ResetPasswordView';

export const metadata = {
  title: 'Reset Password — NehnaX',
};

export default function ResetPasswordPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav md:pb-8 flex-1">
      <Breadcrumb segments={[{ label: 'Reset password' }]} />
      <ResetPasswordView />
    </main>
  );
}
