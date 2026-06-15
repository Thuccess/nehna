import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Seller Hub — Nehna Marketplace',
};

export default function SellerPage() {
  redirect('/seller/businesses');
}
