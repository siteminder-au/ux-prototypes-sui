import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export function useSlideNavigation(totalSlides = 5) {
  const router = useRouter()
  const route = useRoute()

  const currentSlide = computed(() =>
    parseInt(route.params.slideNumber) || 1
  )

  const isFirstSlide = computed(() => currentSlide.value === 1)
  const isLastSlide = computed(() => currentSlide.value === totalSlides)

  const goToSlide = (slideNumber) => {
    if (slideNumber >= 1 && slideNumber <= totalSlides) {
      router.push(`/form-system/${slideNumber}`)
    }
  }

  const nextSlide = () => {
    if (!isLastSlide.value) {
      goToSlide(currentSlide.value + 1)
    }
  }

  const prevSlide = () => {
    if (!isFirstSlide.value) {
      goToSlide(currentSlide.value - 1)
    }
  }

  return {
    currentSlide,
    isFirstSlide,
    isLastSlide,
    goToSlide,
    nextSlide,
    prevSlide
  }
}
