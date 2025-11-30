import { onMounted, ref } from 'vue'
import { isPercyContext } from '../../../../../../test/percy/helpers'
import SmCalendar from '../sm-calendar.vue'
import SmCalendarHeader from '../sm-calendar-header.vue'
import SmCalendarInput from '../sm-calendar-input.vue'
import SmCalendarOption from '../sm-calendar-option.vue'
import defaultExample from './images/calendar-default.png'
import themedExample from './images/calendar-themed.png'

export default {
  title: 'Components/Form/Calendar',
  component: SmCalendar,
  subcomponents: {
    'sm-calendar-header': SmCalendarHeader,
    'sm-calendar-input': SmCalendarInput,
    'sm-calendar-option': SmCalendarOption,
  },
}

export const MonthAndYear = () => ({
  components: { SmCalendar },
  setup: () => {
    const monthYear = ref()
    const value = ref()

    const handleChange = (e: Event) => {
      console.info('change', e)
    }

    const handleMonthSelected = (e: Event) => {
      console.info('monthSelected', e)
    }

    return {
      monthYear,
      value,
      handleChange,
      handleMonthSelected,
    }
  },
  template: `
    <div>
      <sm-calendar
        name="month-and-year"
        style="max-width: 278px"
        v-model="monthYear"
        label="Select a month and year"
        prefix-icon="action-calendar"
        mode="month-year"
        @change="handleChange"
        @monthSelected="handleMonthSelected"
      />

      <code class="block mb-16">Selected: {{ monthYear }}</code>

      <sm-calendar
        name="month-and-year2"
        style="max-width: 278px"
        v-model="value"
        label="Select a month and year"
        placeholder="YYYY-MM"
        prefix-icon="action-calendar"
        rules="required|regex:^([0-9]{4}-[0-9]{2})$"
        mode="month-year"
        @monthSelected="handleMonthSelected"
      />

      <code class="block mb-16">Selected: {{ value }}</code>
    </div>
  `,
})

const monthAndYearDescription = `
  The <code>value</code> prop accepts an object with month and year properties.

  The input string typed in the field will be parsed using the
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date" target="_blank">Date constructor</a> and will
  update the <code>v-model</code> if it is a valid date.

  When an option is selected from the picker, the input field will be
  formatted to the year and month pairing (<code>YYYY-MM</code>) or
  the provided input mask. The input field's value can be further
  validated.

  Note that browsers have different implementations of the Date API
  so it may not behave consistently across the board.

  <strong>Locale:</strong>

  - Uses <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl">Intl API</a> to generate month names using the user's default locale.

  - To test different locales in Chrome, use
  <a target="_blank" href="https://developer.chrome.com/docs/devtools/device-mode/geolocation/">Sensors</a> settings


  <strong>Animations:</strong>

  - The animations are not applied if the user's system preference
  is set to reduce motion to avoid vestibular motion triggers.

  - This option can be set from the <a href="https://web.dev/prefers-reduced-motion/#remove-motion-on-operating-systems" target="_blank">operating system</a> or <a href="https://developer.chrome.com/blog/new-in-devtools-79/#userpreferences" target="_blank">simulated from Chrome</a>.
`

MonthAndYear.storyName = 'Month and year'

MonthAndYear.parameters = {
  docs: {
    description: {
      // Uses `component` here since it's the first story
      component: monthAndYearDescription,
    },
  },
}

export const MonthAndYearDisabled = () => ({
  components: { SmCalendar },
  setup: () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1

    const value1 = ref({ year, month })
    const value2 = ref({ year, month })
    const value3 = ref({ year: 1800, month: 9 })
    const value4 = ref()
    const value5 = ref()

    const min1 = { year, month }
    const max1 = { year, month }
    const min2 = { year: year - 2, month }
    const max2 = { year: year + 9, month }

    const min2Str = `${min2.year}-${min2.month}`
    const max2Str = `${max2.year}-${max2.month}`

    const handleMonthSelected = (e: Event) => {
      console.info('monthSelected', e)
    }
    const addMonths = (start: Date, months: number) => {
      const result = new Date(start)
      result.setMonth(result.getMonth() + months)

      return {
        year: result.getFullYear(),
        month: result.getMonth() + 1,
      }
    }
    const disabledDates1 = [
      { year: 1800, month: 1 },
      { year: 1800, month: 3 },
      { year: 1800, month: 8 },
    ]

    const disabledDates2 = [{ ...addMonths(today, -2) }, { ...addMonths(today, -1) }]

    return {
      disabledDates1,
      disabledDates2,
      min1,
      min2,
      min2Str,
      max2Str,
      max1,
      max2,
      today,
      year,
      value1,
      value2,
      value3,
      value4,
      value5,
      handleMonthSelected,
    }
  },
  template: `
    <div>
      <sm-calendar
        name="month-and-year-disabled"
        style="max-width: 278px"
        label="Min date"
        v-model="value1"
        prefix-icon="action-calendar"
        rules="required"
        mode="month-year"
        :minDate="min1"
        @monthSelected="handleMonthSelected"
      />

      <code class="block mb-16">Selected: {{ value1 }}</code>

      <sm-calendar
        name="month-and-year-max-date"
        style="max-width: 278px"
        label="Max date"
        v-model="value2"
        prefix-icon="action-calendar"
        rules="required"
        mode="month-year"
        :maxDate="max1"
        @monthSelected="handleMonthSelected"
      />

      <code class="block mb-16">Selected: {{ value2 }}</code>

      <sm-calendar
        name="month-and-year-specific-dates"
        style="max-width: 278px"
        label="Specific dates"
        v-model="value3"
        prefix-icon="action-calendar"
        rules="required"
        mode="month-year"
        :disabled-dates="disabledDates1"
        :help-text="'Disabled: 1800-01, 1800-03, 1800-08'"
        @monthSelected="handleMonthSelected"
      />

      <code class="block mb-16">Selected: {{ value3 }}</code>

      <sm-calendar
        name="month-and-year-min-max-specific-dates"
        style="max-width: 278px"
        label="Min, max and specific dates"
        v-model="value4"
        prefix-icon="action-calendar"
        rules="required"
        mode="month-year"
        :help-text="'Between ' + min2Str + ' to ' + max2Str + ' (inclusive) and two months before'"
        :disabled-dates="disabledDates2"
        :minDate="min2"
        :maxDate="max2"
        @monthSelected="handleMonthSelected"
      />

      <code class="block mb-16">Selected: {{ value4 }}</code>

      <sm-calendar
        name="month-and-year-disabled-input"
        style="max-width: 278px"
        label="Disabled input"
        v-model="value5"
        prefix-icon="action-calendar"
        mode="month-year"
        disabled
      />
    </div>
  `,
})

MonthAndYearDisabled.storyName = 'Month and year: Disabled'

const monthAndYearDisabledDescription = `
  To set min and/or max dates set <code>min-date</code> or <code>max-date</code> with the following structure:

  <code>{ month: number, year: number }</code>

  Similarly, to disable specific dates, set <code>disabled-dates</code> and pass in a list of month and year pairing

  <code>[{ month: number, year: number }]</code>
`

MonthAndYearDisabled.parameters = {
  docs: {
    description: {
      story: monthAndYearDisabledDescription,
    },
  },
}

export const MonthAndYearMasks = () => ({
  components: { SmCalendar },
  setup: () => {
    interface CalendarRef {
      startRangeRef: {
        showPopover: () => void
      }
    }

    // Set past year so current month-year indicator doesn't change over time when doing Percy visual testing
    const date = new Date(2022, 9, 15)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const calendarRef = ref<CalendarRef>()

    const value1 = ref({ year, month })

    const handleMonthSelected = (e: Event) => {
      console.info('monthSelected', e)
    }

    const addMonths = (start: Date, months: number) => {
      const result = new Date(start)
      result.setMonth(result.getMonth() + months)

      return {
        year: result.getFullYear(),
        month: result.getMonth() + 1,
      }
    }

    onMounted(() => {
      // Open the calendar when running in Percy
      // This is manually done here because we don't have a prop
      // that we can just set to true to display the hidden content
      if (isPercyContext() && calendarRef.value?.startRangeRef) {
        calendarRef.value.startRangeRef.showPopover()
      }
    })

    return {
      calendarRef,
      twoMonthsAhead: addMonths(date, 2),
      oneMonthAhead: addMonths(date, 1),
      value1,
      handleMonthSelected,
    }
  },
  template: `
    <div>
      <sm-calendar
        name="month-and-year-masks"
        style="max-width: 278px"
        v-model="value1"
        label="Select a month and year"
        prefix-icon="action-calendar"
        placeholder="YYYY-MM (Default)"
        rules="required"
        mode="month-year"
        :disabled-dates="[
          { ...twoMonthsAhead },
          { ...oneMonthAhead }
        ]"
        @monthSelected="handleMonthSelected"
      />

      <code class="block mb-16">Selected: {{ value1 }}</code>

      <sm-calendar
        name="month-and-year-masks2"
        style="max-width: 278px"
        v-model="value1"
        label="Select a month and year"
        prefix-icon="action-calendar"
        mode="month-year"
        placeholder="MMM YYYY"
        rules="required"
        :masks="{ input: 'MMM YYYY' }"
        :disabled-dates="[
          { ...twoMonthsAhead },
          { ...oneMonthAhead }
        ]"
        @monthSelected="handleMonthSelected"
      />

      <code class="block mb-16">Selected: {{ value1 }}</code>

      <sm-calendar
        name="month-and-year-masks3"
        style="max-width: 278px"
        v-model="value1"
        label="Select a month and year"
        prefix-icon="action-calendar"
        placeholder="MMMM YYYY"
        rules="required"
        mode="month-year"
        :masks="{ input: 'MMMM YYYY' }"
        :disabled-dates="[
          { ...twoMonthsAhead },
          { ...oneMonthAhead }
        ]"
        @monthSelected="handleMonthSelected"
      />

      <code class="block mb-16">Selected: {{ value1 }}</code>

      <sm-calendar
        name="month-and-year-masks4"
        style="max-width: 278px"
        v-model="value1"
        ref="calendarRef"
        label="Select a month and year"
        prefix-icon="action-calendar"
        placeholder="MM/YYYY"
        rules="required"
        mode="month-year"
        :masks="{ input: 'MM/YYYY' }"
        :disabled-dates="[
          { ...twoMonthsAhead },
          { ...oneMonthAhead }
        ]"
        @monthSelected="handleMonthSelected"
      />

      <code class="block mb-16">Selected: {{ value1 }}</code>
    </div>
  `,
})

MonthAndYearMasks.storyName = 'Month and year: Masks'

const monthAndYearMasksDescription = `
  The displayed text on the input can be masked via <code>masks</code> prop.

  For instance:
  <code>:masks="{ input: 'MMM YYYY' }"</code>

  The available tokens are:

<table style="border-spacing: 0">
  <thead>
    <tr>
      <th style="padding: 8px; border-bottom: 1px solid #c6d0e0;"></th>
      <th style="padding: 8px; border-bottom: 1px solid #c6d0e0;">Token</th>
      <th style="padding: 8px; border-bottom: 1px solid #c6d0e0;">Output</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th style="padding: 8px; border-bottom: 1px solid #c6d0e0;">Month</th>
      <td style="padding: 8px; border-bottom: 1px solid #c6d0e0;"><code>M</code></td>
      <td style="padding: 8px; border-bottom: 1px solid #c6d0e0;">1, 2, ..., 12</td>
    </tr>
    <tr>
      <th style="padding: 8px; border-bottom: 1px solid #c6d0e0;"></th>
      <td style="padding: 8px; border-bottom: 1px solid #c6d0e0;"><code>MM</code></td>
      <td style="padding: 8px; border-bottom: 1px solid #c6d0e0;">01, 02, ..., 12</td>
    </tr>
    <tr>
      <th style="padding: 8px; border-bottom: 1px solid #c6d0e0;"></th>
      <td style="padding: 8px; border-bottom: 1px solid #c6d0e0;"><code>MMM</code></td>
      <td style="padding: 8px; border-bottom: 1px solid #c6d0e0;">Jan, Feb, ..., Dec</td>
    </tr>
    <tr>
      <th style="padding: 8px; border-bottom: 1px solid #c6d0e0;"></th>
      <td style="padding: 8px; border-bottom: 1px solid #c6d0e0;"><code>MMMM</code></td>
      <td style="padding: 8px; border-bottom: 1px solid #c6d0e0;">January, February, ..., December</td>
    </tr>
    <tr>
      <th style="padding: 8px; border-bottom: 1px solid #c6d0e0;">Year</th>
      <td style="padding: 8px; border-bottom: 1px solid #c6d0e0;"><code>YY</code></td>
      <td style="padding: 8px; border-bottom: 1px solid #c6d0e0;">70, 71, ..., 69</td>
    </tr>
    <tr>
      <th style="padding: 8px; border-bottom: 1px solid #c6d0e0;"></th>
      <td style="padding: 8px; border-bottom: 1px solid #c6d0e0;"><code>YYYY</code></td>
      <td style="padding: 8px; border-bottom: 1px solid #c6d0e0;">1970, 1971, ..., 2069</td>
    </tr>
  </tbody>
</table>
`

MonthAndYearMasks.parameters = {
  docs: {
    description: {
      story: monthAndYearMasksDescription,
    },
  },
  percy: {
    // Needed for the Percy setup steps in onMounted hook to run
    // Take note of the defaults when upgrading Storybook or Percy in the future
    // https://docs.percy.io/docs/storybook#unexpected-diffs
    enableJavascript: true,
  },
}

export const MonthAndYearLocale = () => ({
  components: { SmCalendar },
  setup: () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    const value1 = ref({ year, month })
    const value2 = ref({ year, month })

    const handleMonthSelected = (e: Event) => {
      console.info('monthSelected', e)
    }

    return {
      value1,
      value2,
      handleMonthSelected,
    }
  },
  template: `
    <div>
      <sm-calendar
        v-model="value1"
        name="month-and-year-masks-de"
        style="max-width: 278px"
        label="Select a month and year (de)"
        locale="de"
        prefix-icon="action-calendar"
        placeholder="YYYY-MM"
        rules="required"
        mode="month-year"
        :masks="{ input: 'MMMM YYYY' }"
        @monthSelected="handleMonthSelected"
      />

      <sm-calendar
        v-model="value2"
        name="month-and-year-masks-th"
        style="max-width: 278px"
        label="Select a month and year (th-TH)"
        locale="th-TH"
        prefix-icon="action-calendar"
        placeholder="YYYY-MM"
        rules="required"
        mode="month-year"
        :masks="{ input: 'MMMM YYYY' }"
        @monthSelected="handleMonthSelected"
      />
    </div>
  `,
})

MonthAndYearLocale.storyName = 'Month and year: Locale'

MonthAndYearLocale.parameters = {
  docs: {
    description: {
      story: 'Specifies the locale used to generate localized month names via the Intl.DateTimeFormat Web API.',
    },
  },
}

export const MonthAndYearRange = () => ({
  components: { SmCalendar },
  setup: () => {
    interface CalendarRef {
      endRangeRef: {
        showPopover: () => void
      }
    }

    const calendarRef = ref<CalendarRef>()
    const value1 = ref()

    const value2 = ref({
      start: null,
      end: null,
    })

    // Set past year so current month-year indicator doesn't change
    // over time when doing Percy visual testing
    const value3 = ref({
      start: { year: 2020, month: 6 },
      end: { year: 2020, month: 10 },
    })

    const handleEvent = (name: string, value: unknown) => {
      console.info(name, value)
    }

    onMounted(() => {
      // Open the calendar end range when running in Percy
      // This is manually done here because we don't have a prop
      // that we can just set to true to display the hidden content
      if (isPercyContext() && calendarRef.value?.endRangeRef) {
        calendarRef.value.endRangeRef.showPopover()
      }
    })

    return {
      calendarRef,
      value1,
      value2,
      value3,
      handleEvent,
    }
  },
  template: `
    <div>
      <sm-calendar
        name="month-and-year-range"
        style="max-width: 282px"
        v-model="value1"
        label="Select month and year range"
        start-date-placeholder="Start"
        end-date-placeholder="End"
        mode="month-year"
        :is-range="true"
        :label-hidden="true"
        :error-disabled="true"
        @change="handleEvent('change', $event)"
        @startMonthSelected="handleEvent('startMonthSelected', $event)"
        @endMonthSelected="handleEvent('endMonthSelected', $event)"
      />

      <code class="block mt-32 mb-32">Selected: {{ value1 }}</code>

      <sm-calendar
        name="month-and-year-range2"
        style="max-width: 282px"
        v-model="value2"
        label="Select month and year range"
        start-date-placeholder="Start"
        end-date-placeholder="End"
        mode="month-year"
        prefix-icon="action-calendar"
        help-text="Help text"
        :masks="{ input: 'MMM YYYY' }"
        :is-range="true"
        @change="handleEvent('change', $event)"
        @startMonthSelected="handleEvent('startMonthSelected', $event)"
        @endMonthSelected="handleEvent('endMonthSelected', $event)"
      />

      <code class="block mb-16">Selected: {{ value2 }}</code>

      <sm-calendar
        name="month-and-year-range3"
        style="max-width: 282px"
        v-model="value3"
        ref="calendarRef"
        id="custom-calendar-id"
        label="Select month and year range"
        start-date-placeholder="Start"
        end-date-placeholder="End"
        mode="month-year"
        rules="required"
        suffix-icon="action-calendar"
        :masks="{ input: 'MMM YYYY' }"
        :is-range="true"
        @change="handleEvent('change', $event)"
        @startMonthSelected="handleEvent('startMonthSelected', $event)"
        @endMonthSelected="handleEvent('endMonthSelected', $event)"
      />

      <code class="block mb-16">Selected: {{ value3 }}</code>
    </div>
  `,
})

MonthAndYearRange.storyName = 'Month and year: Range'

const monthAndYearRangeDescription = `
  Use <code>is-range</code> prop to select date ranges.

  The model will have the following structure:

  <pre>
    {
      start: { year: number, month: number },
      end: { year: number, month: number },
    }
  </pre>
`

MonthAndYearRange.parameters = {
  docs: {
    description: {
      story: monthAndYearRangeDescription,
    },
  },
  percy: {
    // Needed for the Percy setup steps in onMounted hook to run
    // Take note of the defaults when upgrading Storybook or Percy in the future
    // https://docs.percy.io/docs/storybook#unexpected-diffs
    enableJavascript: true,
  },
}

export const StylingHooks = () => ({
  setup: () => {
    const defaultImage = defaultExample
    const themedImage = themedExample

    return {
      defaultImage,
      themedImage,
    }
  },
  template: `
    <div>
      <h3>Styling hooks</h3>
      <p>Styling hooks will enable customization for your components. Styling hooks are constructed using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">CSS custom properties</a>.</p>

      <p>Below is an example of the SUI calendar and the brand calendar using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 305px; height: auto; min-width: 0"
          alt="Calendar default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 305px; height: auto; min-width: 0"
          alt="Calendar themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the calendar customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

      <p>For the <span style="font-weight: 600;">shared input, label and error field variables</span>, please refer to the table in <a href="/?path=/story/components-form-input--styling-hooks">input styling hooks</a></p>

      <sm-table>
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Element </sm-table-th>
            <sm-table-th> Category + Property </sm-table-th>
            <sm-table-th class="w-1/2 small-desktop:w-3/5"> Styling Hooks</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>

        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-th colspan="3">Popover</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Container</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              border
              <br/>
              border-radius
              <br/>
              box-shadow
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-calendar-popover-color-background
                --sm-c-calendar-popover-border
                --sm-c-calendar-popover-border-radius
                --sm-c-calendar-popover-box-shadow
                --sm-c-calendar-popover-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Header</sm-table-td>
            <sm-table-td>
              border-bottom
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-calendar-popover-header-border-bottom
                --sm-c-calendar-popover-header-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Header switch button</sm-table-td>
            <sm-table-td>
              color-text
              <br/>
              font-size
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-calendar-popover-header-switch-padding

                --sm-c-calendar-popover-header-switch-button-color-text
                --sm-c-calendar-popover-header-switch-button-font-size
                --sm-c-calendar-popover-header-switch-button-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Header arrow buttons</sm-table-td>
            <sm-table-td>
              color-icon
              <br/>
              font-size
              <br/>
              height
              <br/>
              width
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-calendar-popover-header-arrow-color-icon
                --sm-c-calendar-popover-header-arrow-icon-size
                --sm-c-calendar-popover-header-arrow-height
                --sm-c-calendar-popover-header-arrow-width
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Options (grid)</sm-table-td>
            <sm-table-td>
              padding
              <br/>
              column-gap
              <br/>
              row-gap
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-calendar-popover-options-padding

                --sm-c-calendar-popover-options-column-gap-month-year
                --sm-c-calendar-popover-options-row-gap-month-year

                --sm-c-calendar-popover-options-column-gap-year
                --sm-c-calendar-popover-options-row-gap-year
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Option</sm-table-td>
            <sm-table-td>
              border
              <br/>
              border-radius
              <br/>
              color-background
              <br/>
              color-text
              <br/>
              min-width
              <br/>
              padding
              <br/>
              outline
              <br/>
              outline-offset
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-calendar-popover-option-border
                --sm-c-calendar-popover-option-border-radius
                --sm-c-calendar-popover-option-color-background
                --sm-c-calendar-popover-option-color-text
                --sm-c-calendar-popover-option-min-width
                --sm-c-calendar-popover-option-padding

                --sm-c-calendar-popover-option-color-background-current
                --sm-c-calendar-popover-option-color-border-current
                --sm-c-calendar-popover-option-color-text-current

                --sm-c-calendar-popover-option-color-background-active
                --sm-c-calendar-popover-option-color-border-active
                --sm-c-calendar-popover-option-color-text-active

                --sm-c-calendar-popover-option-color-background-disabled
                --sm-c-calendar-popover-option-color-border-disabled
                --sm-c-calendar-popover-option-color-text-disabled

                --sm-c-calendar-popover-option-color-background-active-disabled
                --sm-c-calendar-popover-option-color-border-active-disabled
                --sm-c-calendar-popover-option-color-text-active-disabled

                --sm-c-calendar-popover-option-color-background-hover
                --sm-c-calendar-popover-option-color-text-hover

                --sm-c-calendar-popover-option-outline-focus
                --sm-c-calendar-popover-option-outline-offset-focus
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'

StylingHooks.parameters = {
  info: false,
}
