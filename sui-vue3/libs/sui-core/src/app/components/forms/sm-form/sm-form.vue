<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { Form as VForm } from 'vee-validate'
import { FormProviderKey } from './symbols'

const props = withDefaults(defineProps<{
  /**
   * Whether the form and all of its inputs should be disabled
   */
  disabled?: boolean
  /**
   * A custom class to be applied to the form element
   */
  customClass?: string
  /**
   * You can define your global validation schema here: https://vee-validate.logaretm.com/v4/guide/global-validators#schema-validation
   * The form level validation schema is useful when you want to validate the form as a whole.
   * For example, you may want to validate that the password and password confirmation fields match.
   * You can use the yup schema validation library to define your schema: https://vee-validate.logaretm.com/v4/guide/components/validation/
   */
  validationSchema?: object | null
  /**
   * Using the prop you can send an object that contains the field names as keys and their values
   */
  initialValues?: object | null
}>(), {
  disabled: false,
  customClass: undefined,
  validationSchema: null,
  initialValues: null,
})
const emit = defineEmits<{
  // IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
  submit: [value: unknown]
  reset: [value: Event]
  'invalid-submit': [value: object | null]
}>()

VForm.compatConfig = {
  MODE: 3,
  // we suppress ATTR_FALSE_VALUE as we want to keep
  // `aria-disabled/disabled` attribute attached even if the value of it is false
  // in vue2, aria-disabled/disabled was removed if the value was false.
  ATTR_FALSE_VALUE: 'suppress-warning',
}

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
    // we suppress ATTR_FALSE_VALUE as we want to keep
    // `aria-disabled/disabled` attribute attached even if the value of it is false
    // in vue2, aria-disabled/disabled was removed if the value was false.
    ATTR_FALSE_VALUE: 'suppress-warning',
  },
  inheritAttrs: false,
})

/**
 * @event submit Fires when the form is submitted. Does not fire if the form is submitted and is invalid.
 */
const onSubmit = (values: unknown): void => {
  emit('submit', values)
}

/**
 * @event reset Fires when the form is reset
 */
const onReset = (e: Event): void => {
  emit('reset', e)
}
const onInvalidSubmit = (object: object | null): void => {
  emit('invalid-submit', object)
}

// Currently using `v-form` rather than `useForm` composable from `vee-validate`
// Should we need to move to `useForm` in the future, refer to the spike ticket
// in https://siteminder-jira.atlassian.net/browse/SUI-2127.
// There were some behaviour changes and incompatibilities on form field components
// See: https://vee-validate.logaretm.com/v4/api/use-form/#composable-api
const observerRef = ref(null)

const isFormDisabled = computed(() => props.disabled)
provide(FormProviderKey, {
  disabled: isFormDisabled,
})

const handleFormReset = (event: Event, handleReset: (event: Event) => void): void => {
  handleReset(event)
  onReset(event)
}

defineExpose({
  onSubmit,
  onReset,
  observerRef,
})
</script>

<template>
  <v-form
    v-slot="{
      handleSubmit,
      meta,
      validate,
      isSubmitting,
      handleReset,
      values,
      setFieldValue,
      setValues,
      errors,
    }"
    ref="observerRef"
    :initial-values="initialValues || undefined"
    :validation-schema="validationSchema || undefined"
    as="div"
    @invalid-submit="onInvalidSubmit"
  >
    <form
      class="sm-form"
      v-bind="$attrs"
      :class="customClass"
      :disabled="disabled"
      :aria-disabled="disabled"
      @submit.prevent="handleSubmit($event, onSubmit)"
      @reset.prevent="handleFormReset($event, handleReset)"
    >
      <!-- @slot The form content. Receives a slot scope of `{ invalid: boolean }`, indicating whether the form's values have passed validation. -->
      <slot
        :values="values"
        :errors="errors"
        :is-submitting="isSubmitting"
        :validate="validate"
        :invalid="meta && !meta.valid"
        :set-field-value="setFieldValue"
        :set-values="setValues"
      />
    </form>
  </v-form>
</template>
