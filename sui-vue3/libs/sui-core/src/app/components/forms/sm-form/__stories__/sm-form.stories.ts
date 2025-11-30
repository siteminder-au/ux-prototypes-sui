import { onMounted, ref, reactive } from 'vue'
import { ErrorMessage, defineRule } from 'vee-validate'
import SmForm from '../sm-form.vue'
import { SmCheckbox, SmCheckboxButton, SmCheckboxGroup } from '../../sm-checkbox'
import { SmInput } from '../../sm-input'
import { isPercyContext } from '../../../../../../test/percy/helpers'

const defaultDescription = `
  For the Form submission we are using Vee-validate version v.x that offers many helpers to handle form submissions, resets, and DX to make your forms much easier to reason about and less of a burden to maintain.

  The <code>sm-form</code> component is a wrapper around the <code>vee-validate</code> <code>Form</code> component.

  sm-form component scoped slot props:
  - handleSubmit: automatically prevents native submission at all times, use for AJAX submissions, This is the most common method you will use to handle form submissions manually, it accepts a callback that will be executed with the form values if the form is valid.
  - validate: This method will triggers the validation on all fields belonging to the form, You can validate the form without submissions using the validate() slot prop function: <code>type="button" @click="validate"</code>
  - resetForm: resets the form fields and validation state
  - values: You may access your form values using the <code>values</code> scoped slot prop on the Form component. This is useful when you need to access the form values outside of the handleSubmit callback.
  - isSubmitting: When you might want to disable the submit button entirely until the submission attempt is done. You can use the <code>isSubmitting</code> slot prop to determine if the form is currently submitting.
    Note that calling <code>validate</code> method from the Form slot props will not cause the <code>isSubmitting</code> state to change, it will only change if either submitForm or handleSubmit are called or when a submit event is triggered.
  - invalid: You can use the <code>invalid</code> slot prop to determine if the form is currently invalid. This is useful when you want to disable the submit button until the form is valid.
  - setFieldValue, setValues: You can set any field value using either <code>setFieldValue</code> or <code>setValues</code>, both methods are exposed on the <code>sm-form</code> component scoped slot props, and as component instance methods.
    You can call them with template <code>$refs</code> and for an added convenience you can call them in the submit handler callback.
    Using submit callback:
      <pre>
        const onSubmit = (values, actions) => {
          // Submit the values...
          // set single field value
          actions.setFieldValue('email', 'ummm@example.com')
          // set multiple values
          actions.setValues({
            email: 'ummm@example.com',
            password: 'P@$$w0Rd',
          })
        }
      </pre>
  Using template $refs
    <pre>
      const onSubmit = (values, actions) => {
        // Submit the values...
        // set single field value
        this.$refs.myForm.setFieldValue('email', 'ummm@example.com')
        // set multiple values
        this.$refs.myForm.setValues({
          email: 'ummm@example.com',
          password: 'P@$$w0Rd',
        })
      }
    </pre>

  The <code>sm-form</code> component also exposes a <code>validation-schema</code> prop that can be used to validate the form using a schema.
  Global form Validator here: https://vee-validate.logaretm.com/v4/guide/global-validators#schema-validation

  initialValues:
  Use <code>initialValues</code> prop to set the initial values of the form.
  Since with vee-validate you do not have to use v-model to track your values, the Form component allows you to define the starting values for your fields,
  by default all fields start with undefined as a value.
  Using the initialValues prop you can send an object that contains the field names as keys and their values
  For example:
    <pre>
      const formValues = {
        checkboxOne: ['checkbox-1', 'checkbox-2'],
      }
    </pre>

  Since with vee-validate you do not have to use v-model to track your values, the Form component allows you to define the starting values for your fields, by default all fields start with undefined as a value.

  It is generally recommended by vee-validate that you provide the initialValues,
  this is because vee-validate cannot assume a reasonable initial value for your fields other than undefined which may cause unexpected behavior when using a 3rd-party validator that does not deal with undefined.

  v-model:
  So far you probably noticed we did not use v-model once in the examples.
  This is because in most cases you don need the model values until you submit them to your API or not at all if you are submitting an HTML form without JavaScript.

  You can still use v-model if you need it but vee-validate doesn't require it and SUI form component as well as this stage.
  Having to create models just to be able to reference them later is redundant and vee-validate goes around this by creating an internal model for the <code><Field></code> field component instances and tracks them and keeps them in sync with the input. </strong>

  Values:
  You may access your forms values using the <code>values</code> scoped slot prop on the Form component.
`

export default {
  title: 'Components/Form',
  decorators: [],
  component: SmForm,
  parameters: {
    docs: {
      description: {
        // Uses `component` here since it's the primary story
        component: defaultDescription,
      },
    },
  },
}

export const BasicForm = () => ({
  components: { SmForm },
  setup: () => {
    const form = reactive({
      to: 'joe.blob@somewhere.com',
      subject: null,
      message: null,
      signature: null,
    })

    const sending = ref(false)

    const send = (e: unknown) => {
      sending.value = true

      console.info('sending v-model values', form)
      console.info('sending @submit payload values', e)

      setTimeout(() => {
        sending.value = false
      }, 3000)
    }

    const reset = () => {
      form.to = ''
      form.subject = null
      form.message = null
      form.signature = null
    }
    return {
      form,
      sending,
      send,
      reset,
    }
  },
  template: `

  <div class="max-w-lg">

    <sm-form :disabled="sending" @submit="send" @reset="reset">

      <template v-slot:default="{ invalid }">

        <sm-form-group legend="Fieldset Legend">

          <sm-input type="email" label="To" rules="required|email" v-model="form.to" name="to"/>
          <sm-input type="text" label="Subject" rules="required"  placeholder="No subject..." v-model="form.subject" name="subject"/>

        </sm-form-group>

        <sm-input type="textarea" label="Message" rows="6" v-model="form.message" name="message" />

        <sm-radio-group label="Signature" v-model="form.signature" rules="required" name="signature">
          <sm-radio name="signature" v-model="form.signature" label="Work" selected-value="work" :error-disabled="true"/>
          <sm-radio name="signature" v-model="form.signature" label="Personal" selected-value="personal" :error-disabled="true" />
        </sm-radio-group>

        <div class="text-right">
          <sm-button :disabled="sending" native-type="reset" type="text">Cancel</sm-button>
          <sm-button :disabled="invalid" :loading="sending" native-type="submit" type="primary">Send</sm-button>
        </div>

      </template>

    </sm-form>

  </div>
  `,
})

BasicForm.parameters = {
  docs: {
    description: {
      story: 'The sm-form element',
    },
  },
}

export const InlineForm = () => ({
  components: { SmForm },
  setup: () => {
    const draft = reactive({
      searchBy: null,
      dateRange: null,
    })

    const searchByOptions = [
      { label: 'Created at', code: 'created-at' },
      { label: 'Checked-in at', code: 'checked-in-at' },
    ]

    return {
      draft,
      searchByOptions,
    }
  },
  template: `
    <sm-form>

      <div class="flex flex-wrap -mx-12">

        <div class="w-full tablet:w-1/3 large-desktop:w-320 px-12">
          <sm-select v-model="draft.searchBy" label="Search by" :options="searchByOptions" rules="required" name="search-by" />
        </div>

        <div class="w-full tablet:w-1/3 large-desktop:w-320 px-12">
          <sm-date-picker v-model="draft.dateRange" label="Date range" :is-range="true" name="date-range" rules="required" />
        </div>

        <div class="w-full tablet:w-1/3 px-12 flex"> <!-- The "flex" here is used to vertically align the buttons -->
          <sm-button native-type="reset" type="tertiary">Reset</sm-button>
          <sm-button native-type="submit" type="primary">Search</sm-button>
        </div>

      </div>

    </sm-form>
  `,
})

InlineForm.parameters = {
  docs: {
    description: {
      story: 'Forms can be inlined using tailwind utilities. Above is a responsive approach to handling inline forms.',
    },
  },
}

export const Validation = () => ({
  components: { SmForm, SmCheckbox, SmCheckboxButton, SmCheckboxGroup, ErrorMessage },
  setup: () => {
    // NOTE: important that these keys match exactly to the `name` prop of the form inputs
    const initialValue = {
      name: null,
      'min-rate': 10,
      'time-periods': [],
      terms: null,
      'time-period': null,
      terms2: null,
      select: null,
      date: null,
      'date-range': null,
      'date-time': null,
      time: '2023-01-01T12:00:00.000Z',
      calendar: null,
      'calendar-range-start-input': null,
      'calendar-range-end-input': null,
      'calendar-range': null,
      'name-translations': [
        { code: 'en' },
        { code: 'de' },
      ],
      multiselect: null,
    }

    const form = ref({
      name: null,
      'min-rate': 10,
      'time-periods': [],
      terms: null,
      'time-period': null,
      terms2: null,
      select: null,
      date: null,
      'date-range': null,
      'date-time': null,
      time: '2023-01-01T12:00:00.000Z',
      calendar: null,
      'calendar-range': null,
      'name-translations': [
        { code: 'en' },
        { code: 'de' },
      ],
      multiselect: null,
    })

    const formRef = ref()
    const sending = ref(false)

    const options = ref([
      { label: 'Selection 1', code: 's1' },
      { label: 'Selection 2', code: 's2' },
      { label: 'Selection 3', code: 's3' },
      { label: 'Selection 4', code: 's4' },
      { label: 'Selection 5', code: 's5' },
      { label: 'Selection 6. Long label to test truncation. Long label to test truncation. Long label to test truncation. Long label to test truncation. Long label to test truncation.', code: 's6' },
    ])

    const send = (values: unknown) => {
      sending.value = true
      console.info('sending v-model values:', form.value)
      console.info('sending @submit payload values:', values)

      setTimeout(() => {
        sending.value = false
      }, 3000)
    }

    defineRule('greaterThanLowestRate', (value: number): boolean | string => {
      const lowestRate = 12

      if (value <= lowestRate) {
        return `Must be greater than the lowest rate of "${lowestRate}"`
      }

      return true
    })

    /**
     * Demo for sm-date-picker with custom rule
     */
    defineRule('notInThePast', (value?: string) => {
      // Will validate v-model value with the specified mask rather
      // than the displayed input value in the typing box
      console.info('Custom rule "notInThePast":', value)

      // Remove the time from the date
      const selectedDate = value && new Date(value).setHours(0, 0, 0, 0)
      const minDate = new Date().setHours(0, 0, 0, 0)

      if (selectedDate && (selectedDate < minDate)) {
        return 'Date must not be in the past'
      }

      return true
    })

    const handleReset = () => {
      console.info('Reset event triggered')

      // Manually reset the calendar-range
      form.value['calendar-range'] = null

      // Manually reset the translation list
      form.value['name-translations'] = [
        { code: 'en' },
        { code: 'de' },
      ]
    }

    onMounted(() => {
      // Validate right away if running in Percy
      if (isPercyContext()) {
        form.value.time = null
        document.getElementById('submit-button')?.click()
      }
    })

    const supportedTranslations = [
      {
        code: 'en',
        translationLabel: 'English translation',
        dropdownLabel: 'English',
      },
      {
        code: 'es',
        translationLabel: 'Spanish translation',
        dropdownLabel: 'Spanish',
        disableDeletion: true,
      },
      {
        code: 'de',
        translationLabel: 'German translation',
        dropdownLabel: 'German',
      },
      {
        code: 'fr',
        translationLabel: 'French translation',
        dropdownLabel: 'French',
      },
    ]

    return {
      initialValue,
      form,
      formRef,
      options,
      supportedTranslations,
      sending,
      send,
      handleReset,
    }
  },
  template: `
    <sm-form
      class="max-w-lg"
      ref="formRef"
      :disabled="sending"
      :initial-values="initialValue"
      @submit="send"
      @reset="handleReset"
    >

      <template v-slot:default="{ invalid, values }">

        <sm-input name="name" type="text" label="Hotel name" rules="required" v-model="form.name" />

        <sm-input name="min-rate" type="number" label="Min rate" rules="required|greaterThanLowestRate" v-model="form['min-rate']" />

        <sm-form-group class="mt-32" legend="Group label 1">
          <sm-checkbox-group class="mb-24" name="time-periods" label="Standard checkbox" rules="required">
            <sm-checkbox label="Label 1" selected-value="checkbox-1" v-model="form['time-periods']" name="time-periods" errorDisabled rules="required" />
            <sm-checkbox label="Label 2" selected-value="checkbox-2" v-model="form['time-periods']" name="time-periods" errorDisabled rules="required" />
          </sm-checkbox-group>

          <sm-checkbox name="terms" selected-value="true" v-model="form.terms" :rules="{ required: { allowFalse: false } }">
            I agree to the <a href="#">Terms & Conditions.</a>
          </sm-checkbox>

          <sm-radio-group class="my-24" name="time-period" label="Standard radio" rules="required">
            <sm-radio label="Label 1" selected-value="radio-1" v-model="form['time-period']" name="time-period" errorDisabled></sm-radio>
            <sm-radio label="Label 2" selected-value="radio-2" v-model="form['time-period']" name="time-period" errorDisabled></sm-radio>
          </sm-radio-group>

          <sm-radio selected-value="true" v-model="form.terms2" rules="required" name="terms2">
            I agree to the <a href="#">Terms & Conditions.</a>
          </sm-radio>
        </sm-form-group>

        <sm-form-group class="mt-32 mb-32" legend="Group label 2">
          <div class="flex flex-wrap gap-y-24 gap-x-32">
            <sm-select
              name="select"
              class="flex-1 min-w-0"
              label="Select"
              placeholder="Search keywords..."
              v-model="form.select"
              rules="required"
              :options="options"
            />
          </div>
        </sm-form-group>

        <sm-form-group class="mt-32 mb-32" legend="Group label 3">
          <sm-date-picker
            v-model="form.date"
            label="Date"
            name="date"
            rules="required|notInThePast"
            suffix-icon="action-calendar"
            help-text="Select past date to trigger custom rule"
            :model-modifiers="{ string: true }"
            :masks="{
              modelValue: 'YYYY-MM-DD',
              input: 'DD MMMM YYYY',
            }"
          />

          <sm-date-picker
            v-model="form['date-range']"
            label="Date range"
            name="date-range"
            suffix-icon="action-calendar"
            start-date-placeholder="Start date"
            end-date-placeholder="End date"
            id="custom-id-date-range-1"
            :columns="2"
            :rules="{ required: true }"
            :model-modifiers="{ range: true }"
          />

          <sm-date-picker
            mode="dateTime"
            v-model="form['date-time']"
            rules="required"
            name="date-time"
            id="custom-id-date-time-1"
            :min-date="new Date()"
          >
            <template #label>Date and time</template>
          </sm-date-picker>

          <sm-date-picker
            mode="time"
            v-model="form.time"
            rules="required"
            name="time"
            label="Time"
            :time-rules="{ minutes: { interval: 15 } }"
          />

          <sm-calendar
            name="calendar"
            v-model="form.calendar"
            label="Year and month"
            mode="month-year"
            prefix-icon="action-calendar"
            :masks="{ input: 'MMMM YYYY' }"
            :is-range="false"
            rules="required"
            placeholder="Select year and month"
          />

          <sm-calendar
            name="calendar-range"
            v-model="form['calendar-range']"
            label="Year and month range"
            mode="month-year"
            prefix-icon="action-calendar"
            :masks="{ input: 'MMMM YYYY' }"
            :is-range="true"
            rules="required"
            start-date-placeholder="Start"
            end-date-placeholder="End"
          />

          <sm-translations-input
            v-model="form['name-translations']"
            type="text"
            name="name-translations"
            label="Property Name Translations"
            default-language="en"
            rules="required"
            :supported-translations="supportedTranslations"
          />

          <sm-multi-select
            v-model="form.multiselect"
            name="multiselect"
            label="Multi-select"
            placeholder="Search keywords..."
            rules="required"
            :options="options"
            :multiple="true"
          />
        </sm-form-group>

        <!--
          Add extra space (mb-224) below for the popovers so it
          doesn't auto-reposition on top. This is not a official "pattern",
          but it makes things easier for us when we test and take a screenshot
        -->
        <div class="text-right mb-224">
          <sm-button :disabled="sending" native-type="reset" type="text">Cancel</sm-button>
          <sm-button id="submit-button" :loading="sending" native-type="submit" type="primary">Submit</sm-button>
        </div>
      </template>
    </sm-form>
  `,
})

Validation.storyName = 'Validation'

const validationDescription = `
  Validation is provided through the vee-validate library version 4.

  1. Field level validation is provided through the <code>rules</code> prop.
    available rules: https://vee-validate.logaretm.com/v4/guide/global-validators#vee-validaterules

    Each form input has accepts a <code>rules</code> prop, which the vee-validate service will implement.

    For example, to make a form field field required, add the <code>rules="required"</code> property to the component.

    To specify multiple rules, separate each rule with a <code>|</code> character, like so <code>rules="required|email"</code>.

    a) Define string format rule: rules="max_value:10"
    b) Define object format: :rules="{ max_value: 10 }"

    To create custom rules, use the defineRule Validators: https://vee-validate.logaretm.com/v4/guide/global-validators#defining-global-validators
    For example:
      defineRule('required', value => {
        if (!value || !value.length) {
          return 'This field is required';
        }
        return true;
      });

  2. Form level validation is provided through the <code>validation-schema</code> prop.
    See the Global form Validator: https://vee-validate.logaretm.com/v4/guide/global-validators#schema-validation

    a) You can use the <code>yup</code> schema validation library to define your schema: https://vee-validate.logaretm.com/v4/guide/components/validation/

      <code>vee-validate</code> has built-in support for <code>yup</code> schemas, it allows you create validation objects like this:
      <pre>
        const schema = yup.object({
          timePeriodsOne: yup.string().required(),
          termsOne: yup.string().required(),
        });
      </pre>

    b) You can write your own schemas object like below:

      <pre>
        const schema = {
          timePeriodsOne: (value : any) => {
            if (value && value.length) {
              return true
            }
            return 'You must choose a time period'
          },
          termsOne: (value : any) => {
            if (value && value.trim()) {
              return true
            }
            return 'This is required'
          },
        }
      </pre>

    c) You can have reactive form schemas using <code>computed</code> if you are looking to create dynamic schemas using either yup or a validation object.

    Additionally the <code>sm-form</code> component exposes a <code>validate()</code> method and <code>invalid</code> property to support validation.

    Please note: At the moment you have to reset the component <code>sm-checkbox</code> model value manually on reset event. This will required further investigation.
`
Validation.parameters = {
  docs: {
    description: {
      story: validationDescription,
    },
  },
  percy: {
    // Needed for the Percy setup steps in onMounted hook to run
    // Take note of the defaults when upgrading Storybook or Percy in the future
    // https://docs.percy.io/docs/storybook#unexpected-diffs
    enableJavascript: true,
  },
}

export const ValidationSchema = () => ({
  components: { SmForm, SmCheckbox, SmCheckboxButton, SmCheckboxGroup, ErrorMessage },
  setup: () => {
    // NOTE: important that these keys match exactly to the `name` prop of the form inputs
    const initialValue = {
      name: null,
      'min-rate': 10,
      'standard-checkbox': [],
      terms: null,
      radio: null,
      terms2: null,
      date: null,
      'date-range': null,
      'date-time': null,
      time: '2023-01-01T12:00:00.000Z',
      calendar: null,
      'calendar-range': null,
      'calendar-range-start-input': null,
      'calendar-range-end-input': null,
      'name-translations': [
        { code: 'en' },
        { code: 'de' },
      ],
      multiselect: null,
    }
    const form = ref({
      name: null,
      'min-rate': 10,
      'standard-checkbox': [],
      terms: null,
      radio: null,
      terms2: null,
      date: null,
      'date-range': null,
      'date-time': null,
      time: '2023-01-01T12:00:00.000Z',
      calendar: null,
      'calendar-range': null,
      'name-translations': [
        { code: 'en' },
        { code: 'de' },
      ],
      multiselect: null,
    })

    const formRef = ref()
    const formRefOne = ref()

    const sending = ref(false)

    const send = (values: unknown) => {
      console.info('sending v-model values:', form.value)
      console.info('sending @submit payload values:', values)

      sending.value = true
      setTimeout(() => {
        sending.value = false
      }, 3000)
    }

    const handleReset = () => {
      console.info('Reset event triggered')

      // Manually reset the calendar-range
      form.value['calendar-range'] = null

      // Manually reset the translation list
      form.value['name-translations'] = [
        { code: 'en' },
        { code: 'de' },
      ]
    }

    const onInvalidSubmit = ({ values, errors, results }: any) => {
      console.info(values) // current form values
      console.info(errors) // a map of field names and their first error message
      console.info(results) // a detailed map of field names and their validation results
    }

    const schema = {
      name: (value?: string) => {
        if (value?.trim()) {
          return true
        }
        return 'This is required'
      },
      'min-rate': (value: number) => {
        const lowestRate = 12

        if (value <= lowestRate) {
          return `Must be greater than the lowest rate of "${lowestRate}"`
        }

        return true
      },
      'standard-checkbox': (value: unknown[]) => {
        if (value.length) {
          return true
        }
        return 'This is required'
      },
      terms: (value?: boolean) => {
        if (value) {
          return true
        }
        return 'This is required'
      },
      radio: (value?: string) => {
        if (value?.trim()) {
          return true
        }
        return 'This is required'
      },
      terms2: (value: unknown) => {
        if (value) {
          return true
        }
        return 'This is required'
      },
      date: (value?: string) => { // string because of model-modifier
        if (value) {
          // Remove the time from the date
          const selectedDate = value && new Date(value).setHours(0, 0, 0, 0)
          const minDate = new Date().setHours(0, 0, 0, 0)

          if (selectedDate && (selectedDate < minDate)) {
            return 'Date must not be in the past'
          }

          return true
        }
        return 'This is required'
      },
      'date-range': (value?: Record<string, Date>) => {
        if (value) {
          return true
        }
        return 'This is required'
      },
      'date-time': (value?: Date) => {
        if (value) {
          return true
        }
        return 'This is required'
      },
      time: (value?: string) => { // string because of model-modifier
        if (value) {
          return true
        }
        return 'This is required'
      },
      calendar: (value?: unknown) => {
        if (value) {
          return true
        }
        return 'This is required'
      },
      'calendar-range': (value?: unknown) => {
        if (value) {
          return true
        }
        return 'This is required'
      },
      // The validation path can only target by index, this make it hard to target a language code
      'name-translations[1].value': (value: string) => {

        if (value) {
          return true
        }
        return 'This translation is required'
      },
      multiselect: (value?: string[]) => {
        if (value?.length) {
          return true
        }

        return 'This is required'
      },
    }

    const options = ref([
      {
        title: 'Group 1',
        libs: [
          { label: 'Selection 1', code: '1' },
          { label: 'Selection 2', code: '2' },
          { label: 'Selection 3', code: '3' },
          { label: 'Selection 4', code: '4' },
          { label: 'Selection 5', code: '5' },
        ],
      },
      {
        title: 'Group 2',
        libs: [
          { label: 'Selection 6', code: '6' },
          { label: 'Selection 7', code: '7' },
          { label: 'Selection 8', code: '8' },
        ],
      },
      {
        title: 'Group 3',
        libs: [
          { label: 'Selection 9', code: '9' },
          { label: 'Selection 10', code: '10' },
          { label: 'Selection 11', code: '11' },
          { label: 'Selection 12', code: '12' },
          { label: 'Selection 111', code: '111' },
        ],
      },
    ])

    const supportedTranslations = [
      {
        code: 'en',
        translationLabel: 'English translation',
        dropdownLabel: 'English',
      },
      {
        code: 'es',
        translationLabel: 'Spanish translation',
        dropdownLabel: 'Spanish',
        disableDeletion: true,
      },
      {
        code: 'de',
        translationLabel: 'German translation',
        dropdownLabel: 'German',
      },
      {
        code: 'fr',
        translationLabel: 'French translation',
        dropdownLabel: 'French',
      },
    ]

    onMounted(() => {
      // Validate right away if running in Percy
      if (isPercyContext()) {
        form.value.time = null
        document.getElementById('validate-button')?.click()
      }
    })

    return {
      initialValue,
      form,
      formRef,
      sending,
      send,
      handleReset,
      onInvalidSubmit,
      schema,
      formRefOne,
      supportedTranslations,
      options,
    }
  },
  template: `
    <div class="max-w-lg">
      <sm-form
        class="max-w-lg"
        ref="formRef"
        :disabled="sending"
        :validation-schema="schema"
        :initial-values="initialValue"
        @submit="send"
        @reset="handleReset"
      >

        <template v-slot:default="{ isSubmitting, validate, setFieldValue, setValues, invalid, values, errors, meta }">

          <sm-input name="name" type="text" label="Hotel name" v-model="form.name" rules="required"/>

          <sm-input name="min-rate" type="number" label="Min rate" v-model="form['min-rate']" rules="required"/>

          <sm-form-group class="mt-32 mb-32" legend="Group label 1">
            <sm-checkbox-group class="mb-24" name="standard-checkbox" label="Standard checkbox" rules="required">
              <sm-checkbox label="Label 1" selected-value="checkbox-1" v-model="form['standard-checkbox']" name="standard-checkbox" errorDisabled rules="required" />
              <sm-checkbox label="Label 2" selected-value="checkbox-2" v-model="form['standard-checkbox']" name="standard-checkbox" errorDisabled rules="required" />
            </sm-checkbox-group>

            <sm-checkbox name="terms" :selected-value="true" v-model="form.terms" :rules="{ required: { allowFalse: false } }">
              I agree to the <a href="#">Terms & Conditions.</a>
            </sm-checkbox>

            <sm-radio-group class="my-24" name="radio" label="Standard radio" rules="required">
              <sm-radio label="Label 1" selected-value="radio-1" v-model="form.radio" name="radio" errorDisabled></sm-radio>
              <sm-radio label="Label 2" selected-value="radio-2" v-model="form.radio" name="radio" errorDisabled></sm-radio>
            </sm-radio-group>

            <sm-radio selected-value="true" v-model="form.terms2" rules="required" name="terms2">
              I agree to the <a href="#">Terms & Conditions.</a>
            </sm-radio>
          </sm-form-group>

          <sm-form-group class="mt-32 mb-32" legend="Group label 2">
            <sm-date-picker
              v-model="form.date"
              label="Date"
              name="date"
              rules="required"
              suffix-icon="action-calendar"
              help-text="Select past date to trigger custom rule"
              :model-modifiers="{ string: true }"
              :masks="{
                modelValue: 'YYYY-MM-DD',
                input: 'DD MMMM YYYY',
              }"
            />

            <sm-date-picker
              v-model="form['date-range']"
              label="Date range"
              name="date-range"
              suffix-icon="action-calendar"
              start-date-placeholder="Start date"
              end-date-placeholder="End date"
              id="custom-id-date-range-2"
              :columns="2"
              :rules="{ required: true }"
              :model-modifiers="{ range: true }"
            />

            <sm-date-picker
              ref="datePicker"
              mode="dateTime"
              v-model="form['date-time']"
              rules="required"
              name="date-time"
              id="custom-id-date-time-2"
              :min-date="new Date()"
            >
              <template #label>Date and time</template>
            </sm-date-picker>

            <sm-date-picker
              mode="time"
              v-model="form.time"
              rules="required"
              name="time"
              label="Time"
              :masks="{ modelValue: 'hh:mm A' }"
              :model-modifiers="{ string: true }"
              :time-rules="{ minutes: { interval: 15 } }"
            />

            <sm-calendar
              name="calendar"
              v-model="form.calendar"
              label="Calendar"
              mode="month-year"
              prefix-icon="action-calendar"
              :masks="{ input: 'MMMM YYYY' }"
              :is-range="false"
              rules="required"
            />

            <sm-calendar
              name="calendar-range"
              v-model="form['calendar-range']"
              label="Calendar range"
              mode="month-year"
              prefix-icon="action-calendar"
              :masks="{ input: 'MMMM YYYY' }"
              :is-range="true"
              rules="required"
            />

            <sm-translations-input
              v-model="form['name-translations']"
              type="text"
              name="name-translations"
              label="Property Name Translations"
              default-language="en"
              rules="required"
              :supported-translations="supportedTranslations"
            />

            <sm-multi-select
              v-model="form.multiselect"
              name="multiselect"
              label="Multi-select"
              placeholder="Search keywords..."
              rules="required"
              :multiple="true"
              :options="options"
              :show-group-select="true"
            />
          </sm-form-group>


          <p>Values</p>
          <pre>{{ values }}</pre>

          <div class="text-right">
            <sm-button :disabled="sending" native-type="reset" type="text">Cancel</sm-button>
            <sm-button :disabled="invalid" :loading="sending" native-type="submit" type="primary">Send</sm-button>

            <!--
              When sm-form has been refactored to useForm, we can grab the
              validate function from the form context and we can remove this extra button
              to setup the demo to validate on load (done to make Percy coverage easier)
              Also, this button is visibly hidden to keep the stories consistent
            -->
            <sm-button
              class="sr-only"
              id="validate-button"
              type="primary"
              @click="validate"
            >
              Validate
            </sm-button>
          </div>

        </template>
      </sm-form>
    </div>
  `,
})

ValidationSchema.storyName = 'Validation Schema'

const validationSchemaDescription = `
  Validation is provided through the vee-validate library version 4.

  Form level validation is provided through the <code>validation-schema</code> prop.
  See the Global form Validator: https://vee-validate.logaretm.com/v4/guide/global-validators#schema-validation

  a) You can use the <code>yup</code> schema validation library to define your schema: https://vee-validate.logaretm.com/v4/guide/components/validation/
    <code>vee-validate</code> has built-in support for <code>yup</code> schemas, it allows you create validation objects like this:
    <pre>
      const schema = yup.object({
        timePeriodsOne: yup.string().required(),
        termsOne: yup.string().required(),
      });
    </pre>

  b) You can write your own schemas object like below:
    <pre>
      const schema = {
        timePeriodsOne: (value : any) => {
          if (value && value.length) {
            return true
          }
          return 'You must choose a time period'
        },
        termsOne: (value : any) => {
          if (value && value.trim()) {
            return true
          }
          return 'This is required'
        },
      }
    </pre>

  c) You can have reactive form schemas using <code>computed</code> if you are looking to create dynamic schemas using either yup or a validation object.

  Additionally the <code>sm-form</code> component exposes a <code>validate()</code> method and <code>invalid</code> property to support validation.
`

ValidationSchema.parameters = {
  docs: {
    description: {
      story: validationSchemaDescription,
    },
  },
}

export const CrossFieldValidation = () => ({
  components: { SmForm, SmInput },
  setup: () => {
    const sending = ref(false)
    const first = ref('')
    const second = ref('')
    const confirmation = ref('')
    const getPassword = ref('')
    const maxRooms = ref(null)
    const maxStay = ref(null)

    const send = (e: unknown) => {
      sending.value = true

      console.info('sending v-model values', {
        first: first.value,
        second: second.value,
        confirmation: confirmation.value,
        getPassword: getPassword.value,
        maxRooms: maxRooms.value,
        maxStay: maxStay.value,
      })
      console.info('sending @submit payload values', e)

      setTimeout(() => {
        sending.value = false
      }, 3000)
    }
    const reset = () => {
      first.value = ''
      second.value = ''
    }

    defineRule('confirmedBy', (value: string, [target]: [string]) => {
      // Target here is the value of the target field
      if (value === target) {
        return true
      }

      // here it is its name, because we are generating a message
      return 'The text does not match the second'
    })

    defineRule('confirmPassword', (value: string, [target]: [string]) => {
      if (value === target) {
        return true
      }

      return 'Password confirmation does not match'
    })

    defineRule('numberInput', (value: string, [target]: [string]) => {
      // Target here is the value of the target field
      if (value === target) {
        return true
      }

      return 'The text does not match the maxStay'
    })

    return {
      sending,
      send,
      first,
      second,
      reset,
      confirmation,
      getPassword,
      maxRooms,
      maxStay,
    }
  },
  template: `
    <sm-form :disabled="sending" @submit="send" @reset="reset">

      <template v-slot:default="{ invalid }">
        <h4> Cross field validation using <span style="font-weight: 600;">name </span> (vid is deprecated) :</h4>

        <sm-input name="first" label="First field" rules="required|confirmedBy:@second" type="text" v-model="first"/>

        <sm-input name="second" label="Second field" rules="required" type="text" v-model="second"/>

        <h4> Cross field validation using <span style="font-weight: 600;">name</span> :</h4>

        <sm-input label="Password" rules="required|confirmPassword:@confirm" name="password" type="password" v-model="getPassword"/>

        <sm-input label="Confirm password" name="confirm" rules="required" type="password" v-model="confirmation"/>

        <sm-input v-model="maxRooms" name="maxRooms" rules="required|numberInput:@maxStay" label="Max rooms" type="number" controls />

        <sm-input v-model="maxStay" name="maxStay" rules="required" label="Max stay" type="number" controls />

        <div class="text-right">
          <sm-button :disabled="invalid" :loading="sending" native-type="submit" type="primary">Submit</sm-button>
        </div>

      </template>

    </sm-form>
  `,
})

const crossFieldValidationDescription = `
  Cross Field Validation is provided through the vee-validate library.

  See the <a href="https://vee-validate.logaretm.com/v4/guide/global-validators#cross-field-validation" target="_blank">official documentation</a>.

  Properly reference the target field <code>name</code> prop value in the rules of the other field.

  The vee-validate service will use these to associate the two fields together.

  Note that <code>vid</code> prop will no longer work, and would require you to use <code>name</code> prop instead.

  To create custom rules, use the <a href="https://vee-validate.logaretm.com/v4/guide/global-validators#defining-global-validators" target="_blank">defineRule method as documented here</a>.
`

CrossFieldValidation.parameters = {
  docs: {
    description: {
      story: crossFieldValidationDescription,
    },
  },
}

export const DisabledForm = () => ({
  components: { SmForm },
  setup: () => {
    const disabled = ref(true)

    const form = reactive({
      to: null,
      subject: null,
      message: null,
      signature: 'personal',
      signature2: 'personal',
      media: ['auto-download'],
      media2: ['auto-download'],
      confidential: false,
      date: null,
      time: null,
      monthYear: null,
      expiration: null,
      expirationMultiSelect: null,
      'name-translations': [
        { code: 'en' },
        { code: 'de' },
      ],
    })

    const expirations = ref([
      { label: 'Expires in 1 day', code: '1d' },
      { label: 'Expires in 1 week', code: '1w' },
      { label: 'Expires in 1 month', code: '1m' },
      { label: 'Expires in 3 months', code: '3m' },
      { label: 'Expires in 5 years', code: '5y' },
    ])

    const reset = () => {
      Object.keys(form).forEach((key) => {
        const value = form[key]

        if (Array.isArray(value)) {
          form[key] = []
        } else {
          form[key] = null
        }

        form['name-translations'] = [
          { code: 'en' },
          { code: 'de' },
        ]
      })
    }

    const supportedTranslations = [
      {
        code: 'en',
        translationLabel: 'English translation',
        dropdownLabel: 'English',
      },
      {
        code: 'es',
        translationLabel: 'Spanish translation',
        dropdownLabel: 'Spanish',
        disableDeletion: true,
      },
      {
        code: 'de',
        translationLabel: 'German translation',
        dropdownLabel: 'German',
      },
      {
        code: 'fr',
        translationLabel: 'French translation',
        dropdownLabel: 'French',
      },
    ]

    return {
      supportedTranslations,
      disabled,
      expirations,
      form,
      reset,
    }
  },
  template: `

  <div class="max-w-xl">

    <sm-form :disabled="disabled" @reset="reset">

      <template v-slot:default="{ invalid }">

        <sm-form-group legend="Fieldset Legend">
          <sm-input type="email" label="To" rules="required|email" v-model="form.to" placeholder="e.g contact@example.com" suffix-icon="action-email" name="to" />
          <sm-input type="text" label="Subject" rules="required" placeholder="No subject..." v-model="form.subject" name="subject" />
        </sm-form-group>

        <sm-input type="textarea" label="Message" rows="6" v-model="form.message" name="message" />

        <div class="grid grid-cols-1 tablet:grid-cols-2 mb-sm-16" style="column-gap: 24px">
          <div class="flex-1">
            <sm-radio-group label="Signature" v-model="form.signature" rules="required" name="signature">
              <sm-radio name="signature" v-model="form.signature" label="Work" selected-value="work" :error-disabled="true"/>
              <sm-radio name="signature" v-model="form.signature" label="Personal" selected-value="personal" :error-disabled="true"/>
            </sm-radio-group>
            <sm-radio-group label="Signature" v-model="form.signature" rules="required" name="signature2">
              <sm-radio-button name="signature2" v-model="form.signature2" label="Work" selected-value="work" :error-disabled="true"/>
              <sm-radio-button name="signature2" v-model="form.signature2" label="Personal" selected-value="personal" :error-disabled="true"/>
            </sm-radio-group>
          </div>

          <div class="flex-1">
            <sm-checkbox-group label="Media" v-model="form.media" name="media">
              <sm-checkbox name="media" label="Auto-download" selected-value="auto-download" v-model="form.media"></sm-checkbox>
              <sm-checkbox name="media" label="Auto-play" selected-value="autoplay" v-model="form.media"></sm-checkbox>
            </sm-checkbox-group>
            <sm-checkbox-group label="Media" v-model="form.media2" name="media2">
              <sm-checkbox-button name="media2" label="Auto-download" selected-value="auto-download" v-model="form.media2"></sm-checkbox-button>
              <sm-checkbox-button name="media2" label="Auto-play" selected-value="autoplay" v-model="form.media2"></sm-checkbox-button>
            </sm-checkbox-group>
          </div>
        </div>

        <div class="grid grid-cols-1 tablet:grid-cols-2" style="column-gap: 24px">
          <div>
            <sm-date-picker label="Schedule send" v-model="form.date" placeholder="Placeholder..." name="date"></sm-date-picker>
          </div>
          <div>
            <sm-calendar mode="month-year" label="Month and year" rules="required" v-model="form.monthYear" placeholder="Placeholder..." name="monthYear"></sm-calendar>
          </div>
        </div>

        <sm-translations-input
          v-model="form['name-translations']"
          type="text"
          :disabled="disabled"
          name="name-translations"
          label="Property Name Translations"
          default-language="en"
          rules="required"
          :supported-translations="supportedTranslations"
        />

        <div class="grid grid-cols-1 tablet:grid-cols-2 mb-sm-16" style="column-gap: 24px">
          <div>
            <sm-time-picker name="time" label="Time" v-model="form.time" from="00:00" to="23:00" placeholder="Placeholder..."></sm-time-picker>
          </div>
          <div>
            <sm-select label="Set expiry" placeholder="Placeholder..." :options="expirations" v-model="form.expiration" name="expiration"></sm-select>
          </div>
        </div>

        <div class="grid grid-cols-1 tablet:grid-cols-2 mb-sm-16" style="column-gap: 24px">
          <sm-multi-select
            v-model="form.expirationMultiSelect"
            label="Set expiry (multi-select)"
            name="expiration-multiselect"
            placeholder="Placeholder..."
            :options="expirations"
            :multiple="false"
          />
        </div>

        <sm-switch label="Confidential Mode" v-model="form.confidential" name="confidential"></sm-switch>

        <p class="mt-sm-16">Is form valid: {{ !invalid }}</p>

        <div class="text-right mt-sm-16">
          <sm-button type="text" native-type="reset" @click="reset">
            Reset
          </sm-button>
          <sm-button type="tertiary" @click="disabled = !disabled">
            {{ disabled ? 'Enable' : 'Disable' }} form
          </sm-button>
        </div>

      </template>

    </sm-form>

  </div>
  `,
})

DisabledForm.parameters = {
  docs: {
    description: {
      story: 'Use <code>disabled</code> prop in <code>sm-form</code> to disable input fields inside the form',
    },
  },
}
