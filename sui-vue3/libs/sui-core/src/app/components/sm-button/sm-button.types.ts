// NOTE: important the types are exported in a .ts file
// so that the postcompile step allows tsc to generate the .d.ts files
// which will be included as part of the build.
// This allows downstream projects to have access to these typings
export enum SmButtonShape {
  ROUND = 'round',
  SQUARE = 'square',
}

export enum SmButtonSize {
  LARGE = 'large',
  MEDIUM = 'medium',
  MINI = 'mini',
  SMALL = 'small',
}

export enum SmButtonType {
  ALERT = 'alert',
  DEFAULT = 'default',
  INFO = 'info',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SECONDARY_SUCCESS = 'secondary-success',
  SECONDARY_WARNING = 'secondary-warning',
  SUCCESS = 'success',
  TERTIARY = 'tertiary',
  TEXT = 'text',
  TEXT_SUCCESS = 'text-success',
  TEXT_WARNING = 'text-warning',
  WARNING = 'warning',
}

// Duplicates inlined defineProps from the vue file
// Keep them in sync until https://github.com/vuejs/core/issues/8301 is resolved
export interface SmButtonProps {
  /**
   * Native `autofocus`
   */
  autofocus?: boolean
  /**
   * Determine whether it's disabled
   */
  disabled?: boolean
  /**
   * This events include handlers for events that ultimately assign new dates and manage the appearance of the popover in in date-picker component
   */
  eventBinding?: unknown[] | object | number | null
  /**
   * A URL to link to using a native anchor element
   */
  href?: string
  /**
   * Determine whether it's loading
   */
  loading?: boolean
  /**
   * Native `type` - Accepts 'button' / 'submit' / 'reset'
   */
  nativeType?: string
  /**
   * An sm-icon name, to be placed left of the content
   */
  prefixIcon?: string
  /**
   * The button's shape. Accepts: 'round' and 'square'
   */
  shape?: SmButtonShape | null
  /**
   * The size of the button. Accepts: 'large', 'medium', 'small'
   * @deprecated The "mini" size will be deprecated and removed in the future version.
   */
  size?: SmButtonSize
  /**
   * An sm-icon name, to be placed right of the content
   */
  suffixIcon?: string
  /**
   * A `router-link` path or object
   */
  to?: string | object
  /**
   * The style of the button. Accepts 'text', 'primary', 'secondary', 'tertiary', 'success', 'alert', 'warning'
   * @deprecated The "info" type will be deprecated and removed in the future version.
   */
  type?: SmButtonType
}
