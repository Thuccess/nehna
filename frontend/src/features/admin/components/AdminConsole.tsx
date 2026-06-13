'use client';

import { useEffect, useState } from 'react';
import {
  Shield,
  Check,
  X,
  Users,
  Store,
  Package,
  Info,
  Trash2,
  TrendingUp,
  Search,
  Filter,
  DollarSign,
  SlidersHorizontal,
  Bell,
  CreditCard,
  LayoutDashboard,
  IdCard,
  UserCheck,
} from 'lucide-react';
import type { AdPackage, Business, Product, User } from '@adulis/shared';
import { useLanguage } from '@/providers/LanguageProvider';
import { useToast } from '@/lib/toast';
import {
  useApproveBusiness,
  useApproveUser,
  useDeleteBusiness,
  useDeleteProduct,
  useSuspendBusiness,
  useUpdateUser,
} from '@/lib/queries';
import UserName from '@/components/users/UserName';
import StatusPill from '@/components/users/StatusPill';

type AdminTab = 'overview' | 'approvals' | 'userApprovals' | 'users' | 'listings' | 'plans';

interface AdminConsoleProps {
  users: User[];
  businesses: Business[];
  products: Product[];
  initialTab?: AdminTab;
}

export default function AdminConsole({
  users,
  businesses,
  products,
  initialTab,
}: AdminConsoleProps) {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const approve = useApproveBusiness();
  const suspend = useSuspendBusiness();
  const deleteBiz = useDeleteBusiness();
  const deleteProd = useDeleteProduct();
  const updateUser = useUpdateUser();
  const approveUser = useApproveUser();

  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab ?? 'overview');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'pending' | 'active' | 'banned'>(
    'all',
  );

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'customer' | 'seller' | 'admin'>(
    'all',
  );

  const [listingSearch, setListingSearch] = useState('');
  const [listingCategoryFilter, setListingCategoryFilter] = useState('all');

  const adPlans: AdPackage[] = [
    {
      id: 'p1',
      name: t.planBasic,
      price: 'UGX 0 (Free)',
      features: ['Standard catalog listings', 'Self managed updates', 'Nehna order messaging'],
    },
    {
      id: 'p2',
      name: t.planPremium,
      price: 'UGX 30,000 / month',
      features: ['High-visibility ribbon', 'Dedicated phone helpdesk', 'Included in recommended slide'],
    },
    {
      id: 'p3',
      name: t.planFeatured,
      price: 'UGX 70,000 / month',
      features: ['Pinned on Search Top position', 'Highlight product card', 'Highlighted map pin badge'],
    },
    {
      id: 'p4',
      name: t.planTopFeatured,
      price: 'UGX 150,000 / month',
      features: [
        'Direct homepage slider banner',
        'Gold star verification',
        'Priority support with weekly analytics',
      ],
    },
  ];

  const totalUsers = users.length;
  const pendingBiz = businesses.filter((b) => b.status === 'pending');
  const pendingUsers = users.filter((u) => u.status === 'pending');
  const totalProducts = products.length;
  const totalApprovals = pendingBiz.length + pendingUsers.length;

  const categoryStats = [
    {
      name: 'Food & Cafes',
      count: products.filter((p) => p.category === 'Food').length,
      color: 'from-flag-blue-400 to-flag-blue-600',
      dot: 'bg-sky-400',
    },
    {
      name: 'Groceries',
      count: products.filter((p) => p.category === 'Groceries').length,
      color: 'from-flag-green-400 to-flag-green-600',
      dot: 'bg-emerald-400',
    },
    {
      name: 'Housing & Rooms',
      count: products.filter((p) => p.category === 'Housing').length,
      color: 'from-flag-blue-400 to-flag-blue-700',
      dot: 'bg-sky-400',
    },
    {
      name: 'Fashion & Wear',
      count: products.filter((p) => p.category === 'Fashion').length,
      color: 'from-rose-400 to-pink-600',
      dot: 'bg-rose-400',
    },
    {
      name: 'Beauty & Salons',
      count: products.filter((p) => p.category === 'Beauty').length,
      color: 'from-purple-400 to-fuchsia-600',
      dot: 'bg-purple-400',
    },
    {
      name: 'Professional Services',
      count: products.filter((p) => p.category === 'Services').length,
      color: 'from-cyan-400 to-blue-600',
      dot: 'bg-cyan-400',
    },
  ];

  const getSimulatedMRR = () => {
    let mrr = 0;
    businesses.forEach((b) => {
      if (b.package === 'premium') mrr += 30000;
      if (b.package === 'featured') mrr += 70000;
      if (b.package === 'top_featured') mrr += 150000;
    });
    return mrr;
  };

  const filteredUsers = users.filter((usr) => {
    const matchesSearch =
      usr.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      (usr.email && usr.email.toLowerCase().includes(userSearch.toLowerCase())) ||
      usr.phone.includes(userSearch);
    const matchesRole = userRoleFilter === 'all' || usr.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'all' || usr.status === userStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredListings = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(listingSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(listingSearch.toLowerCase());
    const matchesCategory = listingCategoryFilter === 'all' || p.category === listingCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleApprove = async (id: string) => {
    try {
      await approve.mutateAsync(id);
      toast('Business approved.', 'success');
    } catch {
      toast('Approve failed.', 'error');
    }
  };

  const handleReject = async (id: string) => {
    if (
      !confirm(
        language === 'en'
          ? 'Reject this commercial business listing application entirely?'
          : 'ነዚ ድኳን ምስራዝ ርግጸኛ ዲኻ?',
      )
    )
      return;
    try {
      await deleteBiz.mutateAsync(id);
      toast('Business rejected.', 'success');
    } catch {
      toast('Reject failed.', 'error');
    }
  };

  const handleDeleteProd = async (p: Product) => {
    if (
      !confirm(
        language === 'en'
          ? `Remove listing "${p.name}"? This action cannot be undone.`
          : 'ነዚ ኣቕሓ ናይ ምስራዝ ተግባር ርግጸኛ ዲኻ?',
      )
    )
      return;
    try {
      await deleteProd.mutateAsync(p.id);
      toast('Listing removed.', 'success');
    } catch {
      toast('Delete failed.', 'error');
    }
  };

  const handleBan = async (usr: User) => {
    if (!confirm(`Toggle ban state for ${usr.name}?`)) return;
    const nextStatus = usr.status === 'banned' ? 'active' : 'banned';
    try {
      await updateUser.mutateAsync({ id: usr.id, input: { status: nextStatus } });
      toast(`Updated account state for ${usr.name}.`, 'success');
    } catch {
      toast('Could not update account.', 'error');
    }
  };

  const handleApproveUser = async (usr: User) => {
    try {
      await approveUser.mutateAsync(usr.id);
      toast(
        language === 'en'
          ? `${usr.name} approved and verified.`
          : `${usr.name} ተጸዲቑን ተረጋጊጹን።`,
        'success',
      );
    } catch {
      toast('Approve failed.', 'error');
    }
  };

  const handleRejectUser = async (usr: User) => {
    if (
      !confirm(
        language === 'en'
          ? `Reject ${usr.name}? Their account will be banned.`
          : `${usr.name} ነጺግካ? ኣካውንቱ ክእገድ እዩ።`,
      )
    )
      return;
    try {
      await updateUser.mutateAsync({ id: usr.id, input: { status: 'banned' } });
      toast(
        language === 'en' ? `${usr.name} rejected.` : `${usr.name} ተነጺጉ።`,
        'success',
      );
    } catch {
      toast('Reject failed.', 'error');
    }
  };

  return (
    <div
      className="space-y-8 text-black max-w-7xl mx-auto px-1 sm:px-2"
      id="admin-dashboard-container"
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-white via-slate-50 to-white border border-black/10 rounded-3xl p-6 md:p-8 text-black shadow-2xl">
        <div className="absolute top-0 right-0 h-48 w-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-8 left-1/4 h-56 w-56 bg-sky-500/[0.02] rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-sky-500/10 text-sky-500 border border-sky-500/25 px-3.5 py-1 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider mb-3">
              <Shield className="h-3.5 w-3.5 fill-sky-500/10 animate-pulse" />
              <span>Security Clearance: Level 3 Administrator</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-black tracking-tight leading-tight">
              {t.adminDashboardTitle}
            </h2>
            <p className="text-xs md:text-sm text-black/60 mt-1 max-w-2xl font-sans leading-relaxed">
              {language === 'en'
                ? 'Approve local Kampala commercial listings, manage user account permissions, review category statistics, and control premium ad presets.'
                : 'ኣብ ካምፓላ ዘለዉ ናይ ኤርትራውያን ፍቓዳት ሃብ፡ ተጠቀምቲ ኣማሓድር፡ ናይ ምድብ ስታቲስቲክስ ብዝርዝር ተመልከት።'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/5 border border-black/10 p-3.5 rounded-2xl shrink-0 self-start lg:self-center">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <div className="text-left font-mono">
              <span className="text-[9px] uppercase tracking-wider text-black/50 block">
                System State
              </span>
              <span className="text-[11px] font-bold text-black uppercase">
                {language === 'en' ? 'Live & Guarded' : 'ንጡፍን ሑዙእን'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {!initialTab && (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-4">
        <div className="flex flex-wrap gap-2 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
          {(
            [
              { id: 'overview', label: language === 'en' ? 'Overview' : 'ርእይቶ', Icon: LayoutDashboard },
              {
                id: 'userApprovals',
                label: language === 'en' ? 'Users' : 'ተጠቀምቲ',
                Icon: IdCard,
                badge: pendingUsers.length,
              },
              {
                id: 'approvals',
                label: language === 'en' ? 'Businesses' : 'ትካላት',
                Icon: Bell,
                badge: pendingBiz.length,
              },
              { id: 'users', label: language === 'en' ? 'Accounts' : 'ኣካውንታት', Icon: Users },
              { id: 'listings', label: language === 'en' ? 'Listings' : 'ኣቑሑት', Icon: Package },
              { id: 'plans', label: language === 'en' ? 'Plans' : 'ክፍሊት', Icon: CreditCard },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer relative min-h-9 ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                  : 'text-black/70 hover:text-black bg-black/5 border border-black/5 hover:border-black/10'
              }`}
            >
              <tab.Icon className="app-icon app-icon-sm" strokeWidth={2.25} />
              <span className="truncate">{tab.label}</span>
              {'badge' in tab && tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`inline-flex items-center justify-center text-[10px] h-5 min-w-5 px-1 rounded-full font-black ${
                    activeTab === tab.id ? 'bg-white text-sky-700' : 'bg-sky-600 text-white'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="text-[11px] font-mono text-black/50">
          {language === 'en' ? 'Pending approvals: ' : 'ዝጽበዩ ምጽዳቕ: '}
          <span className="text-sky-700 uppercase font-black">{totalApprovals}</span>
        </div>
      </div>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-8" id="admin-tab-overview">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            <div className="bg-white border border-black/10 p-5 rounded-3xl relative overflow-hidden flex items-center justify-between group hover:border-sky-300 transition-all duration-300 shadow-sm">
              <div>
                <span className="text-xs font-bold text-black/50 uppercase tracking-wider block font-mono">
                  {t.totalUsers}
                </span>
                <span className="text-3xl font-serif font-black text-black mt-2 block">
                  {totalUsers}
                </span>
                <span className="text-[11px] text-emerald-600 mt-1 block font-sans">
                  {users.filter((u) => u.status === 'active').length} verified
                </span>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shadow-inner transition duration-300">
                <Users className="h-5 w-5" />
              </div>
            </div>

            <button
              onClick={() => setActiveTab('userApprovals')}
              className="text-left bg-white border border-amber-200 p-5 rounded-3xl relative overflow-hidden flex items-center justify-between group hover:border-amber-300 transition-all duration-300 shadow-sm cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block font-mono">
                  {language === 'en' ? 'Pending Users' : 'ዝጽበዩ ተጠቀምቲ'}
                </span>
                <span className="text-3xl font-serif font-black text-black mt-2 block">
                  {pendingUsers.length}
                </span>
                <span className="text-[11px] text-amber-700 mt-1 block font-sans font-semibold">
                  {language === 'en' ? 'Click to review the queue' : 'ንምግምጋም ጠውቕ'}
                </span>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-inner transition duration-300">
                <UserCheck className="h-5 w-5" />
              </div>
            </button>

            <div className="bg-white border border-black/10 p-5 rounded-3xl relative overflow-hidden flex items-center justify-between group hover:border-sky-300 transition-all duration-300 shadow-sm">
              <div>
                <span className="text-xs font-bold text-black/50 uppercase tracking-wider block font-mono">
                  {t.totalBusinesses}
                </span>
                <span className="text-3xl font-serif font-black text-black mt-2 block">
                  {businesses.length}
                </span>
                <span className="text-[11px] text-sky-600 mt-1 block font-sans font-semibold">
                  {pendingBiz.length} {language === 'en' ? 'pending approval' : 'ምጽዳቕ ይጽበ'}
                </span>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shadow-inner transition duration-300">
                <Store className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white border border-black/10 p-5 rounded-3xl relative overflow-hidden flex items-center justify-between group hover:border-sky-300 transition-all duration-300 shadow-sm">
              <div>
                <span className="text-xs font-bold text-black/50 uppercase tracking-wider block font-mono">
                  {t.totalListings}
                </span>
                <span className="text-3xl font-serif font-black text-black mt-2 block">
                  {totalProducts}
                </span>
                <span className="text-[11px] text-black/50 mt-1 block font-sans">
                  {products.filter((p) => !p.isAvailable).length} {language === 'en' ? 'out of stock' : 'ኣይብሉን'}
                </span>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shadow-inner transition duration-300">
                <Package className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white border border-black/10 p-5 rounded-3xl relative overflow-hidden flex items-center justify-between group hover:border-emerald-300 transition-all duration-300 shadow-sm">
              <div>
                <span className="text-xs font-bold text-black/50 uppercase tracking-wider block font-mono">
                  {language === 'en' ? 'Est. Ad Revenue' : 'ግምታዊ ኣታዊ'}
                </span>
                <span className="text-lg xl:text-xl font-mono font-black text-emerald-700 mt-2 block">
                  UGX {getSimulatedMRR().toLocaleString()}
                </span>
                <span className="text-[10px] text-black/55 block font-mono uppercase mt-1">
                  {businesses.filter((b) => b.package !== 'basic').length} paying plans
                </span>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-inner transition duration-300">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white border border-black/10 p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/[0.015] to-transparent pointer-events-none"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-black/10 pb-4">
                <div>
                  <h3 className="text-lg font-serif font-black text-black uppercase tracking-tight flex items-center gap-2">
                    <span>📊 {t.popularCategories}</span>
                  </h3>
                  <p className="text-xs text-black/60 mt-1 font-sans">
                    Sector weight index mapped across active listed items.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-medium text-black/50 bg-black/5 px-2.5 py-1 rounded-md border border-black/5 self-start sm:self-center">
                  Total Items: {totalProducts}
                </span>
              </div>

              <div className="space-y-5 font-sans">
                {categoryStats.map((cat, idx) => {
                  const percentage = totalProducts > 0 ? (cat.count / totalProducts) * 100 : 0;
                  return (
                    <div key={idx} className="space-y-2 text-xs">
                      <div className="flex justify-between items-center text-black/85">
                        <span className="font-bold flex items-center gap-2">
                          <span className={`h-1.5 w-1.5 rounded-full ${cat.dot}`}></span>
                          {cat.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black font-mono">{cat.count} listings</span>
                          <span className="text-black/50 font-mono text-[10px]">
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-black/5 h-2.5 rounded-full overflow-hidden border border-black/5 shadow-inner">
                        <div
                          className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${Math.max(percentage, 3)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-black/10 p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/[0.005] to-transparent pointer-events-none"></div>

                <h3 className="text-sm font-bold font-serif text-black uppercase tracking-widest mb-6 border-b border-black/10 pb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-sky-500" />
                  <span>📢 Kampala Launch Checklist</span>
                </h3>

                <div className="space-y-5 text-xs text-black/75 leading-relaxed font-sans">
                  <div className="flex gap-3 items-start">
                    <div className="p-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-black text-black block">
                        Pre-launch direct business acquisition
                      </span>
                      <span className="text-black/60 text-[11px] block mt-1">
                        Goal: Register 50 verified brick & mortar Eritrean operators in Kabalagala
                        and Kansanga areas.
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="p-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-black text-black block">
                        Bi-lingual Ge&apos;ez Tigrinya localization
                      </span>
                      <span className="text-black/60 text-[11px] block mt-1">
                        Goal: Localize search indexes, category sidebar badges, and translation
                        parameters perfectly.
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="p-1 bg-sky-500/10 text-sky-500 border border-sky-500/20 rounded-xl shrink-0">
                      <SlidersHorizontal className="h-4 w-4 animate-pulse" />
                    </div>
                    <div>
                      <span className="font-black text-black block">
                        Monetized ad plans verification
                      </span>
                      <span className="text-black/60 text-[11px] block mt-1">
                        Goal: Link priority star tags to Gold/Premium tier packages automatically
                        on the frontpage feed.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-sky-500/5 text-sky-400 border border-sky-500/20 p-5 rounded-3xl space-y-2 text-xs">
                <span className="font-black flex items-center gap-2 font-mono uppercase tracking-wider">
                  <Info className="h-4 w-4 shrink-0" />
                  <span>Admin Verification Guide</span>
                </span>
                <p className="leading-relaxed text-black/75">
                  Review pending businesses and user applications in the <strong>Approvals</strong> tab.
                  Approving a business publishes it to the marketplace directory.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'userApprovals' && (
        <div
          className="bg-white border border-black/10 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6"
          id="admin-tab-user-approvals"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-4">
            <div>
              <h3 className="text-lg font-serif font-black text-black uppercase tracking-tight flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-amber-600" />
                <span>{language === 'en' ? 'New Account Approvals' : 'ሓደሽቲ ኣካውንታት ምጽዳቕ'}</span>
              </h3>
              <p className="text-xs text-black/60 mt-1 font-sans">
                {language === 'en'
                  ? 'Approve newly registered users so they can message sellers, save favorites, or list businesses. Approved users get a verified badge next to their last name everywhere on NehnaX.'
                  : 'ሓደሽቲ ዝተመዝገቡ ተጠቀምቲ ኣጽድቕ — ምስ ዝጸድቑ ምልክት ምርግጋጽ ይወሃቦም።'}
              </p>
            </div>

            <span className="bg-amber-50 border border-amber-200 text-amber-700 text-xs font-mono font-black px-3 py-1 rounded-xl self-start sm:self-center">
              {pendingUsers.length}{' '}
              {language === 'en'
                ? `pending account${pendingUsers.length === 1 ? '' : 's'}`
                : 'ኣካውንታት ይጽበዩ'}
            </span>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="text-center py-16 max-w-sm mx-auto">
              <div className="h-14 w-14 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-emerald-600" />
              </div>
              <h4 className="text-sm font-black text-black uppercase tracking-wider">
                {language === 'en' ? 'Everyone is verified' : 'ኩሉ ተረጋጊጹ'}
              </h4>
              <p className="text-black/60 text-xs mt-2 leading-relaxed">
                {language === 'en'
                  ? 'No new accounts are waiting on you right now. New signups will appear here automatically.'
                  : 'ሕጂ ዝጽበይ ኣካውንት የለን።'}
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {pendingUsers.map((usr) => {
                const linkedBusiness =
                  usr.role === 'seller'
                    ? businesses.find((b) => b.ownerId === usr.id)
                    : undefined;
                const roleLabel =
                  usr.role === 'customer'
                    ? language === 'en'
                      ? 'Buyer'
                      : 'ዓሚል'
                    : usr.role === 'seller'
                      ? language === 'en'
                        ? 'Seller'
                        : 'ሸያጢ'
                      : usr.role;

                return (
                <li
                  key={usr.id}
                  className="bg-white border border-black/10 hover:border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition shadow-sm"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        usr.avatarUrl ||
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
                      }
                      alt={usr.name}
                      className="h-12 w-12 rounded-2xl object-cover border border-black/10 bg-white shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold text-black truncate">{usr.name}</p>
                      {usr.email && (
                        <p className="text-[11px] text-black/55 font-mono truncate">{usr.email}</p>
                      )}
                      {usr.phone && (
                        <p className="text-[11px] text-black/55 font-mono truncate">{usr.phone}</p>
                      )}
                      {linkedBusiness && (
                        <p className="text-[11px] text-sky-700 font-bold mt-0.5 truncate">
                          {language === 'en' ? 'Business: ' : 'ድኳን: '}
                          {linkedBusiness.name}
                          {linkedBusiness.status === 'pending'
                            ? language === 'en'
                              ? ' (pending)'
                              : ' (ይጽበ)'
                            : ''}
                        </p>
                      )}
                      <div className="mt-1.5 flex items-center gap-2">
                        <span
                          className={`text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-md border ${
                            usr.role === 'seller'
                              ? 'bg-sky-50 text-sky-700 border-sky-200'
                              : 'bg-black/5 text-black/55 border-black/10'
                          }`}
                        >
                          {roleLabel}
                        </span>
                        <StatusPill status={usr.status} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <button
                      onClick={() => handleApproveUser(usr)}
                      disabled={approveUser.isPending}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold cursor-pointer transition disabled:opacity-60"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>{language === 'en' ? 'Approve' : 'ኣጽድቕ'}</span>
                    </button>
                    <button
                      onClick={() => handleRejectUser(usr)}
                      disabled={updateUser.isPending}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-black/10 hover:border-rose-300 hover:bg-rose-50 text-black/70 hover:text-rose-700 rounded-xl text-xs font-bold cursor-pointer transition"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>{language === 'en' ? 'Reject' : 'ንጸግ'}</span>
                    </button>
                  </div>
                </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {activeTab === 'approvals' && (
        <div
          className="bg-white border border-black/10 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6"
          id="admin-tab-approvals"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-4">
            <div>
              <h3 className="text-lg font-serif font-black text-black uppercase tracking-tight flex items-center gap-2">
                <span>🔔 {t.pendingApprovals}</span>
              </h3>
              <p className="text-xs text-black/60 mt-1 font-sans">
                Review submitted operator credentials. Approving lists them on standard directory
                instantly.
              </p>
            </div>

            <span className="bg-sky-500/15 border border-sky-500/25 text-sky-500 text-xs font-mono font-black px-3 py-1 rounded-xl self-start sm:self-center">
              {pendingBiz.length} review application{pendingBiz.length === 1 ? '' : 's'}
            </span>
          </div>

          {pendingBiz.length === 0 ? (
            <div className="text-center py-16 max-w-sm mx-auto" id="approvals-empty-queue">
              <div className="h-14 w-14 bg-black/5 border border-black/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-sky-500 animate-pulse" />
              </div>
              <h4 className="text-sm font-black text-black uppercase tracking-wider">Clear queue!</h4>
              <p className="text-black/60 text-xs mt-2 leading-relaxed">
                All registered Eritrean commercial operations in Kampala are certified, verified,
                and running on our live directory.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingBiz.map((biz) => (
                <div
                  key={biz.id}
                  id={`pending-approval-card-${biz.id}`}
                  className="bg-white border border-black/10 hover:border-sky-300 rounded-3xl p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition duration-300 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        biz.logo ||
                        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150'
                      }
                      alt={biz.name}
                      className="h-16 w-16 rounded-2xl object-cover border border-black/10 bg-white shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="text-xs space-y-1.5 min-w-0 flex-1 font-sans">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-sky-500/10 text-sky-500 border border-sky-500/20 text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-lg tracking-wider">
                          {biz.category}
                        </span>
                        <span className="bg-black/5 border border-black/10 text-black/55 text-[9px] font-mono px-2 py-0.5 rounded-lg">
                          Plan: <span className="text-black font-bold uppercase">{biz.package}</span>
                        </span>
                      </div>

                      <h4 className="text-black font-serif font-black text-base tracking-tight">
                        {biz.name}
                      </h4>

                      <p className="text-black/75 text-xs leading-relaxed max-w-xl font-normal">
                        {biz.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 pt-3 border-t border-black/5 text-[11px] font-mono">
                        <div className="flex items-center gap-1.5 text-black/60">
                          <span className="text-black font-black">👨‍💼 Owner:</span>
                          <span className="text-black/85">{biz.ownerName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-black/60">
                          <span className="text-black font-black">📍 Area:</span>
                          <span className="text-black/85">
                            {biz.neighborhood} ({biz.address})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#10b981] mt-0.5">
                          <span>📞 Tel:</span>
                          <a
                            href={`tel:${biz.phone}`}
                            className="underline font-bold hover:text-emerald-300"
                          >
                            {biz.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-400 mt-0.5">
                          <span>Contact:</span>
                          <span className="font-bold">{biz.whatsAppNumber || biz.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col items-center gap-2 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-0 border-black/5 shrink-0 justify-end">
                    <button
                      onClick={() => handleApprove(biz.id)}
                      disabled={approve.isPending}
                      className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg shadow-emerald-500/15 transition-transform active:scale-95 disabled:opacity-60"
                    >
                      <Check className="h-4 w-4" />
                      <span>{t.approveBtn}</span>
                    </button>

                    <button
                      onClick={() => suspend.mutate(biz.id)}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white hover:bg-sky-50 border border-black/10 hover:border-sky-300 text-black/70 hover:text-sky-700 rounded-2xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      <span>Suspend</span>
                    </button>

                    <button
                      onClick={() => handleReject(biz.id)}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white hover:bg-rose-50 border border-black/10 hover:border-rose-300 text-black/70 hover:text-rose-700 rounded-2xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div
          className="bg-white border border-black/10 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6"
          id="admin-tab-users"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-4">
            <div>
              <h3 className="text-lg font-serif font-black text-black uppercase tracking-tight">
                👥 {t.userAccountManagement}
              </h3>
              <p className="text-xs text-black/60 mt-1 font-sans">
                Review verified directory operators, customers, and moderators. Type to filter
                instantly.
              </p>
            </div>

            <span className="bg-black/5 border border-black/10 text-black/70 text-xs font-mono font-bold px-3 py-1 rounded-xl self-start sm:self-center">
              Total Recorded: {users.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3">
            <div className="relative md:col-span-6">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-black/40" />
              <input
                type="text"
                placeholder="Search user by name, email, or telephone number..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white text-black border border-black/10 rounded-2xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all text-xs"
              />
              {userSearch && (
                <button
                  onClick={() => setUserSearch('')}
                  className="absolute right-3.5 top-3.5 text-xs text-sky-700 font-bold hover:text-black"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="md:col-span-3 flex items-center gap-2 bg-white border border-black/10 p-2 rounded-2xl">
              <Filter className="h-3.5 w-3.5 text-black/40 shrink-0 ml-1.5" />
              <select
                value={userRoleFilter}
                onChange={(e) =>
                  setUserRoleFilter(e.target.value as 'all' | 'customer' | 'seller' | 'admin')
                }
                className="w-full bg-transparent text-black focus:outline-none text-[11px] font-mono cursor-pointer uppercase font-black"
              >
                <option value="all">Role: All</option>
                <option value="customer">Role: Customer</option>
                <option value="seller">Role: Seller</option>
                <option value="admin">Role: Admin</option>
              </select>
            </div>

            <div className="md:col-span-3 flex items-center gap-2 bg-white border border-black/10 p-2 rounded-2xl">
              <Filter className="h-3.5 w-3.5 text-black/40 shrink-0 ml-1.5" />
              <select
                value={userStatusFilter}
                onChange={(e) =>
                  setUserStatusFilter(
                    e.target.value as 'all' | 'pending' | 'active' | 'banned',
                  )
                }
                className="w-full bg-transparent text-black focus:outline-none text-[11px] font-mono cursor-pointer uppercase font-black"
              >
                <option value="all">Status: All</option>
                <option value="pending">Status: Pending</option>
                <option value="active">Status: Verified</option>
                <option value="banned">Status: Banned</option>
              </select>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 bg-black/[0.02] rounded-3xl border border-black/5 max-w-sm mx-auto">
              <p className="text-black/50 text-xs">No users match &ldquo;{userSearch}&rdquo;.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs text-left text-black/85 font-sans border-collapse">
                  <thead>
                    <tr className="bg-black/[0.02] text-black/55 text-[10px] font-mono uppercase tracking-wider border-b border-black/10">
                      <th className="p-4 rounded-tl-2xl">User Profile</th>
                      <th className="p-4">Contact Telephone</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right rounded-tr-2xl">Moderation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {filteredUsers.map((usr) => (
                      <tr key={usr.id} className="hover:bg-sky-50/30 transition-colors group">
                        <td className="p-4 flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              usr.avatarUrl ||
                              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
                            }
                            alt={usr.name}
                            className="h-10 w-10 rounded-full object-cover border border-black/10 bg-white group-hover:border-sky-300 transition-colors"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <span className="font-extrabold text-black block text-sm leading-snug">
                              <UserName user={usr} />
                            </span>
                            <span className="text-[10px] text-black/50 font-mono block mt-0.5 truncate max-w-[220px]">
                              {usr.email || 'No email linked (Direct Tel)'}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 font-mono font-medium text-black/75">{usr.phone}</td>

                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-lg font-mono text-[9px] uppercase font-bold border ${
                              usr.role === 'admin'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : usr.role === 'seller'
                                  ? 'bg-sky-50 text-sky-700 border-sky-200'
                                  : 'bg-black/5 text-black/65 border-black/10'
                            }`}
                          >
                            {usr.role}
                          </span>
                        </td>

                        <td className="p-4">
                          <StatusPill status={usr.status} />
                        </td>

                        <td className="p-4 text-right">
                          {usr.role === 'admin' ? (
                            <span className="text-black/40 font-mono italic text-[10px] pr-2">
                              System Admin
                            </span>
                          ) : (
                            <div className="inline-flex items-center gap-2">
                              {usr.status === 'pending' && (
                                <button
                                  onClick={() => handleApproveUser(usr)}
                                  disabled={approveUser.isPending}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl cursor-pointer transition disabled:opacity-60"
                                >
                                  <Check className="h-3 w-3" />
                                  Approve
                                </button>
                              )}
                              <button
                                onClick={() => handleBan(usr)}
                                className="px-3 py-1.5 text-[10px] font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl cursor-pointer transition-all"
                              >
                                {usr.status === 'banned' ? t.unbanUser : t.banUser}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {filteredUsers.map((usr) => (
                  <div
                    key={usr.id}
                    className="bg-white border border-black/10 rounded-3xl p-5 space-y-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          usr.avatarUrl ||
                          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
                        }
                        alt={usr.name}
                        className="h-12 w-12 rounded-full object-cover border border-black/10"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-black text-sm">
                          <UserName user={usr} />
                        </h4>
                        <span className="text-[10px] text-black/50 block leading-tight truncate max-w-[180px]">
                          {usr.email || 'No email linked'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-black/5 grid grid-cols-2 gap-y-2 text-xs font-mono">
                      <div>
                        <span className="text-black/50 block text-[9px] uppercase">Telephone:</span>
                        <span className="text-black/85 font-bold">{usr.phone}</span>
                      </div>
                      <div>
                        <span className="text-black/50 block text-[9px] uppercase">Role:</span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold border ${
                            usr.role === 'admin'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : usr.role === 'seller'
                                ? 'bg-sky-50 text-sky-700 border-sky-200'
                                : 'bg-black/5 text-black/65 border-black/10'
                          }`}
                        >
                          {usr.role.toUpperCase()}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-black/50 block text-[9px] uppercase mb-1">Status:</span>
                        <StatusPill status={usr.status} />
                      </div>
                    </div>

                    {usr.role !== 'admin' && (
                      <div className="flex flex-col gap-2">
                        {usr.status === 'pending' && (
                          <button
                            onClick={() => handleApproveUser(usr)}
                            disabled={approveUser.isPending}
                            className="w-full text-center py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-2xl cursor-pointer transition disabled:opacity-60 inline-flex items-center justify-center gap-1.5"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleBan(usr)}
                          className="w-full text-center py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl cursor-pointer transition"
                        >
                          {usr.status === 'banned' ? t.unbanUser : t.banUser}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'listings' && (
        <div
          className="bg-white border border-black/10 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6"
          id="admin-tab-listings"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-4">
            <div>
              <h3 className="text-lg font-serif font-black text-black uppercase tracking-tight flex items-center gap-2">
                <span>
                  📦{' '}
                  {language === 'en' ? 'Commercial Catalog Moderation' : 'ምስትኽኻል ስራሕቲ ኣቑሑት'}
                </span>
              </h3>
              <p className="text-xs text-black/60 mt-1 font-sans">
                Review and revoke individual active product or service items showing on visitors
                directory.
              </p>
            </div>

            <span className="bg-sky-500/10 border border-sky-500/25 text-sky-500 text-xs font-mono font-black px-3.5 py-1.5 rounded-2xl self-start sm:self-center">
              {filteredListings.length} product{filteredListings.length === 1 ? '' : 's'} visible
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            <div className="relative lg:col-span-8">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-black/40" />
              <input
                type="text"
                placeholder="Search listing by title, ingredients, description keywords..."
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white text-black border border-black/10 rounded-2xl focus:border-sky-500/50 focus:outline-none focus:bg-white transition-all text-xs"
              />
            </div>

            <div className="lg:col-span-4 flex items-center gap-2 bg-white border border-black/10 p-2 rounded-2xl">
              <Filter className="h-3.5 w-3.5 text-black/40 shrink-0 ml-1.5" />
              <select
                value={listingCategoryFilter}
                onChange={(e) => setListingCategoryFilter(e.target.value)}
                className="w-full bg-transparent text-black focus:outline-none text-[11px] font-mono cursor-pointer uppercase font-black"
              >
                <option value="all">Category: All Sectors</option>
                <option value="Food">Food & Cafes</option>
                <option value="Groceries">Groceries</option>
                <option value="Housing">Housing & Rooms</option>
                <option value="Jobs">Jobs & Gigs</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion & Wear</option>
                <option value="Beauty">Beauty & Salons</option>
                <option value="Services">Professional Services</option>
              </select>
            </div>
          </div>

          {filteredListings.length === 0 ? (
            <div className="text-center py-12 max-w-sm mx-auto">
              <div className="h-12 w-12 rounded-full bg-black/5 border border-black/10 flex items-center justify-center text-black/20 mx-auto mb-3">
                <Package className="h-5 w-5" />
              </div>
              <p className="text-black/50 text-xs">
                No matching listings found matching: &ldquo;{listingSearch}&rdquo;
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredListings.map((p) => {
                const biz = businesses.find((b) => b.id === p.businessId);
                return (
                  <div
                    key={p.id}
                    className="p-4 sm:p-5 border border-black/10 rounded-3xl bg-white hover:border-sky-300 transition-all duration-300 flex flex-col justify-between gap-4 group shadow-sm"
                  >
                    <div className="flex items-start gap-4 text-xs font-sans">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-16 w-16 rounded-2xl object-cover shrink-0 border border-black/10 bg-white group-hover:border-sky-500/40 transition-colors"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="bg-sky-500/10 text-sky-500 border border-sky-500/20 font-mono text-[9px] px-2 py-0.5 rounded uppercase font-extrabold tracking-wider">
                            {p.category}
                          </span>
                          {!p.isAvailable && (
                            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[9px] px-1.5 py-0.5 rounded font-bold">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        <h4 className="font-extrabold text-black text-sm leading-snug truncate pr-2 group-hover:text-sky-500 transition-colors">
                          {p.name}
                        </h4>

                        {biz && (
                          <span className="text-[11px] text-black/60 block font-normal">
                            Store: <strong className="text-black/75">{biz.name}</strong> (
                            {biz.neighborhood})
                          </span>
                        )}

                        <span className="font-mono font-black text-sky-500 text-sm block pt-1">
                          UGX {p.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-black/5 text-[9px] font-mono text-black/50">
                      <span>Created: {p.createdAt || 'Legacy item'}</span>

                      <button
                        onClick={() => handleDeleteProd(p)}
                        className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>{t.removeViolation}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'plans' && (
        <div
          className="bg-white border border-black/10 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6"
          id="admin-tab-plans"
        >
          <div className="border-b border-black/10 pb-4">
            <h3 className="text-lg font-serif font-black text-black uppercase tracking-tight">
              💰 Subscription Rate Presets & Revenue Configuration
            </h3>
            <p className="text-xs text-black/60 mt-1 font-sans leading-relaxed">
              Define pricing configurations and highlight parameters for registered stores in
              Kampala. Paid plans automatically feature items on search tops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adPlans.map((plan, index) => {
              const planIcons = ['🌱', '✨', '🔥', '👑'];
              return (
                <div
                  key={plan.id}
                  className={`p-5 border rounded-3xl bg-white/60 relative flex flex-col justify-between text-xs space-y-4 font-sans shadow-xl transition duration-300 hover:border-sky-500/35 hover:-translate-y-1 ${
                    index === 3 ? 'border-sky-500/30 shadow-sky-500/[0.02]' : 'border-black/10'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl">{planIcons[index]}</span>
                      <span className="bg-sky-500/10 text-sky-500 border border-sky-500/20 text-[9px] font-mono font-black uppercase px-2.5 py-1 rounded-lg">
                        Tier {index + 1} Preset
                      </span>
                    </div>

                    <h4 className="text-base font-serif font-black text-black mt-4">{plan.name}</h4>
                    <div className="font-mono font-black text-sky-500 text-sm">{plan.price}</div>

                    <ul className="space-y-2.5 pt-3 border-t border-black/5">
                      {plan.features.map((feat: string, fIdx: number) => (
                        <li
                          key={fIdx}
                          className="text-[11px] text-black/70 leading-relaxed flex items-start gap-1.5"
                        >
                          <span className="text-sky-500 shrink-0">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toast(
                        'Stripe / Mobile Money payment webhooks are out of scope for this build.',
                        'info',
                      )
                    }
                    className="w-full text-center py-2.5 bg-flag-red-600 hover:bg-flag-red-500 text-white font-extrabold rounded-2xl text-[10px] uppercase tracking-wider cursor-pointer shadow-lg shadow-flag-red-500/15 transition duration-250 mt-4 h-10"
                  >
                    Modify Preset Rates
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
