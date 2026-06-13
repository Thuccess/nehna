import Breadcrumb from '@/components/layout/Breadcrumb';
import AdminView from '@/features/admin/components/AdminView';

export const metadata = {
  title: 'Admin Listings — NehnaX',
};

export default function AdminProductsPage() {
  return (
    <>
      <Breadcrumb segments={[{ label: 'admin' }, { label: 'products' }]} />
      <AdminView initialTab="listings" />
    </>
  );
}
