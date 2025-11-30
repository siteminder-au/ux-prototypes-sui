import SmTag from '../sm-tag.vue'
import defaultExample from './images/tag-default.png'
import themedExample from './images/tag-themed.png'

export default {
  title: 'Components/Tag',
  component: SmTag,
}

export const Variants = () => ({
  components: { SmTag },
  setup: () => {
    // eslint-disable-next-line no-alert
    const onClose = e => alert(e)

    return { onClose }
  },
  template: `
    <div>
      <div>
        <span class="sui-storybook-header">Small</span>

        <sm-tag size="small">Default</sm-tag>
        <sm-tag size="small" type="success">Success</sm-tag>
        <sm-tag size="small" type="warning">Warning</sm-tag>
        <sm-tag size="small" type="alert">Alert</sm-tag>
        <sm-tag size="small" disabled>Disabled</sm-tag>

        <br/><br/>

        <sm-tag size="small"><sm-icon name="rating-default" />Default</sm-tag>
        <sm-tag size="small" type="success"><sm-icon name="arrow-go-up" />12%</sm-tag>
        <sm-tag size="small" type="warning"><sm-icon name="arrow-go-down" />12%</sm-tag>
        <sm-tag size="small" type="alert"><sm-icon name="utility-alert" />Alert</sm-tag>
        <sm-tag size="small" disabled><sm-icon name="rating-default" />Disabled</sm-tag>
      </div>

      <br/><br/>

      <div>
        <span class="sui-storybook-header">Medium</span>

        <sm-tag size="medium">Default</sm-tag>
        <sm-tag size="medium" type="success">Success</sm-tag>
        <sm-tag size="medium" type="warning">Warning</sm-tag>
        <sm-tag size="medium" type="alert">Alert</sm-tag>
        <sm-tag size="medium" disabled>Disabled</sm-tag>

        <br/><br/>

        <sm-tag size="medium"><sm-icon name="rating-default" />Default</sm-tag>
        <sm-tag size="medium" type="success"><sm-icon name="arrow-go-up" />12%</sm-tag>
        <sm-tag size="medium" type="warning"><sm-icon name="arrow-go-down" />12%</sm-tag>
        <sm-tag size="medium" type="alert"><sm-icon name="utility-alert" />Alert</sm-tag>
        <sm-tag size="medium" disabled><sm-icon name="rating-default" />Disabled</sm-tag>

        <br/><br/>

        <sm-tag size="medium" closable @close="onClose">Default</sm-tag>
        <sm-tag size="medium" type="success" closable @close="onClose">Success</sm-tag>
        <sm-tag size="medium" type="warning" closable @close="onClose">Warning</sm-tag>
        <sm-tag size="medium" type="alert" closable @close="onClose">Alert</sm-tag>
        <sm-tag size="medium" disabled closable @close="onClose">Disabled</sm-tag>

        <br/><br/>

        <sm-tag size="medium" closable @close="onClose"><sm-icon name="rating-default" />Default</sm-tag>
        <sm-tag size="medium" type="success" closable @close="onClose"><sm-icon name="arrow-go-up" />12%</sm-tag>
        <sm-tag size="medium" type="warning" closable @close="onClose"><sm-icon name="arrow-go-down" />12%</sm-tag>
        <sm-tag size="medium" type="alert" closable @close="onClose"><sm-icon name="utility-alert" />Alert</sm-tag>
        <sm-tag size="medium" disabled closable @close="onClose"><sm-icon name="rating-default" />Disabled</sm-tag>
      </div>

      <br/><br/>

      <div>
        <span class="sui-storybook-header">Large</span>

        <sm-tag>Default</sm-tag>
        <sm-tag type="success">Success</sm-tag>
        <sm-tag type="warning">Warning</sm-tag>
        <sm-tag type="alert">Alert</sm-tag>
        <sm-tag disabled>Disabled</sm-tag>

        <br/><br/>

        <sm-tag><sm-icon name="rating-default" />Default</sm-tag>
        <sm-tag type="success"><sm-icon name="arrow-go-up" />12%</sm-tag>
        <sm-tag type="warning"><sm-icon name="arrow-go-down" />12%</sm-tag>
        <sm-tag type="alert"><sm-icon name="utility-alert" />Alert</sm-tag>
        <sm-tag disabled><sm-icon name="rating-default" />Disabled</sm-tag>

        <br/><br/>

        <sm-tag closable @close="onClose">Default</sm-tag>
        <sm-tag type="success" closable @close="onClose">Success</sm-tag>
        <sm-tag type="warning" closable @close="onClose">Warning</sm-tag>
        <sm-tag type="alert" closable @close="onClose">Alert</sm-tag>
        <sm-tag disabled closable @close="onClose">Disabled</sm-tag>

        <br/><br/>

        <sm-tag closable @close="onClose"><sm-icon name="rating-default" />Default</sm-tag>
        <sm-tag type="success" closable @close="onClose"><sm-icon name="arrow-go-up" />12%</sm-tag>
        <sm-tag type="warning" closable @close="onClose"><sm-icon name="arrow-go-down" />12%</sm-tag>
        <sm-tag type="alert" closable @close="onClose"><sm-icon name="utility-alert" />Alert</sm-tag>
        <sm-tag closable disabled @close="onClose"><sm-icon name="rating-default" />Disabled</sm-tag>
      </div>
    </div>
  `,
})

Variants.parameters = {
  info: {},
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

      <p>Below is an example of the SUI tag and the brand tag using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 362px; height: auto; min-width: 0"
          alt="Tag default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 362px; height: auto; min-width: 0"
          alt="Tag themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the tag customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
              <br/>
              font-size
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-tag-border-radius
                --sm-c-tag-font-size

                --sm-c-tag-padding-small
                --sm-c-tag-padding-medium
                --sm-c-tag-padding-large
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Types</sm-table-td>
            <sm-table-td>
              info
              <br/>
              success
              <br/>
              alert
              <br/>
              warning
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-tag-color-text-#{$type}
                --sm-c-tag-color-background-#{$type}
                --sm-c-tag-close-color-icon-#{$type}
                --sm-c-tag-close-color-background-#{$type}-hover

                --sm-c-tag-color-text-disabled
                --sm-c-tag-color-background-disabled
                --sm-c-tag-close-color-icon-disabled
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Content</sm-table-td>
            <sm-table-td>
              font-weight
              <br/>
              letter-spacing
              <br/>
              line-height
              <br/>
              margin-right
              <br/>
              icon-size
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-tag-content-font-weight
                --sm-c-tag-content-letter-spacing
                --sm-c-tag-content-line-height
                --sm-c-tag-content-icon-margin-right
                --sm-c-tag-content-icon-size
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Close button</sm-table-td>
            <sm-table-td>
              border-radius
              <br/>
              padding
              <br/>
              margin-left
              <br/>
              width
              <br/>
              height
              <br/>
              icon-size
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-tag-close-border-radius
                --sm-c-tag-close-padding
                --sm-c-tag-close-margin-left
                --sm-c-tag-close-width
                --sm-c-tag-close-height
                --sm-c-tag-close-icon-size
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
