'use client';

import { useEffect, useState } from 'react';
import { Save, UserCog } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useToast } from '@/lib/toast';
import { useUpdateMe } from '@/lib/queries';
import { ApiError } from '@/lib/api';
import StatusPill from '@/components/users/StatusPill';
import VerifiedBadge from '@/components/users/VerifiedBadge';
import { isVerified, splitName } from '@/lib/userStatus';
import ImageUploadField from '@/components/forms/ImageUploadField';

export default function ProfileForm() {
  const { user, refresh } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const updateMe = useUpdateMe();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setPhone(user.phone);
    setAvatarUrl(user.avatarUrl ?? '');
  }, [user]);

  if (!user) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMe.mutateAsync({ name, phone, avatarUrl: avatarUrl || undefined });
      await refresh();
      toast(language === 'en' ? 'Profile saved.' : 'ሓበሬታ ተመዝጊቡ።', 'success');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not update profile.';
      toast(msg, 'error');
    }
  };

  const { last } = splitName(user.name);

  return (
    <div className="space-y-5">
      <div className="border-b border-black/10 pb-3">
        <h2 className="text-xl font-serif font-bold text-black uppercase tracking-tight flex items-center gap-2">
          <UserCog className="h-5 w-5 text-sky-600" />
          <span>{language === 'en' ? 'Profile' : 'ናተይ ሓበሬታ'}</span>
        </h2>
        <p className="text-xs text-black/60 mt-1">
          {language === 'en'
            ? 'Update your name, phone, and profile picture. Email and role are managed by NehnaX.'
            : 'ስም፣ ስልኪ፣ ስእሊ ኣዕቅብ።'}
        </p>
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-5 sm:p-6 shadow-sm flex items-center gap-4">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={user.name}
            className="h-16 w-16 rounded-2xl object-cover border border-black/10 bg-white"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-16 w-16 rounded-2xl bg-sky-100 border border-sky-200 text-sky-700 font-black text-xl flex items-center justify-center">
            {(name || user.name).slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-base font-serif font-black text-black inline-flex items-center gap-1.5">
            <span>{user.name}</span>
            {isVerified(user) && last && <VerifiedBadge size="md" />}
          </p>
          <p className="text-xs text-black/55 truncate">{user.email}</p>
          <div className="mt-1.5">
            <StatusPill status={user.status} />
          </div>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="bg-white border border-black/10 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
      >
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-black/55 mb-1.5">
            {language === 'en' ? 'Full name' : 'ሙሉእ ስም'}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2.5 bg-white border border-black/10 rounded-xl text-sm text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-black/55 mb-1.5">
            {language === 'en' ? 'Phone' : 'ስልኪ'}
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-3 py-2.5 bg-white border border-black/10 rounded-xl text-sm text-black font-mono focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition"
          />
        </div>

        <ImageUploadField
          label={language === 'en' ? 'AVATAR IMAGE' : 'ስእሊ'}
          value={avatarUrl}
          onChange={(url) => setAvatarUrl(url)}
          kind="avatar"
          placeholder="https://images.unsplash.com/..."
          helpText={
            language === 'en'
              ? 'Square images work best. Upload a JPG/PNG up to 8 MB.'
              : 'ካብ 8 ሜባ ንታሕቲ ካሬ ስእሊ ጽዓን።'
          }
        />

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/5">
          <button
            type="submit"
            disabled={updateMe.isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-flag-red-600 hover:bg-flag-red-500 text-white rounded-xl font-extrabold text-xs cursor-pointer transition disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" />
            <span>
              {updateMe.isPending
                ? language === 'en'
                  ? 'Saving...'
                  : 'ይምዝገብ...'
                : language === 'en'
                  ? 'Save changes'
                  : 'ኣዕቅብ'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
