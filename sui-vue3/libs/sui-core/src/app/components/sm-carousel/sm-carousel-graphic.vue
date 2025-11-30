<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * A URL to the image
   */
  src: string
  /**
   * The image's alternative text displayed for screen readers
   */
  alt: string
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
  <div class="sm-carousel-graphic">
    <figure
      class="sm-carousel-graphic-image"
    >
      <img
        :src="src"
        :alt="alt"
      >
    </figure>
  </div>
</template>

<style lang="scss" scoped>
.sm-carousel-graphic {
  &-image {
    width: 100%;
    margin: 0;
    position: absolute;
    bottom: 0;
    top: 0;
    padding: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
