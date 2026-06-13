'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MobileBottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  desktopMaxWidth?: string;
  ariaLabel?: string;
}

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isMobile;
}

export default function MobileBottomSheet({
  open,
  onClose,
  children,
  desktopMaxWidth = 'max-w-lg',
  ariaLabel = 'Dialog',
}: MobileBottomSheetProps) {
  const isMobile = useIsMobileViewport();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm touch-manipulation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            className={cn(
              'fixed z-[60] bg-white border border-black/10 text-black shadow-2xl overflow-hidden touch-manipulation',
              isMobile
                ? 'inset-x-0 bottom-0 rounded-t-3xl max-h-[90dvh] overflow-y-auto w-full border-t'
                : cn(
                    'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl w-full',
                    desktopMaxWidth,
                  ),
            )}
            style={isMobile ? { paddingBottom: 'var(--safe-bottom)' } : undefined}
            initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.96, y: 8 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: isMobile ? 32 : 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {isMobile && (
              <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-white z-10">
                <div className="h-1 w-10 rounded-full bg-black/15" aria-hidden="true" />
              </div>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
