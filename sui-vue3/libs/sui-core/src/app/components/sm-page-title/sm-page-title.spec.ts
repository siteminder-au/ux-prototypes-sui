import { render, screen } from '@testing-library/vue'
import SmPageTitle from './sm-page-title.vue'

describe('SmPageTitle', () => {

  it('should display the provided title', () => {
    // ARRANGE
    const props = {
      title: 'Room types',
    }
    // ACT
    render(SmPageTitle, { props })

    // ASSERT
    expect(screen.getByRole('heading', { level: 1, name: 'Room types' })).toBeVisible()
  })

  it('should display the provided sub-title and title', () => {
    // ARRANGE
    const props = {
      title: 'Room types',
      subTitle: '(13)',
    }
    // ACT
    render(SmPageTitle, { props })

    // ASSERT
    expect(screen.getByRole('heading', { level: 1, name: 'Room types' })).toBeVisible()
    expect(screen.getByText('(13)')).toBeVisible()
  })

  it('should render the default slot content', () => {
    const ParentComponent = {
      components: { SmPageTitle },
      template: `
        <sm-page-title>
          <template #default>
            First Heading
          </template>
        </sm-page-title>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(screen.getByRole('heading', { level: 1, name: 'First Heading' })).toBeVisible()
  })

  it('should render the sub-title slot content', () => {
    const ParentComponent = {
      components: { SmPageTitle },
      template: `
        <sm-page-title title="Heading">
          <template #sub-title>
            Second Title
          </template>
        </sm-page-title>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(screen.getByRole('heading', { level: 1, name: 'Heading' })).toBeVisible()
    expect(screen.getByText('Second Title')).toBeVisible()
  })

  it('should render the actions slot content', () => {
    const ParentComponent = {
      components: { SmPageTitle },
      template: `
        <sm-page-title title="Heading" sub-title="sub-title">
          <template #actions>
            Actions item
          </template>
        </sm-page-title>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(screen.getByRole('heading', { level: 1, name: 'Heading' })).toBeVisible()
    expect(screen.getByText('sub-title')).toBeVisible()
    expect(screen.getByText('Actions item')).toBeVisible()
  })

})
