import { render } from '@testing-library/vue'
import SmLoadingList from './sm-loading-list.vue'

describe('SmLoadingList', () => {

  describe('props', () => {

    describe('count', () => {
      it('should add a single item by default', () => {
        const { container } = render(SmLoadingList)

        expect(container.querySelector('.sm-loading-list')).toBeInTheDocument()
        expect(container.querySelectorAll('.sm-loading-list__item').length).toBe(1)
      })

      it('should add items based on the provided count', () => {
        const { container } = render(SmLoadingList, {
          props: { count: 4 },
        })

        expect(container.querySelector('.sm-loading-list')).toBeInTheDocument()
        expect(container.querySelectorAll('.sm-loading-list__item').length).toBe(4)
      })

    })

  })

})
