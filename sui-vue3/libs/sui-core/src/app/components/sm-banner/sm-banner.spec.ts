import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { ref } from 'vue'
import SmBanner from './sm-banner.vue'
import SmButton from '../sm-button/sm-button.vue'

describe('SmBanner', () => {

  it('should display a status banner if type prop is info or success', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmBanner },
      template: `
        <div>
          <sm-banner title="Info type" type="info" :visible="true" />
          <sm-banner title="Success type" type="success" :visible="true" />
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getAllByRole('status')[0]).toBeVisible())
    expect(screen.getByRole('heading', { level: 6, name: 'Info type' })).toBeVisible()

    expect(screen.getAllByRole('status')[1]).toBeVisible()
    expect(screen.getByRole('heading', { level: 6, name: 'Success type' })).toBeVisible()
  })

  it('should display a alert banner if type prop is alert or warning', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmBanner },
      template: `
        <div>
          <sm-banner title="Alert type" type="alert" :visible="true" />
          <sm-banner title="Warning type" type="warning" :visible="true" />
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getAllByRole('alert')[0]).toBeVisible())
    expect(screen.getByRole('heading', { level: 6, name: 'Alert type' })).toBeVisible()

    expect(screen.getAllByRole('alert')[1]).toBeVisible()
    expect(screen.getByRole('heading', { level: 6, name: 'Warning type' })).toBeVisible()
  })

  it('should toggle the visibility when visible prop changes', async () => {
    // ARRANGE
    const closeMock = jest.fn()
    const openMock = jest.fn()
    const ParentComponent = {
      components: { SmBanner, SmButton },
      setup: () => {
        const isVisible = ref(true)

        return { isVisible, closeMock, openMock }
      },
      template: `
        <div>
          <!-- Vue3 syntax requires v-model:visible rather than visible.sync -->
          <sm-banner
            title="Banner title"
            :show-close="true"
            v-model:visible="isVisible"
            @close="closeMock"
            @open="openMock"
          />
          <sm-button @click="isVisible = !isVisible">Toggle visibility</sm-button>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    const banner = screen.getByRole('status')
    const title = screen.getByRole('heading', { level: 6, name: 'Banner title' })
    const close = screen.getByRole('button', { name: 'Click to close' })
    const toggle = screen.getByRole('button', { name: 'Toggle visibility' })

    // ASSERT
    await waitFor(() => expect(banner).toBeVisible())
    expect(title).toBeVisible()
    expect(close).toBeVisible()
    expect(openMock).toHaveBeenCalledTimes(1) // watchEffect emits right away
    expect(closeMock).toHaveBeenCalledTimes(0)

    // Close via prop change
    await userEvent.click(toggle)

    await waitFor(() => expect(banner).not.toBeVisible())
    expect(title).not.toBeVisible()
    expect(close).not.toBeVisible()
    expect(banner).toBeInTheDocument()
    expect(openMock).toHaveBeenCalledTimes(1)
    expect(closeMock).toHaveBeenCalledTimes(1)

    // Open via prop change
    await userEvent.click(toggle)

    await waitFor(() => expect(banner).toBeVisible())
    expect(title).toBeVisible()
    expect(close).toBeVisible()
    expect(banner).toBeInTheDocument()
    expect(openMock).toHaveBeenCalledTimes(2)
    expect(closeMock).toHaveBeenCalledTimes(1)

    // Close via built-in button
    await userEvent.click(close)

    // Assert visibility
    await waitFor(() => expect(banner).not.toBeVisible())
    expect(title).not.toBeVisible()
    expect(close).not.toBeVisible()
    expect(banner).toBeInTheDocument()
    expect(openMock).toHaveBeenCalledTimes(2)
    expect(closeMock).toHaveBeenCalledTimes(2)
  })

  it('should call the provided beforeClose function when closing the banner', async () => {
    // ARRANGE
    const beforeCloseMock = jest.fn().mockImplementation((close) => {
      // Do something then close the banner
      close()
    })
    const closeMock = jest.fn()
    const ParentComponent = {
      components: { SmBanner },
      setup: () => {
        const isVisible = ref(true)

        return { isVisible, beforeCloseMock, closeMock }
      },
      template: `
        <!-- Vue3 syntax requires v-model:visible rather than visible.sync -->
        <sm-banner
          title="Banner title"
          :before-close="beforeCloseMock"
          :show-close="true"
          v-model:visible="isVisible"
          @close="closeMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    const banner = screen.getByRole('status')
    const title = screen.getByRole('heading', { level: 6, name: 'Banner title' })
    const close = screen.getByRole('button', { name: 'Click to close' })

    // ASSERT
    await waitFor(() => expect(banner).toBeVisible())
    expect(title).toBeVisible()
    expect(close).toBeVisible()
    expect(beforeCloseMock).toHaveBeenCalledTimes(0)
    expect(closeMock).toHaveBeenCalledTimes(0)

    // Close via built-in button
    await userEvent.click(close)

    // Assert visibility
    await waitFor(() => expect(banner).not.toBeVisible())
    expect(title).not.toBeVisible()
    expect(close).not.toBeVisible()
    expect(banner).toBeInTheDocument()
    expect(beforeCloseMock).toHaveBeenCalledTimes(1)
    expect(closeMock).toHaveBeenCalledTimes(1)
  })

  it('should close right away if beforeClose prop is nullified', async () => {
    // ARRANGE
    const closeMock = jest.fn()
    const ParentComponent = {
      components: { SmBanner },
      setup: () => {
        const isVisible = ref(true)

        return { isVisible, closeMock }
      },
      template: `
        <!-- Vue3 syntax requires v-model:visible rather than visible.sync -->
        <sm-banner
          title="Banner title"
          :before-close="null"
          :show-close="true"
          v-model:visible="isVisible"
          @close="closeMock"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    const banner = screen.getByRole('status')
    const title = screen.getByRole('heading', { level: 6, name: 'Banner title' })
    const close = screen.getByRole('button', { name: 'Click to close' })

    // ASSERT
    await waitFor(() => expect(banner).toBeVisible())
    expect(title).toBeVisible()
    expect(close).toBeVisible()
    expect(closeMock).toHaveBeenCalledTimes(0)

    // Close via built-in button
    await userEvent.click(close)

    // Assert visibility
    await waitFor(() => expect(banner).not.toBeVisible())
    expect(title).not.toBeVisible()
    expect(close).not.toBeVisible()
    expect(banner).toBeInTheDocument()
    expect(closeMock).toHaveBeenCalledTimes(1)
  })

  it('should render the default slot when available and there is no title prop', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmBanner },
      template: `
        <div>
          <sm-banner :visible="true">Default slot</sm-banner>
          <sm-banner title="Title prop" type="alert" :visible="true">Should not render</sm-banner>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('status')).toBeVisible())
    expect(screen.queryByRole('heading', { level: 6, name: 'Default slot' })).not.toBeInTheDocument()
    expect(screen.getByText('Default slot')).toBeVisible()

    expect(screen.getByRole('heading', { level: 6, name: 'Title prop' })).toBeVisible()
    expect(screen.queryByText('Should not render')).not.toBeInTheDocument()
  })

  it('should render the action slot when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmBanner },
      template: `
        <sm-banner
          custom-class="my-class"
          type="alert"
          text-align="end"
          :show-icon="false"
          :show-on-top="true"
          :visible="true"
        >
          <template #action>Action slot</template>
        </sm-banner>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('alert')).toBeVisible())
    expect(screen.getByText('Action slot')).toBeVisible()
  })

})
