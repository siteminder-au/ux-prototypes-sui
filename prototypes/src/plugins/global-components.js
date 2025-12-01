// Global component registration for prototyping convenience
// Register commonly-used SUI components here so you don't need to import them in every prototype

import SmIcon from '@sui-icons/app/sm-icon.vue'
import SmButton from '@sui/app/components/sm-button/sm-button.vue'
import SmBadge from '@sui/app/components/sm-badge/sm-badge.vue'
import SmCard from '@sui/app/components/sm-card/sm-card.vue'
import SmCardContent from '@sui/app/components/sm-card/sm-card-content.vue'

console.log('Global components module loaded:', { SmButton, SmBadge, SmCard, SmCardContent, SmIcon })

export default {
  install(app) {
    console.log('Installing global components plugin...')

    // Core components
    app.component('SmButton', SmButton)
    app.component('SmBadge', SmBadge)
    app.component('SmCard', SmCard)
    app.component('SmCardContent', SmCardContent)
    app.component('SmIcon', SmIcon)

    console.log('Global components registered!')

    // Add more components as needed:
    // app.component('SmInput', SmInput)
    // app.component('SmCheckbox', SmCheckbox)
    // app.component('SmSelect', SmSelect)
    // etc.
  }
}
