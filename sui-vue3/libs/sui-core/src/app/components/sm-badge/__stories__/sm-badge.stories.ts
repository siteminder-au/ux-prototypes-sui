import defaultExample from './images/badge-default.png'
import themedExample from './images/badge-themed.png'
import SmBadge from '../sm-badge.vue'

export default {
  title: 'Components/Badges',
  decorators: [],
  component: SmBadge,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Au1waCRAR4SpFvIgEMASgf/sui-documentation?node-id=12%3A158240&t=hCpfPUmCPPZSF5zx-0',
    },
  },
}

export const Variants = () => ({
  components: { SmBadge },
  template: `
    <div>
      <span class="sui-storybook-header">Small</span>
      <sm-badge type="success"></sm-badge>
      <sm-badge type="info"></sm-badge>
      <sm-badge></sm-badge>
      <sm-badge type="alert"></sm-badge>

      <br/><br/>

      <span class="sui-storybook-header">Medium</span>
      <sm-badge type="success" size="medium">5</sm-badge>
      <sm-badge type="info" size="medium">20</sm-badge>
      <sm-badge type="warning" size="medium">30</sm-badge>
      <sm-badge type="info" size="medium">New</sm-badge>
      <sm-badge type="alert" size="medium">50</sm-badge>

      <br/><br/>

      <span class="sui-storybook-header">Large</span>
      <sm-badge type="success" size="large">5</sm-badge>
      <sm-badge type="info" size="large">20</sm-badge>
      <sm-badge type="warning" size="large">30</sm-badge>
      <sm-badge type="info" size="large">New</sm-badge>
      <sm-badge type="alert" size="large">50</sm-badge>

      <br/><br/>

      <span class="sui-storybook-header">Light</span>
      <sm-badge light-theme-type="success" size="large">5</sm-badge>
      <sm-badge light-theme-type="info" size="large">20</sm-badge>
      <sm-badge light-theme-type="warning" size="large">30</sm-badge>
      <sm-badge light-theme-type="info" size="large">New</sm-badge>
      <sm-badge light-theme-type="alert" size="large">50</sm-badge>

      <br/><br/>

      <span class="sui-storybook-header">Disabled</span>
      <sm-badge type="alert" size="large" disabled>50</sm-badge>
      <sm-badge light-theme-type="success" size="large" disabled>50</sm-badge>
      <sm-badge disabled></sm-badge>
    </div>
  `,
})

export const StylingHooks = () => ({
  components: { SmBadge },
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

      <p>Below is an example of the SUI badge and the brand badge using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 308px; height: auto; min-width: 0"
          alt="Badge default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 274px; height: auto; min-width: 0"
          alt="Badge themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the badge customization variables, followed by <a href="/?path=/docs/guides-theming--styling-hooks#theme-categories">theme categories</a> and <a href="/?path=/docs/guides-theming--styling-hooks#naming-conventions">naming convention</a></p>

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
                text-transform
              </sm-table-td>
              <sm-table-td>
                <code
                  class="sui-storybook-code sui-storybook-code--block"
                >--sm-c-badge-text-transform
                </code>
              </sm-table-td>
            </sm-table-tr>
            <sm-table-tr>
              <sm-table-td rowspan="3">Size</sm-table-td>
              <sm-table-td>small (default)</sm-table-td>
              <sm-table-td>
                <code
                  class="sui-storybook-code sui-storybook-code--block"
                >--sm-c-badge-border-radius-small<br/>
                  --sm-c-badge-font-size-small<br/>
                  --sm-c-badge-height-small<br/>
                  --sm-c-badge-width-small<br/>
                  --sm-c-badge-line-height-small
                </code>
              </sm-table-td>
            </sm-table-tr>

            <sm-table-tr>
              <sm-table-td>medium</sm-table-td>
              <sm-table-td>
                <code
                  class="sui-storybook-code sui-storybook-code--block"
                >--sm-c-badge-border-radius-medium<br/>
                  --sm-c-badge-font-size-medium<br/>
                  --sm-c-badge-height-medium<br/>
                  --sm-c-badge-min-width-medium<br/>
                  --sm-c-badge-padding-medium<br/>
                  --sm-c-badge-line-height-medium
                </code>
              </sm-table-td>
            </sm-table-tr>

            <sm-table-tr>
              <sm-table-td>large</sm-table-td>
              <sm-table-td>
                <code
                  class="sui-storybook-code sui-storybook-code--block"
                >--sm-c-badge-border-radius-large<br/>
                  --sm-c-badge-font-size-large<br/>
                  --sm-c-badge-height-large<br/>
                  --sm-c-badge-min-width-large<br/>
                  --sm-c-badge-padding-large<br/>
                  --sm-c-badge-line-height-large
                </code>
              </sm-table-td>
            </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Type</sm-table-td>
            <sm-table-td>
              warning (default) <br/>
              success <br/>
              info <br/>
              alert <br/>
              light-warning <br/>
              light-success <br/>
              light-info <br/>
              light-alert <br/>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-badge-color-background-#{$type}<br/>
                --sm-c-badge-color-text-#{$type}
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Disabled</sm-table-td>
            <sm-table-td>
              disabled <br/>
              light-disabled
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-badge-color-background-disabled<br/>
                --sm-c-badge-color-text-disabled<br/>
                --sm-c-badge-color-background-light-disabled<br/>
                --sm-c-badge-color-text-light-disabled
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
  design: null,
}
