'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/utils/local-storage';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    if (language && language !== i18n.language && ['en', 'vi'].includes(language)) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return <>{children}</>;
}