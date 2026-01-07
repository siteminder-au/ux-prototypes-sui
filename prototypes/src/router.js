import { createRouter, createWebHistory } from 'vue-router'
import Index from './Index.vue'

// Import your prototypes
import ComponentShowcase from './prototypes/component-showcase/ComponentShowcase.vue'
import Forms from './prototypes/forms/FormSystem.vue'
import FormsSlideLayout from './prototypes/forms/SlideLayout.vue'
import Filters from './prototypes/filters/FilterSystem.vue'
import FiltersSlideLayout from './prototypes/filters/SlideLayout.vue'

// Define routes - add new prototypes here!
const routes = [
  { path: '/', component: Index },
  { path: '/component-showcase', component: ComponentShowcase },
  {
    path: '/forms',
    component: Forms,
    children: [
      {
        path: '',
        redirect: '/forms/1'
      },
      {
        path: ':slideNumber',
        name: 'forms-slide',
        component: FormsSlideLayout,
        props: true,
        beforeEnter: (to, from, next) => {
          const slideNum = parseInt(to.params.slideNumber)
          if (slideNum >= 1 && slideNum <= 5) {
            next()
          } else {
            next('/forms/1')
          }
        }
      }
    ]
  },
  {
    path: '/filters',
    component: Filters,
    children: [
      {
        path: '',
        redirect: '/filters/1?slide=1'
      },
      {
        path: ':slideNumber',
        name: 'filters-slide',
        component: FiltersSlideLayout,
        props: true,
        beforeEnter: (to, from, next) => {
          const slideNum = parseInt(to.params.slideNumber)
          if (slideNum >= 1 && slideNum <= 21) {
            next()
          } else {
            next('/filters/1?slide=1')
          }
        }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
