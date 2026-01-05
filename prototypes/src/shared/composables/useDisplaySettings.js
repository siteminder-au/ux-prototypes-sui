import { ref } from 'vue'

// Shared reactive state that persists across all slides
const showGridOverlay = ref(false)
const showContainerBackgrounds = ref(false)
const fullWidthForm = ref(false)
const showMarkup = ref(false)

/**
 * Composable for managing shared display settings across all slides
 * These settings control visual overlays and layout options in the prototype
 */
export function useDisplaySettings() {
  return {
    showGridOverlay,
    showContainerBackgrounds,
    fullWidthForm,
    showMarkup
  }
}
