// import { i18n } from '@/services/i18n'

import { Router, createMemoryHistory, createRouter } from 'vue-router'
import routes from './router/routes'

export const defaultRouterParams = {
  partnerCode: 'some-partner-code',
  enterpriseCode: 'some-enterprise-code',
}

/**
 * This utility function allows you to attach a real vue-router in your VTL test
 *
 * If you are testing a component that depends on the route/router data, ensure you
 * have set a valid 'name' and appropriate 'params'/'query' props.
 */
export const createTestRouter = (_routerOptions?: unknown): Router => {
  // see: https://test-utils.vuejs.org/guide/advanced/vue-router.html#Using-a-Real-Router
  const router = createRouter({
    // abstract -> createMemoryHistory() to avoid bleeding between VTL tests
    // see: https://router.vuejs.org/guide/migration/#New-history-option-to-replace-mode
    history: createMemoryHistory(),
    routes,
  })

  return router
}
