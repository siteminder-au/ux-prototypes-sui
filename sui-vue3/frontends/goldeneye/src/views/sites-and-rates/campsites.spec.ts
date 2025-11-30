import { computed, ref } from 'vue'
import { render, screen } from '@testing-library/vue'
import { createTestRouter } from '@/test-utils'
import Campsites from './campsites.vue'

jest.mock('@/composables/use-get-camp', () => ({
  useGetCamp: () => ({
    loading: ref(false),
    accommodations: computed(() => []),
    onResult: (arg: any) => arg({
      data: {
        camp: {
          campsites: [
            {
              id: '1',
              name: 'Hidden Valley Campground',
              accommodations: [],
              maximumAdvanceBookingDays: false,
              dynamicDiscounts: true,
              restrictToMobile: false,
              smokingPolicy: 'non-smoking',
              allowPets: true,
            },
          ],
        },
      },
    }),
  }),
}))

describe('campsites page', () => {

  it('should display the campsites page', async () => {
    render(Campsites, {
      global: {
        plugins: [createTestRouter()],
      },
    })

    // sm-page-title
    expect(await screen.findByRole('heading', { level: 1, name: 'Campsites' })).toBeVisible()
    expect(screen.getByText('(1)')).toBeVisible()

    // sm-accordion
    expect(screen.getAllByRole('button', { name: 'Click to expand the panel' })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 2, name: 'Hidden Valley Campground' })).toBeVisible()

    // sm-dropdown
    expect(screen.getAllByRole('button', { name: 'More actions' })).toHaveLength(1)
  })

})
