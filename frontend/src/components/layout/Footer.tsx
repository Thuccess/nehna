'use client';

import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import {
  Heart,
  Languages,
  MapPin,
  MessageCircle,
  Package,
  Shield,
  ShoppingBag,
  Store,
  UserPlus,
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useToast } from '@/lib/toast';
import NehnaXLogo from '@/components/layout/NehnaXLogo';

const NEIGHBORHOODS = ['Kansanga', 'Kabalagala', 'Bunga', 'Konge', 'Soya', 'Buziga'];

function FooterLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="group flex items-center gap-2.5 text-sm text-white/70 hover:text-white transition-colors py-1">
      {Icon && <Icon className="app-icon app-icon-md text-flag-blue-400 group-hover:text-flag-gold-400" />}
      <span>{children}</span>
    </Link>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-flag-gold-400">
        {title}
      </h4>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}

export default function Footer() {
  const { language, t, toggleLanguage } = useLanguage();
  const { toast } = useToast();
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative mt-20 text-white/80 pb-mobile-nav md:pb-0"
      id="marketplace-footer"
    >
      {/* Eritrea flag accent strip */}
      <div className="h-1 flex" aria-hidden>
        <span className="flex-1 bg-flag-green-500" />
        <span className="flex-1 bg-flag-gold-500" />
        <span className="flex-1 bg-flag-red-500" />
        <span className="flex-1 bg-flag-blue-500" />
      </div>

      <div className="bg-nehnax-navy-500 relative overflow-hidden">
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div
          className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-flag-blue-500/10 blur-3xl pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-flag-red-500/8 blur-3xl pointer-events-none"
          aria-hidden
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-3">
                <NehnaXLogo className="max-w-[180px] brightness-0 invert" />
                <p className="text-sm font-serif font-bold text-white tracking-tight">
                  {t.tagline}
                </p>
              </div>

              <p className="text-sm text-white/60 leading-relaxed max-w-md">
                {language === 'en'
                  ? 'Verified Eritrean businesses in Kampala — browse food, groceries, housing, and services. Order on Nehna with in-app messaging to sellers.'
                  : 'ኣብ ካምፓላ ዝተረጋገጹ ኤርትራዊ ድኳናት — ምግብ፣ መግቢ፣ ገዛን ኣገልግሎትን ርአ። ብ Nehna ትእዛዝ ሰዲድ ኣብ ኣፕ ምስ ሸያጢ ተዛረብ።'}
              </p>

              <div className="flex flex-wrap gap-2">
                {NEIGHBORHOODS.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wide text-white/55 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full"
                  >
                    <MapPin className="h-3 w-3 text-flag-gold-400" />
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:col-span-4 gap-8">
              <FooterColumn title={language === 'en' ? 'Explore' : 'ርአት'}>
                <li>
                  <FooterLink href="/" icon={ShoppingBag}>{t.navHome}</FooterLink>
                </li>
                <li>
                  <FooterLink href="/businesses" icon={Store}>{t.navBusinesses}</FooterLink>
                </li>
                <li>
                  <FooterLink href="/products" icon={Package}>{t.navProducts}</FooterLink>
                </li>
                <li>
                  <FooterLink href="/favorites" icon={Heart}>{t.navFavorites}</FooterLink>
                </li>
              </FooterColumn>

              <FooterColumn title={language === 'en' ? 'Account' : 'ኣካውንት'}>
                <li>
                  <FooterLink href="/login">{t.loginBtn}</FooterLink>
                </li>
                <li>
                  <FooterLink href="/register" icon={UserPlus}>{t.registerBtn}</FooterLink>
                </li>
                <li>
                  <FooterLink href="/dashboard">{language === 'en' ? 'My dashboard' : 'ዳሽቦርድይ'}</FooterLink>
                </li>
                <li>
                  <FooterLink href="/seller">{t.navSeller}</FooterLink>
                </li>
              </FooterColumn>

              <FooterColumn title={language === 'en' ? 'Trust' : 'እምነት'}>
                <li>
                  <FooterLink href="/admin" icon={Shield}>{t.navAdmin}</FooterLink>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={toggleLanguage}
                    className="group flex items-center gap-2.5 text-sm text-white/70 hover:text-white transition-colors py-1 w-full text-left"
                  >
                    <Languages className="h-4 w-4 text-flag-blue-400 group-hover:text-flag-gold-400 shrink-0" />
                    <span>{language === 'en' ? "ትግርኛ (Ge'ez)" : 'English'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      toast(
                        language === 'en'
                          ? 'Meet sellers in familiar hubs (Kansanga, Kabalagala) and verify goods before payment.'
                          : 'ኣብ ካንሳንጋን ካባላጋላ ንድኳን ክትረኽብ ከምኡ ክፍሊት ቅድሚ ምእታው ኣረጋግጽ።',
                        'info',
                      )
                    }
                    className="group flex items-center gap-2.5 text-sm text-white/70 hover:text-white transition-colors py-1 w-full text-left"
                  >
                    <Shield className="h-4 w-4 text-flag-green-400 shrink-0" />
                    <span>{language === 'en' ? 'Safety tips' : 'ሕግታት ድሕንነት'}</span>
                  </button>
                </li>
              </FooterColumn>
            </div>

            {/* Seller CTA */}
            <div className="lg:col-span-3">
              <div
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 space-y-4 backdrop-blur-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-flag-red-600/20 border border-flag-red-500/30 flex items-center justify-center shrink-0">
                    <Store className="h-5 w-5 text-flag-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-white">
                      {language === 'en' ? 'Sell on NehnaX' : 'ኣብ NehnaX ሸያጥ'}
                    </p>
                    <p className="text-xs text-white/55 mt-1 leading-relaxed">
                      {language === 'en'
                        ? 'List products, receive Nehna orders, and chat with buyers in one hub.'
                        : 'መዝገብ ኣቑሑት፣ ትእዛዝ Nehna ተቐበል፣ ምስ ዓሚል ብኣፕ ተዛረብ።'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-flag-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-flag-green-400 animate-pulse" />
                  {language === 'en' ? 'Nehna messaging enabled' : 'Nehna ምዝራር ንጡፍ'}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <ButtonLink href="/register/seller" variant="primary" size="sm" className="flex-1">
                    {t.joinAsSeller}
                  </ButtonLink>
                  <ButtonLink
                    href="/login/seller"
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/15 bg-white/5 text-white/90 hover:bg-white/10 hover:text-white"
                  >
                    {t.sellerSignIn}
                  </ButtonLink>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-white/45">
                <MessageCircle className="h-3.5 w-3.5 text-flag-blue-400 shrink-0" />
                <span>{t.bilingualNotice}</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-mono text-white/40 text-center sm:text-left">
              © {year} {t.appName} · Kampala, Uganda
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/35 px-2.5 py-1 rounded-full border border-white/10 bg-white/5">
                Admin-verified listings
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-flag-green-400 px-2.5 py-1 rounded-full border border-flag-green-500/25 bg-flag-green-500/10">
                Secure sign-in
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
