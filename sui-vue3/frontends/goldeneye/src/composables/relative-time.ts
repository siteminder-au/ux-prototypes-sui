// import { i18n } from '@/services/i18n'
import { useTranslate } from './use-translate'

const i18n = { locale: 'en' }
const { t, tc } = useTranslate('composables.relative-time')
const DEFAULT_LOCALE = 'en-AU'

export const differenceInTimeString = (differenceInMilliseconds: number, fromDate = 0): string => {
  const MILLISECONDS_IN_MINUTE = 1000 * 60
  const MILLISECONDS_IN_HOUR = MILLISECONDS_IN_MINUTE * 60
  const minutes = Math.floor(differenceInMilliseconds / MILLISECONDS_IN_MINUTE)

  if (minutes <= 15) {
    return t('relative-time-few-minutes')
  }

  if (minutes > 15 && minutes <= 45) {
    return t('relative-time-half-hour')
  }
  if (minutes > 45 && minutes <= 90) {
    return t('relative-time-hour')
  }

  if (minutes > 90 && minutes <= 23 * 60) {
    const hours = Math.floor(differenceInMilliseconds / MILLISECONDS_IN_HOUR)
    return tc('relative-time-hours', { hours }, hours)
  }

  const days = Math.floor(differenceInMilliseconds / (MILLISECONDS_IN_HOUR * 24))

  if (days === 1) {
    return t('relative-time-yesterday')
  }

  if (days >= 2 && days < 7) {
    return tc('relative-time-days', { days }, days)
  }

  if (days >= 7 && days < 14) {
    return t('relative-time-last-week')
  }
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' }
  const date = new Date(fromDate - differenceInMilliseconds).toLocaleString(i18n.locale === 'en' ? DEFAULT_LOCALE : i18n.locale, options)
  return tc('relative-time-date', { date }, date)
}
