import SmPageTitle from '../sm-page-title.vue'
import defaultExample from './images/page-title-default.png'
import themedExample from './images/page-title-themed.png'

export default {
  title: 'Components/Page Title',
  component: SmPageTitle,
}

/**
 * NOTE:
 *
 * We are expecting whitespace differences here against Vue2 which doesn't exist
 * in Goldeneyes with the whitespace preserve config in Vue3.
 *
 * Temporary hacks like adding spaces in props doesn't work here.
 *
 * Try to check back again once this is supported in Vue3 Storybook:
 * https://github.com/storybookjs/storybook/issues/18288
 * https://siteminder-jira.atlassian.net/browse/SUI-2176
 */

export const Standard = () => ({
  components: { SmPageTitle },
  template: `
    <div>
      <sm-page-title title="Room types" sub-title="(13)"></sm-page-title>

      <p>Nisi adipisicing nisi excepteur ex consectetur mollit cupidatat qui voluptate ad elit Lorem incididunt veniam.
        Sint eu sunt ipsum fugiat voluptate nisi irure.
      </p>
    </div>
  `,
})

Standard.parameters = {
  info: {},
}

export const Actions = () => ({
  components: { SmPageTitle },
  template: `
    <div>
      <sm-page-title title="Room types" sub-title="(13)">
        <template v-slot:actions>
          <sm-button type="primary">Action 1</sm-button>
          <sm-button type="tertiary">Action 2</sm-button>
        </template>
      </sm-page-title>

      <p>Nisi adipisicing nisi excepteur ex consectetur mollit cupidatat qui voluptate ad elit Lorem incididunt veniam.
        Sint eu sunt ipsum fugiat voluptate nisi irure.</p>
    </div>
  `,
})

Actions.parameters = {
  info: {},
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

      <p>Below is an example of the SUI page title and the brand page title using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 290px; height: auto; min-width: 0"
          alt="Page title default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 290px; height: auto; min-width: 0"
          alt="Page title themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the page title customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
              color-text
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-page-title-title-color-text
                --sm-c-page-title-subtitle-color-text
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
