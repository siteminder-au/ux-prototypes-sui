import userEvent from '@testing-library/user-event'
import { isInaccessible, render, screen, waitFor } from '@testing-library/vue'

import SmAside from './sm-aside.vue'

describe('SmAside', () => {

  it('should display the content slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmAside },
      template: `
        <sm-aside>
          Content slot
        </sm-aside>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Content slot')).toBeVisible())
  })

  it('should display the footer slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmAside },
      template: `
        <sm-aside>
          <template #footer>
            Footer slot
          </template>
        </sm-aside>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Footer slot')).toBeVisible())
  })

  it('should display the content and footer slots', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmAside },
      template: `
        <sm-aside>
          Content slot
          <template #footer>
            Footer slot
          </template>
        </sm-aside>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Content slot')).toBeVisible())
    expect(screen.getByText('Footer slot')).toBeVisible()
  })

  it('should toggle between expand/collapse states given it is collapsable', async () => {
    // ARRANGE
    const mockExpand = jest.fn()
    const mockCollapse = jest.fn()

    const ParentComponent = {
      components: { SmAside },
      setup: () => {

        return { mockExpand, mockCollapse }
      },
      template: `
        <sm-aside
          :is-collapsable="true"
          @open="mockExpand"
          @close="mockCollapse"
        >
          <template #footer>
            Footer slot
          </template>
        </sm-aside>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const toggle = screen.getByRole('button', { name: 'Click to hide the sidebar' })
    const footer = screen.getByText('Footer slot')

    expect(toggle).toBeVisible()
    expect(mockExpand).toHaveBeenCalledTimes(0)
    expect(mockCollapse).toHaveBeenCalledTimes(0)
    expect(isInaccessible(footer)).toBe(false)

    await userEvent.hover(toggle)

    await waitFor(() => expect(screen.queryByText('Hide navigation')).toBeVisible())

    await userEvent.click(toggle)

    expect(mockExpand).toHaveBeenCalledTimes(0)
    expect(mockCollapse).toHaveBeenCalledTimes(1)
    expect(isInaccessible(footer)).toBe(true)

    await userEvent.hover(toggle)

    await waitFor(() => expect(screen.queryByText('Show navigation')).toBeVisible())
  })

  it('should not collapse if it is not collapsable', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmAside },
      template: `
        <sm-aside :is-collapsable="false">
          <template #footer>
            Footer slot
          </template>
        </sm-aside>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const toggle = screen.queryByRole('button', { name: 'Click to hide the sidebar' })
    expect(toggle).not.toBeInTheDocument()
  })

})
