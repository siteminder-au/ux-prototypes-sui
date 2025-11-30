import { render, screen } from '@testing-library/vue'
import SmContainer from './sm-container.vue'

describe('SmContainer', () => {

  describe('props', () => {

    describe('fullWidth', () => {

      it('should not set the fullWidth by default', () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmContainer },
          template: `
            <sm-container>
              Content
            </sm-container>
            `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        expect(screen.getByText('Content')).toBeVisible()
      })

    })

  })

})
