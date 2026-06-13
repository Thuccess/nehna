import Breadcrumb from '@/components/layout/Breadcrumb';
import BusinessDetail from '@/features/businesses/components/BusinessDetail';

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav max-md:pb-[var(--mobile-sticky-stack)] md:pb-8 flex-1">
      <Breadcrumb
        segments={[
          { label: 'businesses', href: '/businesses' },
          { label: id.slice(0, 12) + '...' },
        ]}
      />
      <BusinessDetail id={id} />
    </main>
  );
}
