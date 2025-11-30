import { UseTranslate } from './use-translate'

interface UseFormatDateTime {
  formatDate: (dateString: string) => string
  formatDateTime: (dateTimeString: string) => string
  formatDateRange: (fromDateString: string, toDateString: string) => string
}

export const useFormatDateTime = (d: UseTranslate['d']): UseFormatDateTime => ({
  formatDate: (dateString: string): string => d(new Date(dateString), 'date'),
  formatDateTime: (dateTimeString: string): string => d(new Date(dateTimeString), 'date-time'),
  formatDateRange: (fromDateString: string, toDateString: string): string => `${d(new Date(fromDateString), 'date')} ${'\u{2013}'} ${d(new Date(toDateString), 'date')}`,
})
