import './common'
import * as components from './components'
import { setup as setupVeeValidate } from './libs/vee-validate'
import { setup as setupVueI18n } from './libs/vue-i18n'
import { COMPONENT_NAMES } from './component-names'

const Sui = {
  install: (Vue: any, options: any) => {

    if (!options?.i18n) {
      throw new Error('SuiCore initialised without a VueI18n instance')
    }

    setupVueI18n(options.i18n)
    setupVeeValidate()

    // Register all components globally
    Object.keys(components)
      .filter(component => COMPONENT_NAMES[component]) // exclude any exported types
      .forEach(component => Vue.component(COMPONENT_NAMES[component], components[component as keyof typeof components]))

  },
}

export default Sui
export * from './directives'
export * from './services'
export * from './components'
