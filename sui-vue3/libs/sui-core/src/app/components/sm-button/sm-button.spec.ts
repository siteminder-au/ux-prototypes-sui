import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import SmButton from './sm-button.vue'
import { createTestRouter } from '../../../../test/utils'

describe('SmButton', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should set the element as button by default', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton },
      template: `
        <sm-button>Button</sm-button>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const button = screen.getByRole('button', { name: 'Button' })
    await waitFor(() => expect(button).toBeVisible())
    expect(button).toBeEnabled()
    expect(button).toHaveAttribute('type', 'button')
    expect(button).not.toHaveAttribute('href')
  })

  it('should use the router-link if to prop is provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton },
      template: `
        <sm-button to="/test">Router-link button</sm-button>
      `,
    }

    const testRouter = createTestRouter()
    const testRouterSpy = jest.spyOn(testRouter, 'push')

    // ACT
    render(ParentComponent, {
      global: {
        plugins: [testRouter],
      },
    })

    // ASSERT
    // const button = screen.getByRole('link', { name: 'Router-link button' })
    // for some reason the above doesn't work, so we'll use getByText instead.
    // perhaps something to do with the router-link component losing the `link` role?
    const button = screen.getByText('Router-link button')
    await waitFor(() => expect(button).toBeVisible())
    expect(button).toBeEnabled()

    expect(testRouterSpy).toHaveBeenCalledTimes(0)
    await userEvent.click(button)
    await waitFor(() => expect(testRouterSpy).toHaveBeenCalledTimes(1))
    expect(testRouterSpy).toHaveBeenCalledWith('/test')
  })

  it('should set the element as anchor link if href prop is provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton },
      template: `
        <sm-button href="https://external.com">Anchor button</sm-button>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const button = screen.getByRole('link', { name: 'Anchor button' })
    await waitFor(() => expect(button).toBeVisible())
    expect(button).toBeEnabled()
    expect(button).toHaveAttribute('href', 'https://external.com')
    expect(button).not.toHaveAttribute('type')
  })

  it('should set the button as disabled', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton },
      template: `
        <sm-button :disabled="true" :loading="true">Button</sm-button>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('button', { name: 'Button' })).toBeDisabled())
  })

  it('should set the native type to button', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton },
      template: `
        <sm-button native-type="button">Button</sm-button>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('button', { name: 'Button' })).toHaveAttribute('type', 'button'))
  })

  it('should set the native type to submit', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton },
      template: `
        <sm-button native-type="submit">Submit</sm-button>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit'))
  })

  it('should set the native type to reset', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton },
      template: `
        <sm-button native-type="reset">Reset</sm-button>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('button', { name: 'Reset' })).toHaveAttribute('type', 'reset'))
  })

  it('should render the specified prefix icon', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton },
      template: `
        <sm-button prefix-icon="action-edit">Edit</sm-button>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // No discernible name, since they can be added next to text
    expect(await screen.findByRole('img')).toHaveClass('sm-icon') // stubbed
    expect(screen.getByRole('button', { name: 'Edit' })).toBeVisible()
  })

  it('should render the specified suffix icon', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton },
      template: `
        <sm-button suffix-icon="action-lock">Edit</sm-button>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // No discernible name, since they can be added next to text
    expect(await screen.findByRole('img')).toHaveClass('sm-icon') // stubbed
    expect(screen.getByRole('button', { name: 'Edit' })).toBeVisible()
  })

  it('should render the badge slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmButton },
      template: `
        <sm-button>
          Default slot
          <template #badge>
            Badge slot
          </template>
        </sm-button>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('button', { name: 'Default slot Badge slot' })).toBeEnabled())
  })

  it('should emit native events', async () => {
    // ARRANGE
    const mockClick = jest.fn()
      .mockImplementation((payload: MouseEvent) => expect(payload).toBeTruthy())
    const mockMouseDown = jest.fn()
      .mockImplementation((payload: MouseEvent) => expect(payload).toBeTruthy())
    const mockMouseover = jest.fn()
      .mockImplementation((payload: MouseEvent) => expect(payload).toBeTruthy())
    const mockMouseout = jest.fn()
      .mockImplementation((payload: MouseEvent) => expect(payload).toBeTruthy())
    const mockFocusIn = jest.fn()
      .mockImplementation((payload: FocusEvent) => expect(payload).toBeTruthy())
    const mockFocusOut = jest.fn()
      .mockImplementation((payload: FocusEvent) => expect(payload).toBeTruthy())

    const ParentComponent = {
      components: { SmButton },
      setup: () => {
        const nativeEvents = {
          click: mockClick,
          mousedown: mockMouseDown,
          mouseover: mockMouseover,
          mouseout: mockMouseout,
          focusin: mockFocusIn,
          focusout: mockFocusOut,
        }

        return { nativeEvents }
      },
      template: `
        <sm-button v-on="nativeEvents">Button</sm-button>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const button = screen.getByRole('button', { name: 'Button' })
    await waitFor(() => expect(mockClick).toHaveBeenCalledTimes(0))
    expect(mockMouseover).toHaveBeenCalledTimes(0)
    expect(mockMouseout).toHaveBeenCalledTimes(0)
    expect(mockFocusIn).toHaveBeenCalledTimes(0)
    expect(mockFocusOut).toHaveBeenCalledTimes(0)

    await userEvent.click(button)
    await waitFor(() => expect(mockClick).toHaveBeenCalledTimes(1))
    expect(mockMouseover).toHaveBeenCalledTimes(1)
    expect(mockFocusIn).toHaveBeenCalledTimes(1)

    await userEvent.keyboard('[Enter]')
    await waitFor(() => expect(mockClick).toHaveBeenCalledTimes(2))
    expect(mockMouseover).toHaveBeenCalledTimes(1)
    expect(mockFocusIn).toHaveBeenCalledTimes(1)

    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(mockClick).toHaveBeenCalledTimes(3))
    expect(mockMouseover).toHaveBeenCalledTimes(1)
    expect(mockFocusIn).toHaveBeenCalledTimes(1)

    await userEvent.hover(button)
    await waitFor(() => expect(mockMouseover).toHaveBeenCalledTimes(2))
    expect(mockMouseout).toHaveBeenCalledTimes(0)

    await userEvent.unhover(button)
    await waitFor(() => expect(mockMouseover).toHaveBeenCalledTimes(2))
    expect(mockMouseout).toHaveBeenCalledTimes(1)

    await userEvent.click(button)
    await waitFor(() => expect(mockFocusIn).toHaveBeenCalledTimes(1))
    expect(mockFocusOut).toHaveBeenCalledTimes(0)

    // click away
    await userEvent.click(document.body)
    await waitFor(() => expect(mockFocusIn).toHaveBeenCalledTimes(1))
    expect(mockFocusOut).toHaveBeenCalledTimes(1)
  })

  it('should handle custom event-binding', async () => {
    // ARRANGE
    const mockKeydown = jest.fn()
    const ParentComponent = {
      components: { SmButton },
      setup: () => {
        const eventBinding = {
          keydown: mockKeydown,
        }
        return { eventBinding }
      },
      template: `
        <sm-button :event-binding="eventBinding">Button</sm-button>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const button = screen.getByRole('button', { name: 'Button' })
    await userEvent.click(button)
    await waitFor(() => expect(mockKeydown).toHaveBeenCalledTimes(0))

    await userEvent.keyboard('[ArrowDown]')
    await waitFor(() => expect(mockKeydown).toHaveBeenCalledTimes(1))
  })

})
