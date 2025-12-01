import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import globalComponents from './plugins/global-components'
import './shared/styles/reset.scss'
import 'vue-multiselect/dist/vue-multiselect.css'

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
