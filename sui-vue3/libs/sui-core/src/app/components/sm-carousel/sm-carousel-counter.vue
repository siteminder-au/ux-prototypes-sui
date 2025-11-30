<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * Get the number of current slide index
   */
  currentSlide: number
  /**
   * Get the number of total slides length
   */
  totalSlides: number
}>(), {
  currentSlide: 0,
  totalSlides: 0,
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
  <div class="sm-carousel-counter">
    <span
      class="sm-carousel-counter__container sm-text--small"
    >{{ currentSlide + 1 }} / {{ totalSlides }}</span>
  </div>
</template>

<style lang="scss" scoped>
@import '../../common/variables';
@import '../../common/mixins';

.sm-carousel-counter {
  &__container {
    color: $grey-neu-white;
    background: $grey-neu-black;
    position: absolute;
    bottom: 6px;
    left: $sm-16;
    min-width: 45px;
    border-radius: 3px;
    text-align: center;
    z-index: 1;
  }
}
</style>
