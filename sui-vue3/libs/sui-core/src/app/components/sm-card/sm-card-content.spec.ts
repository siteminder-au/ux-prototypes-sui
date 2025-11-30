import { render, screen, waitFor } from '@testing-library/vue'
import SmCardContent from './sm-card-content.vue'

describe('SmCardContent', () => {
  it('should display default slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCardContent },
      template: `
        <sm-card-content>
          <template #default>
            default slot
          </template>
        </sm-card-content>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('default slot')).toBeVisible())
  })

})
