import { onMounted, ref } from 'vue'
import { isPercyContext } from '../../../../../test/percy/helpers'
import SmPopover from '../sm-popover.vue'
import defaultExample from './images/popover-default.png'
import themedExample from './images/popover-themed.png'

export default {
  title: 'Components/Popover',
  component: SmPopover,
}

export const Standard = () => ({
  components: { SmPopover },
  setup: () => {
    onMounted(() => {
      // Open the popover when running in Percy
      // This is manually done here because we don't have a stable prop
      // that we can just set to true to display the hidden content
      if (isPercyContext()) {
        const clickTriggers = document.getElementById('percy-click-triggers')?.querySelectorAll('button')
        clickTriggers?.forEach(button => button.click())

        const appendToBodyClickTriggers = document.getElementById('percy-append-to-body-triggers')?.querySelectorAll('button')
        appendToBodyClickTriggers?.forEach(button => button.click())
      }
    })
  },
  template: `
    <div style="padding: 40px; text-align: center;">

      <div id="percy-click-triggers">
        <span class="sui-storybook-header">Trigger on click</span>

        <div style="display:inline-block">
          <sm-popover placement="left" title="Left popover">
            <sm-button square type="primary" aria-label="Toggle popover">
              <sm-icon name="action-filter" />
            </sm-button>
          </sm-popover>
        </div>

        <div style="display:inline-block">
          <sm-popover placement="top" title="Top popover">
            <sm-button ref="trigger3" square type="primary" aria-label="Toggle popover">
              <sm-icon name="action-filter" />
            </sm-button>
          </sm-popover>
        </div>

        <div style="display:inline-block">
          <sm-popover placement="bottom" title="Bottom popover">
            <sm-button square type="primary" aria-label="Toggle popover">
              <sm-icon name="action-filter" />
            </sm-button>
          </sm-popover>
        </div>

        <div style="display:inline-block">
          <sm-popover placement="right" title="Right popover">
            <sm-button square type="primary" aria-label="Toggle popover">
              <sm-icon name="action-filter" />
            </sm-button>
          </sm-popover>
        </div>
      </div>

      <br/><br/>

      <div>
        <span class="sui-storybook-header">Trigger on hover</span>

        <div style="display:inline-block">
          <sm-popover trigger="hover" placement="left">
            <template v-slot:content>
              Text in here
              <a href="#" target='_blank'>Regular link</a>
            </template>
            <sm-button square type="primary" aria-label="Toggle popover">
              <sm-icon name="action-filter" />
            </sm-button>
          </sm-popover>
        </div>

        <div style="display:inline-block">
          <sm-popover trigger="hover" placement="top">
            <template v-slot:content>
              Text in here
              <a href="#" target='_blank'>Regular link</a>
            </template>
            <sm-button square type="primary" aria-label="Toggle popover">
              <sm-icon name="action-filter" />
            </sm-button>
          </sm-popover>
        </div>

        <div style="display:inline-block">
          <sm-popover trigger="hover" placement="bottom">
            <template v-slot:content>
              Text in here
              <a href="#" target='_blank'>Regular link</a>
            </template>
            <sm-button square type="primary" aria-label="Toggle popover">
              <sm-icon name="action-filter" />
            </sm-button>
          </sm-popover>
        </div>

        <div style="display:inline-block">
          <sm-popover trigger="hover" placement="right">
            <template v-slot:content>
              Text in here
              <a href="#" target='_blank'>Regular link</a>
            </template>
            <sm-button square type="primary" aria-label="Toggle popover">
              <sm-icon name="action-filter" />
            </sm-button>
          </sm-popover>
        </div>
      </div>

      <br/><br/>

      <div>
        <span class="sui-storybook-header">Trigger on focus</span>

        <div style="display:inline-block">
          <sm-popover trigger="focus" placement="left">
            <template v-slot:content>
              Text in here
              <a href="#" target='_blank'>Regular link</a>
            </template>
            <sm-button square type="primary" aria-label="Toggle popover">
              <sm-icon name="action-filter" />
            </sm-button>
          </sm-popover>
        </div>

        <div style="display:inline-block">
          <sm-popover trigger="focus" placement="top">
            <template v-slot:content>
              Text in here
              <a href="#" target='_blank'>Regular link</a>
            </template>
            <sm-button square type="primary" aria-label="Toggle popover">
              <sm-icon name="action-filter" />
            </sm-button>
          </sm-popover>
        </div>

        <div style="display:inline-block">
          <sm-popover trigger="focus" placement="bottom">
            <template v-slot:content>
              Text in here
              <a href="#" target='_blank'>Regular link</a>
            </template>
            <sm-button square type="primary" aria-label="Toggle popover">
              <sm-icon name="action-filter" />
            </sm-button>
          </sm-popover>
        </div>

        <div style="display:inline-block">
          <sm-popover trigger="focus" placement="right">
            <template v-slot:content>
              Text in here
              <a href="#" target='_blank'>Regular link</a>
            </template>
            <sm-button square type="primary" aria-label="Toggle popover">
              <sm-icon name="action-filter" />
            </sm-button>
          </sm-popover>
        </div>
      </div>

      <br/><br/>

      <div id="percy-append-to-body-triggers">
        <span class="sui-storybook-header">Append to body</span>

        <div style="display:inline-block">
          <sm-popover :append-to-body="true" placement="left" title="Left popover (body)">
            <sm-button square type="primary" aria-label="Toggle popover">
              <sm-icon name="action-filter" />
            </sm-button>
          </sm-popover>
        </div>
        <div style="display:inline-block">
          <sm-popover :append-to-body="true" placement="top" title="Top popover (body)">
            <sm-button square type="primary" aria-label="Toggle popover">
              <sm-icon name="action-filter" />
            </sm-button>
          </sm-popover>
        </div>
        <div style="display:inline-block">
          <sm-popover :append-to-body="true" placement="bottom" title="Bottom popover (body)">
            <sm-button square type="primary" aria-label="Toggle popover">
              <sm-icon name="action-filter" />
            </sm-button>
          </sm-popover>
        </div>
        <div style="display:inline-block">
          <sm-popover :append-to-body="true" placement="right" title="Right popover (body)">
            <sm-button square type="primary" aria-label="Toggle popover">
              <sm-icon name="action-filter" />
            </sm-button>
          </sm-popover>
        </div>
      </div>
    </div>
  `,
})

const standardDescription = `
  By default the popover will be placed towards the bottom of the button.

  You can set the style display:inline-block to the parent element to adjust alignment of the popover.

  Best Practices, Whenever there are multiple slots, use the full <code>template</code> based syntax for all slots including <code>default</code>
`
Standard.parameters = {
  docs: {
    description: {
      component: standardDescription,
    },
  },
  percy: {
    // Needed for the Percy setup steps in onMounted hook to run
    // Take note of the defaults when upgrading Storybook or Percy in the future
    // https://docs.percy.io/docs/storybook#unexpected-diffs
    enableJavascript: true,
    // What you see in Vue2 Percy snapshot isn't exactly the same in the real browser
    // this also causes more diffs against Vue3 Storybook (note that Vue2 and Vue3 have different Storybook versions)
    // Already tried setting the following here: `waitForSelector`, `waitForTimeout` and `minHeight`
    // but it doesn't solve the snapshot issue -- the arrows in the popover sticks to the trigger in Vue2 only,
    // there should be some space between it.
    // Moreover there is a 0.5px difference in the popover placement between Vue2 and Vue3
    // which is calculated via popperjs
  },
}

export const CustomContent = () => ({
  components: { SmPopover },
  setup: () => {
    const sales = ref<number[]>([])

    window.setInterval(() => {
      sales.value = [...sales.value, Math.random()]
    }, 2000)

    const open = () => {
      // eslint-disable-next-line no-console
      console.log('open')
    }
    const close = () => {
      // eslint-disable-next-line no-console
      console.log('close')
    }

    return { sales, open, close }
  },
  template: `
    <div style="padding: 40px; text-align: center;">

      <div style="display: inline-block">
        <sm-popover @open="open" @close="close">
          <template v-slot:default>
            <sm-button type="primary">
              Custom content
            </sm-button>
          </template>
          <template v-slot:content="slotProps">
            <span style="z-index:1; cursor:pointer; position:absolute; right: 12px" @click="slotProps.close">
              <sm-icon name="action-cross"/>
            </span>
            <div style="max-width: 500px; padding-right: 20px"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              <br>
              <sm-icon name="utility-alert" class="mr-8" />
              Are <em>you sure</em> you want to continue with <span style="font-weight: 600;">this</span>?
            </div>
          </template>
        </sm-popover>
      </div>

      <div style="display: inline-block">
        <sm-popover>
          <template v-slot:content>
            You have a total of {{ sales.length }} sales:
            <ol>
              <li v-for="(sale, i) in sales.slice(0, 5)" :key="i">{{ sale }}</li>
            </ol>
            <em v-if="sales.length > 5">Plus {{ sales.length - 5 }} more...</em>
          </template>

          <template v-slot:default>
            <sm-button type="primary">
              Dynamic content
            </sm-button>
          </template>
        </sm-popover>
      </div>

    </div>
  `,
})

const customContentDescription = `
  Use the <code>content</code> slot to engineer some custom popover content.

  You can apply max-width to control popover content width.

  In addition, the sm-popover component will update its positioning automatically when the content inside of it changes.

  If need be, it will update the placement of the popover to accommodate the content size.

  The <code>content</code> slot exposed the method <code>close</code> to hide the popover content

  <code>
    const open = () => {
      Emits when popover is in open state
    }

    const close = () => {
      Emits when popover is in open close
    }
  </code>
`
CustomContent.parameters = {
  docs: {
    description: {
      story: customContentDescription,
    },
  },
}

export const UtilityStates = () => ({
  components: { SmPopover },
  setup: () => {
    const isPercy = ref(isPercyContext())
    const isPercyReady = ref(false)

    onMounted(() => {
      // Open the popovers when running in Percy
      // This is manually done here because we don't have a stable prop
      // that we can just set to true to display the hidden content
      if (isPercy.value) {
        const triggers = document.querySelectorAll('button')
        triggers.forEach(button => button.click())
        isPercyReady.value = true
      }
    })

    return { isPercy }
  },
  template: `
    <div style="padding: 40px; text-align: center;">

      <span class="sui-storybook-header">Info</span>

      <div style="display:inline-block">
        <sm-popover placement="left" title="Left popover" type="info">
          <sm-button square type="primary" aria-label="Toggle popover">
            <sm-icon name="action-filter" />
          </sm-button>
        </sm-popover>
      </div>

      <div style="display:inline-block">
        <sm-popover placement="top" title="Top popover" type="info">
          <sm-button square type="primary" aria-label="Toggle popover">
            <sm-icon name="action-filter" />
          </sm-button>
        </sm-popover>
      </div>

      <div style="display:inline-block">
        <sm-popover placement="bottom" title="Bottom popover" type="info">
          <sm-button square type="primary" aria-label="Toggle popover">
            <sm-icon name="action-filter" />
          </sm-button>
        </sm-popover>
      </div>

      <div style="display:inline-block">
        <sm-popover placement="right" title="Right popover" type="info">
          <sm-button square type="primary" aria-label="Toggle popover">
            <sm-icon name="action-filter" />
          </sm-button>
        </sm-popover>
      </div>

      <div v-if="isPercy" style="margin-top: 128px" />
      <template v-else><br/><br/></template>

      <span class="sui-storybook-header">Alert</span>

      <div style="display:inline-block">
        <sm-popover placement="left" type="alert">
          <template v-slot:content>
            Text in here
            <a href="#" target='_blank'>Regular link</a>
          </template>
          <sm-button square type="primary" aria-label="Toggle popover">
            <sm-icon name="action-filter" />
          </sm-button>
        </sm-popover>
      </div>

      <div style="display:inline-block">
        <sm-popover placement="top" type="alert">
          <template v-slot:content>
            Text in here
            <a href="#" target='_blank'>Regular link</a>
          </template>
          <sm-button square type="primary" aria-label="Toggle popover">
            <sm-icon name="action-filter" />
          </sm-button>
        </sm-popover>
      </div>

      <div style="display:inline-block">
        <sm-popover placement="bottom" type="alert">
          <template v-slot:content>
            Text in here
            <a href="#" target='_blank'>Regular link</a>
          </template>
          <sm-button square type="primary" aria-label="Toggle popover">
            <sm-icon name="action-filter" />
          </sm-button>
        </sm-popover>
      </div>

      <div style="display:inline-block">
        <sm-popover placement="right" type="alert">
          <template v-slot:content>
            Text in here
            <a href="#" target='_blank'>Regular link</a>
          </template>
          <sm-button square type="primary" aria-label="Toggle popover">
            <sm-icon name="action-filter" />
          </sm-button>
        </sm-popover>
      </div>

      <div v-if="isPercy" style="margin-top: 128px" />
      <template v-else><br/><br/></template>

      <span class="sui-storybook-header">Warning</span>

      <div style="display:inline-block">
        <sm-popover placement="left" type="warning">
          <template v-slot:content>
            Text in here
            <a href="#" target='_blank'>Regular link</a>
          </template>
          <sm-button square type="primary" aria-label="Toggle popover">
            <sm-icon name="action-filter" />
          </sm-button>
        </sm-popover>
      </div>

      <div style="display:inline-block">
        <sm-popover placement="top" type="warning">
          <template v-slot:content>
            Text in here
            <a href="#" target='_blank'>Regular link</a>
          </template>
          <sm-button square type="primary" aria-label="Toggle popover">
            <sm-icon name="action-filter" />
          </sm-button>
        </sm-popover>
      </div>

      <div style="display:inline-block">
        <sm-popover placement="bottom" type="warning">
          <template v-slot:content>
            Text in here
            <a href="#" target='_blank'>Regular link</a>
          </template>
          <sm-button square type="primary" aria-label="Toggle popover">
            <sm-icon name="action-filter" />
          </sm-button>
        </sm-popover>
      </div>

      <div style="display:inline-block">
        <sm-popover placement="right" type="warning">
          <template v-slot:content>
            Text in here
            <a href="#" target='_blank'>Regular link</a>
          </template>
          <sm-button square type="primary" aria-label="Toggle popover">
            <sm-icon name="action-filter" />
          </sm-button>
        </sm-popover>
      </div>

      <div v-if="isPercy" style="margin-top: 128px" />
      <template v-else><br/><br/></template>

      <span class="sui-storybook-header">Success</span>

      <div style="display:inline-block">
        <sm-popover placement="left" type="success">
          <template v-slot:content>
            Text in here
            <a href="#" target='_blank'>Regular link</a>
          </template>
          <sm-button square type="primary" aria-label="Toggle popover">
            <sm-icon name="action-filter" />
          </sm-button>
        </sm-popover>
      </div>

      <div style="display:inline-block">
        <sm-popover placement="top" type="success">
          <template v-slot:content>
            Text in here
            <a href="#" target='_blank'>Regular link</a>
          </template>
          <sm-button square type="primary" aria-label="Toggle popover">
            <sm-icon name="action-filter" />
          </sm-button>
        </sm-popover>
      </div>

      <div style="display:inline-block">
        <sm-popover placement="bottom" type="success">
          <template v-slot:content>
            Text in here
            <a href="#" target='_blank'>Regular link</a>
          </template>
          <sm-button square type="primary" aria-label="Toggle popover">
            <sm-icon name="action-filter" />
          </sm-button>
        </sm-popover>
      </div>

      <div style="display:inline-block">
        <sm-popover placement="right" type="success">
          <template v-slot:content>
            Text in here
            <a href="#" target='_blank'>Regular link</a>
          </template>
          <sm-button square type="primary" aria-label="Toggle popover">
            <sm-icon name="action-filter" />
          </sm-button>
        </sm-popover>
      </div>
    </div>
  `,
})

UtilityStates.storyName = 'Utility states'
UtilityStates.parameters = {
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

      <p>Below is an example of the SUI popover and the brand popover using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 214px; height: auto; min-width: 0"
          alt="Popover default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 214px; height: auto; min-width: 0"
          alt="Popover themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the popover customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
              box-shadow
              <br/>
              color-background
              <br/>
              color-border
              <br/>
              color-text
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-popover-border-radius
                --sm-c-popover-box-shadow
                --sm-c-popover-color-background
                --sm-c-popover-color-border
                --sm-c-popover-color-text
                --sm-c-popover-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Type</sm-table-td>
            <sm-table-td>
              info <br/>
              success <br/>
              alert <br/>
              warning <br/>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-popover-color-text-#{$type}
                --sm-c-tooltip-color-background-#{$type}
                --sm-c-popover-color-border-#{$type}
                --sm-c-popover-border-top-#{$type}
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
