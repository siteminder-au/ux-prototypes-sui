import { ref } from 'vue'
import SmSlider from '../sm-slider.vue'
import SmInput from '../../forms/sm-input/sm-input.vue'
import defaultExample from './images/slider-default.png'
import themedExample from './images/slider-themed.png'

const standardDescription = `The slider is a component that allows users view and select values or range of values using a very visual format. Users can make these selections by moving the handle/s along the slider track.

The <sm-slider> component is available in different types: info, success and warning.

Use <code>disabled</code> props to disabled the slider.
        `

export default {
  title: 'Components/Slider',
  component: SmSlider,
  parameters: {
    docs: {
      description: {
        component: standardDescription,
      },
    },
  },
}

export const Standard = () => ({
  components: { SmSlider },
  setup: () => {
    const value = ref(10)
    const value1 = ref(4)
    const value2 = ref(2)
    const value3 = ref(50)

    const change = (i: number) => {
      console.info('change', i)
    }
    return { value, value1, value2, value3, change }
  },
  template: `
    <div>
      <div class="max-w-lg m-auto">
        <div class="sm-padding-xxlg">
          <sm-slider v-model="value" @change="(i) => change(i)" label="Slider label"></sm-slider>
        </div>
        <div class="sm-padding-xxlg">
          <sm-slider v-model="value1" type="success" label="Slider label"></sm-slider>
        </div>
        <div class="sm-padding-xxlg">
          <sm-slider v-model="value2" type="warning" :showTooltip="false" label="Slider label: no tooltip"></sm-slider>
        </div>
        <div class="sm-padding-xxlg">
          <sm-slider v-model="value3" disabled label="Slider label"></sm-slider>
        </div>
      </div>
    </div>
  `,
})

export const Range = () => ({
  components: { SmSlider },
  setup: () => {
    const value = ref([20, 70])
    const value1 = ref([0, 32])
    const value2 = ref([50, 100])
    const value3 = ref([20, 70])

    const change = (i: number) => {
      console.info('change', i)
    }
    return { value, value1, value2, value3, change }
  },
  template: `
    <div class="max-w-lg m-auto">
      <div class="sm-padding-xxlg">
        <sm-slider v-model="value" range @change="(i) => change(i)" label="Slider label"></sm-slider>
      </div>
      <div class="sm-padding-xxlg">
        <sm-slider v-model="value1" type="success" range label="Slider label"></sm-slider>
      </div>
      <div class="sm-padding-xxlg">
        <sm-slider v-model="value2" type="warning" range label="Slider label"></sm-slider>
      </div>
      <div class="sm-padding-xxlg">
        <sm-slider v-model="value3" disabled range label="Slider label"></sm-slider>
      </div>
    </div>
  `,
})

const rangeDescription = `Use <code>range</code> props to display slider range mode.

The v-model value should be passed as an array in case of <code>range</code> mode, for Example:

        // [StartPoint, EndPoint]
        const value = ref([20, 70])

Use <code>disabled</code> props to disabled the slider.
      `
Range.parameters = {
  docs: {
    description: {
      story: rangeDescription,
    },
  },
}

export const Step = () => ({
  components: { SmSlider },
  setup: () => {
    const value = ref(0)
    const value1 = ref(2)
    const value2 = ref(4)
    const value3 = ref(6)

    const value4 = ref([20, 70])
    const value5 = ref([0, 30])
    const value6 = ref([60, 100])
    const value7 = ref([20, 70])

    return { value, value1, value2, value3, value4, value5, value6, value7 }
  },
  template: `
    <div class="max-w-lg m-auto">
      <div class="sm-padding-xxlg">
        <sm-slider :show-stops="true" v-model="value" :step="10" :max="100" :min="0" label="Stops displayed"></sm-slider>
      </div>
      <div class="sm-padding-xxlg">
        <sm-slider type="success" :show-stops="true" v-model="value1" :step="2" :max="10" :min="0" label="Stops displayed"></sm-slider>
      </div>
      <div class="sm-padding-xxlg">
        <sm-slider type="warning" :show-stops="true" v-model="value2" :step="2" :max="10" :min="0" label="Stops displayed"></sm-slider>
      </div>
      <div class="sm-padding-xxlg">
        <sm-slider :show-stops="true" disabled v-model="value3" :step="2" :max="10" :min="0" label="Stops displayed"></sm-slider>
      </div>

      <div class="sm-padding-xxlg">
        <sm-slider :show-stops="true" v-model="value4" :step="10" range label="Range: Stops displayed"></sm-slider>
      </div>
      <div class="sm-padding-xxlg">
        <sm-slider type="success" :show-stops="true" v-model="value5" :step="10" range label="Range: Stops displayed"></sm-slider>
      </div>
      <div class="sm-padding-xxlg">
        <sm-slider type="warning" :show-stops="true" v-model="value6" :step="10" range label="Range: Stops displayed"></sm-slider>
      </div>
      <div class="sm-padding-xxlg">
        <sm-slider disabled :show-stops="true" v-model="value7" :step="10" range label="Range: Stops displayed"></sm-slider>
      </div>
    </div>
  `,
})

const stepDescription = `Use <code>showStops</code> props to display the stops on slider track

Use <code>max</code> and <code>min</code> value to update the default maximum and minimum value of a slider.

Use <code>step</code> props to set the stop points.

V-model values used here
<code>
const value = ref(0)

        const value1 = ref(0)

        const value2 = ref(0)

        const value3 = ref([20, 70])

        const value4 = ref(2)

        const value5 = ref(6)
`
Step.parameters = {
  docs: {
    description: {
      story: stepDescription,
    },
  },
}

export const SliderWithPrefixAndSuffix = () => ({
  components: { SmSlider, SmInput },
  setup: () => {
    const value = ref(5)
    const value1 = ref(5)
    const value2 = ref([20, 70])
    const value3 = ref(5)
    const value4 = ref(0)
    const value5 = ref(0)

    const change = (i: number) => {
      console.info('change', i)
    }
    return { value, value1, value2, value3, value4, value5, change }
  },
  template: `
    <div class="max-w-lg m-auto">

      <div class="sm-padding-xxlg">
        <sm-slider v-model="value" label="Slider label">
          <template v-slot:prefix>
            <sm-input v-model.number="value" width="42px" type="number" label="slider input" name="prefix" errorDisabled labelHidden>
            </sm-input>
          </template>
        </sm-slider>
      </div>

      <div class="sm-padding-xxlg">
        <sm-slider v-model="value3" label="Slider label">
          <template v-slot:suffix>
            <sm-input v-model.number="value3" width="42px" type="number" label="slider input" name="suffix" errorDisabled labelHidden>
            </sm-input>
          </template>
        </sm-slider>
      </div>

      <div class="sm-padding-xxlg">
        <sm-slider v-model="value1" label="Slider label">
          <template v-slot:suffix>
            <sm-input v-model.number="value1" width="43px" type="number" label="suffix input" name="suffix" errorDisabled labelHidden>
              <template v-slot:suffix>
                <sm-input-suffix-content>%Lower</sm-input-suffix-content>
              </template>
            </sm-input>
          </template>
        </sm-slider>
      </div>

      <div class="sm-padding-xxlg">
        <sm-slider v-model="value2" range  @change="(i) => change(i)" label="Slider label">
          <template v-slot:prefix>
            <sm-input v-model.number="value2[0]" width="43px" type="number" label="prefix range input" name="prefix" errorDisabled labelHidden/>
          </template>
          <template v-slot:suffix>
            <sm-input v-model="value2[1]" width="43px" type="number" label="suffix range input" name="suffix" errorDisabled labelHidden/>
          </template>
        </sm-slider>
      </div>

      <div class="sm-padding-xxlg">
        <sm-slider v-model="value4" label="Slider label" :show-stops="true" :step="10" :max="100" :min="0">
          <template v-slot:prefix>
            <sm-input v-model.number="value4" width="43px" type="number" label="slider input" name="prefix" errorDisabled labelHidden :step="10" :max="100" :min="0">
            </sm-input>
          </template>
        </sm-slider>
      </div>

      <div class="sm-padding-xxlg">
        <sm-slider v-model="value5" label="Slider label" :show-stops="true" :step="10" :max="100" :min="0">
          <template v-slot:suffix>
            <sm-input v-model.number="value5" width="43px" type="number" label="suffix input" name="suffix" errorDisabled labelHidden :step="10" :max="100" :min="0">
              <template v-slot:suffix>
                <sm-input-suffix-content>%Lower</sm-input-suffix-content>
              </template>
            </sm-input>
          </template>
        </sm-slider>
      </div>

    </div>
  `,
})

SliderWithPrefixAndSuffix.storyName = 'Slider with prefix and suffix'

SliderWithPrefixAndSuffix.parameters = {
  docs: {
    description: {
      story: `Use <code>input</code> slot if not used as a range mode.

Use <code>input</code> slot to manipulate the v-model value.

The <code>input</code> slot will be displayed at the end of the slider.

Use <code>prefix</code> and <code>suffix</code> slot for slider range mode.

Use <code>prefix</code> and <code>suffix</code> slot to manipulate v-model range value.
    `,
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

      <p>Below is an example of the SUI slider and the brand slider using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 382px; height: auto; min-width: 0"
          alt="Slider default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 382px; height: auto; min-width: 0"
          alt="Slider themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the slider customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
            <sm-table-th colspan="3">Label</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              color-text <br/>
              font-size <br/>
              padding-bottom
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-slider-label-color-text
                --sm-c-slider-label-font-size
                --sm-c-slider-label-padding-bottom
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Slider bar</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              border-radius <br/>
              height
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-slider-bar-border-radius
                --sm-c-slider-bar-height
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Active</sm-table-td>
            <sm-table-td>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-slider-bar-active-color-background-info
                --sm-c-slider-bar-active-color-background-success
                --sm-c-slider-bar-active-color-background-warning
                --sm-c-slider-bar-active-color-background-disabled
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Inactive</sm-table-td>
            <sm-table-td>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-slider-bar-inactive-color-background
                --sm-c-slider-bar-inactive-color-background-disabled
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Steps</sm-table-td>
            <sm-table-td>
              border-radius <br/>
              color-background <br/>
              opacity <br/>
              width <br/>
              height <br/>
              bottom
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-slider-bar-steps-border-radius
                --sm-c-slider-bar-steps-color-background
                --sm-c-slider-bar-steps-opacity
                --sm-c-slider-bar-steps-width
                --sm-c-slider-bar-steps-height

                <em>// Adjustment for range slider</em>
                --sm-c-slider-bar-steps-range-bottom
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Handle (knob)</sm-table-td>
            <sm-table-td>
              border-radius <br/>
              border-width <br/>
              color-background <br/>
              color-border <br/>
              width <br/>
              height <br/>
              box-shadow <br/>
              scale
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-slider-bar-handle-border-radius
                --sm-c-slider-bar-handle-border-width
                --sm-c-slider-bar-handle-width
                --sm-c-slider-bar-handle-height

                --sm-c-slider-bar-handle-scale-hover

                --sm-c-slider-bar-handle-box-shadow
                --sm-c-slider-bar-handle-box-shadow-hover
                --sm-c-slider-bar-handle-box-shadow-active

                --sm-c-slider-bar-handle-color-background-info
                --sm-c-slider-bar-handle-color-background-info-hover
                --sm-c-slider-bar-handle-color-background-info-active

                --sm-c-slider-bar-handle-color-background-success
                --sm-c-slider-bar-handle-color-background-success-hover
                --sm-c-slider-bar-handle-color-background-success-active

                --sm-c-slider-bar-handle-color-background-warning
                --sm-c-slider-bar-handle-color-background-warning-hover
                --sm-c-slider-bar-handle-color-background-warning-active

                --sm-c-slider-bar-handle-color-border-info
                --sm-c-slider-bar-handle-color-border-info-hover
                --sm-c-slider-bar-handle-color-border-info-active

                --sm-c-slider-bar-handle-color-border-success
                --sm-c-slider-bar-handle-color-border-success-hover
                --sm-c-slider-bar-handle-color-border-success-active

                --sm-c-slider-bar-handle-color-border-warning
                --sm-c-slider-bar-handle-color-border-warning-hover
                --sm-c-slider-bar-handle-color-border-warning-active

                --sm-c-slider-bar-handle-color-background-disabled
                --sm-c-slider-bar-handle-color-border-disabled
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Tooltip</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              color-background <br/>
              color-text <br/>
              font-size <br/>
              font-weight <br/>
              line-height <br/>
              letter-spacing
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-slider-tooltip-color-background
                --sm-c-slider-tooltip-color-text
                --sm-c-slider-tooltip-font-size
                --sm-c-slider-tooltip-font-weight
                --sm-c-slider-tooltip-line-height
                --sm-c-slider-tooltip-letter-spacing
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Arrow</sm-table-td>
            <sm-table-td>
              width <br/>
              height
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-slider-tooltip-arrow-width
                --sm-c-slider-tooltip-arrow-height
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Content</sm-table-td>
            <sm-table-td>
              padding <br/>
              border-radius
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-slider-tooltip-content-padding
                --sm-c-slider-tooltip-content-border-radius
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>
              Stops
              <span class="block text-grey-neu-dark text-section-header">(Distance from the handle)</span>
            </sm-table-td>
            <sm-table-td>
              bottom <br/>
              top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-slider-tooltip-stops-bottom
                --sm-c-slider-tooltip-stops-range-top
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>

      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
