'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowUpRight,
  MessageSquare,
  Clock,
  MapPin,
  Award,
  Sparkles,
  Building,
  Briefcase,
  Package,
  Star,
  TrendingUp,
} from 'lucide-react';
import type { Business, BusinessPackage, Inquiry, Product, User } from '@adulis/shared';
import { CATEGORIES, CATEGORY_TRANSLATION_KEYS } from '@adulis/shared/constants';
import { api } from '@/lib/api';
import { useLanguage } from '@/providers/LanguageProvider';
import { useToast } from '@/lib/toast';
import {
  useCreateProduct,
  useDeleteProduct,
  useUpdateBusiness,
  useUpdateProduct,
} from '@/lib/queries';
import ImageUploadField from '@/components/forms/ImageUploadField';
import UserName from '@/components/users/UserName';
import StatusPill from '@/components/users/StatusPill';
import { isPending } from '@/lib/userStatus';

interface SellersHubProps {
  currentUser: User;
  businesses: Business[];
  products: Product[];
  inquiries: Inquiry[];
  initialTab?: 'businesses' | 'products' | 'inquiries';
}

export default function SellersHub({
  currentUser,
  businesses,
  products,
  inquiries,
  initialTab,
}: SellersHubProps) {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const updateBusinessMutation = useUpdateBusiness();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  let currentBiz = businesses.find((b) => b.ownerId === currentUser.id);
  if (!currentBiz && currentUser.role === 'seller') {
    currentBiz = businesses[0];
  }

  const bizProducts = currentBiz ? products.filter((p) => p.businessId === currentBiz!.id) : [];
  const bizInquiries = currentBiz
    ? inquiries.filter((inq) => inq.businessId === currentBiz!.id)
    : [];

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [bizForm, setBizForm] = useState({
    name: currentBiz?.name || '',
    description: currentBiz?.description || '',
    category: currentBiz?.category || 'Electronics',
    address: currentBiz?.address || '',
    neighborhood: currentBiz?.neighborhood || 'Kansanga',
    phone: currentBiz?.phone || '',
    whatsAppNumber: currentBiz?.whatsAppNumber || '',
    logo: currentBiz?.logo || '',
    coverImage: currentBiz?.coverImage || '',
    openingHours: currentBiz?.openingHours || '',
    mapsUrl: currentBiz?.mapsUrl || '',
    package: (currentBiz?.package || 'basic') as BusinessPackage,
  });

  const [communityBody, setCommunityBody] = useState('');
  const [communityTitle, setCommunityTitle] = useState('');
  const [postingCommunity, setPostingCommunity] = useState(false);

  useEffect(() => {
    if (!currentBiz) return;
    setBizForm({
      name: currentBiz.name,
      description: currentBiz.description,
      category: currentBiz.category,
      address: currentBiz.address,
      neighborhood: currentBiz.neighborhood,
      phone: currentBiz.phone,
      whatsAppNumber: currentBiz.whatsAppNumber,
      logo: currentBiz.logo,
      coverImage: currentBiz.coverImage,
      openingHours: currentBiz.openingHours ?? '',
      mapsUrl: currentBiz.mapsUrl ?? '',
      package: currentBiz.package,
    });
  }, [currentBiz?.id, currentBiz]);

  const [prodForm, setProdForm] = useState({
    name: '',
    price: 0,
    description: '',
    image: '',
    category: currentBiz?.category || 'Food',
  });

  const handleUpdateBizSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBiz) return;
    try {
      await updateBusinessMutation.mutateAsync({
        id: currentBiz.id,
        input: { ...bizForm },
      });
      toast(
        language === 'en' ? 'Business profile updated.' : 'ናይ ንግዲ ገጽ ሓበሬታ ተሓዲሱ ኣሎ።',
        'success',
      );
    } catch {
      toast('Could not update profile.', 'error');
    }
  };

  const handleAddProductSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBiz) return;
    try {
      await createProductMutation.mutateAsync({
        businessId: currentBiz.id,
        name: prodForm.name,
        price: Number(prodForm.price),
        description: prodForm.description,
        image:
          prodForm.image ||
          'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
        category: prodForm.category,
        isAvailable: true,
      });
      setProdForm({
        name: '',
        price: 0,
        description: '',
        image: '',
        category: currentBiz.category,
      });
      setIsAddingProduct(false);
      toast(
        language === 'en'
          ? 'Product published to marketplace.'
          : 'ኣቕሕ ናብ ዕዳጋ ብኣውታር ተወሲኹ ኣሎ።',
        'success',
      );
    } catch {
      toast('Could not publish product.', 'error');
    }
  };

  const handleSaveProductEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        input: {
          name: editingProduct.name,
          price: editingProduct.price,
          description: editingProduct.description,
          image: editingProduct.image,
          category: editingProduct.category,
          isAvailable: editingProduct.isAvailable,
        },
      });
      setEditingProduct(null);
      toast(language === 'en' ? 'Listing updated.' : 'ኣቕሕ ተሓዲሱ ኣሎ።', 'success');
    } catch {
      toast('Could not update listing.', 'error');
    }
  };

  const handleToggleStock = async (prod: Product) => {
    try {
      await updateProductMutation.mutateAsync({
        id: prod.id,
        input: { isAvailable: !prod.isAvailable },
      });
    } catch {
      toast('Stock toggle failed.', 'error');
    }
  };

  const handleDelete = async (prod: Product) => {
    if (
      !confirm(
        language === 'en'
          ? 'Are you sure you want to permanently delete this listing?'
          : 'ነዚ ኣቕሓ ንምስራዝ ርግጸኛ ዲኻ?',
      )
    )
      return;
    try {
      await deleteProductMutation.mutateAsync(prod.id);
      toast('Listing deleted.', 'success');
    } catch {
      toast('Delete failed.', 'error');
    }
  };

  const showBusinessSection = !initialTab || initialTab === 'businesses';
  const showInquiriesSection = !initialTab || initialTab === 'inquiries';
  const showProductsSection = !initialTab || initialTab === 'products';
  const sellerPending = isPending(currentUser);

  if (sellerPending) {
    return (
      <div
        className="bg-white rounded-3xl border border-amber-200 p-10 sm:p-12 text-center max-w-xl mx-auto my-12 shadow-sm relative overflow-hidden"
        id="seller-pending-lockout"
      >
        <div className="h-16 w-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Clock className="h-8 w-8 text-amber-700" />
        </div>
        <h2 className="text-2xl font-serif font-black text-black mb-2">
          {language === 'en' ? 'Seller workspace locked' : 'ቦታ ሸቓጢ ተዓጽዩ ኣሎ'}
        </h2>
        <p className="text-black/65 text-sm mb-6 leading-relaxed max-w-md mx-auto">
          {language === 'en'
            ? 'Your account is awaiting admin approval. Once approved, you can publish your business profile, products, and reply to customer inquiries.'
            : 'ኣካውንትኩም ምጽዳቕ ኣመሓዳሪ ይጽበ ኣሎ።'}
        </p>
        <div className="flex justify-center mb-4">
          <StatusPill status={currentUser.status} />
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-flag-red-600 hover:bg-flag-red-500 text-white rounded-xl text-xs font-extrabold cursor-pointer transition"
        >
          {language === 'en' ? 'Go to dashboard' : 'ናብ ናተይ ገጽ'}
        </Link>
      </div>
    );
  }

  if (!currentBiz) {
    return (
      <div
        className="bg-white rounded-3xl border border-black/10 p-10 sm:p-12 text-center max-w-xl mx-auto my-12 shadow-sm relative overflow-hidden"
        id="no-seller-biz-warning"
      >
        <div className="h-16 w-16 bg-sky-50 border border-sky-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Briefcase className="h-8 w-8 text-sky-600" />
        </div>
        <h2 className="text-2xl font-serif font-black text-black mb-2">
          {language === 'en' ? 'Set up your business' : 'ድኳንካ ኣዳሉ'}
        </h2>
        <p className="text-black/65 text-sm mb-6 leading-relaxed max-w-md mx-auto">
          {language === 'en'
            ? "You're verified — now publish a business profile so customers can find you and start sending inquiries."
            : 'ድኳንካ ኣብ Nehna ኣመዝግብ።'}
        </p>
        <div className="bg-black/5 border border-black/10 p-3 rounded-2xl inline-flex items-center gap-2 text-xs font-mono text-black/60">
          <span>{language === 'en' ? 'Role:' : 'ሓላፍነት:'}</span>
          <strong className="text-sky-700 uppercase">{currentUser.role}</strong>
        </div>
      </div>
    );
  }

  const isPremiumBrand =
    currentBiz.package === 'premium' ||
    currentBiz.package === 'featured' ||
    currentBiz.package === 'top_featured';

  return (
    <div className="space-y-8" id="seller-hub-container">
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-sky-50/40 to-white border border-black/10 rounded-3xl p-6 md:p-8 text-black shadow-sm">
        <div className="absolute top-0 right-0 h-48 w-48 bg-sky-100/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 border border-sky-200 text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-md">
              <Briefcase className="h-3 w-3" />
              <span>{t.sellerDashboardTitle}</span>
            </span>
            <span className="text-black/55">
              {language === 'en' ? 'Signed in as' : 'ኣቲኻ'}
            </span>
            <span className="font-bold text-black inline-flex items-center gap-1">
              <UserName user={currentUser} />
            </span>
            <StatusPill status={currentUser.status} />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  currentBiz.logo ||
                  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=150'
                }
                alt={`${currentBiz.name} Logo`}
                className="h-20 w-20 rounded-2xl object-cover border border-sky-200 bg-white shadow-md shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                {isPremiumBrand && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-md mb-2">
                    <Sparkles className="h-3 w-3" />
                    <span>Kampala Partner</span>
                  </span>
                )}
                <h2 className="text-2xl md:text-3xl font-serif font-black tracking-tight text-black">
                  {currentBiz.name}
                </h2>
                <p className="text-black/65 text-xs md:text-sm mt-1 max-w-xl font-sans leading-relaxed">
                  {language === 'en'
                    ? 'Manage your catalog, update business details, and fulfill orders on Nehna.'
                    : 'ኣቑሑትካ ኣማሓድር፣ ሓበሬታ ድኳንካ ኣሐድስ፣ ትእዛዝ ኣብ Nehna ኣካኢ።'}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-start md:items-end gap-2 w-full md:w-auto border-t border-black/5 pt-4 md:pt-0 md:border-0">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs border ${
                  currentBiz.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : currentBiz.status === 'pending'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {currentBiz.status === 'approved' ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-bold">{t.statusApproved}</span>
                  </>
                ) : currentBiz.status === 'pending' ? (
                  <>
                    <Clock className="h-4 w-4" />
                    <span className="font-bold">{t.statusPending}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-bold">{t.statusSuspended}</span>
                  </>
                )}
              </div>

              <div className="text-[11px] font-mono font-medium text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg">
                {language === 'en' ? 'PLAN: ' : 'ጥረ: '}
                <span className="uppercase font-bold text-black">
                  {currentBiz.package.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-metrics-strip">
        <div className="bg-white border border-black/10 rounded-2xl p-5 flex items-center justify-between group hover:border-sky-300 transition duration-300 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-black/55 block tracking-wider font-bold">
              {language === 'en' ? 'Live products' : 'ኣቑሑት'}
            </span>
            <div className="text-3xl font-mono font-black text-black">{bizProducts.length}</div>
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>{bizProducts.filter((p) => p.isAvailable).length} in stock</span>
            </span>
          </div>
          <div className="h-11 w-11 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-center text-sky-600">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-2xl p-5 flex items-center justify-between group hover:border-sky-300 transition duration-300 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-black/55 block tracking-wider font-bold">
              {language === 'en' ? 'Out of stock' : 'ኣይብሉን'}
            </span>
            <div className="text-3xl font-mono font-black text-black">
              {bizProducts.filter((p) => !p.isAvailable).length}
            </div>
            <span className="text-[11px] text-amber-700 font-mono">
              {language === 'en' ? 'Hidden from buyers' : 'ካብ ዓማዊል ተሓቢኡ'}
            </span>
          </div>
          <div className="h-11 w-11 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center text-amber-700">
            <Package className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-2xl p-5 flex items-center justify-between group hover:border-sky-300 transition duration-300 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-black/55 block tracking-wider font-bold">
              {language === 'en' ? 'Inquiries' : 'ሕቶታት'}
            </span>
            <div className="text-3xl font-mono font-black text-black">{bizInquiries.length}</div>
            <span className="text-[11px] text-sky-700 font-mono">
              {bizInquiries.filter((i) => i.status === 'unread').length}{' '}
              {language === 'en' ? 'unread' : 'ዘይተነበበ'}
            </span>
          </div>
          <div className="h-11 w-11 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-center text-sky-600">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-2xl p-5 flex items-center justify-between group hover:border-emerald-300 transition duration-300 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-black/55 block tracking-wider font-bold">
              {language === 'en' ? 'Visibility' : 'ምርኣይ'}
            </span>
            <div className="text-base font-serif font-black text-black uppercase flex items-center gap-1.5 mt-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
              <span>
                {currentBiz.package === 'top_featured'
                  ? language === 'en'
                    ? 'Gold tier'
                    : 'ወርቂ ደረጃ'
                  : language === 'en'
                    ? 'Standard'
                    : 'ኣረጋውቲ'}
              </span>
            </div>
            <span className="text-[11px] text-black/55 leading-none block pt-1">
              {currentBiz.neighborhood}
            </span>
          </div>
          <div className="h-11 w-11 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center text-emerald-700">
            <Award className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {(showBusinessSection || showInquiriesSection) && (
        <div className={`${showProductsSection && (showBusinessSection || showInquiriesSection) ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-8`}>
          {showBusinessSection && (
          <div className="bg-white border border-black/10 text-black p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
            <h3 className="text-sm font-bold font-serif text-sky-700 uppercase tracking-widest mb-2 border-b border-black/10 pb-3 flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>{language === 'en' ? 'Manage Business Profile' : 'ገጽ ንግዲ ኣማሓድር'}</span>
            </h3>
            {currentBiz && (
              <Link
                href={`/businesses/${currentBiz.id}`}
                className="text-xs font-bold text-sky-600 hover:underline mb-4 inline-flex items-center gap-1"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                {language === 'en' ? 'View public page' : 'ወጻኢ ገጽ ርአ'}
              </Link>
            )}

            <form onSubmit={handleUpdateBizSub} className="space-y-5 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="block text-black/55 font-mono text-[10px] uppercase font-bold tracking-wide">
                  {t.businessName}
                </label>
                <input
                  type="text"
                  value={bizForm.name}
                  onChange={(e) => setBizForm({ ...bizForm, name: e.target.value })}
                  className="w-full pl-3 pr-4 py-3 bg-white/85 border border-black/10 text-black rounded-2xl focus:border-sky-500/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500/20 transition-all font-sans"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-black/55 font-mono text-[10px] uppercase font-bold tracking-wide">
                  {t.description}
                </label>
                <textarea
                  value={bizForm.description}
                  onChange={(e) => setBizForm({ ...bizForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/85 border border-black/10 text-black rounded-2xl focus:border-sky-500/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500/20 transition-all leading-relaxed font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-black/55 font-mono text-[10px] uppercase font-bold tracking-wide">
                    Category
                  </label>
                    <select
                    value={bizForm.category}
                    onChange={(e) => setBizForm({ ...bizForm, category: e.target.value })}
                    className="w-full px-3 py-3 bg-white/95 border border-black/10 text-black rounded-2xl focus:border-sky-500/55 focus:outline-none font-sans cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {t[CATEGORY_TRANSLATION_KEYS[cat]]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-black/55 font-mono text-[10px] uppercase font-bold tracking-wide">
                    Neighborhood
                  </label>
                  <select
                    value={bizForm.neighborhood}
                    onChange={(e) => setBizForm({ ...bizForm, neighborhood: e.target.value })}
                    className="w-full px-3 py-3 bg-white/95 border border-black/10 text-black rounded-2xl focus:border-sky-500/55 focus:outline-none font-sans cursor-pointer"
                  >
                    <option value="Kansanga">Kansanga</option>
                    <option value="Kabalagala">Kabalagala</option>
                    <option value="Bunga">Bunga</option>
                    <option value="Buziga">Buziga</option>
                    <option value="Konge">Konge</option>
                    <option value="Soya">Soya</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-black/55 font-mono text-[10px] uppercase font-bold tracking-wide">
                  {language === 'en' ? 'Exact Address Description' : 'ቤት ጽሕፈት / ትኽክለኛ ቦታ'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={bizForm.address}
                    onChange={(e) => setBizForm({ ...bizForm, address: e.target.value })}
                    className="w-full px-4 py-3 bg-white/85 border border-black/10 text-black rounded-2xl focus:border-sky-500/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500/20 transition-all font-sans"
                    required
                  />
                  <MapPin className="absolute right-4 top-3.5 h-4 w-4 text-black/40" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-black/55 font-mono text-[10px] uppercase font-bold tracking-wide">
                    Direct Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={bizForm.phone}
                    onChange={(e) => setBizForm({ ...bizForm, phone: e.target.value })}
                    className="w-full pl-3 pr-4 py-3 bg-white/85 border border-black/10 text-black rounded-2xl focus:border-sky-500/50 focus:outline-none font-sans"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-black/55 font-mono text-[10px] uppercase font-bold tracking-wide">
                    Contact line (shown to buyers)
                  </label>
                  <input
                    type="text"
                    value={bizForm.whatsAppNumber}
                    onChange={(e) => setBizForm({ ...bizForm, whatsAppNumber: e.target.value })}
                    placeholder="e.g. 256755432109"
                    className="w-full px-3 py-3 bg-white/85 border border-black/10 text-black rounded-2xl focus:border-sky-500/50 focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-black/55 font-mono text-[10px] uppercase font-bold tracking-wide">
                    {language === 'en' ? 'Opening hours' : 'ሰዓት ክፍትሒ'}
                  </label>
                  <textarea
                    value={bizForm.openingHours}
                    onChange={(e) => setBizForm({ ...bizForm, openingHours: e.target.value })}
                    rows={3}
                    placeholder="Mon–Fri 9am–6pm"
                    className="w-full px-3 py-3 bg-white/85 border border-black/10 text-black rounded-2xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-black/55 font-mono text-[10px] uppercase font-bold tracking-wide">
                    Google Maps URL
                  </label>
                  <input
                    type="url"
                    value={bizForm.mapsUrl}
                    onChange={(e) => setBizForm({ ...bizForm, mapsUrl: e.target.value })}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-3 py-3 bg-white/85 border border-black/10 text-black rounded-2xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-black/5">
                <span className="block text-[10px] font-mono uppercase text-black/55 tracking-widest font-bold">
                  Aesthetic Identity Logos
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ImageUploadField
                    label="Logo"
                    kind="logo"
                    value={bizForm.logo}
                    onChange={(url) => setBizForm({ ...bizForm, logo: url })}
                    placeholder="https://r2.example.com/logo.jpg"
                    helpText="Square 512×512 preferred."
                  />
                  <ImageUploadField
                    label="Cover"
                    kind="cover"
                    value={bizForm.coverImage}
                    onChange={(url) => setBizForm({ ...bizForm, coverImage: url })}
                    placeholder="https://r2.example.com/cover.jpg"
                    helpText="Wide 1200×400 banner."
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-black/5">
                <label className="block text-black/55 font-mono text-[10px] uppercase font-bold tracking-wide">
                  {' '}
                  Kampala Direct Marketing Visibility Plan
                </label>
                <select
                  value={bizForm.package}
                  onChange={(e) =>
                    setBizForm({ ...bizForm, package: e.target.value as BusinessPackage })
                  }
                  className="w-full px-4 py-3 bg-white/95 border border-sky-500/20 text-sky-500 rounded-2xl focus:outline-none font-sans font-black uppercase text-xs"
                >
                  <option value="basic">Standard Listing (Free - Base Catalog)</option>
                  <option value="premium">Premium Showcase (UGX 30k/mo - Partner Badge)</option>
                  <option value="featured">Featured Hub (UGX 70k/mo - Search Spotlight)</option>
                  <option value="top_featured">
                    Gold Brand Tier (UGX 150k/mo - Fixed Frontpage Banner)
                  </option>
                </select>
                <p className="text-[10px] text-black/50 leading-normal">
                  Upgrading your plan places your listings permanently on top of customer searches,
                  raising direct trade calls by up to 500%.
                </p>
              </div>

              <button
                type="submit"
                disabled={updateBusinessMutation.isPending}
                className="w-full py-3 px-4 bg-flag-red-600 hover:bg-flag-red-500 text-white rounded-2xl font-black uppercase tracking-wider cursor-pointer transition-all duration-300 text-xs text-center shadow-lg shadow-flag-red-500/15 hover:-translate-y-0.5 mt-2 disabled:opacity-60"
              >
                {t.saveBtn}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-black/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-black/60">
                {language === 'en' ? 'Community post' : 'ማሕበረሰባዊ ልጥፊ'}
              </h4>
              <input
                type="text"
                value={communityTitle}
                onChange={(e) => setCommunityTitle(e.target.value)}
                placeholder={language === 'en' ? 'Optional title' : 'ኣርእስቲ'}
                className="w-full px-3 py-2 border border-black/10 rounded-xl text-xs"
              />
              <textarea
                value={communityBody}
                onChange={(e) => setCommunityBody(e.target.value)}
                rows={3}
                placeholder={language === 'en' ? 'Share an update with the community…' : 'ልጥፊ…'}
                className="w-full px-3 py-2 border border-black/10 rounded-xl text-xs"
              />
              <button
                type="button"
                disabled={!communityBody.trim() || postingCommunity || !currentBiz}
                onClick={async () => {
                  if (!currentBiz) return;
                  setPostingCommunity(true);
                  try {
                    await api.createCommunityPost({
                      businessId: currentBiz.id,
                      title: communityTitle.trim() || undefined,
                      body: communityBody.trim(),
                    });
                    setCommunityBody('');
                    setCommunityTitle('');
                    toast(language === 'en' ? 'Posted to Connect.' : 'ተመዝጊቡ።', 'success');
                  } catch {
                    toast('Failed to post.', 'error');
                  } finally {
                    setPostingCommunity(false);
                  }
                }}
                className="w-full py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold disabled:opacity-50"
              >
                {language === 'en' ? 'Post to Connect' : 'ኣብ Connect ሰዲድ'}
              </button>
            </div>
          </div>
          )}

          {showInquiriesSection && (
          <div className="bg-white border border-black/10 text-black p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 border-b border-black/10 pb-3">
              <h3 className="text-sm font-bold font-serif text-black uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-sky-600" />
                <span>{t.inquiriesReceived}</span>
              </h3>
              <span className="bg-sky-50 border border-sky-200 text-sky-700 text-[10px] font-mono font-black px-2.5 py-1 rounded-lg">
                {bizInquiries.length} {language === 'en' ? 'total' : 'ብጠቕላላ'}
              </span>
            </div>

            {bizInquiries.length === 0 ? (
              <div className="text-center py-10" id="no-inquiries-warning">
                <div className="h-12 w-12 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center mx-auto mb-3 text-black/40">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <p className="text-black/50 text-xs leading-relaxed max-w-xs mx-auto">
                  {t.noInquiriesYet ||
                    'No direct message inquires yet. Add items and promote them so buyers can inquiry directly.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[480px] overflow-y-auto scrollbar-none pr-1">
                {bizInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className={`bg-white border rounded-2xl p-4 space-y-3 shadow-sm transition-colors ${
                      inq.status === 'unread'
                        ? 'border-sky-200 bg-sky-50/30'
                        : 'border-black/10 hover:border-black/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center text-xs font-bold font-mono">
                          {inq.buyerName.substring(0, 1).toUpperCase()}
                        </div>
                        <span className="font-bold text-black text-xs">
                          <UserName name={inq.buyerName} />
                        </span>
                        {inq.status === 'unread' && (
                          <span className="bg-sky-100 text-sky-700 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                            {language === 'en' ? 'New' : 'ሓዳስ'}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-black/50 font-mono bg-black/5 px-2 py-0.5 rounded-md border border-black/10">
                        {inq.createdAt}
                      </span>
                    </div>

                    <div className="bg-black/[0.02] p-3 rounded-xl border border-black/5 text-black/75 text-xs leading-relaxed italic font-sans">
                      &ldquo;{inq.message}&rdquo;
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                      <span className="text-[10px] font-bold text-sky-700 font-mono">
                        📞 {inq.buyerPhone}
                      </span>
                      <Link
                        href="/seller/orders"
                        className="inline-flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-flag-blue-700 bg-flag-blue-50 border border-flag-blue-200 px-3 py-1.5 rounded-lg hover:bg-flag-blue-100 transition-all self-end cursor-pointer"
                      >
                        <span>{language === 'en' ? 'Orders' : 'ትእዛዝ'}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}
        </div>
        )}

        {showProductsSection && (
        <div className={`${showBusinessSection || showInquiriesSection ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-8`}>
          <div className="bg-white border border-black/10 text-black p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-black/10 pb-5">
              <div>
                <h3 className="text-lg font-serif font-black text-black uppercase tracking-tight">
                  📦 {language === 'en' ? 'Product & Service Catalog' : 'ኣቑሑትን ኣገልግሎትን'}
                </h3>
                <p className="text-xs text-black/60 mt-1 max-w-sm">
                  Add and modify active list items shown to visitors browsing the directory.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsAddingProduct(!isAddingProduct);
                  setEditingProduct(null);
                }}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all duration-300 ${
                  isAddingProduct
                    ? 'bg-black/5 border border-black/20 text-black'
                    : 'bg-flag-red-500 hover:bg-flag-red-600 text-white shadow-lg shadow-flag-red-500/10 hover:-translate-y-0.5'
                }`}
                type="button"
              >
                <Plus className="h-4 w-4" />
                <span>{t.addNewProduct}</span>
              </button>
            </div>

            {isAddingProduct && (
              <div className="mb-8 p-6 bg-sky-500/[0.02] border border-sky-500/30 rounded-3xl space-y-5 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/[0.02] to-transparent pointer-events-none"></div>

                <h4 className="text-xs font-mono font-black text-sky-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-sky-500" />
                  <span>{t.addNewProduct}</span>
                </h4>

                <form onSubmit={handleAddProductSub} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-black/55 font-medium">Product / Offer Title</label>
                      <input
                        type="text"
                        value={prodForm.name}
                        onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                        placeholder="e.g. Traditional Handwoven Habesha Zuria Kemis"
                        className="w-full px-4 py-3 bg-white/85 border border-black/10 focus:border-sky-500/50 text-black rounded-2xl focus:outline-none focus:bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-black/55 font-medium">Price (UGX)</label>
                      <input
                        type="number"
                        value={prodForm.price === 0 ? '' : prodForm.price}
                        onChange={(e) =>
                          setProdForm({ ...prodForm, price: Number(e.target.value) })
                        }
                        placeholder="e.g. 240000"
                        className="w-full px-4 py-3 bg-white/85 border border-black/10 focus:border-sky-500/50 text-black rounded-2xl focus:outline-none focus:bg-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-black/55 font-medium">Item Category</label>
                      <select
                        value={prodForm.category}
                        onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                        className="w-full px-3 py-3 bg-white/95 border border-black/10 text-black rounded-2xl focus:border-sky-500/40 focus:outline-none font-sans"
                      >
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

                    <ImageUploadField
                      label="Product Image"
                      kind="product"
                      value={prodForm.image}
                      onChange={(url) => setProdForm({ ...prodForm, image: url })}
                      placeholder="https://r2.example.com/product.jpg"
                      helpText="A square 800×800 image works best."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-black/55 font-medium">Item Description</label>
                    <textarea
                      value={prodForm.description}
                      onChange={(e) =>
                        setProdForm({ ...prodForm, description: e.target.value })
                      }
                      placeholder="e.g. Beautiful double-hem border silk work, standard women sizing."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/85 border border-black/10 focus:border-sky-500/50 text-black rounded-2xl focus:outline-none focus:bg-white leading-relaxed font-sans"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-black/5">
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="px-4 py-2.5 border border-black/10 hover:bg-black/5 rounded-2xl text-black/75 font-bold cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createProductMutation.isPending}
                      className="px-5 py-2.5 bg-flag-red-600 hover:bg-flag-red-500 text-white rounded-xl font-semibold cursor-pointer shadow-lg shadow-flag-red-500/10 transition-transform duration-300 active:scale-95 disabled:opacity-60"
                    >
                      {t.submitProduct}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {editingProduct && (
              <div className="mb-8 p-6 bg-sky-500/[0.02] border border-sky-500/35 rounded-3xl space-y-5 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/[0.015] to-transparent pointer-events-none"></div>

                <h4 className="text-xs font-mono font-black text-sky-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Edit className="h-4 w-4 text-sky-500" />
                  <span>
                    {t.editProduct} — {editingProduct.name}
                  </span>
                </h4>

                <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-black/55 font-medium">Product / Offer Title</label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/85 border border-black/10 focus:border-sky-500/50 text-black rounded-2xl focus:outline-none focus:bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-black/55 font-medium">Price (UGX)</label>
                      <input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                        }
                        className="w-full px-4 py-3 bg-white/85 border border-black/10 focus:border-sky-500/50 text-black rounded-2xl focus:outline-none focus:bg-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <ImageUploadField
                    label="Product Image"
                    kind="product"
                    value={editingProduct.image}
                    onChange={(url) => setEditingProduct({ ...editingProduct, image: url })}
                    placeholder="https://r2.example.com/product.jpg"
                  />

                  <div className="space-y-1.5">
                    <label className="block text-black/55 font-medium">In-Depth Description</label>
                    <textarea
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-white/85 border border-black/10 focus:border-sky-500/50 text-black rounded-2xl focus:outline-none focus:bg-white leading-relaxed font-sans"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-black/5">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2.5 border border-black/10 hover:bg-black/5 rounded-2xl text-black/75 font-bold cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateProductMutation.isPending}
                      className="px-5 py-2.5 bg-flag-red-600 hover:bg-flag-red-500 text-white rounded-xl font-semibold cursor-pointer shadow-lg shadow-flag-red-500/10 transition-transform duration-300 disabled:opacity-60"
                    >
                      {t.updateBtn}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {bizProducts.length === 0 ? (
              <div
                className="text-center py-16 border-2 border-dashed border-black/15 rounded-3xl max-w-md mx-auto my-6"
                id="empty-catalog-fallback"
              >
                <div className="h-14 w-14 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center mx-auto mb-4 text-black/40">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-black text-black uppercase tracking-wide">
                  No listed products yet
                </h4>
                <p className="text-black/50 text-xs mt-2 px-8 leading-relaxed max-w-sm mx-auto">
                  Bring instant customer attention to your workspace by listing traditional meals
                  (Injera, Berbere spices), cosmetic items, clothing accessories, or specialized
                  skills.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(true)}
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 bg-flag-red-500 hover:bg-flag-red-600 text-white text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer transition shadow-lg shadow-flag-red-500/10"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t.addNewProduct}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bizProducts.map((prod) => (
                  <div
                    key={prod.id}
                    id={`catalog-card-${prod.id}`}
                    className="group border border-black/10 hover:border-sky-500/35 hover:shadow-2xl hover:shadow-sky-500/[0.015] rounded-3xl bg-black/20 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all duration-350"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="relative h-18 w-18 rounded-2xl bg-slate-50 overflow-hidden border border-black/10 shrink-0 shadow-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        {!prod.isAvailable && (
                          <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                            <span className="text-[8px] font-mono font-black text-rose-400 uppercase tracking-wider bg-rose-500/10 px-1 py-0.5 rounded border border-rose-500/25">
                              OUT
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs space-y-1 overflow-hidden min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="bg-black/5 text-black/75 border border-black/10 text-[9px] uppercase font-mono px-2 py-0.5 rounded-lg font-black tracking-wider">
                            {prod.category}
                          </span>
                          {prod.isAvailable ? (
                            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          ) : (
                            <span className="inline-flex h-2 w-2 rounded-full bg-black/40"></span>
                          )}
                        </div>
                        <h4 className="text-black font-serif font-bold text-sm tracking-tight truncate max-w-xs sm:max-w-md group-hover:text-sky-500 transition-colors duration-300">
                          {prod.name}
                        </h4>

                        <div className="flex items-center gap-2.5 pt-0.5">
                          <span className="font-mono font-black text-sky-500 text-sm">
                            UGX {prod.price.toLocaleString()}
                          </span>
                          <span className="text-black/20 font-sans">•</span>
                          <span
                            className={`font-semibold text-[10px] ${
                              prod.isAvailable
                                ? 'text-emerald-400/90'
                                : 'text-black/50 line-through'
                            }`}
                          >
                            {prod.isAvailable ? 'In Stock / Active' : 'Suspended Stock'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 max-md:gap-2 border-t border-black/5 pt-3 md:pt-0 md:border-0">
                      <button
                        onClick={() => handleToggleStock(prod)}
                        className={`px-3 py-2 rounded-2xl text-[10px] font-mono font-black uppercase tracking-widest cursor-pointer transition-all border ${
                          prod.isAvailable
                            ? 'bg-white text-black/55 hover:bg-black/5 border-black/10 hover:text-black'
                            : 'bg-emerald-950/20 text-emerald-400 hover:bg-emerald-900/30 border-emerald-500/25'
                        }`}
                        title="Toggle customer visibility"
                        type="button"
                      >
                        {prod.isAvailable ? t.markOutOfStock : t.markInStock}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setIsAddingProduct(false);
                          }}
                          className="p-2.5 border border-black/10 hover:border-black/15 rounded-2xl text-black/55 hover:text-black bg-black/5 hover:bg-black/5 transition-all cursor-pointer"
                          title={t.editProduct}
                          type="button"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(prod)}
                          className="p-2.5 border border-rose-500/20 text-rose-400 hover:text-rose-300 hover:border-rose-500/40 bg-rose-500/5 hover:bg-rose-500/10 rounded-2xl transition-all cursor-pointer"
                          title={t.deleteBtn}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
