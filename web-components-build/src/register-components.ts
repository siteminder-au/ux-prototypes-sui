import { defineCustomElement } from 'vue'

// Import Vue SFC components directly
import SmButtonComponent from '../../sui-vue3/libs/sui-core/src/app/components/sm-button/sm-button.vue'
import SmBadgeComponent from '../../sui-vue3/libs/sui-core/src/app/components/sm-badge/sm-badge.vue'
import SmCardComponent from '../../sui-vue3/libs/sui-core/src/app/components/sm-card/sm-card.vue'
import SmCardContentComponent from '../../sui-vue3/libs/sui-core/src/app/components/sm-card/sm-card-content.vue'
// Add more components as needed
// Note: Some components have issues with defineCustomElement:
// - sm-select, sm-multi-select: Vue compilation errors
// - sm-checkbox: Missing vee-validate dependency

// Convert Vue components to Custom Elements (with Shadow DOM)
const SuiButton = defineCustomElement(SmButtonComponent)
const SuiBadge = defineCustomElement(SmBadgeComponent)
const SuiCard = defineCustomElement(SmCardComponent)
const SuiCardContent = defineCustomElement(SmCardContentComponent)

// Register all custom elements
export function registerComponents() {
  if (!customElements.get('sui-button')) {
    customElements.define('sui-button', SuiButton)
  }
  if (!customElements.get('sui-badge')) {
    customElements.define('sui-badge', SuiBadge)
  }
  if (!customElements.get('sui-card')) {
    customElements.define('sui-card', SuiCard)
  }
  if (!customElements.get('sui-card-content')) {
    customElements.define('sui-card-content', SuiCardContent)
  }
  // Add more registrations as needed
}

// Auto-register when script loads
registerComponents()

console.log('✅ SUI Web Components registered (with Shadow DOM):', ['sui-button', 'sui-badge', 'sui-card', 'sui-card-content'])
