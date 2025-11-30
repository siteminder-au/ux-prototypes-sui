import { DialogOptions, dialogService } from '@siteminder/sui-core/services'

export const useDialogService = (): {
  showPromptDialog: (options?: DialogOptions) => void
  showAlertDialog: (options?: DialogOptions) => void
  showWarningDialog: (options?: DialogOptions) => void
} => {

  const defaults: DialogOptions = {
    showClose: true,
  }

  return ({
    showPromptDialog: (options = {}) => dialogService({ type: 'prompt', ...defaults, ...options }),
    showAlertDialog: (options = {}) => dialogService({ type: 'alert', ...defaults, ...options }),
    showWarningDialog: (options = {}) => dialogService({ type: 'warning', ...defaults, ...options }),
  })
}
