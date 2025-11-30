import vueRouter from 'storybook-vue3-router'
import { ref } from 'vue'
import SmBanner from '../sm-banner.vue'
import SmButton from '../../sm-button/sm-button.vue'
import { SmAppHeader } from '../../sm-app-header'
import { SmHorizontalNav, SmHorizontalNavItem } from '../../sm-horizontal-nav'
import defaultExample from './images/banner-default.png'
import themedExample from './images/banner-themed.png'

const EmptyComponent = () => ({
  template: '<div>Home</div>',
})
EmptyComponent.displayName = 'EmptyComponent'

export default {
  title: 'Components/Banner',
  component: SmBanner,
  decorators: [
    // See: https://corechasm.com/addons/storybook-vue3-router
    // Match all routes so we can test the active state of the nav items
    // we also need to resolve storybook-vue3-router in .storybook/main.cjs file
    vueRouter([{
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: EmptyComponent,
    }]),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Banners display important, succinct product or system-level messages and provide optional actions for users. <br/>They are used to inform users of site-wide issues or display warnings or errors that will directly impact the user\'s ability to complete certain tasks. Prominent, medium-high priority.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Au1waCRAR4SpFvIgEMASgf/sui-documentation?node-id=12%3A159430&t=hCpfPUmCPPZSF5zx-0',
    },
  },
}

export const Variants = () => ({
  components: { SmBanner },
  setup: () => {
    const isVisible = ref(true)
    const isVisible1 = ref(true)
    const isVisible2 = ref(true)
    const isVisible3 = ref(true)

    const handleBeforeClose = (closeCallback: () => void, payload?: string) => {
      console.info('before close: ', payload)
      // do something ...
      closeCallback()
    }

    return { isVisible, isVisible1, isVisible2, isVisible3, handleBeforeClose }
  },
  template: `
    <div>
      <span class="sui-storybook-header">With icon</span>
      <!-- Vue3 syntax requires v-model:visible rather than visible.sync -->
      <sm-banner title="Info" type="info" v-model:visible="isVisible" showClose :before-close="handleBeforeClose" />

      <br/>

      <sm-banner title="Success" type="success" v-model:visible="isVisible1" showClose :before-close="handleBeforeClose" />

      <br/>

      <sm-banner title="Alert" type="alert" v-model:visible="isVisible2" showClose :before-close="($event) => handleBeforeClose($event, 'alert custom payload')" />

      <br/>

      <sm-banner title="Warning" type="warning" v-model:visible="isVisible3" showClose :before-close="($event) => handleBeforeClose($event, 'warning custom payload')" />

      <br/><br/>

      <span class="sui-storybook-header">Without icon</span>
      <sm-banner type="info" title="Info" :visible="true">
        <template v-slot:action>
          <sm-button type="tertiary">Button</sm-button>
        </template>
      </sm-banner>

      <br/>

      <sm-banner type="success" title="Success" :showIcon="false" :visible="true">
        <template v-slot:action>
          <sm-button type="tertiary">Button</sm-button>
        </template>
      </sm-banner>

      <br/>

      <sm-banner type="alert" title="Alert" :showIcon="false" :visible="true">
        <template v-slot:action>
          <sm-button type="tertiary">Button</sm-button>
        </template>
      </sm-banner>

      <br/>

      <sm-banner type="warning" title="Warning" :showIcon="false" :visible="true">
        <template v-slot:action>
          <sm-button type="tertiary">Button</sm-button>
        </template>
      </sm-banner>

      <br/><br/>

      <span class="sui-storybook-header">Text alignment</span>
      <sm-banner type="info" title="Message goes here" text-align="start" :visible="true">
        <template v-slot:action>
          <sm-button type="tertiary">Button</sm-button>
        </template>
      </sm-banner>

      <br/>

      <sm-banner type="success" title="Message goes here" :visible="true">
        <template v-slot:action>
          <sm-button type="tertiary">Button</sm-button>
        </template>
      </sm-banner>
    </div>
  `,
})

export const CustomContent = () => ({
  components: { SmBanner, SmButton },
  setup: () => {
    const isVisible1 = ref(true)
    const isVisible2 = ref(true)
    const isVisible3 = ref(true)
    const isVisible4 = ref(true)
    const isVisible5 = ref(true)
    const isVisible6 = ref(true)
    const isVisible7 = ref(true)
    const isVisible8 = ref(true)

    const close = () => {
      console.info('close')
    }

    return {
      isVisible1,
      isVisible2,
      isVisible3,
      isVisible4,
      isVisible5,
      isVisible6,
      isVisible7,
      isVisible8,
      close,
    }
  },
  template: `
    <div>
      <span class="sui-storybook-header">Default slot</span>
      <!-- Vue3 syntax requires v-model:visible rather than visible.sync -->
      <sm-banner type="info" v-model:visible="isVisible1">
        <template v-slot:default>
          <span style="font-weight:600; margin:0px 8px;">Info message here</span>
          <sm-button type="tertiary">Button</sm-button>
        </template>
      </sm-banner>

      <br/>

      <sm-banner type="success" v-model:visible="isVisible2">
        <template v-slot:default>
          <span style="font-weight:600; margin:0px 8px;">Success message here</span>
          <sm-button type="tertiary">Button</sm-button>
        </template>
      </sm-banner>

      <br/>

      <sm-banner type="alert" v-model:visible="isVisible3">
        <template v-slot:default>
          <span style="font-weight:600; margin:0px 8px;">Alert message here</span>
          <sm-button type="tertiary">Button</sm-button>
        </template>
      </sm-banner>

      <br/>

      <sm-banner type="warning" v-model:visible="isVisible4">
        <template v-slot:default>
          <span style="font-weight:600; margin:0px 8px;">Warning message here</span>
          <sm-button type="tertiary">Button</sm-button>
        </template>
      </sm-banner>

      <br/><br/>

      <span class="sui-storybook-header">Action slot</span>

      <sm-banner type="info" title="Info message here" :visible="isVisible5" @close="close">
        <template v-slot:action>
          <sm-button type="tertiary" @click="isVisible5 = false">Close</sm-button>
        </template>
      </sm-banner>

      <br/>

      <sm-banner type="success" title="Success message here" :visible="isVisible6" @close="close">
        <template v-slot:action>
          <sm-button type="tertiary" @click="isVisible6 = false">Close</sm-button>
        </template>
      </sm-banner>

      <br/>

      <sm-banner type="alert" title="Alert message here" :visible="isVisible7" @close="close">
        <template v-slot:action>
          <sm-button type="tertiary" @click="isVisible7 = false">Close</sm-button>
        </template>
      </sm-banner>

      <br/>

      <sm-banner type="warning" title="Warning message here" :visible="isVisible8" @close="close">
        <template v-slot:action>
          <sm-button type="tertiary" @click="isVisible8 = false">Close</sm-button>
        </template>
      </sm-banner>
    </div>
  `,
})

CustomContent.storyName = 'Custom content'

export const Example = () => ({
  components: {
    SmAppHeader,
    SmHorizontalNav,
    SmHorizontalNavItem,
  },
  setup: () => {
    const isVisible = ref(true)

    return {
      isVisible,
    }
  },
  template: `
    <article>
      <sm-app-header
        logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
        logo-link="https://www.siteminder.com"
        partner-name="SiteMinder">

        <template v-slot:nav>
          <sm-horizontal-nav>
            <sm-horizontal-nav-item to="/rooms-and-rates" label="Rooms & Rates" />
            <sm-horizontal-nav-item to="/distribution" label="Distributions" />
          </sm-horizontal-nav>
        </template>
      </sm-app-header>

      <sm-banner type="alert" v-model:visible="isVisible" showClose title="Your PMS connection is now ready for setup">
        <template v-slot:action>
          <sm-button type="tertiary">Button</sm-button>
        </template>
      </sm-banner>

      <div class="flex">
        <sm-aside sticky> </sm-aside>
      </div>
    </article>
  `,
})

const exampleDescription = `
  Use banners under the navigation, at the top of the main content. Banners animate into a
  screen by pushing the entire content below down. <br/> It should appear one at a time, not dismissible,
  and only disappear when no longer required. <br/>Banners persist until dismissed by the user, or remain until the
  state that caused the banner is resolved. <br/>Avoid stacking multiple banners.
`
Example.parameters = {
  docs: {
    description: {
      story: exampleDescription,
    },
  },
}

export const StylingHooks = () => ({
  setup: () => {
    const defaultImage = defaultExample
    const themedImage = themedExample

    return {
      defaultImage,
      themedImage,
    }
  },
  template: `
    <div>
      <h3>Styling hooks</h3>
      <p>Styling hooks will enable customization for your components. Styling hooks are constructed using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">CSS custom properties</a>.</p>

      <p>Below is an example of the SUI banner and the brand banner using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 400px; height: auto; min-width: 0"
          alt="Banner default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 400px; height: auto; min-width: 0"
          alt="Banner themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the banner customization variables, followed by <a href="/?path=/docs/guides-theming--styling-hooks#theme-categories">theme categories</a> and <a href="/?path=/docs/guides-theming--styling-hooks#naming-conventions">naming convention</a></p>

      <sm-table>
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Properties </sm-table-th>
            <sm-table-th> Category</sm-table-th>
            <sm-table-th class="w-1/2 small-desktop:w-3/5"> Styling Hooks</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>

        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Container</sm-table-td>
            <sm-table-td>
              border-radius
              <br/>
              min-height
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-banner-border-radius<br/>
                --sm-c-banner-min-height<br/>
                --sm-c-banner-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Title</sm-table-td>
            <sm-table-td>
              margin
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-banner-title-margin
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Icon</sm-table-td>
            <sm-table-td>
              width
              <br/>
              height
              <br/>
              size
              <br/>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-banner-icon-width<br/>
                --sm-c-banner-icon-height<br/>
                --sm-c-banner-icon-size
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Type</sm-table-td>
            <sm-table-td>
              info (default) <br/>
              success <br/>
              alert <br/>
              warning <br/>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-banner-color-text-#{$type}<br/>
                --sm-c-banner-color-background-#{$type}<br/>
                --sm-c-banner-close-color-text-#{$type}
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>
    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
StylingHooks.parameters = {
  design: null,
}
