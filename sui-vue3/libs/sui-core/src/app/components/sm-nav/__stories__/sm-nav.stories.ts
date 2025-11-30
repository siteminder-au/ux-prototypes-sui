import { ref } from 'vue'
import vueRouter from 'storybook-vue3-router'
import SmNav from '../sm-nav.vue'
import SmVerticalNav from '../../sm-vertical-nav/sm-vertical-nav.vue'
import SmVerticalNavItem from '../../sm-vertical-nav/sm-vertical-nav-item.vue'
import { SmUserMenu } from '../../sm-user-menu'
import { SmUserList, SmUserListItem } from '../../sm-user-list'
import SmNavItem from '../sm-nav-item.vue'
import SmDivider from '../../sm-divider/sm-divider.vue'
import SmPopover from '../../sm-popover/sm-popover.vue'

const EmptyComponent = () => ({
  template: '<div>Home</div>',
})
EmptyComponent.displayName = 'EmptyComponent'

export default {
  title: 'Components/Nav',
  decorators: [
    // See: https://corechasm.com/addons/storybook-vue3-router
    // Match all routes so we can test the active state of the nav items
    vueRouter([{
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: EmptyComponent,
    }]),
  ],
  component: SmNav,
  subcomponents: {
    'sm-nav-item': SmNavItem,
    'sm-divider': SmDivider,
    'sm-popover': SmPopover,
    'sm-user-list': SmUserList,
    'sm-user-list-item': SmUserListItem,
    'sm-user-menu': SmUserMenu,
    'sm-vertical-nav': SmVerticalNav,
    'sm-vertical-nav-item': SmVerticalNavItem,
  },
}

export const Standard = () => ({
  components: {
    SmNav,
    SmVerticalNav,
    SmVerticalNavItem,
    SmUserMenu,
    SmUserList,
    SmUserListItem,
    SmNavItem,
    SmDivider,
  },
  setup: () => {
    const title = ref('')
    const selected = ref(true)
    const selected1 = ref(true)
    const selected2 = ref(false)
    const navVisible = ref(true)

    return {
      navVisible,
      title,
      selected,
      selected1,
      selected2,
    }
  },
  template: `
    <div>
      <sm-nav
        content-class="sm-nav__fixed-width"
        logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
        title="SiteMinder"
        v-model:visible="navVisible"
      >

        <template v-slot:default>
          <sm-nav-item label="Dashboard" to="/setup/dashboard">
          </sm-nav-item>

          <sm-nav-item to="/rooms-and-rates" label="Rooms & Rates">
          </sm-nav-item>

          <sm-nav-item to="/distribution" label="Distributions">
          </sm-nav-item>

          <sm-nav-item label="More Apps" title="More Apps" nav-item-id="more-apps">
            <sm-nav-item label="Property 1" to="/property-one" :parent-nav-items="['more-apps']"/>
            <sm-nav-item label="Property 2" to="/property-two" :parent-nav-items="['more-apps']"/>
          </sm-nav-item>

          <sm-nav-item label="Direct Booking" to="/setup/direct-booking" title="Direct Booking" nav-item-id="direct-booking">
            <sm-nav-item label="Promotions code" to="/setup/direct-booking/promotions" :parent-nav-items="['direct-booking']"/>
            <sm-nav-item label="Extras" to="/setup/direct-booking/extras" :parent-nav-items="['direct-booking']"/>
            <sm-nav-item label="Integrations" to="/setup/direct-booking/integrations" :parent-nav-items="['direct-booking']"/>
            <sm-nav-item label="Configuration" title="Configuration" nav-item-id="configuration">
              <sm-nav-item label="Rates" to="/setup/direct-booking/room-types" :parent-nav-items="['direct-booking', 'configuration']"/>
              <sm-nav-item label="Rates 1" to="/setup/direct-booking/property" :parent-nav-items="['direct-booking', 'configuration']"/>
            </sm-nav-item>
          </sm-nav-item>

          <sm-nav-item label="Media" title="Media" to="/setup/media" nav-item-id="media">
            <sm-nav-item label="Rooms" to="/setup/media/room-types" :parent-nav-items="['media']"/>
            <sm-nav-item label="Property" to="/setup/media/property" :parent-nav-items="['media']"/>
            <sm-nav-item label="Guest Marketing Info Table" to="/setup/media/marketing" :parent-nav-items="['media']"/>
          </sm-nav-item>

          <sm-nav-item href="https://sui.siteminder.systems/?path=/story/components-vertical-nav--standard" label="External Links">
            <template v-slot:suffix-icon>
              <sm-icon name="action-open-in-new" aria-hidden="true" />
            </template>
          </sm-nav-item>

          <sm-divider margin="0 24px" margin-top="8px" margin-bottom="8px" min-width="432px"></sm-divider>

          <sm-nav-item label="Property settings" to="/property-settings2">
          </sm-nav-item>

        </template>
      </sm-nav>
      <sm-button @click="navVisible = true" type="primary">Open nav</sm-button>
    </div>
  `,
})

const standardDescription = `
  The navigation bar component is made up of below components to display the list items:
  <code>sm-nav-item</code>.

  Control the visibility of the <sm-nav> component using the <code>visible</code> prop combined with v-model.

  Use the <code>logo</code> and/or <code>title</code> props to add header image and title on the main nav.

  The <code>sm-nav</code> component contains <code>sm-nav-item</code> component to display first level of nav items.

  It is recommended to only use <code>sm-nav-item</code> components inside <code>sm-nav</code>

  Use the <code>to</code> and <code>href</code> props in <code>sm-nav-item</code> component to turn the list item into an anchor element or <code>router-link</code> component.

  Use the <code>title</code> props to add custom title of the list item

  To enable the right sub nav menus to appear when users come from a deep link, ensure you have set <code>navItemId</code> and <code>parentNavItems</code> props in <code>sm-nav-item</code>
`
Standard.parameters = {
  docs: {
    description: {
      component: standardDescription,
    },
  },
}

export const SlideRight = () => ({
  components: {
    SmNav,
    SmVerticalNav,
    SmVerticalNavItem,
    SmUserMenu,
    SmUserList,
    SmUserListItem,
    SmNavItem,
    SmDivider,
  },
  setup: () => {
    const title = ref('')
    const selected = ref(true)
    const selected1 = ref(true)
    const selected2 = ref(false)
    const navVisible = ref(true)

    return {
      navVisible,
      title,
      selected,
      selected1,
      selected2,
    }
  },
  template: `
    <div>
      <sm-nav v-model:visible="navVisible" title="Park Hyatt Sydney" content-class="sm-nav__fixed-width" transition="right">
        <sm-nav-item label="Switch property" to="/switch-property">
        </sm-nav-item>
        <sm-nav-item label="Property settings" to="/property-settings2">
        </sm-nav-item>
      </sm-nav>
      <sm-button @click="navVisible = true" type="primary">Open nav</sm-button>
    </div>
  `,
})

SlideRight.storyName = 'Slide right'

SlideRight.parameters = {
  docs: {
    description: {
      story: 'Use the <code>transition</code> props for left/right transition.',
    },
  },
}

export const Disabled = () => ({
  components: {
    SmNav,
    SmPopover,
    SmVerticalNav,
    SmVerticalNavItem,
    SmUserMenu,
    SmUserList,
    SmUserListItem,
    SmNavItem,
    SmDivider,
  },
  setup: () => {
    const title = ref('')
    const selected = ref(true)
    const selected1 = ref(true)
    const selected2 = ref(false)
    const navVisible = ref(true)

    return {
      navVisible,
      title,
      selected,
      selected1,
      selected2,
    }
  },
  template: `
    <div>
      <sm-nav
        content-class="sm-nav__fixed-width"
        logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
        title="SiteMinder"
        v-model:visible="navVisible"
      >

        <template v-slot:default>
          <sm-nav-item label="Dashboard" to="/setup/dashboard">
          </sm-nav-item>

          <sm-nav-item :disabled="true" label="Reservations" :is-popover="true">
            <template v-slot:popover-content="slotProps">
              <span style="z-index:1; cursor:pointer; position:absolute; right: 12px" @click="slotProps.close">
                <sm-icon name="action-cross"/>
              </span>
              <div style="width: 320px; padding-right: 20px"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                <br>
                <sm-icon name="utility-alert" class="mr-8" />
                Are <em>you sure</em> you want to continue with <span style="font-weight: 600;">this</span>?
              </div>
            </template>
          </sm-nav-item>

          <sm-nav-item label="Reservations with popover" :is-popover="true">
            <template v-slot:popover-content="slotProps">
              <span style="z-index:1; cursor:pointer; position:absolute; right: 12px" @click="slotProps.close">
                <sm-icon name="action-cross"/>
              </span>
              <div style="width: 320px; padding-right: 20px"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                <br>
                <sm-icon name="utility-alert" class="mr-8" />
                Are <em>you sure</em> you want to continue with <span style="font-weight: 600;">this</span>?
              </div>
            </template>
          </sm-nav-item>

          <sm-nav-item to="/distribution" label="Distributions">
          </sm-nav-item>

          <sm-nav-item label="More Apps" :disabled="true" title="More Apps" nav-item-id="more-apps">
            <sm-nav-item label="Property 1" to="/property-one" :parent-nav-items="['more-apps']"/>
            <sm-nav-item label="Property 2" to="/property-two" :parent-nav-items="['more-apps']"/>
          </sm-nav-item>

          <sm-nav-item label="Direct Booking" to="/setup/direct-booking" title="Direct Booking" nav-item-id="direct-booking">
            <sm-nav-item :disabled="true" label="Promotions code" :is-popover="true" to="/setup/direct-booking/extras1">
              <template v-slot:popover-content="slotProps">
                <span style="z-index:1; cursor:pointer; position:absolute; right: 12px" @click="slotProps.close">
                  <sm-icon name="action-cross"/>
                </span>
                <div style="width: 320px; padding-right: 20px"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  <br>
                  <sm-icon name="utility-alert" class="mr-8" />
                  Are <em>you sure</em> you want to continue with <span style="font-weight: 600;">this</span>?
                </div>
              </template>
            </sm-nav-item>
            <sm-nav-item label="Reservations with popover" :is-popover="true">
              <template v-slot:popover-content="slotProps">
                <span style="z-index:1; cursor:pointer; position:absolute; right: 12px" @click="slotProps.close">
                  <sm-icon name="action-cross"/>
                </span>
                <div style="width: 320px; padding-right: 20px"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  <br>
                  <sm-icon name="utility-alert" class="mr-8" />
                  Are <em>you sure</em> you want to continue with <span style="font-weight: 600;">this</span>?
                </div>
              </template>
            </sm-nav-item>
            <sm-nav-item label="Extras" to="/setup/direct-booking/extras" :parent-nav-items="['direct-booking']"/>
            <sm-nav-item label="Integrations" to="/setup/direct-booking/integrations" :parent-nav-items="['direct-booking']"/>
            <sm-nav-item label="Configuration" title="Configuration" nav-item-id="configuration">
              <sm-nav-item :disabled="true" label="Rates" :is-popover="true">
                <template v-slot:popover-content="slotProps">
                  <span style="z-index:1; cursor:pointer; position:absolute; right: 12px" @click="slotProps.close">
                    <sm-icon name="action-cross"/>
                  </span>
                  <div style="width: 320px; padding-right: 20px"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    <br>
                    <sm-icon name="utility-alert" class="mr-8" />
                    Are <em>you sure</em> you want to continue with <span style="font-weight: 600;">this</span>?
                  </div>
                </template>
              </sm-nav-item>
              <sm-nav-item label="Rates 1" to="/setup/direct-booking/property" :parent-nav-items="['direct-booking', 'configuration']"/>
            </sm-nav-item>
          </sm-nav-item>

        </template>
      </sm-nav>
      <sm-button @click="navVisible = true" type="primary">Open nav</sm-button>
    </div>
  `,
})

const disabledDescription = `
  Use the <code>disabled</code> props to disabled the nav items.

  Popover should be placed at the bottom within the <code>sm-nav</code> component.

  When <code>sm-nav</code> used as a tablet navigation within a <code>sm-app-header</code> component, Placed popover at the bottom and it should open on click event.
`
Disabled.parameters = {
  docs: {
    description: {
      story: disabledDescription,
    },
  },
}
