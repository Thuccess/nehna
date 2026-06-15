import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductDetail from '@/features/products/components/ProductDetail';

export const metadata = {
  title: 'Product — Nehna Marketplace',
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav max-md:pb-[var(--mobile-sticky-stack)] md:pb-8 flex-1">
      <Breadcrumb segments={[{ label: 'products' }, { label: id }]} />
      <ProductDetail id={id} />
    </main>
  );
}
