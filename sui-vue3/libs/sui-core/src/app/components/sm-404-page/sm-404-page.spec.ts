import { render, screen, waitFor } from '@testing-library/vue'
import Sm404Page from './sm-404-page.vue'

describe('Sm404Page', () => {

  it('should display the image slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { Sm404Page },
      template: `
        <sm-404-page>
          <template #image>
            <img alt="Error page" src="foo/test.png" />
          </template>
        </sm-404-page>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByAltText('Error page')).toBeVisible())
    expect(screen.queryByRole('img')).toBeVisible()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('should display the header slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { Sm404Page },
      template: `
        <sm-404-page>
          <template #header>
            <h3>Page not found</h3>
          </template>
        </sm-404-page>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('heading', { level: 3, name: 'Page not found' })).toBeVisible())
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('should display the description slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { Sm404Page },
      template: `
        <sm-404-page>
          <template #description>
            Something went wrong.
          </template>
        </sm-404-page>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Something went wrong.')).toBeVisible())
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('should display the actions slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { Sm404Page },
      template: `
        <sm-404-page>
          <template #actions>
            Actions slot
          </template>
        </sm-404-page>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Actions slot')).toBeVisible())
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

})
