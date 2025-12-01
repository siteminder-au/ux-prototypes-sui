<template>
  <header class="slide-header">
    <h1 class="slide-title">{{ slideTitle }}</h1>

    <div class="nav-section">
      <button
        class="nav-button"
        :disabled="isFirstSlide"
        @click="$emit('navigate', 'prev')"
      >
        ← Previous
      </button>

      <select
        class="slide-select"
        :value="currentSlide"
        @change="$emit('goToSlide', parseInt($event.target.value))"
      >
        <option
          v-for="(title, slideNum) in slideTitles"
          :key="slideNum"
          :value="slideNum"
        >
          {{ title }}
        </option>
      </select>

      <button
        class="nav-button"
        :disabled="isLastSlide"
        @click="$emit('navigate', 'next')"
      >
        Next →
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  currentSlide: Number,
  totalSlides: Number,
  slideTitle: String,
  slideTitles: Object,
  isFirstSlide: Boolean,
  isLastSlide: Boolean
})

defineEmits(['navigate', 'goToSlide'])
</script>

<style scoped lang="scss">
.slide-header {
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.slide-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.nav-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.slide-select {
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 200px;

  &:hover {
    background: #f5f5f5;
    border-color: #999;
  }

  &:focus {
    outline: none;
    border-color: #4A90E2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
  }
}

.nav-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f5f5f5;
    border-color: #999;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
</style>
