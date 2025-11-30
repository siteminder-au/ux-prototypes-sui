import { render, screen, within } from '@testing-library/vue'
import { createTestRouter } from '@/test-utils'
import DirectBooking from './direct-booking.vue'

describe('direct-booking page', () => {

  it('should display the direct-booking page', async () => {
    render(DirectBooking, {
      router: createTestRouter(),
    })

    // sm-page-title
    expect(await screen.findByRole('heading', { level: 1, name: 'Direct booking rates' })).toBeVisible()
    expect(screen.getByText('(6)')).toBeVisible()

    // sm-select
    expect(screen.getByRole('textbox', { name: 'Filter by site type' })).toBeVisible()
    expect(screen.getByRole('textbox', { name: 'Filter by status' })).toBeVisible()

    // sm-table
    expect(screen.getByRole('columnheader', { name: 'Single Tent' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Direct booking rates' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Extras' })).toBeVisible()

    // sm-media
    const emptyMedia = screen.getByTestId('media-empty')
    expect(within(emptyMedia).getByRole('heading', { level: 3, name: 'Download the site types file and upload it here to start.' })).toBeVisible()
    expect(within(emptyMedia).getByRole('button', { name: 'Upload Site Types' })).toBeEnabled()

    const singleTentMedia = screen.getByTestId('media-single-tent')
    // role="img" is only available in Vue3 so we use test-id instead
    expect(within(singleTentMedia).getAllByTestId('media-single-tent-item-', { exact: false })).toHaveLength(6)

    const doubleTentMedia = screen.getByTestId('media-double-tent')
    expect(within(doubleTentMedia).getByRole('heading', { level: 3, name: 'Your property is beautiful, it needs beautiful images' })).toBeVisible()
    expect(within(doubleTentMedia).getByRole('button', { name: 'Upload images' })).toBeEnabled()
  })

})
