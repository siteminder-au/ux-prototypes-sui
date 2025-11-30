<script setup lang="ts">
import { format } from 'fecha'
import { computed, Ref, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { createTimeRange } from './create-time-range'
import { SmTimePickerValue } from './sm-time-picker.types'
import { SmSelectOption } from '../sm-select/sm-select.types'
import SmSelect from '../sm-select/sm-select.vue'

const props = withDefaults(defineProps<{
  /**
   * Whether the field is disabled
   */
  disabled?: boolean
  /**
   * The first time available in the dropdown in HH:mm format from 00:00 -> 23:59
   */
  from?: string
  /**
   * The label field
   */
  label?: string
  /**
   * Native name attribute
   */
  name: string
  /**
   * The step between each time option in the dropdown in HH:mm format
   */
  step?: string
  /**
   * Label of a null option if selecting none is allowed
   */
  selectNone?: string | null
  /**
   * The first time available in the dropdown in HH:mm format from 00:00 -> 23:59
   */
  to?: string
  /**
   * The vee-validate rules - see: https://vee-validate.logaretm.com/v4/guide/global-validators/#available-rules
   */
  rules?: string | Record<string, unknown>
}>(), {
  disabled: false,
  from: '00:00',
  label: '',
  step: '01:00',
  selectNone: null,
  to: '23:00',
  rules: '',
})

defineEmits<{
  /**
   * Emits when the v-model is updated
   * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
   */
  'update:modelValue': [value: SmTimePickerValue]
}>()

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
    /**
     * Resolves this warning on consuming app with @vue/compat:
     *
     * [Vue warn]: (deprecation COMPONENT_V_MODEL) Component declares "modelValue" prop, which is Vue 3 usage,
     * but is running under Vue 2 compat v-model behavior. You can opt-in to Vue 3 behavior on a per-component basis
     * with `compatConfig: { COMPONENT_V_MODEL: false }`.
     * Details: https://v3-migration.vuejs.org/breaking-changes/v-model.html
     */
    COMPONENT_V_MODEL: false,
  },
  inheritAttrs: false,
})

/**
 * v-model for `modelValue` prop
 * Emits 'update:modelValue': [value: ModelValue] when this ref changes
 * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
 */
const modelValue = defineModel<SmTimePickerValue>({
  default: null,
})

const inputValue = computed({
  get: () => modelValue.value,
  set: (state) => { modelValue.value = state },
})

const optionRange: Ref<SmSelectOption[]> = ref([])

const range = computed(() => {

  return createTimeRange(props.from, props.to, props.step)
    .map((date) => {

      return {
        label: format(date, 'HH:mm'),
        code: format(date, 'HH:mm'),
      }

    })

})

optionRange.value = cloneDeep(range.value)

if (props.selectNone) {
  const defaultObject = { label: props.selectNone, code: null }
  optionRange.value.splice(0, 0, defaultObject)
}

defineExpose({
  inputValue,
  optionRange,
})
</script>

<template>
  <sm-select
    v-model="inputValue"
    :disabled="disabled"
    :label="label"
    :options="optionRange"
    :rules="rules"
    v-bind="$attrs"
    :name="name"
  >
    <template
      v-if="$slots.label"
      #label
    >
      <!-- @slot The field label. Overrides the label prop. -->
      <slot name="label" />
    </template>
    <template
      v-if="$slots.action"
      #action
    >
      <!-- @slot The field action next to the label. Example usage: adding a helper icon to provide more context on the field. -->
      <slot name="action" />
    </template>
    <template
      v-if="$slots.prefix"
      #prefix
    >
      <!-- @slot Appears to the left of the select. Can be used to create a mixed select. -->
      <slot name="prefix" />
    </template>
    <template
      v-if="$slots.suffix"
      #suffix
    >
      <!-- @slot Appears to the right of the select. Can be used to create a mixed select. -->
      <slot name="suffix" />
    </template>
  </sm-select>
</template>

<style lang="scss">
@import "../../../common/variables";
@import "../../../common/mixins";
</style>
