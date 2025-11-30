import SmContainer from '../sm-container.vue'
import SmSection from '../../sm-section/sm-section.vue'

const standardDocs = `
  The container element is a structural block designed to provide a consistent max-width and left/right padding for common layouts.

  It doesn't provide any vertical spacing though. To achieve this, use the <code>sm-section</code> component.

  If you need a full-width container, apply the <code>full-width</code> prop.
`
export default {
  title: 'Components/Container',
  component: SmContainer,
  parameters: {
    docs: {
      description: {
        // Uses `component` here since it's the primary story
        component: standardDocs,
      },
    },
  },
}

export const Standard = () => ({
  components: { SmContainer, SmSection },
  template: `
    <div>
      <span class="sui-storybook-header">Default</span>
      <sm-container class="bg-blue-neu-mid">
        <div class="bg-blue-neu-dark text-white">
          Content
        </div>
      </sm-container>

      <br/><br/>

      <span class="sui-storybook-header">Full-width</span>
      <sm-container full-width class="bg-blue-neu-mid">
        <div class="bg-blue-neu-dark text-white">
          Content
        </div>
      </sm-container>

      <br/><br/>

      <span class="sui-storybook-header">With sm-section</span>
      <sm-section class="bg-blue-neu-light">
        <sm-container class="bg-blue-neu-mid">
          <div class="bg-blue-neu-dark text-white">
            Content
          </div>
        </sm-container>
      </sm-section>
    </div>
  `,
})

Standard.parameters = {
  percy: {
    // Cover full-width prop
    widths: [1367, 1025],
  },
}

export const StylingHooks = () => ({
  template: `
    <div>
      <h3>Styling hooks</h3>
      <p>Styling hooks will enable customization for your components. Styling hooks are constructed using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">CSS custom properties</a>.</p>

      <p>Below are the container customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
              padding
              <br/>
              max-width
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-container-padding
                --sm-c-container-max-width

                --sm-c-container-padding-extra-large-desktop
                --sm-c-container-max-width-extra-large-desktop
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
