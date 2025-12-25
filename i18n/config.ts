import { Language } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en/translation.json';
import es from '../locales/es/translation.json';
import pl from '../locales/pl/translation.json';
import uk from '../locales/uk/translation.json';

const LANGUAGE_KEY = 'app_language';

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        callback(savedLanguage);
      } else {
        callback('uk');
      }
    } catch (error) {
      callback('uk');
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lng);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources: {
      uk: { translation: uk },
      en: { translation: en },
      pl: { translation: pl },
      es: { translation: es },
    },
    fallbackLng: 'uk',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export const changeLanguage = async (lng: Language) => {
  await i18n.changeLanguage(lng);
  await AsyncStorage.setItem(LANGUAGE_KEY, lng);
};

export const getLanguageName = (lang: Language): string => {
  const names: Record<Language, string> = {
    uk: 'Українська',
    en: 'English',
    pl: 'Polski',
    es: 'Español',
  };
  return names[lang];
};

export default i18n;
