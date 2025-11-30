import SmHelpCard from '../sm-help-card.vue'
import defaultExample from './images/help-card-default.png'
import themedExample from './images/help-card-themed.png'

export default {
  title: 'Components/Help Card',
  component: SmHelpCard,
}

export const Types = () => ({
  components: { SmHelpCard },
  template: `
    <div class="w-full max-w-sm grid gap-16">

      <sm-help-card>
        <template #header>Header</template>
      </sm-help-card>

      <sm-help-card type="warning">
        <template #header>Header</template>
      </sm-help-card>

      <sm-help-card type="success">
        <template #header>Header</template>
      </sm-help-card>

      <sm-help-card type="alert">
        <template #header>Header</template>
      </sm-help-card>

      <sm-help-card>
        <template #header>Header</template>
        <template #body>Copy here</template>
      </sm-help-card>

      <sm-help-card type="alert">
        <template #header>Header</template>
        <template #body>Copy here</template>
      </sm-help-card>

      <sm-help-card type="warning">
        <template #header>Header</template>
        <template #body>Copy here</template>
      </sm-help-card>

      <sm-help-card type="success">
        <template #header>Header</template>
        <template #body>Copy here</template>
      </sm-help-card>

      <sm-help-card type="warning">
        <template #body>
          <sm-icon name="utility-warning" class="mr-4 text-app-warning" />
          Body without the header
        </template>
      </sm-help-card>

    </div>
  `,
})

Types.parameters = {
  info: {},
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

      <sm-help-card class="mb-24">
        <template #header>
          Does not require sui-themes package installation starting sui-core@19.0.0-vue3
        </template>
      </sm-help-card>

      <p>Styling hooks will enable customization for your components. Styling hooks are constructed using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">CSS custom properties</a>.</p>

      <p>Below is an example of the SUI help card and the brand help card using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 448px; height: auto; min-width: 0"
          alt="Help card default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 448px; height: auto; min-width: 0"
          alt="Help card themed example"
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
            <sm-table-td>Types</sm-table-td>
            <sm-table-td>
              info (default)
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
              >--sm-c-help-card-color-icon-#{$type}
                --sm-c-help-card-color-background-#{$type}
                --sm-c-help-card-color-border-#{$type}
                --sm-c-help-card-color-border-left-#{$type}
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
