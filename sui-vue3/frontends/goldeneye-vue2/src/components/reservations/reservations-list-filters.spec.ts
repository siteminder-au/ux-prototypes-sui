import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import ReservationsListFilters from './reservations-list-filters.vue'

describe('reservations list filters', () => {

  // When jest.useFakeTimers() is used, we need to configure userEvent package
  // such that it is aware that fake timers are used.
  // this is after upgrading user-event package to v14+
  // see: https://github.com/testing-library/user-event/issues/833
  const userEventInstance = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

  // See: https://testing-library.com/docs/using-fake-timers/
  // Fake timers using Jest
  beforeEach(() => {
    // We use fake timers here so interacting with the date picker is more
    // stable. The picker has debounce and timeouts that can cause flakiness
    // when interacting with it
    jest.useFakeTimers()
  })

  // See: https://testing-library.com/docs/using-fake-timers/
  // Running all pending timers and switching to real timers using Jest
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should display the initial state of the form fields and buttons', async () => {
    render(
      ReservationsListFilters,
      { router: undefined },
    )

    // sm-input
    const bookingReferenceInput = await screen.findByRole('textbox', { name: 'Booking reference' })
    const guestLastNameInput = await screen.findByRole('textbox', { name: 'Guest last name' })
    expect(bookingReferenceInput).toBeVisible()
    expect(bookingReferenceInput).toHaveValue('')
    expect(guestLastNameInput).toBeVisible()
    expect(guestLastNameInput).toHaveValue('')

    // sm-date-picker
    const selectStartDateRangeInput = screen.getByPlaceholderText('Start date')
    const selectEndDateRangeInput = screen.getByPlaceholderText('End date')
    expect(selectStartDateRangeInput).toBeVisible()
    expect(selectStartDateRangeInput).toHaveValue('')
    expect(selectEndDateRangeInput).toBeVisible()
    expect(selectEndDateRangeInput).toHaveValue('')

    // sm-button
    expect(screen.getByRole('button', { name: 'More filters' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Reset all filters' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Search' })).toBeEnabled()
  })

  it('should display validation error on the input fields', async () => {
    render(
      ReservationsListFilters,
      { router: undefined },
    )

    // sm-input
    const bookingReferenceInput = await screen.findByRole('textbox', { name: 'Booking reference' })
    expect(bookingReferenceInput).toBeValid()
    expect(bookingReferenceInput).not.toHaveAccessibleErrorMessage('This field may only contain alpha-numeric characters')

    // Trigger validation error
    await userEventInstance.type(bookingReferenceInput, '1234567890!!')

    expect(bookingReferenceInput).toBeInvalid()
    expect(bookingReferenceInput).toHaveAccessibleErrorMessage('This field may only contain alpha-numeric characters')
  })

  it('should select a date range from the date-picker', async () => {
    render(
      ReservationsListFilters,
      { router: undefined },
    )

    // sm-date-picker initial states
    const selectStartDateRangeInput: HTMLInputElement = await screen.findByPlaceholderText('Start date')
    const selectEndDateRangeInput: HTMLInputElement = await screen.findByPlaceholderText('End date')
    expect(selectStartDateRangeInput).toBeVisible()
    expect(selectStartDateRangeInput).toHaveValue('')
    expect(selectEndDateRangeInput).toBeVisible()
    expect(selectEndDateRangeInput).toHaveValue('')

    // Opens the date-picker
    await userEventInstance.click(selectStartDateRangeInput)

    // Wait for the popover and click on the dates. We use the same static dates
    // here to simplify tests. In addition, we would normally grab byRole with the
    // a11y label, but the dates are localized by default.
    const startDate = await screen.findByText('15')
    const endDate = screen.getByText('20')
    await userEventInstance.click(startDate)
    await userEventInstance.click(endDate)

    // We don't check for actual strings since the format can change based on
    // the user's locale. We just check that the value is not empty
    await waitFor(() => expect(selectStartDateRangeInput).toHaveValue())
    expect(selectEndDateRangeInput).toHaveValue()
    expect(selectStartDateRangeInput.value).not.toEqual(selectEndDateRangeInput.value)
  })

})
