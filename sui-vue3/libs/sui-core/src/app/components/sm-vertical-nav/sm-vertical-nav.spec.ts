import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import SmVerticalNav from './sm-vertical-nav.vue'
import SmVerticalNavItem from './sm-vertical-nav-item.vue'
import SmVerticalNavSection from './sm-vertical-nav-section.vue'
import { createTestRouter } from '../../../../test/utils'

describe('SmVerticalNav', () => {

  it('should render the vertical nav item with states - default', async () => {
    // ARRANGE
    const mockClick = jest.fn()
    const ParentComponent = {
      components: { SmVerticalNav, SmVerticalNavItem },
      setup: () => {
        return {
          mockClick,
        }
      },
      template: `
        <div>
          <sm-vertical-nav>
            <sm-vertical-nav-item
              label="Item 1"
              to="/1"
            />
            <sm-vertical-nav-item
              label="Item 2"
              to="/2"
            />
            <sm-vertical-nav-item
              label="Item 3"
              @click="mockClick"
            />
          </sm-vertical-nav>
        </div>
      `,
    }

    const testRouter = createTestRouter()
    const testRouterSpy = jest.spyOn(testRouter, 'push')

    // ACT
    render(
      ParentComponent,
      {
        global: {
          plugins: [testRouter],
        },
      },
    )

    // ASSERT
    const navItem = screen.getByRole('link', { name: 'Item 1' })
    await waitFor(() => expect(navItem).toBeVisible())
    expect(testRouterSpy).toHaveBeenCalledTimes(0)
    await userEvent.click(navItem)
    expect(testRouterSpy).toHaveBeenCalledTimes(1)
    expect(testRouterSpy).toHaveBeenNthCalledWith(1, '/1')
    expect(mockClick).toHaveBeenCalledTimes(0) // Handler for item 3

    const navItem2 = screen.getByRole('link', { name: 'Item 2' })
    expect(navItem2).toBeVisible()
    await userEvent.click(navItem2)
    expect(testRouterSpy).toHaveBeenCalledTimes(2)
    expect(testRouterSpy).toHaveBeenNthCalledWith(2, '/2')
    expect(mockClick).toHaveBeenCalledTimes(0) // Handler for item 3

    const navItem3 = screen.getByRole('button', { name: 'Item 3' })
    expect(navItem3).toBeVisible()
    await userEvent.click(navItem3)
    expect(testRouterSpy).toHaveBeenCalledTimes(2)
    expect(mockClick).toHaveBeenCalledTimes(1) // Handler for item 3
  })

  it('should open nested nav if its the current active route', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmVerticalNav, SmVerticalNavItem, SmVerticalNavSection },
      template: `
        <div>
          <sm-vertical-nav>
            <sm-vertical-nav-section label="Property Setup">
              <sm-vertical-nav-item force-active-state="in-active" label="General" to="/setup/general" />
              <sm-vertical-nav-item force-active-state="in-active" label="Details" to="/setup/details" />
            </sm-vertical-nav-section>

            <sm-vertical-nav-section label="Media">
              <sm-vertical-nav-item label="Media" to="/setup/media">
                <sm-vertical-nav-item force-active-state="exact-active" label="Rooms" to="/setup/media/room-types" />
                <sm-vertical-nav-item force-active-state="in-active" label="Property" to="/setup/media/property" />
              </sm-vertical-nav-item>
            </sm-vertical-nav-section>

            <sm-vertical-nav-section label="Others">
              <sm-vertical-nav-item to="/content-slot">
                <template #content>
                  Content slot
                </template>
              </sm-vertical-nav-item>
            </sm-vertical-nav-section>
          </sm-vertical-nav>
        </div>
      `,
    }

    const testRouter = createTestRouter()
    const testRouterSpy = jest.spyOn(testRouter, 'push')

    // ACT
    render(
      ParentComponent,
      {
        global: {
          plugins: [testRouter],
        },
      },
    )

    // ASSERT
    // property setup
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Property Setup' })).toBeVisible())
    expect(screen.getByRole('link', { name: 'General' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Details' })).toBeVisible()

    // media
    expect(screen.getByRole('heading', { name: 'Media' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Media' })).toBeVisible()
    // we assert that the nested nav is opened which validated that we
    // instructed the parent nav item to open the nested nav
    expect(screen.getByRole('button', { name: 'Click to close menu' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Rooms' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Property' })).toBeVisible()

    // others
    expect(screen.getByRole('heading', { name: 'Others' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Content slot' })).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: 'Click to close menu' }))

    await waitFor(() => expect(screen.getByRole('button', { name: 'Click to open menu' })).toBeVisible())
    expect(screen.queryByRole('link', { name: 'Rooms' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Property' })).not.toBeInTheDocument()

    expect(testRouterSpy).toHaveBeenCalledTimes(0)
  })

})
