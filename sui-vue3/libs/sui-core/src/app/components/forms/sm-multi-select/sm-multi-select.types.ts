// NOTE: important the types are exported in a .ts file
// so that the postcompile step allows tsc to generate the .d.ts files
// which will be included as part of the build.
// This allows downstream projects to have access to these typings

type SmMultiSelectOptionCode = string | number

export type SmMultiSelectModelValue = SmMultiSelectOptionCode | SmMultiSelectOptionCode[] | undefined | null

export interface SmMultiSelectOption {
  label: string
  code: SmMultiSelectOptionCode
  disabled?: boolean
  description?: string
}

export interface SmMultiSelectGroupOption {
  title?: string // Group title
  libs?: SmMultiSelectOption[] // Group options
}

/**
 * INTERNAL USE ONLY
 *
 * Internal state of the component, used to generate the dropdown list items
 * including the group labels and select group/all options
 */
export type SmMultiSelectItem = Partial<SmMultiSelectOption> & {
  isSelected?: boolean
  groupLabel?: string
  // Group label/title
  isTitle?: boolean
  title?: string
  // Standard select all
  isSelectAll?: boolean
  // Group select all
  isGroupSelect?: boolean
  isGroupSelected?: boolean
  validGroupOptions?: SmMultiSelectItem[]
  ariaSelected?: boolean
  ariaDisabled?: boolean
}

/**
 * INTERNAL USE ONLY
 *
 * Exposed methods for the main component to use
 */
export interface SmMultiSelectInputExposed {
  openList: () => void
  closeList: () => void
}
