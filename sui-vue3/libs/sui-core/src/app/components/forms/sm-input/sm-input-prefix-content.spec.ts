import { render, screen, waitFor } from '@testing-library/vue'
import SmInputPrefixContent from './sm-input-prefix-content.vue'

describe('SmInputPrefixContent', () => {

  it('should render the default slot content', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmInputPrefixContent },
      template: `
        <sm-input-prefix-content>
          Default slot
        </sm-input-prefix-content>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Default slot')).toBeVisible())
  })

})
