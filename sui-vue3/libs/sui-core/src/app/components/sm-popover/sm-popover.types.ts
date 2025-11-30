// NOTE: important the types are exported in a .ts file
// so that the postcompile step allows tsc to generate the .d.ts files
// which will be included as part of the build.
// This allows downstream projects to have access to these typings
export enum SmPopoverPlacement {
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
}

export enum SmPopoverType {
  ALERT = 'alert',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export enum SmPopoverTrigger {
  CLICK = 'click',
  FOCUS = 'focus',
  HOVER = 'hover',
}

export enum SmPopoverPosition {
  ABSOLUTE = 'absolute',
  FIXED = 'fixed',
}

export enum SmPopoverTextAlign {
  CENTER = 'center',
  LEFT = 'left',
  RIGHT = 'right',
}
