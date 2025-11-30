<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /**
   * A URL to the image
   */
  imageSrc?: string
  /**
   * Set the width of brand image, accept only units of measurement. For example '100px', '100em', '100rem'
   */
  width?: string
  /**
   * Set the height of brand image, accept only units of measurement. For example '100px', '100em', '100rem'
   */
  height?: string
  /**
   * Set the position of brand image. This accepts 1 to 4-value syntax. For example 'right', 'right bottom', 'right 0% bottom 56px', etc
   */
  backgroundPosition?: string
  /**
   * Whether to set the container with dark background
   */
  dark?: boolean
}>(), {
  imageSrc: undefined,
  width: '',
  height: '',
  backgroundPosition: '',
  dark: false,
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

const styleAttrs = computed(() => {
  return {
    backgroundImage: props.imageSrc ? `url(${props.imageSrc})` : undefined,
    backgroundPosition: props.backgroundPosition ? `${props.backgroundPosition}` : undefined,
  }
})
</script>

<template>
  <div
    class="sm-card-brand-graphic"
    :class="{ 'sm-card-brand-graphic--dark': dark }"
    :style="{ width: width, height: height }"
  >
    <div
      :style="styleAttrs"
      class="sm-card-brand-graphic__background-color"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "../../common/variables";

$sm-card--dark--background-color: $brand-1;

.sm-card-brand-graphic {
  overflow: hidden;
  height: 100%;
  right: 0;
  position: absolute;
  top: 0;
  width: 100%;
  border-radius: 8px;

  &__background-color {
    height: 100%;
    background-position: right bottom;
    background-size: contain;
    background-repeat: no-repeat;
    width: 100%;
  }

  &--dark {
    background-color: $sm-card--dark--background-color;
  }
}
</style>
