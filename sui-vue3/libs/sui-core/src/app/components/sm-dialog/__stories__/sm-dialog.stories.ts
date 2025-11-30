import { startCase } from 'lodash-es'
import { ref } from 'vue'
import { dialogService } from '../../../services'
import SmDialog from '../sm-dialog.vue'
import { SmVerticalNav, SmVerticalNavItem } from '../../sm-vertical-nav'
import defaultExample from './images/dialog-default.png'
import themedExample from './images/dialog-themed.png'

export default {
  title: 'Components/Dialog',
  component: SmDialog,
}

export const Standard = () => ({
  components: { SmDialog },
  setup: () => {
    const dialogVisible = ref(true)
    return {
      dialogVisible,
    }
  },
  template: `
    <div>
      <sm-button @click="dialogVisible = true" type="primary">Open dialog</sm-button>

      <sm-dialog v-model:visible="dialogVisible" title="Title here" @close="dialogVisible = false">
        <template v-slot:default>
          <p>You're about to leave this page without saving. Would you like to save first?</p>
        </template>
        <template v-slot:footer>
          <sm-button type="tertiary" @click="dialogVisible = false">Cancel</sm-button>
          <sm-button type="primary" @click="dialogVisible = false">Save</sm-button>
        </template>
      </sm-dialog>
    </div>
  `,
})

const escapeAngleBrackets = (str: string): string => {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
const sampleCode = `
<div>
  <!-- The parent component -->
  <transition name="sm-dialog-transition">
    <router-view />
  </transition>
</div>
`
const standardDescription = `
  Control the visibility of the dialog using the <code>v-model:visible</code> binding.

  Best practice: whenever there are multiple slots, use the full <code>template</code> based syntax for all slots including <code>default</code>.

  If you're using the sm-dialog component as a <a href="https://router.vuejs.org/guide/essentials/nested-routes.html#nested-routes" target='_blank'>child route</a> of a parent page then the default transition provided by the component won't be applied because the component's visibility is controlled by the router and not by the component itself.

  To apply the transition, wrap the <code>router-view</code> in the parent component with a <code>transition</code> component and give it the <code>sm-dialog-transition</code> name.

  <pre>${escapeAngleBrackets(sampleCode)}</pre>
`
Standard.parameters = {
  docs: {
    description: {
      component: standardDescription,
    },
  },
}

export const Alert = () => ({
  components: { SmDialog },
  setup: () => {
    const dialogVisible = ref(true)
    return {
      dialogVisible,
    }
  },
  template: `
    <div>
      <sm-button @click="dialogVisible = true" type="primary">Open dialog</sm-button>

      <sm-dialog v-model:visible="dialogVisible" type="alert" title="Alert" @close="dialogVisible = false">
        <template v-slot:default>
          <p>You are about to delete your life !!!</p>
        </template>
        <template v-slot:footer>
          <sm-button type="tertiary" @click="dialogVisible = false">Cancel</sm-button>
          <sm-button type="alert" @click="dialogVisible = false">Definitely</sm-button>
        </template>
      </sm-dialog>
    </div>
  `,
})

export const Warning = () => ({
  components: { SmDialog },
  setup: () => {
    const dialogVisible = ref(true)
    return {
      dialogVisible,
    }
  },
  template: `
    <div>
      <sm-button @click="dialogVisible = true" type="primary">Open dialog</sm-button>

      <sm-dialog v-model:visible="dialogVisible" type="warning" title="Warning" @close="dialogVisible = false">
        <template v-slot:default>
          <p>You are about to delete your life !!!</p>
        </template>
        <template v-slot:footer>
          <sm-button type="tertiary" @click="dialogVisible = false">Cancel</sm-button>
          <sm-button type="warning" @click="dialogVisible = false">Definitely</sm-button>
        </template>
      </sm-dialog>
    </div>
  `,
})

export const AsAService = () => ({
  setup: () => {
    const dialogType = ref<'prompt' | 'alert' | 'warning'>('prompt')

    const showDialog = (type: string) => {
      dialogService({
        type: dialogType.value,
        title: startCase(type),
        bodyContent: 'Are you sure you want to leave this page?',
        beforeClose: (close) => {
          // Do something before close
          return close()
        },
        beforeConfirm: (confirm) => {
          // Do something before confirm
          return confirm()
        },
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete Direct rate',
        confirmButtonType: dialogType.value === 'prompt' ? 'primary' : dialogType.value,
      })
    }
    return {
      dialogType,
      showDialog,
    }
  },
  template: `

    <div>
      <sm-radio-group name="dialog-type">
        <sm-radio v-model="dialogType" selected-value="prompt" name="dialog-type">Default</sm-radio>
        <sm-radio v-model="dialogType" selected-value="alert" name="dialog-type">Alert</sm-radio>
        <sm-radio v-model="dialogType" selected-value="warning" name="dialog-type">Warning</sm-radio>
      </sm-radio-group>

      <sm-button type="primary" @click="showDialog(dialogType)">
        Show dialog
      </sm-button>
    </div>

  `,
})

AsAService.storyName = 'As a service'

const asAServiceDescription = `
  The dialog component can be used as a service.

  <pre>
    import { dialogService } from '@siteminder/sui-core/services'
    const showDialog = () => {
      dialogService({
        type: 'alert',
        title: 'Title here',
        bodyContent: 'Body content here',
        beforeClose: (close) => {
          // Do something before close
          return close()
        },
        beforeConfirm: (confirm) => {
          // Do something before confirm
          return confirm()
        },
        visible: false, // default
        fullscreen: false, // default
        closeOnClickModal: true // default
        closeOnPressEscape: true // default
        showClose: true // default
        showCancel: true // default
        showConfirm: true // default
        customClass: 'Custom class here'
        cancelButtonText: 'Custom text for the cancel button here'
        cancelButtonType: 'Cancel button type here'
        confirmButtonText: 'Custom text for the Confirm button here'
        confirmButtonType: 'Confirm button type here'
        lockScroll: 'true' // default
        top: 'margin-top of the Dialog CSS here'
        cancelButtonLoading: false //Determine whether cancel button is loading
        cancelButtonDisabled: false // Determine whether cancel button is disabled
        confirmButtonLoading: false // Determine whether confirm button is loading
        confirmButtonDisabled: false // Determine whether confirm button is disabled
      })
    }
  </pre>

  The dialogService method accepts all the component options, with the exception of the <code>visible</code> prop.
  Visibility is triggered when the service is called.
`
AsAService.parameters = {
  docs: {
    description: {
      story: asAServiceDescription,
    },
  },
}

export const AsAServiceLoadingDisabled = () => ({
  setup: () => {
    const dialogType = ref<'prompt' | 'alert' | 'warning'>('prompt')

    const showDialog = (type: string) => {
      dialogService({
        type: dialogType.value,
        title: startCase(type),
        bodyContent: 'Are you sure you want to leave this page?',
        beforeClose: (close) => {
          // Do something before close
          return close()
        },
        beforeConfirm: (confirm) => {
          // Do something before confirm
          return confirm()
        },
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete Direct rate',
        cancelButtonLoading: true,
        confirmButtonDisabled: true,
        confirmButtonType: dialogType.value === 'prompt' ? 'primary' : dialogType.value,
      })
    }
    return {
      dialogType,
      showDialog,
    }
  },
  template: `

    <div>
      <sm-radio-group name="dialog-type">
        <sm-radio v-model="dialogType" selected-value="prompt" name="dialog-type">Default</sm-radio>
      </sm-radio-group>

      <sm-button type="primary" @click="showDialog(dialogType)">
        Show dialog
      </sm-button>
    </div>

  `,
})

AsAServiceLoadingDisabled.storyName = 'As a service - Loading & Disabled'

export const Fullscreen = () => ({
  components: { SmDialog, SmVerticalNav, SmVerticalNavItem },
  setup: () => {
    const dialogVisible = ref(true)

    const selection = ref('')

    const options = ref([
      { label: 'Strawberry', code: 'strawberry' },
      { label: 'Grapes', code: 'grapes' },
      { label: 'Watermelon', code: 'watermelon' },
      { label: 'Apple', code: 'apple' },
      { label: 'Kiwi', code: 'kiwi' },
      { label: 'Blueberry', code: 'blueberry' },
      { label: 'Lemon', code: 'lemon' },
      { label: 'Tomato', code: 'tomato' },
    ])

    return { selection, options, dialogVisible }
  },
  template: `
    <div>
      <sm-button @click="dialogVisible = true" type="primary">Open dialog</sm-button>

      <sm-dialog
      v-model:visible="dialogVisible"
      title="Title here"
      fullscreen
      @close="dialogVisible = false"
      >
        <template v-slot:default>
          <p>This is a Fullscreen dialog</p>
          <sm-loading-card count="12" />
          <sm-select
            label="Favourite icecream"
            v-model="selection"
            name="favourite-ice-cream-1"
            :options="options"
            :filterable="false"
          />
          <sm-select
            label="Favourite icecream"
            v-model="selection"
            name="favourite-ice-cream-2"
            :options="options"
            :filterable="false"
          />
        </template>

        <template v-slot:footer>
          <sm-button type="primary" suffix-icon="arrow-go-forward" @click="dialogVisible = false">Action</sm-button>
        </template>
      </sm-dialog>
    </div>
  `,
})

const fullscreenDescription = `
  Control the visibility of the dialog using the <code>v-model:visible</code> as per the vue3 recommendation.

  Please note that we have deprecated the <code>stickyFooter</code> props in recent SUI version 0.105.x

  Combine <code>fullscreen</code> props with <code>stickyFooter</code> slot to display fixed footer at the bottom with given background-color.

  Use <code>fullscreen</code> props to show the dialog in fullscreen.
`
Fullscreen.parameters = {
  docs: {
    description: {
      story: fullscreenDescription,
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

      <sm-help-card class="mb-24">
        <template #header>
          Does not require sui-themes package installation starting sui-core@19.0.0-vue3
        </template>
      </sm-help-card>

      <p>Styling hooks will enable customization for your components. Styling hooks are constructed using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">CSS custom properties</a>.</p>

      <p>Below is an example of the SUI dialog and the brand dialog using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 622px; height: auto; min-width: 0"
          alt="Dialog default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 622px; height: auto; min-width: 0"
          alt="Dialog themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the dialog customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              max-height
              <br/>
              max-width
              <br/>
              padding
              <br/>
              color
              <br/>
              border
              <br/>
              shadow
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-dialog-min-height
                --sm-c-dialog-max-width
                --sm-c-dialog-padding
                --sm-c-dialog-color-background
                --sm-c-dialog-color-text
                --sm-c-dialog-color-border
                --sm-c-dialog-border-width
                --sm-c-dialog-shadow
                --sm-c-dialog-footer-margin
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Type</sm-table-td>
            <sm-table-td>
              alert
              <br/> warning
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-dialog-color-border-#{$type}
                --sm-c-dialog-color-icon-#{$type}
                --sm-c-dialog-icon-font-size-#{$type}
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Underlay</sm-table-td>
            <sm-table-td>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-dialog-underlay-color-background
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Fullscreen</sm-table-td>
            <sm-table-td>
                color
                <br/>
                border
                <br/>
                margin
                <br/>
                max-height
                <br/>
                max-width
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-dialog-color-background-fullscreen
                --sm-c-dialog-color-text-fullscreen
                --sm-c-dialog-color-border-fullscreen
                --sm-c-dialog-border-width-fullscreen
                --sm-c-dialog-margin-fullscreen
                --sm-c-dialog-max-width-fullscreen
                --sm-c-dialog-max-height-fullscreen
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Fullscreen footer</sm-table-td>
            <sm-table-td>
                color
                <br/>
                padding
                <br/>
                height
                <br/>
                shadow
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-dialog-footer-color-background-fullscreen
                --sm-c-dialog-footer-color-text-fullscreen
                --sm-c-dialog-footer-padding-fullscreen
                --sm-c-dialog-footer-height-fullscreen
                --sm-c-dialog-footer-shadow-fullscreen
                --sm-c-dialog-footer-color-border-top-fullscreen
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Fullscreen title</sm-table-td>
            <sm-table-td>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-dialog-title-padding-fullscreen
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Fullscreen title</sm-table-td>
            <sm-table-td>
              margin
              <br/>
              max-height
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-dialog-body-padding-fullscreen
                --sm-c-dialog-body-max-height-fullscreen
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
