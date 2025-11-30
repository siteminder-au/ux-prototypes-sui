import { createRouter, createWebHistory } from 'vue-router'
import Index from './Index.vue'

// Automatically discover all prototype components
const prototypeModules = import.meta.glob('./prototypes/*/[A-Z]*.vue', { eager: true })

// Build routes from discovered prototypes
const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  }
]

// Add a route for each prototype
for (const path in prototypeModules) {
  const match = path.match(/\.\/prototypes\/([^/]+)\/([^/]+\.vue)$/)
  if (match && match[1] !== '_template') {
    const protoId = match[1]
    const component = prototypeModules[path].default

    routes.push({
      path: `/${protoId}`,
      name: protoId,
      component
    })
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
