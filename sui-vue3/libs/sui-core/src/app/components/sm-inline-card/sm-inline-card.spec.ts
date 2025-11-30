import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { ref } from 'vue'
import SmInlineCard from './sm-inline-card.vue'

describe('SmInlineCard', () => {

  describe('props', () => {

    describe('showClose', () => {

      it('should display the close button', async () => {
        // ARRANGE
        const closeMock = jest.fn()
        const ParentComponent = {
          components: { SmInlineCard },
          setup: () => {
            const isVisible = ref(true)

            closeMock.mockImplementation(() => {
              isVisible.value = false // Functionality to close the inline card
            })

            return { closeMock, isVisible }
          },
          template: `
            <sm-inline-card v-if="isVisible" title="Title here" message="Body text" type="info" :show-close="true" @close="closeMock">
            </sm-inline-card>
        `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        const closeButton = screen.getByRole('button', { name: 'Click to close' })
        expect(closeButton).toBeVisible()
        expect(closeMock).toHaveBeenCalledTimes(0)

        await userEvent.click(closeButton)
        expect(closeMock).toHaveBeenCalledTimes(1)
        expect(screen.queryByRole('button', { name: 'Click to close' })).not.toBeInTheDocument()
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      })

    })

    describe('title and message', () => {

      it('should display the appropriate elements', () => {
        const ParentComponent = {
          components: { SmInlineCard },
          template: `
            <sm-inline-card title="Title prop" message="Message prop">
            </sm-inline-card>
        `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        expect(screen.getByRole('alert')).toBeVisible()
        expect(screen.getByRole('heading', { level: 4, name: 'Title prop' })).toBeVisible()
        expect(screen.getByText('Message prop')).toBeVisible()
      })

    })

  })

  describe('slots', () => {

    it('should display the default slot', () => {
      const ParentComponent = {
        components: { SmInlineCard },
        template: `
          <sm-inline-card title="Title prop" message="Message prop">
            Default slot
          </sm-inline-card>
      `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.getByRole('alert')).toBeVisible()
      // Default slot will replace the title and message props
      expect(screen.queryByRole('heading', { level: 4, name: 'Title prop' })).not.toBeInTheDocument()
      expect(screen.queryByRole('Message prop')).not.toBeInTheDocument()

      // Default slot visibility assertion
      expect(screen.getByText('Default slot')).toBeVisible()
    })

    it('should display the action slot', () => {
      const ParentComponent = {
        components: { SmInlineCard },
        template: `
          <sm-inline-card title="Title prop" message="Message prop">
            <template #action>
              Action slot
            </template>
          </sm-inline-card>
      `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.getByRole('alert')).toBeVisible()
      expect(screen.getByRole('heading', { level: 4, name: 'Title prop' })).toBeVisible()
      expect(screen.getByText('Message prop')).toBeVisible()

      // Action slot visibility assertion
      expect(screen.getByText('Action slot')).toBeVisible()
    })

    it('should display the body slot', () => {
      const ParentComponent = {
        components: { SmInlineCard },
        template: `
          <sm-inline-card title="Title prop" message="Message prop">
            <template #body>
              Body slot
            </template>
          </sm-inline-card>
      `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.getByRole('heading', { level: 4, name: 'Title prop' })).toBeVisible()
      expect(screen.getByText('Message prop')).toBeVisible()

      // Body slot visibility assertion
      expect(screen.getByText('Body slot')).toBeVisible()

    })

    it('should display the footer slot', () => {
      const ParentComponent = {
        components: { SmInlineCard },
        template: `
          <sm-inline-card title="Title prop" message="Message prop">
            <template #footer>
              Footer slot
            </template>
          </sm-inline-card>
      `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.getByRole('heading', { level: 4, name: 'Title prop' })).toBeVisible()
      expect(screen.getByText('Message prop')).toBeVisible()

      // Footer slot visibility assertion
      expect(screen.getByText('Footer slot')).toBeVisible()
    })

  })
})
