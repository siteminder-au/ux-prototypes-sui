<template>
  <div class="prototype-container">
    <h1>Vue 3 Prototypes with SUI Components</h1>
    <p class="intro">This uses the sui-vue3 library natively in a Vue app - the way it was designed to be used.</p>

    <section class="demo-section">
      <h2>Buttons</h2>
      <div class="component-demo">
        <SmButton type="primary">Primary Button</SmButton>
        <SmButton type="secondary">Secondary Button</SmButton>
        <SmButton type="danger">Danger Button</SmButton>
        <SmButton :disabled="true">Disabled Button</SmButton>
      </div>
    </section>

    <section class="demo-section">
      <h2>Badges</h2>
      <div class="component-demo">
        <SmBadge size="medium">Default Badge</SmBadge>
        <SmBadge size="medium" type="success">Success</SmBadge>
        <SmBadge size="medium" type="warning">Warning</SmBadge>
        <SmBadge size="medium" type="info">Info</SmBadge>
      </div>
    </section>

    <section class="demo-section">
      <h2>Button Sizes</h2>
      <div class="component-demo">
        <SmButton size="small" type="primary">Small</SmButton>
        <SmButton type="primary">Medium</SmButton>
        <SmButton size="large" type="primary">Large</SmButton>
      </div>
    </section>

    <section class="demo-section">
      <h2>Cards</h2>
      <div class="component-demo">
        <SmCard>
          <SmCardContent>
            <h3>Card Title</h3>
            <p>This is a card using native Vue components.</p>
          </SmCardContent>
        </SmCard>
      </div>
    </section>

    <section class="demo-section">
      <h2>Interactive Demo</h2>
      <div class="component-demo">
        <SmButton type="primary" @click="incrementCounter">Click me!</SmButton>
        <SmBadge>{{ clickCount }} clicks</SmBadge>
      </div>
    </section>

    <section class="demo-section">
      <h2>jQuery Demo</h2>
      <div class="component-demo">
        <button class="jquery-button">jQuery Button</button>
        <div class="jquery-message" style="display: none; margin-top: 10px; padding: 10px; background: #e3f2fd; border-radius: 4px;">
          You clicked the jQuery button!
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import $ from 'jquery'
import SmButton from '@sui/app/components/sm-button/sm-button.vue'
import SmBadge from '@sui/app/components/sm-badge/sm-badge.vue'
import SmCard from '@sui/app/components/sm-card/sm-card.vue'
import SmCardContent from '@sui/app/components/sm-card/sm-card-content.vue'

const clickCount = ref(0)

const incrementCounter = () => {
        console.log('Button clicked!')
  clickCount.value++
}

// Example jQuery usage in Vue lifecycle
onMounted(() => {
  // jQuery is available here
  console.log('jQuery version:', $.fn.jquery)

  // jQuery button click handler
  $('.jquery-button').on('click', function() {
    $('.jquery-message').slideToggle(300)
    $(this).toggleClass('clicked')
  })
})
</script>

<style scoped>
.prototype-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
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

h1 {
  color: #333;
  margin-bottom: 1rem;
}

h2 {
  margin-bottom: 1rem;
  color: #555;
}

.component-demo {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 1rem;
  align-items: flex-start;
}

/* Fix for button display issue when used in flex containers */
.component-demo .sm-button {
  display: inline-flex;
}

/* jQuery button styles */
.jquery-button {
  padding: 10px 20px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.jquery-button:hover {
  background: #1976D2;
}

.jquery-button.clicked {
  background: #4CAF50;
}
</style>
