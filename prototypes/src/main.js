import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import globalComponents from './plugins/global-components'
import './shared/styles/reset.scss'
import './shared/styles/form-utilities.scss'
import './shared/styles/sui-overrides.scss'
import 'vue-multiselect/dist/vue-multiselect.css'
import 'floating-vue/dist/style.css'
// Import SUI core styles (CSS variables and global styles)
import 'sui-vue3/libs/sui-core/src/app/common/sui-core.scss'
// Import SUI base typography styles
import 'sui-vue3/libs/sui-core/src/app/common/typography/base.scss'

// Configure vee-validate rules
import { defineRule, configure } from 'vee-validate'
import { required, email, min, max, min_value, max_value, numeric } from '@vee-validate/rules'

defineRule('required', required)
defineRule('email', email)
defineRule('min', min)
defineRule('max', max)
defineRule('min_value', min_value)
defineRule('max_value', max_value)
defineRule('numeric', numeric)

// Configure validation - keep it simple and non-intrusive
configure({
  generateMessage: () => 'This field is required',
  validateOnBlur: false,
  validateOnChange: false,
  validateOnInput: false,
  validateOnModelUpdate: false,
})

// Set up SUI i18n
import { setup as setupSuiI18n } from '../node_modules/sui-vue3/libs/sui-core/src/app/libs/vue-i18n'

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {}
  }
})

// Register SUI translations
setupSuiI18n(i18n)

const app = createApp(App)

// Register commonly-used components globally for prototyping convenience
app.use(i18n)
app.use(globalComponents)
app.use(router)
app.mount('#app')
