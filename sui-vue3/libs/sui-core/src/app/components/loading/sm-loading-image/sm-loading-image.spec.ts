import { render, screen } from '@testing-library/vue'
import SmLoadingImage from './sm-loading-image.vue'

describe('SmLoadingImage', () => {

  it('should load the image skeleton loader', () => {

    render(SmLoadingImage)

    expect(screen.getByTitle('Loading image...')).toBeInTheDocument()
  })

})
