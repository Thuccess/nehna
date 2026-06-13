import Breadcrumb from '@/components/layout/Breadcrumb';
import SellerOrdersPanel from '@/features/seller/components/SellerOrdersPanel';

export const metadata = {
  title: 'Seller Orders — NehnaX Marketplace',
};

export default function SellerOrdersPage() {
  return (
    <>
      <Breadcrumb segments={[{ label: 'seller' }, { label: 'orders' }]} />
      <SellerOrdersPanel />
    </>
  );
}
