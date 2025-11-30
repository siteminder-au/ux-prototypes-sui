import { FieldValidationMetaInfo } from '@/app/libs/vee-validate/rules/types'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, within } from '@testing-library/vue'
import { required } from '@vee-validate/rules'
import { configure, defineRule } from 'vee-validate'
import { ref } from 'vue'
import SmTimePicker from './sm-time-picker.vue'

describe('SmTimePicker', () => {

  beforeAll(() => {
    defineRule('required', required)

    configure({
      generateMessage: (context: FieldValidationMetaInfo) => {
        const ruleName = context.rule?.name ?? ''

        return `This is a custom ${ruleName} field message`
      },
    })
  })

  it('should create the default select options', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTimePicker },
      setup: () => {
        const selectedTime = ref(null)

        return {
          selectedTime,
        }
      },
      template: `
        <sm-time-picker
          name="time-picker"
          label="Check-in"
          v-model="selectedTime"
          from="00:00"
          to="23:00">
        </sm-time-picker>
      `,
    }

    // ACT
    render(
      ParentComponent,
    )

    // ASSERT
    const inputElement = screen.getByRole('textbox')
    await waitFor(() => expect(screen.getByRole('combobox')).toBeVisible())
    expect(inputElement).toHaveValue('')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    // Get the focus into the input field to open the dropdown
    await userEvent.tab()
    await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())

    // Get the list and check the options
    const defaultList = screen.getByRole('listbox')
    expect(within(defaultList).getByText('00:00')).toBeVisible()
    expect(within(defaultList).getByText('12:00')).toBeVisible()
    expect(within(defaultList).getByText('23:00')).toBeVisible()

    // Check the number of options
    const options = within(defaultList).getAllByRole('option')
    expect(options).toHaveLength(24)
  })

  it('should create a new option if selectNone is specified', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTimePicker },
      setup: () => {
        const selectedTime = ref(null)

        return {
          selectedTime,
        }
      },
      template: `
      <sm-time-picker
        name="time-picker"
        label="Check-in"
        v-model="selectedTime"
        from="00:00"
        to="23:00"
        select-none="Please Choose...">
      </sm-time-picker>
    `,
    }

    // ACT
    render(
      ParentComponent,
    )

    // ASSERT
    await waitFor(() => expect(screen.getByRole('combobox')).toBeVisible())
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    // Get the focus into the input field to open the dropdown
    await userEvent.tab()
    await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())

    // Get the list and check the options
    const defaultList = screen.getByRole('listbox')
    expect(within(defaultList).getByText('Please Choose...')).toBeVisible()
    expect(within(defaultList).getByText('00:00')).toBeVisible()
    expect(within(defaultList).getByText('11:00')).toBeVisible()
    expect(within(defaultList).getByText('23:00')).toBeVisible()

    // Check the number of options
    const options = within(defaultList).getAllByRole('option')
    expect(options).toHaveLength(25)
  })

  it('should create the default select options as per the given step', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTimePicker },
      setup: () => {
        const selectedTime = ref(null)

        return {
          selectedTime,
        }
      },
      template: `
        <sm-time-picker
          name="time-picker"
          label="Check-in"
          v-model="selectedTime"
          from="00:00"
          to="23:00"
          step="05:00">
        </sm-time-picker>
      `,
    }

    // ACT
    render(
      ParentComponent,
    )

    // ASSERT
    const inputElement = screen.getByRole('textbox')
    await waitFor(() => expect(screen.getByRole('combobox')).toBeVisible())
    expect(inputElement).toHaveValue('')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    // Get the focus into the input field to open the dropdown
    await userEvent.tab()
    await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())

    // Get the list and check the options
    const defaultList = screen.getByRole('listbox')
    expect(within(defaultList).getByText('05:00')).toBeVisible()
    expect(within(defaultList).queryByText('08:00')).not.toBeInTheDocument()
    expect(within(defaultList).getByText('10:00')).toBeVisible()
    expect(within(defaultList).getByText('15:00')).toBeVisible()
    expect(within(defaultList).getByText('20:00')).toBeVisible()

    // Check the number of options
    const options = within(defaultList).getAllByRole('option')
    expect(options).toHaveLength(5)
  })

  it('should validate the value when rules prop is configured', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTimePicker },
      setup: () => {
        const selectedTime = ref(null)

        return {
          selectedTime,
        }
      },
      template: `
        <sm-time-picker
          name="time-picker"
          label="Check-in"
          v-model="selectedTime"
          from="00:00"
          to="23:00"
          step="05:00"
          rules="required"
        />
      `,
    }

    // ACT
    render(
      ParentComponent,
    )

    // ASSERT
    const inputElement = screen.getByRole('textbox')
    await waitFor(() => expect(screen.getByRole('combobox')).toBeVisible())
    expect(inputElement).toHaveValue('')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.queryByText('*')).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('')
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()

    // Trigger validation error by focusing then blurring out of the field
    await userEvent.click(inputElement)
    await userEvent.tab()

    // a11y is not properly configured so we can only assert by checking the text
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('This is a custom required field message'))
    expect(screen.getByText('This is a custom required field message')).toBeVisible()

    // Select an option
    await userEvent.click(inputElement)
    await userEvent.click(screen.getByText('05:00'))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(''))
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()
  })

  it('should validate the value when rules prop is configured and selectNone is selected', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTimePicker },
      setup: () => {
        const selectedTime = ref(null)

        return {
          selectedTime,
        }
      },
      template: `
        <div>
          <sm-time-picker
            name="time-picker"
            label="Check-in"
            v-model="selectedTime"
            from="00:00"
            to="23:00"
            select-none="Please Choose..."
            rules="required"
          />
          <span>Value: {{ selectedTime }}</span>
        </div>
      `,
    }

    // ACT
    render(
      ParentComponent,
    )

    // ASSERT
    const inputElement = screen.getByRole('textbox')
    await waitFor(() => expect(screen.getByRole('combobox')).toBeVisible())
    expect(inputElement).toHaveValue('')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.getByText('*')).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('')
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()
    expect(screen.getByText('Value:')).toBeVisible()

    // Select none as the option to trigger validation error
    await userEvent.click(inputElement)
    await userEvent.click(screen.getByText('Please Choose...'))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('This is a custom required field message'))
    expect(screen.getByText('This is a custom required field message')).toBeVisible()
    expect(screen.getByText('Value:')).toBeVisible()

    // Select a valid option
    await userEvent.click(inputElement)
    await userEvent.click(screen.getByText('12:00'))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(''))
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()
    expect(screen.getByText('Value: 12:00')).toBeVisible()

    // Select none as the option to trigger validation error again
    await userEvent.click(inputElement)
    await userEvent.click(screen.getByText('Please Choose...'))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('This is a custom required field message'))
    expect(screen.getByText('This is a custom required field message')).toBeVisible()
    expect(screen.getByText('Value:')).toBeVisible()
  })
  it('should display the slot template correctly', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTimePicker },
      setup: () => {
        const selectedTime = ref(null)

        return {
          selectedTime,
        }
      },
      template: `
        <div>
          <sm-time-picker
            name="time-picker"
            label="Check-in"
            v-model="selectedTime"
            from="00:00"
            to="23:00"
            select-none="Please Choose..."
            rules="required"
          >
            <template #label>
              <span>Custom Label</span>
            </template>
            <template #action>
              <button @click="selectedTime = null">Reset</button>
            </template>
            <template #prefix>
              <span>Prefix: </span>
            </template>
            <template #suffix>
              <span>Suffix</span>
            </template>
          </sm-time-picker>
        </div>
      `,
    }

    // ACT
    render(
      ParentComponent,
    )

    // ASSERT
    await waitFor(() => expect(screen.getByText('Custom Label')).toBeVisible())

    expect(screen.getByRole('button', { name: 'Reset' })).toBeVisible()
    expect(screen.getByText('Prefix:')).toBeVisible()
    expect(screen.getByText('Suffix')).toBeVisible()
  })

})
