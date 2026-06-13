'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface MobileMoreContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const MobileMoreContext = createContext<MobileMoreContextValue | null>(null);

export function MobileMoreProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return <MobileMoreContext.Provider value={value}>{children}</MobileMoreContext.Provider>;
}

export function useMobileMore(): MobileMoreContextValue {
  const ctx = useContext(MobileMoreContext);
  if (!ctx) throw new Error('useMobileMore must be used within MobileMoreProvider');
  return ctx;
}
