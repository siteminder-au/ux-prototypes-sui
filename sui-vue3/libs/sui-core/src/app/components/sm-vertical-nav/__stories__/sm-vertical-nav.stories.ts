import vueRouter from 'storybook-vue3-router'
import SmVerticalNav from '../sm-vertical-nav.vue'
import SmVerticalNavItem from '../sm-vertical-nav-item.vue'
import SmVerticalNavSection from '../sm-vertical-nav-section.vue'
import SmAside from '../../sm-aside/sm-aside.vue'
import defaultExample from './images/aside-default.png'
import themedExample from './images/aside-themed.png'

const EmptyComponent = () => ({
  template: '<div>Home</div>',
})
EmptyComponent.displayName = 'EmptyComponent'

export default {
  title: 'Components/Vertical Nav',
  decorators: [
    // See: https://corechasm.com/addons/storybook-vue3-router
    // Match all routes so we can test the active state of the nav items
    vueRouter([{
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: EmptyComponent,
    }]),
  ],
  component: SmAside,
  subcomponents: {
    'sm-vertical-nav': SmVerticalNav,
    'sm-vertical-nav-item': SmVerticalNavItem,
    'sm-vertical-nav-section': SmVerticalNavSection,
  },
}

export const Standard = () => ({
  components: {
    SmVerticalNav,
    SmVerticalNavItem,
    SmVerticalNavSection,
    SmAside,
  },
  setup: () => {
    const logEvent = (eventName: string): void => {
      console.info(`Clicked ${eventName}`)
    }

    return { logEvent }
  },
  template: `
    <sm-aside>

      <sm-vertical-nav>

        <sm-vertical-nav-section label="Property Setup">

          <sm-vertical-nav-item label="General" to="/setup/general" data-sm-test-id="test-id-general" />
          <sm-vertical-nav-item label="Details" to="/setup/details" data-sm-test-id="test-id-details" />
          <sm-vertical-nav-item
            label="With Badge"
            to="/setup/details1"
            :suffix-badge="{ text: 'New', config: { type: 'success' } }"
          />
          <sm-vertical-nav-item
            label="With Prefix Icon"
            to="/setup/details2"
            prefix-icon="action-article"
          />
          <sm-vertical-nav-item
            label="With Suffix Icon"
            to="/setup/details3"
            suffix-icon="action-open-in-new"
          />
          <sm-vertical-nav-item
            label="Icon+Badge"
            to="/setup/details4"
            prefix-icon="action-article"
            :suffix-badge="{ text: 'New', config: { type: 'success' } }"
          />
          <sm-vertical-nav-item
            label="Icon+Badge"
            to="/setup/details5"
            suffix-icon="action-open-in-new"
            :suffix-badge="{ text: 'New', config: { type: 'success' } }"
          />
          <sm-vertical-nav-item
            label="All"
            to="/setup/details6"
            prefix-icon="action-article"
            suffix-icon="action-open-in-new"
            :suffix-badge="{ text: 'New', config: { type: 'success' } }"
          />
          <sm-vertical-nav-item
            label="This is a very long nav item"
            to="/setup/details7"
            suffix-icon="action-open-in-new"
            :suffix-badge="{ text: 'New', config: { type: 'success' } }"
          />

        </sm-vertical-nav-section>

        <sm-vertical-nav-section label="Media">

          <sm-vertical-nav-item label="Media" to="/setup/media">
            <sm-vertical-nav-item label="Rooms" to="/setup/media/rooms"/>
            <sm-vertical-nav-item label="Property" to="/setup/media/property"/>
            <sm-vertical-nav-item label="Guest Marketing Info Table" to="/setup/media/property1" />

            <sm-vertical-nav-item
              label="With Badge"
              to="/setup/details"
              :suffix-badge="{ text: 'New', config: { type: 'success' } }"
            />
            <sm-vertical-nav-item
              label="With Prefix Icon"
              to="/setup/details2"
              prefix-icon="action-article"
            />
            <sm-vertical-nav-item
              label="With Suffix Icon"
              to="/setup/details3"
              suffix-icon="action-open-in-new"
            />
            <sm-vertical-nav-item
              label="Icon+Badge"
              to="/setup/details4"
              prefix-icon="action-article"
              :suffix-badge="{ text: 'New', config: { type: 'success' } }"
            />
            <sm-vertical-nav-item
              label="Icon+Badge"
              to="/setup/details5"
              suffix-icon="action-open-in-new"
              :suffix-badge="{ text: 'New', config: { type: 'success' } }"
            />
            <sm-vertical-nav-item
              label="All"
              to="/setup/details6"
              prefix-icon="action-article"
              suffix-icon="action-open-in-new"
              :suffix-badge="{ text: 'New', config: { type: 'success' } }"
            />
            <sm-vertical-nav-item
              label="This is a very long nav item"
              to="/setup/details7"
              suffix-icon="action-open-in-new"
              :suffix-badge="{ text: 'New', config: { type: 'success' } }"
            />
          </sm-vertical-nav-item>

        </sm-vertical-nav-section>

        <sm-vertical-nav-section label="Resources">

          <!-- Use the 'href' prop to send the user to an external URL -->
          <sm-vertical-nav-item label="Terms & Conditions" href="https://terms-and-conditions.com" />

          <!-- Providing neither a "to" or "href" prop will render an HTML button -->
          <sm-vertical-nav-item label="Logout" @click="logEvent('logout')" />

          <sm-vertical-nav-item label="Disabled" disabled @click="logEvent('disabled')" />

        </sm-vertical-nav-section>

      </sm-vertical-nav>

    </sm-aside>
  `,
})

Standard.parameters = {}

export const ActiveItems = () => ({
  components: {
    SmVerticalNav,
    SmVerticalNavItem,
    SmVerticalNavSection,
    SmAside,
  },
  template: `
    <sm-aside>

      <sm-vertical-nav>

        <sm-vertical-nav-section label="Property Setup">

          <sm-vertical-nav-item force-active-state="in-active" label="General" to="/setup/general" />
          <sm-vertical-nav-item force-active-state="exact-active" label="Details" to="/setup/details" />

        </sm-vertical-nav-section>

        <sm-vertical-nav-section label="Media">

          <sm-vertical-nav-item label="Media" to="/setup/media">

            <!-- Make this item "exact-active" whenever it's to prop is "active" -->
            <sm-vertical-nav-item :force-active-state="(isActive) => isActive ? 'active' : 'in-active'" label="Rooms" to="/setup/media/room-types" />

            <!-- Make this item "active" whenever it's to prop is "exact-active" -->
            <sm-vertical-nav-item :force-active-state="(isActive, isExactActive) => isExactActive ? 'exact-active' : 'in-active'" label="Property" to="/setup/media/property" />

          </sm-vertical-nav-item>

        </sm-vertical-nav-section>

        <sm-vertical-nav-section label="Others">

          <sm-vertical-nav-item to="/content-slot">

            <template #content>
              Content slot
            </template>

          </sm-vertical-nav-item>

        </sm-vertical-nav-section>

      </sm-vertical-nav>

    </sm-aside>
  `,
})

const activeItemsDescription = `
  By default the "active" state of an item is determined based on the current URL and the <code>to</code> prop.

  For example, if the current URL path is <code>/foo/bar</code>:
  - and the <code>to</code> prop is set to <code>/foo</code> the item will be considered <strong>active</strong>.
  - and the <code>to</code> prop is set to <code>/foo/bar</code> the item will be considered <strong>exact-active</strong>.
  - and the <code>to</code> prop is set to <code>/bar</code> the item will be considered <strong>in-active</strong>.

  If your use case requires more control though or you are using <code>href</code> instead of <code>to</code>,
  you can force the active state using the <code>force-active-state</code> prop.
`
ActiveItems.storyName = 'Active items'

ActiveItems.parameters = {
  docs: {
    description: {
      story: activeItemsDescription,
    },
  },
}

export const NonCollapsable = () => ({
  components: {
    SmVerticalNav,
    SmVerticalNavItem,
    SmVerticalNavSection,
    SmAside,
  },
  template: `
    <sm-aside :is-collapsable="false">
      <sm-vertical-nav>

        <sm-vertical-nav-section label="Property Setup">

          <sm-vertical-nav-item force-active-state="in-active" label="General" to="/setup/general" />
          <sm-vertical-nav-item force-active-state="exact-active" label="Details" to="/setup/details" />

        </sm-vertical-nav-section>

        <sm-vertical-nav-section label="Media">

          <sm-vertical-nav-item label="Media" to="/setup/media">

            <!-- Make this item "exact-active" whenever it's to prop is "active" -->
            <sm-vertical-nav-item :force-active-state="(isActive) => isActive ? 'active' : 'in-active'" label="Rooms" to="/setup/media/room-types" />

            <!-- Make this item "active" whenever it's to prop is "exact-active" -->
            <sm-vertical-nav-item :force-active-state="(isActive, isExactActive) => isExactActive ? 'exact-active' : 'in-active'" label="Property" to="/setup/media/property" />

          </sm-vertical-nav-item>

        </sm-vertical-nav-section>

      </sm-vertical-nav>
    </sm-aside>
  `,
})

NonCollapsable.storyName = 'Non-collapsable'

NonCollapsable.parameters = {
  docs: {
    description: {
      story: 'Set <code>is-collapsable</code> prop in <code>sm-aside</code> to control whether the aside component can be collapsed or not.',
    },
  },
}

export const FooterScrollablePage = () => ({
  components: {
    SmVerticalNav,
    SmVerticalNavItem,
    SmVerticalNavSection,
    SmAside,
  },
  template: `
    <div class="flex" style=" border: 1px solid #c6d0e0">
      <div>
        <sm-aside id="navigation">
          <sm-vertical-nav>
            <sm-vertical-nav-item label="Properties">
              <sm-vertical-nav-item label="All properties" to="/properties/all" />
              <sm-vertical-nav-item label="Brands" to="/properties/brands" />
              <sm-vertical-nav-item label="Clusters" to="/properties/clusters" />
            </sm-vertical-nav-item>

            <sm-vertical-nav-item label="Distribution" to="/distribution" />
            <sm-vertical-nav-item label="Direct booking" to="/direct-booking" />
            <sm-vertical-nav-item label="Insights" to="/insights" />
            <sm-vertical-nav-item label="Health check" to="/health-check" />
          </sm-vertical-nav>

          <template v-slot:footer>
            <sm-vertical-nav>
              <sm-vertical-nav-item label="Admin" prefix-icon="action-settings" to="/admin" />
            </sm-vertical-nav>
          </template>
        </sm-aside>
      </div>

      <main id="mainContent" style="flex: 1">
        <sm-section style="height: 1600px">
          <sm-container>
            Scrollable page
          </sm-container>
        </sm-section>
      </main>
    </div>
  `,
})

const footerScrollablePageDescription = `
  Use <code>footer</code> slot in <code>sm-aside</code> to add content at the bottom of the component.
  To optimize the styles further use <code>footer-class</code> prop to attach a custom CSS class.
`

FooterScrollablePage.storyName = 'Footer: Scrollable page'

FooterScrollablePage.parameters = {
  docs: {
    description: {
      story: footerScrollablePageDescription,
    },
  },
}

export const FooterScrollableContent = () => ({
  components: {
    SmVerticalNav,
    SmVerticalNavItem,
    SmVerticalNavSection,
    SmAside,
  },
  template: `
    <!-- Subtract 30px because of storybook's padding -->
    <div class="flex" style="height: min(calc(100vh - 30px), 600px); border: 1px solid #c6d0e0">
      <div>
        <sm-aside id="navigation" min-height="auto">
          <sm-vertical-nav style="overflow-y: scroll">
            <sm-vertical-nav-item label="Properties">
              <sm-vertical-nav-item label="All properties" to="/properties/all" />
              <sm-vertical-nav-item label="Brands" to="/properties/brands" />
              <sm-vertical-nav-item label="Clusters" to="/properties/clusters" />
            </sm-vertical-nav-item>

            <sm-vertical-nav-item label="Distribution" to="/distribution" />
            <sm-vertical-nav-item label="Direct booking" to="/direct-booking" />
            <sm-vertical-nav-item label="Insights" to="/insights" />
            <sm-vertical-nav-item label="Health check" to="/health-check" />
          </sm-vertical-nav>

          <template v-slot:footer>
            <sm-vertical-nav>
              <sm-vertical-nav-item label="Admin" prefix-icon="action-settings" to="/admin" />
            </sm-vertical-nav>
          </template>
        </sm-aside>
      </div>

      <main id="mainContent" style="flex: 1; overflow-y: scroll">
        <sm-section style="height: 1600px">
          <sm-container>
            <span tabindex="0">Scrollable content</span>
          </sm-container>
        </sm-section>
      </main>
    </div>
  `,
})

const FooterScrollableContentDescription = `
  Use <code>footer</code> slot in <code>sm-aside</code> to add content at the bottom of the component.


  To optimize the styles further use <code>footer-class</code> prop to attach a custom CSS class.


  If the aside component will be placed inside a container with fixed height and a scrollable content,
  set <code>sm-aside</code>'s <code>min-height</code> prop to auto or preferred height.
  By default, the min-height is <code>100vh</code>.


  In addition, if the main navigation (default slot) has tendency to get longer than the container's height,
  set the overflow to scroll.
`
FooterScrollableContent.storyName = 'Footer: Scrollable content'

FooterScrollableContent.parameters = {
  docs: {
    description: {
      story: FooterScrollableContentDescription,
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

      <sm-toast class="mt-32">
        For the <span style="font-weight: 600;">app-header</span> vertical nav, please use the
        <a href="/?path=/story/components-app-header--styling-hooks">app-header tokens</a>.
        For the <span style="font-weight: 600;">dropdown</span> vertical nav, please use the
        <a href="/?path=/story/components-dropdown--styling-hooks">dropdown tokens</a>.
        Otherwise, refer to the documentation below.
      </sm-toast>

      <p>Below is an example of the SUI and branded aside with vertical-nav and using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 230px; height: auto; min-width: 0"
          alt="Aside and vertical-nav default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 230px; height: auto; min-width: 0"
          alt="Aside and vertical-nav themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the aside with vertical-nav customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>
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
            <sm-table-th colspan="3">Container (sm-aside)</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              color-text
              <br/>
              color-background
              <br/>
              padding-top
              <br/>
              width
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-aside-color-text
                --sm-c-aside-color-background
                --sm-c-aside-padding-top
                --sm-c-aside-width
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Toggle button</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-icon
              <br/>
              color-border
              <br/>
              border-width
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-aside-toggle-color-icon
                --sm-c-aside-toggle-color-background
                --sm-c-aside-toggle-color-border
                --sm-c-aside-toggle-border-width

                --sm-c-aside-toggle-color-icon-hover
                --sm-c-aside-toggle-color-background-hover

                --sm-c-aside-toggle-color-icon-focus
                --sm-c-aside-toggle-color-background-focus
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Inner shadow
              <span class="block text-grey-neu-dark text-section-header">(Box-shadow or solid border)</span>
            </sm-table-td>
            <sm-table-td>
              width
              <br/>
              background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-aside-content-shadow-width
                --sm-c-aside-content-shadow-background

                --sm-c-aside-content-shadow-background-hover
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Footer
            </sm-table-td>
            <sm-table-td>
              background
              <br/>
              border-top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-aside-footer-color-background
                --sm-c-aside-footer-border-top
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Nav Item (sm-vertical-nav-item)</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>
              Common
            </sm-table-td>
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
              >--sm-c-aside-vertical-nav-item-color-text
                --sm-c-aside-vertical-nav-item-color-background
                --sm-c-aside-vertical-nav-item-font-weight
                --sm-c-aside-vertical-nav-item-font-size

                --sm-c-aside-vertical-nav-item-color-text-hover
                --sm-c-aside-vertical-nav-item-color-background-hover

                --sm-c-aside-vertical-nav-item-color-text-focus
                --sm-c-aside-vertical-nav-item-color-background-focus

                --sm-c-aside-vertical-nav-item-color-text-active
                --sm-c-aside-vertical-nav-item-color-background-active
                --sm-c-aside-vertical-nav-item-font-weight-active

                --sm-c-aside-vertical-nav-item-color-text-disabled
                --sm-c-aside-vertical-nav-item-color-background-disabled
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>
              Indicator
            </sm-table-td>
            <sm-table-td>
              color
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-aside-vertical-nav-item-color-indicator-active
                --sm-c-aside-vertical-nav-item-color-indicator-exact-active
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Popover
            </sm-table-td>
            <sm-table-td>
              color-border
              <br/>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-aside-vertical-nav-item-popover-color-border
                --sm-c-aside-vertical-nav-item-popover-color-background
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Nav Section (sm-vertical-nav-section)</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>
              Common
            </sm-table-td>
            <sm-table-td>
              padding-top
              <span class="block text-grey-neu-dark text-section-header">(Space between section)</span>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-aside-vertical-nav-section-padding-top
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>
              Label
            </sm-table-td>
            <sm-table-td>
              color-text
              <br/>
              font-size
              <br/>
              font-weight
              <br/>
              margin-bottom
              <br/>
              padding-left
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-aside-vertical-nav-section-label-color-text
                --sm-c-aside-vertical-nav-section-label-font-size
                --sm-c-aside-vertical-nav-section-label-font-weight
                --sm-c-aside-vertical-nav-section-label-margin-bottom
                --sm-c-aside-vertical-nav-section-label-padding-left
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
  info: false,
}
