import { render, screen } from '@testing-library/vue'
import SmSliderTooltip from './sm-slider-tooltip.vue'

describe('SmSliderTooltip', () => {

  describe('range', () => {
    it('should have start tooltip for range', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSliderTooltip },
        template: '<sm-slider-tooltip :inputValue="[11, 22]" range is-start-tooltip-visible />',
      }

      // ACT
      render(ParentComponent)

      expect(screen.getByText('11')).toBeVisible()
    })

    it('should have end tooltip for range', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSliderTooltip },
        template: '<sm-slider-tooltip :inputValue="[11, 22]" range />',
      }

      // ACT
      render(ParentComponent)

      expect(screen.getByText('22')).toBeVisible()
    })
  })

  describe('isEndTooltipVisible', () => {
    it('should show start point tooltip', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSliderTooltip },
        template: '<sm-slider-tooltip :inputValue="[11, 22]" range is-end-tooltip-visible/>',
      }

      // ACT
      render(ParentComponent)

      expect(screen.getByText('22')).toBeVisible()
    })
  })
  describe('isStartTooltipVisible', () => {
    it('should show start point tooltip', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSliderTooltip },
        template: '<sm-slider-tooltip :inputValue="0" range is-start-tooltip-visible/>',
      }

      // ACT
      render(ParentComponent)

      expect(screen.getByText('0')).toBeVisible()
    })

    it('should show range start point tooltip', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSliderTooltip },
        template: '<sm-slider-tooltip :inputValue="[0, 2]" range is-start-tooltip-visible/>',
      }

      // ACT
      render(ParentComponent)

      expect(screen.getByText('0')).toBeVisible()
    })
  })

  describe('tooltip content', () => {
    it('should display input start value', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSliderTooltip },
        template: '<sm-slider-tooltip :inputValue="1" is-start-tooltip-visible/>',
      }

      // ACT
      render(ParentComponent)

      expect(screen.getByText('1')).toBeVisible()
    })

    it('should display input start value', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmSliderTooltip },
        template: '<sm-slider-tooltip :inputValue="1" is-start-tooltip-visible/>',
      }

      // ACT
      render(ParentComponent)

      expect(screen.getByText('1')).toBeVisible()
    })
  })
})
