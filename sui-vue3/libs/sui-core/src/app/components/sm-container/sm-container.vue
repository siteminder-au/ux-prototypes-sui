<script setup lang="ts">
withDefaults(defineProps<{
  fullWidth?: boolean
}>(), {
  fullWidth: false,
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
    class="sm-container"
    :class="{ 'sm-container--full-width': fullWidth }"
  >
    <!-- @slot all content will be placed in here -->
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@import "../../common/variables";
@import "../../common/mixins";

.sm-container {
  padding: 0 $sm-32;
  max-width: 1040px;
  width: 100%;

  @media (min-width: #{$viewport--extra-large-desktop}) {
    padding: 0 $sm-56;
    max-width: 1140px;
  }

  &--full-width {
    max-width: none;
  }

}
</style>
