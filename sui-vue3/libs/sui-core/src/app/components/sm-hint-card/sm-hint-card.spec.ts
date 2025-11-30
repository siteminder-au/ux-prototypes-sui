import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import SmHintCard from './sm-hint-card.vue'

describe('SmHintCard', () => {

  it('should display the title prop when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmHintCard },
      template: `
        <sm-hint-card title="Some title" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Some title')).toBeVisible())
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should render the title as the title-tag prop when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmHintCard },
      template: `
        <sm-hint-card title="Some heading" title-tag="h2" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('heading', { level: 2, name: 'Some heading' })).toBeVisible())
  })

  it('should render the title slot when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmHintCard },
      template: `
        <sm-hint-card title="title-prop">
          <template #title>title-slot</template>
        </sm-hint-card>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('title-slot')).toBeVisible())
    expect(screen.queryByText('title-prop')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should display the body prop when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmHintCard },
      template: `
        <sm-hint-card body="Some body content" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Some body content')).toBeVisible())
  })

  it('should render the body slot when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmHintCard },
      template: `
        <sm-hint-card body="body-prop">
          <template #body>body-slot</template>
        </sm-hint-card>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('body-slot')).toBeVisible())
    expect(screen.queryByText('body-prop')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should not display the close button by default', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmHintCard },
      template: `
        <sm-hint-card title="Some title" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Click to close' })).not.toBeInTheDocument())
    expect(screen.getByText('Some title')).toBeVisible()
  })

  it('should display the close button when the show-close prop is true', async () => {
    // ARRANGE
    const mockClose = jest.fn()

    const ParentComponent = {
      components: { SmHintCard },
      setup: () => ({ mockClose }),
      template: `
        <sm-hint-card title="Some title" :show-close="true" @close="mockClose" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const closeButton = await screen.findByRole('button', { name: 'Click to close' })
    expect(closeButton).toBeVisible()
    expect(closeButton).toBeEnabled()
    expect(mockClose).toHaveBeenCalledTimes(0)
    expect(screen.getByText('Some title')).toBeVisible()

    await userEvent.click(closeButton)

    expect(mockClose).toHaveBeenCalledTimes(1)
  })

  it('should display the action button based on the config when provided', async () => {
    // ARRANGE
    const mockClick = jest.fn()

    const ParentComponent = {
      components: { SmHintCard },
      setup: () => ({ mockClick }),
      template: `
        <sm-hint-card
          :action-button="{
            id: 'pass-through-id',
            label: 'Action button',
            suffixIcon: 'arrow-go-forward',
            size: 'small',
            type: 'warning',
            onClick: () => mockClick(),
          }"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const actionButton = await screen.findByRole('button', { name: 'Action button' })
    expect(actionButton).toBeVisible()
    expect(actionButton).toBeEnabled()
    expect(actionButton).toHaveAttribute('id', 'pass-through-id')
    expect(mockClick).toHaveBeenCalledTimes(0)

    await userEvent.click(actionButton)

    expect(mockClick).toHaveBeenCalledTimes(1)
  })

  it('should render the action slot when provided', async () => {
    // ARRANGE
    const mockClick = jest.fn()

    const ParentComponent = {
      components: { SmHintCard },
      setup: () => ({ mockClick }),
      template: `
        <sm-hint-card
          :action-button="{
            label: 'action-button-prop',
            href: 'https://www.siteminder.com/',
          }"
        >
          <template #action>
            <button @click="mockClick">action-slot-button</button>
          </template>
        </sm-hint-card>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const actionButton = await screen.findByRole('button', { name: 'action-slot-button' })
    expect(actionButton).toBeVisible()
    expect(actionButton).toBeEnabled()
    expect(mockClick).toHaveBeenCalledTimes(0)
    expect(screen.queryByRole('button', { name: 'action-button-prop' })).not.toBeInTheDocument()

    await userEvent.click(actionButton)

    expect(mockClick).toHaveBeenCalledTimes(1)
  })

})
