import { ref } from 'vue'
import { Form, ErrorMessage } from 'vee-validate'
import SmCheckboxGroup from '../sm-checkbox-group.vue'
import SmCheckboxButton from '../sm-checkbox-button.vue'
import SmCheckbox from '../sm-checkbox.vue'

/**
 * NOTE:
 *
 * We are expecting whitespace differences here against Vue2 which doesn't exist
 * in Goldeneyes with the whitespace preserve config in Vue3. Specifically for the
 * required asterisk (*) single checkbox.
 *
 * Temporary hacks like adding spaces in props doesn't work here.
 *
 * Try to check back again once this is supported in Vue3 Storybook:
 * https://github.com/storybookjs/storybook/issues/18288
 * https://siteminder-jira.atlassian.net/browse/SUI-2176
 */

export default {
  title: 'Components/Form/Checkbox',
  component: SmCheckbox,
  subcomponents: {
    'sm-checkbox-button': SmCheckboxButton,
    'sm-checkbox-group': SmCheckboxGroup,
  },
}

export const Standard = () => ({
  components: { SmCheckbox, SmCheckboxGroup, Form },
  setup: () => {
    const genres = ref([])
    const genres1 = ref(null)
    const selectAll = ref(null)
    const items = ref(['active'])

    return { genres, selectAll, items, genres1 }
  },
  template: `
    <div>
      <div class="mb-32">
        <span class="sui-storybook-header">Standard</span>
        <sm-checkbox-group name="genres" label="Favourite genres">
          <sm-checkbox name="genres" label="Classical" selected-value="classical" v-model="genres"></sm-checkbox>
          <sm-checkbox name="genres" label="Pop" selected-value="pop" v-model="genres"></sm-checkbox>
          <sm-checkbox name="genres" label="Rock" selected-value="rock" v-model="genres"></sm-checkbox>
          <sm-checkbox name="genres" label="R&B" selected-value="rhythm-and-blues"  v-model="genres"></sm-checkbox>
        </sm-checkbox-group>
      </div>

      <div class="mb-32">
        <span class="sui-storybook-header">Indeterminate</span>
        <sm-checkbox name="selectAll" label="Select all" :selected-value="true" v-model="selectAll" :indeterminate="selectAll !== true && selectAll !== false"></sm-checkbox>
      </div>

      <div>
        <span class="sui-storybook-header">Disabled</span>
        <sm-checkbox-group name="items" label="Standard checkboxes">
          <sm-checkbox name="items" label="Label" disabled selected-value="inactive"></sm-checkbox>
          <sm-checkbox name="items" label="Label - Checked" disabled selected-value="active" v-model="items"></sm-checkbox>
          <sm-checkbox name="items" label="Label - Indeterminate" disabled selected-value="indeterminate" indeterminate></sm-checkbox>
        </sm-checkbox-group>
      </div>
    </div>
  `,
})

const standardDescription = `
  The sm-checkbox button is suitable for a single selection among multiple options.

  When using a group of checkbox inputs that relate to each other, always use the same name props and group them with the sm-checkbox-group component.

  The native HTML name attribute must be used in checkbox.
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
  components: { SmCheckboxButton, SmCheckboxGroup, SmCheckbox },
  setup: () => {

    const genres = ref(['rock'])
    const genres2 = ref([])
    const items = ref(['active'])

    return { genres, genres2, items }
  },
  template: `
    <div>
      <div class="mb-32">
        <span class="sui-storybook-header">Standard</span>
        <sm-checkbox-group name="genres1" label="Favourite genres">
          <sm-checkbox-button name="genres1" label="Classical" selected-value="classical" v-model="genres"></sm-checkbox-button>
          <sm-checkbox-button name="genres1" label="Pop" selected-value="pop" v-model="genres"></sm-checkbox-button>
          <sm-checkbox-button name="genres1" label="Chill Step" selected-value="chill-step" v-model="genres"></sm-checkbox-button>
          <sm-checkbox-button name="genres1" label="Rock" selected-value="rock" v-model="genres"></sm-checkbox-button>
        </sm-checkbox-group>
      </div>

      <div class="mb-32">
        <span class="sui-storybook-header">Block style</span>
        <sm-checkbox-group name="genres2" label="Favourite genres" block>
          <sm-checkbox-button name="genres2" label="Classical" selected-value="classical" v-model="genres2"></sm-checkbox-button>
          <sm-checkbox-button name="genres2" label="Pop" selected-value="pop" v-model="genres2"></sm-checkbox-button>
        </sm-checkbox-group>
      </div>

      <div>
        <span class="sui-storybook-header">Disabled</span>
        <sm-checkbox-group name="items1" label="Checkbox buttons">
          <sm-checkbox-button name="items1" label="Button label" disabled selected-value="inactive"></sm-checkbox-button>
          <sm-checkbox-button name="items1" label="Button label - Checked" disabled selected-value="active" v-model="items"></sm-checkbox-button>
        </sm-checkbox-group>
      </div>
    </div>
  `,
})
ButtonStyle.storyName = 'Button Style'

ButtonStyle.parameters = {
  docs: {
    description: {
      story: 'Use <code>sm-checkbox-button</code> component for button style.',
    },
  },
}

export const Validation = () => ({
  components: { SmCheckbox, SmCheckboxGroup, ErrorMessage, Form },
  setup: () => {

    const terms = ref(null)
    const termsOne = ref(null)
    const timePeriods = ref([])
    const timePeriodsOne = ref([])

    const save = () => {
      console.info('save')
    }
    const onSubmit = () => {
      console.info('onSubmit')
    }

    const schema = {
      timePeriodsOne: (value: any) => {
        if (value && value.length) {
          return true
        }

        return 'You must choose a time period'
      },
      termsOne: (value: any) => {
        if (value) {
          return true
        }
        return 'This is required'
      },
    }

    return {
      schema,
      terms,
      timePeriods,
      save,
      onSubmit,
      termsOne,
      timePeriodsOne,
    }
  },
  template: `
    <div>
      <span class="sui-storybook-header">Validation with Field Rules</span>
      <sm-form @submit="save">
        <sm-checkbox-group label="Favourite time periods" rules="required" name="time-period" v-model="timePeriods">
          <sm-checkbox label="70s" selected-value="1970-1979" name="time-period" errorDisabled v-model="timePeriods" rules="required"></sm-checkbox>
          <sm-checkbox label="80s" selected-value="1980-1989" name="time-period" errorDisabled v-model="timePeriods" rules="required"></sm-checkbox>
          <sm-checkbox label="90s" selected-value="1990-1999" name="time-period" errorDisabled v-model="timePeriods" rules="required"></sm-checkbox>
          <sm-checkbox label="00s" selected-value="2000-2009" name="time-period" errorDisabled v-model="timePeriods" rules="required"></sm-checkbox>
        </sm-checkbox-group>

        <sm-checkbox name="terms" selected-value="true" v-model="terms" :rules="{ required: { allowFalse: false } }">
          I agree to the <a href="#">Terms & Conditions.</a>
        </sm-checkbox>

        <sm-button native-type="submit" type="primary">Submit</sm-button>

      </sm-form>
      <br />
      <span class="sui-storybook-header">Validation with Form schema (Recommended)</span>
      <sm-form @submit="onSubmit" :validation-schema="schema">

        <sm-checkbox-group label="Favourite time periods" name="timePeriodsOne" rules="required" v-model="timePeriodsOne">
          <sm-checkbox label="70s" selected-value="1970-1979" name="timePeriodsOne" errorDisabled v-model="timePeriodsOne"></sm-checkbox>
          <sm-checkbox label="80s" selected-value="1980-1989" name="timePeriodsOne" errorDisabled v-model="timePeriodsOne"></sm-checkbox>
          <sm-checkbox label="90s" selected-value="1990-1999" name="timePeriodsOne" errorDisabled v-model="timePeriodsOne"></sm-checkbox>
          <sm-checkbox label="00s" selected-value="2000-2009" name="timePeriodsOne" errorDisabled v-model="timePeriodsOne"></sm-checkbox>
        </sm-checkbox-group>

        <sm-checkbox name="termsOne" selected-value="true" v-model="termsOne" :rules="{ required: { allowFalse: false } }">
          I agree to the <a href="#">Terms & Conditions.</a>
        </sm-checkbox>

        <sm-button native-type="submit" type="primary">Submit</sm-button>

      </sm-form>
    </div>
  `,
})

const validationDescription = `
  The checkbox validation requirement:

  - Must be inside the <v-form> component or use the vee-validate useForm().
  - Must have the name props.
  - Must have the selected-value props.


  The Checkbox Group validation requirement:

  - Must be inside the <v-form> component or use the vee-validate useForm().
  - Must have the same name.
  - Use the Form schema to apply validation on group level (Recommended).
  - Alternatively, you can use the <code>rules</code> prop to apply validation on individual checkbox.
  - Use the <code>errorDisabled</code> prop to disable the error message for individual checkbox and the validation error message will show on group level.


  You can access your field values using the values scoped slot prop on the Form component.

  You can apply checkbox buttons validation on individual field level.

  vee-validate handles checkboxes as long as they have the same name prop value.
  The selected values will be collected in an array similar to what v-model does.
  If there is only one checkbox then its value will be directly assigned in the values object without binding it in an array.

  Field level validation is provided through the <code>rules</code> prop.
  available rules: https://vee-validate.logaretm.com/v4/guide/global-validators#vee-validaterules

  To make a field required, add the <code>rules="required"</code> property to the component.
  To Define rules in object format: :rules="{ required: true }"

  For the custom rules, use the defineRule Validators, see here : https://vee-validate.logaretm.com/v4/guide/global-validators#defining-global-validators

  For example:

  <code>
    defineRule('required', value => {
      if (!value || !value.length) {
        return 'This field is required';
      }
      return true;
    });
  </code>

  Reference document for vee-validate: https://vee-validate.logaretm.com/v4/guide/advanced/fields-validation.html#checkboxes-and-radios

  For the Form: Please follow the form storybook documentation.
`

Validation.parameters = {
  docs: {
    description: {
      story: validationDescription,
    },
  },
}
