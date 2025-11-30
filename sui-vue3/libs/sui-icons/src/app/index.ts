import { PluginObject } from 'vue'
import SmIcon from './sm-icon.vue'

const SuiIcons: PluginObject<never> = {
  install: (Vue) => {

    Vue.component('sm-icon', SmIcon)

  },
}

export default SuiIcons

export { SmIcon }
