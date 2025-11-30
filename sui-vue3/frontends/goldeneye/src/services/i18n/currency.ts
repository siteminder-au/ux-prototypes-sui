import { isNil } from 'lodash'
// import { i18n } from '@/services/i18n'

const i18n = { locale: 'en' }
declare namespace Intl {
  interface Options {
    type: 'currency'
  }

  class DisplayNames {
    constructor(a: string[], b: Options)
    public of: (a: string) => string
  }
}

export const translate = (currency: any) => {
  const { locale } = i18n
  const { name, isoCode } = currency
  let displayName = name

  try {
    const currencyNameProvider = new Intl.DisplayNames([locale], { type: 'currency' })
    displayName = currencyNameProvider.of(isoCode)
  } catch (_) {
    if (isNil(displayName)) {
      throw new Error('Invalid currency!')
    }
  }

  return displayName
}
