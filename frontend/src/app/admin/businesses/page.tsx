import AdminView from '@/features/admin/components/AdminView';

export const metadata = {
  title: 'Admin Approvals — Nehna',
};

export default function AdminBusinessesPage() {
  return <AdminView initialTab="approvals" />;
}
