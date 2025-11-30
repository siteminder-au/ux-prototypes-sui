import { onMounted, onBeforeUnmount } from 'vue'

/**
 * Executes the callback when the user hits "Escape" in the target
 * @param callback The function to envoke when the event occurs. Will be passed the Keyboard Event object
 * @param target The HTML DOM element, defaults to `document`
 */
export const useOnEscape = (callback: (e: Event) => any, target: Node = document) => {

  const onKeyupHandler = (e: KeyboardEvent) => {

    if (e.key === 'Escape') {
      callback(e)
    }

  }

  onMounted(() => {
    (target as HTMLInputElement).addEventListener('keyup', onKeyupHandler)
  })

  onBeforeUnmount(() => {
    (target as HTMLInputElement).removeEventListener('keyup', onKeyupHandler)
  })

}
