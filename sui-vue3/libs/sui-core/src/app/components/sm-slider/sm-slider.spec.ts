import { render, screen, waitFor } from '@testing-library/vue'
import { ref } from 'vue'
import SmSlider from './sm-slider.vue'

describe('SmSlider', () => {

  describe('props', () => {
    it('should have label', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSlider },
        setup: () => {
          return { value: ref(0) }
        },
        template: '<sm-slider v-model="value" label="Test label"></sm-slider>',
      }

      // ACT
      render(ParentComponent)

      expect(screen.getByText('Test label')).toBeVisible()
    })
  })

  describe('slots', () => {
    it('should render the prefix slot content', () => {
      // ARRANGE
      const slotContent = 'input prefix'
      const ParentComponent = {
        components: { SmSlider },
        setup: () => {
          return { value: ref([0, 20]) }
        },
        template: `<sm-slider v-model="value" range>
                     <template #prefix>
                       ${slotContent}
                     </template>
                   </sm-slider>`,
      }

      // ACT
      render(ParentComponent)

      expect(screen.getByText(slotContent)).toBeVisible()
    })

    it('should render the suffix slot content', () => {
      // ARRANGE
      const slotContent = 'suffix'
      const ParentComponent = {
        components: { SmSlider },
        setup: () => {
          return { value: ref([0, 20]) }
        },
        template: `<sm-slider v-model="value" range>
                     <template #suffix>
                       ${slotContent}
                     </template>
                   </sm-slider>`,
      }

      // ACT
      render(ParentComponent)

      expect(screen.getByText(slotContent)).toBeVisible()
    })

    it('should render the label slot content', () => {
      // ARRANGE
      const slotContent = 'Test label slot'
      const ParentComponent = {
        components: { SmSlider },
        setup: () => {
          return { value: ref([0, 20]) }
        },
        template: `<sm-slider v-model="value" range>
                     <template #label>
                       ${slotContent}
                     </template>
                   </sm-slider>`,
      }

      // ACT
      render(ParentComponent)

      expect(screen.getByText(slotContent)).toBeVisible()
    })

    describe('events', () => {
      it('should emit the "change" event', async () => {
        // ARRANGE
        const value = ref(0)
        const handleChange = jest.fn()
        const ParentComponent = {
          components: { SmSlider },
          setup: () => {
            return { value, handleChange }
          },
          template: '<sm-slider v-model="value" @change="handleChange"></sm-slider>',
        }

        // ACT
        render(ParentComponent)

        value.value = 2

        await waitFor(() => expect(handleChange).toHaveBeenCalledWith(2))
      })
    })
  })
})
