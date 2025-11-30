// TODO: consider keeping the downstream project using vue-i18n v8
// as during the research phase when finding a migration path in
// https://siteminder-jira.atlassian.net/browse/SUI-1256
// vue-i18n v8 worked in a vue3 runtime environment
// import VueI18n, { LocaleMessage } from 'vue-i18n'
import translations from '../lang/lang-index'

/**
 * We assume that the downstream project has passed the i18n instance to us.
 *
 * We coerce the i18n object to be a VueI18n type to prevent optional chaining in vue files
 * when referencing the i18n object
*/
// const provider: { i18n: VueI18n } = { i18n: {} as VueI18n }
const provider: { i18n: any } = { i18n: {} as any }

export const useI18n = (): { i18n: any } => {

  // we create a wrapper object to maintain backwards compatibility
  // with existing sui-core code that references the i18n object
  return {
    i18n: provider.i18n.global,
  }

}

export const setup = (vueI18nInstance: unknown): void => {

  provider.i18n = vueI18nInstance

  Object.keys(translations).forEach((locale) => {

    provider.i18n?.global?.mergeLocaleMessage(locale, { 'sui-core': (translations as Record<string, any>)[locale] })
    // provider.i18n?.global?.mergeLocaleMessage(locale, { 'sui-core': (translations as Record<string, LocaleMessage>)[locale] })

  })

}
