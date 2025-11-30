// NOTE: important the types are exported in a .ts file
// so that the postcompile step allows tsc to generate the .d.ts files
// which will be included as part of the build.
// This allows downstream projects to have access to these typings
export enum SmInputResize {
  BOTH = 'both',
  HORIZONTAL = 'horizontal',
  NONE = 'none',
  VERTICAL = 'vertical',
}

export enum SmInputType {
  EMAIL = 'email',
  NUMBER = 'number',
  PASSWORD = 'password',
  PHONE = 'phone',
  SEARCH = 'search',
  TEL = 'tel',
  TEXT = 'text',
  TEXTAREA = 'textarea',
  URL = 'url',
}

export enum SmInputValidationMode {
  AGGRESSIVE = 'aggressive',
  LAZY = 'lazy',
}

export type SmInputModelValue = string | number | any[] | null | undefined
