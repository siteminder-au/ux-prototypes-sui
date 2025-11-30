import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { ref } from 'vue'
import SmPropertyMenu from './sm-property-menu.vue'

describe('SmPropertyMenu', () => {

  describe('props', () => {

    describe('propertyName', () => {

      it('should display the provided propertyName', () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmPropertyMenu },
          template: `
            <sm-property-menu property-name="Test hotel">
            </sm-property-menu>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        expect(screen.getByText('Test hotel')).toBeVisible()
      })
    })

  })

  describe('events', () => {

    it('should toggle dropdown visibility when clicked', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmPropertyMenu },
        template: `
        <sm-property-menu property-name="Test hotel">
          <template #default>
            Dropdown content
          </template>
        </sm-property-menu>
      `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.getByText('Test hotel')).toBeVisible()
      expect(screen.queryByText('Dropdown content')).not.toBeVisible()

      const buttonContainer = screen.getByRole('button', { name: 'Click to open menu' })
      await userEvent.click(buttonContainer)
      expect(screen.getByText('Dropdown content')).toBeVisible()

      const closeContainer = screen.getByRole('button', { name: 'Click to close menu' })
      await userEvent.click(closeContainer)
      expect(screen.queryByText('Dropdown content')).not.toBeVisible()
    })

    it('should programmatically open the dropdown', async () => {
      // ARRANGE
      const clickMock = jest.fn()
      const ParentComponent = {
        components: { SmPropertyMenu },

        setup: () => {
          const isOpen = ref(false)

          clickMock.mockImplementation(() => {
            isOpen.value = true
          })

          return { clickMock }
        },

        template: `
         <sm-property-menu property-name="Test hotel" @click="clickMock">
           <template #default>
             Dropdown content
           </template>
         </sm-property-menu>
       `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.getByText('Test hotel')).toBeVisible()
      expect(screen.queryByText('Dropdown content')).not.toBeVisible()

      const openButtonContainer = screen.getByRole('button', { name: 'Click to open menu' })
      await userEvent.click(openButtonContainer)
      await waitFor(() => expect(expect(screen.getByText('Dropdown content')).toBeVisible()))
      const closeButtonContainer = screen.getByRole('button', { name: 'Click to close menu' })
      await waitFor(() => expect(closeButtonContainer).toBeVisible())

      expect(clickMock).toHaveBeenCalledTimes(1)
    })

  })

  it('should correctly show/hide the menu on click', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmPropertyMenu },
      template: `
        <div>
          <h1>Sample header</h1>
          <sm-property-menu property-name="Test hotel">
            Property menu content
          </sm-property-menu>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const propertyMenu = screen.getByRole('button', { name: 'Click to open menu' })
    await waitFor(() => expect(propertyMenu).toBeVisible())
    expect(screen.getByText('Property menu content')).not.toBeVisible()

    await userEvent.click(propertyMenu)
    await waitFor(() => expect(screen.getByText('Property menu content')).toBeVisible())

    await userEvent.click(screen.getByRole('heading', { name: 'Sample header' }))
    await waitFor(() => expect(screen.getByText('Property menu content')).not.toBeVisible())
  })

})
