import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import Reservations from './reservations.vue'

describe('reservations page', () => {

  it('should display the reservations page', async () => {
    render(
      Reservations,
      { router: undefined },
    )

    // sm-page-title
    expect(await screen.findByRole('heading', { level: 1, name: 'Reservations' })).toBeVisible()

    // sm-404-page
    expect(screen.getByRole('heading', { level: 3, name: 'Not implemented' })).toBeVisible()
    expect(screen.getByText('We\'re unable to search for reservations at this time. Please try again later.')).toBeVisible()

    // sm-table
    const tableColumnHeaders = screen.getAllByRole('columnheader')
    expect(screen.getByRole('table')).toBeVisible()
    expect(tableColumnHeaders).toHaveLength(8)
    expect(tableColumnHeaders.at(0)).toHaveTextContent('Booking reference')
    expect(tableColumnHeaders.at(1)).toHaveTextContent('Guest name')
    expect(tableColumnHeaders.at(2)).toHaveTextContent('Check-in')
    expect(tableColumnHeaders.at(3)).toHaveTextContent('Check-out')
    expect(tableColumnHeaders.at(4)).toHaveTextContent('Room')
    expect(tableColumnHeaders.at(5)).toHaveTextContent('Booked on date')
    expect(tableColumnHeaders.at(6)).toHaveTextContent('Status')
    expect(tableColumnHeaders.at(7)).toHaveTextContent('Total price')

    // sm-pagination
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled()
    expect(screen.getByRole('spinbutton', { name: 'Page number' })).toHaveValue(1)
  })

  it('should display the dialog when search button is clicked', async () => {
    render(
      Reservations,
      { router: undefined },
    )

    await userEvent.click(screen.getByRole('button', { name: 'Search' }))

    // sm-dialog
    expect(await screen.findByRole('alertdialog', { name: 'Query' })).toBeVisible()
  })

})
