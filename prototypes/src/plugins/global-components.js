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
import SmDrawer from '@sui/app/components/sm-drawer/sm-drawer.vue'

// ============================================================================
// FORM COMPONENTS
// ============================================================================
import SmForm from '@sui/app/components/forms/sm-form/sm-form.vue'
import SmInput from '@sui/app/components/forms/sm-input/sm-input.vue'
import SmInputPrefixContent from '@sui/app/components/forms/sm-input/sm-input-prefix-content.vue'
import SmInputSuffixContent from '@sui/app/components/forms/sm-input/sm-input-suffix-content.vue'
import SmFormGroup from '@sui/app/components/forms/sm-form-group/sm-form-group.vue'
import SmSelect from '@sui/app/components/forms/sm-select/sm-select.vue'
import SmMultiSelect from '@sui/app/components/forms/sm-multi-select/sm-multi-select.vue'
import SmRadio from '@sui/app/components/forms/sm-radio/sm-radio.vue'
import SmRadioGroup from '@sui/app/components/forms/sm-radio/sm-radio-group.vue'
import SmCheckbox from '@sui/app/components/forms/sm-checkbox/sm-checkbox.vue'
import SmCheckboxGroup from '@sui/app/components/forms/sm-checkbox/sm-checkbox-group.vue'
import SmSwitch from '@sui/app/components/forms/sm-switch/sm-switch.vue'
import SmDatePicker from '@sui/app/components/forms/sm-date-picker/sm-date-picker.vue'
import SmCalendar from '@sui/app/components/forms/sm-calendar/sm-calendar.vue'

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
    app.component('SmDrawer', SmDrawer)

    // ========================================================================
    // Register Form Components
    // ========================================================================
    app.component('SmForm', SmForm)
    app.component('SmInput', SmInput)
    app.component('SmInputPrefixContent', SmInputPrefixContent)
    app.component('SmInputSuffixContent', SmInputSuffixContent)
    app.component('SmFormGroup', SmFormGroup)
    app.component('SmSelect', SmSelect)
    app.component('SmMultiSelect', SmMultiSelect)
    app.component('SmRadio', SmRadio)
    app.component('SmRadioGroup', SmRadioGroup)
    app.component('SmCheckbox', SmCheckbox)
    app.component('SmCheckboxGroup', SmCheckboxGroup)
    app.component('SmSwitch', SmSwitch)
    app.component('SmDatePicker', SmDatePicker)
    app.component('SmCalendar', SmCalendar)

    console.log('Global components registered!')
  }
}
