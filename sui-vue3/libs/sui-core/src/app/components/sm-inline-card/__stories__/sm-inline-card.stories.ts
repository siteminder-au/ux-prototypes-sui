import SmInlineCard from '../sm-inline-card.vue'
import defaultExample from './images/inline-card-default.png'
import themedExample from './images/inline-card-themed.png'

export default {
  title: 'Components/Inline Card',
  component: SmInlineCard,
}

export const Standard = () => ({
  components: { SmInlineCard },
  template: `
    <div>

      <sm-inline-card title="Informational title here" message="Optional body text">
        <template v-slot:body>
          <p>Delectus et expedita. Saepe fuga mollitia magni eius quis. Eaque velit corrupti consequuntur omnis et neque voluptatibus odio. Laudantium voluptatum aspernatur natus.</p>
        </template>
        <template v-slot:footer>
          <sm-button type="primary" data-sm-button-test="primary">Primary</sm-button>
        </template>
      </sm-inline-card>

    </div>

  `,
})
export const Type = () => ({
  components: { SmInlineCard },
  template: `
    <div>
      <sm-inline-card title="Informational title here" message="Optional body text" type="info">
        <template v-slot:action>
          <a href="#" target='_blank'>Action</a>
        </template>
        <template v-slot:body>
          <p>Delectus et expedita. Saepe fuga mollitia magni eius quis. Eaque velit corrupti consequuntur omnis et neque voluptatibus odio. Laudantium voluptatum aspernatur natus.</p>
        </template>
        <template v-slot:footer>
          <sm-button type="primary" data-sm-button-test="primary">Primary</sm-button>
        </template>
      </sm-inline-card>

      <sm-inline-card title="Informational title here" message="Optional body text" type="success">
        <template v-slot:body>
          <p>Delectus et expedita. Saepe fuga mollitia magni eius quis. Eaque velit corrupti consequuntur omnis et neque voluptatibus odio. Laudantium voluptatum aspernatur natus.</p>
        </template>
        <template v-slot:footer>
          <sm-button type="success">Success</sm-button>
        </template>
      </sm-inline-card>

      <sm-inline-card title="Informational title here" message="Optional body text" type="alert">
        <template v-slot:body>
          <p>Delectus et expedita. Saepe fuga mollitia magni eius quis. Eaque velit corrupti consequuntur omnis et neque voluptatibus odio. Laudantium voluptatum aspernatur natus.</p>
        </template>
        <template v-slot:footer>
          <sm-button type="alert">Alert</sm-button>
        </template>
      </sm-inline-card>

      <sm-inline-card title="Informational title here" message="Optional body text" type="warning">
        <template v-slot:body>
          <p>Delectus et expedita. Saepe fuga mollitia magni eius quis. Eaque velit corrupti consequuntur omnis et neque voluptatibus odio. Laudantium voluptatum aspernatur natus.</p>
        </template>
        <template v-slot:footer>
          <sm-button type="warning">Warning</sm-button>
        </template>
      </sm-inline-card>

    </div>
  `,
})

Type.storyName = 'Type'
Type.parameters = {
  docs: {
    description: {
      // Story documentation
      story: '',
    },
  },
}

export const Size = () => ({
  components: { SmInlineCard },
  template: `
    <div>
      <sm-inline-card title="Informational title here" message="Optional body text" type="info" size="small">
        <template v-slot:action>
          <a href="#" target='_blank'>Action</a>
        </template>
        <template v-slot:body>
          <p>Delectus et expedita. Saepe fuga mollitia magni eius quis. Eaque velit corrupti consequuntur omnis et neque voluptatibus odio. Laudantium voluptatum aspernatur natus.</p>
        </template>
        <template v-slot:footer>
          <sm-button type="primary" data-sm-button-test="primary">Primary</sm-button>
        </template>
      </sm-inline-card>

      <sm-inline-card title="Informational title here" message="Optional body text" type="success" size="small">
        <template v-slot:body>
          <p>Delectus et expedita. Saepe fuga mollitia magni eius quis. Eaque velit corrupti consequuntur omnis et neque voluptatibus odio. Laudantium voluptatum aspernatur natus.</p>
        </template>
        <template v-slot:footer>
          <sm-button type="success">Success</sm-button>
        </template>
      </sm-inline-card>

      <sm-inline-card title="Informational title here" message="Optional body text" type="alert" size="small">
        <template v-slot:body>
          <p>Delectus et expedita. Saepe fuga mollitia magni eius quis. Eaque velit corrupti consequuntur omnis et neque voluptatibus odio. Laudantium voluptatum aspernatur natus.</p>
        </template>
        <template v-slot:footer>
          <sm-button type="alert">Alert</sm-button>
        </template>
      </sm-inline-card>

      <sm-inline-card title="Informational title here" message="Optional body text" type="warning" size="small">
        <template v-slot:body>
          <p>Delectus et expedita. Saepe fuga mollitia magni eius quis. Eaque velit corrupti consequuntur omnis et neque voluptatibus odio. Laudantium voluptatum aspernatur natus.</p>
        </template>
        <template v-slot:footer>
          <sm-button type="warning">Warning</sm-button>
        </template>
      </sm-inline-card>

    </div>
  `,
})

Size.storyName = 'Size'
Size.parameters = {
  docs: {
    description: {
      // Story documentation
      story: '',
    },
  },
}

export const Close = () => ({
  components: { SmInlineCard },
  data: () => {
    return {
      visible: true,
    }
  },
  template: `
    <sm-inline-card v-if="visible" title="Informational title here" message="Optional body text" type="info" @close="visible = false" show-close>
      <template v-slot:body>
        <p>Delectus et expedita. Saepe fuga mollitia magni eius quis. Eaque velit corrupti consequuntur omnis et neque voluptatibus odio. Laudantium voluptatum aspernatur natus.</p>
      </template>
      <template v-slot:footer>
        <sm-button type="primary" data-sm-button-test="primary">Primary</sm-button>
      </template>
    </sm-inline-card>
  `,
})

Close.storyName = 'Close'
Close.parameters = {
  docs: {
    description: {
      // Story documentation
      story: '',
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

      <p>Below is an example of the SUI inline card and the brand inline card using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 402px; height: auto; min-width: 0"
          alt="Inline card default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 402px; height: auto; min-width: 0"
          alt="Inline card themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the inline card customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
              border-radius
              <br/>
              border-style
              <br/>
              border-width
              <br/>
              color-background
              <br/>
              color-border
              <br/>
              color-text
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-inline-card-border-radius
                --sm-c-inline-card-border-style
                --sm-c-inline-card-border-width
                --sm-c-inline-card-border-width-top
                --sm-c-inline-card-color-background
                --sm-c-inline-card-color-border
                --sm-c-inline-card-color-border-top
                --sm-c-inline-card-color-text
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Header</sm-table-td>
            <sm-table-td>
              border-bottom
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-inline-card-header-border-bottom
                --sm-c-inline-card-header-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Body header</sm-table-td>
            <sm-table-td>
              padding-left
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-inline-card-body-header-padding-left
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Title</sm-table-td>
            <sm-table-td>
              margin-bottom
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >---sm-c-inline-card-title-margin-bottom
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Body</sm-table-td>
            <sm-table-td>
              border-bottom
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-inline-card-body-padding
                --sm-c-inline-card-body-padding-default
                --sm-c-inline-card-body-padding-small
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Footer</sm-table-td>
            <sm-table-td>
              border-top
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-inline-card-footer-border-top
                --sm-c-inline-card-footer-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Icon</sm-table-td>
            <sm-table-td>
              icon-size
              <br/>
              width
              <br/>
              height
              <br/>
              border-radius
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-inline-card-icon-size
                --sm-c-inline-card-icon-width
                --sm-c-inline-card-icon-height
                --sm-c-inline-card-icon-border-radius
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Close button</sm-table-td>
            <sm-table-td>
              color-icon
              <br/>
              margin-top
              <br/>
              margin-bottom
              <br/>
              margin-right
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-inline-card-close-color-icon
                --sm-c-inline-card-close-margin-top
                --sm-c-inline-card-close-margin-bottom
                --sm-c-inline-card-close-margin-right
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Type</sm-table-td>
            <sm-table-td>
              info <br/>
              success <br/>
              alert <br/>
              warning <br/>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-inline-card-color-text-#{$type}
                --sm-c-inline-card-color-background-#{$type}
                --sm-c-inline-card-color-border-#{$type}
                --sm-c-inline-card-color-border-top-#{$type}
                --sm-c-inline-card-icon-color-text-#{$type}
                --sm-c-inline-card-icon-color-background-#{$type}
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
