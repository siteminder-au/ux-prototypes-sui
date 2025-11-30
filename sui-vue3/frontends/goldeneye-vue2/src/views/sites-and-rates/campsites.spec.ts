import { render, screen, waitFor, within } from '@testing-library/vue'
import { createTestRouter } from '@/test-utils'
import userEvent from '@testing-library/user-event'
import Campsites from './campsites.vue'

describe('campsites page', () => {

  it('should display the campsites page', async () => {
    render(Campsites, {
      router: createTestRouter(),
    })

    // sm-page-title
    expect(await screen.findByRole('heading', { level: 1, name: 'Campsites' })).toBeVisible()
    expect(screen.getByText('(8)')).toBeVisible()

    // sm-accordion
    expect(screen.getAllByRole('button', { name: 'Click to expand the panel' })).toHaveLength(8)
    expect(screen.getByRole('heading', { level: 2, name: 'Hidden Valley Campground' })).toBeVisible()

    // sm-dropdown
    expect(screen.getAllByRole('button', { name: 'More actions' })).toHaveLength(8)

    // sm-list
    const dayOneActivities = screen.getByTestId('day-one-activities')
    const dayOneActivitiesListItems = within(dayOneActivities).getAllByRole('listitem')
    expect(dayOneActivitiesListItems).toHaveLength(3)
    expect(dayOneActivitiesListItems.at(0)).toHaveTextContent('Rock climbing')
    expect(dayOneActivitiesListItems.at(1)).toHaveTextContent('Kayaking')
    expect(dayOneActivitiesListItems.at(2)).toHaveTextContent('Water skiing')

    const dayTwoActivities = screen.getByTestId('day-two-activities')
    const dayTwoActivitiesListItems = within(dayTwoActivities).getAllByRole('listitem')
    expect(dayTwoActivitiesListItems).toHaveLength(3)
    expect(dayTwoActivitiesListItems.at(0)).toHaveTextContent('Hiking')
    expect(dayTwoActivitiesListItems.at(1)).toHaveTextContent('Cycling')
    expect(dayTwoActivitiesListItems.at(2)).toHaveTextContent('Spelunking: the art of cave exploring')

    // sm-color-picker
    const colorPickerOne = screen.getByRole('textbox', { name: 'Color-picker one' })
    expect(colorPickerOne).toHaveValue('#488ED9')

    const colorPickerTwo = screen.getByRole('textbox', { name: 'Color-picker two' })
    expect(colorPickerTwo).toHaveValue('#FF1B1B')
  })

  it('should change the color of the color picker when valid hex code is typed into the dropdown', async () => {
    render(Campsites, {
      router: createTestRouter(),
    })

    // sm-color-picker
    const colorPickerOne = await screen.findByTestId('color-picker-one')
    const colorPickerInputOne = screen.getByRole('textbox', { name: 'Color-picker one' })
    expect(colorPickerInputOne).toHaveValue('#488ED9')
    expect(screen.queryByRole('application', { name: 'PhotoShop color picker' })).not.toBeInTheDocument()

    // Focus to open the color picker dropdown
    await userEvent.click(colorPickerInputOne)

    const photoshopDropdown = await screen.findByRole('application', { name: 'PhotoShop color picker' })
    const photoshopInput = within(photoshopDropdown).getByRole('textbox', { name: '#' })
    const colorPickerOneButton = within(colorPickerOne).getByRole('button', { name: 'Select colour' })
    expect(photoshopDropdown).toBeVisible()
    expect(photoshopInput).toHaveValue('488ED9')

    // Change the color
    await userEvent.clear(photoshopInput) // delete the current value first
    await userEvent.type(photoshopInput, 'FFFFFF')
    await userEvent.click(colorPickerOneButton)

    await waitFor(() => expect(screen.queryByRole('application', { name: 'PhotoShop color picker' })).not.toBeInTheDocument())
    expect(colorPickerInputOne).toHaveValue('#FFFFFF')
  })

})
