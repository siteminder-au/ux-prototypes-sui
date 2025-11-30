import SmHtmlTruncator from '../sm-html-truncator.vue'
import defaultExample from './images/html-truncator-default.png'
import themedExample from './images/html-truncator-themed.png'

export default {
  title: 'Components/Html Truncator',
  component: SmHtmlTruncator,
}

export const Standard = () => ({
  components: { SmHtmlTruncator },
  setup: () => {
    const logEvent = (eventName: string) => {
      console.info(eventName)
    }

    return { logEvent }
  },
  template: `
    <div>
      <sm-html-truncator @less="logEvent('less')" @more="logEvent('more')">
        <template #default>
          <h2>Text in here</h2>
          <h3>Text in here</h3>
          <h2>Text in here</h2>
          <h3>Text in here</h3>
        </template>
        <template #less>
          <sm-button type="text" suffix-icon="arrow-up">Read less</sm-button>
        </template>
        <template #more>
          <sm-button type="text" suffix-icon="arrow">Read more</sm-button>
        </template>
      </sm-html-truncator>
    </div>
  `,
})

const standardDescription = `
  Use the <code>sm-html-truncator</code> component to truncate the html elements.

  Use <code>height</code> props to adjust the height of the content before truncation and use <code>max-height</code> props to set max-heigh after truncation.
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
      <p>Styling hooks will enable customization for your components. Styling hooks are constructed using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">CSS custom properties</a>.</p>

      <p>Below is an example of the SUI HTML truncator and the brand HTML truncator using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 400px; height: auto; min-width: 0"
          alt="HTML truncator default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 400px; height: auto; min-width: 0"
          alt="HTML truncator themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the HTML truncator customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
            <sm-table-th colspan="3">Toggle text button</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Button overrides</sm-table-td>
            <sm-table-td>
              padding <br/>
              box-shadow
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-html-truncator-button-padding
                --sm-c-html-truncator-button-box-shadow-focus
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Button generic</sm-table-td>
            <sm-table-td colspan="2">
              For the <span style="font-weight: 600;">button component variables</span>, please refer to <a href="/?path=/story/components-button--styling-hooks">button styling hooks</a>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
