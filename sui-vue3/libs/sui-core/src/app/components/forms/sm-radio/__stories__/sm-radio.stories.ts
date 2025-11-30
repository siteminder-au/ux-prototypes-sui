import { ref, watch } from 'vue'
import SmRadioGroup from '../sm-radio-group.vue'
import SmRadioButton from '../sm-radio-button.vue'
import SmRadio from '../sm-radio.vue'
import defaultExample from './images/radio-default.png'
import themedExample from './images/radio-themed.png'

/**
 * NOTE:
 *
 * #1
 * We are expecting component UI differences between Vue2 and Vue3 button styles
 * because we refactored the button styles to remove the complex animations.
 *
 * #2
 * In addition there will be whitespace diff for the required asterisk (*) single radio
 * which doesn't exist in Goldeneyes with the whitespace preserve config in Vue3
 *
 * Temporary hacks like adding spaces in props doesn't work here.
 *
 * Try to check back again once this is supported in Vue3 Storybook:
 * https://github.com/storybookjs/storybook/issues/18288
 * https://siteminder-jira.atlassian.net/browse/SUI-2176
 */

export default {
  title: 'Components/Form/Radio',
  component: SmRadio,
  subcomponents: {
    'sm-radio-button': SmRadioButton,
    'sm-radio-group': SmRadioGroup,
  },
}

export const Standard = () => ({
  components: { SmRadioGroup, SmRadio },
  setup: () => {
    const genre = ref(null)
    const genre2 = ref(null)

    watch(genre, () => {
      console.info('genre', genre.value)
    }, { immediate: true })

    return { genre, genre2 }
  },
  template: `
    <div>
      <span class="sui-storybook-header">Standard</span>
      <sm-radio-group name="genre">
        <sm-radio name="genre" label="Classical" selected-value="classical" v-model="genre"></sm-radio>
        <sm-radio name="genre" label="Pop" selected-value="pop" v-model="genre"></sm-radio>
        <sm-radio name="genre" label="Rock" selected-value="rock" v-model="genre"></sm-radio>
        <sm-radio name="genre" label="R&B" selected-value="rhythm-and-blues" v-model="genre"></sm-radio>
      </sm-radio-group>

      <br/><br/>

      <span class="sui-storybook-header">Horizontal alignment</span>
      <sm-radio-group button-alignment="horizontal" name="genre2">
        <sm-radio name="genre2" label="Classical" selected-value="classical" v-model="genre2"></sm-radio>
        <sm-radio name="genre2" label="Pop" selected-value="pop" v-model="genre2"></sm-radio>
        <sm-radio name="genre2" label="Rock" selected-value="rock" v-model="genre2"></sm-radio>
        <sm-radio name="genre2" label="R&B" selected-value="rhythm-and-blues" v-model="genre2"></sm-radio>
      </sm-radio-group>

      <br/><br/>

      <span class="sui-storybook-header">Disabled</span>
      <sm-radio-group label="Standard radio" name="disabled">
        <sm-radio label="Label" disabled selected-value="" name="disabled"></sm-radio>
        <sm-radio label="Label - Selected" disabled selected-value="foo" model-value="foo" name="disabled"></sm-radio>
      </sm-radio-group>
    </div>
  `,
})

const standardDescription = `
  The sm-radio button is suitable for a single selection among multiple options.

  When using a collection of radio inputs that relate to each other, always group them with the sm-radio-group component.

  For accessibility reasons, the native HTML name attribute should be further to used to group radio inputs together.
`

Standard.parameters = {
  docs: {
    description: {
      // Uses `component` here since it's the primary story
      component: standardDescription,
    },
  },
}

export const ButtonStyle = () => ({
  components: { SmRadioButton, SmRadioGroup, SmRadio },
  setup: () => {
    const genre = ref(null)
    const genre2 = ref('rock')
    const genre3 = ref(null)
    const genres4 = ref([])
    const selectedNumber = ref(null)
    const numbers = ref(['2', '4', '8', '16', '32', '64', '128', '256'])
    const view = ref(null)
    const view2 = ref('grid')

    return { genre, genre2, genre3, genres4, numbers, selectedNumber, view, view2 }
  },
  template: `
    <div>
      <span class="sui-storybook-header">Standard</span>
      <sm-radio-group label="Favourite genre" name="genre" :is-button-style-group="true">
        <sm-radio-button name="genre" label="Classical" selected-value="classical" v-model="genre"></sm-radio-button>
        <sm-radio-button name="genre" label="Pop" selected-value="pop" v-model="genre"></sm-radio-button>
        <sm-radio-button name="genre" label="Chill Step" selected-value="chill-step" v-model="genre"></sm-radio-button>
        <sm-radio-button name="genre" label="Rock" selected-value="rock" v-model="genre"></sm-radio-button>
      </sm-radio-group>

      <br/><br/>

      <span class="sui-storybook-header">With icons</span>
      <sm-radio-group label="Favourite genre" name="genre2" :is-button-style-group="true">
        <sm-radio-button name="genre2" selected-value="classical" v-model="genre2">
          <sm-icon name="arrow-go-back"></sm-icon>
          Classical
          <sm-icon name="arrow-go-forward"></sm-icon>
        </sm-radio-button>
        <sm-radio-button name="genre2" selected-value="pop" v-model="genre2">
          <sm-icon name="arrow-go-back"></sm-icon>
          Pop
          <sm-icon name="arrow-go-forward"></sm-icon>
        </sm-radio-button>
        <sm-radio-button name="genre2" selected-value="chill-step" v-model="genre2">
          <sm-icon name="arrow-go-back"></sm-icon>
          Chill Step
          <sm-icon name="arrow-go-forward"></sm-icon>
        </sm-radio-button>
        <sm-radio-button name="genre2" selected-value="rock" v-model="genre2">
          <sm-icon name="arrow-go-back"></sm-icon>
          Rock
          <sm-icon name="arrow-go-forward"></sm-icon>
        </sm-radio-button>
      </sm-radio-group>

      <sm-radio-group label="View" name="view" :is-button-style-group="true">
        <sm-radio-button name="view" selected-value="grid" v-model="view">
          <sm-icon name="action-grid-view" alt="Grid"></sm-icon>
        </sm-radio-button>
        <sm-radio-button name="view" selected-value="list" v-model="view">
          <sm-icon name="action-list-view" alt="List"></sm-icon>
        </sm-radio-button>
      </sm-radio-group>


      <br/><br/>

      <span class="sui-storybook-header">Block style</span>
      <sm-radio-group block label="Favourite genre" name="genres4" :is-button-style-group="true">
        <sm-radio-button name="genres4" label="Classical" selected-value="classical" v-model="genres4"></sm-radio-button>
        <sm-radio-button name="genres4" label="Pop" selected-value="pop" v-model="genres4"></sm-radio-button>
      </sm-radio-group>

      <div style="max-width: 320px;">
        <sm-radio-group label="Number" :block="true" name="selectedNumber" :is-button-style-group="true">
          <sm-radio-button
            v-for="number in numbers"
            name="selectedNumber"
            v-model="selectedNumber"
            :label="number"
            :selected-value="number"
            :key="number"
          />
        </sm-radio-group>
      </div>

      <br/><br/>

      <span class="sui-storybook-header">Without animation</span>
      <sm-radio-group label="Favourite genre" :button-animation="false" name="genre3" :is-button-style-group="true">
        <template #action>
          <sm-tooltip trigger="hover" placement="right" title="True for all instances. Sliding animation is not available in Vue3.">
            <sm-icon name="utility-information-alt" class="text-grey-neu-dark" />
          </sm-tooltip>
        </template>
        <sm-radio-button name="genre3" label="Classical" selected-value="classical" v-model="genre3"></sm-radio-button>
        <sm-radio-button name="genre3" label="Pop" selected-value="pop" v-model="genre3"></sm-radio-button>
        <sm-radio-button name="genre3" label="Chill Step" selected-value="chill-step" v-model="genre3"></sm-radio-button>
        <sm-radio-button name="genre3" label="Rock" selected-value="rock" v-model="genre3"></sm-radio-button>
      </sm-radio-group>

      <br/><br/>

      <span class="sui-storybook-header">Disabled</span>
      <sm-radio-group label="Radio buttons" name="disabled" :is-button-style-group="true">
        <sm-radio-button label="Button label" disabled selected-value="" name="disabled"></sm-radio-button>
        <sm-radio-button label="Button label - Selected" disabled selected-value="foo" model-value="foo" name="disabled"></sm-radio-button>
      </sm-radio-group>

      <sm-radio-group label="Radio buttons with icon" name="room-type" :is-button-style-group="true">
        <sm-radio-button :disabled="true" selected-value="" name="room-type">
          <sm-icon name="arrow-go-back"></sm-icon>
          Button label
          <sm-icon name="arrow-go-forward"></sm-icon>
        </sm-radio-button>
        <sm-radio-button :disabled="true" selected-value="foo" model-value="foo" name="room-type">
          <sm-icon name="arrow-go-back"></sm-icon>
          Button label - Selected
          <sm-icon name="arrow-go-forward"></sm-icon>
        </sm-radio-button>
      </sm-radio-group>

      <sm-radio-group label="Icon only radio buttons" name="view2" :is-button-style-group="true">
        <sm-radio-button name="view2" selected-value="grid" v-model="view2" :disabled="true">
          <sm-icon name="action-grid-view" alt="Grid"></sm-icon>
        </sm-radio-button>
        <sm-radio-button name="view2" selected-value="list" v-model="view2" :disabled="true">
          <sm-icon name="action-list-view" alt="List"></sm-icon>
        </sm-radio-button>
      </sm-radio-group>
    </div>
  `,
})

const buttonStyleDescription = `
  Use default slot in <code>sm-radio-button</code> instead of the <code>label</code> prop
  to add custom label with icons.


  Consider adding <code>block</code> prop when providing <code>sm-radio-button</code> options via
  <code>v-for</code>. Vue trims whitespace between the buttons which might cause highlight styles to overlap.


  Use <code>buttonAnimation</code> prop to toggle sliding animation feature. By default, animation is enabled.


  This can be used to turn off animation on smaller screens where radio buttons might wrap into multiple lines.
`
ButtonStyle.parameters = {
  docs: {
    description: {
      story: buttonStyleDescription,
    },
  },
}

export const Validation = () => ({
  components: { SmRadio, SmRadioGroup, SmRadioButton },
  setup: () => {
    const terms = ref(null)
    const timePeriod = ref(null)
    const timePeriod2 = ref(null)

    const save = () => {
      // eslint-disable-next-line no-console
      console.log('save')
    }
    return {
      terms,
      timePeriod,
      timePeriod2,
      save,
    }
  },
  template: `
    <sm-form @submit="save">

      <sm-radio-group label="Favourite time period" rules="required" v-model="timePeriod" name="time-period">
        <sm-radio label="70s" selected-value="1970-1979" v-model="timePeriod" name="time-period" :error-disabled="true"></sm-radio>
        <sm-radio label="80s" selected-value="1980-1989" v-model="timePeriod" name="time-period" :error-disabled="true"></sm-radio>
        <sm-radio label="90s" selected-value="1990-1999" v-model="timePeriod" name="time-period" :error-disabled="true"></sm-radio>
        <sm-radio label="00s" selected-value="2000-2009" v-model="timePeriod" name="time-period" :error-disabled="true"></sm-radio>
      </sm-radio-group>

      <sm-radio-group label="Favourite time period" rules="required" name="time-period-button" :is-button-style-group="true">
        <sm-radio-button label="70s" selected-value="1970-1979" v-model="timePeriod2" name="time-period-button" :error-disabled="true"></sm-radio-button>
        <sm-radio-button label="80s" selected-value="1980-1989" v-model="timePeriod2" name="time-period-button" :error-disabled="true"></sm-radio-button>
        <sm-radio-button label="90s" selected-value="1990-1999" v-model="timePeriod2" name="time-period-button" :error-disabled="true"></sm-radio-button>
        <sm-radio-button label="00s" selected-value="2000-2009" v-model="timePeriod2" name="time-period-button" :error-disabled="true"></sm-radio-button>
      </sm-radio-group>

      <div class="pt-16">
        <sm-radio selected-value="true" v-model="terms" rules="required" name="terms-and-conditions">
          I agree to the <a href="#">Terms & Conditions.</a>
        </sm-radio>
      </div>

      <sm-button native-type="submit" type="primary">Save</sm-button>

    </sm-form>
  `,
})

Validation.parameters = {
  docs: {
    description: {
      story: 'You can apply radio buttons validation rules both a group and individual field level.',
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

      <p>Below is an example of the SUI radio and the brand radio using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 308px; height: auto; min-width: 0"
          alt="Radio default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 308px; height: auto; min-width: 0"
          alt="Radio themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the radio customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

      <p>For the <span style="font-weight: 600;">shared label and error field variables</span>, please refer to the table in <a href="/?path=/story/components-form-input--styling-hooks">input styling hooks</a></p>

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
            <sm-table-th colspan="3">Radio</sm-table-th>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Label</sm-table-td>
            <sm-table-td>
              color-text
              <br/>
              margin-bottom
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-radio-label-color-text
                --sm-c-radio-label-margin-bottom

                --sm-c-radio-label-color-text-disabled
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Required asterisk</sm-table-td>
            <sm-table-td>
              color-text
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-radio-required-asterisk-color-text
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Control</sm-table-td>
            <sm-table-td>
              color-border
              <br/>
              color-background
              <br/>
              color-foreground
              <br/>
              border-width
              <br/>
              padding <span class="text-grey-neu-dark text-section-header">(disabled only)</span>
              <br/>
              color-outline <span class="text-grey-neu-dark text-section-header">(on focus)</span>
              <br/>
              outline-width <span class="text-grey-neu-dark text-section-header">(on focus)</span>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-radio-control-color-border
                --sm-c-radio-control-color-background
                --sm-c-radio-control-color-foreground
                --sm-c-radio-control-border-width

                --sm-c-radio-control-color-border-checked
                --sm-c-radio-control-color-background-checked
                --sm-c-radio-control-color-foreground-checked

                --sm-c-radio-control-color-border-hover
                --sm-c-radio-control-color-background-hover
                --sm-c-radio-control-color-foreground-hover

                --sm-c-radio-control-color-border-checked-hover
                --sm-c-radio-control-color-background-checked-hover
                --sm-c-radio-control-color-foreground-checked-hover

                --sm-c-radio-control-color-border-disabled
                --sm-c-radio-control-color-background-disabled
                --sm-c-radio-control-color-foreground-disabled
                --sm-c-radio-control-border-width-disabled
                --sm-c-radio-control-padding-disabled

                --sm-c-radio-control-color-border-checked-disabled
                --sm-c-radio-control-color-background-checked-disabled
                --sm-c-radio-control-color-foreground-checked-disabled

                --sm-c-radio-control-color-outline-focus
                --sm-c-radio-control-outline-width-focus
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Radio group & buttons</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Button group container</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-border
              <br/>
              border-radius
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-radio-button-color-background
                --sm-c-radio-button-color-border
                --sm-c-radio-button-border-radius

                --sm-c-radio-button-color-background-disabled
                --sm-c-radio-button-color-border-disabled
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Label</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-border
              <br/>
              color-text
              <br/>
              border-radius
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-radio-button-label-color-border
                --sm-c-radio-button-label-color-text
                --sm-c-radio-button-label-border-radius

                --sm-c-radio-button-label-color-background-checked
                --sm-c-radio-button-label-color-border-checked
                --sm-c-radio-button-label-color-text-checked

                --sm-c-radio-button-label-color-background-hover
                --sm-c-radio-button-label-color-border-hover
                --sm-c-radio-button-label-color-text-hover

                --sm-c-radio-button-label-color-background-checked-hover
                --sm-c-radio-button-label-color-border-checked-hover
                --sm-c-radio-button-label-color-text-checked-hover

                --sm-c-radio-button-label-color-background-clicked
                --sm-c-radio-button-label-color-border-clicked
                --sm-c-radio-button-label-color-text-clicked

                --sm-c-radio-button-label-color-background-checked-clicked
                --sm-c-radio-button-label-color-border-checked-clicked
                --sm-c-radio-button-label-color-text-checked-clicked

                --sm-c-radio-button-label-color-background-disabled
                --sm-c-radio-button-label-color-border-disabled
                --sm-c-radio-button-label-color-text-disabled
                --sm-c-radio-button-label-color-icon-disabled

                --sm-c-radio-button-label-color-border-checked-disabled
                --sm-c-radio-button-label-color-text-checked-disabled

                --sm-c-radio-button-label-color-border-focus

                --sm-c-radio-button-label-color-border-checked-focus
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
