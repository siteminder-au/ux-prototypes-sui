import { render } from '@testing-library/vue'
import SmLoadingCard from './sm-loading-card.vue'

describe('SmLoadingCard', () => {

  describe('props', () => {

    describe('count', () => {

      it('should generate card items based on default count', () => {
        const { container } = render(SmLoadingCard)

        expect(container.querySelectorAll('.sm-loading-card__item').length).toBe(1)
      })

      it('should generate card items based on props count (number)', () => {
        const { container } = render(SmLoadingCard, {
          props: { count: 5 },
        })

        expect(container.querySelectorAll('.sm-loading-card__item').length).toBe(5)
      })

      it('should generate card items based on props count (string)', () => {
        const { container } = render(SmLoadingCard, {
          props: { count: '3' },
        })

        expect(container.querySelectorAll('.sm-loading-card__item').length).toBe(3)
      })

    })

  })

})
