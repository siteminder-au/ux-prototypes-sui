import { render, screen, waitFor } from '@testing-library/vue'
import SmFieldError from './sm-field-error.vue'

describe('SmFieldError', () => {

  it('should display the first error message', async () => {
    // ARRANGE
    const props = {
      errors: ['Error message one', 'Error message two'],
      ariaMsg: { id: 'test-id' },
    }

    // ACT
    render(SmFieldError, { props })

    // ASSERT
    const alert = screen.getByRole('alert')
    await waitFor(() => expect(alert).toBeVisible())
    expect(alert).toHaveAttribute('id', 'test-id')
    expect(screen.getByText('Error message one')).toBeVisible()
  })

  it('should not display an error message when there is none', async () => {
    // ARRANGE
    const props = {
      errors: [],
      ariaMsg: { id: 'test-id' },
    }

    // ACT
    render(SmFieldError, { props })

    // ASSERT
    const alert = screen.getByRole('alert')
    await waitFor(() => expect(alert).toBeVisible()) // Alert is still in DOM
    expect(alert).toHaveAttribute('id', 'test-id')
    expect(screen.queryByText('Error message')).not.toBeInTheDocument() // But there should be no displayed error
  })

  it('should not attach attributes when ariaMsg is not provided', async () => {
    // ARRANGE
    const props = {
      errors: ['Error message one'],
      ariaMsg: null,
    }

    // ACT
    render(SmFieldError, { props })

    // ASSERT
    const alert = await screen.findByRole('alert')
    expect(alert).toBeVisible()
    expect(alert).not.toHaveAttribute('id')
    expect(screen.getByText('Error message one')).toBeVisible()
  })

})
