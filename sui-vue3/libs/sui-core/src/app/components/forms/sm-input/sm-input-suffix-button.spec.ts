import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import SmInputSuffixButton from './sm-input-suffix-button.vue'

describe('SmInputSuffixButton', () => {

  it('should render the default slot content', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmInputSuffixButton },
      template: `
        <sm-input-suffix-button>
          Default slot
        </sm-input-suffix-button>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Default slot')).toBeVisible())
  })

  it('should emit click event when the suffix button is clicked', async () => {
    // ARRANGE
    const mockClick = jest.fn()

    const ParentComponent = {
      components: { SmInputSuffixButton },
      setup: () => {
        return { mockClick }
      },
      template: `
        <sm-input-suffix-button @click="mockClick">
          Default slot
        </sm-input-suffix-button>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const suffixButton = screen.getByText('Default slot')
    await waitFor(() => expect(suffixButton).toBeVisible())
    expect(mockClick).toHaveBeenCalledTimes(0)

    await userEvent.click(suffixButton)

    expect(mockClick).toHaveBeenCalledTimes(1)
    expect(mockClick).toHaveBeenCalledWith(expect.any(MouseEvent))
  })

})
