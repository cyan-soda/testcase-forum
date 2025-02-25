import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLanguage } from '@/utils/local-storage'

import HEADER_EN from '@/locales/en/header.json'
import HEADER_VI from '@/locales/vi/header.json'
import SIDEBAR_EN from '@/locales/en/sidebar.json'
import SIDEBAR_VI from '@/locales/vi/sidebar.json'
import HOME_EN from '@/locales/en/home.json'
import HOME_VI from '@/locales/vi/home.json'

const resources = {
    en: {
        header: HEADER_EN,
        sidebar: SIDEBAR_EN,
        home: HOME_EN
    },
    vi: {
        header: HEADER_VI,
        sidebar: SIDEBAR_VI,
        home: HOME_VI
    }
}

const currLang = getLanguage() || 'vi'

i18n.use(initReactI18next).init({
    resources,
    lng: currLang,
    ns: Object.keys(resources.vi),
    fallbackLng: currLang,
    interpolation: {
        escapeValue: false
    }
})

declare module "i18next" {
    interface CustomTypeOptions {
        resources: typeof resources.vi
    }
    interface i18n {
        language: keyof typeof resources
    }
}

export default i18n