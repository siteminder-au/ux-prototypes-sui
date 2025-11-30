import { FieldValidationMetaInfo } from '@/app/libs/vee-validate/rules/types'
import userEvent from '@testing-library/user-event'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { required } from '@vee-validate/rules'
import { configure, defineRule } from 'vee-validate'
import { ref } from 'vue'
import SmCheckbox from './sm-checkbox.vue'

describe('SmCheckbox', () => {

  beforeAll(() => {
    defineRule('required', required)

    configure({
      generateMessage: (context: FieldValidationMetaInfo) => {
        const ruleName = context.rule?.name ?? ''

        return `This is a custom ${ruleName} field message`
      },
    })
  })

  it('should update toggle the value when interacted with', async () => {
    // ARRANGE
    const mockUpdateModelValue = jest.fn()

    const ParentComponent = {
      components: { SmCheckbox },
      setup: () => {
        const checkboxValue = ref(true)

        return { checkboxValue, mockUpdateModelValue }
      },
      template: `
        <div>
          <sm-checkbox
            v-model="checkboxValue"
            selected-value="true"
            label="checkbox-label"
            name="checkboxValue"
            @update:model-value="mockUpdateModelValue"
          />
          <span>Value: {{ checkboxValue }}</span>
        </div>
      `,
    }
    // ACT
    render(ParentComponent)

    // ASSERT
    const checkboxLabel = screen.getByLabelText('checkbox-label')
    await waitFor(() => expect(checkboxLabel).toBeVisible())
    expect(checkboxLabel).toBeChecked()
    expect(checkboxLabel).toBeEnabled()
    expect(screen.getByText('Value: true')).toBeVisible()
    expect(mockUpdateModelValue).toHaveBeenCalledTimes(0)

    // Uncheck
    await userEvent.click(checkboxLabel)

    await waitFor(() => expect(checkboxLabel).not.toBeChecked())
    expect(screen.getByText('Value: false')).toBeVisible()
    expect(mockUpdateModelValue).toHaveBeenCalledTimes(1)

    // Check
    await userEvent.click(checkboxLabel)

    await waitFor(() => expect(checkboxLabel).toBeChecked())
    expect(screen.getByText('Value: true')).toBeVisible()
    expect(mockUpdateModelValue).toHaveBeenCalledTimes(2)
  })

  it('should not change the value after clicking a disabled control when disabled prop is true', async () => {
    // ARRANGE
    const mockUpdateModelValue = jest.fn()

    const ParentComponent = {
      components: { SmCheckbox },
      setup: () => {
        const checkboxValue = ref(false)

        return { checkboxValue, mockUpdateModelValue }
      },
      template: `
        <div>
          <sm-checkbox
            v-model="checkboxValue"
            :disabled="true"
            selected-value="true"
            label="checkbox-label"
            name="checkboxValue"
            @update:model-value="mockUpdateModelValue"
          />
          <span>Value: {{ checkboxValue }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const checkboxLabel = screen.getByLabelText('checkbox-label')
    await waitFor(() => expect(checkboxLabel).toBeVisible())
    expect(checkboxLabel).not.toBeChecked()
    expect(screen.getByText('Value: false')).toBeVisible()
    expect(mockUpdateModelValue).toHaveBeenCalledTimes(0)

    // Check
    await userEvent.click(checkboxLabel)

    await waitFor(() => expect(checkboxLabel).not.toBeChecked())
    expect(screen.getByText('Value: false')).toBeVisible()
    expect(mockUpdateModelValue).toHaveBeenCalledTimes(0)
  })

  it('should set the value as partially checked when indeterminate prop is true', async () => {
    // ARRANGE
    const mockUpdateModelValue = jest.fn()

    const ParentComponent = {
      components: { SmCheckbox },
      setup: () => {
        const checkboxValue = ref()

        return { checkboxValue, mockUpdateModelValue }
      },
      template: `
        <div>
          <sm-checkbox
            v-model="checkboxValue"
            label="checkbox-label"
            name="checkboxValue"
            id="checkbox-field"
            :selected-value="true"
            :indeterminate="checkboxValue !== true && checkboxValue !== false"
            @update:model-value="mockUpdateModelValue"
          />
          <span>Value: {{ checkboxValue }}</span>
        </div>
      `,
    }
    // ACT
    render(ParentComponent)

    // ASSERT
    const checkboxLabel = screen.getByLabelText('checkbox-label')
    await waitFor(() => expect(checkboxLabel).toBeVisible())
    expect(checkboxLabel).not.toBeChecked()
    expect(checkboxLabel).toBePartiallyChecked()
    expect(checkboxLabel).toBeEnabled()
    expect(screen.getByText('Value:')).toBeVisible()
    expect(mockUpdateModelValue).toHaveBeenCalledTimes(0)

    // Check
    await userEvent.click(checkboxLabel)

    await waitFor(() => expect(checkboxLabel).toBeChecked())
    expect(checkboxLabel).not.toBePartiallyChecked()
    expect(screen.getByText('Value: true')).toBeVisible()
    expect(mockUpdateModelValue).toHaveBeenCalledTimes(1)

    // Uncheck
    await userEvent.click(checkboxLabel)

    await waitFor(() => expect(checkboxLabel).not.toBeChecked())
    expect(checkboxLabel).not.toBePartiallyChecked()
    expect(screen.getByText('Value: false')).toBeVisible()
    expect(mockUpdateModelValue).toHaveBeenCalledTimes(2)
  })

  it('should emit native events when interacted with', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCheckbox },
      setup: () => {
        const checkboxValue = ref('test-one')

        const eventValues = ref({
          blur: 0,
          change: 0,
          click: 0,
          focus: 0,
          updateModelValue: 0,
        })

        return { checkboxValue, eventValues }
      },
      template: `
        <div>
          <sm-checkbox
            v-model="checkboxValue"
            selected-value="test-one"
            label="checkbox-label"
            name="checkbox"
            @blur="eventValues.blur += 1"
            @change="eventValues.change += 1"
            @click="eventValues.click += 1"
            @focus="eventValues.focus += 1"
            @update:model-value="eventValues.updateModelValue += 1"
          />
          <span>Value: {{ checkboxValue }}</span>
          <span>Blur: {{ eventValues.blur }}</span>
          <span>Change: {{ eventValues.change }}</span>
          <span>Click: {{ eventValues.click }}</span>
          <span>Focus: {{ eventValues.focus }}</span>
          <span>Update modelValue: {{ eventValues.updateModelValue }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const checkboxLabel = screen.getByLabelText('checkbox-label')
    await waitFor(() => expect(checkboxLabel).toBeVisible())
    expect(screen.getByText('Value: test-one')).toBeVisible()
    expect(screen.getByText('Blur: 0')).toBeVisible()
    expect(screen.getByText('Change: 0')).toBeVisible()
    expect(screen.getByText('Click: 0')).toBeVisible()
    expect(screen.getByText('Focus: 0')).toBeVisible()
    expect(screen.getByText('Update modelValue: 0')).toBeVisible()

    await userEvent.click(checkboxLabel)
    await waitFor(() => expect(checkboxLabel).toBeChecked())
    expect(screen.getByText('Blur: 0')).toBeVisible()
    expect(screen.getByText('Change: 1')).toBeVisible()
    expect(screen.getByText('Click: 1')).toBeVisible()
    expect(screen.getByText('Focus: 1')).toBeVisible()
    expect(screen.getByText('Update modelValue: 1')).toBeVisible()

    await fireEvent.touch(checkboxLabel)
    await waitFor(() => expect(screen.getByText('Blur: 1')).toBeVisible())
    expect(screen.getByText('Change: 1')).toBeVisible()
    expect(screen.getByText('Click: 1')).toBeVisible()
    expect(screen.getByText('Focus: 2')).toBeVisible()
    expect(screen.getByText('Update modelValue: 1')).toBeVisible()
  })

  it('should display the label prop when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCheckbox },
      setup: () => {
        const checkboxValue = ref('test')

        return { checkboxValue }
      },
      template: `
        <div>
          <sm-checkbox v-model="checkboxValue" selected-value="beta" label="checkbox-label" name="checkboxValue"/>
          <span>Value: {{ checkboxValue }}</span>
        </div>
    `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByLabelText('checkbox-label')).toBeVisible())
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('should display the label slot when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCheckbox },
      setup: () => {
        const checkboxValue = ref('test')

        return { checkboxValue }
      },
      template: `
          <div>
            <sm-checkbox v-model="checkboxValue" selected-value="beta" label="test-label" name="checkboxValue">
              <template #default>
                <span>test-label-as-slot</span>
              </template>
            </sm-checkbox>
            <span>Value: {{ checkboxValue }}</span>
          </div>
        `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByLabelText('test-label-as-slot')).toBeVisible())
    expect(screen.queryByText('test-label')).not.toBeInTheDocument()
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('should not display the required asterisk when rules prop is not set', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCheckbox },
      setup: () => {
        const checkboxValue = ref('alpha')

        return { checkboxValue }
      },
      template: `
        <div>
          <!-- Test explicit required = false -->
          <sm-checkbox
            v-model="checkboxValue"
            selected-value="beta"
            label="test-label-as-prop"
            name="checkboxValue"
            :rules="{ required: false }"
          />
          <span>Value: {{ checkboxValue }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.queryByText('*')).not.toBeInTheDocument())
  })

  it('should validate the value when rules prop is configured', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCheckbox },
      setup: () => {
        const checkboxValue = ref()

        return { checkboxValue }
      },
      template: `
        <div>
          <sm-checkbox
            v-model="checkboxValue"
            selected-value="true"
            label="checkbox-label"
            name="checkboxValue" rules="required"
          />
          <span>Value: {{ checkboxValue }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const alert = await screen.findByRole('alert')
    const checkbox = screen.getByLabelText('checkbox-label')

    expect(screen.getByText('*')).toBeVisible()
    expect(checkbox).not.toBeChecked()
    expect(alert).toHaveTextContent('')
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()

    // Check
    await userEvent.click(checkbox)

    await waitFor(() => expect(checkbox).toBeChecked())
    expect(checkbox).toBeValid()
    expect(alert).toHaveTextContent('')
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()

    // Uncheck to trigger validation error
    await userEvent.click(checkbox)

    await waitFor(() => expect(checkbox).not.toBeChecked())
    expect(checkbox).toBeInvalid()
    expect(alert).toHaveTextContent('This is a custom required field message')
    expect(screen.getByText('This is a custom required field message')).toBeVisible()
  })

})
