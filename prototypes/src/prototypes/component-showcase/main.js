import { createApp } from 'vue'
import ComponentShowcase from './ComponentShowcase.vue'
import SmIcon from '@sui-icons/app/sm-icon.vue'
import '../../main.css'

const app = createApp(ComponentShowcase)
app.component('sm-icon', SmIcon)
app.mount('#app')
