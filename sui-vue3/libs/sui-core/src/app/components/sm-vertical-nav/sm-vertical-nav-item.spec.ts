import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import SmVerticalNav from './sm-vertical-nav.vue'
import SmVerticalNavItem from './sm-vertical-nav-item.vue'
import SmVerticalNavSection from './sm-vertical-nav-section.vue'
import { createTestRouter } from '../../../../test/utils'

describe('SmVerticalNavItem', () => {
  it('should display the label', async () => {
    // ARRANGE
    const ParentComponent = {
      components: {
        SmVerticalNav,
        SmVerticalNavItem,
      },
      template: `
        <sm-vertical-nav>
          <sm-vertical-nav-item label="General" to="/setup/general"/>
          <sm-vertical-nav-item label="Details" to="/setup/details"/>
        </sm-vertical-nav>
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
    let navItem = screen.getByRole('link', { name: 'Details' })
    await waitFor(() => expect(navItem).toBeVisible())
    expect(testRouterSpy).toHaveBeenCalledTimes(0)
    await userEvent.click(navItem)
    expect(testRouterSpy).toHaveBeenCalledTimes(1)
    expect(testRouterSpy).toHaveBeenCalledWith('/setup/details')

    navItem = screen.getByRole('link', { name: 'General' })
    await waitFor(() => expect(navItem).toBeVisible())
    await userEvent.click(navItem)
    expect(testRouterSpy).toHaveBeenCalledTimes(2)
    expect(testRouterSpy).toHaveBeenCalledWith('/setup/general')
  })

  it('should display the disabled label', async () => {
    // ARRANGE
    const ParentComponent = {
      components: {
        SmVerticalNav,
        SmVerticalNavItem,
      },
      template: `
        <sm-vertical-nav>
          <sm-vertical-nav-item label="General" :disabled="true" to="/setup/general"/>
        </sm-vertical-nav>
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
    const navItem = screen.getByRole('link', { name: 'General' })
    await waitFor(() => expect(navItem).toBeVisible())
    // The reason not using `expect(navItem).toBeDisabled()` is anchor doesn't have a disabled state.
    // One has to use some static element like a `<span>` instead.
    // So we should use a button instead of an anchor when `disabled` is set regardless of other props.
    // Some optimisation we can do in the future.
    // eslint-disable-next-line jest-dom/prefer-enabled-disabled
    expect(navItem).toHaveAttribute('disabled')
    await userEvent.click(navItem)
  })

  it('should display the label on a button', async () => {
    // ARRANGE
    const ParentComponent = {
      components: {
        SmVerticalNav,
        SmVerticalNavItem,
      },
      template: `
        <sm-vertical-nav>
          <sm-vertical-nav-item label="Details" @click="(() => {})()" />
        </sm-vertical-nav>
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
    const navItem = screen.getByText('Details')
    await waitFor(() => expect(navItem).toBeVisible())
  })

  it('should display the badge', async () => {
    // ARRANGE
    const ParentComponent = {
      components: {
        SmVerticalNav,
        SmVerticalNavItem,
      },
      template: `
        <sm-vertical-nav>
          <sm-vertical-nav-item
            label="Details"
            to="/setup/details"
            :suffix-badge="{ text: 'New', config: { type: 'success' } }"
          />
        </sm-vertical-nav>
      `,
    }

    // ACT
    render(
      ParentComponent,
      {
        global: {
          plugins: [createTestRouter()],
        },
      },
    )

    // ASSERT
    await waitFor(() => expect(screen.getByText('New')).toBeVisible())
  })

  it('should display the badge on a button', async () => {
    // ARRANGE
    const ParentComponent = {
      components: {
        SmVerticalNav,
        SmVerticalNavItem,
      },
      template: `
        <sm-vertical-nav>
          <sm-vertical-nav-item
            label="Details"
            :suffix-badge="{ text: 'New', config: { type: 'success' } }"
          />
        </sm-vertical-nav>
      `,
    }

    // ACT
    render(
      ParentComponent,
      {
        global: {
          plugins: [createTestRouter()],
        },
      },
    )

    // ASSERT
    await waitFor(() => expect(screen.getByText('New')).toBeVisible())
  })

  it('should display prefix and suffix icons', async () => {
    // ARRANGE
    const ParentComponent = {
      components: {
        SmVerticalNav,
        SmVerticalNavItem,
      },
      template: `
        <sm-vertical-nav>
          <sm-vertical-nav-item
            label="Details"
            to="/setup/details"
            prefix-icon="action-article"
            suffix-icon="action-open-in-new"
          />
        </sm-vertical-nav>
      `,
    }

    // ACT
    render(
      ParentComponent,
      {
        global: {
          plugins: [createTestRouter()],
        },
      },
    )

    // ASSERT
    await waitFor(() => expect(screen.getByRole('link', { name: 'Details' })).toBeVisible())
    // No discernible name, since they can be added next to text
    const icons = screen.getAllByRole('img', { hidden: true })
    expect(icons).toHaveLength(2)
    // prefix icon
    expect(icons[0]).toHaveAttribute('name', 'action-article')
    expect(icons[0]).toBeVisible()

    // suffix icon
    expect(icons[1]).toHaveAttribute('name', 'action-open-in-new')
    expect(icons[1]).toBeVisible()
  })

  it('should display prefix and suffix icons on a button', () => {
    // ARRANGE
    const ParentComponent = {
      components: {
        SmVerticalNav,
        SmVerticalNavItem,
      },
      template: `
        <sm-vertical-nav>
          <sm-vertical-nav-item
            label="Details"
            prefix-icon="action-article"
            suffix-icon="action-open-in-new"
          />
        </sm-vertical-nav>
      `,
    }

    // ACT
    render(
      ParentComponent,
      {
        global: {
          plugins: [createTestRouter()],
        },
      },
    )

    // No discernible name, since they can be added next to text
    const icons = screen.getAllByRole('img', { hidden: true })
    expect(icons).toHaveLength(2)
    // prefix icon
    expect(icons[0]).toHaveAttribute('name', 'action-article')
    expect(icons[0]).toBeVisible()

    // suffix icon
    expect(icons[1]).toHaveAttribute('name', 'action-open-in-new')
    expect(icons[1]).toBeVisible()
  })

  it('should support nested children using header-subnav', async () => {
    // ARRANGE
    const ParentComponent = {
      components: {
        SmVerticalNav,
        SmVerticalNavItem,
      },
      template: `
        <sm-vertical-nav>
          <sm-vertical-nav-item label="Billing" to="/billing">
            <template #header-subnav>
              <sm-vertical-nav-item label="Child A" to="/some-path" />
              <sm-vertical-nav-item label="Child B" href="https://google.com" target="_blank" suffix-icon="action-open-in-new" />
            </template>
          </sm-vertical-nav-item>
        </sm-vertical-nav>
      `,
    }

    // ACT
    render(
      ParentComponent,
      {
        global: {
          plugins: [createTestRouter()],
        },
      },
    )

    // ASSERT
    await waitFor(() => expect(screen.getByRole('link', { name: 'Billing' })).toBeVisible())
    const expandButton = screen.getByRole('button', { name: 'Click to open menu' })
    expect(expandButton).toBeVisible()
    await userEvent.click(expandButton)
    await waitFor(() => expect(screen.getByRole('link', { name: 'Child A' })).toBeVisible())
    expect(screen.getByRole('link', { name: 'Child B' })).toBeVisible()
    // No discernible name, since they can be added next to text
    const icons = screen.getAllByRole('img', { hidden: true })
    expect(icons).toHaveLength(2)
    // nested arrow icon
    expect(icons[0]).toHaveAttribute('name', 'arrow-left')
    expect(icons[0]).toBeVisible()

    // suffix icon
    expect(icons[1]).toHaveAttribute('name', 'action-open-in-new')
    expect(icons[1]).toBeVisible()
  })

  it('should support nested children using header-subnav on a button', async () => {
    // ARRANGE
    const ParentComponent = {
      components: {
        SmVerticalNav,
        SmVerticalNavItem,
      },
      template: `
        <sm-vertical-nav>
          <sm-vertical-nav-item label="Billing">
            <template #header-subnav>
              <sm-vertical-nav-item label="Child A" to="/some-path" />
              <sm-vertical-nav-item label="Child B" href="https://google.com" target="_blank" suffix-icon="action-open-in-new" />
            </template>
          </sm-vertical-nav-item>
        </sm-vertical-nav>
      `,
    }

    // ACT
    render(
      ParentComponent,
      {
        global: {
          plugins: [createTestRouter()],
        },
      },
    )

    // ASSERT
    await waitFor(() => expect(screen.getByText('Billing')).toBeVisible())
    const expandButton = screen.getByRole('button', { name: 'Click to open menu' })
    expect(expandButton).toBeVisible()
    await userEvent.click(expandButton)
    await waitFor(() => expect(screen.getByRole('link', { name: 'Child A' })).toBeVisible())
    expect(screen.getByRole('link', { name: 'Child B' })).toBeVisible()
    // No discernible name, since they can be added next to text
    const icons = screen.getAllByRole('img', { hidden: true })
    expect(icons).toHaveLength(2)
    // nested arrow icon
    expect(icons[0]).toHaveAttribute('name', 'arrow-left')
    expect(icons[0]).toBeVisible()

    // suffix icon
    expect(icons[1]).toHaveAttribute('name', 'action-open-in-new')
    expect(icons[1]).toBeVisible()
  })

  it('should support sections and nested children', async () => {
    // ARRANGE
    const ParentComponent = {
      components: {
        SmVerticalNav,
        SmVerticalNavSection,
        SmVerticalNavItem,
      },
      template: `
        <sm-vertical-nav>
          <sm-vertical-nav-section label="Property Setup">
            <sm-vertical-nav-item label="General" to="/setup/general" />
            <sm-vertical-nav-item label="Details" to="/setup/details"/>
          </sm-vertical-nav-section>

          <sm-vertical-nav-section label="Media">
            <sm-vertical-nav-item label="Media" to="/setup/media">
            <sm-vertical-nav-item label="Rooms" to="/setup/media/rooms"/>
              <sm-vertical-nav-item
                label="With Badge"
                to="/setup/details"
                :suffix-badge="{ text: 'New', config: { type: 'success' } }"
              />
              <sm-vertical-nav-item
                label="With Prefix Icon"
                to="/setup/details2"
                prefix-icon="action-article"
              />
              <sm-vertical-nav-item
                label="With Suffix Icon"
                to="/setup/details3"
                suffix-icon="action-open-in-new"
              />
              <sm-vertical-nav-item
                label="Everything"
                to="/setup/details6"
                prefix-icon="action-article"
                suffix-icon="action-open-in-new"
                :suffix-badge="{ text: 'New', config: { type: 'success' } }"
              />
            </sm-vertical-nav-item>
          </sm-vertical-nav-section>
        </sm-vertical-nav>
      `,
    }

    // ACT
    render(
      ParentComponent,
      {
        global: {
          plugins: [createTestRouter()],
        },
      },
    )

    // ASSERT
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Property Setup' })).toBeVisible())
    expect(screen.getByRole('link', { name: 'General' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Details' })).toBeVisible()

    expect(screen.getByRole('heading', { name: 'Media' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Media' })).toBeVisible()
    const expandButton = screen.getByRole('button', { name: 'Click to open menu' })
    expect(expandButton).toBeVisible()
    await userEvent.click(expandButton)
    await waitFor(() => expect(screen.getByRole('link', { name: 'Rooms' })).toBeVisible())
    expect(screen.getByRole('link', { name: 'With Badge New' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'With Prefix Icon' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'With Suffix Icon' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Everything New' })).toBeVisible()
    const collapseButton = screen.getByRole('button', { name: 'Click to close menu' })
    expect(collapseButton).toBeVisible()
  })

})
