import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { dialogService } from './dialog'

describe('dialogService', () => {

  /**
   * Setup a dummy component so we can add global stubs
   */
  const renderComponent = (): unknown => render(
    { template: '<div></div>' },
    {
      global: {
        stubs: {
          // sm-dialog has nested dependencies that need to be stubbed:
          // sm-dialog -> sm-button > sm-icon (the icon here throws the warnings)
          // The `global.components` declaration in `setup-after-env.ts` is not working
          // in deeply nested components in services/ test files
          'sm-button': {
            template: '<button class="sm-button-stub"><slot /></button>',
          },
        },
      },
    },
  )

  it('should display the dialog component when the service is called', async () => {
    // ARRANGE
    renderComponent()

    // ASSERT
    // Initial state
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    expect(screen.queryByRole('heading', { level: 4, name: 'Test title' })).not.toBeInTheDocument()
    expect(screen.queryByText('Test body')).not.toBeInTheDocument()

    // Call the service which will open the dialog
    const dialogInstance = dialogService({
      title: 'Test title',
      bodyContent: '<span>Test body</span>',
    })

    await waitFor(() => expect(screen.getByRole('alertdialog')).toBeVisible())
    expect(screen.getByRole('heading', { level: 4, name: 'Test title' })).toBeVisible()
    expect(screen.getByText('Test body')).toBeVisible()

    // Close the dialog
    await userEvent.click(screen.getByRole('button', { name: 'Click to close' }))
    dialogInstance.destroy()

    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    expect(screen.queryByRole('heading', { level: 4, name: 'Test title' })).not.toBeInTheDocument()
    expect(screen.queryByText('Test body')).not.toBeInTheDocument()
  })

})
