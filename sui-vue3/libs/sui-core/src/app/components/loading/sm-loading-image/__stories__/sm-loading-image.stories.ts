import SmLoadingImage from '../sm-loading-image.vue'
import defaultExample from './images/loading-image-default.png'
import themedExample from './images/loading-image-themed.png'

export default {
  title: 'Components/Loading/Loading image',
  component: SmLoadingImage,
}

export const Standard = () => ({
  components: { SmLoadingImage },
  template: `
    <div>
      <sm-loading-image style="height: 188px; width: 230px" />
    </div>
  `,
})

Standard.parameters = {
  docs: {
    description: {
      component: 'The sm-loading-image provide a simple skeleton loading image. The width and height of the image must be set in the implementation.',
    },
  },
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

      <p>Below is an example of the SUI loading image and the brand loading image using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 254px; height: auto; min-width: 0"
          alt="Loading image default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 254px; height: auto; min-width: 0"
          alt="Loading image themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the loading image customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
            <sm-table-th colspan="3">Input</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              border-radius
              <br/>
              color-background
              <br/>
              color-foreground
              <br/>
              image-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-loading-image-border-radius
                --sm-c-loading-image-color-background
                --sm-c-loading-image-color-foreground
                --sm-c-loading-image-image-background
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
