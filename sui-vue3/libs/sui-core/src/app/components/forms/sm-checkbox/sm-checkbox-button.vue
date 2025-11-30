<script setup lang="ts">
import { ref } from 'vue'
import SmCheckbox from './sm-checkbox.vue'
import { SmCheckBoxModelValue } from './sm-checkbox.types'

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
  'update:modelValue': [value: SmCheckBoxModelValue]
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
 * Emits 'update:modelValue': [value: ModelValue] when this ref changes
 * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
 */
const modelValue = defineModel<SmCheckBoxModelValue>()

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
  inputValue: modelValue, // Keeping the same name
  eventBindings,
})
</script>

<template>
  <sm-checkbox
    v-model="modelValue"
    :name="name"
    class="sm-checkbox-button"
    v-bind="$attrs"
    v-on="inputEventBindings"
  >
    <slot />
  </sm-checkbox>
</template>

<style lang="scss">
@import "../../../common/variables";
@import "../../../common/mixins";

$sm-checkbox-button--text-color: $grey-neu-black;
$sm-checkbox-button--checked--border-color: $primary-blue;
$sm-checkbox-button--checked--background-color: $primary-blue;
$sm-checkbox-button--checked--text-color: $true-white;
$sm-checkbox-button--hover--border-color: $primary-blue;
$sm-checkbox-button--hover--background-color: $blue-neu-med;
$sm-checkbox-button--hover--text-color: $primary-blue;
$sm-checkbox-button--checked--hover--border-color: $primary-blue-dark;
$sm-checkbox-button--checked--hover--background-color: $primary-blue-dark;
$sm-checkbox-button--checked--hover--text-color: $true-white;
$sm-checkbox-button--border-color: $primary-blue;
$sm-checkbox-button--background-color: $true-white;
$sm-checkbox-button--text-color: $primary-blue;
$sm-checkbox-button--checked--clicked--border-color: $primary-blue-midnight;
$sm-checkbox-button--checked--clicked--background-color: $primary-blue-midnight;
$sm-checkbox-button--checked--clicked--text-color: $true-white;
$sm-checkbox-button--clicked--border-color: $primary-blue-dark;
$sm-checkbox-button--clicked--background-color: $blue-neu-mid;
$sm-checkbox-button--clicked--text-color: $primary-blue;
$sm-checkbox-button--checked--disabled--border-color: $grey-neu-mid;
$sm-checkbox-button--checked--disabled--background-color: $grey-neu-white;
$sm-checkbox-button--checked--disabled--text-color: $grey-neu-mid;
$sm-checkbox-button--disabled--border-color: $grey-neu-med;
$sm-checkbox-button--disabled--background-color: $grey-neu-white;
$sm-checkbox-button--disabled--text-color: $grey-neu-mid;
$sm-checkbox-button--focus--label--border-color: $grey-neu-black;
$sm-checkbox-button--focus--text-color: $primary-blue;
$sm-checkbox-button--focus--background-color: $blue-neu-med;
$sm-checkbox-button--checked--focus--text-color: $true-white;
$sm-checkbox-button--checked--focus--background-color: $primary-blue-dark;

.sm-checkbox-button {
  display: inline-block;

  .sm-checkbox__label {
    display: inline-block;
    padding: 7px $sm-16 !important;
    margin: -1px;
    border: 2px solid $sm-checkbox-button--border-color;
    color: $sm-checkbox-button--text-color;
    background: $sm-checkbox-button--background-color;
    cursor: pointer;
    transition: background-color 0.3s ease,
      border-color 0.3s ease,
      box-shadow 0.3s ease,
      color 0.3s ease;
    border-radius: 4px;
  }

  .sm-checkbox {
    padding-top: 0;

    & {
      display: inline-block;
    }

    label {
      display: inline-block;
    }

    &__control {
      display: none !important;
    }

    .sm-field-error {
      display: none;
    }

    /**
     * Checked State
     */
    &--checked .sm-checkbox__label {
      border-color: $sm-checkbox-button--checked--border-color;
      color: $sm-checkbox-button--checked--text-color;
      background: $sm-checkbox-button--checked--background-color;
    }

    /**
     * Hover State
     */
    &__label:hover {
      color: $sm-checkbox-button--hover--text-color;
      background: $sm-checkbox-button--hover--background-color;
    }

    &--checked .sm-checkbox__label:hover {
      color: $sm-checkbox-button--checked--hover--text-color;
      background: $sm-checkbox-button--checked--hover--background-color;
    }

    /**
     * Focus State
     */

    /* Fallback for browsers that don't support focus-visible */
    &__field:focus ~ .sm-checkbox__label {
      box-shadow: inset 0 0 0 2px $sm-checkbox-button--focus--label--border-color;
      color: $sm-checkbox-button--focus--text-color;
      background: $sm-checkbox-button--focus--background-color;
    }

    &--checked .sm-checkbox__field:focus ~ .sm-checkbox__label {
      color: $sm-checkbox-button--checked--focus--text-color;
      background: $sm-checkbox-button--checked--focus--background-color;
    }

    &__field:focus:not(:focus-visible) ~ .sm-checkbox__label {
      box-shadow: none;
    }

    &__field:focus-visible ~ .sm-checkbox__label {
      box-shadow: inset 0 0 0 2px $sm-checkbox-button--focus--label--border-color;
      color: $sm-checkbox-button--focus--text-color;
      background: $sm-checkbox-button--focus--background-color;
    }

    &--checked .sm-checkbox__field:focus-visible ~ .sm-checkbox__label {
      color: $sm-checkbox-button--checked--focus--text-color;
      background: $sm-checkbox-button--checked--focus--background-color;
    }

    /**
     * Clicked State
     */
    &--clicked .sm-checkbox__label {
      color: $sm-checkbox-button--clicked--text-color;
      background: $sm-checkbox-button--clicked--background-color;
    }

    &--clicked.sm-checkbox--checked .sm-checkbox__label {
      color: $sm-checkbox-button--checked--clicked--text-color;
      background: $sm-checkbox-button--checked--clicked--background-color;
    }

    /**
     * Disabled State
     */
    &--disabled .sm-checkbox__label {
      cursor: not-allowed;
      border-color: $sm-checkbox-button--disabled--border-color !important;
      color: $sm-checkbox-button--disabled--text-color !important;
      background: $sm-checkbox-button--disabled--background-color !important;
    }

    &--disabled.sm-checkbox--checked .sm-checkbox__label {
      color: $sm-checkbox-button--checked--disabled--text-color !important;
      background: $sm-checkbox-button--checked--disabled--background-color !important;
      box-shadow: inset 0 0 0 2px $sm-checkbox-button--checked--disabled--border-color;
    }

  }

}
</style>
