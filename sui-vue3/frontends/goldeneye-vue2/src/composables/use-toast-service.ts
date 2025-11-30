import { ToastOptions, toastService } from '@siteminder/sui-core'

export const useToastService = (): {
  showInfoToast: (message: string, options?: ToastOptions) => void
  showSuccessToast: (message: string, options?: ToastOptions) => void
  showAlertToast: (message: string, options?: ToastOptions) => void
  showWarningToast: (message: string, options?: ToastOptions) => void
} => {

  const defaults: ToastOptions = {
    placement: 'top',
    showClose: true,
  }

  return ({
    showInfoToast: (message: string, options = {}) => toastService({ message, type: 'info', ...defaults, ...options }),
    showSuccessToast: (message: string, options = {}) => toastService({ message, type: 'success', ...defaults, ...options }),
    showAlertToast: (message: string, options = {}) => toastService({ message, type: 'alert', ...defaults, ...options }),
    showWarningToast: (message: string, options = {}) => toastService({ message, type: 'warning', ...defaults, ...options }),
  })
}
