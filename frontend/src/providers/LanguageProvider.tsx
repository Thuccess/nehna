'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Language } from '@adulis/shared';
import { translations, type TranslationKeys } from '@/lib/translations';

type TranslationDict = Record<TranslationKeys, string>;

interface LanguageContextValue {
  language: Language;
  t: TranslationDict;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'adulis_lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'ti') setLanguageState(saved);
    } catch {
      // ignore (SSR / private mode)
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'ti' : 'en');
  }, [language, setLanguage]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      t: translations[language],
      setLanguage,
      toggleLanguage,
    }),
    [language, setLanguage, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export function useT(): (key: TranslationKeys) => string {
  const { t } = useLanguage();
  return (key) => t[key];
}
