import { render, screen } from '@testing-library/vue'
import SmCarouselGraphic from './sm-carousel-graphic.vue'

describe('SmCardGraphic', () => {

  it('should have img and alt text', () => {
    const props = {
      src: '/slide-one.png',
      alt: 'slide one',
    }
    // ACT
    render(SmCarouselGraphic, { props })
    // ASSERT
    expect(screen.getByRole('figure', { name: '' })).toBeVisible()
    expect(screen.getByRole('img', { name: 'slide one' })).toBeVisible()
  })
})
