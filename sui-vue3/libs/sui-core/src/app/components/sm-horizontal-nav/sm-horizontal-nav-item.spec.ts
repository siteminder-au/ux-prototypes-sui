import { RenderResult, fireEvent, render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { createTestRouter } from '../../../../test/utils'
import SmHorizontalNavItem from './sm-horizontal-nav-item.vue'

const renderComponent = (component: any): RenderResult => {
  const testRouter = createTestRouter()

  return render(component, {
    global: { plugins: [testRouter] },
  })
}

describe('SmHorizontalNavItem', () => {

  describe('props', () => {
    it('should display the provided label', () => {
      const ParentComponent = {
        components: { SmHorizontalNavItem },
        template: `
          <sm-horizontal-nav-item label='Item 1' />
        `,
      }

      renderComponent(ParentComponent)

      const button = screen.getByRole('button', { name: 'Item 1' })
      expect(button).toBeVisible()
    })

    it('should display the item as link if to is provided', () => {
      const ParentComponent = {
        components: { SmHorizontalNavItem },
        template: `
            <sm-horizontal-nav-item label='Item 1' to='/path'/>
          `,
      }

      renderComponent(ParentComponent)

      const link = screen.getByRole('link', { name: 'Item 1' })
      expect(link).toBeVisible()
      expect(link).toHaveAttribute('href', '/path')
      expect(link).toHaveAttribute('title', 'Item 1')
      expect(link).toHaveTextContent('Item 1')
    })

    it('should display the item as link if href is provided', () => {
      const ParentComponent = {
        components: { SmHorizontalNavItem },
        template: `
              <sm-horizontal-nav-item label='Item 1' href='/path' target='_blank'/>
            `,
      }

      renderComponent(ParentComponent)

      const link = screen.getByRole('link')
      expect(link).toBeVisible()
      expect(link).toHaveAttribute('href', '/path')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('title', 'Item 1')
      expect(link).toHaveTextContent('Item 1')
    })

    it('should keep the link available and interactive with forceActiveState', async () => {
      const ParentComponent = {
        components: { SmHorizontalNavItem },
        template: `
          <sm-horizontal-nav-item label='Item 1' to='/path1' force-active-state='exact-active' />
          <sm-horizontal-nav-item label='Item 2' to='/path2' force-active-state='in-active' />
        `,
      }

      const testRouter = createTestRouter()
      const testRouterSpy = jest.spyOn(testRouter, 'push')

      render(
        ParentComponent,
        {
          global: {
            plugins: [testRouter],
          },
        },
      )

      let navItem = await screen.findByRole('link', { name: 'Item 1' })
      expect(navItem).toBeVisible()
      expect(testRouterSpy).toHaveBeenCalledTimes(0)
      await userEvent.click(navItem)
      expect(testRouterSpy).toHaveBeenCalledTimes(1)
      expect(testRouterSpy).toHaveBeenCalledWith('/path1')

      navItem = await screen.findByRole('link', { name: 'Item 2' })
      expect(navItem).toBeVisible()
      await userEvent.click(navItem)
      expect(testRouterSpy).toHaveBeenCalledTimes(2)
      expect(testRouterSpy).toHaveBeenCalledWith('/path2')
    })
  })

  describe('slots', () => {

    it('should render the default slot', async () => {
      const handleToggleMock = jest.fn()
      const ParentComponent = {
        components: { SmHorizontalNavItem },
        methods: {
          handleToggle: handleToggleMock,
        },
        template: `
              <sm-horizontal-nav-item label='Item 1' @toggle='handleToggle'>
                Default slot
              </sm-horizontal-nav-item>
            `,
      }

      renderComponent(ParentComponent)

      expect(screen.queryByText('Default slot')).not.toBeInTheDocument()

      // Open via button
      const button = screen.getByText('Item 1')
      await userEvent.click(button)

      expect(screen.getByText('Default slot')).toBeVisible()

      expect(handleToggleMock).toHaveBeenCalledTimes(1)

      // Close via button
      await userEvent.click(button)

      expect(handleToggleMock).toHaveBeenCalledTimes(2)
      expect(screen.queryByText('Default slot')).not.toBeInTheDocument()

      // Open via button
      await userEvent.click(button)

      expect(handleToggleMock).toHaveBeenCalledTimes(3)
      expect(screen.getByText('Default slot')).toBeVisible()

      // Close via outside click
      await fireEvent.click(document)

      expect(screen.queryByText('Default slot')).not.toBeInTheDocument()
    })

    it('should render the label slot', () => {
      const ParentComponent = {
        components: { SmHorizontalNavItem },
        template: `
          <sm-horizontal-nav-item label='Label prop'>
            <template #label>
              Label slot
            </template>
          </sm-horizontal-nav-item>
        `,
      }

      renderComponent(ParentComponent)

      expect(screen.getByText('Label slot')).toBeVisible()
    })

  })
})
