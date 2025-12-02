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
import SmCardActions from '@sui/app/components/sm-card/sm-card-actions.vue'
import SmTooltip from '@sui/app/components/sm-tooltip/sm-tooltip.vue'
import SmHelpCard from '@sui/app/components/sm-help-card/sm-help-card.vue'
import SmInlineCard from '@sui/app/components/sm-inline-card/sm-inline-card.vue'
import SmTag from '@sui/app/components/sm-tag/sm-tag.vue'

// ============================================================================
// FORM COMPONENTS
// ============================================================================
import SmForm from '@sui/app/components/forms/sm-form/sm-form.vue'
import SmInput from '@sui/app/components/forms/sm-input/sm-input.vue'
import SmInputPrefixContent from '@sui/app/components/forms/sm-input/sm-input-prefix-content.vue'
import SmFormGroup from '@sui/app/components/forms/sm-form-group/sm-form-group.vue'
import SmSelect from '@sui/app/components/forms/sm-select/sm-select.vue'
import SmRadio from '@sui/app/components/forms/sm-radio/sm-radio.vue'
import SmRadioGroup from '@sui/app/components/forms/sm-radio/sm-radio-group.vue'
import SmCheckbox from '@sui/app/components/forms/sm-checkbox/sm-checkbox.vue'
import SmCheckboxGroup from '@sui/app/components/forms/sm-checkbox/sm-checkbox-group.vue'
import SmSwitch from '@sui/app/components/forms/sm-switch/sm-switch.vue'
import SmDatePicker from '@sui/app/components/forms/sm-date-picker/sm-date-picker.vue'

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
    app.component('SmCardActions', SmCardActions)
    app.component('SmIcon', SmIcon)
    app.component('SmTooltip', SmTooltip)
    app.component('SmHelpCard', SmHelpCard)
    app.component('SmInlineCard', SmInlineCard)
    app.component('SmTag', SmTag)

    // ========================================================================
    // Register Form Components
    // ========================================================================
    app.component('SmForm', SmForm)
    app.component('SmInput', SmInput)
    app.component('SmInputPrefixContent', SmInputPrefixContent)
    app.component('SmFormGroup', SmFormGroup)
    app.component('SmSelect', SmSelect)
    app.component('SmRadio', SmRadio)
    app.component('SmRadioGroup', SmRadioGroup)
    app.component('SmCheckbox', SmCheckbox)
    app.component('SmCheckboxGroup', SmCheckboxGroup)
    app.component('SmSwitch', SmSwitch)
    app.component('SmDatePicker', SmDatePicker)

    console.log('Global components registered!')
  }
}
