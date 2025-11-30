import '@testing-library/jest-dom'
import { configure } from '@testing-library/vue'
import SuiIcons from '@siteminder/sui-icons'
import SuiCore from '@siteminder/sui-core'
import * as ResizeObserverModule from 'resize-observer-polyfill'
import Vue, { configureCompat } from 'vue'
import { i18n } from '../src/services/i18n'

// JSDom (which is used by jest) does not implement layout/rendering
// sm-date-picker > v-calendar@3 has a dependency on ResizeObserver so we need to polyfill it
// Doing this globally so we don't need to import it in every test file with
// the sm-date-picker component. Alternatively, you could just mock the window.ResizeObserver
// without installing this extra dev dependency.
global.ResizeObserver = ResizeObserverModule.default

/**
 * We indicate that vue jest tests are fully vue3 compatible
 */
configureCompat({
  MODE: 3,
  // Suppress in tests so it's easier to debug test failures
  ATTR_FALSE_VALUE: 'suppress-warning',
})

Vue.use(SuiCore, { i18n })
Vue.use(SuiIcons)

Vue.config.productionTip = false

configure({
  // there are some tests that require longer than the default timeout of 1 sec
  // when searching for an element to appear in the DOM
  // this setting is just a DX improvement so developers don't need to manually
  // override the timeout in their individual VTL tests
  asyncUtilTimeout: 30000,
  // Let's sync the test-id to what we use in the codebase, this makes the VTL
  // search for our own test-ids when `getByTestId` is called
  testIdAttribute: 'data-sm-test-id', // Default is 'data-testid'
})
