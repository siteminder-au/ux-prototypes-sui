import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { ref } from 'vue'
import { createTestRouter } from '../../../../test/utils'

import SmAppHeader from './sm-app-header.vue'
import SmAppHeaderLink from './sm-app-header-link.vue'

describe('SmAppHeader', () => {
  describe('props', () => {
    describe('logo', () => {
      it('should not show logo when prop is not provided', async () => {
        // ARRANGE
        const mockClickHandler = jest.fn()
        const ParentComponent = {
          components: { SmAppHeader, SmAppHeaderLink },
          setup: () => {
            return {
              mockClickHandler,
            }
          },
          template: `
            <sm-app-header page-title="SiteMinder">
              <template #help>
                <sm-app-header-link href="#" aria-label="Go to support">
                  <template #icon>
                    <sm-icon name="utility-information"/>
                  </template>
                </sm-app-header-link>
              </template>
            </sm-app-header>
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
        await waitFor(() => expect(screen.getByText('SiteMinder')).toBeVisible())
        const linkButton = screen.getByRole('link', { name: 'Go to support' })
        expect(linkButton).toBeVisible()
        // we should get only one `img` element
        expect(screen.getByRole('img')).toHaveAttribute('name', 'utility-information')
      })

      it('should show default logo when prop is provided', async () => {
        // ARRANGE
        const mockClickHandler = jest.fn()
        const ParentComponent = {
          components: { SmAppHeader, SmAppHeaderLink },
          setup: () => {
            return {
              mockClickHandler,
            }
          },
          template: `
            <sm-app-header
              page-title="SiteMinder"
              partner-name="PartnerName"
              logo="logo.png"
              logo-link="example.com"
            >
              <template #help>
                <sm-app-header-link href="#" aria-label="Go to support">
                  <template #icon>
                    <sm-icon name="utility-information"/>
                  </template>
                </sm-app-header-link>
              </template>
            </sm-app-header>
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
        await waitFor(() => expect(screen.getByText('SiteMinder')).toBeVisible())
        expect(screen.getAllByRole('link')).toHaveLength(2)
        const partnerLinkElement = screen.getByRole('link', { name: 'PartnerName' })
        expect(partnerLinkElement).toBeVisible()
        expect(partnerLinkElement).toHaveAttribute('href', 'example.com')
        expect(screen.getByRole('link', { name: 'Go to support' })).toBeVisible()

        expect(screen.getAllByRole('img')).toHaveLength(2)
        const partnerLogoElement = screen.getByRole('img', { name: 'PartnerName' })
        expect(partnerLogoElement).toBeVisible()
        expect(partnerLogoElement).toHaveAttribute('src', 'logo.png')
        expect(screen.getAllByRole('img')[1]).toHaveAttribute('name', 'utility-information')
      })

      it('should show tablet logo when prop is provided', async () => {
        // ARRANGE
        const mockClickHandler = jest.fn()
        const ParentComponent = {
          components: { SmAppHeader, SmAppHeaderLink },
          setup: () => {
            return {
              mockClickHandler,
            }
          },
          template: `
            <sm-app-header
              page-title="SiteMinder"
              partner-name="PartnerName"
              logo-tablet="logo.png"
              logo-link="example.com"
            >
              <template #help>
                <sm-app-header-link href="#" aria-label="Go to support">
                  <template #icon>
                    <sm-icon name="utility-information"/>
                  </template>
                </sm-app-header-link>
              </template>
            </sm-app-header>
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
        await waitFor(() => expect(screen.getByText('SiteMinder')).toBeVisible())
        expect(screen.getAllByRole('link')).toHaveLength(2)
        const partnerLinkElement = screen.getByRole('link', { name: 'PartnerName' })
        expect(partnerLinkElement).toBeVisible()
        expect(partnerLinkElement).toHaveAttribute('href', 'example.com')
        expect(screen.getByRole('link', { name: 'Go to support' })).toBeVisible()

        expect(screen.getAllByRole('img')).toHaveLength(2)
        const partnerLogoElement = screen.getByRole('img', { name: 'PartnerName' })
        expect(partnerLogoElement).toBeVisible()
        expect(partnerLogoElement).toHaveAttribute('src', 'logo.png')
        expect(screen.getAllByRole('img')[1]).toHaveAttribute('name', 'utility-information')
      })

      it('should load default and tablet logos when props are provided', async () => {
        // ARRANGE
        const mockClickHandler = jest.fn()
        const ParentComponent = {
          components: { SmAppHeader, SmAppHeaderLink },
          setup: () => {
            return {
              mockClickHandler,
            }
          },
          template: `
            <sm-app-header
              page-title="SiteMinder"
              partner-name="PartnerName"
              logo="logo.png"
              logo-tablet="logo-compact.png"
              logo-link="example.com"
            >
              <template #help>
                <sm-app-header-link href="#" aria-label="Go to support">
                  <template #icon>
                    <sm-icon name="utility-information"/>
                  </template>
                </sm-app-header-link>
              </template>
            </sm-app-header>
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
        await waitFor(() => expect(screen.getByText('SiteMinder')).toBeVisible())
        expect(screen.getAllByRole('link')).toHaveLength(3)
        const partnerLinkElements = screen.getAllByRole('link', { name: 'PartnerName' })
        expect(partnerLinkElements[0]).toBeVisible()
        expect(partnerLinkElements[0]).toHaveAttribute('href', 'example.com')
        expect(partnerLinkElements[1]).toBeVisible()
        expect(partnerLinkElements[1]).toHaveAttribute('href', 'example.com')
        expect(screen.getByRole('link', { name: 'Go to support' })).toBeVisible()

        expect(screen.getAllByRole('img')).toHaveLength(3)
        const partnerLogoElements = screen.getAllByRole('img', { name: 'PartnerName' })
        expect(partnerLogoElements).toHaveLength(2)
        expect(partnerLogoElements[0]).toBeVisible()
        expect(partnerLogoElements[0]).toHaveAttribute('src', 'logo-compact.png')
        expect(partnerLogoElements[1]).toBeVisible()
        expect(partnerLogoElements[1]).toHaveAttribute('src', 'logo.png')
        expect(screen.getAllByRole('img')[2]).toHaveAttribute('name', 'utility-information')
      })
    })

    describe('hideLogoTablet', () => {
      it('should not show default logo when prop is provided', async () => {
        // ARRANGE
        const mockClickHandler = jest.fn()
        const ParentComponent = {
          components: { SmAppHeader, SmAppHeaderLink },
          setup: () => {
            return {
              mockClickHandler,
            }
          },
          template: `
            <sm-app-header
              page-title="SiteMinder"
              partner-name="PartnerName"
              logo="logo.png"
              logo-link="example.com"
              :hide-logo-tablet="true"
            >
              <template #help>
                <sm-app-header-link href="#" aria-label="Go to support">
                  <template #icon>
                    <sm-icon name="utility-information"/>
                  </template>
                </sm-app-header-link>
              </template>
            </sm-app-header>
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
        await waitFor(() => expect(screen.getByText('SiteMinder')).toBeVisible())
        const partnerFigureElement = screen.getByRole('figure', { name: 'PartnerName' })
        expect(partnerFigureElement).toBeVisible()
        // css not available in VTL test, but we should assert that the class is applied
        // which represents that it becomes hidden on tablet viewport
        expect(partnerFigureElement).toHaveClass('sm-app-header__logo--hide-on-tablet')
      })

      it('should not show tablet logo when prop is provided', async () => {
        // ARRANGE
        const mockClickHandler = jest.fn()
        const ParentComponent = {
          components: { SmAppHeader, SmAppHeaderLink },
          setup: () => {
            return {
              mockClickHandler,
            }
          },
          template: `
            <sm-app-header
              page-title="SiteMinder"
              partner-name="PartnerName"
              logo-tablet="logo.png"
              logo-link="example.com"
              :hide-logo-tablet="true"
            >
              <template #help>
                <sm-app-header-link href="#" aria-label="Go to support">
                  <template #icon>
                    <sm-icon name="utility-information"/>
                  </template>
                </sm-app-header-link>
              </template>
            </sm-app-header>
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
        await waitFor(() => expect(screen.getByText('SiteMinder')).toBeVisible())
        const partnerFigureElement = screen.getByRole('figure', { name: 'PartnerName' })
        expect(partnerFigureElement).toBeVisible()
        // css not available in VTL test, but we should assert that the class is applied
        // which represents that it becomes hidden on tablet viewport
        expect(partnerFigureElement).toHaveClass('sm-app-header__logo--hide-on-tablet')
        expect(partnerFigureElement).toHaveClass('sm-app-header__logo--tablet')
      })
    })

    describe('pageSubtitle', () => {
      it('should display subtitle when prop is provided', async () => {
        // ARRANGE
        const mockClickHandler = jest.fn()
        const ParentComponent = {
          components: { SmAppHeader, SmAppHeaderLink },
          setup: () => {
            return {
              mockClickHandler,
            }
          },
          template: `
            <sm-app-header
              page-title="Title"
              page-subtitle="Subtitle"
              partner-name="PartnerName"
              logo="logo.png"
              logo-link="example.com"
              title-link="title-link.com"
            >
              <template #help>
                <sm-app-header-link href="#" aria-label="Go to support">
                  <template #icon>
                    <sm-icon name="utility-information"/>
                  </template>
                </sm-app-header-link>
              </template>
            </sm-app-header>
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
        await waitFor(() => expect(screen.getByRole('link', { name: 'Title Subtitle' })).toBeVisible())
        expect(screen.getByRole('link', { name: 'Title Subtitle' })).toHaveAttribute('href', 'title-link.com')
      })
    })

    describe('isTablet', () => {
      it('should not add tablet styles when prop is false', async () => {
        // ARRANGE
        const mockClickHandler = jest.fn()
        const ParentComponent = {
          components: { SmAppHeader, SmAppHeaderLink },
          setup: () => {
            return {
              mockClickHandler,
            }
          },
          template: `
            <sm-app-header
              page-title="Title"
              page-subtitle="Subtitle"
              partner-name="PartnerName"
              logo="logo.png"
              logo-link="example.com"
              title-link="title-link.com"
              :is-tablet="false"
            >
              <template #help>
                <sm-app-header-link href="#" aria-label="Go to support">
                  <template #icon>
                    <sm-icon name="utility-information"/>
                  </template>
                </sm-app-header-link>
              </template>
            </sm-app-header>
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
        await waitFor(() => expect(screen.getByRole('link', { name: 'Title Subtitle' })).toBeVisible())
        // the absence of this button implies tablet mode is switched off
        expect(screen.queryByRole('button', { name: 'Click to show the navigation bar' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Click to hide the navigation bar' })).not.toBeInTheDocument()
      })

      it('should add tablet styles when prop is true', async () => {
        // ARRANGE
        const navVisible = ref(false)
        const mockClickHandler = (): void => {
          navVisible.value = !navVisible.value
        }
        const ParentComponent = {
          components: { SmAppHeader, SmAppHeaderLink },
          setup: () => {
            return {
              mockClickHandler,
              navVisible,
            }
          },
          template: `
            <sm-app-header
              page-title="Title"
              page-subtitle="Subtitle"
              partner-name="PartnerName"
              logo="logo.png"
              logo-link="example.com"
              title-link="title-link.com"
              :is-tablet="true"
              :nav-visible="navVisible"
              @click="mockClickHandler"
            >
              <template #help>
                <sm-app-header-link href="#" aria-label="Go to support">
                  <template #icon>
                    <sm-icon name="utility-information"/>
                  </template>
                </sm-app-header-link>
              </template>
            </sm-app-header>
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
        await waitFor(() => expect(screen.getByRole('link', { name: 'Title Subtitle' })).toBeVisible())
        // the existence of this button implies tablet mode is switched on
        const showActionMenuButton = screen.getByRole('button', { name: 'Click to show the navigation bar' })
        expect(showActionMenuButton).toBeVisible()
        await userEvent.click(showActionMenuButton)

        const hideActionMenuButton = screen.getByRole('button', { name: 'Click to hide the navigation bar' })
        expect(hideActionMenuButton).toBeVisible()
        await userEvent.click(hideActionMenuButton)

        await waitFor(() => expect(showActionMenuButton).toBeVisible())
      })
    })
  })

  describe('slots', () => {
    it('should render the property-menu slot', async () => {
      // ARRANGE
      const mockClickHandler = jest.fn()
      const ParentComponent = {
        components: { SmAppHeader, SmAppHeaderLink },
        setup: () => {
          return {
            mockClickHandler,
          }
        },
        template: `
          <sm-app-header
            page-title="SiteMinder"
            partner-name="PartnerName"
            logo="logo.png"
            logo-link="example.com"
          >
            <template #help>
              <sm-app-header-link href="#" aria-label="Go to support">
                <template #icon>
                  <sm-icon name="utility-information"/>
                </template>
              </sm-app-header-link>
            </template>

            <template #property-menu>
              test-property-menu
            </template>
          </sm-app-header>
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
      await waitFor(() => expect(screen.getByText('SiteMinder')).toBeVisible())
      expect(screen.getByText('test-property-menu')).toBeVisible()
    })

    it('should render the help slot', async () => {
      // ARRANGE
      const mockClickHandler = jest.fn()
      const ParentComponent = {
        components: { SmAppHeader, SmAppHeaderLink },
        setup: () => {
          return {
            mockClickHandler,
          }
        },
        template: `
          <sm-app-header
            page-title="SiteMinder"
            partner-name="PartnerName"
            logo="logo.png"
            logo-link="example.com"
          >
            <template #help>
              test-help
            </template>
          </sm-app-header>
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
      await waitFor(() => expect(screen.getByText('SiteMinder')).toBeVisible())
      expect(screen.getByText('test-help')).toBeVisible()
    })

    it('should render the notification slot', async () => {
      // ARRANGE
      const mockClickHandler = jest.fn()
      const ParentComponent = {
        components: { SmAppHeader, SmAppHeaderLink },
        setup: () => {
          return {
            mockClickHandler,
          }
        },
        template: `
          <sm-app-header
            page-title="SiteMinder"
            partner-name="PartnerName"
            logo="logo.png"
            logo-link="example.com"
          >
            <template #notification>
              test-notification
            </template>
          </sm-app-header>
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
      await waitFor(() => expect(screen.getByText('SiteMinder')).toBeVisible())
      expect(screen.getByText('test-notification')).toBeVisible()
    })

    it('should render the user-menu slot', async () => {
      // ARRANGE
      const mockClickHandler = jest.fn()
      const ParentComponent = {
        components: { SmAppHeader, SmAppHeaderLink },
        setup: () => {
          return {
            mockClickHandler,
          }
        },
        template: `
          <sm-app-header
            page-title="SiteMinder"
            partner-name="PartnerName"
            logo="logo.png"
            logo-link="example.com"
          >
            <template #user-menu>
              test-user-menu
            </template>
          </sm-app-header>
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
      await waitFor(() => expect(screen.getByText('SiteMinder')).toBeVisible())
      expect(screen.getByText('test-user-menu')).toBeVisible()
    })

    it('should render the nav slot', async () => {
      // ARRANGE
      const mockClickHandler = jest.fn()
      const ParentComponent = {
        components: { SmAppHeader, SmAppHeaderLink },
        setup: () => {
          return {
            mockClickHandler,
          }
        },
        template: `
          <sm-app-header
            page-title="SiteMinder"
            partner-name="PartnerName"
            logo="logo.png"
            logo-link="example.com"
          >
            <template #nav>
              test-nav
            </template>
          </sm-app-header>
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
      await waitFor(() => expect(screen.getByText('SiteMinder')).toBeVisible())
      expect(screen.getByText('test-nav')).toBeVisible()
    })

    it('should render the tablet-navigation slot', async () => {
      // ARRANGE
      const mockClickHandler = jest.fn()
      const ParentComponent = {
        components: { SmAppHeader, SmAppHeaderLink },
        setup: () => {
          return {
            mockClickHandler,
          }
        },
        template: `
          <sm-app-header
            page-title="SiteMinder"
            partner-name="PartnerName"
            logo="logo.png"
            logo-link="example.com"
          >
            <template #tablet-navigation>
              test-tablet-navigation
            </template>
          </sm-app-header>
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
      await waitFor(() => expect(screen.getByText('SiteMinder')).toBeVisible())
      expect(screen.getByText('test-tablet-navigation')).toBeVisible()
    })

    it('should render the app-switcher slot', async () => {
      // ARRANGE
      const mockClickHandler = jest.fn()
      const ParentComponent = {
        components: { SmAppHeader, SmAppHeaderLink },
        setup: () => {
          return {
            mockClickHandler,
          }
        },
        template: `
          <sm-app-header
            page-title="SiteMinder"
            partner-name="PartnerName"
            logo="logo.png"
            logo-link="example.com"
          >
            <template #app-switcher>
              test-app-switcher
            </template>
          </sm-app-header>
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
      await waitFor(() => expect(screen.getByText('SiteMinder')).toBeVisible())
      expect(screen.getByText('test-app-switcher')).toBeVisible()
    })

    it('should render the smart-guide slot', async () => {
      // ARRANGE
      const mockClickHandler = jest.fn()
      const ParentComponent = {
        components: { SmAppHeader, SmAppHeaderLink },
        setup: () => {
          return {
            mockClickHandler,
          }
        },
        template: `
          <sm-app-header
            page-title="SiteMinder"
            partner-name="PartnerName"
            logo="logo.png"
            logo-link="example.com"
          >
            <template #smart-guide>
              test-smart-guide
            </template>

            <template #property-menu>
              test-property-menu
            </template>
          </sm-app-header>
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
      await waitFor(() => expect(screen.getByText('SiteMinder')).toBeVisible())
      expect(screen.getByText('test-smart-guide')).toBeVisible()
      expect(screen.getByText('test-property-menu')).toBeVisible()
    })

    it('should render all the slots', async () => {
      // ARRANGE
      const mockClickHandler = jest.fn()
      const ParentComponent = {
        components: { SmAppHeader, SmAppHeaderLink },
        setup: () => {
          return {
            mockClickHandler,
          }
        },
        template: `
          <sm-app-header
            page-title="SiteMinder"
            partner-name="PartnerName"
            logo="logo.png"
            logo-link="example.com"
          >
            <template #smart-guide>
              test-smart-guide
            </template>

            <template #property-menu>
              test-property-menu
            </template>

            <template #app-switcher>
              test-app-switcher
            </template>

            <template #help>
              test-help
            </template>

            <template #notification>
              test-notification
            </template>

            <template #user-menu>
              test-user-menu
            </template>

            <template #nav>
              test-nav
            </template>

            <template #tablet-navigation>
              test-tablet-navigation
            </template>
          </sm-app-header>
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
      await waitFor(() => expect(screen.getByText('SiteMinder')).toBeVisible())
      expect(screen.getByText('test-smart-guide')).toBeVisible()
      expect(screen.getByText('test-property-menu')).toBeVisible()
      expect(screen.getByText('test-app-switcher')).toBeVisible()
      expect(screen.getByText('test-help')).toBeVisible()
      expect(screen.getByText('test-notification')).toBeVisible()
      expect(screen.getByText('test-user-menu')).toBeVisible()
      expect(screen.getByText('test-nav')).toBeVisible()
      expect(screen.getByText('test-tablet-navigation')).toBeVisible()
    })
  })
})
