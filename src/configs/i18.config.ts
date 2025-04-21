import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import HEADER_EN from '@/locales/en/header.json';
import HEADER_VI from '@/locales/vi/header.json';
import SIDEBAR_EN from '@/locales/en/sidebar.json';
import SIDEBAR_VI from '@/locales/vi/sidebar.json';
import HOME_EN from '@/locales/en/home.json';
import HOME_VI from '@/locales/vi/home.json';
import LOGIN_EN from '@/locales/en/login.json';
import LOGIN_VI from '@/locales/vi/login.json';
import POPUP_EN from '@/locales/en/popup.json';
import POPUP_VI from '@/locales/vi/popup.json';
import ARCHIVE_EN from '@/locales/en/archive.json';
import ARCHIVE_VI from '@/locales/vi/archive.json';
import POST_EN from '@/locales/en/post.json';
import POST_VI from '@/locales/vi/post.json';

const resources = {
  en: {
    header: HEADER_EN,
    sidebar: SIDEBAR_EN,
    home: HOME_EN,
    login: LOGIN_EN,
    popup: POPUP_EN,
    archive: ARCHIVE_EN,
    post: POST_EN,
  },
  vi: {
    header: HEADER_VI,
    sidebar: SIDEBAR_VI,
    home: HOME_VI,
    login: LOGIN_VI,
    popup: POPUP_VI,
    archive: ARCHIVE_VI,
    post: POST_VI,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
  ns: Object.keys(resources.vi),
  fallbackLng: 'vi',
  interpolation: {
    escapeValue: false,
  },
});

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources.vi;
  }
  interface i18n {
    language: keyof typeof resources;
  }
}

export default i18n;