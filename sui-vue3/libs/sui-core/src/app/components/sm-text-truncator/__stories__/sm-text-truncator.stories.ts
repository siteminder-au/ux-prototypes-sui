import SmTextTruncator from '../sm-text-truncator.vue'
import defaultExample from './images/text-truncator-default.png'
import themedExample from './images/text-truncator-themed.png'

export default {
  title: 'Components/Text Truncator',
  component: SmTextTruncator,
}

export const Standard = () => ({
  components: { SmTextTruncator },
  setup: () => {
    const logEvent = (eventName: string): void => {
      console.info(`Event: ${eventName}`)
    }

    return { logEvent }
  },
  template: `
    <div>
      <sm-text-truncator @hide="logEvent('hide')" @show="logEvent('show')">
        Actual number of lines is <span style="font-weight: 600;">greater than</span> provided clamp line.
        Enim aliquip <span style="font-weight: 600;">anim ut fugiat duis cillum</span>.
        Minim et id adipisicing ex fugiat adipisicing mollit irure.
        Laboris id Lorem enim exercitation ad id pariatur eiusmod.
        Do laboris velit Lorem Lorem sit consectetur. Sint adipisicing anim mollit eiusmod Lorem adipisicing.  Minim et id adipisicing ex fugiat adipisicing mollit irure.
        Laboris id Lorem enim exercitation ad id pariatur eiusmod.
        Do laboris velit Lorem Lorem sit consectetur. Sint adipisicing anim mollit eiusmod Lorem adipisicing.  Minim et id adipisicing ex fugiat adipisicing mollit irure.
        Laboris id Lorem enim exercitation ad id pariatur eiusmod.
        Do laboris velit Lorem Lorem sit consectetur. Sint adipisicing anim mollit eiusmod Lorem adipisicing
      </sm-text-truncator>

      <sm-text-truncator class="my-24">
        Actual number of lines is <span style="font-weight: 600;">less than</span> provided clamp line
      </sm-text-truncator>

      <sm-text-truncator class="my-24" :clamp-line="1" mt-24>
        Actual number of lines is <span style="font-weight: 600;">equal to</span> provided clamp line
      </sm-text-truncator>
    </div>
  `,
})

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

      <p>Below is an example of the SUI text truncator and the brand text truncator using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 400px; height: auto; min-width: 0"
          alt="Text truncator default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 400px; height: auto; min-width: 0"
          alt="Text truncator themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the text truncator customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
              >--sm-c-text-truncator-button-padding
                --sm-c-text-truncator-button-box-shadow-focus
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
