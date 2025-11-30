import { render, screen } from '@testing-library/vue'
import SmLoadingSpinner from './sm-loading-spinner.vue'

describe('SmLoadingSpinner', () => {

  it('should get the loading spinner with correct role and message', async () => {
    render(SmLoadingSpinner)

    const loadingSpinner = await screen.findByRole('status')
    expect(loadingSpinner).toBeVisible()
    expect(loadingSpinner).toHaveTextContent('Loading ...')
  })

  it('should update the screen reader message when ariaLoadingMessage prop is provided', async () => {
    render(SmLoadingSpinner, {
      props: {
        ariaLoadingMessage: 'Loading widget',
      },
    })

    const loadingSpinner = await screen.findByRole('status')
    expect(loadingSpinner).toBeVisible()
    expect(loadingSpinner).toHaveTextContent('Loading widget')
  })

})
