import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { ref } from 'vue'
import SmRadio from './sm-radio.vue'
import SmRadioButton from './sm-radio-button.vue'
import SmRadioGroup from './sm-radio-group.vue'

describe('SmRadioGroup', () => {
  describe('props', () => {
    describe('label', () => {
      it('should display the label with provided prop', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmRadio, SmRadioGroup },
          setup: () => {
            const radioValue = ref('alpha')

            return { radioValue }
          },
          template: `
            <div>
              <sm-radio-group label="radio-group-label" name="radioName">
                <sm-radio v-model="radioValue" selected-value="beta" name="radioName" />
              </sm-radio-group>
              <span>Value: {{ radioValue }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        const radioGroupLabel = screen.getByText('radio-group-label')
        await waitFor(() => expect(radioGroupLabel).toBeVisible())
        expect(screen.getByRole('group')).toHaveAccessibleName('radio-group-label')
      })

      it('should not display any label if prop is not provided', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmRadio, SmRadioGroup },
          setup: () => {
            const radioValue = ref('alpha')

            return { radioValue }
          },
          template: `
            <div>
              <sm-radio-group name="radioName">
                <sm-radio v-model="radioValue" selected-value="beta" name="radioName" />
              </sm-radio-group>
              <span>Value: {{ radioValue }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.queryByText('radio-group-label')).not.toBeInTheDocument())
        expect(screen.getByRole('group')).not.toHaveAccessibleName()
      })
    })

    describe('labelHidden', () => {
      it('should add a screen reader only accessible label', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmRadio, SmRadioGroup },
          setup: () => {
            const radioValue = ref('alpha')

            return { radioValue }
          },
          template: `
            <div>
              <sm-radio-group label="radio-group-label" name="radioName" :label-hidden="true">
                <sm-radio v-model="radioValue" selected-value="beta" name="radioName" />
              </sm-radio-group>
              <span>Value: {{ radioValue }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        const radioGroupElement = screen.getByRole('group')
        await waitFor(() => expect(radioGroupElement).toHaveTextContent('radio-group-label'))
        expect(screen.getByRole('group')).toHaveAccessibleName('radio-group-label')
      })
    })

    it('should select the radio value of different types when the items are interacted with', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmRadioButton, SmRadioGroup },
        setup: () => {
          const radioValue = ref()
          const objectValue = ref({ value: 'some-value' })

          return { objectValue, radioValue }
        },
        template: `
          <div>
            <sm-radio-group label="radio-group-label" name="radioName">
              <sm-radio-button v-model="radioValue" label="test-one" selected-value="test-one" name="radioName" />
              <sm-radio-button v-model="radioValue" label="true" :selected-value="true" name="radioName" />
              <sm-radio-button v-model="radioValue" label="1000" :selected-value="1000" name="radioName" />
              <sm-radio-button v-model="radioValue" label="object-value" :selected-value="objectValue" name="radioName" />
            </sm-radio-group>
            <span>Value: {{ radioValue }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const radioLabel = await screen.findByRole('group')
      const radios = screen.getAllByRole('radio')

      // Initial state
      expect(radioLabel).toHaveTextContent('radio-group-label')
      radios.forEach((radio) => {
        expect(radio).toBeVisible()
        expect(radio).not.toBeChecked()
      })
      expect(screen.getByText('Value:')).toBeVisible()

      // Select one by one
      await userEvent.click(radios[0])

      expect(radios.at(0)).toBeChecked()
      expect(radios.at(1)).not.toBeChecked()
      expect(radios.at(2)).not.toBeChecked()
      expect(radios.at(3)).not.toBeChecked()
      expect(screen.getByText('Value: test-one')).toBeVisible()

      await userEvent.click(radios[1])

      expect(radios.at(0)).not.toBeChecked()
      expect(radios.at(1)).toBeChecked()
      expect(radios.at(2)).not.toBeChecked()
      expect(radios.at(3)).not.toBeChecked()
      expect(screen.getByText('Value: true')).toBeVisible()

      await userEvent.click(radios[2])

      expect(radios.at(0)).not.toBeChecked()
      expect(radios.at(1)).not.toBeChecked()
      expect(radios.at(2)).toBeChecked()
      expect(radios.at(3)).not.toBeChecked()
      expect(screen.getByText('Value: 1000')).toBeVisible()

      await userEvent.click(radios[3])

      expect(radios.at(0)).not.toBeChecked()
      expect(radios.at(1)).not.toBeChecked()
      expect(radios.at(2)).not.toBeChecked()
      expect(radios.at(3)).toBeChecked()
      expect(screen.getByText('Value: { "value": "some-value" }')).toBeVisible()
    })
  })

  describe('slots', () => {
    it('should render the default slot', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmRadio, SmRadioGroup },
        setup: () => {
          const radioValue = ref('alpha')

          return { radioValue }
        },
        template: `
          <div>
            <sm-radio-group label="radio-group-label" name="radioName">
              <sm-radio v-model="radioValue" selected-value="beta" label="radio-label" name="radioName" />
            </sm-radio-group>
            <span>Value: {{ radioValue }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByText('radio-group-label')).toBeVisible())
      expect(screen.getByText('radio-label')).toBeVisible()
    })

    it('should override label prop and render the label slot', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmRadio, SmRadioGroup },
        setup: () => {
          const radioValue = ref('alpha')

          return { radioValue }
        },
        template: `
          <div>
            <sm-radio-group label="radio-group-label" name="radioName">
              <template #label>
                <span>radio-group-label-slot</span>
              </template>
              <sm-radio v-model="radioValue" selected-value="beta" label="radio-label" name="radioName" />
            </sm-radio-group>
            <span>Value: {{ radioValue }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByText('radio-group-label-slot')).toBeVisible())
      expect(screen.getByText('radio-label')).toBeVisible()
    })

    it('should render the action slot', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmRadio, SmRadioGroup },
        setup: () => {
          const radioValue = ref('alpha')

          return { radioValue }
        },
        template: `
          <div>
            <sm-radio-group label="radio-group-label" name="radioName">
              <template #label>
                <span>radio-group-label-slot</span>
              </template>
              <template #action>
                <span>radio-group-action-slot</span>
              </template>
              <sm-radio v-model="radioValue" selected-value="beta" label="radio-label" name="radioName" />
            </sm-radio-group>
            <span>Value: {{ radioValue }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByText('radio-group-label-slot')).toBeVisible())
      expect(screen.getByText('radio-group-action-slot')).toBeVisible()
      expect(screen.getByText('radio-label')).toBeVisible()
      expect(screen.getByRole('group')).toHaveAccessibleName('radio-group-label-slot')
    })
  })
})
