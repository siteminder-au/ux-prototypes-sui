<script setup lang="ts">
import { computed, ref, Ref } from 'vue'
import { FieldMeta } from '../shared/sm-field-label.types'
import { SmDatePickerInputMode, SmDatePickerModelValueInput } from './sm-date-picker.types'

const props = withDefaults(defineProps<{
  /**
   * Whether the field is disabled. Can be set via `disabled` prop from
   * the main sm-date-picker component or a parent sm-form component
   */
  disabled?: boolean
  /**
   * The HTML element ID
   */
  id?: string
  /**
   * Whether the input is styled as a date-range's start or end input
   * If undefined, it'll be styled as a single input
   */
  inputMode?: SmDatePickerInputMode
  /**
   * The label of the input element
   */
  label?: string
  /**
   * Native name attribute
   */
  name?: string
  /**
   * An sm-icon name to be displayed to the left of the input
   */
  prefixIcon?: string
  /**
   * An sm-icon name to be displayed to the right of the input
   */
  suffixIcon?: string
  /**
   * Native readonly attribute
   */
  readonly?: boolean | string
  /**
   * Validation and interaction state of the field
   */
  state?: (FieldMeta & { focused?: boolean }) | null
}>(), {
  disabled: false,
  id: '',
  inputMode: undefined,
  label: undefined,
  name: undefined,
  prefixIcon: '',
  suffixIcon: '',
  readonly: false,
  state: null,
})

const emit = defineEmits<{
  /**
   * Emitted when the input field is blurred
   */
  blur: [value: FocusEvent]
  /**
   * Emitted when the input field's value changes
   */
  change: [value: Event]
  /**
   * Emitted when the input field is focused
   */
  focus: [value: FocusEvent]
  /**
   * Emitted when the input field's value changes
   */
  'update:modelValue': [value: SmDatePickerModelValueInput]
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
 * Emits 'update:modelValue': [value: ModelValueInput] when this ref changes
 * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
 */
const modelValue = defineModel<SmDatePickerModelValueInput>({
  default: undefined,
})

const inputValue = computed({
  get: () => {
    // IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
    // Was previously: props.value
    return modelValue.value
  },
  set: () => {
    // Do nothing here since the v-calendar component in the parent sm-date-picker
    // will handle the parsing and update the v-model value using the 'input' event
  },
})

const computedReadonly = computed(() => {
  // Fixing the tsc error: Type 'string | undefined' is not assignable to type 'boolean | undefined'
  // Native readonly attribute's can be string and it's described as - "the presence of a boolean attribute
  // on an element represents the true value, and the absence of the attribute represents the false value."
  // However, the typechecking expects a boolean so we need to cast it to a boolean
  return typeof props.readonly === 'string' ? true : props.readonly
})

const input: Ref<HTMLInputElement | null> = ref(null)

const focusInput = (): void => {
  if (typeof input.value?.focus === 'function') {
    input.value.focus()
  }
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

const change: GlobalEventHandlers['onchange'] = (e) => {
  emit('change', e)
}

const inputEvents = {
  focus,
  blur,
  change,
}

const iconEvents = {
  click: focusInput,
}
</script>

<template>
  <!--
    The bindings here are to added to keep the native and custom attributes
    consistent with Vue2 in case they are used in styling and/or testing the component.
  -->
  <span
    :class="$attrs.class"
    :value="$attrs.value"
  >
    <div
      :class="{
        'sm-date-picker-input': true,
        'sm-field--dirty': state && state.dirty,
        'sm-field--invalid': state && (state.validated || state.touched) && !state.valid,
        'sm-field--touched': state && state.touched,
        'sm-field--valid': state && (state.dirty && state.valid),
        'sm-field--validated': state && state.validated,
        'sm-date-picker-input--disabled': disabled,
        'sm-date-picker-input--focussed': state && state.focused,
      }"
    >

      <div
        class="sm-date-picker-input__body"
      >
        <span
          v-if="$slots.prefix"
          class="sm-date-picker-input__prefix-slot"
        >
          <!-- @slot Appears to the left of the input. Can be used to create a mixed input. -->
          <slot name="prefix" />
        </span>

        <span
          v-if="prefixIcon"
          class="sm-date-picker-input__prefix-icon"
          v-on="iconEvents"
        >
          <sm-icon
            :name="prefixIcon"
            aria-hidden="true"
          />
        </span>

        <input
          :id="id"
          ref="input"
          v-model="inputValue"
          autocomplete="off"
          :class="[
            {
              'sm-date-picker-input__field': true,
              'sm-p': true,
              'sm-date-picker-input__field--start': inputMode === SmDatePickerInputMode.START,
              'sm-date-picker-input__field--end': inputMode === SmDatePickerInputMode.END,
              'sm-date-picker-input__icon-suffix': suffixIcon,
              'sm-date-picker-input__icon-prefix': prefixIcon,
              'sm-date-picker-input__slot-prefix': $slots.prefix,
              'sm-date-picker-input__slot-suffix': $slots.suffix,
            },
          ]"
          :disabled="disabled"
          :name="name"
          :readonly="computedReadonly"
          :aria-invalid="!state?.valid"
          :aria-disabled="disabled"
          :aria-label="label"
          v-bind="{ ...$attrs }"
          v-on="inputEvents"
        >

        <span
          v-if="suffixIcon"
          class="sm-date-picker-input__suffix-icon"
          v-on="iconEvents"
        >
          <sm-icon
            :name="suffixIcon"
            aria-hidden="true"
          />
        </span>

        <span
          v-if="$slots.suffix"
          class="sm-date-picker-input__suffix-slot"
        >
          <!-- @slot Appears to the right of the input. Can be used to create a mixed input. -->
          <slot name="suffix" />
        </span>
      </div>

    </div>
  </span>
</template>

<style lang="scss">
@import "../../../common/variables";
@import "../../../common/mixins";

:root {
  /* Common */
  --sm-c-input-color-background: var(--color-pure-white);
  --sm-c-input-color-border: var(--color-app);
  --sm-c-input-color-text: var(--color-black);

  /* Focus */
  --sm-c-input-color-border-focus: var(--color-primary);
  --sm-c-input-color-icon-focus: var(--color-primary);

  /* Invalid */
  --sm-c-input-color-border-invalid: var(--color-warning);
  --sm-c-input-color-icon-invalid: var(--color-warning);

  /* Disabled */
  --sm-c-input-color-background-disabled: var(--color-disabled-light);
  --sm-c-input-color-border-disabled: var(--color-disabled-mid);
  --sm-c-input-color-text-disabled: var(--color-disabled);

  /* Prefix slot */
  --sm-c-input-prefix-slot-color-background: var(--color-disabled-light);
  --sm-c-input-prefix-slot-color-border: var(--color-disabled-mid);
  --sm-c-input-prefix-slot-color-text: var(--color-black);

  /* Suffix slot */
  --sm-c-input-suffix-slot-color-background: var(--color-disabled-light);
  --sm-c-input-suffix-slot-color-border: var(--color-disabled-mid);
  --sm-c-input-suffix-slot-color-text: var(--color-black);
}

.sm-date-picker-input {
  &__body {
    position: relative;
    background: var(--sm-c-input-color-background, $true-white);
    border-radius: 4px;
    color: var(--sm-c-input-color-text, $grey-neu-black);
    transition: all 0.3s ease;
    display: flex;
    width: 100%;
    height: 40px;
    margin-bottom: 1px;
  }

  &__field {
    border: 1px solid var(--sm-c-input-color-border, $blue-neu-mid);
    border-radius: 4px;
    background: transparent;
    color: var(--sm-c-input-color-text, $grey-neu-black);
    padding: 10px $sm-12;
    outline: none;
    margin: 0;
    flex-grow: 2;
    width: 100%;
    overflow: hidden;
    transition: box-shadow 0.3s ease, border-color 0.3s ease, color 0.3s ease;

    &--start {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
      text-align: center;
    }

    &--end {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: 0;
      text-align: center;
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
    border: 1px solid var(--sm-c-input-color-border, $blue-neu-mid);
    display: flex;
    transition: box-shadow 0.3s ease, border-color 0.3s ease, color 0.3s ease;

    .sm-icon {
      top: 0;
    }
  }

  &__prefix-icon {
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    border-right: 0;
    padding: $sm-8 6px $sm-8 $sm-12;
  }

  &__prefix-slot ~ &__prefix-icon {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  &__suffix-icon {
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    border-left: 0;
    padding: $sm-8 $sm-12 $sm-8 6px;
  }

  &__slot-suffix ~ &__suffix-icon {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  /**
   * Prefix / Suffix Slots
   *
   * Support all combinations that are already in sm-input to keep parity
   */
  &__prefix-slot {
    color: var(--sm-c-input-prefix-slot-color-text, $grey-neu-black);
    border: 1px solid var(--sm-c-input-prefix-slot-color-border, $grey-neu-med);
    background: var(--sm-c-input-prefix-slot-color-background, $grey-neu-white);
  }

  &__suffix-slot {
    color: var(--sm-c-input-suffix-slot-color-text, $grey-neu-black);
    border: 1px solid var(--sm-c-input-suffix-slot-color-border, $grey-neu-med);
    background: var(--sm-c-input-suffix-slot-color-background, $grey-neu-white);
  }

  &__prefix-slot,
  &__suffix-slot {
    display: flex;

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
      margin-top: -1px;

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
          background-color: $app-info-light;
          border: 1px solid $app-info-mid;
          border-radius: 4px;
          height: 40px;
          min-height: 40px;
          transition: all 0.3s ease;
          padding: 3px $sm-40 3px $sm-12;
        }

        &__tags:hover,
        span:hover ~ .multiselect__tags {
          background-color: $blue-neu-med;
          border-color: $blue-neu-mid;
        }

        &__tags:active,
        span:active ~ .multiselect__tags {
          background-color: $blue-neu-mid;
          border-color: $light-blue-grey;
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
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;

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

    .sm-button .sm-button__content,
    .sm-radio .sm-radio__label,
    .sm-checkbox .sm-checkbox__label {
      border-radius: 4px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  &__suffix-slot {
    border-left: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;

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

    .sm-button .sm-button__content,
    .sm-radio .sm-radio__label,
    .sm-checkbox .sm-checkbox__label {
      border-radius: 4px;
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
    box-shadow: inset 0 -1px 0 0 var(--sm-c-input-color-border-focus, $primary-blue);
    border-color: var(--sm-c-input-color-border-focus, $primary-blue);
  }

  &--focussed &__prefix-icon,
  &--focussed &__suffix-icon {
    color: var(--sm-c-input-color-icon-focus, $primary-blue);
  }

  /**
   * Invalid State
   */
  .sm-field--invalid &__field,
  .sm-field--invalid &__prefix-icon,
  .sm-field--invalid &__suffix-icon {
    border-color: var(--sm-c-input-color-border-invalid, $app-warning);
  }

  .sm-field--invalid &__prefix-icon,
  .sm-field--invalid &__suffix-icon {
    color: var(--sm-c-input-color-icon-invalid, $app-warning);
  }

  /**
   * Focus and Invalid State
   */
  &--focussed.sm-field--invalid &__field,
  &--focussed.sm-field--invalid &__prefix-icon,
  &--focussed.sm-field--invalid &__suffix-icon {
    box-shadow: inset 0 -1px 0 0 var(--sm-c-input-color-border-invalid, $app-warning);
  }

  /**
   * Disabled State
   */
  &--disabled &__field {
    color: $grey-neu-mid;
    background: $grey-neu-white;
    border-color: $grey-neu-med;
    pointer-events: none;
  }

  &--disabled {
    .sm-date-picker-input__prefix-icon,
    .sm-date-picker-input__suffix-icon {
      background: var(--sm-c-input-color-background-disabled, $grey-neu-white);
      border-color: var(--sm-c-input-color-border-disabled, $grey-neu-med);
      color: var(--sm-c-input-color-text-disabled, $grey-neu-mid);
    }
  }
}
</style>
