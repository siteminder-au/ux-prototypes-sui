import vueRouter from 'storybook-vue3-router'
import { onMounted, ref } from 'vue'
import { isPercyContext } from '../../../../../test/percy/helpers'
import SmDropdown from '../sm-dropdown.vue'
import { SmVerticalNav, SmVerticalNavItem } from '../../sm-vertical-nav'
import { SmTooltip } from '../../sm-tooltip'
import defaultExample from './images/dropdown-default.png'
import themedExample from './images/dropdown-themed.png'

const EmptyComponent = () => ({
  template: '<div>Home</div>',
})
EmptyComponent.displayName = 'EmptyComponent'

export default {
  title: 'Components/Dropdown',
  decorators: [
    // See: https://corechasm.com/addons/storybook-vue3-router
    // Match all routes so we can test the active state of the nav items
    vueRouter([{
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: EmptyComponent,
    }]),
  ],
  component: SmDropdown,
  subcomponents: {
    'sm-vertical-nav': SmVerticalNav,
    'sm-vertical-nav-item': SmVerticalNavItem,
  },
}

export const Standard = () => ({
  components: { SmDropdown, SmVerticalNav, SmVerticalNavItem },
  setup: () => {
    const open = () => {
      // eslint-disable-next-line no-console
      console.log('open')
    }

    const close = () => {
      // eslint-disable-next-line no-console
      console.log('close')
    }

    onMounted(() => {
      // Open first dropdown during Percy visual testing, dropdowns auto-closes whenever document is clicked
      // This is manually done here because we don't have a prop
      // that we can just set to true to display the hidden content
      if (isPercyContext()) {
        document.getElementById('percy-trigger')?.querySelector('button')?.click()
      }
    })

    return { open, close }
  },
  template: `
    <div style="height: 150vh; overflow: scroll">
      <div style="text-align: center;">
        <span class="sui-storybook-header">Standard</span>
        <div class="flex justify-center gap-24">
          <sm-dropdown id="percy-trigger" type="primary" label="Dropdown" @open="open" @close="close">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="General" to="/setup/general" />
              <sm-vertical-nav-item label="Details" to="/setup/details" />
              <sm-vertical-nav-item label="Action" to="/setup/action" />
              <sm-vertical-nav-item label="Info" to="/setup/info" />
              <sm-vertical-nav-item label="Text" to="/setup/text" />
              <sm-vertical-nav-item label="Alert" to="/setup/alert" />
            </sm-vertical-nav>
          </sm-dropdown>

          <sm-dropdown type="primary" label="Disabled" disabled>
            <sm-vertical-nav>
              <sm-vertical-nav-item label="General" to="/setup/general" />
              <sm-vertical-nav-item label="Details" to="/setup/details" />
            </sm-vertical-nav>
          </sm-dropdown>
        </div>
      </div>

      <br/><br/>

      <div style="text-align: center;">
        <span class="sui-storybook-header">Placements</span>
        <div class="flex justify-center gap-24 flex-wrap">
          <sm-dropdown type="primary" label="Top">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="General" to="/setup/general" />
              <sm-vertical-nav-item label="Details" to="/setup/details" />
            </sm-vertical-nav>
          </sm-dropdown>

          <sm-dropdown type="primary" label="Bottom" placement="bottom">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="General" to="/setup/general" />
              <sm-vertical-nav-item label="Details" to="/setup/details" />
            </sm-vertical-nav>
          </sm-dropdown>

          <sm-dropdown type="primary" label="Right" placement="right">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="General" to="/setup/general" />
              <sm-vertical-nav-item label="Details" to="/setup/details" />
            </sm-vertical-nav>
          </sm-dropdown>

          <sm-dropdown type="primary" label="Right-start" placement="right-start">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="General" to="/setup/general" />
              <sm-vertical-nav-item label="Details" to="/setup/details" />
            </sm-vertical-nav>
          </sm-dropdown>

          <sm-dropdown type="primary" label="Right-end" placement="right-end">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="General" to="/setup/general" />
              <sm-vertical-nav-item label="Details" to="/setup/details" />
            </sm-vertical-nav>
          </sm-dropdown>
        </div>
      </div>

      <br/><br/>

      <div style="text-align: center;">
        <span class="sui-storybook-header">Close menu on click</span>
        <sm-dropdown type="primary" label="Dropdown" placement="bottom" close-on-menu-click>
          <sm-vertical-nav>
            <sm-vertical-nav-item label="General" to="/setup/general" />
            <sm-vertical-nav-item label="Details" to="/setup/details" />
          </sm-vertical-nav>
        </sm-dropdown>
      </div>
    </div>
  `,
})

Standard.parameters = {
  docs: {
    description: {
      story: `
        By default the dropdown will be placed towards the bottom of the button.

        If there isn't ample space below the button, the dropdown will appear above it instead.

        Scroll the demo with the dropdown open to see the content flip as required.

        You can also set the default placement to <code>top</code> using the <code>placement</code> prop.

        <code>

        const open = () => {

          Emits when dropdown is in open state

        }

        const close = () => {

          Emits when dropdown is in open close

        }
        </code>
      `,
    },
  },
  percy: {
    // Needed for the Percy setup steps in onMounted hook to run
    // Take note of the defaults when upgrading Storybook or Percy in the future
    // https://docs.percy.io/docs/storybook#unexpected-diffs
    enableJavascript: true,
  },
}

export const CustomLabelAndContent = () => ({
  components: { SmDropdown, SmVerticalNav, SmVerticalNavItem, SmTooltip },
  setup: () => {
    const dropdown = ref()
    const showDropdownList = ref(false)

    const click = () => {
      // eslint-disable-next-line no-console
      console.log('click')
    }

    const close = () => {
      // eslint-disable-next-line no-console
      console.log('close')
      showDropdownList.value = false
    }

    const open = () => {
      // eslint-disable-next-line no-console
      console.log('open')
      showDropdownList.value = true
    }

    onMounted(() => {
      // Open specific dropdown during Percy visual testing
      // This is manually done here because we don't have a prop
      // that we can just set to true to display the hidden content
      if (isPercyContext()) {
        dropdown.value?.$el.querySelector('button')?.click()
      }
    })

    return {
      dropdown,
      showDropdownList,
      click,
      close,
      open,
    }
  },
  template: `
    <div style="text-align: center;">

      <div>
        <span class="sui-storybook-header">Label slot</span>
        <sm-dropdown type="primary">
          <template v-slot:label="{ visible }">
            Select an option
            <sm-icon class="ml-12" :name="visible ? 'arrow-up' : 'arrow-down'" />
          </template>

          <template v-slot:default="slotProps">
            <span style="z-index:1; cursor:pointer; position:absolute; top: 16px; right: 12px" @click="slotProps.close">
              <sm-icon name="action-cross"/>
            </span>
            <sm-vertical-nav>
              <sm-vertical-nav-item label="General" to="/setup/general" />
              <sm-vertical-nav-item label="Details" to="/setup/details" />
            </sm-vertical-nav>
          </template>
        </sm-dropdown>
      </div>

      <br/><br/>

      <div>
        <span class="sui-storybook-header">Default slot with tooltip</span>
        <sm-dropdown type="primary" label="Dropdown" placement="bottom">
          <template v-slot:default>
            <sm-vertical-nav>
              <sm-vertical-nav-item @click="click" readonly>
                <template v-slot:content>
                  <sm-tooltip placement="bottom" title="Bottom tooltip" blockElement>
                    <sm-icon name="action-edit"/>
                    <span style="margin-left:5px"> Edit </span>
                  </sm-tooltip>
                </template>
              </sm-vertical-nav-item>
              <sm-vertical-nav-item
                label="Details"
                prefix-icon="action-remove"
                to="/setup/details"
              />
            </sm-vertical-nav>
          </template>
        </sm-dropdown>
      </div>

      <br/><br/>

      <div>
        <span class="sui-storybook-header">Menu and icon</span>
        <div class="flex justify-center gap-24">
          <sm-dropdown type="primary" active-label="ACTIONS" placement="bottom" square @open="open" @close="close">
            <template v-slot:label>
              <sm-icon aria-label="More actions" name="action-context-menu" v-show="!showDropdownList"/>
              <sm-icon name="action-cross" v-show="showDropdownList"/>
            </template>

            <template v-slot:default>
              <sm-vertical-nav>
                <sm-vertical-nav-item label="General" to="/setup/general" />
                <sm-vertical-nav-item label="Details" to="/setup/details" />
              </sm-vertical-nav>
            </template>
          </sm-dropdown>

          <sm-dropdown ref="dropdown" type="secondary" active-label="ACTIONS" placement="bottom" square>
            <template v-slot:label>
              <sm-icon aria-label="More actions" name="action-context-menu"/>
            </template>

            <template v-slot:default>
              <sm-vertical-nav>
                <sm-vertical-nav-item
                  label="Edit"
                  prefix-icon="action-edit"
                  to="/setup/edit"
                />

                <sm-vertical-nav-item
                  label="Delete"
                  prefix-icon="action-remove"
                  @click="click"
                />

                <sm-vertical-nav-item
                  label="Add to the direct booking engine"
                  href="https://www.siteminder.com/"
                  target="_blank"
                  suffix-icon="action-open-in-new"
                  prefix-icon="products-booking-engine"
                />

                <sm-vertical-nav-item
                  label="Map to channel"
                  to="/setup/map"
                  prefix-icon="action-map"
                  suffix-icon="action-open-in-new"
                  disabled
                />

                <sm-vertical-nav-item
                  label="Audit"
                  to="/setup/audit"
                  prefix-icon="section-audit"
                />

                <sm-vertical-nav-item
                  label="Details"
                  href="https://www.siteminder.com/"
                  target="_blank"
                  suffix-icon="action-open-in-new"
                  prefix-icon="products-booking-engine"
                  :suffix-badge="{ text: 'New', config: { type: 'success' } }"
                />
              </sm-vertical-nav>
            </template>
          </sm-dropdown>
        </div>
      </div>
    </div>
  `,
})

CustomLabelAndContent.storyName = 'Custom label and content'

const CustomLabelAndContentDescription = `
  Use the <code>label</code> slot to provide a custom label. Additionally, make use of the slots context to determine if the menu is visible.

  The <code>default</code> slot exposed the method <code>close</code> to hide the dropdown content.

  <code>

  const showDropdownList = ref(false)

  const open = () => {

    Emits when dropdown is in open state
    showDropdownList.value = true;
  }

  const close = () => {

    Emits when dropdown is in open close
    showDropdownList.value = false;
  }

  </code>

  Moreover, adding the active-label prop will cause the dropdown to appear as a "menu" where it overlays the target button

  To display Menu and icon on left side of the page it is recommended to have enough space on left side to expand the content on left

  User can set flag to show/hide different icons inside <code>label</code> slot on based on open and close events

  Use <code>contentClass</code> props to override dropdown content style.

  For example: <code>sm-dropdown</code> has by default overflow hidden use <code>contentClass</code> props to allow <sm-tooltip> component to overflow outside the dropdown content body.

  Best Practices, Whenever there are multiple slots, use the full <code>template</code> based syntax for all slots including <code>default</code>
`
CustomLabelAndContent.parameters = {
  docs: {
    description: {
      story: CustomLabelAndContentDescription,
    },
  },
  percy: {
    // Needed for the Percy setup steps in onMounted hook to run
    // Take note of the defaults when upgrading Storybook or Percy in the future
    // https://docs.percy.io/docs/storybook#unexpected-diffs
    enableJavascript: true,
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

      <p>Below is an example of the SUI dropdown and the brand dropdown using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 228px; height: auto; min-width: 0"
          alt="Dropdown default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 228px; height: auto; min-width: 0"
          alt="Dropdown themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the dropdown customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
            <sm-table-th colspan="3">Dropdown</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              width
              <br/>
              color-background
              <br/>
              border
              <br/>
              shadow
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-dropdown-width
                --sm-c-dropdown-menu-color-background
                --sm-c-dropdown-menu-border
                --sm-c-dropdown-menu-width
                --sm-c-dropdown-menu-border-radius-visible
                --sm-c-dropdown-menu-shadow-visible
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Menu icon button visible</sm-table-td>
            <sm-table-td>
              color
              <br/>
              border
              <br/>
              padding
              <br/>
              height
              <br/>
              width
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-dropdown-icon-button-color-text-visible
                --sm-c-dropdown-icon-button-color-background-visible
                --sm-c-dropdown-icon-button-border-visible
                --sm-c-dropdown-icon-button-padding-visible
                --sm-c-dropdown-icon-button-height-visible
                --sm-c-dropdown-icon-button-width-visible
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Menu icon button visible hover</sm-table-td>
            <sm-table-td>
              color
              <br/>
              border
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-dropdown-icon-button-color-text-visible-hover
                --sm-c-dropdown-icon-button-color-background-visible-hover
                --sm-c-dropdown-icon-button-border-visible-hover
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Active label</sm-table-td>
            <sm-table-td>
                color
                <br/>
                font-weight
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-dropdown-label-color-text-active
                --sm-c-dropdown-label-font-weight-active
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Vertical nav item</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-text
              <br/>
              font-weight
              <br/>
              font-size
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-dropdown-vertical-nav-item-color-background
                --sm-c-dropdown-vertical-nav-item-color-text
                --sm-c-dropdown-vertical-nav-item-font-weight
                --sm-c-dropdown-vertical-nav-item-font-size

                --sm-c-dropdown-vertical-nav-item-color-background-hover
                --sm-c-dropdown-vertical-nav-item-color-text-hover

                --sm-c-dropdown-vertical-nav-item-color-background-focus
                --sm-c-dropdown-vertical-nav-item-color-text-focus

                --sm-c-dropdown-vertical-nav-item-color-background-disabled
                --sm-c-dropdown-vertical-nav-item-color-text-disabled

                --sm-c-dropdown-vertical-nav-item-color-background-active
                --sm-c-dropdown-vertical-nav-item-color-text-active
                --sm-c-dropdown-vertical-nav-item-indicator-color-active
                --sm-c-dropdown-vertical-nav-item-font-weight-active

                --sm-c-dropdown-vertical-nav-item-indicator-color-exact-active
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
