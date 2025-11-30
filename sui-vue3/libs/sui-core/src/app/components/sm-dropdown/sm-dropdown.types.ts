// NOTE: important the types are exported in a .ts file
// so that the postcompile step allows tsc to generate the .d.ts files
// which will be included as part of the build.
// This allows downstream projects to have access to these typings

export enum SmDropdownPlacement {
  BOTTOM = 'bottom',
  RIGHT = 'right',
  RIGHT_START = 'right-start',
  RIGHT_END = 'right-end',
  TOP = 'top',
}

export enum SmDropdownPosition {
  ABSOLUTE = 'absolute',
  FIXED = 'fixed',
}
