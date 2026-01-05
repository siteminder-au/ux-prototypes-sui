<template>
  <div class="slideshow-container">
    <SlideHeader
      :current-slide="currentSlide"
      :total-slides="1"
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

const { currentSlide, nextSlide, prevSlide, goToSlide } = useSlideNavigation(1)

const slideComponents = { 1: Slide1 }
const slideTitles = { 1: 'Rate plans' }

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
