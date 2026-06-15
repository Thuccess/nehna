import Breadcrumb from '@/components/layout/Breadcrumb';
import SellerView from '@/features/seller/components/SellerView';

export const metadata = {
  title: 'Seller Hub — Nehna Marketplace',
};

export default function SellerBusinessesPage() {
  return (
    <>
      <Breadcrumb segments={[{ label: 'seller' }, { label: 'businesses' }]} />
      <SellerView initialTab="businesses" />
    </>
  );
}
