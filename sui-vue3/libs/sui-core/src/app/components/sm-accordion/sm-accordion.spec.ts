import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { ref } from 'vue'
import SmAccordionGraphic from './sm-accordion-graphic.vue'
import SmAccordion from './sm-accordion.vue'

describe('SmAccordion', () => {

  const collapseA11yText = 'Click to collapse the panel'
  const expandA11yText = 'Click to expand the panel'

  it('should toggle the expanded state through expanded and collapsed events', async () => {
    // ARRANGE
    const mockExpand = jest.fn()
    const mockCollapse = jest.fn()
    const ParentComponent = {
      components: { SmAccordion },
      setup: () => {
        const isExpanded = ref(false)

        mockCollapse.mockImplementation(() => {
          isExpanded.value = false
        })

        mockExpand.mockImplementation(() => {
          isExpanded.value = true
        })

        return { isExpanded, mockCollapse, mockExpand }
      },
      template: `
        <sm-accordion :expanded="isExpanded" @expanded="mockExpand" @collapse="mockCollapse">
          <template #header><h4>Header slot</h4></template>
          <template #default>Default slot</template>
        </sm-accordion>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('heading', { level: 4, name: 'Header slot' })).toBeVisible())
    expect(screen.getByRole('button', { name: expandA11yText })).toBeVisible()
    // Visually hidden, but it's still in the DOM
    expect(screen.getByRole('region', { hidden: true })).toBeInTheDocument()
    // Should not be visible to the users through CSS styles, but the limitation in VTL
    // does not account for styles atm. See https://github.com/vuejs/vue-jest/issues/438
    expect(screen.getByText('Default slot')).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: expandA11yText }))

    await waitFor(() => expect(screen.getByRole('button', { name: collapseA11yText })).toBeVisible())
    expect(screen.getByRole('region', { hidden: false })).toBeInTheDocument()
    expect(screen.getByText('Default slot')).toBeVisible()
    expect(mockExpand).toHaveBeenCalledTimes(1)
    expect(mockCollapse).toHaveBeenCalledTimes(0)

    await userEvent.click(screen.getByRole('button', { name: collapseA11yText }))

    await waitFor(() => expect(screen.getByRole('button', { name: expandA11yText })).toBeVisible())
    // Visually hidden, but it's still in the DOM
    expect(screen.getByRole('region', { hidden: true })).toBeInTheDocument()
    // Should not be visible to the users through CSS styles, but the limitation in VTL
    // does not account for styles atm. See https://github.com/vuejs/vue-jest/issues/438
    expect(screen.getByText('Default slot')).toBeVisible()
    expect(mockExpand).toHaveBeenCalledTimes(1)
    expect(mockCollapse).toHaveBeenCalledTimes(1)
  })

  it('should render the fixed slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmAccordion },
      template: `
        <sm-accordion :expanded="true">
          <template #fixed><h3>Fixed slot</h3></template>
          <template #header><h4>Header slot</h4></template>
          <template #default>Default slot</template>
        </sm-accordion>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('heading', { level: 3, name: 'Fixed slot' })).toBeVisible())
    expect(screen.getByRole('heading', { level: 4, name: 'Header slot' })).toBeVisible()
    expect(screen.getByRole('button', { name: collapseA11yText })).toBeVisible()
    expect(screen.getByRole('region', { hidden: false })).toBeInTheDocument()
    expect(screen.getByText('Default slot')).toBeVisible()
  })

  it('should render the accordion-graphic', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmAccordion, SmAccordionGraphic },
      template: `
        <sm-accordion>
          <template #header>
            <sm-accordion-graphic src="test.png" alt="Test hotel" />
          </template>
          <template #default>Default slot</template>
        </sm-accordion>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('img', { name: 'Test hotel' })).toBeVisible())
    expect(screen.getByRole('button', { name: expandA11yText })).toBeVisible()
    // Visually hidden, but it's still in the DOM
    expect(screen.getByRole('region', { hidden: true })).toBeInTheDocument()
    // Should not be visible to the users through CSS styles, but the limitation in VTL
    // does not account for styles atm. See https://github.com/vuejs/vue-jest/issues/438
    expect(screen.getByText('Default slot')).toBeVisible()
  })

})
