// NOTE: important the types are exported in a .ts file
// so that the postcompile step allows tsc to generate the .d.ts files
// which will be included as part of the build.
// This allows downstream projects to have access to these typings
export interface FieldMeta {
  touched?: boolean // if the field has been blurred (via handleBlur)
  dirty?: boolean // if the field has been manipulated (via handleChange)
  valid?: boolean // if the field doesn't have any errors
  validated?: boolean // if the field has been validated
  pending?: boolean // if validation is in progress
}
