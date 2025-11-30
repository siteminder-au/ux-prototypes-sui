<script setup lang="ts">
import { ref, reactive, onMounted, Ref, VNode } from 'vue'

const props = withDefaults(defineProps<{
  /**
   * Whether the content is expanded (or collapsed)
   */
  expanded?: boolean
  /**
   * Set the min height to content to collapse and expand, accept only units of measurement. For example '100px', '100em', '100rem'. Default is '100px'
   */
  height?: string
  /**
   * Set the max-height of content to show scrollbar on overflow, accept only units of measurement. For example '100px', '100em', '100rem'
   */
  maxHeight?: string
}>(), {
  expanded: false,
  height: '100px',
  maxHeight: '600px',
})

const emit = defineEmits<{
  /**
   * Event emitted when the content is collapsed
   */
  less: []
  /**
   * Event emitted when the content is expanded
   */
  more: []
}>()

/**
 * defineSlots macro used to declare expected slots and their respective expected slot
 */
defineSlots<{
  default?: () => VNode[]
  less?: () => VNode[]
  more?: () => VNode[]
}>()

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
  },
})

const textContainer: Ref<HTMLElement | null> = ref(null)
const rootContainerStyles = reactive({ height: undefined, 'max-height': undefined }) as { height: string | undefined, 'max-height': string | undefined }
const isButtonVisible = ref<boolean>(false)
const showMore = ref(props.expanded)

const toggle = (): void => {
  if (showMore.value) {
    showMore.value = false
    rootContainerStyles.height = props.height
    rootContainerStyles['max-height'] = props.height
    emit('less')
  } else {
    showMore.value = true
    rootContainerStyles.height = undefined
    rootContainerStyles['max-height'] = props.maxHeight
    emit('more')
  }
}

onMounted(() => {
  const currentHeight = textContainer.value?.offsetHeight
  isButtonVisible.value = currentHeight ? currentHeight > parseInt(props.height, 10) : false

  if (showMore.value) {
    rootContainerStyles.height = undefined
    rootContainerStyles['max-height'] = props.maxHeight
  } else {
    rootContainerStyles.height = props.height
    rootContainerStyles['max-height'] = props.height
  }
})

defineExpose({
  toggle,
  rootContainerStyles,
  textContainer,
  isButtonVisible,
  showMore,
})
</script>

<template>
  <div class="sm-html-truncator">
    <div
      ref="textContainer"
      :style="rootContainerStyles"
      class="sm-html-truncator__content"
      :class="{ 'sm-html-truncator__more': showMore }"
    >
      <!-- @slot The paragraph content -->
      <slot />
    </div>
    <span class="sm-html-truncator__button">
      <span
        v-if="showMore"
        class="sm-html-truncator__less-button"
        @click="toggle"
      >
        <!-- @slot The show less button -->
        <slot name="less" />
      </span>
      <span
        v-if="!showMore"
        class="sm-html-truncator__more-button"
        @click="toggle"
      >
        <!-- @slot The show more button -->
        <slot name="more" />
      </span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
@import "../../common/variables";
@import "../../common/mixins";

.sm-html-truncator {
  &__content {
    overflow: hidden;
    height: 100%;
    transition: all 0.3s ease;
  }

  &__more {
    overflow-y: auto;
    transition: all 0.3s ease;
  }

  &__button {
    :deep(.sm-button.sm-button--type-text) {
      .sm-button__content {
        // Override button styles to align with the truncated content
        border: 0;
        background: transparent;
        padding: 11px 0;
      }

      .sm-button__prefix-icon {
        margin-right: $sm-8;
      }

      .sm-button__suffix-icon {
        margin-left: $sm-8;
      }

      .sm-icon {
        font-size: 14px;
      }

      &:focus {
        box-shadow: 0 0 0 2px $grey-neu-black;
      }
    }
  }
}
</style>
