import { render, screen, waitFor } from '@testing-library/vue'
import { ref } from 'vue'
import SmSwitchGroup from './sm-switch-group.vue'
import SmSwitch from './sm-switch.vue'

describe('SmSwitchGroup', () => {

  it('should display the provided label', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSwitch, SmSwitchGroup },
      setup: () => {
        const switchValue = ref(false)

        return { switchValue }
      },
      template: `
        <div>
          <sm-switch-group label="switch-group-label">
            <sm-switch v-model="switchValue" name="switchValue" />
          </sm-switch-group>
          <span>Value: {{ switchValue }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findByText('switch-group-label')).toBeVisible()
    expect(screen.getByRole('group')).toHaveTextContent('switch-group-label')
  })

  it('should not display the group label when not provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSwitch, SmSwitchGroup },
      setup: () => {
        const switchValue = ref(false)

        return { switchValue }
      },
      template: `
        <sm-switch-group>
          <sm-switch
            v-model="switchValue"
            name="switchValue"
            label="Item 1"
            :show-border-bottom="false"
          />
        </sm-switch-group>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findByRole('checkbox', { name: 'Item 1' })).toBeVisible()
    expect(screen.queryByText('switch-group-label')).not.toBeInTheDocument()
  })

  it('should render the default slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSwitch, SmSwitchGroup },
      setup: () => {
        const switchValue = ref(false)

        return { switchValue }
      },
      template: `
        <div>
          <sm-switch-group label="switch-group-label">
            <sm-switch v-model="switchValue" label="switch-label" name="switchValue" />
          </sm-switch-group>
          <span>Value: {{ switchValue }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('switch-group-label')).toBeVisible())
    expect(screen.getByText('switch-label')).toBeVisible()
  })

  it('should render the label slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSwitch, SmSwitchGroup },
      setup: () => {
        const switchValue = ref(false)

        return { switchValue }
      },
      template: `
        <div>
          <sm-switch-group label="switch-group-label">
            <template #label>
              <span>switch-group-label-slot</span>
            </template>
            <sm-switch v-model="switchValue" label="switch-label" name="switchValue" />
          </sm-switch-group>
          <span>Value: {{ switchValue }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('switch-group-label-slot')).toBeVisible())
    await waitFor(() => expect(screen.queryByText('switch-group-label')).not.toBeInTheDocument())
    expect(screen.getByText('switch-label')).toBeVisible()
  })

  it('should render the action slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmSwitch, SmSwitchGroup },
      setup: () => {
        const switchValue = ref(false)

        return { switchValue }
      },
      template: `
        <div>
          <sm-switch-group label="switch-group-label">
            <template #label>
              <span>switch-group-label-slot</span>
            </template>
            <template #action>
              <span>switch-group-action-slot</span>
            </template>
            <sm-switch v-model="switchValue" label="switch-label" name="switchValue" />
          </sm-switch-group>
          <span>Value: {{ switchValue }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('switch-group-label-slot')).toBeVisible())
    expect(screen.getByText('switch-group-action-slot')).toBeVisible()
    expect(screen.getByText('switch-label')).toBeVisible()
  })

})
