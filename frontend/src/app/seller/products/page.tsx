import Breadcrumb from '@/components/layout/Breadcrumb';
import SellerView from '@/features/seller/components/SellerView';

export const metadata = {
  title: 'Seller Products — NehnaX Marketplace',
};

export default function SellerProductsPage() {
  return (
    <>
      <Breadcrumb segments={[{ label: 'seller' }, { label: 'products' }]} />
      <SellerView initialTab="products" />
    </>
  );
}
