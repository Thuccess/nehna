'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { CATEGORIES, NEIGHBORHOODS } from '@adulis/shared/constants';
import type { BusinessOnboardingInput } from '@adulis/shared';
import ImageUploadField from '@/components/forms/ImageUploadField';
import { ApiError } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import NehnaXLogo from '@/components/layout/NehnaXLogo';

const STEPS = ['account', 'business', 'contact', 'details', 'done'] as const;
type Step = (typeof STEPS)[number];

export default function SellerRegisterView() {
  const { registerSeller } = useAuth();
  const { language, t } = useLanguage();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>('account');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
  const [submitting, setSubmitting] = useState(false);

  const resolvedNeighborhood =
    neighborhood === 'Other' ? customNeighborhood.trim() : neighborhood;

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const buildBusiness = (): BusinessOnboardingInput => ({
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
    if (password !== confirmPassword) {
      toast(language === 'en' ? 'Passwords do not match.' : 'ሕላገታት ኣይሰማማዕን።', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await registerSeller({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        password,
        business: buildBusiness(),
      });
      setStep('done');
      toast(
        language === 'en' ? 'Seller application submitted' : 'መዝገብ ሸያጢ ቀሪቡ',
        'success',
      );
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Registration failed.';
      toast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'done') {
    return (
      <div className="max-w-md mx-auto bg-slate-50 border border-black/10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-white p-8 text-center space-y-4 border-b border-black/10">
          <Clock className="h-12 w-12 text-flag-gold-600 mx-auto" />
          <h1 className="text-xl font-serif font-black text-black">
            {language === 'en' ? 'Application submitted' : 'መዝገብ ቀሪቡ'}
          </h1>
          <p className="text-black/60 text-sm leading-relaxed">
            {language === 'en'
              ? 'Your seller account and business profile are pending admin approval. You will be able to sign in after approval.'
              : 'ኣካውንትኩምን ድኳንኩምን ንምጽዳቕ ቀሪቡ። ኣብ ድሕሪ ምጽዳቕ እተው።'}
          </p>
        </div>
        <div className="p-6">
          <Link
            href="/login/seller"
            className="block w-full py-3 text-center bg-flag-red-600 hover:bg-flag-red-500 text-white rounded-xl font-extrabold text-sm"
          >
            {language === 'en' ? 'Seller sign in' : 'እተው ሸያጢ'}
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
        <p className="text-[10px] font-mono font-bold uppercase text-black/50">
          {language === 'en' ? 'Seller registration' : 'መዝገብ ሸያጢ'} — Step {stepIndex + 1}/4
        </p>
        <div className="h-1.5 bg-black/10 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-sky-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="p-6 space-y-4 text-sm">
        {step === 'account' && (
          <>
            <h2 className="font-black text-black flex items-center gap-2">
              <User className="h-4 w-4" />
              {language === 'en' ? 'Account information' : 'ሓበሬታ ኣካውንት'}
            </h2>
            <input
              placeholder={language === 'en' ? 'Owner full name' : 'ስም ዋና'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white"
            />
            <input
              type="tel"
              placeholder={language === 'en' ? 'Phone number' : 'ስልኪ'}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white font-mono"
            />
            <input
              type="email"
              placeholder={language === 'en' ? 'Email' : 'ኢመይል'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white"
            />
            <input
              type="password"
              placeholder={language === 'en' ? 'Password' : 'ሕላገት'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white font-mono"
            />
            <input
              type="password"
              placeholder={language === 'en' ? 'Confirm password' : 'ሕላገት ኣረጋግጽ'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white font-mono"
            />
          </>
        )}

        {step === 'business' && (
          <>
            <h2 className="font-black text-black flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {language === 'en' ? 'Business information' : 'ሓበሬታ ትካል'}
            </h2>
            <input
              placeholder={language === 'en' ? 'Business name' : 'ስም ትካል'}
              value={bizName}
              onChange={(e) => setBizName(e.target.value)}
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white"
            >
              {NEIGHBORHOODS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            {neighborhood === 'Other' && (
              <input
                value={customNeighborhood}
                onChange={(e) => setCustomNeighborhood(e.target.value)}
                placeholder={language === 'en' ? 'Your area' : 'ከባቢ'}
                className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white"
              />
            )}
          </>
        )}

        {step === 'contact' && (
          <>
            <h2 className="font-black text-black flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {language === 'en' ? 'Contact information' : 'ሓበሬታ ርክብ'}
            </h2>
            <input
              type="tel"
              placeholder={language === 'en' ? 'Business phone' : 'ስልኪ ትካል'}
              value={bizPhone}
              onChange={(e) => setBizPhone(e.target.value)}
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white font-mono"
            />
            <input
              type="tel"
              placeholder={language === 'en' ? 'WhatsApp number' : 'WhatsApp'}
              value={whatsAppNumber}
              onChange={(e) => setWhatsAppNumber(e.target.value)}
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white font-mono"
            />
            <input
              placeholder={language === 'en' ? 'Address' : 'ኣድራሻ'}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white"
            />
          </>
        )}

        {step === 'details' && (
          <>
            <h2 className="font-black text-black flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {language === 'en' ? 'Business details' : 'ዝርዝር ትካል'}
            </h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={language === 'en' ? 'Description' : 'መግለጺ'}
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white resize-none"
            />
            <ImageUploadField
              label={language === 'en' ? 'Logo' : 'ሎጎ'}
              kind="logo"
              value={logo}
              onChange={setLogo}
            />
            <ImageUploadField
              label={language === 'en' ? 'Cover image' : 'ስእሊ ሽፋን'}
              kind="cover"
              value={coverImage}
              onChange={setCoverImage}
            />
          </>
        )}

        <div className="flex gap-2 pt-2">
          {step !== 'account' && (
            <button
              type="button"
              onClick={() =>
                setStep(
                  step === 'business'
                    ? 'account'
                    : step === 'contact'
                      ? 'business'
                      : 'contact',
                )
              }
              className="flex items-center gap-1 px-4 py-3 rounded-xl border border-black/15 font-bold text-sm min-h-[44px]"
            >
              <ChevronLeft className="h-4 w-4" />
              {language === 'en' ? 'Back' : 'ተመለስ'}
            </button>
          )}
          {step === 'account' && (
            <button
              type="button"
              disabled={
                !name.trim() ||
                !phone.trim() ||
                !email.trim() ||
                password.length < 8 ||
                confirmPassword.length < 8
              }
              onClick={() => setStep('business')}
              className="flex-1 flex items-center justify-center gap-1 py-3 bg-sky-600 text-white rounded-xl font-extrabold text-sm min-h-[44px] disabled:opacity-50"
            >
              {language === 'en' ? 'Continue' : 'ቀጽል'}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
          {step === 'business' && (
            <button
              type="button"
              disabled={!bizName.trim() || (neighborhood === 'Other' && !customNeighborhood.trim())}
              onClick={() => {
                if (!bizPhone) setBizPhone(phone);
                setStep('contact');
              }}
              className="flex-1 py-3 bg-sky-600 text-white rounded-xl font-extrabold text-sm min-h-[44px] disabled:opacity-50"
            >
              {language === 'en' ? 'Continue' : 'ቀጽል'}
            </button>
          )}
          {step === 'contact' && (
            <button
              type="button"
              disabled={!bizPhone.trim() || !whatsAppNumber.trim()}
              onClick={() => setStep('details')}
              className="flex-1 py-3 bg-sky-600 text-white rounded-xl font-extrabold text-sm min-h-[44px] disabled:opacity-50"
            >
              {language === 'en' ? 'Continue' : 'ቀጽል'}
            </button>
          )}
          {step === 'details' && (
            <button
              type="button"
              disabled={submitting}
              onClick={() => void submit()}
              className="flex-1 py-3 bg-flag-red-600 text-white rounded-xl font-extrabold text-sm min-h-[44px] disabled:opacity-60"
            >
              {submitting
                ? '...'
                : language === 'en'
                  ? t.submitOrderBtn
                  : 'ንምጽዳቕ ኣቕርብ'}
            </button>
          )}
        </div>
        <Link href="/register" className="block text-center text-[11px] text-sky-600 font-bold">
          {language === 'en' ? 'Back to account type' : 'ተመለስ'}
        </Link>
      </div>
    </div>
  );
}
