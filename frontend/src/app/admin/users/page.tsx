import AdminView from '@/features/admin/components/AdminView';

export const metadata = {
  title: 'Admin Console — NehnaX',
};

export default function AdminUsersPage() {
  return <AdminView initialTab="users" />;
}
