<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { ListProviderKey } from './symbols'

const props = withDefaults(defineProps<{
  /**
   * The content of the list item. Can be overridden by the label slot
   */
  label?: string
  /**
   * The content of the list item. Can be overridden by the label slot
   */
  id?: string
  /**
   * A custom class to apply to the non-draggable list item element (li)
   */
  rootClass?: string
}>(), {
  label: '',
  id: '',
  rootClass: '',
})

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
  },
})

// data provided by sm-list
const listProvider = inject(ListProviderKey, { draggable: ref(false) })
const isDraggable = computed(() => listProvider.draggable.value)

const getId = ref(props.id)
defineExpose({
  getId,
})
</script>

<template>
  <div
    v-if="isDraggable"
    class="sm-list-item__container"
  >
    <sm-icon
      class="sm-list-item__drag-icon"
      name="action-drag"
      aria-hidden="true"
    />

    <!-- @slot The content of the list item. Overrides the label prop -->
    <slot>
      <span class="sm-list-item__label">{{ label }}</span>
    </slot>
  </div>
  <li
    v-else
    class="sm-list-item"
    :class="[{ [`sm-list-item_${getId}`]: !!getId },
             rootClass,
    ]"
  >
    <div class="sm-list-item__container">
      <sm-icon
        class="sm-list-item__drag-icon"
        name="action-drag"
        aria-hidden="true"
      />

      <!-- @slot The content of the list item. Overrides the label prop -->
      <slot>
        <span class="sm-list-item__label">{{ label }}</span>
      </slot>
    </div>
  </li>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-list-item--text-color: $grey-neu-black;
$sm-list-item--background-color: $true-white;
$sm-list-item--border-color: $light-blue-grey;
$sm-list-item--hover--text-color: $grey-neu-black;
$sm-list-item--hover--background-color: $true-white;
$sm-list-item--hover--border-color: $primary-blue;
$sm-list-item--ghost--text-color: $grey-neu-med;
$sm-list-item--ghost--background-color: $grey-neu-white;
$sm-list-item--ghost--border-color: $grey-neu-med;

.sm-list-item {
  list-style: none;
  position: relative;
  overflow: hidden;

  &.sm-overflow-visible {
    list-style: none;
    overflow: visible;
  }

  &__container {
    list-style: none;
    margin: 0;
    padding: 15px;
    color: $sm-list-item--text-color;
    background: $sm-list-item--background-color;
    border: 1px solid $sm-list-item--border-color;
    border-top: none;
    font-weight: 600;
    position: relative;
    display: flex;
    flex-flow: row wrap;
  }

  &__label {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: calc(100% - 24px); // The width of the icon
  }

  &:first-child {
    > .sm-list-item__container {
      border-top: 1px solid $sm-list-item--border-color;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
  }

  &:last-child {
    > .sm-list-item__container {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }

  &__drag-icon.sm-icon {
    display: none;
    top: 3px;
  }

  .sm-list--draggable &__drag-icon {
    display: inline-block;
    width: 16px;
    margin-right: 8px;
    margin-bottom: -1px;
  }

  /* Hover State (Draggable) */

  .sm-list--draggable & {
    .sm-list-item__container {
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        border-radius: inherit;
        width: calc(100% - 1px);
        height: calc(100% - 1px);
        border: 1px solid $sm-list-item--hover--border-color;
        z-index: 2;
        opacity: 0;
        pointer-events: none;
      }
    }
  }

  .sm-list--draggable.sm-list--dragging & {
    .sm-list-item__container {
      &::after {
        display: none;
      }
    }
  }

  .sm-list[handle="row"].sm-list--draggable & {
    > .sm-list-item__container {
      &:hover::after {
        opacity: 1;
      }
    }

    &:hover {
      color: $sm-list-item--hover--text-color;
      background: $sm-list-item--hover--background-color;
      cursor: pointer;
    }
  }

  .sm-list[handle="icon"].sm-list--draggable &__drag-icon {
    cursor: pointer;
  }

  /* Ghost Element (Draggable) */
  .sm-list--draggable &--ghost {
    > .sm-list-item__container {
      color: $sm-list-item--ghost--text-color !important;
      background: $sm-list-item--ghost--background-color !important;
      border-color: $sm-list-item--ghost--border-color !important;
    }
  }

  /* Class name for the chosen item */
  .sm-list--draggable &--chosen {
    background: transparent !important;
  }

  .sm-list--draggable &--ghost::after {
    opacity: 0;
  }
}
</style>
