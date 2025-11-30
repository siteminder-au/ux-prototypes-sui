import { ref } from 'vue'

/**
 * Used to track the `clicked` state of an element
 *
 * @example const { isClicked, onMousedown } = useClickedState()
 * @example <button @mousedown="onMousedown" :class="{ 'active': isClicked }"></button>
 */
export const useClickedState = () => {

  const isClicked = ref(false)

  const onMousedown = () => {

    isClicked.value = true

    const onMouseup = () => {

      isClicked.value = false
      document.removeEventListener('mouseup', onMouseup)

    }

    document.addEventListener('mouseup', onMouseup)

  }

  return {
    isClicked,
    onMousedown,
  }

}
