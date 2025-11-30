<script setup lang="ts">
defineProps<{
  /**
   * A URL to the image
   */
  src: string
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
  <div
    class="sm-content-slider-graphic"
    :style="`background-image: url(${src})`"
  />
</template>

<style lang="scss">
.sm-content-slider-graphic {
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  border-radius: 4px;
}
</style>
