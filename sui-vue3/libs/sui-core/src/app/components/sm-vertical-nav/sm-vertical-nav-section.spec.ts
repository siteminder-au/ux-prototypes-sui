import { render, screen, waitFor } from '@testing-library/vue'
import SmVerticalNavSection from './sm-vertical-nav-section.vue'

describe('SmVerticalNavSection', () => {
  describe('props', () => {
    it('should display the provided label prop', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmVerticalNavSection },
        template: '<sm-vertical-nav-section label="Section label"/>',
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('heading', { name: 'Section label' })).toBeVisible())
    })
  })

  describe('slots', () => {
    it('should display the provided label slot', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmVerticalNavSection },
        template: `
          <sm-vertical-nav-section label="Section label prop">
            <template #label>
              Section label slot
            </template>

            Default slot
          </sm-vertical-nav-section>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByText('Section label slot')).toBeVisible())
      expect(screen.queryByText('Section label prop')).not.toBeInTheDocument()
      expect(screen.getByText('Default slot')).toBeVisible()
    })
  })
})
