// NOTE: important the types are exported in a .ts file
// so that the postcompile step allows tsc to generate the .d.ts files
// which will be included as part of the build.
// This allows downstream projects to have access to these typings
export enum SmTooltipTheme {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum SmTooltipTrigger {
  CLICK = 'click',
  HOVER = 'hover',
}

export enum SmTooltipType {
  ALERT = 'alert',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export enum SmTooltipPlacement {
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
}

export enum SmTooltipPosition {
  ABSOLUTE = 'absolute',
  FIXED = 'fixed',
}
