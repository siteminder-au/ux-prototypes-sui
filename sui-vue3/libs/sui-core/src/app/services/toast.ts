import { h, createApp, App } from 'vue'
import SmToast from '../components/sm-toast/sm-toast.vue'

export interface ToastOptions {
  type?: 'info' | 'success' | 'alert' | 'warning'
  title?: string
  message?: string
  timeout?: number
  placement?: 'top' | 'bottom'
  onClose?: (close: () => void) => any
  showClose?: boolean
  miniInfo?: boolean
}

export const toastService = (inputOptions: ToastOptions) => {
  const options = {
    placement: 'top',
    timeout: 5000,
    ...inputOptions,
  }

  const toastVNode = h(
    // TODO: vue still has issues with the type of SmToast, revisit this when we port over SmToast to script setup
    // see: https://siteminder-jira.atlassian.net/browse/SUI-1759
    SmToast as any,
    {
      type: options.type,
      title: options.title,
      message: options.message,
      showClose: options.showClose,
      placement: options.placement,
      miniInfo: options.miniInfo,
      onClose: () => {
        if (options.onClose) {
          options.onClose(close)
        } else {
          close()
        }
      },
    },
  )

  // see reference file on how to create app instances for floating elements:
  // https://github.com/Akryum/floating-vue/blob/main/packages/floating-vue/src/directives/v-tooltip.ts
  const toastAppInstance: App<Element> | undefined = createApp(toastVNode)

  const mountTarget = document.createElement('div')
  toastAppInstance.mount(mountTarget)

  const open = (): void => {
    // TODO: allow downstream projects to pass a container prop to mount to instead of just always attaching to `body`
    // https://siteminder-jira.atlassian.net/browse/SUI-1722
    document.body.appendChild(mountTarget)

    window.setTimeout(() => {
      mountTarget.firstElementChild?.classList.add('sm-toast--in')
    }, 16)

    if (options.timeout) {
      window.setTimeout(close, options.timeout)
    }
  }

  const close = (): void => {
    if (!mountTarget) {
      return
    }

    mountTarget.firstElementChild?.classList.remove('sm-toast--in')

    setTimeout(() => {
      // Check for element before removing in case close was manually called
      if (document.body.contains(mountTarget)) {
        document.body.removeChild(mountTarget)
      }
    }, 600)
  }

  // open up the toast when the service is called
  open()

  return {
    open,
    close,
  }
}
