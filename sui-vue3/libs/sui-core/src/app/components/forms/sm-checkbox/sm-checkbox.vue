<script setup lang="ts">
import { computed, ref, inject, InputHTMLAttributes, toRaw } from 'vue'
import { useField } from 'vee-validate'
import { useIsFieldRequired } from '../shared/use-is-field-required'
import { useUniqueId } from '../../use/unique-id'
import SmFieldError from '../shared/sm-field-error.vue'
import { FormProviderKey } from '../sm-form/symbols'
import { useClickedState } from '../../use/clicked-state'
import { SmCheckBoxModelValue } from './sm-checkbox.types'

const props = withDefaults(defineProps<{
  /**
   * The value of the element when it is selected
   */
  selectedValue: string | boolean | number | object
  /**
   * Whether the field's value should be visually displayed as indeterminate
   */
  indeterminate?: boolean
  /**
   * Whether the field is disabled
   */
  disabled?: boolean
  /**
   * The vee-validate rules - see: https://vee-validate.logaretm.com/v4/guide/global-validators/#available-rules
   */
  rules?: string | Record<string, unknown>
  /**
   * The HTML element ID
   */
  id?: string
  /**
   * The label of the input element
   */
  label?: string
  /**
   * Disable or hide the error text
   */
  errorDisabled?: boolean
  /**
   * Native name attribute.
   * vee-validate doesn't require v-model. vee-validate create an internal model for the field component instances and tracks them and keeps them in sync with the input.
   */
  name: string
}>(), {
  selectedValue: undefined,
  indeterminate: false,
  disabled: false,
  rules: undefined,
  id: '',
  label: '',
  errorDisabled: false,
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
    // we suppress ATTR_FALSE_VALUE as we want to keep
    // `aria-*` attribute attached even if the value of it is false
    // in vue2, aria-* was removed if the value was false.
    ATTR_FALSE_VALUE: 'suppress-warning',
  },
  inheritAttrs: false,
})

/**
 * v-model for `modelValue` prop
 * Emits 'update:modelValue': [value: ModelValue] when this ref changes
 * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
 */
const modelValue = defineModel<SmCheckBoxModelValue>()

// see https://vee-validate.logaretm.com/v4/guide/composition-api/caveats/
// for some caveats when using useField
const computedRules = computed(() => props.rules)
const { meta, errors } = useField(() => props.name, computedRules, {
  type: 'checkbox',
  checkedValue: props.selectedValue,
  syncVModel: true,
})
const { required } = useIsFieldRequired(computedRules)

// data provided by sm-form
const formProvider = inject(FormProviderKey, { disabled: ref(false) })
const isFormDisabled = computed(() => formProvider.disabled.value)

const checked = computed(() => {
  if (Array.isArray(modelValue.value)) {
    // `toRaw` handles Proxy object comparison
    // Note that object comparison will only work for the same object reference
    // even in Vue2 version. I.e. it won't work if the object value is inlined
    // (`:selected-value="{ key: 'value' }"`).
    // It needs to be passed as a reference (`:selected-value="objectVariable"`)
    const rawModelValues = modelValue.value.map((v: SmCheckBoxModelValue) => toRaw(v))
    const rawSelectedValue = toRaw(props.selectedValue)

    return rawModelValues.includes(rawSelectedValue)
  }

  return !!modelValue.value
})

const { id: defaultInputId } = useUniqueId('sm-checkbox_')
const { id: errorMessageId } = useUniqueId('vee__vee_')
const inputId = computed(() => props.id || defaultInputId.value)
const errorMessageValue = computed(() => (props.errorDisabled ? null : errorMessageId.value))

const inputAttrBindings = computed<InputHTMLAttributes>(() => {
  return {
    id: inputId.value ?? undefined,
    class: 'sm-checkbox__field',
    'aria-disabled': props.disabled || isFormDisabled.value,
    disabled: props.disabled || isFormDisabled.value,
    'aria-errormessage': errorMessageValue.value ?? undefined,
    'aria-label': props.label,
    'aria-required': required.value,
    'aria-invalid': !meta.valid,
  }
})

const focussed = ref(false)

const focus: GlobalEventHandlers['onfocus'] = (e) => {
  focussed.value = true
  emit('focus', e)
}
const blur: GlobalEventHandlers['onblur'] = (e) => {
  focussed.value = false
  emit('blur', e)
}
const change: GlobalEventHandlers['onchange'] = (e) => {
  emit('change', e)
}
const inputEventBindings = ref()

const inputEvents = {
  focus,
  blur,
  change,
}
inputEventBindings.value = inputEvents

const { isClicked, onMousedown } = useClickedState()

defineExpose({
  inputId,
  inputValue: modelValue, // Keeping the same name
  checked,
  inputAttrBindings,
  focussed,
  inputEventBindings,
  isClicked,
  onMousedown,
  isFormDisabled,
})
</script>

<template>
  <span :class="$attrs.class">
    <div
      class="sm-checkbox"
      :class="{
        'sm-checkbox--clicked': isClicked,
        'sm-checkbox--focussed': focussed,
        'sm-checkbox--disabled': disabled || isFormDisabled,
        'sm-checkbox--checked': checked,
        'sm-checkbox--indeterminate': indeterminate,
        'sm-field--untouched': meta && !meta.touched,
        'sm-field--pristine': meta && !meta.dirty,
        'sm-field--invalid': meta && (meta.validated || meta.touched) && !meta.valid,
        'sm-field--validated': meta && meta.validated,
        'sm-field--touched': meta && meta.touched,
        'sm-field--valid': meta && meta.dirty && meta.valid,
        'sm-field--dirty': meta && meta.dirty,
      }"
      @click="(e) => $emit('click', e)"
    >
      <label
        :aria-disabled="disabled"
        @mousedown="onMousedown"
      >
        <input
          v-model="modelValue"
          :value="selectedValue"
          :checked="checked"
          type="checkbox"
          v-bind="{ ...$attrs, ...inputAttrBindings }"
          :indeterminate="indeterminate"
          v-on="inputEventBindings"
        >

        <span
          class="sm-checkbox__control"
          aria-hidden="true"
        >
          <span />
        </span>

        <span
          class="sm-checkbox__label sm-p"
        >
          <!-- @slot The form label. Overrides the label prop -->
          <slot>{{ label }}</slot>
          <span
            v-if="required && !errorDisabled"
            class="sm-checkbox__required-asterisk"
            aria-hidden="true"
          >
            *
          </span>
        </span>
      </label>
      <sm-field-error
        v-if="!errorDisabled"
        :errors="errors"
      />
    </div>
  </span>
</template>

<style lang="scss" scoped>
@import "../../../common/variables";
@import "../../../common/mixins";

$sm-checkbox--text-color: $grey-neu-black;
$sm-checkbox--control--border-color: $blue-neu-dark;
$sm-checkbox--control--background-color: $true-white;
$sm-checkbox--control--foreground-color: transparent;
$sm-checkbox--hover--control--border-color: $primary-blue;
$sm-checkbox--hover--control--background-color: $true-white;
$sm-checkbox--hover--control--foreground-color: transparent;
$sm-checkbox--checked--hover--control--border-color: $primary-blue-dark;
$sm-checkbox--checked--hover--control--background-color: $primary-blue-dark;
$sm-checkbox--checked--hover--control--foreground-color: $true-white;
$sm-checkbox--checked--control--border-color: $primary-blue;
$sm-checkbox--checked--control--background-color: $primary-blue;
$sm-checkbox--checked--control--foreground-color: $true-white;
$sm-checkbox--indeterminate--control--border-color: $primary-blue;
$sm-checkbox--indeterminate--control--background-color: $primary-blue;
$sm-checkbox--indeterminate--control--foreground-color: $true-white;
$sm-checkbox--indeterminate--hover--control--border-color: $primary-blue;
$sm-checkbox--indeterminate--hover--control--background-color: $primary-blue;
$sm-checkbox--indeterminate--hover--control--foreground-color: $true-white;
$sm-checkbox--invalid--label-color: $app-warning;
$sm-checkbox--invalid--control--border-color: $app-warning;
$sm-checkbox--invalid--control--background-color: $app-warning;
$sm-checkbox--invalid--control--foreground-color: $true-white;
$sm-checkbox--required--asterisk-color: $app-warning;
$sm-checkbox--disabled--label-color: $grey-neu-mid;
$sm-checkbox--disabled--control--border-color: $grey-neu-mid;
$sm-checkbox--disabled--control--background-color: $grey-neu-white;
$sm-checkbox--disabled--control--foreground-color: transparent;
$sm-checkbox--checked--disabled--control--border-color: $grey-neu-mid;
$sm-checkbox--checked--disabled--control--background-color: $grey-neu-white;
$sm-checkbox--checked--disabled--control--foreground-color: $grey-neu-mid;
$sm-checkbox--focus--control--outline: $grey-neu-black;

.sm-checkbox {
  label {
    color: $sm-checkbox--text-color;
    position: relative;
  }

  &__label {
    display: inline-block;
    transition: color 0.3s ease;
    cursor: pointer;
    margin-bottom: 8px;
    padding-left: 26px;
  }

  &__required-asterisk {
    color: $sm-checkbox--required--asterisk-color;
    display: inline-block;
    margin-left: 0.35em;
    font-weight: 600;
  }

  &__control {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid $sm-checkbox--control--border-color;
    background: $sm-checkbox--control--background-color;
    position: relative;
    border-radius: 2px;
    margin-bottom: -4px;
    margin-right: 5px;
    cursor: pointer;
    position: absolute;
    margin-top: 2px;

    span {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      transform: rotate(40deg);

      &::before,
      &::after {
        content: '';
        position: absolute;
        background: $sm-checkbox--control--foreground-color;
      }

      &::before {
        width: 3px;
        height: 1px;
        bottom: 3px;
        left: 5px;
      }

      &::after {
        width: 1px;
        height: 9px;
        bottom: 3px;
        left: 8px;
      }
    }

    &, span {
      transition: background-color 0.3s ease,
        border-color 0.3s ease,
        color 0.3s ease,
        transform 0.3s ease;
    }
  }

  input {
    @include sr-only;
  }

  /**
   * Active (on) State
   */
  &--checked &__control {
    border-color: $sm-checkbox--checked--control--border-color;
    background: $sm-checkbox--checked--control--background-color;

    span::before,
    span::after {
      background: $sm-checkbox--checked--control--foreground-color;
    }
  }

  /**
   * Indeterminate State
   */
  &--indeterminate &__control {
    border-color: $sm-checkbox--indeterminate--control--border-color;
    background: $sm-checkbox--indeterminate--control--background-color;

    span {
      transform: none;
    }

    span::before {
      background: $sm-checkbox--indeterminate--control--foreground-color;
      width: 70%;
      transform: none;
      left: 50%;
      top: 50%;
      transform: translateX(-50%);
    }

    span::after {
      display: none;
    }
  }

  /**
   * Hover State
   */
  &__control:hover {
    border-color: $sm-checkbox--hover--control--border-color;
    background: $sm-checkbox--hover--control--background-color;

    span::before,
    span::after {
      background: $sm-checkbox--hover--control--foreground-color;
    }
  }

  &--checked &__control:hover {
    border-color: $sm-checkbox--checked--hover--control--border-color;
    background: $sm-checkbox--checked--hover--control--background-color;

    span::before,
    span::after {
      background: $sm-checkbox--checked--hover--control--foreground-color;
    }
  }

  &--indeterminate &__control:hover {
    border-color: $sm-checkbox--indeterminate--hover--control--border-color;
    background: $sm-checkbox--indeterminate--hover--control--background-color;

    span::before,
    span::after {
      background: $sm-checkbox--indeterminate--hover--control--foreground-color;
    }
  }

  .sm-form--inline & .sm-field-error {
    display: inline;
  }

  /**
   * Focus State
   */

  /* Fallback for browsers that don't support focus-visible */
  &__field:focus ~ &__control {
    outline: 2px solid $sm-checkbox--focus--control--outline;
    outline-offset: 1px;
  }

  &__field:focus:not(:focus-visible) ~ &__control {
    outline: none;
  }

  &__field:focus-visible ~ &__control {
    outline: 2px solid $sm-checkbox--focus--control--outline;
    outline-offset: 1px;
  }

  /**
   * Invalid State
   */
  &.sm-validation--invalid &__label {
    color: $sm-checkbox--invalid--label-color;
  }

  &.sm-validation--invalid &__control {
    border-color: $sm-checkbox--invalid--control--border-color;
    background-color: $sm-checkbox--invalid--control--background-color;

    span::before,
    span::after {
      background-color: $sm-checkbox--invalid--control--foreground-color;
    }
  }

  /**
   * Disabled State
   */
  &--disabled &__label {
    color: $sm-checkbox--disabled--label-color;
  }

  &--disabled &__control {
    cursor: not-allowed;
    opacity: 1;
    border-color: $sm-checkbox--disabled--control--border-color;
    background: $sm-checkbox--disabled--control--background-color;
    border-width: 1px;
    padding: 1px;

    span::before,
    span::after {
      background: $sm-checkbox--disabled--control--foreground-color;
    }
  }

  &--disabled.sm-checkbox--indeterminate &__control,
  &--disabled.sm-checkbox--checked &__control {
    border-color: $sm-checkbox--checked--disabled--control--border-color;
    background: $sm-checkbox--checked--disabled--control--background-color;

    span::before,
    span::after {
      background: $sm-checkbox--checked--disabled--control--foreground-color;
    }
  }
}
</style>
