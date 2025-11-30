// import Vue from 'vue'
// import Router from 'vue-router'
import { createRouter, createWebHistory, RouterView, RouterLink } from 'vue-router'

import routes from './routes'
// import guards from './guards'

// Vue.use(Router)

// const router = new Router({
//   mode: 'history',
//   routes,
// })

// add compatConfig
// see: https://github.com/vuejs/router/issues/1315
(RouterView as unknown as { compatConfig: Record<string, unknown> }).compatConfig = { MODE: 3 }
;(RouterLink as unknown as { compatConfig: Record<string, unknown> }).compatConfig = {
  MODE: 3,
  // we suppress ATTR_FALSE_VALUE as we want to keep
  // `aria-expanded` attribute attached even if the value of it is false
  // in vue2, aria-expanded was removed if the value was false.
  ATTR_FALSE_VALUE: 'suppress-warning',
}

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// guards.beforeEach.forEach(guard => router.beforeEach(guard))
// guards.afterEach.forEach(guard => router.afterEach(guard))

router.onError((error) => {
  console.error('router on error', error)
})

export { router }
