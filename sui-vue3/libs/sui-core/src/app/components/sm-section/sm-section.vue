<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * The HTML tag name of the element
   */
  tag?: string
}>(), {
  tag: 'section',
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
  <section class="sm-section">
    <!-- @slot All content will be placed in here -->
    <slot />
  </section>
</template>

<style lang="scss" scoped>
@import "../../common/variables";
@import "../../common/mixins";

.sm-section {
  padding: $sm-32 0;

  @media (min-width: #{$viewport--extra-large-desktop}) {
    padding: $sm-56 0;
  }

}
</style>
