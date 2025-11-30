import '@testing-library/jest-dom'
import { i18n } from './utils'
// import { config as VueTestUtilsConfig } from '@vue/test-utils'
// import Vue from 'vue'
// import VueI18n from 'vue-i18n'
import { setup as setupVueI18n } from '../src/app/libs/vue-i18n'
// import SuiIcons from '@siteminder/sui-icons'
import { config } from '@vue/test-utils'

// export const i18n = createI18n({
//   locale: 'en',
//   fallbackLocale: 'en',
// })
// Vue.use(VueI18n)
// install SuiIcons so we don't have to stub sm-icon in spec files any more

// export const vueApp = createApp({
//     // something vue options here ...
// })
// vueApp.use(SuiIcons)
// app.use(i18n)

// Setup the i18n instance for useI18n provider
setupVueI18n(i18n)

// globally register sm-icons for all VTL tests
// add 'img' role so it is easier to select in tests
config.global.components = { 'sm-icon': { template: '<span role="img" class="sm-icon"/>' } }
