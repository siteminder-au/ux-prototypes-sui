import { render, screen, waitFor } from '@testing-library/vue'
import SmCardActions from './sm-card-actions.vue'

describe('SmCardActions', () => {

  it('should display default slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCardActions },
      template: `
        <sm-card-actions>
          <template #default>
            default slot
          </template>
        </sm-card-actions>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('default slot')).toBeVisible())
  })

})
