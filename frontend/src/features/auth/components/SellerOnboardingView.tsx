'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
} from 'lucide-react';
import { CATEGORIES, NEIGHBORHOODS } from '@adulis/shared/constants';
import type { BusinessOnboardingInput } from '@adulis/shared';
import ImageUploadField from '@/components/forms/ImageUploadField';
import { ApiError } from '@/lib/api';
import { useCreateBusiness } from '@/lib/queries/useBusinesses';
import { useToast } from '@/lib/toast';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import NehnaXLogo from '@/components/layout/NehnaXLogo';

const STEPS = ['business', 'contact', 'details', 'done'] as const;
type Step = (typeof STEPS)[number];

export default function SellerOnboardingView() {
  const router = useRouter();
  const { user, loading, refresh } = useAuth();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const createBusiness = useCreateBusiness();

  const [step, setStep] = useState<Step>('business');
  const [bizName, setBizName] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0] ?? 'Food');
  const [neighborhood, setNeighborhood] = useState<string>(NEIGHBORHOODS[0] ?? 'Kansanga');
  const [customNeighborhood, setCustomNeighborhood] = useState('');
  const [bizPhone, setBizPhone] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [coverImage, setCoverImage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/register/seller');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.phone && !bizPhone) setBizPhone(user.phone);
  }, [user, bizPhone]);

  const resolvedNeighborhood =
    neighborhood === 'Other' ? customNeighborhood.trim() : neighborhood;

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const buildPayload = (): BusinessOnboardingInput => ({
    name: bizName.trim(),
    category,
    neighborhood: resolvedNeighborhood,
    phone: bizPhone.trim(),
    whatsAppNumber: whatsAppNumber.trim(),
    address: address.trim(),
    description: description.trim(),
    logo: logo || undefined,
    coverImage: coverImage || undefined,
  });

  const submit = async () => {
    try {
      const result = await createBusiness.mutateAsync(buildPayload());
      if (result.user) {
        await refresh();
      }
      setStep('done');
      toast(
        language === 'en' ? 'Business submitted for approval' : 'ድኳን ንምጽዳቕ ቀሪቡ',
        'success',
      );
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not submit business.';
      toast(msg, 'error');
    }
  };

  if (loading || !user) {
    return <div className="text-center text-black/60 text-sm py-16">Loading...</div>;
  }

  if (step === 'done') {
    return (
      <div className="max-w-md mx-auto bg-slate-50 border border-black/10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-white p-8 text-center space-y-4 border-b border-black/10">
          <CheckCircle2 className="h-14 w-14 text-flag-green-600 mx-auto" />
          <h1 className="text-xl font-serif font-black text-black">
            {language === 'en' ? 'Submitted for approval' : 'ንምጽዳቕ ቀሪቡ'}
          </h1>
          <p className="text-black/60 text-sm leading-relaxed">
            {language === 'en'
              ? 'Your business profile has been submitted. An administrator will review it shortly. Status: Pending Approval.'
              : 'መዝገብ ትካልኩም ቀሪቡ። ኣመሓዳሪ ኣብ ቐጺሉ ክርኢ እዩ።'}
          </p>
        </div>
        <div className="p-6 space-y-3">
          <Link
            href="/seller"
            className="block w-full py-3 text-center bg-flag-red-600 hover:bg-flag-red-500 text-white rounded-xl font-extrabold text-sm"
          >
            {language === 'en' ? 'Open Seller Hub' : 'ማእከል ነጋዶ ክፈት'}
          </Link>
          <Link
            href="/"
            className="block w-full py-3 text-center border border-black/15 rounded-xl font-bold text-sm text-black/80"
          >
            {language === 'en' ? 'Back to marketplace' : 'ናብ ዕዳጋ'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-slate-50 border border-black/10 rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-white p-6 border-b border-black/10">
        <div className="flex justify-center mb-3">
          <NehnaXLogo linkToHome size="lg" />
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-black/50 mb-2">
          <Building2 className="h-3.5 w-3.5" />
          <span>
            {language === 'en' ? 'Register your business' : 'ድኳን መዝግብ'} — Step {stepIndex + 1}/3
          </span>
        </div>
        <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="p-6 space-y-4 text-sm">
        {step === 'business' && (
          <>
            <h2 className="font-black text-black text-base">
              {language === 'en' ? 'Business information' : 'ሓበሬታ ትካል'}
            </h2>
            <div>
              <label className="block text-black/70 text-xs font-medium mb-1">
                {language === 'en' ? 'Business name' : 'ስም ትካል'} *
              </label>
              <input
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                placeholder="e.g. Asmara Restaurant"
                required
                className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white text-base md:text-sm"
              />
            </div>
            <div>
              <label className="block text-black/70 text-xs font-medium mb-1">
                {language === 'en' ? 'Category' : 'ምድብ'} *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white text-base md:text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-black/70 text-xs font-medium mb-1">
                <MapPin className="h-3.5 w-3.5 inline mr-1" />
                {language === 'en' ? 'Location' : 'ቦታ'} *
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white text-base md:text-sm"
              >
                {NEIGHBORHOODS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              {neighborhood === 'Other' && (
                <input
                  value={customNeighborhood}
                  onChange={(e) => setCustomNeighborhood(e.target.value)}
                  placeholder={language === 'en' ? 'Your area' : 'ከባቢኩም'}
                  className="mt-2 w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white text-base md:text-sm"
                />
              )}
            </div>
          </>
        )}

        {step === 'contact' && (
          <>
            <h2 className="font-black text-black text-base">
              {language === 'en' ? 'Contact information' : 'ሓበሬታ ርክብ'}
            </h2>
            <div>
              <label className="block text-black/70 text-xs font-medium mb-1">
                <Phone className="h-3.5 w-3.5 inline mr-1" />
                {language === 'en' ? 'Business phone' : 'ስልኪ ትካል'} *
              </label>
              <input
                type="tel"
                value={bizPhone}
                onChange={(e) => setBizPhone(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white font-mono text-base md:text-sm"
              />
            </div>
            <div>
              <label className="block text-black/70 text-xs font-medium mb-1">
                {language === 'en' ? 'WhatsApp number' : 'ስልኪ WhatsApp'} *
              </label>
              <input
                type="tel"
                value={whatsAppNumber}
                onChange={(e) => setWhatsAppNumber(e.target.value)}
                placeholder="e.g. +256755432109"
                required
                className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white font-mono text-base md:text-sm"
              />
            </div>
            <div>
              <label className="block text-black/70 text-xs font-medium mb-1">
                {language === 'en' ? 'Address' : 'ኣድራሻ'}
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={language === 'en' ? 'Street or building' : 'ጎደና ወይ ህንጻ'}
                className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white text-base md:text-sm"
              />
            </div>
          </>
        )}

        {step === 'details' && (
          <>
            <h2 className="font-black text-black text-base">
              {language === 'en' ? 'Business details' : 'ዝርዝር ትካል'}
            </h2>
            <div>
              <label className="block text-black/70 text-xs font-medium mb-1">
                {language === 'en' ? 'Description' : 'መግለጺ'}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder={
                  language === 'en'
                    ? 'Tell customers what you offer…'
                    : 'እቶም ዘቕርብዎ ይገልጹ…'
                }
                className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white text-base md:text-sm resize-none"
              />
            </div>
            <ImageUploadField
              label={language === 'en' ? 'Logo' : 'ሎጎ'}
              kind="logo"
              value={logo}
              onChange={setLogo}
              helpText={language === 'en' ? 'Optional — add later in Seller Hub' : 'ኣማራጺ'}
            />
            <ImageUploadField
              label={language === 'en' ? 'Cover image' : 'ስእሊ ሽፋን'}
              kind="cover"
              value={coverImage}
              onChange={setCoverImage}
              helpText={language === 'en' ? 'Optional — add later in Seller Hub' : 'ኣማራጺ'}
            />
          </>
        )}

        <div className="flex gap-2 pt-2">
          {step !== 'business' && (
            <button
              type="button"
              onClick={() => setStep(step === 'contact' ? 'business' : 'contact')}
              className="flex items-center justify-center gap-1 px-4 py-3 rounded-xl border border-black/15 font-bold text-sm min-h-[44px] touch-manipulation"
            >
              <ChevronLeft className="h-4 w-4" />
              {language === 'en' ? 'Back' : 'ተመለስ'}
            </button>
          )}
          {step === 'business' && (
            <button
              type="button"
              disabled={!bizName.trim() || (neighborhood === 'Other' && !customNeighborhood.trim())}
              onClick={() => setStep('contact')}
              className="flex-1 flex items-center justify-center gap-1 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-extrabold text-sm min-h-[44px] disabled:opacity-50 touch-manipulation"
            >
              {language === 'en' ? 'Continue' : 'ቀጽል'}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
          {step === 'contact' && (
            <button
              type="button"
              disabled={!bizPhone.trim() || !whatsAppNumber.trim()}
              onClick={() => setStep('details')}
              className="flex-1 flex items-center justify-center gap-1 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-extrabold text-sm min-h-[44px] disabled:opacity-50 touch-manipulation"
            >
              {language === 'en' ? 'Continue' : 'ቀጽል'}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
          {step === 'details' && (
            <button
              type="button"
              disabled={createBusiness.isPending}
              onClick={() => void submit()}
              className="flex-1 py-3 bg-flag-red-600 hover:bg-flag-red-500 text-white rounded-xl font-extrabold text-sm min-h-[44px] disabled:opacity-60 touch-manipulation"
            >
              {createBusiness.isPending
                ? '...'
                : language === 'en'
                  ? t.submitOrderBtn
                  : 'ንምጽዳቕ ኣቕርብ'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
