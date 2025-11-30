<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { Ref, computed, inject, nextTick, ref } from 'vue'
import { isNil } from 'lodash-es'

// Keeping this as v-date-picker similar to Vue2 version. This also makes it easier
// to distinguish between sm-date-picker and v-date-picker components
import { DatePicker as VDatePicker } from 'v-calendar'
import 'v-calendar/style.css'

import { useField } from 'vee-validate'
import { useResponsive } from '../../use/responsive'
import { CalendarDay, DateRangeSource, SmDatePickerInputMode, SmDatePickerMode, SmDatePickerModelValue } from './sm-date-picker.types'
import SmDatePickerInput from './sm-date-picker-input.vue'
import SmFieldLabel from '../shared/sm-field-label.vue'
import SmFieldError from '../shared/sm-field-error.vue'
import { useIsFieldRequired } from '../shared/use-is-field-required'
import { FormProviderKey } from '../sm-form/symbols'
import { useUniqueId } from '../../use/unique-id'
import { addTimeSinceMidnight, isValidDatePickerValue, isValidDateRange } from './sm-date-picker.utils'

const props = withDefaults(defineProps<{
  /**
   * Override or provide locale information via the locale props when using the date-picker to generate the Internationalization API.
   * A locale includes multiple settings that are typically assigned on a per region basis.
   */
  locale?: string
  /**
   * The mode the date-picker. Accepts: 'date', 'dateTime', 'time'
   */
  mode?: SmDatePickerMode
  /**
   * The native html placeholder attribute
   */
  placeholder?: string
  /**
   * The native HTML id attribute
   */
  id?: string
  /**
   * The input's label element
   */
  label?: string
  /**
   * A short description describing what the input does
   */
  helpText?: string
  /**
   * Native readonly attribute passed to the built-in input element
   *
   * IMPORTANT: Note that this wasn't properly implemented in Vue2 version before so setting this could change the behaviour from Vue2 version
   */
  readonly?: string
  /**
   * Whether the field is disabled
   */
  disabled?: boolean
  /**
   * An sm-icon name to be displayed to the left of the input
   */
  prefixIcon?: string
  /**
   * An sm-icon name to be displayed to the right of the input
   */
  suffixIcon?: string
  /**
   * The vee-validate rules - see: https://vee-validate.logaretm.com/v4/guide/global-validators/#available-rules
   */
  rules?: string | Record<string, unknown>
  /**
   * Disable the error text
   */
  errorDisabled?: boolean
  /**
   * Hides the label visually but still keeps it accessible to screen readers
   */
  labelHidden?: boolean
  /**
   * The first date that the user is allowed to select. Dates prior to this date will be disabled.
   */
  minDate?: Date
  /**
   * The last date that the user is allowed to select. Dates after this date will be disabled.
   */
  maxDate?: Date
  /**
   * A set of dates which cannot be selected by the user. Any dates included in disabled-dates are disabled.
   *
   * See https://vcalendar.io/datepicker/basics.html#disable-dates for the available configuration options.
   * Please note that if you were using the old v2 version, the configs are different
   */
  // Add typing once DateRangeSource is importable
  // https://vcalendar.io/calendar/api.html#daterangesource
  // See https://github.com/nathanreyes/v-calendar/issues/284
  disabledDates?: DateRangeSource[]
  /**
   * A set of dates which can be selected by the user. Any dates not included in available-dates are disabled.
   *
   * IMPORTANT: Might be deprecated in v-calendar@3
   * Removing it from the props until it's been officially supported or deprecated
   * rather than making it silently change the behaviour
   * See https://github.com/nathanreyes/v-calendar/issues/1286
   */
  // availableDates?: any[] | object
  /**
   * Sets the start of the week, with 1=Sunday and 7=Saturday.
   */
  firstDayOfWeek?: 1 | 2 | 3 | 4 | 5 | 6 | 7
  /**
   * Native name attribute added to the built-in input element
   */
  name: string
  /**
   * The displayed time will reflect the time associated with the date in the specified timezone.
   * Timezone names allowed ('UTC','America/Chicago', etc). Default, local timezone if not supplied.
   * See https://vcalendar.io/i18n/timezones.html#timezones
   */
  timezone?: string
  /**
   * The prop is used to provide information about the date bound to v-date-picker
   * See here: https://v2.vcalendar.io/datepicker.html#model-config
   *
   * IMPORTANT: Deprecated in v-calendar@3
   * We're opting to deprecate this prop here since we don't have a 1-1 mapping to the new API
   * and it's more obvious to break things than silently change the behaviour
   *
   * See the following upgrade guides:
   * https://vcalendar.io/getting-started/upgrade-guide.html#deprecate-modelconfig-prop
   * https://vcalendar.io/datepicker/basics.html#model-modifiers
   *
   * In addition, `timeAdjust` has been moved to `timeRules` prop
   */
  // modelConfig?: Record<string, string>
  /**
   * This prop is used to set range, number or string model modifiers on the date-picker.
   * Use { range: boolean, number: boolean, string: boolean } format
   *
   * This replaces `model-config` from v-calendar@2:
   * - v2: https://v2.vcalendar.io/datepicker.html#model-config
   * - v3: https://vcalendar.io/datepicker/basics.html#model-modifiers
   *
   * NOTE: A string modelModifier will always return in ISO-8601 format.
   * Downstream projects are responsible for formatting the string modelValue to their liking
   * If you are using string modelModifier, do not use timezone (it will be ignored) and UTC will be used instead
   * as all string values will be returned in ISO-8601 format
   */
  modelModifiers?: Record<string, boolean>
  /**
   * Applies time modifications to dates.
   * See https://vcalendar.io/datepicker/time-rules.html
   */
  timeRules?: any
  /**
   * Binding to date ranges is also supported by setting the is-range prop.
   */
  // Soft deprecated in v-calendar@3, and we're keeping it to reduce breaking changes for downstream consumers
  // but can use modelModifiers.range too which is already supported in this version
  isRange?: boolean
  /**
   * Masks are used to properly format and parse different sections date-picker components.
   * For example, consider the input mask which is used the format and parse dates for v-date-picker.
   *
   * See here https://vcalendar.io/i18n/masks.html#masks for the current version
   *
   * For the old v2 version see https://v2.vcalendar.io/format-parse-dates.html#masks
   *
   * NOTE: Setting modelValue will be ignored
   */
  masks?: object
  /**
   * Increment amount for the minute in select options.
   *
   * IMPORTANT: Deprecated in v-calendar@3
   * This has been moved to the rules prop (and timeRules in sm-date-picker).
   * We're deprecating it so we don't have to maintain and merge two variations of the same prop
   */
  /**
   * Attribute to use for the value selection in all modes.
   */
  // Add typing once AttributeConfig is importable
  // https://vcalendar.io/calendar/api.html#attributeconfig
  // See https://github.com/nathanreyes/v-calendar/issues/284
  selectAttribute?: unknown
  /**
   * Use the columns props to create multi-column static layouts for the large screen
   */
  columns?: number
  /**
   * Use the rows props to create multi-row static layouts for the large screen
   */
  rows?: number
  /**
   * The HTML placeholder attribute for start date range picker
   */
  startDatePlaceholder?: string
  /**
   * The HTML placeholder attribute for end date range picker
   */
  endDatePlaceholder?: string
  /**
   * List of attributes for the day involved with the event
   */
  // Add typing once AttributeConfig is importable
  // https://vcalendar.io/calendar/api.html#attributeconfig
  // See https://github.com/nathanreyes/v-calendar/issues/284
  attributes?: unknown[]
  /**
   * Whether to show date in time picker, mode="time"
   */
  hideDateInTimePicker?: boolean
  /**
   * Whether to show current date in time picker
   */
  showCurrentDate?: boolean
}>(), {
  locale: undefined,
  mode: SmDatePickerMode.DATE,
  placeholder: '',
  id: '',
  label: '',
  helpText: '',
  readonly: undefined,
  disabled: false,
  prefixIcon: '',
  suffixIcon: '',
  rules: undefined,
  errorDisabled: false,
  labelHidden: false,
  minDate: undefined,
  maxDate: undefined,
  disabledDates: undefined,
  // availableDates: undefined,
  firstDayOfWeek: 2,
  name: undefined,
  timezone: undefined,
  // modelConfig: undefined,
  modelModifiers: undefined,
  timeRules: undefined,
  isRange: false,
  masks: undefined,
  // minuteIncrement: undefined,
  selectAttribute: undefined,
  columns: 1,
  rows: 1,
  startDatePlaceholder: '',
  endDatePlaceholder: '',
  attributes: undefined,
  hideDateInTimePicker: true,
  showCurrentDate: true,
})

const emit = defineEmits<{
  /** Emitted in date range mode when either the start or end date field is blurred */
  blur: []
  /** Emitted when a single date is selected */
  dayclick: [d: CalendarDay]
  /** Emitted in date range mode when dragged selection is updated */
  drag: []
  /** Emitted when an end date range is selected */
  end: [d: CalendarDay]
  /** Emitted in date range mode when either the start or end date field is focused */
  focus: []
  /** Emitted when a start date range is selected */
  start: [d: CalendarDay]
  /**
   * Emitted when the date-picker's v-model changes
   * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
   */
  'update:modelValue': [value: SmDatePickerModelValue | undefined]
}>()

// Support consumers running in @vue/compat build
// This will be enough for date-only mode, but compatConfig needs to be defined
// by consuming applications with @vue/compat to support dateTime and time modes
// This is because the compat config is not inherited by subcomponents, in this case
// v-calendar's internal BaseSelect component used in the time picker
// Can probably be fixed by https://github.com/nathanreyes/v-calendar/pull/1149
VDatePicker.compatConfig = { MODE: 3 }

// For vue3
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
})

/**
 * v-model for `modelValue` prop
 * Emits 'update:modelValue': [value: SmCalendarDateParts | null] when this ref changes
 * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
 */
const modelValue = defineModel<SmDatePickerModelValue | undefined>({ default: undefined })

// Data provided by sm-form
const formProvider = inject(FormProviderKey, { disabled: ref(false) })
const isFormDisabled = computed(() => formProvider.disabled.value)

const internalTimezone = computed(() => {
  // ignore timezone if we have a string model modifier
  // internally, v-calendar messes up calculation when you both have
  // string model modifier and timezone passed in together
  return props.modelModifiers?.string ? 'UTC' : props.timezone
})

const internalMasks = computed(() => {
  // we strip away modelValue from the masks prop
  const { modelValue: _modelValue, ...otherMaskProps } = { ...(props.masks ?? {}), modelValue: null }
  return otherMaskProps
})

// Renamed in Vue3 to not confuse it with the v-date-picker's slot prop `inputValue`
const internalInputValue = computed({
  get: () => {
    // IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
    // Was previously: props.value
    return modelValue.value
  },
  set: (state) => {
    // see: https://siteminder-jira.atlassian.net/browse/SUI-1767 (fixes issue #2)
    // TODO: remove this when v-calendar fixes these issues:
    // - https://github.com/nathanreyes/v-calendar/issues/1204
    // - https://github.com/nathanreyes/v-calendar/issues/1094
    // only apply the patch if the initial modelValue was empty and the new incoming state is valid
    if (isValidDatePickerValue(state) && !isValidDatePickerValue(modelValue.value)) {
      const updatedState = addTimeSinceMidnight(state, internalTimezone.value)
      // we need nextTick to force v-calendar date-picker to refresh its input fields
      // simulating the user manually setting the time to the current time
      nextTick().then(() => {
        modelValue.value = updatedState
      })
      return
    }
    // see: https://siteminder-jira.atlassian.net/browse/SUI-1767 (fixes issue #3)
    // TODO: remove this when v-calendar fixes the issue:
    // - https://github.com/nathanreyes/v-calendar/issues/1322
    // v-calendar needs to internally handle invalid values without us
    // resorting to nextTick() to force v-calendar to reset its internal state
    // as of 20231212, this is still reproducible on their website:
    // - https://vcalendar.io/datepicker/slot-content.html#range-inputs
    if (isNil(state)) {
      // we need nextTick to force v-calendar date-picker to reset its internal state. Roughly the following happens:
      // 1. First, we reach here and internal state of v-calendar date-picker is updated (but not yet applied to the DOM)
      // and is in an invalid state (e.g. due to invalid input)
      // 2. The updates are committed and applied to the DOM
      // 3. Now we want to emit this update:modelValue notifying upstream to reset both input fields (for date range)
      // 4. This will trigger v-calendar date-picker to update its internal state again to a cleared state
      nextTick().then(() => {
        modelValue.value = state
      })

      return
    }
    modelValue.value = state
  },
})

const isRangeMode = computed(() => props.isRange || props.modelModifiers?.range)

const computedRules = computed(() => props.rules)

const { required } = useIsFieldRequired(computedRules)

/**
 * Set the vee-validate's internal value to null if date range is invalid,
 * so when a required validator is run on `{ start: null, end: null }` it will fail
 * like it used to in Vue2 version
 */
const computedInitialValue = computed(() => {
  if (isRangeMode.value && !isValidDateRange(modelValue.value)) {
    return null
  }

  return modelValue.value
})

const { errors, meta, validate } = useField(
  () => props.name,
  computedRules,
  {
    syncVModel: true,
    initialValue: computedInitialValue,
  },
)

const { id: defaultInputId } = useUniqueId('sm-date-picker_')
const { id: errorMessageId } = useUniqueId('sm-date-picker__error_')
const inputId = computed(() => props.id || defaultInputId.value)
const errorMessageValue = computed(() => (props.errorDisabled ? null : errorMessageId.value))

const smDatePicker = ref<HTMLElement | null>(null)

const startDate = ref<Date | object | number | string | null>(null)

// Adds the focused state on the date range input manually since it's a combination of two sm-inputs
const isFocused = ref<boolean>(false)

const inputEl = ref(null)
const dateRangeEl: Ref<HTMLElement | null> = ref(null)

// Add typing once PopoverOptions is importable
// https://vcalendar.io/datepicker/api.html#popoveroptions
// See https://github.com/nathanreyes/v-calendar/issues/284
const popoverOptions = computed((): Record<string, string | boolean> => {
  return {
    placement: 'bottom-start',
    visibility: 'focus', // We use 'focus' here because 'click' auto-closes it right after displaying the dropdown
    autoHide: true,
  }
})

// Add typing once AttributeConfig is importable
// https://vcalendar.io/calendar/api.html#attributeconfig
// See https://github.com/nathanreyes/v-calendar/issues/284
const computedAttributes = computed(() => {
  let attr: unknown[] = []

  if (props.attributes) {
    attr = [...props.attributes]
  }

  // For Vue3
  // Update the highlighted current date in the calendar with today's date in a given timezone
  // If not provided, it will use the local timezone
  if (props.showCurrentDate) {
    attr.push({
      key: 'today-in-timezone',
      // https://vcalendar.io/calendar/attributes.html#highlights
      highlight: {
        fillMode: 'outline',
        class: 'sm-date-picker--current-date',
        contentClass: 'sm-date-picker--current-date-content',
      },
      dates: new Date(),
      order: -1, // Selected highlight should overwrite current date
    })
  }

  return attr
})

/**
 * Watch for viewport changes to apply the responsive layouts
 * The breakpoint is consistent with the v-calendar $screens implementation
 */
const isSmallDesktopScreen = useMediaQuery(`(min-width: ${useResponsive.tabletBreakpoint}px)`)

/**
 * After moving to `<script setup>`, v-calendar's global $screens mixin became buggy
 * See https://github.com/nathanreyes/v-calendar/issues/372 for similar issue reported upstream
 *
 * This reimplements the responsive layout without dependency on the $screens mixin
 * which is also compatible to the Vue3 migration step because the new version deprecates this
 * See https://vcalendar.io/getting-started/upgrade-guide.html#deprecated-screens-mixin
 *
 * For reference, the old syntax and config added directly in the template was:
 *
 *   <v-date-picker
 *     :columns="$screens({ default: 1, lg: columns })"
 *     :rows="$screens({ default: 1, lg: rows })"
 *   >
 *
 * Where `lg` is lg is mapped to 1024px and up, inclusive.
 */
const screens = computed(() => {
  // Use the props value when viewport is 1024px and up
  const shouldUseProps = isSmallDesktopScreen.value

  return {
    columns: shouldUseProps ? props.columns : 1,
    rows: shouldUseProps ? props.rows : 1,
  }
})

const dragAttribute = {
  highlight: {
    class: 'sm-date-picker--drag',
  },
}

const isFocusedEvent = (): void => {
  isFocused.value = true

  // see: https://siteminder-jira.atlassian.net/browse/SUI-1767 (fixes issue #1)
  // TODO: remove this when v-calendar fixes the issue:
  // - https://github.com/nathanreyes/v-calendar/issues/1316
  // force a non-null value to be set on the input on focus
  // mainly so that the time picker is not disabled for better UX
  if (!internalInputValue.value && props.mode === SmDatePickerMode.TIME) {
    const defaultDate = new Date()
    defaultDate.setHours(0, 0, 0, 0)
    internalInputValue.value = defaultDate
  }

  if (isRangeMode.value) {
    startDate.value = null
    emit('focus')
  }
}

const isBlurEvent = async (): Promise<void> => {
  isFocused.value = false

  if (isRangeMode.value) {
    emit('blur')
  }

  // we handle validation on field blur manually as per vee-validate's docs:
  // https://vee-validate.logaretm.com/v4/api/use-field/
  await validate()
}

// Add typing once CalendarDay is importable
// https://vcalendar.io/calendar/api.html#events
// See https://github.com/nathanreyes/v-calendar/issues/284
const dayclick = (currentDate: CalendarDay): void => {
  if (isRangeMode.value) {
    if (startDate.value && currentDate.date > startDate.value) {
      emit('end', currentDate)
    } else {
      emit('start', currentDate)
    }
    startDate.value = currentDate.date
  } else {
    emit('dayclick', currentDate)
  }
}

defineExpose({
  computedAttributes,
  // cssVars, // removed in Vue3
  dateRangeEl,
  dragAttribute, // exposed for downstream consumers but we are not using it anywhere, Vue2 version isn't actually applying this
  inputEl,
  inputValue: internalInputValue, // keeping old name for downstream consumers
  isfocused: isFocused, // keeping typo for downstream consumers
  smDatePicker,
  // calculateInputDimensions, // removed in Vue3
  dayclick,
  isBlurEvent,
  isfocusedEvent: isFocusedEvent, // keeping typo for downstream consumers
})
</script>

<template>
  <div class="sm-date-picker">
    <div
      v-if="!$slots.target"
      class="sm-date-picker__header"
    >
      <sm-field-label
        v-if="!labelHidden"
        :for="inputId"
        :required="required"
        :focussed="isFocused"
        :state="meta"
      >
        <!-- @slot The form label. Overrides the label prop -->
        <slot name="label">
          {{ label }}
        </slot>
      </sm-field-label>
      <span
        v-if="$slots.action && !labelHidden"
        class="sm-date-picker__action"
      >
        <!-- @slot The field action next to the label. Example usage: adding a helper icon to provide more context on the field. -->
        <slot name="action" />
      </span>
    </div>

    <v-date-picker
      ref="smDatePicker"
      v-model="internalInputValue"
      :columns="screens.columns"
      :rows="screens.rows"
      :locale="locale"
      :mode="mode"
      :hide-time-header="hideDateInTimePicker === true && mode === 'time'"
      :select-attribute="selectAttribute"
      :attributes="computedAttributes"
      :min-date="minDate"
      :timezone="internalTimezone"
      :max-date="maxDate"
      :disabled-dates="disabledDates"
      :first-day-of-week="firstDayOfWeek"
      :rules="timeRules"
      :model-modifiers="{
        ...modelModifiers,
        range: isRangeMode,
      }"
      :masks="internalMasks"
      :popover="popoverOptions"
      @drag="() => $emit('drag')"
      @dayclick="dayclick($event)"
    >
      <template #default="{ inputValue, inputEvents, showPopover, hidePopover, togglePopover }">
        <!-- @slot Overrides the default input element. Use this to provide a custom input element, or button instead of an input. -->
        <slot
          name="target"
          :input-value="inputValue"
          :input-events="inputEvents"
          :show-popover="showPopover"
          :hide-popover="hidePopover"
          :toggle-popover="togglePopover"
        >
          <sm-date-picker-input
            v-if="!isRangeMode"
            :id="inputId || undefined"
            ref="inputEl"
            :model-value="inputValue"
            :state="{
              ...meta,
              focused: isFocused,
            }"
            :disabled="disabled || isFormDisabled"
            :label="label"
            :placeholder="placeholder"
            :prefix-icon="prefixIcon"
            :readonly="readonly"
            :suffix-icon="suffixIcon"
            :name="(name + '-input')"
            :aria-errormessage="errorMessageValue"
            :aria-required="required"
            :value="inputValue"
            v-on="inputEvents"
            @focus="() => {
              showPopover()
              isFocusedEvent()
            }"
            @blur="isBlurEvent()"
          >
            <template
              v-if="$slots.prefix"
              #prefix
            >
              <!-- @slot Appears to the left of the input. Can be used to create a mixed input. -->
              <slot name="prefix" />
            </template>

            <template
              v-if="$slots.suffix"
              #suffix
            >
              <!-- @slot Appears to the right of the input. Can be used to create a mixed input. -->
              <slot name="suffix" />
            </template>
          </sm-date-picker-input>

          <div
            v-if="isRangeMode"
            ref="dateRangeEl"
            :class="{
              'sm-date-picker--date-range': true,
              'sm-date-picker--date-range__show-popover': isFocused
            }"
          >
            <span
              :class="{
                'sm-date-picker--date-range__startInput': true,
                'sm-date-picker--date-range__startInput--prefix-icon': prefixIcon,
                'sm-date-picker--date-range__startInput--suffix-icon': suffixIcon
              }"
            >
              <sm-date-picker-input
                :id="inputId || undefined"
                ref="inputEl"
                :input-mode="SmDatePickerInputMode.START"
                :state="{
                  ...meta,
                  focused: isFocused,
                }"
                :model-value="inputValue.start"
                :disabled="disabled || isFormDisabled"
                :label="label"
                :placeholder="startDatePlaceholder"
                :prefix-icon="prefixIcon"
                :readonly="readonly"
                :name="(name + '-start-input')"
                :aria-errormessage="errorMessageValue"
                :aria-required="required"
                :value="inputValue.start"
                v-on="inputEvents.start"
                @focus="() => {
                  isFocusedEvent()
                  showPopover()
                }"
                @blur="isBlurEvent()"
              >
                <template
                  v-if="$slots.prefix"
                  #prefix
                >
                  <!-- @slot Appears to the left of the input. Can be used to create a mixed input. -->
                  <slot name="prefix" />
                </template>
              </sm-date-picker-input>
            </span>
            <span
              :class="{
                'sm-date-picker--date-range__endInput': true,
                'sm-date-picker--date-range__has-label': label || rules,
                'sm-date-picker--date-range__label-hidden': labelHidden,
              }"
            >
              <sm-date-picker-input
                :input-mode="SmDatePickerInputMode.END"
                :state="{
                  ...meta,
                  focused: isFocused,
                }"
                :model-value="inputValue.end"
                :disabled="disabled || isFormDisabled"
                :suffix-icon="suffixIcon"
                :name="(name + '-end-input')"
                :readonly="readonly"
                :placeholder="endDatePlaceholder"
                :aria-errormessage="errorMessageValue"
                :aria-required="required"
                :value="inputValue.end"
                v-on="inputEvents.end"
                @focus="() => {
                  isFocusedEvent()
                  showPopover()
                }"
                @blur="isBlurEvent()"
              >
                <template
                  v-if="$slots.suffix"
                  #suffix
                >
                  <!-- @slot Appears to the right of the input. Can be used to create a mixed input. -->
                  <slot name="suffix" />
                </template>
              </sm-date-picker-input>
            </span>
          </div>
        </slot>
      </template>
    </v-date-picker>

    <template v-if="!$slots.target">
      <div
        v-if="helpText"
        class="sm-date-picker__help-text sm-text--small"
      >
        {{ helpText }}
      </div>

      <div
        v-if="!errorDisabled"
        class="sm-date-picker__footer"
      >
        <sm-field-error
          v-bind="{
            ariaMsg: {
              'aria-live': errors?.length ? 'assertive' : 'off',
              id: errorMessageId,
            }
          }"
          :errors="meta.validated ? errors : []"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss">
@import "../../../common/variables";
@import "../../../common/mixins";

:root {
  --sm-c-input-help-text-color-text: var(--color-disabled-dark);
}

/**
 * IMPORTANT NOTICE
 *
 * We are using the v-calendar theming variables to override the default styles.
 * Please refrain from overriding CSS (via v-calendar classes) unless
 * it's absolutely needed, discussed and agreed upon.
 *
 * This prevents possible breaking changes when upgrading the v-calendar
 * dependency in the future.
 */

.sm-date-picker {
  display: block;
  position: relative;

  /**
   * ========================================================================
   * For Vue3 and v-calendar@3
   *
   * Replace v-calendar's official theming tokens with SUI tokens
   * See https://github.com/nathanreyes/v-calendar/blob/v3/src/styles/theme.css
   * ========================================================================
   */

  /* Base / shared */
  --vc-font-family: 'Noto Sans', helvetica, sans-serif;
  --vc-font-bold: 600;
  --vc-font-medium: 400;
  --vc-text-sm: 13px; // Month & year nav, grid buttons, weekday labels, etc.
  --vc-rounded: 4px; // Used in buttons
  --vc-rounded-lg: 8px; // Used in popover border-radius

  /* Light mode */
  .vc-light {
    /* Base */
    --vc-color: #{$grey-neu-black};
    --vc-bg: #{$true-white}; // Unfortunately this also colorizes the space behind the popper arrow
    --vc-hover-bg: #{$primary-blue-dark}; // No token to switch to white text along with this
    --vc-focus-ring: 0 0 0 2px #{$grey-neu-black};

    /* Calendar header */
    --vc-header-title-color: #{$primary-blue};
    --vc-header-arrow-color: #{$primary-blue};
    --vc-header-arrow-hover-bg: #{$blue-neu-med};

    /* Calendar weekdays */
    --vc-weekday-color: #{$grey-neu-mid};

    /* Calendar nav */
    --vc-nav-hover-bg: #{$blue-neu-med};
    --vc-nav-title-color: #{$primary-blue};
    --vc-nav-item-hover-box-shadow: none;
    --vc-nav-item-active-color: #{$true-white};
    --vc-nav-item-active-bg: #{$primary-blue};
    --vc-nav-item-active-box-shadow: none;
    --vc-nav-item-current-color: #{$primary-blue}; // No border available

    /* Calendar day popover */
    --vc-day-popover-container-color: var(--vc-white);

    /* Popover content */
    --vc-popover-content-bg: #{$true-white};
    --vc-popover-content-border: #{$blue-neu-mid};

    /* Time select group */
    --vc-time-select-group-bg: #{$blue-neu-light};
    --vc-time-select-group-border: #{$blue-neu-mid};
    --vc-time-select-group-icon-color: #{$primary-blue};
    --vc-time-picker-border: #{$blue-neu-mid};
    --vc-time-weekday-color: #{$grey-neu-black};
    --vc-time-month-color: #{$grey-neu-black};
    --vc-time-day-color: #{$grey-neu-black};
    --vc-time-year-color: #{$grey-neu-black};

    /* Base select */
    --vc-select-color: #{$grey-neu-black};
    --vc-select-bg: #{$true-white};
    --vc-select-hover-bg: #{$blue-neu-mid};

    /* Calendar day */
    --vc-day-content-hover-bg: #{$primary-blue-dark}; // No token to switch to white text along with this
    --vc-day-content-disabled-color: #{$grey-neu-mid};

    /* Calendar attributes - unfortunately this needs the vc-attr selector to work :( */
    &.vc-attr,
    & .vc-attr {
      --vc-content-color: var(--vc-accent-600);
      --vc-highlight-light-bg: #{$app-info-mid}; // Mid-range highlights bg
      --vc-highlight-light-content-color: #{$grey-neu-black}; // Mid-range highlights text
      --vc-highlight-solid-bg: var(--vc-accent-600);
      --vc-highlight-solid-content-color: var(--vc-white);
      --vc-dot-bg: var(--vc-accent-600);
      --vc-bar-bg: var(--vc-accent-600);
    }
  }

  /* Accents */
  .vc-blue {
    --vc-accent-600: #{$primary-blue};
  }

  /**
   * ========================================================================
   * IMPORTANT NOTICE
   *
   * The next section below is for overriding the v-calendar's default styles.
   * Please don't add anymore overrides until it has been discussed and agreed
   * upon.
   * ========================================================================
   */

   /**
    * We are overriding the default hover color here because v-calendar doesn't
    * expose a theming variable to neatly override it, and sticking to the
    * default color black is a big accessibility concern
    * (dark blue background + black text).
    */
  .vc-day-content:hover {
    color: $true-white;
  }

  /**
   * This class is defined inside v-calendar's Popover component and we can't
   * restyle it without overriding via class name. We want to remove the arrow
   * because it adds complexity and UI issue when the popover is automatically
   * repositioned when it can't fit in the viewport, especially for
   * multi-column layouts.
   */
  .vc-popover-caret {
    display: none;
  }

  .vc-popover-content-wrapper {
    /* Space between target and dropdown, default is 10 */
    --popover-vertical-content-offset: 2px;

    /* z-index of the popper, we need to sync with the Vue2 version */
    z-index: $sm-date-picker-z-index;
  }

  /**
   * Remove the browser's default button color (grey)
   * This is okay to override since `button` selector is a native element name
   * and is unlikely to change over time
   */
  button {
    background-color: transparent;
  }

  /**
   * Remove the browser's default border color (black) and apply minor styles
   * This is okay to override since `select` selector is a native element name
   * and is unlikely to change over time
   */
  select {
    border-color: transparent;
    margin: $sm-4 0;
  }

  /**
   * Apply focus ring styles because v-calendar's `--vc-focus-ring` doesn't work
   * This is okay to override since `button` selector is a native element name
   * and is unlikely to change over time
   */
  button:focus {
    box-shadow: 0 0 0 2px $grey-neu-black;
  }

  /**
   * Make side by side inputs look like a single input
   */
  &--date-range {
    display: flex;
    justify-content: center;
    position: relative;

    &__endInput {
      flex: 1;
    }

    &__startInput {
      flex: 1;

      /* Dash between start and end date inputs */
      .sm-date-picker-input__body {
        &::after {
          content: '';
          position: absolute;
          width: 6px;
          height: 1px;
          background-color: $blue-neu-dark;
          right: 0;
          top: calc(50% + 1px);
          transform: translate(50%, -50%);
          z-index: 1;
        }
      }

      &--prefix-icon:not(.sm-date-picker--date-range__startInput--suffix-icon) .sm-date-picker-input__body::after {
        right: -6px;
      }

      &--suffix-icon:not(.sm-date-picker--date-range__startInput--prefix-icon) .sm-date-picker-input__body::after {
        right: 6px;
      }
    }

  }

  /**
   * Added via attributes prop to mark the current date
   */
  &--current-date {
    background-color: $true-white;
    border: 1px solid $blue-neu-mid;

    &-content {
      color: $grey-neu-black;
      font-weight: 400;
    }
  }

  /**
   * Action slot
   */
  &__action {
    padding: $sm-8 0 0 $sm-4;
  }

  /**
   * Sync styles with elements of sm-input
   */
  &__footer {
    min-height: 32px;
  }

  &__help-text {
    padding-top: 3px;
    padding-bottom: 0;
    color: var(--sm-c-input-help-text-color-text, $grey-neu-dark);
  }
}
</style>
