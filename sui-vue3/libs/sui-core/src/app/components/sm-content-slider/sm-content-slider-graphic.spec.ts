import { render, screen } from '@testing-library/vue'
import SmContentSliderGraphic from './sm-content-slider-graphic.vue'

describe('SmContentSliderGraphic', () => {

  it('should render an element with provided background src', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmContentSliderGraphic },
      template: `
        <sm-content-slider-graphic role="img" src="test.png" />
      `,
    }
    // ACT
    render(ParentComponent)

    // ASSERT
    const imageElement = await screen.findByRole('img')
    expect(await screen.findByRole('img')).toBeVisible()
    expect(imageElement).toHaveStyle('background-image: url(test.png);')
  })

})
