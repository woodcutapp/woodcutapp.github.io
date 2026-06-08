import { type i18nResourceProject } from '@woodcutapp/woodcutapp'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

import { type i18nResourceAppMenu } from '@/i18n/app-menu'
import { type i18nResourceCommon } from '@/i18n/common'
import { type i18nResourceFeature } from '@/i18n/feature'
import { type i18nResourceHome } from '@/i18n/home'
import { type i18nResourceNavigation } from '@/i18n/navigation'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: i18nResourceAppMenu & i18nResourceCommon & i18nResourceFeature & i18nResourceHome & i18nResourceNavigation & i18nResourceProject
  }
}

await i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    defaultNS: 'common',
    fallbackLng: 'en-US',
    backend: {
      loadPath: '/lang/{{lng}}/{{ns}}.json',
    },
  })

export { i18n }
