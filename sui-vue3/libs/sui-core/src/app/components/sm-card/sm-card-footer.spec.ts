import { render, screen } from '@testing-library/vue'
import SmCardFooter from './sm-card-footer.vue'

describe('SmCardFooter', () => {

  it('should display default slot', () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCardFooter },
      template: `
        <sm-card-footer>
          <template #default>
            <h2>footer</h2>
            <p>Et excepteur ad ea consectetur magna commodo sunt voluptate.</p>
          </template>
        </sm-card-footer>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(screen.getByRole('heading', { level: 2, name: 'footer' })).toBeVisible()
    expect(screen.getByText('Et excepteur ad ea consectetur magna commodo sunt voluptate.')).toBeVisible()
  })

})
