import { createPopperLite as createPopper, flip, offset } from '@popperjs/core'
import { SmCalendarDateParts, SmCalendarPlacement, SmCalendarPosition } from '../sm-calendar.types'

export enum MonthLabelFormatType {
  SHORT = 'short',
  LONG = 'long',
}

export interface PopperOptions {
  trigger?: Element
  content?: HTMLElement
  fallbackPlacements: boolean
  placement: SmCalendarPlacement
  position: SmCalendarPosition
  offsetDistance?: number
}

/**
 * Create a popper instance from the provided configuration
 */
export const setupPopper = ({
  trigger,
  content,
  fallbackPlacements,
  placement,
  position,
  offsetDistance = 0,
}: PopperOptions): unknown => {
  let popper

  if (!trigger || !content) {
    return
  }

  if (fallbackPlacements) {
    let fallback = [SmCalendarPlacement.TOP_START, SmCalendarPlacement.BOTTOM_START]

    if ([SmCalendarPlacement.BOTTOM_END, SmCalendarPlacement.TOP_END].includes(placement)) {
      fallback = [SmCalendarPlacement.TOP_END, SmCalendarPlacement.BOTTOM_END]
    }

    popper = createPopper(trigger, content, {
      placement,
      strategy: position,
      modifiers: [
        {
          ...flip,
          options: {
            fallbackPlacements: fallback,
          },
        },
        {
          ...offset,
          options: {
            offset: [0, offsetDistance],
          },
        },
      ],
    })
  } else {
    popper = createPopper(trigger, content, {
      placement,
      strategy: position,
      modifiers: [
        {
          ...flip,
          options: {
            fallbackPlacements: [],
          },
        },
        {
          ...offset,
          options: {
            offset: [0, offsetDistance],
          },
        },
      ],
    })
  }

  return popper
}

/**
 * Add specified number of leading characters to the value
 */
export const pad = (value: string | number | null, length = 2, char = '0'): string => {
  const val = value !== null && value !== undefined ? String(value) : ''

  return val.length >= length
    ? val
    : new Array(length - val.length + 1).join(char) + val
}

/**
 * Compute next/previous month (accepts negative integer to subtract)
 */
export const addMonths = (date: Date, count: number): Date => {
  date.setMonth(date.getMonth() + count)

  return date
}

/**
 * Parsing dates from string input is quite complex, especially since
 * browsers have different implementation of the Date API. This is a
 * quick and simple solution to handle invalid format like MM-YYYY which
 * the Date constructor cannot parse.
 *
 * If the string value is all numeric, pad values and reorder to YYYY-MM
 * by assuming the longest substring is the year. Consider using date
 * libraries like moment.js or date-fns in the future to handle more and
 * complex cases.
 *
 * This is needed because Safari and Firefox cannot parse M (single number)
 * months and month first in month-year only string is invalid for all browsers.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#month_strings
 */
export const normalizeMonthYearString = (value: string | number | Date): string | undefined => {
  if (!value || typeof value !== 'string') {
    return
  }

  const tokens = value.split(/[\s/.-]+/)

  if (tokens.length !== 2) {
    return value
  }

  const isAllNumeric = tokens.every(token => /^\d+$/.test(token))

  if (!isAllNumeric) {
    return value
  }

  return tokens
    .map((token) => {
      // Assume month
      if (token.length === 1) {
        return pad(token)
      }

      // Assume year
      if (token.length > 2) {
        return pad(token, 4)
      }

      return token
    })
    .sort((a, b) => (b.length - a.length))
    .join('-')
}

/**
 * Eliminate timezone offset which may or may not set the date to be
 * a day off depending on the current location and time
 */
export const getNormalizedDate = (date: string | number | Date): Date => {
  let d

  if (date instanceof Date) {
    d = date.setHours(0, 0, 0)
  } else if (typeof date === 'string') {
    if (isValidDate(`${date}T00:00:00`)) {
      // Remove time
      d = `${date}T00:00:00`
    } else {
      d = date
    }
  } else {
    d = date
  }

  return new Date(d)
}

/**
 * Convert value to date and parse different date parts
 */
export const getDateParts = (date: string | number | Date): { year: number, month: number } => {
  const d = getNormalizedDate(date)

  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
  }
}

/**
 * Get date from object containing individual date and time components
 * Year and month (zero-index) is required, the rest are optional
 *
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
 */
export const getDateFromParts = (dateObj: any): Date => {
  return new Date(dateObj.year, dateObj.month - 1)
}

/**
 * Creates an array of month names in the provided locale
 */
export const getMonthNames = (length: MonthLabelFormatType, locale?: string): string[] => {
  const dtf = new Intl.DateTimeFormat(locale, {
    month: length,
  })

  // Create dummy date with all twelve months to format
  return Array
    .from({ length: 12 }, (_, index) => (new Date(2000, index, 15)))
    .map(d => dtf.format(d))
}

/**
 * Checks if value can be parsed by the Date constructor
 */
export const isValidDate = (date?: string | number | Date | null): boolean => {
  if (!date) {
    return false
  }

  const d = new Date(date)

  return d instanceof Date && !Number.isNaN(d.getTime())
}

export const isValidRange = (range: SmCalendarDateParts | null): boolean => {
  if (!range) {
    return false
  }

  return !!range.start && !!range.end
}

export const dateTimeRegex = /d{1,2}|W{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|Z{1,4}|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g

/**
 * Formats the date parts to the provided mask
 */
export const formatFlags: Record<string, (dateParts: { month: number, year: number }, labels: { monthNames: string[], monthNamesLong: string[] }) => string> = {
  M: (dateParts) => {
    return `${dateParts.month}`
  },
  MM: (dateParts) => {
    return pad(dateParts.month)
  },
  MMM: (dateParts, labels) => {
    return labels.monthNames[dateParts.month - 1]
  },
  MMMM: (dateParts, labels) => {
    return labels.monthNamesLong[dateParts.month - 1]
  },
  YY: (dateParts) => {
    return String(dateParts.year).substr(2)
  },
  YYYY: (dateParts) => {
    return pad(dateParts.year, 4)
  },
  // Add more flags here once we expand support, e.g D, DD, etc.
}
