import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { between, email, min, max_value as maxValue, min_value as minValue, required } from '@vee-validate/rules'
import { configure, defineRule } from 'vee-validate'
import { ref } from 'vue'
import { FieldValidationMetaInfo } from '@/app/libs/vee-validate/rules/types'
import SmForm from '../sm-form/sm-form.vue'
import SmInputPrefixContent from './sm-input-prefix-content.vue'
import SmInputSuffixContent from './sm-input-suffix-content.vue'
import SmInput from './sm-input.vue'

describe('SmInput', () => {

  beforeAll(() => {
    configure({
      generateMessage: (context: FieldValidationMetaInfo) => {
        const ruleName = context.rule?.name ?? ''

        return `This is a custom ${ruleName} field message`
      },
    })
  })

  beforeEach(jest.restoreAllMocks)

  it.each([
    'text',
    'tel',
    'url',
    'phone',
    'search',
  ])('should render input type provided - %s', async (type) => {
    // ARRANGE
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField, type }
      },
      template: `
        <sm-input v-model="inputField" label="${type} field" :type="type" :name="type" />
      `,
    }

    // Roles taken from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
    const expectedRole = type === 'search' ? 'searchbox' : 'textbox'

    // ACT
    render(ParentComponent)

    // ASSERT
    const input = screen.getByRole(expectedRole, { name: `${type} field` })
    await waitFor(() => expect(screen.getByLabelText(`${type} field`)).toBeVisible())
    expect(screen.getByText(`${type} field`)).toBeVisible() // Visible label text
    expect(screen.getByRole('alert')).toHaveTextContent('')
    expect(input).toHaveDisplayValue('')
    expect(input).toHaveValue('')

    const testInput = 'Test value 123 !@#$$%^&*()-+='
    await userEvent.type(input, testInput)

    // Accepts alpha-numeric and special characters
    await waitFor(() => expect(input).toHaveDisplayValue(testInput))
    expect(input).toHaveValue(testInput)
  })

  it('should render input type provided - password', async () => {
    // ARRANGE
    const mockInput = jest.fn()
    const mockChange = jest.fn()
      .mockImplementation((payload: Event) => expect(payload).toBeTruthy())
    const mockFocus = jest.fn()
      .mockImplementation((payload: FocusEvent) => expect(payload).toBeTruthy())
    const mockBlur = jest.fn()
      .mockImplementation((payload: FocusEvent) => expect(payload).toBeTruthy())
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField, mockInput, mockChange, mockFocus, mockBlur }
      },
      template: `
        <sm-input
          v-model="inputField"
          label="Password field"
          type="password"
          name="password"
          @input="mockInput"
          @change="mockChange"
          @focus="mockFocus"
          @blur="mockBlur"
        />`,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // VTL limitation in https://github.com/testing-library/dom-testing-library/issues/567
    const input = screen.getByLabelText('Password field')
    await waitFor(() => expect(input).toBeEnabled())
    expect(screen.getByText('Password field')).toBeVisible() // Visible label text
    expect(screen.getByRole('alert')).toHaveTextContent('')
    expect(input).toHaveDisplayValue('')
    expect(input).toHaveValue('')
    expect(mockInput).toHaveBeenCalledTimes(0)
    expect(mockChange).toHaveBeenCalledTimes(0)
    expect(mockFocus).toHaveBeenCalledTimes(0)
    expect(mockBlur).toHaveBeenCalledTimes(0)

    const testInput = 'Test value 123 !@#$$%^&*()-+='
    await userEvent.type(input, testInput)

    // Accepts alpha-numeric and special characters
    await waitFor(() => expect(input).toHaveDisplayValue(testInput))
    expect(input).toHaveValue(testInput)
    expect(mockInput).toHaveBeenCalledTimes(testInput.length)
    expect(mockFocus).toHaveBeenCalledTimes(1)
    expect(mockChange).toHaveBeenCalledTimes(0)
    expect(mockBlur).toHaveBeenCalledTimes(0)

    // Blur out of the field
    await userEvent.tab()

    // See https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
    expect(mockChange).toHaveBeenCalledTimes(1)
    expect(mockBlur).toHaveBeenCalledTimes(1)
  })

  it('should render input type provided - textarea', async () => {
    // ARRANGE
    const mockInput = jest.fn()
    const mockChange = jest.fn()
      .mockImplementation((payload: Event) => expect(payload).toBeTruthy())
    const mockFocus = jest.fn()
      .mockImplementation((payload: FocusEvent) => expect(payload).toBeTruthy())
    const mockBlur = jest.fn()
      .mockImplementation((payload: FocusEvent) => expect(payload).toBeTruthy())
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField, mockInput, mockChange, mockFocus, mockBlur }
      },
      template: `
        <sm-input
          v-model="inputField"
          label="Textarea field"
          type="textarea"
          maxlength="30"
          rows="10"
          name="textarea"
          @input="mockInput"
          @change="mockChange"
          @focus="mockFocus"
          @blur="mockBlur"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('textbox', { name: 'Textarea field' })
    await waitFor(() => expect(screen.getByLabelText('Textarea field')).toBeVisible())
    expect(screen.getByText('Textarea field')).toBeVisible() // Visible label text
    expect(screen.getByRole('alert')).toHaveTextContent('')
    expect(input).toHaveDisplayValue('')
    expect(input).toHaveValue('')
    expect(screen.queryByText('0/30')).not.toBeInTheDocument() // Counter is false by default
    expect(input).not.toHaveAttribute('resize')
    expect(mockInput).toHaveBeenCalledTimes(0)
    expect(mockChange).toHaveBeenCalledTimes(0)
    expect(mockFocus).toHaveBeenCalledTimes(0)
    expect(mockBlur).toHaveBeenCalledTimes(0)

    const testInput = 'Test value 123 !@#$$%^&*()-+='
    await userEvent.type(input, testInput)

    // Accepts alpha-numeric and special characters
    await waitFor(() => expect(input).toHaveDisplayValue(testInput))
    expect(input).toHaveValue(testInput)
    expect(mockInput).toHaveBeenCalledTimes(testInput.length)
    expect(mockFocus).toHaveBeenCalledTimes(1)
    expect(mockChange).toHaveBeenCalledTimes(0)
    expect(mockBlur).toHaveBeenCalledTimes(0)

    // Blur out of the field
    await userEvent.tab()

    // See https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
    expect(mockChange).toHaveBeenCalledTimes(1)
    expect(mockBlur).toHaveBeenCalledTimes(1)
  })

  it('should display the textarea counter when prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField }
      },
      template: `
        <sm-input
          v-model="inputField"
          label="Textarea field"
          type="textarea"
          maxlength="30"
          name="textarea"
          :counter="true"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('textbox', { name: 'Textarea field' })
    await waitFor(() => expect(screen.getByLabelText('Textarea field')).toBeVisible())
    expect(screen.getByText('Textarea field')).toBeVisible() // Visible label text
    expect(screen.getByText('0/30')).toBeVisible()

    // Type something
    await userEvent.type(input, '123')

    // Counter is updated
    await waitFor(() => expect(screen.getByText('3/30')).toBeVisible())
  })

  it('should render input type provided - number', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField }
      },
      template: '<sm-input v-model.number="inputField" label="Number field" type="number" name="number" />',
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('spinbutton', { name: 'Number field' })
    await waitFor(() => expect(screen.getByLabelText('Number field')).toBeVisible())
    expect(screen.getByText('Number field')).toBeVisible() // Visible label text
    expect(screen.getByRole('alert')).toHaveTextContent('')
    expect(input).toHaveDisplayValue('')
    expect(input).toHaveValue(null)

    // Accepts numeric characters only
    await userEvent.type(input, 'Test value 123 !@#$$%^&*()-+=')

    await waitFor(() => expect(input).toHaveDisplayValue('123'))
    expect(input).toHaveValue(123)

    // Add back when upstream issue is resolved in https://github.com/testing-library/user-event/issues/1066
    // But native number inputs can update value using arrow keys
    // await userEvent.click(input)
    // await userEvent.keyboard('{arrowup}') // Plus one step
    // expect(input).toHaveDisplayValue('124')
    // await userEvent.keyboard('{arrowdown}{arrowdown}') // Minus two steps
    // expect(input).toHaveDisplayValue('122')

    // Typing accepts numeric characters only
    // allowExponential is false by default so it will ignore 'e'
    await userEvent.clear(input)
    await userEvent.type(input, '1e3') // Exponential

    await waitFor(() => expect(input).toHaveDisplayValue('13'))
    expect(input).toHaveValue(13)

    // But pasting works
    await userEvent.paste('1e3') // Exponential

    await waitFor(() => expect(input).toHaveDisplayValue('131000')) // Field auto-converts value
    expect(input).toHaveValue(131000) // Field auto-converts value
  })

  // Add `step` prop testing once upstream issue is resolved in https://github.com/testing-library/user-event/issues/1066

  it('should allow exponential numbers when prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref('')

        return { inputField }
      },
      template: `
        <sm-input
          v-model="inputField"
          label="Number field"
          type="number"
          name="number"
          :allow-exponential="true"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('spinbutton', { name: 'Number field' })
    await waitFor(() => expect(screen.getByLabelText('Number field')).toBeVisible())
    expect(screen.getByText('Number field')).toBeVisible() // Visible label text
    expect(input).toHaveDisplayValue('')
    expect(input).toHaveValue(null)

    // Accepts letter e
    await userEvent.type(input, '1e2') // Exponential

    await waitFor(() => expect(input).toHaveDisplayValue('100')) // Field auto-converts value
    expect(input).toHaveValue(100) // Field auto-converts value
  })

  it('should render number controls when type is number and controls prop is true', async () => {
    // ARRANGE
    const mockInput = jest.fn()
    const mockChange = jest.fn()
      .mockImplementation((payload: Event) => expect(payload).toBeTruthy())
    const mockFocus = jest.fn()
      .mockImplementation((payload: FocusEvent) => expect(payload).toBeTruthy())
    const mockBlur = jest.fn()
      .mockImplementation((payload: FocusEvent) => expect(payload).toBeTruthy())
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref(5)

        return { inputField, mockBlur, mockChange, mockFocus, mockInput }
      },
      template: `
        <!--
          IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
          Was previously @input="mockInput"
        -->
        <sm-input
          v-model.number="inputField"
          label="Number field"
          type="number"
          :controls="true"
          name="number"
          @change="mockChange"
          @blur="mockBlur"
          @focus="mockFocus"
          @update:modelValue="mockInput"
        />
      `,
    }

    // ACT
    const { container } = render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('spinbutton', { name: 'Number field' })
    // The number controls are hidden in the DOM tree via `aria-hidden` and are not keyboard accessible
    // We need to check why this is the case first before changing the behaviour if we want it to be accessible
    const controlButtons = container.getElementsByClassName('sm-input__number-controls-button')
    const decrementButton = controlButtons[0]
    const incrementButton = controlButtons[1]
    await waitFor(() => expect(input).toHaveDisplayValue('5'))
    expect(input).toHaveValue(5)
    expect(incrementButton).toBeEnabled()
    expect(decrementButton).toBeEnabled()
    expect(mockChange).toHaveBeenCalledTimes(0)
    expect(mockFocus).toHaveBeenCalledTimes(0)
    expect(mockBlur).toHaveBeenCalledTimes(0)
    expect(mockInput).toHaveBeenCalledTimes(0)

    await userEvent.click(incrementButton)

    await waitFor(() => expect(input).toHaveDisplayValue('6'))
    expect(input).toHaveValue(6)
    expect(mockChange).toHaveBeenCalledTimes(1)
    expect(mockFocus).toHaveBeenCalledTimes(1)
    expect(mockBlur).toHaveBeenCalledTimes(1)
    expect(mockInput).toHaveBeenCalledTimes(1)

    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)

    await waitFor(() => expect(input).toHaveDisplayValue('4'))
    expect(input).toHaveValue(4)
    expect(mockChange).toHaveBeenCalledTimes(3)
    expect(mockFocus).toHaveBeenCalledTimes(3)
    expect(mockBlur).toHaveBeenCalledTimes(3)
    expect(mockInput).toHaveBeenCalledTimes(3)
  })

  it('should render disabled number controls when disableDecrement and/or disableIncrement props are true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref(5)

        return { inputField }
      },
      template: `
        <sm-input
          v-model.number="inputField"
          label="Number field"
          type="number"
          name="number"
          :controls="true"
          :disable-decrement="true"
          :disable-increment="true"
        />
      `,
    }

    // ACT
    const { container } = render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('spinbutton', { name: 'Number field' })
    // The number controls are hidden in the DOM tree via `aria-hidden` and are not keyboard accessible
    // We need to check why this is the case first before changing the behaviour if we want it to be accessible
    const controlButtons = container.getElementsByClassName('sm-input__number-controls-button')
    const decrementButton = controlButtons[0]
    const incrementButton = controlButtons[1]
    await waitFor(() => expect(input).toHaveDisplayValue('5'))
    expect(incrementButton).toBeDisabled()
    expect(decrementButton).toBeDisabled()

    await userEvent.click(incrementButton)
    await waitFor(() => expect(input).toHaveDisplayValue('5'))

    await userEvent.click(decrementButton)
    await waitFor(() => expect(input).toHaveDisplayValue('5'))
  })

  it('should render number controls with min and max control value when props are provided', async () => {
    // ARRANGE
    const mockChange = jest.fn()
      .mockImplementation((payload: Event) => expect(payload).toBeTruthy())
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref(4)

        return { inputField, mockChange }
      },
      template: `
        <sm-input
          v-model.number="inputField"
          label="Number field"
          type="number"
          name="number"
          :controls="true"
          :min-control-value="4"
          :max-control-value="5"
          @change="mockChange"
        />
      `,
    }

    // ACT
    const { container } = render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('spinbutton', { name: 'Number field' })
    // The number controls are hidden in the DOM tree via `aria-hidden` and are not keyboard accessible
    // We need to check why this is the case first before changing the behaviour if we want it to be accessible
    const controlButtons = container.getElementsByClassName('sm-input__number-controls-button')
    const decrementButton = controlButtons[0]
    const incrementButton = controlButtons[1]
    await waitFor(() => expect(input).toHaveDisplayValue('4'))
    expect(mockChange).toHaveBeenCalledTimes(0)

    await userEvent.click(incrementButton)
    await userEvent.click(incrementButton)
    await userEvent.click(incrementButton)

    // Should only increment once as 5 is max-control-value
    await waitFor(() => expect(input).toHaveDisplayValue('5'))
    expect(mockChange).toHaveBeenCalledTimes(1)

    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)

    // Should only decrement once as 4 is max-control-value
    await waitFor(() => expect(input).toHaveDisplayValue('4'))
    expect(mockChange).toHaveBeenCalledTimes(2)
  })

  it('should not render number controls when type is not number and controls prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref(5)

        return { inputField }
      },
      template: `
        <sm-input
          v-model="inputField"
          label="Text field"
          name="text"
          :controls="true"
        />
      `,
    }

    // ACT
    const { container } = render(ParentComponent)

    // ASSERT
    // The number controls are hidden in the DOM tree via `aria-hidden` and are not keyboard accessible
    // We need to check why this is the case first before changing the behaviour if we want it to be accessible
    const controlButtons = container.getElementsByClassName('sm-input__number-controls-button')
    await waitFor(() => expect(controlButtons.length).toBe(0))
  })

  it('should not allow + sign by default on input type number', async () => {
    // ARRANGE
    const mockInput = jest.fn()
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField, mockInput }
      },
      template: `
        <sm-input
          v-model="inputField"
          label="Number field"
          type="number"
          name="number"
          @input="mockInput"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('spinbutton', { name: 'Number field' })
    await waitFor(() => expect(screen.getByLabelText('Number field')).toBeVisible())
    expect(input).toHaveDisplayValue('')
    expect(input).toHaveValue(null)
    expect(mockInput).toHaveBeenCalledTimes(0)

    // Positive sign
    await userEvent.type(input, '+')

    await waitFor(() => expect(input).toHaveDisplayValue(''))
    expect(input).toHaveValue(null)
    expect(mockInput).toHaveBeenCalledTimes(0)

    // Positive number
    await userEvent.type(input, '+999')

    await waitFor(() => expect(input).toHaveDisplayValue('999')) // Field auto-converts value
    expect(input).toHaveValue(999) // Field auto-converts value
    expect(mockInput).toHaveBeenCalledTimes(3)
  })

  it('should not allow - sign by default on input type number', async () => {
    // ARRANGE
    const mockInput = jest.fn()
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField, mockInput }
      },
      template: `
        <sm-input
          v-model="inputField"
          label="Number field"
          type="number"
          name="number"
          @input="mockInput"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('spinbutton', { name: 'Number field' })
    await waitFor(() => expect(screen.getByLabelText('Number field')).toBeVisible())
    expect(screen.getByText('Number field')).toBeVisible() // Visible label text
    expect(input).toHaveDisplayValue('')
    expect(input).toHaveValue(null)

    // Negative sign
    await userEvent.type(input, '-') // Exponential

    await waitFor(() => expect(input).toHaveDisplayValue(''))
    expect(input).toHaveValue(null)

    // Negative number
    await userEvent.type(input, '-999')

    await waitFor(() => expect(input).toHaveDisplayValue('999')) // Field auto-converts value
    expect(input).toHaveValue(999) // Field auto-converts value
    expect(mockInput).toHaveBeenCalledTimes(3) // - is not emitted
  })

  it('should allow + sign on input type number when strictNumberTypeCheck is false', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField }
      },
      template: `
        <sm-input
          v-model="inputField"
          label="Number field"
          type="number"
          name="number"
          :strict-number-type-check="false"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('spinbutton', { name: 'Number field' })
    await waitFor(() => expect(screen.getByLabelText('Number field')).toBeVisible())
    expect(screen.getByText('Number field')).toBeVisible() // Visible label text
    expect(input).toHaveDisplayValue('')
    expect(input).toHaveValue(null)

    // Positive number
    await userEvent.type(input, '+1111')

    await waitFor(() => expect(input).toHaveDisplayValue('1111')) // Field auto-converts value
    expect(input).toHaveValue(1111) // Field auto-converts value
  })

  it('should allow - sign on input type number when strictNumberTypeCheck is false', async () => {
    // ARRANGE
    const mockInput = jest.fn()
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField, mockInput }
      },
      template: `
        <sm-input
          v-model="inputField"
          label="Number field"
          type="number"
          name="number"
          :strict-number-type-check="false"
          @input="mockInput"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('spinbutton', { name: 'Number field' })
    await waitFor(() => expect(screen.getByLabelText('Number field')).toBeVisible())
    expect(input).toHaveDisplayValue('')
    expect(input).toHaveValue(null)
    expect(mockInput).toHaveBeenCalledTimes(0)

    // Negative number
    await userEvent.type(input, '-9999')

    await waitFor(() => expect(input).toHaveDisplayValue('-9999')) // Field auto-converts value
    expect(input).toHaveValue(-9999) // Field auto-converts value
    expect(mockInput).toHaveBeenCalledTimes(5) // - sign is emitted
  })

  it('should attach the resize prop as style when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField }
      },
      template: `
        <sm-input
          v-model="inputField"
          label="Textarea field"
          type="textarea"
          resize="none"
          name="textarea"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('textbox', { name: 'Textarea field' })
    await waitFor(() => expect(screen.getByLabelText('Textarea field')).toBeVisible())
    expect(input).toHaveAttribute('resize', 'none')
  })

  it('should attach the custom class to native input when contentClass prop is provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField }
      },
      template: `
        <sm-input
          v-model="inputField"
          label="Input field"
          content-class="my-custom-class"
          name="input"
          :editable-cell="true"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('textbox', { name: 'Input field' })
    await waitFor(() => expect(input).toBeEnabled())
    expect(input).toHaveClass('my-custom-class')
  })

  it('should not allow typing characters beyond the provided maxlength prop', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField }
      },
      template: '<sm-input v-model="inputField" label="Input field" :maxlength="3" name="text" />',
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('textbox', { name: 'Input field' })
    await waitFor(() => expect(screen.getByLabelText('Input field')).toBeVisible())
    expect(screen.getByRole('alert')).toHaveTextContent('')
    expect(input).toHaveDisplayValue('')

    await userEvent.type(input, '1234567890')

    // Cut off after the maxlength
    await waitFor(() => expect(input).toHaveDisplayValue('123'))
    expect(screen.getByRole('alert')).toHaveTextContent('')
  })

  it('should hide the label text when labelHidden is set to true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField }
      },
      template: '<sm-input v-model="inputField" label="Input field" :label-hidden="true" name="text" />',
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Input field' })).toBeEnabled()) // Still accessible
    expect(screen.getByLabelText('Input field')).toBeVisible()
    expect(screen.queryByText('Input field')).not.toBeInTheDocument() // But text is not visible
    expect(screen.getByRole('alert')).toHaveTextContent('')
  })

  it('should attach non-prop attributes to native input element when provided on the input field', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField }
      },
      template: `
        <!-- Placeholder isn't an official prop -->
        <sm-input
          v-model="inputField"
          label="Input field"
          placeholder="Placeholder text..."
          auto-complete="username"
          name="username-name"
          id="username-id"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('textbox', { name: 'Input field' })
    await waitFor(() => expect(screen.getByLabelText('Input field')).toBeVisible())
    expect(screen.getByPlaceholderText('Placeholder text...')).toBeVisible()
    expect(input).toHaveAttribute('autocomplete', 'username')
    expect(input).toHaveAttribute('name', 'username-name')
    expect(input).toHaveAttribute('id', 'username-id')
  })

  it('should add a suffix icon when prop is provided and attach default events', async () => {
    // ARRANGE
    const mockFocus = jest.fn()
      .mockImplementation((payload: FocusEvent) => expect(payload).toBeTruthy())
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField, mockFocus }
      },
      template: `
        <sm-input
          v-model="inputField"
          label="Input field"
          suffix-icon="action-search"
          name="text"
          @focus="mockFocus"
        />
      `,
    }

    // ACT
    const { container } = render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('textbox', { name: 'Input field' })
    await waitFor(() => expect(input).not.toHaveFocus())
    expect(mockFocus).toHaveBeenCalledTimes(0)

    // By default, clicking on the icon focuses on the input field
    // The icon is wrapped in clickable span, we need to evaluate first if we want it to be accessible
    await userEvent.click(container.getElementsByClassName('sm-input__suffix-icon')[0])

    await waitFor(() => expect(input).toHaveFocus())
    expect(mockFocus).toHaveBeenCalledTimes(1)
  })

  it('should add a prefix icon when prop is provided and attach default events', async () => {
    // ARRANGE
    const mockFocus = jest.fn()
      .mockImplementation((payload: FocusEvent) => expect(payload).toBeTruthy())
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField, mockFocus }
      },
      template: `
        <sm-input
          v-model="inputField"
          label="Input field"
          prefix-icon="action-search"
          name="text"
          @focus="mockFocus"
        />
      `,
    }

    // ACT
    const { container } = render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('textbox', { name: 'Input field' })
    await waitFor(() => expect(input).not.toHaveFocus())
    expect(mockFocus).toHaveBeenCalledTimes(0)

    // By default, clicking on the icon focuses on the input field
    // The icon is wrapped in clickable span, we need to evaluate first if we want it to be accessible
    await userEvent.click(container.getElementsByClassName('sm-input__prefix-icon')[0])

    await waitFor(() => expect(input).toHaveFocus())
    expect(mockFocus).toHaveBeenCalledTimes(1)
  })

  it('should add suffix and prefix icons and custom icon events when props are provided', async () => {
    // ARRANGE
    const mockIconClick = jest.fn()
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField, mockIconClick }
      },
      template: `
        <sm-input
          v-model="inputField"
          label="Input field"
          prefix-icon="action-user"
          suffix-icon="action-search"
          name="text"
          :icon-event-binding="{ click: mockIconClick }"
        />
      `,
    }

    // ACT
    const { container } = render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('textbox', { name: 'Input field' })
    await waitFor(() => expect(input).not.toHaveFocus())
    expect(mockIconClick).toHaveBeenCalledTimes(0)

    // The icon is wrapped in clickable span, we need to evaluate first if we want it to be accessible
    await userEvent.click(container.getElementsByClassName('sm-input__prefix-icon')[0])

    await waitFor(() => expect(input).not.toHaveFocus()) // Override default icon event
    expect(mockIconClick).toHaveBeenCalledTimes(1)

    // The icon is wrapped in clickable span, we need to evaluate first if we want it to be accessible
    await userEvent.click(container.getElementsByClassName('sm-input__suffix-icon')[0])

    await waitFor(() => expect(input).not.toHaveFocus()) // Override default icon event
    expect(mockIconClick).toHaveBeenCalledTimes(2)
  })

  it('should attach custom input events when prop is provided', async () => {
    // ARRANGE
    const mockKeydown = jest.fn()
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        mockKeydown.mockImplementation((e: KeyboardEvent) => {
          if (e.key === 'l') {
            e.preventDefault()
          }
        })

        return { inputField, mockKeydown }
      },
      template: `
        <sm-input
          v-model="inputField"
          label="Input field"
          name="text"
          :event-binding="{ keydown: mockKeydown }"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('textbox', { name: 'Input field' })
    await waitFor(() => expect(input).toHaveDisplayValue(''))
    expect(mockKeydown).toHaveBeenCalledTimes(0)

    await userEvent.type(input, 'Hello')

    await waitFor(() => expect(input).toHaveDisplayValue('Heo'))
    expect(mockKeydown).toHaveBeenCalledTimes(5)
  })

  it('should not allow input field to be edited when readonly prop is true', async () => {
    // ARRANGE
    const mockInput = jest.fn()
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField, mockInput }
      },
      template: `
        <sm-input
          v-model="inputField"
          label="Input field"
          readonly
          name="text"
          @input="mockInput"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('textbox', { name: 'Input field' })
    await waitFor(() => expect(input).toHaveDisplayValue(''))
    expect(mockInput).toHaveBeenCalledTimes(0)

    await userEvent.type(input, 'Hello')

    await waitFor(() => expect(input).toHaveDisplayValue(''))
    expect(mockInput).toHaveBeenCalledTimes(0)
  })

  it('should set the field as disabled when prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField }
      },
      template: '<sm-input v-model="inputField" label="Disabled field" :disabled="true" name="text" />',
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('textbox', { name: 'Disabled field' })
    await waitFor(() => expect(input).toBeDisabled())
    expect(screen.getByLabelText('Disabled field')).toBeVisible()
    expect(screen.getByText('Disabled field')).toBeVisible() // Visible text
    expect(screen.getByRole('alert')).toHaveTextContent('')
  })

  it('should set the field as disabled when parent sm-form is disabled', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmForm, SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField }
      },
      template: `
        <sm-form :disabled="true">
          <sm-input v-model="inputField" label="Input field" name="text" />
        </sm-form>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const input = screen.getByRole('textbox', { name: 'Input field' })
    await waitFor(() => expect(input).toBeDisabled())
    expect(screen.getByLabelText('Input field')).toBeVisible()
    expect(screen.getByText('Input field')).toBeVisible() // Visible text
    expect(screen.getByRole('alert')).toHaveTextContent('')
  })

  it('should display the help text when prop is provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmInput },
      setup: () => {
        const inputField = ref()

        return { inputField }
      },
      template: `
        <sm-input
          v-model="inputField"
          label="Input field"
          help-text="Help text here"
          name="text"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Help text here')).toBeVisible())
  })

  describe('validation', () => {

    // For Vue3: There are no inferred rules, we are explicitly passing the rule now
    // it('should trigger inferred validation when minlength prop is provided', async () => {
    it('should trigger min validation when rules prop is configured', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmInput },
        setup: () => {
          const inputField = ref()

          // See https://vee-validate.logaretm.com/v4/guide/global-validators#min
          defineRule('min', min)

          return { inputField }
        },
        template: '<sm-input v-model="inputField" label="Input field" minlength="3" name="text" rules="min:3" />',
      }

      // ACT
      render(ParentComponent)

      const input = screen.getByRole('textbox', { name: 'Input field' })
      const alert = screen.getByRole('alert')

      // ASSERT
      await waitFor(() => expect(screen.getByLabelText('Input field')).toBeVisible())
      expect(alert).toHaveTextContent('')
      expect(alert).toHaveAttribute('aria-live', 'off')
      expect(input).toHaveDisplayValue('')
      expect(input).toBeValid()

      // Trigger validation error
      await userEvent.type(input, '1')

      await waitFor(() => expect(alert).toHaveTextContent('This is a custom min field message'))
      expect(screen.getByText('This is a custom min field message')).toBeVisible()
      expect(alert).toHaveAttribute('aria-live', 'assertive') // Error should be announced to screen reader
      expect(input).toHaveDisplayValue('1')
      expect(input).toBeInvalid()

      // Clear validation error by reaching min length
      await userEvent.type(input, '23')

      await waitFor(() => expect(alert).toHaveTextContent(''))
      expect(screen.queryByText('This is a custom min field message')).not.toBeInTheDocument()
      expect(alert).toHaveAttribute('aria-live', 'off')
      expect(input).toHaveDisplayValue('123')
      expect(input).toBeValid()
    })

    // For Vue3: There are no inferred rules, we are explicitly passing the rule now
    // it('should trigger inferred validation when input type is email', async () => {
    it('should trigger email validation when rules prop is configured', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmInput },
        setup: () => {
          const inputField = ref()

          // See https://vee-validate.logaretm.com/v4/guide/global-validators#email
          defineRule('email', email)

          return { inputField }
        },
        template: '<sm-input v-model="inputField" label="Email field" type="email" name="email" rules="email" />',
      }

      // ACT
      render(ParentComponent)

      const input = screen.getByRole('textbox', { name: 'Email field' })
      const alert = screen.getByRole('alert')

      // ASSERT
      await waitFor(() => expect(screen.getByLabelText('Email field')).toBeVisible())
      expect(alert).toHaveTextContent('')
      expect(alert).toHaveAttribute('aria-live', 'off')
      expect(input).toHaveDisplayValue('')
      expect(input).toBeValid()

      // Trigger validation error
      await userEvent.type(input, 'test')

      await waitFor(() => expect(alert).toHaveTextContent('This is a custom email field message'))
      expect(screen.getByText('This is a custom email field message')).toBeVisible()
      expect(alert).toHaveAttribute('aria-live', 'assertive') // Error should be announced to screen reader
      expect(input).toHaveDisplayValue('test')
      expect(input).toBeInvalid()

      // Clear validation error by providing valid email
      await userEvent.type(input, '@hello.com')

      await waitFor(() => expect(alert).toHaveTextContent(''))
      expect(screen.queryByText('This is a custom email field message')).not.toBeInTheDocument()
      expect(alert).toHaveAttribute('aria-live', 'off')
      expect(input).toHaveDisplayValue('test@hello.com')
      expect(input).toBeValid()
    })

    // For Vue3: There are no inferred rules, we are explicitly passing the rule now
    // it('should trigger inferred validation when input type is number with min prop', async () => {
    it('should trigger min_value validation when rules prop is configured', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmInput },
        setup: () => {
          const inputField = ref()

          // See https://vee-validate.logaretm.com/v4/guide/global-validators#min_value
          defineRule('min_value', minValue)

          return { inputField }
        },
        template: '<sm-input v-model="inputField" label="Number field" type="number" min="10" name="number" rules="min_value:10" />',
      }

      // ACT
      render(ParentComponent)

      const input = screen.getByRole('spinbutton', { name: 'Number field' })
      const alert = screen.getByRole('alert')

      // ASSERT
      await waitFor(() => expect(screen.getByLabelText('Number field')).toBeVisible())
      expect(alert).toHaveTextContent('')
      expect(alert).toHaveAttribute('aria-live', 'off')
      expect(input).toHaveDisplayValue('')
      expect(input).toBeValid()

      // Trigger validation error
      await userEvent.type(input, '1')

      await waitFor(() => expect(alert).toHaveTextContent('This is a custom min_value field message'))
      expect(screen.getByText('This is a custom min_value field message')).toBeVisible()
      expect(alert).toHaveAttribute('aria-live', 'assertive') // Error should be announced to screen reader
      expect(input).toHaveDisplayValue('1')
      expect(input).toBeInvalid()

      // Clear validation error by typing min value (10)
      await userEvent.type(input, '0')

      await waitFor(() => expect(alert).toHaveTextContent(''))
      expect(screen.queryByText('This is a custom min_value field message')).not.toBeInTheDocument()
      expect(alert).toHaveAttribute('aria-live', 'off')
      expect(input).toHaveDisplayValue('10')
      expect(input).toBeValid()
    })

    // For Vue3: There are no inferred rules, we are explicitly passing the rule now
    // it('should trigger inferred validation when input type is number with max prop', async () => {
    it('should trigger max_value validation when rules prop is configured', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmInput },
        setup: () => {
          const inputField = ref()

          // Inferred rule which will trigger even without rules prop
          // https://vee-validate.logaretm.com/v2/guide/inferred-rules.html#inferred-rules-reference
          defineRule('max_value', maxValue)

          return { inputField }
        },
        template: '<sm-input v-model="inputField" label="Number field" type="number" :max="100" name="number" :rules="{ max_value: 100 }" />',
      }

      // ACT
      render(ParentComponent)

      const input = screen.getByRole('spinbutton', { name: 'Number field' })
      const alert = screen.getByRole('alert')

      // ASSERT
      await waitFor(() => expect(screen.getByLabelText('Number field')).toBeVisible())
      expect(alert).toHaveTextContent('')
      expect(alert).toHaveAttribute('aria-live', 'off')
      expect(input).toHaveDisplayValue('')
      expect(input).toBeValid()

      // Trigger validation error
      await userEvent.type(input, '999')

      await waitFor(() => expect(alert).toHaveTextContent('This is a custom max_value field message'))
      expect(screen.getByText('This is a custom max_value field message')).toBeVisible()
      expect(alert).toHaveAttribute('aria-live', 'assertive') // Error should be announced to screen reader
      expect(input).toHaveDisplayValue('999')
      expect(input).toBeInvalid()

      // Clear validation error by removing third digit
      await userEvent.keyboard('{backspace}')

      await waitFor(() => expect(alert).toHaveTextContent(''))
      expect(screen.queryByText('This is a custom max_value field message')).not.toBeInTheDocument()
      expect(alert).toHaveAttribute('aria-live', 'off')
      expect(input).toHaveDisplayValue('99')
      expect(input).toBeValid()
    })

    it('should trigger validation when rules prop is provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmInput },
        setup: () => {
          const inputField = ref()

          defineRule('required', required)

          return { inputField }
        },
        template: `
          <sm-input v-model="inputField" label="Input field" name="textbox" :rules="{ required: true }" />
        `,
      }

      // ACT
      render(ParentComponent)

      const input = screen.getByRole('textbox', { name: 'Input field' })
      const alert = screen.getByRole('alert')

      // ASSERT
      await waitFor(() => expect(screen.getByLabelText('Input field')).toBeVisible())
      expect(screen.getByText('Input field')).toBeVisible() // Visible label text
      expect(alert).toHaveTextContent('')
      expect(alert).toHaveAttribute('aria-live', 'off')
      expect(input).toHaveDisplayValue('')
      expect(screen.getByText('*')).toBeVisible()
      expect(input).toBeValid()

      // Trigger validation error by focusing then blurring out of the field
      await userEvent.click(input)
      await userEvent.tab()

      await waitFor(() => expect(alert).toHaveTextContent('This is a custom required field message'))
      expect(screen.getByText('This is a custom required field message')).toBeVisible()
      expect(alert).toHaveAttribute('aria-live', 'assertive') // Error should be announced to screen reader
      expect(input).toHaveDisplayValue('')
      expect(input).toBeInvalid()

      // Clear validation error by providing some value
      await userEvent.type(input, 'value')

      await waitFor(() => expect(alert).toHaveTextContent(''))
      expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()
      expect(alert).toHaveAttribute('aria-live', 'off')
      expect(input).toHaveDisplayValue('value')
      expect(input).toBeValid()

      // Clear the field to trigger validation again
      await userEvent.clear(input)

      await waitFor(() => expect(input).toBeInvalid())
      expect(input).toHaveAccessibleErrorMessage('This is a custom required field message')
    })

    it('should not add validation error when errorDisabled prop is true - text', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmInput },
        setup: () => {
          const inputField = ref()

          defineRule('required', required)

          return { inputField }
        },
        template: `
          <sm-input
            v-model="inputField"
            ref="inputRef"
            label="Input field"
            rules="required"
            name="textbox"
            :error-disabled="true"
          />
        `,
      }

      // ACT
      render(ParentComponent)

      const input = screen.getByRole('textbox', { name: 'Input field' })

      // ASSERT
      await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
      expect(screen.getByText('*')).toBeVisible()
      expect(input).toBeValid()

      // Trigger validation error by focusing then blurring out of the field
      await userEvent.click(input)
      await userEvent.tab()

      // No error shown, but should still be validated
      await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
      expect(input).toBeInvalid()
    })

    it('should not add validation error when errorDisabled prop is true - textarea', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmInput },
        setup: () => {
          const inputField = ref()

          defineRule('required', required)

          return { inputField }
        },
        template: `
          <sm-input
            v-model="inputField"
            ref="inputRef"
            label="Input field"
            rules="required"
            type="textarea"
            name="textbox"
            :error-disabled="true"
          />
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const input = screen.getByRole('textbox', { name: 'Input field' })
      await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
      expect(screen.getByText('*')).toBeVisible()
      expect(input).toBeValid()

      // Trigger validation error by focusing then blurring out of the field
      await userEvent.click(input)
      await userEvent.tab()

      // No error shown, but should still be validated
      await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
      expect(input).toBeInvalid()
    })

    // Aggressive is the default behaviour
    it('should validate on input events when mode is set to aggressive', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmInput },
        setup: () => {
          const inputField = ref(1)

          // https://vee-validate.logaretm.com/v4/guide/global-validators#between
          defineRule('between', between)

          return { inputField }
        },
        template: `
          <sm-input
            v-model="inputField"
            label="Number field"
            type="number"
            name="between-field"
            rules="between:2,11"
          />
        `,
      }

      // ACT
      render(ParentComponent)

      const input = screen.getByRole('spinbutton', { name: 'Number field' })
      const alert = screen.getByRole('alert')

      // ASSERT
      // No validation error on initial value
      await waitFor(() => expect(alert).toHaveTextContent(''))
      expect(screen.queryByText('This is a custom between field message')).not.toBeInTheDocument()
      expect(alert).toHaveAttribute('aria-live', 'off')
      expect(input).toHaveDisplayValue('1')
      expect(input).toBeValid()

      // Trigger validation error on input
      await userEvent.clear(input)
      await userEvent.type(input, '1')

      await waitFor(() => expect(alert).toHaveTextContent('This is a custom between field message'))
      expect(screen.getByText('This is a custom between field message')).toBeVisible()
      expect(alert).toHaveAttribute('aria-live', 'assertive') // Error should be announced to screen reader
      expect(input).toHaveDisplayValue('1')
      expect(input).toBeInvalid()

      // Clear validation error by providing value within the `between` rule
      await userEvent.type(input, '1')

      await waitFor(() => expect(alert).toHaveTextContent(''))
      expect(screen.queryByText('This is a custom between field message')).not.toBeInTheDocument()
      expect(alert).toHaveAttribute('aria-live', 'off')
      expect(input).toHaveDisplayValue('11')
      expect(input).toBeValid()
    })

    // Interaction modes are deprecated in vee-validate@4 but implemented the lazy mode back
    it('should validate on blur when mode is set to lazy', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmInput },
        setup: () => {
          const inputField = ref()

          defineRule('email', email)

          return { inputField }
        },
        template: `
          <sm-input
            v-model="inputField"
            label="Email field"
            type="email"
            name="email"
            rules="email"
            mode="lazy"
          />`,
      }

      // ACT
      render(ParentComponent)

      const input = screen.getByRole('textbox', { name: 'Email field' })
      const alert = screen.getByRole('alert')

      // ASSERT
      await waitFor(() => expect(alert).toHaveTextContent(''))
      expect(alert).toHaveAttribute('aria-live', 'off')
      expect(input).toHaveDisplayValue('')
      expect(input).toBeValid()

      // Not a valid email, but shouldn't trigger error yet
      await userEvent.type(input, 'test')

      await waitFor(() => expect(alert).toHaveTextContent(''))
      expect(screen.queryByText('This is a custom email field message')).not.toBeInTheDocument()
      expect(alert).toHaveAttribute('aria-live', 'off')
      expect(input).toHaveDisplayValue('test')

      // Blur out of the field to trigger validation
      await userEvent.tab()

      await waitFor(() => expect(alert).toHaveTextContent('This is a custom email field message'))
      expect(screen.getByText('This is a custom email field message')).toBeVisible()
      expect(alert).toHaveAttribute('aria-live', 'assertive') // Error should be announced to screen reader
      expect(input).toHaveDisplayValue('test')
      expect(input).toBeInvalid()

      // Valid email, but shouldn't trigger validation yet
      await userEvent.type(input, '@hello.com')

      await waitFor(() => expect(alert).toHaveTextContent('This is a custom email field message'))
      expect(screen.getByText('This is a custom email field message')).toBeVisible()
      expect(alert).toHaveAttribute('aria-live', 'assertive') // Error should be announced to screen reader
      expect(input).toHaveDisplayValue('test@hello.com')
      expect(input).toBeInvalid()

      // Blur out of the field to trigger validation
      await userEvent.tab()

      await waitFor(() => expect(alert).toHaveTextContent(''))
      expect(screen.queryByText('This is a custom email field message')).not.toBeInTheDocument()
      expect(alert).toHaveAttribute('aria-live', 'off')
      expect(input).toHaveDisplayValue('test@hello.com')
      expect(input).toBeValid()
    })

    it('should perform cross-field validation when name and rules are provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmForm, SmInput },
        setup: () => {
          const inputFieldOne = ref()
          const inputFieldTwo = ref()

          defineRule('required', required)

          defineRule('confirmPassword', (value: string, [target]: [string]) => {
            if (value === target) {
              return true
            }

            return 'Password confirmation does not match'
          })

          return { inputFieldOne, inputFieldTwo }
        },
        template: `
          <!-- The sm-form here is needed to make cross-field validation work -->
          <sm-form>
            <sm-input
              v-model="inputFieldOne"
              label="Password"
              name="password"
              rules="required|confirmPassword:@confirm"
            />
            <sm-input
              v-model="inputFieldTwo"
              label="Confirm password"
              rules="required"
              name="confirm"
            />
          </sm-form>
        `,
      }

      // ACT
      render(ParentComponent)

      const input1 = screen.getByRole('textbox', { name: 'Password' })
      const input2 = screen.getByRole('textbox', { name: 'Confirm password' })
      const alerts = screen.getAllByRole('alert')

      // ASSERT
      await waitFor(() => expect(alerts.at(0)).toHaveTextContent(''))
      expect(alerts.at(0)).toHaveAttribute('aria-live', 'off')
      expect(alerts.at(1)).toHaveTextContent('')
      expect(alerts.at(1)).toHaveAttribute('aria-live', 'off')

      // Type first password, should validate with error
      await userEvent.type(input1, 'some-password')

      await waitFor(() => expect(alerts.at(0)).toHaveTextContent('Password confirmation does not match'))
      expect(alerts.at(0)).toHaveAttribute('aria-live', 'assertive') // Error should be announced to screen reader
      expect(alerts.at(1)).toHaveTextContent('')
      expect(alerts.at(1)).toHaveAttribute('aria-live', 'off')

      // Type first half of confirmation password, should still be invalid
      await userEvent.type(input2, 'some-')

      await waitFor(() => expect(alerts.at(0)).toHaveTextContent('Password confirmation does not match'))
      expect(alerts.at(0)).toHaveAttribute('aria-live', 'assertive') // Error should be announced to screen reader
      expect(alerts.at(1)).toHaveTextContent('')
      expect(alerts.at(1)).toHaveAttribute('aria-live', 'off')

      // Type second half of confirmation password, should validate again
      await userEvent.type(input2, 'password')

      await waitFor(() => expect(alerts.at(0)).toHaveTextContent(''))
      expect(alerts.at(0)).toHaveAttribute('aria-live', 'off')
      expect(alerts.at(1)).toHaveTextContent('')
      expect(alerts.at(1)).toHaveAttribute('aria-live', 'off')
    })

  })

  describe('slots', () => {

    it('should render the label slot when provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmInput },
        setup: () => {
          const inputField = ref()

          return { inputField }
        },
        template: `
          <sm-input v-model="inputField" name="text">
            <template #label>Label slot</template>
          </sm-input>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('textbox', { name: 'Label slot' })).toBeEnabled())
      expect(screen.getByLabelText('Label slot')).toBeVisible()
      expect(screen.getByText('Label slot')).toBeVisible() // Visible text label
    })

    it('should render the label slot when provided even if label prop is available too', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmInput },
        setup: () => {
          const inputField = ref()

          return { inputField }
        },
        template: `
          <sm-input v-model="inputField" label="Label prop" name="text">
            <template #label>Label slot</template>
          </sm-input>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('textbox', { name: 'Label prop' })).toBeEnabled())
      expect(screen.getByLabelText('Label prop')).toBeVisible() // Mapped to aria-label
      expect(screen.getByText('Label slot')).toBeVisible() // Visible text label
    })

    it('should render the action slot when provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmInput },
        setup: () => {
          const inputField = ref()

          return { inputField }
        },
        template: `
          <sm-input v-model="inputField" label="Input field" name="text">
            <template #action>Action slot</template>
          </sm-input>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('textbox', { name: 'Input field' })).toBeEnabled())
      expect(screen.getByLabelText('Input field')).toBeVisible()
      expect(screen.getByText('Input field')).toBeVisible() // Visible text label
      expect(screen.getByText('Action slot')).toBeVisible()
    })

    it('should render the prefix slot when provided - text', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmInput, SmInputPrefixContent },
        setup: () => {
          const inputField = ref()

          return { inputField }
        },
        template: `
          <sm-input
            v-model="inputField"
            label="Input field"
            prefix-width="200px"
            prefix-icon="action-user"
            name="text"
          >
            <template #prefix>
              <sm-input-prefix-content>Prefix slot</sm-input-prefix-content>
            </template>
          </sm-input>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('textbox', { name: 'Input field' })).toBeEnabled())
      expect(screen.getByLabelText('Input field')).toBeVisible()
      expect(screen.getByText('Input field')).toBeVisible() // Visible text label
      expect(screen.getByText('Prefix slot')).toBeVisible()
    })

    it('should render the suffix slot when provided - text', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmInput, SmInputSuffixContent },
        setup: () => {
          const inputField = ref()

          return { inputField }
        },
        template: `
          <sm-input
            v-model="inputField"
            label="Input field"
            suffix-width="200px"
            prefix-icon="action-user"
            name="text"
          >
            <template #suffix>
              <sm-input-suffix-content>Suffix slot</sm-input-suffix-content>
            </template>
          </sm-input>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('textbox', { name: 'Input field' })).toBeEnabled())
      expect(screen.getByLabelText('Input field')).toBeVisible()
      expect(screen.getByText('Input field')).toBeVisible() // Visible text label
      expect(screen.getByText('Suffix slot')).toBeVisible()
    })

  })

})
