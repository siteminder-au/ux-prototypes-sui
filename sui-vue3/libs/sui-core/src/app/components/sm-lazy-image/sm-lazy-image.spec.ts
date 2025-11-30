import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import SmLazyImage from './sm-lazy-image.vue'

describe('SmLazyImage', () => {

  it('should render the component with type native', () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmLazyImage },
      template: `
        <sm-lazy-image src="/foo.png" alt="Test lazy" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(screen.getByAltText('Test lazy')).toBeInTheDocument()
    expect(screen.getByAltText<HTMLImageElement>('Test lazy')).toHaveAttribute('src', '/foo.png')
  })

  it('should render the component with type background', () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmLazyImage },
      template: `
        <sm-lazy-image src="/foo.png" alt="Test lazy" type='background' />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(screen.getAllByRole('img').at(0)).toHaveStyle({ backgroundImage: 'url(/foo.png)' })
  })

  it('should render an error message when it fails to load the image', () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmLazyImage },
      template: `
        <sm-lazy-image src="/foo.png" alt="Test lazy" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(screen.getByText('Image has failed to load')).toBeVisible()
  })

  it('should emit click event when the image is clicked', async () => {
    // ARRANGE
    const mockClick = jest.fn()
    const ParentComponent = {
      components: { SmLazyImage },
      setup: () => {
        return { mockClick }
      },
      template: `
        <sm-lazy-image src="/foo.png" alt="Test lazy" @click="mockClick" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const lazyImage = screen.getByAltText('Test lazy')
    expect(lazyImage).toBeInTheDocument()
    expect(lazyImage).toHaveAttribute('src', '/foo.png')
    expect(mockClick).toHaveBeenCalledTimes(0)

    await userEvent.click(lazyImage)

    expect(mockClick).toHaveBeenCalledTimes(1)
    expect(mockClick).toHaveBeenCalledWith(expect.any(MouseEvent))
  })

})
