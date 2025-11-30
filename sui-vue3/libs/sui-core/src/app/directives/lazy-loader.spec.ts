import { render, screen, fireEvent } from '@testing-library/vue'

import LazyLoadDirective from './lazy-loader'

describe('lazy-loader', () => {
  const observe = jest.fn()
  const unobserve = jest.fn()

  const mockIntersectionObserver = (): void => {
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: jest.fn(() => ({
        observe,
        unobserve,
      })),
    })
  }

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  it('should set the CSS classes after a load event', async () => {
    const ParentComponent = {
      directives: {
        lazyload: LazyLoadDirective,
      },
      template: `
      <div v-lazyload>
        <img data-url="foo.png" alt="test-image"/>
        <div class="sm-lazy-image--loading">Loading</div>
      </div>
      `,
    }

    render(ParentComponent)

    expect(screen.getByText('Loading')).toBeInTheDocument()

    await fireEvent.load(screen.getByAltText('test-image'))
    jest.advanceTimersByTime(600)

    expect(screen.queryByText('Loading')).not.toBeInTheDocument()
  })

  it('should set the CSS classes after an error event', async () => {
    const ParentComponent = {
      directives: {
        lazyload: LazyLoadDirective,
      },
      template: `
      <div v-lazyload data-testid="test-element">
        <img data-url="foo.png" alt="test-image"/>
        <div class="sm-lazy-image--loading">Loading</div>
      </div>
      `,
    }

    render(ParentComponent)

    expect(screen.getByText('Loading')).toBeInTheDocument()
    expect(screen.getByTestId('test-element')).not.toHaveClass('sm-lazy-image--loaded-error')

    await fireEvent.error(screen.getByAltText('test-image'))

    jest.advanceTimersByTime(600)

    expect(screen.queryByText('Loading')).not.toBeInTheDocument()
    expect(screen.getByTestId('test-element')).toHaveClass('sm-lazy-image--loaded-error')
  })

  it('should not lazily load the image if there is no img element', () => {
    const ParentComponent = {
      directives: {
        lazyload: LazyLoadDirective,
      },
      template: `
      <div v-lazyload data-testid="test-element">
        <div />
      </div>
      `,
    }

    render(ParentComponent)

    expect(screen.getByTestId('test-element')).not.toHaveClass('sm-lazy-image--loaded')
  })

  it('should set the image source as background', () => {
    const ParentComponent = {
      directives: {
        lazyload: LazyLoadDirective,
      },
      template: `
      <div v-lazyload type="background" data-testid="test-element">
        <img data-url="foo.png" alt="test-image"/>
        <div class="sm-lazy-image--loading">Loading</div>
      </div>
      `,
    }

    render(ParentComponent)

    expect(screen.getByTestId('test-element')).toHaveStyle({ backgroundImage: 'url(foo.png)' })
  })

  it('should create an observer if IntersectionObserver is available', () => {
    mockIntersectionObserver()

    const ParentComponent = {
      directives: {
        lazyload: LazyLoadDirective,
      },
      template: `
      <div v-lazyload>
        <img data-url="foo.png" alt="test-image"/>
        <div class="sm-lazy-image--loading">Loading</div>
      </div>
      `,
    }

    render(ParentComponent)

    expect(observe).toHaveBeenCalledTimes(1)
  })
})
