import { render, screen } from '@testing-library/vue'
import SmLoadingForm from './sm-loading-form.vue'

describe('SmLoadingForm', () => {

  describe('props', () => {

    describe('count', () => {

      it('should generate form items based on specified count', () => {
        render(SmLoadingForm)

        expect(screen.getAllByRole('textbox').length).toBe(3)
      })

      it('should generate form items based on props count (number)', () => {
        render(
          SmLoadingForm,
          {
            props: { count: 5 },
          },
        )

        expect(screen.getAllByRole('textbox').length).toBe(15)
      })

      it('should generate form items based on props count (string)', () => {
        render(
          SmLoadingForm,
          {
            props: { count: '3' },
          },
        )

        expect(screen.getAllByRole('textbox').length).toBe(9)
      })

    })

  })

})
