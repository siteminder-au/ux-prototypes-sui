import { render, screen } from '@testing-library/vue'
import SmFormGroup from './sm-form-group.vue'

describe('SmFormGroup', () => {

  it('should render the form content', () => {
    // ARRANGE
    const ParentComponent = {
      // required as child components are not globally registered
      components: { SmFormGroup },
      template: `
        <sm-form-group legend="Some fields">
          test
        </sm-form-group>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(screen.getByRole('group', { name: 'Some fields' })).toBeVisible()
    expect(screen.getByText('test')).toBeVisible()
  })

  it('should render the legend block if legend is provided', () => {
    // ARRANGE
    const ParentComponent = {
      // required as child components are not globally registered
      components: { SmFormGroup },
      template: `
        <sm-form-group legend="Some fields">
          test
        </sm-form-group>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(screen.getByRole('group', { name: 'Some fields' })).toBeVisible()
  })

  it('should not render the legend block if no legend is provided', () => {
    // ARRANGE
    const ParentComponent = {
      // required as child components are not globally registered
      components: { SmFormGroup },
      template: `
        <sm-form-group>
          test
        </sm-form-group>
      `,
    }

    // ACT
    render(ParentComponent)

    expect(screen.getByText('test')).toBeVisible()
    expect(screen.queryByText('group')).not.toBeInTheDocument()
  })

  it('should attach custom attributes to the fieldset element', () => {
    // ARRANGE
    const ParentComponent = {
      // required as child components are not globally registered
      components: { SmFormGroup },
      template: `
        <sm-form-group legend="Some fields" data-testid="custom-attribute">
          test
        </sm-form-group>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(screen.getByRole('group', { name: 'Some fields' })).toBeVisible()
    expect(screen.getByRole('group', { name: 'Some fields' })).toHaveAttribute('data-testid', 'custom-attribute')
  })

})
