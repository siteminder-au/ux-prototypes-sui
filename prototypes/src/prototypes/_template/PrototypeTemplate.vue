<template>
  <div class="prototype-container">
    <h1>New Prototype</h1>
    <p class="intro">Description of your prototype goes here.</p>

    <section class="demo-section">
      <h2>Section Title</h2>
      <div class="component-demo">
        <SmButton type="primary" @click="handleClick">Click Me</SmButton>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import $ from 'jquery'
import SmButton from '@sui/app/components/sm-button/sm-button.vue'
// Import more components as needed

const handleClick = () => {
  console.log('Button clicked!')
}

onMounted(() => {
  // jQuery and other initialization code goes here
  console.log('Prototype mounted')
})
</script>

<style scoped lang="scss">
// Option 1: Import shared styles (includes SUI variables + prototype-specific mixins)
@import '@/shared/styles/variables.scss';  // Imports SUI variables + convenience aliases
@import '@/shared/styles/mixins.scss';     // Prototype-specific mixins

.prototype-container {
  max-width: $container-max-width;
  margin: 0 auto;
  padding: $spacing-md;
}

.intro {
  color: $color-text-muted;
  margin-bottom: $spacing-md;
}

.demo-section {
  margin-bottom: $spacing-lg;
  @include card;

  h2 {
    margin-bottom: $spacing-sm;
    color: $color-text-secondary;
  }
}

h1 {
  color: $color-text-primary;
  margin-bottom: $spacing-sm;
}

.component-demo {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: $spacing-sm;
  align-items: flex-start;

  .sm-button {
    display: inline-flex;
  }
}

// Option 2: Or import from separate file
// @import './styles.scss';
</style>
