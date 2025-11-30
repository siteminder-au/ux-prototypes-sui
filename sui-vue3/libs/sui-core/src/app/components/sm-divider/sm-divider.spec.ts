import { render, screen, waitFor } from '@testing-library/vue'
import SmDivider from './sm-divider.vue'

describe('SmDivider', () => {

  it('should display the component with default styles', async () => {
    // ACT
    render(SmDivider)

    // ASSERT
    const divider = screen.getByRole('separator')
    await waitFor(() => expect(divider).toBeVisible())
  })

})
