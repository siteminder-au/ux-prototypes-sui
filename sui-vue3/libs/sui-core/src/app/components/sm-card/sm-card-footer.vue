<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * A custom class name to apply to the card footer
   */
  contentClass?: string
}>(), {
  contentClass: '',
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
    v-if="$slots.default"
    class="sm-card-footer"
    :class="contentClass"
  >
    <!-- @slot Place the footer at the bottom of the card -->
    <slot />
  </div>
</template>

<style lang="scss">
@import "../../common/variables";

.sm-card-footer {
  width: 100%;
  padding: $sm-12 $sm-24;
  z-index: $sm-card-z-index;
}
</style>
