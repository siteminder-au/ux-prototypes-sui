<script lang="ts" setup>
import { ref } from 'vue'
import { Sm404Page } from '@siteminder/sui-core/components/sm-404-page'
import { SmButton, SmButtonShape, SmButtonType } from '@siteminder/sui-core/components/sm-button'
import { SmMedia, SmMediaItem } from '@siteminder/sui-core/components/sm-media'
import { SmTag, SmTagSize, SmTagType } from '@siteminder/sui-core/components/sm-tag'
import { SmTooltip, SmTooltipPlacement, SmTooltipTrigger } from '@siteminder/sui-core/components/sm-tooltip'
import { useTranslate } from '@/composables/use-translate'

interface Image {
  src: string
  id: string
  hasWarning?: boolean
  hasAlert?: boolean
  isExternal?: boolean
  isMainPhoto?: boolean
  // Exploration: In case we need to switch direction based on BDC requirements
  // TBD: Identify which elements should be set to a disabled state, visible, etc.
  isMainPhotoLoading?: boolean
}

const emit = defineEmits<{
  (e: 'files-added', files: File[]): void
  (e: 'selected' | 'un-selected', imageId: string): void
  (e: 'remove-image' | 'set-main-photo', image: Image): void
}>()

const { t } = useTranslate('components.direct-booking.direct-booking-media')

const acceptMime = ref(['image/png', 'image/jpg', 'image/jpeg', 'image/gif'])
const internalMainPhotoLoading = ref(false)
const mediaRef = ref<HTMLDivElement | null>(null)

let timeoutId: ReturnType<typeof setTimeout> | null = null

const modelValue = defineModel<Image[]>({
  default: undefined,
})

const openSysUpload = (): void => {
  // Taken from storybook example. We should find a more elegant API for this in the future
  // as this looks like a very common thing downstream projects want to do.
  const fileInput: HTMLInputElement | null = mediaRef.value?.querySelector('input[type="file"]') ?? null

  if (fileInput) {
    fileInput.click()
  }
}

const toggleMainPhoto = (image: Image): void => {
  emit('set-main-photo', image)

  internalMainPhotoLoading.value = true

  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  // We need to force refresh the hovered button tooltip
  // so that it can auto-reposition itself when the text changes
  timeoutId = setTimeout(() => {
    internalMainPhotoLoading.value = false
    timeoutId = null
  }, 0)
}
</script>

<template>
  <div ref="mediaRef">
    <sm-media
      v-model:images="modelValue"
      :accept-mime="acceptMime"
      :is-invalid="modelValue.length === 0"
      @files-added="$emit('files-added', $event)"
    >
      <template #media="{ image }">
        <sm-media-item
          :key="image.src"
          :src="image.src"
          :is-selectable="false"
          :always-show-left-action="image.isMainPhoto || image.isMainPhotoLoading"
          @selected="$emit('selected', image.src)"
          @un-selected="$emit('un-selected', image.src)"
        >
          <template
            v-if="!image.hasWarning"
            #left-action
          >
            <sm-tooltip
              :placement="SmTooltipPlacement.TOP"
              :trigger="SmTooltipTrigger.HOVER"
              :close-on-click-outside="false"
              :disabled="internalMainPhotoLoading || image.isMainPhotoLoading"
              :title="image.isMainPhoto ? t('main-photo-tooltip-text') : t('set-main-photo-tooltip-text')"
            >
              <sm-button
                :shape="SmButtonShape.SQUARE"
                :aria-label="t('a11y__toggle-main-photo')"
                :disabled="internalMainPhotoLoading || image.isMainPhotoLoading"
                @click="toggleMainPhoto(image)"
              >
                <sm-icon
                  :class="{ 'cm-alert-mid': image.isMainPhoto }"
                  :name="image.isMainPhoto ? 'rating-filled' : 'rating-default'"
                />
              </sm-button>
            </sm-tooltip>
          </template>

          <template #default>
            <sm-button
              :shape="SmButtonShape.SQUARE"
              :aria-label="t('a11y__remove-media-item')"
              :disabled="image.isMainPhotoLoading"
              @click="$emit('remove-image', image)"
            >
              <sm-icon name="action-cross" />
            </sm-button>
          </template>

          <template #footer>
            <sm-tag
              v-if="image.isExternal"
              class="cm-py-0"
              :size="SmTagSize.SMALL"
              :type="SmTagType.INFO"
            >
              <span class="cm-leading-20 cm-line-clamp-1">
                {{ t('media-external-tag') }}
              </span>
            </sm-tag>

            <sm-tooltip
              v-if="image.hasWarning"
              :placement="SmTooltipPlacement.BOTTOM"
              :trigger="SmTooltipTrigger.HOVER"
            >
              <template #default>
                <sm-tag
                  class="cm-py-0"
                  :size="SmTagSize.SMALL"
                  :type="SmTagType.WARNING"
                >
                  <span class="cm-leading-20 cm-line-clamp-1">
                    <sm-icon
                      name="utility-alert"
                      class="cm-inline-flex"
                    />{{ t('media-upload-error-tag') }}
                  </span>
                </sm-tag>
              </template>

              <template #content>
                <div class="cm-max-w-xs">
                  {{ t('media-upload-error-tooltip-text') }}
                </div>
              </template>
            </sm-tooltip>

            <sm-tooltip
              v-if="image.hasAlert"
              :placement="SmTooltipPlacement.BOTTOM"
              :trigger="SmTooltipTrigger.HOVER"
            >
              <template #default>
                <sm-tag
                  class="cm-py-0"
                  :size="SmTagSize.SMALL"
                  :type="SmTagType.ALERT"
                >
                  <span class="cm-leading-20 cm-line-clamp-1">
                    {{ t('media-upload-error-tooltip-text') }}
                  </span>
                </sm-tag>
              </template>

              <template #content>
                <div class="cm-max-w-xs">
                  {{ t('media-upload-error-tooltip-text') }}
                </div>
              </template>
            </sm-tooltip>
          </template>
        </sm-media-item>
      </template>

      <template #empty>
        <sm-404-page
          :full-page="false"
          :responsive="false"
        >
          <template #image>
            <img
              width="200"
              height="200"
              role="presentation"
              src="https://sui-assets.siteminder.com/sm/illu-md/illu-md-media.svg"
            >
          </template>
          <template #header>
            <h3>{{ t('upload-images-empty-state-header') }}</h3>
          </template>
          <template #description>
            {{ t('upload-images-recommended-size-text') }}
          </template>
          <template #actions>
            <sm-button
              :type="SmButtonType.PRIMARY"
              @click="openSysUpload"
            >
              {{ t('upload-images-button-text') }}
            </sm-button>
          </template>
        </sm-404-page>
        <br>
      </template>
    </sm-media>
  </div>
</template>
