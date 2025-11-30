import Vue from 'vue'
import Router from 'vue-router'

import routes from './routes'
// import guards from './guards'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes,
})

// guards.beforeEach.forEach(guard => router.beforeEach(guard))
// guards.afterEach.forEach(guard => router.afterEach(guard))

router.onError((error) => {
  console.error('router on error', error)
})

export { router }
