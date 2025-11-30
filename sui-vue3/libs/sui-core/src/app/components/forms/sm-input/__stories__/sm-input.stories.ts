import { reactive, ref } from 'vue'
import { defineRule } from 'vee-validate'
import { debounce } from 'lodash-es'
import { toastService } from '../../../../services/toast'
import SmInputPrefixContent from '../sm-input-prefix-content.vue'
import SmInputSuffixButton from '../sm-input-suffix-button.vue'
import SmInputSuffixContent from '../sm-input-suffix-content.vue'
import SmInput from '../sm-input.vue'
import {
  SmTable,
  SmTableTbody,
  SmTableTd,
  SmTableTh,
  SmTableThead,
  SmTableTr,
} from '../../../sm-table'
import defaultExample from './images/input-default.png'
import themedExample from './images/input-themed.png'

export default {
  title: 'Components/Form/Input',
  component: SmInput,
  subcomponents: {
    'sm-input-prefix-content': SmInputPrefixContent,
    'sm-input-suffix-button': SmInputSuffixButton,
    'sm-input-suffix-content': SmInputSuffixContent,
  },
  decorators: [],
}

export const TextAndTextareaInput = () => ({
  components: { SmInput },
  setup: () => {
    const name = ref('')

    const form = reactive({
      field1: '',
      field2: '',
      field3: 'Hello world',
    })

    return { form, name }
  },
  template: `
    <div style="max-width: 480px">
      <span class="sui-storybook-header">Text</span>
      <sm-input v-model="name" label="Full name" name="name" placeholder="Your full name..." errorDisabled />

      <br/><br/>

      <span class="sui-storybook-header">Textarea</span>
      <sm-input type="textarea" label="Default" name="textarea1" v-model="form.field1"/>
      <sm-input type="textarea" label="Set height" name="textarea2" v-model="form.field2" rows="5" rules="required" />
      <sm-input type="textarea" label="Max length" name="textarea3" v-model="form.field3" rows="5" maxlength="30" counter />
    </div>
  `,
})

TextAndTextareaInput.storyName = 'Text and textarea Inputs'

TextAndTextareaInput.parameters = {
  docs: {
    description: {
      story: 'Control the native HTML type of your input using the <code>type</code> attribute.',
    },
  },
}

export const NumberInput = () => ({
  components: { SmInput },
  setup: () => {
    const maxRooms = ref(null)
    const maxRoomsControls = ref(0)
    const rateIncrease = ref(null)

    return { maxRooms, maxRoomsControls, rateIncrease }
  },
  template: `
    <div style="max-width: 480px">
      <sm-input
        v-model.number="maxRooms"
        label="Whole number"
        name="wholeNumber"
        type="number"
        rules="integer|min_value:1|max_value:99"
        help-text="Min. 1, Max 99"
      />

      <pre>Whole number: {{ maxRooms }}</pre>

      <sm-input
        v-model="rateIncrease"
        label="Floating number"
        name="floatingNumber"
        type="number"
        rules="decimal|precision:3|min_value:1|max_value:99.999"
        help-text="Min. 1, Max 99.999"
      />

      <pre>Floating number: {{ rateIncrease }}</pre>

      <sm-input
        v-model="maxRoomsControls"
        :disable-increment="false"
        :disable-decrement="false"
        label="With Controls"
        name="withControls"
        type="number"
        controls
        rules="min_value:1"
      />

      <pre>With controls: {{ maxRoomsControls }}</pre>
    </div>
  `,
})

NumberInput.parameters = {
  docs: {
    description: {
      story: 'Control the native HTML decimal values of your input using the <code>step</code> attribute. <br/><br/> Note: Adding <code>.number</code> to the <code>v-model</code> attribute will tell Vue to cast the value to a number. <br/><br/> However, this modifier does <code>parseFloat()</code> internally, which may result in the following behavior: <br/>- Changing the input value to 10000000000000000 when exceeding 9999999999999999 <br/>- Not allowing .0 to be typed in the input field, e.g 1.0 becomes 1 <br/><br/>These can be circumvented by simply using <code>v-model</code> and doing the typecasting down the line.',
    },
  },
}

export const MixedInputs = () => ({
  components: { SmInput, SmInputPrefixContent, SmInputSuffixContent },
  setup: () => {
    const minRate = ref()
    const copyUrl = ref('https://www.siteminder.com')
    const url = ref()
    const roomArea = ref()
    const search = ref()
    const enabled = ref(false)

    const nameSuffix = ref('')
    const namePrefix = ref('')
    const selectionSuffix = ref('aud')
    const selectionPrefix = ref('aud')

    const optionsSuffix = ref([
      { label: 'AUD AUD', code: 'aud' },
      { label: 'USD', code: 'usd' },
      { label: 'INR', code: 'inr' },
      { label: 'EUR AUD AUD', code: 'eur' },
      { label: 'NZDAUDAUDAUDAUDAUDAUD', code: 'nzd' },
    ])
    const optionsPrefix = ref([
      { label: 'AUD', code: 'aud' },
      { label: 'USD', code: 'usd' },
      { label: 'INR', code: 'inr' },
      { label: 'EUR', code: 'eur' },
      { label: 'NZD', code: 'nzd' },
    ])

    const onCopyUrlClick = () => {
      toastService({
        type: 'success',
        message: 'Link copied to clipboard',
        miniInfo: true,
        showClose: true,
      })
    }

    return {
      minRate,
      copyUrl,
      onCopyUrlClick,
      url,
      roomArea,
      search,
      enabled,
      nameSuffix,
      namePrefix,
      selectionSuffix,
      selectionPrefix,
      optionsSuffix,
      optionsPrefix,
    }
  },
  template: `
    <div style="max-width: 480px">
      <sm-form>

        <sm-input id="min-rate" name="minRate" v-model="minRate" :disabled="!enabled" type="text" label="Min rate.">

          <template v-slot:suffix>
            <sm-button
              @click="enabled = !enabled"
              aria-controls="min-rate"
              type="primary"
              :aria-label="enabled ? 'Lock field' : 'Unlock field'"
              :title="enabled ? 'Lock field' : 'Unlock field'"
            >
              <sm-icon :name="enabled ? 'action-lock-open' : 'action-lock'" />
            </sm-button>
          </template>

        </sm-input>

        <sm-input name="url" type="url" label="URL" v-model="url">

          <template v-slot:prefix>
            <sm-input-prefix-content>https://</sm-input-prefix-content>
          </template>

        </sm-input>

        <sm-input name="roomArea" type="number" label="Room area" v-model.number="roomArea" rules="required">

          <template v-slot:suffix>
            <sm-input-suffix-content>Sqft</sm-input-suffix-content>
          </template>

        </sm-input>


        <sm-input name="account1" type="text" label="Search accounts" v-model="search">

          <template v-slot:suffix>
            <sm-button type="primary" native-type="submit">Search</sm-button>
          </template>

        </sm-input>

      <sm-input name="account2" type="text" label="Search accounts" v-model="nameSuffix" suffix-width="150px">

        <template v-slot:suffix>
          <sm-select
            v-model:selection="selectionSuffix"
            name="suffix"
            :options="optionsSuffix"
            :filterable="false"
          />
        </template>

      </sm-input>

      <sm-input name="account3" type="text" label="Search accounts" v-model="namePrefix" rules="required">

        <template v-slot:prefix>
          <sm-select
            v-model:selection="selectionPrefix"
            name="prefix"
            :options="optionsPrefix"
            :filterable="false"
          />
        </template>

      </sm-input>

      <sm-input name="copyUrl" type="url" label="URL" v-model="copyUrl" suffix-width="70px">

        <template v-slot:suffix>
          <sm-input-suffix-button @click="onCopyUrlClick">
            Copy URL <sm-icon class="ml-4" name="action-copy" />
          </sm-input-suffix-button>
        </template>

      </sm-input>

    </sm-form>
  </div>
  `,
})

MixedInputs.parameters = {
  docs: {
    description: {
      story: 'Control the width of the prefix and suffix of your mixed input using the <code>suffixWidth</code> and <code>prefixWidth</code> props.',
    },
  },
}

export const Disabled = () => ({
  components: { SmInput },
  setup: () => {
    const email = ref('')
    const name = ref('')
    const phone = ref('')
    const message = ref('')
    const maxRooms = ref(0)

    return { email, message, name, phone, maxRooms }
  },
  template: `
    <div style="max-width: 480px">
      <sm-input name="name" label="Your name" disabled v-model="name" />
      <sm-input name="email" type="email" rules="email" prefix-icon="action-email" label="Your email" v-model="email" disabled />
      <sm-input name="phone" type="phone" suffix-icon="action-phone" label="Your phone number" v-model="phone" disabled />
      <sm-input name="message" type="textarea" label="Your message" v-model="message" disabled />
      <sm-input name="maxRooms" v-model="maxRooms" :disable-increment="true" :disable-decrement="true" label="Max rooms" type="number" controls rules="min_value:1" disabled />
    </div>
  `,
})

Disabled.parameters = {
  docs: {
    description: {
      story: 'Control the native HTML type of your input using the <code>type</code> attribute.',
    },
  },
}

export const Icons = () => ({
  components: { SmInput },
  setup: () => {
    const name = ref('')
    const email = ref('')
    const phone = ref('')
    const search = ref('')

    return { email, name, phone, search }
  },
  template: `
    <div style="max-width: 480px">
      <span class="sui-storybook-header">Label icon</span>
      <sm-input v-model="name" label="Full name" name="name" placeholder="Your full name..." rules="required">
        <template v-slot:action>
          <sm-tooltip placement="right" trigger="hover" title="Provide more context here">
            <sm-icon name="utility-information-alt" class="text-grey-neu-dark" />
          </sm-tooltip>
        </template>
      </sm-input>

      <br/>

      <span class="sui-storybook-header">Prefix/Suffix icons</span>
      <sm-input type="email" name="email" rules="email" prefix-icon="action-email" label="Email" v-model="email" />
      <sm-input type="phone" name="phone" suffix-icon="action-phone" label="Phone number" v-model="phone" />
      <sm-input name="search" prefix-icon="action-calendar" suffix-icon="action-search" label="Search" v-model="search" />
    </div>
  `,
})

Icons.parameters = {
  docs: {
    description: {
      story: 'Use `prefix-icon` and `suffix-icon` props',
    },
  },
}

/**
 * This story is exclusive to Vue3 which demonstrates workaround for deprecated `debounce` and `mode` props.
 * However, this won't behave exactly as the Vue2 counterpart, so to reduce confusion,
 * we are adding it as a separate story.
 */
export const CustomRulesWithDebounce = () => ({
  components: { SmInput },
  setup: () => {
    const field1 = ref()
    const field2 = ref()
    const field3 = ref()
    const field4 = ref()

    let debounceSayPleaseRef: any

    /**
     * Check the value, but don't return an error if it's empty
     */
    const hasPlease = (value: string | undefined): boolean => (!value || value.includes('please'))

    /**
     * Copied from https://gist.github.com/lalosh/0bf01d3e321af32e6acb70220b4e1a12
     * to demonstrate cancellable debounced validation.
     *
     * Note that the implementation can be anything, it doesn't have to depend on lodash.
     */
    const debounceSayPleaseRule = (value: string | undefined): Promise<string | boolean> => {
      return new Promise((resolve) => {
        // Cancel any old refs
        if (debounceSayPleaseRef && typeof debounceSayPleaseRef.cancel === 'function') {
          debounceSayPleaseRef.cancel()
        }

        // Create new instance and save for later
        debounceSayPleaseRef = debounce(() => {
          // Logs right away. See https://github.com/logaretm/vee-validate/issues/4111
          console.info('Custom debounced validation triggered')

          return hasPlease(value)
            ? resolve(true)
            : resolve('The value should include "please" somewhere')
        }, 1000)

        // Execute will start after 1000 unless cancelled because the function is re-invoked again
        debounceSayPleaseRef()
      })
    }

    defineRule('debouncedSayPlease', async (value: string | undefined) => {
      const result = await debounceSayPleaseRule(value)

      return result
    })

    defineRule('sayPlease', (value: string | undefined): boolean | string => {
      // Logs right away. See https://github.com/logaretm/vee-validate/issues/4111
      console.info('Custom validation triggered')

      return hasPlease(value) ? true : 'The value should include "please" somewhere'
    })

    return {
      field1,
      field2,
      field3,
      field4,
      debounceSayPleaseRule,
    }
  },
  template: `
    <div style="max-width: 480px">
      <sm-form>
        <template v-slot:default="{ invalid, values, errors }">
          <sm-input
            v-model="field1"
            help-text="Say please"
            label="With custom validator"
            type="text"
            name="field1"
            rules="sayPlease"
          />

          <sm-input
            v-model="field2"
            help-text="Say please"
            label="With debounced custom validator (1000ms)"
            type="text"
            name="field2"
            rules="debouncedSayPlease"
          />

          <sm-input
            v-model="field3"
            label="Email with aggressive mode (default)"
            type="email"
            prefix-icon="action-email"
            name="field3"
            rules="required|email"
            mode="aggressive"
          />

          <sm-input
            v-model="field4"
            label="Email with lazy mode"
            type="email"
            prefix-icon="action-email"
            name="field4"
            rules="required|email"
            mode="lazy"
          />

          <div style="display: flex; justify-content: flex-end;">
            <sm-button native-type="reset" type="text">Reset</sm-button>
            <sm-button native-type="submit" type="primary" :disabled="invalid">Send</sm-button>
          </div>
        </template>
      </sm-form>
    </div>
  `,
})

CustomRulesWithDebounce.storyName = 'Custom rules with debounce and mode'

const customRulesWithDebounceDescription = `
  The validation <code>debounce</code> and <code>mode</code> has been deprecated in vee-validate@4.
  This version of SUI doesn't support these features yet.

  However, you can still write a custom rule to limit the number of executions of an expensive function like an API call.

  Please find the official documentations on how to write custom rules in the following:
  - https://vee-validate.logaretm.com/v4/guide/global-validators/
`

CustomRulesWithDebounce.parameters = {
  docs: {
    description: {
      story: customRulesWithDebounceDescription,
    },
  },
}

export const EditableCell = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
  },
  setup: () => {
    const tableViewModel = ref([
      {
        name: 'Nick',
        city: 'Sydney',
        state: 'NSW',
        zipCode: 2000,
      },
      {
        name: 'Andy',
        city: 'Melbourne',
        state: 'VIC',
        zipCode: 3000,
      },
      {
        name: 'Mike',
        city: 'Brisbane',
        state: 'QLD',
        zipCode: 4000,
      },
      {
        name: 'Jack',
        city: 'Sydney',
        state: 'NSW',
        zipCode: 2000,
      },
      {
        name: 'Rahul',
        city: 'Melbourne',
        state: 'VIC',
        zipCode: 3000,
      },
    ])

    return {
      tableViewModel,
    }
  },
  template: `
    <div>
      <sm-table>
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th>Name</sm-table-th>
            <sm-table-th>City</sm-table-th>
            <sm-table-th>State</sm-table-th>
            <sm-table-th>Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr v-for="(row, i) in tableViewModel" :key="i">
            <sm-table-td no-padding>
              <sm-input
                v-model="row.name"
                editable-cell
                error-disabled
                label-hidden
                rules="required"
                :name="'name-' + i"
                :label="'Row ' + (i + 1) + ' name'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td no-padding>
              <sm-input
                v-model="row.city"
                editable-cell
                error-disabled
                label-hidden
                rules="required"
                :name="'city-' + i"
                :label="'Row ' + (i + 1) + ' city'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td no-padding>
              <sm-input
                v-model="row.state"
                editable-cell
                error-disabled
                label-hidden
                rules="required"
                :name="'state-' + i"
                :label="'Row ' + (i + 1) + ' state'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td no-padding>
              <sm-input
                v-model.number="row.zipCode"
                editable-cell
                error-disabled
                label-hidden
                rules="required"
                :name="'zip-' + i"
                :label="'Row ' + (i + 1) + ' zip code'"
              ></sm-input>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>
    </div>
  `,
})

EditableCell.storyName = 'Editable cell'

EditableCell.parameters = {
  docs: {
    description: {
      story: '<code>sm-input</code> can be used inside the table cell to present editable data <br><br>The style can be achieved by using a combination of props: <br><br>Set <code>noPadding</code> prop to true on <code>sm-table-td</code> then enable the following config in <code>sm-input</code><br> -<code>editableCell</code> to make input styles compatible with table cell <br>- <code>labelHidden</code> and provide <code>label</code> to remove visible label while still keeping it accessible <br>- <code>errorDisabled</code> to remove inline validation below the input field <br>- Optionally add <code>suffixIcon</code> to reinforce validation state (The icon and the logic will be handled by the developers) <br><br> In addition, <code>sm-tooltip</code> can be used to display validation error if needed <br>- The error message and tooltip config will be handled by the developers',
    },
  },
}

export const StylingHooks = () => ({
  components: { SmInput },
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

      <p>Below is an example of the SUI input and the brand input using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 308px; height: auto; min-width: 0"
          alt="Input default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 308px; height: auto; min-width: 0"
          alt="Input themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the input customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>
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
              border-width
              <br/>
              color-background
              <br/>
              color-border
              <br/>
              color-icon
              <br/>
              color-text
              <br/>
              padding-y
              <br/>
              padding-x
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-input-border-radius<br/>
                --sm-c-input-border-width<br/>
                --sm-c-input-color-background<br/>
                --sm-c-input-color-border<br/>
                --sm-c-input-color-icon<br/>
                --sm-c-input-color-text<br/>
                --sm-c-input-padding-y<br/>
                --sm-c-input-padding-x<br/><br/>

                --sm-c-input-color-background-disabled<br/>
                --sm-c-input-color-text-disabled<br/>
                --sm-c-input-color-border-disabled<br/><br/>

                --sm-c-input-box-shadow-focus<br/>
                --sm-c-input-color-border-focus<br/>
                --sm-c-input-color-icon-focus<br/><br/>

                --sm-c-input-color-border-invalid<br/>
                --sm-c-input-color-icon-invalid<br/>
                --sm-c-input-box-shadow-focus-invalid<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Number control</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-border
              <br/>
              color-text
              <br/>
              width
              <br/>
              height
              <br/>
              icon-font-size
              <br/>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-input-number-control-color-background<br/>
                --sm-c-input-number-control-color-border<br/>
                --sm-c-input-number-control-color-text<br/>
                --sm-c-input-number-control-width<br/>
                --sm-c-input-number-control-height<br/>
                --sm-c-input-number-control-icon-font-size<br/><br/>

                --sm-c-input-number-control-color-background-hover<br/><br/>

                --sm-c-input-number-control-color-border-disabled
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Textarea</sm-table-td>
            <sm-table-td>
              padding-y
              <br/>
              padding-x
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-input-textarea-padding-y
                --sm-c-input-textarea-padding-x
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Counter
            </sm-table-td>
            <sm-table-td>
              color-text
              <br/>
              padding-top
              <br/>
              margin-bottom
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-input-counter-color-text<br/>
                --sm-c-input-counter-padding-top<br/>
                --sm-c-input-counter-margin-bottom<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Action slot</sm-table-td>
            <sm-table-td>
              padding-top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-input-action-padding-top
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Prefix/Suffix slots</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-border
              <br/>
              color-text
              <br/>
              border-width
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-input-prefix-slot-color-background<br/>
                --sm-c-input-prefix-slot-color-border<br/>
                --sm-c-input-prefix-slot-color-text<br/>
                --sm-c-input-prefix-slot-border-width<br/><br/>

                --sm-c-input-suffix-slot-color-background<br/>
                --sm-c-input-suffix-slot-color-border<br/>
                --sm-c-input-suffix-slot-color-text<br/>
                --sm-c-input-suffix-slot-border-width<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Prefix/Suffix content</sm-table-td>
            <sm-table-td>
              padding-y
              <br/>
              padding-x
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-input-prefix-content-padding-y<br/>
                --sm-c-input-prefix-content-padding-x<br/><br/>

                --sm-c-input-suffix-content-padding-y<br/>
                --sm-c-input-suffix-content-padding-x<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Footer
              <span class="block text-grey-neu-dark text-section-header">(Help text and validation error)</span>
            </sm-table-td>
            <sm-table-td>
              height-min
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-input-footer-height-min
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Help text</sm-table-td>
            <sm-table-td>
              color-text
              <br/>
              padding-top
              <br/>
              padding-bottom
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-input-help-text-color-text<br/>
                --sm-c-input-help-text-padding-top<br/>
                --sm-c-input-help-text-padding-bottom<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Editable cell</sm-table-td>
            <sm-table-td>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-input-color-background-editable-cell-focus<br/>
                --sm-c-input-color-background-editable-cell-invalid<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Select
              <span class="block text-grey-neu-dark text-section-header">(Mixed input)</span>
            </sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-border
              <br/>
              color-text
              <br/>
              border-width
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-input-select-color-background<br/>
                --sm-c-input-select-color-border<br/>
                --sm-c-input-select-color-text<br/>
                --sm-c-input-select-border-width<br/><br/>

                --sm-c-input-select-color-background-hover<br/>
                --sm-c-input-select-color-border-hover<br/><br/>

                --sm-c-input-select-color-background-active<br/>
                --sm-c-input-select-color-border-active<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Field label (shared)</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              color-text
              <br/>
              margin-bottom
              <br/>
              padding-top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-field-label-color-text<br/>
                --sm-c-field-label-margin-bottom<br/>
                --sm-c-field-label-padding-top<br/><br/>

                --sm-c-field-label-color-text-focus<br/><br/>

                --sm-c-field-label-color-text-invalid
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
              >--sm-c-field-label-color-text-required-asterisk
              </code>
            </sm-table-td>
          </sm-table-tr>

        <sm-table-tr>
          <sm-table-th colspan="3">Field error (shared)</sm-table-th>
        </sm-table-tr>
        <sm-table-tr>
          <sm-table-td>Common</sm-table-td>
          <sm-table-td>
            color-text
            <br/>
            padding-top
            <br/>
            padding-bottom
            <br/>
            height-max <span class="text-grey-neu-dark text-section-header">(space when error is not yet available)</span>
            <br/>
            height-max-error <span class="text-grey-neu-dark text-section-header">(space when error is displayed)</span>
          </sm-table-td>
          <sm-table-td>
            <code
              class="sui-storybook-code sui-storybook-code--block"
            >--sm-c-field-error-color-text<br/>
              --sm-c-field-error-padding-top<br/>
              --sm-c-field-error-padding-bottom<br/>
              --sm-c-field-error-height-max<br/>
              --sm-c-field-error-height-max-error<br/>
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
