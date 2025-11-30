import { render, screen } from '@testing-library/vue'
import SmLoadingDashboard from './sm-loading-dashboard.vue'
import SmLoadingGraphCard from './sm-loading-graph-card.vue'
import SmLoadingLongCard from './sm-loading-long-card.vue'
import SmLoadingSmallCard from './sm-loading-small-card.vue'
import SmLoadingBar from '../sm-loading-bar/sm-loading-bar.vue'

describe('SmLoadingDashboard', () => {

  it('should load the dashboard skeleton loaders', () => {
    // ARRANGE
    const ParentComponent = {
      components: {
        SmLoadingDashboard,
        SmLoadingGraphCard,
        SmLoadingLongCard,
        SmLoadingSmallCard,
      },
      template: `
        <sm-loading-dashboard>
          <sm-loading-long-card role="status" aria-label="long card" />
          <sm-loading-small-card role="status" aria-label="small card" />
          <sm-loading-graph-card role="status" aria-label="graph card" />
        </sm-loading-dashboard>
      `,
    }

    // ACT
    render(
      ParentComponent,
      {
        global: {
          components: {
            'sm-loading-bar': SmLoadingBar,
          },
        },
      },
    )

    // ASSERT
    expect(screen.getByRole('status', { name: 'long card' })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'small card' })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'graph card' })).toBeInTheDocument()
  })

})
