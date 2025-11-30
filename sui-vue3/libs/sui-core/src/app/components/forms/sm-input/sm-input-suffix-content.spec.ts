import { render, screen, waitFor } from '@testing-library/vue'
import SmInputSuffixContent from './sm-input-suffix-content.vue'

describe('SmInputSuffixContent', () => {

  it('should render the default slot content', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmInputSuffixContent },
      template: `
        <sm-input-suffix-content>
          Default slot
        </sm-input-suffix-content>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Default slot')).toBeVisible())
  })

})
