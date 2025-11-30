import Router from 'vue-router'
import routes from '@/router/routes'

export const defaultRouterParams = {
  partnerCode: 'some-partner-code',
  enterpriseCode: 'some-enterprise-code',
}

/**
 * This utility function allows you to attach a real vue-router in your VTL test
 *
 * If you are testing a component that depends on the route/router data, ensure you
 * have set a valid 'name' and appropriate 'params'/'query' props.
 *
 * To find what 'name' to use, consult the routes files. For example:
 * frontends/enterprise/src/router/routes/properties/index.ts
 *
 * So, if your component is rendered in the properties list page,
 * then make sure you pass in { name: 'properties-list' } in the router options.
 */
export const createTestRouter = (): Router => {
  // Replaced with createRouter() in vue3
  // see: https://test-utils.vuejs.org/guide/advanced/vue-router.html#using-a-mocked-router-with-composition-api
  const router = new Router({
    mode: 'history',
    routes,
  })

  // NOTE: this test router does not have any guards attached
  // like in frontends/enterprise/src/router/index.ts
  // see frontends/enterprise/src/composables/use-tabs.spec.ts
  // as an example on how to manually attach your own router guards in a VTL test
  return router
}
