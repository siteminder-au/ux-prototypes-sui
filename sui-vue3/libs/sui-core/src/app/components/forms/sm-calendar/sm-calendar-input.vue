<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  Ref,
  ref,
  VNode,
  watch,
} from 'vue'
import { useUniqueId } from '../../use/unique-id'
import {
  addMonths,
  dateTimeRegex,
  formatFlags,
  getDateFromParts,
  getDateParts,
  getMonthNames,
  isValidDate,
  MonthLabelFormatType,
  normalizeMonthYearString,
  pad,
  setupPopper,
} from './utils/helpers'
import {
  SmCalendarDateParts,
  SmCalendarMask,
  SmCalendarMode,
  SmCalendarPlacement,
  SmCalendarPosition,
  SmCalendarView,
} from './sm-calendar.types'
import { SmInputType } from '../sm-input/sm-input.types'
import { FormProviderKey } from '../sm-form/symbols'

import SmCalendarHeader from './sm-calendar-header.vue'
import SmCalendarOption from './sm-calendar-option.vue'
import SmInput from '../sm-input/sm-input.vue'

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
   * Classes to be added in the input component
   */
  inputClass?: Record<string, boolean>
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
   * The input field's native html placeholder attribute
   */
  placeholder?: string
  /**
   * The side of the target element the popover should be placed against
   */
  popoverPlacement?: SmCalendarPlacement
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
   * An sm-icon name to be displayed to the right of the input
   */
  suffixIcon?: string
}>(), {
  disabled: false,
  disabledDates: () => [],
  errorDisabled: false,
  fallbackPlacements: true,
  helpText: undefined,
  id: undefined,
  inputClass: undefined,
  label: undefined,
  labelHidden: false,
  locale: undefined,
  masks: undefined,
  maxDate: undefined,
  minDate: undefined,
  placeholder: undefined,
  popoverPlacement: SmCalendarPlacement.BOTTOM_START,
  position: SmCalendarPosition.ABSOLUTE,
  prefixIcon: undefined,
  readonly: undefined,
  rules: undefined,
  suffixIcon: undefined,
})

const emit = defineEmits<{
  /**
   * Emits when the input is blurred out
   */
  blur: []
  /**
   * Emits when the input value changes
   */
  change: [value: SmCalendarDateParts | null]
  /**
   * Emits when the input value changes
   */
  monthSelected: [value: SmCalendarDateParts & { displayValue: string }]
  /**
   * Emits when the input value changes
   * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
   */
  'update:modelValue': [value: SmCalendarDateParts | null]
  /**
   * Emits when the popover visibility changes
   */
  visible: [value: boolean]
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

const inputEl = ref()

const popoverBodyEl: Ref<HTMLElement | null> = ref(null)

const popoverContentEl: Ref<HTMLElement | null> = ref(null)

const currentView = ref<SmCalendarView>()

const currentMonth = ref<number>(new Date().getMonth() + 1)

const currentYear = ref<number>(new Date().getFullYear())

const visibleYear = ref<number>(currentYear.value)

const activeYear = ref<number | null>()

const activeMonth = ref<number | null>()

const isVisible = ref<boolean>(false)

const isInputFocused = ref<boolean>(false)

const isPopoverFocused = ref<boolean>(false)

const isPopoverHovered = ref<boolean>(false)

const onInputValueTimer = ref()

const onBlurValueTimer = ref()

const displayValue = ref()

const { id: defaultId } = useUniqueId('sm-calendar_')

const { id: popoverId } = useUniqueId('sm-calendar__popover_')

// Constants
const MONTH_LABEL_FORMAT = MonthLabelFormatType.SHORT // To align nicely with the year labels
const POPOVER_OFFSET = 2 // In px
const YEAR_RANGE_LENGTH = 10
const BLUR_DEBOUNCE = 100 // In ms
const INPUT_DEBOUNCE = 250 // In ms

// Short month names as seen on the picker
const monthNames = computed(() => {
  return getMonthNames(MONTH_LABEL_FORMAT, props.locale)
})

// Full month names that will be used as accessible labels in the picker
const monthNamesLong = computed(() => {
  return getMonthNames(MonthLabelFormatType.LONG, props.locale)
})

// Popper.js instance created on mount
let popper: any

// data provided by sm-form
const formProvider = inject(FormProviderKey, { disabled: ref(false) })
const isFormDisabled = computed(() => formProvider.disabled.value)

/**
 * Max year that can be navigated in the UI
 */
const maxYear = computed(() => {
  return props.maxDate?.year
    ? props.maxDate.year
    : 99999
})

/**
 * Min year that can be navigated in the UI
 */
const minYear = computed(() => {
  return props.minDate?.year
    ? props.minDate.year
    : 1
})

/**
 * Use the sm-input's body element to position the popover properly
 * to avoid extra spaces when there is a helper text or validation message
 */
const inputBody = computed(() => inputEl.value?.$refs?.inputBody)

const inputNative = computed(() => inputEl.value?.$refs?.input)

/**
 * Object containing start and end of the year selection
 * Start will always be the first year of decade, e.g if current year is
 * 2018, range will start from 2010 and so on.
 */
const yearRange: Ref<{ start: number, end: number }> = computed(() => {
  const start = Math.floor(visibleYear.value / 10) * 10
  const end = (start + YEAR_RANGE_LENGTH) - 1

  return reactive({ start, end })
})

const isActiveMonth = ({ year, month }: { year: number, month: number }): boolean => {
  return year === activeYear.value && month === activeMonth.value
}

const isCurrentMonth = ({ year, month }: { year: number, month: number }): boolean => {
  return year === currentYear.value && month === currentMonth.value
}

/**
 * Generates an array of year and month pairing with accompanying states
 */
const monthOptions = computed(() => {
  const year = visibleYear.value

  return monthNames.value.map((label, index) => {
    const month = index + 1

    return {
      label, // Visible label in the picker, e.g 'Jan', 'Feb', etc.
      month,
      year,
      isActive: isActiveMonth({ year, month }),
      ariaLabel: `${monthNamesLong.value[index]} ${year}`,
      isCurrent: isCurrentMonth({ year, month }),
      isDisabled: !isValidMinMaxRange({ year, month }) || isDisabledValue({ year, month }),
    }
  })
})

/**
 * Generates an array of years from the specified year range
 * until the specified length with accompanying states
 */
const yearOptions = computed(() => {
  return Array
    .from(
      { length: YEAR_RANGE_LENGTH },
      (_, i) => i + yearRange.value.start,
    )
    .map((year, index) => ({
      year,
      isDisabled: !isValidMinMaxYear(year),
      isFocusable: isFocusableYear(year, index),
    }))
})

/**
 * Next and previous navigator value
 */
const step = computed(() => {
  switch (currentView.value) {
    // Navigate by year
    case SmCalendarView.MONTH:
      return 1

    // Navigate by range
    case SmCalendarView.YEAR:
      return YEAR_RANGE_LENGTH

    default:
      return 0
  }
})

/**
 * Determines if next year or year range can be enabled in the UI
 */
const hasNext = computed(() => {
  if (currentView.value === SmCalendarView.MONTH) {
    return (visibleYear.value + step.value) <= maxYear.value
  }

  if (currentView.value === SmCalendarView.YEAR) {
    const nextStart = Math.floor((visibleYear.value + 10) / 10) * 10

    return nextStart <= maxYear.value
  }

  return true
})

/**
 * Determines if previous year or year range can be enabled in the UI
 */
const hasPrevious = computed(() => {
  if (currentView.value === SmCalendarView.MONTH) {
    return (visibleYear.value - step.value) >= minYear.value
  }

  if (currentView.value === SmCalendarView.YEAR) {
    const nextStart = Math.floor((visibleYear.value - 10) / 10) * 10
    const nextEnd = (nextStart + YEAR_RANGE_LENGTH) - 1

    return nextEnd >= minYear.value
  }

  return true
})

/**
 * Formats month and year to the provided mask
 */
const formatMonthYearString = (
  { month, year, format }:
    { month: number, year: number, format?: string },
): string => {
  if (!month || !year) {
    return ''
  }

  const _format = format ?? 'YYYY-MM'

  const formattedValue = _format
    .replace(dateTimeRegex, (part: string) => {
      if (part in formatFlags) {
        return formatFlags[part](
          { month, year },
          { monthNames: monthNames.value, monthNamesLong: monthNamesLong.value },
        )
      }

      return part.slice(1, part.length - 1)
    })

  return formattedValue
}

/**
 * Determines the focusable year based on availability of active
 * and current dates in view
 */
const isFocusableYear = (
  year: number,
  index: number,
): boolean => {
  if (
    activeYear.value
    && activeYear.value >= yearRange.value.start
    && activeYear.value <= yearRange.value.end
  ) {
    return activeYear.value === year
  }

  if (
    currentYear.value
    && currentYear.value >= yearRange.value.start
    && currentYear.value <= yearRange.value.end
  ) {
    return currentYear.value === year
  }

  // Default to first item on the range
  return index === 0
}

/**
 * Checks if year and month pairing is included in the disabled dates prop.
 */
const isDisabledValue = (value: SmCalendarDateParts): boolean => {
  if (props.disabledDates.length === 0) {
    return false
  }

  return props.disabledDates.some(disabledDate => (
    disabledDate.year === value.year
    && disabledDate.month === value.month
  ))
}

/**
 * Checks if year and month pairing falls within min or max
 */
const isValidMinMaxRange = (value: SmCalendarDateParts | null): boolean => {
  if (!value?.month || !value.year) {
    return false
  }

  if (!props.minDate && !props.maxDate) {
    return true
  }

  const date = getDateFromParts(value)
  let isAfterMin = true
  let isBeforeMax = true

  if (props.minDate) {
    const minDate = getDateFromParts(props.minDate)

    isAfterMin = date >= minDate
  }

  if (props.maxDate) {
    const maxDate = getDateFromParts(props.maxDate)

    isBeforeMax = date <= maxDate
  }

  return isAfterMin && isBeforeMax
}

/**
 * Checks if the year within min or max
 */
const isValidMinMaxYear = (year: number): boolean => {
  let isAfterMin = true
  let isBeforeMax = true

  if (props.minDate) {
    isAfterMin = year >= (props.minDate.year ?? 0)
  }

  if (props.maxDate) {
    isBeforeMax = year <= (props.maxDate.year ?? 0)
  }

  return isAfterMin && isBeforeMax
}

/**
 * Updates input value after selecting a month and closes the popover
 */
const selectMonthYear = (option: any): void => {
  let formattedValue = `${pad(option.year, 4)}-${pad(option.month, 2)}`

  if (props.masks?.input) {
    formattedValue = formatMonthYearString({
      month: option.month,
      year: option.year,
      format: props.masks.input,
    })
  }

  displayValue.value = formattedValue
  isVisible.value = false

  modelValue.value = { year: option.year, month: option.month }
  emit('change', { year: option.year, month: option.month })

  emit('monthSelected', {
    year: option.year,
    month: option.month,
    displayValue: displayValue.value,
  })
}

/**
 * Updates picker view but won't update input value just yet
 */
const selectYear = (option: number): void => {
  visibleYear.value = option
  switchPicker(SmCalendarView.MONTH)
}

/**
 * Navigate to next year or year range depending on the current view
 */
const next = (): void => {
  if (hasNext.value) {
    visibleYear.value += step.value
  }
}

/**
 * Navigate to previous year or year range depending on the current view
 */
const previous = (): void => {
  if (hasPrevious.value) {
    visibleYear.value -= step.value
  }
}

/**
 * Programmatically focus an element when navigated via keyboard
 */
const focusOption = async (id: string): Promise<void> => {
  // Wait for updated options to be rendered in case the page moves
  await nextTick()

  const element = popoverBodyEl.value?.querySelector(`#${id}`) as HTMLElement | null

  if (element && typeof element.focus === 'function') {
    element.focus()
  }
}

/**
 * Programmatically focus an the options container
 */
const focusOptionContainer = (): void => {
  if (
    popoverContentEl.value
    && typeof popoverContentEl.value.focus === 'function'
  ) {
    popoverContentEl.value.focus()
  }
}

/**
 * Switch between month and year views
 */
const switchPicker = (view: SmCalendarView, options?: any): void => {
  // Focus on the option container when switching views
  // so popover won't auto-close if it loses focus on previous view
  focusOptionContainer()

  currentView.value = view

  if (options?.reset) {
    visibleYear.value = activeYear.value || currentYear.value
  }
}

/**
 * Handle keyboard navigation within the month view
 */
const navigateMonth = async (event: KeyboardEvent, option: any): Promise<void> => {
  const fromDate = getDateFromParts({ month: option.month, year: option.year })
  let newDate = null

  switch (event.key) {
    case 'Down':
    case 'ArrowDown': {
      // Move to month below
      newDate = addMonths(fromDate, 4)

      break
    }

    case 'Up':
    case 'ArrowUp': {
      // Move to month above
      newDate = addMonths(fromDate, -4)

      break
    }

    case 'Left':
    case 'ArrowLeft': {
      // Move previous month
      newDate = addMonths(fromDate, -1)

      break
    }

    case 'Right':
    case 'ArrowRight': {
      // Move next month
      newDate = addMonths(fromDate, 1)

      break
    }

    case 'Home': {
      // Move to first month of the year, if it's already the first month
      // move to first month of previous year
      const moveMonths = option.month === 1 ? 12 : (option.month - 1)
      newDate = addMonths(fromDate, -moveMonths)

      break
    }

    case 'End': {
      // Move to last month of the year, if it's already the last month
      // move to last month of next year
      const moveMonths = option.month === 12 ? 12 : (12 - (option.month))
      newDate = addMonths(fromDate, moveMonths)

      break
    }

    case 'PageUp': {
      // Move to previous year
      newDate = addMonths(fromDate, -12)

      break
    }

    case 'PageDown': {
      // Move to next year
      newDate = addMonths(fromDate, 12)

      break
    }

    default:
      break
  }

  if (newDate) {
    // Prevent page from scrolling
    event.preventDefault()
    event.stopPropagation()

    const month = newDate.getMonth() + 1
    const year = newDate.getFullYear()

    // Focus on container first to prevent from auto-closing the popover
    // when repainting the options
    if (visibleYear.value !== year) {
      focusOptionContainer()
      visibleYear.value = year
    }

    await focusOption(`${defaultId.value}-${year}-${month}`)
  }
}

/**
 * Handle keyboard navigation within the year range view
 */
const navigateYear = async (event: KeyboardEvent, option: any): Promise<void> => {
  const fromYear = option.year
  let newYear: number | null = null

  switch (event.key) {
    case 'Down':
    case 'ArrowDown': {
      // Move to year below
      newYear = fromYear + 4

      break
    }

    case 'Up':
    case 'ArrowUp': {
      // Move to year above
      newYear = fromYear - 4

      break
    }

    case 'Left':
    case 'ArrowLeft': {
      // Move previous year
      newYear = fromYear - 1

      break
    }

    case 'Right':
    case 'ArrowRight': {
      // Move next year
      newYear = fromYear + 1

      break
    }

    case 'Home': {
      // Move to first year of the range, if it's already the first year
      // move to first year of previous range
      const moveYears = option.year === yearRange.value.start
        ? YEAR_RANGE_LENGTH
        : (option.year - yearRange.value.start)
      newYear = fromYear - moveYears

      break
    }

    case 'End': {
      // Move to last year of the range, if it's already the last year
      // move to last year of previous range
      const moveYears = option.year === yearRange.value.end
        ? YEAR_RANGE_LENGTH
        : (yearRange.value.end - option.year)
      newYear = fromYear + moveYears

      break
    }

    case 'PageUp': {
      // Move to previous year range
      newYear = fromYear - YEAR_RANGE_LENGTH

      break
    }

    case 'PageDown': {
      // Move to next year range
      newYear = fromYear + YEAR_RANGE_LENGTH

      break
    }

    default:
      break
  }

  if (newYear) {
    // Prevent page from scrolling
    event.preventDefault()
    event.stopPropagation()

    visibleYear.value = newYear

    await focusOption(`${defaultId.value}-${newYear}`)
  }
}

/**
 * Return to initial view after the close animation ends
 */
const resetView = (): void => {
  if (props.mode === SmCalendarMode.MONTH_YEAR) {
    switchPicker(SmCalendarView.MONTH)
  }

  visibleYear.value = activeYear.value || currentYear.value
}

const hidePopover = (): void => {
  if (
    !isInputFocused.value
    && !isPopoverFocused.value
    && !isPopoverHovered.value
  ) {
    isVisible.value = false
  }
}

const showPopover = (): void => {
  isVisible.value = true
}

/**
 * Determine what action to take depending on the picker mode
 */
const handleSelectMonth = (option: any): void => {
  if (option.isDisabled) {
    return
  }

  if (props.mode === SmCalendarMode.MONTH_YEAR) {
    selectMonthYear(option)
  }

  // Map more actions here once we expand support
}

/**
 * Determine what action to take depending on the picker mode
 */
const handleSelectYear = (option: any): void => {
  if (option.isDisabled) {
    return
  }

  if (props.mode === SmCalendarMode.MONTH_YEAR) {
    selectYear(option.year)
  }

  // Map more actions here once we expand support
}

/**
 * Determine which view to go next depending on the picker mode
 */
const handleSwitch = (fromView: SmCalendarView | undefined): void => {
  if (props.mode === SmCalendarMode.MONTH_YEAR) {
    switch (fromView) {
      case SmCalendarView.MONTH:
        switchPicker(SmCalendarView.YEAR)
        break

      case SmCalendarView.YEAR:
      default:
        switchPicker(SmCalendarView.MONTH, { reset: true })
        break
    }
  }

  // Map more actions here once we expand support
}

/**
 * Hide popover when keyboard escape is pressed regardless if
 * popover is focused or hovered, or the input is focused
 */
const handleDocumentKeyup = (e: KeyboardEvent): void => {
  if (e.key === 'Esc' || e.key === 'Escape') {
    isVisible.value = false
  }
}

/**
 * Updates view when enter key is pressed while focused on the component
 */
const handlePickerEnter = (): void => {
  formatDisplayValue(modelValue.value)
}

/**
 * Auto-show popover when input field receives focus
 */
const handleInputFocus = (): void => {
  if (!props.disabled && !isFormDisabled.value) {
    isInputFocused.value = true
    showPopover()
  }
}

/**
 * Hide popover is next target is not inside the popover
 */
const handleInputBlur = (e: FocusEvent): void => {
  isInputFocused.value = false

  if (
    (!e.relatedTarget || !popoverBodyEl.value?.contains(e.relatedTarget as Node))
  ) {
    hidePopover()
  }

  clearTimeout(onBlurValueTimer.value)

  onBlurValueTimer.value = setTimeout(() => {
    formatDisplayValue(modelValue.value)
  }, BLUR_DEBOUNCE)

  // to handle scenario when the user clicks, then blurs the input
  // without typing anything or when an invalid value is entered
  emit('blur')
}

/**
 * When date is typed in the input field, navigate to the matching or
 * inferred date from the input. The parsing is handled by the Date API
 * which is implemented differently in browsers.
 */
const handleInputInput = (): void => {
  clearTimeout(onInputValueTimer.value)

  // NOTE: This setTimeout usage is causing the validation errors to trigger on form reset
  // TODO: figure out a way to refactor this and avoid the validation error appearing on form reset
  // this is likely because setTimeout executes in the next tick which triggers vee-validate to validate the field
  // immediately after a reset.
  // Workaround is to set the form's initialValue for each *-input field. See changelog
  // entry in sui-core@11.0.0-vue3 for more details.
  onInputValueTimer.value = setTimeout(() => {
    let valueString = displayValue.value

    if (props.mode === SmCalendarMode.MONTH_YEAR) {
      const normalizedMonthYear = normalizeMonthYearString(displayValue.value) ?? ''
      const isNormalizedValid = isValidDate(normalizedMonthYear)
      const isInputValid = isValidDate(displayValue.value)

      valueString = !isInputValid && isNormalizedValid
        ? normalizedMonthYear
        : displayValue.value
    }

    const { month, year } = getDateParts(valueString)

    if (
      displayValue.value
      && isValidMinMaxRange({ month, year })
      && !isDisabledValue({ month, year })
    ) {
      modelValue.value = { year, month }
      emit('change', { year, month })
    } else {
      modelValue.value = null
      emit('change', null)
    }

  }, INPUT_DEBOUNCE)
}

/**
 * Flag if pointer is inside the popover so we can prevent
 * the popover from closing while it's being interacted
 */
const handleMouseEnter = (): void => {
  isPopoverHovered.value = true
}

const handleMouseLeave = (): void => {
  isPopoverHovered.value = false
}

/**
 * Popover focus can happen if element within it is clicked or tabbed into
 */
const handlePopoverFocusIn = (): void => {
  isPopoverFocused.value = true
}

/**
 * Hides when keyboard tab goes outside the popover
 */
const handlePopoverFocusOut = (e: FocusEvent): void => {
  if (
    !e.relatedTarget
    || !popoverBodyEl.value?.contains(e.relatedTarget as Node)
  ) {
    isPopoverFocused.value = false
    hidePopover()
  }
}

/**
 * Hide popover when clicked outside the popover
 */
const handleDocumentClick = (e: MouseEvent): void => {
  if (!popoverBodyEl.value?.contains(e.target as Node)) {
    // Clear values to handle touch devices
    isPopoverFocused.value = false
    isPopoverHovered.value = false
    hidePopover()
  }
}

/**
 * Updating the highlighted values in the view if any.
 */
const updateSmCalendarView = (value: SmCalendarDateParts | null): void => {
  if (!value?.year || !value.month) {
    activeYear.value = null
    activeMonth.value = null

    return
  }

  const { year, month } = value

  if (year >= minYear.value && year <= maxYear.value) {
    visibleYear.value = year
    activeYear.value = year
  }

  if (month > 0 && month <= 12) {
    activeMonth.value = month
  }
}

/**
 * Formats displayed value in the input field using the mask
 */
const formatDisplayValue = (value?: SmCalendarDateParts | null): void => {
  let formattedValue

  if (!value?.year || !value.month) {
    displayValue.value = null

    return
  }

  const { month, year } = value

  // Clear if date is disabled
  if (!isValidMinMaxRange(value) || isDisabledValue(value)) {
    displayValue.value = null

    return
  }

  if (props.masks?.input) {
    formattedValue = formatMonthYearString({
      year,
      month,
      format: props.masks.input,
    })
  } else {
    formattedValue = formatMonthYearString({ month, year })
  }

  if (formattedValue && formattedValue !== displayValue.value) {
    displayValue.value = formattedValue
  }
}

const initPopper = async (): Promise<void> => {
  await nextTick()

  if (!popoverBodyEl.value) {
    return
  }

  popper = setupPopper({
    trigger: inputBody.value,
    content: popoverBodyEl.value,
    fallbackPlacements: props.fallbackPlacements,
    offsetDistance: POPOVER_OFFSET, // Distance between the trigger and content (popover)
    placement: props.popoverPlacement,
    position: props.position,
  })
}

const destroyPopper = (): void => {
  if (popper) {
    popper.destroy()
    popper = null
  }
}

const initView = (): void => {
  switch (props.mode) {
    case SmCalendarMode.MONTH_YEAR:
      currentView.value = SmCalendarView.MONTH
      break

    default:
      currentView.value = SmCalendarView.MONTH // Change default to day once supported
      break
  }
}

watch(
  () => isVisible.value,
  async () => {
    if (isVisible.value && popper) {
      await popper.update()
    }

    emit('visible', isVisible.value)
  },
)

/**
 * Updates view whenever the model changes
 */
watch(
  modelValue,
  (newValue, oldValue) => {
    if (JSON.stringify(newValue) === JSON.stringify(oldValue)) {
      return
    }

    if (!newValue?.year || !newValue.month) {
      updateSmCalendarView(null)

      // Don't format while typing
      if (!isInputFocused.value) {
        formatDisplayValue()
      }

      return
    }

    if (
      modelValue.value
      && isValidMinMaxRange(modelValue.value)
      && !isDisabledValue(modelValue.value)
    ) {
      updateSmCalendarView(modelValue.value)

      // Don't format while typing
      if (!isInputFocused.value) {
        formatDisplayValue(modelValue.value)
      }
    } else {
      updateSmCalendarView(null)
      modelValue.value = null
      emit('change', null)

      // Don't format while typing
      if (!isInputFocused.value) {
        formatDisplayValue()
      }
    }
  },
  { immediate: true },
)

onMounted(async () => {
  await initPopper()
  initView()

  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keyup', handleDocumentKeyup)

  // Handle case wherein popover was forced closed with Escape key
  // and re-open again via click
  if (inputNative.value) {
    inputNative.value.addEventListener('click', handleInputFocus)
  }
})

onBeforeUnmount(() => {
  destroyPopper()

  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keyup', handleDocumentKeyup)

  if (inputNative.value) {
    inputNative.value.removeEventListener('click', handleInputFocus)
  }

  clearTimeout(onBlurValueTimer.value)
  clearTimeout(onInputValueTimer.value)
})

defineExpose({
  activeMonth,
  activeYear,
  currentView,
  currentMonth,
  currentYear,
  defaultId,
  displayValue,
  hasNext,
  hasPrevious,
  isVisible,
  monthOptions,
  popoverId,
  visibleYear,
  yearRange,
  yearOptions,
  // Refs
  inputEl,
  popoverBodyEl,
  popoverContentEl,
  // Methods
  handlePickerEnter,
  handleInputBlur,
  handleInputFocus,
  handleInputInput,
  handleMouseEnter,
  handleMouseLeave,
  handlePopoverFocusOut,
  handlePopoverFocusIn,
  handleSelectMonth,
  handleSelectYear,
  handleSwitch,
  navigateMonth,
  navigateYear,
  next,
  previous,
  resetView,
  selectMonthYear,
  selectYear,
  switchPicker,
  // we expose showPopover, mainly for percy visual tests
  // downstream projects should *not* use this method
  showPopover,
})
</script>

<template>
  <div
    class="sm-calendar-input"
    @keydown.enter="handlePickerEnter()"
  >
    <sm-input
      :id="id"
      ref="inputEl"
      v-model="displayValue"
      :disabled="disabled"
      :error-disabled="errorDisabled"
      :help-text="helpText"
      :label-hidden="labelHidden"
      :label="label"
      :placeholder="placeholder"
      :prefix-icon="prefixIcon"
      :rules="rules"
      :suffix-icon="suffixIcon"
      :aria-controls="popoverId"
      auto-complete="off"
      :type="SmInputType.TEXT"
      :name="name"
      :readonly="readonly"
      :class="inputClass"
      @focus="handleInputFocus()"
      @blur="handleInputBlur($event)"
      @update:model-value="handleInputInput()"
    >
      <template
        v-if="$slots.label"
        #label
      >
        <!-- @slot The field label. Overrides the label prop. -->
        <slot name="label" />
      </template>

      <template
        v-if="$slots.action"
        #action
      >
        <!-- @slot The field action next to the label. Example usage: adding a helper icon to provide more context on the field. -->
        <slot name="action" />
      </template>

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
    </sm-input>

    <!--
      <transition
      name="sm-calendar-popover-transition"
      @after-leave="resetView()"
      >
    -->
    <div
      v-show="isVisible"
      :id="popoverId || undefined"
      ref="popoverBodyEl"
      role="dialog"
      class="sm-calendar__popover"
    >
      <div
        v-if="isVisible"
        class="sm-calendar__popover-inner"
        @click.stop="() => {}"
        @focusin="handlePopoverFocusIn()"
        @focusout="handlePopoverFocusOut($event)"
        @mouseenter="handleMouseEnter()"
        @mouseleave="handleMouseLeave()"
      >
        <sm-calendar-header
          :enable-next="hasNext"
          :enable-previous="hasPrevious"
          :view="currentView"
          :year="visibleYear"
          :year-range="yearRange"
          @next="next()"
          @previous="previous()"
          @switch="fromView => handleSwitch(fromView)"
        />

        <div
          ref="popoverContentEl"
          class="sm-calendar__content"
          tabindex="-1"
        >
          <!--
            <transition
            name="sm-calendar-content-transition"
            >
          -->
          <div>
            <div
              v-if="monthOptions && currentView === SmCalendarView.MONTH"
              key="month"
              class="sm-calendar__options sm-calendar__options--month-year"
            >
              <sm-calendar-option
                v-for="(option, index) in monthOptions"
                :id="defaultId + '-' + option.year + '-' + option.month"
                :key="index"
                :current="option.isCurrent"
                :active="option.isActive"
                :focusable="option.year === activeYear
                  ? option.month === activeMonth
                  : option.month === currentMonth
                "
                :disabled="option.isDisabled"
                :label="option.label"
                :aria-label="option.ariaLabel"
                @select="handleSelectMonth(option)"
                @navigate="(e: KeyboardEvent) => navigateMonth(e, option)"
              />
            </div>

            <div
              v-if="yearOptions && currentView === SmCalendarView.YEAR"
              key="year"
              class="sm-calendar__options sm-calendar__options--year"
            >
              <sm-calendar-option
                v-for="(option, index) in yearOptions"
                :id="defaultId + '-' + option.year"
                :key="index"
                :current="option.year === currentYear"
                :active="option.year === activeYear"
                :disabled="option.isDisabled"
                :focusable="option.isFocusable"
                :label="option.year"
                @select="handleSelectYear(option)"
                @navigate="(e: KeyboardEvent) => navigateYear(e, option)"
              />
            </div>
          </div>
          <!-- </transition> -->
        </div>
      </div>
    </div>
    <!-- </transition> -->
  </div>
</template>

<style lang="scss" scoped>
@import "../../../common/variables";
@import "../../../common/mixins";

$sm-calendar--popover--background-color: $true-white;
$sm-calendar--popover--border-color: $blue-neu-mid;

.sm-calendar {
  &-input {
    position: relative;
  }

  &__popover {
    z-index: $sm-date-picker-z-index;
  }

  &__popover-inner {
    background: $sm-calendar--popover--background-color;
    border: 1px solid $sm-calendar--popover--border-color;
    border-radius: 8px;
    box-sizing: border-box;
    box-shadow: 0 5px 11px -5px rgba(24, 58, 108, 0.15),
      0 6px 9px -5px rgba(24, 58, 108, 0.14),
      0 1px 1px -1px rgba(24, 58, 108, 0.14);
    display: inline-block;
    padding: 0 $sm-16;
  }

  &__content {
    overflow: hidden;
    position: relative;
    width: 100%;

    &:focus {
      outline: none;
      box-shadow: none;
    }
  }

  &__options {
    display: grid;
    grid-template-columns: repeat(4, minmax(min-content, max-content));
    column-gap: 8px;
    row-gap: 16px;
    padding: 10px 0 18px;
  }
}
</style>
