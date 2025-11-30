import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import globalComponents from './plugins/global-components'
import './shared/styles/reset.scss'

const app = createApp(App)

// Register commonly-used components globally for prototyping convenience
app.use(globalComponents)
app.use(router)
app.mount('#app')
