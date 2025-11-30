import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { ref } from 'vue'
import SmButton from '../sm-button/sm-button.vue'
import SmExpandableCardBody from './sm-expandable-card-body.vue'

describe('SmExpandableCardBody', () => {

  const collapseA11yText = 'Click to collapse the section'
  const expandA11yText = 'Click to expand the section'

  it('should render the header and body slots with default props', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmExpandableCardBody },
      template: `
        <sm-expandable-card-body>
          <template #header>Header slot</template>
          <template #body>Body slot</template>
        </sm-expandable-card-body>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('button', { name: collapseA11yText })).toHaveTextContent('Header slot'))
    expect(screen.getByRole('region')).toBeInTheDocument()
    expect(screen.getByText('Body slot')).toBeVisible()
  })

  it('should display the body slot as collapsed when expanded prop is false', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmExpandableCardBody },
      template: `
        <sm-expandable-card-body :expanded="false">
          <template #header>Header slot</template>
          <template #body>Body slot</template>
        </sm-expandable-card-body>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('button', { name: expandA11yText })).toHaveTextContent('Header slot'))
    // Visually hidden, but it's still in the DOM
    expect(screen.getByRole('region', { hidden: true })).toBeInTheDocument()
    // Should not be visible to the users through CSS styles, but the limitation in VTL
    // does not account for styles atm. See https://github.com/vuejs/vue-jest/issues/438
    expect(screen.getByText('Body slot')).toBeVisible()
  })

  it('should toggle the body state by default when header is clicked', async () => {
    // ARRANGE
    const mockOpen = jest.fn()
    const mockClose = jest.fn()
    const ParentComponent = {
      components: { SmExpandableCardBody },
      setup: () => {
        const isExpanded = ref(false)
        const lastEvent = ref('none')

        mockClose.mockImplementation(() => {
          lastEvent.value = 'close'
        })

        mockOpen.mockImplementation(() => {
          lastEvent.value = 'open'
        })

        return { isExpanded, lastEvent, mockClose, mockOpen }
      },
      template: `
        <div>
          <sm-expandable-card-body
            :expanded.sync="isExpanded"
            :is-help-card="true"
            :show-arrow-icon="false"
            :show-outer-border="true"
            @open="mockOpen"
            @close="mockClose"
          >
            <template #header>Header slot</template>
            <template #body>
              Last event emitted: {{ lastEvent }}
            </template>
          </sm-expandable-card-body>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // Should not be visible to the users through CSS styles, but the limitation in VTL
    // does not account for styles atm. See https://github.com/vuejs/vue-jest/issues/438
    await waitFor(() => expect(screen.getByText('Last event emitted: none')).toBeVisible())
    // Visually hidden, but it's still in the DOM
    expect(screen.getByRole('region', { hidden: true })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: expandA11yText }))
    await waitFor(() => expect(screen.getByText('Last event emitted: open')).toBeVisible())
    expect(screen.getByRole('region')).toBeInTheDocument()
    expect(mockOpen).toHaveBeenCalledTimes(1)
    expect(mockClose).toHaveBeenCalledTimes(0)

    await userEvent.click(screen.getByRole('button', { name: collapseA11yText }))
    // Should not be visible to the users through CSS styles, but the limitation in VTL
    // does not account for styles atm. See https://github.com/vuejs/vue-jest/issues/438
    await waitFor(() => expect(screen.getByText('Last event emitted: close')).toBeVisible())
    // Visually hidden, but it's still in the DOM
    expect(screen.getByRole('region', { hidden: true })).toBeInTheDocument()
    expect(mockOpen).toHaveBeenCalledTimes(1)
    expect(mockClose).toHaveBeenCalledTimes(1)
  })

  it('should not toggle the body state when header is clicked if customCollapsible is true', async () => {
    // ARRANGE
    const mockOpen = jest.fn()
    const mockClose = jest.fn()
    const ParentComponent = {
      components: { SmExpandableCardBody, SmButton },
      setup: () => {
        const isExpanded = ref(true)
        const lastEvent = ref('none')

        mockClose.mockImplementation(() => {
          lastEvent.value = 'close'
        })

        mockOpen.mockImplementation(() => {
          lastEvent.value = 'open'
        })

        return { isExpanded, lastEvent, mockClose, mockOpen }
      },
      template: `
        <div>
          <sm-expandable-card-body
            :custom-collapsible="true"
            :expanded.sync="isExpanded"
            @open="mockOpen"
            @close="mockClose"
          >
            <template #header>Header slot</template>
            <template #body>
              Last event emitted: {{ lastEvent }}
            </template>
          </sm-expandable-card-body>
          <sm-button @click="isExpanded = !isExpanded">Toggle</sm-button>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Last event emitted: none')).toBeVisible())
    expect(screen.getByRole('region')).toBeInTheDocument()

    // Should not do anything
    await userEvent.click(screen.getByRole('button', { name: collapseA11yText }))
    await waitFor(() => expect(screen.getByText('Last event emitted: close')).toBeVisible())
    expect(screen.getByRole('region')).toBeInTheDocument()
    expect(mockOpen).toHaveBeenCalledTimes(0)
    expect(mockClose).toHaveBeenCalledTimes(1)

    // Should not do anything
    await userEvent.click(screen.getByRole('button', { name: collapseA11yText }))
    await waitFor(() => expect(screen.getByText('Last event emitted: close')).toBeVisible())
    expect(screen.getByRole('region')).toBeInTheDocument()
    expect(mockOpen).toHaveBeenCalledTimes(0)
    expect(mockClose).toHaveBeenCalledTimes(2)

    // Update state outside of the component events
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }))
    await waitFor(() => expect(screen.getByRole('button', { name: expandA11yText })))

    // Should not do anything
    await userEvent.click(screen.getByRole('button', { name: expandA11yText }))
    // Should not be visible to the users through CSS styles, but the limitation in VTL
    // does not account for styles atm. See https://github.com/vuejs/vue-jest/issues/438
    await waitFor(() => expect(screen.getByText('Last event emitted: open')).toBeVisible())
    // Visually hidden, but it's still in the DOM
    expect(screen.getByRole('region', { hidden: true })).toBeInTheDocument()
    expect(mockOpen).toHaveBeenCalledTimes(1)
    expect(mockClose).toHaveBeenCalledTimes(2)

    // Should not do anything
    await userEvent.click(screen.getByRole('button', { name: expandA11yText }))
    // Should not be visible to the users through CSS styles, but the limitation in VTL
    // does not account for styles atm. See https://github.com/vuejs/vue-jest/issues/438
    await waitFor(() => expect(screen.getByText('Last event emitted: open')).toBeVisible())
    // Visually hidden, but it's still in the DOM
    expect(screen.getByRole('region', { hidden: true })).toBeInTheDocument()
    expect(mockOpen).toHaveBeenCalledTimes(2)
    expect(mockClose).toHaveBeenCalledTimes(2)
  })

})
