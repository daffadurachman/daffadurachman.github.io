'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { UI_DICTIONARY, type PortfolioLocale, type UiDictionary } from '@/lib/i18n';

const STORAGE_KEY = 'portfolio-locale';

interface LocaleContextValue {
  locale: PortfolioLocale;
  setLocale: (next: PortfolioLocale) => void;
  toggleLocale: () => void;
  t: UiDictionary;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'id',
  setLocale: () => {},
  toggleLocale: () => {},
  t: UI_DICTIONARY.id,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Always initialize 'id' during SSR and first client render to guarantee zero hydration mismatch.
  const [locale, setLocaleState] = useState<PortfolioLocale>('id');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'id') {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // Ignore storage access errors in restricted browsing modes
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      if (event.newValue === 'en' || event.newValue === 'id') {
        setLocaleState(event.newValue);
        document.documentElement.lang = event.newValue;
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setLocale = useCallback((next: PortfolioLocale) => {
    setLocaleState(next);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage write errors
    }
    trackEvent('locale_change', { locale: next });
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'id' ? 'en' : 'id');
  }, [locale, setLocale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t: UI_DICTIONARY[locale],
    }),
    [locale, setLocale, toggleLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
