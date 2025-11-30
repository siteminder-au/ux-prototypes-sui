<script setup lang="ts">
import { ref, watch } from 'vue'
import SmLazyImage from '../sm-lazy-image/sm-lazy-image.vue'
import SmCard from '../sm-card/sm-card.vue'
import SmCardActions from '../sm-card/sm-card-actions.vue'
import { SmLazyImageType } from '../sm-lazy-image/sm-lazy-image.types'

const props = withDefaults(defineProps<{
  /**
   * The src url for the image
   */
  src?: string
  /**
   * Whether to add a custom class to the media items. For example: can be used for conditional dropping
   */
  customClass?: string
  /**
   * Whether the media item is selected
   */
  selected?: boolean
  /**
   * Whether the media items are selectable
   */
  isSelectable?: boolean
  /**
   * The width of the images within the grid
   */
  gridItemWidth?: string
  /**
   * The height of the images within the grid
   */
  gridItemHeight?: string
  /**
   * Whether to show the left action slot by default
   */
  alwaysShowLeftAction?: boolean
}>(), {
  src: '',
  customClass: '',
  selected: false,
  isSelectable: true,
  gridItemWidth: '210px',
  gridItemHeight: '140px',
  alwaysShowLeftAction: false,
})

const emit = defineEmits<{
  /**
   * Emitted when the media item is selected
   */
  selected: []
  /**
   * Emitted when the media item is un-selected
   */
  'un-selected': []
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

const hovering = ref(false)

const getSelected = ref<boolean>(props.selected)

watch(() => props.selected, () => {
  getSelected.value = !!props.selected
})

const isOuterElem = (targetClass: string): boolean => {
  return targetClass.includes('sm-media-item__card') || targetClass.includes('sm-media-item--drag-mask') || targetClass.includes('sm-media-item')
}

const isSelected = (event: Event): void => {
  if (!props.isSelectable) {
    return
  }

  if ((event.target as HTMLElement).nodeName !== 'DIV') {
    return
  }

  const targetClasses = (event.target as HTMLElement).className
  if (isOuterElem(targetClasses)) {
    getSelected.value = !getSelected.value
    if (getSelected.value) {
      emit('selected')
    } else {
      emit('un-selected')
    }
  }
}

defineExpose({
  hovering,
  getSelected,
  isSelected,
})
</script>

<template>
  <sm-lazy-image
    class="sm-media-item"
    :src="src"
    :type="SmLazyImageType.BACKGROUND"
    :style="`height:${gridItemHeight}; flex: 0 0 ${gridItemWidth};`"
    tabindex="0"
    :class="{
      'sm-media-item--selected': getSelected,
      [customClass]: !!customClass,
    }"
    @click="isSelected($event)"
    @mouseover="hovering = true"
    @mouseout="hovering = false"
  >
    <sm-card class="sm-media-item__card">
      <div class="sm-media-item--drag-mask" />

      <template v-if="$slots['left-action']">
        <!-- <transition name="sm-media-item__fade"> -->
        <div
          v-show="alwaysShowLeftAction || hovering"
          class="sm-media-item__actions sm-media-item__actions--left"
        >
          <!-- @slot Place action components in the top-left corner of the media item -->
          <slot name="left-action" />
        </div>
        <!-- </transition> -->
      </template>

      <!-- <transition name="sm-media-item__fade"> -->
      <sm-card-actions
        v-show="hovering"
        class="sm-media-item__actions"
      >
        <!-- @slot Place action components in the top-right corner of the media item -->
        <slot />
      </sm-card-actions>
      <!-- </transition> -->
    </sm-card>

    <!-- <transition name="sm-media-item__fade"> -->
    <div
      v-if="getSelected"
      class="sm-media-item--selected-wrap"
    >
      <div class="sm-media-item--selected-icon">
        <sm-icon name="action-checkmark" />
      </div>
    </div>
    <!-- </transition> -->

    <div
      v-if="$slots.footer"
      class="sm-media-item__footer"
    >
      <!-- @slot Place additional information on the bottom of the media item. This can overlap with the selected icon if it's selectable so use with caution. -->
      <slot name="footer" />
    </div>
  </sm-lazy-image>
</template>

<style lang="scss" scoped>
@import "../../common/variables";

$sm-media-item--hover-border-color: $primary-blue;
$sm-media-item--focus-border-color: $grey-neu-black;
$sm-media-item--ghost-color: $primary-blue;

.sm-media-item {
  cursor: pointer;
  display: flex;
  width: 100%;
  margin-bottom: 8px;
  border-radius: 6px;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  transition: box-shadow 0.2s ease-in;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px $sm-media-item--focus-border-color;
    transition: box-shadow 0.2s ease-in;
  }

  &__card {
    border: 2px solid transparent;
    border-radius: 6px;
    width: 100%;
    height: 100%;
    background: none;
    transition: all 0.2s ease-in;

    &:hover {
      border-color: $sm-media-item--hover-border-color;
    }
  }

  &__actions {
    @media #{$touch-devices} {
      display: block!important;
    }
  }

  &--selected-wrap {
    border: 1px solid $true-white;
    border-radius: 50%;
    position: absolute;
    bottom: 12px;
    right: 12px;
  }

  &--selected-icon {
    margin: 3px;
    font-size: 15px;
    height: 28px;
    min-width: 28px;
    border-radius: 50%;
    background: $app-success;
    color: $true-white;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    .sm-icon {
      pointer-events: none;
      top: 0;
    }
  }

  &--selected {
    .sm-media-item__card {
      border-color: $sm-media-item--hover-border-color;
      transition: all 0.2s ease-in;
      background: rgba($primary-blue, 0.25);
    }
  }

  &:focus {
    .sm-media-item__card {
      border-color: $sm-media-item--hover-border-color;
    }
  }

  &__actions--left {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 10;
    padding: 0;
  }

  &__footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: $sm-8 $sm-12;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    z-index: 1;
  }

  &__graphic {
    border-radius: 4px;
  }

  &--drag-mask {
    width: 100%;
    height: 100%;
    background: transparent;
  }

  &--dragging  {
    .sm-media-item__card {
      &:hover {
        border-color: transparent;
      }
    }

    &:hover {
      .sm-media-item__actions {
        display: none;
      }
    }
  }

  &--ghost {
    .sm-media-item__actions {
      display: none;
    }

    .sm-media-item--drag-mask {
      background: rgba($sm-media-item--ghost-color, 0.2);
    }
  }

  .sm-media-item__fade-enter-active, .sm-media-item__fade-leave-active {
    transition: opacity .3s;
  }

  .sm-media-item__fade-enter, .sm-media-item__fade-leave-to {
    opacity: 0;
  }
}
</style>
