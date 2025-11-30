import { ref, onMounted } from 'vue'
import { SmMedia, SmMediaItem } from '../index'
import SmButton from '../../sm-button/sm-button.vue'

import defaultExample from './images/media-default.png'
import themedExample from './images/media-themed.png'

import image1020 from './images/picsum/1020.jpg'
import image1021 from './images/picsum/1021.jpg'
import image1022 from './images/picsum/1022.jpg'
import image1023 from './images/picsum/1023.jpg'
import image1024 from './images/picsum/1024.jpg'
import image1025 from './images/picsum/1025.jpg'
import image1026 from './images/picsum/1026.jpg'
import image1027 from './images/picsum/1027.jpg'
import image1028 from './images/picsum/1028.jpg'
import image1029 from './images/picsum/1029.jpg'

import image1050 from './images/picsum/1050.jpg'
import image1051 from './images/picsum/1051.jpg'
import image1052 from './images/picsum/1052.jpg'
import image1053 from './images/picsum/1053.jpg'
import image1054 from './images/picsum/1054.jpg'
import image1055 from './images/picsum/1055.jpg'
import image1056 from './images/picsum/1056.jpg'
import image1057 from './images/picsum/1057.jpg'
import image1058 from './images/picsum/1058.jpg'
import image1059 from './images/picsum/1059.jpg'

import image1060 from './images/picsum/1060.jpg'
import image1061 from './images/picsum/1061.jpg'
import image1062 from './images/picsum/1062.jpg'
import image1063 from './images/picsum/1063.jpg'
import image1064 from './images/picsum/1064.jpg'
import image1065 from './images/picsum/1065.jpg'
import image1066 from './images/picsum/1066.jpg'
import image1067 from './images/picsum/1067.jpg'
import image1068 from './images/picsum/1068.jpg'
import image1069 from './images/picsum/1069.jpg'

import { isPercyContext } from '../../../../../test/percy/helpers'

interface Image {
  src: string
  order?: number
  id?: number
  name?: string
  isMainPhoto?: boolean
  hasWarning?: boolean
  hasAlert?: boolean
  isExternal?: boolean
}

export default {
  title: 'Components/Media',
  component: SmMedia,
  subcomponents: {
    'sm-media-item': SmMediaItem,
  },
  parameters: {
    a11y: {
      // Running accessibility test and re-triggering automatically in a
      // page with 200 images can be very expensive and can block UI thread.
      // Disabling it in the top level so navigating between media stories doesn't hang
      // Also in Storybook 6, the "disabled" property has been renamed to "disable"
      // See https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#deprecated-disabled-parameter
      disable: true,
    },
  },
}

export const DefaultPopulated = () => ({
  components: {
    SmMedia,
    SmMediaItem,
    SmButton,
  },
  setup: () => {
    const acceptMime = ref(['image/png', 'image/jpg', 'image/jpeg', 'image/gif'])

    const uploadedFiles = (files: FileList[]) => {

      console.info('Uploaded - files', files)
    }
    const images = ref<Image[]>([])

    const linkMaker = () => {
      for (let i = 0; i < 200; i += 1) {
        images.value.push({ src: `https://picsum.photos/1150/940?random=${i}`, order: i })
      }
    }

    onMounted(() => {
      linkMaker()
    })

    const selectedImages = ref<string[]>([])
    const selectedItemHandler = (id: string, selected: boolean): void => {

      if (selected && !selectedImages.value.includes(id)) {
        // single selection
        // selectedImages.value = [id]

        // multi select
        selectedImages.value.push(id)

        return
      }

      if (!selected && selectedImages.value.includes(id)) {
        selectedImages.value = selectedImages.value.filter(item => item !== id)
      }
    }

    return {
      selectedImages,
      selectedItemHandler,
      uploadedFiles,
      images,
      acceptMime,
    }
  },
  template: `
    <div>
      <sm-media
        @filesAdded="uploadedFiles"
        :accept-mime="acceptMime"
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
    </div>
  `,
})

DefaultPopulated.storyName = 'Default - Populated'

const defaultDescription = `
  <pre>
    const uploadedFiles = (files: FileList[]) => {
      // Do stuff with files
    }
  </pre>
  Note: Refer to https://developer.mozilla.org/en-US/docs/Web/API/FileList for the FileList native type
`
DefaultPopulated.parameters = {
  docs: {
    description: {
      component: defaultDescription,
    },
  },
}

export const DefaultEmpty = () => ({
  components: {
    SmMedia,
    SmMediaItem,
  },
  setup: () => {
    const images = ref<Image[]>([])
    const acceptMime = ref(['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'text/csv'])

    const openSysUpload = () => {
      const inputElement: HTMLInputElement | null = document.querySelector('.sm-media__input-hidden input') ?? null
      inputElement?.click()
    }
    const uploadedFiles = (files: FileList[]) => {
      files.forEach(() => {
        images.value.push({
          src: `https://picsum.photos/1150/940?random=${images.value.length + 1}`,
        })
      })
      console.info('Uploaded - files', files)
    }

    const exceededMaxSizeFiles = (fileNames: FileList[]) => {
      console.info('exceededMaxSize - file names', fileNames)
    }
    const invalidFileTypesFiles = (fileNames: FileList[]) => {
      console.info('invalidFileTypes - file names', fileNames)
    }

    const selectedImages = ref<string[]>([])
    const selectedItemHandler = (id: string, selected: boolean): void => {
      if (selected && !selectedImages.value.includes(id)) {
        // single selection
        // selectedImages.value = [id]

        // multi select
        selectedImages.value.push(id)

        return
      }

      if (!selected && selectedImages.value.includes(id)) {
        selectedImages.value = selectedImages.value.filter(item => item !== id)
      }
    }

    return {
      selectedImages,
      selectedItemHandler,
      uploadedFiles,
      images,
      acceptMime,
      openSysUpload,
      exceededMaxSizeFiles,
      invalidFileTypesFiles,
    }
  },
  template: `
    <div>
      <sm-media
        @filesAdded="uploadedFiles"
        @exceededMaxSize="exceededMaxSizeFiles"
        @invalidFileTypes="invalidFileTypesFiles"
        v-model:images="images"
        :accept-mime="acceptMime"
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

        <template v-slot:empty>
          <div style="text-align: center; width: 100%;">
            <img src="https://sui-assets.siteminder.com/sm/illu-md/illu-md-media.svg" alt="No images available"/>
            <h2 style="margin-bottom:16px;">Your property is beautiful, it needs beautiful images</h2>
            <p style="margin-bottom: 24px;">Upload an image and assign it to your extras</p>
            <sm-button @click="openSysUpload()" type="primary">
              Upload images
            </sm-button>
            <p class="sm-text--small" style="margin-top:16px; color: #717171;">Image width recommended between 2400px wide and 1500px high</p>
          </div>
        </template>
      </sm-media>
    </div>
  `,
})

DefaultEmpty.storyName = 'Default - Empty'

const defaultEmptyDescription = `
  An array of allowed mime types to upload files using <code>acceptMime</code> attribute. For example, the MIME type is text and the subtype is csv. Together, the complete MIME type is text/csv.

  <pre>
    const acceptMime = ref(['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'text/csv'])
    const images = ref([])
    const uploadedFiles = (files: FileList[]) => {
      for (let i = 0; i < files.length; i += 1) {
        Do stuff with individual file and add back to 'images' to update sm-media-items
      }
    }
    const exceededMaxSizeFiles = (fileNames: FileList[]) => {
      Emits the file after being dropped or added by system upload
      for (let i = 0; i < fileNames.length; i += 1) {
        Do stuff with individual exceed max size file name
      }
    }
    const invalidFileTypesFiles = (fileNames: FileList[]) => {
      Emits the file after being dropped or added by system upload
      for (let i = 0; i < fileNames.length; i += 1) {
        Do stuff with individual invalid file type name
      }
    }
  </pre>
  Note: Refer to https://developer.mozilla.org/en-US/docs/Web/API/FileList for the FileList native type

  <pre>
    const openSysUpload = () => {
      // Add a click event
      (document.querySelector('.sm-media__input-hidden input') as HTMLInputElement).click()
    }
  </pre>

  Best Practices, Whenever there are multiple slots, use the full <code>template</code> based syntax for all slots including <code>default</code>
`
DefaultEmpty.parameters = {
  docs: {
    description: {
      story: defaultEmptyDescription,
    },
  },
}

export const EmptyWithPopulated = () => ({
  components: {
    SmMedia,
    SmMediaItem,
  },
  setup: () => {
    const images = ref<Image[]>([])
    const acceptMime = ref(['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'text/csv'])

    const openSysUpload = () => {
      const inputElement: HTMLInputElement | null = document.querySelector('.sm-media__input-hidden input') ?? null
      inputElement?.click()
    }
    const uploadedFiles = (files: FileList[]) => {
      files.forEach(() => {
        images.value.push({
          src: `https://picsum.photos/1150/940?random=${images.value.length + 1}`,
        })
      })
      console.info('Uploaded - files', files)
    }

    const exceededMaxSizeFiles = (fileNames: FileList[]) => {
      console.info('exceededMaxSize - file names', fileNames)
    }
    const invalidFileTypesFiles = (fileNames: FileList[]) => {
      console.info('invalidFileTypes - file names', fileNames)
    }
    return {
      uploadedFiles,
      images,
      acceptMime,
      openSysUpload,
      exceededMaxSizeFiles,
      invalidFileTypesFiles,
    }
  },
  template: `
    <div>
      <sm-media
        @exceededMaxSize="exceededMaxSizeFiles"
        @invalidFileTypes="invalidFileTypesFiles"
        @filesAdded="uploadedFiles"
        v-model:images="images"
        :accept-mime="acceptMime"
        :empty-state="true"
      >

        <template #media="{image}">
          <sm-media-item
            :key="image.src"
            :src="image.src"
          >
            <sm-button shape="square" aria-label="Edit media item">
              <sm-icon name="action-edit" aria-hidden="true" />
            </sm-button>
          </sm-media-item>
        </template>

        <template v-slot:empty>
          <div style="text-align: center; width: 100%;">
            <img src="https://sui-assets.siteminder.com/sm/illu-md/illu-md-media.svg" alt="No images available"/>
            <h2 style="margin-bottom:16px;">Your property is beautiful, it needs beautiful images</h2>
            <p style="margin-bottom: 24px;">Upload an image and assign it to your extras</p>
            <sm-button @click="openSysUpload()" type="primary">
              Upload images
            </sm-button>
            <p class="sm-text--small" style="margin-top:16px; color: #717171;">Image width recommended between 2400px wide and 1500px high</p>
          </div>
        </template>
      </sm-media>
    </div>
  `,
})

EmptyWithPopulated.storyName = 'Empty with Populated'

export const SingleFileUpload = () => ({
  components: {
    SmMedia,
    SmMediaItem,
  },
  setup: () => {
    const images = ref<Image[]>([])
    let count = 0
    const acceptMime = ref(['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'text/csv'])

    const openSysUpload = () => {
      const inputElement: HTMLInputElement | null = document.querySelector('.sm-media__input-hidden input') ?? null
      inputElement?.click()
    }
    const uploadedFiles = (files: FileList[]) => {
      // Update the random image
      count += 1
      images.value = [{ src: `https://picsum.photos/1150/940?random=${count}` }]
      console.info('Uploaded - files', files)
    }

    const exceededMaxSizeFiles = (fileNames: FileList[]) => {
      console.info('exceededMaxSize - file names', fileNames)
    }
    const invalidFileTypesFiles = (fileNames: FileList[]) => {
      console.info('invalidFileTypes - file names', fileNames)
    }
    return {
      uploadedFiles,
      images,
      acceptMime,
      openSysUpload,
      exceededMaxSizeFiles,
      invalidFileTypesFiles,
    }
  },
  template: `
    <div>
      <sm-media
        @filesAdded="uploadedFiles"
        @exceededMaxSize="exceededMaxSizeFiles"
        @invalidFileTypes="invalidFileTypesFiles"
        v-model:images="images"
        :accept-mime="acceptMime"
        :empty-state="true"
        :multiple="false"
      >

        <template #media="{image}">
          <sm-media-item
            :key="image.src"
            :src="image.src"
          >
            <sm-button shape="square" aria-label="Edit media item">
              <sm-icon name="action-edit" aria-hidden="true" />
            </sm-button>
          </sm-media-item>
        </template>

        <template v-slot:empty>
          <div style="text-align: center; width: 100%;">
            <img src="https://sui-assets.siteminder.com/sm/illu-md/illu-md-media.svg" alt="No images available"/>
            <h2 style="margin-bottom:16px;">Your property is beautiful, it needs beautiful images</h2>
            <p style="margin-bottom: 24px;">Upload an image and assign it to your extras</p>
            <sm-button @click="openSysUpload()" type="primary">
              Upload images
            </sm-button>
            <p class="sm-text--small" style="margin-top:16px; color: #717171;">Image width recommended between 2400px wide and 1500px high</p>
          </div>
        </template>
      </sm-media>
    </div>
  `,
})

SingleFileUpload.storyName = 'Single file upload'

export const DragDropGrouping = () => ({
  components: {
    SmMedia,
    SmMediaItem,
    SmButton,
  },
  setup: () => {
    const acceptMime = ref(['image/png', 'image/jpg', 'image/jpeg', 'image/gif'])

    const uploadedFiles = (files: FileList[]) => {
      console.info('Uploaded - files', files)
    }
    const isMove = ref(false)

    const IMAGES = [
      // Group 1
      { src: image1020, id: 1020 },
      { src: image1021, id: 1021 },
      { src: image1022, id: 1022 },
      { src: image1023, id: 1023 },
      { src: image1024, id: 1024 },
      { src: image1025, id: 1025 },
      { src: image1026, id: 1026 },
      { src: image1027, id: 1027 },
      { src: image1028, id: 1028 },
      { src: image1029, id: 1029 },
      // Group 2
      { src: image1050, id: 1050 },
      { src: image1051, id: 1051 },
      { src: image1052, id: 1052 },
      { src: image1053, id: 1053 },
      { src: image1054, id: 1054 },
      { src: image1055, id: 1055 },
      { src: image1056, id: 1056 },
      { src: image1057, id: 1057 },
      { src: image1058, id: 1058 },
      { src: image1059, id: 1059 },
      // Group 3
      { src: image1060, id: 1060 },
      { src: image1061, id: 1061 },
      { src: image1062, id: 1062 },
      { src: image1063, id: 1063 },
      { src: image1064, id: 1064 },
      { src: image1065, id: 1065 },
      { src: image1066, id: 1066 },
      { src: image1067, id: 1067 },
      { src: image1068, id: 1068 },
      { src: image1069, id: 1069 },
    ]

    // Reduce the number of images being requested during Percy visual testing to avoid flakiness
    // Also, images are only loaded when they are externally hosted during Percy snapshotting
    const isPercy = isPercyContext()
    const getPercyImages = (offset: number) => {
      return [
        { src: 'https://picsum.photos/id/1020/1150/940', id: 1020 + offset },
        { src: 'https://picsum.photos/id/1021/1150/940', id: 1021 + offset },
        { src: 'https://picsum.photos/id/1022/1150/940', id: 1022 + offset },
      ]
    }

    const imageGroup1 = ref<Image[]>(isPercy ? getPercyImages(10) : IMAGES.slice(0, 10))
    const imageGroup2 = ref<Image[]>(isPercy ? getPercyImages(20) : IMAGES.slice(10, 20))
    const imageGroup3 = ref<Image[]>(isPercy ? getPercyImages(30) : IMAGES.slice(20, 30))

    const checkMove = () => {
      isMove.value = false
    }

    return {
      uploadedFiles,
      acceptMime,
      imageGroup1,
      imageGroup2,
      imageGroup3,
      checkMove,
      isMove,
    }
  },
  template: `
    <div>
      <div>
        <h3>Media Group 1: Drag & Drop</h3>
        <sm-media
          @filesAdded="uploadedFiles"
          :accept-mime="acceptMime"
          v-model:images="imageGroup1"
          group="image"
        >
          <template #media="{image}">
            <sm-media-item
              :key="image.id"
              :src="image.src"
            >
              <sm-button shape="square" aria-label="Edit media item">
                <sm-icon name="action-edit" aria-hidden="true" />
              </sm-button>
            </sm-media-item>
          </template>
        </sm-media>
      </div>

      <div style="margin-top:50px">
        <h3>Media Group 2: Drag & Drop</h3>
        <sm-media
          @filesAdded="uploadedFiles"
          :accept-mime="acceptMime"
          v-model:images="imageGroup2"
          group="image"
        >
          <template #media="{image}">
            <sm-media-item
              :key="image.id"
              :src="image.src"
            >
              <sm-button shape="square" aria-label="Edit media item">
                <sm-icon name="action-edit" aria-hidden="true" />
              </sm-button>
            </sm-media-item>
          </template>
        </sm-media>
      </div>

      <div style="margin-top:50px">
        <h3>Media Group 3: Dragging out not allowed & Drop in allowed</h3>
        <sm-media
          @filesAdded="uploadedFiles"
          :accept-mime="acceptMime"
          v-model:images="imageGroup3"
          group="image"
          :checkMove="isMove" @move="() =>checkMove()"
        >
          <template #media="{image}">
            <sm-media-item
              :key="image.id"
              :src="image.src"
            >
              <sm-button shape="square" aria-label="Edit media item">
                <sm-icon name="action-edit" aria-hidden="true" />
              </sm-button>
            </sm-media-item>
          </template>
        </sm-media>
      </div>
    </div>
  `,
})

DragDropGrouping.storyName = 'Drag & Drop - Grouping'

const dragDropGroupingDescription = `
  Use the <code>group</code> prop to integrate multiple draggable lists together.

  It's also essential to use the <code>key</code> prop on each of the <code>sm-media-item</code> components to allow Vue to track changes correctly.

  <pre>
    Events:
    const start = (event) => {
      // Emits event when dragging started
    }
    const end = (event) => {
      // Emits event when dragging ended
    }
    const change = (states) => {
      // This event emits one argument containing one of the properties:
      // - added: contains information of an element added to the array (newIndex, element)
      // - removed: contains information of an element removed from to the array (oldIndex, element)
      // - moved: contains information of an element moved within the array (newIndex, oldIndex, element)
    }
    const move = (evt) => {
      // Emits events when you move an item in the list or between lists
      // Returning false will cancel the drag operation.
      // - draggedContext: context linked to dragged element
      //   index: dragged element index
      //   element: dragged element underlying view model element
      //   futureIndex: potential index of the dragged element if the drop operation is accepted
      // - relatedContext: context linked to current drag operation
      //   index: target element index
      //   element: target element view model element
      //   list: target list
      //   component: target VueComponent
    }
    const add = (evt) => {
      // Emits event when element is dropped into the list from another list
    }
    const remove = (evt) => {
      // Emits event when element is removed from the list into another list
    }
  </pre>

  Control the dragging of the item using the <code>checkMove</code> prop combined with the <code>move</code> event.

  <pre>
    const isMove = ref(false)
    const checkMove = (evt) => {
      // Callback function on move event when you move an item in the list or between list
      // Sync checkMove props to true and false on condition, Returning false will cancel the drag operation
      // Example one: Stop dragging out the image from "Media box 3" standalone group
      isMove.value = false
      // Example two: Stop dragging the item inside the standalone group if the children array does not exist
      if (evt.relatedContext.element && !evt.relatedContext.element.children) {
        // Do stuff
        return false
      } else if (evt.relatedContext.list === undefined || evt.relatedContext.list === null) {
        // Do stuff
        return false
      } else {
        // Do stuff
        return true
      }
    }
  </pre>
`
DragDropGrouping.parameters = {
  percy: {
    // Lazy load images
    enableJavaScript: true,
  },
  docs: {
    description: {
      story: dragDropGroupingDescription,
    },
  },
}

export const DragDropConditionally = () => ({
  components: {
    SmMedia,
    SmMediaItem,
    SmButton,
  },
  setup: () => {
    const acceptMime = ref(['image/png', 'image/jpg', 'image/jpeg', 'image/gif'])

    const uploadedFiles = (files: FileList[]) => {
      console.info('Uploaded - files', files)
    }
    const images = ref<Image[]>([])
    const images1 = ref<Image[]>([])
    const images2 = ref<Image[]>([])

    const linkMaker = () => {
      for (let i = 0; i < 10; i += 1) {
        images.value.push({
          src: `https://picsum.photos/id/${1020 + i}/1150/940`,
          order: i,
          id: 1020 + i, // Sample unique id
          name: 'linkMaker',
        })
      }
    }

    const linkMaker1 = () => {
      for (let i = 0; i < 10; i += 1) {
        images1.value.push({
          src: `https://picsum.photos/id/${1050 + i}/1150/940`,
          order: i,
          id: 1050 + i, // Sample unique id
          name: 'linkMaker1',
        })
      }
    }

    const linkMaker2 = () => {
      for (let i = 0; i < 10; i += 1) {
        images2.value.push({
          src: `https://picsum.photos/id/${1060 + i}/1150/940`,
          order: i,
          id: 1060 + i, // Sample unique id
          name: 'linkMaker2',
        })
      }
    }

    onMounted(() => {
      linkMaker()
      linkMaker1()
      linkMaker2()
    })

    return {
      uploadedFiles,
      images,
      acceptMime,
      images1,
      images2,
    }
  },
  template: `
    <div>
      <div>
        <h3>Media Group 1: Drag & Drop</h3>
        <sm-media
          @filesAdded="uploadedFiles"
          :accept-mime="acceptMime"
          v-model:images="images"
          group="image"
        >
          <template #media="{image}">
            <sm-media-item
              :key="image.id"
              :src="image.src"
            >
              <sm-button shape="square" aria-label="Edit media item">
                <sm-icon name="action-edit" aria-hidden="true" />
              </sm-button>
            </sm-media-item>
          </template>
        </sm-media>
      </div>

      <div style="margin-top:50px">
        <h3>Media Group 2: Dragging out not allowed & Drop in allowed</h3>
        <sm-media
          @filesAdded="uploadedFiles"
          :accept-mime="acceptMime"
          v-model:images="images1"
          group="image"
          :isDroppable="false"
          dropClass="media-group-two"
        >
          <template #media="{image}">
            <sm-media-item
              customClass="media-group-two"
              :key="image.id"
              :src="image.src"
            >
              <sm-button shape="square" aria-label="Edit media item">
                <sm-icon name="action-edit" aria-hidden="true" />
              </sm-button>
            </sm-media-item>
          </template>
        </sm-media>
      </div>

      <div style="margin-top:50px">
        <h3>Media Group 3: Dragging out not allowed & Drop in allowed</h3>
        <sm-media
          @filesAdded="uploadedFiles"
          :accept-mime="acceptMime"
          v-model:images="images2"
          group="image"
          :isDroppable="false"
          dropClass="media-group-three"
        >
          <template #media="{image}">
            <sm-media-item
              customClass="media-group-three"
              :key="image.id"
              :src="image.src"
            >
              <sm-button shape="square" aria-label="Edit media item">
                <sm-icon name="action-edit" aria-hidden="true" />
              </sm-button>
            </sm-media-item>
          </template>
        </sm-media>
      </div>
    </div>
  `,
})

DragDropConditionally.storyName = 'Drag & Drop - Conditionally'

const dragDropConditionallyDescription = `
  In this example, the user will be able to drop an item from media group 1 to media group 2 and media group 3.

  However, media group 2 and media group 3 do not allow any dropping outside the group.

  All three media groups allow drag and drop internally.

  Use the <code>isDroppable</code> and <code>dropClass</code> props is to allow or not the dropping between the media groups.

  The <code>dropClass</code> props value in the <code>sm-media</code> component should be in sync with <code>customClass</code> value in <code>sm-media-item</code> component to identify the media items by class name that required conditional dropping.
`
DragDropConditionally.parameters = {
  docs: {
    description: {
      story: dragDropConditionallyDescription,
    },
  },
}

export const DragDropEmptyContainer = () => ({
  components: {
    SmMedia,
    SmMediaItem,
    SmButton,
  },
  setup: () => {
    const acceptMime = ref(['image/png', 'image/jpg', 'image/jpeg', 'image/gif'])

    const uploadedFiles = (files: FileList[]) => {
      console.info('Uploaded - files', files)
    }
    const images = ref<Image[]>([])

    const linkMaker = () => {
      // Reduce netweork requests during Percy visual testing to avoid flakiness
      // Also, images are only loaded when they are externally hosted during Percy snapshotting
      const imageCount = 3

      for (let i = 0; i < imageCount; i += 1) {
        images.value.push({
          src: `https://picsum.photos/id/${1020 + i}/1150/940`,
          order: i,
          id: 1020 + i, // Sample unique id
          name: 'linkMaker',
        })
      }
    }

    const images3 = ref<Image[]>([])
    const acceptMime3 = ref(['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'text/csv'])

    const openSysUpload = () => {
      const inputElement: HTMLInputElement | null = document.querySelector('.sm-media__input-hidden input') ?? null
      inputElement?.click()
    }
    const uploadedFiles3 = (files: FileList[]) => {
      for (let i = 0; i < files.length; i += 1) {
        images3.value.push({
          src: `https://picsum.photos/id/${1060 + i}/1150/940`,
          order: i,
          id: 1070 + i, // Sample unique id
          name: 'linkMaker3',
        })
      }
      console.info('Uploaded - files', files)
    }

    onMounted(() => {
      linkMaker()
    })

    return {
      uploadedFiles,
      images,
      acceptMime,
      uploadedFiles3,
      images3,
      openSysUpload,
      acceptMime3,
    }
  },
  template: `
    <div>
      <div>
        <h3>Media Group 1: Drag & Drop</h3>
        <sm-media
          @filesAdded="uploadedFiles"
          :accept-mime="acceptMime"
          v-model:images="images"
          group="image"
          class="mb-24"
        >
          <template #media="{image}">
            <sm-media-item
              :key="image.id"
              :src="image.src"
            >
              <sm-button shape="square" aria-label="Edit media item">
                <sm-icon name="action-edit" aria-hidden="true" />
              </sm-button>
            </sm-media-item>
          </template>
        </sm-media>
      </div>

      <sm-media
        @filesAdded="uploadedFiles3"
        v-model:images="images3"
        :accept-mime="acceptMime3"
        group="image"
        :emptyStateDrop="true"
        :is-invalid="images3.length === 0"
      >
        <template #media="{image}">
          <sm-media-item
            :key="image.src"
            :src="image.src"
          >
            <sm-button shape="square" aria-label="Edit media item">
              <sm-icon name="action-edit" aria-hidden="true" />
            </sm-button>
          </sm-media-item>
        </template>

        <template v-slot:empty>
          <div style="text-align: center; width: 100%;">
            <img src="https://sui-assets.siteminder.com/sm/illu-md/illu-md-media.svg" alt="No images available"/>
            <h2 style="margin-bottom:16px;">Your property is beautiful, it needs beautiful images</h2>
            <p style="margin-bottom: 24px;">Upload an image and assign it to your extras</p>
            <sm-button @click="openSysUpload()" type="primary">
              Upload images
            </sm-button>
            <p class="sm-text--small" style="margin-top:16px; color: #717171;">Image width recommended between 2400px wide and 1500px high</p>
          </div>
        </template>
      </sm-media>
    </div>
  `,
})

DragDropEmptyContainer.storyName = 'Drag & Drop - Empty Container'

DragDropEmptyContainer.parameters = {
  docs: {
    description: {
      story: 'Use <code>emptyStateDrop</code> props to allow dropping in the empty state group when allowing dragging between the multiple groups.',
    },
  },
}

export const FooterAndLeftAction = () => ({
  components: {
    SmMedia,
    SmMediaItem,
    SmButton,
  },
  setup: () => {
    // Images are only loaded when they are externally hosted during Percy snapshotting
    const IMAGES = [
      { src: 'https://picsum.photos/id/1020/1150/940', id: 1020 },
      { src: 'https://picsum.photos/id/1021/1150/940', id: 1021 },
      { src: 'https://picsum.photos/id/1022/1150/940', id: 1022 },
      { src: 'https://picsum.photos/id/1023/1150/940', id: 1023 },
      { src: 'https://picsum.photos/id/1024/1150/940', id: 1024 },
    ]

    const acceptMime = ref(['image/png', 'image/jpg', 'image/jpeg', 'image/gif'])
    const images = ref<Image[]>([])
    const selectedImages = ref<string[]>([])
    const isMainPhotoLoading = ref(false)

    const uploadedFiles = (files: FileList[]) => {
      console.info('Uploaded - files', files)

      // Fake image generation for demo purposes
      const newImages = Array.from(files).map((_, index) => {
        return {
          src: `https://picsum.photos/1150/940?random=${images.value.length + index + 1}`,
          order: images.value.length + index + 1,
        }
      })

      images.value = [...newImages, ...images.value]
    }

    const linkMaker = () => {
      for (let i = 0; i < 5; i += 1) {
        images.value.push({
          src: IMAGES[i].src,
          isMainPhoto: i === 1,
          isExternal: i === 2,
          hasWarning: i === 3,
          hasAlert: i === 4,
          order: i,
        })
      }
    }

    const selectedItemHandler = (id: string, selected: boolean): void => {
      if (selected && !selectedImages.value.includes(id)) {
        // single selection
        // selectedImages.value = [id]

        // multi select
        selectedImages.value.push(id)

        return
      }

      if (!selected && selectedImages.value.includes(id)) {
        selectedImages.value = selectedImages.value.filter(item => item !== id)
      }
    }

    const openSysUpload = () => {
      const inputElement: HTMLInputElement | null = document.querySelector('.sm-media__input-hidden input') ?? null
      inputElement?.click()
    }

    const toggleMainPhoto = (src: string): void => {
      // We need to force refresh the hovered button tooltip
      // so that it can auto-reposition itself when the text changes
      isMainPhotoLoading.value = true
      setTimeout(() => {
        isMainPhotoLoading.value = false
      }, 0)

      images.value = images.value.map(image => ({
        ...image,
        isMainPhoto: image.src === src ? !image.isMainPhoto : false,
      }))
    }

    const removeItem = (src: string): void => {
      images.value = images.value.filter(image => image.src !== src)
    }

    onMounted(() => {
      linkMaker()
    })

    return {
      acceptMime,
      isMainPhotoLoading,
      images,
      selectedImages,
      openSysUpload,
      removeItem,
      selectedItemHandler,
      toggleMainPhoto,
      uploadedFiles,
    }
  },
  template: `
    <sm-media
      v-model:images="images"
      :is-invalid="images.length === 0"
      :accept-mime="acceptMime"
      @filesAdded="uploadedFiles"
    >
      <template #media="{image}">
        <sm-media-item
          :key="image.src"
          :src="image.src"
          :is-selectable="false"
          :selected="selectedImages.includes(image.src)"
          :always-show-left-action="image.isMainPhoto"
          @selected="selectedItemHandler(image.src, true)"
          @un-selected="selectedItemHandler(image.src, false)"
        >
          <template v-if="!image.hasWarning" #left-action>
            <sm-tooltip
              trigger="hover"
              placement="top"
              :close-on-click-outside="false"
              :disabled="isMainPhotoLoading"
              :title="image.isMainPhoto ? 'Main photo' : 'Set main photo'"
            >
              <sm-button
                shape="square"
                aria-label="Set as main photo"
                :disabled="isMainPhotoLoading"
                @click="toggleMainPhoto(image.src)"
              >
                <sm-icon
                  :style="{ color: image.isMainPhoto ? '#FCCC0B' : null }"
                  :name="image.isMainPhoto ? 'rating-filled' : 'rating-default'"
                />
              </sm-button>
            </sm-tooltip>
          </template>

          <template #default>
            <sm-button shape="square" aria-label="Remove media item" @click="removeItem(image.src)">
              <sm-icon name="action-cross" aria-hidden="true" />
            </sm-button>
          </template>

          <template #footer>
            <sm-tag
              class="py-0"
              v-if="image.isExternal"
              size="small"
              type="info"
            >
              <span class="leading-[20px] line-clamp-1 break-all">External</span>
            </sm-tag>

            <sm-tooltip
              v-if="image.hasWarning"
              placement="bottom"
              trigger="hover"
            >
              <template #default>
                <sm-tag
                  class="py-0"
                  size="small"
                  type="warning"
                >
                  <span class="leading-[20px] line-clamp-1 break-all">
                    <sm-icon class="inline-flex" name="utility-alert" />Upload error
                  </span>
                </sm-tag>
              </template>

              <template #content>
                <div style="max-width: 200px">
                  This image couldn't be uploaded because it doesn't meet the channel's minimum size or supported file format requirements. Delete it from your media library, then upload a higher-resolution image in a supported format and click 'Save' to retry.
                </div>
              </template>
            </sm-tooltip>

            <sm-tooltip
              v-if="image.hasAlert"
              placement="bottom"
              trigger="hover"
            >
              <template #default>
                <sm-tag
                  class="py-0"
                  size="small"
                  type="alert"
                >
                  <span class="leading-[20px] line-clamp-1 break-all">
                    Extremely long text here. Extremely long text here. Extremely long text here. Extremely long text here.
                  </span>
                </sm-tag>
              </template>

              <template #content>
                <div style="max-width: 200px">
                  Some tooltip content.
                </div>
              </template>
            </sm-tooltip>
          </template>
        </sm-media-item>
      </template>

      <template #empty>
        <div style="text-align: center; width: 100%;">
          <img width="200" height="200" src="https://sui-assets.siteminder.com/sm/illu-md/illu-md-media.svg" alt="No images available" />
          <h2 style="margin-bottom:16px;">Your property is beautiful, it needs beautiful images</h2>
          <p style="margin-bottom: 24px;">Upload an image and assign it to your extras</p>
          <sm-button type="primary" @click="openSysUpload">
            Upload images
          </sm-button>
          <p class="sm-text--small" style="margin-top:16px; color: #717171;">Image width recommended between 2400px wide and 1500px high</p>
        </div>
      </template>
    </sm-media>
  `,
})

FooterAndLeftAction.storyName = 'Footer and left action'

const footerAndLeftActionDescription = `
  To display a custom control on the left side of a media item,
  use the <code>left-action</code> slot within the <code>sm-media-item</code>.
  You can make this control always visible by setting the item's
  <code>always-show-left-action</code> property to true;
  otherwise, it will appear only on hover.

  Use the <code>footer</code> slot within the <code>sm-media-item</code> to
  show additional information about the media item, such as status tags with tooltips.
  Any custom styling must be handled by the consuming frontend.
`
FooterAndLeftAction.parameters = {
  docs: {
    description: {
      story: footerAndLeftActionDescription,
    },
  },
}

export const StylingHooks = () => ({
  setup: () => {
    const defaultImage = defaultExample
    const themedImage = themedExample

    return {
      defaultImage,
      themedImage,
    }
  },
  template: `
    <div>
      <h3>Styling hooks</h3>
      <p>Styling hooks will enable customization for your components. Styling hooks are constructed using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">CSS custom properties</a>.</p>

      <p>Below is an example of the SUI media and the brand media using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 698px; height: auto; min-width: 0"
          alt="Media default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 698px; height: auto; min-width: 0"
          alt="Media themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the media customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

      <sm-table>
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Element </sm-table-th>
            <sm-table-th> Category + Property </sm-table-th>
            <sm-table-th class="w-1/2 small-desktop:w-3/5"> Styling Hooks</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>

        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-th colspan="3">Container</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Drop zone</sm-table-td>
            <sm-table-td>
              border <br/>
              border-radius <br/>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-media-drop-zone-border
                --sm-c-media-drop-zone-border-radius
                --sm-c-media-drop-zone-color-background

                --sm-c-media-drop-zone-border-file-hovering
                --sm-c-media-drop-zone-color-background-file-hovering
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Items</sm-table-td>
            <sm-table-td>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-media-items-padding
              </code>
            </sm-table-td>
          </sm-table-tr>


          <sm-table-tr>
            <sm-table-th colspan="3">Media item</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              border-radius <br/>
              box-shadow
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-media-item-border-radius
                --sm-c-media-item-box-shadow-focus
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Item card</sm-table-td>
            <sm-table-td>
              border <br/>
              border-radius <br/>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-media-item-card-border
                --sm-c-media-item-card-border-radius

                --sm-c-media-item-card-color-border-hover

                --sm-c-media-item-card-color-border-focus

                --sm-c-media-item-card-color-background-selected
                --sm-c-media-item-card-color-border-selected
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Drag mask</sm-table-td>
            <sm-table-td>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-media-item-drag-mask-color-background
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Selected wrap</sm-table-td>
            <sm-table-td>
              border <br/>
              border-radius <br/>
              bottom <br/>
              right
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-media-item-selected-wrap-border
                --sm-c-media-item-selected-wrap-border-radius
                --sm-c-media-item-selected-wrap-bottom
                --sm-c-media-item-selected-wrap-right
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Selected icon</sm-table-td>
            <sm-table-td>
              border-radius <br/>
              color-background <br/>
              color-icon <br/>
              height <br/>
              min-width <br/>
              margin <br/>
              icon-size
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-media-item-selected-icon-border-radius
                --sm-c-media-item-selected-icon-color-background
                --sm-c-media-item-selected-icon-color-icon
                --sm-c-media-item-selected-icon-height
                --sm-c-media-item-selected-icon-min-width
                --sm-c-media-item-selected-icon-margin
                --sm-c-media-item-selected-icon-size
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
