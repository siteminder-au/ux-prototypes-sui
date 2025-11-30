import { ref } from 'vue'
import SmUserList from '../sm-user-list.vue'
import SmUserListItem from '../sm-user-list-item.vue'
import defaultExample from './images/user-list-default.png'
import themedExample from './images/user-list-themed.png'

export default {
  title: 'Components/User list',
  component: SmUserList,
  subcomponents: {
    'sm-user-list-item': SmUserListItem,
  },
}

export const Standard = () => ({
  components: { SmUserList, SmUserListItem },
  setup: () => {
    const selected = ref(true)
    const selected1 = ref(false)
    const selected2 = ref(true)

    return {
      selected,
      selected1,
      selected2,
    }
  },
  template: `
    <div>
      <sm-user-list>
        <sm-user-list-item style="margin-bottom:22px;" :selected="selected">
          <h6 style="padding:0; margin:0;">[System Alert] Performance problems with My Bookings/Entertainment Book affecting rates, availability and restrictions</h6>
          <p style="font-size:14px">Then a further explanation will go here, so that</p>
          <template v-slot:date>
            8 Nov 2020
          </template>
        </sm-user-list-item>
        <sm-user-list-item style="margin-bottom:22px;" :selected="selected1">
          <h6 style="padding:0; margin:0;">[System Alert] Performance problems with My Bookings/Entertainment Book affecting rates, availability and restrictions</h6>
          <p style="font-size:14px">Then a further explanation will go here, so that</p>
          <template v-slot:date>
            Yesterday
          </template>
        </sm-user-list-item>
        <sm-user-list-item type="warning">
          <h6 style="padding:0; margin:0;">[System Alert] Performance problems with My Bookings/Entertainment Book affecting rates, availability and restrictions</h6>
          <p style="font-size:14px">Dear customer, Uploading images have never been easier with the new release of Smart Upload. Connecting your hotel with Channel Manager can now be streamline. Then a further explanation will go here, so that. Then a further explanation will go here, so that</p>
          <template v-slot:date>
            10:44 am
          </template>
        </sm-user-list-item>
      </sm-user-list>
    </div>
  `,
})

const standardDescription = `
  Use the <code>date</code> slot to provide a custom date/time input at right corner.

  For best practice, whenever there are multiple slots, use the full <code>template</code> based syntax for all slots including <code>default</code>
`
Standard.parameters = {
  docs: {
    description: {
      component: standardDescription,
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

      <sm-toast class="mt-32">
        For the <span style="font-weight: 600;">app-header</span> notification dropdown, please use the
        <a href="/?path=/story/components-app-header--styling-hooks">app-header tokens</a>.
        Otherwise, refer to the documentation below.
      </sm-toast>

      <p>Below is an example of the SUI user list and the brand user list using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 408px; height: auto; min-width: 0"
          alt="User list default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 408px; height: auto; min-width: 0"
          alt="User list themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the user list customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
            <sm-table-td>Indicator</sm-table-td>
            <sm-table-td>
              border-radius
              <br/>
              color-background
              <br/>
              color-border
              <br/>
              width
              <br/>
              height
              <br/>
              top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-user-list-indicator-border-radius
                --sm-c-user-list-indicator-color-background
                --sm-c-user-list-indicator-color-border
                --sm-c-user-list-indicator-width
                --sm-c-user-list-indicator-height
                --sm-c-user-list-indicator-top

                --sm-c-user-list-indicator-color-background-selected
                --sm-c-user-list-indicator-color-border-selected

                --sm-c-user-list-indicator-color-background-warning
                --sm-c-user-list-indicator-color-border-warning
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Content</sm-table-td>
            <sm-table-td>
              padding-left
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-user-list-content-padding-left
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Date</sm-table-td>
            <sm-table-td>
              color-text
              <br/>
              right
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-user-list-date-color-text
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
