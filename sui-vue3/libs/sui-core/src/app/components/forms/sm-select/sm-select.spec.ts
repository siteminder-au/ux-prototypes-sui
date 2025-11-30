import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, within } from '@testing-library/vue'
import { defineRule } from 'vee-validate'
import { ref } from 'vue'
import SmButton from '../../sm-button/sm-button.vue'
import SmForm from '../sm-form/sm-form.vue'
import SmSelectPrefixContent from './sm-select-prefix-content.vue'
import SmSelectSuffixContent from './sm-select-suffix-content.vue'
import SmSelect from './sm-select.vue'

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
      { label: 'Option 5', code: 5 }, // Mix in a number type
      { label: 'Option 6', code: '6' },
      { label: 'Option 7', code: '7' },
      { label: 'Option 8', code: '8' },
      { label: 'Option 9', code: '9' },
      { label: 'Option 10', code: '10' },
      { label: 'Option 11', code: '11' },
      { label: 'Option 12', code: '12' },
      { label: 'Option 111', code: '111', description: '' }, // Cover empty strings
    ],
  },
]

// Get an array of expected dropdown of flattened group options
const groupOptions = defaultGroupedOptions.reduce((acc: (string | number)[], group) => {
  const opts = group.libs.map(lib => (lib.description ? `${lib.label} ${lib.description}` : lib.label))

  return acc.concat(opts)
}, [])

// Get an array of expected dropdown of flattened group titles
const groupTitles = defaultGroupedOptions.map(group => group.title)

describe('SmSelect', () => {

  /**
   * Repeat test cases around the value getter and setter on different combinations of
   * standard/grouped and single/multiple variants because they have specific logic branches
   */

  describe('standard single select', () => {

    it('should not have pre-filled input if value is not provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref()

          return { defaultOptions, selection }
        },
        template: `
          <div>
            <sm-select v-model="selection" placeholder="Select an option" label="Input label" :options="defaultOptions" name="selection" />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = screen.getByRole('textbox')
      await waitFor(() => expect(screen.getByRole('combobox')).toBeVisible())
      expect(inputElement).toHaveValue('')
      expect(screen.getByPlaceholderText('Select an option')).toBeVisible()
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      expect(screen.queryByRole('option')).not.toBeInTheDocument()
      expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())
      expect(inputElement).toHaveValue('')

      expect(screen.getAllByRole('option').length).toBe(defaultOptions.length)
      defaultOptions.forEach(({ label }) => {
        expect(screen.getByRole('option', { name: label })).toBeVisible()
      })
    })

    it('should have pre-filled input if value is provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref('1')

          return { defaultOptions, selection }
        },
        template: `
          <div>
            <sm-select v-model="selection" placeholder="Select an option" label="Input label" :options="defaultOptions" name="selection" />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const selectedOptionLabels = screen.getAllByText('Option 1')
      await waitFor(() => expect(selectedOptionLabels[0]).toBeVisible()) // Inside the input field
      expect(selectedOptionLabels[1]).not.toBeVisible() // Inside the dropdown
      expect(screen.getByText('Selected: 1')).toBeVisible()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      await waitFor(() => expect(selectedOptionLabels[0]).not.toBeVisible()) // Inside the input field
      expect(selectedOptionLabels[1]).toBeVisible() // Inside the dropdown
      expect(screen.getAllByRole('option').length).toBe(defaultOptions.length)
      defaultOptions.forEach(({ label }) => {
        // No available selected state/accessible indicators to test within vue-multiselect
        // We check the text displayed on the input field instead in the assertion above
        expect(screen.getByRole('option', { name: label })).toBeVisible()
      })
    })

    it('should have pre-filled input if selection is provided', async () => {
      // ARRANGE
      const options = [
        ...defaultOptions,
        // Add substrings
        { label: 'Option 122', code: '122' },
        { label: 'Option 312', code: '312' },
      ]
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref('12')

          return { options, selection }
        },
        template: `
          <div>
            <sm-select :selection="selection" placeholder="Select an option" label="Input label" :options="options" name="selection" />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const selectedOptionLabels = screen.getAllByText('Option 12')
      await waitFor(() => expect(selectedOptionLabels[0]).toBeVisible()) // Inside the input field
      expect(selectedOptionLabels[1]).not.toBeVisible() // Inside the dropdown
      expect(screen.getByText('Selected: 12')).toBeVisible()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      await waitFor(() => expect(selectedOptionLabels[0]).not.toBeVisible()) // Inside the input field
      expect(selectedOptionLabels[1]).toBeVisible() // Inside the dropdown
      expect(screen.getAllByRole('option').length).toBe(options.length)
      options.forEach(({ label }) => {
        // No available selected state/accessible indicators to test within vue-multiselect
        // We check the text displayed on the input field instead in the assertion above
        expect(screen.getByRole('option', { name: label })).toBeVisible()
      })
    })

    it('should update the selected value if clicked option is not disabled', async () => {
      // ARRANGE
      const selectMock = jest.fn()
      const options = [
        ...defaultOptions,
        { code: '13', label: 'Option 13', $isDisabled: true },
      ]
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref()

          return { options, selection, selectMock }
        },
        template: `
          <div>
            <sm-select
              v-model="selection"
              placeholder="Select an option"
              label="Input label"
              name="selection"
              :options="options"
              @select="selectMock"
            />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument())
      expect(selectMock).toHaveBeenCalledTimes(0)

      // Select an option
      await userEvent.tab()
      await userEvent.click(screen.getByText('Option 1')) // Inside the dropdown

      // Auto-close and update selection
      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
      expect(screen.getAllByText('Option 1')[0]).toBeVisible() // Inside the text field
      expect(screen.getByText('Selected: 1')).toBeVisible()
      expect(selectMock).toHaveBeenCalledTimes(1)
      expect(selectMock).toHaveBeenLastCalledWith({
        code: '1',
        label: 'Option 1',
      })

      // Select the disabled option
      await userEvent.tab()
      const disabledOption = screen.getByRole('listitem') // Disabled options are switched to listitem role
      expect(within(disabledOption).getByText('Option 13')).toBeVisible()
      // Select using this container because clicking by text are causing errors within vue-multiselect
      await userEvent.click(screen.getByRole('listitem'))

      // Do nothing
      await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())
      expect(screen.getByText('Selected: 1')).toBeVisible()
      expect(selectMock).toHaveBeenCalledTimes(1)

      // Select an option
      await userEvent.click(screen.getByText('Option 2')) // Inside the dropdown

      // Auto-close and update selection
      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
      expect(screen.getByText('Selected: 2')).toBeVisible()
      expect(selectMock).toHaveBeenCalledTimes(2)
      expect(selectMock).toHaveBeenLastCalledWith({
        code: '2',
        label: 'Option 2',
      })
    })

    it('should allow selected option to be deselected by default', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref('2')

          return { defaultOptions, selection }
        },
        template: `
          <div>
            <sm-select v-model="selection" placeholder="Select an option" label="Input label" :options="defaultOptions" name="selection" />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // Focus and deselect option
      await userEvent.tab()
      await userEvent.click(screen.getByText('Option 2')) // Inside the dropdown

      // ASSERT
      await waitFor(() => expect(screen.getByText('Option 2')).not.toBeVisible()) // Inside the text field
      expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument()
    })

    it('should not allow selected option to be deselected if allowEmpty is false', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref('2')

          return { defaultOptions, selection }
        },
        template: `
          <div>
            <sm-select
              v-model="selection"
              placeholder="Select an option"
              label="Input label"
              :allow-empty="false"
              :options="defaultOptions"
              name="selection"
            />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // Focus and deselect option
      await userEvent.tab()
      await userEvent.click(screen.getByText('Option 2')) // Inside the dropdown

      // ASSERT
      await waitFor(() => expect(screen.getAllByText('Option 2')[0]).toBeVisible()) // Inside the text field
      expect(screen.getByText('Selected: 2')).toBeVisible()
    })

  })

  describe('standard multi-select', () => {

    it('should not have pre-filled input if value is not provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref()

          return { defaultOptions, selection }
        },
        template: `
          <div>
            <sm-select
              v-model="selection"
              placeholder="Select options"
              label="Input label"
              :multiple="true"
              :options="defaultOptions"
              name="selection"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = screen.getByRole('textbox')
      await waitFor(() => expect(screen.getByRole('combobox')).toBeVisible())
      expect(inputElement).toHaveValue('')
      expect(screen.getByPlaceholderText('Select options')).toBeVisible()
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      expect(screen.queryByRole('option')).not.toBeInTheDocument()
      expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())
      expect(inputElement).toHaveValue('')

      expect(screen.getAllByRole('option').length).toBe(defaultOptions.length)
      defaultOptions.forEach(({ label }) => {
        expect(screen.getByRole('option', { name: label })).toBeVisible()
      })
    })

    it('should have pre-filled input if value is provided', async () => {
      // ARRANGE
      const options = [
        ...defaultOptions,
        // Add substrings
        { label: 'Option 111', code: '111' },
      ]
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref(['3', '1', 'not-found'])

          return { options, selection }
        },
        template: `
          <div>
            <sm-select
              v-model="selection"
              placeholder="Select options"
              label="Input label"
              :multiple="true"
              :options="options"
              name="selection"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getAllByText('Option 1')[0]).toBeVisible()) // Inside the input field
      expect(screen.getAllByText('Option 3')[0]).toBeVisible() // Inside the input field
      expect(screen.getByText('Selected: ["3","1","not-found"]')).toBeVisible()

      // Focus into the input field to open dropdown
      await userEvent.click(screen.getByRole('textbox'))

      const option1 = screen.getAllByText('Option 1')
      const option3 = screen.getAllByText('Option 3')
      await waitFor(() => expect(option1.length).toBe(2)) // Keep the tags within the input field even if the dropdown is open
      expect(option3.length).toBe(2)
      expect(option1[0]).toBeVisible() // Inside the input field
      expect(option3[0]).toBeVisible() // Inside the input field
      expect(screen.getAllByRole('option').length).toBe(options.length)
      options.forEach(({ label }) => {
        // No available selected state/accessible indicators to test within vue-multiselect
        // We check the text displayed on the input field instead in the assertion above
        expect(screen.getByRole('option', { name: label })).toBeVisible()
      })
    })

    it('should have pre-filled input if selection is provided', async () => {
      // ARRANGE
      const options = [
        ...defaultOptions,
        // Add substrings
        { label: 'Option 111', code: '111' },
      ]
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref(['11', 'not-found'])

          return { options, selection }
        },
        template: `
          <div>
            <sm-select
              :selection="selection"
              placeholder="Select options"
              label="Input label"
              :multiple="true"
              :options="options"
              name="selection"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getAllByText('Option 11')[0]).toBeVisible()) // Inside the input field
      expect(screen.getByText('Selected: ["11","not-found"]')).toBeVisible()

      // Focus into the input field to open dropdown
      await userEvent.click(screen.getByRole('textbox'))

      const option11 = screen.getAllByText('Option 11')
      await waitFor(() => expect(option11.length).toBe(2)) // Keep the tags within the input field even if the dropdown is open
      expect(option11[0]).toBeVisible() // Inside the input field
      expect(screen.getAllByRole('option').length).toBe(options.length)
      options.forEach(({ label }) => {
        // No available selected state/accessible indicators to test within vue-multiselect
        // We check the text displayed on the input field instead in the assertion above
        expect(screen.getByRole('option', { name: label })).toBeVisible()
      })
    })

    it('should update the selected value if clicked option is not disabled', async () => {
      // ARRANGE
      const options = [
        ...defaultOptions,
        { code: '13', label: 'Option 13', $isDisabled: true },
      ]
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref()

          return { options, selection }
        },
        template: `
          <div>
            <sm-select v-model="selection" placeholder="Select options" label="Input label" :multiple="true" :options="options" name="selection" />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument())

      // Open the dropdown and select an option
      await userEvent.tab()
      await userEvent.click(screen.getByText('Option 1'))

      // Don't close but update selection
      await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())
      expect(screen.getAllByText('Option 1').length).toBe(2) // Tag added into the input field
      expect(screen.getByText('Selected: ["1"]')).toBeVisible()

      // Select and deselect
      await userEvent.click(screen.getByText('Option 9'))
      await userEvent.click(screen.getAllByText('Option 1')[1]) // Deselect
      await userEvent.click(screen.getByText('Option 4'))

      // Select the disabled option
      const disabledOption = screen.getByRole('listitem') // Disabled options are switched to listitem role
      expect(within(disabledOption).getByText('Option 13')).toBeVisible()
      // Select using this container because clicking by text are causing errors within vue-multiselect
      await userEvent.click(screen.getByRole('listitem'))

      // Don't close but update selection
      await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())
      expect(screen.getByText('Selected: ["4","9"]')).toBeVisible()

      // Blur input field
      await userEvent.tab()

      // Auto-close dropdown
      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
      expect(screen.getAllByText('Option 1').length).toBe(1) // Tag removed from the input field
      expect(screen.getAllByText('Option 4').length).toBe(2) // Tag added into the input field
      expect(screen.getAllByText('Option 9').length).toBe(2) // Tag added into the input field
    })

    it('should deselect options when close button in tags are clicked', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref(['3', '1', '9'])

          return { defaultOptions, selection }
        },
        template: `
          <div>
            <sm-select
              v-model="selection"
              placeholder="Select options"
              label="Input label"
              :multiple="true"
              :options="defaultOptions"
              name="selection"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByText('Selected: ["3","1","9"]')).toBeVisible())

      // Deselect via tags
      await userEvent.tab() // Focus into first tag's close
      await userEvent.keyboard('{enter}') // Remove Option 1
      const closeButtons = screen.getAllByRole('button', { name: 'Remove' })
      await userEvent.click(closeButtons[1]) // Remove Option 9
      await userEvent.click(closeButtons[0]) // Remove Option 3

      await waitFor(() => expect(screen.getByText('Selected: []')).toBeVisible())
    })

    it('should not be able to deselect all options when allowEmpty is false', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref(['3', '1', '9'])

          return { defaultOptions, selection }
        },
        template: `
          <div>
            <sm-select
              v-model="selection"
              placeholder="Select options"
              label="Input label"
              :allow-empty="false"
              :multiple="true"
              :options="defaultOptions"
              name="selection"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByText('Selected: ["3","1","9"]')).toBeVisible())

      // Deselect via tags
      await userEvent.tab() // Focus into first tag's close
      await userEvent.keyboard('{enter}') // Remove Option 1
      const closeButtons = screen.getAllByRole('button', { name: 'Remove' })
      await userEvent.click(closeButtons[1]) // Remove Option 9
      await userEvent.click(closeButtons[0]) // Remove Option 3

      await waitFor(() => expect(screen.getByText('Selected: ["3"]')).toBeVisible())
    })

    it('should filter the options when keyword is typed in the input field by default', async () => {
      // ARRANGE
      const searchChangeMock = jest.fn()
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref()

          return { defaultOptions, selection, searchChangeMock }
        },
        template: `
          <sm-select
            v-model="selection"
            placeholder="Search a keyword"
            label="Input label"
            :multiple="true"
            :options="defaultOptions"
            name="selection"
            @search-change="searchChangeMock"
          />
        `,
      }

      // ACT
      render(ParentComponent)

      // Type keyword with multiple results
      const inputField = screen.getByRole('textbox')
      expect(searchChangeMock).toHaveBeenCalledTimes(0)

      await userEvent.type(inputField, '1')

      // ASSERT
      await waitFor(() => expect(screen.getAllByRole('option').length).toBe(4))
      expect(screen.getByRole('option', { name: 'Option 1' })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 10' })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 11' })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 12' })).toBeVisible()
      expect(inputField).toHaveValue('1')
      expect(searchChangeMock).toHaveBeenCalledTimes(1)
      expect(searchChangeMock).toHaveBeenLastCalledWith('1')

      // Type keyword with single result (append from previous input)
      await userEvent.type(inputField, '2')

      // Select all should be hidden if there is only 1 option
      await waitFor(() => expect(screen.getAllByRole('option').length).toBe(1))
      expect(screen.getByRole('option', { name: 'Option 12' })).toBeVisible()
      expect(inputField).toHaveValue('12')
      expect(searchChangeMock).toHaveBeenCalledTimes(2)
      expect(searchChangeMock).toHaveBeenLastCalledWith('12')

      // Type keyword with no result (append from previous input)
      await userEvent.type(inputField, '3')

      // No option should be available
      await waitFor(() => expect(screen.queryByRole('option')).not.toBeInTheDocument())
      expect(screen.getByText('123 cannot be found')).toBeVisible()
      expect(inputField).toHaveValue('123')
      expect(searchChangeMock).toHaveBeenCalledTimes(3)
      expect(searchChangeMock).toHaveBeenLastCalledWith('123')

      // Remove query
      await userEvent.clear(inputField)

      // All items should be visible again
      await waitFor(() => expect(screen.getAllByRole('option').length).toBe(defaultOptions.length))
      expect(searchChangeMock).toHaveBeenCalledTimes(4)
      expect(searchChangeMock).toHaveBeenLastCalledWith('')
    })

    it('should limit the displayed tags if collapseTags and multipleLimit props are set', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref(defaultOptions.map(o => o.code)) // Select all

          return { defaultOptions, selection }
        },
        template: `
          <sm-select
            v-model="selection"
            placeholder="Select options"
            label="Input label"
            :collapse-tags="true"
            :collapse-tags-limit="2"
            :multiple="true"
            :options="defaultOptions"
            name="selection"
          />
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getAllByText('Option 1')[0]).toBeVisible()) // Inside the input field
      expect(screen.getAllByText('Option 2')[0]).toBeVisible() // Inside the input field
      expect(screen.getAllByRole('button', { name: 'Remove' }).length).toBe(2) // Tag close buttons
      expect(screen.getByText('+10')).toBeVisible()
    })

    it('should emit `tag-added` event allow create prop is true', async () => {
      // ARRANGE
      const tagAddedMock = jest.fn()
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref()

          return { defaultOptions, selection, tagAddedMock }
        },
        template: `
          <sm-select
            v-model="selection"
            placeholder="Search a keyword"
            label="Input label"
            :allow-create="true"
            :multiple="true"
            :options="defaultOptions"
            @tag-added="tagAddedMock"
            name="selection"
          />
        `,
      }

      // ACT
      render(ParentComponent)

      const inputField = screen.getByRole('textbox')
      await userEvent.click(inputField)

      // ASSERT
      await waitFor(() => expect(screen.queryByText('New option cannot be found')).not.toBeInTheDocument())
      expect(screen.queryByRole('option', { name: 'New option' })).not.toBeInTheDocument()
      expect(tagAddedMock).toHaveBeenCalledTimes(0)

      // Type new keyword
      await userEvent.type(inputField, 'New option')

      await waitFor(() => expect(screen.getByText('New option cannot be found')).not.toBeVisible())
      expect(screen.getByRole('option', { name: 'New option' })).toBeVisible()

      // Click newly created option
      await userEvent.click(screen.getByText('New option'))

      // Options and selection will not change but event should be emitted
      await waitFor(() => expect(screen.queryByText('New option')).not.toBeInTheDocument())
      expect(tagAddedMock).toHaveBeenCalledTimes(1)
    })

  })

  describe('grouped single select', () => {

    it('should not have pre-filled input if value is not provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref()

          return { defaultGroupedOptions, selection }
        },
        template: `
          <div>
            <sm-select
              v-model="selection"
              placeholder="Select an option"
              label="Input label"
              :options="defaultGroupedOptions"
              :show-group-select="true"
              name="selection"
            />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = screen.getByRole('textbox')
      await waitFor(() => expect(screen.getByRole('combobox')).toBeVisible())
      expect(inputElement).toHaveValue('')
      expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())

      groupTitles.forEach((expectedTitle) => {
        expect(screen.getByText(expectedTitle)).toBeVisible()
      })

      expect(screen.getAllByRole('option').length).toBe(groupOptions.length)
      groupOptions.forEach((expectedOption) => {
        expect(screen.getByRole('option', { name: String(expectedOption) })).toBeVisible()
      })
    })

    it('should have pre-filled input if value is provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref('111')

          return { defaultGroupedOptions, selection }
        },
        template: `
          <div>
            <sm-select
              v-model="selection"
              placeholder="Select an option"
              label="Input label"
              :options="defaultGroupedOptions"
              :show-group-select="true"
              name="selection"
            />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('combobox')).toBeVisible())
      expect(screen.getAllByText('Option 111')[0]).toBeVisible() // Inside the input field
      expect(screen.getByText('Selected: 111')).toBeVisible()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())

      groupTitles.forEach((expectedTitle) => {
        expect(screen.getByText(expectedTitle)).toBeVisible()
      })

      expect(screen.getAllByRole('option').length).toBe(groupOptions.length)
      groupOptions.forEach((expectedOption) => {
        // No available selected state/accessible indicators to test within vue-multiselect
        // We check the text displayed on the input field instead in the assertion above
        expect(screen.getByRole('option', { name: String(expectedOption) })).toBeVisible()
      })
    })

    it('should have pre-filled input if selection is provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref('11')

          return { defaultGroupedOptions, selection }
        },
        template: `
          <div>
            <sm-select
              :selection="selection"
              placeholder="Select an option"
              label="Input label"
              :options="defaultGroupedOptions"
              :show-group-select="true"
              name="selection"
            />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('combobox')).toBeVisible())
      expect(screen.getAllByText('Option 11')[0]).toBeVisible() // Inside the input field
      expect(screen.getByText('Selected: 11')).toBeVisible()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())

      groupTitles.forEach((expectedTitle) => {
        expect(screen.getByText(expectedTitle)).toBeVisible()
      })

      expect(screen.getAllByRole('option').length).toBe(groupOptions.length)
      groupOptions.forEach((expectedOption) => {
        // No available selected state/accessible indicators to test within vue-multiselect
        // We check the text displayed on the input field instead in the assertion above
        expect(screen.getByRole('option', { name: String(expectedOption) })).toBeVisible()
      })
    })

    it('should update the selected value if clicked option is not disabled', async () => {
      // ARRANGE
      const options = [
        ...defaultGroupedOptions,
        {
          title: 'Group 4',
          libs: [{ code: '13', label: 'Option 13', $isDisabled: true }],
        },
      ]
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref()

          return { options, selection }
        },
        template: `
          <div>
            <sm-select
              v-model="selection"
              placeholder="Select an option"
              label="Input label"
              :options="options"
              :show-group-select="true"
              name="selection"
            />
            <span v-if="selection">Selected: {{ selection }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument())

      // Select an option
      await userEvent.tab()
      await userEvent.click(screen.getByText('Option 1'))

      // Auto-close and update selection
      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
      expect(screen.getByText('Selected: 1')).toBeVisible()

      // Select the disabled option
      // vue-multiselect's implementation of disabled option between standard and grouped variants
      // are different so we can directly click on the text label here without throwing errors
      // In addition, disabled option here do not have any associated role (option nor listitem)
      await userEvent.tab()
      await userEvent.click(screen.getByText('Option 13'))

      // Do nothing
      await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())
      expect(screen.getByText('Selected: 1')).toBeVisible()

      // Select an option
      await userEvent.click(screen.getByText('Option 11'))

      // Auto-close and update selection
      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
      expect(screen.getByText('Selected: 11')).toBeVisible()
    })

  })

  describe('grouped multi-select', () => {

    it('should not have pre-filled input if value is not provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref()

          return { defaultGroupedOptions, selection }
        },
        template: `
          <div>
            <sm-select
              v-model="selection"
              placeholder="Select an option"
              label="Input label"
              :multiple="true"
              :options="defaultGroupedOptions"
              :show-group-select="true"
              name="selection"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const inputElement = screen.getByRole('textbox')
      await waitFor(() => expect(screen.getByRole('combobox')).toBeVisible())
      expect(inputElement).toHaveValue('')
      expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument()

      // Focus into the input field to open dropdown
      await userEvent.tab()

      await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())

      groupTitles.forEach((expectedTitle) => {
        expect(screen.getByText(expectedTitle)).toBeVisible()
      })

      expect(screen.getAllByRole('option').length).toBe(groupOptions.length)
      groupOptions.forEach((expectedOption) => {
        expect(screen.getByRole('option', { name: String(expectedOption) })).toBeVisible()
      })
    })

    it('should have pre-filled input if value is provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          // Test case where selected options are on different groups, similar groups,
          // and the selected option has a substring on different groups: 1 vs 11 vs 111
          const selection = ref([
            '2', // Group 1
            5, // Group 3
            '111', // Group 3
          ])

          return { defaultGroupedOptions, selection }
        },
        template: `
          <div>
            <sm-select
              v-model="selection"
              placeholder="Select an option"
              label="Input label"
              :multiple="true"
              :options="defaultGroupedOptions"
              :show-group-select="true"
              name="selection"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('combobox')).toBeVisible())
      expect(screen.getAllByText('Option 2')[0]).toBeVisible() // Inside the input field
      expect(screen.getAllByText('Option 111')[0]).toBeVisible() // Inside the input field
      expect(screen.getByText('Selected: ["2",5,"111"]')).toBeVisible()

      // Focus into the input field to open dropdown
      await userEvent.click(screen.getByRole('textbox'))

      await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())

      groupTitles.forEach((expectedTitle) => {
        expect(screen.getByText(expectedTitle)).toBeVisible()
      })

      expect(screen.getAllByRole('option').length).toBe(groupOptions.length)
      groupOptions.forEach((expectedOption) => {
        // No available selected state/accessible indicators to test within vue-multiselect
        // We check the text displayed on the input field instead in the assertion above
        expect(screen.getByRole('option', { name: String(expectedOption) })).toBeVisible()
      })
    })

    it('should have pre-filled input if selection is provided', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref(['11', 'not-found'])

          return { defaultGroupedOptions, selection }
        },
        template: `
          <div>
            <sm-select
              :selection="selection"
              placeholder="Select an option"
              label="Input label"
              :multiple="true"
              :options="defaultGroupedOptions"
              :show-group-select="true"
              name="selection"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('combobox')).toBeVisible())
      expect(screen.getAllByText('Option 11')[0]).toBeVisible() // Inside the input field
      expect(screen.getByText('Selected: ["11","not-found"]')).toBeVisible()

      // Focus into the input field to open dropdown
      await userEvent.click(screen.getByRole('textbox'))

      await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())

      groupTitles.forEach((expectedTitle) => {
        expect(screen.getByText(expectedTitle)).toBeVisible()
      })

      expect(screen.getAllByRole('option').length).toBe(groupOptions.length)
      groupOptions.forEach((expectedOption) => {
        // No available selected state/accessible indicators to test within vue-multiselect
        // We check the text displayed on the input field instead in the assertion above
        expect(screen.getByRole('option', { name: String(expectedOption) })).toBeVisible()
      })
    })

    it('should update the selected value if clicked option is not disabled', async () => {
      // ARRANGE
      const options = [
        ...defaultGroupedOptions,
        {
          title: 'Group 4',
          libs: [{ code: '13', label: 'Option 13', $isDisabled: true }],
        },
      ]
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref()

          return { options, selection }
        },
        template: `
          <div>
            <sm-select
              v-model="selection"
              placeholder="Select an option"
              label="Input label"
              :multiple="true"
              :options="options"
              :show-group-select="true"
              name="selection"
            />
            <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument())

      // Select an option
      await userEvent.tab()
      await userEvent.click(screen.getByText('Option 1'))

      // Don't auto-close and update selection
      await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())
      expect(screen.getByText('Selected: ["1"]')).toBeVisible()

      // Select the disabled option
      // vue-multiselect's implementation of disabled option between standard and grouped variants
      // are different so we can directly click on the text label here without throwing errors
      // In addition, disabled option here do not have any associated role (option nor listitem)
      await userEvent.click(screen.getByText('Option 13'))

      // Do nothing
      await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())
      expect(screen.getByText('Selected: ["1"]')).toBeVisible()

      // Select an option
      await userEvent.click(screen.getByText('Option 11'))

      // Don't auto-close and update selection
      await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())
      expect(screen.getByText('Selected: ["1","11"]')).toBeVisible()

      // Blur out of the input field
      await userEvent.tab()

      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
    })

    it('should filter the options when keyword is typed in the input field by default', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSelect },
        setup: () => {
          const selection = ref(['1'])

          return { defaultGroupedOptions, selection }
        },
        template: `
          <sm-select
            v-model="selection"
            placeholder="Search a keyword"
            label="Input label"
            :multiple="true"
            :show-group-select="true"
            :options="defaultGroupedOptions"
            name="selection"
          />
        `,
      }

      // ACT
      render(ParentComponent)

      // Type keyword with multiple results
      const inputField = screen.getByRole('textbox')
      await userEvent.type(inputField, '1')

      // ASSERT
      await waitFor(() => expect(screen.getAllByRole('option').length).toBe(5))
      expect(screen.getByText('Group 1')).toBeVisible()
      expect(screen.queryByText('Group 2')).not.toBeInTheDocument()
      expect(screen.getByText('Group 3')).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 1' })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 10' })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 11' })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 12' })).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 111' })).toBeVisible()
      expect(inputField).toHaveValue('1')

      // Type keyword with single result (append from previous input)
      await userEvent.type(inputField, '2')

      // Select group should be hidden if there is only 1 option
      await waitFor(() => expect(screen.getAllByRole('option').length).toBe(1))
      expect(screen.queryByText('Group 1')).not.toBeInTheDocument()
      expect(screen.queryByText('Group 2')).not.toBeInTheDocument()
      expect(screen.getByText('Group 3')).toBeVisible()
      expect(screen.getByRole('option', { name: 'Option 12' })).toBeVisible()
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
      await waitFor(() => expect(screen.getAllByRole('option').length).toBe(groupOptions.length))
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
      components: { SmSelect },
      setup: () => {
        const selection = ref()

        return { defaultOptions, selection }
      },
      template: `
        <sm-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          :filterable="false"
          :options="defaultOptions"
          name="selection"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.queryByRole('textbox')).not.toBeInTheDocument())
  })

  it('should not filter the list when internalSearch prop is false', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSelect },
      setup: () => {
        const selection = ref()

        return { defaultOptions, selection }
      },
      template: `
        <sm-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          :internal-search="false"
          :options="defaultOptions"
          name="selection"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Type keyword with no results
    const inputField = screen.getByRole('textbox')
    await userEvent.type(inputField, '123')

    // ASSERT
    await waitFor(() => expect(screen.getAllByRole('option').length).toBe(defaultOptions.length))
  })

  it('should clear the search query when an option is clicked by default', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSelect },
      setup: () => {
        const selection = ref()

        return { defaultOptions, selection }
      },
      template: `
        <sm-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          :options="defaultOptions"
          :multiple="true"
          name="selection"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Focus to open dropdown
    await userEvent.type(screen.getByRole('textbox'), '9')

    // ASSERT
    await waitFor(() => expect(screen.getAllByRole('option').length).toBe(1))

    // Select an option
    await userEvent.click(screen.getByText('Option 9'))

    // Keep open and clear the search field
    await waitFor(() => expect(screen.getAllByRole('option').length).toBe(defaultOptions.length))
    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('should not clear the search query when an option is clicked and clearOnSelect prop is false', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSelect },
      setup: () => {
        const selection = ref()

        return { defaultOptions, selection }
      },
      template: `
        <sm-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          :clear-on-select="false"
          :options="defaultOptions"
          :multiple="true"
          name="selection"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Focus to open dropdown
    await userEvent.type(screen.getByRole('textbox'), '3')

    // ASSERT
    await waitFor(() => expect(screen.getAllByRole('option').length).toBe(1))

    // Select an option
    await userEvent.click(screen.getByText('Option 3'))

    // Keep open and clear the search field
    await waitFor(() => expect(screen.getAllByRole('option').length).toBe(1))
    expect(screen.getByRole('textbox')).toHaveValue('3')
  })

  it('should validate the value when the field is interacted with', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton, SmSelect },
      setup: () => {
        const selection = ref()
        const selectRef = ref()

        defineRule('required', (value: unknown) => {
          if (!value) {
            return 'This is a custom required field message'
          }

          return true
        })

        return { defaultOptions, selectRef, selection }
      },

      template: `
        <div>
          <sm-select
            v-model="selection"
            ref="selectRef"
            placeholder="Search a keyword"
            label="Input label"
            name="test-name"
            vid="test-vid"
            :rules="{ required: true }"
            :options="defaultOptions"
          />
          <sm-button @click="selectRef?.validate()">Validate</sm-button>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // Validate right away
    await userEvent.click(screen.getByRole('button', { name: 'Validate' }))

    // ASSERT
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('This is a custom required field message'))
    expect(screen.getByText('This is a custom required field message')).toBeVisible()

    // Click on the field and select item
    await userEvent.click(screen.getByRole('textbox'))
    await userEvent.click(screen.getByText('Option 1'))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(''))
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()
  })

  it('should validate on blur', async () => {
    const ValidationMessage = 'This is a custom required field message'
    // ARRANGE
    const ParentComponent = {
      components: { SmSelect },
      setup: () => {
        defineRule('required', (value: unknown) => {
          if (!value) {
            return ValidationMessage
          }

          return true
        })

        const selection = ref()

        return { defaultOptions, selection }
      },
      template: `
        <sm-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          :options="defaultOptions"
          rules="required"
          name="selection"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Focus to open dropdown
    await userEvent.click(screen.getByRole('textbox'))

    // ASSERT
    // Tab outside to blur
    await userEvent.tab()

    expect(screen.getByText(ValidationMessage)).toBeVisible()
  })

  it('should not show the error message if errorDisabled prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton, SmSelect },
      setup: () => {
        const selection = ref()
        const selectRef = ref()

        defineRule('required', (value: unknown) => {
          if (!value) {
            return 'This is a custom required field message'
          }

          return true
        })

        return { defaultOptions, selectRef, selection }
      },

      template: `
        <div>
          <sm-select
            v-model="selection"
            ref="selectRef"
            placeholder="Search a keyword"
            label="Input label"
            rules="required"
            :error-disabled="true"
            :options="defaultOptions"
            name="selection"
          />
          <sm-button @click="selectRef?.validate()">Validate</sm-button>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // Validate right away
    await userEvent.click(screen.getByRole('button', { name: 'Validate' }))

    // ASSERT
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
  })

  it('should show the field label by default', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSelect },
      setup: () => {
        const selection = ref()

        return { defaultOptions, selection }
      },
      template: `
        <sm-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          :options="defaultOptions"
          name="selection"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Input label')).toBeVisible())
  })

  it('should hide the field label by if labelHidden prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSelect },
      setup: () => {
        const selection = ref()

        return { defaultOptions, selection }
      },
      template: `
        <sm-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          :label-hidden="true"
          :options="defaultOptions"
          name="selection"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.queryByText('Input label')).not.toBeInTheDocument())
  })

  it('should set the select field to disabled when prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSelect },
      setup: () => {
        const selection = ref()

        return { defaultOptions, selection }
      },
      template: `
        <sm-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          :disabled="true"
          :options="defaultOptions"
          name="selection"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Click on the field
    const inputField = screen.getByRole('textbox')
    await userEvent.click(inputField)

    // ASSERT
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
    expect(inputField).toBeDisabled()
  })

  it('should set the multi-select field to disabled when parent sm-form is disabled', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmForm, SmSelect },
      setup: () => {
        const selection = ref()

        return { defaultOptions, selection }
      },
      template: `
        <sm-form disabled>
          <sm-select
            v-model="selection"
            placeholder="Search a keyword"
            label="Input label"
            :options="defaultOptions"
            name="selection"
          />
        </sm-form>
      `,
    }

    // ACT
    render(ParentComponent)

    // Click on the field
    const inputField = screen.getByRole('textbox')
    await userEvent.click(inputField)

    // ASSERT
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
    expect(inputField).toBeDisabled()
  })

  it('should attach title attributes to label and description if truncation prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSelect },
      setup: () => {
        const selection = ref()
        const options = ref([
          {
            label: 'Long option label',
            description: 'Long option description',
            code: 1,
            truncateDescription: true,
            truncateLabel: true,
          },
        ])

        return { options, selection }
      },
      template: `
        <sm-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          :options="options"
          name="selection"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Focus to open dropdown
    await userEvent.tab()

    // ASSERT
    await waitFor(() => expect(screen.getByTitle('Long option label')).toBeVisible())
    expect(screen.getByTitle('Long option description')).toBeVisible()
  })

  it('should display empty state when there are no options available', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSelect },
      setup: () => {
        const selection = ref()

        return { selection }
      },
      template: `
        <sm-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          name="selection"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Focus to open dropdown
    await userEvent.tab()

    // ASSERT
    await waitFor(() => expect(screen.queryByRole('option')).not.toBeInTheDocument())
    expect(screen.getByText('List is empty.')).toBeVisible()
  })

  it('should display the input slots if provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSelect, SmSelectPrefixContent, SmSelectSuffixContent },
      setup: () => {
        const selection = ref()

        return { defaultOptions, selection }
      },
      template: `
        <sm-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          :options="defaultOptions"
          name="selection"
        >
          <template #prefix>
            <sm-select-prefix-content>test-prefix-slot</sm-select-prefix-content>
          </template>
          <template #suffix>
            <sm-select-suffix-content>test-suffix-slot</sm-select-suffix-content>
          </template>
          <template #label>test-label-slot</template>
          <template #action>test-action-slot</template>
        </sm-select>
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
  })

  it('should navigate options when mapped keyboard keys are pressed', async () => {
    // ARRANGE
    // To explicitly attach the listener and cover onMounted branch, we don't test for scrolling event tho
    const listScrollEndMock = jest.fn()

    // Generate sequence of user-event keyboard actions
    const moveDown = (steps: number): string => Array.from({ length: steps }, () => '{arrowdown}').join('')
    const moveUp = (steps: number): string => Array.from({ length: steps }, () => '{arrowUp}').join('')

    // Exclude last group to make keyboard navigation shorter
    const options = [
      ...defaultGroupedOptions.slice(0, 2),
      {
        title: 'Group 3',
        libs: [
          { label: 'Option 5', code: '5', $isDisabled: true },
        ],
      },
    ]

    const ParentComponent = {
      components: { SmSelect },
      setup: () => {
        const selection = ref()

        return { options, selection, listScrollEndMock }
      },
      template: `
        <div>
          <sm-select
            v-model="selection"
            placeholder="Search a keyword"
            label="Input label"
            :multiple="true"
            :options="options"
            :show-group-select="true"
            :group-select="true"
            @list-scroll-end="listScrollEndMock"
            name="selection"
          />
          <span v-if="selection">Selected: {{ JSON.stringify(selection) }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // Focus to open dropdown
    await userEvent.tab()
    await waitFor(() => expect(listScrollEndMock).toHaveBeenCalledTimes(0))

    // Move all the way down and attempt to select last item
    // Press arrow keys to check for boundary navigation
    await userEvent.keyboard(`${moveDown(10)}{enter}`)

    // ASSERT
    // Last item is disabled and should not select it
    await waitFor(() => expect(screen.queryByText('Selected: ', { exact: false })).not.toBeInTheDocument())

    // Move up for the group select via title
    await userEvent.keyboard(`${moveUp(1)}{enter}`)

    // Last group has no selectable items
    await waitFor(() => expect(screen.getByText('Selected: []')).toBeVisible())

    // Move one item up and select it
    await userEvent.keyboard(`${moveUp(1)}{enter}`)

    await waitFor(() => expect(screen.getByText('Selected: ["4"]')).toBeVisible())

    // Move all the way up and select first item - "Select group" (group 1) via title
    // Press arrow keys to check for boundary navigation
    await userEvent.keyboard(`${moveUp(10)}{enter}`)

    await waitFor(() => expect(screen.getByText('Selected: ["1","2","4"]')).toBeVisible())

    // Close dropdown
    await userEvent.keyboard('{esc}')
  })

  it('should have pre-filled input if remote value is provided', async () => {
    // ARRANGE
    const options = ref([
      { code: 2, label: 'Option 2', description: 'Loaded option' },
    ])
    const ParentComponent = {
      components: { SmSelect },
      setup: () => {
        const selection = ref([
          { code: 1, label: 'Option 1', description: 'Remote option' },
          { code: 999, label: 'Option 999', description: 'Remote option' },
        ])

        return { options, selection }
      },
      template: `
        <sm-select
          v-model="selection"
          placeholder="Search a keyword"
          label="Input label"
          :options="options"
          :multiple="true"
          :remote="true"
          name="selection"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // Focus to open dropdown
    await userEvent.click(screen.getByRole('textbox'))

    // ASSERT
    // Pre-selected options should not be available in the dropdown
    await waitFor(() => expect(screen.getAllByRole('option').length).toBe(1))
    expect(screen.getByRole('option', { name: 'Option 2 Loaded option' })).toBeVisible()
    // Pre-selected tags should be available in the input field
    expect(screen.getByText('Option 1')).toBeVisible()
    expect(screen.getByText('Option 999')).toBeVisible()

    // Select an option
    await userEvent.click(screen.getByText('Option 2'))

    expect(screen.getAllByText('Option 2')[0]).toBeVisible() // Added tag inside the input field
    expect(screen.getAllByText('Option 2')[1]).toBeVisible() // Existing tag in the dropdown
  })

})
