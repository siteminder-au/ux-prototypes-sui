import vueRouter from 'storybook-vue3-router'
import { reactive } from 'vue'
import LayoutAside from '../common/layout-aside.vue'
import RoomList from '../common/room-list.vue'
import * as data from '../common/room-list-data'

const EmptyComponent = () => ({
  template: '<div>Home</div>',
})
EmptyComponent.displayName = 'EmptyComponent'

export default {
  title: 'Examples/Components',
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
}

export const List = () => ({
  components: { LayoutAside, RoomList },
  setup: () => {
    const roomTypes = data.roomTypes()

    const form = reactive({
      search: null,
    })

    const clearForm = (): void => {
      form.search = null
    }

    return {
      form,
      roomTypes,
      clearForm,
    }
  },
  template: `
    <layout-aside>
      <sm-section>
        <sm-page-title
          title="Room Types"
          sub-title="(14)"
        >
          <template #actions>
            <sm-button type="primary">
              Some function
            </sm-button>
            <sm-button
              shape="square"
              type="secondary"
              size="large"
              aria-label="More Options"
            >
              <sm-icon name="action-context-menu" />
            </sm-button>
          </template>
        </sm-page-title>

        <room-list :room-types="roomTypes" />
      </sm-section>
    </layout-aside>
  `,
})
