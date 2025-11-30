import { configure } from '@testing-library/dom'
import JestDom from '@testing-library/jest-dom'

import SuiIcons from '@siteminder/sui-icons'
import SuiCore from '@siteminder/sui-core'
import { config as VueTestUtilsConfig } from '@vue/test-utils'
import Vue from 'vue'
import Router from 'vue-router'

import { i18n } from '@/services/i18n'

Vue.use(Router)
Vue.use(SuiCore, { i18n })
Vue.use(SuiIcons)

Vue.config.productionTip = false

// directives
// v-focus automatically focuses on the DOM element
// suitable for input field elements
Vue.directive('focus', {
  inserted(el) {
    const input = el.querySelector('input')
    if (input) {
      input.focus()
    }
  },
})

// v-select automatically selects all the characters on the DOM element
// suitable for input field elements
Vue.directive('select', {
  inserted(el) {
    const input = el.querySelector('input')
    if (input) {
      input.select()
    }
  },
})

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

// Disables an error message associated with @vue/test-utils & vue-class-component
VueTestUtilsConfig.logModifiedComponents = false

// Mocks the global methods provided by the Vue i18n package
// These have been refactored in Vue3
const i18nMethods = ['$t']
i18nMethods.forEach((methodName) => {
  // Return the English translations
  VueTestUtilsConfig.mocks[methodName] = (key, values) => { return i18n.t(key, values) }
})
