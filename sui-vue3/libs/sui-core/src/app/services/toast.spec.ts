import { screen, waitFor } from '@testing-library/vue'
import { toastService } from './toast'

describe('toastService', () => {

  // Fake timers using Jest
  beforeEach(() => {
    jest.useFakeTimers()
  })

  // See: https://testing-library.com/docs/using-fake-timers/
  // Running all pending timers and switching to real timers using Jest
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should display the toast component when the service is called', async () => {
    // Initial state
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())

    // Call the service which will open the toast
    const toastInstance = toastService({
      title: 'Test title',
      message: 'Test message',
    })

    await waitFor(() => expect(screen.getByRole('alert')).toBeVisible())
    expect(screen.getByRole('heading', { level: 4, name: 'Test title' })).toBeVisible()
    expect(screen.getByText('Test message')).toBeVisible()

    // Advance the timer by the `open` delay
    jest.advanceTimersByTime(16)

    // Keeping the class assertion since this adds the transition which we can't test in Percy
    expect(document.body.getElementsByClassName('sm-toast--in').length).toBe(1)

    // Close via public method
    toastInstance.close()

    // Keeping the class assertion since this adds the transition which we can't test in Percy
    expect(document.body.getElementsByClassName('sm-toast--in').length).toBe(0)

    // Advance the timer by the default `close` delay
    jest.advanceTimersByTime(600)

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
    expect(screen.queryByRole('heading', { level: 4, name: 'Test title' })).not.toBeInTheDocument()
    expect(screen.queryByText('Test message')).not.toBeInTheDocument()
  })

  it('should auto-close the toast after the provided timeout', async () => {
    // Initial state
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())

    // Call the service which will open the toast
    toastService({
      title: 'Test title',
      message: 'Test message',
      timeout: 2000,
    })

    await waitFor(() => expect(screen.getByRole('alert')).toBeVisible())
    expect(screen.getByRole('heading', { level: 4, name: 'Test title' })).toBeVisible()
    expect(screen.getByText('Test message')).toBeVisible()

    // Advance the timer by the `close` delay + specified timeout
    jest.advanceTimersByTime(2600)

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
    expect(screen.queryByRole('heading', { level: 4, name: 'Test title' })).not.toBeInTheDocument()
    expect(screen.queryByText('Test message')).not.toBeInTheDocument()
  })

  it('should not auto-close the toast when timeout is set to 0', async () => {
    // Initial state
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())

    // Call the service which will open the toast
    toastService({
      title: 'Test title',
      message: 'Test message',
      timeout: 0,
    })

    await waitFor(() => expect(screen.getByRole('alert')).toBeVisible())
    expect(screen.getByRole('heading', { level: 4, name: 'Test title' })).toBeVisible()
    expect(screen.getByText('Test message')).toBeVisible()

    // Advance the timer by the default `close` delay + buffer time for good measure
    jest.advanceTimersByTime(650)

    await waitFor(() => expect(screen.getByRole('alert')).toBeVisible())
    expect(screen.getByRole('heading', { level: 4, name: 'Test title' })).toBeVisible()
    expect(screen.getByText('Test message')).toBeVisible()
  })

})
