import AdminView from '@/features/admin/components/AdminView';

export const metadata = {
  title: 'Admin Listings — Nehna',
};

export default function AdminProductsPage() {
  return <AdminView initialTab="listings" />;
}
