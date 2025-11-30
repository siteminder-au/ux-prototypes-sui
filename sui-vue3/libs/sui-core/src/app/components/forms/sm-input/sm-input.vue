<script setup lang="ts">
import { pick } from 'lodash-es'
import { useField } from 'vee-validate'
import { computed, inject, ref, Ref, useAttrs } from 'vue'
import { useUniqueId } from '../../use/unique-id'
import SmFieldLabel from '../shared/sm-field-label.vue'
import SmFieldError from '../shared/sm-field-error.vue'
import { useIsFieldRequired } from '../shared/use-is-field-required'
import { SmInputResize, SmInputType, SmInputValidationMode, SmInputModelValue } from './sm-input.types'
import { FormProviderKey } from '../sm-form/symbols'

const props = withDefaults(defineProps<{
  /**
   * Allow exponential notation for numeric inputs. E.g. `1e3 === 100`
   */
  allowExponential?: boolean
  /**
   * Native auto-complete attribute
   */
  autoComplete?: string
  /**
   * Native autofocus attribute
   */
  autofocus?: boolean
  /**
   * Add classes to HTML elements input or textarea for external api usage. For example, mask PII data, such as credit card details
   */
  contentClass?: string
  /**
   * Number type controls. Only to be used with a 'number' type
   */
  controls?: boolean
  /**
   * Whether to show a character counter
   */
  counter?: boolean
  /**
   * Whether the field is disabled
   */
  disabled?: boolean
  /**
   * Disable the increment number button that is displayed when controls is true
   */
  disableIncrement?: boolean
  /**
   * Disable the decrement number button that is displayed when controls is true
   */
  disableDecrement?: boolean
  /**
   * Whether the input is in sm-table's editable state
   */
  editableCell?: boolean
  /**
   * Disable the error text
   */
  errorDisabled?: boolean
  /**
   * This events include handlers for events that ultimately assign new dates and manage the appearance of the popover in in date-picker component
   */
  eventBinding?: any[] | object
  /**
   * Native form attribute
   */
  form?: string
  /**
   * Help text below the field
   */
  helpText?: string
  /**
   * Attach custom events on the prefix/suffix icons
   */
  iconEventBinding?: any[] | object
  /**
   * The HTML element ID
   */
  id?: string
  /**
   * The label of the input element
   */
  label?: string
  /**
   * Hides the label visually but still keeps it accessible to screen readers
   */
  labelHidden?: boolean
  /**
   * Native max attribute for the number type
   */
  max?: string | number
  /**
   * Native min attribute for the number type
   */
  min?: string | number
  /**
   * The maximum counter value of number controls
   */
  maxControlValue?: number | string
  /**
   * The minimum counter value of number controls
   */
  minControlValue?: number | string
  /**
   * The maximum input length
   */
  maxlength?: number | string
  /**
   * The minimum input length
   */
  minlength?: number | string
  /**
   * Native name attribute
   */
  name: string
  /**
   * An sm-icon name to be displayed to the left of the input
   */
  prefixIcon?: string
  /**
   * An sm-icon name to be displayed to the right of the input
   */
  suffixIcon?: string
  /**
   * Set the min width to prefix slot before truncation, accept only units of measurement. For example '100px'
   */
  prefixWidth?: string
  /**
   * Set the min width to suffix slot before truncation, accept only units of measurement. For example '100px'
   */
  suffixWidth?: string
  /**
   * Native readonly attribute
   */
  readonly?: string
  /**
   * Native resize attribute. Accepts 'none', 'both', 'horizontal', 'vertical'
   */
  resize?: SmInputResize
  /**
   * The number of rows in a textarea type input
   */
  rows?: number | string
  /**
   * Native step attribute
   */
  step?: number | string
  /**
   * Whether to allow strict number type check. For example setting this props true will not allow - + , inside the number input box
   */
  strictNumberTypeCheck?: boolean
  /**
   * The HTML input type. Accepts 'text', 'textarea', 'number', 'tel', 'url', 'email', 'phone', 'password', 'search'
   */
  type?: SmInputType
  /**
   * Set the width of an input box, in pixels or percentage. Default is '100%'
   */
  width?: string
  /**
   * The vee-validate rules - see: https://vee-validate.logaretm.com/v4/guide/global-validators/#available-rules
   */
  rules?: string | Record<string, unknown>
  /**
   * Whether to delay the input validation. Accepts value in milliseconds
   */
  // Deprecated in vee-validate@4. We need to reimplement this if there is a requirement from consumers
  // See https://github.com/logaretm/vee-validate/issues/4161
  // debounce?: number
  /**
   * Determines the interaction mode of the validator. Supports 'aggressive' and 'lazy'.
   * 'aggressive' will validate the input value on input change and 'lazy' will validate on blur.
   * 'eager', 'passive' and a custom function mode are deprecated.
   * If not set, it will use the default behavior which is aggressive
   */
  // Deprecated in vee-validate@4. We need to reimplement this if there is a requirement from consumers
  // See https://github.com/logaretm/vee-validate/issues/4161
  mode?: SmInputValidationMode
  /**
   * Additional options passed to vee-validate's useField. See https://vee-validate.logaretm.com/v4/api/use-field/
   * Helpful when building complex components with nested sm-input
   */
  validationOptions?: Record<string, unknown>
}>(), {
  // Default to undefined since most of these are added as native input/textarea attributes and null is not a valid value
  // In addition, empty strings ('') result to the native attributes being attached with no values
  allowExponential: false,
  autoComplete: undefined,
  autofocus: false,
  contentClass: undefined,
  controls: false,
  counter: false,
  disabled: false,
  disableDecrement: false,
  disableIncrement: false,
  editableCell: false,
  errorDisabled: false,
  eventBinding: undefined,
  form: undefined,
  helpText: '',
  iconEventBinding: undefined,
  id: '',
  label: undefined,
  labelHidden: false,
  max: undefined,
  min: undefined,
  maxControlValue: undefined, // undefined since it breaks functionality on null
  minControlValue: undefined, // undefined since it breaks functionality on null
  maxlength: undefined,
  minlength: undefined,
  name: undefined,
  prefixIcon: '',
  suffixIcon: '',
  prefixWidth: '',
  suffixWidth: '',
  readonly: undefined,
  resize: undefined,
  rows: undefined,
  step: undefined,
  strictNumberTypeCheck: true,
  type: SmInputType.TEXT,
  width: '100%',
  rules: undefined,
  // debounce: undefined, // undefined since it breaks validation-provider on null
  mode: undefined,
  validationOptions: undefined,
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
   * Emits on focus
   */
  focus: [value: FocusEvent]
  /**
   * Emits when the v-model is updated
   * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
   */
  'update:modelValue': [value: SmInputModelValue]
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
    // `aria-invalid/aria-disabled/aria-required` attribute attached even if the value of it is false
    // in vue2, aria-invalid/aria-disabled/aria-required was removed if the value was false.
    ATTR_FALSE_VALUE: 'suppress-warning',
  },
  inheritAttrs: false,
})

/**
 * v-model for `modelValue` prop
 * Emits 'update:modelValue': [value: SmInputModelValue] when this ref changes
 * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
 */
const modelValue = defineModel<SmInputModelValue>({ default: undefined })

// Get the style attribute from the component
const attrs = useAttrs()

// Get the style attribute from the component
const rootStyleAttr = computed<any>(() => (attrs.style))

const customAttrs = computed(() => {
  const inputStyleAttr = { ...attrs }
  if (inputStyleAttr.style) {
    // Remove the style attribute from the input attributes object
    delete inputStyleAttr.style
  }
  if (inputStyleAttr.class) {
    // Remove the class attribute from the input attributes object
    delete inputStyleAttr.class
  }
  return inputStyleAttr
})

const computedRules = computed(() => props.rules)
const { errors, meta, handleChange, validate } = useField(
  () => props.name,
  computedRules,
  {
    // Turn off configs that trigger validation when the mode is set to lazy
    syncVModel: props.mode !== SmInputValidationMode.LAZY,
    validateOnValueUpdate: props.mode !== SmInputValidationMode.LAZY,
    ...props.validationOptions,
  },
)
const { required } = useIsFieldRequired(computedRules)

// data provided by sm-form
const formProvider = inject(FormProviderKey, { disabled: ref(false) })
const isFormDisabled = computed(() => formProvider.disabled.value)

const inputTag = computed(() => (props.type === SmInputType.TEXTAREA ? 'textarea' : 'input'))

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

const totalSuffixWidth = `${parseInt(props.suffixWidth, 10) + 50}px`
const totalPrefixWidth = `${parseInt(props.prefixWidth, 10) + 50}px`
const { id: defaultInputId } = useUniqueId('sm-input_')
const { id: errorMessageId } = useUniqueId('sm-input__error_')
const inputId = computed(() => props.id || defaultInputId.value)
const errorMessageValue = computed(() => (props.errorDisabled ? null : errorMessageId.value))

const inputAttrBindings = computed(() => {
  return {
    id: inputId.value ?? undefined,
    // Wires up the input's state and displayed validation error message
    // See https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-errormessage
    'aria-errormessage': errorMessageValue.value ?? undefined,
    'aria-invalid': !meta.valid,
    'aria-disabled': props.disabled || isFormDisabled.value,
    'aria-required': required.value,
    'aria-label': props.label,
    disabled: props.disabled || isFormDisabled.value,
    // Fixing the tsc error: Type 'string | undefined' is not assignable to type 'boolean | undefined'
    // Native readonly attribute's can be string and it's described as - "the presence of a boolean attribute
    // on an element represents the true value, and the absence of the attribute represents the false value."
    // However, the typechecking expects a boolean so we need to cast it to a boolean
    readonly: typeof props.readonly === 'string' ? true : props.readonly,
    ...pick(props, ['type', 'minlength', 'maxlength', 'min', 'max', 'rows', 'autoComplete', 'name', 'step', 'resize', 'autofocus', 'form']),
  }
})

const input: Ref<HTMLInputElement | null> = ref(null)
const inputBody = ref<HTMLElement | null>(null)
const inputHeader = ref<HTMLElement | null>(null)

const focusInput = (): void => {
  if (typeof input.value?.focus === 'function') {
    input.value.focus()
  }
}

const blurInput = (): void => {
  if (typeof input.value?.blur === 'function') {
    input.value.blur()
  }
}

const numberCounter = (n: number, event: Event): undefined | null => {
  const counter = inputValue.value ? Number(inputValue.value) + n : n
  const minControlValue = Number(props.minControlValue)
  const maxControlValue = Number(props.maxControlValue)
  if (counter < minControlValue || counter > maxControlValue) {
    return null
  }
  inputValue.value = counter
  emit('change', event)
  focusInput()
  blurInput()
}

const focussed = ref(false)

const focus: GlobalEventHandlers['onfocus'] = (e) => {
  focussed.value = true
  emit('focus', e)
}

const blur: GlobalEventHandlers['onblur'] = (e) => {
  focussed.value = false
  emit('blur', e)
}

/**
 * Triggered when the element loses focus after the value changed
 * See https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
 */
const change: GlobalEventHandlers['onchange'] = (e) => {
  emit('change', e)

  if (props.mode === SmInputValidationMode.LAZY) {
    // Updates the field value, and validates the field - https://vee-validate.logaretm.com/v4/api/use-field
    handleChange(e)
  }
}

const keydown: GlobalEventHandlers['onkeydown'] = (e) => {
  if (props.type === SmInputType.NUMBER && !props.allowExponential) {
    if (e.key === 'e') {
      e.preventDefault()
    }
  }
  // To not allow - + , inside the input box
  if (props.type === SmInputType.NUMBER && !props.allowExponential && props.strictNumberTypeCheck) {
    if (e.key === '-' || e.key === '+' || e.key === '-') {
      e.preventDefault()
      return false
    }
  }
}

const inputEventBindings = ref()
const customsEvents: Ref<object | any[] | undefined> = ref(props.eventBinding)

const inputEvents = {
  focus,
  blur,
  change,
  keydown,
}

if (customsEvents.value) {
  inputEventBindings.value = { ...inputEvents, ...customsEvents.value }
} else {
  inputEventBindings.value = inputEvents
}

const iconEventBindings = ref()
const customIconEvents: Ref<object | any[] | undefined> = ref(props.iconEventBinding)

const iconEvents = {
  click: focusInput,
}

if (customIconEvents.value) {
  iconEventBindings.value = { ...iconEvents, ...customIconEvents.value }
} else {
  iconEventBindings.value = iconEvents
}

const characterCount = computed(() => {
  if (!props.counter) {
    return
  }

  const characterLength = typeof inputValue.value === 'string' ? inputValue.value.length : 0

  if (props.maxlength) {
    return `${characterLength}/${props.maxlength}`
  }

  return characterLength
})

defineExpose({
  inputId,
  inputTag,
  inputValue,
  inputAttrBindings,
  focussed,
  input,
  inputBody,
  inputHeader,
  inputEventBindings,
  iconEventBindings,
  characterCount,
  numberCounter,
  totalSuffixWidth,
  totalPrefixWidth,
  isFormDisabled,
  validate,
})
</script>

<template>
  <span
    :class="$attrs.class"
    :style="rootStyleAttr"
  >
    <div
      class="sm-input"
      :class="{
        'sm-field--dirty': meta && meta.dirty,
        'sm-field--invalid': meta && (meta.validated || meta.touched) && !meta.valid,
        'sm-field--touched': meta && meta.touched,
        'sm-field--valid': meta && (meta.dirty && meta.valid),
        'sm-field--validated': meta && meta.validated,
        [`sm-input--type-${type}`]: !!type,
        'sm-input--disabled': disabled || isFormDisabled,
        'sm-input--editable-cell': editableCell,
        'sm-input--focussed': focussed,
        'sm-input--number-controlled': controls,
      }"
    >
      <div
        ref="inputHeader"
        class="sm-input__header"
      >
        <sm-field-label
          v-if="!labelHidden"
          :for="inputId"
          :required="required"
          :focussed="focussed"
          :state="meta"
        >
          <!-- @slot The form label. Overrides the label prop -->
          <slot name="label">
            {{ label }}
          </slot>
        </sm-field-label>

        <span
          v-if="counter"
          class="sm-input__counter sm-text--small"
          aria-hidden="true"
        >
          {{ characterCount }}
        </span>

        <span
          v-if="$slots.action"
          class="sm-input__action"
        >
          <!-- @slot The field action next to the label. Example usage: adding a helper icon to provide more context on the field. -->
          <slot name="action" />
        </span>
      </div>
      <div class="sm-input__wrap">
        <div
          v-if="type === 'number' && controls"
          class="sm-input__number-controls sm-input__number-controls-decrement sm-text--small"
          aria-hidden="true"
        >
          <button
            :disabled="disableDecrement"
            class="sm-input__number-controls-button"
            :class="{ 'sm-input__number-controls-decrement--disabled': disableDecrement }"
            tabindex="-1"
            type="button"
            @click="$event => numberCounter(-1, $event)"
          >
            <sm-icon
              size="large"
              name="controls-minus"
              class="sm-input__number-controls-icon"
            />
          </button>
        </div>

        <div
          ref="inputBody"
          class="sm-input__body"
        >
          <span
            v-if="$slots.prefix"
            class="sm-input__prefix-slot"
            :style="{ width: totalPrefixWidth, minWidth: totalSuffixWidth }"
          >
            <!-- @slot Appears to the left of the input. Can be used to create a mixed input. -->
            <slot name="prefix" />
          </span>

          <span
            v-if="prefixIcon"
            class="sm-input__prefix-icon"
            v-on="iconEventBindings"
          >
            <sm-icon
              :name="prefixIcon"
              aria-hidden="true"
            />
          </span>

          <textarea
            v-if="inputTag === 'textarea'"
            ref="input"
            v-model="inputValue"
            class="sm-input__field sm-p"
            :class="[
              {
                'sm-input__icon-suffix': suffixIcon,
                'sm-input__icon-prefix': prefixIcon,
                'sm-input__slot-prefix': $slots.prefix,
                'sm-input__slot-suffix': $slots.suffix,
              },
              contentClass,
            ]"
            :style="{ 'resize': resize }"
            v-bind="{ ...customAttrs, ...inputAttrBindings }"
            v-on="inputEventBindings"
            @blur="validate()"
          />
          <input
            v-else
            ref="input"
            v-model="inputValue"
            class="sm-input__field sm-p"
            :class="[
              {
                'sm-input__icon-suffix': suffixIcon,
                'sm-input__icon-prefix': prefixIcon,
                'sm-input__slot-prefix': $slots.prefix,
                'sm-input__slot-suffix': $slots.suffix,
              },
              contentClass,
            ]"
            v-bind="{ ...customAttrs, ...inputAttrBindings }"
            style="-moz-appearance: textfield"
            :style="{ width: width }"
            v-on="inputEventBindings"
            @blur="validate()"
          >

          <span
            v-if="suffixIcon"
            class="sm-input__suffix-icon"
            v-on="iconEventBindings"
          >
            <sm-icon
              :name="suffixIcon"
              aria-hidden="true"
            />
          </span>

          <span
            v-if="$slots.suffix"
            class="sm-input__suffix-slot"
            :style="{ width: totalSuffixWidth, minWidth: totalSuffixWidth }"
          >
            <!-- @slot Appears to the right of the input. Can be used to create a mixed input. -->
            <slot name="suffix" />
          </span>
        </div>

        <div
          v-if="type === 'number' && controls"
          class="sm-input__number-controls sm-input__number-controls-increment"
          aria-hidden="true"
        >
          <button
            :disabled="disableIncrement"
            class="sm-input__number-controls-button"
            :class="{ 'sm-input__number-controls-increment--disabled': disableIncrement }"
            tabindex="-1"
            type="button"
            @click="$event => numberCounter(1, $event)"
          >
            <sm-icon
              size="large"
              name="controls-add"
              class="sm-input__number-controls-icon"
            />
          </button>
        </div>
      </div>

      <div
        v-if="helpText"
        class="sm-input__help-text sm-text--small"
      >
        {{ helpText }}
      </div>

      <div
        v-if="!errorDisabled"
        class="sm-input__footer"
      >
        <!--
          Use v-bind syntax here to work around aria-* attributes not getting recognized as prop name which allows aria roles to be attached to custom components.
          However aria-msg in this instance is a prop name rather than an attribute
          See https://github.com/vuejs/language-tools/blob/19cc0f56865fa3827420b15e85f4ab26e9850e18/vue-language-tools/vue-language-core/schemas/vue-tsconfig.schema.json#L39-L48
        -->
        <sm-field-error
          v-bind="{
            ariaMsg: {
              'aria-live': errors?.length ? 'assertive' : 'off',
              id: errorMessageId,
            }
          }"
          :errors="errors"
        />
      </div>
    </div>
  </span>
</template>

<style lang="scss">
@import "../../../common/variables";
@import "../../../common/mixins";

$sm-input--placeholder-color: $grey-neu-mid;
$sm-input--border-color: $blue-neu-mid;
$sm-input--border-radius: 4px;
$sm-input--text-color: $grey-neu-black;
$sm-input--background-color: $true-white;
$sm-input--required--asterisk-color: $app-warning;
$sm-input--invalid--label-color: $app-warning;
$sm-input--invalid--border-color: $app-warning;
$sm-input--hover--border-color: #686868;
$sm-input--focus--border-color: $primary-blue;
$sm-input--number-controls-color: $primary-blue;
$sm-input--number-controls--background-color: $true-white;
$sm-input--number-controls--hover-background-color: $blue-neu-med;
$sm-input--number-controls--focus-border-color: $blue-neu-mid;
$sm-input--disabled--border-color: $grey-neu-med;
$sm-input--disabled--text-color: $grey-neu-mid;
$sm-input--disabled--label-color: $grey-neu-mid;
$sm-input--disabled--background-color: $grey-neu-white;
$sm-input--disabled--number-controls--border-color: $grey-neu-mid;
$sm-input--prefix-slot--text-color: $grey-neu-black;
$sm-input--prefix-slot--background-color: $grey-neu-white;
$sm-input--prefix-slot--border-color: $grey-neu-med;
$sm-input--help-text--color: $grey-neu-dark;
$sm-input--select--info--border-color: $app-info-mid;
$sm-input--select--info--background-color: $app-info-light;
$sm-input--select--info--hover-background-color: $blue-neu-med;
$sm-input--select--info--hover-border-color: $blue-neu-mid;
$sm-input--select--info--focus-background-color: $blue-neu-mid;
$sm-input--select--info--focus-border-color: $light-blue-grey;
$sm-input--editable-cell--focus--background-color: $app-info-light;
$sm-input--editable-cell--invalid--background-color: $app-warning-light;

.sm-input {
  &__header {
    justify-content: space-between;
    display: flex;
    position: relative;
  }

  &__wrap {
    display: flex;
  }

  &__body {
    position: relative;
    height: 40px;
  }

  &__action {
    margin-right: auto;

    @include padding($left: rem($sm-xxsm), $top: rem($sm-xxsm));
  }

  /**
  * Number input with controls
  **/

  &--number-controlled {
    .sm-input__wrap {
      align-items: center;
      min-width: 155px;
    }

    .sm-input__body {
      max-width: 80px;
    }

    .sm-input__field {
      text-align: center;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        appearance: none;
      }
    }
  }

  &__number-controls {
    position: relative;
    width: 32px;
    height: 32px;
    margin-bottom: 1px;
  }

  &__number-controls-decrement {
    margin-right: 5px;
  }

  &__number-controls-increment {
    margin-left: 5px;
  }

  &__number-controls-button {
    position: absolute;
    cursor: pointer;
    top: 50%;
    width: 100%;
    height: 100%;
    transform: translateY(-50%);
    color: $sm-input--number-controls-color;
    border: 2px solid $sm-input--number-controls-color;
    background: $sm-input--number-controls--background-color;
    border-radius: 50%;
    padding: 0;
    transition: all 0.3s;

    &:hover {
      background: $sm-input--number-controls--hover-background-color;
    }

    &:focus {
      box-shadow: none;
      outline: none;
      background: $sm-input--number-controls--focus-border-color;
    }
  }

  &__number-controls-icon.sm-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__help-text {
    padding-top: 3px;
    padding-bottom: 0;
    color: $sm-input--help-text--color;
  }

  &__footer {
    min-height: 32px;
  }

  &__required-asterisk {
    color: $sm-input--required--asterisk-color;
    display: inline-block;
    margin-left: 0.35em;
    font-weight: 600;
  }

  &__counter {
    display: inline-block;
    margin-bottom: 8px;
    padding-top: 10px;
  }

  &__body {
    background: $sm-input--background-color;
    border-radius: $sm-input--border-radius;
    color: $sm-input--text-color;
    transition: all 0.3s ease;
    display: flex;
    width: 100%;
    margin-bottom: 1px;
  }

  &__field {
    border: 1px solid $sm-input--border-color;
    border-radius: $sm-input--border-radius;
    background: transparent;
    color: $sm-input--text-color;
    padding: 10px $sm-12;
    outline: none;
    margin: 0;
    flex-grow: 2;
    width: 100%;
    overflow: hidden;
    transition: box-shadow 0.3s ease, border-color 0.3s ease;

    &::-webkit-input-placeholder,
    &:-moz-placeholder,
    &::-moz-placeholder,
    &:-ms-input-placeholder {
      color: $grey-neu-mid;
      opacity: 1;
    }

    &::-webkit-search-decoration,
    &::-webkit-search-cancel-button,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
      -webkit-appearance: none;
    }
  }

  input {
    text-overflow: ellipsis;
  }

  &__slot-prefix,
  &__icon-prefix {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  &__slot-suffix,
  &__icon-suffix {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  &__icon-prefix {
    padding-left: 0;
    border-left-width: 0;
  }

  &__icon-suffix {
    padding-right: 0;
    border-right-width: 0;
  }

  &__prefix-icon,
  &__suffix-icon {
    align-items: center;
    border: 1px solid $sm-input--border-color;
    display: flex;
    transition: box-shadow 0.3s ease, border-color 0.3s ease, color 0.3s ease;

    .sm-icon {
      top: 0;
    }
  }

  &__prefix-icon {
    border-bottom-left-radius: $sm-input--border-radius;
    border-top-left-radius: $sm-input--border-radius;
    border-right: 0;
    padding: $sm-8 6px $sm-8 $sm-12;
  }

  &__prefix-slot ~ &__prefix-icon {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  &__suffix-icon {
    border-bottom-right-radius: $sm-input--border-radius;
    border-top-right-radius: $sm-input--border-radius;
    border-left: 0;
    padding: $sm-8 $sm-12 $sm-8 6px;
  }

  &__slot-suffix ~ &__suffix-icon {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  /**
   * Textarea styles
   */
  &--type-textarea textarea {
    min-height: 122px;
  }

  &--type-textarea &__prefix-icon,
  &--type-textarea &__suffix-icon,
  &--type-textarea &__prefix-slot,
  &--type-textarea &__suffix-slot {
    margin-bottom: 1px;
  }

  &--type-textarea &__body {
    height: auto;
    margin-bottom: 0;
    min-height: 123px;
  }

  /**
   * Prefix / Suffix Slots
   */
  &__prefix-slot,
  &__suffix-slot {
    display: flex;
    color: $sm-input--prefix-slot--text-color;
    border: 1px solid $sm-input--prefix-slot--border-color;
    background: $sm-input--prefix-slot--background-color;

    > span {
      width: 100%;
    }

    .sm-button {
      width: calc(100% + 1px);

      &__content {
        height: 100%;
      }
    }

    .sm-button:not(.sm-button--type_default) {
      margin-top: -1px;
      margin-bottom: -1px;
      padding: 0;
    }

    .sm-select {
      margin-top: -23px;

      .sm-field-label {
        @include sr-only;
      }

      &__indicator {
        width: 40px;
      }

      .multiselect {
        background-color: transparent;
        border: none;

        // For Vue3: Need to bump specificity to account for sm-select's Vue3 overrides
        .multiselect__tags {
          background-color: $sm-input--select--info--background-color;
          border: 1px solid $sm-input--select--info--border-color;
          border-radius: $sm-input--border-radius;
          height: 40px;
          min-height: 40px;
          transition: all 0.3s ease;
          padding: 3px $sm-40 3px $sm-12;
        }

        &__tags:hover,
        span:hover ~ .multiselect__tags {
          background-color: $sm-input--select--info--hover-background-color;
          border-color: $sm-input--select--info--hover-border-color;
        }

        &__tags:active,
        span:active ~ .multiselect__tags {
          background-color: $sm-input--select--info--focus-background-color;
          border-color: $sm-input--select--info--focus-border-color;
        }
      }

      .multiselect__single {
        background: transparent;
        padding-left: 0;
        padding-right: 0;
      }
    }
  }

  &__prefix-slot {
    border-right: 0;
    border-top-left-radius: $sm-input--border-radius;
    border-bottom-left-radius: $sm-input--border-radius;

    .sm-button:not(.sm-button--type_default),
    .sm-radio,
    .sm-checkbox,
    .sm-select {
      margin-left: -1px;
    }

    .sm-radio,
    .sm-checkbox {
      margin-right: 1px;
    }

    // For Vue3: Need to bump specificity to account for sm-select's Vue3 overrides
    .sm-select .multiselect .multiselect__tags {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
    }
  }

  &__suffix-slot {
    border-left: 0;
    border-top-right-radius: $sm-input--border-radius;
    border-bottom-right-radius: $sm-input--border-radius;

    .sm-button:not(.sm-button--type_default),
    .sm-radio,
    .sm-checkbox,
    .sm-select {
      margin-right: -1px;
    }

    // For Vue3: Need to bump specificity to account for sm-select's Vue3 overrides
    .sm-select .multiselect .multiselect__tags {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: 0;
    }
  }

  &__prefix-slot {
    .sm-button .sm-button__content,
    .sm-radio .sm-radio__label,
    .sm-checkbox .sm-checkbox__label {
      border-radius: $sm-input--border-radius;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  &__suffix-slot {
    .sm-button .sm-button__content,
    .sm-radio .sm-radio__label,
    .sm-checkbox .sm-checkbox__label {
      border-radius: $sm-input--border-radius;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }

  /**
   * Focus State
   */
  &--focussed &__field,
  &--focussed &__prefix-icon,
  &--focussed &__suffix-icon {
    outline: none;
    box-shadow: inset 0 -1px 0 0 $sm-input--focus--border-color;
    border-color: $sm-input--focus--border-color;
  }

  &--focussed &__prefix-icon,
  &--focussed &__suffix-icon {
    color: $sm-input--focus--border-color;
  }

  &--focussed.sm-input--type-textarea &__field,
  &--focussed.sm-input--type-textarea &__prefix-icon,
  &--focussed.sm-input--type-textarea &__suffix-icon,
  &--focussed.sm-input--type-textarea &__prefix-slot,
  &--focussed.sm-input--type-textarea &__suffix-slot {
    margin-bottom: 0;
  }

  /**
   * Invalid State
   */
  .sm-field--invalid &__field,
  .sm-field--invalid &__prefix-icon,
  .sm-field--invalid &__suffix-icon {
    border-color: $sm-input--invalid--border-color;
  }

  .sm-field--invalid &__prefix-icon,
  .sm-field--invalid &__suffix-icon {
    color: $sm-input--invalid--border-color;
  }

  /**
   * Focus and Invalid State
   */
  &--focussed.sm-field--invalid &__field,
  &--focussed.sm-field--invalid &__prefix-icon,
  &--focussed.sm-field--invalid &__suffix-icon {
    box-shadow: inset 0 -1px 0 0 $sm-input--invalid--border-color;
  }

  /**
   * Disabled State
   */
  &--disabled &__field,
  &--disabled &__number-controls-button,
  &__number-controls-increment--disabled,
  &__number-controls-decrement--disabled {
    color: $sm-input--disabled--text-color;
    background: $sm-input--disabled--background-color;
    border-color: $sm-input--disabled--border-color;
    pointer-events: none;
  }

  &--disabled &__number-controls-button,
  &__number-controls-increment--disabled,
  &__number-controls-decrement--disabled {
    border-color: $sm-input--disabled--number-controls--border-color;
  }

  &--disabled {
    .sm-input__prefix-icon,
    .sm-input__suffix-icon {
      background: $sm-input--disabled--background-color;
      border-color: $sm-input--disabled--border-color;
      color: $sm-input--disabled--text-color;
    }
  }

  /** Table cell editing state **/
  &--editable-cell {
    &.sm-input,
    .sm-input__wrap,
    .sm-input__body {
      height: 100%;
    }

    &.sm-input .sm-input__body {
      background-color: transparent;
      border-radius: 0;
      margin-bottom: 0;
      transition-property: background-color;
    }

    &.sm-input .sm-input__field {
      padding: $sm-12;
    }

    &.sm-input .sm-input__field,
    &.sm-input .sm-input__prefix-slot,
    &.sm-input .sm-input__suffix-slot {
      border: 0;
      border-radius: 0;
      margin-bottom: 0;
    }

    &.sm-input .sm-input__prefix-icon,
    &.sm-input .sm-input__suffix-icon {
      border: 0;
      border-radius: 0;
    }

    /** Focus State */
    &.sm-input--focussed .sm-input__body {
      background-color: $sm-input--editable-cell--focus--background-color;
      box-shadow: 0 0 0 1px $sm-input--focus--border-color;
    }

    /** Invalid State */
    &.sm-field--invalid .sm-input__body {
      background-color: $sm-input--editable-cell--invalid--background-color;
      box-shadow: 0 0 0 1px $sm-input--invalid--border-color;
    }
  }
}
</style>
