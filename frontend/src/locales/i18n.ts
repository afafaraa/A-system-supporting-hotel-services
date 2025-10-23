import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {enUS, Locale, pl} from "date-fns/locale";

import translationEN from './en/translation.json';
import translationPL from './pl/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      pl: { translation: translationPL },
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      convertDetectedLanguage: (lng) => {
        if (lng.startsWith("en-")) return "en";
        else if (lng.startsWith("pl-")) return "pl";
        else return lng;
      },
    },
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => null);


const localeMap: Record<string, Locale> = {
  "pl-PL": pl,
  "en-US": enUS,
} as const;

export const getDateFnsLocale = (locale: string): Locale => localeMap[locale] || enUS;
