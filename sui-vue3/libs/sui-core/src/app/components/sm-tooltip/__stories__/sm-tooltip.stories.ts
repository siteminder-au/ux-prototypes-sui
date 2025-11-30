import { onMounted, ref } from 'vue'
import { isPercyContext } from '../../../../../test/percy/helpers'
import SmTooltip from '../sm-tooltip.vue'
import defaultExample from './images/tooltip-default.png'
import themedExample from './images/tooltip-themed.png'

/**
 * NOTE:
 *
 * We are expecting component UI differences between Vue2 and Vue3
 * because we switched to `floating-vue` with minimal CSS overrides.
 */

export default {
  title: 'Components/Tooltip',
  component: SmTooltip,
}

export const Standard = () => ({
  components: { SmTooltip },
  template: `
    <div style="padding: 40px; text-align: center;">

      <span class="sui-storybook-header">Trigger on click</span>

      <sm-tooltip placement="left" title="Left tooltip" :show-on-top="true">
        <sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <sm-tooltip placement="top" title="Top tooltip">
        <sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <sm-tooltip placement="bottom" title="Bottom tooltip">
        <sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <sm-tooltip placement="right" title="Right tooltip">
        <sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <br/><br/><br/>

      <span class="sui-storybook-header">Trigger on hover</span>

      <sm-tooltip trigger="hover" placement="left" title="Left tooltip">
        <sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <sm-tooltip trigger="hover" placement="top" title="Top tooltip">
        <sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <sm-tooltip trigger="hover" placement="bottom" title="Bottom tooltip">
        <sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <sm-tooltip trigger="hover" placement="right" title="Right tooltip">
        <sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>
    </div>
  `,
})

Standard.parameters = {
  info: {},
}

export const CustomContent = () => ({
  components: { SmTooltip },
  setup: () => {
    const sales = ref<number[]>([])

    window.setInterval(() => {
      sales.value = [...sales.value, Math.random()]
    }, 2000)

    return {
      sales,
    }
  },
  template: `
    <div style="padding: 40px; text-align: center;">

      <sm-tooltip>
        <template v-slot:default>
          <sm-button type="primary">
            Custom content
          </sm-button>
        </template>

        <template v-slot:content>
          <sm-icon name="utility-alert" class="mr-4" />Are <em>you sure</em> you want to continue with <span style="font-weight: 600;">this</span>?
        </template>
      </sm-tooltip>

      <sm-tooltip theme="light">

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

      </sm-tooltip>

    </div>
  `,
})

CustomContent.parameters = {
  docs: {
    description: {
      story: 'Use the <code>content</code> slot to engineer some custom tooltip content. <br> The sm-tooltip component will update its positioning automatically when the content inside of it changes. <br> If need be, it will update the placement of the tooltip to accommodate the content size. <br> For best practice, whenever there are multiple slots, use the full template based syntax for all slots including default.',
    },
  },
}

export const ThemesAndTypes = () => ({
  components: { SmTooltip },
  setup: () => {
    onMounted(() => {
      // Open the tooltip when running in Percy
      // This is manually done here because we don't have a prop
      // that we can just set to true to display the hidden content
      if (isPercyContext()) {
        const triggers = document.querySelectorAll('button')
        triggers.forEach(button => button.click())
      }
    })
  },
  template: `
    <div style="padding: 40px; text-align: center;">

      <span class="sui-storybook-header">Dark theme (default)</span>

      <sm-tooltip placement="left" title="Left tooltip">
        <sm-button sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <sm-tooltip placement="top" title="Top tooltip">
        <sm-button sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <sm-tooltip placement="bottom" title="Bottom tooltip">
        <sm-button sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <sm-tooltip placement="right" title="Right tooltip">
        <sm-button sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <br/><br/><br/>

      <span class="sui-storybook-header">Light theme</span>

      <sm-tooltip theme="light" placement="left" title="Left tooltip">
        <sm-button sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <sm-tooltip theme="light" placement="top" title="Top tooltip">
        <sm-button sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <sm-tooltip theme="light" placement="bottom" title="Bottom tooltip">
        <sm-button sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <sm-tooltip theme="light" placement="right" title="Right tooltip">
        <sm-button sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <br/><br/><br/>

      <span class="sui-storybook-header">Types</span>

      <sm-tooltip placement="left" title="Left tooltip" type="info">
        <sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <sm-tooltip placement="top" title="Top tooltip" type="success">
        <sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <sm-tooltip placement="bottom" title="Bottom tooltip" type="warning">
        <sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

      <sm-tooltip placement="right" title="Right tooltip" type="alert">
        <sm-button square type="primary" aria-label="Toggle tooltip">
          <sm-icon name="action-filter" />
        </sm-button>
      </sm-tooltip>

    </div>
  `,
})

ThemesAndTypes.storyName = 'Themes and types'

ThemesAndTypes.parameters = {
  docs: {
    description: {
      story: 'By default tooltips appear using the "dark" theme. Set the <code>theme</code> prop to "light" for an alternative look and feel.',
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

      <p>Below is an example of the SUI tooltip and the brand tooltip using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 104px; height: auto; min-width: 0"
          alt="Tooltip default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 104px; height: auto; min-width: 0"
          alt="Tooltip themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the tooltip customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-tooltip-border-radius
                --sm-c-tooltip-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Theme & type</sm-table-td>
            <sm-table-td>
              dark (default) <br/>
              light <br/>
              info <br/>
              success <br/>
              alert <br/>
              warning <br/>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-tooltip-color-text-#{$type}
                --sm-c-tooltip-color-background-#{$type}
                --sm-c-tooltip-color-border-#{$type}
                --sm-c-tooltip-box-shadow-#{$type}
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
