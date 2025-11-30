import { uniqueId } from 'lodash-es'

/**
 * Used to capture the DOM element which opens a dialog and shift focus back to it when need be
 */
export const useReturnToFocus = () => {

  const returnToId = `sm-dialog--return-to_${uniqueId()}`

  /**
   * Captures the currently active element
   * Calls this when the dialog is opened
   */
  const capture = () => {

    if (document.activeElement) {
      document.activeElement.setAttribute('sm-dialog-return-to', returnToId)
    }

  }

  /**
   * Shifts focus back to the element
   * Fails silently if the element is no longer in the DOM
   *
   * Calls this when the dialog is closed
   */
  const returnTo = () => {

    const returnToElement = document.querySelector(`[sm-dialog-return-to="${returnToId}"]`)

    if (returnToElement && typeof (returnToElement as HTMLElement).focus === 'function') {
      (returnToElement as HTMLElement).focus()
      returnToElement.removeAttribute('sm-dialog-return-to')
    }

  }

  return {
    capture,
    returnTo,
  }

}
