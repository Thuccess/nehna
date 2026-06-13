'use client';

import Link from 'next/link';
import { Heart, Inbox, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useFavorites, useMyInquiries, useProducts } from '@/lib/queries';
import UserName from '@/components/users/UserName';
import StatusPill from '@/components/users/StatusPill';
import VerifiedBadge from '@/components/users/VerifiedBadge';
import { isPending, isVerified } from '@/lib/userStatus';

export default function DashboardOverview() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { data: favorites = [] } = useFavorites();
  const { data: products = [] } = useProducts();
  const { data: myInquiries = [] } = useMyInquiries(Boolean(user));

  if (!user) return null;

  const productFavorites = favorites
    .filter((f) => f.itemType === 'product')
    .map((f) => products.find((p) => p.id === f.itemId))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const recentFavorites = productFavorites.slice(0, 4);
  const recentInquiries = myInquiries.slice(0, 4);

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-br from-white via-sky-50/40 to-white border border-black/10 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              <span>{language === 'en' ? 'Buyer Dashboard' : 'ናተይ ገጽ'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-black tracking-tight leading-tight">
              {language === 'en' ? 'Welcome back, ' : 'እንቋዕ ብደሓን መጻእካ፣ '}
              <UserName user={user} className="text-sky-700" />
            </h1>
            <p className="text-sm text-black/65 max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'Track favorites, follow up on inquiries, and keep your contact details current.'
                : 'ተፈታዊታት ተኸታተል፣ ሕቶታት ተኸታተል፣ ናይ ርክብ ሓበሬታ ኣዕቅብ።'}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <StatusPill status={user.status} />
            {user.email && (
              <span className="text-[11px] text-black/50 font-mono break-all">{user.email}</span>
            )}
          </div>
        </div>
      </section>

      {isPending(user) && (
        <section className="border border-amber-200 bg-amber-50 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 text-sm text-amber-900 leading-relaxed">
            <p className="font-extrabold mb-1">
              {language === 'en'
                ? 'Your account is being reviewed.'
                : 'ኣካውንትኩም ይጽንዐ ኣሎ።'}
            </p>
            <p className="text-amber-800/85 text-xs sm:text-sm">
              {language === 'en'
                ? "Once an admin approves it, you'll get a verified check next to your name and unlock messaging, favorites, and seller tools."
                : 'ሓደ ኣመሓዳሪ ምስ ኣጽደቐ፣ ምልክት ምርግጋጽ ክወሃበካን ኩሉ ዓቕምታት ክኽፈትን እዩ።'}
            </p>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label={language === 'en' ? 'Account status' : 'ኩነታት'}
          value={
            isVerified(user)
              ? language === 'en'
                ? 'Verified'
                : 'ተረጋጊጹ'
              : isPending(user)
                ? language === 'en'
                  ? 'Pending'
                  : 'ይጽበ'
                : language === 'en'
                  ? 'Banned'
                  : 'ተኣጊዱ'
          }
          accent={isVerified(user) ? 'sky' : isPending(user) ? 'amber' : 'rose'}
          trailing={isVerified(user) ? <VerifiedBadge size="md" /> : null}
        />
        <StatTile
          label={language === 'en' ? 'Saved favorites' : 'ዝፈተኹሞ'}
          value={String(productFavorites.length)}
          icon={<Heart className="h-5 w-5" />}
          accent="rose"
        />
        <StatTile
          label={language === 'en' ? 'Inquiries sent' : 'ዝለኣኹመን ሕቶታት'}
          value={String(myInquiries.length)}
          icon={<Inbox className="h-5 w-5" />}
          accent="sky"
        />
        <StatTile
          label={language === 'en' ? 'Member role' : 'ሓላፍነት'}
          value={user.role === 'seller' ? 'Seller' : user.role === 'admin' ? 'Admin' : 'Customer'}
          icon={<ShoppingBag className="h-5 w-5" />}
          accent="emerald"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title={language === 'en' ? 'Recent favorites' : 'ሓደሽቲ ተፈታዊታት'}
          link={{ href: '/dashboard/favorites', label: language === 'en' ? 'See all' : 'ኩሉ ርአ' }}
          icon={<Heart className="h-4 w-4 text-rose-500" />}
        >
          {recentFavorites.length === 0 ? (
            <Empty
              text={
                language === 'en'
                  ? "You haven't saved anything yet."
                  : 'ገና ዝፈተኻዮ ኣቕሓ የለን።'
              }
              cta={{ href: '/products', label: language === 'en' ? 'Browse Marketplace' : 'ኣብ ዕዳጋ ድለ' }}
            />
          ) : (
            <ul className="space-y-2">
              {recentFavorites.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-black/5 hover:border-sky-200 hover:bg-sky-50/30 transition"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-12 w-12 rounded-lg object-cover border border-black/10"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-black truncate">{p.name}</p>
                    <p className="text-[11px] text-black/55">UGX {p.price.toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title={language === 'en' ? 'Recent inquiries' : 'ሓደሽቲ ሕቶታት'}
          link={{ href: '/dashboard/inquiries', label: language === 'en' ? 'See all' : 'ኩሉ ርአ' }}
          icon={<Inbox className="h-4 w-4 text-sky-600" />}
        >
          {recentInquiries.length === 0 ? (
            <Empty
              text={
                language === 'en'
                  ? "You haven't sent any inquiries yet."
                  : 'ገና ሕቶ ኣይለኣኽካን።'
              }
              cta={{
                href: '/products',
                label: language === 'en' ? 'Find a seller' : 'ሸቓጢ ድለ',
              }}
            />
          ) : (
            <ul className="space-y-2">
              {recentInquiries.map((inq) => (
                <li
                  key={inq.id}
                  className="p-3 rounded-xl border border-black/5 hover:border-sky-200 hover:bg-sky-50/30 transition"
                >
                  <p className="text-xs font-mono text-black/55 mb-0.5">{inq.createdAt}</p>
                  <p className="text-sm text-black/85 line-clamp-2 leading-snug">{inq.message}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}

interface StatTileProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  accent: 'sky' | 'amber' | 'rose' | 'emerald';
}

function StatTile({ label, value, icon, trailing, accent }: StatTileProps) {
  const accentMap = {
    sky: 'bg-sky-50 text-sky-700 border-sky-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  } as const;
  return (
    <div className="bg-white border border-black/10 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-black/15 transition">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-black/55">
          {label}
        </span>
        {icon && (
          <span
            className={`h-9 w-9 rounded-xl border flex items-center justify-center ${accentMap[accent]}`}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-2xl font-serif font-black text-black">{value}</span>
        {trailing}
      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  link?: { href: string; label: string };
  children: React.ReactNode;
}

function Card({ title, icon, link, children }: CardProps) {
  return (
    <div className="bg-white border border-black/10 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/10">
        <h3 className="text-sm font-serif font-black text-black uppercase tracking-tight flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h3>
        {link && (
          <Link
            href={link.href}
            className="text-[11px] font-bold text-sky-700 hover:text-sky-600 inline-flex items-center gap-1"
          >
            {link.label}
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

function Empty({ text, cta }: { text: string; cta: { href: string; label: string } }) {
  return (
    <div className="text-center py-6">
      <p className="text-xs text-black/55 mb-3">{text}</p>
      <Link
        href={cta.href}
        className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-600"
      >
        {cta.label}
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
