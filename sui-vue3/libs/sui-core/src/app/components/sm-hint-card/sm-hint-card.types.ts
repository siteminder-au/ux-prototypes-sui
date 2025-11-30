// NOTE: important the types are exported in a .ts file
// so that the postcompile step allows tsc to generate the .d.ts files
// which will be included as part of the build.
// This allows downstream projects to have access to these typings
import { SmButtonProps } from '../sm-button/sm-button.types'

export interface SmHintCardAction extends SmButtonProps {
  label: string
  onClick?: (event: MouseEvent) => void
  // We allow any other attributes to pass-through
  // For example custom data attributes for analytics or test automation
  [key: string]: unknown
}
