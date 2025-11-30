import { render, screen, waitFor } from '@testing-library/vue'
import SmBadge from './sm-badge.vue'

describe('SmBadge', () => {

  it('should render the default slot content', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmBadge },
      template: `
        <div>
          <sm-badge aria-label="New notifications" />
          <sm-badge type="alert" size="large">Large alert</sm-badge>
          <sm-badge :disabled="true">Disabled</sm-badge>
          <sm-badge light-theme-type="info">Light</sm-badge>
          <sm-badge light-theme-type="alert" :disabled="true">Light disabled</sm-badge>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByLabelText('New notifications')).toBeVisible())
    expect(screen.getByText('Large alert')).toBeVisible()
    expect(screen.getByText('Disabled')).toBeVisible()
    expect(screen.getByText('Light')).toBeVisible()
    expect(screen.getByText('Light disabled')).toBeVisible()
  })

})
