<script setup lang="ts">
import { ref, watch, computed, Ref } from 'vue'
// Workaround for https://github.com/SortableJS/vue.draggable.next/issues/117
import Draggable from 'vuedraggable/src/vuedraggable'
import { useI18n } from '../../libs/vue-i18n'
import { toastService } from '../../services/toast'
import { useUniqueId } from '../use/unique-id'

const props = withDefaults(defineProps<{
  /**
   * An array of unique items for the image sort. Required if the sort order changes. The array will be mutated when the order of the images change.
   */
  images?: unknown[]
  /**
   * An array of allowed mime types For example, the MIME type for image files is image and the subtype is jpg. Together, the complete MIME type is image/jpg.
   */
  acceptMime?: string[]
  /**
   * Whether multiple items are allowed to be uploaded or dragged & dropped
   */
  multiple?: boolean
  /**
   * The toast message when multiple files are uploaded. Only shows when the multiple prop is set to false.
   */
  multipleMessage?: string
  /**
   * The width of the images within the grid
   */
  gridItemWidth?: string
  /**
   * Whether to disable dragging on the media items
   */
  isDraggable?: boolean
  /**
   * The max file size allowed in KB. Defaults to 20480KB (20MB)
   */
  maxFileSize?: number
  /**
   * The message to show when maxFileSize is defined
   */
  maxFileSizeMessage?: string
  /**
   * The message to show when an invalid file is uploaded
   */
  invalidFileMessage?: string
  /**
   * Whether exceeded the max size toast should be displayed
   */
  maxSizeFileToastEnabled?: boolean
  /**
   * Whether invalid file type toast should be displayed
   */
  invalidFileTypeToastEnabled?: boolean
  /**
   * Apply background color to the media component
   */
  backgroundColor?: string
  /**
   * Whether to display an empty state with image population
   */
  emptyState?: boolean
  /**
   * Whether to disable dropping off the file to upload
   */
  isDropZone?: boolean
  /**
   * An identifier used to allow two or more draggable media group to work together
   */
  group?: string | Record<string, unknown>
  /**
   * Control the dragging of the item. Returning false will cancel the drag operation. For example: cancel the drag operation on move event
   */
  checkMove?: boolean
  /**
   * Whether to allow dropping between the multiple media groups
   */
  isDroppable?: boolean
  /**
   * To identify media items by class name for conditional dropping between the multiple media groups. Should be used with the props: isDroppable
   */
  dropClass?: string
  /**
   * Whether to allow dropping to the empty state group when allowing dragging between the multiple groups
   */
  emptyStateDrop?: boolean
  /**
   * Indicates whether the media component is invalid.
   * If true, appropriate invalid styling will be applied.
   */
  isInvalid?: boolean
}>(), {
  images: () => [],
  acceptMime: () => ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
  multiple: true,
  multipleMessage: '',
  gridItemWidth: '210px',
  isDraggable: true,
  maxFileSize: 20480,
  maxFileSizeMessage: '',
  invalidFileMessage: '',
  maxSizeFileToastEnabled: true,
  invalidFileTypeToastEnabled: true,
  backgroundColor: '',
  emptyState: false,
  isDropZone: true,
  group: '',
  checkMove: true,
  isDroppable: true,
  dropClass: '',
  emptyStateDrop: false,
  isInvalid: false,
})

const emit = defineEmits<{
  /**
   * Emitted when the checkMove prop is changed
   */
  update: [checkMove: boolean]
  /**
   * Emitted when the max file size is exceeded
   */
  exceededMaxSize: [maxSizeArray: string[]]
  /**
   * Emitted when an invalid file type is uploaded
   */
  invalidFileTypes: [invalidFileTypeArray: string[]]
  /**
   * Emitted when you move an image in the media groups
   */
  move: [event: { related: HTMLElement | null }]
  /**
   * Emitted when dragging element changes position
   */
  change: [event: Event]
  /**
   * Emitted when element dragging started
   */
  start: [event: Event]
  /**
   * Emitted when element dragging ended
   */
  end: [event: Event]
  /**
   * Emitted when element is dropped into the group from another group
   */
  add: [event: Event]
  /**
   * Emitted when element is removed from the group into another group
   */
  remove: [event: Event]
  /**
   * Emitted when the images prop is changed
   */
  'update:images': [images: unknown[]]
  /**
   * Emitted when files are uploaded
   */
  filesAdded: [files: File[]]
}>()

// see: https://github.com/SortableJS/vue.draggable.next/issues/122#issuecomment-1209914102
Draggable.compatConfig = { MODE: 3 }

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
    // we suppress ATTR_FALSE_VALUE as we want to keep
    // `aria-disabled/aria-expanded` attribute attached even if the value of it is false
    // in vue2, aria-disabled/aria-expanded was removed if the value was false.
    ATTR_FALSE_VALUE: 'suppress-warning',
  },
})

const { i18n } = useI18n()

const mediaInputRef: Ref<HTMLInputElement | null> = ref(null)

const isFileHovering = ref(false)

const uploadedFiles: Ref<File[]> = ref([])

const dragging = ref<boolean>(false)

const isDropping = ref<boolean>(props.emptyStateDrop)

const { id: defaultInputId } = useUniqueId('sm-media__input_')
const inputId = computed(() => defaultInputId.value)

const isMove = computed({
  get: () => props.checkMove,
  set: state => emit('update', state),
})

/**
 * Creates the accepted values for the system upload input
 */
const acceptedTypes = (): string => props.acceptMime.join(',')

/**
 * Validates image types based on File type
 */
const imageValidator = (type: string): boolean => props.acceptMime.includes(type)

/**
 * Handles the file after being dropped or added by system upload
 */
const handleFileUpload = (files: FileList | null): void => {
  const droppedFiles = files
  const invalidFileTypeArray: string[] = []
  const maxSizeArray: string[] = []
  let maxSizeToastService = false
  let invalidImageToastService = false
  if (!droppedFiles) {
    return
  }

  if (!props.multiple && droppedFiles.length > 1) {
    toastService({
      type: 'warning',
      message: props.multipleMessage || (i18n.t('sui-core.components.sm-media.sm-media.multipleMessage') as string),
    })
    return
  }

  Array.from(droppedFiles).forEach((f) => {

    if (imageValidator(f.type)) {

      if (f.size > props.maxFileSize * 1024) {

        // File size exceeded
        maxSizeToastService = true
        maxSizeArray.push(f.name)
      } else {
        uploadedFiles.value = uploadedFiles.value.concat(f)
      }

    } else {
      // File is not an image
      invalidFileTypeArray.push(f.name)
      invalidImageToastService = true
    }
    // reset file input
    if (mediaInputRef.value) {
      mediaInputRef.value.value = ''
    }
  })

  if (maxSizeToastService) {
    emit('exceededMaxSize', maxSizeArray)
    if (props.maxSizeFileToastEnabled) {
      toastService({
        type: 'warning',
        message: props.maxFileSizeMessage || (i18n.t('sui-core.components.sm-media.sm-media.fileSizeExcedded') as string),
      })
    }
  }

  if (invalidImageToastService) {
    emit('invalidFileTypes', invalidFileTypeArray)
    if (props.invalidFileTypeToastEnabled) {
      toastService({
        type: 'warning',
        message: props.invalidFileMessage || (i18n.t('sui-core.components.sm-media.sm-media.invalidTypes') as string),
      })
    }
  }

  isFileHovering.value = false
}

const fileIsHovering = (isHovering: boolean): void => {
  isFileHovering.value = isHovering
}

// Event when you move an image in the media groups
// see: https://github.com/SortableJS/Sortable#move-event-object
const move = (event: { related: HTMLElement | null }): boolean => {
  emit('move', event)
  if (event.related && !props.isDroppable) {
    // code that keeps draggable item pos in scope of existing elements
    return event.related.classList.contains(props.dropClass)
  }
  return isMove.value

}

// Called when dragging element changes position
const change = (event: Event): void => {
  emit('change', event)
}

// Element dragging started
const start = (event: Event): void => {
  dragging.value = true
  emit('start', event)
}

// Element dragging ended
const end = (event: Event): void => {
  dragging.value = false
  emit('end', event)
}

// Element is dropped into the group from another group
const add = (event: Event): void => {
  dragging.value = true
  emit('add', event)
}

// Element is removed from the group into another group
const remove = (event: Event): void => {
  dragging.value = true
  emit('remove', event)
}

const sortedImages = computed({
  get: () => props.images,
  set: (state: unknown[]) => {
    emit('update:images', state)
  },
})

watch(
  uploadedFiles,
  (newVal: File[]) => {
    if (newVal.length > 0) {
      emit('filesAdded', newVal)
      uploadedFiles.value = []
    }
  },
  // we set this to avoid the vue/compat warning for WATCH_ARRAY
  // having deep here shouldn't matter since
  // we're always replacing the uploadedFiles array (.concat() and re-assigning a new array)
  // instead of mutating it
  { deep: true },
)

const handleDropEvent = (dragEvent: DragEvent): void => {
  if (props.isDropZone) {
    handleFileUpload(dragEvent.dataTransfer?.files ?? null)
    fileIsHovering(false)
  }
}

const handleSysUpload = (event: Event): void => {
  handleFileUpload((event.target as HTMLInputElement).files)
}

defineExpose({
  inputId,
  handleFileUpload,
  fileIsHovering,
  mediaInputRef,
  isFileHovering,
  uploadedFiles,
  sortedImages,
  dragging,
  acceptedTypes,
  move,
  change,
  start,
  end,
  remove,
  add,
  isDropping,
})
</script>

<template>
  <div
    class="sm-media"
    @drop.prevent
    @dragover.prevent
  >
    <div
      class="sm-media__drop-zone"
      :class="{
        'sm-media__drop-zone-hovering': isFileHovering,
        'sm-media__drop-zone--invalid': isInvalid,
      }"
      :style="`background :${backgroundColor}`"
      @dragleave="fileIsHovering(false)"
      @dragover="fileIsHovering(true)"
      @drop="handleDropEvent"
    >
      <draggable
        v-if="(sortedImages && sortedImages.length > 0) || isDropping"
        v-model="sortedImages"
        class="sm-media--items"
        :style="`grid-template-columns: repeat(auto-fill, minmax(${gridItemWidth}, ${gridItemWidth}));`"
        item-key="src"
        tag="div"
        :animation="350"
        ghost-class="sm-media-item--ghost"
        :disabled="!isDraggable"
        :group="group"
        :move="move"
        @start="start"
        @end="end"
        @change="change"
        @add="add"
        @remove="remove"
      >
        <!--
          <transition-group
          class="sm-media--items"
          :style="`grid-template-columns: repeat(auto-fill, minmax(${gridItemWidth}, ${gridItemWidth}));`"
          type="transition"
          :name="!dragging ? 'flip-list' : null"
          >
        -->
        <template #item="{element}">
          <div :class="dropClass">
            <!-- @slot A space for sm-media-item components to be placed -->
            <slot
              name="media"
              :image="element"
            />
          </div>
        </template>
        <!-- </template> -->
        <!-- </transition-group> -->
      </draggable>
      <div
        v-else
        class="sm-media__empty"
      >
        <!-- @slot The content for the empty state -->
        <slot name="empty" />
      </div>
      <div
        v-if="sortedImages && sortedImages.length === 0 && isDropping"
        class="sm-media__empty-state"
      >
        <!-- @slot The content for the empty state -->
        <slot name="empty" />
      </div>
      <div
        v-if="emptyState && sortedImages && sortedImages.length > 0"
        class="sm-media__empty"
      >
        <slot name="empty" />
      </div>

      <div class="sm-media__input-hidden">
        <input
          :id="inputId || undefined"
          ref="mediaInputRef"
          type="file"
          :multiple="multiple"
          :accept="acceptedTypes()"
          @change="handleSysUpload"
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../common/variables";

$sm-media--drop-zone--border-color: $blue-neu-mid;
$sm-media--drop-zone--hover-border-color: $primary-blue;
$sm-media--drop-zone--background-color: $true-white;
$sm-media--drop-zone--hover-background-color: $primary-blue;

.sm-media {
  &__drop-zone {
    border-radius: 20px;
    border: 2px dashed $sm-media--drop-zone--border-color;
    background: $sm-media--drop-zone--background-color;

    &-hovering {
      border: 2px dashed $sm-media--drop-zone--hover-border-color;
      background: rgba($sm-media--drop-zone--hover-background-color, 0.08);
    }

    &--invalid {
      border-color: $app-warning;
    }
  }

  &__input-wrapper {
    position: relative;
    cursor: pointer;
  }

  &__input-hidden {
    display: none;
  }

  &__empty, &__empty-state {
    padding: $sm-16;
    max-width: 550px;
    margin: 0 auto;
  }

  &--items {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    display: grid;
    padding: 15px;
  }
}
</style>
