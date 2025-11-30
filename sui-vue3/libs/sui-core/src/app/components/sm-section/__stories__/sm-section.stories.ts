import SmSection from '../sm-section.vue'
import SmContainer from '../../sm-container/sm-container.vue'

export default {
  title: 'Components/Section',
  component: SmSection,
}

export const Standard = () => ({
  components: { SmSection, SmContainer },
  template: `
  <div>
    <span class="sui-storybook-header">Default</span>
    <sm-section class="bg-blue-neu-mid">
      <div class="bg-blue-neu-dark text-white">
        Content
      </div>
    </sm-section>

    <br/><br/>

    <span class="sui-storybook-header">With sm-container</span>
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

export const ElementTag = () => ({
  components: { SmSection },
  template: `
    <sm-section tag="div" class="bg-blue-neu-mid">
      <div class="bg-blue-neu-dark text-white">
        Content
      </div>
    </sm-section>
  `,
})

ElementTag.storyName = 'Element Tag'

export const StylingHooks = () => ({
  template: `
    <div>
      <h3>Styling hooks</h3>
      <p>Styling hooks will enable customization for your components. Styling hooks are constructed using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">CSS custom properties</a>.</p>

      <p>Below are the section customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-section-padding
                --sm-c-section-padding-extra-large-desktop
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
