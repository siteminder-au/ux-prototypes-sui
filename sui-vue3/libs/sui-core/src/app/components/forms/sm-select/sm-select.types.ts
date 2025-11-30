// NOTE: important the types are exported in a .ts file
// so that the postcompile step allows tsc to generate the .d.ts files
// which will be included as part of the build.
// This allows downstream projects to have access to these typings
export type SmSelectModelValue = string | number | object | unknown[] | undefined | null

export interface SmSelectOptionLibs {
  label: string
  code: any
  $isDisabled?: boolean
  description?: string
  truncateDescription?: boolean
  truncateLabel?: boolean
}

export interface SmSelectOption {
  // Standard option
  label?: string // Grouped option details is in `libs`
  code?: any // Grouped option details is in `libs`
  $isDisabled?: boolean
  description?: string
  truncateDescription?: boolean
  truncateLabel?: boolean
  // Grouped option
  libs?: SmSelectOptionLibs[]
  title?: string
}
