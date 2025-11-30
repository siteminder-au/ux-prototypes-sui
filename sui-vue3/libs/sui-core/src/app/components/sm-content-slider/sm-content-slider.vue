<script setup lang="ts">
import { ref, onMounted, watchEffect, computed, provide, Ref, VNode } from 'vue'
import { useI18n } from '../../libs/vue-i18n'
import SmButton from '../sm-button/sm-button.vue'
import { SmButtonShape, SmButtonSize, SmButtonType } from '../sm-button/sm-button.types'
import { ContentSliderProviderKey } from './symbols'

const props = withDefaults(defineProps<{
  /**
   * Array of available items
   */
  items?: unknown[]
  /**
   * Set the visible items on slider
   */
  itemVisible?: number
  /**
   * Set the height of slides, accept only units of measurement. For example '100px', '100em', '100rem'. Default is '100px'
   */
  height?: string
}>(), {
  items: () => [],
  itemVisible: 4,
  height: '100px',
})

const emit = defineEmits<{
  /**
   * Emits when the next button is clicked
   */
  slideNext: []
  /**
   * Emits when the previous button is clicked
   */
  slidePrev: []
}>()

defineSlots<{
  default?: () => VNode[]
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

const { i18n } = useI18n()

const visibleItem = computed(() => props.itemVisible)
const itemsData = computed(() => props.items)
const totalItemsLength = computed(() => itemsData.value.length || 0)

const rootContainer: Ref<HTMLElement | null> = ref(null)
const sliderContainer: Ref<HTMLElement | null> = ref(null)
const sliderContainerWidth = ref<number>(0)
const totalItemsWidth = ref<string | undefined>()
const isVisiblePrevButton = ref<boolean>(false)
const isVisibleNextButton = ref<boolean>(false)

const steps = ref<number>(0)

const transformStyle = ref<string | undefined>()

const _itemWidth = computed(() => sliderContainerWidth.value / visibleItem.value)

// Pass these details to the children
provide(ContentSliderProviderKey, {
  // Pass down a reactive value so individual items don't have to calculate it, they're the same for all
  // This will also get rid of `resize` window event listener for each item
  itemWidth: _itemWidth,
  itemsData,
})

// Emit when the next button is clicked
const slideNext = (): void => {
  if (steps.value < totalItemsLength.value - visibleItem.value) {
    steps.value += 1
    emit('slideNext')
    moveItemList()
    isVisiblePrevButton.value = true
  } else {
    isVisibleNextButton.value = false
  }
}

// Emit when the previous button is clicked
const slidePrev = (): void => {
  if (steps.value > 0) {
    steps.value -= 1
    emit('slidePrev')
    moveItemList()
    isVisibleNextButton.value = true
    isVisiblePrevButton.value = steps.value !== 0
  } else {
    isVisiblePrevButton.value = false
  }
}

// Function to add transform property when slide
const moveItemList = (): void => {
  const itemWidth = sliderContainerWidth.value / visibleItem.value

  // Refactored in Vue3 since doing the direct manipulation above results on the transform
  // getting removed when the width gets updated, i.e change in total items
  // rootContainer.value.style.transform = `translateX(-${itemWidth * steps.value}px)`
  transformStyle.value = `translateX(-${itemWidth * steps.value}px)`
}

const reStyle = (): void => {
  // show hide the next button
  isVisibleNextButton.value = steps.value < totalItemsLength.value - visibleItem.value
  calculateResponsiveWidth()
}

onMounted(() => {
  reStyle()
  window.addEventListener('resize', () => {
    calculateResponsiveWidth()
  })
})

const calculateResponsiveWidth = (): void => {
  // get the width of root container and calculate the width of image slide
  sliderContainerWidth.value = sliderContainer.value?.clientWidth ?? 0
  const singleItemWidth = sliderContainerWidth.value / visibleItem.value
  totalItemsWidth.value = `${singleItemWidth * props.items.length}px`
}

// Update the responsive width's and show/hide the buttons
watchEffect(() => {
  reStyle()
})

defineExpose({
  rootContainer,
  slideNext,
  slidePrev,
  totalItemsWidth,
  itemsData,
  isVisibleNextButton,
  isVisiblePrevButton,
  sliderContainer,
})
</script>

<template>
  <div
    ref="sliderContainer"
    class="sm-content-slider"
    :style="{ height: height }"
  >
    <span
      v-if="isVisiblePrevButton"
      class="sm-content-slider__button sm-content-slider__button-prev"
      @click="slidePrev"
    >
      <sm-button
        :aria-label="i18n.t('sui-core.components.sm-content-slider.sm-content-slider.a11y__click-to-previous-button')"
        :title="i18n.t('sui-core.components.sm-content-slider.sm-content-slider.a11y__click-to-previous-button')"
        :shape="SmButtonShape.SQUARE"
        :type="SmButtonType.TERTIARY"
        class="sm-content-slider__button__prev"
        :size="SmButtonSize.MEDIUM"
      ><sm-icon
        name="arrow-left"
      /></sm-button>
    </span>
    <ul
      id="sm-content-slider-list"
      ref="rootContainer"
      class="sm-content-slider__list"
      :style="{
        width: totalItemsWidth,
        transform: transformStyle,
      }"
    >
      <!-- @slot A space for sm-content-slider-item components to be placed -->
      <slot />
    </ul>
    <span
      v-if="isVisibleNextButton"
      class="sm-content-slider__button sm-content-slider__button-next"
      @click="slideNext"
    >
      <sm-button
        :aria-label="i18n.t('sui-core.components.sm-content-slider.sm-content-slider.a11y__click-to-next-button')"
        :title="i18n.t('sui-core.components.sm-content-slider.sm-content-slider.a11y__click-to-next-button')"
        :shape="SmButtonShape.SQUARE"
        :type="SmButtonType.TERTIARY"
        class="sm-content-slider__button__next"
        :size="SmButtonSize.MEDIUM"
      ><sm-icon
        name="arrow-right"
      /></sm-button>
    </span>
  </div>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-content-slider--info--text-color: $grey-neu-black;
$sm-content-slider--button--gradient-color: $blue-neu-light;
$sm-content-slider--button--border-color: $light-blue-grey;

.sm-content-slider {
  overflow: hidden;
  position: relative;
  margin: 0 16px;

  &__button-prev {
    left: 0;
    background-image: linear-gradient(to left, rgba(245, 249, 255, 0), $sm-content-slider--button--gradient-color);
  }

  &__button-next {
    right: 0;
    background-image: linear-gradient(to right, rgba(245, 249, 255, 0), $sm-content-slider--button--gradient-color);
  }

  &__button {
    position: absolute;
    z-index: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    top: 0;

    &__prev {
      left: -2px;
    }

    &__next {
      right: -2px;
    }

    .sm-button .sm-button__content {
      border: 1px solid $sm-content-slider--button--border-color;
    }
  }

  ul {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    padding: 0;
    margin: 0;
    transition: transform 0.3s;
    transform: translateX(0);
    background: transparent;
  }
}
</style>
