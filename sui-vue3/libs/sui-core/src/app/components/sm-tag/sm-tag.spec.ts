import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import SmTag from './sm-tag.vue'

describe('SmTag', () => {
  describe('props', () => {
    describe('closable', () => {
      it('should emit the close event when the close button is clicked', async () => {
        const onClose = jest.fn()

        // ARRANGE
        const ParentComponent = {
          components: { SmTag },
          setup: () => {
            return { onClose }
          },
          template: `
            <sm-tag closable @close="onClose">
              a sm tag
            </sm-tag>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await userEvent.click(screen.getByRole('button', { name: 'Remove' }))
        expect(onClose).toBeCalledTimes(1)
      })

      it('should show the close button if the closable prop is true', () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmTag },
          template: `
            <sm-tag closable>
              a sm tag
            </sm-tag>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        const closeButton = screen.getByRole('button', { name: 'Remove' })
        expect(closeButton).toBeInTheDocument()
        expect(closeButton).not.toHaveAttribute('tabindex')
      })

      it('should not show the close button if the closable prop is undefined', () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmTag },
          template: `
            <sm-tag>
              a sm tag
            </sm-tag>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()
      })
    })

    describe('disabled', () => {
      it('should apply disabled style and make close button disabled', () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmTag },
          template: `
            <sm-tag closable disabled>
              a sm tag
            </sm-tag>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        expect(screen.getByRole('button', { name: 'Remove' })).toBeDisabled()
      })
    })

    describe('tabindex', () => {
      it('should apply specified tabindex', () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmTag },
          template: `
            <sm-tag closable :tabindex="-1">
              a sm tag
            </sm-tag>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        expect(screen.getByRole('button', { name: 'Remove' })).toHaveAttribute('tabindex', '-1')
      })
    })
  })

  describe('slots', () => {
    it('should render the default slot content', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmTag },
        template: `
          <sm-tag>
            <template #default>
              default slot
            </template>
          </sm-tag>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.getByText('default slot')).toBeVisible()
    })
  })
})
