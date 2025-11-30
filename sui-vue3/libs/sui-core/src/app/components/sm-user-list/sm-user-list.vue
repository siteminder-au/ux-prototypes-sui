<script setup lang="ts">
import { VNode } from 'vue'

/**
 * defineSlots macro used to declare expected slots and their respective expected slot
 */
defineSlots<{
  default?: () => VNode[]
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
</script>

<template>
  <div class="sm-user-list">
    <ul>
      <slot />
    </ul>
  </div>
</template>

<style lang="scss">
.sm-user-list {
  width: 100%;

  ul {
    padding: 0;
    margin: 0;
  }
}
</style>
