import { onMounted, ref } from 'vue'
import SmDatePicker from '../sm-date-picker.vue'
import { timezoneListFull } from '../timezones-sample'
import { isPercyContext } from '../../../../../../test/percy/helpers'

/**
 * NOTE:
 *
 * We are expecting component UI differences between Vue2 and Vue3
 * because we upgraded the `v-calendar` plugin with minimal CSS overrides.
 */

const isPercy = isPercyContext()

export default {
  title: 'Components/Form/Date Picker',
  component: SmDatePicker,
}

export const SingleDate = () => ({
  components: { SmDatePicker },
  setup: () => {
    const date = ref(new Date())
    const date2 = ref()

    const eventLogger = (label: string, event?: any): void => {
      console.info(label, event)

      if (['focus', 'blur', 'start', 'end', 'drag'].includes(label)) {
        console.warn(`WARNING: ${label} shouldn't be triggered in a standard/single date picker`)
      }
    }

    return {
      date,
      date2,
      isPercy,
      eventLogger,
    }
  },
  template: `
    <div>

      <div class="max-w-xs">
        <sm-date-picker
          label="Single date"
          v-model="date2"
          name="date2"
          rules="required"
          @blur="eventLogger('blur')"
          @focus="eventLogger('focus')"
          @end="eventLogger('end', $event)"
          @input="eventLogger('input', $event)"
          @start="eventLogger('start', $event)"
          @dayclick="eventLogger('dayclick', $event)"
          @drag="eventLogger('drag')"
          @update:modelValue="eventLogger('update:modelValue', $event)"
        ></sm-date-picker>
      </div>
      <code>Selected date: {{ date2 }}</code>

      <br/><br/>

      <div class="max-w-xs">
        <sm-date-picker
          label="Single date - prop"
          name="date"
          v-model="date"
          rules="required"
        >
          <template #label>Single date</template>
        </sm-date-picker>
      </div>
      <code>Selected date: {{ date }}</code>
    </div>
  `,
})

SingleDate.storyName = 'Single date'

const singleDateDescription = `
  The date picker component is a wrapper around the [v-calendar](https://vcalendar.io/datepicker/basics.html) date picker component.
`
SingleDate.parameters = {
  docs: {
    description: {
      // Uses `component` here since it's the primary story
      component: singleDateDescription,
    },
  },
}

export const DateTime = () => ({
  components: { SmDatePicker },
  setup: () => {
    // Pre-fill with static date for Percy visual testing
    // But hide the v-model logged in the UI because it could change with the locale
    const date = ref(new Date(2023, 2, 15, 23, 45, 11))
    const datePicker = ref()
    const timezone = ref('')

    onMounted(() => {
      // Open the date-picker when running in Percy
      // This is manually done here because we don't have a prop
      // that we can just set to true to display the hidden content
      if (isPercy && datePicker.value.smDatePicker) {
        datePicker.value.smDatePicker.showPopover()
      }
    })

    return {
      date,
      datePicker,
      timezone,
      isPercy,
    }
  },
  template: `
    <div>
      <div class="max-w-xs">
        <sm-date-picker
          :timezone="timezone"
          ref="datePicker"
          mode="dateTime"
          label="Single date"
          v-model="date"
          rules="required"
          name="dateTime"
        >
          <template #action>
            <sm-icon name="utility-information-alt" class="text-grey-neu-dark" />
          </template>
        </sm-date-picker>
      </div>

      <code class="percy-invisible">Selected date: {{ date }}</code>
    </div>
  `,
})

DateTime.storyName = 'Date time'

DateTime.parameters = {
  docs: {
    description: {
      story: 'Use the <code>mode</code> props to set \'dateTime\' for the date-time picker',
    },
  },
  percy: {
    // Needed for the Percy setup steps in onMounted hook to run
    // Take note of the defaults when upgrading Storybook or Percy in the future
    // https://docs.percy.io/docs/storybook#unexpected-diffs
    enableJavascript: true,
  },
}

export const Time = () => ({
  components: { SmDatePicker },
  setup: () => {
    // Pre-fill with static date time for Percy visual testing
    // But hide the v-model logged in the UI because it could change with the locale
    // Vue3 upstream issue: https://github.com/nathanreyes/v-calendar/issues/1316
    const date = ref(isPercy ? new Date(2023, 2, 15, 22, 56, 11) : new Date())
    const date2 = ref(isPercy ? new Date(2023, 2, 15, 22, 56, 11) : new Date())
    const datePicker = ref()
    const timezone = ref('')

    onMounted(() => {
      // Open the date-picker when running in Percy
      // This is manually done here because we don't have a prop
      // that we can just set to true to display the hidden content
      if (isPercy && datePicker.value.smDatePicker) {
        datePicker.value.smDatePicker.showPopover()
      }
    })

    return {
      date,
      date2,
      datePicker,
      timezone,
      isPercy,
    }
  },
  template: `
    <div>

      <div class="max-w-xs">
        <sm-date-picker ref="datePicker" mode="time" label="Single date" v-model="date" rules="required" name="date"></sm-date-picker>
      </div>

      <code class="percy-invisible">Selected date: {{ date }} </code>

      <br/><br/>

      <div class="max-w-xs">
        <sm-date-picker
          mode="time"
          label="Select time"
          v-model="date2"
          rules="required"
          :masks="{
            modelValue: 'hh:mm A'
          }"
          :model-modifiers="{
            string: true
          }"
          :time-rules="{
            minutes: { interval: 10 }
          }"
          help-text="Ten minute increments"
          name="date2"
        />
      </div>

      <code>Selected date: {{ date2 }} </code>

    </div>
  `,
})

const timeDescription = `
  Use the <code>mode</code> props to set 'time' for the time picker

  <strong>Deprecated minute-increment prop</strong>

  The <code>minute-increment</code> prop has been deprecated in favor of <code>time-rules</code> prop.
  See <a href="https://vcalendar.io/datepicker/time-rules.html">https://vcalendar.io/datepicker/time-rules.html</a> for more information.
`
Time.parameters = {
  docs: {
    description: {
      story: timeDescription,
    },
  },
  percy: {
    // Needed for the Percy setup steps in onMounted hook to run
    // Take note of the defaults when upgrading Storybook or Percy in the future
    // https://docs.percy.io/docs/storybook#unexpected-diffs
    enableJavascript: true,
  },
}

export const DateRange = () => ({
  components: { SmDatePicker },
  setup: () => {
    const dateRange = ref({
      start: null,
      end: null,
    })

    const dateRange2 = ref({
      start: null,
      end: null,
    })

    const dateRange3 = ref({
      start: null,
      end: null,
    })

    // Pre-fill with static dates for Percy visual testing
    const dateRange4 = ref({
      start: new Date(2023, 0, 5),
      end: new Date(2023, 1, 15),
    })

    const datePicker = ref()

    const eventLogger = (label: string, event?: any): void => {
      console.info(label, event)

      if (label === 'dayclick') {
        console.warn(`WARNING: ${label} shouldn't be triggered in a date range picker`)
      }
    }

    onMounted(() => {
      // Open the date-picker when running in Percy
      // This is manually done here because we don't have a prop
      // that we can just set to true to display the hidden content
      if (isPercy && datePicker.value.smDatePicker) {
        datePicker.value.smDatePicker.showPopover()
      }
    })

    return {
      datePicker,
      dateRange,
      dateRange2,
      dateRange3,
      dateRange4,
      isPercy,
      eventLogger,
    }
  },
  template: `
    <div :class="{ 'flex flex-wrap gap-x-48': isPercy }">
      <div style="width: 280px">
        <sm-date-picker
          v-model="dateRange"
          style="padding-top: 16px"
          label="Date range"
          startDatePlaceholder="Start date"
          endDatePlaceholder="End date"
          :columns="2"
          :label-hidden="true"
          :model-modifiers="{
            range: true,
          }"
          name="dateRange"
          @blur="eventLogger('blur')"
          @focus="eventLogger('focus')"
          @end="eventLogger('end', $event)"
          @input="eventLogger('input', $event)"
          @start="eventLogger('start', $event)"
          @dayclick="eventLogger('dayclick', $event)"
          @drag="eventLogger('drag')"
          @update:modelValue="eventLogger('update:modelValue', $event)"
        ></sm-date-picker>
        <pre>Selected dates: {{ dateRange }}</pre>

        <sm-date-picker startDatePlaceholder="Start date" endDatePlaceholder="End date" prefix-icon="action-calendar" :columns="2" rules="required" label="Date range" v-model="dateRange2" :is-range="true" name="dateRange2"></sm-date-picker>
        <pre>Selected dates: {{ dateRange2 }}</pre>

        <sm-date-picker startDatePlaceholder="Start date" endDatePlaceholder="End date" prefix-icon="action-calendar" suffix-icon="action-calendar" :columns="2" rules="required" label="Date range" v-model="dateRange3" :is-range="true" name="dateRange3"></sm-date-picker>
        <pre>Selected dates: {{ dateRange3 }}</pre>
      </div>

      <div style="width: 280px">
        <sm-date-picker
          ref="datePicker"
          startDatePlaceholder="Start date"
          endDatePlaceholder="End date"
          suffix-icon="action-calendar"
          :columns="2"
          rules="required"
          label="Date range - prop"
          v-model="dateRange4"
          :is-range="true"
          name="dateRange4"
        >
          <template #label>Date range</template>
          <template #action>
            <sm-icon name="utility-information-alt" class="text-grey-neu-dark" />
          </template>
        </sm-date-picker>
        <pre>Selected dates: {{ dateRange4 }}</pre>
      </div>
    </div>
  `,
})

DateRange.storyName = 'Date range'

const dateRangeDescription = `
  The <code>mode</code> accepts the following values: 'date' | 'dateTime' | 'time'

  Use the <code>is-range</code> prop to bind to use date range selection mode

  For date ranges, <code>inputValue</code> and <code>inputEvents</code> will provide their bindings within start and end sub-properties
`
DateRange.parameters = {
  docs: {
    description: {
      story: dateRangeDescription,
    },
  },
  percy: {
    // Needed for the Percy setup steps in onMounted hook to run
    // Take note of the defaults when upgrading Storybook or Percy in the future
    // https://docs.percy.io/docs/storybook#unexpected-diffs
    enableJavascript: true,
    // Support smaller viewport to cover the responsive layouts via columns and rows props
    widths: [1025, 769],
  },
}

export const Icons = () => ({
  components: { SmDatePicker },
  setup: () => {
    const date1 = ref(null)
    const date2 = ref(null)
    const date3 = ref(null)
    const date4 = ref(null)
    const date5 = ref(null)
    const date6 = ref(null)

    return {
      date1,
      date2,
      date3,
      date4,
      date5,
      date6,
      isPercy,
    }
  },
  template: `
    <div>
      <div class="max-w-xs">
        <sm-date-picker
          prefix-icon="action-calendar"
          label="Prefix - prop"
          v-model="date1"
          name="date1"
        >
          <template #label>Prefix</template>
        </sm-date-picker>
        <sm-date-picker
          suffix-icon="action-calendar"
          label="Suffix"
          v-model="date2"
          name="date2"
        >
          <template #action>
            <sm-icon name="utility-information-alt" class="text-grey-neu-dark" />
          </template>
        </sm-date-picker>

        <sm-date-picker
          prefix-icon="action-calendar"
          suffix-icon="action-calendar"
          label="Both - prop"
          v-model="date3"
          name="date3"
        >
          <template #label>Both</template>
          <template #action>
            <sm-icon name="utility-information-alt" class="text-grey-neu-dark" />
          </template>
        </sm-date-picker>

        <sm-date-picker
          label="Prefix slot"
          v-model="date4"
          name="date4"
          start-date-placeholder="Start date"
          end-date-placeholder="End date"
          :model-modifiers="{ range: true }"
        >
          <template #prefix><sm-button shape="square" type="primary" aria-label="Lock input one"><sm-icon name="action-calendar" /></sm-button></template>
        </sm-date-picker>
        <sm-date-picker
          label="Suffix slot"
          v-model="date5"
          name="date5"
          start-date-placeholder="Start date"
          end-date-placeholder="End date"
          :model-modifiers="{ range: true }"
        >
        <template #suffix><sm-button shape="square" type="primary" aria-label="Lock input two"><sm-icon name="action-calendar" /></sm-button></template>
        </sm-date-picker>
        <sm-date-picker
          label="Both slots"
          v-model="date6"
          name="date6"
          start-date-placeholder="Start date"
          end-date-placeholder="End date"
          :model-modifiers="{ range: true }"
        >
          <template #prefix><sm-button shape="square" type="primary" aria-label="Lock input three"><sm-icon name="action-calendar" /></sm-button></template>
          <template #suffix><sm-button shape="square" type="primary" aria-label="Lock input four"><sm-icon name="action-calendar" /></sm-button></template>
        </sm-date-picker>
      </div>
    </div>
  `,
})

Icons.parameters = {
  docs: {
    description: {
      story: 'Use the icons provided by <code>sm-icon</code> to set a prefix or suffix icon',
    },
  },
}

export const DisablingDates = () => ({
  components: { SmDatePicker },
  setup: () => {
    // For ease of use, let the pickers use the current month when
    // viewing from the demos, but set past and static dates when
    // doing Percy visual testing
    const disabledDate = isPercy ? new Date(2023, 2, 15) : new Date()
    const initValue = isPercy ? new Date(2023, 2, 15) : null
    const date = ref(initValue)
    const datePicker = ref()

    const addDays = (start: Date, days: number) => {
      const result = new Date(start)
      result.setDate(result.getDate() + days)
      return result
    }

    onMounted(() => {
      // Open the date-picker when running in Percy
      // This is manually done here because we don't have a prop
      // that we can just set to true to display the hidden content
      if (isPercy && datePicker.value.smDatePicker) {
        datePicker.value.smDatePicker.showPopover()
      }
    })

    return {
      date,
      datePicker,
      disabledDate,
      isPercy,
      addDays,
    }
  },
  template: `
    <div>
      <div class="max-w-xs">
        <sm-date-picker ref="datePicker" :min-date="disabledDate" label="Disabling days in the past" v-model="date" name="date1"></sm-date-picker>

        <sm-date-picker :max-date="disabledDate" label="Disabling days in the future" v-model="date" name="date2"></sm-date-picker>

        <sm-date-picker :disabled-dates="[{ repeat: { weekdays: [1, 7] } }]" label="Disabling weekends" v-model="date" name="date3"></sm-date-picker>

        <sm-date-picker :disabled-dates="[addDays(disabledDate, 2), addDays(disabledDate, 3)]" label="Disabling a specific days" v-model="date" name="date4"></sm-date-picker>

        <sm-date-picker :disabled-dates="[{ start: disabledDate, end: addDays(disabledDate, 5) }]" label="Disabling a date range" v-model="date" name="date5"></sm-date-picker>

        <sm-date-picker disabled label="Disabled" v-model="date" name="date6"></sm-date-picker>
      </div>
    </div>
  `,
})

DisablingDates.storyName = 'Disabling dates'

const disablingDatesDescription = `
In v-calendar@3, repeating dates used in <code>disabled-dates</code> prop is now wrapped in <code>repeat: { }</code>.

  See <a href="https://vcalendar.io/calendar/dates.html#repeating-dates">https://vcalendar.io/calendar/dates.html#repeating-dates</a>
  to learn more.
`

DisablingDates.parameters = {
  docs: {
    description: {
      story: disablingDatesDescription,
    },
  },
  percy: {
    // Needed for the Percy setup steps in onMounted hook to run
    // Take note of the defaults when upgrading Storybook or Percy in the future
    // https://docs.percy.io/docs/storybook#unexpected-diffs
    enableJavascript: true,
  },
}

export const CustomInput = () => ({
  components: { SmDatePicker },
  setup: () => {
    // For vue2
    // Pre-fill with static and past date during Percy visual testing
    // And hide some elements in the UI because the locale could change
    const initValue = isPercy ? new Date(2020, 11, 2) : null
    const date = ref(initValue)
    const date2 = ref(initValue)

    // Cover in Percy but don't advertise it too much
    // See https://v2.vcalendar.io/attributes.html
    const percyCustomAttributes = [
      {
        key: 'customDotAttributes',
        content: 'green',
        dot: 'green',
        dates: [new Date(2020, 11, 9), new Date(2020, 11, 10)],
      },
      {
        key: 'customBarAttributes',
        content: 'red',
        bar: 'red',
        dates: [new Date(2020, 11, 25), new Date(2020, 11, 26)],
      },
    ]
    const customAttributes = isPercy ? percyCustomAttributes : null

    // Cover in Percy but don't advertise it too much
    // See https://v2.vcalendar.io/attributes.html#highlights
    const percyCustomSelectAttribute = {
      key: 'customSelectAttribute',
      highlight: {
        fillMode: 'solid',
        // Style to apply to the highlight content element
        contentStyle: {
          fontStyle: 'italic',
        },
        // Style to apply to the highlight background element
        style: {
          border: '2px solid #ffab00',
        },
      },
    }
    const customSelectAttribute = isPercy ? percyCustomSelectAttribute : null

    onMounted(() => {
      // Open the date-picker when running in Percy
      // This is manually done here because we don't have a prop
      // that we can just set to true to display the hidden content
      if (isPercy) {
        document.getElementById('custom-trigger')?.click()
      }
    })

    return {
      customAttributes,
      customSelectAttribute,
      date,
      date2,
      isPercy,
    }
  },
  template: `
    <div>
      <div class="max-w-lg">
        <!-- 'L' mask is for locale -->
        <sm-date-picker v-model="date" :masks="{ input: 'L' }" name="date1">
          <template #target="{ inputValue, inputEvents }">
            <sm-input
              label="Custom input"
              v-model="inputValue"
              auto-complete="off"
              rules="required"
              name="custom-date-input"
              v-on="inputEvents"
            />
          </template>
        </sm-date-picker>
      </div>
      <code class="block percy-invisible">Selected date: {{ date }} </code>

      <br/><br/>

      <sm-date-picker
        v-model="date2"
        name="date2"
        :attributes="customAttributes"
        :select-attribute="customSelectAttribute"
      >
        <template #target="{ inputValue, togglePopover }">
          <sm-button id="custom-trigger" type="tertiary" prefix-icon="action-calendar" @click="togglePopover">
            Select date
          </sm-button>
        </template>
      </sm-date-picker>

      <code class="block mt-24 percy-invisible">Selected date: {{ date2 }} </code>
    </div>
  `,
})

CustomInput.storyName = 'Custom input'

CustomInput.parameters = {
  docs: {
    description: {
      story: 'Use the <code>target</code> slot to provide a custom input, button or other clickable element. <br> Update custom input slot bindings - <code>inputProps</code> prop has been deprecated. Instead, when you provide your own input slot, use <code>inputValue</code> and <code>inputEvents</code> slot prop.',
    },
  },
  percy: {
    // Needed for the Percy setup steps in onMounted hook to run
    // Take note of the defaults when upgrading Storybook or Percy in the future
    // https://docs.percy.io/docs/storybook#unexpected-diffs
    enableJavascript: true,
  },
}

export const Masks = () => ({
  components: { SmDatePicker },
  setup: () => {
    const date = ref(new Date())
    const masks = {
      input: 'DD MMM YYYY',
    }

    return {
      date,
      masks,
      isPercy,
    }
  },
  template: `
    <div>
      <div class="max-w-xs">
        <sm-date-picker :masks="masks" label="Single date" v-model="date" rules="required" name="date"></sm-date-picker>
      </div>

      <code>Selected date: {{ date }}</code>
    </div>
  `,
})

Masks.parameters = {
  docs: {
    description: {
      story: 'Masks are used to properly format and parse different sections of the calendar and date picker components.',
    },
  },
}

export const LocaleI18N = () => ({
  components: { SmDatePicker },
  setup: () => {
    const date = ref(new Date())
    const date2 = ref(new Date())

    return {
      date,
      date2,
      isPercy,
    }
  },
  template: `
    <div class="max-w-xs">
      <sm-date-picker
        v-model="date"
        label="Single date (de)"
        locale="de"
        name="date-de"
        rules="required"
      />

      <sm-date-picker
        v-model="date2"
        label="Single date (th-TH)"
        locale="th-TH"
        name="date-th"
        rules="required"
        :masks="{
          input: 'DD MMMM YYYY',
        }"
      />
    </div>
  `,
})

LocaleI18N.storyName = 'Locale:i18n'

LocaleI18N.parameters = {
  docs: {
    description: {
      story: 'Use props <code>locale</code> to simply provide string to generate the Internationalization API. <br> See https://vcalendar.io/i18n/locales.html#locales for more options',
    },
  },
}

export const Timezone = () => ({
  components: { SmDatePicker },
  setup: () => {
    const singleDate1 = ref(new Date())

    // Sample pool of timezones. This is not the definitive list of all timezones out there.
    // It's pulled from the data Platform Property consolidated when they
    // audited the timezones they are using
    const timezoneOptions = timezoneListFull.map(timezone => ({
      code: timezone,
      label: timezone,
    }))

    const selectedTimezone = ref()

    const handleDateChange = (state?: Date) => {
      console.info('Emitted date', state?.toISOString())
    }

    return {
      handleDateChange,
      singleDate1,
      selectedTimezone,
      timezoneOptions,
      isPercy,
    }
  },
  template: `
    <div style="max-width: 720px">

      <div class="grid grid-cols-1 small-desktop:grid-cols-2 gap-sm-24 mb-sm-48">
        <sm-select
          v-model="selectedTimezone"
          placeholder="Select timezone"
          label="Timezone"
          name="timezone"
          :options="timezoneOptions"
        >
          <template #label>
            <sm-tooltip
              placement="right"
              title="Sample pool of timezones for testing purposes"
              trigger="hover"
            >
              Timezone
              <sm-icon class="inline-block ml-4 text-grey-neu-dark" name="utility-information-alt" />
            </sm-tooltip>
          </template>
        </sm-select>

        <sm-date-picker
          v-model="singleDate1"
          label="Date"
          mode="dateTime"
          placeholder="Select date"
          name="date"
          :timezone="selectedTimezone"
          @update:modelValue="handleDateChange"
        />

        <code>Selected date: {{ singleDate1 }}</code>

      </div>

    </div>
  `,
})

const timezoneDescription = `
  By default, the timezone is based on the browser's local timezone.

  Use <code>timezone</code> prop to display calendar in the desired timezone. See https://vcalendar.io/i18n/timezones.html.
`

Timezone.parameters = {
  docs: {
    description: {
      story: timezoneDescription,
    },
  },
}

export const TimezoneModelConfig = () => ({
  components: { SmDatePicker },
  setup: () => {
    const singleDate1 = ref(1648684800000) // '2022-03-31T00:00:00.000Z'
    const singleDate2 = ref(1648684800000)
    const singleDate3 = ref(1648684800000)
    const japanDate = ref(1648684800000)
    const etcDate = ref(1648684800000)

    const dateRange1 = ref({
      start: 1648684800000, // '2022-03-31T00:00:00.000Z'
      end: 1649808000000, // '2022-04-13T00:00:00.000Z'
    })

    const dateRange2 = ref({
      start: 1648684800000,
      end: 1649808000000,
    })

    const dateRange3 = ref({
      start: 1648684800000,
      end: 1649808000000,
    })

    const japanDateRange = ref({
      start: 1648684800000,
      end: 1649808000000,
    })

    const etcDateRange = ref({
      start: 1648684800000,
      end: 1649808000000,
    })

    return {
      dateRange1,
      dateRange2,
      dateRange3,
      japanDateRange,
      etcDateRange,
      singleDate1,
      singleDate2,
      singleDate3,
      japanDate,
      etcDate,
      isPercy,
    }
  },
  template: `
    <div style="max-width: 720px">

      <div class="grid grid-cols-1 small-desktop:grid-cols-2 gap-sm-24 mb-sm-48">
        <div>
          <!--
            IMPORTANT: v-calendar@3 breaking change - https://vcalendar.io/getting-started/upgrade-guide.html#deprecate-modelconfig-prop
            From modelConfig to model-modifiers and masks
          -->
          <sm-date-picker
            v-model="singleDate1"
            label="US/Hawaii"
            timezone="US/Hawaii"
            :model-modifiers="{ number: true }"
            mode="dateTime"
            name="hawaii-date"
          />
          <code>
            v-model: {{ singleDate1 }}
          </code>
        </div>

        <div>
          <!--
            IMPORTANT: v-calendar@3 breaking change - https://vcalendar.io/getting-started/upgrade-guide.html#deprecate-modelconfig-prop
            From modelConfig to model-modifiers and masks
          -->
          <sm-date-picker
            v-model="dateRange1"
            label="US/Hawaii"
            timezone="US/Hawaii"
            :model-modifiers="{ number: true }"
            is-range
            name="hawaii-date-range"
          />
          <code>
            v-model: {{ dateRange1 }}
          </code>
        </div>
      </div>

      <div class="grid grid-cols-1 small-desktop:grid-cols-2 gap-sm-24 mb-sm-48">
        <div>
          <!--
            IMPORTANT: v-calendar@3 breaking change - https://vcalendar.io/getting-started/upgrade-guide.html#deprecate-modelconfig-prop
            From modelConfig to model-modifiers and masks
          -->
          <sm-date-picker
            v-model="singleDate2"
            label="America/New_York"
            timezone="America/New_York"
            mode="dateTime"
            :model-modifiers="{ number: true }"
            name="ny-date"
          />
          <code>
            v-model: {{ singleDate2 }}
          </code>
        </div>

        <div>
          <!--
            IMPORTANT: v-calendar@3 breaking change - https://vcalendar.io/getting-started/upgrade-guide.html#deprecate-modelconfig-prop
            From modelConfig to model-modifiers and masks
          -->
          <sm-date-picker
            v-model="dateRange2"
            label="America/New_York"
            timezone="America/New_York"
            is-range
            :model-modifiers="{ number: true }"
            name="ny-date-range"
          />
          <code>
            v-model: {{ dateRange2 }}
          </code>
        </div>
      </div>

      <div class="grid grid-cols-1 small-desktop:grid-cols-2 gap-sm-24 mb-sm-48">
        <div>
          <!--
            IMPORTANT: v-calendar@3 breaking change - https://vcalendar.io/getting-started/upgrade-guide.html#deprecate-modelconfig-prop
            From modelConfig to model-modifiers and masks
          -->
          <sm-date-picker
            v-model="singleDate3"
            label="Asia/Magadan"
            timezone="Asia/Magadan"
            :model-modifiers="{ number: true }"
            mode="dateTime"
            name="magadan-date"
          />
          <code>
            v-model: {{ singleDate3 }}
          </code>
        </div>

        <div>
          <!--
            IMPORTANT: v-calendar@3 breaking change - https://vcalendar.io/getting-started/upgrade-guide.html#deprecate-modelconfig-prop
            From modelConfig to model-modifiers and masks
          -->
          <sm-date-picker
            v-model="dateRange3"
            label="Asia/Magadan"
            timezone="Asia/Magadan"
            :model-modifiers="{ number: true }"
            is-range
            name="magadan-date-range"
          />
          <code>
            v-model: {{ dateRange3 }}
          </code>
        </div>
      </div>
      <div class="grid grid-cols-1 small-desktop:grid-cols-2 gap-sm-24 mb-sm-48">
        <div>
          <!--
            IMPORTANT: v-calendar@3 breaking change - https://vcalendar.io/getting-started/upgrade-guide.html#deprecate-modelconfig-prop
            From modelConfig to model-modifiers and masks
          -->
          <sm-date-picker
            v-model="japanDate"
            label="Japan"
            timezone="Japan"
            :model-modifiers="{ number: true }"
            mode="dateTime"
            name="jp-date"
          />
          <code>
            v-model: {{ japanDate }}
          </code>
        </div>

        <div>
          <!--
            IMPORTANT: v-calendar@3 breaking change - https://vcalendar.io/getting-started/upgrade-guide.html#deprecate-modelconfig-prop
            From modelConfig to model-modifiers and masks
          -->
          <sm-date-picker
            v-model="japanDateRange"
            label="Japan"
            timezone="Japan"
            :model-modifiers="{ number: true }"
            is-range
            name="jp-date-range"
          />
          <code>
            v-model: {{ japanDateRange }}
          </code>
        </div>
      </div>
      <div class="grid grid-cols-1 small-desktop:grid-cols-2 gap-sm-24 mb-sm-48">
        <div>
          <!--
            IMPORTANT: v-calendar@3 breaking change - https://vcalendar.io/getting-started/upgrade-guide.html#deprecate-modelconfig-prop
            From modelConfig to model-modifiers and masks
          -->
          <sm-date-picker
            v-model="etcDate"
            label="Etc/GMT+8"
            timezone="Etc/GMT+8"
            :model-modifiers="{ number: true }"
            mode="dateTime"
            name="etc-date"
          />
          <code>
            v-model: {{ etcDate }}
          </code>
        </div>

        <div>
          <!--
            IMPORTANT: v-calendar@3 breaking change - https://vcalendar.io/getting-started/upgrade-guide.html#deprecate-modelconfig-prop
            From modelConfig to model-modifiers and masks
          -->
          <sm-date-picker
            v-model="etcDateRange"
            label="Etc/GMT+8"
            timezone="Etc/GMT+8"
            :model-modifiers="{ number: true }"
            is-range
            name="etc-date-range"
          />
          <code>
            v-model: {{ etcDateRange }}
          </code>
        </div>
      </div>
    </div>
  `,
})

// We need to retain the original story name in vue2 for Percy visual testing
// and prevent it from looking like a missing story
// using `model config` is a misnomer since it's now deprecated
// but hopefully it's clear enough that when they see the story contents to use model modifiers
TimezoneModelConfig.storyName = 'Timezone & model config'

const TimezoneModelConfigDescription = `
  By default, the timezone is based on the browser's local timezone.

  If working with a specific format or type of data, use <code>model-modifiers</code>. Supported formats are:
  - string
  - number
  - Date object


  See for more details: https://vcalendar.io/datepicker/basics.html#model-modifiers and https://vcalendar.io/i18n/masks.html.


  Notes when using <code>model-modifiers="{ string: true }"</code>:
  - sm-date-picker will always use UTC internally as the timezone and ignore the timezone prop passed in. Downstream projects should pass in a valid date string without an offset or in UTC ISO8601 format (e.g. 2020-05-24 or 2020-05-24T00:00:00.000Z).
  - sm-date-picker will always return the date in ISO-8601 format (e.g. 2020-05-24T00:00:00.000Z). Downstream projects are responsible for formatting the string modelValue to their desired format.


  Use <code>timezone</code> prop to display calendar in the desired timezone. See https://vcalendar.io/i18n/timezones.html.
`
TimezoneModelConfig.parameters = {
  docs: {
    description: {
      story: TimezoneModelConfigDescription,
    },
  },
  // Not covered in Percy, but sync names if we decide to add coverage
}

// NOTE: we do not port over the css variables of popover contents of sm-date-picker in vue3
// we only allow styling of the input, label and error message
export const StylingHooks = () => ({
  template: `
    <div>
      <h3>Styling hooks</h3>

      <sm-help-card>
        <template #header>Does not require sui-themes package installation</template>
      </sm-help-card>

      <br>

      <p>Styling hooks will enable customization for your components. Styling hooks are constructed using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">CSS custom properties</a>.</p>

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
            <sm-table-th colspan="3">Input</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-border
              <br/>
              color-icon
              <br/>
              color-text
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-input-color-background
                --sm-c-input-color-border
                --sm-c-input-color-text

                --sm-c-input-color-background-disabled
                --sm-c-input-color-text-disabled
                --sm-c-input-color-border-disabled

                --sm-c-input-color-border-focus
                --sm-c-input-color-icon-focus

                --sm-c-input-color-border-invalid
                --sm-c-input-color-icon-invalid
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Prefix/Suffix slots</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-border
              <br/>
              color-text
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-input-prefix-slot-color-background
                --sm-c-input-prefix-slot-color-border
                --sm-c-input-prefix-slot-color-text

                --sm-c-input-suffix-slot-color-background
                --sm-c-input-suffix-slot-color-border
                --sm-c-input-suffix-slot-color-text
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Help text</sm-table-td>
            <sm-table-td>
              color-text
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-input-help-text-color-text
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
