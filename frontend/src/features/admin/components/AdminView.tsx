'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import AdminConsole from './AdminConsole';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useBusinesses, useProducts, useUsers } from '@/lib/queries';

export default function AdminView({
  initialTab,
}: {
  initialTab?: 'overview' | 'approvals' | 'userApprovals' | 'users' | 'listings' | 'plans';
}) {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const { data: businesses = [], isLoading: bLoading } = useBusinesses(
    { status: 'all' },
    { enabled: user?.role === 'admin' },
  );
  const { data: products = [], isLoading: pLoading } = useProducts();
  const { data: users = [], isLoading: uLoading } = useUsers();

  if (!user) {
    return (
      <div className="bg-slate-50 p-12 text-center rounded-2xl border border-black/10 max-w-md mx-auto">
        <Shield className="h-10 w-10 text-black/20 mx-auto mb-3" />
        <h3 className="text-base font-black text-black">
          {language === 'en' ? 'Admin Access Only' : 'ምሕደራዊ ኣገልግሎት ጥራይ'}
        </h3>
        <p className="text-black/55 text-xs mt-1">
          {language === 'en' ? 'Sign in with an admin account.' : 'ኣካውንት ምሕደራ የእትዉ።'}
        </p>
        <Link
          href="/login/buyer?next=/admin"
          className="inline-block mt-4 px-4 py-2 bg-flag-red-600 hover:bg-flag-red-500 text-white font-extrabold rounded-xl text-xs"
        >
          {t.loginBtn}
        </Link>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="bg-slate-50 p-12 text-center rounded-2xl border border-black/10 max-w-md mx-auto">
        <Shield className="h-10 w-10 text-black/20 mx-auto mb-3" />
        <h3 className="text-base font-black text-black">Restricted</h3>
        <p className="text-black/55 text-xs mt-1">
          Your account does not have administrator privileges.
        </p>
      </div>
    );
  }

  if (bLoading || pLoading || uLoading) {
    return <div className="text-center text-black/60 text-sm py-16">Loading admin console...</div>;
  }

  return <AdminConsole users={users} businesses={businesses} products={products} initialTab={initialTab} />;
}
