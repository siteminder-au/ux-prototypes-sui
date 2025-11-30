import { render, screen, waitFor } from '@testing-library/vue'
import SmCarouselCounter from './sm-carousel-counter.vue'

describe('SmCarouselCounter', () => {

  it('should have number counter', async () => {
    const props = {
      totalSlides: 6,
      currentSlide: 0,
    }
    // ACT
    render(SmCarouselCounter, { props })
    // ASSERT
    await waitFor(() => expect(screen.getByText('1 / 6')).toBeVisible())
  })
})
