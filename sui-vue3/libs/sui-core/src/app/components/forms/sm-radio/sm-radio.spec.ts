import userEvent from '@testing-library/user-event'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'

import { ref } from 'vue'
import { defineRule } from 'vee-validate'
import { required } from '@vee-validate/rules'
import SmRadio from './sm-radio.vue'

describe('SmRadio', () => {
  describe('clicking the control should toggle the value', () => {
    it('clicking the radio should change the v-model value', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmRadio },
        setup: () => {
          const radioValue = ref('alpha')

          return { radioValue }
        },
        template: `
          <div>
            <sm-radio v-model="radioValue" selected-value="beta" label="radio-label" name="radioValue" />
            <span>Value: {{ radioValue }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const radioLabel = screen.getByLabelText('radio-label')
      await waitFor(() => expect(radioLabel).toBeVisible())
      expect(screen.getByRole('radio')).not.toBeChecked()
      expect(screen.getByText('Value: alpha')).toBeVisible()

      await userEvent.click(radioLabel)
      await waitFor(() => expect(screen.getByRole('radio')).toBeChecked())
      // see: https://testing-library.com/docs/vue-testing-library/examples/
      expect(screen.getByText('Value: beta')).toBeVisible()
    })
  })

  describe('disabled', () => {
    it('clicking a disabled control should not change the value', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmRadio },
        setup: () => {
          const radioValue = ref('alpha')

          return { radioValue }
        },
        template: `
          <div>
            <sm-radio v-model="radioValue" selected-value="beta" label="radio-label" name="radioValue" :disabled="true"/>
            <span>Value: {{ radioValue }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const radioLabel = screen.getByLabelText('radio-label')
      await waitFor(() => expect(radioLabel).toBeVisible())
      expect(screen.getByRole('radio')).not.toBeChecked()
      expect(screen.getByText('Value: alpha')).toBeVisible()

      await userEvent.click(radioLabel)
      await waitFor(() => expect(screen.getByRole('radio')).not.toBeChecked())
      expect(screen.getByText('Value: alpha')).toBeVisible()
    })
  })

  describe('events', () => {
    it('should emit native events', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmRadio },
        setup: () => {
          const radioValue = ref('alpha')

          const eventValues = ref({
            blur: 0,
            change: 0,
            click: 0,
            focus: 0,
          })

          return { radioValue, eventValues }
        },
        template: `
          <div>
            <sm-radio
              v-model="radioValue"
              selected-value="beta"
              label="radio-label"
              name="radioValue"
              @blur="eventValues.blur += 1"
              @change="eventValues.change += 1"
              @click="eventValues.click += 1"
              @focus="eventValues.focus += 1"
            />
            <span>Value: {{ radioValue }}</span>
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
      const radioLabel = screen.getByLabelText('radio-label')
      await waitFor(() => expect(radioLabel).toBeVisible())
      expect(screen.getByText('Value: alpha')).toBeVisible()
      expect(screen.getByText('Blur: 0')).toBeVisible()
      expect(screen.getByText('Change: 0')).toBeVisible()
      expect(screen.getByText('Click: 0')).toBeVisible()
      expect(screen.getByText('Focus: 0')).toBeVisible()

      await userEvent.click(radioLabel)
      await waitFor(() => expect(screen.getByRole('radio')).toBeChecked())
      expect(screen.getByText('Value: beta')).toBeVisible()
      expect(screen.getByText('Blur: 0')).toBeVisible()
      expect(screen.getByText('Change: 1')).toBeVisible()
      expect(screen.getByText('Click: 1')).toBeVisible()
      expect(screen.getByText('Focus: 1')).toBeVisible()

      const radioInput = screen.getByRole('radio')
      await fireEvent.touch(radioInput)
      await waitFor(() => expect(screen.getByText('Blur: 1')).toBeVisible())
      expect(screen.getByText('Change: 1')).toBeVisible()
      expect(screen.getByText('Click: 1')).toBeVisible()
      expect(screen.getByText('Focus: 2')).toBeVisible()
    })

    // Specific test for https://siteminder-jira.atlassian.net/browse/SUI-1244
    it('should emit click event once after clicking the radio control directly', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmRadio },
        setup: () => {
          const radioValue = ref('alpha')

          const eventValues = ref({
            blur: 0,
            change: 0,
            click: 0,
            focus: 0,
          })

          return { radioValue, eventValues }
        },
        template: `
          <div>
            <sm-radio
              v-model="radioValue"
              selected-value="beta"
              label="radio-label"
              name="radioValue"
              @blur="eventValues.blur += 1"
              @change="eventValues.change += 1"
              @click="eventValues.click += 1"
              @focus="eventValues.focus += 1"
            />
            <span>Value: {{ radioValue }}</span>
            <span>Blur: {{ eventValues.blur }}</span>
            <span>Change: {{ eventValues.change }}</span>
            <span>Click: {{ eventValues.click }}</span>
            <span>Focus: {{ eventValues.focus }}</span>
          </div>
        `,
      }

      // ACT
      const { container } = render(ParentComponent)

      // ASSERT
      const radioCircleElement = container.querySelector('.sm-radio__control')
      await waitFor(() => expect(radioCircleElement).toBeVisible())
      expect(screen.getByText('Value: alpha')).toBeVisible()
      expect(screen.getByText('Blur: 0')).toBeVisible()
      expect(screen.getByText('Change: 0')).toBeVisible()
      expect(screen.getByText('Click: 0')).toBeVisible()
      expect(screen.getByText('Focus: 0')).toBeVisible()

      if (radioCircleElement) {
        await userEvent.click(radioCircleElement)
      }
      await waitFor(() => expect(screen.getByRole('radio')).toBeChecked())
      expect(screen.getByText('Value: beta')).toBeVisible()
      expect(screen.getByText('Blur: 0')).toBeVisible()
      expect(screen.getByText('Change: 1')).toBeVisible()
      expect(screen.getByText('Click: 1')).toBeVisible() // This should be 1
      expect(screen.getByText('Focus: 1')).toBeVisible()
    })
  })

  describe('label', () => {
    it('the label prop should be visible', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmRadio },
        setup: () => {
          const radioValue = ref('alpha')

          return { radioValue }
        },
        template: `
          <div>
            <sm-radio v-model="radioValue" selected-value="beta" label="radio-label" name="radioValue"/>
            <span>Value: {{ radioValue }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const radioLabel = screen.getByLabelText('radio-label')
      await waitFor(() => expect(radioLabel).toBeVisible())
    })

    it('the label slot should be visible', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmRadio },
        setup: () => {
          const radioValue = ref('alpha')

          return { radioValue }
        },
        template: `
          <div>
            <sm-radio v-model="radioValue" selected-value="beta" label="test-label-as-prop" name="radioValue">
              <template #default>
                <span>test-label-as-slot</span>
              </template>
            </sm-radio>
            <span>Value: {{ radioValue }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const radioLabel = screen.getByLabelText('test-label-as-slot')
      await waitFor(() => expect(radioLabel).toBeVisible())
    })
  })

  describe('required', () => {
    it('the required asterisk should be displayed', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmRadio },
        setup: () => {
          const radioValue = ref('alpha')

          defineRule('required', required)

          return { radioValue }
        },
        template: `
          <div>
            <sm-radio v-model="radioValue" selected-value="beta" label="test-label-as-prop" name="radioValue" rules="required"/>
            <span>Value: {{ radioValue }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const requiredAsterisk = screen.getByText('*')
      await waitFor(() => expect(requiredAsterisk).toBeVisible())
    })

    it('the required asterisk should not be displayed', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmRadio },
        setup: () => {
          const radioValue = ref('alpha')

          defineRule('required', required)

          return { radioValue }
        },
        template: `
          <div>
            <sm-radio v-model="radioValue" selected-value="beta" label="test-label-as-prop" name="radioValue"/>
            <span>Value: {{ radioValue }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.queryByText('*')).not.toBeInTheDocument())
    })
  })
})
