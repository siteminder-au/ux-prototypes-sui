import SmController from '../sm-controller.vue'
import defaultExample from './images/controller-default.png'
import themedExample from './images/controller-themed.png'

export default {
  title: 'Components/Controller',
  component: SmController,
}

export const Standard = () => ({
  components: { SmController },
  setup: () => {
    const left = () => {
      console.info('left')
    }
    const right = () => {
      console.info('right')
    }
    const leftmost = () => {
      console.info('leftmost')
    }
    const rightmost = () => {
      console.info('rightmost')
    }

    return {
      left,
      leftmost,
      right,
      rightmost,
    }
  },
  template: `
    <div>
      <sm-controller @left="left" @leftmost="leftmost" @right="right" @rightmost="rightmost">
        <template v-slot:leftmost>
          <sm-button aria-label="First" shape="square" type="text"><sm-icon name="arrow-left-alt" /></sm-button>
        </template>
        <template v-slot:left>
          <sm-button aria-label="Previous" shape="square" type="text"><sm-icon name="arrow-left" /></sm-button>
        </template>
        <template v-slot:right>
          <sm-button aria-label="Next" shape="square" type="text"><sm-icon name="arrow-right" /></sm-button>
        </template>
        <template v-slot:rightmost>
          <sm-button aria-label="Last" shape="square" type="text"><sm-icon name="arrow-right-alt" /></sm-button>
        </template>
        <template v-slot:body>
          Text in here
        </template>
      </sm-controller>

      <br/><br/>

      <sm-controller>
        <template v-slot:leftmost>
          <sm-button aria-label="First" shape="square" type="text" disabled><sm-icon name="arrow-left-alt" /></sm-button>
        </template>
        <template v-slot:left>
          <sm-button aria-label="Previous" shape="square" type="text" disabled><sm-icon name="arrow-left" /></sm-button>
        </template>
        <template v-slot:right>
          <sm-button aria-label="Next" shape="square" type="text"><sm-icon name="arrow-right" /></sm-button>
        </template>
        <template v-slot:rightmost>
          <sm-button aria-label="Last" shape="square" type="text"><sm-icon name="arrow-right-alt" /></sm-button>
        </template>
        <template v-slot:body>
          Text in here
        </template>
      </sm-controller>
    </div>
  `,
})

Standard.storyName = 'Standard'

const standardDescription = `
 The controller component is used to navigate through a list of items.
`
Standard.parameters = {
  docs: {
    description: {
      component: standardDescription,
    },
  },
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
      <p>Styling hooks will enable customization for your components. Styling hooks are constructed using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">CSS custom properties</a>.</p>

      <p>Below is an example of the SUI controller and the brand controller using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 274px; height: auto; min-width: 0"
          alt="Controller default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 274px; height: auto; min-width: 0"
          alt="Controller themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the controller customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>
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
              border
              <br/>
              border-radius
              <br/>
              box-shadow
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-controller-border
                --sm-c-controller-border-radius
                --sm-c-controller-box-shadow
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Content</sm-table-td>
            <sm-table-td>
              border-right
              <br/>
              height
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-controller-content-border-right
                --sm-c-controller-content-height
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Body</sm-table-td>
            <sm-table-td>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-controller-body-padding
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
