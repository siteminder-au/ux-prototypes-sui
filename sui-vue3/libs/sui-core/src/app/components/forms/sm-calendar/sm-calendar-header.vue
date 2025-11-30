<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../../../libs/vue-i18n'
import { SmCalendarYearRange, SmCalendarView } from './sm-calendar.types'
import { SmButtonShape, SmButtonType } from '../../sm-button/sm-button.types'
import SmButton from '../../sm-button/sm-button.vue'

const props = withDefaults(defineProps<{
  /**
   * Whether the next button is enabled
   */
  enableNext?: boolean
  /**
   * Whether the previous button is enabled
   */
  enablePrevious?: boolean
  /**
   * Current view of the picker: 'month' or 'year'
   */
  view?: SmCalendarView
  /**
   * Current year in view if in month-year picker mode
   */
  year?: number
  /**
   * Current year range in view if in year picker mode
   */
  yearRange?: SmCalendarYearRange
}>(), {
  enableNext: true,
  enablePrevious: true,
  view: undefined,
  year: undefined,
  yearRange: undefined,
})

defineEmits<{
  /**
   * Emits when the next button is clicked
   */
  next: []
  /**
   * Emits when the previous button is clicked
   */
  previous: []
  /**
   * Emits when the switch calendar view button is clicked
   */
  switch: [value: SmCalendarView | undefined]
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

const { i18n } = useI18n()

const displayRangeSeparator = '-'

/**
 * Navigation's next button label
 */
const nextA11yLabel = computed(() => {
  if (props.view === SmCalendarView.MONTH) {
    return i18n.t(
      'sui-core.components.forms.sm-calendar.sm-calendar.a11y__next-year-button',
    )
  }

  if (props.view === SmCalendarView.YEAR) {
    return i18n.t(
      'sui-core.components.forms.sm-calendar.sm-calendar.a11y__next-year-range-button',
    )
  }

  return null
})

/**
 * Navigation's previous button label
 */
const previousA11yLabel = computed(() => {
  if (props.view === SmCalendarView.MONTH) {
    return i18n.t(
      'sui-core.components.forms.sm-calendar.sm-calendar.a11y__previous-year-button',
    )
  }

  if (props.view === SmCalendarView.YEAR) {
    return i18n.t(
      'sui-core.components.forms.sm-calendar.sm-calendar.a11y__previous-year-range-button',
    )
  }

  return null
})

/**
 * Navigation's switch picker button label
 */
const switchA11yLabel = computed(() => {
  if (props.view === SmCalendarView.MONTH) {
    return i18n.t(
      'sui-core.components.forms.sm-calendar.sm-calendar.a11y__choose-year-button',
    )
  }

  if (props.view === SmCalendarView.YEAR) {
    return i18n.t(
      'sui-core.components.forms.sm-calendar.sm-calendar.a11y__choose-month-button',
    )
  }

  return null
})

defineExpose({
  nextA11yLabel,
  previousA11yLabel,
  switchA11yLabel,
})
</script>

<template>
  <div class="sm-calendar-header">
    <sm-button
      :shape="SmButtonShape.SQUARE"
      class="sm-calendar-header__prev-button"
      :type="SmButtonType.TEXT"
      :aria-label="previousA11yLabel"
      :disabled="!enablePrevious"
      @click="$emit('previous')"
    >
      <sm-icon name="arrow-left" />
    </sm-button>

    <sm-button
      class="sm-calendar-header__switch-button"
      :type="SmButtonType.TEXT"
      :aria-label="switchA11yLabel"
      @click="$emit('switch', view)"
    >
      <!--
        <transition
        name="sm-calendar-header-button-transition"
        >
      -->
      <div>
        <span
          v-if="view === SmCalendarView.MONTH"
          key="month-year"
          class="sm-calendar-header__button-text sm-h5"
        >
          {{ year }}
        </span>
        <span
          v-if="view === SmCalendarView.YEAR"
          key="year"
          class="sm-calendar-header__button-text sm-h5"
        >
          {{ yearRange?.start }} {{ displayRangeSeparator }} {{ yearRange?.end }}
        </span>
      </div>
      <!-- </transition> -->
    </sm-button>

    <sm-button
      class="sm-calendar-header__next-button"
      :shape="SmButtonShape.SQUARE"
      :type="SmButtonType.TEXT"
      :aria-label="nextA11yLabel"
      :disabled="!enableNext"
      @click="$emit('next')"
    >
      <sm-icon name="arrow-right" />
    </sm-button>
  </div>
</template>

<style lang="scss" scoped>
@import "../../../common/variables";
@import "../../../common/mixins";

$sm-calendar-header--border-color: $blue-neu-mid;

.sm-calendar-header {
  align-items: center;
  border-bottom: 1px solid $sm-calendar-header--border-color;
  display: flex;
  justify-content: space-between;
  padding: $sm-12 0 $sm-8;

  &__switch-button.sm-button {
    padding: 0 $sm-8;
    width: 100%;

    :deep(.sm-button__content) {
      padding: 6px $sm-8;
    }

    :deep(.sm-button__inner-content) {
      line-height: 1;
      position: relative;
      width: 100%;
    }
  }

  &__button-text {
    display: block;
    margin: 0;
    width: 100%;
  }

  &__next-button,
  &__prev-button {
    line-height: 0;

    .sm-icon {
      top: -1px;
    }
  }

  .sm-button + .sm-button {
    /* Remove margins on adjacent sm-buttons in header */
    margin-left: 0;
  }
}
</style>
