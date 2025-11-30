export interface SmCalendarDateParts {
  // Standard
  month?: number
  year?: number
  // Range
  start?: SmCalendarDateParts | null
  end?: SmCalendarDateParts | null
  // Add other properties like `day` when we expand support
}

export interface SmCalendarMask {
  input?: string // Format the text in the input field
  // Add other options here when we expand support
}

export interface SmCalendarYearRange {
  start: number
  end: number
}

// Determines what date parts can be chosen
export enum SmCalendarMode {
  MONTH_YEAR = 'month-year',
  YEAR = 'year',
}

// Determines what date part is currently in view
export enum SmCalendarView {
  MONTH = 'month',
  YEAR = 'year',
}

export enum SmCalendarRangePart {
  START = 'start',
  END = 'end',
}

// as there are several components that use popperjs and can benefit from this enum
export enum SmCalendarPosition {
  ABSOLUTE = 'absolute',
  FIXED = 'fixed',
}

// aggregated from Placement from '@popperjs/core'
// as there are several components that use popperjs and can benefit from this enum
export enum SmCalendarPlacement {
  AUTO = 'auto',
  AUTO_END = 'auto-end',
  AUTO_START = 'auto-start',
  BOTTOM = 'bottom',
  BOTTOM_END = 'bottom-end',
  BOTTOM_START = 'bottom-start',
  LEFT = 'left',
  LEFT_END = 'left-end',
  LEFT_START = 'left-start',
  RIGHT = 'right',
  RIGHT_END = 'right-end',
  RIGHT_START = 'right-start',
  TOP = 'top',
  TOP_END = 'top-end',
  TOP_START = 'top-start',
}
