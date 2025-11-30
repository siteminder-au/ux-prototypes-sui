import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { ref } from 'vue'
import userEvent from '@testing-library/user-event'
import { createTestRouter } from '../../../../test/utils'

import SmNav from './sm-nav.vue'
import SmNavItem from './sm-nav-item.vue'
import SmButton from '../sm-button/sm-button.vue'

describe('SmNavItem', () => {
  describe('props', () => {
    it('should display the default button with provided label', async () => {
      // ARRANGE
      const mockItemClick = jest.fn()
      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockItemClick,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
            >
              <sm-nav-item label="Item 1" @click="mockItemClick"/>
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
      expect(await screen.findByRole('menuitem', { name: 'Item 1' })).toBeVisible()
      expect(mockItemClick).toHaveBeenCalledTimes(0)

      await userEvent.click(screen.getByRole('menuitem', { name: 'Item 1' }))

      await waitFor(() => expect(mockItemClick).toHaveBeenCalledTimes(1))
    })

    it('should display the router with provided to path', async () => {
      // ARRANGE
      const mockItemClick = jest.fn()
      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockItemClick,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
            >
              <sm-nav-item label="Item 1" to="/test"/>
            </sm-nav>
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
      expect(await screen.findByRole('menuitem', { name: 'Item 1' })).toBeVisible()
      expect(testRouterSpy).toHaveBeenCalledTimes(0)

      await userEvent.click(screen.getByRole('menuitem', { name: 'Item 1' }))

      await waitFor(() => expect(testRouterSpy).toHaveBeenCalledTimes(1))
      expect(testRouterSpy).toHaveBeenCalledWith('/test')
    })

    it('should display the router with provided href path', async () => {
      // ARRANGE
      const mockItemClick = jest.fn()
      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockItemClick,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
            >
              <sm-nav-item
                label="Item 1"
                href="/path"
                target="_blank"
                @click="mockItemClick"
              />
            </sm-nav>
          </div>
        `,
      }

      const testRouter = createTestRouter()

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
      expect(await screen.findByRole('menuitem', { name: 'Item 1' })).toBeVisible()
      const menuItem = screen.getByRole('menuitem', { name: 'Item 1' })
      // we want to double check href attribute is attached to the menu item
      expect(menuItem).toHaveAttribute('href', '/path')
      expect(mockItemClick).toHaveBeenCalledTimes(0)

      await userEvent.click(menuItem)

      await waitFor(() => expect(mockItemClick).toHaveBeenCalledTimes(1))
    })

    it('should set the item as disabled', async () => {
      // ARRANGE
      const mockItemClick = jest.fn()
      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockItemClick,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
            >
              <sm-nav-item label="Item 1" @click="mockItemClick" :disabled="true"/>
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
      expect(await screen.findByRole('menuitem', { name: 'Item 1' })).toBeVisible()
      expect(mockItemClick).toHaveBeenCalledTimes(0)

      await userEvent.click(screen.getByRole('menuitem', { name: 'Item 1' }))

      await waitFor(() => expect(mockItemClick).toHaveBeenCalledTimes(0))
    })

    it('should set the item as disabled for Router Link', async () => {
      // ARRANGE
      const mockItemClick = jest.fn()
      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockItemClick,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
            >
              <sm-nav-item label="Item 1" to="/test" :disabled="true"/>
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
      expect(await screen.findByRole('menuitem', { name: 'Item 1' })).toBeVisible()
      expect(mockItemClick).toHaveBeenCalledTimes(0)

      await userEvent.click(screen.getByRole('menuitem', { name: 'Item 1' }))

      await waitFor(() => expect(mockItemClick).toHaveBeenCalledTimes(0))
    })
  })

  describe('slots', () => {
    it('should display the default slot', async () => {
      // ARRANGE
      const mockItemClick = jest.fn()
      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockItemClick,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
            >
              <sm-nav-item
                label="Item 1"
                title="Title 1"
                @click="mockItemClick"
              >
                test-default-slot
              </sm-nav-item>
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
      expect(await screen.findByRole('menuitem', { name: 'Item 1' })).toBeVisible()
      expect(screen.getByText('Title 1')).not.toBeVisible()
      expect(screen.getByText('test-default-slot')).not.toBeVisible()

      await userEvent.click(screen.getByRole('menuitem', { name: 'Item 1' }))

      expect(await screen.findByText('test-default-slot')).toBeVisible()
      expect(screen.getByText('Title 1')).toBeVisible()

      // click back
      await userEvent.click(screen.getByRole('button', { name: 'Click to go back' }))

      expect(await screen.findByRole('menuitem', { name: 'Item 1' })).toBeVisible()
      expect(screen.getByText('Title 1')).not.toBeVisible()
      expect(screen.getByText('test-default-slot')).not.toBeVisible()
    })

    it('should display the title slot', async () => {
      // ARRANGE
      const mockItemClick = jest.fn()
      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockItemClick,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
            >
              <sm-nav-item
                label="Item 1"
                @click="mockItemClick"
              >
                <template #title>
                  test-title-slot
                </template>

                test-default-slot
              </sm-nav-item>
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
      expect(await screen.findByRole('menuitem', { name: 'Item 1' })).toBeVisible()

      await userEvent.click(screen.getByRole('menuitem', { name: 'Item 1' }))

      expect(await screen.findByText('test-default-slot')).toBeVisible()
      expect(screen.getByText('test-title-slot')).toBeVisible()

      // click close
      await userEvent.click(screen.getByRole('button', { name: 'Click to close navigation bar' }))

      await waitFor(() => expect(screen.queryByRole('navigation')).not.toBeInTheDocument())
      expect(screen.queryByRole('menuitem', { name: 'Item 1' })).not.toBeInTheDocument()
      expect(screen.queryByText('Title 1')).not.toBeInTheDocument()
    })

    it('should display the popover-content slot', async () => {
      // ARRANGE
      const mockItemClick = jest.fn()
      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockItemClick,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
            >
              <sm-nav-item
                label="Item 1"
                :is-popover="true"
                :disabled="true"
                @click="mockItemClick"
              >
                <template #popover-content>
                  test-popover-content-slot
                </template>
              </sm-nav-item>
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
      const navItemElement = await screen.findByRole('button', { name: 'Item 1' })
      expect(navItemElement).toBeVisible()
      expect(navItemElement).toBeDisabled()
      expect(screen.queryByText('test-popover-content-slot')).not.toBeInTheDocument()

      // We use fireEvent to let the event bubble to the popover target
      await fireEvent.click(navItemElement)

      expect(await screen.findByText('test-popover-content-slot')).toBeVisible()

      await fireEvent.click(navItemElement)

      await waitFor(() => expect(screen.queryByText('test-popover-content-slot')).not.toBeInTheDocument())
    })

    it('should display the suffix-icon slot', async () => {
      // ARRANGE
      const mockItemClick = jest.fn()
      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockItemClick,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
            >
              <sm-nav-item
                label="Item 1"
                href="/test"
              >
                <template v-slot:suffix-icon>
                  testSuffixIconSlot
                </template>
              </sm-nav-item>
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
      expect(await screen.findByText('Item 1')).toBeVisible()
      expect(screen.getByText('testSuffixIconSlot')).toBeVisible()

    })

    it('should display the prefix-icon slot', async () => {
      // ARRANGE
      const mockItemClick = jest.fn()
      const ParentComponent = {
        components: { SmNav, SmNavItem, SmButton },
        setup: () => {
          const navVisible = ref(true)
          return {
            navVisible,
            mockItemClick,
          }
        },
        template: `
          <div>
            <sm-nav
              v-model:visible="navVisible"
              title="Park Hyatt Sydney"
            >
              <sm-nav-item
                label="Item 1"
                href="/test"
              >
                <template v-slot:prefix-icon>
                  testPrefixIconSlot
                </template>
              </sm-nav-item>
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
      expect(await screen.findByText('Item 1')).toBeVisible()
      expect(screen.getByText('testPrefixIconSlot')).toBeVisible()
    })

  })
})

describe('slots wtih router link', () => {

  it('should display the default slot', async () => {
    // ARRANGE
    const mockItemClick = jest.fn()
    const ParentComponent = {
      components: { SmNav, SmNavItem, SmButton },
      setup: () => {
        const navVisible = ref(true)
        return {
          navVisible,
          mockItemClick,
        }
      },
      template: `
        <div>
          <sm-nav
            v-model:visible="navVisible"
            title="Park Hyatt Sydney"
          >
            <sm-nav-item
              label="Item 1"
              title="Title 1"
              to="/test"
            >
              test-default-slot
            </sm-nav-item>
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
    expect(await screen.findByRole('menuitem', { name: 'Item 1' })).toBeVisible()
    expect(screen.getByText('Title 1')).not.toBeVisible()
    expect(screen.getByText('test-default-slot')).not.toBeVisible()

    await userEvent.click(screen.getByRole('menuitem', { name: 'Item 1' }))

    expect(await screen.findByText('test-default-slot')).toBeVisible()
    expect(screen.getByText('Title 1')).toBeVisible()

    // click back
    await userEvent.click(screen.getByRole('button', { name: 'Click to go back' }))
    expect(await screen.findByRole('menuitem', { name: 'Item 1' })).toBeVisible()
    expect(screen.getByText('Title 1')).not.toBeVisible()
    expect(screen.getByText('test-default-slot')).not.toBeVisible()
  })

  it('should display the title slot', async () => {
    // ARRANGE
    const mockItemClick = jest.fn()
    const ParentComponent = {
      components: { SmNav, SmNavItem, SmButton },
      setup: () => {
        const navVisible = ref(true)
        return {
          navVisible,
          mockItemClick,
        }
      },
      template: `
        <div>
          <sm-nav
            v-model:visible="navVisible"
            title="Park Hyatt Sydney"
          >
            <sm-nav-item
              label="Item 1"
              to="/test"
            >
              <template #title>
                test-title-slot
              </template>

              test-default-slot
            </sm-nav-item>
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
    expect(await screen.findByRole('menuitem', { name: 'Item 1' })).toBeVisible()

    await userEvent.click(screen.getByRole('menuitem', { name: 'Item 1' }))

    expect(await screen.findByText('test-default-slot')).toBeVisible()
    expect(screen.getByText('test-title-slot')).toBeVisible()

    // click close
    await userEvent.click(screen.getByRole('button', { name: 'Click to close navigation bar' }))

    await waitFor(() => expect(screen.queryByRole('navigation')).not.toBeInTheDocument())
    expect(screen.queryByRole('menuitem', { name: 'Item 1' })).not.toBeInTheDocument()
    expect(screen.queryByText('Title 1')).not.toBeInTheDocument()
  })

  it('should display the popover-content slot', async () => {
    // ARRANGE
    const mockItemClick = jest.fn()
    const ParentComponent = {
      components: { SmNav, SmNavItem, SmButton },
      setup: () => {
        const navVisible = ref(true)
        return {
          navVisible,
          mockItemClick,
        }
      },
      template: `
        <div>
          <sm-nav
            v-model:visible="navVisible"
            title="Park Hyatt Sydney"
          >
            <sm-nav-item
              label="Item 1"
              :is-popover="true"
              :disabled="true"
              to="/test"
            >
              <template #popover-content>
                test-popover-content-slot
              </template>
            </sm-nav-item>
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
    const navItemElement = await screen.findByRole('button', { name: 'Item 1' })
    expect(navItemElement).toBeVisible()
    expect(navItemElement).toBeDisabled()
    expect(screen.queryByText('test-popover-content-slot')).not.toBeInTheDocument()

    // We use fireEvent to let the event bubble to the popover target
    await fireEvent.click(navItemElement)

    expect(await screen.findByText('test-popover-content-slot')).toBeVisible()

    await fireEvent.click(navItemElement)

    await waitFor(() => expect(screen.queryByText('test-popover-content-slot')).not.toBeInTheDocument())
  })

  it('should display the suffix-icon slot', async () => {
    // ARRANGE
    const mockItemClick = jest.fn()
    const ParentComponent = {
      components: { SmNav, SmNavItem, SmButton },
      setup: () => {
        const navVisible = ref(true)
        return {
          navVisible,
          mockItemClick,
        }
      },
      template: `
        <div>
          <sm-nav
            v-model:visible="navVisible"
            title="Park Hyatt Sydney"
          >
            <sm-nav-item
              label="Item 1"
              to="/test"
            >
              <template v-slot:suffix-icon>
                testSuffixIconSlot
              </template>
            </sm-nav-item>
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
    expect(await screen.findByText('Item 1')).toBeVisible()
    expect(screen.getByText('testSuffixIconSlot')).toBeVisible()

  })

  it('should display the prefix-icon slot', async () => {
    // ARRANGE
    const mockItemClick = jest.fn()
    const ParentComponent = {
      components: { SmNav, SmNavItem, SmButton },
      setup: () => {
        const navVisible = ref(true)
        return {
          navVisible,
          mockItemClick,
        }
      },
      template: `
        <div>
          <sm-nav
            v-model:visible="navVisible"
            title="Park Hyatt Sydney"
          >
            <sm-nav-item
              label="Item 1"
              to="/test"
            >
              <template v-slot:prefix-icon>
                testPrefixIconSlot
              </template>
            </sm-nav-item>
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
    expect(await screen.findByText('Item 1')).toBeVisible()
    expect(screen.getByText('testPrefixIconSlot')).toBeVisible()

  })

})
