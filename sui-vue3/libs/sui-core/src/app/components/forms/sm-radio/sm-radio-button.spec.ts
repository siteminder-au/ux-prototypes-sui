import { render, screen } from '@testing-library/vue'
import { ref } from 'vue'
import userEvent from '@testing-library/user-event'
import SmRadioButton from './sm-radio-button.vue'

describe('SmRadioButton', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should pass the props and attributes into the inner radio component', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmRadioButton },
      setup: () => {
        const radioValue = ref()

        return { radioValue }
      },
      template: `
        <div>
          <sm-radio-button
            v-model="radioValue"
            label="Label as prop"
            selected-value="true"
            name="radio"
            data-testid="radio-button"
          />
          <span>Value: {{ radioValue }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const radio = await screen.findByRole('radio', { name: 'Label as prop' })
    expect(radio).toBeVisible()
    expect(radio).toBeEnabled()
    expect(radio).toBeValid()
    expect(radio).not.toBeChecked()
    expect(radio).not.toBeRequired()
    expect(screen.getByText('Label as prop')).toBeVisible()
    expect(screen.getByText('Value:')).toBeVisible()
    expect(screen.getByTestId('radio-button')).toBeVisible()
  })

  it('should emit native events when interacted with', async () => {
    // ARRANGE
    const mockBlur = jest.fn()
    const mockChange = jest.fn()
    const mockClick = jest.fn()
    const mockFocus = jest.fn()
    const ParentComponent = {
      components: { SmRadioButton },
      setup: () => {
        const radioValue = ref(false)

        return { radioValue, mockBlur, mockChange, mockClick, mockFocus }
      },
      template: `
        <div>
          <sm-radio-button
            v-model="radioValue"
            selected-value="true"
            label="test-label"
            name="radio"
            @blur="mockBlur"
            @change="mockChange"
            @click="mockClick"
            @focus="mockFocus"
          />
          <span>Value: {{ radioValue }}</span>
        </div>
    `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const radio = await screen.findByLabelText('test-label')
    expect(radio).toBeVisible()
    expect(screen.getByText('Value: false')).toBeVisible()
    expect(radio).not.toHaveFocus()
    expect(mockBlur).toHaveBeenCalledTimes(0)
    expect(mockChange).toHaveBeenCalledTimes(0)
    expect(mockClick).toHaveBeenCalledTimes(0)
    expect(mockFocus).toHaveBeenCalledTimes(0)

    await userEvent.click(radio)

    expect(await screen.findByText('Value: true')).toBeVisible()
    expect(radio).toHaveFocus()
    expect(mockBlur).toHaveBeenCalledTimes(0)
    expect(mockChange).toHaveBeenCalledTimes(1)
    expect(mockClick).toHaveBeenCalledTimes(1)
    expect(mockFocus).toHaveBeenCalledTimes(1)

    // Remove focus
    await userEvent.tab()

    expect(radio).not.toHaveFocus()
    expect(mockBlur).toHaveBeenCalledTimes(1)
    expect(mockChange).toHaveBeenCalledTimes(1)
    expect(mockClick).toHaveBeenCalledTimes(1)
    expect(mockFocus).toHaveBeenCalledTimes(1)
  })

  it('should display the default slot as the label when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmRadioButton },
      setup: () => {
        const radioValue = ref(true)

        return { radioValue }
      },
      template: `
        <div>
          <sm-radio-button
            v-model="radioValue"
            label="Label as prop"
            selected-value="true"
            name="radio"
            data-testid="radio-button"
          >
            Label as slot
          </sm-radio-button>
          <span>Value: {{ radioValue }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const radio = await screen.findByRole('radio', { name: 'Label as slot' })
    expect(radio).toBeVisible()
    expect(radio).toBeEnabled()
    expect(radio).toBeValid()
    expect(radio).toBeChecked()
    expect(radio).not.toBeRequired()
    expect(screen.queryByText('Label as prop')).not.toBeInTheDocument()
    expect(screen.getByText('Label as slot')).toBeVisible()
    expect(screen.getByText('Value: true')).toBeVisible()
    expect(screen.getByTestId('radio-button')).toBeVisible()
  })

})
