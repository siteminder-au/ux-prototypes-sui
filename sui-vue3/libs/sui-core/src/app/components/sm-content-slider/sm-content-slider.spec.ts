import { userEvent } from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'
import { ref } from 'vue'
import SmContentSlider from './sm-content-slider.vue'
import SmContentSliderItem from './sm-content-slider-item.vue'

describe('SmContentSlider / SmContentSliderItem', () => {

  it('should render an empty list when no images is provided', async () => {
    const ParentComponent = {
      components: { SmContentSlider, SmContentSliderItem },
      setup: () => {
        const images = ref([])
        return { images }
      },
      template: `
        <sm-content-slider />
      `,
    }
    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findByRole('list')).toBeVisible()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
  })

  it('should render a list and provided slider-item as list items', async () => {
    const ParentComponent = {
      components: { SmContentSlider, SmContentSliderItem },
      setup: () => {
        const images = ref([
          { src: './image1' },
          { src: './image2' },
        ])
        return { images }
      },
      template: `
        <sm-content-slider v-model:items="images">
          <sm-content-slider-item :index="0">
            Item 1
          </sm-content-slider-item>
          <sm-content-slider-item :index="1">
            Item 2
          </sm-content-slider-item>
        </sm-content-slider>
      `,
    }
    // ACT
    render(ParentComponent)

    // ASSERT
    const list = await screen.findByRole('list')
    const listItems = await screen.findAllByRole('listitem')
    const deleteButtons = await screen.findAllByRole('button', { name: 'Delete' })

    expect(list).toBeVisible()
    expect(listItems).toHaveLength(2)
    expect(listItems.at(0)).toBeVisible()
    expect(listItems.at(0)).toHaveTextContent('Item 1')
    expect(listItems.at(1)).toBeVisible()
    expect(listItems.at(1)).toHaveTextContent('Item 2')
    expect(deleteButtons).toHaveLength(2)
    expect(deleteButtons.at(0)).toBeEnabled()
    expect(deleteButtons.at(1)).toBeEnabled()

    // No navigation buttons because visible items count is greater than the total items
    expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
  })

  it('should delete an item when an item\'s delete button is clicked', async () => {
    // ARRANGE
    const mockDeleteItem = jest.fn()
    const ParentComponent = {
      components: { SmContentSlider, SmContentSliderItem },
      setup: () => {
        const images = ref([
          { src: './image1' },
          { src: './image2' },
        ])
        return { images, mockDeleteItem }
      },
      template: `
        <sm-content-slider v-model:items="images">
          <sm-content-slider-item
            v-for="(image, i) in images"
            :index="i"
            :key="i"
            @delete-item="mockDeleteItem"
          >
            Item
          </sm-content-slider-item>
        </sm-content-slider>
      `,
    }
    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findByRole('list')).toBeVisible()
    expect(await screen.findAllByRole('listitem')).toHaveLength(2)
    expect(mockDeleteItem).toHaveBeenCalledTimes(0)

    await userEvent.click(screen.getAllByRole('button', { name: 'Delete' })[1])

    expect(await screen.findByRole('list')).toBeVisible()
    expect(await screen.findAllByRole('listitem')).toHaveLength(1)
    expect(mockDeleteItem).toHaveBeenCalledTimes(1)
    expect(mockDeleteItem).toHaveBeenCalledWith({ src: './image2' })

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(await screen.findByRole('list')).toBeVisible()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    expect(mockDeleteItem).toHaveBeenCalledTimes(2)
    expect(mockDeleteItem).toHaveBeenCalledWith({ src: './image1' })
  })

  it('should not display the delete button when the showDelete prop is set to false', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmContentSlider, SmContentSliderItem },
      setup: () => {
        const images = ref([
          { src: './image1' },
          { src: './image2' },
        ])
        return { images }
      },
      template: `
        <sm-content-slider v-model:items="images">
          <sm-content-slider-item
            v-for="(image, i) in images"
            :index="i"
            :key="i"
            :show-delete="false"
          >
            Item
          </sm-content-slider-item>
        </sm-content-slider>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findAllByRole('listitem')).toHaveLength(2)
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
  })

  it('should navigate the hidden items when next and prev buttons are clicked', async () => {
    // ARRANGE
    const mockSlideNext = jest.fn()
    const mockSlidePrev = jest.fn()
    const ParentComponent = {
      components: { SmContentSlider, SmContentSliderItem },
      setup: () => {
        const images = ref([
          { src: './image1' },
          { src: './image2' },
          { src: './image3' },
          { src: './image4' },
        ])
        return { images, mockSlideNext, mockSlidePrev }
      },
      template: `
        <sm-content-slider
          v-model:items="images"
          :item-visible="1"
          height="200px"
          @slide-next="mockSlideNext"
          @slide-prev="mockSlidePrev"
        >
          <sm-content-slider-item
            v-for="(image, i) in images"
            :index="i"
            :key="i"
          >
            Item: {{ image.src }}
          </sm-content-slider-item>
        </sm-content-slider>
      `,
    }
    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findByRole('list')).toBeVisible()
    expect(await screen.findAllByRole('listitem')).toHaveLength(4) // Still in the DOM, we just hide the overflow
    expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument() // In first item
    expect(screen.getByRole('button', { name: 'Next' })).toBeVisible()
    expect(mockSlideNext).toHaveBeenCalledTimes(0)
    expect(mockSlidePrev).toHaveBeenCalledTimes(0)
    expect(screen.getByText('Item: ./image1')).toBeVisible()
    expect(screen.getByText('Item: ./image2')).toBeVisible()
    expect(screen.getByText('Item: ./image3')).toBeVisible()
    expect(screen.getByText('Item: ./image4')).toBeVisible()

    // Slide next once
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(await screen.findByRole('button', { name: 'Previous' })).toBeVisible()
    expect(await screen.findByRole('button', { name: 'Next' })).toBeVisible()
    expect(mockSlideNext).toHaveBeenCalledTimes(1)
    expect(mockSlidePrev).toHaveBeenCalledTimes(0)

    // Move until the last item
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(await screen.findByRole('button', { name: 'Previous' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
    expect(mockSlideNext).toHaveBeenCalledTimes(3)
    expect(mockSlidePrev).toHaveBeenCalledTimes(0)

    // Slide back to once
    await userEvent.click(screen.getByRole('button', { name: 'Previous' }))

    expect(await screen.findByRole('button', { name: 'Previous' })).toBeVisible()
    expect(await screen.findByRole('button', { name: 'Next' })).toBeVisible()
    expect(mockSlideNext).toHaveBeenCalledTimes(3)
    expect(mockSlidePrev).toHaveBeenCalledTimes(1)

    // Slide back to first item
    await userEvent.click(screen.getByRole('button', { name: 'Previous' }))
    await userEvent.click(screen.getByRole('button', { name: 'Previous' }))

    expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument() // In first item
    expect(screen.getByRole('button', { name: 'Next' })).toBeVisible()
    expect(mockSlideNext).toHaveBeenCalledTimes(3)
    expect(mockSlidePrev).toHaveBeenCalledTimes(3)
  })

})
