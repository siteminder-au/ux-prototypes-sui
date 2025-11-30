import { render, screen } from '@testing-library/vue'
import SmLoadingHomeScreen from './sm-loading-home-screen.vue'

describe('SmLoadingHomeScreen', () => {

  it('should load the home screen skeleton loaders', () => {
    render(SmLoadingHomeScreen)

    // Header
    expect(expect(screen.getByRole('banner')).toBeInTheDocument())

    // Nav
    expect(expect(screen.getByRole('navigation')).toBeInTheDocument())

    // Section - sidebar
    expect(expect(screen.getByRole('complementary')).toBeInTheDocument())
  })

  it('should hide the home screen header nav skeleton loader', () => {
    render(
      SmLoadingHomeScreen,
      {
        props: {
          showHeader: false,
        },
      },
    )

    // Header
    expect(expect(screen.queryByRole('banner')).not.toBeInTheDocument())

    // Nav
    expect(expect(screen.queryByRole('navigation')).not.toBeInTheDocument())

    // Section - sidebar
    expect(expect(screen.getByRole('complementary')).toBeInTheDocument())
  })

})
