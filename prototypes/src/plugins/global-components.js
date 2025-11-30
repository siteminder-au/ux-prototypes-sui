// Global component registration for prototyping convenience
// Register commonly-used SUI components here so you don't need to import them in every prototype

import SmIcon from '@sui-icons/app/sm-icon.vue'
import SmButton from '@sui/app/components/sm-button/sm-button.vue'
import SmBadge from '@sui/app/components/sm-badge/sm-badge.vue'
import SmCard from '@sui/app/components/sm-card/sm-card.vue'
import SmCardContent from '@sui/app/components/sm-card/sm-card-content.vue'

export default {
  install(app) {
    // Core components
    app.component('sm-icon', SmIcon)
    app.component('sm-button', SmButton)
    app.component('sm-badge', SmBadge)
    app.component('sm-card', SmCard)
    app.component('sm-card-content', SmCardContent)

    // Add more components as needed:
    // app.component('sm-input', SmInput)
    // app.component('sm-checkbox', SmCheckbox)
    // app.component('sm-select', SmSelect)
    // etc.
  }
}
