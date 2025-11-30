<script setup lang="ts">
import { computed, ref } from 'vue'
import { SmRadioModelValue } from './sm-radio.types'

import SmRadio from './sm-radio.vue'

withDefaults(defineProps<{
  /**
   * Native name attribute
   */
  name: string
}>(), {

})

const emit = defineEmits<{
  /**
   * Emits on blur
   */
  blur: [value: FocusEvent]
  /**
   * Emits when the v-model is updated
   */
  change: [value: Event]
  /**
   * Emits on click
   */
  click: [value: MouseEvent]
  /**
   * Emits on focus
   */
  focus: [value: FocusEvent]
  /**
   * Emits when the v-model is updated
   * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
   */
  'update:modelValue': [value: SmRadioModelValue]
}>()

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
    /**
     * Resolves this warning on consuming app with @vue/compat:
     *
     * [Vue warn]: (deprecation COMPONENT_V_MODEL) Component declares "modelValue" prop, which is Vue 3 usage,
     * but is running under Vue 2 compat v-model behavior. You can opt-in to Vue 3 behavior on a per-component basis
     * with `compatConfig: { COMPONENT_V_MODEL: false }`.
     * Details: https://v3-migration.vuejs.org/breaking-changes/v-model.html
     */
    COMPONENT_V_MODEL: false,
  },
  inheritAttrs: false,
})

/**
 * v-model for `modelValue` prop
 * Emits 'update:modelValue': [value: SmRadioModelValue] when this ref changes
 * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
 */
const modelValue = defineModel<SmRadioModelValue>({
  default: undefined,
})

const inputValue = computed({
  get: () => {
    // IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
    // Was previously: props.value
    return modelValue.value
  },
  set: (state) => {
    // This will emit 'update:modelValue' internally by vue
    modelValue.value = state
  },
})

const focus: GlobalEventHandlers['onfocus'] = (e) => {
  emit('focus', e)
}

const blur: GlobalEventHandlers['onblur'] = (e) => {
  emit('blur', e)
}

const change: GlobalEventHandlers['onchange'] = (e) => {
  emit('change', e)
}

const click: GlobalEventHandlers['onclick'] = (e) => {
  emit('click', e)
}
const inputEventBindings = ref()

const eventBindings = {
  focus,
  blur,
  change,
  click,
}

inputEventBindings.value = eventBindings

defineExpose({
  inputValue,
  eventBindings,
})
</script>

<template>
  <sm-radio
    v-model="inputValue"
    class="sm-radio-button"
    :name="name"
    v-bind="$attrs"
    v-on="eventBindings"
  >
    <slot />
  </sm-radio>
</template>

<style lang="scss">
@import "../../../common/variables";
@import "../../../common/mixins";

$sm-radio-button--text-color: $grey-neu-black;
$sm-radio-button--checked--border-color: $primary-blue;
$sm-radio-button--checked--background-color: $primary-blue;
$sm-radio-button--checked--text-color: $true-white;
$sm-radio-button--hover--border-color: $blue-neu-med;
$sm-radio-button--hover--background-color: $blue-neu-med;
$sm-radio-button--hover--text-color: $primary-blue;
$sm-radio-button--checked--hover--border-color: $primary-blue-dark;
$sm-radio-button--checked--hover--background-color: $primary-blue-dark;
$sm-radio-button--checked--hover--text-color: $true-white;
$sm-radio-button--border-color: $primary-blue;
$sm-radio-button--background-color: $true-white;
$sm-radio-button--text-color: $primary-blue;
$sm-radio-button--checked--clicked--border-color: $primary-blue-midnight;
$sm-radio-button--checked--clicked--background-color: $primary-blue-midnight;
$sm-radio-button--checked--clicked--text-color: $true-white;
$sm-radio-button--clicked--border-color: $primary-blue-dark;
$sm-radio-button--clicked--background-color: $blue-neu-mid;
$sm-radio-button--clicked--text-color: $primary-blue;
$sm-radio-button--checked--disabled--border-color: $grey-neu-mid;
$sm-radio-button--checked--disabled--background-color: $grey-neu-white;
$sm-radio-button--checked--disabled--text-color: $grey-neu-mid;
$sm-radio-button--disabled--border-color: $grey-neu-med;
$sm-radio-button--disabled--background-color: $grey-neu-white;
$sm-radio-button--disabled--icon-color: $grey-neu-med;
$sm-radio-button--disabled--text-color: $grey-neu-mid;

.sm-radio-button {
  display: inline-block;

  &:first-of-type {
    .sm-radio {
      border-left: 2px solid $primary-blue;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      padding-left: 2px;
    }
  }

  &:last-of-type {
    .sm-radio {
      border-right: 2px solid $primary-blue;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      padding-right: 2px;
    }
  }

  .sm-radio {
    background: $sm-radio-button--background-color;
    border-bottom: 2px solid $primary-blue;
    border-top: 2px solid $primary-blue;
    padding: 0 1px;

    &--disabled {
      border-color: $grey-neu-med;
    }

    & {
      display: inline-block;
    }

    label {
      display: inline-block;
    }

    &__control {
      display: none !important;
    }

    &__label {
      display: inline-block;
      padding: 3px 14px;
      margin: 2px 0;
      border: 2px solid transparent;
      border-radius: 4px;
      color: $sm-radio-button--text-color;
      cursor: pointer;
      transition: background 0.3s ease, color 0.2s ease;
      position: relative;
      text-align: center;
    }

    .sm-field-error {
      display: none;
    }

    /**
     * Checked State
     */
    &--checked .sm-radio__label {
      border-color: transparent;
      color: $sm-radio-button--checked--text-color;
      background: $sm-radio-button--checked--background-color;
    }

    /**
     * Focused State
     */

    /* Fallback for browsers that don't support focus-visible */
    &:not(.sm-radio--checked) .sm-radio__field:focus ~ .sm-radio__label {
      border-color: $grey-neu-black;
      background: $sm-radio-button--hover--background-color;
    }

    &:not(.sm-radio--checked) .sm-radio__field:focus-visible ~ .sm-radio__label {
      border-color: $grey-neu-black;
      background: $sm-radio-button--hover--background-color;
    }

    /* Fallback for browsers that don't support focus-visible */
    &--checked .sm-radio__field:focus ~ .sm-radio__label {
      border-color: $sm-radio-button--checked--clicked--border-color;
    }

    &--checked .sm-radio__field:focus:not(:focus-visible) ~ .sm-radio__label {
      border-color: transparent;
    }

    &--checked .sm-radio__field:focus-visible ~ .sm-radio__label {
      border-color: $sm-radio-button--checked--clicked--border-color;
    }

    /**
     * Hover State
     */
    &__label:hover {
      border-color: transparent;
      color: $sm-radio-button--hover--text-color;
      background: $sm-radio-button--hover--background-color;
    }

    &--checked .sm-radio__label:hover {
      border-color: transparent;
      color: $sm-radio-button--checked--hover--text-color;
      background: $sm-radio-button--checked--hover--background-color;
    }

    /**
     * Clicked State
     */
    &--clicked .sm-radio__label {
      border-color: transparent;
      color: $sm-radio-button--clicked--text-color;
      background: $sm-radio-button--clicked--background-color;
    }

    &--clicked.sm-radio--checked .sm-radio__label {
      border-color: transparent;
      color: $sm-radio-button--checked--clicked--text-color;
      background: $sm-radio-button--checked--clicked--background-color;
    }

    /**
     * Disabled State
     */
    &--disabled {
      border-color: $sm-radio-button--disabled--border-color !important;
    }

    &--disabled .sm-radio__label {
      cursor: not-allowed;
      border-color: transparent !important;
      color: $sm-radio-button--disabled--text-color !important;
      background: $sm-radio-button--disabled--background-color !important;

      .sm-icon {
        color: $sm-radio-button--disabled--icon-color;
      }
    }

    &--disabled.sm-radio--checked .sm-radio__label {
      border-color: $sm-radio-button--checked--disabled--border-color !important;
      color: $sm-radio-button--checked--disabled--text-color !important;
    }
  }
}
</style>
