<script setup lang="ts">
import { ImageData } from './sm-carousel.types'
import SmCarouselGraphic from './sm-carousel-graphic.vue'

withDefaults(defineProps<{
  /**
   * Set the aria-hidden
   */
  ariaHidden?: boolean | undefined
  /**
   * Array of available options. E.g [{ "src": "", "alt": "" }, { "src": "", "alt": "" }]
   */
  item: ImageData
  /**
   * Set the width of carousel slide
   */
  width?: number
}>(), {
  item: undefined,
  width: 0,
  ariaHidden: false,
})

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
    // we suppress ATTR_FALSE_VALUE as we want to keep
    // `aria-hidden` attribute attached even if the value of it is false
    // in vue2, aria-hidden was removed if the value was false.
    ATTR_FALSE_VALUE: 'suppress-warning',
  },
})
</script>

<template>
  <li
    class="sm-carousel-slide"
    :style="`width: ${width}px;`"
    :aria-hidden="ariaHidden"
    :tabindex="ariaHidden ? -1 : 0"
  >
    <sm-carousel-graphic
      :src="item?.src"
      :alt="item?.alt"
    />
  </li>
</template>

<style lang="scss">
.sm-carousel-slide {
  list-style: none;
  height: 100%;
  position: relative;
}
</style>
