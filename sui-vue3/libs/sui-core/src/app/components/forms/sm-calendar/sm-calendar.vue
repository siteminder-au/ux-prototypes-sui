<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  inject,
  VNode,
} from 'vue'
import { useField } from 'vee-validate'
import { useUniqueId } from '../../use/unique-id'
import { getDateFromParts, isValidRange } from './utils/helpers'
import {
  SmCalendarDateParts,
  SmCalendarMask,
  SmCalendarMode,
  SmCalendarPlacement,
  SmCalendarPosition,
  SmCalendarRangePart,
} from './sm-calendar.types'
import { useIsFieldRequired } from '../shared/use-is-field-required'
import { FormProviderKey } from '../sm-form/symbols'

import SmCalendarInput from './sm-calendar-input.vue'
import SmFieldLabel from '../shared/sm-field-label.vue'
import SmFieldError from '../shared/sm-field-error.vue'

const props = withDefaults(defineProps<{
  /**
   * Whether the input field is disabled
   */
  disabled?: boolean
  /**
   * A set of dates which cannot be selected by the user
   */
  disabledDates?: SmCalendarDateParts[]
  /**
   * The input field's native HTML placeholder attribute
   */
  endDatePlaceholder?: string
  /**
   * Disable the error text for the input field
   */
  errorDisabled?: boolean
  /**
   * Whether the popover has fallback placements on top/bottom
   */
  fallbackPlacements?: boolean
  /**
   * A short description describing what the input does
   */
  helpText?: string
  /**
   * The input field's native HTML id attribute
   */
  id?: string
  /**
   * Whether to allow range selection
   */
  isRange?: boolean
  /**
   * The input field's label element
   */
  label?: string
  /**
   * Hides the input field's label visually but still keeps it accessible to screen readers
   */
  labelHidden?: boolean
  /**
   * Optional locale string used to format the month names, e.g., 'en-US', 'fr-FR'.
   * If not provided, defaults user's environment or browser locale
   */
  locale?: string
  /**
   * Formats the displayed labels
   */
  masks?: SmCalendarMask
  /**
   * The last date that the user is allowed to select.
   * Values after this will be disabled.
   */
  maxDate?: SmCalendarDateParts
  /**
   * The first date that the user is allowed to select.
   * Values prior to this will be disabled.
   */
  minDate?: SmCalendarDateParts
  /**
   * The mode of the picker which determines what date part(s) can be chosen
   */
  mode: SmCalendarMode
  /**
   * The input field's native name attribute
   */
  name: string
  /**
   * The built-in input field's native HTML placeholder attribute
   */
  placeholder?: string
  /**
   * Whether to use `fixed` or `absolute` positioning for the popover.
   * Absolute is more performant if you have a lot of popovers;
   * fixed is more robust
   */
  position?: SmCalendarPosition
  /**
   * An sm-icon name to be displayed to the left of the input
   */
  prefixIcon?: string
  /**
   * The input field's native readonly attribute
   */
  readonly?: string
  /**
   * The vee-validate rules - see: https://vee-validate.logaretm.com/v4/guide/global-validators/#available-rules
   */
  rules?: string | Record<string, unknown>
  /**
   * The input field's native HTML placeholder attribute
   */
  startDatePlaceholder?: string
  /**
   * An sm-icon name to be displayed to the right of the input
   */
  suffixIcon?: string
}>(), {
  disabled: false,
  disabledDates: () => [],
  endDatePlaceholder: undefined,
  errorDisabled: false,
  fallbackPlacements: true,
  helpText: undefined,
  id: undefined,
  isRange: false,
  label: undefined,
  labelHidden: false,
  locale: undefined,
  masks: undefined,
  maxDate: undefined,
  minDate: undefined,
  placeholder: undefined,
  position: SmCalendarPosition.ABSOLUTE,
  prefixIcon: undefined,
  readonly: undefined,
  rules: undefined,
  startDatePlaceholder: undefined,
  suffixIcon: undefined,
})

const emit = defineEmits<{
  /**
   * Emits when the v-model is updated
   */
  change: [value: SmCalendarDateParts | null]
  /**
   * Emitted when the user selects an end month in range mode
   */
  endMonthSelected: [value: SmCalendarDateParts]
  /**
   * Emits when a month is selected from the picker in non-range mode
   */
  monthSelected: [value: SmCalendarDateParts & { displayValue: string }]
  /**
   * Emitted when the user selects a start month in range mode
   */
  startMonthSelected: [value: SmCalendarDateParts]
  /**
   * Emits when the v-model is updated
   * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
   */
  'update:modelValue': [value: SmCalendarDateParts | null]
}>()

/**
 * v-model for `modelValue` prop
 * Emits 'update:modelValue': [value: SmCalendarDateParts | null] when this ref changes
 * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
 */
const modelValue = defineModel<SmCalendarDateParts | null>({ default: null })

/**
 * defineSlots macro used to declare expected slots and their respective expected slot
 */
defineSlots<{
  action?: () => VNode[]
  label?: () => VNode[]
  prefix?: () => VNode[]
  suffix?: () => VNode[]
}>()

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
  },
})

// Data provided by sm-form
const formProvider = inject(FormProviderKey, { disabled: ref(false) })
const isFormDisabled = computed(() => formProvider.disabled.value)

const { id: defaultInputId } = useUniqueId('sm-calendar__input__')

const inputId = computed(() => props.id ?? defaultInputId.value)

const computedRules = computed(() => props.rules)

const { required } = useIsFieldRequired(computedRules)

/**
 * Internal value for the standard/single input
 */
const inputValue = computed({
  get: () => modelValue.value,
  set: (state) => { modelValue.value = state },
})

// #region business logic for range mode
const isStartRangeVisible = ref<boolean>(false)
const isEndRangeVisible = ref<boolean>(false)
const isFocused = computed(() => isStartRangeVisible.value || isEndRangeVisible.value)
const startRangeRef = ref()
const endRangeRef = ref()

/**
 * Internal value for the range input
 */
const inputRangeValue = computed(() => modelValue.value ?? { start: null, end: null })

/**
 * Set the vee-validate's internal value to null if range is invalid,
 * so when a required validator is run on `{ start: null, end: null }` it will fail
 * like it used to in Vue2 version
 */
const computedInitialValue = computed(() => {
  if (props.isRange && !isValidRange(modelValue.value)) {
    return null
  }

  return modelValue.value
})

/**
 * we manually keep track of the valid state of sm-calendar ourselves in this file
 * when we are in range mode as we are dealing with 2 separate input fields
 * NOTE: using syncVModel doesn't work as expected and we manually use `value` from useField
 * to manually set the internal value of the 'sm-calendar' field inside vee-validate.
 * This is possibly because useField checks if the value emitted by `update:modelValue` in this file
 * is nullish, but it will never be in range mode because it's always an object { start: ..., end: ... }
 */
const { value: calendarValue, errors: calendarErrors, meta: calendarMeta, validate } = useField(
  () => props.name,
  computedRules,
  {
    initialValue: computedInitialValue,
  },
)

/**
 * Emit specific range events
 */
const handleMonthSelectedRange = (range: SmCalendarRangePart, value: SmCalendarDateParts): void => {
  if (range === SmCalendarRangePart.START) {
    emit('startMonthSelected', value)
  }

  if (range === SmCalendarRangePart.END) {
    emit('endMonthSelected', value)
  }
}

/**
 * Emit the updated range
 */
const handleInputRange = (range: SmCalendarRangePart, value: SmCalendarDateParts | null): void => {
  const startValue = range === SmCalendarRangePart.START ? value : inputRangeValue.value.start
  const endValue = range === SmCalendarRangePart.END ? value : inputRangeValue.value.end

  // we intentionally set the value to `null` when the range is incomplete
  // this is to prevent the user from selecting a range that is not valid
  // and we also want to have a consistent error validation style applied on both input fields.
  calendarValue.value = startValue && endValue ? { start: startValue, end: endValue } : null

  modelValue.value = {
    start: startValue,
    end: endValue,
  }
  emit('change', {
    start: startValue,
    end: endValue,
  })
}

/**
 * Normalize the range by swapping start and end values if needed
 */
const reorderRange = (): void => {
  if (props.isRange && !isFocused.value) {
    const { start, end } = inputRangeValue.value

    if (start && end) {
      const startDate = getDateFromParts(start)
      const endDate = getDateFromParts(end)

      if (startDate > endDate) {
        modelValue.value = {
          start: inputRangeValue.value.end,
          end: inputRangeValue.value.start,
        }
        emit('change', {
          start: inputRangeValue.value.end,
          end: inputRangeValue.value.start,
        })
      }
    }
  }
}

/**
 * After the picker has closed, check if range need to be reordered
 */
watch(isFocused, reorderRange)
// #endregion

defineExpose({
  inputId,
  inputRangeValue,
  inputValue,
  isEndRangeVisible,
  isStartRangeVisible,
  isFocused,
  endRangeRef,
  startRangeRef,
  handleInputRange,
  handleMonthSelectedRange,
  reorderRange,
})
</script>

<template>
  <div
    class="sm-calendar"
    :class="{
      'sm-calendar--range': isRange,
      'sm-calendar--disabled': disabled
    }"
  >
    <sm-calendar-input
      v-if="!isRange"
      :id="id"
      ref="startRangeRef"
      v-model="inputValue"
      :placeholder="placeholder"
      :mode="mode"
      :disabled="disabled || isFormDisabled"
      :error-disabled="errorDisabled"
      :help-text="helpText"
      :label="label"
      :label-hidden="labelHidden"
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      :name="name"
      :readonly="readonly"
      :rules="rules"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled-dates="disabledDates"
      :masks="masks"
      :fallback-placements="fallbackPlacements"
      :position="position"
      :locale="locale"
      @change="($event) => $emit('change', $event)"
      @month-selected="($event) => $emit('monthSelected', $event)"
      @visible="($event) => isStartRangeVisible = $event"
    >
      <!-- @slot The field action next to the label. Example usage: adding a helper icon to provide more context on the field. -->
      <slot name="action" />

      <!-- @slot The field label. Overrides the label prop -->
      <slot name="label" />
      <!-- @slot Appears to the left of the input. Can be used to create a mixed input. -->
      <slot name="prefix" />

      <!-- @slot Appears to the right of the input. Can be used to create a mixed input. -->
      <slot name="suffix" />
    </sm-calendar-input>

    <template v-else>
      <div
        class="sm-calendar--range__header"
      >
        <sm-field-label
          v-if="!labelHidden"
          :for="inputId"
          :required="required"
          :focussed="isFocused"
          :state="calendarMeta"
        >
          <!-- @slot The field label. Overrides the label prop -->
          <slot name="label">
            {{ label }}
          </slot>
        </sm-field-label>

        <span
          v-if="$slots.action"
          class="sm-calendar--range__action"
        >
          <!-- @slot The field action next to the label. Example usage: adding a helper icon to provide more context on the field. -->
          <slot name="action" />
        </span>
      </div>

      <div
        class="sm-calendar--range__fields"
        :class="{ 'sm-calendar--range__fields--active': isStartRangeVisible || isEndRangeVisible }"
      >
        <sm-calendar-input
          :id="inputId || undefined"
          ref="startRangeRef"
          :model-value="inputRangeValue.start || undefined"
          class="sm-calendar--range__start"
          :class="{ 'sm-calendar--range__start--active': isStartRangeVisible }"
          :placeholder="startDatePlaceholder"
          :mode="mode"
          :disabled="disabled || isFormDisabled"
          :label="label"
          :error-disabled="true"
          :label-hidden="true"
          :prefix-icon="prefixIcon"
          :name="(name + '-start-input')"
          :readonly="readonly"
          :rules="rules"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled-dates="disabledDates"
          :masks="masks"
          :fallback-placements="fallbackPlacements"
          :position="position"
          :input-class="{
            'sm-input--focussed': isFocused,
            'sm-field--invalid': !calendarMeta.valid && calendarMeta.validated
          }"
          @blur="validate"
          @update:model-value="($event) => handleInputRange(SmCalendarRangePart.START, $event)"
          @month-selected="($event) => handleMonthSelectedRange(SmCalendarRangePart.START, $event)"
          @visible="($event) => isStartRangeVisible = $event"
        >
          <!-- @slot Appears to the left of the input. Can be used to create a mixed input. -->
          <slot name="prefix" />
        </sm-calendar-input>

        <sm-calendar-input
          ref="endRangeRef"
          :model-value="inputRangeValue.end || undefined"
          class="sm-calendar--range__end"
          :class="{ 'sm-calendar--range__end--active': isEndRangeVisible }"
          :placeholder="endDatePlaceholder"
          :mode="mode"
          :disabled="disabled || isFormDisabled"
          :label="label"
          :error-disabled="true"
          :label-hidden="true"
          :suffix-icon="suffixIcon"
          :name="(name + '-end-input')"
          :readonly="readonly"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled-dates="disabledDates"
          :rules="rules"
          :masks="masks"
          :fallback-placements="fallbackPlacements"
          :position="position"
          :input-class="{
            'sm-input--focussed': isFocused,
            'sm-field--invalid': !calendarMeta.valid && calendarMeta.validated
          }"
          :popover-placement="SmCalendarPlacement.BOTTOM_END"
          @blur="validate"
          @update:model-value="($event) => handleInputRange(SmCalendarRangePart.END, $event)"
          @month-selected="($event) => handleMonthSelectedRange(SmCalendarRangePart.END, $event)"
          @visible="($event) => isEndRangeVisible = $event"
        >
          <!-- @slot Appears to the right of the input. Can be used to create a mixed input. -->
          <slot name="suffix" />
        </sm-calendar-input>
      </div>

      <span
        v-if="helpText"
        class="sm-calendar--range__help-text sm-text--small"
      >
        {{ helpText }}
      </span>

      <div
        v-if="!errorDisabled"
        class="sm-calendar--range__footer"
      >
        <sm-field-error
          :errors="calendarErrors"
          :aria-msg="{ 'aria-live': 'assertive' }"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import "../../../common/variables";
@import "../../../common/mixins";

$sm-calendar--range--text--hover: $primary-blue;
$sm-calendar--range--help-text--color: $grey-neu-dark;
$sm-calendar--range--divider--color: $grey-neu-dark;
$sm-calendar--range--divider--color--disabled: $grey-neu-mid;

.sm-calendar {
  display: block;

  &--range {
    &__header {
      display: flex;
      position: relative;
    }

    &__action {
      @include padding($left: rem($sm-xxsm), $top: rem($sm-xxsm));
    }

    &__fields {
      display: flex;
      position: relative;
    }

    &__start :deep(.sm-input__field) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
      text-align: center;
    }

    &__end :deep(.sm-input__field) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: 0;
      text-align: center;
    }

    /**
     * Divider
     */
    &__start::after {
      background-color: $sm-calendar--range--divider--color;
      content: '';
      position: absolute;
      width: 6px;
      height: 1px;
      right: -3px;
      top: calc(50%);
      z-index: 1;
    }

    /**
     * Opened / active state
     */
    &__start--active :deep(.sm-input__field),
    &__end--active :deep(.sm-input__field) {
      color: $sm-calendar--range--text--hover;
      caret-color: $grey-neu-black;

      // Don't change placeholder the color in Firefox
      @supports (-moz-appearance: none) {
        &::placeholder {
          color: $grey-neu-black;
        }
      }
    }

    &__help-text {
      padding-top: 3px;
      padding-bottom: 0;
      color: $sm-calendar--range--help-text--color;
    }

    &__footer {
      min-height: 32px;
    }
  }

  /**
   * Hover state
   */
  &:not(&--disabled) :not(&--range__fields--active) {
    .sm-calendar--range__start :deep(.sm-input__field),
    .sm-calendar--range__end :deep(.sm-input__field) {
      &:hover {
        color: $sm-calendar--range--text--hover;
        caret-color: $grey-neu-black;
      }

      // Don't change placeholder the color in Firefox
      @supports (-moz-appearance: none) {
        &::placeholder {
          color: $grey-neu-black;
        }
      }
    }
  }

  /**
   * Disabled state
   */
  &--disabled {
    .sm-calendar--range__start::after {
      background-color: $sm-calendar--range--divider--color--disabled;
    }
  }
}
</style>
