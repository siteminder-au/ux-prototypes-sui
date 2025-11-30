import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'

import SmTooltip from './sm-tooltip.vue'

describe('SmTooltip', () => {
  it('should not be visible until clicked by default', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTooltip },
      template: `
        <sm-tooltip title="Tooltip title">
          <button>Tooltip target</button>
        </sm-tooltip>
      `,
    }

    // ACT
    const { baseElement } = render(ParentComponent)

    // ASSERT
    // Assert initial state
    await waitFor(() => expect(screen.getByRole('button', { name: 'Tooltip target' })).toBeVisible())

    await userEvent.click(screen.getByText('Tooltip target'))

    // Assert visibility
    await waitFor(() => expect(screen.getByText('Tooltip title')).toBeVisible())
    // we use baseElement container here to specifically check for aria-hidden attribute is attached
    await waitFor(() => expect(baseElement.querySelector('[aria-hidden="false"]')).toBeVisible())

    await userEvent.click(screen.getByText('Tooltip target'))

    // Assert disappearance
    // we use baseElement container here to specifically check for aria-hidden attribute is now set to true indicator that it has disappeared
    await waitFor(() => expect(baseElement.querySelector('[aria-hidden="true"]')).toBeInTheDocument())
  })

  it.each(['hover'])('should not be visible until triggered by %s', async (trigger) => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTooltip },
      setup: () => {
        return { trigger }
      },
      template: `
        <div>
          <sm-tooltip :trigger="trigger" title="Tooltip title">
            <button>Tooltip target</button>
          </sm-tooltip>
          <span>Other element</span>
        </div>
      `,
    }

    // ACT
    const { baseElement } = render(ParentComponent)

    // ASSERT
    // Assert initial state
    await waitFor(() => expect(screen.getByRole('button', { name: 'Tooltip target' })).toBeVisible())

    await userEvent.hover(screen.getByText('Tooltip target'))

    // Assert visibility
    await waitFor(() => expect(screen.getByText('Tooltip title')).toBeVisible())
    // we use baseElement container here to specifically check for aria-hidden attribute is attached
    await waitFor(() => expect(baseElement.querySelector('[aria-hidden="false"]')).toBeVisible())

    // click away
    await userEvent.click(screen.getByText('Other element'))

    // Assert disappearance
    // we use baseElement container here to specifically check for aria-hidden attribute is now set to true indicator that it has disappeared
    await waitFor(() => expect(baseElement.querySelector('[aria-hidden="true"]')).toBeInTheDocument())
  })

  it('should not close on click outside if specified', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTooltip },
      template: `
        <div>
          <sm-tooltip :close-on-click-outside="false" title="Tooltip title">
            <button>Tooltip target</button>
          </sm-tooltip>
          <span>Other element</span>
        </div>
      `,
    }

    // ACT
    const { baseElement } = render(ParentComponent)

    // ASSERT
    // Assert initial state
    await waitFor(() => expect(screen.getByRole('button', { name: 'Tooltip target' })).toBeVisible())

    await userEvent.click(screen.getByText('Tooltip target'))

    // Assert visibility
    await waitFor(() => expect(screen.getByText('Tooltip title')).toBeVisible())
    // we use baseElement container here to specifically check for aria-hidden attribute is attached
    await waitFor(() => expect(baseElement.querySelector('[aria-hidden="false"]')).toBeVisible())

    // click away
    await userEvent.click(screen.getByText('Other element'))

    // popover should still be there
    let tooltipExists = false
    try {
      // here we purposely check if the popover is gone, if it is gone, it will throw an error
      // which is what we expect and want the popover to still be there
      // we don't want to assert that the popover exists directly because it may be a false positive
      await waitFor(() => expect(screen.queryByText('Tooltip title')).not.toBeInTheDocument())
      tooltipExists = false
    } catch (e) {
      tooltipExists = true
    }
    expect(tooltipExists).toBe(true)
  })

  it('should display tooltip showing content slot when clicked', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTooltip },
      template: `
        <sm-tooltip>
          <button>Tooltip target</button>
          <template #content>
            <span>Tooltip title</span>
          </template>
        </sm-tooltip>
      `,
    }

    // ACT
    const { baseElement } = render(ParentComponent)

    // ASSERT
    // Assert initial state
    await waitFor(() => expect(screen.getByRole('button', { name: 'Tooltip target' })).toBeVisible())

    await userEvent.click(screen.getByText('Tooltip target'))

    // Assert visibility
    await waitFor(() => expect(screen.getByText('Tooltip title')).toBeVisible())
    // we use baseElement container here to specifically check for aria-hidden attribute is attached
    // we increase the timeout here because the tooltip takes a while to appear
    await waitFor(() => expect(baseElement.querySelector('[aria-hidden="false"]')).toBeVisible())

    await userEvent.click(screen.getByText('Tooltip target'))

    // Assert disappearance
    // we use baseElement container here to specifically check for aria-hidden attribute is now set to true indicator that it has disappeared
    await waitFor(() => expect(baseElement.querySelector('[aria-hidden="true"]')).toBeInTheDocument())
  })
})
