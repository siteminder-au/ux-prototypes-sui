import { render, screen, waitFor } from '@testing-library/vue'
import SmFieldLabel from './sm-field-label.vue'

describe('SmFieldLabel', () => {

  it('should not display a required asterisk when required prop is false', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmFieldLabel },
      template: `
        <div>
          <sm-field-label for="test-input">Test label</sm-field-label>
          <input id="test-input">
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Test label')).toBeVisible())
    expect(screen.getByRole('textbox', { name: 'Test label' })) // Should attach discernible name via for attribute
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('should display a required asterisk when required prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmFieldLabel },
      template: `
        <div>
          <sm-field-label
            for="test-input"
            required
            :state="{ touched: true, valid: true }"
          >
            Test label
          </sm-field-label>
          <input id="test-input">
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Test label')).toBeVisible())
    expect(screen.getByText('*')).toBeVisible()
    // Should attach a discernible name via the native label behavior with `for` attribute
    expect(screen.getByRole('textbox', { name: 'Test label' })).toBeVisible()
  })

  it('should set element based on the tag prop', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmFieldLabel },
      template: `
        <div>
          <sm-field-label
            for="test-input"
            tag="span"
            :focussed="true"
            :required="true"
            :state="{ touched: true, focused: true, success: true }"
          >
            Test label
          </sm-field-label>
          <input id="test-input">
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Test label')).toBeVisible())
    expect(screen.getByText('*')).toBeVisible()
    // Should not attach a discernible name since it's not longer a native label element
    expect(screen.getByRole('textbox', { name: '' })).toBeVisible()
  })

})
