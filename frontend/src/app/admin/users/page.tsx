import Breadcrumb from '@/components/layout/Breadcrumb';
import AdminView from '@/features/admin/components/AdminView';

export const metadata = {
  title: 'Admin Console — NehnaX',
};

export default function AdminUsersPage() {
  return (
    <>
      <Breadcrumb segments={[{ label: 'admin' }, { label: 'users' }]} />
      <AdminView initialTab="users" />
    </>
  );
}
