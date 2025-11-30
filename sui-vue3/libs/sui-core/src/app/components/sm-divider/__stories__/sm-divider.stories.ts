import SmDivider from '../sm-divider.vue'

export default {
  title: 'Components/Divider',
  component: SmDivider,
}

export const Standard = () => ({
  components: { SmDivider },
  template: `
    <div>
      <span class="sui-storybook-header">Standard</span>
      <sm-divider></sm-divider>

      <br/><br/>

      <span class="sui-storybook-header">Custom margin</span>
      <sm-divider margin-top="3.5rem" margin-bottom="3.5rem"></sm-divider>
    </div>
  `,
})

export const StylingHooks = () => ({
  template: `
    <div>
      <h3>Styling hooks</h3>
      <p>Styling hooks will enable customization for your components. Styling hooks are constructed using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">CSS custom properties</a>.</p>

      <p>Below are the divider customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
              color-background
              <br/>
              height
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-divider-color-background<br/>
                --sm-c-divider-height
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
