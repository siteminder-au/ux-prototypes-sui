import { render, screen, waitFor } from '@testing-library/vue'
import SmHelpCard from './sm-help-card.vue'

describe('SmHelpCard', () => {

  it('should display the header slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmHelpCard },
      template: `
        <sm-help-card>
          <template #header>Header slot</template>
        </sm-help-card>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Header slot')).toBeVisible())
  })

  it('should display the body slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmHelpCard },
      template: `
        <sm-help-card>
          <template #body>Body slot</template>
        </sm-help-card>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Body slot')).toBeVisible())
  })

  it('should display the header and body slots', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmHelpCard },
      template: `
        <sm-help-card>
          <template #header>Header slot</template>
          <template #body>Body slot</template>
        </sm-help-card>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Header slot')).toBeVisible())
    expect(screen.getByText('Body slot')).toBeVisible()
  })
})
