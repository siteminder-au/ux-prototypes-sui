// import { RouterLinkStub, Wrapper } from '@vue/test-utils'
import * as path from 'path'
import { createI18n } from 'vue-i18n'
// import { CreateElement } from 'vue'
import { RouteRecordRaw, Router, createMemoryHistory, createRouter } from 'vue-router'

export const suiteName = (file: string) => path.relative(`${__dirname}/../..`, file).split(path.sep).join('#')

// export const mockValidationProvider = (slotContext: any = {}): any => {

//   return {

//     render(createElement: CreateElement) {

//       return createElement(
//         'span',
//         this.$scopedSlots.default({
//           required: false,
//           errors: [],
//           classes: {},
//           ariaInput: {},
//           ariaMsg: {},
//           ...slotContext,
//         }),
//       )

//     },

//   }

// }

// export const createRouterLinkStub = ({
//   isActive = false,
//   isExactActive = false,
//   navigate = () => { /** */ },
// } = {}) => {
//   return {
//     ...RouterLinkStub,
//     render() {
//       return this.$scopedSlots.default({
//         href: this.to,
//         navigate,
//         isActive,
//         isExactActive,
//       })
//     },
//   }
// }

// Some breaking change after upgrading jest v27+ caused all focus events to not trigger properly anymore.
// This shim function aims to manually dispatch the focus event which was a recommended solution on SO
// see: https://github.com/vuejs/vue-jest/issues/449
// export const shimTriggerFocusEvent = (wrapper: Wrapper<unknown>, el?: Wrapper<unknown>) => {
//   const inputElement = el ?? wrapper.find('input')
//   return inputElement.element.dispatchEvent(new Event('focus'))
// }

export const vtlMocks = {
  // Already configured in setup-after-env
  // // Grab the actual English translations
  // $t: (key: string, values: unknown[]) => {
  //   // Get i18n instance from setup-after-env.js
  //   const { i18n } = useI18n()
  //   return i18n.t(key, values)
  // },
  // $tc: (key: string, choice: number, values: unknown[]) => {
  //   // Get i18n instance from setup-after-env.js
  //   const { i18n } = useI18n()
  //   return i18n.tc(key, choice, values)
  // },
}

/**
 * This utility function allows you to attach a real vue-router in your VTL test
 *
 * If you are testing a component that depends on the route/router data, ensure you
 * have set a valid 'name' and appropriate 'params'/'query' props.
 */
export const createTestRouter = (_routerOptions?: unknown): Router => {
  const Properties = {
    template: `
      <div>
        <span>This is the Properties page</span>
      </div>
    `,
  }

  const Distribution = {
    template: `
      <div>
        <span>This is the Distribution page</span>
      </div>
    `,
  }

  const routes = [
    {
      path: '/',
      redirect: '/test',
    },
    {
      path: '/test',
      name: 'test',
      component: Properties,
    },
    {
      path: '/test2',
      name: 'test2',
      component: Distribution,
    },
    {
      // https://router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes
      // always prefer having trailing * to ensure we can navigate to the route by `name` prop
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: Properties,
    },
    // add more routes here if your test wants to test some other paths
    // not listed in this array
  ] as RouteRecordRaw[]

  // see: https://test-utils.vuejs.org/guide/advanced/vue-router.html#Using-a-Real-Router
  const router = createRouter({
    // abstract -> createMemoryHistory() to avoid bleeding between VTL tests
    // see: https://router.vuejs.org/guide/migration/#New-history-option-to-replace-mode
    history: createMemoryHistory(),
    routes,
  })

  return router
}

// see: https://github.com/testing-library/vue-testing-library/blob/main/src/__tests__/translations-vue-i18n.js
export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
})
