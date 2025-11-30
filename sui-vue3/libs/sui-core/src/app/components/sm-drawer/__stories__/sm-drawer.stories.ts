import { reactive, ref } from 'vue'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'wicg-inert'
import SmDrawer from '../sm-drawer.vue'
import defaultExample from './images/drawer-default.png'
import themedExample from './images/drawer-themed.png'

/**
 * NOTE: There's an issue when changing tabs from Canvas to Docs
 * where the drawer is visible and doesn't trigger the onBeforeUnmount
 * hook. This means the scroll lock is still active and the user won't be able
 * to scroll in the Docs tab.
 *
 * There is a workaround to hide the drawer manually before switching tabs in
 * each of the story. Alternatively, one can also refresh the page to reset the
 * scroll lock until we can figure out a better solution.
 *
 * This is common across components with dialogs and overlays,
 * e.g. sm-dialog, sm-wizard, sm-drawer, etc.
 */

const standardDescription = `
  Control the visibility of the drawer using the <code>v-model:visible</code> prop.

  For accessibility, use <code>inert</code> props to your HTML elements to make your HTML along with children elements not accessible and not interactive while drawer is open.

  Please see here for more details:<a target='_blank' href="https://html.spec.whatwg.org/multipage/interaction.html#inert" target="_blank">available rules</a>, <a href="https://github.com/WICG/inert" target="_blank">Github</a>

  Best practice: whenever there are multiple slots, use the full <code>template</code> based syntax for all slots including <code>default</code>.

  If you're using the sm-drawer component as a <a target='_blank' href="https://router.vuejs.org/guide/essentials/nested-routes.html#nested-routes">child route</a> of a parent page then the default transition provided by the component won't be applied because the component's visibility is controlled by the router and not by the component itself.

  To apply the transition, wrap the <code>router-view</code> in the parent component with a <code>transition</code> component and give it the <code>sm-drawer-transition</code> name.

  <code>
    <div>
      <!-- The parent component -->

      <transition name="sm-drawer-transition">
        <router-view />
      </transition>

    </div>
  </code>
`

export default {
  title: 'Components/Drawer',
  component: SmDrawer,
  parameters: {
    docs: {
      description: {
        // Uses `component` here since it's the primary story
        component: standardDescription,
      },
      inlineStories: true,
    },
  },
}

export const Standard = (_args: unknown, { viewMode }: { viewMode: string }) => ({
  components: { SmDrawer },
  setup: () => {
    const isStoryTab = viewMode === 'story'
    const drawerVisible = ref(isStoryTab) // Don't show the drawer in Storybook Docs tab by default
    const inert = ref(true)

    return {
      drawerVisible,
      inert,
    }
  },
  template: `
    <div>
      <sm-drawer v-model:visible="drawerVisible" content-class="sm-drawer__fixed-width" title="Title here" @open="inert = true" @close="inert = false">

        <p>Content in here</p>

      </sm-drawer>
      <div :inert="inert">
        <sm-button @click="drawerVisible = true" type="primary">Open drawer</sm-button>
      </div>
    </div>
  `,
})

export const UsingWithForms = (_args: unknown, { viewMode }: { viewMode: string }) => ({
  components: { SmDrawer },
  setup: () => {
    const form = reactive({
      firstName: '',
      lastName: '',
      field1: '',
      field2: '',
    })

    const isStoryTab = viewMode === 'story'
    const drawerVisible = ref(isStoryTab) // Don't show the drawer in Storybook Docs tab by default
    const actionButtonsVisible = ref(true)
    const addMobileActions = ref(false)

    const handleSubmit = () => console.info('submitting...')

    const openDrawer = () => {
      addMobileActions.value = false
      drawerVisible.value = true
    }

    const openDrawerWithMobileActions = () => {
      addMobileActions.value = true
      drawerVisible.value = true
    }

    return {
      addMobileActions,
      form,
      drawerVisible,
      actionButtonsVisible,
      handleSubmit,
      openDrawer,
      openDrawerWithMobileActions,
    }
  },
  template: `
    <div>
      <sm-drawer v-model:visible="drawerVisible" :action-buttons-visible="actionButtonsVisible" content-class="sm-drawer__fixed-width" title="Title here">

        <template #actions>
          <sm-button
            class="ml-4"
            type="tertiary"
            @click="drawerVisible = false"
          >
            Cancel
          </sm-button>
          <sm-button
            native-type="submit"
            form="user-form"
            @click.prevent="handleSubmit"
            type="primary"
          >
            Save
          </sm-button>
        </template>

        <template v-if="addMobileActions" #mobile-actions>
          <sm-button
            type="tertiary"
            @click="drawerVisible = false"
          >
            Cancel
          </sm-button>
          <sm-button
            native-type="submit"
            form="user-form"
            type="primary"
            @click.prevent="handleSubmit"
          >
            Save
          </sm-button>
        </template>

        <template #default>
          <sm-form id="user-form" @submit="handleSubmit">
            <sm-form-group legend="Section title" class="mb-8">
              <div class="grid grid-cols-1 tablet:grid-cols-2 gap-x-24">
                <sm-input label="First name" name="first-name" v-model="form.firstName" placeholder="Placeholder" />
                <sm-input label="Last name" name="last-name" v-model="form.lastName" placeholder="Placeholder" />
              </div>
            </sm-form-group>

            <sm-form-group legend="Group">
              <div class="rounded p-16" style="border: 1px solid #c6ceda;">
                <span style="display: block; font-weight: 600;">Label</span>
                <div class="py-8 flex justify-between items-center" style="border-bottom: 1px solid #c6ceda;">
                  Text here
                  <sm-button type="text-warning">Delete</sm-button>
                </div>
                <div class="py-8 mb-16 flex justify-between items-center" style="border-bottom: 1px solid #c6ceda;">
                  Text here
                  <sm-button type="text-warning">Delete</sm-button>
                </div>
                <sm-button class="w-full" type="text" prefix-icon="controls-add">Action</sm-button>
              </div>
            </sm-form-group>

            <sm-divider margin-bottom="32px" margin-top="32px" min-width="100%" />

            <sm-form-group legend="Section title">
              <sm-input label="Input field" name="input-one" v-model="form.field1" placeholder="Placeholder" />
              <sm-input
                v-model="form.field2"
                type="textarea"
                label="Textarea"
                placeholder="Placeholder"
                name="input-two"
                :counter="true"
                :error-disabled="true"
                :maxlength="500"
              />
            </sm-form-group>
          </sm-form>
        </template>

      </sm-drawer>

      <sm-button @click="openDrawer" type="primary">Open drawer</sm-button>
      <sm-button @click="openDrawerWithMobileActions" type="primary">Open drawer with mobile actions</sm-button>
    </div>
  `,
})

UsingWithForms.storyName = 'Using with Forms'
const usingWithFormsDescription = `
  User the <code>submit</code> to place a button in the top right hand corner of the Drawer.

  For accessibility reasons, always tie the form element to the button using the <code>form</code> and <code>id</code> attributes as detailed above.

  Best practice, whenever there are multiple slots, use the full <code>template</code> based syntax for all slots including <code>default</code>
`
UsingWithForms.parameters = {
  docs: {
    description: {
      story: usingWithFormsDescription,
    },
  },
}

export const ControllingHeight = (_args: unknown, { viewMode }: { viewMode: string }) => ({
  components: { SmDrawer },
  setup: () => {
    const isStoryTab = viewMode === 'story'
    const fullHeightDrawerVisible = ref(false)
    const belowHeaderDrawerVisible = ref(false)
    const belowHeaderWithHeightDrawerVisible = ref(isStoryTab) // Don't show the drawer in Storybook Docs tab by default
    const actionButtonsVisible = ref(false)

    return {
      fullHeightDrawerVisible,
      belowHeaderDrawerVisible,
      belowHeaderWithHeightDrawerVisible,
      actionButtonsVisible,
    }
  },
  template: `
    <div style="padding-top: 80px;">

      <!-- Imaginary header -->
      <div style="background: #008bce; height: 64px; position: absolute; top: 0; left: 0; width: 100%;"></div>
      <div style="background: #008bce; height: 41px; position: absolute; top: 0; left: 0; width: 100%; border-bottom: 1px dashed white"></div>

      <sm-drawer
        v-model:visible="fullHeightDrawerVisible"
        :action-buttons-visible="actionButtonsVisible"
        content-class="sm-drawer__fixed-width"
        title="Title here"
        height="full-height">
        <p>Content in here</p>
      </sm-drawer>
      <sm-button @click="fullHeightDrawerVisible = true" type="primary">Full height</sm-button>

      <sm-drawer
        v-model:visible="belowHeaderDrawerVisible"
        :action-buttons-visible="actionButtonsVisible"
        content-class="sm-drawer__fixed-width"
        title="Title here" height="below-header">
        <p>Content in here</p>
      </sm-drawer>
      <sm-button @click="belowHeaderDrawerVisible = true" type="primary">Below header (default)</sm-button>

      <sm-drawer
        v-model:visible="belowHeaderWithHeightDrawerVisible"
        :action-buttons-visible="actionButtonsVisible"
        content-class="sm-drawer__fixed-width"
        title="Title here"
        height="below-header"
        header-height="40px"
      >
        <p>Content in here</p>
      </sm-drawer>
      <sm-button @click="belowHeaderWithHeightDrawerVisible = true" type="primary">Below header with custom height</sm-button>

    </div>
  `,
})

const controllingHeightDescription = `
  The height of drawer can be controlled by setting the <code>height</code> property to either <code>full-height</code> or <code>below-header</code>.

  By default, the assumed header height is <code>64px</code>, but can be adjusted using <code>header-height</code> prop.
`
ControllingHeight.parameters = {
  docs: {
    description: {
      story: controllingHeightDescription,
    },
  },
  percy: {
    // Attempt to make the buttons behind the drawer less flaky
    enableJavascript: true,
  },
}

export const CloseOpenHooks = (_args: unknown, { viewMode }: { viewMode: string }) => ({
  components: { SmDrawer },
  setup: () => {
    const isStoryTab = viewMode === 'story'
    const drawerVisible = ref(isStoryTab) // Don't show the drawer in Storybook Docs tab by default
    const actionButtonsVisible = ref(false)

    const onOpen = () => console.info('opening...')

    const onClose = () => console.info('closing...')

    const onBeforeClose = (close: () => void) => {
      // eslint-disable-next-line no-alert
      if (window.confirm('You have unsaved changes...')) {
        close()
      }
    }

    return {
      drawerVisible,
      actionButtonsVisible,
      onBeforeClose,
      onClose,
      onOpen,
    }
  },
  template: `
    <div>
      <sm-drawer
        @open="onOpen"
        @close="onClose"
        :action-buttons-visible="actionButtonsVisible"
        v-model:visible="drawerVisible"
        :before-close="onBeforeClose"
        content-class="sm-drawer__fixed-width"
        title="Title here">

        <p>Content in here</p>

      </sm-drawer>

      <sm-button @click="drawerVisible = true" type="primary">Open drawer</sm-button>
    </div>
  `,
})

CloseOpenHooks.storyName = 'Close & Open Hooks'
const closeOpenHooksDescription = `
  User the <code>submit</code> to place a button in the top right hand corner of the Drawer.

  For accessibility reasons, always tie the form element to the button using the <code>form</code> and <code>id</code> attributes as detailed above.
`
CloseOpenHooks.parameters = {
  docs: {
    description: {
      story: closeOpenHooksDescription,
    },
  },
}

export const ResponsiveWidth = (_args: unknown, { viewMode }: { viewMode: string }) => ({
  components: { SmDrawer },
  setup: () => {

    const isStoryTab = viewMode === 'story'
    const drawerVisible = ref(isStoryTab) // Don't show the drawer in Storybook Docs tab by default
    const actionButtonsVisible = ref(true)

    return {
      drawerVisible,
      actionButtonsVisible,
    }
  },
  template: `
    <div>
      <sm-drawer
        v-model:visible="drawerVisible"
        :action-buttons-visible="actionButtonsVisible"
        content-class="w-1/1 small-desktop:w-1/2 large-desktop:w-1/3 extra-large-desktop:w-1/4"
        title="Title here">

        <template #actions>
          <sm-button
            class="ml-4"
            native-type="submit"
            type="primary">
            Save
          </sm-button>
        </template>

        <template #default>
          <p class="hidden extra-large-desktop:block">extra-large-desktop</p>
          <p class="hidden large-desktop:block extra-large-desktop:hidden">large-desktop</p>
          <p class="hidden small-desktop:block large-desktop:hidden">small-desktop</p>
          <p class="hidden tablet:block small-desktop:hidden">tablet</p>
          <p class="block tablet:hidden">mobile</p>
        </template>
      </sm-drawer>

      <sm-button @click="drawerVisible = true" type="primary">Open drawer</sm-button>
    </div>
  `,
})

ResponsiveWidth.parameters = {
  docs: {
    description: {
      story: 'Control the visibility of the drawer using the <code>v-model:visible</code> prop.',
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

      <p>Below is an example of the SUI drawer and the brand drawer using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 652px; height: auto; min-width: 0; border: 1px solid #c6d0e0"
          alt="Drawer default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 652px; height: auto; min-width: 0; border: 1px solid #c6d0e0"
          alt="Drawer themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the drawer customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>
      <sm-table>
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Element </sm-table-th>
            <sm-table-th> Category + Property </sm-table-th>
            <sm-table-th class="w-1/2 small-desktop:w-3/5"> Styling Hooks</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Underlay</sm-table-td>
            <sm-table-td>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-drawer-underlay-color-background
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Content</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-text
              <br/>
              box-shadow
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-drawer-content-color-background
                --sm-c-drawer-content-color-text
                --sm-c-drawer-content-box-shadow
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Close</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-text
              <br/>
              border
              <br/>
              top
              <br/>
              left
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-drawer-close-color-background
                --sm-c-drawer-close-color-text
                --sm-c-drawer-close-border

                --sm-c-drawer-close-top-mobile
                --sm-c-drawer-close-left-mobile

                --sm-c-drawer-close-top-tablet
                --sm-c-drawer-close-left-tablet

                --sm-c-drawer-close-top-desktop
                --sm-c-drawer-close-left-desktop
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Body</sm-table-td>
            <sm-table-td>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-drawer-body-padding-mobile
                --sm-c-drawer-body-padding-desktop
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Header</sm-table-td>
            <sm-table-td>
              border-bottom
              <br/>
              color-text
              <br/>
              box-shadow
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-drawer-header-border-bottom
                --sm-c-drawer-header-color-text
                --sm-c-drawer-header-box-shadow

                --sm-c-drawer-header-padding-mobile

                --sm-c-drawer-header-padding-tablet

                --sm-c-drawer-header-padding-desktop
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Footer</sm-table-td>
            <sm-table-td>
              border-top
              <br/>
              color-text
              <br/>
              box-shadow
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-drawer-footer-border-top
                --sm-c-drawer-footer-color-text
                --sm-c-drawer-footer-box-shadow
                --sm-c-drawer-footer-padding-mobile
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
