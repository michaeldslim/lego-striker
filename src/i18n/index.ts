import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { AppLanguage } from '../types/settings';
import en from './locales/en.json';
import ko from './locales/ko.json';

export function getDeviceLanguage(): AppLanguage {
  const code = Localization.getLocales()[0]?.languageCode;
  return code === 'ko' ? 'ko' : 'en';
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ko: { translation: ko },
  },
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
