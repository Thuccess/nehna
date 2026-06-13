'use client';

import AdminConsole from './AdminConsole';
import { useBusinesses, useProducts, useUsers } from '@/lib/queries';

export default function AdminView({
  initialTab,
}: {
  initialTab?: 'overview' | 'approvals' | 'userApprovals' | 'users' | 'listings' | 'plans';
}) {
  const { data: businesses = [], isLoading: bLoading } = useBusinesses({ status: 'all' });
  const { data: products = [], isLoading: pLoading } = useProducts();
  const { data: users = [], isLoading: uLoading } = useUsers();

  if (bLoading || pLoading || uLoading) {
    return <div className="text-center text-black/60 text-sm py-16">Loading admin console...</div>;
  }

  return (
    <AdminConsole
      users={users}
      businesses={businesses}
      products={products}
      initialTab={initialTab}
    />
  );
}
