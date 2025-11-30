import userEvent from '@testing-library/user-event'
import { defineRule, configure } from 'vee-validate'
import { localize } from '@vee-validate/i18n'
import { required } from '@vee-validate/rules'
import { render, screen, waitFor } from '@testing-library/vue'
import { ref } from 'vue'
import SmTranslationsInput from './sm-translations-input.vue'
import { SmTranslationsInputSupportedTranslation } from '.'

const supportedTranslationsMock: SmTranslationsInputSupportedTranslation[] = [
  {
    code: 'en',
    translationLabel: 'English translation',
    dropdownLabel: 'English',
  },
  {
    code: 'es',
    translationLabel: 'Spanish translation',
    dropdownLabel: 'Spanish',
  },
  {
    code: 'de',
    translationLabel: 'German translation',
    dropdownLabel: 'German',
  },
  {
    code: 'fr',
    translationLabel: 'French translation',
    dropdownLabel: 'French',
  },
  {
    code: 'pt',
    translationLabel: 'Portuguese translation',
    dropdownLabel: 'Portuguese',
  },
  {
    code: 'it',
    translationLabel: 'Italian translation',
    dropdownLabel: 'Italian',
  },
  {
    code: 'zh',
    translationLabel: 'Chinese translation',
    dropdownLabel: 'Chinese',
  },
]

const renderComponent = (component: unknown): void => {
  render(component)
}

describe('SmTranslationsInput', () => {

  beforeAll(() => {
    defineRule('required', required)

    configure({
      generateMessage: localize('en', {
        messages: {
          required: 'This is a custom required field message',
        },
      }),
    })
  })

  it('should initialize the component with empty value', async () => {
    // ARRANGE
    const inputMock = jest.fn()
    const ParentComponent = {
      components: { SmTranslationsInput },
      setup: () => {
        const inputValues = ref([
          { code: 'fr', value: '' }, // default language
        ])

        return { inputValues, supportedTranslationsMock, inputMock }
      },
      template: `
        <sm-translations-input
          v-model="inputValues"
          label="Room type name"
          name="room-type"
          placeholder="Enter your room type name"
          default-language="fr"
          :supported-translations="supportedTranslationsMock"
          @update:model-value="inputMock"
        />
      `,
    }

    // ACT
    renderComponent(ParentComponent)

    const input = screen.getByLabelText('Room type name')

    // Open the language dropdown selection
    await userEvent.click(screen.getByRole('button', { name: 'Add translations' }))

    // ASSERT
    // Check initial states
    expect(await screen.findByPlaceholderText('Enter your room type name')).toBeVisible()
    expect(screen.getByRole('textbox')).toBeInTheDocument() // No other created inputs aside from default lang
    expect(input).toBeVisible()
    expect(input).toHaveValue('')

    // Check the dropdown options
    // We query by text because they are not accessible, but these should be improved in the future
    expect(screen.getByText('English')).toBeVisible()
    expect(screen.getByText('Spanish')).toBeVisible()
    expect(screen.getByText('German')).toBeVisible()
    expect(screen.getByText('Portuguese')).toBeVisible()
    expect(screen.getByText('Italian')).toBeVisible()
    expect(screen.getByText('Chinese')).toBeVisible()
    expect(screen.queryByText('French')).not.toBeInTheDocument() // Default language should not show up

    // Type into the default field and check the side effects
    await userEvent.type(input, 'fr first edit')
    await waitFor(() => expect(inputMock).toHaveBeenCalledTimes(13))
    expect(inputMock).toHaveBeenLastCalledWith([{ code: 'fr', value: 'fr first edit' }])
    expect(input).toHaveValue('fr first edit')
  })

  it('should initialize the component with pre-filled values', async () => {
    // ARRANGE
    const inputMock = jest.fn()
    const ParentComponent = {
      components: { SmTranslationsInput },
      setup: () => {
        const inputValues = ref([
          { code: 'fr', value: 'fr initial' }, // default language
          { code: 'es', value: 'es initial' },
        ])

        return { inputValues, supportedTranslationsMock, inputMock }
      },
      template: `
        <sm-translations-input
          v-model="inputValues"
          label="Room type name"
          name="room-type"
          placeholder="Enter your room type name"
          default-language="fr"
          :supported-translations="supportedTranslationsMock"
          @update:model-value="inputMock"
        />
      `,
    }

    // ACT
    renderComponent(ParentComponent)

    const defaultInput = screen.getByLabelText('Room type name')
    const spanishInput = screen.getByLabelText('Spanish translation')

    // Open the language dropdown selection
    await userEvent.click(screen.getByRole('button', { name: 'Add translations' }))

    // ASSERT
    // Check initial states
    expect(await screen.findAllByRole('textbox')).toHaveLength(2) // Default (French) and pre-filled (Spanish)
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument() // Delete button for Spanish field
    expect(screen.getByPlaceholderText('Enter your room type name')).toBeVisible()
    expect(defaultInput).toBeVisible()
    expect(defaultInput).toHaveValue('fr initial')
    expect(spanishInput).toBeVisible()
    expect(spanishInput).toHaveValue('es initial')

    // Check the dropdown options
    // We query by text because they are not accessible, but these should be improved in the future
    expect(screen.getByText('English')).toBeVisible()
    expect(screen.getByText('German')).toBeVisible()
    expect(screen.getByText('Portuguese')).toBeVisible()
    expect(screen.getByText('Italian')).toBeVisible()
    expect(screen.getByText('Chinese')).toBeVisible()
    expect(screen.queryByText('French')).not.toBeInTheDocument() // Default language should not show up
    expect(screen.queryByText('Spanish')).not.toBeInTheDocument() // Pre-filled language should not show up

    // Type into the default field and check the side effects
    await userEvent.type(defaultInput, ' - edit')
    await waitFor(() => expect(defaultInput).toHaveValue('fr initial - edit'))
    expect(spanishInput).toHaveValue('es initial')
    expect(inputMock).toHaveBeenLastCalledWith([
      { code: 'fr', value: 'fr initial - edit' },
      { code: 'es', value: 'es initial' },
    ])

    // Type into the Spanish field and check the side effects
    await userEvent.type(spanishInput, ' - edit')
    await waitFor(() => expect(defaultInput).toHaveValue('fr initial - edit'))
    expect(spanishInput).toHaveValue('es initial - edit')
    expect(inputMock).toHaveBeenLastCalledWith([
      { code: 'fr', value: 'fr initial - edit' },
      { code: 'es', value: 'es initial - edit' },
    ])
  })

  it('should create input field when language is chosen from the dropdown', async () => {
    // ARRANGE
    const inputMock = jest.fn()
    const ParentComponent = {
      components: { SmTranslationsInput },
      setup: () => {
        const inputValues = ref([
          { code: 'fr', value: '' }, // default language
        ])

        return { inputValues, supportedTranslationsMock, inputMock }
      },
      template: `
        <sm-translations-input
          v-model="inputValues"
          label="Room type name"
          name="room-type"
          placeholder="Enter your room type name"
          default-language="fr"
          :supported-translations="supportedTranslationsMock"
          @update:model-value="inputMock"
        />
      `,
    }

    // ACT
    renderComponent(ParentComponent)

    // Open the language dropdown selection and select one
    // We query by text because they are not accessible, but these should be improved in the future
    const dropdownButton = screen.getByRole('button', { name: 'Add translations' })
    await userEvent.click(dropdownButton)
    await userEvent.click(screen.getByText('Italian'))

    const defaultInput = screen.getByLabelText('Room type name')
    const italianInput = screen.getByLabelText('Italian translation')

    // ASSERT
    // Check initial states
    await waitFor(() => expect(screen.getAllByRole('textbox')).toHaveLength(2)) // Default (French) and created (Italian)
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument() // Delete button for the created field
    expect(screen.getByPlaceholderText('Enter your room type name')).toBeVisible()
    expect(defaultInput).toBeVisible()
    expect(defaultInput).toHaveValue('')
    expect(italianInput).toBeVisible()
    expect(italianInput).toHaveValue('')

    // Added field shouldn't appear in the dropdown options
    // We query by text because they are not accessible, but these should be improved in the future
    await userEvent.click(dropdownButton)
    await waitFor(() => expect(screen.queryByText('Italian')).not.toBeInTheDocument())
    expect(screen.queryByText('French')).not.toBeInTheDocument()
    expect(screen.getByText('German')).toBeVisible()

    // Type into the default field (French) and check the side effects
    await userEvent.type(defaultInput, 'fr first edit')
    await waitFor(() => expect(inputMock).toHaveBeenLastCalledWith([
      { code: 'fr', value: 'fr first edit' },
      { code: 'it', value: '' },
    ]))
    expect(defaultInput).toHaveValue('fr first edit')
    expect(italianInput).toHaveValue('')

    // Type into the added field (Italian) and check the side effects
    await userEvent.type(italianInput, 'it first edit')
    await waitFor(() => expect(inputMock).toHaveBeenLastCalledWith([
      { code: 'fr', value: 'fr first edit' },
      { code: 'it', value: 'it first edit' },
    ]))
    expect(defaultInput).toHaveValue('fr first edit')
    expect(italianInput).toHaveValue('it first edit')
  })

  it('should delete the language field when delete button is clicked', async () => {
    // ARRANGE
    const inputMock = jest.fn()
    const ParentComponent = {
      components: { SmTranslationsInput },
      setup: () => {
        const inputValues = ref([
          { code: 'fr', value: 'fr initial' }, // default language
          { code: 'es', value: 'es initial' },
          { code: 'it', value: 'it initial' },
        ])

        return { inputValues, supportedTranslationsMock, inputMock }
      },
      template: `
        <sm-translations-input
          v-model="inputValues"
          label="Room type name"
          name="room-type"
          placeholder="Enter your room type name"
          default-language="fr"
          :supported-translations="supportedTranslationsMock"
          @update:model-value="inputMock"
        />
      `,
    }

    // ACT
    renderComponent(ParentComponent)

    const defaultInput = screen.getByLabelText('Room type name')
    const spanishInput = screen.getByLabelText('Spanish translation')
    const italianInput = screen.getByLabelText('Italian translation')
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    const dropdownButton = screen.getByRole('button', { name: 'Add translations' })

    // ASSERT
    // Check initial states
    expect(await screen.findAllByRole('textbox')).toHaveLength(3)
    expect(deleteButtons).toHaveLength(2) // Delete button for Spanish and Italian fields
    expect(screen.getByPlaceholderText('Enter your room type name')).toBeVisible()
    expect(defaultInput).toBeVisible()
    expect(defaultInput).toHaveValue('fr initial')
    expect(spanishInput).toBeVisible()
    expect(spanishInput).toHaveValue('es initial')
    expect(italianInput).toBeVisible()
    expect(italianInput).toHaveValue('it initial')

    // Check if the dropdown options got populated with the deleted fields
    // We query by text because they are not accessible, but these should be improved in the future
    await userEvent.click(dropdownButton)
    await waitFor(() => expect(screen.queryByText('Italian')).not.toBeInTheDocument())
    expect(screen.queryByText('Spanish')).not.toBeInTheDocument()
    expect(screen.queryByText('French')).not.toBeInTheDocument()
    expect(screen.getByText('German')).toBeVisible()

    // Delete the Spanish field and check the side effects
    await userEvent.click(deleteButtons[0])
    await waitFor(() => expect(screen.queryByLabelText('Spanish translation')).not.toBeInTheDocument())
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
    expect(inputMock).toHaveBeenLastCalledWith([
      { code: 'fr', value: 'fr initial' },
      { code: 'it', value: 'it initial' },
    ])

    // Delete the Italian field and check the side effects
    await userEvent.click(deleteButtons[0])
    await waitFor(() => expect(screen.queryByLabelText('Italian translation')).not.toBeInTheDocument())
    expect(inputMock).toHaveBeenLastCalledWith([
      { code: 'fr', value: 'fr initial' },
    ])

    // Check if the dropdown options got populated with the deleted fields
    // We query by text because they are not accessible, but these should be improved in the future
    await userEvent.click(dropdownButton)
    expect(await screen.findByText('Italian')).toBeVisible()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByText('Spanish')).toBeVisible()
    expect(screen.queryByText('French')).not.toBeInTheDocument()
  })

  it('should display the provided buttonLabel prop in the add translations button', async () => {
    // ARRANGE
    const inputMock = jest.fn()
    const ParentComponent = {
      components: { SmTranslationsInput },
      setup: () => {
        const inputValues = ref([
          { code: 'en', value: '' }, // default language
        ])

        return { inputValues, supportedTranslationsMock, inputMock }
      },
      template: `
        <sm-translations-input
          v-model="inputValues"
          label="Room type name"
          name="room-type"
          placeholder="Enter your room type name"
          button-label="Test custom add translations button label"
          default-language="en"
          :supported-translations="supportedTranslationsMock"
          @update:model-value="inputMock"
        />
      `,
    }

    // ACT
    renderComponent(ParentComponent)

    // Open the language dropdown selection using custom button label
    await userEvent.click(screen.getByRole('button', { name: 'Test custom add translations button label' }))

    // ASSERT
    // Check the dropdown options
    // We query by text because they are not accessible, but these should be improved in the future
    expect(screen.getByText('French')).toBeVisible()
    expect(screen.getByText('Spanish')).toBeVisible()
    expect(screen.getByText('German')).toBeVisible()
    expect(screen.getByText('Portuguese')).toBeVisible()
    expect(screen.getByText('Italian')).toBeVisible()
    expect(screen.getByText('Chinese')).toBeVisible()
    expect(screen.queryByText('English')).not.toBeInTheDocument() // Default language should not show up
  })

  it('should render the field as textarea when specified in type prop', async () => {
    // ARRANGE
    const inputMock = jest.fn()
    const ParentComponent = {
      components: { SmTranslationsInput },
      setup: () => {
        const inputValues = ref([
          { code: 'de', value: 'de initial' }, // default language
          { code: 'es', value: null },
        ])

        return { inputValues, supportedTranslationsMock, inputMock }
      },
      template: `
        <sm-translations-input
          v-model="inputValues"
          label="Room type name"
          name="room-type"
          placeholder="Enter your room type name"
          default-language="de"
          type="textarea"
          resize="both"
          :supported-translations="supportedTranslationsMock"
          @update:model-value="inputMock"
        />
      `,
    }

    // ACT
    renderComponent(ParentComponent)

    const defaultInput = screen.getByLabelText('Room type name')
    const spanishInput = screen.getByLabelText('Spanish translation')

    // ASSERT
    // Check initial states
    expect(await screen.findAllByRole('textbox')).toHaveLength(2) // No other created inputs aside from default lang
    expect(screen.getByPlaceholderText('Enter your room type name')).toBeVisible()
    expect(defaultInput).toBeVisible()
    expect(defaultInput).toHaveValue('de initial')
    expect(defaultInput).toHaveStyle('resize: both;')
    expect(spanishInput).toBeVisible()
    expect(spanishInput).toHaveValue('')
    expect(spanishInput).toHaveStyle('resize: auto;') // Not affected by prop
  })

  it('should disable the delete buttons when specified in the supportedTranslations config', async () => {
    // ARRANGE
    const inputMock = jest.fn()
    const ParentComponent = {
      components: { SmTranslationsInput },
      setup: () => {
        const inputValues = ref([
          { code: 'en', value: 'en initial' }, // default language
          { code: 'es', value: 'es initial' },
          { code: 'de', value: 'de initial' },
        ])

        const supportedTranslations = [
          {
            code: 'en',
            translationLabel: 'English translation',
            dropdownLabel: 'English',
          },
          {
            code: 'es',
            translationLabel: 'Spanish translation',
            dropdownLabel: 'Spanish',
            disableDeletion: true,
          },
          {
            code: 'de',
            translationLabel: 'German translation',
            dropdownLabel: 'German',
          },
        ]

        return { inputValues, supportedTranslations, inputMock }
      },
      template: `
        <sm-translations-input
          v-model="inputValues"
          label="Room type name"
          name="room-type"
          placeholder="Enter your room type name"
          default-language="en"
          :supported-translations="supportedTranslations"
          @update:model-value="inputMock"
        />
      `,
    }

    // ACT
    renderComponent(ParentComponent)

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })

    // ASSERT
    // Check initial states
    expect(await screen.findAllByRole('textbox')).toHaveLength(3)
    expect(deleteButtons).toHaveLength(2) // Delete button for Spanish and German fields
    expect(deleteButtons.at(0)).toBeDisabled()
    expect(deleteButtons.at(1)).toBeEnabled()
  })

  it('should display not display the add translations button when there are no more available items', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTranslationsInput },
      setup: () => {
        // Add all to the input values
        const inputValues = ref([
          {
            code: 'en',
            value: undefined,
          },
          {
            code: 'es',
            value: null,
          },
          {
            code: 'de',
            value: '',
          },
          {
            code: 'fr',
            value: 'Bonjour',
          },
          {
            code: 'pt',
            value: '',
          },
          {
            code: 'it',
            value: null,
          },
          {
            code: 'zh',
          },
        ])

        return { inputValues, supportedTranslationsMock }
      },
      template: `
        <sm-translations-input
          v-model="inputValues"
          label="Room type name"
          name="room-type"
          placeholder="Enter your room type name"
          default-language="en"
          :supported-translations="supportedTranslationsMock"
        />
      `,
    }

    // ACT
    renderComponent(ParentComponent)

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })

    // ASSERT
    // Check the if the button exists
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Add translations' })).not.toBeInTheDocument())
    expect(deleteButtons).toHaveLength(6) // Delete button for all fields except default
  })

  it('should validate the default and created fields when rules prop is provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTranslationsInput },
      setup: () => {
        const inputValues = ref([
          {
            code: 'en',
            value: 'Hello',
          },
          {
            code: 'es',
            value: 'Ola',
          },
          {
            code: 'de',
            value: null,
          },
        ])

        return { inputValues, supportedTranslationsMock }
      },
      template: `
        <sm-translations-input
          v-model="inputValues"
          default-language="en"
          name="room-type"
          label="Welcome message"
          placeholder="Enter your welcome message to guests"
          rules="required"
          type="textarea"
          :supported-translations="supportedTranslationsMock"
        />
      `,
    }

    // ACT
    renderComponent(ParentComponent)

    const englishField = screen.getByLabelText('Welcome message')
    const spanishField = screen.getByLabelText('Spanish translation')
    const germanField = screen.getByLabelText('German translation')

    // ASSERT
    // Check initial states
    expect(await screen.findAllByText('*')).toHaveLength(3) // Required asterisk for all fields
    expect(screen.getAllByRole('alert')).toHaveLength(3) // Alerts are in DOM
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument() // But empty

    // Delete value from default English field and check for error message
    await userEvent.clear(englishField)
    expect(await screen.findByText('This is a custom required field message')).toBeVisible() // One instance of the error message

    // Delete value from created Spanish field and check for error message
    await userEvent.clear(spanishField)
    expect(await screen.findAllByText('This is a custom required field message')).toHaveLength(2) // Two instances of the error message

    // Focus and blur on empty German field and check for error message
    await userEvent.click(germanField)
    await userEvent.tab()
    expect(await screen.findAllByText('This is a custom required field message')).toHaveLength(3) // Three instances of the error message

    // Type into the fields to clear all errors
    await userEvent.type(englishField, 'Hello')
    await userEvent.type(spanishField, 'Ola')
    await userEvent.type(germanField, 'Hallo')
    await waitFor(() => expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()) // No error messages
  })

})
