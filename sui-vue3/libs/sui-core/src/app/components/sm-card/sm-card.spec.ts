import { render, screen, waitFor } from '@testing-library/vue'
import SmCardActions from './sm-card-actions.vue'
import SmCardBrandGraphic from './sm-card-brand-graphic.vue'
import SmCardContent from './sm-card-content.vue'
import SmCardFooter from './sm-card-footer.vue'
import SmCardGraphic from './sm-card-graphic.vue'
import SmCard from './sm-card.vue'

describe('SmCard', () => {

  it('should render default card', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCard, SmCardActions, SmCardContent },
      template: `
        <sm-card tag="a" href="#" style="max-width: 336px">
          <sm-card-actions>
            Action content
          </sm-card-actions>

          <sm-card-content>
            <h4>Superior King</h4>
            <p>Et excepteur ad ea consectetur magna commodo sunt voluptate.</p>
          </sm-card-content>
        </sm-card>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('link')).toBeVisible())

    // Render the sm-card-action child component default slot
    expect(screen.getByText('Action content')).toBeVisible()

    // Render the sm-card-content child component default slot
    expect(screen.getByRole('heading', { level: 4, name: 'Superior King' })).toBeVisible()
    expect(screen.getByText('Et excepteur ad ea consectetur magna commodo sunt voluptate.')).toBeVisible()

  })

  it('should renders all children components', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCard, SmCardActions, SmCardBrandGraphic, SmCardContent, SmCardGraphic },
      template: `
        <sm-card style="max-width: 336px">
          <sm-card-graphic
            src="/foo.png"
            alt="A picture of a hotel"
          />

          <sm-card-brand-graphic src="/bar.png" />

          <sm-card-actions>
            Action content
          </sm-card-actions>

          <sm-card-content>
            Default content
          </sm-card-content>
        </sm-card>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // Render the sm-card-graphic component
    await waitFor(() => expect(screen.queryByRole('img')).toBeVisible())
    expect(screen.getByAltText('A picture of a hotel')).toBeVisible()

    // Render the sm-card-actions default slot
    expect(screen.getByText('Action content')).toBeVisible()

    // Render the sm-card-content default slot
    expect(screen.getByText('Default content')).toBeVisible()
  })

  it('should render sm-card-footer child components', () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCard, SmCardActions, SmCardContent, SmCardFooter },
      template: `
        <sm-card style="max-width: 336px">
          <sm-card-content>
            Default content
          </sm-card-content>

          <sm-card-footer>
            Card footer
          </sm-card-footer>

        </sm-card>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // Render the sm-card-content default slot
    expect(screen.getByText('Default content')).toBeVisible()

    // Render the sm-card-footer default slot
    expect(screen.getByText('Card footer')).toBeVisible()
  })

  it('should render header tag', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCard, SmCardActions, SmCardContent },
      template: `
        <sm-card tag="h1" style="max-width: 336px">
          Header
        </sm-card>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(expect(screen.getByRole('heading', { level: 1, name: 'Header' })).toBeVisible()))

  })
})
