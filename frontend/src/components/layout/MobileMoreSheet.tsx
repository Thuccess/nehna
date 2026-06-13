'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Briefcase,
  Languages,
  LayoutDashboard,
  LogIn,
  LogOut,
  PlusCircle,
  Shield,
  UserCheck,
  X,
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useMobileMore } from '@/providers/MobileMoreProvider';
import UserName from '@/components/users/UserName';
import { ButtonLink } from '@/components/ui/Button';
import { isPending } from '@/lib/userStatus';

export default function MobileMoreSheet() {
  const { isOpen, close } = useMobileMore();
  const { language, t, toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  const secondaryLinks = [
    ...(user
      ? [
          {
            href: '/dashboard',
            label: t.navDashboard,
            Icon: LayoutDashboard,
            active: isActive('/dashboard'),
          },
        ]
      : []),
    ...(user?.role === 'seller'
      ? [
          {
            href: '/seller',
            label: t.navSeller,
            Icon: Briefcase,
            active: isActive('/seller'),
          },
        ]
      : []),
    ...(user?.role === 'admin'
      ? [
          {
            href: '/admin',
            label: t.navAdmin,
            Icon: Shield,
            active: isActive('/admin'),
          },
        ]
      : []),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[55] bg-slate-900/40 backdrop-blur-sm md:hidden touch-manipulation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={language === 'en' ? 'More options' : 'ተወሳኺ ኣማራጺታት'}
            className="fixed inset-x-0 bottom-0 z-[60] md:hidden bg-white rounded-t-3xl border-t border-black/10 shadow-2xl max-h-[85dvh] overflow-y-auto"
            style={{ paddingBottom: 'var(--safe-bottom)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="h-1 w-10 rounded-full bg-black/15" aria-hidden="true" />
            </div>

            <div className="flex items-center justify-between px-5 pb-3">
              <h2 className="font-display font-bold text-lg text-black">
                {language === 'en' ? 'More' : 'ተወሳኺ'}
              </h2>
              <button
                type="button"
                onClick={close}
                className="p-2 rounded-xl hover:bg-black/5 touch-manipulation"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-black/60" />
              </button>
            </div>

            {user && (
              <div className="px-5 pb-4">
                <div
                  className={`flex items-center gap-3 p-3 rounded-2xl border ${
                    isPending(user)
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-sky-50 border-sky-200'
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-600 font-bold">
                    {user.name?.charAt(0) ?? '?'}
                  </div>
                  <div className="min-w-0">
                    <UserName user={user} className="font-bold text-black truncate block" />
                    <span className="text-xs text-black/50">{user.email}</span>
                  </div>
                </div>
              </div>
            )}

            <nav className="px-5 space-y-1">
              {secondaryLinks.map(({ href, label, Icon, active }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold touch-manipulation min-h-[44px] ${
                    active
                      ? 'bg-sky-500/10 text-sky-600 border border-sky-500/25'
                      : 'text-black/80 hover:bg-black/5'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{label}</span>
                </Link>
              ))}

              {!user && (
                <div className="space-y-2 pt-1">
                  <ButtonLink
                    href="/login"
                    onClick={close}
                    variant="outline"
                    size="md"
                    icon={LogIn}
                    className="w-full"
                  >
                    {t.loginBtn}
                  </ButtonLink>
                  <ButtonLink
                    href="/register"
                    onClick={close}
                    variant="primary"
                    size="md"
                    icon={PlusCircle}
                    className="w-full"
                  >
                    {t.registerBtn}
                  </ButtonLink>
                  <ButtonLink
                    href="/register/seller"
                    onClick={close}
                    variant="ghost"
                    size="md"
                    icon={UserCheck}
                    className="w-full border border-black/10"
                  >
                    {t.joinAsSeller}
                  </ButtonLink>
                </div>
              )}
            </nav>

            <div className="px-5 pt-4 pb-6 mt-2 space-y-2 border-t border-black/10">
              <button
                type="button"
                onClick={() => {
                  toggleLanguage();
                }}
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-sm font-semibold text-black/80 hover:bg-black/5 touch-manipulation min-h-[44px]"
              >
                <Languages className="h-5 w-5 text-sky-500 shrink-0" />
                <span>{language === 'en' ? 'ትግርኛ (Ge\'ez)' : 'English (ENG)'}</span>
              </button>

              {user && (
                <button
                  type="button"
                  onClick={() => {
                    close();
                    logout();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-sm font-semibold text-rose-600 hover:bg-rose-50 touch-manipulation min-h-[44px]"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span>{t.logoutBtn}</span>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
