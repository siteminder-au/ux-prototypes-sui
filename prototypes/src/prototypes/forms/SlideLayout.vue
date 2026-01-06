<template>
  <div class="slideshow-container">
    <SlideHeader :current-slide="currentSlide" :total-slides="5" :slide-title="slideTitle" :slide-titles="slideTitles"
      :is-first-slide="isFirstSlide" :is-last-slide="isLastSlide" @navigate="handleNavigation"
      @go-to-slide="goToSlide" />

    <div class="slide-content">
      <component :is="currentSlideComponent" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSlideNavigation } from './composables/useSlideNavigation'
import SlideHeader from './SlideHeader.vue'
import Slide1 from './slides/Slide1.vue'
import Slide2 from './slides/Slide2.vue'
import Slide3 from './slides/Slide3.vue'
import Slide4 from './slides/Slide4.vue'
import Slide5 from './slides/Slide5.vue'

const {
  currentSlide,
  isFirstSlide,
  isLastSlide,
  nextSlide,
  prevSlide,
  goToSlide
} = useSlideNavigation(5)

const slideComponents = {
  1: Slide1,
  2: Slide2,
  3: Slide3,
  4: Slide4,
  5: Slide5
}

const slideTitles = {
  1: 'Rate plan',
  2: 'Room rate',
  3: 'Room type',
  4: 'Channel rate',
  5: 'Property settings'
}

const currentSlideComponent = computed(() =>
  slideComponents[currentSlide.value] || Slide1
)

const slideTitle = computed(() =>
  slideTitles[currentSlide.value] || 'Slide'
)

const handleNavigation = (direction) => {
  if (direction === 'next') nextSlide()
  else if (direction === 'prev') prevSlide()
}
</script>

<style scoped lang="scss">
@import './styles/index.scss';
</style>
