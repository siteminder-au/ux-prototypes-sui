import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'

import SmPopover from './sm-popover.vue'

describe('SmPopover', () => {
  it('should not be visible until clicked by default', async () => {
    // ARRANGE
    const mockOpen = jest.fn()
    const mockClose = jest.fn()

    const ParentComponent = {
      components: { SmPopover },
      setup: () => {

        return { mockOpen, mockClose }
      },
      template: `
        <sm-popover
          title="Popover title"
          @open="mockOpen"
          @close="mockClose"
        >
          <button>Popover target</button>
        </sm-popover>
      `,
    }

    // ACT
    const { baseElement } = render(ParentComponent)

    // ASSERT
    // Assert initial state
    await waitFor(() => expect(screen.getByRole('button', { name: 'Popover target' })).toBeVisible())
    await waitFor(() => expect(screen.queryByText('Popover title')).not.toBeInTheDocument())
    expect(mockOpen).toHaveBeenCalledTimes(0)
    // NOTE: this is *existing* behaviour since we're using watchEffect.
    // We should probably change this to watch in the future. emitting close immediately doesn't make sense
    expect(mockClose).toHaveBeenCalledTimes(1)

    await userEvent.click(screen.getByRole('button', { name: 'Popover target' }))

    // Assert visibility
    await waitFor(() => expect(screen.getByText('Popover title')).toBeVisible())
    // we use baseElement container here to specifically check for aria-hidden attribute is attached
    await waitFor(() => expect(baseElement.querySelector('[aria-hidden="false"]')).toBeVisible())
    expect(mockOpen).toHaveBeenCalledTimes(1)
    expect(mockClose).toHaveBeenCalledTimes(1)

    await userEvent.click(screen.getByRole('button', { name: 'Popover target' }))

    // Assert disappearance
    // we use baseElement container here to specifically check for aria-hidden attribute is now set to true indicator that it has disappeared
    await waitFor(() => expect(baseElement.querySelector('[aria-hidden="true"]')).toBeInTheDocument())
    expect(mockOpen).toHaveBeenCalledTimes(1)
    expect(mockClose).toHaveBeenCalledTimes(2)
  })

  it.each(['hover', 'focus'])('should not be visible until triggered by %s', async (trigger) => {
    // ARRANGE
    const ParentComponent = {
      components: { SmPopover },
      setup: () => {
        return { trigger }
      },
      template: `
        <div>
          <sm-popover :trigger="trigger" title="Popover title">
            <button>Popover target</button>
          </sm-popover>
          <span>Other element</span>
        </div>
      `,
    }

    // ACT
    const { baseElement } = render(ParentComponent)

    // ASSERT
    // Assert initial state
    await waitFor(() => expect(screen.getByRole('button', { name: 'Popover target' })).toBeVisible())

    await userEvent.hover(screen.getByRole('button', { name: 'Popover target' }))

    // Assert visibility
    await waitFor(() => expect(screen.getByText('Popover title')).toBeVisible())
    // we use baseElement container here to specifically check for aria-hidden attribute is attached
    await waitFor(() => expect(baseElement.querySelector('[aria-hidden="false"]')).toBeVisible())

    // click away
    await userEvent.click(screen.getByText('Other element'))

    // Assert disappearance
    // we use baseElement container here to specifically check for aria-hidden attribute is now set to true indicator that it has disappeared
    await waitFor(() => expect(baseElement.querySelector('[aria-hidden="true"]')).toBeInTheDocument())
  })

  it('should be visible on load if isVisible is set to true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmPopover },
      template: `
        <sm-popover :is-visible="true" title="Popover title">
          <button>Popover target</button>
        </sm-popover>
      `,
    }

    // ACT
    const { baseElement } = render(ParentComponent)

    // ASSERT
    // Assert initial state
    await waitFor(() => expect(screen.getByRole('button', { name: 'Popover target' })).toBeVisible())
    expect(screen.getByText('Popover title')).toBeVisible()
    // we use baseElement container here to specifically check for aria-hidden attribute is attached
    await waitFor(() => expect(baseElement.querySelector('[aria-hidden="false"]')).toBeVisible())

    await userEvent.click(screen.getByRole('button', { name: 'Popover target' }))

    // Assert disappearance
    // we use baseElement container here to specifically check for aria-hidden attribute is now set to true indicator that it has disappeared
    await waitFor(() => expect(baseElement.querySelector('[aria-hidden="true"]')).toBeInTheDocument())
  })

  it('should not close on click outside if specified', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmPopover },
      template: `
        <div>
          <sm-popover :close-on-click-outside="false" title="Popover title">
            <button>Popover target</button>
          </sm-popover>
          <span>Other element</span>
        </div>
      `,
    }

    // ACT
    const { baseElement } = render(ParentComponent)

    // ASSERT
    // Assert initial state
    await waitFor(() => expect(screen.getByRole('button', { name: 'Popover target' })).toBeVisible())

    await userEvent.click(screen.getByRole('button', { name: 'Popover target' }))

    // Assert visibility
    await waitFor(() => expect(screen.getByText('Popover title')).toBeVisible())
    // we use baseElement container here to specifically check for aria-hidden attribute is attached
    await waitFor(() => expect(baseElement.querySelector('[aria-hidden="false"]')).toBeVisible())

    // click away
    await userEvent.click(screen.getByText('Other element'))

    // popover should still be there
    let popoverExists = false
    try {
      // here we purposely check if the popover is gone, if it is gone, it will throw an error
      // which is what we expect and want the popover to still be there
      // we don't want to assert that the popover exists directly because it may be a false positive
      await waitFor(() => expect(screen.queryByText('Popover title')).not.toBeInTheDocument())
      popoverExists = false
    } catch (e) {
      popoverExists = true
    }
    expect(popoverExists).toBe(true)
  })

  it('should render the provided slots', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmPopover },
      template: `
        <sm-popover title="Popover title">
          <button>Popover target</button>
          <template #content>
            <span>Popover content slot</span>
          </template>
          <template #close>
            <span>Popover close slot</span>
          </template>
        </sm-popover>
      `,
    }

    // ACT
    const { baseElement } = render(ParentComponent)

    // ASSERT
    // Assert initial state
    await waitFor(() => expect(screen.getByRole('button', { name: 'Popover target' })).toBeVisible())

    await userEvent.click(screen.getByRole('button', { name: 'Popover target' }))

    await waitFor(() => expect(screen.getByText('Popover content slot')).toBeVisible())
    expect(screen.getByText('Popover close slot')).toBeVisible()
    // we use baseElement container here to specifically check for aria-hidden attribute is attached
    await waitFor(() => expect(baseElement.querySelector('[aria-hidden="false"]')).toBeVisible())

    await userEvent.click(screen.getByRole('button', { name: 'Popover target' }))

    // Assert disappearance
    // we use baseElement container here to specifically check for aria-hidden attribute is now set to true indicator that it has disappeared
    await waitFor(() => expect(baseElement.querySelector('[aria-hidden="true"]')).toBeInTheDocument())
  })

  it('should teleport content to body when appendToBody is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmPopover },
      template: `
        <div data-testid="popover-container">
          <sm-popover :append-to-body="true" title="Popover title">
            <button>Popover target</button>
            <template #content>
              <span>Popover content slot</span>
            </template>
          </sm-popover>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // Assert initial state
    await waitFor(() => expect(screen.getByRole('button', { name: 'Popover target' })).toBeVisible())

    await userEvent.click(screen.getByRole('button', { name: 'Popover target' }))

    const teleportedContent = screen.getByText('Popover content slot')

    await waitFor(() => expect(teleportedContent).toBeVisible())

    const teleportedEl = teleportedContent.closest('.sm-popover__content') as HTMLElement

    // Assert that the content is teleported to the body
    expect(teleportedEl.parentElement).toBe(document.body)
    const container = screen.getByTestId('popover-container')
    expect(container).not.toContainElement(teleportedEl)
  })

  it('should not teleport content to body when appendToBody is false', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmPopover },
      template: `
        <div data-testid="popover-container">
          <sm-popover :append-to-body="false" title="Popover title">
            <button>Popover target</button>
            <template #content>
              <span>Popover content slot</span>
            </template>
          </sm-popover>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // Assert initial state
    await waitFor(() => expect(screen.getByRole('button', { name: 'Popover target' })).toBeVisible())

    await userEvent.click(screen.getByRole('button', { name: 'Popover target' }))

    const localContent = screen.getByText('Popover content slot')

    await waitFor(() => expect(localContent).toBeVisible())

    const inlineEl = localContent.closest('.sm-popover__content') as HTMLElement

    // Assert that the content is not teleported and remains in the original DOM structure
    const container = screen.getByTestId('popover-container')
    expect(container).toContainElement(inlineEl)
    expect(inlineEl.parentElement).not.toBe(document.body)
  })
})
