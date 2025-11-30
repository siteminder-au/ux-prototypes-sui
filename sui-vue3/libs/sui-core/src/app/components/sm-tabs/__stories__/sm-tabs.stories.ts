import { computed, ref, watch } from 'vue'
import { dialogService } from '../../../services'
import SmTab from '../sm-tab.vue'
import SmTabs from '../sm-tabs.vue'
import SmPopover from '../../sm-popover/sm-popover.vue'
import defaultExample from './images/tabs-default.png'
import themedExample from './images/tabs-themed.png'

export default {
  title: 'Components/Tabs',
  component: SmTabs,
  subcomponents: {
    'sm-tab': SmTab,
  },
}

export const Standard = () => ({
  components: { SmTabs, SmTab },
  setup: () => {
    const activeTab = ref(0)
    const value = ref(3)

    const click = () => {
      activeTab.value = 1
    }
    return {
      activeTab,
      click,
      value,
    }
  },
  template: `
    <div>
      <sm-tabs v-model:activeTab="activeTab" :show-underline="true">

        <sm-tab label="All">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 10" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
          <sm-button @click="click()" type="primary">Switch tab</sm-button>
          <sm-button @click="value = 4" type="primary">Update value</sm-button>
        </sm-tab>

        <sm-tab label="Room types" :value="value">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 5" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
          <sm-button @click="value = 5" type="primary">Update value</sm-button>
        </sm-tab>

        <sm-tab label="Property">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 8" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
        </sm-tab>

        <sm-tab label="Extras">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 4" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
        </sm-tab>

        <sm-tab label="Details">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 3" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
        </sm-tab>

        <sm-tab label="Guest marketing">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 2" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
        </sm-tab>
      </sm-tabs>
    </div>
  `,
})

export const Icon = () => ({
  components: { SmTabs, SmTab },
  setup: () => {
    const activeTab = ref(0)
    const value = ref(3)

    const click = () => {
      activeTab.value = 1
    }
    return {
      activeTab,
      click,
      value,
    }
  },
  template: `
    <div>
      <sm-tabs v-model:activeTab="activeTab" :show-underline="true">

        <sm-tab label="All" prefix-icon="rating-default">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 10" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
          <sm-button @click="click()" type="primary">Switch tab</sm-button>
          <sm-button @click="value = 4" type="primary">Update value</sm-button>
        </sm-tab>

        <sm-tab label="Room types" :value="value" prefix-icon="rating-default">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 8" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
          <sm-button @click="value = 5" type="primary">Update value</sm-button>
        </sm-tab>

        <sm-tab label="Details" suffix-icon="rating-default">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 3" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
        </sm-tab>
      </sm-tabs>
    </div>
  `,
})

export const DesktopViewOnly = () => ({
  components: { SmTabs, SmTab },
  setup: () => {
    const activeTab = ref(0)

    return {
      activeTab,
    }
  },
  template: `
    <div>
      <sm-tabs v-model:activeTab="activeTab" :show-underline="true" :is-tablet="false">

        <sm-tab label="All">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 10" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
        </sm-tab>

        <sm-tab label="Room types">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 8" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
        </sm-tab>

        <sm-tab label="Details">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 3" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
        </sm-tab>
      </sm-tabs>
    </div>
  `,
})

DesktopViewOnly.storyName = 'Desktop View only'

DesktopViewOnly.parameters = {
  docs: {
    description: {
      story: 'Use props <code>isTablet</code> to display tablet view for small screen or not',
    },
  },
  percy: {
    widths: [1025, 360],
  },
}

export const Disabled = () => ({
  components: { SmTabs, SmTab },
  setup: () => {
    const activeTab = ref(0)
    const roomTypesEnabled = ref(false)

    return {
      activeTab,
      roomTypesEnabled,
    }
  },
  template: `
    <div>
      <sm-tabs v-model:activeTab="activeTab" :show-underline="true">

        <sm-tab label="All">
          <div class="py-32">
            <sm-switch v-model="roomTypesEnabled" label="Enable Room Types" name="enable-room-types" />

            <div class="flex flex-wrap gap-8 mt-24">
              <div v-for="i in 10" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
            </div>
          </div>
        </sm-tab>

        <sm-tab label="Room types" :disabled="!roomTypesEnabled">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 7" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
        </sm-tab>

        <sm-tab label="Property" :disabled="true">
          <div class="py-32">
            Disabled
          </div>
        </sm-tab>

      </sm-tabs>
    </div>
  `,
})

Disabled.parameters = {
  docs: {
    description: {
      story: 'Use props <code>disabled</code> to show the tabs disabled state',
    },
  },
  percy: {
    widths: [1025, 360],
  },
}

export const Hidden = () => ({
  components: { SmTabs, SmTab },
  setup: () => {
    const activeTab = ref(0)
    const tabItemsCheckbox = ref([])

    const tabItems = computed(() => {
      return {
        'rooms-rates-mapping': true,
        // Dynamic tabs - controlled by checkbox for demo purposes
        'channel-settings': tabItemsCheckbox.value.includes('channel-settings') || false,
        taxes: tabItemsCheckbox.value.includes('taxes') || false,
        fees: tabItemsCheckbox.value.includes('fees') || false,
      }
    })

    /**
     * For demo purposes only, switch to the first available
     * tab if currently active tab was hidden.
     */
    watch(
      () => tabItems.value,
      () => {
        if (!Object.values(tabItems.value)[activeTab.value]) {
          activeTab.value = 0
        }
      },
    )
    return {
      activeTab,
      tabItems,
      tabItemsCheckbox,
    }
  },
  template: `
    <div>
      <sm-checkbox-group name="tabs" class="mb-24" label="Show tab items" error-disabled>
        <sm-checkbox name="tabs" v-model="tabItemsCheckbox" selected-value="channel-settings" label="Channel settings" />
        <sm-checkbox name="tabs" v-model="tabItemsCheckbox" selected-value="taxes" label="Taxes" />
        <sm-checkbox name="tabs" v-model="tabItemsCheckbox" selected-value="fees" label="Fees" />
      </sm-checkbox-group>

      <sm-tabs v-model:activeTab="activeTab" :show-underline="true">

        <sm-tab label="Rooms & rates mapping">
          <div class="py-32">
            <p>Rooms & rates mapping content...</p>
          </div>
        </sm-tab>

        <sm-tab label="Channel settings" :hidden="!tabItems['channel-settings']">
          <div class="py-32">
            <p>Channel settings content...</p>
          </div>
        </sm-tab>

        <sm-tab label="Taxes" :hidden="!tabItems['taxes']">
          <div class="py-32">
            <p>Taxes content...</p>
          </div>
        </sm-tab>

        <sm-tab label="Fees" value="5" :hidden="!tabItems['fees']">
          <div class="py-32">
            <p>Fees content...</p>
          </div>
        </sm-tab>

      </sm-tabs>
    </div>
  `,
})

Hidden.parameters = {
  docs: {
    description: {
      story: 'Use props <code>hidden</code> to toggle the tab\'s visibility',
    },
  },
}

export const CustomContent = () => ({
  components: { SmTabs, SmTab, SmPopover },
  setup: () => {
    const activeTab = ref(0)

    const label = ref('All')
    const labelTwo = ref('Room Types')
    const labelThree = ref('property')
    const labelFour = ref('Disabled')

    return {
      activeTab,
      label,
      labelTwo,
      labelThree,
      labelFour,
    }
  },
  template: `
    <div>
      <sm-tabs v-model:activeTab="activeTab" :show-underline="true">

        <sm-tab :label="label">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 10" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
        </sm-tab>

        <template #[label]>
          Custom All
        </template>

        <sm-tab :label="labelTwo">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 4" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
        </sm-tab>

        <template #[labelTwo]>
          Custom Room Types
        </template>

        <sm-tab :label="labelThree">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 7" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
        </sm-tab>

        <template #[labelThree]>
          Custom property
        </template>

        <sm-tab :label="labelFour" disabled>
          <div class="py-32">
            Disabled
          </div>
        </sm-tab>

        <template #[labelFour]>
          Custom disabled
        </template>

      </sm-tabs>
    </div>
  `,
})

CustomContent.storyName = 'Custom content'

const customContentDescription = `
  The <code>sm-tab</code> component is not designed originally to support the slot to modified the label.
  However, as per the project design requirements, we have added a customizable slot for the sm-tab component to override the property label.

  <strong>How to add a slot for the sm-tab component?</strong>
  <ul>
    <li>The user should pass dynamic name to the slots <code>template #[variable]</code> and those dynamic name value should be matching with <code>sm-tab</code> components label props. This will help components to identify the slot and label mapping.</li>
    <li>The slots to override the for the <code>sm-tab</code> components label should be directly inside the <code>sm-tabs</code> component.</li>
    <li>As per the slot naming rules, attribute names cannot contain spaces, quotes <code><, >, / or To</code> and to overcome this problem slot name <code>template #[label]</code> and <code>label</code> props matching values should be stored in a variable. For example: <code>const label = ref('All')</code></li>
    <li>Props <code>label</code> is a required props for the <code>sm-tab</code> component and use the slots only when to customize the value of <code>label</code> props</li>
  </ul>
`
CustomContent.parameters = {
  docs: {
    description: {
      story: customContentDescription,
    },
  },
}

export const SampleDisabledTabWithPopover = () => ({
  components: { SmTabs, SmTab, SmPopover },
  setup: () => {
    const activeTab = ref(0)

    const property = ref('Property')

    return {
      activeTab,
      property,
    }
  },
  template: `
    <div>
      <sm-tabs v-model:activeTab="activeTab" :show-underline="true">

        <sm-tab label="All">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 10" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
        </sm-tab>

        <sm-tab label="Room types">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 3" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
        </sm-tab>

        <sm-tab :label="property" :disabled="true">
          <div class="py-32">
            Disabled
          </div>
        </sm-tab>

        <template #[property]>
          <sm-popover placement="bottom" title="bottom popover" position="fixed">
            Text Disabled
          </sm-popover>
        </template>

      </sm-tabs>
    </div>
  `,
})

SampleDisabledTabWithPopover.storyName = 'Sample: disabled tab with popover'

export const InterceptingTabChanges = () => ({
  components: { SmTabs, SmTab },
  setup: () => {
    const activeTab = ref(0)
    const nextTab = ref(0)
    const dialogVisible = ref(false)
    const input1 = ref()
    const input2 = ref()

    const onBeforeTabChange = (to: number, from: number, next: (to: number) => void) => {
      if (activeTab.value === 1 && to !== from && input1.value) {
        dialogService({
          type: 'warning',
          title: 'Unsaved changes',
          bodyContent: 'Are you sure you want to discard changes?',
          beforeClose: (close) => {
            // Do something before close
            return close()
          },
          beforeConfirm: (confirm) => {
            // Do something before confirm
            input1.value = null
            next(to)

            return confirm()
          },
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Discard',
          confirmButtonType: 'warning',
        })
      } else if (activeTab.value === 2 && to !== from && input2.value) {
        dialogVisible.value = true
        nextTab.value = to
      } else {
        next(to)
      }
    }

    const onBeforeConfirm = (confirm) => {
      input2.value = null
      activeTab.value = nextTab.value
      confirm()
    }
    return {
      activeTab,
      dialogVisible,
      input1,
      input2,
      onBeforeConfirm,
      onBeforeTabChange,
    }
  },
  template: `
    <div>
      <sm-tabs v-model:activeTab="activeTab" :show-underline="true" :before-tab-change="onBeforeTabChange">

        <sm-tab label="All">
          <div class="py-32 flex flex-wrap gap-8">
            <div v-for="i in 4" :key="i" style="width: 216px; height: 136px" class="bg-blue-neu-med" />
          </div>
        </sm-tab>

        <sm-tab label="Room types">
          <div class="py-32">
            <p>Type anything to trigger dialog as a service on tab change</p>
            <div style="max-width: 280px">
              <sm-input
                type="text"
                label="Input one"
                v-model="input1"
                placeholder="Placeholder..."
                name="input1"
              />
            </div>
          </div>
        </sm-tab>

        <sm-tab label="Rate plans">
          <div class="py-32">
            <p>Type anything to trigger dialog as a service on tab change</p>
            <div style="max-width: 280px">
              <sm-input
                type="text"
                label="Input two"
                v-model="input2"
                placeholder="Placeholder..."
                name="input2"
              />
            </div>
          </div>
        </sm-tab>

        <sm-tab label="Disabled" :disabled="true" />

      </sm-tabs>

      <sm-dialog
        v-model:visible="dialogVisible"
        confirm-button-type="warning"
        title="Unsaved changes"
        type="warning"
        :before-confirm="onBeforeConfirm"
      >
        <template v-slot:default>
          Are you sure you want to discard changes?
        </template>
      </sm-dialog>
    </div>
  `,
})

InterceptingTabChanges.storyName = 'Intercepting tab changes'

const interceptingTabChangesDescription = `
  Use the <code>before-tab-change</code> prop to intercept tab changes.

  The <code>before-tab-change accepts</code> a function which will be passed three arguments:
  1. <code>to</code> The index of the next tab
  2. <code>from</code> The index of the current tab
  3. <code>next</code> A callback to be called with the next index

  For instance

  <pre>
    const onBeforeTabChange = (to, from, next) => {
      // Do something
      next()
    }
  </pre>
`
InterceptingTabChanges.parameters = {
  docs: {
    description: {
      story: interceptingTabChangesDescription,
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

      <p>Below is an example of the SUI tabs and the brand tabs using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 304px; height: auto; min-width: 0"
          alt="Tabs default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 304px; height: auto; min-width: 0"
          alt="Tabs themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the tabs customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>
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
            <sm-table-td>List <span class="inline-block text-grey-neu-dark text-section-header">(Desktop only)</span></sm-table-td>
            <sm-table-td>
              border-bottom
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-tabs-list-border-bottom-height
                --sm-c-tabs-list-border-bottom-color-background
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>List <span class="inline-block text-grey-neu-dark text-section-header">(Tablet only)</span></sm-table-td>
            <sm-table-td>
              border
              <br/>
              border-radius
              <br/>
              box-shadow
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-tabs-list-border-tablet
                --sm-c-tabs-list-border-radius-tablet
                --sm-c-tabs-list-box-shadow-tablet
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Button</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-text
              <br/>
              font-size
              <br/>
              font-weight
              <br/>
              line-height
              <br/>
              letter-spacing
              <br/>
              text-transform
              <br/>
              padding
              <br/>
              outline-focus
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-tabs-button-color-background
                --sm-c-tabs-button-color-text
                --sm-c-tabs-button-font-size
                --sm-c-tabs-button-font-weight
                --sm-c-tabs-button-line-height
                --sm-c-tabs-button-letter-spacing
                --sm-c-tabs-button-text-transform
                --sm-c-tabs-button-padding
                --sm-c-tabs-button-outline-focus

                --sm-c-tabs-button-color-background-hover
                --sm-c-tabs-button-color-text-hover

                --sm-c-tabs-button-color-background-disabled
                --sm-c-tabs-button-color-text-disabled

                --sm-c-tabs-button-color-background-active
                --sm-c-tabs-button-color-text-active
                --sm-c-tabs-button-font-weight-active

                --sm-c-tabs-button-color-background-active-hover
                --sm-c-tabs-button-color-text-active-hover
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Button <span class="inline-block text-grey-neu-dark text-section-header">(Tablet overrides)</span></sm-table-td>
            <sm-table-td>
              font-size
              <br/>
              font-weight
              <br/>
              line-height
              <br/>
              letter-spacing
              <br/>
              text-transform
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-tabs-button-font-size-tablet
                --sm-c-tabs-button-font-weight-tablet
                --sm-c-tabs-button-line-height-tablet
                --sm-c-tabs-button-letter-spacing-tablet
                --sm-c-tabs-button-text-transform-tablet

                --sm-c-tabs-button-font-weight-tablet-active
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Button active indicator</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              height
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-tabs-button-active-indicator-color-background
                --sm-c-tabs-button-active-indicator-height
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Arrow <span class="inline-block text-grey-neu-dark text-section-header">(Tablet only)</span></sm-table-td>
            <sm-table-td>
              right
              <br/>
              top
              <br/>
              color-icon
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-tabs-arrow-right-tablet
                --sm-c-tabs-arrow-top-tablet
                --sm-c-tabs-arrow-color-icon-tablet
                --sm-c-tabs-arrow-icon-size
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Tab panel</sm-table-td>
            <sm-table-td>
              outline-focus
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-tabs-panel-outline-focus
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>
    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
