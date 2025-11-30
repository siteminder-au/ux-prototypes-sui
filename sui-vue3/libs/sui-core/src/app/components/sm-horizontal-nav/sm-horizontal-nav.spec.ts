import { render, screen } from '@testing-library/vue'
import { createTestRouter } from '../../../../test/utils'
import SmHorizontalNav from './sm-horizontal-nav.vue'

describe('SmHorizontalNav', () => {
  it('should render the default slot', () => {
    const ParentComponent = {
      components: { SmHorizontalNav },
      template: `
        <sm-horizontal-nav>
          test-slot
        </sm-horizontal-nav>
      `,
    }

    render(ParentComponent, {
      global: {
        plugins: [createTestRouter()],
      },
    })

    expect(screen.getByText('test-slot')).toBeVisible()
  })
})
