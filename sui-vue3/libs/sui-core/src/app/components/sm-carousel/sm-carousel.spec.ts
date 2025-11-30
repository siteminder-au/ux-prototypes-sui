import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { ref } from 'vue'
import SmCarousel from './sm-carousel.vue'
import SmButton from '../sm-button/sm-button.vue'

describe('SmCarousel', () => {
  describe('props', () => {
    it('should render the accessible list items', async () => {
      const props = {
        data: [
          { src: './image1', alt: '' },
          { src: './image1', alt: '' },
          { src: './image1', alt: '' },
        ],
        numberCounter: true,
      }
      // ACT
      render(SmCarousel, {
        props,
      })
      // ASSERT
      expect(screen.getByRole('listitem')).toBeVisible()
      await waitFor(() => expect(screen.getAllByRole('listitem').length).toBe(2))
      expect(screen.getAllByRole('list').length).toBe(2)
    })

    it('should render accessible the slide one image', async () => {
      const props = {
        data: [
          { src: './image1', alt: 'image one' },
          { src: './image1', alt: 'image two' },
          { src: './image1', alt: 'image three' },
        ],
        numberCounter: true,
      }
      // ACT
      render(SmCarousel, {
        props,
      })
      // ASSERT
      expect(screen.getByRole('figure', { name: '' })).toBeVisible()
      await waitFor(() => expect(screen.getByRole('img', { name: 'image one' })).toBeVisible())
      expect(screen.queryByRole('img', { name: 'image two' })).not.toBeInTheDocument()
    })

    it('should render the controller buttons and emit events', async () => {
      const next = jest.fn()
      const previous = jest.fn()
      // ARRANGE
      const ParentComponent = {
        components: { SmCarousel, SmButton },
        setup: () => {
          const currentIndex = ref<number>(0)
          const data = ref([
            { src: './imag1', alt: 'image one' },
            { src: './imag1', alt: 'image two' },
            { src: './imag1', alt: 'image three' },
          ])

          next.mockImplementation(() => {
            currentIndex.value = 1
          })

          previous.mockImplementation(() => {
            currentIndex.value = 0
          })

          return { data, next, previous }
        },
        template: `
            <sm-carousel :data="data" height="200px" :number-counter="true" @next=next @prev=previous />
          `,
      }
      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('button', { name: 'Next image' })).toBeVisible())
      const nextButton = screen.getByRole('button', { name: 'Next image' })
      await userEvent.click(nextButton)
      await waitFor(() => expect(screen.getByRole('img', { name: 'image two' })).toBeVisible())
      expect(next).toHaveBeenCalledTimes(1)

      expect(screen.getByRole('button', { name: 'Previous image' })).toBeVisible()
      const prevButton = screen.getByRole('button', { name: 'Previous image' })
      await userEvent.click(prevButton)
      await waitFor(() => expect(screen.getByRole('img', { name: 'image one' })).toBeVisible())
      expect(previous).toHaveBeenCalledTimes(1)

    })

    it('should render the slide nav circle buttons', async () => {
      const props = {
        data: [
          { src: './image1', alt: 'image one' },
          { src: './image1', alt: 'image two' },
          { src: './image1', alt: 'image three' },
          { src: './image1', alt: 'image three' },
          { src: './image1', alt: 'image three' },
          { src: './image1', alt: 'image three' },
        ],
        numberCounter: true,
      }
      // ACT
      render(SmCarousel, {
        props,
      })
      // ASSERT
      await waitFor(() => expect(screen.getByRole('button', { name: 'item0' })).toBeVisible())
      expect(screen.getByRole('button', { name: 'item1' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'item2' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'item3' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'item4' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'item5' })).toBeVisible()
      expect(screen.getAllByRole('button').length).toBe(7)
    })

    it('should not render the slide nav circle buttons if data length is less than 5', () => {
      const props = {
        data: [
          { src: './image1', alt: 'image one' },
          { src: './image1', alt: 'image two' },
          { src: './image1', alt: 'image three' },
          { src: './image1', alt: 'image three' },
        ],
        numberCounter: true,
      }
      // ACT
      render(SmCarousel, {
        props,
      })
      // ASSERT
      expect(screen.queryByRole('button', { name: 'item-0' })).not.toBeInTheDocument()
    })

    it('should show number counters', async () => {
      const props = {
        data: [
          { src: './image1', alt: '' },
          { src: './image1', alt: '' },
          { src: './image1', alt: '' },
        ],
        numberCounter: true,
      }
      // ACT
      render(SmCarousel, {
        props,
      })
      // ASSERT
      await waitFor(() => expect(screen.getByText('1 / 3')).toBeVisible())
    })

    it('should not show number counters', async () => {
      const props = {
        data: [
          { src: './image1', alt: '' },
          { src: './image1', alt: '' },
        ],
        numberCounter: false,
      }
      // ACT
      render(SmCarousel, {
        props,
      })
      // ASSERT
      await waitFor(() => expect(screen.queryByText('1 / 2')).not.toBeInTheDocument())
    })
  })
})
