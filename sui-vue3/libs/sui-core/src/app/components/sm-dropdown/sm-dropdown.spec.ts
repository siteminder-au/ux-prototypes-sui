import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import SmDropdown from './sm-dropdown.vue'

describe('SmDropdown', () => {

  describe('label', () => {

    it('should display the label', () => {

      // ARRANGE
      const ParentComponent = {
        components: { SmDropdown },
        template: `
          <sm-dropdown type="primary" label="label-content">
            Default slot
          </sm-dropdown>
      `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.getByText('label-content')).toBeVisible()
    })

  })

  describe('active label', () => {

    it('should display the active label', async () => {

      // ARRANGE
      const ParentComponent = {
        components: { SmDropdown },
        template: `
          <sm-dropdown type="primary" label="Dropdown" active-label="active-label-content">
            Default slot
          </sm-dropdown>
      `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const dropdownButton = screen.getByRole('button', { name: 'Dropdown' })
      await userEvent.click(dropdownButton)
      await waitFor(() => expect(screen.getByText('active-label-content')).toBeVisible())
    })

  })

  describe('square', () => {

    it('should apply the square shape to the button when the square prop is true', async () => {

      // ARRANGE
      const ParentComponent = {
        components: { SmDropdown },
        template: `
          <sm-dropdown type="primary" label="Dropdown" active-label="active-label-content" :square="true">
            Default slot
          </sm-dropdown>
      `,
      }

      // ACT
      const { container } = render(ParentComponent)

      // ASSERT
      // We have to use query by class name to make the test consistent while vue3 migration
      // However, Visual testing can be avoided in the VTL if you are writing the test cases from scratch
      // For the visual testing use another tool like Percy
      expect(container.querySelector('.sm-button--shape_square')).toBeVisible()
    })

  })

  describe('disabled', () => {

    it('should be disabled when the disabled prop is true', async () => {

      // ARRANGE
      const ParentComponent = {
        components: { SmDropdown },
        template: `
          <sm-dropdown type="primary" label="Dropdown" :disabled="true">
            Default slot
          </sm-dropdown>
      `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('button', { name: 'Dropdown' })).toBeDisabled())
    })

    it('should not be disabled when the disabled prop is false', async () => {

      // ARRANGE
      const ParentComponent = {
        components: { SmDropdown },
        template: `
        <sm-dropdown type="primary" label="Dropdown" :disabled="false">
          Default slot
        </sm-dropdown>
    `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('button', { name: 'Dropdown' })).toBeEnabled())
    })

  })

  describe('toggling visibility', () => {

    it('Should change the visibility by calling the toggle method', async () => {
      const open = jest.fn()
      const close = jest.fn()
      // ARRANGE
      const ParentComponent = {
        components: { SmDropdown },
        setup: () => {
          open.mockImplementation(() => {

          })

          close.mockImplementation(() => {

          })
          return { open, close }
        },
        template: `
          <sm-dropdown type="primary" label="Dropdown" :disabled="false" @open="open" @close="close">
            Default slot
          </sm-dropdown>
      `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const button = screen.getByRole('button', { name: 'Dropdown' })
      await userEvent.click(button)
      await waitFor(() => expect(open).toHaveBeenCalledTimes(1))
      expect(screen.getByText('Default slot')).toBeVisible()

      await userEvent.click(button)
      // The close emit has been called two times here
      // First, with the default visibility set to false
      // Second, on toggle function
      await waitFor(() => expect(close).toHaveBeenCalledTimes(2))
      expect(screen.queryByText('Default text')).not.toBeInTheDocument()
    })

    it('should be visible when clicked', async () => {

      // ARRANGE
      const ParentComponent = {
        components: { SmDropdown },
        template: `
          <sm-dropdown type="primary" label="Dropdown" :disabled="false">
            Default text
          </sm-dropdown>
      `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const button = screen.getByRole('button', { name: 'Dropdown' })
      await userEvent.click(button)
      expect(screen.getByText('Default text')).toBeVisible()
    })

  })

})
