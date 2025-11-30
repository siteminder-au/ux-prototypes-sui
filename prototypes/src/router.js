import { createRouter, createWebHistory } from 'vue-router'
import Index from './Index.vue'

// Import your prototypes
import ComponentShowcase from './prototypes/component-showcase/ComponentShowcase.vue'
import ExamplePrototype from './prototypes/example-multi-file/ExamplePrototype.vue'

// Define routes - add new prototypes here!
const routes = [
  { path: '/', component: Index },
  { path: '/component-showcase', component: ComponentShowcase },
  { path: '/example-multi-file', component: ExamplePrototype },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
