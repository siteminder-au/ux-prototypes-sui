import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import SmToast from './sm-toast.vue'

describe('SmToast', () => {

  it('should not add the close button when showClose prop is set to false', async () => {
    // ARRANGE
    const props = {
      showClose: false,
    }

    // ACT
    render(SmToast, {
      props,
    })

    // ASSERT
    const closeButton = screen.queryByRole('button', { name: 'Click to close' })
    await waitFor(() => expect(closeButton).not.toBeInTheDocument())
  })

  it('should add the close button when showClose prop is set to true', async () => {
    // ARRANGE
    const props = {
      showClose: true,
    }

    // ACT
    render(SmToast, {
      props,
    })

    // ASSERT
    const closeButton = screen.getByRole('button', { name: 'Click to close' })
    await waitFor(() => expect(closeButton).toBeVisible())
  })

  it('should emit close event when built-in close button is clicked', async () => {
    // ARRANGE
    const closeMock = jest.fn()

    const ParentComponent = {
      components: { SmToast },
      setup: () => {
        return { closeMock }
      },
      template: `
        <sm-toast message="Info" type="info" :show-close="true" @close="closeMock" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const closeButton = screen.getByRole('button', { name: 'Click to close' })
    await waitFor(() => expect(closeButton).toBeVisible())
    expect(closeMock).toHaveBeenCalledTimes(0)

    await userEvent.click(closeButton)
    expect(closeMock).toHaveBeenCalledTimes(1)
  })

  it('should add the title element if prop is provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmToast },
      template: `
        <sm-toast message="Info" title="test-title" type="info" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const titleText = screen.getByText('test-title')
    await waitFor(() => expect(titleText).toBeVisible())
  })

  it('should add the message element if prop is provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmToast },
      template: `
        <sm-toast message="Info" title="test-title" type="info"/>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const infoText = screen.getByText('Info')
    await waitFor(() => expect(infoText).toBeVisible())
  })

  it('should render the default slot if provided', async () => {
    const ParentComponent = {
      components: { SmToast },
      template: `
        <sm-toast message="Info" title="test-title" type="info">
          Default slot
        </sm-toast>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findByText('Default slot')).toBeVisible()
    // Message and title will not be rendered in case of default slot
    expect(screen.queryByText('Info')).not.toBeInTheDocument()
    expect(screen.queryByText('test-title')).not.toBeInTheDocument()
  })

  it('should render the action slot if provided', async () => {
    const ParentComponent = {
      components: { SmToast },
      template: `
        <sm-toast message="Info" title="test-title" type="info">
          <template #action>
            Action slot
          </template>
        </sm-toast>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findByText('Info')).toBeVisible()
    expect(screen.getByText('Action slot')).toBeVisible()
  })

  describe('timeout', () => {

    // see: https://testing-library.com/docs/using-fake-timers/
    // Fake timers using Jest
    beforeEach(() => {
      jest.useFakeTimers()
      // Clear mock calls, instances, contexts and results before every test
      jest.clearAllMocks()
    })

    // see: https://testing-library.com/docs/using-fake-timers/
    // clearing all timers after each test
    afterEach(() => {
      jest.clearAllTimers()
    })

    it('should emit close event after the timeout if prop is provided', async () => {
      // ARRANGE
      const closeMock = jest.fn()
      const timeout = 200

      const ParentComponent = {
        components: { SmToast },
        setup: () => {
          return { timeout, closeMock }
        },
        template: `
          <sm-toast
            message="Info"
            title="test-title"
            type="info"
            :is-timeout="true"
            :timeout="timeout"
            @close="closeMock"
          />
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(await screen.findByText('Info')).toBeVisible()
      expect(closeMock).toHaveBeenCalledTimes(0)

      // Executes the macro task queue (i.e. all tasks queued by setTimeout() or setInterval() and setImmediate()).
      jest.advanceTimersByTime(timeout)

      expect(closeMock).toHaveBeenCalledTimes(1)
    })

    it('should not emit close event if isTimeout is true and close button is available', async () => {
      // ARRANGE
      const closeMock = jest.fn()
      const timeout = 200

      const ParentComponent = {
        components: { SmToast },
        setup: () => {
          return { timeout, closeMock }
        },
        template: `
          <sm-toast
            message="Info"
            title="test-title"
            type="info"
            :show-close="true"
            :is-timeout="true"
            :timeout="200"
            @close="closeMock"
          />
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(await screen.findByText('Info')).toBeVisible()
      expect(closeMock).toHaveBeenCalledTimes(0)

      // Executes the macro task queue (i.e. all tasks queued by setTimeout() or setInterval() and setImmediate()).
      jest.advanceTimersByTime(timeout)

      expect(closeMock).toHaveBeenCalledTimes(0)
    })

    it('should not emit close event if isTimeout is false', async () => {
      // ARRANGE
      const closeMock = jest.fn()

      const ParentComponent = {
        components: { SmToast },
        setup: () => {
          return { closeMock }
        },
        template: `
          <sm-toast
            message="Info"
            title="test-title"
            type="info"
            :is-timeout="false"
            @close="closeMock"
          />
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(await screen.findByText('Info')).toBeVisible()
      expect(closeMock).toHaveBeenCalledTimes(0)

      // Executes the macro task queue (i.e. all tasks queued by setTimeout() or setInterval() and setImmediate()).
      jest.advanceTimersByTime(5000) // default toast timeout

      expect(closeMock).toHaveBeenCalledTimes(0)
    })

  })

})
