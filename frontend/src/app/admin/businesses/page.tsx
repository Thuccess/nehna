import Breadcrumb from '@/components/layout/Breadcrumb';
import AdminView from '@/features/admin/components/AdminView';

export const metadata = {
  title: 'Admin Approvals — NehnaX',
};

export default function AdminBusinessesPage() {
  return (
    <>
      <Breadcrumb segments={[{ label: 'admin' }, { label: 'businesses' }]} />
      <AdminView initialTab="approvals" />
    </>
  );
}
