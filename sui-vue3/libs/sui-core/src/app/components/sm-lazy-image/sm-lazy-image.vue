<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '../../libs/vue-i18n'
import vLazyLoad from '../../directives/lazy-loader'
import SmLoadingImage from '../loading/sm-loading-image/sm-loading-image.vue'
import { SmLazyImageType } from './sm-lazy-image.types'

const props = withDefaults(defineProps<{
  /**
  * The src attribute of the image
  */
  src?: string
  /**
  * The alt attribute of the image
  */
  alt?: string
  /**
  * The type of component. Accepts 'background' and defaults to the native html5 element.
  */
  type?: SmLazyImageType
}>(), {
  src: undefined,
  alt: undefined,
  type: SmLazyImageType.NATIVE,
})

defineEmits<{
  click: [event: Event]
  mouseover: []
  mouseout: []
}>()

const { i18n } = useI18n()

const isBackground = computed(() => props.type === SmLazyImageType.BACKGROUND)

const suiLazyImage = ref(null)

defineExpose({
  suiLazyImage,
  isBackground,
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
    ref="suiLazyImage"
    v-lazy-load
    :type="type"
    class="sm-lazy-image"
    :class="{
      'sm-lazy-image--background': isBackground,
    }"
    :role="isBackground ? 'img' : undefined"
    @click="$emit('click', $event)"
    @keyup.enter="$emit('click', $event)"
    @mouseover="$emit('mouseover')"
    @mouseout="$emit('mouseout')"
    @focusin="$emit('mouseover')"
    @focusout="$emit('mouseout')"
  >
    <img
      :data-url="src"
      :alt="alt"
    >

    <sm-loading-image class="sm-lazy-image--loading" />

    <div class="sm-lazy-image--error">
      <div class="sm-lazy-image--error-wrapper">
        <sm-icon name="section-media-fail" />
        <p>{{ i18n.t('sui-core.components.sm-lazy-image.sm-lazy-image.loading-image-error-text') }}</p>
      </div>
    </div>
    <!-- @slot The default slot -->
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@import '../../common/variables';
@import '../../common/mixins';

.sm-lazy-image {
  position: relative;

  img {
    width: 100%;
    transition: all 0.5s ease-in-out;
    opacity: 0;
    visibility: hidden;
  }

  &--error {
    width: 100%;
    height: 100%;
    background: $grey-neu-light;
    border-radius: inherit;
    transition: all 0.5s ease-in-out;
    opacity: 0;
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;

    &-wrapper {
      width: 100%;
      color: $grey-neu-dark;
      font-size: 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;

      p {
        color: $grey-neu-black;
      }
    }
  }

  &--loading {
    width: 100%;
    height: 100%;
    transition: all 0.5s ease-in-out;
    visibility: visible;
    opacity: 1;
    position: absolute !important;
    top: 0;
    left: 0;
  }

  &--loaded {
    img {
      visibility: visible;
      opacity: 1;
      transition: all 0.5s ease-in-out;
    }

    .sm-lazy-image--loading {
      opacity: 0;
      visibility: hidden;
      width: 100%;
      transition: all 0.5s ease-in-out;
    }

  }

  &--loaded-error {
    img {
      display: none;
    }

    .sm-lazy-image--error {
      visibility: visible;
      opacity: 1;
      transition: all 0.5s ease-in-out;
    }
  }

  &--background {
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
  }

}
</style>
