<script setup lang="ts">
import { computed } from 'vue'
import { useField } from 'vee-validate'
import { useIsFieldRequired } from '../shared/use-is-field-required'
import SmFieldError from '../shared/sm-field-error.vue'
import SmFieldLabel from '../shared/sm-field-label.vue'

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
   * Native name attribute
   */
  name: string
}>(), {
  label: '',
  rules: undefined,
  block: false,
  labelHidden: false,
  errorDisabled: false,
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
const { meta, errors } = useField(
  () => props.name,
  computedRules,
  {
    type: 'checkbox',
  },
)
const { required } = useIsFieldRequired(computedRules)
</script>

<template>
  <fieldset
    class="sm-checkbox-group"
    :class="{
      'sm-checkbox-group--block': block,
      'sm-checkbox-group--label-hidden': labelHidden,
    }"
  >
    <div class="sm-checkbox-group__header">
      <sm-field-label
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
        class="sm-checkbox-group__action"
      >
        <!-- @slot The field action next to the label. Example usage: adding a helper icon to provide more context on the field. -->
        <slot name="action" />
      </span>
    </div>

    <div class="sm-checkbox-group__inputs">
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

$sm-checkbox--border-color: $blue-neu-mid;
$sm-checkbox-button--border-color: $primary-blue;
$sm-checkbox-button--disabled--border-color: $grey-neu-med;

.sm-checkbox-group {
  border: none;
  margin: 0;
  padding: 0;

  &__header {
    justify-content: space-between;
    display: flex;
  }

  &__action {
    margin-right: auto;

    @include padding($left: rem($sm-xxsm),$top: rem($sm-xxsm));
  }

  .sm-checkbox {
    padding-top: 0;
  }

  .sm-checkbox,
  .sm-checkbox-button {
    .sm-field-error {
      display: inline;
    }
  }

  .sm-checkbox-button {
    margin-left: 3px;

    &:first-child {
      margin-left: 0;
    }

    .sm-checkbox__label {
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: -2px;
        left: -1px;
        width: 1px;
        height: 100%;
        background: $sm-checkbox--border-color;
        border-top: 2px solid $sm-checkbox-button--border-color;
        border-bottom: 2px solid $sm-checkbox-button--border-color;
        transition: border-color 0.3s ease;
      }
    }

    .sm-checkbox--disabled .sm-checkbox__label {
      &::after {
        border-color: $sm-checkbox-button--disabled--border-color;
      }
    }

    &:first-child .sm-checkbox__label::after {
      display: none;
    }

    &:not(:first-child) .sm-checkbox__label {
      border-left: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    &:not(:last-child) .sm-checkbox__label {
      border-right: none;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

  }

  &__inputs {
    /* Remove spaces between buttons */
    font-size: 0;

    > * {
      font-size: 15px;
    }
  }

  &--block &__inputs {
    display: flex;
  }

  &--block &__inputs > .sm-checkbox-button {
    flex: 1;
  }

  &--block .sm-checkbox-button .sm-checkbox,
  &--block .sm-checkbox-button .sm-checkbox > label,
  &--block .sm-checkbox-button .sm-checkbox__label {
    display: block;
  }

  &--block .sm-checkbox-button .sm-checkbox__label {
    text-align: center;
  }

  &--label-hidden > legend.sm-field-label {
    @include sr-only;
  }
}
</style>
