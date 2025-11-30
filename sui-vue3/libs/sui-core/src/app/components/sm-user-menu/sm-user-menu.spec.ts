import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import SmUserMenu from './sm-user-menu.vue'

describe('SmUserMenu', () => {
  describe('props', () => {
    it('should display the provided displayName', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmUserMenu },
        template: `
          <sm-user-menu
            display-name="John Smith"
          />
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('img', { hidden: true })).toHaveAttribute('name', 'action-user'))
      expect(screen.getByRole('button', { name: 'Click to open', expanded: false })).toBeVisible()
      // NOTE: asserting 'John Smith' is not visible will not work
      // since VTL tests does not have css styles applied
      // and we use css to hide the text instead of v-if

      await userEvent.click(screen.getByRole('button', { name: 'Click to open', expanded: false }))
      await waitFor(() => expect(screen.getByRole('button', { name: 'Click to close', expanded: true })).toBeVisible())
      expect(screen.getByText('John Smith')).toBeVisible()

      await userEvent.click(screen.getByRole('button', { name: 'Click to close', expanded: true }))
      await waitFor(() => expect(screen.getByRole('button', { name: 'Click to open', expanded: false })).toBeVisible())
    })

    it('should render an img with the provided url', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmUserMenu },
        template: `
          <sm-user-menu
            display-name="John Smith"
            display-image-url="test.png"
          />
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('button', { name: 'Click to open', expanded: false })).toBeVisible())
      expect(screen.getByRole('img', { name: 'John Smith' })).toBeInTheDocument()
      expect(screen.getAllByRole('img', { hidden: true })[1]).toHaveAttribute('name', 'action-user')
    })

    it('should attach the custom display name attributes', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmUserMenu },
        template: `
          <sm-user-menu
            display-name="John Smith"
            display-image-url="test.png"
            :display-name-attrs="{ 'custom-attribute': 'foo', 'aria-label': 'bar' }"
          />
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('button', { name: 'Click to open', expanded: false })).toBeVisible())
      const displayNameContainer = screen.getByLabelText('bar')
      expect(displayNameContainer).toBeInTheDocument()
      expect(displayNameContainer).toHaveAttribute('custom-attribute', 'foo')
    })

    it('should add the custom CSS class', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmUserMenu },
        template: `
          <sm-user-menu
            display-name="John Smith"
            content-class="my-custom-class"
            aria-label="John Smith Label"
          />
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const userMenuContainer = screen.getByLabelText('John Smith Label')
      await waitFor(() => expect(userMenuContainer).toBeVisible())
      expect(userMenuContainer).toHaveClass('my-custom-class')
    })
  })

  describe('slots', () => {
    it('should render the default slot when dropdown is opened', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmUserMenu },
        template: `
          <sm-user-menu
            display-name="John Smith"
          >
            Default slot
          </sm-user-menu>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const userMenuButton = screen.getByRole('button', { name: 'Click to open', expanded: false })
      await waitFor(() => expect(userMenuButton).toBeVisible())
      expect(screen.queryByText('Default slot')).not.toBeInTheDocument()

      await userEvent.click(userMenuButton)
      await waitFor(() => expect(screen.getByRole('button', { name: 'Click to close', expanded: true })).toBeVisible())
      expect(screen.getByText('Default slot')).toBeVisible()
    })

    it('should render the icon slot', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmUserMenu },
        template: `
          <sm-user-menu
            display-name="John Smith"
          >
            <template #icon>Icon slot</template>
          </sm-user-menu>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('button', { name: 'Click to open', expanded: false })).toBeVisible())
      expect(screen.getByText('Icon slot')).toBeInTheDocument()
    })

    it('should render the display-name slot', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmUserMenu },
        template: `
          <sm-user-menu>
            <template #display-name>Display name slot</template>
          </sm-user-menu>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('button', { name: 'Click to open', expanded: false })).toBeVisible())
      expect(screen.getByText('Display name slot')).toBeInTheDocument()
    })

    it('should render the label slot if it is provided', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmUserMenu },
        template: `
          <sm-user-menu>
            <template #label>Label slot</template>
          </sm-user-menu>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.getByText('Label slot')).toBeInTheDocument()
    })

    it('should not render the label slot if not provided', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmUserMenu },
        template: `
          <sm-user-menu>
          </sm-user-menu>
        `,
      }

      // ACT
      const { container } = render(ParentComponent)

      // ASSERT
      expect(container.getElementsByClassName('sm-user-menu__display-label')).toHaveLength(0)
    })
  })

  it('should correctly show/hide the menu on click', async () => {
    const mockOpen = jest.fn()
    const mockClose = jest.fn()

    // ARRANGE
    const ParentComponent = {
      components: { SmUserMenu },
      setup: () => ({ mockOpen, mockClose }),
      template: `
        <div>
          <h1>Sample header</h1>
          <sm-user-menu display-name="John Smith" @open="mockOpen" @close="mockClose">
            User menu content
          </sm-user-menu>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const userMenu = screen.getByRole('button', { name: 'Click to open' })
    await waitFor(() => expect(userMenu).toBeVisible())
    expect(screen.queryByText('User menu content')).not.toBeInTheDocument()

    await userEvent.click(userMenu)
    await waitFor(() => expect(screen.getByText('User menu content')).toBeVisible())
    expect(mockOpen).toHaveBeenCalled()
    expect(mockClose).toHaveBeenCalledTimes(0)

    await userEvent.click(screen.getByRole('heading', { name: 'Sample header' }))
    await waitFor(() => expect(screen.queryByText('User menu content')).not.toBeInTheDocument())
    expect(mockClose).toHaveBeenCalledTimes(1)
  })
})
