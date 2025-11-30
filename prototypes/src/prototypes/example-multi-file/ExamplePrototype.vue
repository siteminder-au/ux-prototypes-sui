<template>
  <div class="prototype-container">
    <h1>Multi-File Prototype Example</h1>
    <p class="intro">This demonstrates breaking a prototype into multiple component files.</p>

    <HeaderSection />
    <ContentSection @button-clicked="handleClick" />

    <section class="demo-section">
      <h2>Click Count</h2>
      <SmBadge size="medium">{{ clickCount }} total clicks</SmBadge>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HeaderSection from './HeaderSection.vue'
import ContentSection from './ContentSection.vue'
// Note: SmBadge is globally registered - no need to import!

const clickCount = ref(0)

const handleClick = () => {
  clickCount.value++
  console.log('Click handled in parent:', clickCount.value)
}
</script>

<style scoped>
.prototype-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.intro {
  color: #666;
  margin-bottom: 2rem;
}

.demo-section {
  margin-bottom: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
</style>
