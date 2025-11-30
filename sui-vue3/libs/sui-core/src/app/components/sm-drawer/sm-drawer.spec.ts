import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { ref } from 'vue'
import SmButton from '../sm-button/sm-button.vue'
import SmDrawer from './sm-drawer.vue'

describe('SmDrawer', () => {

  it('should toggle the drawer visibility when visible prop changes', async () => {
    // ARRANGE
    const mockOpen = jest.fn()
    const mockClose = jest.fn()

    const ParentComponent = {
      components: { SmButton, SmDrawer },
      setup: () => {
        const drawerVisible = ref(false)

        return { drawerVisible, mockOpen, mockClose }
      },
      template: `
        <div>
          <sm-drawer
            v-model:visible="drawerVisible"
            title="Drawer title"
            @open="mockOpen"
            @close="mockClose"
          >
            <p>Content in here</p>
          </sm-drawer>
          <sm-button type="primary" @click="drawerVisible = true">Open drawer</sm-button>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // The elements are in the DOM, but should not be visible
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).not.toBeInTheDocument()
    expect(screen.queryByText('Content in here')).not.toBeVisible()
    expect(mockClose).toHaveBeenCalledTimes(1) // Emitted due to watchEffect
    expect(mockOpen).toHaveBeenCalledTimes(0)

    await userEvent.click(screen.getByRole('button', { name: 'Open drawer' }))

    await screen.findByRole('dialog')
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).toBeVisible()
    expect(screen.queryByText('Content in here')).toBeVisible()
    expect(mockClose).toHaveBeenCalledTimes(1)
    expect(mockOpen).toHaveBeenCalledTimes(1)

    // Close via built-in close (x) button
    await userEvent.click(screen.getByRole('button', { name: 'Click to close' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).not.toBeInTheDocument()
    expect(screen.queryByText('Content in here')).not.toBeVisible()
    expect(mockClose).toHaveBeenCalledTimes(2)
    expect(mockOpen).toHaveBeenCalledTimes(1)
  })

  it('should initialize drawer as visible when visible prop is true', async () => {
    // ARRANGE
    const mockOpen = jest.fn()
    const mockClose = jest.fn()

    const ParentComponent = {
      components: { SmButton, SmDrawer },
      setup: () => {
        const drawerVisible = ref(true)

        return { drawerVisible, mockOpen, mockClose }
      },
      template: `
        <sm-drawer
          v-model:visible="drawerVisible"
          title="Drawer title"
          @open="mockOpen"
          @close="mockClose"
        >
          <p>Content in here</p>
        </sm-drawer>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeVisible())
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).toBeVisible()
    expect(screen.queryByText('Content in here')).toBeVisible()
    expect(mockClose).toHaveBeenCalledTimes(0)
    expect(mockOpen).toHaveBeenCalledTimes(1) // Emitted due to watchEffect
  })

  it('should toggle the drawer visibility when public methods are called', async () => {
    // ARRANGE
    const mockOpen = jest.fn()
    const mockBeforeClose = jest.fn()
    const mockClose = jest.fn()

    const ParentComponent = {
      components: { SmButton, SmDrawer },
      setup: () => {
        const drawerRef = ref()
        const drawerVisible = ref(false)

        mockBeforeClose.mockImplementation((close: () => void) => {
          close()
        })

        return { drawerRef, drawerVisible, mockBeforeClose, mockOpen, mockClose }
      },
      template: `
        <div>
          <sm-drawer
            v-model:visible="drawerVisible"
            ref="drawerRef"
            title="Drawer title"
            :before-close="mockBeforeClose"
            @open="mockOpen"
            @close="mockClose"
          >
            <p>Content in here</p>
            <sm-button type="secondary" @click="drawerRef.close()">Close drawer</sm-button>
          </sm-drawer>
          <sm-button type="primary" @click="drawerRef.open()">Open drawer</sm-button>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT// The elements are in the DOM, but should not be visible
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).not.toBeInTheDocument()
    expect(screen.queryByText('Content in here')).not.toBeVisible()
    expect(mockBeforeClose).toHaveBeenCalledTimes(0)
    expect(mockClose).toHaveBeenCalledTimes(1) // Emitted due to watchEffect
    expect(mockOpen).toHaveBeenCalledTimes(0)

    // Open via `.open()` method
    await userEvent.click(screen.getByRole('button', { name: 'Open drawer' }))

    await screen.findByRole('dialog')
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).toBeVisible()
    expect(screen.queryByText('Content in here')).toBeVisible()
    expect(mockBeforeClose).toHaveBeenCalledTimes(0)
    expect(mockClose).toHaveBeenCalledTimes(1)
    expect(mockOpen).toHaveBeenCalledTimes(1)

    // Close via `.close()` method
    await userEvent.click(screen.getByRole('button', { name: 'Close drawer' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).not.toBeInTheDocument()
    expect(screen.queryByText('Content in here')).not.toBeVisible()
    expect(mockBeforeClose).toHaveBeenCalledTimes(1)
    expect(mockClose).toHaveBeenCalledTimes(2)
    expect(mockOpen).toHaveBeenCalledTimes(1)
  })

  it('should hide the close button if showClose prop is false', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton, SmDrawer },
      template: `
        <sm-drawer
          content-class="sm-drawer__fixed-width"
          title="Drawer title"
          :show-close="false"
          :visible="true"
        >
          <p>Content in here</p>
          <sm-button>Close drawer</sm-button>
        </sm-drawer>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeVisible())
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).toBeVisible()
    expect(screen.queryByText('Content in here')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Click to close' })).not.toBeInTheDocument()
  })

  it('should close the drawer when escape key is pressed by default', async () => {
    // ARRANGE
    const mockOpen = jest.fn()
    const mockClose = jest.fn()

    const ParentComponent = {
      components: { SmButton, SmDrawer },
      setup: () => {
        const drawerVisible = ref(true)

        return { drawerVisible, mockOpen, mockClose }
      },
      template: `
        <sm-drawer
          v-model:visible="drawerVisible"
          title="Drawer title"
          @open="mockOpen"
          @close="mockClose"
        >
          <p>Content in here</p>
          <sm-button @click="drawerVisible = false">Close drawer</sm-button>
        </sm-drawer>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await screen.findByRole('dialog')
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).toBeVisible()
    expect(screen.queryByText('Content in here')).toBeVisible()
    expect(mockClose).toHaveBeenCalledTimes(0)
    expect(mockOpen).toHaveBeenCalledTimes(1) // Emitted due to watchEffect

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).not.toBeInTheDocument()
    expect(screen.queryByText('Content in here')).not.toBeVisible()
    expect(mockClose).toHaveBeenCalledTimes(1)
    expect(mockOpen).toHaveBeenCalledTimes(1)
  })

  it('should not close the drawer when escape key is pressed and closeOnPressEscape is false', async () => {
    // ARRANGE
    const mockOpen = jest.fn()
    const mockClose = jest.fn()

    const ParentComponent = {
      components: { SmButton, SmDrawer },
      setup: () => {
        const drawerVisible = ref(true)

        return { drawerVisible, mockOpen, mockClose }
      },
      template: `
        <sm-drawer
          v-model:visible="drawerVisible"
          title="Drawer title"
          :close-on-press-escape="false"
          :show-on-top="true"
          @open="mockOpen"
          @close="mockClose"
        >
          <p>Content in here</p>
          <sm-button @click="drawerVisible = false">Close drawer</sm-button>
        </sm-drawer>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await screen.findByRole('dialog')
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).toBeVisible()
    expect(screen.queryByText('Content in here')).toBeVisible()
    expect(mockClose).toHaveBeenCalledTimes(0)
    expect(mockOpen).toHaveBeenCalledTimes(1) // Emitted due to watchEffect

    await userEvent.keyboard('{Escape}')

    // Still open
    await screen.findByRole('dialog')
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).toBeVisible()
    expect(screen.queryByText('Content in here')).toBeVisible()
    expect(mockClose).toHaveBeenCalledTimes(0)
    expect(mockOpen).toHaveBeenCalledTimes(1)
  })

  it('should close the drawer when the underlay is clicked by default', async () => {
    // ARRANGE
    const mockOpen = jest.fn()
    const mockClose = jest.fn()

    const ParentComponent = {
      components: { SmButton, SmDrawer },
      setup: () => {
        const drawerVisible = ref(true)

        return { drawerVisible, mockOpen, mockClose }
      },
      template: `
        <sm-drawer
          v-model:visible="drawerVisible"
          title="Drawer title"
          @open="mockOpen"
          @close="mockClose"
        >
          <p>Content in here</p>
          <sm-button @click="drawerVisible = false">Close drawer</sm-button>
        </sm-drawer>
      `,
    }

    // ACT
    const { container } = render(ParentComponent)

    // ASSERT
    await screen.findByRole('dialog')
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).toBeVisible()
    expect(screen.queryByText('Content in here')).toBeVisible()
    expect(mockClose).toHaveBeenCalledTimes(0)
    expect(mockOpen).toHaveBeenCalledTimes(1) // Emitted due to watchEffect

    // Close the drawer via underlay, we use the class name here since it's not accessible and isn't supposed to be
    await userEvent.click(container.getElementsByClassName('sm-drawer__underlay')[0])

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).not.toBeInTheDocument()
    expect(screen.queryByText('Content in here')).not.toBeVisible()
    expect(mockClose).toHaveBeenCalledTimes(1)
    expect(mockOpen).toHaveBeenCalledTimes(1)
  })

  it('should not close the drawer when the underlay is clicked and closeOnClickModal is false', async () => {
    // ARRANGE
    const mockOpen = jest.fn()
    const mockClose = jest.fn()

    const ParentComponent = {
      components: { SmButton, SmDrawer },
      setup: () => {
        const drawerVisible = ref(true)

        return { drawerVisible, mockOpen, mockClose }
      },
      template: `
        <sm-drawer
          v-model:visible="drawerVisible"
          title="Drawer title"
          :below-header="true"
          :close-on-click-modal="false"
          @open="mockOpen"
          @close="mockClose"
        >
          <p>Content in here</p>
          <sm-button @click="drawerVisible = false">Close drawer</sm-button>
        </sm-drawer>
      `,
    }

    // ACT
    const { container } = render(ParentComponent)

    // ASSERT
    await screen.findByRole('dialog')
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).toBeVisible()
    expect(screen.queryByText('Content in here')).toBeVisible()
    expect(mockClose).toHaveBeenCalledTimes(0)
    expect(mockOpen).toHaveBeenCalledTimes(1) // Emitted due to watchEffect

    // Close the drawer via underlay, we use the class name here since it's not accessible and isn't supposed to be
    await userEvent.click(container.getElementsByClassName('sm-drawer__underlay')[0])

    // Still open
    await screen.findByRole('dialog')
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).toBeVisible()
    expect(screen.queryByText('Content in here')).toBeVisible()
    expect(mockClose).toHaveBeenCalledTimes(0)
    expect(mockOpen).toHaveBeenCalledTimes(1)
  })

  it('should render the title slot if provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmDrawer },
      template: `
        <sm-drawer
          title="Drawer title - prop"
          :visible="true"
        >
          <template #title><h4>Drawer title - slot</h4></template>
          <template #default><p>Content in here</p></template>
        </sm-drawer>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeVisible())
    expect(screen.queryByRole('heading', { level: 4, name: 'Drawer title - slot' })).toBeVisible()
    expect(screen.queryByText('Content in here')).toBeVisible()
  })

  it('should render the actions and mobile-actions slots if provided by default', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton, SmDrawer },
      template: `
        <sm-drawer
          title="Drawer title"
          :visible="true"
        >
          <template #actions>
            <sm-button>Close</sm-button>
          </template>
          <template #mobile-actions>
            <sm-button>Close mobile</sm-button>
          </template>
          <template #default><p>Content in here</p></template>
        </sm-drawer>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeVisible())
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).toBeVisible()
    expect(screen.queryByText('Content in here')).toBeVisible()
    // Visibility between the two is controlled by CSS
    expect(screen.getByRole('button', { name: 'Close' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Close mobile' })).toBeVisible()
  })

  it('should hide the actions slot if provided and actionButtonsVisible is false', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton, SmDrawer },
      template: `
        <sm-drawer
          title="Drawer title"
          :action-buttons-visible="false"
          :visible="true"
        >
          <template #actions>
            <sm-button>Close</sm-button>
          </template>
          <template #mobile-actions>
            <sm-button>Close mobile</sm-button>
          </template>
          <template #default><p>Content in here</p></template>
        </sm-drawer>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeVisible())
    expect(screen.queryByRole('heading', { level: 3, name: 'Drawer title' })).toBeVisible()
    expect(screen.queryByText('Content in here')).toBeVisible()
    // In the DOM but can't be queried due to `display: none;`
    // Visibility between the two is controlled by CSS
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close mobile' })).not.toBeInTheDocument()
  })
})
