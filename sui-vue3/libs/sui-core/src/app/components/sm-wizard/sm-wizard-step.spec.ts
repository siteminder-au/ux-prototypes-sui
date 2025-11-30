import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { ref } from 'vue'
import SmWizardStep from './sm-wizard-step.vue'
import SmWizard from './sm-wizard.vue'

/**
 * We still use sm-wizard wrapper in the tests below since they are tightly coupled,
 * but we focus the cases on the sm-wizard-step component
 */
describe('SmWizardStep', () => {

  it('should sort the steps when order prop is provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      setup: () => {
        const activeStep = ref()

        return { activeStep }
      },
      template: `
        <sm-wizard
          v-model:active-step="activeStep"
          title="Wizard title"
          :visible="true"
        >
          <!-- Template occurrence should not match order prop to simulate -->
          <sm-wizard-step label="Step 2" :order="2">
            Wizard step 2 content
          </sm-wizard-step>
          <sm-wizard-step label="Step 3" :order="9">
            Wizard step 3 content
          </sm-wizard-step>
          <sm-wizard-step label="Step 1" :order="1">
            Wizard step 1 content
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tabpanel', { name: '1 Step 1' })).toBeVisible() // Step number + label
    expect(screen.getByText('Wizard step 1 content')).toBeVisible()
    // Inactive steps are not in the DOM by default
    expect(screen.queryByRole('tabpanel', { name: '2 Step 2' })).not.toBeInTheDocument()
    expect(screen.queryByText('Wizard step 2 content')).not.toBeInTheDocument()
    expect(screen.queryByRole('tabpanel', { name: '3 Step 3' })).not.toBeInTheDocument()
    expect(screen.queryByText('Wizard step 3 content')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('tab', { name: '3 Step 3', selected: false }))

    await waitFor(() => expect(screen.queryByRole('tabpanel', { name: '1 Step 1' })).not.toBeInTheDocument())
    expect(screen.queryByText('Wizard step 1 content')).not.toBeInTheDocument()
    expect(screen.queryByRole('tabpanel', { name: '2 Step 2' })).not.toBeInTheDocument()
    expect(screen.queryByText('Wizard step 2 content')).not.toBeInTheDocument()
    expect(screen.getByRole('tabpanel', { name: '3 Step 3' })).toBeVisible()
    expect(screen.getByText('Wizard step 3 content')).toBeVisible()
  })

  it('should register wizard steps using id prop when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      setup: () => {
        const activeStep = ref()

        return { activeStep }
      },
      template: `
        <sm-wizard
          v-model:active-step="activeStep"
          title="Wizard title"
          :visible="true"
        >
          <!-- Use the same labels, but different ids -->
          <sm-wizard-step label="Step" id="step-1">
            Wizard step 1 content
          </sm-wizard-step>
          <sm-wizard-step label="Step" id="step-2">
            Wizard step 2 content
          </sm-wizard-step>
          <sm-wizard-step label="Step" id="step-3">
            Wizard step 3 content
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tabpanel', { name: '1 Step' })).toBeVisible()
    expect(screen.getByText('Wizard step 1 content')).toBeVisible()
    // Inactive steps are not in the DOM by default
    expect(screen.queryByRole('tabpanel', { name: '2 Step' })).not.toBeInTheDocument()
    expect(screen.queryByText('Wizard step 2 content')).not.toBeInTheDocument()
    expect(screen.queryByRole('tabpanel', { name: '3 Step' })).not.toBeInTheDocument()
    expect(screen.queryByText('Wizard step 3 content')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('tab', { name: '3 Step', selected: false }))

    await waitFor(() => expect(screen.queryByRole('tabpanel', { name: '1 Step' })).not.toBeInTheDocument())
    expect(screen.queryByText('Wizard step 1 content')).not.toBeInTheDocument()
    expect(screen.queryByRole('tabpanel', { name: '2 Step' })).not.toBeInTheDocument()
    expect(screen.queryByText('Wizard step 2 content')).not.toBeInTheDocument()
    expect(screen.getByRole('tabpanel', { name: '3 Step' })).toBeVisible()
    expect(screen.getByText('Wizard step 3 content')).toBeVisible()
  })

  it('should not register the step when neither the label nor id order prop is provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      template: `
        <sm-wizard title="Wizard title" :visible="true">
          <sm-wizard-step>
            Wizard step 1
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())
    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
  })

  it('should add the inactive steps in the DOM when isConditionalLoading is false', async () => {
    // ARRANGE
    // Note when backporting to Vue2: the event should be `@stepChange`,
    // but in Vue3 we can verify below that either one works
    const mockStepChange1 = jest.fn()
    const mockStepChange2 = jest.fn()

    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      setup: () => {
        const activeStep = ref()

        return { activeStep, mockStepChange1, mockStepChange2 }
      },
      template: `
        <sm-wizard
          v-model:active-step="activeStep"
          title="Wizard title"
          :visible="true"
          @stepChange="mockStepChange1"
          @step-change="mockStepChange2"
        >
          <sm-wizard-step label="Step 1" :is-conditional-loading="false">
            Wizard step 1 content
          </sm-wizard-step>
          <sm-wizard-step label="Step 2" :is-conditional-loading="false">
            Wizard step 2 content
          </sm-wizard-step>
          <sm-wizard-step label="Step 3" :is-conditional-loading="false">
            Wizard step 3 content
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())
    expect(screen.getByText('Wizard step 1 content')).toBeVisible()
    // Inactive steps are added in the DOM, but are hidden
    expect(screen.getByText('Wizard step 2 content')).not.toBeVisible()
    expect(screen.getByText('Wizard step 3 content')).not.toBeVisible()
    // Called onMounted - we track `@stepChange` and `@step-change` to ensure both work
    expect(mockStepChange1).toHaveBeenCalledTimes(1)
    expect(mockStepChange2).toHaveBeenCalledTimes(1)

    await userEvent.click(screen.getByRole('tab', { name: '3 Step 3', selected: false }))

    await waitFor(() => expect(screen.getByText('Wizard step 1 content')).not.toBeVisible())
    expect(screen.getByText('Wizard step 2 content')).not.toBeVisible()
    expect(screen.getByText('Wizard step 3 content')).toBeVisible()
  })

  it('should toggle the step overlay content when showOverlay prop changes', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      setup: () => {
        const isOverlayVisible = ref(false)

        return { isOverlayVisible }
      },
      template: `
        <sm-wizard title="Wizard title" :visible="true">
          <sm-wizard-step label="General" subtitle="Step one" :show-overlay="isOverlayVisible">
            <template #default>
              Wizard step 1 content
              <button @click="isOverlayVisible = true">Show overlay</button>
            </template>
            <template #overlay>
              Overlay content
              <button @click="isOverlayVisible = false">Hide overlay</button>
            </template>
          </sm-wizard-step>
          <sm-wizard-step label="Review" subtitle="Step two" :animate-overlay="false">
            <template #default>
              Wizard step 2 content
            </template>
            <template #overlay>
              Overlay content for step 2 is hidden
            </template>
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())
    expect(screen.getByText('Step one')).toBeVisible()
    expect(screen.getByText('Wizard step 1 content')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Show overlay' })).toBeVisible()
    expect(screen.queryByText('Overlay content')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Hide overlay' })).not.toBeInTheDocument()
    expect(screen.queryByText('Overlay content for step 2 is hidden')).not.toBeInTheDocument()

    // Switch to overlay view
    await userEvent.click(screen.getByRole('button', { name: 'Show overlay' }))

    await waitFor(() => expect(screen.queryByRole('Step one')).not.toBeInTheDocument())
    expect(screen.queryByText('Wizard step 1 content')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Show overlay' })).not.toBeInTheDocument()
    expect(screen.getByText('Overlay content')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Hide overlay' })).toBeVisible()
    expect(screen.queryByText('Overlay content for step 2 is hidden')).not.toBeInTheDocument()

    // Go back to main view
    await userEvent.click(screen.getByRole('button', { name: 'Hide overlay' }))

    await waitFor(() => expect(screen.getByText('Step one')).toBeVisible())
    expect(screen.getByText('Wizard step 1 content')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Show overlay' })).toBeVisible()
    expect(screen.queryByText('Overlay content')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Hide overlay' })).not.toBeInTheDocument()
    expect(screen.queryByText('Overlay content for step 2 is hidden')).not.toBeInTheDocument()
  })

  it('should attach custom attributes to stepper buttons when prop is provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      template: `
        <sm-wizard title="Wizard title" :visible="true">
          <!-- Override built-in ID -->
          <sm-wizard-step
            label="Step 1"
            :stepper-button-attrs="{
              'data-testid': 'stepper-1',
              id: 1,
            }"
          >
            Wizard step 1 content
          </sm-wizard-step>
          <sm-wizard-step
            label="Step 2"
            :stepper-button-attrs="{
              'data-testid': 'stepper-2',
              id: 'custom-id',
            }"
          >
            Wizard step 2 content
          </sm-wizard-step>
          <!-- Don't override built-in ID -->
          <sm-wizard-step
            label="Step 3"
            :stepper-button-attrs="{ 'data-testid': 'stepper-3' }"
          >
            Wizard step 3 content
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())

    expect(screen.getByTestId('stepper-1')).toHaveAccessibleName('1 Step 1') // Step number + label
    // Overrides generated built-in ID
    expect(screen.getByRole('tab', { name: '1 Step 1' })).toHaveAttribute('id', '1')
    // Custom ID is still wired in tab and active tabpanel
    expect(screen.getByRole('tabpanel', { name: '1 Step 1' })).toHaveAttribute('aria-labelledby', '1')

    expect(screen.getByTestId('stepper-2')).toHaveAccessibleName('2 Step 2')
    // Overrides generated built-in ID
    expect(screen.getByRole('tab', { name: '2 Step 2' })).toHaveAttribute('id', 'custom-id')

    expect(screen.getByTestId('stepper-3')).toHaveAccessibleName('3 Step 3')
    // Default generated built-in ID
    expect(screen.getByRole('tab', { name: '3 Step 3' })).toHaveAttribute('id', expect.stringMatching(/sm-wizard-step_\d+__tab-control/))
  })

})
