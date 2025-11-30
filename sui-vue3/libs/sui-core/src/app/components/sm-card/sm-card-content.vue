<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * Set the width of content, accept only units of measurement. For example '100px', '100em', '100rem', '50%'
   */
  width?: string
}>(), {
  width: '',
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
</script>

<template>
  <div
    class="sm-card-content"
    :style="{ width: width }"
  >
    <!-- @slot The card content. Please native heading and paragraph elements here -->
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@import "../../common/variables";

.sm-card-content {
  padding: $sm-24;
  width: 100%;

  :slotted(h1),
  :slotted(h2),
  :slotted(h3),
  :slotted(h4),
  :slotted(h5),
  :slotted(h6) {
    margin-bottom: 8px;
  }

  :slotted(h1),
  :slotted(h2),
  :slotted(h3),
  :slotted(h4),
  :slotted(h5),
  :slotted(h6),
  :slotted(p) {
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
