import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { createTestRouter } from '../../../../test/utils'
import SmBreadcrumbItem from './sm-breadcrumb-item.vue'
import SmBreadcrumbs from './sm-breadcrumbs.vue'

describe('SmBreadcrumbs', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should render breadcrumbs with items', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmBreadcrumbItem, SmBreadcrumbs },
      template: `
        <sm-breadcrumbs aria-label="Standard Breadcrumbs">
          <sm-breadcrumb-item href="#">Item 1</sm-breadcrumb-item>
          <sm-breadcrumb-item href="https://external.com">Item 2</sm-breadcrumb-item>
          <sm-breadcrumb-item>Item 3</sm-breadcrumb-item>
        </sm-breadcrumbs>
      `,
    }

    // ACT
    const testRouter = createTestRouter()

    // ACT
    render(
      ParentComponent,
      { global: { plugins: [testRouter] } },
    )

    // ASSERT
    await waitFor(() => expect(screen.getByRole('navigation', { name: 'Standard Breadcrumbs' })).toBeVisible())
    expect(screen.getAllByRole('listitem').length).toBe(3)

    const itemOne = screen.getByRole('link', { name: 'Item 1' })
    expect(itemOne).toBeVisible()
    expect(itemOne).toHaveAttribute('href', '#')

    const itemTwo = screen.getByRole('link', { name: 'Item 2' })
    expect(itemTwo).toBeVisible()
    expect(itemTwo).toHaveAttribute('href', 'https://external.com')

    expect(screen.getByText('Item 3')).toBeVisible()
  })

  it('should render breadcrumbs with router location', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmBreadcrumbItem, SmBreadcrumbs },
      template: `
        <sm-breadcrumbs aria-label="Breadcrumbs with router link">
          <sm-breadcrumb-item to="/setup/details">Item 1</sm-breadcrumb-item>
          <sm-breadcrumb-item :to="{ name: 'test' }">Item 2</sm-breadcrumb-item>
          <sm-breadcrumb-item>Item 3</sm-breadcrumb-item>
        </sm-breadcrumbs>
      `,
    }
    const testRouter = createTestRouter()
    const testRouterSpy = jest.spyOn(testRouter, 'push')

    // ACT
    render(
      ParentComponent,
      {
        global: { plugins: [testRouter] },
      },
    )

    // ASSERT
    await waitFor(() => expect(screen.getByRole('navigation', { name: 'Breadcrumbs with router link' })).toBeVisible())
    expect(screen.getAllByRole('listitem').length).toBe(3)
    expect(screen.getByRole('link', { name: 'Item 1' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Item 2' })).toBeVisible()
    expect(screen.getByText('Item 3')).toBeVisible()

    await userEvent.click(screen.getByRole('link', { name: 'Item 1' }))
    expect(testRouterSpy).toHaveBeenCalledTimes(1)
    expect(testRouterSpy).toHaveBeenCalledWith('/setup/details')
  })

  it('should not render anything if there are no valid items', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmBreadcrumbItem, SmBreadcrumbs },
      template: `
        <sm-breadcrumbs aria-label="Standard Breadcrumbs">
          <span>Invalid element</span>
          Invalid element
        </sm-breadcrumbs>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('navigation', { name: 'Standard Breadcrumbs' })).toBeVisible())
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

})
