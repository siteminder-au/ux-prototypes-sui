import { render, screen } from '@testing-library/vue'
import SmListItem from './sm-list-item.vue'

describe('SmListItem', () => {

  describe('label', () => {

    it('should render the label if prop is provided', () => {
      const ParentComponent = {
        components: { SmListItem },

        template: `
          <sm-list-item label="test-label"></sm-list-item>
        `,
      }
      // ACT
      render(ParentComponent)
      // ASSERT
      expect(screen.getByText('test-label')).toBeVisible()
    })

    it('should not render the label if default slot is provided', () => {
      const ParentComponent = {
        components: { SmListItem },

        template: `
          <sm-list-item label="test-label">
            default slot
          </sm-list-item>
        `,
      }
      // ACT
      render(ParentComponent)
      // ASSERT
      expect(screen.getByText('default slot')).toBeVisible()
      expect(screen.queryByText('test-label')).not.toBeInTheDocument()
    })

  })

  describe('slots', () => {

    it('should render the default slot', () => {
      const ParentComponent = {
        components: { SmListItem },
        template: `
            <sm-list-item>
              default slot
            </sm-list-item>
          `,
      }
      // ACT
      render(ParentComponent)
      // ASSERT
      expect(screen.getByText('default slot')).toBeVisible()
    })

  })
})
