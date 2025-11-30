import { render, screen, waitFor } from '@testing-library/vue'
import SmLoader from './sm-loader.vue'

describe('SmLoader', () => {

  it('should display the loading text', async () => {
    // ACT
    render(SmLoader)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Loading ...')).toBeVisible())
  })

})
