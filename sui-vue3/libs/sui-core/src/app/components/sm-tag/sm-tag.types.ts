// NOTE: important the types are exported in a .ts file
// so that the postcompile step allows tsc to generate the .d.ts files
// which will be included as part of the build.
// This allows downstream projects to have access to these typings
export enum SmTagType {
  ALERT = 'alert',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export enum SmTagSize {
  LARGE = 'large',
  MEDIUM = 'medium',
  SMALL = 'small',
}
