import vueRouter from 'storybook-vue3-router'
import SmBreadcrumbs from '../sm-breadcrumbs.vue'
import SmBreadcrumbItem from '../sm-breadcrumb-item.vue'
import { SmTable, SmTableTh, SmTableTd, SmTableTr, SmTableTbody } from '../../sm-table'
import defaultExample from './images/breadcrumbs-default.png'
import themedExample from './images/breadcrumbs-themed.png'

const EmptyComponent = {
  template: '<div>Home</div>',
}

const standardDescription = `The <code>sm-breadcrumbs</code> consist of a list of links that help a user visualize a page's location within the hierarchical structure of a website, and allow navigation up to any of its "ancestors".

Use the following classes for custom style

       .sm-breadcrumbs {
         // Styles for breadcrumbs
       }

       .sm-breadcrumbs-item {
         // Styles for breadcrumb item
       }

       .sm-breadcrumbs-item__link {
         // Styles for breadcrumb item link
       }

       .sm-breadcrumbs-item__text {
         // Styles for breadcrumb item text
       }

       .sm-breadcrumbs_item__separator {
         // Styles for breadcrumb separator
       }

<code>aria-label</code> attribute is required for accessibility.
      `

export default {
  title: 'Components/Breadcrumbs',
  component: SmBreadcrumbs,
  subcomponents: {
    'sm-breadcrumb-item': SmBreadcrumbItem,
  },
  decorators: [
    vueRouter([{
      path: '/property-setting',
      name: 'property-setting',
      component: EmptyComponent,
    }, {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: EmptyComponent,
    }]),
  ],
  parameters: {
    docs: {
      description: {
        component: standardDescription,
      },
    },
  },
}

export const Standard = () => ({
  components: { SmBreadcrumbs, SmBreadcrumbItem },
  template: `
    <div>
      <span class="sui-storybook-header">Default</span>
      <sm-breadcrumbs aria-label="Standard Breadcrumbs">
        <sm-breadcrumb-item href="#">Property</sm-breadcrumb-item>
        <sm-breadcrumb-item href="#">Property Settings</sm-breadcrumb-item>
        <sm-breadcrumb-item>Credit Card</sm-breadcrumb-item>
      </sm-breadcrumbs>

      <br/><br/>

      <span class="sui-storybook-header">With Icon Separator</span>
      <sm-breadcrumbs separator-icon="arrow-right" aria-label="Breadcrumbs with icon separator" >
        <sm-breadcrumb-item href="#">Property</sm-breadcrumb-item>
        <sm-breadcrumb-item href="#">Property Settings</sm-breadcrumb-item>
        <sm-breadcrumb-item>Credit Card</sm-breadcrumb-item>
      </sm-breadcrumbs>

      <br/><br/>

      <span class="sui-storybook-header">With Router Link</span>
      <sm-breadcrumbs aria-label="Breadcrumbs with router link" >
        <sm-breadcrumb-item to="/path">Property</sm-breadcrumb-item>
        <sm-breadcrumb-item :to="{ name: 'property-setting' }">Property Settings</sm-breadcrumb-item>
        <sm-breadcrumb-item>Credit Card</sm-breadcrumb-item>
      </sm-breadcrumbs>
    </div>
  `,
})

export const StylingHooks = () => ({
  components: { SmTable, SmTableTh, SmTableTd, SmTableTr, SmTableTbody },
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

      <p>Below is an example of the SUI breadcrumbs and the brand breadcrumbs using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 272px; height: auto; min-width: 0"
          alt="Breadcrumbs default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 272px; height: auto; min-width: 0"
          alt="Breadcrumbs themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the breadcrumbs customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
              color
              <br/>
              text-decoration
              <br/>
              color-hover
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-breadcrumb-item-color
                --sm-c-breadcrumb-item-text-decoration
                --sm-c-breadcrumb-item-color-hover
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td rowspan="4">Size</sm-table-td>
            <sm-table-td>default</sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-breadcrumb-item-font-size-default
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
