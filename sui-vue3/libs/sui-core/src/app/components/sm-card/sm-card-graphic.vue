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
  src: '',
  alt: '',
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
  <figure class="sm-card-graphic">
    <img
      :src="src"
      :alt="alt"
    >
  </figure>
</template>

<style lang="scss" scoped>
.sm-card-graphic {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;

  img {
    display: block;
    width: 100%;
  }
}
</style>
