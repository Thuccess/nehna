import AdminView from '@/features/admin/components/AdminView';

export const metadata = {
  title: 'Admin Console — Nehna',
};

export default function AdminUsersPage() {
  return <AdminView initialTab="users" />;
}
