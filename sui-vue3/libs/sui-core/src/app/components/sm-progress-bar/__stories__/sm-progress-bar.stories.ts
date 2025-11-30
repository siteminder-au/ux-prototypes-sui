import SmProgressBar from '../sm-progress-bar.vue'
import defaultExample from './images/progress-bar-default.png'
import themedExample from './images/progress-bar-themed.png'

export default {
  title: 'Components/Progress bar',
  component: SmProgressBar,
  parameters: {
    docs: {
      description: {
        component: 'Progress bar is used to show the progress of current operation, and inform the user the current status.',
      },
    },
  },
}

export const Variants = () => ({
  components: { SmProgressBar },
  template: `
    <div style="max-width: 512px">
      <span class="sui-storybook-header">External Percentage</span>
      <sm-progress-bar :percentage="30"></sm-progress-bar>
      <sm-progress-bar :percentage="20" status="success"></sm-progress-bar>
      <sm-progress-bar :percentage="60" status="alert"></sm-progress-bar>
      <sm-progress-bar :percentage="90" status="warning"></sm-progress-bar>
      <sm-progress-bar :percentage="90">Message</sm-progress-bar>
      <sm-progress-bar :percentage="100">
        <sm-icon name="utility-success-alt" class="text-app-success" />
      </sm-progress-bar>
      <sm-progress-bar :percentage="0"></sm-progress-bar>

      <br/><br/>

      <span class="sui-storybook-header">Internal Percentage</span>
      <sm-progress-bar :percentage="30" textInside></sm-progress-bar>
      <sm-progress-bar :percentage="20" status="success" textInside></sm-progress-bar>
      <sm-progress-bar :percentage="60" status="alert" textInside></sm-progress-bar>
      <sm-progress-bar :percentage="90" status="warning" textInside></sm-progress-bar>
      <sm-progress-bar :percentage="90" textInside>Message</sm-progress-bar>
      <sm-progress-bar :percentage="0" textInside></sm-progress-bar>

      <br/><br/>

      <span class="sui-storybook-header">Circle type</span>
      <div class="flex flex-wrap gap-24">
        <div><sm-progress-bar :percentage="90" type="circle" :stroke-height="6"></sm-progress-bar></div>
        <div><sm-progress-bar :percentage="100" type="circle" :stroke-height="6" status="success"></sm-progress-bar></div>
        <div><sm-progress-bar :percentage="60" type="circle" :stroke-height="6" status="alert"></sm-progress-bar></div>
        <div><sm-progress-bar :percentage="50" type="circle" :stroke-height="6" status="warning"></sm-progress-bar></div>
      </div>
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

      <p>Below is an example of the SUI progress bar and the brand progress bar using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 408px; height: auto; min-width: 0"
          alt="Progress bar default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 408px; height: auto; min-width: 0"
          alt="Progress bar themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the progress bar customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              border-radius
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-progress-bar-track-border-radius
                --sm-c-progress-bar-progress-border-radius
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Circle type (container)</sm-table-td>
            <sm-table-td>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-progress-bar-circle-color-background
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Status</sm-table-td>
            <sm-table-td>
              info (default) <br/>
              success <br/>
              alert <br/>
              warning <br/>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-progress-bar-color-text-inside-#{$status}
                --sm-c-progress-bar-color-text-inside-empty-#{$status}
                --sm-c-progress-bar-color-text-outside-#{$status}
                --sm-c-progress-bar-track-color-background-#{$status}
                --sm-c-progress-bar-progress-color-background-#{$status}
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
