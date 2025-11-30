import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { ref } from 'vue'
import SmWizardStep from './sm-wizard-step.vue'
import SmWizard from './sm-wizard.vue'

describe('SmWizard', () => {

  it('should display the wizard when visible prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      template: `
        <sm-wizard title="Wizard title" :visible="true">
          <sm-wizard-step label="General" subtitle="Step one">
            Wizard step 1
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())

    // Header
    expect(screen.getByRole('heading', { level: 5, name: 'Wizard title' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Click to close' })).toBeVisible()
    // Available in tablet and below which are added in the DOM and hidden via CSS
    expect(screen.getByText('1 of 1')).toBeInTheDocument()
    expect(screen.queryByText('Next:', { exact: false })).not.toBeInTheDocument() // No other steps

    // Stepper/sidebar
    expect(screen.getByRole('tablist')).toBeVisible()
    expect(screen.getByRole('tab', { name: '1 General', selected: true })).toBeVisible() // Step number + label

    // Step content
    const stepHeadings = screen.getAllByRole('heading', { level: 2, name: 'General' })
    // Desktop + tablet views, both are visible since they're hidden via CSS
    expect(stepHeadings).toHaveLength(2)
    expect(stepHeadings.at(0)).toBeVisible()
    expect(stepHeadings.at(1)).toBeVisible()
    expect(screen.getByRole('tabpanel', { name: '1 General' })).toBeVisible()
    expect(screen.getByText('Step one')).toBeVisible() // sm-wizard-step subtitle prop
    expect(screen.getByText('Wizard step 1')).toBeVisible() // sm-wizard-step slot

    // Footer
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Review and save' })).toBeVisible()
  })

  it('should close the wizard when built-in button is clicked', async () => {
    // ARRANGE
    const mockClose = jest.fn()
    const mockOpen = jest.fn()

    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      setup: () => {
        const isWizardVisible = ref(false)

        return { isWizardVisible, mockClose, mockOpen }
      },
      template: `
        <div>
          <sm-wizard
            v-model:visible="isWizardVisible"
            title="Wizard title"
            @close="mockClose"
            @open="mockOpen"
          >
            <sm-wizard-step label="General">
              Wizard step 1
            </sm-wizard-step>
          </sm-wizard>
          <button @click="isWizardVisible = true">Show wizard</button>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // Initial state
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Wizard title' })).not.toBeInTheDocument())
    expect(mockClose).toHaveBeenCalledTimes(0)
    expect(mockOpen).toHaveBeenCalledTimes(0)

    // Open the wizard
    await userEvent.click(screen.getByRole('button', { name: 'Show wizard' }))

    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())
    expect(mockClose).toHaveBeenCalledTimes(0)
    expect(mockOpen).toHaveBeenCalledTimes(1)

    // Close the wizard via built-in button
    await userEvent.click(screen.getByRole('button', { name: 'Click to close' }))

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Wizard title' })).not.toBeInTheDocument())
    expect(mockClose).toHaveBeenCalledTimes(1)
    expect(mockOpen).toHaveBeenCalledTimes(1)
  })

  it('should hide the built-in close button when showClose is false', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      setup: () => {
        const isWizardVisible = ref(true)

        return { isWizardVisible }
      },
      template: `
        <sm-wizard
          v-model:visible="isWizardVisible"
          title="Wizard title"
          :show-close="false"
        >
          <sm-wizard-step label="General" subtitle="Step one">
            Wizard step 1
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    const { container } = render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())
    expect(screen.queryByRole('button', { name: 'Click to close' })).not.toBeInTheDocument()

    // Close the wizard via underlay, we use the class name here since it's not accessible and isn't supposed to be
    await userEvent.click(container.getElementsByClassName('sm-wizard__underlay')[0])

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Wizard title' })).not.toBeInTheDocument())
  })

  it('should close the wizard when escape key is pressed by default', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      setup: () => {
        const isWizardVisible = ref(true)

        return { isWizardVisible }
      },
      template: `
        <sm-wizard v-model:visible="isWizardVisible" title="Wizard title">
          <sm-wizard-step label="General" subtitle="Step one">
            Wizard step 1
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Wizard title' })).not.toBeInTheDocument())
  })

  it('should not close the wizard when escape key is pressed and closeOnPressEscape is false', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      setup: () => {
        const isWizardVisible = ref(true)

        return { isWizardVisible }
      },
      template: `
        <sm-wizard
          v-model:visible="isWizardVisible"
          title="Wizard title"
          :close-on-press-escape="false"
          :show-on-top="true"
        >
          <sm-wizard-step label="General" subtitle="Step one">
            Wizard step 1
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())
  })

  it('should attach close button attributes when prop is provided', async () => {
    // ARRANGE
    const mockBeforeClose = jest.fn()

    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      setup: () => {
        const isWizardVisible = ref(true)

        mockBeforeClose.mockImplementation((close: () => void) => {
          close()
        })

        return { isWizardVisible, mockBeforeClose }
      },
      template: `
        <sm-wizard
          v-model:visible="isWizardVisible"
          title="Wizard title"
          :before-close="mockBeforeClose"
          :close-button-attrs="{ 'data-testid': 'close-wizard-button' }"
        >
          <sm-wizard-step label="General" subtitle="Step one">
            Wizard step 1
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())
    expect(screen.getByTestId('close-wizard-button')).toBeVisible()
    expect(mockBeforeClose).toHaveBeenCalledTimes(0)

    await userEvent.click(screen.getByTestId('close-wizard-button'))

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Wizard title' })).not.toBeInTheDocument())
    expect(mockBeforeClose).toHaveBeenCalledTimes(1)
  })

  it('should change steps when stepper buttons are clicked', async () => {
    // ARRANGE
    // Note when backporting to Vue2: the event should be `@stepChange`,
    // but in Vue3 we can verify below that either one works
    const mockStepChange1 = jest.fn()
    const mockStepChange2 = jest.fn()

    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      setup: () => {
        const activeStep = ref(null)

        return { activeStep, mockStepChange1, mockStepChange2 }
      },
      template: `
        <sm-wizard
          v-model:active-step="activeStep"
          title="Wizard title"
          :visible="true"
          @step-change="mockStepChange1"
          @stepChange="mockStepChange2"
        >
          <sm-wizard-step label="General" subtitle="Step one">
            Wizard step 1
          </sm-wizard-step>
          <sm-wizard-step label="Advanced" subtitle="Step two">
            Wizard step 2
          </sm-wizard-step>
          <sm-wizard-step label="Review" subtitle="Step three">
            Wizard step 3
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // Initial state
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())
    // Called onMounted - we track `@stepChange` and `@step-change` to ensure both work
    expect(mockStepChange1).toHaveBeenCalledTimes(1)
    expect(mockStepChange2).toHaveBeenCalledTimes(1)

    // Header
    expect(screen.getByRole('heading', { level: 5, name: 'Wizard title' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Click to close' })).toBeVisible()
    // Available in tablet and below which are added in the DOM and hidden via CSS
    expect(screen.getByText('1 of 3')).toBeInTheDocument()
    expect(screen.getByText('2 of 3')).toBeInTheDocument()
    expect(screen.getByText('3 of 3')).toBeInTheDocument()
    expect(screen.getByText('Next: Advanced')).toBeInTheDocument()
    expect(screen.getByText('Next: Review')).toBeInTheDocument()

    // Stepper/sidebar
    expect(screen.getByRole('tablist')).toBeVisible()
    expect(screen.getByRole('tab', { name: '1 General', selected: true })).toBeEnabled() // Step number + label
    expect(screen.getByRole('tab', { name: '2 Advanced', selected: false })).toBeEnabled()
    expect(screen.getByRole('tab', { name: '3 Review', selected: false })).toBeEnabled()

    // Step content
    const stepHeadings = screen.getAllByRole('heading', { level: 2, name: 'General' })
    // Desktop + tablet views, both are visible since they're hidden via CSS
    expect(stepHeadings).toHaveLength(2)
    expect(stepHeadings.at(0)).toBeVisible()
    expect(stepHeadings.at(1)).toBeVisible()
    expect(screen.getByRole('tabpanel', { name: '1 General' })).toBeVisible()
    expect(screen.queryByRole('tabpanel', { name: '2 Advanced' })).not.toBeInTheDocument()
    expect(screen.queryByRole('tabpanel', { name: '3 Review' })).not.toBeInTheDocument()

    // Footer
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument() // In step 1
    expect(screen.getByRole('button', { name: 'Next' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Review and save' })).not.toBeInTheDocument() // Not in last step

    // Skip to step 3 via sidebar
    await userEvent.click(screen.getByRole('tab', { name: '3 Review' }))

    await waitFor(() => expect(screen.getByRole('tab', { name: '1 General', selected: false })).toBeEnabled())
    expect(screen.getByRole('tab', { name: '2 Advanced', selected: false })).toBeEnabled()
    expect(screen.getByRole('tab', { name: '3 Review', selected: true })).toBeEnabled()
    expect(screen.queryByRole('tabpanel', { name: '1 General' })).not.toBeInTheDocument()
    expect(screen.queryByRole('tabpanel', { name: '2 Advanced' })).not.toBeInTheDocument()
    expect(screen.getByRole('tabpanel', { name: '3 Review' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Back' })).toBeVisible() // In step 3
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument() // No more next step
    expect(screen.getByRole('button', { name: 'Review and save' })).toBeVisible()
    // @click + watch - in the future, consider reducing the number of emits
    expect(mockStepChange1).toHaveBeenCalledTimes(3)
    expect(mockStepChange2).toHaveBeenCalledTimes(3)
  })

  it('should not allow stepper clicks when disableNav is true', async () => {
    // ARRANGE
    const mockStepChange = jest.fn()

    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      setup: () => {
        const activeStep = ref()

        return { activeStep, mockStepChange }
      },
      template: `
        <sm-wizard
          v-model:active-step="activeStep"
          title="Wizard title"
          :disable-nav="true"
          :visible="true"
          @step-change="mockStepChange"
        >
          <sm-wizard-step label="General" subtitle="Step one">
            Wizard step 1
          </sm-wizard-step>
          <sm-wizard-step label="Advanced" subtitle="Step two">
            Wizard step 2
          </sm-wizard-step>
          <sm-wizard-step label="Review" subtitle="Step three">
            Wizard step 3
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // Initial state
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())
    expect(mockStepChange).toHaveBeenCalledTimes(1) // Called onMounted

    // Step content
    expect(screen.getByRole('tabpanel', { name: '1 General' })).toBeVisible()
    expect(screen.queryByRole('tabpanel', { name: '2 Advanced' })).not.toBeInTheDocument()
    expect(screen.queryByRole('tabpanel', { name: '3 Review' })).not.toBeInTheDocument()

    // Click the stepper buttons
    await userEvent.click(screen.getByRole('tab', { name: '2 Advanced', selected: false }))
    await userEvent.click(screen.getByRole('tab', { name: '3 Review', selected: false }))

    await waitFor(() => expect(screen.getByRole('tab', { name: '1 General', selected: true })).toBeDisabled())
    expect(screen.getByRole('tab', { name: '2 Advanced', selected: false })).toBeDisabled()
    expect(screen.getByRole('tab', { name: '3 Review', selected: false })).toBeDisabled()
    expect(screen.getByRole('tabpanel', { name: '1 General' })).toBeVisible()
    expect(screen.queryByRole('tabpanel', { name: '2 Advanced' })).not.toBeInTheDocument()
    expect(screen.queryByRole('tabpanel', { name: '3 Review' })).not.toBeInTheDocument()
    expect(mockStepChange).toHaveBeenCalledTimes(1)
  })

  it('should change steps when footer buttons are clicked', async () => {
    // ARRANGE
    const mockConfirm = jest.fn()
    const mockStepChange = jest.fn()

    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      setup: () => {
        const activeStep = ref(null)

        return { activeStep, mockConfirm, mockStepChange }
      },
      template: `
        <sm-wizard
          v-model:active-step="activeStep"
          title="Wizard title"
          :visible="true"
          @confirmed="mockConfirm"
          @step-change="mockStepChange"
        >
          <sm-wizard-step label="General" subtitle="Step one">
            Wizard step 1
          </sm-wizard-step>
          <sm-wizard-step label="Advanced" subtitle="Step two">
            Wizard step 2
          </sm-wizard-step>
          <sm-wizard-step label="Review" subtitle="Step three">
            Wizard step 3
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // Initial state
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())
    expect(mockConfirm).toHaveBeenCalledTimes(0)
    expect(mockStepChange).toHaveBeenCalledTimes(1) // Called onMounted

    // Stepper/sidebar
    expect(screen.getByRole('tab', { name: '1 General', selected: true })).toBeVisible() // Step number + label
    expect(screen.getByRole('tab', { name: '2 Advanced', selected: false })).toBeVisible()
    expect(screen.getByRole('tab', { name: '3 Review', selected: false })).toBeVisible()

    // Step content
    expect(screen.getByRole('tabpanel', { name: '1 General' })).toBeVisible()

    // Footer
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument() // In step 1
    expect(screen.getByRole('button', { name: 'Next' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Review and save' })).not.toBeInTheDocument() // Not in last step

    // Next step
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    await waitFor(() => expect(screen.getByRole('tab', { name: '1 General', selected: false })).toBeVisible())
    expect(screen.getByRole('tab', { name: '2 Advanced', selected: true })).toBeVisible()
    expect(screen.getByRole('tab', { name: '3 Review', selected: false })).toBeVisible()
    expect(screen.getByRole('tabpanel', { name: '2 Advanced' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Back' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Next' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Review and save' })).not.toBeInTheDocument()
    expect(mockConfirm).toHaveBeenCalledTimes(0)
    expect(mockStepChange).toHaveBeenCalledTimes(3) // @click + watch - in the future, consider reducing the number of emits

    // Next step
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    await waitFor(() => expect(screen.getByRole('tab', { name: '1 General', selected: false })).toBeVisible())
    expect(screen.getByRole('tab', { name: '2 Advanced', selected: false })).toBeVisible()
    expect(screen.getByRole('tab', { name: '3 Review', selected: true })).toBeVisible()
    expect(screen.getByRole('tabpanel', { name: '3 Review' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Back' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Review and save' })).toBeVisible()
    expect(mockConfirm).toHaveBeenCalledTimes(0)
    expect(mockStepChange).toHaveBeenCalledTimes(5) // @click + watch - in the future, consider reducing the number of emits

    // Confirm
    await userEvent.click(screen.getByRole('button', { name: 'Review and save' }))

    await waitFor(() => expect(screen.getByRole('tab', { name: '1 General', selected: false })).toBeVisible())
    expect(screen.getByRole('tab', { name: '2 Advanced', selected: false })).toBeVisible()
    expect(screen.getByRole('tab', { name: '3 Review', selected: true })).toBeVisible()
    expect(screen.getByRole('tabpanel', { name: '3 Review' })).toBeVisible()
    expect(mockConfirm).toHaveBeenCalledTimes(1)
    expect(mockStepChange).toHaveBeenCalledTimes(5) // No change

    // Back up twice to first step
    await userEvent.click(screen.getByRole('button', { name: 'Back' }))
    await userEvent.click(screen.getByRole('button', { name: 'Back' }))

    await waitFor(() => expect(screen.getByRole('tab', { name: '1 General', selected: true })).toBeVisible())
    expect(screen.getByRole('tab', { name: '2 Advanced', selected: false })).toBeVisible()
    expect(screen.getByRole('tab', { name: '3 Review', selected: false })).toBeVisible()
    expect(screen.getByRole('tabpanel', { name: '1 General' })).toBeVisible()
    expect(mockConfirm).toHaveBeenCalledTimes(1)
    expect(mockStepChange).toHaveBeenCalledTimes(9) // @click + watch - in the future, consider reducing the number of emits
  })

  it('should disable next button when disableNext is true', async () => {
    // ARRANGE
    const mockStepChange = jest.fn()

    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      setup: () => {
        const activeStep = ref(null)

        return { activeStep, mockStepChange }
      },
      template: `
        <sm-wizard
          v-model:active-step="activeStep"
          title="Wizard title"
          :visible="true"
          :disable-next="true"
          @step-change="mockStepChange"
        >
          <sm-wizard-step label="General" subtitle="Step one">
            Wizard step 1
          </sm-wizard-step>
          <sm-wizard-step label="Review" subtitle="Step two">
            Wizard step 2
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // Initial state
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())
    expect(mockStepChange).toHaveBeenCalledTimes(1) // Called onMounted

    // Footer
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument() // In step 1
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Review and save' })).not.toBeInTheDocument() // Not in last step

    // Next step
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    await waitFor(() => expect(screen.getByRole('tab', { name: '1 General', selected: true })).toBeVisible())
    expect(screen.getByRole('tab', { name: '2 Review', selected: false })).toBeVisible()
    expect(screen.getByRole('tabpanel', { name: '1 General' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument() // In step 1
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Review and save' })).not.toBeInTheDocument() // Not in last step
    expect(mockStepChange).toHaveBeenCalledTimes(1) // No change
  })

  it('should disable prev and confirm buttons when disablePrev and disableConfirm is true', async () => {
    // ARRANGE
    const mockConfirm = jest.fn()
    const mockStepChange = jest.fn()

    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      setup: () => {
        const activeStep = ref()

        return { activeStep, mockConfirm, mockStepChange }
      },
      template: `
        <sm-wizard
          v-model:active-step="activeStep"
          title="Wizard title"
          :confirm-button-icon="true"
          :disable-confirm="true"
          :disable-prev="true"
          :visible="true"
          @confirm="mockConfirm"
          @step-change="mockStepChange"
        >
          <sm-wizard-step label="General" subtitle="Step one">
            Wizard step 1
          </sm-wizard-step>
          <sm-wizard-step label="Review" subtitle="Step two">
            Wizard step 2
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // Initial state
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())
    expect(mockConfirm).toHaveBeenCalledTimes(0)
    expect(mockStepChange).toHaveBeenCalledTimes(1) // Called onMounted

    // Footer
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled()
    expect(screen.queryByRole('button', { name: 'Review and save' })).not.toBeInTheDocument()

    // Next step
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    await waitFor(() => expect(screen.getByRole('tab', { name: '2 Review', selected: true })).toBeEnabled())
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Review and save' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
    expect(mockConfirm).toHaveBeenCalledTimes(0)
    expect(mockStepChange).toHaveBeenCalledTimes(3) // @click + watch - in the future, consider reducing the number of emits

    // Previous step
    await userEvent.click(screen.getByRole('button', { name: 'Back' }))

    await waitFor(() => expect(screen.getByRole('tab', { name: '2 Review', selected: true })).toBeEnabled())
    expect(mockConfirm).toHaveBeenCalledTimes(0)
    expect(mockStepChange).toHaveBeenCalledTimes(3) // No change

    // Confirm step
    await userEvent.click(screen.getByRole('button', { name: 'Review and save' }))

    await waitFor(() => expect(screen.getByRole('tab', { name: '2 Review', selected: true })).toBeEnabled())
    expect(mockConfirm).toHaveBeenCalledTimes(0) // No change
    expect(mockStepChange).toHaveBeenCalledTimes(3) // No change
  })

  it('should show the back button on first step when hideBack is false', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      template: `
        <sm-wizard
          title="Wizard title"
          :hide-back="false"
          :visible="true"
        >
          <sm-wizard-step label="General" subtitle="Step one">
            Wizard step 1
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled() // Visible but disabled
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument() // No other steps
    expect(screen.getByRole('button', { name: 'Review and save' })).toBeVisible()
  })

  it('should attach custom attributes to built-in buttons when relevant props are provided', async () => {
    // ARRANGE
    const mockBeforeStepChange = jest.fn()
    const mockStepChange = jest.fn()

    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      setup: () => {
        const activeStep = ref()

        mockBeforeStepChange.mockImplementation((to: number, _from: number, next: (index: number) => void) => {
          next(to)
        })

        return { activeStep, mockBeforeStepChange, mockStepChange }
      },
      template: `
        <sm-wizard
          v-model:active-step="activeStep"
          confirm-button-text="Submit"
          back-button-text="Previous step"
          next-button-text="Next step"
          title="Wizard title"
          :before-step-change="mockBeforeStepChange"
          :back-button-attrs="{ 'data-testid': 'wizard-back-button' }"
          :confirm-button-attrs="{ 'data-testid': 'wizard-confirm-button' }"
          :next-button-attrs="{ 'data-testid': 'wizard-next-button' }"
          :visible="true"
          @step-change="mockStepChange"
        >
          <sm-wizard-step label="General">
            Wizard step 1
          </sm-wizard-step>
          <sm-wizard-step label="Advanced">
            Wizard step 2
          </sm-wizard-step>
          <sm-wizard-step label="Review">
            Wizard step 3
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())
    expect(mockBeforeStepChange).toHaveBeenCalledTimes(1) // Called onMounted
    expect(mockStepChange).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('button', { name: 'Previous step' })).not.toBeInTheDocument()
    expect(screen.queryByTestId('wizard-back-button')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next step' })).toBeVisible()
    expect(screen.getByTestId('wizard-next-button')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument()
    expect(screen.queryByTestId('wizard-confirm-button')).not.toBeInTheDocument()

    // Next step via custom attribute
    await userEvent.click(screen.getByTestId('wizard-next-button'))

    await waitFor(() => expect(screen.queryByRole('button', { name: 'Previous step' })).toBeEnabled())
    expect(screen.queryByTestId('wizard-back-button')).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Next step' })).toBeEnabled()
    expect(screen.getByTestId('wizard-next-button')).toBeEnabled()
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument()
    expect(screen.queryByTestId('wizard-confirm-button')).not.toBeInTheDocument()
    expect(mockBeforeStepChange).toHaveBeenCalledTimes(3) // @click + watch - in the future, consider reducing the number of emits
    expect(mockStepChange).toHaveBeenCalledTimes(3)

    // Next step via custom attribute
    await userEvent.click(screen.getByTestId('wizard-next-button'))

    await waitFor(() => expect(screen.queryByRole('button', { name: 'Previous step' })).toBeEnabled())
    expect(screen.queryByTestId('wizard-back-button')).toBeEnabled()
    expect(screen.queryByRole('button', { name: 'Next step' })).not.toBeInTheDocument()
    expect(screen.queryByTestId('wizard-next-button')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled()
    expect(screen.getByTestId('wizard-confirm-button')).toBeEnabled()
    expect(mockBeforeStepChange).toHaveBeenCalledTimes(5) // @click + watch - in the future, consider reducing the number of emits
    expect(mockStepChange).toHaveBeenCalledTimes(5)
  })

  it('should display the title slot when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      template: `
        <sm-wizard :visible="true" title="Wizard title prop">
          <template #title><h1>Wizard title slot</h1></template>
          <template #default></template>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title slot' })).toBeVisible())
    expect(screen.getByRole('heading', { level: 1, name: 'Wizard title slot' })).toBeVisible()
    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument()
  })

  // Cover public APIs not attached anywhere in the built-in wizard controls
  it('should programmatically change steps via public APIs when called', async () => {
    // ARRANGE
    const mockStepChange = jest.fn()

    const ParentComponent = {
      components: { SmWizard, SmWizardStep },
      setup: () => {
        const activeStep = ref()
        const wizardRef = ref()

        return { activeStep, wizardRef, mockStepChange }
      },
      template: `
        <sm-wizard
          v-model:active-step="activeStep"
          ref="wizardRef"
          title="Wizard title"
          :visible="true"
          @step-change="mockStepChange"
        >
          <sm-wizard-step label="General">
            Wizard step 1
            <button @click="wizardRef.goLastStep()">Jump to last step</button>
          </sm-wizard-step>
          <sm-wizard-step label="Advanced">
            Wizard step 2
          </sm-wizard-step>
          <sm-wizard-step label="Review">
            Wizard step 3
            <button @click="wizardRef.goFirstStep()">Go back to first step</button>
          </sm-wizard-step>
        </sm-wizard>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Wizard title' })).toBeVisible())
    expect(screen.getByRole('tabpanel', { name: '1 General' })).toBeVisible()
    expect(screen.queryByRole('tabpanel', { name: '2 Advanced' })).not.toBeInTheDocument()
    expect(screen.queryByRole('tabpanel', { name: '3 Review' })).not.toBeInTheDocument()
    expect(mockStepChange).toHaveBeenCalledTimes(1) // Called onMounted

    await userEvent.click(screen.getByRole('button', { name: 'Jump to last step' }))

    await waitFor(() => expect(screen.queryByRole('tabpanel', { name: '1 General' })).not.toBeInTheDocument())
    expect(screen.queryByRole('tabpanel', { name: '2 Advanced' })).not.toBeInTheDocument()
    expect(screen.getByRole('tabpanel', { name: '3 Review' })).toBeVisible()
    expect(mockStepChange).toHaveBeenCalledTimes(3) // function call + watch - in the future, consider reducing the number of emits

    await userEvent.click(screen.getByRole('button', { name: 'Go back to first step' }))

    await waitFor(() => expect(screen.getByRole('tabpanel', { name: '1 General' })).toBeVisible())
    expect(screen.queryByRole('tabpanel', { name: '2 Advanced' })).not.toBeInTheDocument()
    expect(screen.queryByRole('tabpanel', { name: '3 Review' })).not.toBeInTheDocument()
    expect(mockStepChange).toHaveBeenCalledTimes(5) // function call + watch - in the future, consider reducing the number of emits
  })

})
