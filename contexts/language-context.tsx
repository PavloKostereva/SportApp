import { useTranslation } from 'react-i18next';
import { Language } from '@/types';
import { changeLanguage, getLanguageName } from '@/i18n/config';

export function useLanguage() {
  const { t, i18n } = useTranslation();

  return {
    language: i18n.language as Language,
    setLanguage: changeLanguage,
    t: (key: string) => t(key),
  };
}

export { getLanguageName };
