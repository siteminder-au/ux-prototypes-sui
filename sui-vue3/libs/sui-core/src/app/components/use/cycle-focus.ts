export const useCycleFocus = (parent: Element) => {

  const focusableSelectors = 'button, a[href], [tabindex], [role="button"]'
  const focusableElements = parent.querySelectorAll(focusableSelectors)

  if (!focusableElements.length) {
    throw new Error(`The parent element must contain atleast one focusable element (${focusableSelectors})`)
  }

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const firstElementHandler = (e: KeyboardEvent) => {

    if (e.key === 'Tab' && e.shiftKey && lastElement && typeof (lastElement as HTMLElement).focus === 'function') {
      (lastElement as HTMLElement).focus()
    }

  }

  const lastElementHandler = (e: KeyboardEvent) => {

    if (e.key === 'Tab') {
      (parent as HTMLElement).focus()
    }

  }

  ;(firstElement as HTMLInputElement).addEventListener('keydown', firstElementHandler)
  ;(lastElement as HTMLInputElement).addEventListener('keydown', lastElementHandler)

}
