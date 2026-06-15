import AdminView from '@/features/admin/components/AdminView';

export const metadata = {
  title: 'Admin Console — Nehna',
};

export default function AdminPage() {
  return <AdminView initialTab="overview" />;
}
