import { defineCustomElement } from 'vue'

// Import Vue SFC components directly
import SmButtonComponent from '../../sui-vue3/libs/sui-core/src/app/components/sm-button/sm-button.vue'
import SmBadgeComponent from '../../sui-vue3/libs/sui-core/src/app/components/sm-badge/sm-badge.vue'
// Add more components as needed

// Convert Vue components to Custom Elements (with Shadow DOM)
const SuiButton = defineCustomElement(SmButtonComponent)
const SuiBadge = defineCustomElement(SmBadgeComponent)

// Register all custom elements
export function registerComponents() {
  if (!customElements.get('sui-button')) {
    customElements.define('sui-button', SuiButton)
  }
  if (!customElements.get('sui-badge')) {
    customElements.define('sui-badge', SuiBadge)
  }
  // Add more registrations as needed
}

// Auto-register when script loads
registerComponents()

console.log('✅ SUI Web Components registered (with Shadow DOM):', ['sui-button', 'sui-badge'])
