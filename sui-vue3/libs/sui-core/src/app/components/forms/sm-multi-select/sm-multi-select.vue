<script setup lang="ts">
import { useField } from 'vee-validate'
import { ref, computed, VNode } from 'vue'
import SmMultiSelectInput from './sm-multi-select-input.vue'
import {
  SmMultiSelectGroupOption,
  SmMultiSelectOption,
  SmMultiSelectModelValue,
  SmMultiSelectInputExposed,
} from './sm-multi-select.types'
import { useIsFieldRequired } from '../shared/use-is-field-required'

const props = withDefaults(defineProps<{
  /**
   * Whether the field can be deselected
   */
  allowEmpty?: boolean
  /**
   * Custom CSS class which will be applied on the dropdown's content element
   */
  contentClass?: string
  /**
   * Whether the field is enabled or not
   */
  disabled?: boolean
  /**
   * Disable the error text
   */
  errorDisabled?: boolean
  /**
   * Whether the options can be filtered by searching
   */
  filterable?: boolean
  /**
   * Custom CSS class which will be applied on the dropdown's footer element
   */
  footerClass?: string
  /**
   * The field's label. Can be overridden by the label slot
   */
  label?: string
  /**
   * Hides the label visually but still keeps it accessible to screen readers.
   */
  labelHidden?: boolean
  /**
   * Whether the field supports multiple selections
   */
  multiple?: boolean
  /**
   * Name attribute for validation provider.
   * Mandatory to ensure that vee-validate works correctly
   */
  name: string
  /**
   * Array of available options. E.g [{ "label": "Strawberry", "code": "strawberry" }, { "label": "Grapes", "code": "grapes" }]
   */
  options?: SmMultiSelectOption[] | SmMultiSelectGroupOption[]
  /**
   * The placeholder text for the input field
   */
  placeholder?: string
  /**
   * The vee-validate rules - see: https://vee-validate.logaretm.com/v4/guide/global-validators/#available-rules
   */
  rules?: string | Record<string, unknown>
  /**
   * The initial selected value(s) when v-model cannot be used.
   * Two-way binding sample usage: <sm-multi-select v-model:selection="mySelection" ... />
   */
  selection?: SmMultiSelectModelValue
  /**
   * Whether to display option groups
   */
  showGroupSelect?: boolean
  /**
   * Whether to show the 'Select all' option in a standard multi-select
   */
  showSelectAllOption?: boolean
  /**
   * Whether to show the 'Select group' option for each groupings in a grouped multi-select
   */
  showSelectGroupOption?: boolean
  /**
   * Selected value(s) that is structured to be compatible with the tag-filters
   */
  // tags?: object // sm-tag-filters is out of scope at this time
  /**
   * Whether to truncate the option label when it goes over the component's width
   */
  truncateOptionLabel?: boolean
  /**
   * Whether to truncate the option description when it goes over the component's width
   */
  truncateOptionDescription?: boolean
}>(), {
  allowEmpty: true,
  contentClass: '',
  disabled: false,
  errorDisabled: false,
  filterable: true,
  footerClass: '',
  label: '',
  labelHidden: false,
  multiple: false,
  options: () => [],
  placeholder: '',
  rules: undefined,
  selection: undefined,
  showGroupSelect: false,
  showSelectAllOption: true,
  showSelectGroupOption: true,
  // tags: undefined,
  truncateOptionDescription: false,
  truncateOptionLabel: false,
})

const emit = defineEmits<{
  /**
   * Emitted when the v-model is updated
   */
  change: [value: unknown]
  /**
   * Emitted when the v-model is updated
   */
  // 'update:tags': [value: unknown]
  /**
   * Emitted when the dropdown list is closed
   */
  close: []
  /**
   * Emitted when the dropdown list is opened
   */
  open: []
  /**
   * Emitted when selection is updated
   */
  'update:selection': [value: SmMultiSelectModelValue]
  /**
   * Emitted when the v-model is updated
   * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
   */
  'update:modelValue': [value: SmMultiSelectModelValue]
}>()

defineOptions({
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
    // we suppress ATTR_FALSE_VALUE as we want to keep
    // `aria-hidden` attribute attached even if the value of it is false
    // in vue2, aria-hidden was removed if the value was false.
    ATTR_FALSE_VALUE: 'suppress-warning',
  },
})

defineSlots<{
  action?: () => VNode[]
  label?: () => VNode[]
  prefix?: () => VNode[]
  suffix?: () => VNode[]
  footer?: () => VNode[]
}>()

/**
 * v-model for `modelValue` prop
 * Emits 'update:modelValue': [value: SmMultiSelectModelValue] when this ref changes
 * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
 */
const modelValue = defineModel<SmMultiSelectModelValue>({ default: undefined })

const multiselectInputRef = ref<SmMultiSelectInputExposed>()

const computedRules = computed(() => props.rules)
const { meta, errors, validate } = useField(
  () => props.name,
  computedRules,
  { syncVModel: true },
)
const { required } = useIsFieldRequired(computedRules)

const inputValue = computed<SmMultiSelectOption | SmMultiSelectOption[] | undefined>({
  get: () => {
    if (typeof modelValue.value !== 'undefined' && modelValue.value !== null) {
      return getSelectedOptions(modelValue.value)
    }

    if (typeof props.selection !== 'undefined' && props.selection !== null) {
      return getSelectedOptions(props.selection)
    }

    return undefined
  },
  set: (state) => {
    emit('change', state)

    if (Array.isArray(state)) {
      const selectedValues = state.map(eachState => eachState.code)
      let selectedOptions: SmMultiSelectModelValue = []

      if (!props.showGroupSelect) {
        selectedOptions = (props.options as SmMultiSelectOption[])
          .filter(option => selectedValues.includes(option.code))
          .map(option => option.code)
      }

      if (selectedOptions.length === 0 && props.showGroupSelect) {
        const setOptionGroup = (props.options as SmMultiSelectGroupOption[])
          .filter(option => option.libs?.find(item => selectedValues.includes(item.code)))

        if (setOptionGroup.length !== 0) {
          // Get selected options per group and flatten the array of objects
          const set = setOptionGroup.reduce((items: SmMultiSelectOption[], option) => {
            const groupItem = option.libs?.filter(item => selectedValues.includes(item.code))

            return groupItem ? items.concat(groupItem) : items
          }, [])

          selectedOptions = set.map(p => p.code)
        }
      }

      emit('update:modelValue', selectedOptions) // Default v-model
      emit('update:selection', selectedOptions) // v-model:selection - Workaround when v-model cannot be used
    } else {
      const selectedValue = state ? state.code : null
      let selectedOption

      if (!props.showGroupSelect) {
        selectedOption = (props.options as SmMultiSelectOption[]).find(option => selectedValue === option.code)
      }

      if (!selectedOption && props.showGroupSelect) {
        const setOptionGroup = (props.options as SmMultiSelectGroupOption[]).find(option => option.libs?.find(item => selectedValue === item.code))

        if (setOptionGroup) {
          selectedOption = setOptionGroup.libs?.find(option => selectedValue === option.code)
        }
      }

      emit('update:modelValue', selectedOption ? selectedOption.code : null) // Default v-model
      emit('update:selection', selectedOption ? selectedOption.code : null) // v-model:selection - Workaround when v-model cannot be used
    }
  },
})

const isOptionSelected = (selections: SmMultiSelectModelValue, item: SmMultiSelectOption): boolean => {
  return Array.isArray(selections) ? selections.includes(item.code) : selections === item.code
}

const getSelectedOptions = (selections: SmMultiSelectModelValue): SmMultiSelectOption | SmMultiSelectOption[] | undefined => {
  if (props.multiple && !props.showGroupSelect) {
    if (Array.isArray(selections)) {
      return (props.options as SmMultiSelectOption[]).filter(option => selections.includes(option.code))
    }
  }

  if (props.showGroupSelect) {
    // Get group(s) with selection
    const getOption = (props.options as SmMultiSelectGroupOption[]).filter(option => option.libs?.find(p => isOptionSelected(selections, p)))

    if (getOption.length > 0) {
      // Get selected options per group and flatten the array of objects
      const set = getOption.reduce((items: SmMultiSelectOption[], option) => {
        const groupItem = option.libs?.filter(item => isOptionSelected(selections, item))

        return groupItem ? items.concat(groupItem) : items
      }, [])

      return set
    }
  }

  return (props.options as SmMultiSelectOption[]).find(option => selections === option.code)
}

/**
 * Close the dropdown list
 */
const close = (): void => {
  if (multiselectInputRef.value && typeof (multiselectInputRef.value).closeList === 'function') {
    (multiselectInputRef.value).closeList()
  }
}

/**
 * Open the dropdown list
 */
const open = (): void => {
  if (multiselectInputRef.value && typeof (multiselectInputRef.value).openList === 'function') {
    (multiselectInputRef.value).openList()
  }
}

// sm-tag-filters is out of scope at this time
// watch(
//   () => inputValue.value,
//   () => {
//     if (props.multiple) {
//       emit('update:tags', inputValue.value)
//     }
//   },
//   { immediate: true },
// )

defineExpose({
  inputValue,
  multiselectInputRef,
  close,
  open,
  validate,
})
</script>

<template>
  <sm-multi-select-input
    ref="multiselectInputRef"
    v-model="inputValue"
    :allow-empty="allowEmpty"
    :content-class="contentClass"
    :footer-class="footerClass"
    :disabled="disabled"
    :error-disabled="errorDisabled"
    :filterable="filterable"
    :label="label"
    :label-hidden="labelHidden"
    :multiple="multiple"
    :name="name"
    :options="options"
    :placeholder="placeholder"
    :show-group-select="showGroupSelect"
    :show-select-group-option="showSelectGroupOption"
    :show-select-all-option="showSelectAllOption"
    :truncate-option-description="truncateOptionDescription"
    :truncate-option-label="truncateOptionLabel"
    :validation-state="{
      ...meta,
      required,
      errors,
    }"
    @blur="validate"
    @close="$emit('close')"
    @open="$emit('open')"
  >
    <template
      v-if="$slots.action"
      #action
    >
      <!-- @slot The field action next to the label. For example an icon -->
      <slot name="action" />
    </template>

    <template
      v-if="$slots.label"
      #label
    >
      <!-- @slot The field label. Overrides the label prop -->
      <slot name="label" />
    </template>

    <template
      v-if="$slots.prefix"
      #prefix
    >
      <!-- @slot Appears to the left of the input. Can be used to create a mixed input. -->
      <slot name="prefix" />
    </template>

    <template
      v-if="$slots.suffix"
      #suffix
    >
      <!-- @slot Appears to the right of the input. Can be used to create a mixed input. -->
      <slot name="suffix" />
    </template>

    <template
      v-if="$slots.footer"
      #footer
    >
      <!-- @slot Sticks to the bottom of the popover / dropdown. -->
      <slot name="footer" />
    </template>
  </sm-multi-select-input>
</template>
