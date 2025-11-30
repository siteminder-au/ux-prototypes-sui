import { h, createApp, ref, App } from 'vue'
import SmDialog from '../components/sm-dialog/sm-dialog.vue'

export interface DialogOptions {
  type?: 'prompt' | 'alert' | 'warning'
  title?: string
  bodyContent?: string
  fullscreen?: boolean
  beforeClose?: (close: () => void) => any
  beforeConfirm?: (operation: () => void) => any
  showClose?: boolean
  showCancel?: boolean
  showConfirm?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  customClass?: string
  cancelButtonText?: string
  cancelButtonType?: string
  confirmButtonText?: string
  confirmButtonType?: string
  lockScroll?: boolean
  top?: string
  cancelButtonLoading?: boolean
  cancelButtonDisabled?: boolean
  confirmButtonLoading?: boolean
  confirmButtonDisabled?: boolean
  contentClass?: string
}

export const dialogService = (inputOptions: DialogOptions) => {

  const options = {
    ...inputOptions,
  }

  // true by default when dialogService is called for backwards compatibility
  const visible = ref(true)

  // TODO: it seems that in vue3 we lose the animation on open of the dialog
  // investigate this in the future in https://siteminder-jira.atlassian.net/browse/SUI-1593
  const dialogVNode = h(
    // TODO: vue still has issues with the type of SmDialog, revisit this when we port over SmDialog to script setup
    // see: https://siteminder-jira.atlassian.net/browse/SUI-1692
    SmDialog as any,
    {
      type: options.type,
      title: options.title,
      bodyContent: options.bodyContent,
      fullscreen: options.fullscreen,
      beforeClose: options.beforeClose,
      beforeConfirm: options.beforeConfirm,
      showClose: options.showClose,
      showCancel: options.showCancel,
      showConfirm: options.showConfirm,
      closeOnClickModal: options.closeOnClickModal,
      closeOnPressEscape: options.closeOnPressEscape,
      customClass: options.customClass,
      cancelButtonText: options.cancelButtonText,
      cancelButtonType: options.cancelButtonType,
      confirmButtonText: options.confirmButtonText,
      confirmButtonType: options.confirmButtonType,
      lockScroll: options.lockScroll,
      top: options.top,
      cancelButtonLoading: options.cancelButtonLoading,
      cancelButtonDisabled: options.cancelButtonDisabled,
      confirmButtonLoading: options.confirmButtonLoading,
      confirmButtonDisabled: options.confirmButtonDisabled,
      contentClass: options.contentClass,
      visible,
    },
  )

  // see reference file on how to create app instances for floating elements:
  // https://github.com/Akryum/floating-vue/blob/main/packages/floating-vue/src/directives/v-tooltip.ts
  let dialogAppInstance: App<Element> | undefined = createApp(dialogVNode)

  const mountTarget = document.createElement('div')
  // TODO: allow downstream projects to pass a container prop to mount to instead of just always attaching to `body`
  // https://siteminder-jira.atlassian.net/browse/SUI-1722
  document.body.appendChild(mountTarget)
  dialogAppInstance.mount(mountTarget)

  const open = (): void => {
    visible.value = true
  }

  const close = (): void => {
    visible.value = false
  }

  // TODO: revisit this tech debt where dialog is not destroyed when dialogService is used.
  // As a quick win, we can expose a destroy() function that will destroy the dialog instance.
  // This will be the responsibility of the downstream project to call.
  const destroy = (): void => {
    // destroy dialog instance once it's closed
    dialogAppInstance?.unmount()
    dialogAppInstance = undefined
    document.body.removeChild(mountTarget)
  }

  return {
    open,
    close,
    destroy,
  }
}
