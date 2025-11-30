import { render } from '@testing-library/vue'
import SmMultiSelectCheckbox from './sm-multi-select-checkbox.vue'

describe('SmMultiSelectCheckbox', () => {

  it('should render the component with a default state', () => {
    // ACT
    // container has a div wrapper - https://testing-library.com/docs/vue-testing-library/api/#container
    const { container } = render(SmMultiSelectCheckbox)

    // ASSERT
    // We're asserting class names here since this component is purely presentational
    expect(container.firstChild).toHaveClass('sm-multi-select-checkbox')
    expect(container.firstChild).not.toHaveClass('sm-multi-select-checkbox--checked')
    expect(container.firstChild).not.toHaveClass('sm-multi-select-checkbox--disabled')
    expect(container.firstChild).not.toHaveClass('sm-multi-select-checkbox--indeterminate')
  })

  it('should render the component with a checked state', () => {
    // ACT
    // container has a div wrapper - https://testing-library.com/docs/vue-testing-library/api/#container
    const { container } = render(SmMultiSelectCheckbox, {
      props: {
        checked: true,
      },
    })

    // ASSERT
    // We're asserting class names here since this component is purely presentational
    expect(container.firstChild).toHaveClass('sm-multi-select-checkbox')
    expect(container.firstChild).toHaveClass('sm-multi-select-checkbox--checked')
    expect(container.firstChild).not.toHaveClass('sm-multi-select-checkbox--disabled')
    expect(container.firstChild).not.toHaveClass('sm-multi-select-checkbox--indeterminate')
  })

  it('should render the component with a disabled state', () => {
    // ACT
    // container has a div wrapper - https://testing-library.com/docs/vue-testing-library/api/#container
    const { container } = render(SmMultiSelectCheckbox, {
      props: {
        disabled: true,
      },
    })

    // ASSERT
    // We're asserting class names here since this component is purely presentational
    expect(container.firstChild).toHaveClass('sm-multi-select-checkbox')
    expect(container.firstChild).not.toHaveClass('sm-multi-select-checkbox--checked')
    expect(container.firstChild).toHaveClass('sm-multi-select-checkbox--disabled')
    expect(container.firstChild).not.toHaveClass('sm-multi-select-checkbox--indeterminate')
  })

  it('should render the component with a indeterminate state', () => {
    // ACT
    // container has a div wrapper - https://testing-library.com/docs/vue-testing-library/api/#container
    const { container } = render(SmMultiSelectCheckbox, {
      props: {
        indeterminate: true,
      },
    })

    // ASSERT
    // We're asserting class names here since this component is purely presentational
    expect(container.firstChild).toHaveClass('sm-multi-select-checkbox')
    expect(container.firstChild).not.toHaveClass('sm-multi-select-checkbox--checked')
    expect(container.firstChild).not.toHaveClass('sm-multi-select-checkbox--disabled')
    expect(container.firstChild).toHaveClass('sm-multi-select-checkbox--indeterminate')
  })

})
