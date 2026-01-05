import { createRouter, createWebHistory } from 'vue-router'
import Index from './Index.vue'

// Import your prototypes
import ComponentShowcase from './prototypes/component-showcase/ComponentShowcase.vue'
import FormSystem from './prototypes/form-system/FormSystem.vue'
import FormSystemSlideLayout from './prototypes/form-system/SlideLayout.vue'
import FilterSystem from './prototypes/filter-system/FilterSystem.vue'
import FilterSystemSlideLayout from './prototypes/filter-system/SlideLayout.vue'

// Define routes - add new prototypes here!
const routes = [
  { path: '/', component: Index },
  { path: '/component-showcase', component: ComponentShowcase },
  {
    path: '/form-system',
    component: FormSystem,
    children: [
      {
        path: '',
        redirect: '/form-system/1'
      },
      {
        path: ':slideNumber',
        name: 'form-system-slide',
        component: FormSystemSlideLayout,
        props: true,
        beforeEnter: (to, from, next) => {
          const slideNum = parseInt(to.params.slideNumber)
          if (slideNum >= 1 && slideNum <= 5) {
            next()
          } else {
            next('/form-system/1')
          }
        }
      }
    ]
  },
  {
    path: '/filter-system',
    component: FilterSystem,
    children: [
      {
        path: '',
        redirect: '/filter-system/1'
      },
      {
        path: ':slideNumber',
        name: 'filter-system-slide',
        component: FilterSystemSlideLayout,
        props: true,
        beforeEnter: (to, from, next) => {
          const slideNum = parseInt(to.params.slideNumber)
          if (slideNum >= 1 && slideNum <= 7) {
            next()
          } else {
            next('/filter-system/1')
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
