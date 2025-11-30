<template>
  <div class="index">
    <div class="index-container">
      <h1 class="index-title">SUI Prototypes</h1>
      <p class="index-description">Select a prototype to view:</p>

      <div class="prototype-grid">
        <router-link
          v-for="proto in prototypes"
          :key="proto.id"
          :to="`/${proto.id}`"
          class="prototype-card"
        >
          <h2>{{ proto.name }}</h2>
          <p>{{ proto.description }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Automatically discover all prototype metadata
const prototypeModules = import.meta.glob('./prototypes/*/index.js', { eager: true })

// Transform discovered modules into prototype metadata
const prototypes = computed(() => {
  const protos = []

  for (const path in prototypeModules) {
    const module = prototypeModules[path]
    const match = path.match(/\.\/prototypes\/([^/]+)\/index\.js/)

    if (match && match[1] !== '_template') {
      const id = match[1]
      protos.push({
        id,
        name: module.name || formatName(id),
        description: module.description || 'No description provided'
      })
    }
  }

  return protos.sort((a, b) => a.name.localeCompare(b.name))
})

// Format folder name to title case
function formatName(id) {
  return id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<style scoped>
.index {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.index-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.index-title {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  color: #333;
  font-weight: 600;
}

.index-description {
  margin: 0 0 2rem 0;
  font-size: 1.1rem;
  color: #666;
}

.prototype-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.prototype-card {
  padding: 2rem;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  cursor: pointer;
}

.prototype-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #2196F3;
  background: white;
}

.prototype-card h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #333;
}

.prototype-card p {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
}
</style>
