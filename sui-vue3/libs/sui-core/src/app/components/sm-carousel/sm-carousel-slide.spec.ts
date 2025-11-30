import { render, screen, waitFor } from '@testing-library/vue'
import SmCarouselSlide from './sm-carousel-slide.vue'

describe('SmCarouselSlide', () => {

  it('should have carousel img', async () => {
    const props = {
      item: {
        src: '/slide-one.png',
        alt: 'slide one',
      },
    }
    // ACT
    render(SmCarouselSlide, { props })
    // ASSERT
    await waitFor(() => expect(screen.getByRole('listitem')).toBeVisible())
    expect(screen.getByRole('img', { name: 'slide one' })).toBeVisible()

  })

})
