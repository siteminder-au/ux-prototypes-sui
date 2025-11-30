export type DatePickerType = string | number | object | Date | unknown[] | null | undefined

export type ValidDateType = string | number | Date

/**
 * Returns the number of milliseconds since midnight in a given timezone
 */
const getMsSinceMidnight = (tz?: string): number => {
  // coerce empty string, null, undefined to undefined
  const validTimeZone = !tz ? undefined : tz
  const tzString = new Date().toLocaleString('en-US', { timeZone: validTimeZone })
  const tzDate = new Date(tzString) // in local time
  const diff = tzDate.getTime() - tzDate.setHours(0, 0, 0, 0)
  return diff
}

const transformDate = (baseDate: ValidDateType, dateToTransform: number): ValidDateType => {
  // case 1: string type
  // we ignore masks as it just overcomplicates things
  if (typeof baseDate === 'string') {
    return new Date(dateToTransform).toISOString()
  }

  // case 2: number type
  if (typeof baseDate === 'number') {
    return new Date(dateToTransform).getTime()
  }

  // case 3: fallback to Date object
  return new Date(dateToTransform)
}

/**
 * This function mainly patches these current v-calendar issues:
 * - https://github.com/nathanreyes/v-calendar/issues/1204
 * - https://github.com/nathanreyes/v-calendar/issues/1094
 * CURRENT BEHAVIOUR: v-calendar now uses midnight in the given timezone for the value.
 * PREVIOUS BEHAVIOUR: v-calendar uses current date *and* time in the given timezone for the value.
 * This function attempts to revert the behaviour to the old v-calendar behaviour by adding the additional
 * time between midnight and the current time
 */
export const addTimeSinceMidnight = (state?: DatePickerType, timezone?: string): DatePickerType => {
  const msFromMidnight = getMsSinceMidnight(timezone)

  // date range
  if (isValidDateRange(state)) {
    const startEndDate = state as { start: ValidDateType, end: ValidDateType }
    const startDate = new Date(startEndDate.start)
    const endDate = new Date(startEndDate.end)

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      // give back original unmodified state
      return state
    }

    const msToAddForStartDate = startDate.getTime() + msFromMidnight
    const msToAddForEndDate = endDate.getTime() + msFromMidnight

    // ensure they are returned in the same type we received them
    return {
      start: transformDate(state as ValidDateType, msToAddForStartDate),
      end: transformDate(state as ValidDateType, msToAddForEndDate),
    }
  }

  // single date
  const singleDate = new Date(state as ValidDateType)
  if (Number.isNaN(singleDate.getTime())) {
    // give back original unmodified state
    return state
  }

  const msToAddForSingleDate = singleDate.getTime() + msFromMidnight

  // ensure they are returned in the same type we received them
  return transformDate(state as ValidDateType, msToAddForSingleDate)
}

/**
 * Checks if the value passed in the following shape:
 * { start: DatePickerType, end: DatePickerType }
 */
const isStartEndDateObject = (value: DatePickerType): boolean => {
  return !!value
    && typeof value === 'object'
    && 'start' in value
    && 'end' in value
}

export const isValidDatePickerValue = (value: DatePickerType): boolean => {
  // check if it's a date range
  if (isStartEndDateObject(value)) {
    // safe to cast to object with start/end since we made the isStartEndDateObject check
    const startEndDate = value as { start: DatePickerType, end: DatePickerType }
    return !!startEndDate.start
  }

  // for single date
  return !!value
}

/**
 * Check if date range is valid, i.e. has start and end dates
 */
export const isValidDateRange = (value: DatePickerType): boolean => {
  if (!isStartEndDateObject(value)) {
    return false
  }

  // safe to cast to object with start/end since we made the isStartEndDateObject check
  const startEndDate = value as { start: DatePickerType, end: DatePickerType }
  return !!startEndDate.start && !!startEndDate.end
}
