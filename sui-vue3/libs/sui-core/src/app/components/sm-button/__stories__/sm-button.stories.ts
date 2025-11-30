import SmButton from '../sm-button.vue'
import defaultExample from './images/button-default.png'
import themedExample from './images/button-themed.png'

export default {
  title: 'Components/Button',
  component: SmButton,
  parameters: {
    docs: {
      description: {
        // Uses `component` here since it's the primary story
        component: 'Buttons come in different "types", "sizes" and "shapes" which control the style of the button. Note that the "square" and "round" buttons do not support a "small" size. <br/> Note that the "mini" size is deprecated and will be removed in later versions. <br/> Square and round buttons always have a fixed width and height and are designed to hold a single icon, such as "close" cross. <br/> The <code>data-sm-button-test</code> prop allows the user to select <code>sm-button</code> for interaction as part testing.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Au1waCRAR4SpFvIgEMASgf/sui-documentation?node-id=12%3A159432&t=hCpfPUmCPPZSF5zx-0',
    },
  },
}

export const Variants = () => ({
  components: { SmButton },
  template: `
    <div>
      <div>
        <span class="sui-storybook-header">Types</span>
        <sm-button type="primary" data-sm-button-test="primary">Primary</sm-button>
        <sm-button type="secondary">Secondary</sm-button>
        <sm-button type="secondary-warning">secondary-warning</sm-button>
        <sm-button type="secondary-success">secondary-success</sm-button>
        <sm-button type="tertiary">Tertiary</sm-button>

        <br/><br/>

        <sm-button type="success">Success</sm-button>
        <sm-button type="alert">Alert</sm-button>
        <sm-button type="warning">Warning</sm-button>

        <br/><br/>

        <sm-button type="text">Text</sm-button>
        <sm-button type="text-success">Text Success</sm-button>
        <sm-button type="text-warning">Text Warning</sm-button>
        <sm-button>Default</sm-button>
      </div>

      <br/><br/>

      <div>
        <span class="sui-storybook-header">Sizes</span>
        <sm-button type="primary" size="large">Large/Default</sm-button>
        <sm-button type="primary" size="medium">Medium</sm-button>
        <sm-button type="primary" size="small">Small</sm-button>
        <sm-button type="primary" size="mini">Mini</sm-button>
      </div>

      <br/><br/>

      <div>
        <span class="sui-storybook-header">Shapes</span>
        <sm-button aria-label="Close" shape="square"><sm-icon name="action-cross" /></sm-button>
        <sm-button aria-label="Close" shape="square" type="text"><sm-icon name="action-cross" /></sm-button>
        <sm-button aria-label="Close" shape="square" type="primary"><sm-icon name="action-cross" /></sm-button>
        <sm-button aria-label="Edit" shape="square" type="secondary"><sm-icon name="action-edit" /></sm-button>
        <sm-button aria-label="Save" shape="square" type="tertiary"><sm-icon name="rating-default" /></sm-button>
        <sm-button aria-label="Close" shape="square" type="primary" size="medium"><sm-icon name="action-cross" /></sm-button>
        <sm-button aria-label="Close" shape="square" type="secondary" size="medium"><sm-icon name="action-cross" /></sm-button>
        <sm-button aria-label="Save" shape="square" type="tertiary" size="medium"><sm-icon name="rating-default" /></sm-button>

        <br/><br/>

        <sm-button aria-label="Close" shape="round"><sm-icon name="action-cross" /></sm-button>
        <sm-button aria-label="Close" shape="round" type="text"><sm-icon name="action-cross" /></sm-button>
        <sm-button aria-label="Close" shape="round" type="primary"><sm-icon name="action-cross" /></sm-button>
        <sm-button aria-label="Edit" shape="round" type="secondary"><sm-icon name="action-edit" /></sm-button>
        <sm-button aria-label="Save" shape="round" type="tertiary"><sm-icon name="rating-default" /></sm-button>
        <sm-button aria-label="Close" shape="round" type="primary" size="medium"><sm-icon name="action-cross" /></sm-button>
        <sm-button aria-label="Close" shape="round" type="secondary" size="medium"><sm-icon name="action-cross" /></sm-button>
        <sm-button aria-label="Save" shape="round" type="tertiary" size="medium"><sm-icon name="rating-default" /></sm-button>
      </div>
    </div>
  `,
})

export const States = () => ({
  components: { SmButton },
  template: `
    <div>
      <div>
        <span class="sui-storybook-header">Disabled</span>
        <sm-button type="text" disabled>Text Disabled</sm-button>
        <sm-button disabled>Button Disabled</sm-button>
      </div>

      <br/><br/>

      <div>
        <span class="sui-storybook-header">Loading</span>
        <sm-button type="primary" :loading="true">Primary</sm-button>
        <sm-button type="secondary" :loading="true">Secondary</sm-button>
        <sm-button type="secondary-warning" :loading="true">secondary-warning</sm-button>
        <sm-button type="secondary-success" :loading="true">secondary-success</sm-button>
        <sm-button type="tertiary" :loading="true">Tertiary</sm-button>

        <br/><br/>

        <sm-button type="success" :loading="true">Success</sm-button>
        <sm-button type="alert" :loading="true">Alert</sm-button>
        <sm-button type="warning" :loading="true">Warning</sm-button>

        <sm-button type="text" :loading="true">Text</sm-button>
        <sm-button type="text-success" :loading="true">Text Success</sm-button>
        <sm-button type="text-warning" :loading="true">Text Warning</sm-button>
      </div>

      <br/><br/>

      <div>
        <span class="sui-storybook-header">Loading and disabled</span>
        <sm-button type="primary" :loading="true" :disabled="true">Primary</sm-button>
        <sm-button type="secondary" :loading="true" :disabled="true">Secondary</sm-button>
        <sm-button type="secondary-warning" :loading="true" :disabled="true">secondary-warning</sm-button>
        <sm-button type="secondary-success" :loading="true" :disabled="true">secondary-success</sm-button>
        <sm-button type="tertiary" :loading="true" :disabled="true">Tertiary</sm-button>

        <br/><br/>

        <sm-button type="success" :loading="true" :disabled="true">Success</sm-button>
        <sm-button type="alert" :loading="true" :disabled="true">Alert</sm-button>
        <sm-button type="warning" :loading="true" :disabled="true">Warning</sm-button>

        <br/><br/>

        <sm-button type="text" :loading="true" :disabled="true">Text</sm-button>
        <sm-button type="text-success" :loading="true" :disabled="true">Text Success</sm-button>
        <sm-button type="text-warning" :loading="true" :disabled="true">Text Warning</sm-button>
      </div>
    </div>
  `,
})

export const IconsAndBadges = () => ({
  components: { SmButton },
  template: `
    <div>
      <span class="sui-storybook-header">Icons</span>
      <sm-button type="primary" prefix-icon="action-pin">
        Prefix
      </sm-button>
      <sm-button type="primary" suffix-icon="action-pin">
        Suffix
      </sm-button>
      <sm-button type="primary" prefix-icon="action-pin" suffix-icon="action-pin">
        Both
      </sm-button>

      <br/><br/>

      <span class="sui-storybook-header">Badges</span>
      <sm-button type="primary">
        <template v-slot:default>
          Badge slot
        </template>
        <template v-slot:badge>
          <sm-badge />
        </template>
      </sm-button>

      <sm-button type="tertiary">
        Inline
        <sm-badge class="ml-4" size="medium" type="info">30</sm-badge>
      </sm-button>
    </div>
  `,
})

IconsAndBadges.storyName = 'Icons and badges'
IconsAndBadges.parameters = {
  docs: {
    description: {
      story: 'Badges can be added to the <code>sm-button</code> component in two ways. <br/> To make the badge appear in the top-right hand corner, use the <code>badge</code> slot. <br/> To make the badge appear on the same line as the text, simply add the component where you\'d like it to display.',
    },
  },
}

export const VueRouter = () => ({
  components: { SmButton },
  methods: {
    onClick: (e: MouseEvent) => {
      console.info('click:', e)
    },
    onMouseOver: (e: MouseEvent) => {
      console.info('mouseover:', e)
    },
    onMouseOut: (e: MouseEvent) => {
      console.info('mouseout:', e)
    },
    onFocusIn: (e: FocusEvent) => {
      console.info('focusin:', e)
    },
    onFocusOut: (e: FocusEvent) => {
      console.info('focusout:', e)
    },
  },
  template: `
    <div>
      <sm-button type="primary" to="/path">Router-link Element</sm-button>
      <sm-button type="primary" href="#">Anchor Element</sm-button>
      <sm-button
        type="primary"
        @click="onClick"
        @focusin="onFocusIn"
        @focusout="onFocusOut"
        @mouseover="onMouseOver"
        @mouseout="onMouseOut"
      >
        Button Element
      </sm-button>
    </div>
  `,
})

VueRouter.parameters = {
  docs: {
    description: {
      // The rest uses `story`
      story: 'The Button component is compatible with <code>vue-router</code>. <br/> Using the <code>to</code> prop will force the component to render as a <code>router-link</code> component. <br/> Using the <code>href</code> prop will force the component to render as a native <code>a</code> element. <br/> Providing neither of the above will force the component to render as a native <code>button</code> element. <br/> Native attributes such as <code>target</code>, <code>rel</code>, <code>aria-*</code> will continue to work as expected.',
    },
  },
}

export const StylingHooks = () => ({
  components: { SmButton },
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
        Does not require sui-themes package installation starting sui-core@23.0.0-vue3
      </template>
    </sm-help-card>

    <p>Styling hooks will enable customization for your components. Styling hooks are constructed using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">CSS custom properties</a>.</p>

      <p>Below is an example of the SUI button and the brand button using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 266px; height: auto; min-width: 0"
          alt="Button default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 266px; height: auto; min-width: 0"
          alt="Button themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the button customization variables, followed by <a href="/?path=/docs/guides-theming--styling-hooks#theme-categories">theme categories</a> and <a href="/?path=/docs/guides-theming--styling-hooks#naming-conventions">naming convention</a></p>

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
              padding-y
              <br/>
              padding-x
              <br/>
              padding-text-left
              <br/>
              padding-text-right
              <br/>
              border-radius
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-button-padding-y<br/>
                --sm-c-button-padding-x<br/>
                --sm-c-button-padding-text-left<br/>
                --sm-c-button-padding-text-right<br/>
                --sm-c-button-border-radius
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td rowspan="4">Size</sm-table-td>
            <sm-table-td>large:default</sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-button-font-size-large<br/>
              --sm-c-button-line-height-large<br/>
              --sm-c-button-letter-spacing-large<br/>
              --sm-c-button-font-weight-large<br/>
              --sm-c-button-border-width-large
              </code>
            </sm-table-td>

          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>medium</sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-button-font-size-medium<br/>
                --sm-c-button-letter-spacing-medium
              </code>
            </sm-table-td>

          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>small</sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-button-font-size-small<br/>
                --sm-c-button-letter-spacing-small
              </code>
            </sm-table-td>

          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>mini</sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-button-font-size-mini
              </code>
            </sm-table-td>

          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td rowspan="2">Type</sm-table-td>
            <sm-table-td>
              default
              <br/> primary
              <br/> secondary
              <br/> tertiary
              <br/> success
              <br/> alert
              <br/> warning
              <br/> text
              <br/> text-warning
              <br/> text-success
              <br/> secondary-warning
              <br/> secondary-success
              <br/> info
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-button-color-border-#{$type}<br/>
                --sm-c-button-color-text-#{$type}<br/>
                --sm-c-button-color-background-#{$type}<br/><br/>

                --sm-c-button-color-border-#{$type}-hover<br/>
                --sm-c-button-color-text-#{$type}-hover<br/>
                --sm-c-button-color-background-#{$type}-hover<br/><br/>

                --sm-c-button-color-border-#{$type}-focus<br/>
                --sm-c-button-color-text-#{$type}-focus<br/>
                --sm-c-button-color-background-#{$type}-focus<br/><br/>

                --sm-c-button-color-border-#{$type}-clicked<br/>
                --sm-c-button-color-text-#{$type}-clicked<br/>
                --sm-c-button-color-background-#{$type}-clicked<br/>
              </code>
            </sm-table-td>

          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>tertiary</sm-table-td>
            <sm-table-td>
              <p><span style="font-weight: 600;">Additional hooks:</span></p>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-button-shadow-tertiary<br/>
                --sm-c-button-border-width-tertiary<br/><br/>

                --sm-c-button-color-icon-tertiary-square<br/>
                --sm-c-button-color-icon-tertiary-round<br/>
              </code>
            </sm-table-td>

          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td rowspan="2">Shape</sm-table-td>
            <sm-table-td>round</sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-button-font-size-round<br/>
              --sm-c-button-border-radius-round
              </code>
            </sm-table-td>

          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>square</sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-button-font-size-square<br/>
                --sm-c-button-border-radius-square
              </code>
            </sm-table-td>

          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Disabled</sm-table-td>
            <sm-table-td>disabled</sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-button-color-border-disabled<br/>
                --sm-c-button-color-text-disabled<br/>
                --sm-c-button-color-background-disabled<br/>
                --sm-c-button-border-width-disabled
              </code>
            </sm-table-td>

          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Loading</sm-table-td>
            <sm-table-td>loading</sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-button-color-icon-loading-default<br/>
                --sm-c-button-color-icon-loading-primary<br/>
                --sm-c-button-color-icon-loading-alert<br/>
                --sm-c-button-color-icon-loading-warning<br/>
                --sm-c-button-color-icon-loading-success<br/>
                --sm-c-button-color-icon-loading-info<br/>
                --sm-c-button-color-icon-loading-secondary-success<br/>
                --sm-c-button-color-icon-loading-secondary-warning<br/>
                --sm-c-button-color-icon-loading-text-success<br/>
                --sm-c-button-color-icon-loading-text-warning<br/>
                --sm-c-button-color-icon-loading-disabled
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
