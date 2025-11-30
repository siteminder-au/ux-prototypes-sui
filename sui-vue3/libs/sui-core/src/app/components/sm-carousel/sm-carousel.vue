<script setup lang="ts">
import { ref, computed, Ref, onMounted, watch, nextTick } from 'vue'
import { ImageData, CarouselStyle } from './sm-carousel.types'
import SmCarouselSlide from './sm-carousel-slide.vue'
import SmCarouselCounter from './sm-carousel-counter.vue'
import SmButton from '../sm-button/sm-button.vue'
import { SmButtonShape } from '../sm-button/sm-button.types'
import { useI18n } from '../../libs/vue-i18n'

const props = withDefaults(defineProps<{
  /**
   * Array of available options. E.g [{ "src": "", "alt": "" }, { "src": "", "alt": "" }]
   */
  data?: ImageData[]
  /**
   * Set the height of carousel slides, accept only units of measurement. For example '100px', '100em', '100rem'. Default is '100px'
   */
  height?: string
  /**
   * Whether the number counter should be shown (total number of slides must be greater then 2)
   */
  numberCounter?: boolean
}>(), {
  numberCounter: false,
  data: () => [],
  height: '100px',
})

const emit = defineEmits<{
  /**
   * Emitted when next button is clicked
   */
  next: []
  /**
   * Emitted when previous button is clicked
   */
  prev: []
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

const rootContainer: Ref<HTMLElement | null> = ref(null)

const currentIndex = ref<number>(0)
const isVisiblePrevButton = ref<boolean>(false)
const isVisibleNextButton = ref<boolean>(false)

/**
 * Define trackable mutable object for the style attributes
 */
const carouselStyles = ref<CarouselStyle>({
  transform: undefined,
  width: undefined,
})

const totalSlidesLength = computed(() => {
  return props.data.length
})

const rootContainerWidth = ref(0)

/**
 * Function to call on next button clicked
 */
const slideNext = (): void => {
  if (currentIndex.value < totalSlidesLength.value - 1) {
    currentIndex.value += 1
    setSlides(currentIndex.value)
    emit('next')
    isVisiblePrevButton.value = true
  } else {
    isVisibleNextButton.value = false
  }
}

/**
 * Function to call on previous button clicked
 */
const slidePrev = (): void => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1
    setSlides(currentIndex.value)
    emit('prev')
    isVisibleNextButton.value = true
  } else {
    isVisiblePrevButton.value = false
  }
}

/**
 * Function to set the current slide with transform property
 */
const setSlides = (index: number): void => {
  currentIndex.value = index
  const itemWidth: number | undefined = rootContainerWidth.value
  carouselStyles.value.transform = itemWidth ? `translateX(-${itemWidth * currentIndex.value}px)` : ''
  // re-set the arrow buttons visibility
  validateArrowVisibility()
}

/**
 * Function to initialize the carousel with width and arrow button visibility
 */
const initCarousel = (): void => {
  // get the width of root container and calculate the width of image slide
  rootContainerWidth.value = rootContainer.value?.clientWidth ?? 0
  const singleItemWidth: number | undefined = rootContainerWidth.value
  carouselStyles.value.width = singleItemWidth ? `${singleItemWidth * props.data.length}px` : ''
  // re-set the arrow buttons visibility
  validateArrowVisibility()
}

/**
 * Function to validate the arrow button visibility, previous and next button
 */
const validateArrowVisibility = (): void => {
  const index = currentIndex.value
  isVisibleNextButton.value = index < totalSlidesLength.value - 1
  isVisiblePrevButton.value = index > 0
}

onMounted(() => {
  initCarousel()
})

watch(() => props.data, async () => {
  // nextTick is required to cater for v-show use case:
  // clientWidth of the parent container will equal to 0 in the current tick when v-show becomes truthy
  // so we need to delay calling initCarousel() to the next tick when Vue has flushed changes to the DOM
  // which would have also updated the clientWidth of the parent container
  await nextTick()

  // re-initialize the carousel on data change
  // e.g. when new items are added or removed
  initCarousel()
}, { deep: true })

defineExpose({
  slideNext,
  slidePrev,
  rootContainer,
  currentIndex,
})
</script>

<template>
  <section
    ref="rootContainer"
    class="sm-carousel"
    :style="{ height: height }"
  >
    <ul
      class="sm-carousel__slides"
      :style="carouselStyles"
    >
      <sm-carousel-slide
        v-for="(item, i) in data"
        :key="i"
        :item="item"
        :width="rootContainerWidth"
        :aria-hidden="currentIndex !== i"
      />
    </ul>

    <ul class="sm-carousel__controls">
      <li
        v-if="isVisiblePrevButton"
      >
        <sm-button
          :aria-label="i18n.t('sui-core.components.sm-carousel.sm-carousel.a11y__click-to-previous-button')"
          :title="i18n.t('sui-core.components.sm-carousel.sm-carousel.a11y__click-to-previous-button')"
          :shape="SmButtonShape.SQUARE"
          tabindex="0"
          class="sm-carousel__controls-button sm-carousel__controls-button-prev"
          @click="slidePrev"
        >
          <sm-icon
            name="arrow-left"
          />
        </sm-button>
      </li>

      <li
        v-if="isVisibleNextButton"
      >
        <sm-button
          :aria-label="i18n.t('sui-core.components.sm-carousel.sm-carousel.a11y__click-to-next-button')"
          :title="i18n.t('sui-core.components.sm-carousel.sm-carousel.a11y__click-to-next-button')"
          :shape="SmButtonShape.SQUARE"
          tabindex="0"
          class="sm-carousel__controls-button sm-carousel__controls-button-next"
          @click="slideNext"
        >
          <sm-icon
            name="arrow-right"
          />
        </sm-button>
      </li>
    </ul>

    <ul
      v-if="data.length > 5"
      class="sm-carousel__slide-nav"
    >
      <li
        v-for="(item, i) in data"
        :key="i"
      >
        <button
          :data-slide="i"
          class="sm-carousel__slide-nav-button"
          :aria-label="`item${i}`"
          :class="{
            'sm-carousel__slide-nav-button--active': currentIndex === i
          }"
          @click="setSlides(i)"
        >
          <span
            class="sm-carousel__slide-nav-circle"
            tabindex="-1"
          />
        </button>
      </li>
    </ul>

    <sm-carousel-counter
      v-if="numberCounter && data.length > 2"
      :total-slides="data.length"
      :current-slide="currentIndex"
    />
  </section>
</template>

<style lang="scss">
@import '../../common/variables';
@import '../../common/mixins';

.sm-carousel {
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;

  .sm-carousel__controls .sm-carousel__controls-button {
    // ensure we have higher css specificity
    // than .sm-button class name as by default
    // sm-button has display: inline-block and position: relative;
    position: absolute;
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    width: 60px;
    top: 0;
    height: 100%;
    opacity: 1;
    transition: opacity .3s ease;

    &:hover, &:focus {
      .sm-button__content {
        background: transparent;
        color: $true-white;
      }
    }

    @media #{$extra-large-desktop} {
      opacity: 0;
    }

    &-prev {
      left: 0;
      background-image: linear-gradient(to right, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0));
    }

    &-next {
      right: 0;
      background-image: linear-gradient(to left, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0));
    }

    // TODO: refactor this to avoid style overrides on sui base component
    // consider creating an sm-carousel-button component so future changes
    // to sm-button does not affect this component (e.g. if we change sm-button class names)
    // https://siteminder-jira.atlassian.net/browse/SUI-2270
    .sm-button__content {
      background: transparent;
      color: $true-white;

      .sm-icon {
        font-size: $sm-24;
        top: 0; // vertically center aligned
      }
    }
  }

  // Image carousel slides
  .sm-carousel__slides {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    padding: 0;
    margin: 0;
    transition: transform 0.3s;
    transform: translateX(0);
    background-image: linear-gradient(to left, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0));
  }

  // Image carousel slide navigation circles at footer
  .sm-carousel__slide-nav {
    text-align: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0));
    height: $sm-32;
    margin: 0;
    padding: 0;

    li {
      display: inline-block;
    }

    &-button {
      background: transparent;
      border: 0;
      padding: 0;
      margin: $sm-4;
      height: $sm-8;
      width: $sm-8;
      cursor: pointer;
      z-index: 1;

      &--active {
        .sm-carousel__slide-nav-circle {
          opacity: 1;
        }
      }

      &:focus {
        box-shadow: none;
        outline: none;

        .sm-carousel__slide-nav-circle {
          outline: 2px solid $grey-neu-black;
          outline-offset: $sm-4;
        }
      }
    }

    &-circle {
      border-radius: 50%;
      padding: $sm-4;
      width: $sm-8;
      height: $sm-8;
      background-color: $true-white;
      opacity: 0.5;
      position: absolute;
      top: $sm-12;

      &:focus {
        box-shadow: none;
      }
    }
  }

  // Media query to show carousel controller on the large desktop on focus
  @media #{$extra-large-desktop} {
    &:hover, &:focus {
      .sm-carousel__controls-button {
        opacity: 1;
        transition: opacity .3s ease;
      }
    }
  }

  .sm-carousel__controls-button:focus {
    opacity: 1;
  }
}
</style>
