<script setup lang="ts">
import { ref, provide, computed } from 'vue'
// Workaround for https://github.com/SortableJS/vue.draggable.next/issues/117
import Draggable from 'vuedraggable/src/vuedraggable'
import { ListProviderKey } from './symbols'

const props = withDefaults(defineProps<{
  /**
   * Whether the list can be re-arranged by the user. Requires the list prop to be set.
   */
  draggable?: boolean
  /**
   * A selector indicating which element the user can use to drag the list item.
   * Accepts: 'row', 'icon' and any other value which can be parsed to `querySelector`
   */
  handle?: string
  /**
   * An identifier used to allow two or more draggable lists to work together
   */
  group?: string
  /**
   * An array of unique items for the list items. Required if the draggable prop is true. The array will be mutated when the order of the list changes.
   */
  list?: unknown[]
  /**
   * Set the height to the list, accept only units of measurement. For example '100px', '100em', '100rem'
   */
  height?: string
  /**
   * Whether the list should be stacked on top of each other, as opposed to being displayed in a grid
   */
  stacked?: boolean
  /**
   * CSS classes which will be applied to the root content element
   */
  contentClass?: string
  /**
   * Whether the list items should be stacked on top of each other, as opposed to being displayed in a grid
   */
  itemStacked?: boolean
  /**
   * Specifies which items inside the element should be draggable, accept the class name. For example '.sm-list-item_3, .sm-list-item_2, .sm-list-item_41'
   */
  draggableClass?: string
  /**
   * Disables the dragging if set to true
   */
  disabled?: boolean
  /**
   * Control the dragging of the item. Returning false will cancel the drag operation. For example: cancel the drag operation on move event
   */
  checkMove?: boolean
}>(), {
  draggable: false,
  handle: 'row',
  group: '',
  list: () => [],
  height: '',
  stacked: false,
  contentClass: '',
  itemStacked: true,
  draggableClass: '.sm-list-item',
  disabled: false,
  checkMove: true,
})
const emit = defineEmits<{
  /**
   * Emitted when you move an image in the list groups
   */
  move: [event: Event]
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

// see: https://github.com/SortableJS/vue.draggable.next/issues/122#issuecomment-1209914102
Draggable.compatConfig = { MODE: 3 }

const isDraggable = computed(() => props.draggable)
provide(ListProviderKey, {
  draggable: isDraggable,
})

const dragging = ref(false)

const isDisabled = computed(() => props.disabled)

const computedHandle = computed(() => {
  if (props.handle === 'row') {
    return null // By default, the list item "row" will be the handle
  }

  if (props.handle === 'icon') {
    return '.sm-list-item__drag-icon'
  }

  return props.handle
})

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

// Event when you move an item in the list or between lists
const move = (event: Event): boolean => {
  emit('move', event)
  return props.checkMove
}
// Element is dropped into the list from another list
const add = (event: Event): void => {
  dragging.value = true
  emit('add', event)
}
// Element is removed from the list into another list
const remove = (event: Event): void => {
  dragging.value = true
  emit('remove', event)
}

defineExpose({
  dragging,
  computedHandle,
  change,
  start,
  end,
  add,
  remove,
  move,
  isDisabled,
})
</script>

<template>
  <div
    class="sm-list"
    :handle="handle"
    :class="[
      {
        'sm-list--draggable': draggable,
        'sm-list--dragging': dragging,
        'sm-list--stacked': stacked,
      },
      contentClass,
    ]"
  >
    <div
      v-if="$slots.header && !draggable"
      class="sm-list__header"
      :class="{ 'sm-list__header-stacked': !$slots.default }"
    >
      <!-- @slot A space for static header here -->
      <slot name="header" />
    </div>
    <div v-if="draggable">
      <draggable
        :list="list"
        tag="ol"
        class="sm-list__group"
        :class="{ 'sm-list--not-stacked-item': !itemStacked }"
        :group="group"
        :handle="computedHandle"
        clone-class="sm-list-item--clone"
        ghost-class="sm-list-item--ghost"
        chosen-class="sm-list-item--chosen"
        drag-class="sm-list-item--drag"
        item-key="list"
        :animation="200"
        :move="move"
        :disabled="isDisabled"
        :draggable="draggableClass"
        @start="start"
        @end="end"
        @change="change"
        @add="add"
        @remove="remove"
      >
        <template #item="{element}">
          <li
            class="sm-list-item"
            :class="[{ [`sm-list-item_${element.id}`]: !!element.id }
            ]"
          >
            <!-- @slot The form label. Overrides the label prop -->
            <slot
              name="list"
              :item="element"
            />
          </li>
        </template>
      </draggable>
    </div>
    <ol
      v-else
      class="sm-list__group"
      :class="{ 'sm-list__group-header': $slots.header, 'sm-list--not-stacked-item': !itemStacked }"
      :style="{ height: height }"
    >
      <!-- @slot A space for sm-list-item components to be placed -->
      <slot />
    </ol>
  </div>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-list--header--background-color: $blue-neu-med;
$sm-list--header--border-color: $light-blue-grey;

.sm-list {
  width: 100%;

  &--stacked {
    .sm-list__group {
      margin: 0;
    }

    .sm-list__header {
      border-radius: 0;
      border-top: 0;
    }

    .sm-list__group {
      &:not(.sm-list__group-header) {
        .sm-list-item:first-child {
          .sm-list-item__container {
            border-top: 0;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
          }
        }
      }

      .sm-list-item:last-child {
        .sm-list-item__container {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
      }
    }

    &:first-child {
      .sm-list__header {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-top: 1px solid $sm-list--header--border-color;
      }

      .sm-list__group {
        &:not(.sm-list__group-header) {
          .sm-list-item:first-child {
            > .sm-list-item__container {
              border-top-left-radius: 8px;
              border-top-right-radius: 8px;
              border-top: 1px solid $sm-list--header--border-color;
            }
          }
        }
      }
    }

    &:last-child {
      .sm-list-item:last-child {
        > .sm-list-item__container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }

      .sm-list__header-stacked {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }
  }

  &--not-stacked-item {
    > .sm-list-item {
      @include padding($top: rem($sm-sm));

      &:first-child {
        padding-top: 0;
      }

      > .sm-list-item__container {
        border-radius: 8px;
        border-top: 1px solid $sm-list--header--border-color;
      }
    }
  }

  &__group {
    margin: 0 0 32px;
    padding: 0;
  }

  // Nested styling
  .sm-list & .sm-list__group {
    margin-bottom: 0;
  }

  .sm-list & .sm-list__group > .sm-list-item:first-child {
    > .sm-list-item__container {
      margin-top: 12px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      border-top: 1px solid $sm-list--header--border-color;
    }
  }

  .sm-list & .sm-list__group-header > .sm-list-item:first-child {
    > .sm-list-item__container {
      margin-top: 0;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }

  .sm-list & .sm-list__group > .sm-list-item:last-child {
    > .sm-list-item__container {
      margin-bottom: 0;
    }
  }

  &__header {
    background-color: $sm-list--header--background-color;
    padding: 11px;
    border: 1px solid $sm-list--header--border-color;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &__group-header {
    li {
      &:first-child {
        > .sm-list-item__container {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          border-top: 0;
        }
      }
    }
  }
}
</style>
