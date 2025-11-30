<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * A URL to the image
   */
  src: string
  /**
   * The image's alternative text displayed for screen readers
   */
  alt?: string
}>(), {
  alt: '',
})
</script>

<template>
  <figure class="sm-accordion-graphic">
    <img
      :src="src"
      :alt="alt"
    >
  </figure>
</template>

<style lang="scss" scoped>
.sm-accordion-graphic {
  // Don't overlap with border
  margin-top: -11px;
  margin-bottom: -11px;
  padding: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
