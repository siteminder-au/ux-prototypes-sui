import { ref } from 'vue'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'

import SmTab from './sm-tab.vue'
import SmTabs from './sm-tabs.vue'
import SmButton from '../sm-button/sm-button.vue'
import SmForm from '../forms/sm-form/sm-form.vue'

describe('SmTabs', () => {

  it('should display the default slot', () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTab, SmTabs },
      template: `
        <sm-tabs :active-tab="0">
          <sm-tab label="Default slot">Default slot</sm-tab>
        </sm-tabs>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(screen.getByText('Default slot')).toBeVisible()
  })

  it('should display the action slot', () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTabs },
      template: `
        <sm-tabs :active-tab="0">
          <template #action>
            <button>
              Action slot
            </button>
          </template>
        </sm-tabs>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(screen.getByRole('button', { name: 'Action slot' })).toBeVisible()
  })

  it('should display the default and action slots', () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTab, SmTabs },
      template: `
        <sm-tabs :active-tab="0">
          <sm-tab label="Default slot">Default slot</sm-tab>
          <template #action>
            <button>
              Action slot
            </button>
          </template>
        </sm-tabs>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(screen.getByText('Default slot')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Action slot' })).toBeVisible()
  })

  it('should not activate a disabled tab', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTab, SmTabs },
      setup: () => {
        const activeTab = ref(0)

        return { activeTab }
      },
      template: `
        <sm-tabs :active-tab.sync="activeTab">
          <sm-tab label="All">All content</sm-tab>
          <sm-tab label="Property">Property content</sm-tab>
          <sm-tab label="Settings" :disabled="true">Settings content</sm-tab>
        </sm-tabs>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const tabItems = await screen.findAllByRole('tab')

    expect(tabItems.length).toBe(3)
    expect(tabItems[0]).toBeEnabled()
    expect(tabItems[1]).toBeEnabled()
    expect(tabItems[2]).toBeDisabled()
    expect(screen.getByRole('tabpanel', { name: 'All' })).toBeVisible()
    expect(screen.queryByRole('tabpanel', { name: 'Property content' })).not.toBeInTheDocument()
    expect(screen.queryByRole('tabpanel', { name: 'Settings content' })).not.toBeInTheDocument()

    // Switch to the disabled tab
    await userEvent.click(tabItems[2])

    // Should not switch to the disabled tab
    expect(screen.getByRole('tabpanel', { name: 'All' })).toBeVisible()
    expect(screen.queryByRole('tabpanel', { name: 'Property content' })).not.toBeInTheDocument()
    expect(screen.queryByRole('tabpanel', { name: 'Settings content' })).not.toBeInTheDocument()
  })

  it('should not activate a hidden tab', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTab, SmTabs },
      setup: () => {
        const activeTab = ref(0)

        return { activeTab }
      },
      template: `
        <sm-tabs :active-tab.sync="activeTab">
          <sm-tab label="All" :hidden="false">All content</sm-tab>
          <sm-tab label="Property" :hidden="false">Property content</sm-tab>
          <sm-tab label="Settings" :hidden="true">Settings content</sm-tab>
        </sm-tabs>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const tabItems = await screen.findAllByRole('tab')

    expect(tabItems.length).toBe(2)
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Property')).toBeInTheDocument()
    expect(screen.queryByText('Settings')).not.toBeInTheDocument()
  })

  it('should not activate an invalid tab index', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTab, SmTabs },
      setup: () => {
        const activeTab = ref(2) // invalid tab index

        return { activeTab }
      },
      template: `
        <sm-tabs :active-tab.sync="activeTab">
          <sm-tab label="All">All content</sm-tab>
        </sm-tabs>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const tabItems = await screen.findAllByRole('tab')

    expect(tabItems.length).toBe(1)
    expect(tabItems[0]).toBeInTheDocument()
    expect(tabItems[2]).toBeUndefined()
  })

  it('should switch tabs normally', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTab, SmTabs },
      setup: () => {
        const activeTab = ref(0)

        return { activeTab }
      },
      template: `
        <sm-tabs v-model:activeTab="activeTab">
          <sm-tab label="All">All content</sm-tab>
          <sm-tab label="Property">Property content</sm-tab>
          <sm-tab label="Settings">Settings content</sm-tab>
        </sm-tabs>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const tabItems = await screen.findAllByRole('tab')

    // Initial state
    expect(tabItems).toHaveLength(3)
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('All')
    expect(screen.getByText('All content')).toBeVisible()
    expect(screen.queryByText('Property content')).not.toBeInTheDocument()
    expect(screen.queryByText('Settings content')).not.toBeInTheDocument()

    // Switch tabs
    await userEvent.click(tabItems[1])

    await waitFor(() => expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Property'))
    expect(screen.getByText('Property content')).toBeVisible()
    expect(screen.queryByText('All content')).not.toBeInTheDocument()
    expect(screen.queryByText('Settings content')).not.toBeInTheDocument()

    await userEvent.click(tabItems[2])

    await waitFor(() => expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Settings'))
    expect(screen.getByText('Settings content')).toBeInTheDocument()
    expect(screen.queryByText('All content')).not.toBeInTheDocument()
    expect(screen.queryByText('Property content')).not.toBeInTheDocument()
  })

  it('should call before tab change callback', async () => {
    const onBeforeTabChangeMock = jest.fn()

    // ARRANGE
    const ParentComponent = {
      components: { SmTab, SmTabs },
      setup: () => {
        const activeTab = ref(0)

        const onBeforeTabChange = (to: number, from: number): void => {
          onBeforeTabChangeMock(to, from)
        }

        return { activeTab, onBeforeTabChange }
      },
      template: `
        <sm-tabs v-model:activeTab="activeTab" :before-tab-change="onBeforeTabChange">
          <sm-tab label="All">All content</sm-tab>
          <sm-tab label="Property">Property content</sm-tab>
          <sm-tab label="Settings">Settings content</sm-tab>
        </sm-tabs>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const tabItems = await screen.findAllByRole('tab')

    // Initial state
    expect(tabItems).toHaveLength(3)
    expect(onBeforeTabChangeMock).toHaveBeenCalledTimes(0)

    // Switch tabs
    await userEvent.click(tabItems[1])
    expect(onBeforeTabChangeMock).toHaveBeenCalledTimes(1)
    expect(onBeforeTabChangeMock).toHaveBeenCalledWith(1, 0)

    await userEvent.click(tabItems[2])
    expect(onBeforeTabChangeMock).toHaveBeenCalledWith(2, 0)
    expect(onBeforeTabChangeMock).toHaveBeenCalledTimes(2)
  })

  it('should add the custom tablist aria-label if provided', () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTab, SmTabs },
      template: `
        <sm-tabs
          :active-tab="0"
          customTablistText="test-tabs-label"
        >
          <sm-tab label="All">All content</sm-tab>
        </sm-tabs>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(screen.getByLabelText('test-tabs-label')).toBeVisible()
  })

  it('should update the tablist states when tab item props change', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTab, SmTabs, SmButton },
      setup: () => {
        const activeTab = ref(0)
        const allTabValue = ref(3)
        const isPropertyTabDisabled = ref(false)
        const isSettingsTabHidden = ref(false)

        const updateProps = (): void => {
          allTabValue.value = 1
          isPropertyTabDisabled.value = true
          isSettingsTabHidden.value = true
        }

        return {
          activeTab,
          allTabValue,
          isPropertyTabDisabled,
          isSettingsTabHidden,
          updateProps,
        }
      },
      template: `
        <div>
          <sm-tabs :active-tab.sync="activeTab">
            <sm-tab label="All" :value="allTabValue">
              All content
            </sm-tab>
            <sm-tab label="Property" :disabled="isPropertyTabDisabled">
              Property content
            </sm-tab>
            <sm-tab label="Settings" :hidden="isSettingsTabHidden">
              Settings content
            </sm-tab>
          </sm-tabs>
          <sm-button @click="updateProps">Update props</sm-button>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tab', { name: 'All (3)' })).toBeEnabled() // Includes the value prop
    expect(screen.getByRole('tab', { name: 'Property' })).toBeEnabled()
    expect(screen.getByRole('tab', { name: 'Settings' })).toBeEnabled()

    // Update tab item props
    await userEvent.click(screen.getByRole('button', { name: 'Update props' }))

    expect(await screen.findAllByRole('tab')).toHaveLength(2)
    expect(screen.getByRole('tab', { name: 'All (1)' })).toBeEnabled()
    expect(screen.getByRole('tab', { name: 'Property' })).toBeDisabled()
    expect(screen.queryByRole('tab', { name: 'Settings' })).not.toBeInTheDocument()
  })

  it('should not trigger the form submit when clicking on the tab', async () => {
    const onBeforeTabChangeMock = jest.fn()
    const onSubmitMock = jest.fn()

    // ARRANGE
    const ParentComponent = {
      components: { SmTab, SmTabs, SmForm },
      setup: () => {
        const activeTab = ref(0)

        const onBeforeTabChange = (to: number, from: number): void => {
          onBeforeTabChangeMock(to, from)
        }

        const onSubmit = (): void => {
          onSubmitMock()
        }

        return { activeTab, onBeforeTabChange, onSubmit }
      },
      template: `
      <sm-form @submit="onSubmit">
        <sm-tabs v-model:activeTab="activeTab" :before-tab-change="onBeforeTabChange">
          <sm-tab label="All">All content</sm-tab>
          <sm-tab label="Property">Property content</sm-tab>
          <sm-tab label="Settings">Settings content</sm-tab>
        </sm-tabs>
      </sm-form>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const tabItems = await screen.findAllByRole('tab')

    // Initial state
    expect(tabItems).toHaveLength(3)
    expect(onBeforeTabChangeMock).toHaveBeenCalledTimes(0)

    // Switch tabs
    await userEvent.click(tabItems[1])
    expect(onBeforeTabChangeMock).toHaveBeenCalledTimes(1)
    expect(onSubmitMock).not.toHaveBeenCalled()

  })
})
