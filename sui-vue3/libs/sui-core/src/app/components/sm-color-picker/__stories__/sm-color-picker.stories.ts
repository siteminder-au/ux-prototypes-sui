import { ref } from 'vue'
import SmColorPicker from '../sm-color-picker.vue'
import defaultExample from './images/color-picker-default.png'
import themedExample from './images/color-picker-themed.png'

/**
 * NOTE:
 *
 * We are expecting Percy visual diffs between Vue2 and Vue3 Storybook here.
 * Vue3 trims the whitespace between the saturation and hue pickers, which is not the case in Vue2.
 * This is also the case in Goldeneyes even with the whitespace preserve config in Vue3.
 *
 * The elements in question are from the `vue3-color` package.
 */

export default {
  title: 'Components/Color Picker',
  component: SmColorPicker,
}

export const Standard = () => ({
  components: { SmColorPicker },
  setup: () => {
    const defaultColor = ref('#488ED9')
    const displayPicker = ref(null)
    const defaultColorOne = ref('#292987')
    const displayPickerOne = ref(true)

    const hidePicker = () => {
      console.info('hide')
    }

    const showPicker = () => {
      console.info('show')
    }

    return {
      defaultColor,
      displayPicker,
      defaultColorOne,
      displayPickerOne,
      showPicker,
      hidePicker,
    }
  },
  template: `
    <div class="flex flex-wrap -mx-12 text-center">
      <div class="w-1/2">
        <sm-color-picker v-model:hexColor="defaultColor" v-model="defaultColor" v-model:visibleColorPicker="displayPicker" @showPicker="showPicker" @hidePicker="hidePicker">
          <template v-slot:input>
            <span>
              <sm-input
                name="color-one"
                v-model="defaultColor"
                label="Color"
                placeholder="Select color"
                :error-disabled="true"
                :label-hidden="true"
                @focus="displayPicker = true"
              >
                <template #suffix>
                  <span
                    class="current-color relative"
                    style="border-radius: inherit; height: 40px; width: 40px; top: -1px; margin-right: -1px"
                    :style="'background-color: ' + defaultColor"
                  />
                </template>
              </sm-input>
            </span>
          </template>
        </sm-color-picker>
      </div>
      <div class="w-1/2">
        <sm-color-picker v-model:hexColor="defaultColorOne" v-model="defaultColorOne" v-model:visibleColorPicker="displayPickerOne">
          <template v-slot:input>
            <span>
              <sm-input
                name="color-two"
                v-model="defaultColorOne"
                label="Color"
                placeholder="Select color"
                :error-disabled="true"
                :label-hidden="true"
                @focus="displayPickerOne = true"
              >
                <template #suffix>
                  <span
                    class="current-color relative"
                    style="border-radius: inherit; height: 40px; width: 40px; top: -1px; margin-right: -1px"
                    :style="'background-color: ' + defaultColorOne"
                  />
                </template>
              </sm-input>
            </span>
          </template>
        </sm-color-picker>
      </div>
    </div>
  `,
})

Standard.storyName = 'Standard'

const standardDescription = `
  Control the visibility of the color picker using the <code>v-model:visibleColorPicker</code> as per the vue3 recommendation.

  Use the <code>input</code> slot to provide a custom input, button or other clickable element to show/hide color picker with <code>visibleColorPicker</code> binding.
`
Standard.parameters = {
  docs: {
    description: {
      component: standardDescription,
    },
  },
  percy: {
    // Needed for the Percy setup steps in onMounted hook to run
    // Take note of the defaults when upgrading Storybook or Percy in the future
    // https://docs.percy.io/docs/storybook#unexpected-diffs
    enableJavascript: true,
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

    <p>Below is an example of the SUI color picker and the brand color picker using Styling hooks</p>
    <div class="flex items-start gap-24">
      <img
        style="width: 100%; max-width: 300px; height: auto; min-width: 0"
        alt="Color picker default example"
        class="block mb-16 flex-1"
        :src="defaultImage"
      />
      <img
        style="width: 100%; max-width: 300px; height: auto; min-width: 0"
        alt="Color picker themed example"
        class="block mb-16 flex-1"
        :src="themedImage"
      />
    </div>

    <p>Below are the color picker customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
          <sm-table-td>Container</sm-table-td>
          <sm-table-td>
            border <br/>
            border-radius <br/>
            box-shadow <br/>
            color-background <br/>
            padding <br/>
            max-width <br/>
            min-height
          </sm-table-td>
          <sm-table-td>
            <code
              class="sui-storybook-code sui-storybook-code--block"
            >--sm-c-color-picker-border
              --sm-c-color-picker-border-radius
              --sm-c-color-picker-box-shadow
              --sm-c-color-picker-color-background
              --sm-c-color-picker-padding
              --sm-c-color-picker-max-width
              --sm-c-color-picker-min-height
            </code>
          </sm-table-td>
        </sm-table-tr>

        <sm-table-tr>
          <sm-table-td>Saturation</sm-table-td>
          <sm-table-td>
            border <br/>
            border-radius <br/>
            width <br/>
            height
          </sm-table-td>
          <sm-table-td>
            <code
              class="sui-storybook-code sui-storybook-code--block"
            >--sm-c-color-picker-saturation-border
              --sm-c-color-picker-saturation-border-radius
              --sm-c-color-picker-saturation-width
              --sm-c-color-picker-saturation-height
            </code>
          </sm-table-td>
        </sm-table-tr>

        <sm-table-tr>
          <sm-table-td>Saturation picker</sm-table-td>
          <sm-table-td>
            border-radius <br/>
            box-shadow <br/>
            width <br/>
            height
          </sm-table-td>
          <sm-table-td>
            <code
              class="sui-storybook-code sui-storybook-code--block"
            >--sm-c-color-picker-saturation-picker-border-radius
              --sm-c-color-picker-saturation-picker-box-shadow
              --sm-c-color-picker-saturation-picker-width
              --sm-c-color-picker-saturation-picker-height
            </code>
          </sm-table-td>
        </sm-table-tr>

        <sm-table-tr>
          <sm-table-td>Hue</sm-table-td>
          <sm-table-td>
            border-radius <br/>
            margin-left <br/>
            width <br/>
            height
          </sm-table-td>
          <sm-table-td>
            <code
              class="sui-storybook-code sui-storybook-code--block"
            >--sm-c-color-picker-hue-border-radius
              --sm-c-color-picker-hue-margin-left
              --sm-c-color-picker-hue-width
              --sm-c-color-picker-hue-height
            </code>
          </sm-table-td>
        </sm-table-tr>

        <sm-table-tr>
          <sm-table-td>Hue picker</sm-table-td>
          <sm-table-td>
            border-radius <br/>
            box-shadow <br/>
            color-background <br/>
            width <br/>
            height <br/>
            transform
          </sm-table-td>
          <sm-table-td>
            <code
              class="sui-storybook-code sui-storybook-code--block"
            >--sm-c-color-picker-hue-picker-border-radius
              --sm-c-color-picker-hue-picker-box-shadow
              --sm-c-color-picker-hue-picker-background
              --sm-c-color-picker-hue-picker-width
              --sm-c-color-picker-hue-picker-height
              --sm-c-color-picker-hue-picker-transform
            </code>
          </sm-table-td>
        </sm-table-tr>

        <sm-table-tr>
          <sm-table-td>Color preview</sm-table-td>
          <sm-table-td>
            border <br/>
            border-radius <br/>
            width <br/>
            height
          </sm-table-td>
          <sm-table-td>
            <code
              class="sui-storybook-code sui-storybook-code--block"
            >--sm-c-color-picker-color-preview-border
              --sm-c-color-picker-color-preview-border-radius
              --sm-c-color-picker-color-preview-width
              --sm-c-color-picker-color-preview-height
            </code>
          </sm-table-td>
        </sm-table-tr>

        <sm-table-tr>
          <sm-table-td>Input - common</sm-table-td>
          <sm-table-td>
            border-radius <br/>
            right
          </sm-table-td>
          <sm-table-td>
            <code
              class="sui-storybook-code sui-storybook-code--block"
            >--sm-c-color-picker-input-border-radius
              --sm-c-color-picker-input-right
            </code>
          </sm-table-td>
        </sm-table-tr>

        <sm-table-tr>
          <sm-table-td>Input prefix</sm-table-td>
          <sm-table-td>
            border <br/>
            color-background <br/>
            color-text <br/>
            width <br/>
            height
          </sm-table-td>
          <sm-table-td>
            <code
              class="sui-storybook-code sui-storybook-code--block"
            >--sm-c-color-picker-input-prefix-border
              --sm-c-color-picker-input-prefix-color-background
              --sm-c-color-picker-input-prefix-color-text
              --sm-c-color-picker-input-prefix-width
              --sm-c-color-picker-input-prefix-height
            </code>
          </sm-table-td>
        </sm-table-tr>

        <sm-table-tr>
          <sm-table-td>Input field</sm-table-td>
          <sm-table-td>
            border <br/>
            color-background <br/>
            color-text <br/>
            width <br/>
            height
          </sm-table-td>
          <sm-table-td>
            <code
              class="sui-storybook-code sui-storybook-code--block"
            >--sm-c-color-picker-input-field-border
              --sm-c-color-picker-input-field-color-background
              --sm-c-color-picker-input-field-color-text
              --sm-c-color-picker-input-field-width
              --sm-c-color-picker-input-field-height

              --sm-c-color-picker-input-field-color-border-focus
              --sm-c-color-picker-input-field-box-shadow-focus
            </code>
          </sm-table-td>
        </sm-table-tr>

        <sm-table-tr>
          <sm-table-td>Select button</sm-table-td>
          <sm-table-td>
            margin <br/>
            min-width <br/>
            top
          </sm-table-td>
          <sm-table-td>
            <code
              class="sui-storybook-code sui-storybook-code--block"
            >--sm-c-color-picker-select-button-margin
              --sm-c-color-picker-select-button-min-width
              --sm-c-color-picker-select-button-top
            </code>
          </sm-table-td>
        </sm-table-tr>

      </sm-table-tbody>
    </sm-table>

  </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
