import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import SmIcon from '@sui-icons/app/sm-icon.vue'
import './main.css'

const app = createApp(App)

// Register sm-icon globally so all SUI components can use it
app.component('sm-icon', SmIcon)

app.use(router)
app.mount('#app')
