import { FieldValidationMetaInfo } from '@/app/libs/vee-validate/rules/types'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { required } from '@vee-validate/rules'
import { configure, defineRule } from 'vee-validate'
import { ref } from 'vue'
import SmForm from '../sm-form/sm-form.vue'
import SmCheckboxButton from './sm-checkbox-button.vue'
import SmCheckboxGroup from './sm-checkbox-group.vue'
import SmCheckbox from './sm-checkbox.vue'

describe('SmCheckboxGroup', () => {

  beforeAll(() => {
    defineRule('required', required)

    configure({
      generateMessage: (context: FieldValidationMetaInfo) => {
        const ruleName = context.rule?.name ?? ''

        return `This is a custom ${ruleName} field message`
      },
    })
  })

  it('should display the group label when prop is provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCheckbox, SmCheckboxGroup },
      setup: () => {
        const checkboxValue = ref('test')

        return { checkboxValue }
      },
      template: `
        <div>
          <sm-checkbox-group label="checkbox-group-label" name="checkboxName">
            <sm-checkbox v-model="checkboxValue" selected-value="test-one" name="checkboxName" />
          </sm-checkbox-group>
          <span>Value: {{ checkboxValue }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findByRole('group')).toHaveTextContent('checkbox-group-label')
    expect(screen.getByText('checkbox-group-label')).toBeVisible()
  })

  it('should hide the group label when labelHidden is set to true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCheckbox, SmCheckboxGroup },
      setup: () => {
        const checkboxValue = ref('test')

        return { checkboxValue }
      },
      template: `
        <div>
          <sm-checkbox-group label="checkbox-group-label" name="checkboxName" :label-hidden="true">
            <sm-checkbox v-model="checkboxValue" selected-value="test-one" name="checkboxName" />
          </sm-checkbox-group>
          <span>Value: {{ checkboxValue }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const checkboxGroupElement = screen.getByRole('group')
    await waitFor(() => expect(checkboxGroupElement).toHaveTextContent('checkbox-group-label'))
    // generally we should defer any visual assertions to percy
    // in this scenario, this is testing if an a11y related class has been attached to the element.
    // so valid to keep this test here and assert that the a11y related class was attached.
    expect(checkboxGroupElement).toHaveClass('sm-checkbox-group--label-hidden')
  })

  it('should validate required checkbox group when interacted with', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCheckbox, SmCheckboxGroup, SmForm },
      setup: () => {
        const checkboxValue = ref(['option-2'])

        return { checkboxValue }
      },
      template: `
        <sm-form>
          <sm-checkbox-group
            label="checkbox-group-label"
            name="checkbox-name"
            rules="required"
            :block="true"
          >
            <sm-checkbox
              v-model="checkboxValue"
              selected-value="option-1"
              label="Option 1"
              name="checkbox-name"
              rules="required"
              :error-disabled="true"
            />
            <sm-checkbox
              v-model="checkboxValue"
              selected-value="option-2"
              label="Option 2"
              name="checkbox-name"
              rules="required"
              :error-disabled="true"
            />
          </sm-checkbox-group>
          <span>Value: {{ JSON.stringify(checkboxValue) }}</span>
        </sm-form>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findByRole('group')).toHaveTextContent('checkbox-group-label')
    expect(screen.getByText('checkbox-group-label')).toBeVisible()
    expect(screen.getByText('*')).toBeVisible()
    expect(screen.getByText('Value: ["option-2"]'))
    expect(screen.getByRole('alert')).toHaveTextContent('')
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()

    // Uncheck the selected option to trigger validation
    await userEvent.click(screen.getByLabelText('Option 2'))

    expect(await screen.findByText('Value: []'))
    expect(screen.getByRole('alert')).toHaveTextContent('This is a custom required field message')
    expect(screen.getByText('This is a custom required field message')).toBeVisible()

    // Check the selected option to clear validation
    await userEvent.click(screen.getByLabelText('Option 1'))

    expect(await screen.findByText('Value: ["option-1"]'))
    expect(screen.getByRole('alert')).toHaveTextContent('')
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()
  })

  it('should validate the group but hide the error message when error-disabled prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCheckbox, SmCheckboxGroup, SmForm },
      setup: () => {
        const checkboxValue = ref(['option-1'])

        return { checkboxValue }
      },
      template: `
        <sm-form>
          <sm-checkbox-group
            label="checkbox-group-label"
            name="checkbox-name"
            rules="required"
            :error-disabled="true"
          >
            <sm-checkbox
              v-model="checkboxValue"
              selected-value="option-1"
              label="Option 1"
              name="checkbox-name"
              rules="required"
              :error-disabled="true"
            />
            <sm-checkbox
              v-model="checkboxValue"
              selected-value="option-2"
              label="Option 2"
              name="checkbox-name"
              rules="required"
              :error-disabled="true"
            />
          </sm-checkbox-group>
          <span>Value: {{ JSON.stringify(checkboxValue) }}</span>
        </sm-form>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findByRole('group')).toHaveTextContent('checkbox-group-label')
    expect(screen.getByText('checkbox-group-label')).toBeVisible()
    expect(screen.getByText('*')).toBeVisible()
    expect(screen.getByText('Value: ["option-1"]'))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()

    // Uncheck the selected option to trigger validation
    await userEvent.click(screen.getByLabelText('Option 1'))

    expect(await screen.findByText('Value: []'))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()

    // Check the selected option to clear validation
    await userEvent.click(screen.getByLabelText('Option 2'))

    expect(await screen.findByText('Value: ["option-2"]'))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()
  })

  it('should select the checkbox values of different types when the items are interacted with', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCheckboxButton, SmCheckboxGroup },
      setup: () => {
        const checkboxValues = ref([])
        const objectValue = ref({ value: 'some-value' })

        return { checkboxValues, objectValue }
      },
      template: `
        <div>
          <sm-checkbox-group label="checkbox-group-label" name="checkboxName">
            <sm-checkbox-button v-model="checkboxValues" label="test-one" selected-value="test-one" name="checkboxName" />
            <sm-checkbox-button v-model="checkboxValues" label="true" :selected-value="true" name="checkboxName" />
            <sm-checkbox-button v-model="checkboxValues" label="1000" :selected-value="1000" name="checkboxName" />
            <sm-checkbox-button v-model="checkboxValues" label="object-value" :selected-value="objectValue" name="checkboxName" />
          </sm-checkbox-group>
          <span>Values: {{ JSON.stringify(checkboxValues) }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const checkboxLabel = await screen.findByRole('group')

    const checkboxes = screen.getAllByRole('checkbox')

    // Initial state
    expect(checkboxLabel).toHaveTextContent('checkbox-group-label')
    expect(checkboxLabel).toBeVisible()
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeVisible()
      expect(checkbox).not.toBeChecked()
    })
    expect(screen.getByText('Values: []')).toBeVisible()

    // Check one by one
    await userEvent.click(checkboxes[0])

    expect(checkboxes.at(0)).toBeChecked()
    expect(checkboxes.at(1)).not.toBeChecked()
    expect(checkboxes.at(2)).not.toBeChecked()
    expect(checkboxes.at(3)).not.toBeChecked()
    expect(screen.getByText('Values: ["test-one"]')).toBeVisible()

    await userEvent.click(checkboxes[1])

    expect(checkboxes.at(0)).toBeChecked()
    expect(checkboxes.at(1)).toBeChecked()
    expect(checkboxes.at(2)).not.toBeChecked()
    expect(checkboxes.at(3)).not.toBeChecked()
    expect(screen.getByText('Values: ["test-one",true]')).toBeVisible()

    await userEvent.click(checkboxes[2])

    expect(checkboxes.at(0)).toBeChecked()
    expect(checkboxes.at(1)).toBeChecked()
    expect(checkboxes.at(2)).toBeChecked()
    expect(checkboxes.at(3)).not.toBeChecked()
    expect(screen.getByText('Values: ["test-one",true,1000]')).toBeVisible()

    await userEvent.click(checkboxes[3])

    expect(checkboxes.at(0)).toBeChecked()
    expect(checkboxes.at(1)).toBeChecked()
    expect(checkboxes.at(2)).toBeChecked()
    expect(checkboxes.at(3)).toBeChecked()
    expect(screen.getByText('Values: ["test-one",true,1000,{"value":"some-value"}]')).toBeVisible()

    // Unselect all
    await userEvent.click(checkboxes[0])
    await userEvent.click(checkboxes[1])
    await userEvent.click(checkboxes[2])
    await userEvent.click(checkboxes[3])

    checkboxes.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked()
    })
    expect(screen.getByText('Values: []')).toBeVisible()
  })

  describe('slots', () => {

    it('should render the default slot', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmCheckbox, SmCheckboxGroup },
        setup: () => {
          const checkboxValue = ref('test')

          return { checkboxValue }
        },
        template: `
          <div>
            <sm-checkbox-group label="checkbox-group-label" name="checkboxName">
              <sm-checkbox v-model="checkboxValue" selected-value="beta" label="test-label" name="checkboxName" />
            </sm-checkbox-group>
            <span>Value: {{ checkboxValue }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByText('checkbox-group-label')).toBeVisible())
      expect(screen.getByText('test-label')).toBeVisible()
    })

    it('should override label prop and render the label slot', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmCheckbox, SmCheckboxGroup },
        setup: () => {
          const checkboxValue = ref('test')

          return { checkboxValue }
        },
        template: `
          <div>
            <sm-checkbox-group label="checkbox-group-label" name="checkboxName">
              <template #label>
                <span>checkbox-group-label-slot</span>
              </template>
              <sm-checkbox v-model="checkboxValue" selected-value="test-one" label="checkbox-label" name="checkboxName" />
            </sm-checkbox-group>
            <span>Value: {{ checkboxValue }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByText('checkbox-group-label-slot')).toBeVisible())
      expect(screen.getByText('checkbox-label')).toBeVisible()
    })

    it('should render the action slot', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmCheckbox, SmCheckboxGroup },
        setup: () => {
          const checkboxValue = ref('test')

          return { checkboxValue }
        },
        template: `
          <div>
            <sm-checkbox-group label="checkbox-group-label" name="checkboxName">
              <template #action>
                <span>checkbox-group-action-slot</span>
              </template>
              <sm-checkbox v-model="checkboxValue" selected-value="test-one" label="checkbox-label" name="checkboxName" />
            </sm-checkbox-group>
            <span>Value: {{ checkboxValue }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByText('checkbox-group-label')).toBeVisible())
      expect(screen.getByText('checkbox-group-action-slot')).toBeVisible()
      expect(screen.getByText('checkbox-label')).toBeVisible()
    })

    it('should render the label slot', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmCheckbox, SmCheckboxGroup },
        setup: () => {
          const checkboxValue = ref('test')

          return { checkboxValue }
        },
        template: `
          <div>
            <sm-checkbox-group label="checkbox-group-label" name="checkboxName">
              <template #label>
                <span>checkbox-group-label-slot</span>
              </template>
              <sm-checkbox v-model="checkboxValue" selected-value="test-one" label="checkbox-label" name="checkboxName" />
            </sm-checkbox-group>
            <span>Value: {{ checkboxValue }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByText('checkbox-group-label-slot')).toBeVisible())
      expect(screen.getByText('checkbox-label')).toBeVisible()
    })

  })

})
