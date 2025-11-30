import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import SmSliderBar from './sm-slider-bar.vue'

describe('SmSliderBar', () => {
  describe('props', () => {
    describe('type', () => {

      it('should show two sliders when the type prop is success for range', () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmSliderBar },
          template: '<sm-slider-bar :modelValue="[0,20]" type="success" range />',
        }

        // ACT
        render(ParentComponent)

        expect(screen.getAllByRole('slider')).toHaveLength(2)
        expect(screen.getByText('0')).toBeVisible()
        expect(screen.getByText('20')).toBeVisible()
      })

      it('should show two sliders when the type prop is warning for range', () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmSliderBar },
          template: '<sm-slider-bar :modelValue="[0,20]" type="warning" range />',
        }

        // ACT
        render(ParentComponent)

        expect(screen.getAllByRole('slider')).toHaveLength(2)
        expect(screen.getByText('0')).toBeVisible()
        expect(screen.getByText('20')).toBeVisible()
      })
    })

    describe('range', () => {
      it('Should have two sliders', () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmSliderBar },
          template: '<sm-slider-bar :modelValue="[0,20]" show-stops range :min="0" />',
        }

        // ACT
        render(ParentComponent)

        expect(screen.getAllByRole('slider')).toHaveLength(2)
      })
    })

    describe('showTooltip', () => {
      it('show tooltip', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmSliderBar },
          template: '<sm-slider-bar :modelValue="0" show-tooltip />',
        }

        // ACT
        render(ParentComponent)

        screen.getByRole('slider').focus()
        await waitFor(() => expect(screen.getByText('0')).toBeVisible())
      })
    })

    describe('isMouseEventStart', () => {
      it('focus in event', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmSliderBar },
          template: '<sm-slider-bar :modelValue="0" show-tooltip />',
        }

        // ACT
        render(ParentComponent)

        screen.getByRole('slider').focus()
        expect(await screen.findByText('0')).toBeVisible()
      })

      it('focus out event', () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmSliderBar },
          template: '<sm-slider-bar :modelValue="0" show-tooltip />',
        }

        // ACT
        render(ParentComponent)

        screen.getByRole('slider').blur()
        expect(screen.queryByText('0')).not.toBeVisible()
      })

      it('mouse down event', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmSliderBar },
          template: '<sm-slider-bar :modelValue="0" show-tooltip />',
        }

        // ACT
        render(ParentComponent)

        await fireEvent.mouseDown(screen.getByRole('slider'))

        expect(screen.getByText('0')).toBeVisible()
      })

      it('mouse up event', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmSliderBar },
          template: '<sm-slider-bar :modelValue="0" show-tooltip />',
        }

        // ACT
        render(ParentComponent)

        await fireEvent.mouseUp(screen.getByRole('slider'))
        expect(screen.queryByText('0')).not.toBeVisible()
      })
    })
  })
})
