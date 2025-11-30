import { uniqueId } from 'lodash-es'

/**
 * Used to prevent the viewport from scrolling
 */
export const useScrollLock = (prefixId?: string) => {

  const scrollLockId = prefixId ? uniqueId(prefixId) : undefined

  const lock = () => {
    if (scrollLockId) {
      document.body.classList.add(`scroll-locked-id-${scrollLockId}`)
    } else {
      document.body.classList.add('scroll-locked')
    }
  }

  const unlock = () => {
    if (scrollLockId) {
      document.body.classList.remove(`scroll-locked-id-${scrollLockId}`)
    } else {
      document.body.classList.remove('scroll-locked')
    }
  }

  return {
    lock,
    unlock,
  }

}
