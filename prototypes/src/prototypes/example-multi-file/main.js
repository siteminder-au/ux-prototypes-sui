import { createApp } from 'vue'
import ExamplePrototype from './ExamplePrototype.vue'
import SmIcon from '@sui-icons/app/sm-icon.vue'
import '../../main.css'

const app = createApp(ExamplePrototype)
app.component('sm-icon', SmIcon)
app.mount('#app')
