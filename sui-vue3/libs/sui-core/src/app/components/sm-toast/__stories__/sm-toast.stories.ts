import { startCase } from 'lodash-es'
import { ref } from 'vue'
import { toastService } from '../../../services'
import SmToast from '../sm-toast.vue'
import defaultExample from './images/toast-default.png'
import themedExample from './images/toast-themed.png'

/**
 * NOTE:
 *
 * We are expecting Percy visual diffs between Vue2 and Vue3 Storybook here.
 * Vue3 trims the whitespace between the message and action slot, which is not the case in Vue2.
 * This is also the case in Goldeneyes even with the whitespace preserve config in Vue3.
 *
 * We'll accept the visual diffs rather than introducing a code smell in the component code
 * i.e. explicit `' '` between them. `&nbsp;` is not an option since it's resulting in a
 * bigger space diff.
 */

export default {
  title: 'Components/Toast',
  component: SmToast,
}

export const Standard = () => ({
  components: { SmToast },
  template: `
    <div>

      <span class="sui-storybook-header">Default</span>
      <sm-toast message="Info" type="info" />
      <sm-toast message="Success" type="success" />
      <sm-toast message="Alert" type="alert" />
      <sm-toast message="Warning" type="warning" />

      <br/><br/>

      <span class="sui-storybook-header">With close</span>
      <sm-toast message="Info" type="info" show-close />
      <sm-toast message="Success" type="success" show-close />
      <sm-toast message="Alert" type="alert" show-close />
      <sm-toast message="Warning" type="warning" show-close />

    </div>
  `,
})

export const Actions = () => ({
  components: { SmToast },
  template: `
    <div>

      <div class="mb-32">
        <sm-toast message="Info" type="info">
          <template v-slot:action>
            <a href="#">Action</a>
          </template>
        </sm-toast>

        <sm-toast message="Success" type="success">
          <template v-slot:action>
            <a href="#">Action</a>
          </template>
        </sm-toast>

        <sm-toast message="Alert" type="alert">
          <template v-slot:action>
            <a href="#">Action</a>
          </template>
        </sm-toast>

        <sm-toast message="Warning" type="warning">
          <template v-slot:action>
            <a href="#">Action</a>
          </template>
        </sm-toast>
      </div>

      <div>
        <sm-toast message="Info" type="info" show-close>
          <template v-slot:action>
            <a href="#">Action</a>
          </template>
        </sm-toast>

        <sm-toast message="Success" type="success" show-close>
          <template v-slot:action>
            <a href="#">Action</a>
          </template>
        </sm-toast>

        <sm-toast message="Alert" type="alert" show-close>
          <template v-slot:action>
            <a href="#">Action</a>
          </template>
        </sm-toast>

        <sm-toast message="Warning" type="warning" show-close>
          <template v-slot:action>
            <a href="#">Action</a>
          </template>
        </sm-toast>
      </div>

    </div>
  `,
})

export const Title = () => ({
  components: { SmToast },
  template: `
    <div>

      <sm-toast
        v-for="type in ['info', 'success', 'alert', 'warning']"
        :key="type"
        :type="type"
        show-close
        title="We can't find your account details"
        message="We were unable to retrieve your account details. It looks like you haven't paid your subscription.">

        <template v-slot:action>
          <a href="#">Renew your account now</a>
        </template>

      </sm-toast>

    </div>
  `,
})

Title.parameters = {
  docs: {
    description: {
      story: 'When the toast has a title, the layout changes to accommodate readability.',
    },
  },
}

export const MiniInfoToast = () => ({
  components: { SmToast },
  template: `
    <div>

      <sm-toast message="This is a default mini toast." type="info" :mini-info="true" />
      <sm-toast message="This is a warning mini toast." type="warning" :mini-info="true" />
      <sm-toast message="This is an alert mini toast." type="alert" :mini-info="true" />
      <sm-toast message="This is a success mini toast." type="success" :mini-info="true" />

      <sm-toast message="This is a default mini toast." type="info" :mini-info="true">
        <template v-slot:action>
          <a href="#">Action</a>
        </template>
      </sm-toast>
      <sm-toast message="This is a warning mini toast." type="warning" :mini-info="true">
        <template v-slot:action>
          <a href="#">Action</a>
        </template>
      </sm-toast>
      <sm-toast message="This is a alert mini toast." type="alert" :mini-info="true">
        <template v-slot:action>
          <a href="#">Action</a>
        </template>
      </sm-toast>
      <sm-toast message="This is a success mini toast. Here is some extra long text so you can observe the behaviour of the action. It is inline with the text." type="success" :mini-info="true">
        <template v-slot:action>
          <a href="#">Action</a>
        </template>
      </sm-toast>

      <sm-toast message="This is a default mini toast." type="info" :mini-info="true" show-close />
      <sm-toast message="This is a warning mini toast." type="warning" :mini-info="true" show-close />
      <sm-toast message="This is an alert mini toast." type="alert" :mini-info="true" show-close />
      <sm-toast message="This is a success mini toast." type="success" :mini-info="true" show-close />

      <sm-toast
        message="This is a default mini toast."
        type="info"
        show-close
        :mini-info="true"
      >
        <template v-slot:action>
          <a href="#">Action</a>
        </template>
      </sm-toast>
      <sm-toast
        message="This is a warning mini toast."
        type="warning"
        show-close
        :mini-info="true"
      >
        <template v-slot:action>
          <a href="#">Action</a>
        </template>
      </sm-toast>
      <sm-toast
        message="This is a alert mini toast."
        type="alert"
        show-close
        :mini-info="true"
      >
        <template v-slot:action>
          <a href="#">Action</a>
        </template>
      </sm-toast>
      <sm-toast
        message="This is a success mini toast. Here is some extra long text so you can observe the behaviour of the action. It is inline with the text."
        type="success"
        show-close
        :mini-info="true"
      >
        <template v-slot:action>
          <a href="#">Action</a>
        </template>
      </sm-toast>

    </div>
  `,
})

MiniInfoToast.storyName = 'Mini info toast'

export const AsAService = () => ({
  setup() {
    const initialPlacement = ref('top')
    const miniInfo = ref(false)
    const showClose = ref(false)

    const showToast = (placement: any) => {
      toastService({
        type: 'success',
        message: startCase(placement),
        miniInfo: miniInfo.value,
        showClose: showClose.value,
        placement,
      })
    }
    return {
      initialPlacement,
      miniInfo,
      showClose,
      showToast,
    }
  },
  template: `

    <div>
      <div class="flex mb-16">
        <div class="mr-72">
          <sm-radio-group label="Placement" name="placement">
            <sm-radio v-model="initialPlacement" selected-value="top" name="placement">top</sm-radio>
            <sm-radio v-model="initialPlacement" selected-value="top-left" name="placement">top-left</sm-radio>
            <sm-radio v-model="initialPlacement" selected-value="top-right" name="placement">top-right</sm-radio>
            <sm-radio v-model="initialPlacement" selected-value="bottom" name="placement">bottom</sm-radio>
            <sm-radio v-model="initialPlacement" selected-value="bottom-left" name="placement">bottom-left</sm-radio>
            <sm-radio v-model="initialPlacement" selected-value="bottom-right" name="placement">bottom-right</sm-radio>
          </sm-radio-group>
        </div>
        <div class="pt-8">
          <sm-switch v-model="miniInfo" label="Mini info" name="mini-info"></sm-switch>
          <sm-switch v-model="showClose" label="Show close" name="show-close"></sm-switch>
        </div>
      </div>

      <sm-button
        type="primary"
        @click="showToast(initialPlacement)"
      >
        Show toast
      </sm-button>
    </div>

  `,
})

AsAService.storyName = 'As a service'

const asAServiceDescription = `
  The toast component can be used as a service.

  <pre>
    import { toastService } from '@siteminder/sui-core
    const showToast = () => {
      toastService({
        type: 'success',
        message: 'Success',
        placement: 'top',
        miniInfo: false, // default
      })
    }
  </pre>

  The toastService method accepts an options object, with the following properties:

  <table class="sm-demo-table">
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
    <tbody>
      <tr>
        <td>type</td>
        <td>String</td>
        <td>'info'</td>
        <td>The style of the alert. Accepts: 'info' 'success' 'alert' 'warning'</td>
      </tr>
      <tr>
        <td>title</td>
        <td>String</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>message</td>
        <td>String</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>timeout</td>
        <td>Number</td>
        <td>5000</td>
        <td>The time in milliseconds until the toast disappears.
        Defaults to <code>5000</code>. Set to <code>0</code> if you'd like the toast to remain visible until closed.</td>
      </tr>
      <tr>
        <td>onClose</td>
        <td>Function</td>
        <td></td>
        <td>A function which will be called when the toast's close button is clicked.</td>
      </tr>
      <tr>
        <td>showClose</td>
        <td>Boolean</td>
        <td>false</td>
        <td>Whether to show the close button</td>
      </tr>
      <tr>
        <td>placement</td>
        <td>String</td>
        <td>'top'</td>
        <td>The position of the toast, relative to the screen. Accepts: 'top', 'bottom'</td>
      </tr>
      <tr>
        <td>miniInfo</td>
        <td>Boolean</td>
        <td>false</td>
        <td>Whether to show mini info toast</td>
      </tr>
    </tbody>
  </table>
`
AsAService.parameters = {
  docs: {
    description: {
      story: asAServiceDescription,
    },
  },
}

export const Timeout = () => ({
  components: { SmToast },
  setup() {
    const visibleOne = ref(true)
    const visibleTwo = ref(true)

    return {
      visibleOne,
      visibleTwo,
    }
  },
  template: `
    <div>
      <sm-toast
        v-if="visibleOne"
        message="This will auto-close the toast after 10 seconds."
        is-timeout
        :timeout="10000"
        @close="visibleOne = false"
      />
      <sm-toast
        v-if="visibleTwo"
        message="This will not auto-close since close button is available."
        show-close
        is-timeout
        @close="visibleTwo = false"
      />
    </div>
  `,
})

const timeoutDescription = `
Emits "close" event after the provided <code>timeout</code> in milliseconds (ms) if
<code>isTimeout</code> is set to true and <code>showClose</code> is false.

The default <code>timeout</code> is 5000ms (5 seconds).
`
Timeout.parameters = {
  docs: {
    description: {
      story: timeoutDescription,
    },
  },
}

export const StylingHooks = () => ({
  setup() {
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

      <p>Below is an example of the SUI toast and the brand toast using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 396px; height: auto; min-width: 0"
          alt="Toast default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 396px; height: auto; min-width: 0"
          alt="Toast themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the toast customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
              border-radius
              <br/>
              border-style
              <br/>
              border-width
              <br/>
              border-top-width
              <br/>
              padding
              <br/>
              margin-bottom
              <br/>
              box-shadow
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-toast-border-radius
                --sm-c-toast-border-style
                --sm-c-toast-border-width
                --sm-c-toast-border-top-width
                --sm-c-toast-padding
                --sm-c-toast-margin-bottom
                --sm-c-toast-box-shadow
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Icon</sm-table-td>
            <sm-table-td>
              size
              <br/>
              line-height
              <br/>
              margin-top
              <br/>
              width
              <br/>
              height
              <br/>
              border-radius
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-toast-icon-size
                --sm-c-toast-icon-line-height
                --sm-c-toast-icon-margin-top
                --sm-c-toast-icon-width
                --sm-c-toast-icon-height
                --sm-c-toast-icon-border-radius
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Content</sm-table-td>
            <sm-table-td>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-toast-content-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Title</sm-table-td>
            <sm-table-td>
              margin-bottom
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-toast-title-margin-bottom
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Close button</sm-table-td>
            <sm-table-td>
              icon-color
              <br/>
              margin-top
              <br/>
              margin-bottom
              <br/>
              margin-right
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-toast-close-icon-color
                --sm-c-toast-close-margin-top
                --sm-c-toast-close-margin-bottom
                --sm-c-toast-close-margin-right
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Type</sm-table-td>
            <sm-table-td>
              info (default) <br/>
              success <br/>
              alert <br/>
              warning <br/>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-toast-color-text-#{$type}
                --sm-c-toast-color-background-#{$type}
                --sm-c-toast-color-border-#{$type}
                --sm-c-toast-color-border-top-#{$type}
                --sm-c-toast-icon-color-text-#{$type}
                --sm-c-toast-icon-color-background-#{$type}
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>
    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
