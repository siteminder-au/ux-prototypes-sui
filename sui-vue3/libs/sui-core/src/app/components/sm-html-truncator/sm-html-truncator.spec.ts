import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'
import SmButton from '../sm-button/sm-button.vue'
import SmHtmlTruncator from './sm-html-truncator.vue'

describe('SmHtmlTruncator', () => {

  it('should render the default slot when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmHtmlTruncator },
      template: `
        <sm-html-truncator>
          <template #default>
            <p>HTML content</p>
            <div role="alert">Some alert to test HTML semantics</div>
          </template>
        </sm-html-truncator>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // jsdom doesn't support layouts and we don't load CSS so the content will always be visible
    expect(await screen.findByText('HTML content')).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('Some alert to test HTML semantics')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should render the less and more slots when provided', async () => {
    // ARRANGE
    const mockLess = jest.fn()
    const mockMore = jest.fn()
    const ParentComponent = {
      components: { SmButton, SmHtmlTruncator },
      setup: () => {
        return { mockLess, mockMore }
      },
      template: `
        <sm-html-truncator @less="mockLess" @more="mockMore">
          <template #default>
            <p>HTML content</p>
            <div role="alert">Some alert to test HTML semantics</div>
          </template>
          <template #less>
            <sm-button type="text" suffix-icon="arrow-up">Read less</sm-button>
          </template>
          <template #more>
            <sm-button type="text" suffix-icon="arrow">Read more</sm-button>
          </template>
        </sm-html-truncator>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // jsdom doesn't support layouts and we don't load CSS so the content will always be visible
    expect(await screen.findByText('HTML content')).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('Some alert to test HTML semantics')
    expect(screen.getByRole('button', { name: 'Read more' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Read less' })).not.toBeInTheDocument()
    expect(mockLess).toHaveBeenCalledTimes(0)
    expect(mockMore).toHaveBeenCalledTimes(0)

    await userEvent.click(screen.getByRole('button', { name: 'Read more' }))

    expect(await screen.findByText('HTML content')).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('Some alert to test HTML semantics')
    expect(screen.getByRole('button', { name: 'Read less' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Read more' })).not.toBeInTheDocument()
    expect(mockLess).toHaveBeenCalledTimes(0)
    expect(mockMore).toHaveBeenCalledTimes(1)

    await userEvent.click(screen.getByRole('button', { name: 'Read less' }))

    expect(await screen.findByText('HTML content')).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('Some alert to test HTML semantics')
    expect(screen.getByRole('button', { name: 'Read more' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Read less' })).not.toBeInTheDocument()
    expect(mockLess).toHaveBeenCalledTimes(1)
    expect(mockMore).toHaveBeenCalledTimes(1)
  })

  it('should should initialize as expanded when prop is set to true', async () => {
    // ARRANGE
    const mockLess = jest.fn()
    const mockMore = jest.fn()
    const ParentComponent = {
      components: { SmButton, SmHtmlTruncator },
      setup: () => {
        return { mockLess, mockMore }
      },
      template: `
        <sm-html-truncator
          height="120px"
          max-height="240px"
          :expanded="true"
          @less="mockLess"
          @more="mockMore"
        >
          <template #default>
            <p>HTML content</p>
            <div role="alert">Some alert to test HTML semantics</div>
          </template>
          <template #less>
            <sm-button type="text" suffix-icon="arrow-up">Read less</sm-button>
          </template>
          <template #more>
            <sm-button type="text" suffix-icon="arrow">Read more</sm-button>
          </template>
        </sm-html-truncator>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // jsdom doesn't support layouts and we don't load CSS so the content will always be visible
    expect(await screen.findByText('HTML content')).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('Some alert to test HTML semantics')
    expect(screen.getByRole('button', { name: 'Read less' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Read more' })).not.toBeInTheDocument()
    expect(mockLess).toHaveBeenCalledTimes(0)
    expect(mockMore).toHaveBeenCalledTimes(0)

    await userEvent.click(screen.getByRole('button', { name: 'Read less' }))

    expect(await screen.findByText('HTML content')).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('Some alert to test HTML semantics')
    expect(screen.getByRole('button', { name: 'Read more' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Read less' })).not.toBeInTheDocument()
    expect(mockLess).toHaveBeenCalledTimes(1)
    expect(mockMore).toHaveBeenCalledTimes(0)

    await userEvent.click(screen.getByRole('button', { name: 'Read more' }))

    expect(await screen.findByText('HTML content')).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('Some alert to test HTML semantics')
    expect(screen.getByRole('button', { name: 'Read less' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Read more' })).not.toBeInTheDocument()
    expect(mockLess).toHaveBeenCalledTimes(1)
    expect(mockMore).toHaveBeenCalledTimes(1)
  })

})
