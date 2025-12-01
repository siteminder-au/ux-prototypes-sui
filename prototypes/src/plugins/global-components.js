// Global component registration for prototyping convenience
// Register commonly-used SUI components here so you don't need to import them in every prototype

// ============================================================================
// CORE COMPONENTS
// ============================================================================
import SmIcon from '@sui-icons/app/sm-icon.vue'
import SmButton from '@sui/app/components/sm-button/sm-button.vue'
import SmBadge from '@sui/app/components/sm-badge/sm-badge.vue'
import SmCard from '@sui/app/components/sm-card/sm-card.vue'
import SmCardContent from '@sui/app/components/sm-card/sm-card-content.vue'

// ============================================================================
// FORM COMPONENTS
// ============================================================================
// Uncomment the components you need:
import SmInput from '@sui/app/components/forms/sm-input/sm-input.vue'
import SmFormGroup from '@sui/app/components/forms/sm-form-group/sm-form-group.vue'
import SmSelect from '@sui/app/components/forms/sm-select/sm-select.vue'

export default {
  install(app) {
    console.log('Installing global components plugin...')

    // ========================================================================
    // Register Core Components
    // ========================================================================
    app.component('SmButton', SmButton)
    app.component('SmBadge', SmBadge)
    app.component('SmCard', SmCard)
    app.component('SmCardContent', SmCardContent)
    app.component('SmIcon', SmIcon)

    // ========================================================================
    // Register Form Components
    // ========================================================================
    // Uncomment as needed:
    app.component('SmInput', SmInput)
    app.component('SmFormGroup', SmFormGroup)
    app.component('SmSelect', SmSelect)

    console.log('Global components registered!')
  }
}
