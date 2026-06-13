import AdminView from '@/features/admin/components/AdminView';

export const metadata = {
  title: 'Admin Console — NehnaX',
};

export default function AdminPage() {
  return <AdminView initialTab="overview" />;
}
