import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { ref } from 'vue'
import userEvent from '@testing-library/user-event'
import SmMedia from './sm-media.vue'
import SmMediaItem from './sm-media-item.vue'
import SmButton from '../sm-button/sm-button.vue'

jest.useFakeTimers()

describe('SmMedia', () => {
  // In some of the SmMedia tests, we use fireEvent.update instead since for some reason userEvent.upload() doesn't work
  // when the accepted mime types does not allow the files we're manually passing in. For other tests, we use userEvent.upload()
  // see: https://github.com/testing-library/react-testing-library/issues/93
  // These blocks of code suppresses any console.warn messages that may be caused by using fireEvent.update.
  // see: https://stackoverflow.com/questions/58163226/is-it-possible-to-disable-specific-react-warnings-from-jest-using-create-react
  // In particular, we want to suppress the following warning:
  // 'Using "fireEvent.change" may lead to unexpected results. Please use fireEvent.update() instead.'
  const originalWarn = console.warn.bind(console.warn)
  beforeAll(() => {
    console.warn = (msg: string) => !msg.toString().includes('fireEvent.change') && originalWarn(msg)
  })
  afterAll(() => {
    console.warn = originalWarn
  })

  describe('File upload', () => {
    it('should display the toast service when image size exceeds its max value', async () => {
      // ARRANGE
      const exceededMaxSizeHandler = jest.fn()
      const ParentComponent = {
        components: { SmMedia, SmMediaItem, SmButton },
        setup: () => {
          const images = ref([])

          return {
            images,
            exceededMaxSizeHandler,
          }
        },
        template: `
          <sm-media
            v-model:images="images"
            :max-file-size="0.0001"
            max-file-size-message="Max size exceeded"
            @exceededMaxSize="exceededMaxSizeHandler"
          >
            <template v-slot:empty>
              <div>
                <h2>Your property is beautiful, it needs beautiful images</h2>
                <sm-button>
                  Upload images
                </sm-button>
              </div>
            </template>
          </sm-media>
        `,
      }
      const userEventInstance = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

      // ACT
      const { container } = render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('heading', { name: 'Your property is beautiful, it needs beautiful images' })).toBeVisible())
      expect(screen.getByRole('button', { name: 'Upload images' })).toBeVisible()

      const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
      // instead of clicking the button, we manually grab the file input element and send it an event
      const uploadInput = container.querySelector<HTMLElement>('.sm-media__input-hidden input')
      if (uploadInput) {
        await userEventInstance.upload(uploadInput, file)
      }

      // we assert role and text separately because for some reason
      // expect(screen.getByRole('alert', { name: 'Max size exceeded' })) doesn't work
      await waitFor(() => expect(screen.getByRole('alert')).toBeVisible())
      expect(screen.getByText('Max size exceeded')).toBeVisible()
      expect(exceededMaxSizeHandler).toHaveBeenNthCalledWith(1, ['chucknorris.png'])

      jest.advanceTimersByTime(5000)

      await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
    })

    it('should display the toast service on invalid file types', async () => {
      // ARRANGE
      const invalidFileTypesHandler = jest.fn()
      const ParentComponent = {
        components: { SmMedia, SmMediaItem, SmButton },
        setup: () => {
          const images = ref([])
          const acceptMime = ['image/gif']

          return {
            images,
            invalidFileTypesHandler,
            acceptMime,
          }
        },
        template: `
          <sm-media
            v-model:images="images"
            :accept-mime="acceptMime"
            invalid-file-message="Invalid file type"
            @invalidFileTypes="invalidFileTypesHandler"
          >
            <template v-slot:empty>
              <div>
                <h2>Your property is beautiful, it needs beautiful images</h2>
                <sm-button>
                  Upload images
                </sm-button>
              </div>
            </template>
          </sm-media>
        `,
      }

      // ACT
      const { container } = render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('heading', { name: 'Your property is beautiful, it needs beautiful images' })).toBeVisible())
      expect(screen.getByRole('button', { name: 'Upload images' })).toBeVisible()

      const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
      const file2 = new File(['(⌐□_□)'], 'chucknorris2.png', { type: 'image/png' })
      // instead of clicking the button, we manually grab the file input element and send it an event
      const uploadInput = container.querySelector<HTMLElement>('.sm-media__input-hidden input')
      if (uploadInput) {
        // we use fireEvent.update instead since for some reason userEvent.upload() doesn't work
        // when the accepted mime types does not allow the files we're manually passing in
        await fireEvent.change(uploadInput, {
          target: { files: [file, file2] },
        })
      }

      // we assert role and text separately because for some reason
      // expect(screen.getByRole('alert', { name: 'Invalid file type' })) doesn't work
      await waitFor(() => expect(screen.getByRole('alert')).toBeVisible())
      expect(screen.getByText('Invalid file type')).toBeVisible()
      expect(invalidFileTypesHandler).toHaveBeenNthCalledWith(1, ['chucknorris.png', 'chucknorris2.png'])

      jest.advanceTimersByTime(5000)

      await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
    })

    it('should emit event `filesAdded` and handle valid/invalid files', async () => {
      // ARRANGE
      const invalidFileTypesHandler = jest.fn()
      const filesAddedHandler = jest.fn()
      const ParentComponent = {
        components: { SmMedia, SmMediaItem, SmButton },
        setup: () => {
          const images = ref([])

          return {
            images,
            invalidFileTypesHandler,
            filesAddedHandler,
          }
        },
        template: `
          <sm-media
            v-model:images="images"
            @invalidFileTypes="invalidFileTypesHandler"
            @filesAdded="filesAddedHandler"
          >
            <template v-slot:empty>
              <div>
                <h2>Your property is beautiful, it needs beautiful images</h2>
                <sm-button>
                  Upload images
                </sm-button>
              </div>
            </template>
          </sm-media>
        `,
      }

      // ACT
      const { container } = render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('heading', { name: 'Your property is beautiful, it needs beautiful images' })).toBeVisible())
      expect(screen.getByRole('button', { name: 'Upload images' })).toBeVisible()

      const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
      const file2 = new File(['(⌐□_□)'], 'chucknorris.pdf', { type: 'application/pdf' })
      // instead of clicking the button, we manually grab the file input element and send it an event
      const uploadInput = container.querySelector<HTMLElement>('.sm-media__input-hidden input')
      if (uploadInput) {
        // we use fireEvent.update instead since for some reason userEvent.upload() doesn't work
        // when the accepted mime types does not allow the files we're manually passing in
        await fireEvent.change(uploadInput, {
          target: { files: [file, file2] },
        })
      }

      // we assert role and text separately because for some reason
      // expect(screen.getByRole('alert', { name: 'Some files are not valid image types' })) doesn't work
      await waitFor(() => expect(screen.getByRole('alert')).toBeVisible())
      expect(screen.getByText('Some files are not valid image types')).toBeVisible()
      expect(invalidFileTypesHandler).toHaveBeenNthCalledWith(1, ['chucknorris.pdf'])
      expect(filesAddedHandler).toHaveBeenNthCalledWith(1, [file])

      jest.advanceTimersByTime(5000)

      await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
    })

    it('should emit consecutive `filesAdded` events when uploading files', async () => {
      // ARRANGE
      const filesAddedHandler = jest.fn<unknown[], File[][]>()
      const ParentComponent = {
        components: { SmMedia, SmMediaItem, SmButton },
        setup: () => {
          const images = ref([])

          return {
            images,
            filesAddedHandler,
          }
        },
        template: `
          <sm-media
            v-model:images="images"
            @filesAdded="filesAddedHandler"
          >
            <template v-slot:empty>
              <div>
                <h2>Your property is beautiful, it needs beautiful images</h2>
                <sm-button>
                  Upload images
                </sm-button>
              </div>
            </template>
          </sm-media>
        `,
      }
      const userEventInstance = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

      // ACT
      const { container } = render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('heading', { name: 'Your property is beautiful, it needs beautiful images' })).toBeVisible())
      expect(screen.getByRole('button', { name: 'Upload images' })).toBeVisible()

      const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
      const file2 = new File(['(⌐□_□)'], 'chucknorris2.png', { type: 'image/png' })
      const file3 = new File(['(⌐□_□)'], 'chucknorris3.png', { type: 'image/png' })

      // instead of clicking the button, we manually grab the file input element and send it an event
      const uploadInput = container.querySelector<HTMLElement>('.sm-media__input-hidden input')
      if (uploadInput) {
        // we want to be more specific and use `mock.calls` because we want to make sure that the file we uploaded is the one that is being emitted
        // and jest doesn't have a way to differentiate between File objects
        await userEventInstance.upload(uploadInput, file)
        await userEventInstance.upload(uploadInput, file2)
        await userEventInstance.upload(uploadInput, file3)

        await waitFor(() => expect(filesAddedHandler.mock.calls[0][0][0].name).toBe('chucknorris.png'))
        expect(filesAddedHandler.mock.calls[1][0][0].name).toBe('chucknorris2.png')
        expect(filesAddedHandler.mock.calls[2][0][0].name).toBe('chucknorris3.png')
      }
      expect(filesAddedHandler).toHaveBeenCalledTimes(3)
    })

    it('should give toast warning when `multiple` prop is false and multiples files uploaded', async () => {
      // ARRANGE
      const filesAddedHandler = jest.fn()
      const ParentComponent = {
        components: { SmMedia, SmMediaItem, SmButton },
        setup: () => {
          const images = ref([])

          return {
            images,
            filesAddedHandler,
          }
        },
        template: `
          <sm-media
            v-model:images="images"
            :multiple="false"
            multiple-message="Multiple files not allowed"
            @filesAdded="filesAddedHandler"
          >
            <template v-slot:empty>
              <div>
                <h2>Your property is beautiful, it needs beautiful images</h2>
                <sm-button>
                  Upload images
                </sm-button>
              </div>
            </template>
          </sm-media>
        `,
      }

      // ACT
      const { container } = render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByRole('heading', { name: 'Your property is beautiful, it needs beautiful images' })).toBeVisible())
      expect(screen.getByRole('button', { name: 'Upload images' })).toBeVisible()

      const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
      const file2 = new File(['(⌐□_□)'], 'chucknorris2.png', { type: 'image/png' })
      // instead of clicking the button, we manually grab the file input element and send it an event
      const uploadInput = container.querySelector<HTMLElement>('.sm-media__input-hidden input')
      if (uploadInput) {
        // we use fireEvent.update instead since for some reason userEvent.upload() doesn't work
        // when the accepted mime types does not allow the files we're manually passing in
        await fireEvent.change(uploadInput, {
          target: { files: [file, file2] },
        })
      }

      // we assert role and text separately because for some reason
      // expect(screen.getByRole('alert', { name: 'Multiple files not allowed' })) doesn't work
      await waitFor(() => expect(screen.getByRole('alert')).toBeVisible())
      expect(screen.getByText('Multiple files not allowed')).toBeVisible()
      expect(filesAddedHandler).not.toHaveBeenCalled()

      jest.advanceTimersByTime(5000)

      await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
    })

    it('should respect the ordering in images v-model prop', async () => {
      // ARRANGE
      const images = ref([
        { src: 'images/foo.jpg' },
      ])

      const ParentComponent = {
        components: { SmMedia, SmMediaItem, SmButton },
        setup: () => {
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
              />
              <h1>Image Src: {{ image.src }}</h1>
            </template>

            <template v-slot:empty>
              <div>
                <h2>Your property is beautiful, it needs beautiful images</h2>
                <sm-button>
                  Upload images
                </sm-button>
              </div>
            </template>
          </sm-media>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      // every sm-media-item has 2 img elements
      await waitFor(() => expect(screen.getAllByRole('img')).toHaveLength(2))
      // we use toHaveAttribute to double check that the first img we found is the media item container
      // rather than the sm-icon that also has an img role.
      expect(screen.getAllByRole('img')[0]).toHaveAttribute('type', 'background')
      // we use toHaveTextContent to assert that the first heading we found is for the first image
      expect(screen.getAllByRole('heading')[0]).toHaveTextContent('Image Src: images/foo.jpg')

      // simulate image ref got updated from an external source (e.g. a beef call)
      images.value.push({ src: 'images/foo2.jpg' })

      await waitFor(() => expect(screen.getAllByRole('img')).toHaveLength(4))
      // we use toHaveAttribute to double check that the first img we found is the media item container
      // rather than the sm-icon that also has an img role.
      expect(screen.getAllByRole('img')[2]).toHaveAttribute('type', 'background')
      expect(screen.getAllByRole('heading')[1]).toHaveTextContent('Image Src: images/foo2.jpg')

      // let's flip the order of the images (simulate user dragging the images)
      // NOTE: can't figure out a way to simulate dragging the images in jest so we just do it this way
      images.value = [
        { src: 'images/foo2.jpg' },
        { src: 'images/foo.jpg' },
      ]

      // the heading order should've flipped which validated that vuedraggable respects the order of the `images` array
      await waitFor(() => expect(screen.getAllByRole('heading')[0]).toHaveTextContent('Image Src: images/foo2.jpg'))
      expect(screen.getAllByRole('heading')[1]).toHaveTextContent('Image Src: images/foo.jpg')
    })
  })
})
