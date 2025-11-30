import { onMounted, ref, watch } from 'vue'
import vueRouter from 'storybook-vue3-router'
import { isPercyContext } from '../../../../../test/percy/helpers'
import SmAppHeader from '../sm-app-header.vue'
import { SmPropertyMenu } from '../../sm-property-menu'
import { SmUserMenu } from '../../sm-user-menu'
import { SmVerticalNav, SmVerticalNavItem, SmVerticalNavSection } from '../../sm-vertical-nav'
import { SmHorizontalNav, SmHorizontalNavItem } from '../../sm-horizontal-nav'
import { SmUserList, SmUserListItem } from '../../sm-user-list'
import { SmNav, SmNavItem } from '../../sm-nav'
import SmAppHeaderLink from '../sm-app-header-link.vue'
import { SmDivider } from '../../sm-divider'
import { SmDropdown } from '../../sm-dropdown'
import defaultExample from './images/app-header-default.png'
import themedExample from './images/app-header-themed.png'
import defaultTabletExample from './images/tablet-app-header-default.png'
import themedTabletExample from './images/tablet-app-header-themed.png'

/**
 * NOTE:
 *
 * We are expecting whitespace differences here against Vue2 which doesn't exist
 * in Goldeneyes with the whitespace preserve config in Vue3.
 *
 * Try to check back again once this is supported in Vue3 Storybook:
 * https://github.com/storybookjs/storybook/issues/18288
 * https://siteminder-jira.atlassian.net/browse/SUI-2176
 */

const EmptyComponent = () => ({
  template: '<div>Home</div>',
})
EmptyComponent.displayName = 'EmptyComponent'

export default {
  title: 'Components/App Header',
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
  component: SmAppHeader,
  subcomponents: {
    'sm-app-header-link': SmAppHeaderLink,
    'sm-horizontal-nav': SmHorizontalNav,
    'sm-horizontal-nav-item': SmHorizontalNavItem,
    'sm-nav': SmNav,
    'sm-nav-item': SmNavItem,
    'sm-property-menu': SmPropertyMenu,
    'sm-user-list': SmUserList,
    'sm-user-list-item': SmUserListItem,
    'sm-user-menu': SmUserMenu,
    'sm-vertical-nav': SmVerticalNav,
    'sm-vertical-nav-item': SmVerticalNavItem,
  },
}

export const Standard = () => ({
  components: {
    SmAppHeader,
    SmPropertyMenu,
    SmUserMenu,
    SmVerticalNav,
    SmVerticalNavItem,
    SmHorizontalNav,
    SmHorizontalNavItem,
    SmUserList,
    SmUserListItem,
    SmAppHeaderLink,
  },
  setup: () => {
    const selected = ref(true)
    const selected1 = ref(true)
    const selected2 = ref(false)
    return {
      selected,
      selected1,
      selected2,
      handleOpen: () => {
        console.info('Opened')
      },
      handleClose: () => {
        console.info('Closed')
      },
    }
  },
  template: `
  <article>
    <nav id="navigation" aria-label="Main" tabindex="-1">
      <sm-app-header
        logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
        logo-link="https://www.siteminder.com"
        partner-name="SiteMinder" page-title="SiteMinder">

        <template v-slot:property-menu>
          <sm-property-menu property-name="Cowan Hotel">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="Switch property" to="/switch-property" />
              <sm-vertical-nav-item label="Property setting" to="/property-settings" />
            </sm-vertical-nav>
          </sm-property-menu>
        </template>

        <template v-slot:help>
          <sm-user-menu display-name="Help" @open="handleOpen" @close="handleClose">
            <template v-slot:icon>
              <sm-icon style="color:#fff" name="utility-information" aria-hidden="true" />
            </template>
            <sm-vertical-nav>
              <sm-vertical-nav-item href="https://sui.siteminder.systems/?path=/story/components-vertical-nav--standard" label="Link 1" />
              <sm-vertical-nav-item to="/link" label="Link 2" />
            </sm-vertical-nav>
          </sm-user-menu>
        </template>

        <template v-slot:notification>
          <sm-user-menu display-name="Franklin Horne" min-width="372px">
            <template v-slot:display-name>
              <span>Mark all as read  <sm-badge type="warning" size="medium">5</sm-badge></span>
            </template>
            <template v-slot:icon>
              <sm-icon name="social-notifications" aria-hidden="true" />
            </template>
            <sm-user-list>
              <sm-user-list-item tag="button" :selected="selected">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  8 Nov 2020
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected1">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected2">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Dear customer, Uploading images have never been easier with the new release of Smart Upload. Connecting your hotel with Channel Manager can now be streamline. Then a further explanation will go here, so that. Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
            </sm-user-list>
            <div style="text-align:center; padding: 4px 0px">
              <sm-button type="text" suffix-icon="arrow-go-forward">View all notifications</sm-button>
            </div>
          </sm-user-menu>
        </template>

        <template v-slot:user-menu>
          <sm-user-menu display-name="Franklin Hornemin">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="My account" to="/" />
            </sm-vertical-nav>
          </sm-user-menu>
        </template>

        <template v-slot:nav>
          <sm-horizontal-nav>
            <sm-horizontal-nav-item to="/rooms-and-rates" label="Rooms & Rates" />
            <sm-horizontal-nav-item to="/distribution" label="Distributions" />
            <sm-horizontal-nav-item href="https://sui.siteminder.systems/?path=/story/components-vertical-nav--standard" label="External link">
              <template v-slot:icon>
                <sm-icon name="action-open-in-new" tabindex="-1" />
              </template>
            </sm-horizontal-nav-item>
          </sm-horizontal-nav>
        </template>

      </sm-app-header>

    </nav>

    <div id="mainContent" tabindex="-1">
    </div>

  </article>
  `,
})

const standardDescription = `
  The <code>sm-app-header</code> component is made up of a collection of components:
  <code>sm-property-menu</code>, <code>sm-user-menu</code>, <code>sm-horizontal-nav</code>, and <code>sm-vertical-nav</code>.

  Use the <code>property-menu</code> slot to display property-menu items.

  Use the <code>help</code> slot to display help icon.

  Use the <code>notification</code> slot to display notification section on header.

  Use the <code>user-menu</code> slot to display user menu items.

  Use the <code>nav</code> slot to display horizontal bar.
`
Standard.parameters = {
  docs: {
    description: {
      component: standardDescription,
    },
  },
  percy: {
    widths: [1025, 769],
  },
}

export const TabletNavigationNavItems = () => ({
  components: {
    SmAppHeader,
    SmPropertyMenu,
    SmUserMenu,
    SmVerticalNav,
    SmVerticalNavItem,
    SmHorizontalNav,
    SmHorizontalNavItem,
    SmUserList,
    SmUserListItem,
    SmNav,
    SmNavItem,
    SmAppHeaderLink,
    SmDivider,
  },
  setup: () => {
    const selected = ref(true)
    const selected1 = ref(true)
    const selected2 = ref(false)
    const title = ref('')
    const title1 = ref('')
    const navVisible = ref(false)
    const visibleLevelOne = ref(false)
    const visibleLevelTwo = ref(false)

    const handleClick = (label: string) => {
      console.info(`${label} clicked`)
    }

    return {
      selected,
      selected1,
      selected2,
      navVisible,
      visibleLevelOne,
      visibleLevelTwo,
      title,
      title1,
      handleClick,
    }
  },
  template: `
  <article>
    <nav id="navigation" aria-label="Main" tabindex="-1">
      <sm-app-header
        page-title="SiteMinder"
        logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
        logo-link="https://www.siteminder.com"
        partner-name="SiteMinder"
        isTablet
        :nav-visible="navVisible"
        @click="navVisible = true"
      >

        <template v-slot:property-menu>
          <sm-property-menu property-name="Cowan Hotel" :overflow-visible="true">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="Switch property" to="/switch-property" />
              <sm-vertical-nav-item label="Property setting" to="/property-settings" />
              <sm-vertical-nav-item label="Billing" to="/billing" hide-subnav-on-desktop>
                <template v-slot:header-subnav>
                  <sm-vertical-nav-item label="Link" to="/some-path" />
                  <sm-vertical-nav-item label="Subpath link" to="/billing/subpath" />
                  <sm-vertical-nav-item label="Button" @click="handleClick('Button')" />
                  <sm-vertical-nav-item label="Disabled" disabled />
                  <sm-vertical-nav-item label="External link" href="https://google.com" target="blank" prefix-icon="action-open-in-new" />
                </template>
              </sm-vertical-nav-item>
            </sm-vertical-nav>
          </sm-property-menu>
        </template>

        <template v-slot:help>
          <sm-app-header-link href="#" aria-label="Go to support">
            <template v-slot:icon>
              <sm-icon style="color:#fff" name="utility-information" aria-hidden="true" />
            </template>
          </sm-app-header-link>
        </template>

        <template v-slot:notification>
          <sm-user-menu display-name="Franklin Horne" min-width="372px">
            <template v-slot:display-name>
              <span>Mark all as read  <sm-badge type="warning" size="medium">5</sm-badge></span>
            </template>
            <template v-slot:icon>
              <sm-icon name="social-notifications" aria-hidden="true" />
            </template>
            <sm-user-list>
              <sm-user-list-item tag="button" :selected="selected">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  8 Nov 2020
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected1">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected2">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Dear customer, Uploading images have never been easier with the new release of Smart Upload. Connecting your hotel with Channel Manager can now be streamline. Then a further explanation will go here, so that. Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
            </sm-user-list>
            <div style="text-align:center; padding: 4px 0px">
              <sm-button type="text" suffix-icon="arrow-go-forward">View all notifications</sm-button>
            </div>
          </sm-user-menu>
        </template>

        <template v-slot:user-menu>
          <sm-user-menu display-name="Franklin Hornemin">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="My account" to="/" />
            </sm-vertical-nav>
          </sm-user-menu>
        </template>

        <template v-slot:nav>
          <sm-horizontal-nav>
            <sm-horizontal-nav-item to="/rooms-and-rates" label="Rooms & Rates" />
            <sm-horizontal-nav-item to="/distribution" label="Distributions" />

            <sm-horizontal-nav-item label="Direct Booking">
              <sm-vertical-nav>
                <sm-vertical-nav-item label="Promotions code" to="/setup/direct-booking/promotions" />
                <sm-vertical-nav-item label="Extras" to="/setup/direct-booking/extras" />
                <sm-vertical-nav-item label="Integrations" to="/setup/direct-booking/integrations" />
                <sm-vertical-nav-item label="Rates" to="/setup/direct-booking/room-types" />
                <sm-vertical-nav-item label="Rates 1" to="/setup/direct-booking/property" />
              </sm-vertical-nav>
            </sm-horizontal-nav-item>

            <sm-horizontal-nav-item label="Media">
              <sm-vertical-nav>
                <sm-vertical-nav-item label="Rooms" to="/setup/media/room-types" />
                <sm-vertical-nav-item label="Property" to="/setup/media/property" />
                <sm-vertical-nav-item label="Guest Marketing Info Table" to="/setup/media/marketing" />
              </sm-vertical-nav>
            </sm-horizontal-nav-item>

            <sm-horizontal-nav-item href="https://sui.siteminder.systems/?path=/story/components-vertical-nav--standard" label="External Link">
              <template v-slot:icon>
                <sm-icon name="action-open-in-new" tabindex="-1" />
              </template>
            </sm-horizontal-nav-item>

            <sm-horizontal-nav-item label="More Apps">
              <sm-vertical-nav>
                <sm-vertical-nav-item label="Property 1" to="/property-one" />
                <sm-vertical-nav-item label="Property 2" to="/property-two" />
                <sm-vertical-nav-item label="Property 3" to="/switch-property-1" />
                <sm-vertical-nav-item label="Property 4" to="/property-settings-11" />
                <sm-vertical-nav-item label="Property 5" to="/switch-property-2" />
                <sm-vertical-nav-item label="Property 6" to="/property-settings-2" />
                <sm-vertical-nav-item label="Property 7" to="/switch-property-3" />
                <sm-vertical-nav-item label="Property 8" to="/property-settings-3" />
              </sm-vertical-nav>
            </sm-horizontal-nav-item>
          </sm-horizontal-nav>
        </template>

        <template v-slot:tablet-navigation>
          <sm-nav
            content-class="sm-nav__fixed-width"
            logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
            title="SiteMinder"
            v-model:visible="navVisible"
          >

            <template #default>
              <sm-nav-item label="Dashboard" to="/setup/dashboard" data-sm-test-id="dashboard-link">
              </sm-nav-item>

              <sm-nav-item to="/rooms-and-rates" label="Rooms & Rates">
              </sm-nav-item>

              <sm-nav-item to="/distribution" label="Distributions">
              </sm-nav-item>

              <sm-nav-item label="Direct Booking" to="/setup/direct-booking" title="Direct Booking" @back="visibleLevelOne = false" @toggle="visibleLevelOne = true;">
                <sm-nav-item label="Promotions code" to="/setup/direct-booking/promotions" />
                <sm-nav-item label="Extras" to="/setup/direct-booking/extras" />
                <sm-nav-item label="Integrations" to="/setup/direct-booking/integrations" />
                <sm-nav-item label="Configuration" title="Configuration" @back="visibleLevelTwo = false" @toggle="visibleLevelTwo = true;">
                  <sm-nav-item label="Rates" to="/setup/direct-booking/room-types" />
                  <sm-nav-item label="Rates 1" to="/setup/direct-booking/property" />
                </sm-nav-item>
              </sm-nav-item>

              <sm-nav-item label="Media" title="Media" to="/setup/media" @back="visibleLevelOne = false" @toggle="visibleLevelOne = true;">
                <sm-nav-item label="Rooms" to="/setup/media/room-types" />
                <sm-nav-item label="Property" to="/setup/media/property" />
                <sm-nav-item label="Guest Marketing Info Table" to="/setup/media/marketing" />
              </sm-nav-item>

              <sm-nav-item href="https://sui.siteminder.systems/?path=/story/components-vertical-nav--standard" label="External Link">
                <template v-slot:suffix-icon>
                  <sm-icon name="action-open-in-new" aria-hidden="true" />
                </template>
              </sm-nav-item>

              <sm-nav-item label="More Apps" title="More Apps" @back="visibleLevelOne = false" @toggle="visibleLevelOne = true;">
                <sm-nav-item label="Property 1" to="/property-one" />
                <sm-nav-item label="Property 2" to="/property-two" />
                <sm-nav-item label="Property 3" to="/switch-property-1" />
                <sm-nav-item label="Property 4" to="/property-settings-11" />
                <sm-nav-item label="Property 5" to="/switch-property-2" />
                <sm-nav-item label="Property 6" to="/property-settings-2" />
                <sm-nav-item label="Property 7" to="/switch-property-3" />
                <sm-nav-item label="Property 8" to="/property-settings-3" />
              </sm-nav-item>

              <sm-nav-item :disabled="true" label="Disabled" :is-popover="true">
                <template v-slot:popover-content="slotProps">
                  <span style="z-index:1; cursor:pointer; position:absolute; right: 12px" @click="slotProps.close">
                    <sm-icon name="action-cross"/>
                  </span>
                  <div style="max-width: 320px; padding-right: 20px"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    <br>
                    <sm-icon name="utility-alert" class="mr-8" />
                    Are <em>you sure</em> you want to continue with <span style="font-weight: 600;">this</span>?
                  </div>
                </template>
              </sm-nav-item>

            </template>
          </sm-nav>
        </template>

      </sm-app-header>

    </nav>

    <div id="mainContent" tabindex="-1">
    </div>

  </article>
  `,
})

TabletNavigationNavItems.storyName = 'Tablet Navigation: Nav items'

const tabletNavigationNavItemsDescription = `
  Use the <code>isTablet</code> props in <code>sm-app-header</code> component to display the tablet header view for small screens <=1024.

  The <code>sm-app-header</code> component emits the <code>click</code> event to display navigation bar <code>sm-nav</code> component for tablet.

  Use the <code>navVisible</code> props in <code>sm-app-header</code> component to sync the visibility of tablet left navigation bar <code>sm-nav</code> component for display and accessibility purpose.

  Use <code>sm-nav</code> component to display small screen navigation bar inside <code>tablet-navigation</code> slot.

  The <code>sm-property-menu</code> component uses <code>isTablet</code> props to display the tablet navigation bar for small screens.

  The <code>sm-property-menu</code> component emits the <code>click</code> event to sync the visibility of the tablet right navigation bar <code>sm-nav</code> component.

  <strong>Please follow the <code>sm-nav</code> storybook <a href="https://sui.siteminder.systems/?path=/story/components-nav--standard" target="_blank">document</a> for more details</strong>

  Please note here, This is optional to use <code>sm-nav</code> component to display tablet version.

  Use the <code>header-subnav</code> slot in the <code>sm-vertical-nav-item</code> component to display the sub-navigation as a popover.

  Additionally, set <code>overflow-visible</code> to true in the<code>sm-property-menu</code> component to display <code>sm-vertical-nav-item</code> submenu items.
`
TabletNavigationNavItems.parameters = {
  docs: {
    description: {
      story: tabletNavigationNavItemsDescription,
    },
  },
  percy: {
    widths: [1025, 769],
  },
}

export const HorizontalNavigationDropdown = () => ({
  components: {
    SmAppHeader,
    SmPropertyMenu,
    SmUserMenu,
    SmVerticalNav,
    SmVerticalNavItem,
    SmHorizontalNav,
    SmHorizontalNavItem,
    SmUserList,
    SmUserListItem,
    SmAppHeaderLink,
  },
  setup: () => {
    const selected = ref(true)
    const selected1 = ref(true)
    const selected2 = ref(false)

    onMounted(() => {
      // Open dropdown during Percy visual testing
      // This is manually done here because we don't have a prop
      // that we can just set to true to display the hidden content
      if (isPercyContext()) {
        document.getElementById('more-apps-dropdown')?.querySelector('button')?.click()
      }
    })

    return {
      selected,
      selected1,
      selected2,
    }
  },
  template: `
  <article>
    <nav id="navigation" aria-label="Main" tabindex="-1">
      <sm-app-header
        logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
        logo-link="https://www.siteminder.com"
        partner-name="SiteMinder"
        page-title="SiteMinder"
      >

        <template v-slot:property-menu>
          <sm-property-menu property-name="Cowan Hotel">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="Switch property" to="/switch-property" />
              <sm-vertical-nav-item label="Property setting" to="/property-settings" />
            </sm-vertical-nav>
          </sm-property-menu>
        </template>

        <template v-slot:help>
          <sm-app-header-link href="#" aria-label="Go to support">
            <template v-slot:icon>
              <sm-icon style="color:#fff" name="utility-information" aria-hidden="true" />
            </template>
          </sm-app-header-link>
        </template>

        <template v-slot:notification>
          <sm-user-menu display-name="Franklin Horne" min-width="372px">
            <template v-slot:display-name>
              <span>Mark all as read  <sm-badge type="warning" size="medium">5</sm-badge></span>
            </template>
            <template v-slot:icon>
              <sm-icon name="social-notifications" aria-hidden="true" />
            </template>
            <sm-user-list>
              <sm-user-list-item tag="button" :selected="selected">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  8 Nov 2020
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected1">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected2">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Dear customer, Uploading images have never been easier with the new release of Smart Upload. Connecting your hotel with Channel Manager can now be streamline. Then a further explanation will go here, so that. Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
            </sm-user-list>
            <div style="text-align:center; padding: 4px 0px">
              <sm-button type="text" suffix-icon="arrow-go-forward">View all notifications</sm-button>
            </div>
          </sm-user-menu>
        </template>

        <template v-slot:user-menu>
          <sm-user-menu display-name="Franklin Hornemin">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="My account" to="/" />
            </sm-vertical-nav>
          </sm-user-menu>
        </template>

        <template v-slot:nav>
          <sm-horizontal-nav>
            <sm-horizontal-nav-item to="/rooms-and-rates" label="Rooms & Rates" />
            <sm-horizontal-nav-item to="/distribution" label="Distributions" />
            <sm-horizontal-nav-item label="More Apps">
              <sm-vertical-nav>
                <sm-vertical-nav-item label="Switch property" to="/switch-property" />
                <sm-vertical-nav-item label="Property setting" to="/property-settings" />
              </sm-vertical-nav>
            </sm-horizontal-nav-item>

            <sm-horizontal-nav-item href="https://sui.siteminder.systems/?path=/story/components-vertical-nav--standard" label="External link">
              <template v-slot:icon>
                <sm-icon name="action-open-in-new" tabindex="-1" />
              </template>
            </sm-horizontal-nav-item>

            <sm-horizontal-nav-item id="more-apps-dropdown" label="More Apps">
              <sm-vertical-nav>
                <sm-vertical-nav-item label="Property 1" to="/switch-property" />
                <sm-vertical-nav-item label="Property 2" to="/property-settings" />
                <sm-vertical-nav-item label="Property 3" to="/switch-property-1" />
                <sm-vertical-nav-item label="Property 4" to="/property-settings-11" />
                <sm-vertical-nav-item label="Property 5" to="/switch-property-2" />
                <sm-vertical-nav-item label="Property 6" to="/property-settings-2" />
                <sm-vertical-nav-item label="Property 7" to="/switch-property-3" />
                <sm-vertical-nav-item label="Property 8" to="/property-settings-3" />
              </sm-vertical-nav>
            </sm-horizontal-nav-item>
          </sm-horizontal-nav>
        </template>

      </sm-app-header>

    </nav>

    <div id="mainContent" tabindex="-1">
    </div>

  </article>
  `,
})

HorizontalNavigationDropdown.parameters = {
  docs: {
    description: {
      story: 'Use the <code>sm-horizontal-nav-item</code> component <code>default</code>slot to provide a sub-menu items for Horizontal navigation bar.',
    },
  },
  percy: {
    widths: [1025, 769],
    // Needed for the Percy setup steps in onMounted hook to run
    // Take note of the defaults when upgrading Storybook or Percy in the future
    // https://docs.percy.io/docs/storybook#unexpected-diffs
    enableJavascript: true,
  },
}

export const AppSwitcher = () => ({
  components: {
    SmAppHeader,
    SmPropertyMenu,
    SmUserMenu,
    SmVerticalNav,
    SmVerticalNavItem,
    SmHorizontalNav,
    SmHorizontalNavItem,
    SmUserList,
    SmUserListItem,
    SmAppHeaderLink,
  },
  setup: () => {
    const selected = ref(true)
    const selected1 = ref(true)
    const selected2 = ref(false)
    return {
      selected,
      selected1,
      selected2,
    }
  },
  template: `
  <article>
    <nav id="navigation" aria-label="Main" tabindex="-1">
      <sm-app-header
        logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
        logo-link="https://www.siteminder.com"
        partner-name="SiteMinder" page-title="SiteMinder">

        <template v-slot:property-menu>
          <sm-property-menu property-name="Cowan Hotel">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="Switch property" to="/switch-property" />
              <sm-vertical-nav-item label="Property setting" to="/property-settings" />
            </sm-vertical-nav>
          </sm-property-menu>
        </template>

        <template v-slot:help>
          <sm-user-menu display-name="Help">
            <template v-slot:icon>
              <sm-icon style="color:#fff" name="utility-information" aria-hidden="true" />
            </template>
            <sm-vertical-nav>
              <sm-vertical-nav-item href="https://sui.siteminder.systems/?path=/story/components-vertical-nav--standard" label="Link 1" />
              <sm-vertical-nav-item to="/link" label="Link 2" />
            </sm-vertical-nav>
          </sm-user-menu>
        </template>

        <template v-slot:notification>
          <sm-user-menu display-name="Franklin Horne" min-width="372px">
            <template v-slot:display-name>
              <span>Mark all as read  <sm-badge type="warning" size="medium">5</sm-badge></span>
            </template>
            <template v-slot:icon>
              <sm-icon name="social-notifications" aria-hidden="true" />
            </template>
            <sm-user-list>
              <sm-user-list-item tag="button" :selected="selected">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  8 Nov 2020
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected1">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected2">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Dear customer, Uploading images have never been easier with the new release of Smart Upload. Connecting your hotel with Channel Manager can now be streamline. Then a further explanation will go here, so that. Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
            </sm-user-list>
            <div style="text-align:center; padding: 4px 0px">
              <sm-button type="text" suffix-icon="arrow-go-forward">View all notifications</sm-button>
            </div>
          </sm-user-menu>
        </template>

        <template v-slot:app-switcher>
          <sm-user-menu display-name="my apps">
            <template v-slot:icon>
              <sm-icon style="color:#fff" name="section-app-switcher" aria-hidden="true" />
            </template>
            <sm-vertical-nav>
              <sm-vertical-nav-item to="/link" label="Link 2" prefix-icon="products-doorbell">
              </sm-vertical-nav-item>
              <sm-vertical-nav-item to="/link" label="Link 3" prefix-icon="products-distribution">
              </sm-vertical-nav-item>
              <sm-vertical-nav-item to="/link" label="Link 4" prefix-icon="products-booking-engine">
              </sm-vertical-nav-item>
            </sm-vertical-nav>
          </sm-user-menu>
        </template>

        <template v-slot:user-menu>
          <sm-user-menu display-name="Franklin Hornemin">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="My account" to="/" />
            </sm-vertical-nav>
          </sm-user-menu>
        </template>

        <template v-slot:nav>
          <sm-horizontal-nav>
            <sm-horizontal-nav-item to="/rooms-and-rates" label="Rooms & Rates" />
            <sm-horizontal-nav-item to="/distribution" label="Distributions" />
            <sm-horizontal-nav-item href="https://sui.siteminder.systems/?path=/story/components-vertical-nav--standard" label="External link">
              <template v-slot:icon>
                <sm-icon name="action-open-in-new" tabindex="-1" />
              </template>
            </sm-horizontal-nav-item>
          </sm-horizontal-nav>
        </template>

      </sm-app-header>

    </nav>

    <div id="mainContent" tabindex="-1">
    </div>

  </article>
  `,
})

AppSwitcher.storyName = 'App switcher'

AppSwitcher.parameters = {
  percy: {
    widths: [1025, 769],
  },
}

export const MenuOptionsWithLabel = () => ({
  components: {
    SmAppHeader,
    SmPropertyMenu,
    SmUserMenu,
    SmVerticalNav,
    SmVerticalNavItem,
    SmHorizontalNav,
    SmHorizontalNavItem,
    SmUserList,
    SmUserListItem,
    SmAppHeaderLink,
  },
  setup: () => {
    const selected = ref(true)
    const selected1 = ref(true)
    const selected2 = ref(false)
    return {
      selected,
      selected1,
      selected2,
    }
  },
  template: `
  <article>
    <nav id="navigation" aria-label="Main" tabindex="-1">
      <sm-app-header
        logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
        logo-link="https://www.siteminder.com"
        partner-name="SiteMinder" page-title="SiteMinder">

        <template v-slot:property-menu>
          <sm-property-menu property-name="Cowan Hotel">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="Switch property" to="/switch-property" />
              <sm-vertical-nav-item label="Property setting" to="/property-settings" />
            </sm-vertical-nav>
          </sm-property-menu>
        </template>

        <template v-slot:help>
          <sm-user-menu display-name="Help">
            <template v-slot:label>
              <span>Help</span>
            </template>
            <template v-slot:icon>
              <sm-icon name="utility-information" aria-hidden="true" />
            </template>
            <sm-vertical-nav>
              <sm-vertical-nav-item href="https://sui.siteminder.systems/?path=/story/components-vertical-nav--standard" label="Link 1" />
              <sm-vertical-nav-item to="/link" label="Link 2" />
            </sm-vertical-nav>
          </sm-user-menu>
        </template>

        <template v-slot:notification>
          <sm-user-menu display-name="Franklin Horne" min-width="372px">
            <template v-slot:display-name>
              <span>Mark all as read  <sm-badge type="warning" size="medium">5</sm-badge></span>
            </template>
            <template v-slot:icon>
              <sm-icon name="social-notifications" aria-hidden="true" />
            </template>
            <sm-user-list>
              <sm-user-list-item tag="button" :selected="selected">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  8 Nov 2020
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected1">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected2">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Dear customer, Uploading images have never been easier with the new release of Smart Upload. Connecting your hotel with Channel Manager can now be streamline. Then a further explanation will go here, so that. Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
            </sm-user-list>
            <div style="text-align:center; padding: 4px 0px">
              <sm-button type="text" suffix-icon="arrow-go-forward">View all notifications</sm-button>
            </div>
          </sm-user-menu>
        </template>

        <template v-slot:app-switcher>
          <sm-user-menu display-name="my apps">
            <template v-slot:label>
              My apps
            </template>
            <template v-slot:icon>
              <sm-icon name="section-app-switcher" aria-hidden="true" />
            </template>
            <sm-vertical-nav>
              <sm-vertical-nav-item to="/link" label="Link 2" prefix-icon="products-doorbell">
              </sm-vertical-nav-item>
              <sm-vertical-nav-item to="/link" label="Link 3" prefix-icon="products-distribution">
              </sm-vertical-nav-item>
              <sm-vertical-nav-item to="/link" label="Link 4" prefix-icon="products-booking-engine">
              </sm-vertical-nav-item>
            </sm-vertical-nav>
          </sm-user-menu>
        </template>

        <template v-slot:user-menu>
          <sm-user-menu display-name="Franklin Hornemin">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="My account" to="/" />
            </sm-vertical-nav>
          </sm-user-menu>
        </template>

        <template v-slot:nav>
          <sm-horizontal-nav>
            <sm-horizontal-nav-item to="/rooms-and-rates" label="Rooms & Rates" />
            <sm-horizontal-nav-item to="/distribution" label="Distributions" />
            <sm-horizontal-nav-item href="https://sui.siteminder.systems/?path=/story/components-vertical-nav--standard" label="External link">
              <template v-slot:icon>
                <sm-icon name="action-open-in-new" tabindex="-1" />
              </template>
            </sm-horizontal-nav-item>
          </sm-horizontal-nav>
        </template>
      </sm-app-header>
    </nav>
    <div id="mainContent" tabindex="-1">
    </div>
  </article>
  `,
})

MenuOptionsWithLabel.storyName = 'Menu options with label'

const menuOptionsWithLabelDescription = `
  Use the <code>label</code> slot in <code>sm-user-menu</code> to display the label accordingly
`

MenuOptionsWithLabel.parameters = {
  docs: {
    description: {
      story: menuOptionsWithLabelDescription,
    },
  },
  percy: {
    widths: [1025, 769],
  },
}

export const SmartGuide = () => ({
  components: {
    SmAppHeader,
    SmPropertyMenu,
    SmUserMenu,
    SmVerticalNav,
    SmVerticalNavItem,
    SmHorizontalNav,
    SmHorizontalNavItem,
    SmUserList,
    SmUserListItem,
    SmAppHeaderLink,
  },
  setup: () => {
    const selected = ref(true)
    const selected1 = ref(true)
    const selected2 = ref(false)
    const navVisible = ref(true)
    const visibleLevelOne = ref(false)
    const visibleLevelTwo = ref(false)

    const handleSmartGuideClick = () => {
      console.info('Smart guide clicked')
    }

    return {
      selected,
      selected1,
      selected2,
      navVisible,
      visibleLevelOne,
      visibleLevelTwo,
      handleSmartGuideClick,
    }
  },
  template: `
  <article>
    <nav id="navigation" aria-label="Main" tabindex="-1" class="mb-56">
      <sm-app-header
        logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
        logo-link="https://www.siteminder.com"
        partner-name="SiteMinder"
        page-title="SiteMinder"
        isTablet
        v-model:navVisible="navVisible"
        @click="navVisible = true"
      >

        <template v-slot:smart-guide>
          <sm-app-header-link
            :is-smart-guide="true"
            smart-guide-label="Smart guide"
            @click="handleSmartGuideClick()"
          >
            <template v-slot:icon>
              <sm-icon name="section-guide-sml" aria-hidden="true" />
            </template>
          </sm-app-header-link>
        </template>

        <template v-slot:property-menu>
          <sm-property-menu property-name="Cowan Hotel">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="Switch property" to="/switch-property" />
              <sm-vertical-nav-item label="Property setting" to="/property-settings" />
            </sm-vertical-nav>
          </sm-property-menu>
        </template>

        <template v-slot:help>
          <sm-user-menu display-name="Help">
            <template v-slot:icon>
              <sm-icon style="color:#fff" name="utility-information" aria-hidden="true" />
            </template>
            <sm-vertical-nav>
              <sm-vertical-nav-item href="https://sui.siteminder.systems/?path=/story/components-vertical-nav--standard" label="Link 1" />
              <sm-vertical-nav-item to="/link" label="Link 2" />
            </sm-vertical-nav>
          </sm-user-menu>
        </template>

        <template v-slot:notification>
          <sm-user-menu display-name="Franklin Horne" min-width="372px">
            <template v-slot:display-name>
              <span>Mark all as read  <sm-badge type="warning" size="medium">5</sm-badge></span>
            </template>
            <template v-slot:icon>
              <sm-icon name="social-notifications" aria-hidden="true" />
            </template>
            <sm-user-list>
              <sm-user-list-item tag="button" :selected="selected">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  8 Nov 2020
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected1">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected2">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Dear customer, Uploading images have never been easier with the new release of Smart Upload. Connecting your hotel with Channel Manager can now be streamline. Then a further explanation will go here, so that. Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
            </sm-user-list>
            <div style="text-align:center; padding: 4px 0px">
              <sm-button type="text" suffix-icon="arrow-go-forward">View all notifications</sm-button>
            </div>
          </sm-user-menu>
        </template>

        <template v-slot:user-menu>
          <sm-user-menu display-name="Franklin Hornemin">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="My account" to="/" />
            </sm-vertical-nav>
          </sm-user-menu>
        </template>

        <template v-slot:nav>
          <sm-horizontal-nav>
            <sm-horizontal-nav-item to="/rooms-and-rates" label="Rooms & Rates" />
            <sm-horizontal-nav-item to="/distribution" label="Distributions" />
            <sm-horizontal-nav-item href="https://sui.siteminder.systems/?path=/story/components-vertical-nav--standard" label="External link">
              <template v-slot:icon>
                <sm-icon name="action-open-in-new" tabindex="-1" />
              </template>
            </sm-horizontal-nav-item>
          </sm-horizontal-nav>
        </template>

        <template v-slot:tablet-navigation>
          <sm-nav
            content-class="sm-nav__fixed-width"
            logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
            title="SiteMinder"
            v-model:visible="navVisible"
            v-model:visibleLevelOne="visibleLevelOne"
            v-model:visibleLevelTwo="visibleLevelTwo"
          >

            <template v-slot:default>
              <sm-nav-item label="Dashboard" to="/setup/dashboard">
              </sm-nav-item>

              <sm-nav-item to="/rooms-and-rates" label="Rooms & Rates">
              </sm-nav-item>

              <sm-nav-item to="/distribution" label="Distributions">
              </sm-nav-item>

              <sm-nav-item href="https://sui.siteminder.systems/?path=/story/components-vertical-nav--standard" label="External Link">
                <template v-slot:suffix-icon>
                  <sm-icon name="action-open-in-new" aria-hidden="true" />
                </template>
              </sm-nav-item>

              <sm-divider v-show="!visibleLevelOne && !visibleLevelTwo" margin="0 24px" margin-top="8px" margin-bottom="8px" min-width="432px"></sm-divider>

              <sm-nav-item label="Smart guide" @click="handleSmartGuideClick()">
                <template v-slot:prefix-icon>
                  <sm-icon style="font-size: 20px; top: -1px" name="section-guide-lge" aria-hidden="true" />
                </template>
              </sm-nav-item>

              <sm-divider v-show="!visibleLevelOne && !visibleLevelTwo" margin="0 24px" margin-top="8px" margin-bottom="8px" min-width="432px"></sm-divider>

            </template>
          </sm-nav>
        </template>

      </sm-app-header>

    </nav>

    <div id="mainContent" tabindex="-1">
    </div>

  </article>
  `,
})

SmartGuide.storyName = 'Smart guide'

const smartGuideDescription = `
  Use the <code>smart-guide</code> slot to display the smart guide button.

  Use with <code>sm-app-header-link</code> with the following props:
  - <code>isSmartGuide</code> set to true to style it accordingly
  - <code>smartGuideLabel</code> to add visible text label


  On the nav's tablet mode (<code>isTablet</code>), the slot will be
  hidden from the header on smaller viewport. It should be added into
  the <code>tablet-navigation</code> instead.
`
SmartGuide.parameters = {
  docs: {
    description: {
      story: smartGuideDescription,
    },
  },
  percy: {
    widths: [1025, 769],
    // Smart guide JS calculation
    enableJavascript: true,
  },
}

export const PropertyMenuWithSubnav = () => ({
  components: {
    SmAppHeader,
    SmPropertyMenu,
    SmUserMenu,
    SmVerticalNav,
    SmVerticalNavItem,
    SmHorizontalNav,
    SmHorizontalNavItem,
    SmUserList,
    SmUserListItem,
    SmNav,
    SmNavItem,
    SmAppHeaderLink,
    SmDivider,
  },
  setup: () => {
    const headerConfig = ref(['app-switcher', 'help', 'notifications'])
    const selected = ref(true)
    const selected1 = ref(true)
    const selected2 = ref(false)
    const showAppSwitcher = ref()
    const showHelp = ref()
    const showNotifications = ref()
    const navVisible = ref(false)
    const visibleLevelOne = ref(false)
    const visibleLevelTwo = ref(false)

    const handleClick = (label: string) => {
      console.info(`${label} clicked`)
    }

    watch(
      () => headerConfig.value,
      () => {
        showAppSwitcher.value = headerConfig.value.includes('app-switcher')
        showHelp.value = headerConfig.value.includes('help')
        showNotifications.value = headerConfig.value.includes('notifications')
      },
      { immediate: true },
    )

    return {
      headerConfig,
      navVisible,
      selected,
      selected1,
      selected2,
      showAppSwitcher,
      showHelp,
      showNotifications,
      visibleLevelOne,
      visibleLevelTwo,
      handleClick,
    }
  },
  template: `
  <div>
    <nav id="navigation" aria-label="Main">
      <sm-app-header
        page-title="SiteMinder"
        logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
        logo-link="https://www.siteminder.com"
        partner-name="SiteMinder"
        isTablet
        v-model:navVisible="navVisible"
        @click="navVisible = true"
      >

        <template v-slot:property-menu>
          <sm-property-menu property-name="Park Hyatt Sydney" :overflow-visible="true">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="Switch property" to="/switch-property" />
              <sm-vertical-nav-item label="Property settings">
                <template v-slot:header-subnav>
                  <sm-vertical-nav-item label="General" to="/property-settings/general" />
                  <sm-vertical-nav-item label="Property details" to="/property-settings/property-details" />
                  <sm-vertical-nav-item label="Services" to="/property-settings/services" />
                  <sm-vertical-nav-item label="Policies" to="/property-settings/policies" />
                  <sm-vertical-nav-item label="Media library" to="/property-settings/media-library" />
                </template>
              </sm-vertical-nav-item>
              <sm-vertical-nav-item label="User management" to="/user-management" />
              <sm-vertical-nav-item label="Billing" to="/billing">
                <template v-slot:header-subnav>
                  <sm-vertical-nav-item label="Link" to="/some-path" />
                  <sm-vertical-nav-item label="Subpath link" to="/billing/subpath" />
                  <sm-vertical-nav-item label="Button" @click="handleClick('Button')" />
                  <sm-vertical-nav-item label="Disabled" disabled />
                  <sm-vertical-nav-item label="External link" href="https://google.com" target="blank" suffix-icon="action-open-in-new" />
                </template>
              </sm-vertical-nav-item>
            </sm-vertical-nav>
          </sm-property-menu>
        </template>

        <template v-slot:app-switcher v-if="showAppSwitcher">
          <sm-user-menu display-name="my apps">
            <template v-slot:icon>
              <sm-icon style="color:#fff" name="section-app-switcher" aria-hidden="true" />
            </template>
            <sm-vertical-nav>
              <sm-vertical-nav-item to="/link" label="Link 2" prefix-icon="products-doorbell">
              </sm-vertical-nav-item>
              <sm-vertical-nav-item to="/link" label="Link 3" prefix-icon="products-distribution">
              </sm-vertical-nav-item>
              <sm-vertical-nav-item to="/link" label="Link 4" prefix-icon="products-booking-engine">
              </sm-vertical-nav-item>
            </sm-vertical-nav>
          </sm-user-menu>
        </template>

        <template v-slot:help v-if="showHelp">
          <sm-app-header-link href="#" aria-label="Go to support">
            <template v-slot:icon>
              <sm-icon style="color:#fff" name="utility-information" aria-hidden="true" />
            </template>
          </sm-app-header-link>
        </template>

        <template v-slot:notification v-if="showNotifications">
          <sm-user-menu display-name="Franklin Horne" min-width="372px">
            <template v-slot:display-name>
              <span>Mark all as read  <sm-badge type="warning" size="medium">5</sm-badge></span>
            </template>
            <template v-slot:icon>
              <sm-icon name="social-notifications" aria-hidden="true" />
            </template>
            <sm-user-list>
              <sm-user-list-item tag="button" :selected="selected">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  8 Nov 2020
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected1">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected2">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Dear customer, Uploading images have never been easier with the new release of Smart Upload. Connecting your hotel with Channel Manager can now be streamline. Then a further explanation will go here, so that. Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
            </sm-user-list>
            <div style="text-align:center; padding: 4px 0px">
              <sm-button type="text" suffix-icon="arrow-go-forward">View all notifications</sm-button>
            </div>
          </sm-user-menu>
        </template>

        <template v-slot:user-menu>
          <sm-user-menu display-name="Franklin Hornemin">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="My account" to="/" />
            </sm-vertical-nav>
          </sm-user-menu>
        </template>

        <template v-slot:nav>
          <sm-horizontal-nav>
            <sm-horizontal-nav-item to="/rooms-and-rates" label="Rooms & Rates" />
            <sm-horizontal-nav-item to="/distribution" label="Distributions" />
            <sm-horizontal-nav-item label="More Apps">
              <sm-vertical-nav>
                <sm-vertical-nav-item label="Property 1" to="/property-one" />
                <sm-vertical-nav-item label="Property 2" to="/property-two" />
              </sm-vertical-nav>
            </sm-horizontal-nav-item>

            <sm-horizontal-nav-item label="Direct Booking">
              <sm-vertical-nav>
                <sm-vertical-nav-item label="Promotions code" to="/setup/direct-booking/promotions" />
                <sm-vertical-nav-item label="Extras" to="/setup/direct-booking/extras" />
                <sm-vertical-nav-item label="Integrations" to="/setup/direct-booking/integrations" />
                <sm-vertical-nav-item label="Rates" to="/setup/direct-booking/room-types" />
                <sm-vertical-nav-item label="Rates 1" to="/setup/direct-booking/property" />
              </sm-vertical-nav>
            </sm-horizontal-nav-item>

            <sm-horizontal-nav-item label="Media">
              <sm-vertical-nav>
                <sm-vertical-nav-item label="Rooms" to="/setup/media/room-types" />
                <sm-vertical-nav-item label="Property" to="/setup/media/property" />
                <sm-vertical-nav-item label="Guest Marketing Info Table" to="/setup/media/marketing" />
              </sm-vertical-nav>
            </sm-horizontal-nav-item>

            <sm-horizontal-nav-item href="https://sui.siteminder.systems/?path=/story/components-vertical-nav--standard" label="External link">
              <template v-slot:icon>
                <sm-icon name="action-open-in-new" tabindex="-1" />
              </template>
            </sm-horizontal-nav-item>
          </sm-horizontal-nav>
        </template>

        <template v-slot:tablet-navigation>
          <sm-nav
            content-class="sm-nav__fixed-width"
            logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
            title="SiteMinder"
            v-model:visible="navVisible"
            v-model:visibleLevelOne="visibleLevelOne"
            v-model:visibleLevelTwo="visibleLevelTwo"
          >

            <template v-slot:default>
              <sm-nav-item label="Dashboard" to="/setup/dashboard">
              </sm-nav-item>

              <sm-nav-item to="/rooms-and-rates" label="Rooms & Rates">
              </sm-nav-item>

              <sm-nav-item to="/distribution" label="Distributions">
              </sm-nav-item>

              <sm-nav-item label="More Apps" title="More Apps" @back="visibleLevelOne = false" @toggle="visibleLevelOne = true;">
                <sm-nav-item label="Property 1" to="/property-one" />
                <sm-nav-item label="Property 2" to="/property-two" />
              </sm-nav-item>

              <sm-nav-item label="Direct Booking" to="/setup/direct-booking" title="Direct Booking" @back="visibleLevelOne = false" @toggle="visibleLevelOne = true;">
                <sm-nav-item label="Promotions code" to="/setup/direct-booking/promotions" />
                <sm-nav-item label="Extras" to="/setup/direct-booking/extras" />
                <sm-nav-item label="Integrations" to="/setup/direct-booking/integrations" />
                <sm-nav-item label="Configuration" title="Configuration" @back="visibleLevelTwo = false" @toggle="visibleLevelTwo = true;">
                  <sm-nav-item label="Rates" to="/setup/direct-booking/room-types" />
                  <sm-nav-item label="Rates 1" to="/setup/direct-booking/property" />
                </sm-nav-item>
              </sm-nav-item>

              <sm-nav-item label="Media" title="Media" to="/setup/media" @back="visibleLevelOne = false" @toggle="visibleLevelOne = true;">
                <sm-nav-item label="Rooms" to="/setup/media/room-types" />
                <sm-nav-item label="Property" to="/setup/media/property" />
                <sm-nav-item label="Guest Marketing Info Table" to="/setup/media/marketing" />
              </sm-nav-item>

              <sm-nav-item href="https://sui.siteminder.systems/?path=/story/components-vertical-nav--standard" label="External link">
                <template v-slot:suffix-icon>
                  <sm-icon name="action-open-in-new" aria-hidden="true" />
                </template>
              </sm-nav-item>

              <sm-nav-item :disabled="true" label="Disabled" :is-popover="true">
                <template v-slot:popover-content="slotProps">
                  <span style="z-index:1; cursor:pointer; position:absolute; right: 12px" @click="slotProps.close">
                    <sm-icon name="action-cross"/>
                  </span>
                  <div style="max-width: 320px; padding-right: 20px"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    <br>
                    <sm-icon name="utility-alert" class="mr-8" />
                    Are <em>you sure</em> you want to continue with <span style="font-weight: 600;">this</span>?
                  </div>
                </template>
              </sm-nav-item>

            </template>
          </sm-nav>
        </template>

      </sm-app-header>

    </nav>

    <main id="mainContent" style="min-height: calc(100vh - 90px)">
      <sm-container>
        <sm-section>
        <sm-checkbox-group label="Header config" name="headerConfig">
          <sm-checkbox name="headerConfig" label="App Switcher" selected-value="app-switcher" v-model="headerConfig"></sm-checkbox>
          <sm-checkbox name="headerConfig" label="Help" selected-value="help" v-model="headerConfig"></sm-checkbox>
          <sm-checkbox name="headerConfig" label="Notifications" selected-value="notifications" v-model="headerConfig"></sm-checkbox>
        </sm-checkbox-group>
        </sm-section>
      </sm-container>
    </main>

  </div>
  `,
})

PropertyMenuWithSubnav.storyName = 'Property menu with subnav'

const propertyMenuWithSubnavDescription = `
  Use the <code>header-subnav</code> slot in the parent
  <code>sm-vertical-nav-item</code> component to display the
  sub-navigation as a popover.

  Additionally, set <code>overflow-visible</code> to true in
  <code>sm-property-menu</code> to allow popovers to overflow.

  The subnav will be placed in the right side of the parent nav item,
  but will automatically reposition to the left when it can't fit.

  On smaller screens like mobile, the submenu will overlay the parent
  nav item to keep it on screen.

  By default, the popover sub-navigation will show on all viewport. To
  hide it on larger screens (> 1024px), set <code>hide-subnav-on-desktop</code>
  to true.
`
PropertyMenuWithSubnav.parameters = {
  docs: {
    description: {
      story: propertyMenuWithSubnavDescription,
    },
  },
}

export const PageTitleAndSubtitle = () => ({
  components: {
    SmAppHeader,
    SmPropertyMenu,
    SmUserMenu,
    SmVerticalNav,
    SmVerticalNavItem,
    SmHorizontalNav,
    SmHorizontalNavItem,
    SmUserList,
    SmUserListItem,
    SmNav,
    SmNavItem,
    SmAppHeaderLink,
    SmDivider,
  },
  setup: () => {
    const selected = ref(true)
    const selected1 = ref(true)
    const selected2 = ref(false)
    const title = ref('')
    const title1 = ref('')
    const navVisible = ref(false)
    const visibleLevelOne = ref(false)
    const visibleLevelTwo = ref(false)

    return {
      selected,
      selected1,
      selected2,
      navVisible,
      visibleLevelOne,
      visibleLevelTwo,
      title,
      title1,
    }
  },
  template: `
  <article>
    <nav id="navigation" aria-label="Main">
      <sm-app-header
        page-title="Partner Name"
        page-subtitle="Powered by SiteMinder"
        partner-name="SiteMinder"
        logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
        logo-link="https://www.siteminder.com"
        :hide-logo-tablet="true"
        isTablet
        v-model:navVisible="navVisible"
        @click="navVisible = true"
      >

        <template v-slot:property-menu>
          <sm-property-menu class="hidden large-desktop:inline-block" property-name="Cowan Hotel" :overflow-visible="true">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="Switch property" to="/switch-property" />
              <sm-vertical-nav-item label="Property setting" to="/property-settings" />
              <sm-vertical-nav-item label="Billing" to="/billing" hide-subnav-on-desktop>
                <template v-slot:header-subnav>
                  <sm-vertical-nav-item label="Link" to="/some-path" />
                  <sm-vertical-nav-item label="Subpath link" to="/billing/subpath" />
                  <sm-vertical-nav-item label="Button" @click="handleClick('Button')" />
                  <sm-vertical-nav-item label="Disabled" disabled />
                  <sm-vertical-nav-item label="External link" href="https://google.com" target="blank" prefix-icon="action-open-in-new" />
                </template>
              </sm-vertical-nav-item>
            </sm-vertical-nav>
          </sm-property-menu>
        </template>

        <template v-slot:notification>
          <sm-user-menu display-name="Franklin Horne" min-width="372px">
            <template v-slot:display-name>
              <span>Mark all as read  <sm-badge type="warning" size="medium">5</sm-badge></span>
            </template>
            <template v-slot:icon>
              <sm-icon name="social-notifications" aria-hidden="true" />
            </template>
            <sm-user-list>
              <sm-user-list-item tag="button" :selected="selected">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  8 Nov 2020
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected1">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected2">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Dear customer, Uploading images have never been easier with the new release of Smart Upload. Connecting your hotel with Channel Manager can now be streamline. Then a further explanation will go here, so that. Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
            </sm-user-list>
            <div style="text-align:center; padding: 4px 0px">
              <sm-button type="text" suffix-icon="arrow-go-forward">View all notifications</sm-button>
            </div>
          </sm-user-menu>
        </template>

        <template v-slot:user-menu>
          <sm-user-menu display-name="Franklin Hornemin">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="My account" to="/" />
            </sm-vertical-nav>
          </sm-user-menu>
        </template>

        <template v-slot:tablet-navigation>
          <sm-nav
            content-class="sm-nav__fixed-width"
            logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
            title="Partner Name"
            v-model:visible="navVisible"
            v-model:visibleLevelOne="visibleLevelOne"
            v-model:visibleLevelTwo="visibleLevelTwo"
          >

            <template v-slot:default>
              <sm-nav-item label="Dashboard" to="/setup/dashboard">
              </sm-nav-item>

              <sm-nav-item to="/rooms-and-rates" label="Rooms & Rates">
              </sm-nav-item>

              <sm-nav-item to="/distribution" label="Distributions">
              </sm-nav-item>

              <sm-nav-item label="More Apps" title="More Apps" @back="visibleLevelOne = false" @toggle="visibleLevelOne = true;">
                <sm-nav-item label="Property 1" to="/property-one" />
                <sm-nav-item label="Property 2" to="/property-two" />
              </sm-nav-item>

              <sm-nav-item label="Direct Booking" to="/setup/direct-booking" title="Direct Booking" @back="visibleLevelOne = false" @toggle="visibleLevelOne = true;">
                <sm-nav-item label="Promotions code" to="/setup/direct-booking/promotions" />
                <sm-nav-item label="Extras" to="/setup/direct-booking/extras" />
                <sm-nav-item label="Integrations" to="/setup/direct-booking/integrations" />
                <sm-nav-item label="Configuration" title="Configuration" @back="visibleLevelTwo = false" @toggle="visibleLevelTwo = true;">
                  <sm-nav-item label="Rates" to="/setup/direct-booking/room-types" />
                  <sm-nav-item label="Rates 1" to="/setup/direct-booking/property" />
                </sm-nav-item>
              </sm-nav-item>

              <sm-nav-item label="Media" title="Media" to="/setup/media" @back="visibleLevelOne = false" @toggle="visibleLevelOne = true;">
                <sm-nav-item label="Rooms" to="/setup/media/room-types" />
                <sm-nav-item label="Property" to="/setup/media/property" />
                <sm-nav-item label="Guest Marketing Info Table" to="/setup/media/marketing" />
              </sm-nav-item>

              <sm-nav-item href="https://sui.siteminder.systems/?path=/story/components-vertical-nav--standard" label="External link">
                <template v-slot:suffix-icon>
                  <sm-icon name="action-open-in-new" aria-hidden="true" />
                </template>
              </sm-nav-item>

              <sm-nav-item :disabled="true" label="Disabled" :is-popover="true">
                <template v-slot:popover-content="slotProps">
                  <span style="z-index:1; cursor:pointer; position:absolute; right: 12px" @click="slotProps.close">
                    <sm-icon name="action-cross"/>
                  </span>
                  <div style="max-width: 320px; padding-right: 20px"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    <br>
                    <sm-icon name="utility-alert" class="mr-8" />
                    Are <em>you sure</em> you want to continue with <span style="font-weight: 600;">this</span>?
                  </div>
                </template>
              </sm-nav-item>

            </template>
          </sm-nav>
        </template>

      </sm-app-header>

    </nav>

    <main id="mainContent"></main>

  </article>
  `,
})

PageTitleAndSubtitle.storyName = 'Page title and subtitle'

const pageTitleAndSubtitleDescription = `
  Use the <code>page-title</code> and <code>page-subtitle</code> props in <code>sm-app-header</code> component to display titles on the main header.

  By default, these titles are hidden in tablet mode.

  Use <code>title</code> prop in <code>sm-nav</code> to display the title in the tablet navigation.

  In addition, use <code>hide-logo-tablet</code> prop in <code>sm-app-header</code> to hide the logo in tablet mode.
`
PageTitleAndSubtitle.parameters = {
  docs: {
    description: {
      story: pageTitleAndSubtitleDescription,
    },
  },
  percy: {
    widths: [1025, 769],
  },
}

export const TabletNavigationVerticalNavItems = () => ({
  components: {
    SmAppHeader,
    SmPropertyMenu,
    SmUserMenu,
    SmVerticalNav,
    SmVerticalNavItem,
    SmHorizontalNav,
    SmHorizontalNavItem,
    SmUserList,
    SmUserListItem,
    SmNav,
    SmNavItem,
    SmAppHeaderLink,
    SmDivider,
    SmVerticalNavSection,
    SmDropdown,
  },
  setup: () => {
    const selected = ref(true)
    const selected1 = ref(true)
    const selected2 = ref(false)
    const title = ref('')
    const title1 = ref('')
    const navVisible = ref(true)
    const visibleLevelOne = ref(false)
    const visibleLevelTwo = ref(false)

    return {
      selected,
      selected1,
      selected2,
      navVisible,
      visibleLevelOne,
      visibleLevelTwo,
      title,
      title1,
    }
  },
  template: `
  <article>
    <nav id="navigation" aria-label="Main">
      <sm-app-header
        page-title="Partner Name"
        page-subtitle="Powered by SiteMinder"
        partner-name="SiteMinder"
        logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
        logo-link="https://www.siteminder.com"
        title-link="https://www.siteminder.com"
        :hide-logo-tablet="true"
        isTablet
        v-model:navVisible="navVisible"
        @click="navVisible = true"
      >

        <template v-slot:property-menu>
          <sm-property-menu class="hidden large-desktop:inline-block" property-name="Cowan Hotel" :overflow-visible="true">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="Switch property" to="/switch-property" />
              <sm-vertical-nav-item label="Property setting" to="/property-settings" />
              <sm-vertical-nav-item label="Billing" to="/billing" hide-subnav-on-desktop>
                <template v-slot:header-subnav>
                  <sm-vertical-nav-item label="Link" to="/some-path" />
                  <sm-vertical-nav-item label="Subpath link" to="/billing/subpath" />
                  <sm-vertical-nav-item label="Button" @click="handleClick('Button')" />
                  <sm-vertical-nav-item label="Disabled" disabled />
                  <sm-vertical-nav-item label="External link" href="https://google.com" target="blank" prefix-icon="action-open-in-new" />
                </template>
              </sm-vertical-nav-item>
            </sm-vertical-nav>
          </sm-property-menu>
        </template>

        <template v-slot:notification>
          <sm-user-menu display-name="Franklin Horne" min-width="372px">
            <template v-slot:display-name>
              <span>Mark all as read  <sm-badge type="warning" size="medium">5</sm-badge></span>
            </template>
            <template v-slot:icon>
              <sm-icon name="social-notifications" aria-hidden="true" />
            </template>
            <sm-user-list>
              <sm-user-list-item tag="button" :selected="selected">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  8 Nov 2020
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected1">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
              <sm-user-list-item tag="button" :selected="selected2">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p class="sm-text--small">Dear customer, Uploading images have never been easier with the new release of Smart Upload. Connecting your hotel with Channel Manager can now be streamline. Then a further explanation will go here, so that. Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  Yesterday
                </template>
              </sm-user-list-item>
            </sm-user-list>
            <div style="text-align:center; padding: 4px 0px">
              <sm-button type="text" suffix-icon="arrow-go-forward">View all notifications</sm-button>
            </div>
          </sm-user-menu>
        </template>

        <template v-slot:user-menu>
          <sm-user-menu display-name="Franklin Hornemin">
            <sm-vertical-nav>
              <sm-vertical-nav-item label="My account" to="/" />
            </sm-vertical-nav>
          </sm-user-menu>
        </template>

        <template v-slot:tablet-navigation>
          <sm-nav
            content-class="w-320"
            logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
            title="Partner Name"
            logo-link="https://www.siteminder.com"
            v-model:visible="navVisible"
            v-model:visibleLevelOne="visibleLevelOne"
            v-model:visibleLevelTwo="visibleLevelTwo"
          >
            <template v-slot:subheader="{ closeNav }">
              <sm-dropdown rootClass="pl-8 pt-8 pr-8 pb-8">
                <template v-slot:label="{ visible }">
                  NSW
                  <sm-icon class="ml-12" :name="visible ? 'arrow-up' : 'arrow-down'" />
                </template>
                <template v-slot:default="{ close: closeDropdown }">
                  <sm-vertical-nav>
                    <sm-vertical-nav-item label="ACT" to="/setup/act" @toggle="closeDropdown" />
                    <sm-vertical-nav-item label="VC" to="/setup/vc" @toggle="closeDropdown" />
                    <sm-vertical-nav-item label="QLD" to="/setup/qld" disabled @toggle="closeDropdown" />
                    <sm-vertical-nav-item label="WA" disabled @toggle="closeDropdown" />
                    <sm-vertical-nav-item label="Close nav" @toggle="closeNav" />
                  </sm-vertical-nav>
                </template>
              </sm-dropdown>
            </template>

            <template v-slot:vertical-nav="{ closeNav }">
              <sm-vertical-nav>

                <sm-vertical-nav-section>

                  <sm-vertical-nav-item label="Properties" to="/setup/properties" @toggle="closeNav" />

                  <sm-vertical-nav-item label="Media" to="/setup/media">

                    <sm-vertical-nav-item label="Rooms" to="/setup/media/rooms" @toggle="closeNav" />
                    <sm-vertical-nav-item label="Property" to="/setup/media/property" @toggle="closeNav" />
                    <sm-vertical-nav-item label="Guest Marketing Info Table" to="/setup/media/property1" disabled @toggle="closeNav" />

                  </sm-vertical-nav-item>

                  <!-- Use the 'href' prop to send the user to an external URL -->
                  <sm-vertical-nav-item label="Terms & Conditions" href="https://terms-and-conditions.com" />

                  <!-- Providing neither a "to" or "href" prop will render an HTML button -->
                  <sm-vertical-nav-item label="Text in here" />
                  <sm-vertical-nav-item label="Text in here" />
                  <sm-vertical-nav-item label="Text in here" />

                  <sm-vertical-nav-item label="Button with close" @toggle="closeNav" />
                  <sm-vertical-nav-item label="Disabled link" to="/disabled" disabled @toggle="closeNav" />
                  <sm-vertical-nav-item label="Disabled button" disabled @toggle="closeNav" />

                </sm-vertical-nav-section>

              </sm-vertical-nav>
            </template>
            <template v-slot:footer="{ closeNav }">
              <sm-vertical-nav>
                <sm-vertical-nav-item label="Admin" prefix-icon="action-settings" @toggle="closeNav" />
              </sm-vertical-nav>
            </template>
          </sm-nav>
        </template>

      </sm-app-header>

    </nav>

    <main id="mainContent"></main>

  </article>
  `,
})

TabletNavigationVerticalNavItems.storyName = 'Tablet Navigation: Vertical nav items'

const tabletNavigationVerticalNavItemsDescription = `
  To embedded vertical navigation inside the <code>sm-nav</code> component for tablet, use <code>vertical-nav</code> slots instead of default slot.

  Use <code>subheader</code> and <code>footer</code> slots with <code>vertical-nav</code> slot to add sub heading and footer.

  Please note, at the moment <code>subheader</code> and <code>footer</code> slots are only available with vertical navigation <code>vertical-nav</code> slot.

  Use <code>closeNav</code> slot props to close the <code>sm-nav</code> when needed. For example, call the function when a <code>vertical-nav-item</code> emits a <code>toggle</code> event.
`
TabletNavigationVerticalNavItems.parameters = {
  docs: {
    description: {
      story: tabletNavigationVerticalNavItemsDescription,
    },
  },
  percy: {
    widths: [769],
  },
}

export const StylingHooks = () => ({
  components: {
    SmAppHeader,
    SmPropertyMenu,
    SmUserMenu,
    SmVerticalNav,
    SmVerticalNavItem,
    SmHorizontalNav,
    SmHorizontalNavItem,
    SmUserList,
    SmUserListItem,
    SmNav,
    SmNavItem,
    SmAppHeaderLink,
    SmDivider,
  },
  setup: () => {
    const defaultImage = defaultExample
    const themedImage = themedExample
    const defaultTabletImage = defaultTabletExample
    const themedTabletImage = themedTabletExample

    return {
      defaultImage,
      defaultTabletImage,
      themedImage,
      themedTabletImage,
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

      <p>Below is an example of the SUI app-header and the brand app-header using Styling hooks</p>

      <h4 class="sm-h5">Default</h4>
      <div class="flex items-center gap-24 mb-16">
        <img
          style="width: 100%; max-width: 440px; height: auto; min-width: 0"
          alt="App-header default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 440px; height: auto; min-width: 0"
          alt="App-header themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <h4 class="sm-h5">Tablet navigation</h4>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 360px; height: auto; min-width: 0; border: 1px solid #c6d0e0"
          alt="Tablet app-header default example"
          class="block mb-16 flex-1"
          :src="defaultTabletImage"
        />
        <img
          style="width: 100%; max-width: 360px; height: auto; min-width: 0; border: 1px solid #c6d0e0"
          alt="Tablet app-header themed example"
          class="block mb-16 flex-1"
          :src="themedTabletImage"
        />
      </div>


      <p>Below are the app-header customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>
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
            <sm-table-th colspan="3">App header</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Container</sm-table-td>
            <sm-table-td>
              color-border
              <br/>
              border-width
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-color-border
                --sm-c-app-header-border-width
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Top bar</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              padding-y
              <br/>
              padding-x
              <br/>
              min-height
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-top-bar-color-background
                --sm-c-app-header-top-bar-padding-y
                --sm-c-app-header-top-bar-padding-x
                --sm-c-app-header-top-bar-min-height
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Logo</sm-table-td>
            <sm-table-td>
              margin
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-logo-margin
                --sm-c-app-header-logo-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Tablet navigation toggle</sm-table-td>
            <sm-table-td>
              icon-size
              <br/>
              margin
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-toggle-icon-size
                --sm-c-app-header-toggle-margin
                --sm-c-app-header-toggle-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Page title</sm-table-td>
            <sm-table-td>
              color-text
              <br/>
              font-size
              <br/>
              line-height
              <br/>
              letter-spacing
              <br/>
              padding-left
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-page-title-color-text
                --sm-c-app-header-page-title-font-size
                --sm-c-app-header-page-title-line-height
                --sm-c-app-header-page-title-letter-spacing
                --sm-c-app-header-page-title-padding-left
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Page subtitle</sm-table-td>
            <sm-table-td>
              color-text
              <br/>
              font-size
              <br/>
              line-height
              <br/>
              letter-spacing
              <br/>
              padding-left
              <br/>
              margin-left
              <br/>
              color-border-left
              <br/>
              border-left-width
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-page-subtitle-color-text
                --sm-c-app-header-page-subtitle-font-size
                --sm-c-app-header-page-subtitle-line-height
                --sm-c-app-header-page-subtitle-letter-spacing
                --sm-c-app-header-page-subtitle-padding-left
                --sm-c-app-header-page-subtitle-margin-left
                --sm-c-app-header-page-subtitle-color-border-left
                --sm-c-app-header-page-subtitle-border-left-width
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Menus (logo, tablet nav toggle, property menu, user, notification, app switcher, help, help link)</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>
              Common
            </sm-table-td>
            <sm-table-td>
              padding <span class="text-grey-neu-dark text-section-header">(outer padding for app switcher, help, notification and user)</span>
              <br/>
              color-background
              <br/>
              color-border
              <br/>
              color-text
              <br/>
              icon-size <span class="text-grey-neu-dark text-section-header">(app switcher, help, notification, user)</span>
              <br/>
              border-radius
              <br/>
              color-outline
              <br/>
              color-outline-width
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-menu-padding
                --sm-c-app-header-menu-color-background
                --sm-c-app-header-menu-color-border
                --sm-c-app-header-menu-color-text
                --sm-c-app-header-menu-icon-size
                --sm-c-app-header-menu-border-radius

                --sm-c-app-header-menu-color-background-hover
                --sm-c-app-header-menu-color-text-hover

                --sm-c-app-header-menu-color-background-focus
                --sm-c-app-header-menu-color-text-focus
                --sm-c-app-header-menu-color-outline-focus
                --sm-c-app-header-menu-color-outline-width-focus
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">User menu (user, notification, app switcher, help)</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              display-name-color-text <span class="text-grey-neu-dark text-section-header">(text on trigger when menu is opened)</span>
              <br/>
              display-name-font-size
              <br/>
              display-name-color-weight
              <br/>
              items-top <span class="text-grey-neu-dark text-section-header">(placement of the dropdown)</span>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-user-menu-display-name-color-text
                --sm-c-app-header-user-menu-display-name-font-size
                --sm-c-app-header-user-menu-display-name-font-weight
                --sm-c-app-header-user-menu-items-top
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">App header link (help link, smart guide)</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              margin
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-link-margin
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Smart guide</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-text
              <br/>
              color-border
              <br/>
              font-size
              <br/>
              icon-size
              <br/>
              margin-right
              <br/>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-link-smart-guide-color-background
                --sm-c-app-header-link-smart-guide-color-text
                --sm-c-app-header-link-smart-guide-color-border
                --sm-c-app-header-link-smart-guide-border-radius
                --sm-c-app-header-link-smart-guide-font-size
                --sm-c-app-header-link-smart-guide-icon-size
                --sm-c-app-header-link-smart-guide-margin-right

                --sm-c-app-header-link-smart-guide-color-background-hover
                --sm-c-app-header-link-smart-guide-color-text-hover

                --sm-c-app-header-link-smart-guide-color-background-focus
                --sm-c-app-header-link-smart-guide-color-text-focus

                --sm-c-app-header-link-smart-guide-color-background-clicked
                --sm-c-app-header-link-smart-guide-color-text-clicked
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Property menu</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              font-size
              <br/>
              icon-size
              <br/>
              letter-spacing
              <br/>
              top <span class="text-grey-neu-dark text-section-header">(placement within the top bar)</span>
              <br/>
              items-top <span class="text-grey-neu-dark text-section-header">(placement of the vertical nav container)</span>
              <br/>
              indicator-margin-left <span class="text-grey-neu-dark text-section-header">(arrow icon)</span>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-property-menu-font-size
                --sm-c-app-header-property-menu-icon-size
                --sm-c-app-header-property-menu-letter-spacing
                --sm-c-app-header-property-menu-top
                --sm-c-app-header-property-menu-items-top
                --sm-c-app-header-property-menu-indicator-margin-left
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Notification (user list item)</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-border
              <br/>
              indicator-color-background
              <br/>
              indicator-color-border
              <br/>
              indicator-border-radius
              <br/>
              indicator-height
              <br/>
              indicator-width
              <br/>
              indicator-top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-notification-color-background
                --sm-c-app-header-notification-color-border
                --sm-c-app-header-notification-indicator-color-background
                --sm-c-app-header-notification-indicator-color-border
                --sm-c-app-header-notification-indicator-border-radius
                --sm-c-app-header-notification-indicator-height
                --sm-c-app-header-notification-indicator-width
                --sm-c-app-header-notification-indicator-top

                --sm-c-app-header-notification-color-background-hover

                --sm-c-app-header-notification-color-background-selected
                --sm-c-app-header-notification-indicator-color-background-selected
                --sm-c-app-header-notification-indicator-color-border-selected

                --sm-c-app-header-notification-indicator-color-background-warning
                --sm-c-app-header-notification-indicator-color-border-warning
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Vertical nav (property menu, app switcher, notification, help, user, horizontal nav)</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Container</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-border
              <br/>
              border-radius
              <br/>
              button-color-border <span class="text-grey-neu-dark text-section-header">(menu button when in opened state)</span>
              <br/>
              button-color-background
              <br/>
              button-color-text
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-vertical-nav-color-background
                --sm-c-app-header-vertical-nav-color-border
                --sm-c-app-header-vertical-nav-border-radius
                --sm-c-app-header-vertical-nav-button-color-border-open
                --sm-c-app-header-vertical-nav-button-color-background-open
                --sm-c-app-header-vertical-nav-button-color-text-open
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Nav item</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-text
              <br/>
              color-border
              <br/>
              font-weight
              <br/>
              font-size
              <br/>
              indicator-color
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-vertical-nav-item-color-text
                --sm-c-app-header-vertical-nav-item-color-background
                --sm-c-app-header-vertical-nav-item-color-border
                --sm-c-app-header-vertical-nav-item-font-weight
                --sm-c-app-header-vertical-nav-item-font-size

                --sm-c-app-header-vertical-nav-item-color-text-hover
                --sm-c-app-header-vertical-nav-item-color-background-hover

                --sm-c-app-header-vertical-nav-item-color-text-focus
                --sm-c-app-header-vertical-nav-item-color-background-focus

                --sm-c-app-header-vertical-nav-item-color-text-disabled
                --sm-c-app-header-vertical-nav-item-color-background-disabled

                --sm-c-app-header-vertical-nav-item-color-text-active
                --sm-c-app-header-vertical-nav-item-color-background-active
                --sm-c-app-header-vertical-nav-item-font-weight-active
                --sm-c-app-header-vertical-nav-item-indicator-color-active

                --sm-c-app-header-vertical-nav-item-indicator-color-exact-active
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Horizontal nav</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Container</sm-table-td>
            <sm-table-td>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-horizontal-nav-color-background
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Nav item</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-text
              <br/>
              font-weight
              <br/>
              font-size
              <br/>
              indicator-color
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-horizontal-nav-item-color-background
                --sm-c-app-header-horizontal-nav-item-color-text
                --sm-c-app-header-horizontal-nav-item-font-weight
                --sm-c-app-header-horizontal-nav-item-font-size

                --sm-c-app-header-horizontal-nav-item-color-background-hover
                --sm-c-app-header-horizontal-nav-item-color-text-hover

                --sm-c-app-header-horizontal-nav-item-color-background-active
                --sm-c-app-header-horizontal-nav-item-color-text-active
                --sm-c-app-header-horizontal-nav-item-font-weight-active
                --sm-c-app-header-horizontal-nav-item-indicator-color-active

                --sm-c-app-header-horizontal-nav-item-indicator-color-exact-active

                --sm-c-app-header-horizontal-nav-item-color-background-open
                --sm-c-app-header-horizontal-nav-item-color-text-open
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Tablet nav</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              box-shadow
              <br/>
              color-text
              <br/>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-tablet-nav-underlay-color-background
                --sm-c-app-header-tablet-nav-box-shadow

                --sm-c-app-header-tablet-nav-list-color-background
                --sm-c-app-header-tablet-nav-list-color-text
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Header</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              border-bottom
              <br/>
              padding
              <br/>
              height
              <br/>
              color-text
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-tablet-nav-header-color-background
                --sm-c-app-header-tablet-nav-header-border-bottom
                --sm-c-app-header-tablet-nav-header-padding
                --sm-c-app-header-tablet-nav-header-height
                --sm-c-app-header-tablet-nav-header-title-color-text

                --sm-c-app-header-tablet-nav-close-button-color-text
                --sm-c-app-header-tablet-nav-close-button-color-background
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Subheader</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              border-bottom
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-tablet-nav-subheader-color-background
                --sm-c-app-header-tablet-nav-subheader-border-bottom
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Footer</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              border-top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-tablet-nav-footer-color-background
                --sm-c-app-header-tablet-nav-footer-border-top
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Tablet: nav item</sm-table-td>
            <sm-table-td>
              disabled
              <br/>
              color-background
              <br/>
              color-text
              <br/>
              active-indicator
              <br/>
              padding
              <br/>
              border-bottom
              <br/>
              height
              <br/>
              width
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-tablet-nav-item-color-text-disabled

                --sm-c-app-header-tablet-nav-item-color-background

                --sm-c-app-header-tablet-nav-item-active-indicator-color
                --sm-c-app-header-tablet-nav-item-color-background-active
                --sm-c-app-header-tablet-nav-item-color-background-hover

                --sm-c-app-header-tablet-nav-sub-menu-heading-padding
                --sm-c-app-header-tablet-nav-sub-menu-heading-color-background
                --sm-c-app-header-tablet-nav-sub-menu-heading-color-text
                --sm-c-app-header-tablet-nav-sub-menu-heading-border-bottom
                --sm-c-app-header-tablet-nav-sub-menu-heading-height
                --sm-c-app-header-tablet-nav-sub-menu-heading-title-width

                --sm-c-app-header-tablet-nav-sub-menu-heading-left-button-color-background
                --sm-c-app-header-tablet-nav-sub-menu-heading-left-button-color-text
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Tablet: vertical nav item</sm-table-td>
            <sm-table-td>
              padding
              <br/>
              color-background
              <br/>
              color-text
              <br/>
              active-indicator
              <br/>
              padding
              <br/>
              border-bottom
              <br/>
              right
              <br/>
              top
              <br/>
              hover
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-app-header-tablet-vertical-nav-padding-top
                --sm-c-app-header-tablet-vertical-nav-item-active-indicator-color

                --sm-c-app-header-tablet-vertical-nav-item-color-background-active
                --sm-c-app-header-tablet-vertical-nav-item-color-text-active

                --sm-c-app-header-tablet-vertical-nav-item-color-background-hover
                --sm-c-app-header-tablet-vertical-nav-item-color-text-hover

                --sm-c-app-header-tablet-vertical-nav-item-padding

                --sm-c-app-header-tablet-vertical-nav-item-toggle-button-right
                --sm-c-app-header-tablet-vertical-nav-item-toggle-button-top
                --sm-c-app-header-tablet-vertical-nav-item-toggle-button-color-background-active
                --sm-c-app-header-tablet-vertical-nav-item-toggle-button-color-text
                --sm-c-app-header-tablet-vertical-nav-item-toggle-button-color-background-hover
              </code>
            </sm-table-td>
          </sm-table-tr>

        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
