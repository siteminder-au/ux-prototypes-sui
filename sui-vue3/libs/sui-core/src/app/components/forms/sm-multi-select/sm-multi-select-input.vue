<script setup lang="ts">
import { ref, computed, onUpdated, onBeforeUnmount, watch, onMounted, Ref, inject, VNode } from 'vue'
import { Instance, createPopperLite as createPopper, flip } from '@popperjs/core'
import { useUniqueId } from '../../use/unique-id'
import { useI18n } from '../../../libs/vue-i18n'
import { SmMultiSelectOption, SmMultiSelectGroupOption, SmMultiSelectItem } from './sm-multi-select.types'
import SmMultiSelectCheckbox from './sm-multi-select-checkbox.vue'
import { FieldMeta } from '../shared/sm-field-label.types'
import SmFieldError from '../shared/sm-field-error.vue'
import SmFieldLabel from '../shared/sm-field-label.vue'
import SmInput from '../sm-input/sm-input.vue'
import { SmInputType } from '../sm-input/sm-input.types'
import { FormProviderKey } from '../sm-form/symbols'

interface SmInputRef {
  $el?: Element
  $refs?: { input?: HTMLInputElement }
}

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
   * Native name attribute.
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
   * Whether to truncate the option label when it goes over the component's width
   */
  truncateOptionLabel?: boolean
  /**
   * Whether to truncate the option description when it goes over the component's width
   */
  truncateOptionDescription?: boolean
  /**
   * Validation error, classes, flags, etc. from the parent's validation-provider
   */
  validationState?: FieldMeta & { required?: boolean, errors: string[], ariaMsg?: Record<string, unknown> }
}>(), {
  allowEmpty: true,
  contentClass: '',
  disabled: false,
  errorDisabled: false,
  filterable: true,
  footerClass: '',
  label: '',
  labelHidden: false,
  multiple: true,
  options: undefined,
  placeholder: '',
  showGroupSelect: false,
  showSelectAllOption: true,
  showSelectGroupOption: true,
  truncateOptionDescription: false,
  truncateOptionLabel: false,
  validationState: undefined,
})

const emit = defineEmits<{
  /**
   * Emitted when the dropdown list is opened
   */
  open: []
  /**
   * Emitted when the dropdown list is closed
   */
  close: []
  /**
   * Emitted when the input is blurred out
   */
  blur: []
  /**
   * Emitted when an option is selected
   */
  select: [value: any]
  /**
   * Emitted when the search query changes
   */
  searchChange: [query: unknown]
  /**
   * Emitted when the input value changes
   * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
   */
  'update:modelValue': [value: SmMultiSelectOption | SmMultiSelectOption[] | null]
}>()

defineSlots<{
  action?: () => VNode[]
  label?: () => VNode[]
  prefix?: () => VNode[]
  suffix?: () => VNode[]
  footer?: () => VNode[]
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

/**
 * v-model for `modelValue` prop
 * Emits 'update:modelValue' when this ref changes
 * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
 */
const modelValue = defineModel<SmMultiSelectOption | SmMultiSelectOption[] | null>({ default: undefined })

const { i18n } = useI18n()

const searchQuery = ref<string | undefined>()
const popoverElement: Ref<HTMLElement | null> = ref(null)
const inputElement = ref<SmInputRef>()
const listItemElements: Ref<HTMLElement[] | null> = ref(null)
const popper = ref<Instance | null>(null)
const isVisibleRef = ref<boolean>(false)

const highlightedIndex = ref<number>(0)
const hasKeyboardFocus = ref<boolean>(false)

const { id: elementId } = useUniqueId('sm-multi-select__')
const { id: inputElementId } = useUniqueId('sm-multi-select__input_')
const { id: labelElementId } = useUniqueId('sm-multi-select__label_')
const { id: listElementId } = useUniqueId('sm-multi-select__list_')
const { id: errorMessageId } = useUniqueId('sm-multi-select__error_')
const errorMessageValue = computed(() => (props.errorDisabled ? null : errorMessageId.value))

const eventBindings = ref({
  select: (selectedOption: unknown) => {
    emit('select', selectedOption)
  },
  searchChange: (query: unknown) => {
    emit('searchChange', query)
  },
})

// Data provided by sm-form
const formProvider = inject(FormProviderKey, { disabled: ref(false) })
const isFormDisabled = computed(() => formProvider.disabled.value)

const selectedCodes = computed(() => {
  if (!modelValue.value) {
    return []
  }

  if (Array.isArray(modelValue.value)) {
    return modelValue.value.map(value => value.code)
  }

  return [modelValue.value.code]
})

/**
 * Determines visibility of the dropdown options
 */
const isListVisible = computed({
  get: () => {
    return isVisibleRef.value
  },
  set: (state) => {
    if (state && popper.value === null && popoverElement.value) {
      const triggerElement = inputElement.value?.$el

      if (!triggerElement) {
        return
      }

      popper.value = createPopper(triggerElement, popoverElement.value, {
        placement: 'bottom-start',
        strategy: 'absolute',
        modifiers: [flip],
      })
    }

    isVisibleRef.value = state
  },
})

/**
 * A list of items that will be displayed in the dropdown.
 * This includes the group title and "Select all" option(s).
 */
const filteredOptions = computed(() => {
  const search = props.filterable && isListVisible.value ? (searchQuery.value ?? '') : ''
  const options = props.options?.slice() ?? []

  const displayItems = props.showGroupSelect
    ? filterAndFlattenGroupedOptions(options as SmMultiSelectGroupOption[], search)
    : filterStandardOptions(options as SmMultiSelectOption[], search)

  return displayItems.map((option) => {
    const isSelected = !!option.code && selectedCodes.value.includes(option.code)
    const ariaDisabled = option.disabled ?? props.disabled
    const ariaDescription = option.isGroupSelect ? option.groupLabel : undefined
    let ariaSelected // Don't set value here so group title won't attach the attribute

    if (option.isGroupSelect || option.isSelectAll) {
      ariaSelected = option.isGroupSelected ?? false
    } else if (option.code) {
      ariaSelected = isSelected
    }

    return {
      ...option,
      disabled: (option.disabled ?? props.disabled) || isFormDisabled.value,
      isSelected,
      ariaDescription,
      ariaDisabled,
      ariaSelected,
    }
  })
})

/**
 * Determine if the dropdown should be closed or not after an item is selected
 */
const closeOnClick = (): void => {
  if (!props.multiple) {
    closeList()
  }
}

/**
 * Handler for keyboard esc event
 */
const listEscaped = (): void => {
  closeList()
}

/**
 * Handler for blurred input or popover events
 */
const listClosed = (e: FocusEvent): void => {
  if (
    !e.relatedTarget || (
      // Don't close if next target is either inside the popover or the input field
      !popoverElement.value?.contains(e.relatedTarget as Node)
      && inputElement.value?.$refs?.input !== e.relatedTarget as Node
    )
  ) {
    closeList()
  }
}

/**
 * Handler for focused input event
 */
const listOpened = (): void => {
  isListVisible.value = true
}

/**
 * Close dropdown list
 */
const closeList = (): void => {
  isListVisible.value = false
}

/**
 * Open dropdown list and focus on the input
 */
const openList = (): void => {
  isListVisible.value = true
  inputElement.value?.$refs?.input?.focus()
}

const toggleList = (e: MouseEvent): void => {
  // Prevent input field from blurring
  e.preventDefault()
  e.stopPropagation()

  isListVisible.value = !isListVisible.value

  if (isListVisible.value) {
    inputElement.value?.$refs?.input?.focus()
  }
}

/**
 * Get formatted options that can be toggled by select all or select group
 */
const getValidGroupOptions = (options: SmMultiSelectItem[]): {
  validGroupOptions: SmMultiSelectItem[]
  isGroupSelected: boolean
} => {
  let isGroupSelected = true

  const validGroupOptions = options
    .filter(option => !option.disabled)
    .map((option) => {
      // Check if all items are already selected
      if (isGroupSelected && option.code && !selectedCodes.value.includes(option.code)) {
        isGroupSelected = false
      }

      return {
        code: option.code,
        label: option.label,
        description: option.description,
        groupLabel: option.groupLabel,
      }
    })

  return { validGroupOptions, isGroupSelected }
}

/**
 * Check if text and search query matches
 */
const isTextMatch = (text: string, query?: string): boolean => {
  const textString = text.toString().toLowerCase()
  const queryString = query === undefined
    ? ''
    : query.toLowerCase().trim()

  return textString.includes(queryString)
}

/**
 * Filter options by search query using the option labels
 */
const filterOptions = (options: SmMultiSelectOption[], search?: string): SmMultiSelectOption[] => {
  return options.filter(option => option.label && isTextMatch(option.label, search))
}

/**
 * Filter groups with libs matching the search query
 */
const filterGroups = (groupOption: SmMultiSelectGroupOption, search: string): SmMultiSelectGroupOption | undefined => {
  const groupOptions: SmMultiSelectOption[] = groupOption.libs ? filterOptions(groupOption.libs, search) : []

  return groupOptions.length ? {
    libs: groupOptions,
    title: groupOption.title,
  } : undefined
}

/**
 * Filter options and add select all if needed
 */
const filterStandardOptions = (options: SmMultiSelectOption[], search: string): SmMultiSelectItem[] => {
  const filtered = filterOptions(options, search)
  const groupSelectAll: SmMultiSelectItem[] = []

  if (props.multiple && filtered.length) {
    const { validGroupOptions, isGroupSelected } = getValidGroupOptions(filtered)

    if (props.showSelectAllOption && validGroupOptions.length > 1) {
      // Add select all
      groupSelectAll.push({
        isSelectAll: true,
        isGroupSelected,
        validGroupOptions,
      })
    }
  }

  return groupSelectAll.concat(filtered)
}

/**
 * Flatten the grouped options into a list of items including
 * group title and select group option if needed
 */
const filterAndFlattenGroupedOptions = (groups: SmMultiSelectGroupOption[], search: string): SmMultiSelectItem[] => {
  return groups
    .map(group => filterGroups(group, search))
    .filter(group => group !== undefined)
    .reduce((list: SmMultiSelectItem[], current) => {
      if (current?.libs && current.libs.length) {
        // Add title per group
        list.push({ isTitle: true, title: current.title })

        const options = current.libs.map(option => ({
          ...option,
          groupLabel: current.title,
        }))

        if (props.multiple) {
          const { validGroupOptions, isGroupSelected } = getValidGroupOptions(options)

          if (props.showSelectGroupOption && validGroupOptions.length > 1) {
            // Add select group
            list.push({
              groupLabel: current.title,
              isGroupSelect: true,
              isGroupSelected,
              validGroupOptions,
            })
          }
        }

        list.push(...options)
      }

      return list
    }, [])
}

/**
 * Handle select option or select all/group
 */
const select = (selectedOption: SmMultiSelectItem): void => {
  if (selectedOption.disabled) {
    return
  }

  if (selectedOption.isGroupSelect || selectedOption.isSelectAll) {
    toggleSelectAll(selectedOption)
  } else {
    toggleSelectedOption(selectedOption)
  }

  closeOnClick()
}

/**
 * Set the input field's value
 */
const setInputDisplay = (): void => {
  const selected = modelValue.value

  // Remove text if the input field is active to allow user to search
  if (
    (isListVisible.value && props.filterable)
    || !selected
    || (Array.isArray(selected) && selected.length === 0)
  ) {
    searchQuery.value = ''

    return
  }

  // Use first selected option's label as display then add counter for other selections
  if (Array.isArray(selected)) {
    searchQuery.value = selected.length === 1
      ? selected[0].label && `${selected[0]?.label}`
      : selected[0].label && `${selected[0].label} (+${selected.length - 1})`

    return
  }

  // Use selected option's label
  searchQuery.value = selected.label ? selected.label : ''
}

/**
 * Select or deselect all options or options under a group
 */
const toggleSelectAll = (selectedOption: SmMultiSelectItem): void => {
  const { isGroupSelected, validGroupOptions } = selectedOption
  let currentSelections: SmMultiSelectOption[]

  if (!modelValue.value) {
    currentSelections = []
  } else if (Array.isArray(modelValue.value)) {
    currentSelections = modelValue.value
  } else {
    currentSelections = [modelValue.value]
  }

  if (validGroupOptions?.length === 0) {
    return
  }

  // Deselect items if everything is already selected
  if (isGroupSelected) {
    const validCodes = validGroupOptions?.map(option => option.code)

    // Remove items from the group
    const newSelection = currentSelections
      .filter(option => !validCodes?.includes(option.code))

    // Add back one item if empty selection is not allowed
    if (!props.allowEmpty && newSelection.length === 0 && validGroupOptions) {
      const validOption = validGroupOptions[0]
      newSelection.push({
        code: validOption.code ?? '',
        label: validOption.label ?? '',
      })
    }

    emit('update:modelValue', newSelection)

    return
  }

  // Select all items
  const validOptions = validGroupOptions?.map(option => ({
    code: option.code ?? '',
    label: option.label ?? '',
  })) ?? []
  const newSelection = Array.from(new Set(currentSelections.concat(validOptions)))

  emit('update:modelValue', newSelection)
}

/**
 * Select or deselect an option
 */
const toggleSelectedOption = (selectedOption: SmMultiSelectItem): void => {
  let currentSelection: SmMultiSelectOption[] = []
  let newSelection: SmMultiSelectOption | SmMultiSelectOption[] | null = null

  if (modelValue.value && Array.isArray(modelValue.value)) {
    currentSelection = modelValue.value
  } else if (modelValue.value) {
    currentSelection = [modelValue.value]
  }

  const option: SmMultiSelectOption = {
    code: selectedOption.code ?? '',
    label: selectedOption.label ?? '',
    description: selectedOption.description,
  }

  const isAlreadySelected = selectedOption.isSelected

  // Deselect item
  if (isAlreadySelected && (props.allowEmpty || currentSelection.length > 1)) {
    if (props.multiple) {
      newSelection = currentSelection.filter(item => item.code !== selectedOption.code)
    } else {
      emit('update:modelValue', null)
    }
  }

  // Select item
  if (!isAlreadySelected) {
    newSelection = props.multiple
      ? currentSelection.concat(option)
      : option
  }

  if (newSelection) {
    emit('update:modelValue', newSelection)
  }
}

/**
 * Determine if an item is a group label/title
 */
const isOptionTitle = (index: number): boolean => {
  return filteredOptions.value[index]?.isTitle ?? false
}

/**
 * Find first non-title item, including disabled option
 * so list can still be scrolled and navigated
 */
const navigateFirstOption = (): void => {
  if (isOptionTitle(highlightedIndex.value)) {
    highlightedIndex.value += 1
    navigateFirstOption()
  }
}

/**
 * Find last non-title item, including disabled option
 * so list can still be scrolled and navigated
 */
const navigateLastOption = (): void => {
  if (isOptionTitle(highlightedIndex.value)) {
    highlightedIndex.value -= 1
    navigateLastOption()
  }
}

/**
 * Find previous or next non-title item
 */
const navigateNextOption = (step: number): void => {
  if (
    filteredOptions.value.length === 0
    || (highlightedIndex.value <= 0 && step < 0) // Start of list
    || (highlightedIndex.value >= filteredOptions.value.length - 1 && step > 0) // End of list
    || (highlightedIndex.value === 1 && isOptionTitle(0) && step < 0)
  ) {
    return
  }

  highlightedIndex.value += step

  if (isOptionTitle(highlightedIndex.value)) {
    navigateNextOption(step)
  }
}

/**
 * Find and highlight first option from the list, e.g when home key is pressed
 */
const highlightFirstOption = (initialLoad = false): void => {
  hasKeyboardFocus.value = !initialLoad
  highlightedIndex.value = 0

  navigateFirstOption()
}

/**
 * Find and highlight last option from the list, e.g when end key is pressed
 */
const highlightLastOption = (): void => {
  hasKeyboardFocus.value = true
  highlightedIndex.value = (filteredOptions.value.length) - 1

  navigateLastOption()
}

/**
 * Find and highlight previous option, e.g when up key is pressed
 */
const highlightPrevOption = (): void => {
  hasKeyboardFocus.value = true

  navigateNextOption(-1)
}

/**
 * Find and highlight next option, e.g when down key is pressed
 */
const highlightNextOption = (): void => {
  hasKeyboardFocus.value = true

  navigateNextOption(1)
}

/**
 * Highlight option pointed by the mouse
 */
const highlightPointerOption = (index: number): void => {
  // Remove keyboard focus styles if pointer is used
  hasKeyboardFocus.value = false
  highlightedIndex.value = index
}

/**
 * Scrolls the list so the focused item is visible when navigating via keyboard
 */
const scrollOptionIntoView = (block: ScrollLogicalPosition = 'nearest'): void => {
  const itemElements = listItemElements.value

  if (itemElements) {
    itemElements[highlightedIndex.value]?.scrollIntoView({ block })
  }
}

/**
 * Select highlighted option, e.g when enter key is pressed
 */
const selectHighlightedOption = (): void => {
  if (filteredOptions.value.length && filteredOptions.value[highlightedIndex.value]) {
    select(filteredOptions.value[highlightedIndex.value])
  }
}

/**
 * Override sm-input's built-in focus on click because it interferes with the
 * toggle functionality wherein the input field is blurred first and then
 * focused again
 */
const inputIconEvents = {
  click: () => {},
  mousedown: toggleList,
}

/**
 * Add toggle functionality to the input field when it can't be focused to let users type
 */
const inputFieldEvents = {
  mousedown: !props.filterable ? toggleList : () => {},
}

/**
 * Popover focus can happen if element within it is tabbed into
 */
const handlePopoverFooterFocusIn = (): void => {
  // To remove focus indicator in the popover item
  hasKeyboardFocus.value = false
}

onUpdated(async () => {
  if (popper.value) {
    await popper.value.update()
  }
})

onMounted(() => {
  highlightFirstOption(true)
})

onBeforeUnmount(() => {
  if (popper.value) {
    popper.value.destroy()
    popper.value = null
  }
})

watch(
  () => highlightedIndex.value,
  () => {
    if (hasKeyboardFocus.value) {
      scrollOptionIntoView()
    }
  },
)

watch(
  () => modelValue.value,
  () => {
    if (!(isListVisible.value && props.filterable)) {
      setInputDisplay()
    }
  },
  { immediate: true },
)

watch(
  () => isListVisible.value,
  () => {
    setInputDisplay()

    if (!isListVisible.value) {
      hasKeyboardFocus.value = false
      inputElement.value?.$refs?.input?.blur()
      emit('close')
    }

    if (isListVisible.value) {
      highlightFirstOption(true)
      emit('open')
    }
  },
)

watch(
  () => searchQuery.value,
  () => {
    // Re-focus to first option, previous highlight index
    // may not be available after filtering the list
    if (hasKeyboardFocus.value) {
      highlightFirstOption(true)
    }
  },
)

defineExpose({
  closeList,
  openList,
})
</script>

<template>
  <div
    role="combobox"
    aria-haspopup="listbox"
    :aria-controls="isListVisible ? (listElementId || undefined) : undefined"
    :aria-errormessage="errorMessageValue || undefined"
    :aria-expanded="isListVisible ? 'true' : 'false'"
    :aria-invalid="!validationState?.valid"
    :aria-labelledby="!labelHidden ? (labelElementId || undefined) : undefined"
    :aria-label="labelHidden ? label : undefined"
    :aria-required="validationState?.required"
    :class="{
      'sm-multi-select': true,
      'sm-multi-select--filterable': filterable,
      'sm-multi-select--disabled': isFormDisabled || disabled,
      'sm-multi-select--opened': isListVisible,
      'sm-field--dirty': validationState && validationState.dirty,
      'sm-field--invalid': validationState && (validationState.validated || validationState.touched) && !validationState.valid,
      'sm-field--touched': validationState && validationState.touched,
      'sm-field--valid': validationState && (validationState.dirty && validationState.valid),
      'sm-field--validated': validationState && validationState.validated,
    }"
    @keydown.esc.prevent="listEscaped()"
  >
    <div class="sm-multi-select__header">
      <sm-field-label
        v-if="!labelHidden"
        :id="labelElementId"
        :for="inputElementId"
        :focussed="isListVisible"
        :required="validationState?.required"
        :state="validationState"
      >
        <!-- @slot The field label. Overrides the label prop -->
        <slot name="label">
          {{ label }}
        </slot>
      </sm-field-label>

      <span
        v-if="$slots.action"
        class="sm-multi-select__action"
      >
        <!-- @slot The field action next to the label. For example an icon -->
        <slot name="action" />
      </span>
    </div>

    <sm-input
      :id="inputElementId || undefined"
      ref="inputElement"
      v-model="searchQuery"
      auto-complete="off"
      suffix-icon="arrow"
      :type="SmInputType.TEXT"
      :aria-controls="isListVisible ? listElementId : null"
      :aria-activedescendant="isListVisible ? `${elementId}-item-${highlightedIndex}` : null"
      :disabled="isFormDisabled || disabled"
      :error-disabled="true"
      :label="label"
      :label-hidden="true"
      :name="name"
      :placeholder="placeholder"
      :readonly="filterable ? undefined : 'readonly'"
      :event-binding="inputFieldEvents"
      :icon-event-binding="isFormDisabled || disabled ? undefined : inputIconEvents"
      :validation-options="{ syncVModel: false }"
      @focus.prevent="listOpened"
      @blur.prevent="(e) => {
        listClosed(e)
        $emit('blur')
      }"
      @keypress.enter.prevent.stop="selectHighlightedOption()"
      @keydown.down.prevent="highlightNextOption()"
      @keydown.up.prevent="highlightPrevOption()"
      @keydown.end.prevent="highlightLastOption()"
      @keydown.home.prevent="highlightFirstOption()"
      v-on="eventBindings"
    >
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
    </sm-input>

    <div
      v-if="!errorDisabled"
      class="sm-multi-select__footer"
    >
      <sm-field-error
        :errors="validationState?.errors || []"
        v-bind="{
          ariaMsg: {
            'aria-live': validationState?.errors?.length ? 'assertive' : 'off',
            id: errorMessageId,
          }
        }"
      />
    </div>

    <div
      v-show="isListVisible"
      ref="popoverElement"
      class="sm-multi-select__popover"
      tabindex="-1"
      @mousedown.prevent
    >
      <div
        v-if="isListVisible"
        tabindex="-1"
        :class="[
          {
            'sm-multi-select__content-wrapper': true,
            'sm-multi-select__content-wrapper--has-footer': $slots.footer
          },
          contentClass
        ]"
      >
        <ul
          :id="listElementId || undefined"
          class="sm-multi-select__list"
          role="listbox"
          tabindex="-1"
          :aria-labelledby="inputElementId || undefined"
          :aria-multiselectable="multiple ? 'true' : 'false'"
        >
          <li
            v-for="(option, index) in filteredOptions"
            :id="elementId + '-item-' + index"
            :key="index"
            ref="listItemElements"
            :class="{
              'sm-multi-select__item': true,
              'sm-multi-select__item--header': option.isTitle,
            }"
            :role="option.isTitle ? 'none' : 'option'"
            :aria-hidden="option.isTitle"
            :aria-selected="option.ariaSelected || 'false'"
            :aria-disabled="option.ariaDisabled"
            :aria-description="option.ariaDescription"
            @click="select(option)"
          >
            <div
              v-if="option.isTitle"
              class="sm-h6 sm-multi-select__option-header sm-section-heading"
              @click.stop
            >
              <span class="sm-multi-select__option-header__content">{{ option.title }}</span>
            </div>

            <div
              v-else
              :class="{
                'sm-multi-select__option': true,
                'sm-multi-select__option--selected': option.isSelected || option.isGroupSelected,
                'sm-multi-select__option--disabled': option.disabled,
                'sm-multi-select__option--highlighted': highlightedIndex === index,
                'sm-multi-select__option--keyboard-focused': hasKeyboardFocus,
              }"
              @mouseenter.self="highlightPointerOption(index)"
            >
              <sm-multi-select-checkbox
                v-if="multiple"
                class="sm-multi-select__option-checkbox"
                :checked="option.isGroupSelect || option.isSelectAll ? option.isGroupSelected : option.isSelected"
                :disabled="option.disabled"
              />
              <div class="sm-multi-select__option-content">
                <span
                  :class="{
                    'sm-multi-select__option-label': true,
                    'sm-multi-select__option-label--truncated': truncateOptionLabel
                  }"
                  :title="truncateOptionLabel ? option.label : undefined"
                >
                  <template v-if="option.isGroupSelect">
                    {{ i18n.t('sui-core.components.forms.sm-multi-select.sm-multi-select.select-group-options') }}
                  </template>
                  <template v-else-if="option.isSelectAll">
                    {{ i18n.t('sui-core.components.forms.sm-multi-select.sm-multi-select.select-all-options') }}
                  </template>
                  <template v-else>
                    {{ option.label }}
                  </template>
                </span>
                <span
                  v-if="option.description"
                  :class="{
                    'sm-multi-select__option-description sm-text--small': true,
                    'sm-multi-select__option-description--truncated': truncateOptionDescription
                  }"
                  :title="truncateOptionDescription ? option.description : undefined"
                >
                  {{ option.description }}
                </span>
              </div>
            </div>
          </li>

          <li
            v-if="filteredOptions.length === 0 && !searchQuery"
            class="sm-multi-select__item"
          >
            <p class="sm-multi-select__text">
              {{ i18n.t('sui-core.components.forms.sm-multi-select.sm-multi-select.empty-options') }}
            </p>
          </li>

          <li
            v-if="filteredOptions.length === 0 && !!searchQuery"
            class="sm-multi-select__item"
          >
            <p class="sm-multi-select__text">
              {{ i18n.t('sui-core.components.forms.sm-multi-select.sm-multi-select.option-not-found', { searchQuery }) }}
            </p>
          </li>
        </ul>

        <div
          v-if="$slots.footer"
          :class="[
            { 'sm-multi-select__popover__footer': true },
            footerClass
          ]"
          @focusin="handlePopoverFooterFocusIn"
          @focusout="listClosed"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "../../../common/variables";
@import "../../../common/mixins";

:root {
  /* Port over selected tokens from sui-themes and co-locate them here */

  /* Input */
  --sm-c-multi-select-color-icon: #333;
  --sm-c-multi-select-color-icon-disabled: #9a9a9a;

  /* Dropdown */
  --sm-c-multi-select-dropdown-color-background: #fff;
  --sm-c-multi-select-dropdown-color-text: #333;
  --sm-c-multi-select-dropdown-border: 1px solid #c6ceda;
  --sm-c-multi-select-dropdown-border-radius: 4px;
  --sm-c-multi-select-dropdown-box-shadow: 0px 5px 11px -5px rgba(24, 58, 108, 0.15), 0px 6px 9px -5px rgba(24, 58, 108, 0.14), 0px 1px 1px -1px rgba(24, 58, 108, 0.14);

  /* Dropdown - Option group */
  --sm-c-multi-select-dropdown-group-color-text: #717171;
  --sm-c-multi-select-dropdown-group-border-top: 1px solid #c6d0e0;

  /* Dropdown - Option */
  --sm-c-multi-select-dropdown-option-color-text: #333;
  --sm-c-multi-select-dropdown-option-description-color-text: #717171;
  --sm-c-multi-select-dropdown-option-color-background-hover: #e6ebf2;
  --sm-c-multi-select-dropdown-option-box-shadow-focus: inset 0 0 0px 2px #333;
  --sm-c-multi-select-dropdown-option-color-background-selected: #e6ebf2;
  --sm-c-multi-select-dropdown-option-color-border-left-selected: #006add;
  --sm-c-multi-select-dropdown-option-color-text-disabled: #9a9a9a;
  --sm-c-multi-select-dropdown-option-description-color-text-disabled: #9a9a9a;
  --sm-c-multi-select-dropdown-option-color-background-disabled: #f6f6f6;
  --sm-c-multi-select-dropdown-option-color-border-left-selected-disabled: #c1c1c1;

  /* Dropdown - footer */
  --sm-c-multi-select-dropdown-footer-color-background: #fff;
  --sm-c-multi-select-dropdown-footer-border-top: 1px solid #c6ceda;
}

.sm-multi-select {
  position: relative;

  &__header {
    display: flex;
    position: relative;
  }

  &__action {
    margin-right: auto;

    @include padding($left: rem($sm-xxsm), $top: rem($sm-xxsm));
  }

  &__footer {
    min-height: 32px;
  }

  &:focus {
    box-shadow: none;
    outline: 0;
  }

  /** Toggle icon */
  .sm-input__suffix-icon {
    color: var(--sm-c-multi-select-color-icon);
    cursor: pointer;

    .sm-icon {
      transform: rotate(0);
      transition: transform 0.3s;
    }
  }

  &--disabled .sm-input__suffix-icon {
    color: var(--sm-c-multi-select-color-icon-disabled);
    cursor: unset;
  }

  &__option--selected.sm-multi-select__option--disabled {
    border-left-color: var(--sm-c-multi-select-dropdown-option-color-border-left-selected-disabled);
  }

  /* Dropdown opened state */
  &--opened .sm-input__suffix-icon {
    .sm-icon {
      transform: rotate(-180deg);
    }
  }

  &:not(.sm-multi-select--filterable):not(.sm-multi-select--disabled) {
    .sm-input__field,
    .sm-input__suffix-icon {
      cursor: pointer;
    }
  }

  &__popover {
    width: 100%;
    z-index: $sm-multi-select-z-index;
    user-select: none;
  }

  &__content-wrapper {
    background: var(--sm-c-multi-select-dropdown-color-background);
    border: var(--sm-c-multi-select-dropdown-border);
    border-radius: var(--sm-c-multi-select-dropdown-border-radius);
    box-shadow: var(--sm-c-multi-select-dropdown-box-shadow);
    box-sizing: border-box;
    color: var(--sm-c-multi-select-dropdown-color-text);
    display: flex;
    flex-direction: column;
    isolation: isolate;
    max-height: 300px;
    overflow: hidden;
    padding: 0;
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px $grey-neu-mid;
      border-radius: 4px 0;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: $blue-neu-dark;
      border-radius: 8px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: $grey-neu-dark;
    }
  }

  &__content-wrapper--has-footer .sm-multi-select__list {
    padding-bottom: 2px;

    &::-webkit-scrollbar-track {
      border-bottom-left-radius: 4px;
    }
  }

  &__item {
    display: block;
  }

  &__item + &__item {
    margin-top: 2px;
  }

  .sm-multi-select__option-header {
    display: block;
    color: var(--sm-c-multi-select-dropdown-group-color-text);
    padding: 0 $sm-16 15px $sm-12;
    margin: 0;

    &__content {
      border-top: var(--sm-c-multi-select-dropdown-group-border-top);
      display: block;
      padding-top: 15px;
    }
  }

  &__item--header:first-of-type {
    .sm-multi-select__option-header {
      &__content {
        border-top: 0;
      }
    }
  }

  &__option {
    border-left: 3px solid transparent;
    color: var(--sm-c-multi-select-dropdown-option-color-text);
    cursor: pointer;
    display: flex;
    padding: 13px $sm-16 13px 9px;
    position: relative;
    transition: border-color 0.3s ease;
  }

  &__option-checkbox {
    flex-shrink: 0;
  }

  &__option-content {
    min-width: 0;
    flex: 1;
  }

  &__option-description {
    color: var(--sm-c-multi-select-dropdown-option-description-color-text);
  }

  &__option-description,
  &__option-label {
    display: block;

    &--truncated {
      word-break: break-word;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__popover__footer {
    background-color: var(--sm-c-multi-select-dropdown-footer-color-background);
    border-top: var(--sm-c-multi-select-dropdown-footer-border-top);
    display: flex;
    justify-content: flex-end;
    padding: $sm-16 $sm-12 $sm-12 $sm-12;

    .sm-button + .sm-button {
      margin-left: $sm-8;
    }
  }

  /** Query not found and list is empty */
  &__text {
    padding: 13px $sm-16;
    margin: 0;
  }

  /* Highlighted state */
  &__option--highlighted {
    background-color: var(--sm-c-multi-select-dropdown-option-color-background-hover);

    &.sm-multi-select__option--keyboard-focused::before {
      box-shadow: var(--sm-c-multi-select-dropdown-option-box-shadow-focus);
      content: '';
      position: absolute;
      inset: 0 0 0 -3px;
    }
  }

  /* Selected state */
  &__option--selected {
    background-color: var(--sm-c-multi-select-dropdown-option-color-background-selected);
    border-left-color: var(--sm-c-multi-select-dropdown-option-color-border-left-selected);
  }

  /* Disabled state */
  &__option--disabled,
  &__option--disabled:hover {
    background: var(--sm-c-multi-select-dropdown-option-color-background-disabled);
    color: var(--sm-c-multi-select-dropdown-option-color-text-disabled);
    cursor: not-allowed;

    .sm-multi-select__option-description {
      color: var(--sm-c-multi-select-dropdown-option-description-color-text-disabled);
    }
  }

  &--opened &__placeholder-value {
    display: none;
  }

  &--opened .sm-multi-select__content-wrapper {
    animation: popoverFadeIn 0.3s;
  }

  &--opened.sm-field--invalid .sm-input__field,
  &--opened.sm-field--invalid .sm-input__prefix-icon,
  &--opened.sm-field--invalid .sm-input__suffix-icon {
    box-shadow: inset 0 -1px 0 0 $app-warning;
  }

  .sm-input__prefix-slot .sm-multi-select-prefix-content,
  .sm-input__suffix-slot .sm-multi-select-suffix-content {
    padding: $sm-8 $sm-12;
  }

  @keyframes popoverFadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
}
</style>
