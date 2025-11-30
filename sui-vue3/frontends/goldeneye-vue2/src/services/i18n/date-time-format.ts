import { DateTimeFormat, DateTimeFormats } from 'vue-i18n'

/**
 * Added ts-ignores for formats using `hour12: false because Chrome has an issue
 * with `hour12: false` where it's showing 24:00:00 instead of 00:00:00 because
 * it's using `h24` hour cycle by default. Removed hour12 declaration as well since
 * its prioritized over hourCycle.
*/
export const dateTimeFormat: DateTimeFormat = {
  'date-time': {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  },
  time: {
    hour: 'numeric',
    minute: 'numeric',
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore for formats using hourCycle
    hourCycle: 'h23',
  },
  date: {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  },
}

export const dateTimeFormats: DateTimeFormats = {}
