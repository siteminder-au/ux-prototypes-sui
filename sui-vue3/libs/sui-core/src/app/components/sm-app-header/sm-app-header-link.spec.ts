import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { createTestRouter } from '../../../../test/utils'

import SmAppHeaderLink from './sm-app-header-link.vue'

describe('SmAppHeaderLink', () => {
  describe('No Vue Router dependency, meaning "to" is not passed', () => {
    it('should set the element as button if to or href is not provided', async () => {
      // ARRANGE
      const mockClickHandler = jest.fn()
      const ParentComponent = {
        components: { SmAppHeaderLink },
        setup: () => {
          return {
            mockClickHandler,
          }
        },
        template: `
          <sm-app-header-link aria-label="Go to support" @click="mockClickHandler"/>
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
      const linkButton = screen.getByRole('button', { name: 'Go to support' })
      await waitFor(() => expect(linkButton).toBeVisible())

      expect(mockClickHandler).toHaveBeenCalledTimes(0)
      await userEvent.click(linkButton)
      await waitFor(() => expect(mockClickHandler).toHaveBeenCalledTimes(1))
    })

    it('should set the element as link if href is provided', async () => {
      // ARRANGE
      const mockClickHandler = jest.fn()
      const ParentComponent = {
        components: { SmAppHeaderLink },
        setup: () => {
          return {
            mockClickHandler,
          }
        },
        template: `
          <sm-app-header-link
            aria-label="Go to support"
            href="www.google.com"
            target="_self"
            @click="mockClickHandler"
          />
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
      const linkButton = screen.getByRole('link', { name: 'Go to support' })
      await waitFor(() => expect(linkButton).toBeVisible())
      // we assert for attributes as jest does not support making changes to window
      // see: https://stackoverflow.com/questions/54090231/how-to-fix-error-not-implemented-navigation-except-hash-changes
      expect(linkButton).toHaveAttribute('href', 'www.google.com')
      expect(linkButton).toHaveAttribute('target', '_self')
    })

    it('should display the smart guide label', async () => {
      // ARRANGE
      const mockClickHandler = jest.fn()
      const ParentComponent = {
        components: { SmAppHeaderLink },
        setup: () => {
          return {
            mockClickHandler,
          }
        },
        template: `
          <sm-app-header-link
            aria-label="Smart guide"
            :is-smart-guide="true"
            smart-guide-label="Smart guide label test"
            @click="mockClickHandler"
          />
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
      const smartGuideButton = screen.getByRole('button', { name: 'Smart guide' })
      await waitFor(() => expect(smartGuideButton).toBeVisible())
      expect(screen.getByText('Smart guide label test')).toBeVisible()
      expect(mockClickHandler).toHaveBeenCalledTimes(0)

      await userEvent.click(smartGuideButton)

      expect(mockClickHandler).toHaveBeenCalledTimes(1)
    })
  })

  describe('With Vue Router', () => {
    it('should set the element as link if to is provided', async () => {
      // ARRANGE
      const mockClickHandler = jest.fn()
      const ParentComponent = {
        components: { SmAppHeaderLink },
        setup: () => {
          return {
            mockClickHandler,
          }
        },
        template: `
          <sm-app-header-link
            aria-label="Go to support"
            to="/some-path"
            target="_self"
            @click="mockClickHandler"
          />
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
      const linkButton = screen.getByRole('link', { name: 'Go to support' })
      await waitFor(() => expect(linkButton).toBeVisible())
      expect(mockClickHandler).toHaveBeenCalledTimes(0)
      expect(testRouterSpy).toHaveBeenCalledTimes(0)

      await userEvent.click(linkButton)

      await waitFor(() => expect(testRouterSpy).toHaveBeenCalledTimes(1))
      // NOTE: we need to set target = _self to
      // make sure push() of vue-router is called
      expect(testRouterSpy).toHaveBeenNthCalledWith(1, '/some-path')
    })
    it('should display the smart guide label', async () => {
      // ARRANGE
      const mockClickHandler = jest.fn()
      const ParentComponent = {
        components: { SmAppHeaderLink },
        setup: () => {
          return {
            mockClickHandler,
          }
        },
        template: `
          <sm-app-header-link
            aria-label="Smart guide"
            :is-smart-guide="true"
            smart-guide-label="Smart guide label test"
            to="/some-path"
            @click="mockClickHandler"
          />
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
      const smartGuideButton = screen.getByRole('link', { name: 'Smart guide' })
      await waitFor(() => expect(smartGuideButton).toBeVisible())
      expect(screen.getByText('Smart guide label test')).toBeVisible()
      expect(mockClickHandler).toHaveBeenCalledTimes(0)

    })
  })

  describe('slots', () => {
    it('should render the icon slot', async () => {
      // ARRANGE
      const mockClickHandler = jest.fn()
      const ParentComponent = {
        components: { SmAppHeaderLink },
        setup: () => {
          return {
            mockClickHandler,
          }
        },
        template: `
          <sm-app-header-link
            aria-label="Go to support"
            to="/some-path"
            target="_self"
            @click="mockClickHandler"
          >
            <template #icon>test-icon-slot</template>
          </sm-app-header-link>
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
      const linkButton = screen.getByRole('link', { name: 'Go to support' })
      await waitFor(() => expect(linkButton).toBeVisible())
      expect(screen.getByText('test-icon-slot')).toBeVisible()
    })
  })
})
