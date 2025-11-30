<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import { useField } from 'vee-validate'
import { useUniqueId } from '../../use/unique-id'
import { useIsFieldRequired } from '../shared/use-is-field-required'
import { FormProviderKey } from '../sm-form/symbols'
import SmFieldError from '../shared/sm-field-error.vue'
import { SmSwitchLayout, SmSwitchModelValue } from './sm-switch.types'

const props = withDefaults(defineProps<{
  /**
   * Whether the field is disabled
   */
  disabled?: boolean
  /**
   * The vee-validate rules - see: https://vee-validate.logaretm.com/v4/guide/components/validation
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
   * Hides the label visually but still keeps it accessible to screen readers
   */
  labelHidden?: boolean
  /**
   * The layout of the switch
   */
  layout?: SmSwitchLayout
  /**
   * Whether to show border bottom (only applicable when the sm-switch is with an sm-switch-group)
   */
  showBorderBottom?: boolean
  /**
   * Native name attribute.
   * Mandatory to ensure that vee-validate works correctly
   */
  name: string
  /**
   * Disable the error text
   */
  errorDisabled?: boolean
}>(), {
  disabled: false,
  rules: undefined,
  id: '',
  label: '',
  labelHidden: false,
  layout: 'vertical',
  showBorderBottom: true,
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
  'update:modelValue': [value: SmSwitchModelValue]
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
    // `aria-disabled` attribute attached even if the value of it is false
    // in vue2, aria-disabled was removed if the value was false.
    ATTR_FALSE_VALUE: 'suppress-warning',
  },
  inheritAttrs: false,
})

/**
 * v-model for `modelValue` prop
 * Emits 'update:modelValue': [value: SmSwitchModelValue] when this ref changes
 * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
 */
const modelValue = defineModel<SmSwitchModelValue>({
  default: undefined,
})

// see https://vee-validate.logaretm.com/v4/guide/composition-api/caveats/
// for some caveats when using useField
const computedRules = computed(() => props.rules)
const { meta, errors } = useField(
  () => props.name,
  computedRules,
  {
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

const { id: defaultInputId } = useUniqueId('sm-switch_')
const inputId = computed(() => props.id || defaultInputId.value)

// data provided by sm-form
const formProvider = inject(FormProviderKey, { disabled: ref(false) })
const isFormDisabled = computed(() => formProvider.disabled.value)

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

const onControlClick = () => {
  if (props.disabled || isFormDisabled.value) {
    return
  }
  inputValue.value = !inputValue.value
}

defineExpose ({
  inputValue,
  isFormDisabled,
})
</script>

<template>
  <span :class="$attrs.class">
    <div
      class="sm-switch"
      :class="{
        'sm-field--dirty': meta && meta.dirty,
        'sm-field--invalid': meta && (meta.validated || meta.touched) && !meta.valid,
        'sm-field--pristine': meta && !meta.dirty,
        'sm-field--touched': meta && meta.touched,
        'sm-field--untouched': meta && !meta.touched,
        'sm-field--valid': meta && (meta.dirty && meta.valid),
        'sm-field--validated': meta && meta.validated,
        'sm-switch--active': inputValue,
        'sm-switch--border-bottom' : showBorderBottom,
        'sm-switch--disabled': disabled || isFormDisabled,
        'sm-switch--focussed': focussed,
        [`sm-switch--${layout}`]: true,
      }"
      @click="(e) => $emit('click', e)"
    >
      <label
        v-if="!labelHidden"
        :for="inputId || undefined"
        class="sm-switch__label sm-text--small"
      >

        <!-- @slot The form label. Overrides the label prop -->
        <slot
          name="label"
        >{{ label }}</slot>

        <span
          v-if="required"
          class="sm-switch__required-asterisk"
          aria-hidden="true"
        >
          *
        </span>
      </label>

      <input
        v-bind="$attrs"
        :id="inputId || undefined"
        v-model="inputValue"
        type="checkbox"
        :name="name"
        class="sm-switch__field"
        :aria-label="label"
        :aria-disabled="disabled || isFormDisabled"
        :disabled="disabled || isFormDisabled"
        v-on="inputEventBindings"
      >

      <div
        class="sm-switch__control"
        aria-hidden="true"
        @click="onControlClick"
      >
        <span />
      </div>

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

$sm-switch--text-color: $grey-neu-black;
$sm-switch--control--background-color: $blue-neu-mid;
$sm-switch--control--foreground-color: $true-white;
$sm-switch--hover--control--background-color: $blue-neu-dark;
$sm-switch--active--control--background-color: $primary-blue;
$sm-switch--active--control--foreground-color: $true-white;
$sm-switch--active--hover--control--background-color: $primary-blue-dark;
$sm-switch--invalid--label-color: $app-warning;
$sm-switch--invalid--control--background-color: $app-warning;
$sm-switch--invalid--control--foreground-color: $true-white;
$sm-switch--required--asterisk-color: $app-warning;
$sm-switch--disabled--label-color: $grey-neu-mid;
$sm-switch--disabled--control--background-color: $grey-neu-med;
$sm-switch--disabled--active--control--background-color: $grey-neu-mid;
$sm-switch--disabled--control--foreground-color: $true-white;
$sm-switch--border-color: $blue-neu-mid;

.sm-switch {
  &--horizontal, &--horizontal-reverse {
    column-gap: $sm-8;
    display: flex;
    flex-flow: row wrap;
    width: 100%;

    .sm-field-error {
      min-height: 20px;
      width: 100%;
    }

    .sm-switch__label {
      margin-bottom: 0;
    }
  }

  &--horizontal-reverse {
    flex-direction: row-reverse;
    justify-content: flex-end;
  }

  input:focus-visible ~ &__control {
    outline: 2px solid $grey-neu-black;
    outline-offset: 1px;
    transition: none;
  }

  &__label {
    display: inline-block;
    transition: all 0.5s ease;
    cursor: pointer;
    margin-bottom: 8px;
  }

  &__required-asterisk {
    color: $sm-switch--required--asterisk-color;
    display: inline-block;
    margin-left: 0.35em;
    font-weight: 600;
  }

  &__control {
    width: 40px;
    height: 20px;
    background: $sm-switch--control--background-color;
    position: relative;
    border-radius: 16px;
    cursor: pointer;

    span {
      display: inline-block;
      width: 16px;
      height: 16px;
      position: absolute;
      top: 2px;
      left: 2px;
      background: $sm-switch--control--foreground-color;
      border-radius: 50%;
    }

    &, span {
      transition: all 0.3s ease;
    }
  }

  input {
    @include sr-only
  }

  /**
   * Active (on) State
   */
  &--active &__control {
    background: $sm-switch--active--control--background-color;

    span {
      left: calc(100% - 18px);
      background: $sm-switch--active--control--foreground-color;
    }
  }

  /**
   * Hover State
   */
  &__control:hover {
    background: $sm-switch--hover--control--background-color;
  }

  &--active &__control:hover {
    background: $sm-switch--active--hover--control--background-color;
  }

  /**
   * Focus State
   */
  &--focussed &__label {
    color: rgba($sm-switch--text-color, 0.8);
  }

  /**
   * Invalid State
   */
  &.sm-validation--invalid &__label {
    color: $sm-switch--invalid--label-color;
  }

  &.sm-validation--invalid &__control {
    background-color: $sm-switch--invalid--control--background-color;

    span {
      background-color: $sm-switch--invalid--control--foreground-color;
    }
  }

  /**
   * Disabled State
   */
  &--disabled &__label {
    color: $sm-switch--disabled--label-color;
  }

  &--disabled &__control {
    cursor: not-allowed;
    opacity: 1;
    background-color: $sm-switch--disabled--control--background-color;

    span {
      background-color: $sm-switch--disabled--control--foreground-color;
    }
  }

  &--disabled.sm-switch--active &__control {
    background-color: $sm-switch--disabled--active--control--background-color;
  }

}

.sm-switch-group {
  .sm-switch--border-bottom {
    border-bottom: 1px solid $sm-switch--border-color;
  }
}
</style>
