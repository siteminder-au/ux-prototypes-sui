<script setup lang="ts">
import { computed, ref, inject, toRaw } from 'vue'
import { useField } from 'vee-validate'
import { useUniqueId } from '../../use/unique-id'
import { useClickedState } from '../../use/clicked-state'
import { useIsFieldRequired } from '../shared/use-is-field-required'
import { FormProviderKey } from '../sm-form/symbols'
import SmFieldError from '../shared/sm-field-error.vue'
import { SmRadioModelValue } from './sm-radio.types'

const props = withDefaults(defineProps<{
  /**
   * The value of the element when it is selected
   */
  selectedValue: string | boolean | number | object
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
    // we suppress ATTR_FALSE_VALUE as we want to keep
    // `aria-checked/aria-disabled` attribute attached even if the value of it is false
    // in vue2, aria-checked/aria-disabled was removed if the value was false.
    ATTR_FALSE_VALUE: 'suppress-warning',
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

// see https://vee-validate.logaretm.com/v4/guide/composition-api/caveats/
// for some caveats when using useField
const computedRules = computed(() => props.rules)
const { meta, errors, validate } = useField(
  () => props.name,
  computedRules,
  {
    type: 'radio',
    syncVModel: true,
  },
)
const { required } = useIsFieldRequired(computedRules)

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

// data provided by sm-form
const formProvider = inject(FormProviderKey, { disabled: ref(false) })
const isFormDisabled = computed(() => formProvider.disabled.value)

const checked = computed(() => {
  // `toRaw` handles Proxy object comparison
  // Note that object comparison will only work for the same object reference
  // even in Vue2 version. I.e. it won't work if the object value is inlined
  // (`:selected-value="{ key: 'value' }"`).
  // It needs to be passed as a reference (`:selected-value="objectVariable"`)
  const rawInputValue = toRaw(inputValue.value)
  const rawSelectedValue = toRaw(props.selectedValue)

  return typeof rawInputValue !== 'undefined' && rawInputValue === rawSelectedValue
})

const { id: defaultInputId } = useUniqueId('sm-radio_')
const inputId = computed(() => props.id || defaultInputId.value)

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
  inputValue,
  checked,
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
      class="sm-radio"
      :class="{
        'sm-field--dirty': meta && meta.dirty,
        'sm-field--invalid': meta && (meta.validated || meta.touched) && !meta.valid,
        'sm-field--pristine': meta && !meta.dirty,
        'sm-field--touched': meta && meta.touched,
        'sm-field--untouched': meta && !meta.touched,
        'sm-field--valid': meta && (meta.dirty && meta.valid),
        'sm-field--validated': meta && meta.validated,
        'sm-radio--checked': checked,
        'sm-radio--clicked': isClicked,
        'sm-radio--disabled': disabled || isFormDisabled,
        'sm-radio--focussed': focussed,
      }"
      @click="(e) => $emit('click', e)"
    >
      <label
        @mousedown="onMousedown"
      >

        <input
          v-bind="$attrs"
          :id="inputId || undefined"
          v-model="inputValue"
          type="radio"
          :name="name"
          :value="selectedValue"
          class="sm-radio__field"
          :aria-disabled="disabled || isFormDisabled"
          :disabled="disabled || isFormDisabled"
          v-on="inputEventBindings"
          @blur="validate()"
        >

        <span
          class="sm-radio__control"
          aria-hidden="true"
          @click.stop
        >
          <span />
        </span>

        <span
          class="sm-p sm-radio__label"
          @click.stop
        >
          <!-- @slot The form label. Overrides the label prop -->
          <slot>{{ label }}</slot>

          <span
            v-if="required"
            class="sm-radio__required-asterisk"
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

<style lang="scss">
@import "../../../common/variables";
@import "../../../common/mixins";

$sm-radio--text-color: $grey-neu-black;
$sm-radio--control--border-color: $blue-neu-dark;
$sm-radio--control--background-color: $true-white;
$sm-radio--control--foreground-color: transparent;
$sm-radio--hover--control--border-color: $primary-blue-dark;
$sm-radio--hover--control--background-color: $blue-neu-light;
$sm-radio--hover--control--foreground-color: transparent;
$sm-radio--checked--hover--control--border-color: $primary-blue-dark;
$sm-radio--checked--hover--control--background-color: $true-white;
$sm-radio--checked--hover--control--foreground-color: $primary-blue-dark;
$sm-radio--checked--control--border-color: $primary-blue;
$sm-radio--checked--control--background-color: $true-white;
$sm-radio--checked--control--foreground-color: $primary-blue;
$sm-radio--invalid--label-color: $app-warning;
$sm-radio--invalid--control--background-color: $app-warning;
$sm-radio--invalid--control--foreground-color: $true-white;
$sm-radio--required--asterisk-color: $app-warning;
$sm-radio--disabled--label-color: $grey-neu-mid;
$sm-radio--disabled--control--border-color: $grey-neu-mid;
$sm-radio--disabled--control--background-color: $grey-neu-white;
$sm-radio--disabled--control--foreground-color: transparent;
$sm-radio--checked--disabled--control--border-color: $grey-neu-mid;
$sm-radio--checked--disabled--control--background-color: $grey-neu-white;
$sm-radio--checked--disabled--control--foreground-color: $grey-neu-mid;

.sm-radio {
  label {
    color: $sm-radio--text-color;
  }

  &__label {
    display: inline-block;
    transition: color 0.3s ease;
    cursor: pointer;
    margin-bottom: 8px;
    padding-left: 26px;
  }

  &__required-asterisk {
    color: $sm-radio--required--asterisk-color;
    display: inline-block;
    margin-left: 0.35em;
    font-weight: 600;
  }

  &__control {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid $sm-radio--control--border-color;
    background: $sm-radio--control--background-color;
    position: relative;
    border-radius: 16px;
    margin-bottom: -4px;
    margin-right: 5px;
    cursor: pointer;
    position: absolute;
    margin-top: 2px;

    span {
      display: inline-block;
      width: 10px;
      height: 10px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: $sm-radio--control--foreground-color;
      border-radius: 50%;
    }

    &, span {
      transition: background-color 0.3s ease,
        border-color 0.3s ease,
        color 0.3s ease;
    }
  }

  input {
    @include sr-only
  }

  .sm-form--inline & .sm-field-error {
    display: inline;
  }

  /**
   * Active (on) State
   */
  &--checked &__control {
    border-color: $sm-radio--checked--control--border-color;
    background: $sm-radio--checked--control--background-color;

    span {
      background: $sm-radio--checked--control--foreground-color;
    }
  }

  /**
   * Hover State
   */
  &__control:hover {
    border-color: $sm-radio--hover--control--border-color;
    background: $sm-radio--hover--control--background-color;

    span {
      background: $sm-radio--hover--control--foreground-color;
    }
  }

  &--checked &__control:hover {
    border-color: $sm-radio--checked--hover--control--border-color;
    background: $sm-radio--checked--hover--control--background-color;

    span {
      background: $sm-radio--checked--hover--control--foreground-color;
    }
  }

  /**
   * Focus State
   */

  /* Fallback for browsers that don't support focus-visible */
  &__field:focus ~ &__control {
    outline: 2px solid $grey-neu-black;
    outline-offset: 1px;
    transition: none;
  }

  &__field:focus:not(:focus-visible) ~ &__control {
    outline: 0;
  }

  &__field:focus-visible ~ &__control {
    outline: 2px solid $grey-neu-black;
    outline-offset: 1px;
    transition: none;
  }

  /**
   * Invalid State
   */
  &.sm-validation--invalid &__label {
    color: $sm-radio--invalid--label-color;
  }

  &.sm-validation--invalid &__control {
    background-color: $sm-radio--invalid--control--background-color;

    span {
      background-color: $sm-radio--invalid--control--foreground-color;
    }
  }

  /**
   * Disabled State
   */
  &--disabled &__label {
    color: $sm-radio--disabled--label-color;
  }

  &--disabled &__control{
    cursor: not-allowed;
    opacity: 1;
    border-color: $sm-radio--disabled--control--border-color;
    background: $sm-radio--disabled--control--background-color;
    border-width: 1px;
    padding: 1px;

    span {
      background: $sm-radio--disabled--control--foreground-color;
    }
  }

  &--disabled.sm-radio--checked &__control {
    border-color: $sm-radio--checked--disabled--control--border-color;
    background: $sm-radio--checked--disabled--control--background-color;

    span {
      background: $sm-radio--checked--disabled--control--foreground-color;
    }
  }

}
</style>
