import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'
import { ref } from 'vue'
import SmCheckboxButton from './sm-checkbox-button.vue'

describe('SmCheckboxButton', () => {

  it('should pass the props and attributes into the inner checkbox component', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCheckboxButton },
      setup: () => {
        const checkboxValue = ref('test')

        return { checkboxValue }
      },
      template: `
        <div>
          <sm-checkbox-button
            v-model="checkboxValue"
            selected-value="test"
            label="test-label"
            name="checkboxValue"
            data-testid="checkbox-button"
          >
            <template #default>
              <span>test-label-as-slot</span>
            </template>
          </sm-checkbox-button>
          <span>Value: {{ checkboxValue }}</span>
        </div>
    `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const checkboxLabel = await screen.findByLabelText('test-label')
    expect(checkboxLabel).toBeVisible()
    expect(checkboxLabel).toBeEnabled()
    expect(checkboxLabel).toBeValid()
    expect(checkboxLabel).not.toBeChecked()
    expect(checkboxLabel).not.toBeRequired()
    expect(screen.getByText('test-label-as-slot')).toBeVisible()
    expect(screen.getByText('Value: test')).toBeVisible()
    expect(screen.getByTestId('checkbox-button')).toBeVisible()
  })

  it('should emit native events when interacted with', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmCheckboxButton },
      setup: () => {
        const checkboxValue = ref(false)

        const eventValues = ref({
          blur: 0,
          change: 0,
          click: 0,
          focus: 0,
        })

        return { checkboxValue, eventValues }
      },
      template: `
        <div>
          <sm-checkbox-button
            v-model="checkboxValue"
            selected-value="true"
            label="test-label"
            name="checkboxValue"
            @blur="eventValues.blur += 1"
            @change="eventValues.change += 1"
            @click="eventValues.click += 1"
            @focus="eventValues.focus += 1"
          />

          <span>Value: {{ checkboxValue }}</span>
          <span>Blur: {{ eventValues.blur }}</span>
          <span>Change: {{ eventValues.change }}</span>
          <span>Click: {{ eventValues.click }}</span>
          <span>Focus: {{ eventValues.focus }}</span>
        </div>
    `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const checkboxLabel = await screen.findByLabelText('test-label')
    expect(checkboxLabel).toBeVisible()
    expect(screen.getByText('Value: false')).toBeVisible()
    expect(screen.getByText('Blur: 0')).toBeVisible()
    expect(screen.getByText('Change: 0')).toBeVisible()
    expect(screen.getByText('Click: 0')).toBeVisible()
    expect(screen.getByText('Focus: 0')).toBeVisible()

    await userEvent.click(checkboxLabel)

    expect(await screen.findByText('Value: true')).toBeVisible()
    expect(screen.getByText('Blur: 0')).toBeVisible()
    expect(screen.getByText('Change: 1')).toBeVisible()
    expect(screen.getByText('Click: 1')).toBeVisible()
    expect(screen.getByText('Focus: 1')).toBeVisible()

    // Remove focus
    await userEvent.tab()

    expect(screen.getByText('Blur: 1')).toBeVisible()
    expect(screen.getByText('Change: 1')).toBeVisible()
    expect(screen.getByText('Click: 1')).toBeVisible()
    expect(screen.getByText('Focus: 1')).toBeVisible()
  })

})
