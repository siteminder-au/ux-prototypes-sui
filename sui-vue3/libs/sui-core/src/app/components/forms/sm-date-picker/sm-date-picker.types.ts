// NOTE: important the types are exported in a .ts file
// so that the postcompile step allows tsc to generate the .d.ts files
// which will be included as part of the build.

// there are no type declarations for these v-calendar modules
// which is used by typescript for type checking the contents of the module
// we just declare them here in a .ts file to avoid vue-tsc errors.
// putting them here also makes it available to import by downstream projects
// Wait until v-calendar has type declarations for these modules and publishes a separate types package e.g. @types/v-calendar.
export { type CalendarDay } from 'v-calendar/dist/types/src/utils/page.js'
export { type DateRangeSource } from 'v-calendar/dist/types/src/utils/date/range.js'

// This allows downstream projects to have access to these typings
export enum SmDatePickerMode {
  DATE = 'date',
  DATE_TIME = 'dateTime',
  TIME = 'time',
}

// Used internally by the component to style the input fields
export enum SmDatePickerInputMode {
  END = 'end',
  START = 'start',
}

export type SmDatePickerModelValue = Date | object | number | string | null

export type SmDatePickerModelValueInput = string | number | null | undefined
