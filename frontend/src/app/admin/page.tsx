import Breadcrumb from '@/components/layout/Breadcrumb';
import AdminView from '@/features/admin/components/AdminView';

export const metadata = {
  title: 'Admin Console — NehnaX',
};

export default function AdminPage() {
  return (
    <>
      <Breadcrumb segments={[{ label: 'admin' }]} />
      <AdminView initialTab="overview" />
    </>
  );
}
