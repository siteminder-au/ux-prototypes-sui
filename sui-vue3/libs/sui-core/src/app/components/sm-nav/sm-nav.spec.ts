import { render, screen, waitFor } from '@testing-library/vue'
import { ref } from 'vue'
import userEvent from '@testing-library/user-event'
import SmNav from './sm-nav.vue'
import SmNavItem from './sm-nav-item.vue'
import SmButton from '../sm-button/sm-button.vue'
import { createTestRouter } from '../../../../test/utils'

describe('SmNav', () => {
  describe('show / hide', () => {
    it('should hide when the visible prop is initially set to false', async () => {
      // ARRANGE
      const mockOpen = jest.fn()
      const mockClose = jest.fn()

      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(false)
          return {
            navVisible,
            mockOpen,
            mockClose,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
              @open="mockOpen"
              @close="mockClose"
            >
              <sm-nav-item label="Switch property" to="/test"/>
              <sm-nav-item label="Property settings" to="/test2"/>
            </sm-nav>
            <sm-button @click="navVisible = true" type="primary">Open nav</sm-button>
          </div>
        `,
      }

      // ACT
      render(
        ParentComponent,
        {
          global: {
            plugins: [createTestRouter()],
          },
        },
      )

      // ASSERT
      // Assert initial state
      await waitFor(() => expect(screen.queryByRole('navigation')).not.toBeInTheDocument())
      expect(screen.queryByRole('button', { name: 'Click to close navigation bar' })).not.toBeInTheDocument()

      expect(screen.queryByRole('menuitem', { name: 'Switch property', expanded: false })).not.toBeInTheDocument()
      expect(screen.queryByRole('menuitem', { name: 'Property settings', expanded: false })).not.toBeInTheDocument()

      expect(mockOpen).toHaveBeenCalledTimes(0)
      expect(mockClose).toHaveBeenCalledTimes(0)

      await userEvent.click(screen.getByText('Open nav'))

      // Assert visibility
      await waitFor(() => expect(screen.getByRole('navigation')).toBeVisible())
      expect(screen.getByRole('menuitem', { name: 'Switch property', expanded: false })).toBeVisible()
      expect(screen.getByRole('menuitem', { name: 'Property settings', expanded: false })).toBeVisible()

      expect(mockOpen).toHaveBeenCalledTimes(1)
      expect(mockClose).toHaveBeenCalledTimes(0)

      await userEvent.click(screen.getByRole('button', { name: 'Click to close navigation bar' }))

      // nav should be hidden again
      await waitFor(() => expect(screen.queryByRole('navigation')).not.toBeInTheDocument())

      expect(mockOpen).toHaveBeenCalledTimes(1)
      expect(mockClose).toHaveBeenCalledTimes(1)
    })

    it('should show when the visible prop is initially set to true', async () => {
      // ARRANGE
      const mockOpen = jest.fn()
      const mockClose = jest.fn()

      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockOpen,
            mockClose,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
              @open="mockOpen"
              @close="mockClose"
            >
              <sm-nav-item label="Switch property" to="/test"/>
              <sm-nav-item label="Property settings" to="/test2"/>
            </sm-nav>
            <sm-button @click="navVisible = true" type="primary">Open nav</sm-button>
          </div>
        `,
      }

      // ACT
      render(
        ParentComponent,
        {
          global: {
            plugins: [createTestRouter()],
          },
        },
      )

      // ASSERT
      // Assert initial state.
      await waitFor(() => expect(screen.getByRole('navigation')).toBeVisible())
      expect(screen.getByRole('menuitem', { name: 'Switch property', expanded: false })).toBeVisible()
      expect(screen.getByRole('menuitem', { name: 'Property settings', expanded: false })).toBeVisible()

      expect(mockOpen).toHaveBeenCalledTimes(0)
      expect(mockClose).toHaveBeenCalledTimes(0)

      await userEvent.click(screen.getByRole('button', { name: 'Click to close navigation bar' }))

      // Assert disappearance
      await waitFor(() => expect(screen.queryByRole('navigation')).not.toBeInTheDocument())
      expect(screen.queryByRole('button', { name: 'Click to close navigation bar' })).not.toBeInTheDocument()

      expect(screen.queryByRole('menuitem', { name: 'Switch property', expanded: false })).not.toBeInTheDocument()
      expect(screen.queryByRole('menuitem', { name: 'Property settings', expanded: false })).not.toBeInTheDocument()

      expect(mockOpen).toHaveBeenCalledTimes(0)
      expect(mockClose).toHaveBeenCalledTimes(1)

      await userEvent.click(screen.getByText('Open nav'))

      // nav should appear again
      await waitFor(() => expect(screen.getByRole('navigation')).toBeVisible())

      expect(mockOpen).toHaveBeenCalledTimes(1)
      expect(mockClose).toHaveBeenCalledTimes(1)
    })

    it('calling the close method should hide the drawer', async () => {
      // ARRANGE
      const mockOpen = jest.fn()
      const mockClose = jest.fn()
      const navRef = ref(null)

      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockOpen,
            mockClose,
            navRef,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
              @open="mockOpen"
              @close="mockClose"
              ref="navRef"
            >
              <sm-nav-item label="Switch property" to="/test"/>
              <sm-nav-item label="Property settings" to="/test2"/>
            </sm-nav>
            <sm-button @click="navVisible = true" type="primary">Open nav</sm-button>
          </div>
        `,
      }

      // ACT
      render(
        ParentComponent,
        {
          global: {
            plugins: [createTestRouter()],
          },
        },
      )

      // ASSERT
      // Assert initial state.
      await waitFor(() => expect(screen.getByRole('navigation')).toBeVisible())
      expect(screen.getByRole('menuitem', { name: 'Switch property', expanded: false })).toBeVisible()
      expect(screen.getByRole('menuitem', { name: 'Property settings', expanded: false })).toBeVisible()

      expect(mockOpen).toHaveBeenCalledTimes(0)
      expect(mockClose).toHaveBeenCalledTimes(0)

      ;(navRef.value as any).close()

      // Assert disappearance
      await waitFor(() => expect(screen.queryByRole('navigation')).not.toBeInTheDocument())
      expect(screen.queryByRole('button', { name: 'Click to close navigation bar' })).not.toBeInTheDocument()

      expect(screen.queryByRole('menuitem', { name: 'Switch property', expanded: false })).not.toBeInTheDocument()
      expect(screen.queryByRole('menuitem', { name: 'Property settings', expanded: false })).not.toBeInTheDocument()

      expect(mockOpen).toHaveBeenCalledTimes(0)
      expect(mockClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('underlay', () => {
    it('should close when clicking the underlay (mask)', async () => {
      // ARRANGE
      const mockOpen = jest.fn()
      const mockClose = jest.fn()

      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockOpen,
            mockClose,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
              @open="mockOpen"
              @close="mockClose"
            >
              <sm-nav-item label="Switch property" to="/test"/>
              <sm-nav-item label="Property settings" to="/test2"/>
            </sm-nav>
          </div>
        `,
      }

      // ACT
      const { container } = render(
        ParentComponent,
        {
          global: {
            plugins: [createTestRouter()],
          },
        },
      )

      // ASSERT
      // Assert initial state.
      await waitFor(() => expect(screen.getByRole('navigation')).toBeVisible())
      expect(screen.getByRole('menuitem', { name: 'Switch property', expanded: false })).toBeVisible()
      expect(screen.getByRole('menuitem', { name: 'Property settings', expanded: false })).toBeVisible()

      expect(mockOpen).toHaveBeenCalledTimes(0)
      expect(mockClose).toHaveBeenCalledTimes(0)

      // we need to do this because css styles are not applied in VTL
      // so we have to manually grab the underlay element and click it
      const underlayMask = container.querySelector('.sm-nav__underlay')
      if (underlayMask) {
        await userEvent.click(underlayMask)
      }

      // Assert disappearance
      await waitFor(() => expect(screen.queryByRole('navigation')).not.toBeInTheDocument())
      expect(screen.queryByRole('button', { name: 'Click to close navigation bar' })).not.toBeInTheDocument()

      expect(screen.queryByRole('menuitem', { name: 'Switch property', expanded: false })).not.toBeInTheDocument()
      expect(screen.queryByRole('menuitem', { name: 'Property settings', expanded: false })).not.toBeInTheDocument()

      expect(mockOpen).toHaveBeenCalledTimes(0)
      expect(mockClose).toHaveBeenCalledTimes(1)
    })

    it('should not close when clicking the underlay (mask) and closeOnClickModal is false', async () => {
      // ARRANGE
      const mockOpen = jest.fn()
      const mockClose = jest.fn()

      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockOpen,
            mockClose,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
              :close-on-click-modal="false"
              @open="mockOpen"
              @close="mockClose"
            >
              <sm-nav-item label="Switch property" to="/test"/>
              <sm-nav-item label="Property settings" to="/test2"/>
            </sm-nav>
          </div>
        `,
      }

      // ACT
      const { container } = render(
        ParentComponent,
        {
          global: {
            plugins: [createTestRouter()],
          },
        },
      )

      // ASSERT
      // Assert initial state.
      await waitFor(() => expect(screen.getByRole('navigation')).toBeVisible())
      expect(screen.getByRole('menuitem', { name: 'Switch property', expanded: false })).toBeVisible()
      expect(screen.getByRole('menuitem', { name: 'Property settings', expanded: false })).toBeVisible()

      expect(mockOpen).toHaveBeenCalledTimes(0)
      expect(mockClose).toHaveBeenCalledTimes(0)

      // we need to do this because css styles are not applied in VTL
      // so we have to manually grab the underlay element and click it
      const underlayMask = container.querySelector('.sm-nav__underlay')
      if (underlayMask) {
        await userEvent.click(underlayMask)
      }

      // Assert nav is still visible
      await waitFor(() => expect(screen.getByRole('navigation')).toBeVisible())
      expect(screen.getByRole('menuitem', { name: 'Switch property', expanded: false })).toBeVisible()
      expect(screen.getByRole('menuitem', { name: 'Property settings', expanded: false })).toBeVisible()

      expect(mockOpen).toHaveBeenCalledTimes(0)
      expect(mockClose).toHaveBeenCalledTimes(0)
    })
  })

  describe('close button', () => {
    it('should show the close button if showClose is true', async () => {
      // ARRANGE
      const mockOpen = jest.fn()
      const mockClose = jest.fn()

      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockOpen,
            mockClose,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
              :show-close="true"
              @open="mockOpen"
              @close="mockClose"
            >
              <sm-nav-item label="Switch property" to="/test"/>
              <sm-nav-item label="Property settings" to="/test2"/>
            </sm-nav>
            <sm-button @click="navVisible = true" type="primary">Open nav</sm-button>
          </div>
        `,
      }

      // ACT
      render(
        ParentComponent,
        {
          global: {
            plugins: [createTestRouter()],
          },
        },
      )

      // ASSERT
      await waitFor(() => expect(screen.getByRole('button', { name: 'Click to close navigation bar' })).toBeVisible())
    })

    it('should hide the close button if showClose is false', async () => {
      // ARRANGE
      const mockOpen = jest.fn()
      const mockClose = jest.fn()

      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockOpen,
            mockClose,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
              :show-close="false"
              @open="mockOpen"
              @close="mockClose"
            >
              <sm-nav-item label="Switch property" to="/test"/>
              <sm-nav-item label="Property settings" to="/test2"/>
            </sm-nav>
            <sm-button @click="navVisible = true" type="primary">Open nav</sm-button>
          </div>
        `,
      }

      // ACT
      render(
        ParentComponent,
        {
          global: {
            plugins: [createTestRouter()],
          },
        },
      )

      // ASSERT
      await waitFor(() => expect(screen.queryByRole('button', { name: 'Click to close navigation bar' })).not.toBeInTheDocument())
    })
  })

  describe('logo', () => {
    it('should show the logo if prop is provided', async () => {
      // ARRANGE
      const mockOpen = jest.fn()
      const mockClose = jest.fn()

      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockOpen,
            mockClose,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
              logo="logo.png"
              @open="mockOpen"
              @close="mockClose"
            >
              <sm-nav-item label="Switch property" to="/test"/>
              <sm-nav-item label="Property settings" to="/test2"/>
            </sm-nav>
            <sm-button @click="navVisible = true" type="primary">Open nav</sm-button>
          </div>
        `,
      }

      // ACT
      render(
        ParentComponent,
        {
          global: {
            plugins: [createTestRouter()],
          },
        },
      )

      // ASSERT
      await waitFor(() => expect(screen.getByRole('img')).toHaveAttribute('src', 'logo.png'))
    })

    it('should not show the logo if prop is not provided', async () => {
      // ARRANGE
      const mockOpen = jest.fn()
      const mockClose = jest.fn()

      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockOpen,
            mockClose,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
              @open="mockOpen"
              @close="mockClose"
            >
              <sm-nav-item label="Switch property" to="/test"/>
              <sm-nav-item label="Property settings" to="/test2"/>
            </sm-nav>
            <sm-button @click="navVisible = true" type="primary">Open nav</sm-button>
          </div>
        `,
      }

      // ACT
      render(
        ParentComponent,
        {
          global: {
            plugins: [createTestRouter()],
          },
        },
      )

      // ASSERT
      await waitFor(() => expect(screen.queryByRole('img')).not.toBeInTheDocument())
    })
  })

  describe('title', () => {
    it('should show the title if prop is provided', async () => {
      // ARRANGE
      const mockOpen = jest.fn()
      const mockClose = jest.fn()

      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockOpen,
            mockClose,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
              @open="mockOpen"
              @close="mockClose"
            >
              <sm-nav-item label="Switch property" to="/test"/>
              <sm-nav-item label="Property settings" to="/test2"/>
            </sm-nav>
            <sm-button @click="navVisible = true" type="primary">Open nav</sm-button>
          </div>
        `,
      }

      // ACT
      render(
        ParentComponent,
        {
          global: {
            plugins: [createTestRouter()],
          },
        },
      )

      // ASSERT
      await waitFor(() => expect(screen.getByText('Park Hyatt Sydney')).toBeVisible())
    })

    it('should not show the title if prop is not provided', async () => {

      // ARRANGE
      const mockOpen = jest.fn()
      const mockClose = jest.fn()

      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockOpen,
            mockClose,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              @open="mockOpen"
              @close="mockClose"
            >
              <sm-nav-item label="Switch property" to="/test"/>
              <sm-nav-item label="Property settings" to="/test2"/>
            </sm-nav>
            <sm-button @click="navVisible = true" type="primary">Open nav</sm-button>
          </div>
        `,
      }

      // ACT
      render(
        ParentComponent,
        {
          global: {
            plugins: [createTestRouter()],
          },
        },
      )

      // ASSERT
      await waitFor(() => expect(screen.queryByText('Park Hyatt Sydney')).not.toBeInTheDocument())
    })
  })

  describe('slots', () => {
    it('should render the body slot', async () => {
      // ARRANGE
      const mockOpen = jest.fn()
      const mockClose = jest.fn()

      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockOpen,
            mockClose,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
              logo="logo.png"
              @open="mockOpen"
              @close="mockClose"
            >
              default slot contents
            </sm-nav>
          </div>
        `,
      }

      // ACT
      render(
        ParentComponent,
        {
          global: {
            plugins: [createTestRouter()],
          },
        },
      )

      // ASSERT
      await waitFor(() => expect(screen.getByText('default slot contents')).toBeVisible())
    })

    it('should render the vertical-nav content, subheader and footer slots', async () => {
      // ARRANGE
      const mockOpen = jest.fn()
      const mockClose = jest.fn()

      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockOpen,
            mockClose,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
              logo="logo.png"
              @open="mockOpen"
              @close="mockClose"
            >
              <template #subheader>
                subheader slot contents
              </template>

              <template #vertical-nav>
                vertical-nav slot contents
              </template>

              <template #footer>
                footer slot contents
              </template>
            </sm-nav>
          </div>
        `,
      }

      // ACT
      render(
        ParentComponent,
        {
          global: {
            plugins: [createTestRouter()],
          },
        },
      )

      // ASSERT
      await waitFor(() => expect(screen.getByText('subheader slot contents')).toBeVisible())
      expect(screen.getByText('vertical-nav slot contents')).toBeVisible()
      expect(screen.getByText('footer slot contents')).toBeVisible()
    })
  })
})
