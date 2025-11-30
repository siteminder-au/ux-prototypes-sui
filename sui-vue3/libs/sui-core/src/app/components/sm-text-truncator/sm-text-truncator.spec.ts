import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import SmTextTruncator from './sm-text-truncator.vue'

describe('SmTextTruncator', () => {

  const originalClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight')

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { ...originalClientHeight })
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should render the default slot content', async () => {
    // ARRANGE
    // jsdom doesn't support layouts, we mock the clientHeight to simulate the truncation
    // The value 22 is for a single line of text
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 22 })

    const ParentComponent = {
      components: { SmTextTruncator },
      template: `
        <sm-text-truncator>
          Text content
        </sm-text-truncator>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Text content')).toBeVisible())
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should display the default read more and read less buttons if content is truncated', async () => {
    // ARRANGE
    // jsdom doesn't support layouts, we mock the clientHeight to simulate the truncation
    // The value 100 is for multiple lines of text
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 100 })

    const mockHide = jest.fn()
    const mockShow = jest.fn()

    const ParentComponent = {
      components: { SmTextTruncator },
      setup: () => {
        return { mockHide, mockShow }
      },
      template: `
        <!-- Note: the text length doesn't matter here since we don't actually render it in a browser -->
        <sm-text-truncator
          :clamp-line="1"
          @hide="mockHide"
          @show="mockShow"
        >
          Text content
        </sm-text-truncator>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Text content')).toBeVisible())
    expect(screen.getByRole('button', { name: 'Read more' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Read less' })).not.toBeInTheDocument()
    expect(mockHide).toHaveBeenCalledTimes(0)
    expect(mockShow).toHaveBeenCalledTimes(0)

    await userEvent.click(screen.getByRole('button', { name: 'Read more' }))

    await waitFor(() => expect(screen.getByText('Text content')).toBeVisible())
    expect(screen.queryByRole('button', { name: 'Read more' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Read less' })).toBeVisible()
    expect(mockHide).toHaveBeenCalledTimes(0)
    expect(mockShow).toHaveBeenCalledTimes(1)

    await userEvent.click(screen.getByRole('button', { name: 'Read less' }))

    await waitFor(() => expect(screen.getByText('Text content')).toBeVisible())
    expect(screen.getByRole('button', { name: 'Read more' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Read less' })).not.toBeInTheDocument()
    expect(mockHide).toHaveBeenCalledTimes(1)
    expect(mockShow).toHaveBeenCalledTimes(1)
  })

  it('should display the provided button text if content is truncated', async () => {
    // ARRANGE
    // jsdom doesn't support layouts, we mock the clientHeight to simulate the truncation
    // The value 100 is for multiple lines of text
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 100 })

    const mockHide = jest.fn()
    const mockShow = jest.fn()

    const ParentComponent = {
      components: { SmTextTruncator },
      setup: () => {
        return { mockHide, mockShow }
      },
      template: `
        <!-- Note: the text length doesn't matter here since we don't actually render it in a browser -->
        <sm-text-truncator
          show-more-text="Show more"
          show-less-text="Show less"
          clamp-line="1"
          @hide="mockHide"
          @show="mockShow"
        >
          Text content
        </sm-text-truncator>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Text content')).toBeVisible())
    expect(screen.getByRole('button', { name: 'Show more' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Show less' })).not.toBeInTheDocument()
    expect(mockHide).toHaveBeenCalledTimes(0)
    expect(mockShow).toHaveBeenCalledTimes(0)

    await userEvent.click(screen.getByRole('button', { name: 'Show more' }))

    await waitFor(() => expect(screen.getByText('Text content')).toBeVisible())
    expect(screen.queryByRole('button', { name: 'Show more' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show less' })).toBeVisible()
    expect(mockHide).toHaveBeenCalledTimes(0)
    expect(mockShow).toHaveBeenCalledTimes(1)
  })

})
