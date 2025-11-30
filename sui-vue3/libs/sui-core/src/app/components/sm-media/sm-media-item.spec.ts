import { render, screen, waitFor } from '@testing-library/vue'
import { ref } from 'vue'
import userEvent from '@testing-library/user-event'
import SmMedia from './sm-media.vue'
import SmMediaItem from './sm-media-item.vue'
import SmButton from '../sm-button/sm-button.vue'

describe('SmMediaItem', () => {
  it('should emit the `selected/un-selected` event on click', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmMedia, SmMediaItem, SmButton },
      setup: () => {
        const images = ref([
          { src: 'images/foo.jpg' },
        ])
        const selectedImages = ref<string[]>([])
        const selectedItemHandler = (id: string, selected: boolean): void => {

          if (selected && !selectedImages.value.includes(id)) {
            // multi select
            selectedImages.value.push(id)

            return
          }

          if (!selected && selectedImages.value.includes(id)) {
            selectedImages.value = selectedImages.value.filter(item => item !== id)
          }
        }

        return {
          images,
          selectedImages,
          selectedItemHandler,
        }
      },
      template: `
        <sm-media
          v-model:images="images"
        >
          <template #media="{image}">
            <sm-media-item
              :key="image.src"
              :src="image.src"
              :selected="selectedImages.includes(image.src)"
              @selected="selectedItemHandler(image.src, true)"
              @un-selected="selectedItemHandler(image.src, false)"
            >
              <sm-button shape="square" aria-label="Edit media item">
                <sm-icon name="action-edit" aria-hidden="true" />
              </sm-button>
            </sm-media-item>
          </template>
        </sm-media>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getAllByRole('img')).toHaveLength(2))
    // we use toHaveAttribute to double check that the first img we found is the media item container
    // rather than the sm-icon that also has an img role.
    expect(screen.getAllByRole('img')[0]).toHaveAttribute('type', 'background')

    const mediaItem = screen.getAllByRole('img')[0]
    await userEvent.click(mediaItem)
    await waitFor(() => expect(screen.getAllByRole('img')).toHaveLength(3))
    expect(screen.getAllByRole('img')[2]).toHaveAttribute('name', 'action-checkmark')

    await userEvent.click(mediaItem)
    await waitFor(() => expect(screen.getAllByRole('img')).toHaveLength(2))
  })

  it('should handle `selected` items on initial load', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmMedia, SmMediaItem, SmButton },
      setup: () => {
        const images = ref([
          { src: 'images/foo.jpg' },
        ])
        return {
          images,
        }
      },
      template: `
        <sm-media
          v-model:images="images"
        >
          <template #media="{image}">
            <sm-media-item
              :key="image.src"
              :src="image.src"
              :selected="true"
            >
              <sm-button shape="square" aria-label="Edit media item">
                <sm-icon name="action-edit" aria-hidden="true" />
              </sm-button>
            </sm-media-item>
          </template>
        </sm-media>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getAllByRole('img')).toHaveLength(3))
    // we use toHaveAttribute to double check that the first img we found is the media item container
    // rather than the sm-icon that also has an img role.
    expect(screen.getAllByRole('img')[0]).toHaveAttribute('type', 'background')
    expect(screen.getAllByRole('img')[2]).toHaveAttribute('name', 'action-checkmark')
  })

  it('should display the default slot content on hover', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmMedia, SmMediaItem, SmButton },
      setup: () => {
        const images = ref([
          { src: 'images/foo.jpg', altText: 'Test label' },
        ])
        return {
          images,
        }
      },
      template: `
        <sm-media v-model:images="images">
          <template #media="{ image }">
            <sm-media-item
              :key="image.src"
              :src="image.src"
              :aria-label="image.altText"
            >
              <sm-button shape="square" aria-label="Edit media item">
                <sm-icon name="action-edit" />
              </sm-button>
            </sm-media-item>
          </template>
        </sm-media>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(screen.queryByRole('button', { name: 'Edit media item' })).not.toBeInTheDocument()

    await userEvent.hover(screen.getByRole('img', { name: 'Test label' }))

    expect(await screen.findByRole('button', { name: 'Edit media item' })).toBeVisible()
  })

  it('should display the left-action slot content on hover', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmMedia, SmMediaItem, SmButton },
      setup: () => {
        const images = ref([
          { src: 'images/foo.jpg', altText: 'Test label' },
        ])
        return {
          images,
        }
      },
      template: `
        <sm-media v-model:images="images">
          <template #media="{ image }">
            <sm-media-item
              :key="image.src"
              :src="image.src"
              :aria-label="image.altText"
            >
              <template #left-action>
                <sm-button shape="square" aria-label="Edit media item">
                  <sm-icon name="action-edit" />
                </sm-button>
              </template>
            </sm-media-item>
          </template>
        </sm-media>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(screen.queryByRole('button', { name: 'Edit media item' })).not.toBeInTheDocument()

    await userEvent.hover(screen.getByRole('img', { name: 'Test label' }))

    expect(await screen.findByRole('button', { name: 'Edit media item' })).toBeVisible()
  })

  it('should always display the left-action slot content when alwaysShowLeftAction prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmMedia, SmMediaItem, SmButton },
      setup: () => {
        const images = ref([
          { src: 'images/foo.jpg', altText: 'Test label' },
        ])
        return {
          images,
        }
      },
      template: `
        <sm-media v-model:images="images">
          <template #media="{ image }">
            <sm-media-item
              :key="image.src"
              :src="image.src"
              :aria-label="image.altText"
              :always-show-left-action="true"
            >
              <template #left-action>
                <sm-button shape="square" aria-label="Edit media item">
                  <sm-icon name="action-edit" />
                </sm-button>
              </template>
            </sm-media-item>
          </template>
        </sm-media>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findByRole('button', { name: 'Edit media item' })).toBeVisible()
  })

  it('should display the footer slot content', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmMedia, SmMediaItem, SmButton },
      setup: () => {
        const images = ref([
          { src: 'images/foo.jpg', altText: 'Test label' },
        ])
        return {
          images,
        }
      },
      template: `
        <sm-media v-model:images="images">
          <template #media="{ image }">
            <sm-media-item
              :key="image.src"
              :src="image.src"
              :aria-label="image.altText"
            >
              <template #footer>
                Some footer content
              </template>
            </sm-media-item>
          </template>
        </sm-media>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findByText('Some footer content')).toBeVisible()
  })
})
