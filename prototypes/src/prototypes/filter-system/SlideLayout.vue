<template>
  <div class="slideshow-container">
    <SlideHeader
      :current-slide="currentSlide"
      :total-slides="8"
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

const { currentSlide, nextSlide, prevSlide, goToSlide } = useSlideNavigation(8)

const slideComponents = { 1: Slide1, 2: Slide2, 3: Slide3, 4: Slide4, 5: Slide5, 6: Slide6, 7: Slide7, 8: Slide8 }
const slideTitles = { 1: 'Rate plans', 2: 'Room types', 3: 'Inventory', 4: 'Channels', 5: 'Reconciliation', 6: 'Channels', 7: 'Room rates', 8: 'Special offers' }

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
