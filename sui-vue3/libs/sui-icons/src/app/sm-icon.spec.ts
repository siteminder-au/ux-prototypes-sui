import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import SmIcon from './sm-icon.vue'

describe('SmIcon', () => {
  it('should render an accessible icon if alt prop is provided', async () => {
    // ARRANGE
    const mockClick = jest.fn()
    const ParentComponent = {
      components: { SmIcon },
      setup: () => {
        return { mockClick }
      },
      template: `
        <sm-icon name="action-edit" alt="Edit property" @click="mockClick" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const icon = screen.getByRole('img', { name: 'Edit property' })
    await waitFor(() => expect(icon).toBeVisible())
    expect(icon).toHaveStyle('width: 1em; height: 1em;')
    expect(mockClick).toHaveBeenCalledTimes(0)

    await userEvent.click(icon)

    expect(mockClick).toHaveBeenCalledTimes(1)
  })

  it('should render a presentational icon if alt prop is not provided', async () => {
    // ARRANGE
    const mockClick = jest.fn()
    const ParentComponent = {
      components: { SmIcon },
      setup: () => {
        return { mockClick }
      },
      template: `
        <sm-icon name="action-bulk-update" @click="mockClick" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const icon = screen.getByRole('img', { hidden: true })
    await waitFor(() => expect(icon).toBeVisible())
    expect(icon).toHaveStyle('width: 1em; height: 1em;')
    expect(mockClick).toHaveBeenCalledTimes(0)

    await userEvent.click(icon)

    expect(mockClick).toHaveBeenCalledTimes(1)
  })

  it('should use the width and height props as the svg styles', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmIcon },
      template: `
        <sm-icon name="action-bulk-update" width="32px" height="32px" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const icon = screen.getByRole('img', { hidden: true })
    await waitFor(() => expect(icon).toHaveStyle('width: 32px; height: 32px;'))
  })

  it('should use the icon template\'s width and height as the svg styles', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmIcon },
      template: `
        <sm-icon name="action-bulk-update" :width="null" :height="null" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const icon = screen.getByRole('img', { hidden: true })
    await waitFor(() => expect(icon).toHaveStyle('width: 24px; height: 24px;'))
  })

  it('should render the badge slot if provided', async () => {
    // ARRANGE
    const mockClick = jest.fn()
    const ParentComponent = {
      components: { SmIcon },
      setup: () => {
        return { mockClick }
      },
      template: `
        <sm-icon name="social-notifications" alt="Unread messages" @click="mockClick">
          <template #badge>99+</template>
        </sm-icon>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const icon = screen.getByRole('img', { name: 'Unread messages' })
    await waitFor(() => expect(icon).toBeVisible())
    expect(screen.getByText('99+')).toBeVisible()
    expect(mockClick).toHaveBeenCalledTimes(0)

    await userEvent.click(icon)

    expect(mockClick).toHaveBeenCalledTimes(1)
  })

  it('should throw a warning if an invalid icon name is provided', async () => {
    // Suppress the warning thrown in the test log
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

    // ARRANGE
    const ParentComponent = {
      components: { SmIcon },
      template: `
        <sm-icon name="invalid-icon" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledTimes(1))
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument()
  })
})
