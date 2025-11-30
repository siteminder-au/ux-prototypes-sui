import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { localize } from 'vee-validate'
import { get } from 'lodash'
import { dateTimeFormats, dateTimeFormat } from './date-time-format'

Vue.use(VueI18n)

// Since this is a test project, these translations were generated
// using Github Copilot and/or Google Translate. Don't copy these
// into official, client-facing projects or libraries. Those still
// need to go through the Translations team.
const enMessages = require('@/lang/sui-goldeneye-vue2-en.json')
const deMessages = require('@/lang/sui-goldeneye-vue2-de.json')
const thMessages = require('@/lang/sui-goldeneye-vue2-th.json')

export const languageFilePrefix = 'sui-goldeneye-vue2'

export const supportedLocales = [
  'de',
  'en',
  'th',
]

export const languageMap = {
  de: 'de',
  en: 'en',
  en_gb: 'en', // map to en locale
  'en-gb': 'en', // map to en locale
  th: 'th',
} as Record<string, string>

supportedLocales.forEach((locale) => {
  dateTimeFormats[locale] = dateTimeFormat
})
dateTimeFormats['en-gb'] = dateTimeFormat

const messages = {
  en: enMessages,
  // Pre-load other languages here, but it can be lazy loaded too
  // https://kazupon.github.io/vue-i18n/guide/lazy-loading.html
  de: deMessages,
  th: thMessages,
}

export const i18n = new VueI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en',
  silentFallbackWarn: true,
  messages,
  dateTimeFormats,
})

const loadedLanguages = ['en'] // our default language that is prelaoded

const setI18nLanguage = (lang: string): string => {
  i18n.locale = lang

  // Get localized rules from previously installed sui-core
  // Casting is required because the type for validationDictionary expected by the localize function is incomplete:
  // type ValidationMessageTemplate = string | ValidationMessageGenerator
  // It also accepts an object of key-value string pairs.
  const validationDictionary = get(i18n, `messages[${lang}]['sui-core'].libs['vee-validate']['vee-validate']`) as Record <string, string>

  if (validationDictionary) {
    // Install and activate vee-validate locale
    localize(lang, { messages: validationDictionary })
  }

  document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}

const loadLanguage = async (lang: string): Promise<void> => {
  const localeTranslations = await import(`@/lang/${languageFilePrefix}-${lang}.json`)

  // apply the new translations
  // it's important we use mergeLocaleMessage
  // so we don't override the other messages already added
  // to the i18n instance (e.g. the sui-core in-built translations)
  i18n.mergeLocaleMessage(lang, localeTranslations)

  setI18nLanguage(lang)
}

export const loadLanguageAsync = async (language: string): Promise<void> => {
  // we need to transform here
  // since some locales we want to rewire to english (en)
  const lang = languageMap[language]

  // locale didn't change
  if (i18n.locale === lang) {
    return
  }

  // we already loaded the language file in the webapp
  if (loadedLanguages.includes(lang)) {
    return loadLanguage(lang)
  }

  // we have not loaded the language file yet
  // check if it's a supported language first
  if (supportedLocales.includes(lang)) {
    await loadLanguage(lang)
    loadedLanguages.push(lang)
    return
  }

  // don't show message if the user is using UK locale
  // Consider having two separate translation files for English (US) and English (UK)
  // if (lang !== 'en_gb' && lang !== 'en-gb') {
  //   SmMessage({
  //     message: `Unsupported locale "${lang}". Falling back to English (UK)`,
  //     type: 'warning',
  //   })
  // }

  // the user's locale is not supported, fallback to English
  return loadLanguage('en')
}
