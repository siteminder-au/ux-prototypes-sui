import { FieldValidationMetaInfo } from '@/app/libs/vee-validate/rules/types'
import userEvent from '@testing-library/user-event'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { required } from '@vee-validate/rules'
import { configure, defineRule } from 'vee-validate'
import { ref } from 'vue'
import SmSwitch from './sm-switch.vue'

describe('SmSwitch', () => {

  beforeAll(() => {
    defineRule('required', required)

    configure({
      generateMessage: (context: FieldValidationMetaInfo) => {
        const ruleName = context.rule?.name ?? ''

        return `This is a custom ${ruleName} field message`
      },
    })
  })

  it('should toggle the value when clicked', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSwitch },
      setup: () => {
        const switchValue = ref(false)

        return { switchValue }
      },
      template: `
        <div>
          <sm-switch v-model="switchValue" label="switch-label" name="switchValue" />
          <span>Value: {{ switchValue }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const switchLabel = await screen.findByLabelText('switch-label')
    await waitFor(() => expect(switchLabel).toBeVisible())
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    await waitFor(() => expect(screen.queryByText('*')).not.toBeInTheDocument())

    await userEvent.click(switchLabel)
    await waitFor(() => expect(screen.getByRole('checkbox')).toBeChecked())
    // see: https://testing-library.com/docs/vue-testing-library/examples/
    expect(screen.getByText('Value: true')).toBeVisible()

    await userEvent.click(switchLabel)
    await waitFor(() => expect(screen.getByRole('checkbox')).not.toBeChecked())
    expect(screen.getByText('Value: false')).toBeVisible()
  })

  it('should not toggle the value when clicked and disabled prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSwitch },
      setup: () => {
        const switchValue = ref(false)

        return { switchValue }
      },
      template: `
        <div>
          <sm-switch v-model="switchValue" label="switch-label" name="switchValue" :disabled="true"/>
          <span>Value: {{ switchValue }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const switchLabel = await screen.findByLabelText('switch-label')
    await waitFor(() => expect(switchLabel).toBeVisible())
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    expect(screen.getByText('Value: false')).toBeVisible()

    await userEvent.click(switchLabel)
    await waitFor(() => expect(screen.getByRole('checkbox')).not.toBeChecked())
    expect(screen.getByText('Value: false')).toBeVisible()
  })

  it('should emit native events when interacted with', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSwitch },
      setup: () => {
        const switchValue = ref(false)

        const eventValues = ref({
          blur: 0,
          change: 0,
          click: 0,
          focus: 0,
        })

        return { switchValue, eventValues }
      },
      template: `
        <div>
          <sm-switch
            v-model="switchValue"
            label="switch-label"
            name="switchValue"
            @blur="eventValues.blur += 1"
            @change="eventValues.change += 1"
            @click="eventValues.click += 1"
            @focus="eventValues.focus += 1"
          />
          <span>Value: {{ switchValue }}</span>
          <span>Blur: {{ eventValues.blur }}</span>
          <span>Change: {{ eventValues.change }}</span>
          <span>Click: {{ eventValues.click }}</span>
          <span>Focus: {{ eventValues.focus }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const switchLabel = await screen.findByLabelText('switch-label')
    await waitFor(() => expect(switchLabel).toBeVisible())
    expect(screen.getByText('Value: false')).toBeVisible()
    expect(screen.getByText('Blur: 0')).toBeVisible()
    expect(screen.getByText('Change: 0')).toBeVisible()
    expect(screen.getByText('Click: 0')).toBeVisible()
    expect(screen.getByText('Focus: 0')).toBeVisible()

    await userEvent.click(switchLabel)
    await waitFor(() => expect(screen.getByRole('checkbox')).toBeChecked())
    expect(screen.getByText('Value: true')).toBeVisible()
    expect(screen.getByText('Blur: 0')).toBeVisible()
    expect(screen.getByText('Change: 1')).toBeVisible()
    expect(screen.getByText('Click: 1')).toBeVisible()
    expect(screen.getByText('Focus: 1')).toBeVisible()

    const switchInput = screen.getByRole('checkbox')
    await fireEvent.touch(switchInput)
    await waitFor(() => expect(screen.getByText('Blur: 1')).toBeVisible())
    expect(screen.getByText('Change: 1')).toBeVisible()
    expect(screen.getByText('Click: 1')).toBeVisible()
    expect(screen.getByText('Focus: 2')).toBeVisible()
  })

  it('should display the label prop when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSwitch },
      setup: () => {
        const switchValue = ref(false)

        return { switchValue }
      },
      template: `
        <div>
          <sm-switch v-model="switchValue" label="switch-label" name="switchValue"/>
          <span>Value: {{ switchValue }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const switchLabel = await screen.findByLabelText('switch-label')
    await waitFor(() => expect(switchLabel).toBeVisible())
  })

  it('should display the label slot when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSwitch },
      setup: () => {
        const switchValue = ref(false)

        return { switchValue }
      },
      template: `
        <div>
          <sm-switch v-model="switchValue" label="test-label-as-prop" name="switchValue">
            <template #label>
              <span>test-label-as-slot</span>
            </template>
          </sm-switch>
          <span>Value: {{ switchValue }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByLabelText('test-label-as-slot')).toBeVisible())
  })

  it('should validate the value when required rule is configured', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSwitch },
      setup: () => {
        const switchValue = ref(false)

        return { switchValue }
      },
      template: `
        <div>
          <sm-switch v-model="switchValue" label="switch-label" name="switchValue" rules="required" />
          <span>Value: {{ switchValue }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // Unlike the other form fields, the asterisk is nested in the <label> element
    const switchLabel = await screen.findByLabelText('switch-label *')
    await waitFor(() => expect(switchLabel).toBeVisible())
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    expect(screen.getByText('*')).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('')
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()

    await userEvent.click(switchLabel)

    await waitFor(() => expect(screen.getByRole('checkbox')).toBeChecked())
    expect(screen.getByText('Value: true')).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('')
    expect(screen.queryByText('This is a custom required field message')).not.toBeInTheDocument()

    // Toggle the switch off to test the required rule
    await userEvent.click(switchLabel)

    await waitFor(() => expect(screen.getByRole('checkbox')).not.toBeChecked())
    expect(screen.getByText('Value: false')).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('This is a custom required field message')
    expect(screen.getByText('This is a custom required field message')).toBeVisible()
  })

  it('should only render the switch when "label-hidden" is set to true', () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSwitch },
      setup: () => {
        const switchValue = ref(false)

        return { switchValue }
      },
      template: `
        <div>
          <sm-switch v-model="switchValue" label="switch-label" name="switchValue" :label-hidden="true"/>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const switchLabel = screen.queryByText('switch-label')
    expect(switchLabel).not.toBeInTheDocument()
    expect(screen.getByLabelText('switch-label')).toBeVisible()
  })

})
