'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from './utils';

type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  toast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, kind: ToastKind = 'success') => {
      const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setItems((prev) => [...prev, { id, message, kind }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className={cn(
                'pointer-events-auto flex max-w-md items-start gap-3 rounded-xl border border-black/10 bg-white/95 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur',
                item.kind === 'success' && 'border-flag-green-500/35',
                item.kind === 'error' && 'border-flag-red-500/40',
              )}
            >
              <div className="mt-0.5 shrink-0">
                {item.kind === 'success' && (
                  <CheckCircle2 className="h-5 w-5 text-flag-green-500" />
                )}
                {item.kind === 'error' && <AlertCircle className="h-5 w-5 text-flag-red-500" />}
                {item.kind === 'info' && <Info className="h-5 w-5 text-flag-blue-500" />}
              </div>
              <p className="text-sm leading-snug text-black/85">{item.message}</p>
              <button
                onClick={() => dismiss(item.id)}
                className="ml-2 shrink-0 rounded-md p-1 text-black/50 transition-colors hover:bg-black/5 hover:text-black/85"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
