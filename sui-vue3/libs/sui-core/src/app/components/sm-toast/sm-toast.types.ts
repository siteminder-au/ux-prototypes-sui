// NOTE: important the types are exported in a .ts file
// so that the postcompile step allows tsc to generate the .d.ts files
// which will be included as part of the build.
// This allows downstream projects to have access to these typings
export enum SmToastType {
  ALERT = 'alert',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export enum SmToastPlacement {
  BOTTOM = 'bottom',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  STATIC = 'static',
  TOP = 'top',
  TOP_RIGHT = 'top-right',
  TOP_LEFT = 'top-left',
}
