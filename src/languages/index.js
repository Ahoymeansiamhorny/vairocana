import { createI18n } from 'vue-i18n'
// import { getBrowserLang } from '@/utils'

import zh from './modules/zh'
import en from './modules/en'

const numberFormats = {
  MYR: {
    currency: {
      style: 'currency',
      currency: 'MYR'
    },
    decimal: {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    },
    percent: {
      style: 'percent',
      useGrouping: false
    }
  }
}

const i18n = createI18n({
  // Use Composition API, Set to false
  allowComposition: true,
  globalInjection: true,
  legacy: false,
  locale: 'zh', // getBrowserLang(),
  fallbackLocale: 'zh',
  numberFormats,
  messages: {
    zh,
    en
  }
})

export default i18n
