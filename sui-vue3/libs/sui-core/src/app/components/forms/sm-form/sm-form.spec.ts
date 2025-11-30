import { FieldValidationMetaInfo } from '@/app/libs/vee-validate/rules/types'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { required } from '@vee-validate/rules'
import flushPromises from 'flush-promises'
import { configure, defineRule } from 'vee-validate'
import { ref } from 'vue'
import { SmButton } from '../../sm-button'
import SmCalendar from '../sm-calendar/sm-calendar.vue'
import { SmCheckbox, SmCheckboxGroup } from '../sm-checkbox'
import SmDatePicker from '../sm-date-picker/sm-date-picker.vue'
import { SmInput } from '../sm-input'
import SmMultiSelect from '../sm-multi-select/sm-multi-select.vue'
import { SmRadio, SmRadioGroup } from '../sm-radio'
import SmSelect from '../sm-select/sm-select.vue'
import SmSwitch from '../sm-switch/sm-switch.vue'
import SmTimePicker from '../sm-time-picker/sm-time-picker.vue'
import SmTranslationsInput from '../sm-translations-input/sm-translations-input.vue'
import SmForm from './sm-form.vue'

// Needed for v-calendar. Consider moving this to setupTests if it becomes common
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

/**
 * For tests that use vee-validate, we need to follow the recommendations on their
 * testing page: https://vee-validate.logaretm.com/v3/advanced/testing.html#asynchronous-testing
 * which requires usage of the flush-promises package to force vee-validate to resolve all of their
 * promises that are concerning validation checks.
 */
describe('SmForm', () => {

  // when jest.useFakeTimers() is used, we need to configure userEvent package
  // such that it is aware that fake timers are used.
  // this is after upgrading user-event package to v14+
  // see: https://github.com/testing-library/user-event/issues/833
  const userEventInstance = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

  // see: https://github.com/logaretm/vee-validate/issues/2752
  // see: https://vee-validate.logaretm.com/v3/advanced/testing.html#testing-validationobserver-debounced-state
  const flushAll = async (): Promise<void> => {
    // Get rid of any pending validations on the leading edge
    await flushPromises()
    // Any delayed or debounced state computations
    jest.runAllTimers()
    // Get rid of the pending rendering tick
    await flushPromises()
  }

  // Test all form field components
  const defaultForm = {
    input: null,
    calendar: null,
    datePicker: null,
    multiselect: null,
    radio: null,
    select: null,
    switch: null,
    timePicker: null,
    translationsInput: [
      { code: 'en' },
      { code: 'de' },
    ],
  }

  const defaultSupportedTranslations = [
    {
      code: 'en',
      translationLabel: 'English translation',
      dropdownLabel: 'English',
    },
    {
      code: 'de',
      translationLabel: 'German translation',
      dropdownLabel: 'German',
    },
  ]

  const renderComponent = (component: unknown): void => {
    render(component, {
      global: {
        components: {
          'sm-button': SmButton, // Needed to fully load sm-translations-input
          'sm-select': SmSelect, // Needed to fully load sm-time-picker
        },
      },
    })
  }

  beforeAll(() => {
    defineRule('required', required)

    configure({
      generateMessage: (context: FieldValidationMetaInfo) => {
        const ruleName = context.rule?.name ?? ''

        return `This is a custom ${ruleName} field message`
      },
    })
  })

  // see: https://testing-library.com/docs/using-fake-timers/
  // Fake timers using Jest
  beforeEach(() => {
    jest.useFakeTimers()
  })

  // see: https://testing-library.com/docs/using-fake-timers/
  // Running all pending timers and switching to real timers using Jest
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should toggle the form fields\' disabled state when disabled prop changes in the parent form', async () => {
    // ARRANGE
    const ParentComponent = {
      // required as child components are not globally registered
      components: {
        SmButton,
        SmCalendar,
        SmCheckbox,
        SmCheckboxGroup,
        SmDatePicker,
        SmForm,
        SmInput,
        SmMultiSelect,
        SmRadio,
        SmRadioGroup,
        SmSelect,
        SmSwitch,
        SmTimePicker,
        SmTranslationsInput,
      },
      setup: () => {
        const form = ref(defaultForm)
        const isFormDisabled = ref(false)

        return { defaultSupportedTranslations, isFormDisabled, form }
      },
      template: `
        <sm-form :disabled="isFormDisabled">
          <template #default="{ invalid }">
            <sm-input name="input" label="Input field" v-model="form.input" />

            <sm-calendar v-model="form.calendar" name="calendar" label="Calendar field" mode="month-year" />

            <sm-date-picker v-model="form.datePicker" name="date-picker" label="Date-picker field" />

            <sm-select v-model="form.select" label="Select field" name="select" :options="[]" />

            <sm-multi-select v-model="form.multiselect" label="Multi-select field" name="multiselect" :options="[]" />

            <sm-switch v-model="form.switch" label="Switch field" name="switch" />

            <sm-time-picker v-model="form.timePicker" name="time-picker" label="Time-picker field" />

            <sm-translations-input
              v-model="form.translationsInput"
              label="Translations input field"
              name="translations-input"
              :supported-translations="defaultSupportedTranslations"
            />

            <sm-checkbox-group label="Checkbox group field" name="checkbox">
              <sm-checkbox v-model="form.checkbox" name="checkbox" label="Checkbox 1" selected-value="checkbox-1" />
              <sm-checkbox v-model="form.checkbox" name="checkbox" label="Checkbox 2" selected-value="checkbox-2" />
            </sm-checkbox-group>

            <sm-radio-group label="Radio group field" name="radio">
              <sm-radio v-model="form.radio" name="radio" label="Radio 1" selected-value="radio-1" />
              <sm-radio v-model="form.radio" name="radio" label="Radio 2" selected-value="radio-2" />
            </sm-radio-group>

            <sm-button type="tertiary" @click="isFormDisabled = !isFormDisabled">Toggle</sm-button>
          </template>
        </sm-form>
      `,
    }

    // ACT
    renderComponent(ParentComponent)

    // ASSERT
    const toggleButton = await screen.findByRole('button', { name: 'Toggle' })
    expect(screen.queryByText('*')).not.toBeInTheDocument() // No required fields in the form

    // Initial states
    expect(screen.getByRole('textbox', { name: 'Input field' })).toBeEnabled()
    expect(screen.getByRole('textbox', { name: 'Calendar field' })).toBeEnabled()
    expect(screen.getByRole('textbox', { name: 'Date-picker field' })).toBeEnabled()
    expect(screen.getByRole('textbox', { name: 'Select field' })).toBeEnabled()
    expect(screen.getByRole('textbox', { name: 'Multi-select field' })).toBeEnabled()
    expect(screen.getByRole('checkbox', { name: 'Switch field' })).toBeEnabled()
    expect(screen.getByRole('textbox', { name: 'Time-picker field' })).toBeEnabled()
    expect(screen.getByRole('textbox', { name: 'Translations input field' })).toBeEnabled()
    expect(screen.getByRole('textbox', { name: 'German translation' })).toBeEnabled()
    expect(screen.getByRole('checkbox', { name: 'Checkbox 1' })).toBeEnabled()
    expect(screen.getByRole('checkbox', { name: 'Checkbox 2' })).toBeEnabled()
    expect(screen.getByRole('radio', { name: 'Radio 1' })).toBeEnabled()
    expect(screen.getByRole('radio', { name: 'Radio 2' })).toBeEnabled()

    // Disable the form
    await userEventInstance.click(toggleButton)

    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Input field' })).toBeDisabled())
    expect(screen.getByRole('textbox', { name: 'Calendar field' })).toBeDisabled()
    expect(screen.getByRole('textbox', { name: 'Date-picker field' })).toBeDisabled()
    expect(screen.getByRole('textbox', { name: 'Select field' })).toBeDisabled()
    expect(screen.getByRole('textbox', { name: 'Multi-select field' })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: 'Switch field' })).toBeDisabled()
    expect(screen.getByRole('textbox', { name: 'Time-picker field' })).toBeDisabled()
    expect(screen.getByRole('textbox', { name: 'Translations input field' })).toBeDisabled()
    expect(screen.getByRole('textbox', { name: 'German translation' })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: 'Checkbox 1' })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: 'Checkbox 2' })).toBeDisabled()
    expect(screen.getByRole('radio', { name: 'Radio 1' })).toBeDisabled()
    expect(screen.getByRole('radio', { name: 'Radio 2' })).toBeDisabled()

    // Enable the form again
    await userEventInstance.click(toggleButton)

    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Input field' })).toBeEnabled())
    expect(screen.getByRole('textbox', { name: 'Calendar field' })).toBeEnabled()
    expect(screen.getByRole('textbox', { name: 'Date-picker field' })).toBeEnabled()
    expect(screen.getByRole('textbox', { name: 'Select field' })).toBeEnabled()
    expect(screen.getByRole('textbox', { name: 'Multi-select field' })).toBeEnabled()
    expect(screen.getByRole('checkbox', { name: 'Switch field' })).toBeEnabled()
    expect(screen.getByRole('textbox', { name: 'Time-picker field' })).toBeEnabled()
    expect(screen.getByRole('textbox', { name: 'Translations input field' })).toBeEnabled()
    expect(screen.getByRole('textbox', { name: 'German translation' })).toBeEnabled()
    expect(screen.getByRole('checkbox', { name: 'Checkbox 1' })).toBeEnabled()
    expect(screen.getByRole('checkbox', { name: 'Checkbox 2' })).toBeEnabled()
    expect(screen.getByRole('radio', { name: 'Radio 1' })).toBeEnabled()
    expect(screen.getByRole('radio', { name: 'Radio 2' })).toBeEnabled()
  })

  it('should validate the form when form is submitted', async () => {
    // ARRANGE
    const mockSubmit = jest.fn()
    const mockInvalidSubmit = jest.fn().mockImplementation(event => expect(event).toBeTruthy())
    const ParentComponent = {
      components: {
        SmButton,
        SmCalendar,
        SmCheckbox,
        SmCheckboxGroup,
        SmDatePicker,
        SmForm,
        SmInput,
        SmMultiSelect,
        SmRadio,
        SmRadioGroup,
        SmSelect,
        SmSwitch,
        SmTimePicker,
        SmTranslationsInput,
      },
      setup: () => {
        const form = ref(defaultForm)

        return { defaultSupportedTranslations, form, mockInvalidSubmit, mockSubmit }
      },
      template: `
        <sm-form
          @invalid-submit="mockInvalidSubmit"
          @submit="mockSubmit"
        >
          <template #default="{ invalid }">
            <sm-input name="input" label="Input field" v-model="form.input" rules="required" />

            <sm-calendar v-model="form.calendar" name="calendar" label="Calendar field" mode="month-year" rules="required" />

            <sm-date-picker v-model="form.datePicker" name="date-picker" label="Date-picker field" rules="required" />

            <sm-select v-model="form.select" label="Select field" name="select" :options="[]" rules="required" />

            <sm-multi-select v-model="form.multiselect" label="Multi-select field" name="multiselect" :options="[]" rules="required" />

            <sm-switch v-model="form.switch" label="Switch field" name="switch" rules="required" />

            <sm-time-picker v-model="form.timePicker" name="time-picker" label="Time-picker field" rules="required" />

            <sm-translations-input
              v-model="form.translationsInput"
              label="Translations input field"
              name="translations-input"
              rules="required"
              :supported-translations="defaultSupportedTranslations"
            />

            <sm-checkbox-group label="Checkbox group field" name="checkbox" rules="required">
              <sm-checkbox v-model="form.checkbox" name="checkbox" label="Checkbox 1" selected-value="checkbox-1" :error-disabled="true" />
              <sm-checkbox v-model="form.checkbox" name="checkbox" label="Checkbox 2" selected-value="checkbox-2" :error-disabled="true" />
            </sm-checkbox-group>

            <sm-radio-group label="Radio group field" name="radio" rules="required">
              <sm-radio v-model="form.radio" name="radio" label="Radio 1" selected-value="radio-1" :error-disabled="true" />
              <sm-radio v-model="form.radio" name="radio" label="Radio 2" selected-value="radio-2" :error-disabled="true" />
            </sm-radio-group>

            <sm-button native-type="submit" type="primary">Submit</sm-button>
          </template>
        </sm-form>
      `,
    }

    // ACT
    renderComponent(ParentComponent)

    // ASSERT
    const submitButton = await screen.findByRole('button', { name: 'Submit' })

    await waitFor(() => expect(submitButton).toBeEnabled())
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()
    expect(mockSubmit).toHaveBeenCalledTimes(0)
    expect(mockInvalidSubmit).toHaveBeenCalledTimes(0) // New event in Vue3

    // Submit the form without filling in any fields
    await userEventInstance.click(submitButton)
    // flush the pending validation.
    await flushAll()

    // Check all visible error messages
    await waitFor(() => expect(screen.getAllByText('This is a custom required field message')).toHaveLength(11))

    // Check all accessible error messages for those that are correctly configured
    expect(screen.getByRole('textbox', { name: 'Input field' })).toHaveAccessibleErrorMessage('This is a custom required field message')
    expect(screen.getByRole('textbox', { name: 'Calendar field' })).toHaveAccessibleErrorMessage('This is a custom required field message')
    expect(screen.getByRole('textbox', { name: 'Date-picker field' })).toHaveAccessibleErrorMessage('This is a custom required field message')
    expect(screen.getByRole('textbox', { name: 'Translations input field' })).toHaveAccessibleErrorMessage('This is a custom required field message')
    expect(screen.getByRole('textbox', { name: 'German translation' })).toHaveAccessibleErrorMessage('This is a custom required field message')

    // Native submit event won't be emitted if form is invalid
    expect(mockSubmit).toHaveBeenCalledTimes(0)
    expect(mockInvalidSubmit).toHaveBeenCalledTimes(1) // New event in Vue3
  })

  it('should emit submit event when form is valid', async () => {
    // ARRANGE
    const initialDatePickerDate = new Date('2024-03-15')
    const mockSubmit = jest.fn()
    const ParentComponent = {
      components: {
        SmButton,
        SmCalendar,
        SmCheckbox,
        SmCheckboxGroup,
        SmDatePicker,
        SmForm,
        SmInput,
        SmMultiSelect,
        SmRadio,
        SmRadioGroup,
        SmSelect,
        SmSwitch,
        SmTimePicker,
        SmTranslationsInput,
      },
      setup: () => {
        const form = ref({
          inputNumber: null,
          // Prefill some values already to check if form will still recognize them as valid
          input: 'hello world',
          radio: 'radio-1',
          multiselect: 1,
          select: 1,
          switch: true,
          timePicker: '12:00',
          checkbox: ['checkbox-1'],
          calendar: { month: 3, year: 2024 },
          datePicker: initialDatePickerDate,
          translationsInput: [
            { code: 'en', value: 'hello world' },
            { code: 'de', value: 'hallo welt' },
          ],
        })
        const isFormSubmitted = ref(false)

        return { defaultSupportedTranslations, form, isFormSubmitted, mockSubmit }
      },
      template: `
        <sm-form @submit="mockSubmit">
          <template #default="{ invalid }">
            <sm-input name="input" label="Input field" v-model="form.input" rules="required" />

            <sm-input type="number" name="input-number" label="Number field" v-model="form.inputNumber" rules="required" />

            <sm-calendar v-model="form.calendar" name="calendar" label="Calendar field" mode="month-year" rules="required" data-testid="calendar-field" />

            <sm-date-picker v-model="form.datePicker" name="date-picker" label="Date-picker field" locale="en-US" rules="required" />

            <sm-select v-model="form.select" label="Select field" name="select" :options="[{ code: 1, label: 'Select option 1' }]" rules="required" />

            <sm-multi-select v-model="form.multiselect" label="Multi-select field" name="multiselect" :options="[{ code: 1, label: 'Multi-select option 1' }]" rules="required" />

            <sm-switch v-model="form.switch" label="Switch field" name="switch" rules="required" />

            <sm-time-picker v-model="form.timePicker" name="time-picker" label="Time-picker field" rules="required" />

            <sm-translations-input
              v-model="form.translationsInput"
              label="Translations input field"
              name="translations-input"
              rules="required"
              :supported-translations="defaultSupportedTranslations"
            />

            <sm-checkbox-group label="Checkbox group field" name="checkbox" rules="required">
              <sm-checkbox v-model="form.checkbox" name="checkbox" label="Checkbox 1" selected-value="checkbox-1" :error-disabled="true" />
              <sm-checkbox v-model="form.checkbox" name="checkbox" label="Checkbox 2" selected-value="checkbox-2" :error-disabled="true" />
            </sm-checkbox-group>

            <sm-radio-group label="Radio group field" name="radio" rules="required">
              <sm-radio v-model="form.radio" name="radio" label="Radio 1" selected-value="radio-1" :error-disabled="true" />
              <sm-radio v-model="form.radio" name="radio" label="Radio 2" selected-value="radio-2" :error-disabled="true" />
            </sm-radio-group>

            <sm-button native-type="submit" :disabled="invalid">Submit</sm-button>
          </template>
        </sm-form>
      `,
    }

    // ACT
    renderComponent(ParentComponent)

    // ASSERT
    const submitButton = await screen.findByRole('button', { name: 'Submit' })
    expect(mockSubmit).toHaveBeenCalledTimes(0)

    // flush the pending validation on initialisation
    await flushAll()
    await waitFor(() => expect(submitButton).toBeDisabled())

    // Fill in remaining field
    await userEventInstance.type(screen.getByRole('spinbutton', { name: 'Number field' }), '123')

    // important to test the submit button is enabled so that it is clickable by VTL
    await waitFor(() => expect(submitButton).toBeEnabled())

    // Submit the form
    await userEventInstance.click(submitButton)
    // flush the pending validation.
    await flushAll()

    const alertElements = await screen.findAllByRole('alert')
    expect(alertElements).toHaveLength(12)
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()

    expect(mockSubmit).toHaveBeenCalledTimes(1)
    // v-validate values is different from the v-model values for some components
    expect(mockSubmit).toHaveBeenCalledWith({
      input: 'hello world',
      'input-number': 123,
      calendar: '2024-03',
      'date-picker': initialDatePickerDate,
      radio: 'radio-1',
      checkbox: ['checkbox-1'],
      multiselect: 1,
      select: 1,
      switch: true,
      'time-picker': '12:00',
      'translations-input': [
        { value: 'hello world' },
        { value: 'hallo welt' },
      ],
    })
  })

  it('should validate the form when input field value changes', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmForm, SmInput, SmButton },
      setup: () => {
        const inputField = ref('initial value')
        const isFormSubmitted = ref(false)

        return { inputField, isFormSubmitted }
      },
      template: `
        <sm-form>
          <template #default="{ invalid }">
            <sm-input name="input" label="Input field" v-model="inputField" rules="required" />
            <sm-button native-type="submit" :disabled="invalid">Submit</sm-button>
          </template>
        </sm-form>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled())
    expect(screen.getByRole('alert')).toHaveTextContent('')
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()

    // Clear input field
    await userEventInstance.clear(screen.getByRole('textbox', { name: 'Input field' }))
    // flush the pending validation.
    await flushAll()

    await waitFor(() => expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled())
    expect(screen.getByRole('alert')).toHaveTextContent('This is a custom required field message')
    expect(screen.getByText('This is a custom required field message')).toBeVisible()

    // Add value again to clear validation error
    await userEventInstance.type(screen.getByRole('textbox', { name: 'Input field' }), 'hello')
    // flush the pending validation.
    await flushAll()

    await waitFor(() => expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled())
    expect(screen.getByRole('alert')).toHaveTextContent('')
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()
  })

  it('should emit reset event when a native reset button is clicked', async () => {
    // vee-validate makes it easy to handle form submission and reset
    // Handling form reset is already done by vee-validate see here https://vee-validate.logaretm.com/v4/guide/composition-api/handling-forms/

    // ARRANGE
    const mockReset = jest.fn()
    const ParentComponent = {
      components: {
        SmButton,
        SmForm,
        SmInput,
        SmMultiSelect,
      },
      setup: () => {
        const form = ref({
          input: 'initial value',
          multiselect: 1,
        })
        const options = ref([{ code: 1, label: 'Option 1' }])

        return { form, options, mockReset }
      },
      template: `
        <sm-form @reset="mockReset">
          <sm-input name="input" label="Input field" v-model="form.input" />
          <sm-multi-select
            v-model="form.multiselect"
            label="Multi-select field"
            name="multiselect"
            :options="options"
          />
          <sm-button native-type="reset">Reset</sm-button>
          <span>Values: {{ form }}</span>
        </sm-form>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findByRole('textbox', { name: 'Input field' })).toHaveValue('initial value')
    expect(screen.getByRole('textbox', { name: 'Multi-select field' })).toHaveValue('Option 1')
    expect(screen.getByText('Values: { "input": "initial value", "multiselect": 1 }')).toBeVisible()
    expect(mockReset).toHaveBeenCalledTimes(0)

    // Reset initial value
    await userEventInstance.click(screen.getByRole('button', { name: 'Reset' }))

    expect(await screen.findByRole('textbox', { name: 'Input field' })).toHaveValue('')
    expect(screen.getByRole('textbox', { name: 'Multi-select field' })).toHaveValue('')
    expect(screen.getByText('Values: {}')).toBeVisible()
    expect(mockReset).toHaveBeenCalledTimes(1)

    // Type new value
    await userEventInstance.type(screen.getByRole('textbox', { name: 'Input field' }), 'hello world')

    expect(await screen.findByRole('textbox', { name: 'Input field' })).toHaveValue('hello world')
    expect(screen.getByText('Values: { "input": "hello world" }')).toBeVisible()

    // Reset again
    await userEventInstance.click(screen.getByRole('button', { name: 'Reset' }))

    expect(await screen.findByRole('textbox', { name: 'Input field' })).toHaveValue('')
    expect(screen.getByText('Values: {}')).toBeVisible()
    expect(mockReset).toHaveBeenCalledTimes(2)
  })

  it('should validate the form when the public method is called', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmForm, SmInput, SmButton },
      setup: () => {
        const inputField = ref()

        return { inputField }
      },
      template: `
        <sm-form>
          <template v-slot:default="{ invalid, validate }">
            <sm-input name="input" label="Input field" v-model="inputField" rules="required" />
            <sm-button type="tertiary" @click="validate()">Validate</sm-button>
            <sm-button :disabled="invalid" type="primary">Submit</sm-button>
          </template>
        </sm-form>
      `,
    }

    // ACT
    render(ParentComponent)
    await userEventInstance.click(screen.getByRole('button', { name: 'Validate' }))
    // flush the pending validation.
    await flushAll()

    // ASSERT
    await waitFor(() => expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled())
    expect(screen.getByRole('alert')).toHaveTextContent('This is a custom required field message')
    expect(screen.getByText('This is a custom required field message')).toBeVisible()
  })

  it('should reset the validation state when public method is called', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmForm, SmInput, SmButton },
      setup: () => {
        const inputField = ref('')
        const formRef = ref()

        return { formRef, inputField }
      },
      template: `
        <sm-form ref="formRef">
          <sm-input name="input" label="Input field" v-model="inputField" rules="required" />
          <sm-button native-type="reset">Reset</sm-button>
          <sm-button native-type="submit">Submit</sm-button>
        </sm-form>
      `,
    }

    // ACT
    render(ParentComponent)
    await userEventInstance.click(screen.getByRole('button', { name: 'Submit' }))

    // ASSERT
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('This is a custom required field message'))
    expect(screen.getByText('This is a custom required field message')).toBeVisible()

    // Reset validation
    // vee-validate also handles form resets in a similar way to submissions
    await userEventInstance.click(screen.getByRole('button', { name: 'Reset' }))
    // flush the pending validation.
    await flushAll()

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(''))
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()
  })

})
