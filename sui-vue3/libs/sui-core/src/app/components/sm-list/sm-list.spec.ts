import { render, screen, fireEvent } from '@testing-library/vue'
import { ref } from 'vue'
import Draggable from 'vuedraggable'
import SmList from './sm-list.vue'
import SmListItem from './sm-list-item.vue'

describe('SmList', () => {
  describe('draggable', () => {

    it('should render the draggable list', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmList },
        setup: () => {

          const colours = ref([
            { label: 'Red', id: 1 },
            { label: 'Green', id: 2 },
            { label: 'Blue', id: 3 },
          ])

          return { colours }
        },
        template: `
        <div>
          <sm-list draggable :list="colours">
            <template #list="{item}">
              {{ item.label }}
            </template>
          </sm-list>
        </div>
      `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.getByText('Red')).toBeVisible()
      expect(screen.getByRole('list')).toBeVisible()
      expect(screen.getAllByRole('listitem').length).toBe(3)
    })
    it('should not render the draggable list', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmList },
        setup: () => {

          const colours = ref([
            { label: 'Red', id: 1 },
            { label: 'Green', id: 2 },
            { label: 'Blue', id: 3 },
          ])

          return { colours }
        },
        template: `
        <div>
          <sm-list :list="colours">
            <template #list="{item}">
              {{ item.label }}
            </template>
          </sm-list>
        </div>
      `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.getByRole('list')).toBeVisible()
      expect(screen.queryByText('Red')).not.toBeInTheDocument()
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    })

    it('should render the non-draggable list items', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmList, SmListItem },
        template: `
        <div>
          <sm-list>
            <sm-list-item label="Meat balls" />
            <sm-list-item label="Pasta" />
          </sm-list>
        </div>
      `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.getByRole('list')).toBeVisible()
      expect(screen.getByText('Meat balls')).toBeVisible()
      expect(screen.getAllByRole('listitem').length).toBe(2)
    })
    it('should not render the non-draggable list items', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmList, SmListItem },
        template: `
        <div>
          <sm-list draggable>
            <sm-list-item label="Meat balls" />
            <sm-list-item label="Pasta" />
          </sm-list>
        </div>
      `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.getByRole('list')).toBeVisible()
      expect(screen.queryByText('Meat balls')).not.toBeInTheDocument()
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    })

    it('should attach provided classes when draggable plugin is interacted with', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmList, SmListItem, Draggable },
        setup: () => {
          const colours = ref([
            { label: 'Red', id: 1 },
            { label: 'Green', id: 2 },
            { label: 'Blue', id: 3 },
          ])

          return { colours }
        },
        template: `
          <sm-list draggable :list="colours">
            <template #list="{item}">
              {{ item.label }}
            </template>
          </sm-list>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      const listItems = await screen.findAllByRole('listitem')
      const itemOne = listItems.at(0)
      const itemTwo = listItems.at(1)
      const itemThree = listItems.at(2)
      expect(listItems).toHaveLength(3)
      expect(itemOne).toHaveTextContent('Red')
      expect(itemOne).toBeVisible()
      expect(itemTwo).toHaveTextContent('Green')
      expect(itemTwo).toBeVisible()
      expect(itemThree).toHaveTextContent('Blue')
      expect(itemThree).toBeVisible()

      await fireEvent.mouseDown(listItems[2])

      // We assert class names here because drag and drop events are not supported by jsdom
      // See https://testing-library.com/docs/example-drag/ which notes it's
      // only for real browsers
      expect(itemThree).toHaveClass('sm-list-item--chosen')
      expect(itemThree).not.toHaveClass('sm-list-item--drag')

      await fireEvent.dragStart(listItems[2])

      expect(itemThree).toHaveClass('sm-list-item--chosen')
      expect(itemThree).toHaveClass('sm-list-item--drag')

      await fireEvent.dragEnter(listItems[0])
      await fireEvent.drop(listItems[0])
      await fireEvent.dragLeave(listItems[0])
      await fireEvent.dragEnd(listItems[2])
      await fireEvent.mouseUp(listItems[0], { which: 1, button: 0 })

      expect(itemThree).not.toHaveClass('sm-list-item--chosen')
    })

  })

  describe('slots', () => {

    it('should render the default slot', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmList },
        template: `
          <div>
            <sm-list>
              <template #default>
                <div>default slot</div>
              </template>
            </sm-list>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.getByText('default slot')).toBeVisible()
    })

    it('should not render the default slot if draggable prop is set to true', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmList },
        template: `
          <div>
            <sm-list draggable>
              <template #default>
                <div>default slot</div>
              </template>
            </sm-list>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.queryByText('default slot')).not.toBeInTheDocument()
    })

    it('should render the header slot', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmList },
        template: `
          <div>
            <sm-list>
              <template #header>
                <div>header slot</div>
              </template>
            </sm-list>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.getByText('header slot')).toBeVisible()
    })

    it('should not render the header slot if list is draggable', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmList },
        template: `
        <div>
          <sm-list draggable>
            <template #header>
              <div>header slot</div>
            </template>
          </sm-list>
        </div>
      `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.queryByText('header slot')).not.toBeInTheDocument()
    })
    it('should render the item slot if list is draggable', () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmList },
        setup: () => {

          const colours = ref([
            { label: 'Red', id: 1 },
            { label: 'Green', id: 2 },
            { label: 'Blue', id: 3 },
          ])

          return { colours }
        },
        template: `
        <div>
          <sm-list draggable :list="colours">
            <template #list="{item}">
              {{ item.label }}
            </template>
          </sm-list>
        </div>
      `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      expect(screen.getByText('Red')).toBeVisible()
      expect(screen.getByText('Green')).toBeVisible()
      expect(screen.getByText('Blue')).toBeVisible()
      expect(screen.getAllByRole('listitem')).toHaveLength(3)

    })

  })

})
