import { i18n } from '@/services/i18n'

export interface UseTranslate {
  t: (key: string, ...args: any[]) => string
  tc: (key: string, ...args: any[]) => string
  te: (key: string, locale?: string) => boolean
  n: (value: number, key?: string) => string
  d: (value: Date, key: string, locale?: string) => string
  getFullPath: (key: string) => string
}

export const useTranslate = (path: string): UseTranslate => {
  return {
    t: (key: string, ...args: any[]) => {
      const combinedPath = `${path}.${key}`

      if (i18n.te(combinedPath, 'en')) {
        return i18n.t(combinedPath, ...args).toString()
      }

      return combinedPath
    },
    tc: (key: string, ...args: any[]) => {
      const combinedPath = `${path}.${key}`

      if (i18n.te(combinedPath, 'en')) {
        return i18n.tc(combinedPath, ...args)
      }

      return combinedPath
    },
    te: (key: string, locale?: string) => i18n.te(`${path}.${key}`, locale),
    n: (value: number, key?: string) => i18n.n(value, key),
    d: (value: Date, key: string, locale?: string) => (i18n.locale === 'en' && !locale ? i18n.d(value, key, 'en-gb') : i18n.d(value, key, locale)),
    getFullPath: (key: string) => `${path}.${key}`,
  }
}
