// NOTE: important the types are exported in a .ts file
// so that the postcompile step allows tsc to generate the .d.ts files
// which will be included as part of the build.
// This allows downstream projects to have access to these typings
export enum SmBadgeLightThemeType {
  ALERT = 'alert',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export enum SmBadgeSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum SmBadgeType {
  ALERT = 'alert',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export interface SmBadgeProps {
  /**
   * Whether the badge is disabled
   */
  disabled?: boolean
  /**
   * The light theme badges. Accepts: success, info, warning, alert
   */
  lightThemeType?: SmBadgeLightThemeType | null
  /**
   * The size of the badges. Accepts: medium, small, large
   */
  size?: SmBadgeSize
  /**
   * The colour of the badges. Accepts: success, info, warning, alert
   */
  type?: SmBadgeType
}
