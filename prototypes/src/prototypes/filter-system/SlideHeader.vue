<template>
  <div class="header-wrapper">
    <div class="page-header">
      <div class="page-header-content">
        <button @click="goBack" class="back-button" title="Back to prototypes">
          ← Back
        </button>
        <h1 class="page-title">SM filter system</h1>
        <button @click="showReadme = !showReadme" class="readme-toggle">
          {{ showReadme ? '▼' : '▶' }} Read me
        </button>
      </div>
      <template v-if="showReadme">
        <!-- EDITABLE CONTENT BELOW -->
        <p>
          This prototype demonstrates the SiteMinder unified filter system component patterns. The filter system consolidates 26+ different filter implementations across SiteMinder into a unified design system.
        </p>
        <p>The slides below show the system applied to various filter patterns with responsive behavior. These serve as examples of how the unified filter system works across different contexts.</p>
        <p>Press tilda key ~ on your keyboard to see available settings.</p>
        <!-- EDIT THE TEXT ABOVE AS NEEDED -->
      </template>
    </div>

    <header class="slide-header">
      <h1 class="slide-title">{{ slideTitle }}</h1>

      <div class="nav-section">
        <button class="nav-button" :disabled="isFirstSlide" @click="$emit('navigate', 'prev')">
          ← Previous
        </button>

        <select class="slide-select" :value="currentSlide" @change="$emit('goToSlide', parseInt($event.target.value))">
          <option v-for="(title, slideNum) in slideTitles" :key="slideNum" :value="slideNum">
            {{ title }}
          </option>
        </select>

        <button class="nav-button" :disabled="isLastSlide" @click="$emit('navigate', 'next')">
          Next →
        </button>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  currentSlide: Number,
  totalSlides: Number,
  slideTitle: String,
  slideTitles: Object,
  isFirstSlide: Boolean,
  isLastSlide: Boolean
})

defineEmits(['navigate', 'goToSlide'])

const router = useRouter()
const showReadme = ref(false)

const goBack = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.page-header {
  background: #f8f8f8;
  padding: 12px 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: 'WORK IN PROGRESS';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-20deg);
    font-size: 48px;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.05);
    text-transform: uppercase;
    letter-spacing: 6px;
    pointer-events: none;
    white-space: nowrap;
    z-index: 0;
  }

  p {
    margin: 12px 0 0 0;
    font-size: 14px;
    line-height: 1.5;
    color: #555;
    position: relative;
    z-index: 1;

    &:first-of-type {
      margin-top: 12px;
    }

    &:last-of-type {
      margin-bottom: 10px;
    }

    a {
      color: #4A90E2;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.page-header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.back-button {
  background: none;
  border: none;
  color: #333;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #4A90E2;
  }
}

.page-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.readme-toggle {
  background: none;
  border: none;
  color: #4A90E2;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(74, 144, 226, 0.1);
  }
}

.slide-header {
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 0;
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
