import { render, screen, waitFor } from '@testing-library/vue'
import { ref } from 'vue'
import userEvent from '@testing-library/user-event'
import SmDialog from './sm-dialog.vue'
import SmButton from '../sm-button/sm-button.vue'

describe('SmDialog', () => {

  describe('show / hide', () => {

    it('should hide when the visible prop is set to false', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmDialog },
        template: `
        <sm-dialog :visible="false" title="Title here">
          Default Slot
        </sm-dialog>
      `,
      }

      // ACT
      render(ParentComponent)
      // ASSERT
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()

    })

    it('should show when the visible prop is set to true', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmDialog },
        template: `
        <sm-dialog :visible="true" title="Title here">
          Default Slot
        </sm-dialog>
      `,
      }

      // ACT
      render(ParentComponent)
      // ASSERT
      expect(screen.getByRole('alertdialog')).toBeVisible()
    })

    it('should emit "open" when the dialog is shown', async () => {
      const open = jest.fn()
      // ARRANGE
      const ParentComponent = {
        components: { SmDialog, SmButton },
        setup: () => {
          const dialogVisible = ref(false)

          open.mockImplementation(() => {

          })

          return {
            dialogVisible,
            open,
          }
        },
        template: `
        <div>
          <sm-button @click="dialogVisible = true" type="primary" aria-label="open dialog">Open dialog</sm-button>
          <sm-dialog :visible.sync="dialogVisible" title="Title here" @open=open>
            Default Slot
          </sm-dialog>
        </div>
      `,
      }

      // ACT
      render(ParentComponent)
      // ASSERT
      await waitFor(() => expect(screen.getByRole('button', { name: 'open dialog' })).toBeVisible())
      const nextButton = screen.getByRole('button', { name: 'open dialog' })
      await userEvent.click(nextButton)
      await waitFor(() => expect(screen.getByRole('alertdialog')).toBeVisible())
      expect(open).toHaveBeenCalledTimes(1)
    })

    it('should emit "close" when the dialog is hidden', async () => {
      const open = jest.fn()
      const close = jest.fn()

      // ARRANGE
      const ParentComponent = {
        components: { SmDialog, SmButton },
        setup: () => {
          const dialogVisible = ref(false)

          open.mockImplementation(() => {

          })

          close.mockImplementation(() => {

          })

          return {
            dialogVisible,
            open,
            close,
          }
        },
        template: `
        <div>
          <sm-button @click="dialogVisible = true" type="primary" aria-label="open dialog">Open dialog</sm-button>
          <sm-dialog :visible.sync="dialogVisible" title="Title here" @open=open @close=close>
            Default Slot
            <template v-slot:footer>
              <sm-button type="tertiary" @click="dialogVisible = false" aria-label="close dialog">Cancel</sm-button>
            </template>
          </sm-dialog>
        </div>
      `,
      }

      // ACT
      render(ParentComponent)
      // ASSERT
      await waitFor(() => expect(screen.getByRole('button', { name: 'open dialog' })).toBeVisible())
      const openDialog = screen.getByRole('button', { name: 'open dialog' })
      await userEvent.click(openDialog)
      await waitFor(() => expect(screen.getByRole('alertdialog')).toBeVisible())
      expect(open).toHaveBeenCalledTimes(1)

      await waitFor(() => expect(screen.getByRole('button', { name: 'close dialog' })).toBeVisible())
      const closeDialog = screen.getByRole('button', { name: 'close dialog' })
      await userEvent.click(closeDialog)
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
      expect(close).toHaveBeenCalledTimes(2)
    })

    it('should call the beforeClose prop if provided', async () => {
      const onBeforeClose = jest.fn()

      // ARRANGE
      const ParentComponent = {
        components: { SmDialog, SmButton },
        setup: () => {
          const dialogVisible = ref(true)

          onBeforeClose.mockImplementation(() => {
          })

          return {
            dialogVisible,
            onBeforeClose,
          }
        },
        template: `
        <div>
          <sm-dialog :visible="true" title="Title here" :before-close="onBeforeClose">
            Default Slot
          </sm-dialog>
        </div>
      `,
      }

      // ACT
      render(ParentComponent)
      // ASSERT
      await waitFor(() => expect(screen.getByRole('button', { name: 'Click to close' })).toBeVisible())
      const closeDialog = screen.getByRole('button', { name: 'Click to close' })
      await userEvent.click(closeDialog)
      expect(onBeforeClose).toHaveBeenCalledTimes(1)
    })

    it('should close when beforeClose callback invoked', async () => {
      const onBeforeClose = jest.fn()
      const close = jest.fn()

      // ARRANGE
      const ParentComponent = {
        components: { SmDialog, SmButton },
        setup: () => {
          const dialogVisible = ref(true)
          close.mockImplementation(() => {

          })

          onBeforeClose.mockImplementation(() => {
            close()
          })

          return {
            dialogVisible,
            onBeforeClose,
            close,
          }
        },
        template: `
        <div>
          <sm-dialog :visible.sync="dialogVisible" title="Title here" @close=close :before-close="onBeforeClose">
            Default Slot
          </sm-dialog>
        </div>
      `,
      }

      // ACT
      render(ParentComponent)
      // ASSERT
      await waitFor(() => expect(screen.getByRole('button', { name: 'Click to close' })).toBeVisible())
      const closeDialog = screen.getByRole('button', { name: 'Click to close' })
      await userEvent.click(closeDialog)
      expect(onBeforeClose).toHaveBeenCalledTimes(1)
      expect(close).toHaveBeenCalledTimes(1)
    })
  })

  describe('underlay', () => {

    it('should close when clicking the underlay (mask)', async () => {
      const close = jest.fn()

      // ARRANGE
      const ParentComponent = {
        components: { SmDialog },
        setup: () => {
          const dialogVisible = ref(true)

          close.mockImplementation(() => {

          })

          return {
            dialogVisible,
            close,
          }
        },
        template: `
        <div>
          <sm-dialog :visible.sync="dialogVisible" title="Title here" @close=close>
            Default Slot
          </sm-dialog>
        </div>
      `,
      }

      // ACT
      const { container } = render(ParentComponent)
      // ASSERT
      // As per the WCAG guideline aria-label or role attribute is not required for underlay div
      // However, To get the access underlay DOM we have to query this by class name to accommodate Vue2 test cases
      // Please note: In the VTL testing library we can avoid using class name in the spec file.
      await waitFor(() => expect(container.querySelector('.sm-dialog__underlay')).toBeVisible())
      const underlay: any = container.querySelector('.sm-dialog__underlay')
      await userEvent.click(underlay)
      expect(close).toHaveBeenCalledTimes(1)
    })

    it('should not close when clicking the underlay (mask) and closeOnClickModal is false', async () => {
      const close = jest.fn()

      // ARRANGE
      const ParentComponent = {
        components: { SmDialog },
        setup: () => {
          const dialogVisible = ref(true)

          return {
            dialogVisible,
          }
        },
        template: `
        <div>
          <sm-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" title="Title here">
            Default Slot
          </sm-dialog>
        </div>
      `,
      }

      // ACT
      const { container } = render(ParentComponent)
      // ASSERT
      await waitFor(() => expect(container.querySelector('.sm-dialog__underlay')).toBeVisible())
      const underlay: any = container.querySelector('.sm-dialog__underlay')
      await userEvent.click(underlay)
      expect(close).toHaveBeenCalledTimes(0)
    })

  })

  describe('close button', () => {

    it('should show the close button if showClose is true', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmDialog },
        template: `
        <sm-dialog :visible="true" :showClose="true" title="Title here">
          Default Slot
        </sm-dialog>
      `,
      }
      // ACT
      render(ParentComponent)
      // ASSERT
      expect(screen.getByRole('button', { name: 'Click to close' })).toBeVisible()

    })

    it('should hide the close button if showClose is false', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmDialog },
        template: `
        <sm-dialog :visible="true" :showClose="false" title="Title here">
          Default Slot
        </sm-dialog>
      `,
      }
      // ACT
      render(ParentComponent)
      // ASSERT
      expect(screen.queryByRole('button', { name: 'Click to close' })).not.toBeInTheDocument()
    })

  })

  describe('slots', () => {

    it('should render the title slot', () => {
      const ParentComponent = {
        components: { SmDialog },
        template: `
        <sm-dialog :visible="true">
          <template #title>
            Title here
          </template>
        </sm-dialog>
      `,
      }

      // ACT
      render(ParentComponent)
      // ASSERT
      expect(screen.getByText('Title here')).toBeVisible()

    })

    it('should render the title label if the slot is not provided', () => {

      const ParentComponent = {
        components: { SmDialog },
        template: `
        <sm-dialog :visible="true" title="Title here">
        </sm-dialog>
      `,
      }

      // ACT
      render(ParentComponent)
      // ASSERT
      expect(screen.getByText('Title here')).toBeVisible()

    })

    it('should render the body slot', () => {

      const ParentComponent = {
        components: { SmDialog },
        template: `
        <sm-dialog :visible="true" title="Title here">
          <template #default>
            Body here
          </template>
        </sm-dialog>
      `,
      }

      // ACT
      render(ParentComponent)
      // ASSERT
      expect(screen.getByText('Body here')).toBeVisible()

    })

    it('should render the footer slot', () => {

      const ParentComponent = {
        components: { SmDialog },
        template: `
        <sm-dialog :visible="true" title="Title here">
          <template #footer>
            Footer here
          </template>
        </sm-dialog>
      `,
      }

      // ACT
      render(ParentComponent)
      // ASSERT
      expect(screen.getByText('Footer here')).toBeVisible()

    })

  })

})
