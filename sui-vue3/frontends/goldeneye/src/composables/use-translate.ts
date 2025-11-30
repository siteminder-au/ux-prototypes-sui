import { i18n } from '@/services/i18n'
import { NamedValue } from 'vue-i18n'

export interface UseTranslate {
  t: (key: string, named?: NamedValue | number, options?: unknown) => string
  tc: (key: string, named?: NamedValue, options?: unknown) => string
  te: (key: string, locale?: string) => boolean
  n: (value: number, key?: string) => string
  d: (value: Date, key: string, locale?: string) => string
  getFullPath: (key: string) => string
}

// https://vue-i18n.intlify.dev/guide/migration/breaking.html
export const useTranslate = (path: string): UseTranslate => {
  return {
    t: (key: string, named?: NamedValue | number, options?: unknown) => {
      const combinedPath = `${path}.${key}`

      if (i18n.global.te(combinedPath, 'en')) {
        if (typeof named === 'number') {
          return i18n.global.t(combinedPath, [named]).toString()
        }

        return i18n.global.t(combinedPath, named ?? {}, options as string).toString()
      }

      return combinedPath
    },
    tc: (key: string, named?: NamedValue, options?: unknown) => {
      const combinedPath = `${path}.${key}`

      if (i18n.global.te(combinedPath, 'en')) {
        return i18n.global.t(combinedPath, named ?? {}, options as string)
      }

      return combinedPath
    },
    te: (key: string, locale?: string) => i18n.global.te(`${path}.${key}`, locale),
    n: (value: number, key = '') => i18n.global.n(value, key),
    d: (value: Date, key: string, locale = 'en') => (i18n.global.locale.value === 'en' && !locale ? i18n.global.d(value, key, 'en-gb') : i18n.global.d(value, key, locale)),
    getFullPath: (key: string) => `${path}.${key}`,
  }
}
