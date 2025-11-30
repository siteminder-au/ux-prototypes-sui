import vueRouter from 'storybook-vue3-router'
import SmHorizontalNavItem from '../sm-horizontal-nav-item.vue'
import SmHorizontalNav from '../sm-horizontal-nav.vue'

const EmptyComponent = () => ({
  template: '<div>Home</div>',
})
EmptyComponent.displayName = 'EmptyComponent'

export default {
  title: 'Components/Horizontal Nav',
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
  component: SmHorizontalNav,
  subcomponents: {
    'sm-horizontal-nav-item': SmHorizontalNavItem,
  },
}

export const Standard = () => ({
  components: { SmHorizontalNav, SmHorizontalNavItem },
  template: `
    <sm-horizontal-nav>
      <sm-horizontal-nav-item label="Rooms & Rates" to="/rooms-and-rates" />
      <sm-horizontal-nav-item label="Distribution" to="/distribution" />

      <sm-horizontal-nav-item label="Settings">
        <sm-vertical-nav>
          <sm-vertical-nav-item label="Promotions code" to="/setup/direct-booking/promotions" />
          <sm-vertical-nav-item label="Extras" to="/setup/direct-booking/extras" />
          <sm-vertical-nav-item label="Integrations" to="/setup/direct-booking/integrations" />
          <sm-vertical-nav-item label="Room Types" to="/setup/direct-booking/room-types" />
        </sm-vertical-nav>
      </sm-horizontal-nav-item>

      <!-- Use the 'href' prop to send the user to an external URL -->
      <sm-horizontal-nav-item label="Logout" href="http://logout.com">
        <template v-slot:icon>
          <sm-icon name="action-open-in-new" tabindex="-1" />
        </template>
      </sm-horizontal-nav-item>
    </sm-horizontal-nav>
  `,
})

const standardDescription = `
  Use the <code>default</code> slot to provide a submenu items.

  <pre>
    const toggle = (isOpen : boolean) => {
      Emits on click of horizontal nav items to show/hide the submenu
    }
  </pre>
`
Standard.docs = {
  description: {
    component: standardDescription,
  },
}

export const ActiveItems = () => ({
  components: {
    SmHorizontalNav,
    SmHorizontalNavItem,
  },
  template: `
    <sm-horizontal-nav>
      <sm-horizontal-nav-item label="Dashboard" to="/dashboard" />
      <sm-horizontal-nav-item force-active-state="exact-active" label="Rooms & Rates" to="/rooms-and-rates" />
      <sm-horizontal-nav-item force-active-state="in-active" label="Distribution" to="/distribution" />
      <sm-horizontal-nav-item label="Direct booking" to="/direct-booking" />

      <sm-horizontal-nav-item label="Settings">
        <sm-vertical-nav>
          <!-- Make this item "exact-active" whenever it's to prop is "active" -->
          <sm-vertical-nav-item :force-active-state="(isActive) => isActive ? 'active' : 'in-active'" label="Promotions code" to="/setup/direct-booking/promotions" />

          <!-- Make this item "active" whenever it's to prop is "exact-active" -->
          <sm-vertical-nav-item :force-active-state="(isActive, isExactActive) => isExactActive ? 'exact-active' : 'in-active'" label="Extras" to="/setup/direct-booking/extras" />
        </sm-vertical-nav>
      </sm-horizontal-nav-item>

      <!-- Use the 'href' prop to send the user to an external URL -->
      <sm-horizontal-nav-item label="Logout" href="http://logout.com">
        <template v-slot:icon>
          <sm-icon name="action-open-in-new" tabindex="-1" />
        </template>
      </sm-horizontal-nav-item>
    </sm-horizontal-nav>
  `,
})

const activeItemsDescription = `
  By default the "active" state of an item is determined based on the current URL and the <code>to</code> prop.


  For example, if the current URL path is <code>/foo/bar</code>:
  - and the <code>to</code> prop is set to <code>/foo</code> the item will be considered <strong>active</strong>.
  - and the <code>to</code> prop is set to <code>/foo/bar</code> the item will be considered <strong>exact-active</strong>.
  - and the <code>to</code> prop is set to <code>/bar</code> the item will be considered <strong>in-active</strong>.

  For more implementations, this use case will be exactly what you need.

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
