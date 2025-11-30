import { render, screen, waitFor } from '@testing-library/vue'
import SmNavItemLabel from './sm-nav-item-label.vue'

describe('SmNavItemLabel', () => {
  describe('props', () => {
    it('should display the provided label', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmNavItemLabel },
        template: '<sm-nav-item-label label="Test label prop"/>',
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByText('Test label prop')).toBeVisible())
    })
  })

  describe('slots', () => {
    it('should render the prefix-icon slot', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmNavItemLabel },
        template: `
          <sm-nav-item-label label="Test label prop">
            <template #prefix-icon>
              test-prefix-icon-slot
            </template>
          </sm-nav-item-label>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByText('Test label prop')).toBeVisible())
      expect(screen.getByText('test-prefix-icon-slot')).toBeVisible()
    })

    it('should render the suffix-icon slot', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmNavItemLabel },
        template: `
          <sm-nav-item-label label="Test label prop">
            <template #suffix-icon>
              test-suffix-icon-slot
            </template>
          </sm-nav-item-label>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByText('Test label prop')).toBeVisible())
      expect(screen.getByText('test-suffix-icon-slot')).toBeVisible()
    })

    it('should render the content-icon slot', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmNavItemLabel },
        template: `
          <sm-nav-item-label label="Test label prop">
            <template #content>
              test-content-slot
            </template>
          </sm-nav-item-label>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByText('Test label prop')).toBeVisible())
      expect(screen.getByText('test-content-slot')).toBeVisible()
    })
  })
})
