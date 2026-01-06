<template>
  <div class="slideshow-container">
    <SlideHeader
      :current-slide="currentSlide"
      :total-slides="21"
      :slide-title="currentSlideTitle"
      :slide-titles="slideTitles"
      @navigate="handleNavigation"
      @go-to-slide="goToSlide"
    />
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
import Slide6 from './slides/Slide6.vue'
import Slide7 from './slides/Slide7.vue'
import Slide8 from './slides/Slide8.vue'
import Slide9 from './slides/Slide9.vue'
import Slide10 from './slides/Slide10.vue'
import Slide11 from './slides/Slide11.vue'
import Slide12 from './slides/Slide12.vue'
import Slide13 from './slides/Slide13.vue'
import Slide14 from './slides/Slide14.vue'
import Slide15 from './slides/Slide15.vue'
import Slide16 from './slides/Slide16.vue'
import Slide17 from './slides/Slide17.vue'
import Slide18 from './slides/Slide18.vue'
import Slide19 from './slides/Slide19.vue'
import Slide20 from './slides/Slide20.vue'
import Slide21 from './slides/Slide21.vue'

const { currentSlide, nextSlide, prevSlide, goToSlide } = useSlideNavigation(21)

const slideComponents = {
  1: Slide1, 2: Slide2, 3: Slide3, 4: Slide4, 5: Slide5, 6: Slide6, 7: Slide7, 8: Slide8,
  9: Slide9, 10: Slide10, 11: Slide11, 12: Slide12, 13: Slide13, 14: Slide14, 15: Slide15,
  16: Slide16, 17: Slide17, 18: Slide18, 19: Slide19, 20: Slide20, 21: Slide21
}

const slideTitles = {
  1: 'Rate plans',
  2: 'Room types',
  3: 'Inventory',
  4: 'Channels',
  5: 'Reconciliation',
  6: 'Channels',
  7: 'Room rates',
  8: 'Special offers',
  9: 'Yield rules',
  10: 'Inventory',
  11: 'Direct booking rates',
  12: 'Promotion codes',
  13: 'Extras',
  14: 'Direct booking plug-ins',
  15: 'Property cancellation settings',
  16: 'Reservations',
  17: 'Check-in reports',
  18: 'Booking performance',
  19: 'Pace',
  20: 'Channels',
  21: 'Opera eXchange Interface'
}

const currentSlideComponent = computed(() => slideComponents[currentSlide.value] || Slide1)
const currentSlideTitle = computed(() => slideTitles[currentSlide.value] || '')

const handleNavigation = (direction) => {
  if (direction === 'next') nextSlide()
  else if (direction === 'prev') prevSlide()
}
</script>

<style scoped lang="scss">
@import './styles/index.scss';
</style>
