// NOTE: important the types are exported in a .ts file
// so that the postcompile step allows tsc to generate the .d.ts files
// which will be included as part of the build.
// This allows downstream projects to have access to these typings
export enum SmTableThSortingOrder {
  ASC = 'asc',
  DESC = 'desc',
}
