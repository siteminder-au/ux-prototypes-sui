import { FieldValidationMetaInfo } from '@/app/libs/vee-validate/rules/types'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { required } from '@vee-validate/rules'
import flushPromises from 'flush-promises'
import { configure, defineRule } from 'vee-validate'
import { ref } from 'vue'
import SmButton from '../../sm-button/sm-button.vue'
import SmForm from '../sm-form/sm-form.vue'
import SmInput from '../sm-input/sm-input.vue'
import SmDatePicker from './sm-date-picker.vue'
import { timezoneListExcerpt, timezoneListFull } from './timezones-sample'

// Needed for v-calendar. Consider moving this to setupTests if it becomes common
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Set this to true if you need to test more time zones but by default
// we don't run this in CI/CD since it will likely run out of memory
const useFullTimezoneList = false

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const timeZonesToTest = useFullTimezoneList ? timezoneListFull : timezoneListExcerpt

describe('SmDatePicker', () => {

  // When jest.useFakeTimers() is used, we need to configure userEvent package
  // such that it is aware that fake timers are used.
  // this is after upgrading user-event package to v14+
  // see: https://github.com/testing-library/user-event/issues/833
  const userEventInstance = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

  // See: https://testing-library.com/docs/using-fake-timers/
  // Fake timers using Jest
  beforeEach(() => {
    // CURRENT DATE
    // Specify the current date so tests are deterministic, i.e month and year won't change over time
    // The picker initializes to the current month and year grid if there is no pre-selected date,
    // and we have tests that validate if the current date is marked correctly in local and provided
    // time zones so we have to fake today's date
    jest.useFakeTimers().setSystemTime(new Date('2020-05-15'))

    // TIMEZONE
    // Additionally, the timezone is standardized in Jest config level via `TZ=UTC jest` commands

    // LOCALE
    // And lastly the locales are specified in each test via `locale` prop of the date-picker component.
    // This is needed so strings that support localization like month names will be the same
    // regardless of the region/country where the test is executed.
    // E.g if I run the test locally while in Japan the asserted month names (May, June, etc.) will fail.
  })

  beforeAll(() => {
    defineRule('required', required)

    configure({
      generateMessage: (context: FieldValidationMetaInfo) => {
        const ruleName = context.rule?.name ?? ''

        return `This is a custom ${ruleName} field message`
      },
    })
  })

  // See: https://testing-library.com/docs/using-fake-timers/
  // Running all pending timers and switching to real timers using Jest
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should initialize the single date calendar without a pre-filled value', async () => {
    // ARRANGE
    const dayClickMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const inputMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date, dayClickMock, inputMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          label="Single date"
          placeholder="Select date"
          locale="en-US"
          name="date"
          @dayclick="dayClickMock"
          @update:modelValue="inputMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const inputField = screen.getByRole('textbox', { name: 'Single date' })
    await waitFor(() => expect(inputField).toHaveValue(''))
    expect(inputField).toBeVisible()
    expect(inputField).toBeEnabled()
    expect(screen.getByPlaceholderText('Select date')).toBeVisible()
    expect(dayClickMock).toHaveBeenCalledTimes(0)
    expect(inputMock).toHaveBeenCalledTimes(0)
    expect(screen.queryByText('May 2020')).not.toBeInTheDocument() // Date-picker is closed

    // Focus into the input field via click to open date-picker
    await userEventInstance.click(inputField)

    // Assert if date-picker is open and calendar is initialized to the mocked current date
    await waitFor(() => expect(screen.getByText('May 2020')).toBeVisible())

    // Pull-up month dropdown - v-calendar implementation doesn't associate appropriate role
    await userEventInstance.click(screen.getByText('May 2020'))
    // Pull-up year dropdown
    await userEventInstance.click(screen.getByRole('button', { name: '2020' }))
    // Update year
    await userEventInstance.click(screen.getByRole('button', { name: '2024' }))
    // Update month
    await userEventInstance.click(screen.getByRole('button', { name: /^February*/ }))
    // Update day
    await userEventInstance.click(screen.getByRole('button', { name: /Feb 9, 2024/ })) // For Vue3: month names are now short names

    // Date-picker should auto-close on single date selection
    await waitFor(() => expect(screen.queryByText('February 2024')).not.toBeInTheDocument())
    expect(inputField).toHaveValue('02/09/2024')
    expect(dayClickMock).toHaveBeenCalledTimes(1)
    expect(inputMock).toHaveBeenCalledWith(new Date('2024-02-09T00:00:00.000Z'))
  })

  it.each([
    new Date(2022, 8, 27), // Date type
    '2022-09-27', // String type
    1664236800000, // Number type - value representing the number of milliseconds since January 1, 1970, 00:00:00 UTC (the ECMAScript epoch, equivalent to the UNIX epoch).
  ])('should initialize the single date calendar with pre-filled value - %s', async (initialValue) => {
    // ARRANGE
    const dayClickMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const inputMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref(initialValue)

        return { date, dayClickMock, inputMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          label="Single date"
          placeholder="Select date"
          locale="en-US"
          name="date"
          @dayclick="dayClickMock"
          @update:modelValue="inputMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const inputField = screen.getByRole('textbox', { name: 'Single date' })
    await waitFor(() => expect(inputField).toHaveValue('09/27/2022'))
    expect(inputField).toBeVisible()
    expect(inputField).toBeEnabled()
    expect(screen.getByPlaceholderText('Select date')).toBeVisible()
    expect(dayClickMock).toHaveBeenCalledTimes(0)
    expect(inputMock).toHaveBeenCalledTimes(0)
    expect(screen.queryByText('September 2022')).not.toBeInTheDocument() // Date-picker is closed

    // Focus into the input field to open date-picker
    await userEventInstance.click(inputField)

    // Assert if date-picker is open and calendar is initialized to the pre-selected date
    await waitFor(() => expect(screen.getByText('September 2022')).toBeVisible())

    // Update selected date
    await userEventInstance.click(screen.getByRole('button', { name: /Sep 20, 2022/ })) // For Vue3: month names are now short names

    // Date-picker should auto-close on single date selection
    await waitFor(() => expect(screen.queryByText('September 2022')).not.toBeInTheDocument())
    expect(inputField).toHaveValue('09/20/2022')
    expect(dayClickMock).toHaveBeenCalledTimes(1)
    expect(inputMock).toHaveBeenCalledWith(new Date('2022-09-20T00:00:00.000Z'))
  })

  it('should initialize the date range calendar without a pre-filled value', async () => {
    // ARRANGE
    const dayClickMock = jest.fn()
    const endMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const startMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const inputMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date, dayClickMock, endMock, inputMock, startMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          label="Date range"
          start-date-placeholder="Start date"
          end-date-placeholder="End date"
          locale="en-US"
          name="date"
          is-range
          @dayclick="dayClickMock"
          @update:modelValue="inputMock"
          @end="endMock"
          @start="startMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const inputFields = screen.getAllByRole('textbox')
    await waitFor(() => expect(inputFields.at(0)).toHaveValue(''))
    expect(screen.getByPlaceholderText('Start date')).toBeVisible()
    expect(inputFields.at(0)).toBeVisible()
    expect(inputFields.at(0)).toBeEnabled()
    expect(screen.getByPlaceholderText('End date')).toBeVisible()
    expect(inputFields.at(1)).toHaveValue('')
    expect(inputFields.at(1)).toBeEnabled()
    expect(screen.getByText('Date range')).toBeVisible()
    expect(dayClickMock).toHaveBeenCalledTimes(0)
    expect(inputMock).toHaveBeenCalledTimes(0)
    expect(endMock).toHaveBeenCalledTimes(0)
    expect(startMock).toHaveBeenCalledTimes(0)
    expect(screen.queryByText('May 2020')).not.toBeInTheDocument() // Date-picker is closed

    // Focus into the input field to open date-picker
    await userEventInstance.tab()

    // Assert if date-picker is open and calendar is initialized to the mocked current date
    await waitFor(() => expect(screen.getByText('May 2020')).toBeVisible())

    // Select day of the month as start date
    await userEventInstance.click(screen.getByRole('button', { name: /May 1, 2020/ }))

    // Date-picker should not auto-close on start date selection
    await waitFor(() => expect(inputFields.at(0)).toHaveValue('05/01/2020'))
    expect(inputFields.at(1)).toHaveValue('05/01/2020')
    expect(dayClickMock).toHaveBeenCalledTimes(0) // Won't emit if in date range
    expect(endMock).toHaveBeenCalledTimes(0) // Won't emit until end date is selected
    expect(startMock).toHaveBeenCalledTimes(1)
    expect(inputMock).toHaveBeenCalledTimes(0) // Won't emit until range is valid

    // Select day of the month as end date
    await userEventInstance.click(screen.getByRole('button', { name: /May 24, 2020/ }))

    // Date-picker should auto-close on end date selection
    await waitFor(() => expect(screen.queryByText('May 2020')).not.toBeInTheDocument())
    expect(inputFields.at(0)).toHaveValue('05/01/2020')
    expect(inputFields.at(1)).toHaveValue('05/24/2020')
    expect(dayClickMock).toHaveBeenCalledTimes(0) // Won't emit if in date range
    expect(endMock).toHaveBeenCalledTimes(1)
    expect(startMock).toHaveBeenCalledTimes(1)
    expect(inputMock).toHaveBeenCalledTimes(1)
    expect(inputMock).toHaveBeenCalledWith({ end: new Date('2020-05-24T00:00:00.000Z'), start: new Date('2020-05-01T00:00:00.000Z') })
  })

  it.each([
    { start: new Date('2022-03-31'), end: new Date('2022-04-13') }, // Date type
    { end: '2022-03-31', start: '2022-04-13' }, // String type - reverse the dates which should auto-correct
    { start: 1648684800000, end: 1649808000000 }, // Number type
  ])('should initialize the date range calendar with pre-filled value - %s', async (initialValue) => {
    // ARRANGE
    const endMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const startMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const inputMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref(initialValue)

        return { date, endMock, inputMock, startMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          label="Date range"
          start-date-placeholder="Start date"
          end-date-placeholder="End date"
          locale="en-US"
          name="date"
          is-range
          @update:modelValue="inputMock"
          @end="endMock"
          @start="startMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const inputFields = screen.getAllByRole('textbox')
    await waitFor(() => expect(inputFields.at(0)).toHaveValue('03/31/2022'))
    expect(screen.getByPlaceholderText('Start date')).toBeVisible()
    expect(inputFields.at(0)).toBeVisible()
    expect(inputFields.at(0)).toBeEnabled()
    expect(screen.getByPlaceholderText('End date')).toBeVisible()
    expect(inputFields.at(1)).toHaveValue('04/13/2022')
    expect(inputFields.at(1)).toBeEnabled()
    expect(screen.getByText('Date range')).toBeVisible()
    expect(inputMock).toHaveBeenCalledTimes(0)
    expect(endMock).toHaveBeenCalledTimes(0)
    expect(startMock).toHaveBeenCalledTimes(0)
    expect(screen.queryByText('March 2022')).not.toBeInTheDocument() // Date-picker is closed

    // Focus into the input field to open date-picker
    await userEventInstance.tab()

    // Assert if date-picker is open and calendar is initialized to the mocked current date
    await waitFor(() => expect(screen.getByText('March 2022')).toBeVisible())

    // Select day of the month as start date
    await userEventInstance.click(screen.getByRole('button', { name: /Mar 24, 2022/ })) // For Vue3: month names are now short names

    // Date-picker should not auto-close on start date selection
    await waitFor(() => expect(inputFields.at(0)).toHaveValue('03/24/2022'))
    expect(inputFields.at(1)).toHaveValue('03/24/2022')
    expect(endMock).toHaveBeenCalledTimes(0)
    expect(startMock).toHaveBeenCalledTimes(1)
    expect(inputMock).toHaveBeenCalledTimes(0) // Won't emit until range is valid

    // Select day of the month as start date - reverse order selection should auto-correct
    await userEventInstance.click(screen.getByRole('button', { name: /Mar 5, 2022/ })) // For Vue3: month names are now short names

    // Date-picker should auto-close on end date selection
    await waitFor(() => expect(screen.queryByText('March 2022')).not.toBeInTheDocument())
    expect(inputFields.at(0)).toHaveValue('03/05/2022')
    expect(inputFields.at(1)).toHaveValue('03/24/2022')
    expect(endMock).toHaveBeenCalledTimes(0)
    expect(startMock).toHaveBeenCalledTimes(2) // Auto-correcting order
    expect(inputMock).toHaveBeenCalledTimes(1)
    expect(inputMock).toHaveBeenCalledWith({ end: new Date('2022-03-24T00:00:00.000Z'), start: new Date('2022-03-05T00:00:00.000Z') })
  })

  it('should format the date-picker using the provided locale prop', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref(new Date(2022, 11, 27))

        return { date }
      },
      template: `
        <sm-date-picker
          v-model="date"
          label="Single date"
          name="date"
          placeholder="Select date"
          locale="de-DE"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const inputField = screen.getByRole('textbox', { name: 'Single date' })
    await waitFor(() => expect(inputField).toHaveValue('27.12.2022'))

    // Focus into the input field to open date-picker
    await userEventInstance.click(inputField)

    // Assert if date-picker is open and calendar is localized
    await waitFor(() => expect(screen.getByText('Dezember 2022')).toBeVisible())
  })

  it('should format the input field if mask is prop is configured', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref(new Date()) // Current date is faked in the beforeEach block above

        return { date }
      },
      template: `
        <sm-date-picker
          v-model="date"
          label="Single date"
          locale="en-US"
          name="date"
          :masks="{ input: 'DD MMMM YYYY' }"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Single date' })).toHaveValue('15 May 2020'))
  })

  it('should display the time-picker only when mode prop is time', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        // For Vue2
        // const date = ref()
        // For Vue3: See upstream issue https://github.com/nathanreyes/v-calendar/issues/1316
        const date = ref(new Date())

        return { date }
      },
      template: `
        <sm-date-picker
          v-model="date"
          label="Time"
          locale="en-US"
          mode="time"
          name="date"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Open date-picker
    const inputField = screen.getByRole('textbox', { name: 'Time' })
    await userEventInstance.click(inputField)

    // Select time
    const selectBoxes = screen.getAllByRole('combobox') // v-calendar implementation doesn't attach discernible names
    // For Vue2
    // await userEventInstance.selectOptions(selectBoxes[0], '15') // 24-hour format
    // For Vue3: v-calendar implementation changes, looks like option values are now following the display
    // Before the values mapped are always 24 hours even though it's only displaying 12
    await userEventInstance.selectOptions(selectBoxes[0], '3') // 24-hour format
    await userEventInstance.selectOptions(selectBoxes[1], '45') // Available in default increments (1)
    // For Vue2
    // await userEventInstance.click(screen.getByRole('button', { name: 'PM' }))
    // For Vue3: v-calendar has implementation changes (from button to select)
    await userEventInstance.selectOptions(selectBoxes[2], 'PM')

    // ASSERT
    await waitFor(() => expect(inputField).toHaveValue('3:45 PM'))
    expect(selectBoxes.at(0)).toBeVisible() // Doesn't auto-close
    expect(screen.queryByText('May 2020')).not.toBeInTheDocument() // Date-picker elements are not available
  })

  it('should display the time-picker with date label when mode prop is time', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        // For Vue2
        // const date = ref()
        // For Vue3: See upstream issue https://github.com/nathanreyes/v-calendar/issues/1316
        const date = ref(new Date())

        return { date }
      },
      template: `
        <sm-date-picker
          v-model="date"
          label="Time"
          locale="en-US"
          mode="time"
          name="date"
          :hide-date-in-time-picker="false"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Open date-picker
    const inputField = screen.getByRole('textbox', { name: 'Time' })
    await userEventInstance.click(inputField)

    // ASSERT
    // For Vue2
    // await waitFor(() => expect(inputField).toHaveValue('12:00 AM'))
    // For Vue3: See upstream issue https://github.com/nathanreyes/v-calendar/issues/1316
    await waitFor(() => expect(inputField).toHaveValue('12:00 AM'))
    expect(screen.getByText(/May/)).toBeVisible() // Current date label is available
    expect(screen.queryByText('May 2020')).not.toBeInTheDocument() // Date-picker elements are not available
  })

  it('should display both date and time pickers when mode prop is dateTime', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        // Will auto-correct based on specified minutes Jan 24, 2035 4:30 AM
        const date = ref(new Date(2035, 0, 24, 4, 29))

        return { date }
      },
      template: `
        <!--
          IMPORTANT: v-calendar@3 breaking change - minute-increment is now part of time-rules prop
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          label="Date and time"
          locale="en-US"
          mode="dateTime"
          name="date"
          :time-rules="{
            minutes: { interval: 10 },
          }"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const inputField = screen.getByRole('textbox', { name: 'Date and time' })
    await waitFor(() => expect(inputField).toHaveValue('01/24/2035 4:30 AM'))

    // Open date-picker
    await userEventInstance.click(inputField)
    // For Vue2
    // await userEventInstance.click(screen.getByRole('button', { name: 'PM' }))
    // For Vue3: v-calendar has implementation changes (from button to select)
    await userEventInstance.selectOptions(screen.getAllByRole('combobox')[2], 'PM')

    // Assert new value
    await waitFor(() => expect(inputField).toHaveValue('01/24/2035 4:30 PM'))
    expect(screen.queryByRole('option', { name: '51' })).not.toBeInTheDocument() // 51 minute not available in 10 increments
    expect(screen.getByText('January 2035')).toBeVisible() // Calendar elements are available and date-picker doesn't auto-close
  })

  it('should display the helpText is prop is provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date }
      },
      template: `
        <sm-date-picker
          v-model="date"
          help-text="Help text"
          label="Single date"
          locale="en-US"
          name="date"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Help text')).toBeVisible())
  })

  it('should disable the input field if disabled prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date }
      },
      template: `
        <sm-date-picker
          v-model="date"
          label="Single date"
          locale="en-US"
          name="date"
          :disabled="true"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const inputField = screen.getByRole('textbox', { name: 'Single date' })
    await waitFor(() => expect(inputField).toBeDisabled())

    // Focus into the input field to open date-picker
    await userEventInstance.click(inputField)

    // Assert if date-picker is closed
    expect(screen.queryByText('May 2020')).not.toBeInTheDocument()
  })

  it('should disable the input field if a parent sm-form form is disabled', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmDatePicker, SmForm },
      setup: () => {
        const date = ref()

        return { date }
      },
      template: `
        <sm-form :disabled="true">
          <sm-date-picker
            v-model="date"
            label="Date range"
            locale="en-US"
            name="date"
            :model-modifiers="{ range: true }"
          />
        </sm-form>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const inputFields = screen.getAllByRole('textbox')
    await waitFor(() => expect(inputFields.at(0)).toBeDisabled()) // start
    expect(inputFields.at(1)).toBeDisabled() // end

    // Focus into the start input field to open date-picker
    await userEventInstance.click(inputFields[0])

    // Assert if date-picker is closed
    expect(screen.queryByText('May 2020')).not.toBeInTheDocument()

    // Focus into the end input field to open date-picker
    await userEventInstance.click(inputFields[1])

    // Assert if date-picker is closed
    expect(screen.queryByText('May 2020')).not.toBeInTheDocument()
  })

  it('should disable dates before minDate when prop is provided', async () => {
    // ARRANGE
    const inputMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref(new Date(2023, 6, 10))

        return { date, inputMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          label="Single date"
          locale="en-US"
          name="date"
          :min-date="date"
          @update:modelValue="inputMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Open and select disabled dates
    const inputField = screen.getByRole('textbox', { name: 'Single date' })
    await userEventInstance.click(inputField)
    await userEventInstance.click(screen.getByRole('button', { name: /Jul 1, 2023/ })) // For Vue3: month names are now short names
    await userEventInstance.click(screen.getByRole('button', { name: /Jul 5, 2023/ })) // For Vue3: month names are now short names
    await userEventInstance.click(screen.getByRole('button', { name: /Jul 9, 2023/ })) // For Vue3: month names are now short names

    // ASSERT
    await waitFor(() => expect(inputField).toHaveValue('07/10/2023'))
    expect(inputMock).toHaveBeenCalledTimes(0)

    // Select date after min date
    await userEventInstance.click(screen.getByRole('button', { name: /Jul 15, 2023/ })) // For Vue3: month names are now short names

    await waitFor(() => expect(inputField).toHaveValue('07/15/2023'))
    expect(inputMock).toHaveBeenCalledWith(new Date('2023-07-15T00:00:00.000Z'))
    expect(inputMock).toHaveBeenCalledTimes(1)
  })

  it('should disable dates after maxDate when prop is provided', async () => {
    // ARRANGE
    const inputMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref(new Date(2023, 11, 10))

        return { date, inputMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          label="Single date"
          locale="en-US"
          name="date"
          :max-date="date"
          @update:modelValue="inputMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Open and select disabled dates
    const inputField = screen.getByRole('textbox', { name: 'Single date' })
    await userEventInstance.click(inputField)
    await userEventInstance.click(screen.getByRole('button', { name: /Dec 11, 2023/ })) // For Vue3: month names are now short names
    await userEventInstance.click(screen.getByRole('button', { name: /Dec 15, 2023/ })) // For Vue3: month names are now short names
    await userEventInstance.click(screen.getByRole('button', { name: /Dec 29, 2023/ })) // For Vue3: month names are now short names

    // ASSERT
    await waitFor(() => expect(inputField).toHaveValue('12/10/2023'))
    expect(inputMock).toHaveBeenCalledTimes(0)

    // Select date before max date
    await userEventInstance.click(screen.getByRole('button', { name: /Dec 9, 2023/ })) // For Vue3: month names are now short names

    await waitFor(() => expect(inputField).toHaveValue('12/09/2023'))
    expect(inputMock).toHaveBeenCalledWith(new Date('2023-12-09T00:00:00.000Z'))
    expect(inputMock).toHaveBeenCalledTimes(1)
  })

  // See https://v2.vcalendar.io/api/v1.0/calendar.html#disabled-dates
  it('should disable dates specified in the disabledDates prop - pattern tokens', async () => {
    // ARRANGE
    const inputMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref(new Date('11/25/1998'))
        const disabledDates = ref([
          {
            repeat: { weekdays: [1, 7] },
          },
        ])

        return { date, disabledDates, inputMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"

          IMPORTANT: v-calendar@3 breaking change - https://vcalendar.io/datepicker/basics.html#disable-dates
          Need to wrap it in { repeat: { ... } } now
        -->
        <sm-date-picker
          v-model="date"
          label="Single date"
          locale="en-US"
          name="date"
          :disabled-dates="disabledDates"
          @update:modelValue="inputMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Open and select disabled dates
    const inputField = screen.getByRole('textbox', { name: 'Single date' })
    await userEventInstance.click(inputField)
    // Saturdays and Sundays are disabled - weekdays: [1, 7]
    await userEventInstance.click(screen.getByRole('button', { name: /Nov 1, 1998/ })) // For Vue3: month names are now short names
    await userEventInstance.click(screen.getByRole('button', { name: /Nov 7, 1998/ })) // For Vue3: month names are now short names
    await userEventInstance.click(screen.getByRole('button', { name: /Nov 8, 1998/ })) // For Vue3: month names are now short names
    await userEventInstance.click(screen.getByRole('button', { name: /Nov 29, 1998/ })) // For Vue3: month names are now short names

    // ASSERT
    await waitFor(() => expect(inputField).toHaveValue('11/25/1998'))
    expect(inputMock).toHaveBeenCalledTimes(0)

    // Select date not in the disabled config
    await userEventInstance.click(screen.getByRole('button', { name: /Nov 19, 1998/ })) // For Vue3: month names are now short names

    await waitFor(() => expect(inputField).toHaveValue('11/19/1998'))
    expect(inputMock).toHaveBeenCalledWith(new Date('1998-11-19T00:00:00.000Z'))
    expect(inputMock).toHaveBeenCalledTimes(1)
  })

  // See https://v2.vcalendar.io/api/v1.0/calendar.html#disabled-dates
  it('should disable dates specified in the disabledDates prop - range and specific dates', async () => {
    // ARRANGE
    const inputMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref(new Date('2023-07-07'))

        return { date, inputMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          label="Single date"
          locale="en-US"
          name="date"
          :disabled-dates="[
            { start: new Date('2023-07-10'), end: new Date('2023-07-12') },
            new Date('2023-07-19'),
            new Date('2023-07-20'),
          ]"
          @update:modelValue="inputMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Open and select disabled dates
    const inputField = screen.getByRole('textbox', { name: 'Single date' })
    await userEventInstance.click(inputField)
    // Specified start and end range object
    await userEventInstance.click(screen.getByRole('button', { name: /Jul 10, 2023/ })) // For Vue3: month names are now short names
    await userEventInstance.click(screen.getByRole('button', { name: /Jul 11, 2023/ })) // For Vue3: month names are now short names
    await userEventInstance.click(screen.getByRole('button', { name: /Jul 12, 2023/ })) // For Vue3: month names are now short names
    // Specific dates
    await userEventInstance.click(screen.getByRole('button', { name: /Jul 19, 2023/ })) // For Vue3: month names are now short names
    await userEventInstance.click(screen.getByRole('button', { name: /Jul 20, 2023/ })) // For Vue3: month names are now short names

    // ASSERT
    await waitFor(() => expect(inputField).toHaveValue('07/07/2023'))
    expect(inputMock).toHaveBeenCalledTimes(0)

    // Select date not in the disabled config
    await userEventInstance.click(screen.getByRole('button', { name: /Jul 14, 2023/ })) // For Vue3: month names are now short names

    await waitFor(() => expect(inputField).toHaveValue('07/14/2023'))
    expect(inputMock).toHaveBeenCalledWith(new Date('2023-07-14T00:00:00.000Z'))
    expect(inputMock).toHaveBeenCalledTimes(1)
  })

  // See https://v2.vcalendar.io/api/v1.0/calendar.html#available-dates
  // Deprecated in v-calendar@3: https://github.com/nathanreyes/v-calendar/issues/1286
  // it('should disable dates not specified in availableDates prop', async () => {
  //   // ARRANGE
  //   const inputMock = jest.fn()

  //   const ParentComponent = {
  //     components: { SmDatePicker },
  //     setup: () => {
  //       const date = ref(new Date('2023-07-10'))

  //       return { date, inputMock }
  //     },
  //     template: `
  //       <!--
  //         IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
  //         From @input="inputMock" to @update:modelValue="inputMock"
  //       -->
  //       <sm-date-picker
  //         v-model="date"
  //         label="Single date"
  //         locale="en-US"
  //         name="date"
  //         :available-dates="[
  //           { start: new Date('2023-07-10'), end: new Date('2023-07-12') },
  //           new Date('2023-07-19'),
  //           new Date('2023-07-20'),
  //         ]"
  //         @update:modelValue="inputMock"
  //       />
  //     `,
  //   }

  //   // ACT
  //   render(ParentComponent)

  //   // Open and select disabled dates
  //   const inputField = screen.getByRole('textbox', { name: 'Single date' })
  //   await userEventInstance.click(inputField)
  //   // Anything not in the specified dates are disabled
  //   await userEventInstance.click(screen.getByRole('button', { name: /Jul 3, 2023/ })) // For Vue3: month names are now short names
  //   await userEventInstance.click(screen.getByRole('button', { name: /Jul 17, 2023/ })) // For Vue3: month names are now short names
  //   await userEventInstance.click(screen.getByRole('button', { name: /Jul 28, 2023/ })) // For Vue3: month names are now short names

  //   // ASSERT
  //   await waitFor(() => expect(inputField).toHaveValue('07/10/2023'))
  //   expect(inputMock).toHaveBeenCalledTimes(0)

  //   // Select date in the available dates config
  //   await userEventInstance.click(screen.getByRole('button', { name: /Jul 11, 2023/ })) // For Vue3: month names are now short names

  //   await waitFor(() => expect(inputField).toHaveValue('07/11/2023'))
  //   expect(inputMock).toHaveBeenCalledWith(new Date('2023-07-11T00:00:00.000Z'))
  //   expect(inputMock).toHaveBeenCalledTimes(1)
  // })

  it('should show the range date-picker when either of the input fields is interacted', async () => {
    // ARRANGE
    const focusMock = jest.fn()
    const blurMock = jest.fn()

    // Adding `columns` and `rows` props for availability check but we can't test it since
    // it depends on the viewport width. I.e it falls back to 1 when running in this test context
    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date, focusMock, blurMock }
      },
      template: `
        <sm-date-picker
          v-model="date"
          label="Date range"
          start-date-placeholder="Start date"
          end-date-placeholder="End date"
          locale="en-US"
          name="date"
          is-range
          :columns="2"
          :rows="2"
          @blur="blurMock"
          @focus="focusMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.queryByText('May 2020')).not.toBeInTheDocument())
    expect(focusMock).toHaveBeenCalledTimes(0)
    expect(blurMock).toHaveBeenCalledTimes(0)

    // Open date-picker
    await userEventInstance.click(screen.getByPlaceholderText('End date'))

    // Assert opened state
    await waitFor(() => expect(screen.getByText('May 2020')).toBeVisible())
    expect(focusMock).toHaveBeenCalledTimes(1)
    expect(blurMock).toHaveBeenCalledTimes(0)

    // Change focus to start date
    await userEventInstance.click(screen.getByPlaceholderText('Start date'))

    // Date-picker should still be opened
    await waitFor(() => expect(screen.getByText('May 2020')).toBeVisible())
    expect(focusMock).toHaveBeenCalledTimes(2) // Start range gets focus
    expect(blurMock).toHaveBeenCalledTimes(1) // End range is blurred

    // Tab to focus on the end input again
    await userEventInstance.tab()

    // Date-picker should still be opened
    await waitFor(() => expect(screen.getByText('May 2020')).toBeVisible())
    expect(focusMock).toHaveBeenCalledTimes(3) // End range gets focus
    expect(blurMock).toHaveBeenCalledTimes(2) // Start range is blurred
  })

  it('should mark current date in default/local timezone', async () => {
    // ARRANGE
    const dayClickMock = jest.fn().mockImplementation(({ isToday }) => expect(isToday).toBe(true))
    const inputMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date, dayClickMock, inputMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          label="Single date"
          locale="en-US"
          placeholder="Select date"
          name="date"
          @dayclick="dayClickMock"
          @update:modelValue="inputMock"
        />
      `,
    }

    // ACT
    const { container } = render(ParentComponent)

    // Focus into the input field to open date-picker
    const inputField = screen.getByRole('textbox', { name: 'Single date' })
    await userEventInstance.click(inputField)

    // ASSERT
    await waitFor(() => expect(screen.getByText('May 2020')).toBeVisible())
    // Not ideal to grab elements by class name, but in this case we want to check if things will be styled correctly
    // since we can't cover current date indicator in Percy yet since it changes every day
    // For Vue2
    // expect(container.getElementsByClassName('is-today').length).toBe(1)
    // expect(container.getElementsByClassName('is-today-timezone').length).toBe(0)
    // For Vue3: The v-calendar and our own custom class selector has been refactored
    expect(container.getElementsByClassName('sm-date-picker--current-date').length).toBe(1)

    // Select current date
    await userEventInstance.click(screen.getByRole('button', { name: /May 15, 2020/ }))

    // Date-picker should auto-close on single date selection
    await waitFor(() => expect(screen.queryByText('May 2020')).not.toBeInTheDocument())
    // The input field should match the clicked date
    expect(inputField).toHaveValue('05/15/2020')
    // But the v-model is in local time which is UTC via jest config
    expect(inputMock).toHaveBeenCalledWith(new Date('2020-05-15T00:00:00.000Z'))
    expect(dayClickMock).toHaveBeenCalledTimes(1)
  })

  // Test a wide array of time zones since this is a critical feature of the component
  it.each(timeZonesToTest)('should mark current date in timezone - %s', async (timezone) => {
    // ARRANGE
    const dayClickMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const inputMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date, timezone, dayClickMock, inputMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          label="Single date"
          locale="en-US"
          placeholder="Select date"
          name="date"
          :timezone="timezone"
          @dayclick="dayClickMock"
          @update:modelValue="inputMock"
        />
      `,
    }

    // ACT
    const { container } = render(ParentComponent)

    // Focus into the input field to open date-picker
    const inputField = screen.getByRole('textbox', { name: 'Single date' })
    await userEventInstance.click(inputField)

    // ASSERT
    await waitFor(() => expect(screen.getByText('May 2020')).toBeVisible())
    // Not ideal to grab elements by class name, but in this case we want to check if things will be styled correctly
    // since we can't cover current date indicator in Percy yet since it changes every day
    // For Vue2
    // expect(container.getElementsByClassName('is-today').length).toBe(1) // In local timezone but hidden from view
    // expect(container.getElementsByClassName('is-today-timezone').length).toBe(1) // In specified timezone
    // For Vue3: The v-calendar and our own custom class selector has been refactored
    expect(container.getElementsByClassName('sm-date-picker--current-date').length).toBe(1)

    // Select date with the current date indicator in specified timezone
    const todayLabelInTimezone = new Date('2020-05-15') // Faked today's date
      .toLocaleDateString('en-US', {
        timeZone: timezone,
        // Configure to match button's aria-label: e.g "Thursday, May 15, 2020"
        weekday: 'long',
        year: 'numeric',
        month: 'short', // For Vue3: month names are now short names
        day: 'numeric',
      })

    // Not ideal to grab elements by class name, but in this case we want to check if things will be styled correctly
    // since we can't cover current date indicator in Percy yet since it changes every day
    // For Vue2
    // const todayLabelOfClass = container.getElementsByClassName('is-today-timezone')[0].getAttribute('aria-label') ?? 'not-found'
    // For Vue3: The v-calendar and our own custom class selector has been refactored
    const todayLabelOfClass = container.getElementsByClassName('sm-date-picker--current-date-content')[0].getAttribute('aria-label') ?? 'not-found'
    expect(todayLabelOfClass).toBe(todayLabelInTimezone)

    await userEventInstance.click(screen.getByRole('button', { name: todayLabelInTimezone }))

    // Date-picker should auto-close on single date selection
    await waitFor(() => expect(screen.queryByText('May 2020')).not.toBeInTheDocument())

    const expectedDateInTimezone = new Date('2020-05-15') // Faked today's date
      .toLocaleDateString('en-US', {
        timeZone: timezone,
        // Configure to match the input field's format: e.g "05/15/2020"
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })

    // The input field should match the clicked date
    expect(inputField).toHaveValue(expectedDateInTimezone)
    // But the v-model is in local time which is UTC via jest config
    expect(inputMock).toHaveBeenCalledWith(new Date('2020-05-15T00:00:00.000Z'))
    expect(dayClickMock).toHaveBeenCalledTimes(1)
  })

  it('should not mark current date in timezone if showCurrentDate prop is false', async () => {
    // ARRANGE
    const dayClickMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const inputMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date, dayClickMock, inputMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          label="Single date"
          locale="en-US"
          name="date"
          placeholder="Select date"
          timezone="Asia/Tokyo"
          :show-current-date="false"
          @dayclick="dayClickMock"
          @update:modelValue="inputMock"
        />
      `,
    }

    // ACT
    const { container } = render(ParentComponent)

    // Focus into the input field to open date-picker
    const inputField = screen.getByRole('textbox', { name: 'Single date' })
    await userEventInstance.click(inputField)

    // ASSERT
    await waitFor(() => expect(screen.getByText('May 2020')).toBeVisible())
    // Assert class here since we can't cover current date indicator in Percy yet since it changes every day
    // For Vue2
    // expect(container.getElementsByClassName('is-today').length).toBe(1) // In local timezone but hidden from view
    // expect(container.getElementsByClassName('is-today-timezone').length).toBe(0) // In specified timezone, but not added
    // For Vue3
    expect(container.getElementsByClassName('sm-date-picker--current-date').length).toBe(0)
  })

  // modelConfig in Vue2
  it.each([
    ['number', 1590278400000], // Number type
    ['string', '2020-05-24T00:00:00.000Z'], // String type
    ['date', new Date('2020-05-24T00:00:00.000Z')], // Date type
  ])('should format the value based on the modelModifiers prop - %s', async (type, modelValue) => {
    // ARRANGE
    const dayClickMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const inputMock = jest.fn()
    const modelModifiers: Record<string, unknown> = {
      number: { number: true },
      string: { string: true },
      date: { string: false },
    }

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()
        const modelModifier = modelModifiers[type]

        return { date, dayClickMock, inputMock, modelModifier }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"

          IMPORTANT: v-calendar@3 breaking change - https://vcalendar.io/getting-started/upgrade-guide.html#deprecate-modelconfig-prop
          From modelConfig to model-modifiers and masks
        -->
        <sm-date-picker
          v-model="date"
          label="Single date"
          locale="en-US"
          name="date"
          placeholder="Select date"
          :model-modifiers="modelModifier"
          :masks="{ modelValue: 'YYYY MMM DD' }"
          @dayclick="dayClickMock"
          @update:modelValue="inputMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Focus into the input field to open date-picker
    const inputField = screen.getByRole('textbox', { name: 'Single date' })
    await userEventInstance.click(inputField)
    await userEventInstance.click(screen.getByRole('button', { name: /May 24, 2020/ }))

    // ASSERT
    // Displayed text remains the same and this can be formatted via masks prop
    await waitFor(() => expect(inputField).toHaveValue('05/24/2020'))
    // But the model should now be formatted rather than default date object
    expect(inputMock).toHaveBeenCalledWith(modelValue)
    expect(dayClickMock).toHaveBeenCalledTimes(1)
  })

  // modelConfig in Vue2
  it('should select current date in default/local timezone and modelModifiers - rolling dates', async () => {
    // ARRANGE
    // The today's date will now change overtime
    jest.useRealTimers()
    // Get today's date then freeze it because we want to check the date-picker value after click later on
    // If we don't, the value will differ by seconds
    const today = new Date()
    jest.useFakeTimers().setSystemTime(today)

    // Configure to match button's aria-label: e.g "Thursday, Aug 15, 2020"
    const todayLabel = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short', // For Vue3: month names are now short names
      day: 'numeric',
    })

    // Configure to match the input field's format: e.g "05/15/2020"
    const expectedDateFormat = today.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

    const dayClickMock = jest.fn().mockImplementation(({ isToday }) => expect(isToday).toBe(true))
    const inputMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date, dayClickMock, inputMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"

          IMPORTANT: v-calendar@3 breaking change - https://vcalendar.io/getting-started/upgrade-guide.html#deprecate-modelconfig-prop
          From modelConfig to model-modifiers and masks
        -->
        <sm-date-picker
          v-model="date"
          label="Single date"
          locale="en-US"
          name="date"
          placeholder="Select date"
          :model-modifiers="{ string: true }"
          :masks="{ modelValue: 'WWWW, MMMM D, YYYY' }"
          @dayclick="dayClickMock"
          @update:modelValue="inputMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Focus into the input field to open date-picker
    const inputField = screen.getByRole('textbox', { name: 'Single date' })
    await userEventInstance.click(inputField)

    // Select current date
    await userEventInstance.click(screen.getByRole('button', { name: todayLabel }))

    // ASSERT
    // Date-picker should auto-close on single date selection
    await waitFor(() => expect(inputField).toHaveValue(expectedDateFormat)) // The input field should match the clicked date
    // But the v-model is in local time which is UTC via jest config
    expect(inputMock).toHaveBeenCalledWith(expect.stringMatching(new RegExp(`${today.toISOString().split('T')[0]}+`)))
    expect(dayClickMock).toHaveBeenCalledTimes(1)
  })

  // modelConfig in Vue2
  it('should select current date in given timezone and modelModifiers - rolling dates', async () => {
    // ARRANGE
    // The today's date will now change overtime
    jest.useRealTimers()
    // Get today's date then freeze it because we want to check the date-picker value after click later on
    // If we don't, the value will differ by seconds
    const today = new Date()

    jest.useFakeTimers().setSystemTime(today)
    const timezone = 'America/Los_Angeles'

    // Configure to match button's aria-label: e.g "Thursday, Aug 15, 2020"
    const todayLabel = today.toLocaleDateString('en-US', {
      timeZone: 'UTC', // we ignore timezone passed in
      weekday: 'long',
      year: 'numeric',
      month: 'short', // For Vue3: month names are now short names
      day: 'numeric',
    })

    // Configure to match the input field's format: e.g "05/15/2020"
    const expectedDateFormat = today.toLocaleDateString('en-US', {
      timeZone: 'UTC', // we ignore timezone passed in
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

    const dayClickMock = jest.fn()
    const inputMock = jest.fn()
    const endMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const startMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date, timezone, dayClickMock, inputMock, endMock, startMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"

          IMPORTANT: v-calendar@3 breaking change - https://vcalendar.io/getting-started/upgrade-guide.html#deprecate-modelconfig-prop
          From modelConfig to model-modifiers and masks

          Also switching :is-range="true" to model-modifiers="{ range: true }" to cover new API too
        -->
        <sm-date-picker
          v-model="date"
          label="Date range"
          locale="en-US"
          name="date"
          placeholder="Select date"
          :timezone="timezone"
          :model-modifiers="{ string: true, range: true }"
          :masks="{ modelValue: 'WWWW, MMMM D, YYYY' }"
          @dayclick="dayClickMock"
          @update:modelValue="inputMock"
          @end="endMock"
          @start="startMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Focus into the input field to open date-picker
    const inputFields = screen.getAllByRole('textbox')
    await userEventInstance.click(inputFields[0])

    // Select current date
    await userEventInstance.click(screen.getByRole('button', { name: todayLabel })) // Start date
    await userEventInstance.click(screen.getByRole('button', { name: todayLabel })) // End date

    // ASSERT
    await waitFor(() => expect(inputFields.at(0)).toHaveValue(expectedDateFormat)) // The input field should match the clicked date
    expect(inputFields.at(1)).toHaveValue(expectedDateFormat)
    // But the v-model is in local time which is UTC via jest config
    expect(inputMock).toHaveBeenCalledWith(expect.objectContaining({
      start: expect.stringMatching(new RegExp(`${today.toISOString().split('T')[0]}+`)),
      end: expect.stringMatching(new RegExp(`${today.toISOString().split('T')[0]}+`)),
    }))
    expect(dayClickMock).toHaveBeenCalledTimes(0) // Won't emit if in date range
    expect(endMock).toHaveBeenCalledTimes(0)
    // Both `start` since we didn't select beyond current date
    // We're not adding dates here since the next day might be on a different page that's not on the view, i.e during month end
    expect(startMock).toHaveBeenCalledTimes(2)
  })

  it('should update the selected date when a valid and parsable date string is typed into the input field - single', async () => {
    // ARRANGE
    const dayClickMock = jest.fn()
    const endMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const startMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const updateModelValueMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date, dayClickMock, endMock, startMock, updateModelValueMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          label="Single date"
          locale="en-US"
          name="test-name"
          placeholder="Select date"
          @dayclick="dayClickMock"
          @end="endMock"
          @start="startMock"
          @update:modelValue="updateModelValueMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const inputField = screen.getByRole('textbox', { name: 'Single date' })
    await waitFor(() => expect(inputField).toHaveValue(''))
    expect(endMock).toHaveBeenCalledTimes(0)
    expect(startMock).toHaveBeenCalledTimes(0)
    expect(dayClickMock).toHaveBeenCalledTimes(0)
    expect(updateModelValueMock).toHaveBeenCalledTimes(0)

    // Type a valid date string in a different format
    await userEventInstance.type(inputField, '2023-11-23')
    // Focus out to trigger model change right away, otherwise it will be debounced within v-calendar
    await userEventInstance.tab()

    await waitFor(() => expect(inputField).toHaveValue('11/23/2023')) // should be formatted to the locale's format - logic is within v-calendar
    expect(dayClickMock).toHaveBeenCalledTimes(0)
    expect(updateModelValueMock).toHaveBeenCalledTimes(1)
    expect(endMock).toHaveBeenCalledTimes(0)
    expect(startMock).toHaveBeenCalledTimes(0)
  })

  it('should update the selected date when a valid and parsable date string is typed into the input field - range', async () => {
    // ARRANGE
    const dayClickMock = jest.fn()
    const endMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const startMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const updateModelValueMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date, dayClickMock, endMock, startMock, updateModelValueMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          label="Date range"
          locale="en-US"
          name="test-name"
          placeholder="Select date"
          :model-modifiers="{ range: true }"
          @dayclick="dayClickMock"
          @end="endMock"
          @start="startMock"
          @update:modelValue="updateModelValueMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const inputFields = screen.getAllByRole('textbox')
    await waitFor(() => expect(inputFields.at(0)).toHaveValue(''))
    expect(inputFields.at(1)).toHaveValue('')
    expect(endMock).toHaveBeenCalledTimes(0)
    expect(startMock).toHaveBeenCalledTimes(0)
    expect(dayClickMock).toHaveBeenCalledTimes(0)
    expect(updateModelValueMock).toHaveBeenCalledTimes(0)

    // Type a valid date string in a different format
    await userEventInstance.type(inputFields[0], '2023-11-23')
    // Focus out to trigger model change right away, otherwise it will be debounced within v-calendar
    await userEventInstance.tab()

    await waitFor(() => expect(inputFields.at(0)).toHaveValue('11/23/2023')) // should be formatted to the locale's format - logic is within v-calendar
    expect(inputFields.at(1)).toHaveValue('11/23/2023') // end date will be prefilled with the same date
    expect(dayClickMock).toHaveBeenCalledTimes(0)
    expect(updateModelValueMock).toHaveBeenCalledTimes(1)
    expect(endMock).toHaveBeenCalledTimes(0)
    expect(startMock).toHaveBeenCalledTimes(0)
  })

  it('should not allow the input field to be edited when readonly prop is true - single', async () => {
    // ARRANGE
    const dayClickMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const updateModelValueMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date, dayClickMock, updateModelValueMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          label="Date"
          locale="en-US"
          name="test-name"
          placeholder="Select date"
          readonly="readonly"
          @dayclick="dayClickMock"
          @update:modelValue="updateModelValueMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const inputField = screen.getByRole('textbox', { name: 'Date' })
    await waitFor(() => expect(inputField).toHaveValue(''))
    expect(inputField).toBeEnabled()
    expect(dayClickMock).toHaveBeenCalledTimes(0)
    expect(updateModelValueMock).toHaveBeenCalledTimes(0)

    // Type a valid date string in a different format
    await userEventInstance.type(inputField, '2023-11-23')
    // Focus out to trigger model change right away, otherwise it will be debounced within v-calendar
    await userEventInstance.tab()

    await waitFor(() => expect(inputField).toHaveValue('')) // nothing should happen to the value since it's readonly
    expect(dayClickMock).toHaveBeenCalledTimes(0)
    expect(updateModelValueMock).toHaveBeenCalledTimes(0)
    expect(screen.getByText('May 2020')).toBeVisible() // but it should open the date-picker

    // Select a date
    await userEventInstance.click(screen.getByRole('button', { name: /May 9, 2020/ }))

    // Date-picker should auto-close
    await waitFor(() => expect(screen.queryByText('May 2020')).not.toBeInTheDocument())
    expect(inputField).toHaveValue('05/09/2020')
    expect(dayClickMock).toHaveBeenCalledTimes(1)
    expect(updateModelValueMock).toHaveBeenCalledTimes(1)
  })

  it('should not allow the input field to be edited when readonly prop is true - range', async () => {
    // ARRANGE
    const endMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const startMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const updateModelValueMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date, endMock, startMock, updateModelValueMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          label="Date range"
          locale="en-US"
          name="test-name"
          placeholder="Select date"
          readonly="readonly"
          :model-modifiers="{ range: true }"
          @end="endMock"
          @start="startMock"
          @update:modelValue="updateModelValueMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const inputFields = screen.getAllByRole('textbox')
    await waitFor(() => expect(inputFields.at(0)).toHaveValue(''))
    expect(inputFields.at(0)).toBeEnabled()
    expect(inputFields.at(1)).toHaveValue('')
    expect(inputFields.at(1)).toBeEnabled()
    expect(endMock).toHaveBeenCalledTimes(0)
    expect(startMock).toHaveBeenCalledTimes(0)
    expect(updateModelValueMock).toHaveBeenCalledTimes(0)

    // Type a valid date string in a different format
    await userEventInstance.type(inputFields[0], '2023-11-23')
    // Focus out to trigger model change right away, otherwise it will be debounced within v-calendar
    await userEventInstance.tab()

    await waitFor(() => expect(inputFields.at(0)).toHaveValue('')) // nothing should happen to the value since it's readonly
    expect(inputFields.at(1)).toHaveValue('')
    expect(endMock).toHaveBeenCalledTimes(0)
    expect(startMock).toHaveBeenCalledTimes(0)
    expect(updateModelValueMock).toHaveBeenCalledTimes(0)
    expect(screen.getByText('May 2020')).toBeVisible() // but it should open the date-picker

    // Select a date range
    await userEventInstance.click(screen.getByRole('button', { name: /May 9, 2020/ }))
    await userEventInstance.click(screen.getByRole('button', { name: /May 10, 2020/ }))

    // Date-picker should auto-close
    await waitFor(() => expect(screen.queryByText('May 2020')).not.toBeInTheDocument())
    expect(inputFields.at(0)).toHaveValue('05/09/2020')
    expect(inputFields.at(1)).toHaveValue('05/10/2020')
    expect(endMock).toHaveBeenCalledTimes(1)
    expect(startMock).toHaveBeenCalledTimes(1)
    expect(updateModelValueMock).toHaveBeenCalledTimes(1)
  })

  it('should trigger validation when the input field is focused and blurred', async () => {
    // ARRANGE
    const dayClickMock = jest.fn().mockImplementation(payload => expect(payload).toBeTruthy())
    const inputMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date, dayClickMock, inputMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          id="test-id"
          label="Single date"
          locale="en-US"
          name="test-name"
          placeholder="Select date"
          rules="required"
          @dayclick="dayClickMock"
          @update:modelValue="inputMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const inputField = screen.getByRole('textbox', { name: 'Single date' })
    await waitFor(() => expect(inputField).toHaveValue(''))
    expect(screen.getByRole('alert')).toHaveTextContent('')
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()

    // Trigger validation by focusing then blurring out of the input field
    await userEventInstance.click(inputField)
    await userEventInstance.tab()

    // Required validation error should be visible
    await waitFor(() => expect(inputField).toHaveValue(''))
    expect(screen.getByRole('alert')).toHaveTextContent('This is a custom required field message')
    expect(screen.getByText('This is a custom required field message')).toBeVisible()

    // Select a date
    await userEventInstance.click(inputField)
    await userEventInstance.click(screen.getByRole('button', { name: /May 9, 2020/ }))

    // See https://vee-validate.logaretm.com/v4/guide/testing#waiting-for-async-validation
    await flushPromises()

    // Validation should be cleared
    await waitFor(() => expect(inputField).toHaveValue('05/09/2020'))
    expect(screen.getByRole('alert')).toHaveTextContent('')
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()
  })

  it('should trigger validation when the input field is cleared', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref({
          start: new Date('2023-10-15'),
          end: new Date('2023-11-18'),
        })

        return { date }
      },
      template: `
        <sm-date-picker
          v-model="date"
          id="test-id"
          label="Date range"
          locale="en-US"
          name="test-name"
          placeholder="Select date"
          prefix-icon="action-calendar"
          suffix-icon="action-calendar"
          :rules="{ required: true }"
          :is-range="true"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const inputFields = screen.getAllByRole('textbox')
    await waitFor(() => expect(inputFields.at(0)).toHaveValue('10/15/2023'))
    expect(inputFields.at(1)).toHaveValue('11/18/2023')
    expect(screen.getByRole('alert')).toHaveTextContent('')
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()

    // Clearing the start date clears up the model entirely and triggers validation
    await userEventInstance.clear(inputFields[0])

    // For Vue3: We need to trigger validation right away. Vue2 and Vue3 versions
    // have different validation behavior, where Vue2 validates the displayed
    // value(s) on the typing box, and Vue3 validates the date-picker's v-model.
    // The latter is asynchronously computed within v-calendar so we add this extra
    // `tab()` to trigger model updates without waiting for the timeout.
    await userEventInstance.tab()

    // Required validation error should be visible
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('This is a custom required field message'))
    expect(screen.getByText('This is a custom required field message')).toBeVisible()

    // Select a date range
    await userEventInstance.click(screen.getByRole('button', { name: /Oct 2, 2023/ })) // For Vue3: month names are now short names
    await userEventInstance.click(screen.getByRole('button', { name: /Oct 25, 2023/ })) // For Vue3: month names are now short names

    // Validation should be cleared
    await waitFor(() => expect(inputFields.at(0)).toHaveValue('10/02/2023'))
    expect(inputFields.at(1)).toHaveValue('10/25/2023')
    // wait for nextTick() to resolve
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(''))
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()
  })

  it('should order the date grid based on the default firstDayOfWeek prop', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date }
      },
      template: `
        <sm-date-picker
          v-model="date"
          label="Single date"
          name="date"
          placeholder="Select date"
          locale="en-US"
        />
      `,
    }

    // ACT
    const { container } = render(ParentComponent)
    await userEventInstance.click(screen.getByRole('textbox', { name: 'Single date' }))

    // ASSERT
    const weekDayLabels = container.getElementsByClassName('vc-weekday')
    const expectedOrder = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    expectedOrder.forEach((weekday: string, index: number) => {
      expect(weekDayLabels.item(index)?.textContent).toBe(weekday)
    })
  })

  it('should order the date grid based on the provided firstDayOfWeek prop', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date }
      },
      template: `
        <sm-date-picker
          v-model="date"
          label="Single date"
          placeholder="Select date"
          locale="en-US"
          name="date"
          :first-day-of-week="4"
        />
      `,
    }

    // ACT
    const { container } = render(ParentComponent)
    await userEventInstance.click(screen.getByRole('textbox', { name: 'Single date' }))

    // ASSERT
    const weekDayLabels = container.getElementsByClassName('vc-weekday')
    const expectedOrder = ['W', 'T', 'F', 'S', 'S', 'M', 'T']
    expectedOrder.forEach((weekday: string, index: number) => {
      expect(weekDayLabels.item(index)?.textContent).toBe(weekday)
    })
  })

  it('should render the input slots for single date date-picker when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref()

        return { date }
      },
      template: `
        <sm-date-picker
          v-model="date"
          locale="en-US"
          label="Label prop"
          name="date"
          placeholder="Select date"
        >
          <template #label>Label slot</template>
          <template #action>Action slot</template>
          <template #prefix>Prefix slot</template>
          <template #suffix>Suffix slot</template>
        </sm-date-picker>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Label slot')).toBeVisible())
    expect(screen.queryByText('Label prop')).not.toBeInTheDocument()
    expect(screen.getByText('Action slot')).toBeVisible()
    expect(screen.getByText('Prefix slot')).toBeVisible()
    expect(screen.getByText('Suffix slot')).toBeVisible()
  })

  it('should render the input slots for date range picker when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmDatePicker },
      setup: () => {
        const date = ref({
          start: null,
          end: null,
        })

        return { date }
      },
      template: `
        <sm-date-picker
          v-model="date"
          locale="en-US"
          label="Label prop"
          name="date"
          placeholder="Select date"
          :is-range="true"
        >
          <template #label>Label slot</template>
          <template #action>Action slot</template>
          <template #prefix>Prefix slot</template>
          <template #suffix>Suffix slot</template>
        </sm-date-picker>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Label slot')).toBeVisible())
    expect(screen.queryByText('Label prop')).not.toBeInTheDocument()
    expect(screen.getByText('Action slot')).toBeVisible()
    expect(screen.getByText('Prefix slot')).toBeVisible()
    expect(screen.getByText('Suffix slot')).toBeVisible()
  })

  it('should render the custom input target and bind the input events', async () => {
    // ARRANGE
    const inputMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker, SmInput },
      setup: () => {
        const date = ref()

        return { date, inputMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          locale="en-US"
          label="Label prop"
          placeholder="Placeholder prop"
          name="date"
          @update:modelValue="inputMock"
        >
          <template #target="{ inputEvents, inputValue }">
            <sm-input
              v-model="inputValue"
              label="Target label"
              name="date-input"
              placeholder="Target placeholder"
              :event-binding="inputEvents"
            />
          </template>
        </sm-date-picker>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const inputField = screen.getByRole('textbox', { name: 'Target label' })
    await waitFor(() => expect(inputField).toBeVisible())
    expect(screen.getByPlaceholderText('Target placeholder')).toBeVisible()
    expect(inputField).toHaveValue('')

    // Click the custom target and select date
    await userEventInstance.click(inputField)
    await userEventInstance.click(screen.getByRole('button', { name: /May 11, 2020/ }))

    // Should still auto-close and the slot props are working
    await waitFor(() => expect(screen.queryByText('May 2020')).not.toBeInTheDocument())
    expect(inputField).toHaveValue('05/11/2020')
    expect(inputMock).toHaveBeenCalledTimes(1)
    expect(inputMock).toHaveBeenCalledWith(new Date('2020-05-11T00:00:00.000Z'))
  })

  it('should render the custom button target and bind the events', async () => {
    // ARRANGE
    const inputMock = jest.fn()

    const ParentComponent = {
      components: { SmDatePicker, SmButton },
      setup: () => {
        const date = ref()

        return { date, inputMock }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          From @input="inputMock" to @update:modelValue="inputMock"
        -->
        <sm-date-picker
          v-model="date"
          locale="en-US"
          label="Label prop"
          name="date"
          placeholder="Placeholder prop"
          @update:modelValue="inputMock"
        >
          <template #target="{ inputEvents, inputValue, showPopover, hidePopover }">
            <sm-button :event-binding="inputEvents">{{ inputValue || 'Select date' }}</sm-button>
            <sm-button @click="showPopover">Show date-picker</sm-button>
            <sm-button @click="hidePopover">Hide date-picker</sm-button>
          </template>
        </sm-date-picker>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('button', { name: 'Select date' })).toBeVisible())

    // Click the custom target and select date
    await userEventInstance.click(screen.getByRole('button', { name: 'Select date' }))
    await userEventInstance.click(screen.getByRole('button', { name: /May 19, 2020/ }))

    // Should still auto-close and the slot props are working
    await waitFor(() => expect(screen.queryByText('May 2020')).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: '05/19/2020' })).toBeVisible() // Button's text should now be the inputValue
    expect(inputMock).toHaveBeenCalledTimes(1)
    expect(inputMock).toHaveBeenCalledWith(new Date('2020-05-19T00:00:00.000Z'))

    // Click custom target with showPopover slot prop action
    await userEventInstance.click(screen.getByRole('button', { name: 'Show date-picker' }))
    await waitFor(() => expect(screen.getByText('May 2020')).toBeVisible())

    // Click custom target with hidePopover slot prop action
    await userEventInstance.click(screen.getByRole('button', { name: 'Hide date-picker' }))
    await waitFor(() => expect(screen.queryByText('May 2020')).not.toBeInTheDocument())
  })

})
