<script setup lang="ts">
import { FieldMeta } from './sm-field-label.types'

withDefaults(defineProps<{
  /**
   * Whether the field has focus
   */
  focussed?: boolean
  /**
   * Whether to add an asterisk after the label to hint that the field is required
   */
  required?: boolean
  /**
   * The HTML tag name of the element
   */
  tag?: string
  /**
   * Validation meta field, usually supplied by vee-validate, this reference the FieldMeta
   * Contains useful information/flags about the field status
   * This has breaking changes around previous props state
   * interface FieldMeta {
      touched: boolean; // if the field has been blurred (via handleBlur)
      dirty: boolean; // if the field has been manipulated (via handleChange)
      valid: boolean; // if the field doesn't have any errors
      pending: boolean; // if validation is in progress
      initialValue?: any; // the field's initial value
    }
   */
  state?: FieldMeta | null
}>(), {
  focussed: false,
  required: false,
  tag: 'label',
  state: null,
})

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
  },
})
</script>

<template>
  <component
    :is="tag"
    class="sm-field-label sm-text--small"
    :class="{
      'sm-field-label--invalid': state && (state.validated || state.touched) && !state.valid,
      'sm-field-label--focussed': !!focussed,
    }"
  >
    <slot />
    <span
      v-if="required"
      class="sm-field-label__required-asterisk"
      aria-hidden="true"
    >&nbsp;*</span>
  </component>
</template>

<style lang="scss" scoped>
@import "../../../common/variables";

$sm-field-label--asterisk-color: $app-warning;
$sm-field-label--text-color: $grey-neu-black;
$sm-field-label--focus--text-color: $primary-blue;
$sm-field-label--invalid--text-color: $app-warning;

.sm-field-label {
  color: $sm-field-label--text-color;
  margin-bottom: $sm-8;
  padding-top: $sm-8;
  display: inline-block;

  &__required-asterisk {
    display: inline-block;
    color: $sm-field-label--asterisk-color;
  }

  &--focussed {
    color: $sm-field-label--focus--text-color;
  }

  &--invalid {
    color: $sm-field-label--invalid--text-color;
  }

}

legend {
  &.sm-field-label {
    text-transform: none;
    font-weight: 400;
    color: $sm-field-label--text-color;

    &--focussed {
      color: $sm-field-label--focus--text-color;
    }

    &--invalid {
      color: $sm-field-label--invalid--text-color;
    }
  }
}
</style>
