import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, fireEvent } from '@testing-library/vue'
import { ref } from 'vue'
import SmColorPicker from './sm-color-picker.vue'
import { SmInput } from '../forms/sm-input'

describe('SmColorPicker', () => {

  it('should be visible when visibleColorPicker prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmColorPicker },
      setup: () => {
        const defaultColor = ref('#488ED9')
        const displayPicker = ref(true)

        return {
          defaultColor,
          displayPicker,
        }
      },
      template: `
        <sm-color-picker v-model:hexColor="defaultColor" v-model:visibleColorPicker="displayPicker">
          <template v-slot:input>
            input
          </template>
        </sm-color-picker>
      `,
    }

    // ACT
    render(
      ParentComponent,
    )

    // ASSERT
    await waitFor(() => expect(screen.getByText('Color Picker')).toBeVisible())
    const button = screen.getByRole('button', { name: 'Select colour' })
    expect(button).toBeVisible()
  })

  it('should display the custom button text', async () => {
    const ParentComponent = {
      components: { SmColorPicker },
      template: `
        <sm-color-picker hexColor="#488ED9" :visibleColorPicker="true" select-color-button-text="Test button">
          <template v-slot:input>
            input
          </template>
        </sm-color-picker>
      `,
    }

    // ACT
    const { baseElement } = render(
      ParentComponent,
    )

    // ASSERT
    // We had to use querySelector to test the visibility of the color picker in case of Hidden component
    await waitFor(() => expect(baseElement.querySelector('.sm-color-picker--visible')).toBeVisible())
    const button = screen.getByRole('button', { name: 'Test button' })
    expect(button).toBeVisible()
  })

  it('should emit events on opening and closing of color picker', async () => {
    const showPicker = jest.fn()
    const hidePicker = jest.fn()
    const ParentComponent = {
      components: { SmColorPicker, SmInput },
      setup: () => {
        const defaultColor = ref('#488ED9')
        const displayPicker = ref<boolean | null>(null)

        return {
          defaultColor,
          displayPicker,
          showPicker,
          hidePicker,
        }
      },
      template: `
          <sm-color-picker v-model:hexColor="defaultColor" v-model:visibleColorPicker="displayPicker" @showPicker="showPicker" @hidePicker="hidePicker">
            <template v-slot:input>
              <span>
                <sm-input
                  name="color-one"
                  v-model="defaultColor"
                  label="Color"
                  :error-disabled="true"
                  :label-hidden="true"
                  @focus="displayPicker = true"
                />
              </span>
            </template>
          </sm-color-picker>
        `,
    }

    // ACT
    render(
      ParentComponent,
    )

    // ASSERT
    const input = screen.getByRole('textbox', { name: 'Color' })
    await waitFor(() => expect(input).toBeVisible())

    expect(hidePicker).toHaveBeenCalledTimes(1)
    expect(showPicker).toHaveBeenCalledTimes(0)

    // By default, clicking on the input focuses on the input field
    await userEvent.click(input)
    await userEvent.tab()

    // Show the color picker on input focus
    const button = screen.getByRole('button', { name: 'Select colour' })
    await waitFor(() => expect(button).toBeVisible())
    expect(showPicker).toHaveBeenCalledTimes(1)
    expect(hidePicker).toHaveBeenCalledTimes(1)

    // Hide the color picker on click of select colour button
    await userEvent.click(button)
    expect(showPicker).toHaveBeenCalledTimes(1)
    expect(hidePicker).toHaveBeenCalledTimes(2)
  })

  it('should hide the picker when the select color button is clicked', async () => {
    const ParentComponent = {
      components: { SmColorPicker },
      setup: () => {
        const defaultColor = ref('#488ED9')
        const displayPicker = ref(true)

        return {
          defaultColor,
          displayPicker,
        }
      },
      template: `
          <sm-color-picker v-model:hexColor="defaultColor" v-model:visibleColorPicker="displayPicker">
            <template v-slot:input>
              input
            </template>
          </sm-color-picker>
        `,
    }

    // ACT
    const { baseElement } = render(
      ParentComponent,
    )

    // ASSERT
    await waitFor(() => expect(screen.getByText('Color Picker')).toBeVisible())
    const button = screen.getByRole('button', { name: 'Select colour' })
    expect(button).toBeVisible()

    // Hide the color picker on click of select colour button
    await userEvent.click(button)
    // We had to use querySelector to find if the color picker is visible when using as a Hidden component
    expect(baseElement.querySelector('.sm-color-picker--visible')).not.toBeInTheDocument()
  })

  it('should hide the picker when clicked outside the picker', async () => {
    const ParentComponent = {
      components: { SmColorPicker },
      setup: () => {
        const defaultColor = ref('#488ED9')
        const displayPicker = ref(true)

        return {
          defaultColor,
          displayPicker,
        }
      },
      template: `
          <sm-color-picker v-model:hexColor="defaultColor" v-model:visibleColorPicker="displayPicker">
            <template v-slot:input>
              input
            </template>
          </sm-color-picker>
        `,
    }

    // ACT
    const { baseElement } = render(
      ParentComponent,
    )

    // ASSERT
    // Container of color picker
    await waitFor(() => expect(screen.getByText('Color Picker')).toBeVisible())
    const button = screen.getByRole('button', { name: 'Select colour' })
    expect(button).toBeVisible()

    // Click outside of the color picker
    await fireEvent.click(document)
    // Hide the color picker when click outside of the color picker
    // We had to use querySelector to find if the color picker is visible when using as a Hidden component
    expect(baseElement.querySelector('.sm-color-picker--visible')).not.toBeInTheDocument()
  })

  it('should not hide the picker when clicked inside the picker', async () => {
    const ParentComponent = {
      components: { SmColorPicker },
      setup: () => {
        const defaultColor = ref('#488ED9')
        const displayPicker = ref(true)

        return {
          defaultColor,
          displayPicker,
        }
      },
      template: `
          <sm-color-picker v-model:hexColor="defaultColor" v-model:visibleColorPicker="displayPicker">
            <template v-slot:input>
              input
            </template>
          </sm-color-picker>
        `,
    }

    // ACT
    render(
      ParentComponent,
    )

    // ASSERT
    const container = screen.getByText('Color Picker')
    await waitFor(() => expect(container).toBeVisible())
    const button = screen.getByRole('button', { name: 'Select colour' })
    expect(button).toBeVisible()

    // Click inside the color picker
    await userEvent.click(container)
    expect(container).toBeVisible()
    expect(button).toBeVisible()
  })

  it('should render the input slot', async () => {
    const ParentComponent = {
      components: { SmColorPicker, SmInput },
      template: `
          <sm-color-picker hexColor="#488ED9" :visibleColorPicker="true">
            <template v-slot:input>
              <span>
                <sm-input
                  name="color-one"
                  label="Color"
                />
              </span>
            </template>
          </sm-color-picker>
        `,
    }

    // ACT
    render(
      ParentComponent,
    )

    // ASSERT
    await waitFor(() => expect(screen.getByText('Color Picker')).toBeVisible())
    const input = screen.getByRole('textbox', { name: 'Color' })
    expect(input).toBeVisible()
  })
})
