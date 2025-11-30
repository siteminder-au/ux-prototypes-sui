import { render, screen, waitFor } from '@testing-library/vue'
import SmSection from './sm-section.vue'

describe('SmSection', () => {

  it('should display the content slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSection },
      template: `
        <sm-section>
          <h1>Content slot</h1>
        </sm-section>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const section = screen.getByRole('generic')
    await waitFor(() => expect(section).toBeVisible())
    expect(screen.getByText('Content slot')).toBeVisible()
  })

})
