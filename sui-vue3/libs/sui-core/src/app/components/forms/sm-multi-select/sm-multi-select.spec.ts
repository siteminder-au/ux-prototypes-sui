import { FieldValidationMetaInfo } from '@/app/libs/vee-validate/rules/types'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { required } from '@vee-validate/rules'
import { configure, defineRule } from 'vee-validate'
import { ref } from 'vue'
import SmButton from '../../sm-button/sm-button.vue'
import SmForm from '../sm-form/sm-form.vue'
import SmMultiSelect from './sm-multi-select.vue'

const defaultOptions = [
  { label: 'Option 1', code: '1' },
  { label: 'Option 2', code: '2' },
  { label: 'Option 3', code: '3' },
  { label: 'Option 4', code: '4' },
  { label: 'Option 5', code: '5' },
  { label: 'Option 6', code: '6' },
  { label: 'Option 7', code: '7' },
  { label: 'Option 8', code: '8' },
  { label: 'Option 9', code: '9' },
  { label: 'Option 10', code: '10' },
  { label: 'Option 11', code: '11' },
  { label: 'Option 12', code: '12' },
]

const defaultGroupedOptions = [
  {
    title: 'Group 1',
    libs: [
      { label: 'Option 1', code: '1' },
      { label: 'Option 2', code: '2' },
    ],
  },
  {
    title: 'Group 2',
    libs: [
      { label: 'Option 3', code: '3', description: 'Test description' },
      { label: 'Option 4', code: '4' },
    ],
  },
  {
    title: 'Group 3',
    libs: [
      { label: 'Option 5', code: '5' },
      { label: 'Option 6', code: '6' },
      { label: 'Option 7', code: '7' },
      { label: 'Option 8', code: '8' },
      { label: 'Option 9', code: '9' },
      { label: 'Option 10', code: '10' },
      { label: 'Option 11', code: '11' },
      { label: 'Option 12', code: '12' },
      { label: 'Option 111', code: '111' },
    ],
  },
]

// Get an array of expected dropdown of flattened group options
const groupOptions = defaultGroupedOptions.reduce((acc: string[], group) => {
  const opts = group.libs.map(lib => (lib.description ? `${lib.label} ${lib.description}` : lib.label))

  return acc.concat(opts)
}, [])

// Get an array of expected dropdown of flattened group titles
const groupTitles = defaultGroupedOptions.map(group => group.title)

describe('SmMultiSelect', () => {

  const mockScrollIntoView = jest.fn()

  beforeAll(() => {
    configure({
      generateMessage: (context: FieldValidationMetaInfo) => {
        const ruleName = context.rule?.name ?? ''

        return `This is a custom ${ruleName} field message`
      },
    })
  })

  beforeEach(() => {
    // Replace `scrollIntoView` Web API with mocked function
    // https://github.com/jsdom/jsdom/issues/1695
    Element.prototype.scrollIntoView = mockScrollIntoView
  })

  afterEach(() => {
    // Restore `scrollIntoView` Web API
    Element.prototype.scrollIntoView = () => {}
  })

  /**
   * Repeat test cases around the value getter and setter on different combinations of
   * standard/grouped and single/multiple variants because they have specific logic branches
   */

  describe('standard single select', () => {

    it('should not have pre-filled input if value is not provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref()

          return { defaultOptions, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select an option"
              label="Input label"
              name="multiselect"
              :options="defaultOptions"
            />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(screen.getByRole('combobox', { name: 'Input label', expanded: false })).toBeVisible()
      expect(inputElement).toHaveValue('')
      expect(screen.getByPlaceholderText('Select an option')).toBeVisible()
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      expect(screen.queryByRole('option')).not.toBeInTheDocument()
      expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: true })).toBeVisible()
      expect(screen.getByRole('listbox')).toBeVisible()
      expect(inputElement).toHaveValue('')

      expect(screen.getAllByRole('option').length).toBe(defaultOptions.length)
      defaultOptions.forEach(({ label }) => {
        expect(screen.getByRole('option', { name: label, selected: false })).toBeVisible()
      })
    })

    it('should have pre-filled input if value is provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref('2')

          return { defaultOptions, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select an option"
              label="Input label"
              name="multiselect"
              :options="defaultOptions"
            />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(inputElement).toHaveValue('Option 2')
      expect(screen.getByText('Selected: 2')).toBeVisible()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      // Clears the input field when focused and when it's filterable (default)
      await waitFor(() => expect(inputElement).toHaveValue(''))
      defaultOptions.forEach(({ label }) => {
        if (label === 'Option 2') {
          // Checks for aria-selected="true"
          // The input box is meant to be used for searching/filtering, not the exact indicator of selected option(s)
          // We use the aria-selected attribute to determine the selected option(s) in the listbox
          expect(screen.getByRole('option', { name: label, selected: true })).toBeVisible()
        } else {
          expect(screen.getByRole('option', { name: label, selected: false })).toBeVisible()
        }
      })
    })

    it('should have pre-filled input if selection is provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref('12')

          return { defaultOptions, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model:selection="selection"
              placeholder="Select an option"
              label="Input label"
              name="multiselect"
              :options="defaultOptions"
            />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(inputElement).toHaveValue('Option 12')
      expect(screen.getByText('Selected: 12')).toBeVisible()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      await waitFor(() => expect(inputElement).toHaveValue(''))
      defaultOptions.forEach(({ label }) => {
        if (label === 'Option 12') {
          // Checks for aria-selected="true"
          expect(screen.getByRole('option', { name: label, selected: true })).toBeVisible()
        } else {
          expect(screen.getByRole('option', { name: label, selected: false })).toBeVisible()
        }
      })

      // Deselect to test two-way binding
      await userEvent.click(screen.getByRole('option', { name: 'Option 12', selected: true }))

      await waitFor(() => expect(inputElement).toHaveValue(''))
      expect(screen.queryByText('Selected:', { exact: false })).not.toBeInTheDocument()
    })

    it('should update the selected value if clicked option is not disabled', async () => {
      // ARRANGE
      const options = [
        ...defaultOptions,
        { code: '13', label: 'Option 13', disabled: true },
      ]
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref()

          return { options, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select an option"
              label="Input label"
              name="multiselect"
              :options="options"
            />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(inputElement).toHaveValue('')
      expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument()

      // Select an option
      await userEvent.tab()
      await userEvent.click(screen.getByRole('option', { name: 'Option 1', selected: false }))

      // Auto-close and update selection
      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: false })).toBeVisible()
      expect(inputElement).toHaveValue('Option 1')
      expect(screen.getByText('Selected: 1')).toBeVisible()

      // Select the disabled option
      await userEvent.tab()
      await userEvent.click(screen.getByRole('option', { name: 'Option 13', selected: false }))

      // Do nothing
      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: true })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 1', selected: true })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 13', selected: false })).toHaveAttribute('aria-disabled', 'true')
      expect(inputElement).toHaveValue('')
      expect(screen.getByText('Selected: 1')).toBeVisible()

      // Select an option
      await userEvent.click(screen.getByRole('option', { name: 'Option 2', selected: false }))

      // Auto-close and update selection
      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: false })).toBeVisible()
      expect(inputElement).toHaveValue('Option 2')
      expect(screen.getByText('Selected: 2')).toBeVisible()
    })

    it('should allow selected option to be deselected by default', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref('2')

          return { defaultOptions, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select an option"
              label="Input label"
              name="multiselect"
              :options="defaultOptions"
            />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // Focus and deselect option
      await userEvent.tab()
      await userEvent.click(screen.getByRole('option', { name: 'Option 2', selected: true }))

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(inputElement).toHaveValue('')
      expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument()

      // Focus into the input field to open dropdown
      await userEvent.tab()
      await userEvent.click(screen.getByRole('option', { name: 'Option 2', selected: false }))
    })

    it('should not allow selected option to be deselected if allowEmpty is false', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref('2')

          return { defaultOptions, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select an option"
              label="Input label"
              name="multiselect"
              :allow-empty="false"
              :options="defaultOptions"
            />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // Focus and deselect option
      await userEvent.tab()
      await userEvent.click(screen.getByRole('option', { name: 'Option 2', selected: true }))

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(inputElement).toHaveValue('Option 2')
      expect(screen.getByText('Selected: 2')).toBeVisible()

      // Focus into the input field to open dropdown
      await userEvent.tab()
      await userEvent.click(screen.getByRole('option', { name: 'Option 2', selected: true }))
    })

  })

  describe('standard multi-select', () => {

    it('should not have pre-filled input if value is not provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref()

          return { defaultOptions, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select options"
              label="Input label"
              name="multiselect"
              :multiple="true"
              :options="defaultOptions"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(screen.getByRole('combobox', { name: 'Input label', expanded: false })).toBeVisible()
      expect(inputElement).toHaveValue('')
      expect(screen.getByPlaceholderText('Select options')).toBeVisible()
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      expect(screen.queryByRole('option')).not.toBeInTheDocument()
      expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      expect(await screen.findByRole('listbox')).toBeVisible()
      expect(screen.getByRole('combobox', { name: 'Input label', expanded: true })).toBeVisible()
      expect(inputElement).toHaveValue('')

      const expectedOptions = [
        { label: 'Select all' }, // Built-in option for multi-select
        ...defaultOptions,
      ]
      expect(screen.getAllByRole('option').length).toBe(expectedOptions.length)
      expectedOptions.forEach(({ label }) => {
        expect(screen.getByRole('option', { name: label, selected: false })).toBeVisible()
      })
    })

    it('should have pre-filled input if value is provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref(['2', 'not-found'])
          const tags = ref()

          return { defaultOptions, selection, tags }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select options"
              label="Input label"
              name="multiselect"
              :multiple="true"
              :options="defaultOptions"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(inputElement).toHaveValue('Option 2')
      expect(screen.getByText('Selected: ["2","not-found"]')).toBeVisible()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      await waitFor(() => expect(inputElement).toHaveValue(''))

      const expectedOptions = [
        { label: 'Select all' }, // Built-in option for multi-select
        ...defaultOptions,
      ]
      expect(screen.getAllByRole('option').length).toBe(expectedOptions.length)
      expectedOptions.forEach(({ label }) => {
        if (label === 'Option 2') {
          // Checks for aria-selected="true"
          expect(screen.getByRole('option', { name: label, selected: true })).toBeVisible()
        } else {
          expect(screen.getByRole('option', { name: label, selected: false })).toBeVisible()
        }
      })
    })

    it('should have pre-filled input if selection is provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref(['11', '12'])
          const tags = ref()

          return { defaultOptions, selection, tags }
        },
        template: `
          <div>
            <sm-multi-select
              v-model:selection="selection"
              placeholder="Select options"
              label="Input label"
              name="multiselect"
              :multiple="true"
              :options="defaultOptions"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(inputElement).toHaveValue('Option 11 (+1)')
      expect(screen.getByText('Selected: ["11","12"]')).toBeVisible()

      // Focus into the input field to open dropdown
      await userEvent.click(inputElement)

      await waitFor(() => expect(inputElement).toHaveValue(''))
      expect(screen.getAllByRole('option').length).toBe(defaultOptions.length + 1) // Plus select all
      defaultOptions.forEach(({ label }) => {
        if (label === 'Option 11' || label === 'Option 12') {
          // Checks for aria-selected="true"
          expect(screen.getByRole('option', { name: label, selected: true })).toBeVisible()
        } else {
          expect(screen.getByRole('option', { name: label, selected: false })).toBeVisible()
        }
      })

      // Deselect to test two-way binding
      await userEvent.click(screen.getByRole('option', { name: 'Option 11', selected: true }))

      expect(await screen.findByRole('option', { name: 'Option 11', selected: false })).toBeVisible()

      // Focus out of the input field
      await userEvent.tab()

      await waitFor(() => expect(inputElement).toHaveValue('Option 12'))
      expect(screen.getByText('Selected: ["12"]')).toBeVisible()
    })

    it('should update the selected value if clicked option is not disabled', async () => {
      // ARRANGE
      const options = [
        ...defaultOptions,
        { code: '13', label: 'Option 13', disabled: true },
      ]
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref()

          return { options, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select options"
              label="Input label"
              name="multiselect"
              :multiple="true"
              :options="options"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(inputElement).toHaveValue('')
      expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument()

      // Open the dropdown and select an option
      await userEvent.tab()
      await userEvent.click(screen.getByRole('option', { name: 'Option 1', selected: false }))

      // Don't close but update selection
      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: true })).toBeVisible()
      expect(inputElement).toHaveValue('')
      expect(screen.getByRole('option', { name: 'Option 1', selected: true })).toBeVisible()
      expect(screen.getByText('Selected: ["1"]')).toBeVisible()

      // Select and deselect
      await userEvent.click(screen.getByRole('option', { name: 'Option 9', selected: false }))
      await userEvent.click(screen.getByRole('option', { name: 'Option 1', selected: true })) // Deselect
      await userEvent.click(screen.getByRole('option', { name: 'Option 4', selected: false }))
      await userEvent.click(screen.getByRole('option', { name: 'Option 13', selected: false })) // Disabled

      // Don't close but update selection
      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: true })).toBeVisible()
      expect(inputElement).toHaveValue('')
      expect(screen.getByText('Selected: ["4","9"]')).toBeVisible()
      expect(screen.getByRole('option', { name: 'Select all', selected: false })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 1', selected: false })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 4', selected: true })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 9', selected: true })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 13', selected: false })).toBeVisible()

      // Blur input field
      await userEvent.tab()

      // Auto-close dropdown
      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: false })).toBeVisible()
      expect(inputElement).toHaveValue('Option 4 (+1)')
    })

    it('should select all options if built-in option is clicked', async () => {
      // ARRANGE
      const options = [
        ...defaultOptions.slice(0, 3),
        { code: '4', label: 'Option 4', disabled: true },
      ]
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref()

          return { options, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select options"
              label="Input label"
              name="multiselect"
              :multiple="true"
              :options="options"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // Focus and select all
      await userEvent.tab()
      await userEvent.click(screen.getByRole('option', { name: 'Select all', selected: false }))

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(screen.getByText('Selected: ["1","2","3"]')).toBeVisible()

      const expectedOptions = [
        { label: 'Select all' }, // Built-in option for multi-select
        ...options,
      ]
      expectedOptions.forEach(({ label }) => {
        if (label === 'Option 4') {
          // Disabled option
          expect(screen.getByRole('option', { name: label, selected: false })).toBeVisible()
        } else {
          // Checks for aria-selected="true"
          expect(screen.getByRole('option', { name: label, selected: true })).toBeVisible()
        }
      })

      // Blur out of the input field
      await userEvent.tab()

      await waitFor(() => expect(inputElement).toHaveValue('Option 1 (+2)'))
    })

    it('should deselect all options if built-in option is clicked', async () => {
      // ARRANGE
      const options = [...defaultOptions.slice(0, 3)]
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref(['1', '2', '3'])

          return { options, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select options"
              label="Input label"
              name="multiselect"
              :multiple="true"
              :options="options"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const expectedOptions = [
        { label: 'Select all' }, // Built-in option for multi-select
        ...options,
      ]

      // Focus to open dropdown
      await userEvent.tab()

      expect(await screen.findByText('Selected: ["1","2","3"]')).toBeVisible()
      expectedOptions.forEach(({ label }) => {
        expect(screen.getByRole('option', { name: label, selected: true })).toBeVisible()
      })

      // Deselect all
      await userEvent.click(screen.getByRole('option', { name: 'Select all', selected: true }))

      expect(await screen.findByText('Selected: []')).toBeVisible()
      expectedOptions.forEach(({ label }) => {
        expect(screen.getByRole('option', { name: label, selected: false })).toBeVisible()
      })
    })

    it('should not deselect all options allowEmpty is false', async () => {
      // ARRANGE
      const options = [...defaultOptions.slice(0, 3)]
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref(['1', '2', '3'])

          return { options, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select options"
              label="Input label"
              name="multiselect"
              :allow-empty="false"
              :multiple="true"
              :options="options"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // Focus and deselect all
      await userEvent.tab()
      await userEvent.click(screen.getByRole('option', { name: 'Select all' }))

      // ASSERT
      // Should keep first item selected
      await waitFor(() => expect(screen.getByText('Selected: ["1"]')).toBeVisible())

      await userEvent.click(screen.getByRole('option', { name: 'Option 1' }))

      await waitFor(() => expect(screen.getByText('Selected: ["1"]')).toBeVisible())
    })

    it('should hide the select all option if showSelectAllOption props is false', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref()

          return { defaultOptions, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select options"
              label="Input label"
              name="multiselect"
              :multiple="true"
              :options="defaultOptions"
              :show-select-all-option="false"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // Focus to open dropdown
      await userEvent.tab()

      // ASSERT
      await waitFor(() => expect(screen.getAllByRole('option').length).toBe(defaultOptions.length))
      expect(screen.queryByRole('option', { name: 'Select all' })).not.toBeInTheDocument()
    })

    it('should filter the options when keyword is typed in the input field by default', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref()

          return { defaultOptions, selection }
        },
        template: `
          <sm-multi-select
            v-model="selection"
            placeholder="Search a keyword"
            label="Input label"
            name="multiselect"
            :multiple="true"
            :options="defaultOptions"
          />
        `,
      }

      // ACT
      render(ParentComponent)

      // Type keyword with multiple results
      const inputField = await screen.findByRole('textbox', { name: 'Input label' })
      await userEvent.type(inputField, '1')

      // ASSERT
      await waitFor(() => expect(screen.getAllByRole('option').length).toBe(5))
      expect(screen.getByRole('option', { name: 'Select all' })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 1' })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 10' })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 11' })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 12' })).toBeVisible()
      expect(inputField).toHaveValue('1')

      // Type keyword with single result (append from previous input)
      await userEvent.type(inputField, '2')

      // Select all should be hidden if there is only 1 option
      await waitFor(() => expect(screen.getAllByRole('option').length).toBe(1))
      expect(screen.getByRole('option', { name: 'Option 12' })).toBeVisible()
      expect(inputField).toHaveValue('12')

      // Type keyword with no result (append from previous input)
      await userEvent.type(inputField, '3')

      // No option should be available
      await waitFor(() => expect(screen.queryByRole('option')).not.toBeInTheDocument())
      expect(screen.getByText('123 cannot be found')).toBeVisible()
      expect(inputField).toHaveValue('123')

      // Remove query
      await userEvent.clear(inputField)

      // All items should be visible again
      await waitFor(() => expect(screen.getAllByRole('option').length).toBe(defaultOptions.length + 1)) // Plus select all
    })
  })

  describe('grouped single select', () => {

    it('should not have pre-filled input if value is not provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref()

          return { defaultGroupedOptions, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select an option"
              label="Input label"
              name="multiselect"
              :options="defaultGroupedOptions"
              :show-group-select="true"
            />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(screen.getByRole('combobox', { name: 'Input label', expanded: false })).toBeVisible()
      expect(inputElement).toHaveValue('')
      expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: true })).toBeVisible()
      expect(inputElement).toHaveValue('')

      groupTitles.forEach((expectedTitle) => {
        expect(screen.getByText(expectedTitle)).toBeVisible()
      })

      expect(screen.getAllByRole('option').length).toBe(groupOptions.length)
      groupOptions.forEach((expectedOption) => {
        expect(screen.getByRole('option', { name: expectedOption, selected: false })).toBeVisible()
      })
    })

    it('should have pre-filled input if value is provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref('111')

          return { defaultGroupedOptions, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select an option"
              label="Input label"
              name="multiselect"
              :options="defaultGroupedOptions"
              :show-group-select="true"
            />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(screen.getByRole('combobox', { name: 'Input label', expanded: false })).toBeVisible()
      expect(inputElement).toHaveValue('Option 111')
      expect(screen.getByText('Selected: 111')).toBeVisible()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: true })).toBeVisible()
      expect(inputElement).toHaveValue('')

      groupTitles.forEach((expectedTitle) => {
        expect(screen.getByText(expectedTitle)).toBeVisible()
      })

      expect(screen.getAllByRole('option').length).toBe(groupOptions.length)
      groupOptions.forEach((expectedOption) => {
        if (expectedOption === 'Option 111') {
          // Checks for aria-selected="true"
          expect(screen.getByRole('option', { name: expectedOption, selected: true })).toBeVisible()
        } else {
          expect(screen.getByRole('option', { name: expectedOption, selected: false })).toBeVisible()
        }
      })
    })

    it('should have pre-filled input if selection is provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref('11')

          return { defaultGroupedOptions, selection }
        },
        template: `
          <div>
            <sm-multi-select
              :selection="selection"
              placeholder="Select an option"
              label="Input label"
              name="multiselect"
              :options="defaultGroupedOptions"
              :show-group-select="true"
            />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(screen.getByRole('combobox', { name: 'Input label', expanded: false })).toBeVisible()
      expect(inputElement).toHaveValue('Option 11')
      expect(screen.getByText('Selected: 11')).toBeVisible()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: true })).toBeVisible()
      expect(inputElement).toHaveValue('')

      groupTitles.forEach((expectedTitle) => {
        expect(screen.getByText(expectedTitle)).toBeVisible()
      })

      groupOptions.forEach((expectedOption) => {
        if (expectedOption === 'Option 11') {
          // Checks for aria-selected="true"
          expect(screen.getByRole('option', { name: expectedOption, selected: true })).toBeVisible()
        } else {
          expect(screen.getByRole('option', { name: expectedOption, selected: false })).toBeVisible()
        }
      })
    })

    it('should update the selected value if clicked option is not disabled', async () => {
      // ARRANGE
      const options = [
        ...defaultGroupedOptions,
        {
          title: 'Group 4',
          libs: [{ code: '13', label: 'Option 13', disabled: true }],
        },
      ]
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref()

          return { options, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select an option"
              label="Input label"
              name="multiselect"
              :options="options"
              :show-group-select="true"
            />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(inputElement).toHaveValue('')
      expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument()

      // Select an option
      await userEvent.tab()
      await userEvent.click(screen.getByRole('option', { name: 'Option 1', selected: false }))

      // Auto-close and update selection
      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: false })).toBeVisible()
      expect(inputElement).toHaveValue('Option 1')
      expect(screen.getByText('Selected: 1')).toBeVisible()

      // Select the disabled option
      await userEvent.tab()
      await userEvent.click(screen.getByRole('option', { name: 'Option 13', selected: false }))

      // Do nothing
      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: true })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 1', selected: true }))
      expect(screen.getByRole('option', { name: 'Option 13', selected: false })) // no change
      expect(inputElement).toHaveValue('')
      expect(screen.getByText('Selected: 1')).toBeVisible()

      // Select an option
      await userEvent.click(screen.getByRole('option', { name: 'Option 11', selected: false }))

      // Auto-close and update selection
      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: false })).toBeVisible()
      expect(inputElement).toHaveValue('Option 11')
      expect(screen.getByText('Selected: 11')).toBeVisible()
    })
  })

  describe('grouped multi-select', () => {
    it('should not have pre-filled input if value is not provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref()

          return { defaultGroupedOptions, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select options"
              label="Input label"
              name="multiselect"
              :multiple="true"
              :options="defaultGroupedOptions"
              :show-group-select="true"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(screen.getByRole('combobox', { name: 'Input label', expanded: false })).toBeVisible()
      expect(inputElement).toHaveValue('')
      expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: true })).toBeVisible()
      expect(inputElement).toHaveValue('')

      groupTitles.forEach((expectedTitle) => {
        expect(screen.getByText(expectedTitle)).toBeVisible()
      })

      groupOptions.forEach((expectedOption) => {
        expect(screen.getByRole('option', { name: expectedOption, selected: false })).toBeVisible()
      })

      expect(screen.getAllByRole('option', { name: 'Select group', selected: false })).toHaveLength(3)
    })

    it('should have pre-filled input if value is provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref(['2', '111', '3'])

          return { defaultGroupedOptions, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select options"
              label="Input label"
              name="multiselect"
              :multiple="true"
              :options="defaultGroupedOptions"
              :show-group-select="true"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(screen.getByRole('combobox', { name: 'Input label', expanded: false })).toBeVisible()
      expect(inputElement).toHaveValue('Option 2 (+2)')
      expect(screen.getByText('Selected: ["2","111","3"]')).toBeVisible()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: true })).toBeVisible()
      expect(inputElement).toHaveValue('')

      groupTitles.forEach((expectedTitle) => {
        expect(screen.getByText(expectedTitle)).toBeVisible()
      })

      groupOptions.forEach((expectedOption) => {
        if (expectedOption === 'Option 2' || expectedOption.includes('Option 3') || expectedOption === 'Option 111') {
          // Checks for aria-selected="true"
          expect(screen.getByRole('option', { name: expectedOption, selected: true })).toBeVisible()
        } else {
          expect(screen.getByRole('option', { name: expectedOption, selected: false })).toBeVisible()
        }
      })

      expect(screen.getAllByRole('option', { name: 'Select group', selected: false })).toHaveLength(3)
    })

    it('should have pre-filled input if selection is provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref(['3', '1'])

          return { defaultGroupedOptions, selection }
        },
        template: `
          <div>
            <sm-multi-select
              :selection="selection"
              placeholder="Select options"
              label="Input label"
              name="multiselect"
              :multiple="true"
              :options="defaultGroupedOptions"
              :show-group-select="true"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(screen.getByRole('combobox', { name: 'Input label', expanded: false })).toBeVisible()
      expect(inputElement).toHaveValue('Option 1 (+1)')
      expect(screen.getByText('Selected: ["3","1"]')).toBeVisible()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: true })).toBeVisible()
      expect(inputElement).toHaveValue('')

      groupTitles.forEach((expectedTitle) => {
        expect(screen.getByText(expectedTitle)).toBeVisible()
      })

      groupOptions.forEach((expectedOption) => {
        if (expectedOption === 'Option 1' || expectedOption.includes('Option 3')) {
          // Checks for aria-selected="true"
          expect(screen.getByRole('option', { name: expectedOption, selected: true })).toBeVisible()
        } else {
          expect(screen.getByRole('option', { name: expectedOption, selected: false })).toBeVisible()
        }
      })

      expect(screen.getAllByRole('option', { name: 'Select group', selected: false })).toHaveLength(3)
    })

    it('should update the selected value if clicked option is not disabled', async () => {
      // ARRANGE
      const options = [
        ...defaultGroupedOptions,
        {
          title: 'Group 4',
          libs: [{ label: 'Option 13', code: '13', disabled: true }],
        },
      ]
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref()

          return { options, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select options"
              label="Input label"
              name="multiselect"
              :multiple="true"
              :options="options"
              :show-group-select="true"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
      expect(inputElement).toHaveValue('')
      expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument()

      // Select an option
      await userEvent.tab()
      await userEvent.click(screen.getByRole('option', { name: 'Option 2', selected: false }))

      // Don't auto-close and update value
      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: true })).toBeVisible()
      expect(inputElement).toHaveValue('')
      expect(screen.getByText('Selected: ["2"]')).toBeVisible()

      // Select the disabled option
      await userEvent.click(screen.getByRole('option', { name: 'Option 13', selected: false }))

      // Do nothing
      expect(await screen.findByRole('combobox', { name: 'Input label', expanded: true })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 2', selected: true })).toBeVisible()
      expect(inputElement).toHaveValue('')
      expect(screen.getByText('Selected: ["2"]')).toBeVisible()

      // Select an option
      await userEvent.click(screen.getByRole('option', { name: 'Option 8', selected: false }))
      await userEvent.click(screen.getAllByRole('option', { name: 'Select group' })[1])

      // Don't auto-close and update the value
      const selectGroups = await screen.findAllByRole('option', { name: 'Select group' })
      expect(screen.getByRole('combobox', { name: 'Input label', expanded: true })).toBeVisible()
      expect(inputElement).toHaveValue('')
      expect(screen.getByText('Selected: ["2","3","4","8"]')).toBeVisible()

      expect(selectGroups.at(0)).toHaveAttribute('aria-selected', 'false') // Group 1
      expect(screen.getByRole('option', { name: 'Option 2', selected: true })).toBeVisible()

      expect(selectGroups.at(1)).toHaveAttribute('aria-selected', 'true') // Group 2
      expect(screen.getByRole('option', { name: 'Option 3 Test description', selected: true })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 4', selected: true })).toBeVisible()

      expect(selectGroups.at(2)).toHaveAttribute('aria-selected', 'false') // Group 3
      expect(screen.getByRole('option', { name: 'Option 8', selected: true })).toBeVisible()

      // Blur out of the input field
      await userEvent.tab()

      expect(inputElement).toHaveValue('Option 2 (+3)')
    })

    it('should hide the select group option if showSelectGroupOption prop is false', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref()

          return { defaultGroupedOptions, selection }
        },
        template: `
          <div>
            <sm-multi-select
              v-model="selection"
              placeholder="Select options"
              label="Input label"
              name="multiselect"
              :multiple="true"
              :options="defaultGroupedOptions"
              :show-group-select="true"
              :show-select-group-option="false"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // Focus to open the dropdown
      await userEvent.tab()

      // ASSERT
      await waitFor(() => expect(screen.queryByRole('option', { name: 'Select group' })).not.toBeInTheDocument())
    })

    it('should filter the options when keyword is typed in the input field by default', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmMultiSelect },
        setup: () => {
          const selection = ref(['1'])

          return { defaultGroupedOptions, selection }
        },
        template: `
          <sm-multi-select
            v-model="selection"
            placeholder="Search a keyword"
            label="Input label"
            name="multiselect"
            :multiple="true"
            :show-group-select="true"
            :options="defaultGroupedOptions"
          />
        `,
      }

      // ACT
      render(ParentComponent)

      // Type keyword with multiple results
      const inputField = await screen.findByRole('textbox', { name: 'Input label' })
      await userEvent.type(inputField, '1')

      // ASSERT
      await waitFor(() => expect(screen.getAllByRole('option').length).toBe(6))
      expect(screen.getByText('Group 1')).toBeVisible()
      expect(screen.queryByText('Group 2')).not.toBeInTheDocument()
      expect(screen.getByText('Group 3')).toBeVisible()
      expect(screen.getByRole('option', { name: 'Select group', selected: false })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 1', selected: true })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 10', selected: false })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 11', selected: false })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 12', selected: false })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 111', selected: false })).toBeVisible()
      expect(inputField).toHaveValue('1')

      // Type keyword with single result (append from previous input)
      await userEvent.type(inputField, '2')

      // Select group should be hidden if there is only 1 option
      await waitFor(() => expect(screen.getAllByRole('option').length).toBe(1))
      expect(screen.queryByText('Group 1')).not.toBeInTheDocument()
      expect(screen.queryByText('Group 2')).not.toBeInTheDocument()
      expect(screen.getByText('Group 3')).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 12', selected: false })).toBeVisible()
      expect(inputField).toHaveValue('12')

      // Type keyword with no result (append from previous input)
      await userEvent.type(inputField, '3')

      // No option should be available
      await waitFor(() => expect(screen.queryByRole('option')).not.toBeInTheDocument())
      expect(screen.queryByText('Group 1')).not.toBeInTheDocument()
      expect(screen.queryByText('Group 2')).not.toBeInTheDocument()
      expect(screen.queryByText('Group 3')).not.toBeInTheDocument()
      expect(screen.getByText('123 cannot be found')).toBeVisible()
      expect(inputField).toHaveValue('123')

      // Remove query
      await userEvent.clear(inputField)

      // All items should be visible again
      await waitFor(() => expect(screen.getAllByRole('option').length).toBe(groupOptions.length + 3)) // Plus select groups
      expect(screen.getByText('Group 1')).toBeVisible()
      expect(screen.getByText('Group 2')).toBeVisible()
      expect(screen.getByText('Group 3')).toBeVisible()
    })

  })

  /**
   * Generic test cases
   */

  it('should not allow keywords to be typed in the input field if filterable prop is false', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmMultiSelect },
      setup: () => {
        const selection = ref()

        return { defaultOptions, selection }
      },
      template: `
        <sm-multi-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          name="multiselect"
          :filterable="false"
          :options="defaultOptions"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Attempt to type
    const inputField = await screen.findByRole('textbox', { name: 'Input label' })
    await userEvent.type(inputField, '1111')

    // ASSERT
    await waitFor(() => expect(screen.getAllByRole('option').length).toBe(defaultOptions.length))
    expect(inputField).toHaveValue('')

    // Select an option
    await userEvent.click(screen.getByRole('option', { name: 'Option 5', selected: false }))

    await waitFor(() => expect(inputField).toHaveValue('Option 5'))

    // Focus to open dropdown
    await userEvent.click(inputField)

    // Input field won't be cleared when focused if it's not filterable
    await waitFor(() => expect(inputField).toHaveValue('Option 5'))
    expect(screen.getByRole('option', { name: 'Option 5', selected: true })).toBeVisible()
  })

  it('should validate the value when programmatically triggered', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton, SmMultiSelect },
      setup: () => {
        const selection = ref()
        const multiselectRef = ref()

        defineRule('required', required)

        return { defaultOptions, multiselectRef, selection }
      },

      template: `
        <div>
          <sm-multi-select
            v-model="selection"
            ref="multiselectRef"
            placeholder="Search a keyword"
            label="Input label"
            name="test-name"
            vid="test-vid"
            :rules="{ required: true }"
            :options="defaultOptions"
          />
          <sm-button @click="multiselectRef?.validate()">Validate</sm-button>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // Validate right away
    await userEvent.click(screen.getByRole('button', { name: 'Validate' }))

    // ASSERT
    const multiselect = await screen.findByRole('combobox', { name: 'Input label' })
    expect(screen.getByRole('alert')).toHaveTextContent('This is a custom required field message')
    expect(screen.getByText('This is a custom required field message')).toBeVisible()
    // Checks if error message is tied to the combobox for accessibility
    expect(multiselect).toHaveAccessibleErrorMessage('This is a custom required field message')
    expect(multiselect).toBeInvalid()

    // Click on the field and select item
    await userEvent.click(screen.getByRole('textbox', { name: 'Input label' }))
    await userEvent.click(screen.getByRole('option', { name: 'Option 1' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('')
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()
    expect(multiselect).not.toHaveAccessibleErrorMessage('This is a custom required field message')
    expect(multiselect).toBeValid()
  })

  it('should validate the value when the field is focused and blurred out', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton, SmMultiSelect },
      setup: () => {
        const selection = ref()
        const multiselectRef = ref()

        defineRule('required', required)

        return { defaultOptions, multiselectRef, selection }
      },

      template: `
        <div>
          <sm-multi-select
            v-model="selection"
            ref="multiselectRef"
            placeholder="Search a keyword"
            label="Input label"
            name="test-name"
            vid="test-vid"
            :rules="{ required: true }"
            :options="defaultOptions"
          />
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // Focus and blur out of the field to trigger validation
    await userEvent.tab()
    await userEvent.tab()

    // ASSERT
    const multiselect = await screen.findByRole('combobox', { name: 'Input label' })
    expect(screen.getByRole('alert')).toHaveTextContent('This is a custom required field message')
    expect(screen.getByText('This is a custom required field message')).toBeVisible()
    // Checks if error message is tied to the combobox for accessibility
    expect(multiselect).toHaveAccessibleErrorMessage('This is a custom required field message')
    expect(multiselect).toBeInvalid()

    // Click on the field and select item
    await userEvent.click(screen.getByRole('textbox', { name: 'Input label' }))
    await userEvent.click(screen.getByRole('option', { name: 'Option 1' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('')
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()
    expect(multiselect).not.toHaveAccessibleErrorMessage('This is a custom required field message')
    expect(multiselect).toBeValid()
  })

  it('should not show the error message if errorDisabled prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmMultiSelect },
      setup: () => {
        const selection = ref()

        defineRule('required', required)

        return { defaultOptions, selection }
      },
      template: `
        <sm-multi-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          rules="required"
          name="multiselect"
          :error-disabled="true"
          :options="defaultOptions"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Focus and blur out of the field to trigger validation
    await userEvent.click(screen.getByRole('textbox', { name: 'Input label' }))
    await userEvent.tab()

    // ASSERT
    const multiselect = await screen.findByRole('combobox', { name: 'Input label' })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(multiselect).not.toHaveAccessibleErrorMessage('This is a custom required field message')
    expect(multiselect).toBeInvalid() // Still invalid but no error message
  })

  it('should show the field label by default', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmMultiSelect },
      setup: () => {
        const selection = ref()

        return { defaultOptions, selection }
      },
      template: `
        <sm-multi-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          name="multiselect"
          :options="defaultOptions"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findByText('Input label')).toBeVisible()
    expect(screen.getByRole('textbox', { name: 'Input label' })).toBeVisible()
    expect(screen.getByRole('combobox', { name: 'Input label' })).toBeVisible()
  })

  it('should hide the field label by if labelHidden prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmMultiSelect },
      setup: () => {
        const selection = ref()

        return { defaultOptions, selection }
      },
      template: `
        <sm-multi-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          name="multiselect"
          :label-hidden="true"
          :options="defaultOptions"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.queryByText('Input label')).not.toBeInTheDocument())
    // Input field and combobox should still have discernible name
    expect(screen.getByRole('textbox', { name: 'Input label' })).toBeVisible()
    expect(screen.getByRole('combobox', { name: 'Input label' })).toBeVisible()
  })

  it('should set the multi-select field to disabled when prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmMultiSelect },
      setup: () => {
        const selection = ref()

        return { defaultOptions, selection }
      },
      template: `
        <sm-multi-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          name="multiselect"
          :disabled="true"
          :options="defaultOptions"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Click on the field
    const inputField = await screen.findByRole('textbox', { name: 'Input label' })
    await userEvent.click(inputField)

    // ASSERT
    expect(await screen.findByRole('combobox', { name: 'Input label', expanded: false })).toBeVisible()
    expect(inputField).toBeDisabled()
  })

  it('should set the multi-select field to disabled when parent sm-form is disabled', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmForm, SmMultiSelect },
      setup: () => {
        const selection = ref()

        return { defaultOptions, selection }
      },
      template: `
        <sm-form disabled>
          <sm-multi-select
            v-model="selection"
            placeholder="Search a keyword"
            label="Input label"
            name="multiselect"
            :options="defaultOptions"
          />
        </sm-form>
      `,
    }

    // ACT
    render(ParentComponent)

    // Click on the field
    const inputField = await screen.findByRole('textbox', { name: 'Input label' })
    await userEvent.click(inputField)

    // ASSERT
    expect(await screen.findByRole('combobox', { name: 'Input label', expanded: false })).toBeVisible()
    expect(inputField).toBeDisabled()
  })

  it('should attach title attributes to label and description if truncation prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmMultiSelect },
      setup: () => {
        const selection = ref()
        const options = ref([
          { label: 'Long option label', description: 'Long option description', code: 1 },
        ])

        return { options, selection }
      },
      template: `
        <sm-multi-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          name="multiselect"
          :options="options"
          :truncate-option-label="true"
          :truncate-option-description="true"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Focus to open dropdown
    await userEvent.tab()

    // ASSERT
    expect(await screen.findByTitle('Long option label')).toBeVisible()
    expect(screen.getByTitle('Long option description')).toBeVisible()
  })

  it('should display empty state when there are no options available', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmMultiSelect },
      setup: () => {
        const selection = ref()

        return { selection }
      },
      template: `
        <sm-multi-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          name="multiselect"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Focus to open dropdown
    await userEvent.tab()

    // ASSERT
    await waitFor(() => expect(screen.queryByRole('option')).not.toBeInTheDocument())
    expect(screen.getByText('List is empty')).toBeVisible()
  })

  it('should display the input slots if provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmMultiSelect },
      setup: () => {
        const selection = ref()

        return { defaultOptions, selection }
      },
      template: `
        <sm-multi-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          name="multiselect"
          :options="defaultOptions"
        >
          <template #prefix>test-prefix-slot</template>
          <template #suffix>test-suffix-slot</template>
          <template #label>test-label-slot</template>
          <template #action>test-action-slot</template>
        </sm-multi-select>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.queryByText('Input label')).not.toBeInTheDocument())
    expect(screen.getByText('test-prefix-slot')).toBeVisible()
    expect(screen.getByText('test-suffix-slot')).toBeVisible()
    expect(screen.getByText('test-label-slot')).toBeVisible()
    expect(screen.getByText('test-action-slot')).toBeVisible()
    expect(screen.getByRole('textbox', { name: 'Input label' })).toBeVisible()
    expect(screen.getByRole('combobox', { name: 'test-label-slot' })).toBeVisible()
  })

  it('should display the popover footer slot if provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton, SmMultiSelect },
      setup: () => {
        const selection = ref()

        return { defaultOptions, selection }
      },
      template: `
        <sm-multi-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          content-class="custom-content-class"
          footer-class="custom-footer-class"
          name="multiselect"
          :options="defaultOptions"
        >
          <template #footer><sm-button>Action</sm-button></template>
        </sm-multi-select>
      `,
    }

    // ACT
    const { container } = render(ParentComponent)

    // Focus to open dropdown
    await userEvent.tab()
    // Focus on the footer action
    await userEvent.tab()

    // ASSERT
    const footerButton = await screen.findByRole('button', { name: 'Action' })
    expect(footerButton).toBeVisible()
    expect(footerButton).toHaveFocus()
    expect(container.getElementsByClassName('custom-content-class')).toHaveLength(1)
    expect(container.getElementsByClassName('custom-footer-class')).toHaveLength(1)

    // Blur out of the footer action
    await userEvent.tab()

    await waitFor(() => expect(screen.queryByRole('button', { name: 'Action' })).not.toBeInTheDocument())
  })

  it('should navigate options when mapped keyboard keys are pressed', async () => {
    // ARRANGE
    // Exclude last group to make keyboard navigation shorter
    const options = [
      ...defaultGroupedOptions.slice(0, 2),
      {
        title: 'Group 3',
        libs: [
          { label: 'Option 5', code: '5', disabled: true },
        ],
      },
    ]

    const ParentComponent = {
      components: { SmMultiSelect },
      setup: () => {
        const selection = ref()

        return { options, selection }
      },
      template: `
        <div>
          <sm-multi-select
            v-model="selection"
            placeholder="Search a keyword"
            label="Input label"
            name="multiselect"
            :multiple="true"
            :options="options"
            :show-group-select="true"
          />
          <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // Focus to open dropdown
    await userEvent.tab()
    // Move all the way down and attempt to select last item
    // Press arrow keys to check for boundary navigation
    await userEvent.keyboard('{arrowdown}{end}{arrowdown}{enter}')

    // ASSERT
    // Last item is disabled and should not select it
    const inputElement = await screen.findByRole('textbox', { name: 'Input label' })
    let activeOptionId = (screen.getByRole('option', { name: 'Option 5', selected: false })).getAttribute('id')
    expect(inputElement).toHaveAttribute('aria-activedescendant', activeOptionId)
    expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument()

    // Move one item up and select it
    // Press arrow keys to check for boundary navigation
    await userEvent.keyboard('{arrowdown}{arrowup}{enter}')

    let selectedOption = await screen.findByRole('option', { name: 'Option 4', selected: true })
    activeOptionId = selectedOption.getAttribute('id')
    expect(selectedOption).toBeVisible()
    expect(inputElement).toHaveAttribute('aria-activedescendant', activeOptionId)
    expect(screen.getByText('Selected: ["4"]')).toBeVisible()

    // Move all the way up and select first item - "Select group" (group 1)
    // Press arrow keys to check for boundary navigation
    await userEvent.keyboard('{arrowup}{home}{arrowup}{enter}')

    selectedOption = await screen.findByRole('option', { name: 'Select group', selected: true })
    activeOptionId = selectedOption.getAttribute('id')
    expect(selectedOption).toBeVisible()
    expect(inputElement).toHaveAttribute('aria-activedescendant', activeOptionId)
    expect(screen.getByText('Selected: ["1","2","4"]')).toBeVisible()

    // Close dropdown
    await userEvent.keyboard('{esc}')

    await waitFor(() => expect(screen.queryByRole('option')).not.toBeInTheDocument())
  })

  it('should programmatically open and close the dropdown when public APIs are called', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton, SmMultiSelect },
      setup: () => {
        const selection = ref()
        const multiselectRef = ref()

        return { defaultOptions, multiselectRef, selection }
      },
      template: `
        <div>
          <sm-multi-select
            ref="multiselectRef"
            v-model="selection"
            name="multiselect"
            :options="defaultOptions"
          />
          <sm-button @click="multiselectRef?.open()">Open</sm-button>
          <sm-button @click="multiselectRef?.close()">Close</sm-button>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // Open dropdown
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))

    // ASSERT
    expect(await screen.findByRole('option', { name: 'Option 1' })).toBeVisible()

    // Close dropdown
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    await waitFor(() => expect(screen.queryByRole('option', { name: 'Option 1' })).not.toBeInTheDocument())
  })

})
