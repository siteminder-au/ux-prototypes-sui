import { createApp } from 'vue'
import App from './App.vue'
import SmIcon from '@sui-icons/app/sm-icon.vue'

const app = createApp(App)

// Register sm-icon globally so sm-button can use it
app.component('sm-icon', SmIcon)

app.mount('#app')
