import { render, screen } from '@testing-library/vue'
import SmCardGraphic from './sm-card-graphic.vue'

describe('SmCardGraphic', () => {

  it('should add img based on the provided props', () => {
    const props = {
      src: '/foo.png',
    }
    // ACT
    render(SmCardGraphic, { props })
    // ASSERT
    expect(screen.queryByRole('img')).toBeVisible()
    expect(screen.queryByAltText('A picture of a hotel')).not.toBeInTheDocument()
  })

  it('should add img and alt based on the provided props', () => {
    // ARRANGE
    const props = {
      src: '/foo.png',
      alt: 'A picture of a hotel',
    }
    // ACT
    render(SmCardGraphic, { props })
    // ASSERT
    expect(screen.queryByRole('img')).toBeVisible()
    expect(screen.getByAltText('A picture of a hotel')).toBeVisible()
  })

})
