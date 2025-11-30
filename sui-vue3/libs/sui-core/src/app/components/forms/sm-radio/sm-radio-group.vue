<script setup lang="ts">
import { computed } from 'vue'
import { useField } from 'vee-validate'
import { useIsFieldRequired } from '../shared/use-is-field-required'
import { useUniqueId } from '../../use/unique-id'

import SmFieldLabel from '../shared/sm-field-label.vue'
import SmFieldError from '../shared/sm-field-error.vue'
import { SmRadioButtonAlignment } from './sm-radio.types'

const props = withDefaults(defineProps<{
  /**
   * The label of the group
   */
  label?: string
  /**
   * The vee-validate rules - see: https://vee-validate.logaretm.com/v4/guide/components/validation
   */
  rules?: string | Record<string, unknown>
  /**
   * When used with a collection of sm-checkbox-button components, the button widths will be evenly distributed across the entire row
   */
  block?: boolean
  /**
   * Hides the label visually but still keeps it accessible to screen readers
   */
  labelHidden?: boolean
  /**
   * Disable the error text
   */
  errorDisabled?: boolean
  /**
   * Button alignment only for Standard radio buttons
   */
  buttonAlignment?: SmRadioButtonAlignment
  /**
   * A custom class to be applied on sm-radio-group__inputs element
   */
  customClass?: string
  /**
   * Native name attribute
   */
  name: string
  /**
   * Set to true if using sm-radio-button for the radio options
   */
  isButtonStyleGroup?: boolean
}>(), {
  label: '',
  rules: undefined,
  block: false,
  labelHidden: false,
  errorDisabled: false,
  buttonAlignment: SmRadioButtonAlignment.VERTICAL,
  customClass: '',
  isButtonStyleGroup: false,
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

// see https://vee-validate.logaretm.com/v4/guide/composition-api/caveats/
// for some caveats when using useField
const computedRules = computed(() => props.rules)
const { meta, errors, validate } = useField(
  () => props.name,
  computedRules,
  {
    type: 'radio',
  },
)

const { id: labelElementId } = useUniqueId('sm-radio-group__label_')

const { required } = useIsFieldRequired(computedRules)
</script>

<template>
  <fieldset
    class="sm-radio-group"
    :class="{
      'sm-radio-group--block': block,
      'sm-radio-group--label-hidden': labelHidden,
    }"
    :aria-labelledby="label || $slots.label ? labelElementId || undefined : undefined"
  >
    <div class="sm-radio-group__header">
      <sm-field-label
        :id="labelElementId"
        tag="legend"
        :required="required"
        :state="meta"
      >
        <!-- @slot The form label. Overrides the label prop -->
        <slot name="label">
          {{ label }}
        </slot>
      </sm-field-label>

      <span
        v-if="$slots.action"
        class="sm-radio-group__action"
      >
        <!-- @slot The field action next to the label. Example usage: adding a helper icon to provide more context on the field. -->
        <slot name="action" />
      </span>
    </div>

    <div
      :class="{
        'sm-radio-group__inputs': true,
        'sm-radio-group--button-inputs': isButtonStyleGroup,
        [`sm-radio-group--${buttonAlignment}`]: !!buttonAlignment && !isButtonStyleGroup,
        [`${customClass}`]: !!customClass
      }"
      @focusout="validate()"
    >
      <slot />
    </div>

    <sm-field-error
      v-if="!errorDisabled"
      :errors="errors"
    />
  </fieldset>
</template>

<style lang="scss">
@import "../../../common/variables";
@import "../../../common/mixins";

$sm-radio-group--checked--background-color: $primary-blue;
$sm-radio-group--checked--clicked--background-color: $primary-blue-midnight;
$sm-radio-group--disabled--background-color: $true-white;
$sm-radio-button--border-color: $primary-blue;
$sm-radio-button--disabled--border-color: $grey-neu-med;

.sm-radio-group {
  border: none;
  margin: 0;
  padding: 0;

  &__header {
    justify-content: space-between;
    display: flex;
  }

  &__action {
    margin-right: auto;

    @include padding($left: rem($sm-xxsm), $top: rem($sm-xxsm));
  }

  .sm-checkbox {
    padding-top: 0;
  }

  .sm-radio,
  .sm-radio-button {
    .sm-field-error {
      display: inline;
    }
  }

  &__inputs {
    display: inline-block;
    font-size: 0; // Remove spaces between inline-block elements, e.g button radios
    position: relative;
  }

  &--block &__inputs {
    display: flex;
  }

  &--block &__inputs > .sm-radio-button {
    flex: 1;
  }

  &--block .sm-radio-button .sm-radio,
  &--block .sm-radio-button .sm-radio > label,
  &--block .sm-radio-button .sm-radio__label {
    display: block;
  }

  &--label-hidden > legend.sm-field-label {
    @include sr-only;
  }

  &--horizontal {
    display: flex;
    gap: $sm-12;
  }
}
</style>
