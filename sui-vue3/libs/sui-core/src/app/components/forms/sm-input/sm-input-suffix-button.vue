<script setup lang="ts">
import { VNode } from 'vue'

defineEmits<{
  /**
   * Emits on click
   */
  click: [e: MouseEvent]
}>()

/**
 * defineSlots macro used to declare expected slots and their respective expected slot
 */
defineSlots<{
  default?: () => VNode[]
}>()
</script>

<template>
  <button
    class="sm-input-suffix-button"
    type="button"
    @click="(e) => $emit('click', e)"
  >
    <!-- @slot The content of the suffix button -->
    <slot />
  </button>
</template>

<style lang="scss" scoped>
@import "../../../common/variables";

.sm-input-suffix-button {
  align-items: center;
  background-color: $app-info-light;
  color: $grey-neu-black;
  cursor: pointer;
  display: flex;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
  margin: -1px -1px -1px 0;
  border: 1px solid $app-info-mid;
  border-left: none;
  width: calc(100% + 1px);
  transition-property: background-color, border-color, color;
  transition-duration: .3s;
  transition-timing-function: ease;
  padding: $sm-8 $sm-12;
  position: relative;

  /** Hover state */
  &:hover {
    background-color: $blue-neu-med;
    border-color: $blue-neu-mid;
  }

  /** Active state */
  &:active {
    background-color: $blue-neu-mid;
  }

  /** Focus state */
  &.sm-input-suffix-button:focus-visible {
    box-shadow: none;

    &::after {
      border-radius: inherit;
      box-shadow: inset 0 0 0 2px $grey-neu-black;
      content: "";
      width: calc(100% + 1px);
      height: calc(100% + 2px);
      position: absolute;
      left: 0;
      top: -1px;
    }
  }

  &.sm-input-suffix-button:focus {
    /* Remove global fallback styles */
    outline: none;
    box-shadow: none;
  }
}
</style>
