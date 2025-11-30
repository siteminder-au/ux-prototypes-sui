<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, inject } from 'vue'
import { useField } from 'vee-validate'
import { Multiselect as VMultiselect } from 'vue-multiselect'
import { useUniqueId } from '../../use/unique-id'
import SmTag from '../../sm-tag/sm-tag.vue'

import SmFieldLabel from '../shared/sm-field-label.vue'
import SmFieldError from '../shared/sm-field-error.vue'

import { useIsFieldRequired } from '../shared/use-is-field-required'
import { FormProviderKey } from '../sm-form/symbols'
import { useI18n } from '../../../libs/vue-i18n'
import { SmTagSize } from '../../sm-tag/sm-tag.types'
import { SmSelectOption, SmSelectOptionLibs, SmSelectModelValue } from './sm-select.types'
import iconArrowUp from './icons/arrow-up'

const props = withDefaults(defineProps<{
  /**
   * The initial selected value(s).
   * Two-way binding sample usage: <sm-select v-model:selection="mySelection" ... />
   */
  selection?: SmSelectModelValue
  /**
   * Array of available options. E.g [{ "label": "Strawberry", "code": "strawberry" }, { "label": "Grapes", "code": "grapes" }]
   */
  options?: SmSelectOption[]
  /**
   * The field's label. Can be overridden by the label slot
   */
  label?: string
  /**
   * Hides the label visually but still keeps it accessible to screen readers
   */
  labelHidden?: boolean
  /**
   * The vee-validate rules - see: https://vee-validate.logaretm.com/v4/guide/components/validation
   */
  rules?: string | Record<string, unknown>
  /**
   * Whether the field can be deselected
   */
  allowEmpty?: boolean
  /**
   * Whether the field supports multiple selections
   */
  multiple?: boolean
  /**
   * The maximum selections allowed for a multiple select. No limit set when not defined
   */
  multipleLimit?: number
  /**
   * Whether to collapse the tags to a counter after selecting multiple
   */
  collapseTags?: boolean
  /**
   * Set the limit to number of tags will collapse to a counter after selecting multiple
   */
  collapseTagsLimit?: number | string
  /**
   * Whether the options can be filtered by searching
   */
  filterable?: boolean
  /**
   * Whether the field is enabled or not
   */
  disabled?: boolean
  /**
   * The placeholder text for the input field
   */
  placeholder?: string
  /**
   * Disable the error text
   */
  errorDisabled?: boolean
  /**
   * Allows the creation of new items
   */
  allowCreate?: boolean
  /**
   * Whether the options list is loading data from the server
   */
  loading?: boolean
  /**
   * WIP - The text displayed when the remoteMethod is invoked
   * @wip
   */
  loadingText?: string
  /**
   * WIP - The text displayed when no data matches the filtering query
   * @wip
   */
  noMatchText?: string
  /**
   * Native name attribute.
   * Mandatory to ensure that vee-validate works correctly
   */
  name: string
  /**
   * Whether to display option groups
   */
  showGroupSelect?: boolean
  /**
   * Whether selecting the group label should select/unselect all values in the group, or do nothing.
   */
  groupSelect?: boolean
  /**
   * When searching data from server, the v-model will not be compared against the options props
   * since already selected items might not be loaded in the options
   */
  remote?: boolean
  /**
   * Decide whether to filter the results internally based on search query. Useful for async filtering.
   */
  internalSearch?: boolean
  /**
   * Whether to clear the search input after select. Use when multiple is true.
   */
  clearOnSelect?: boolean
  /**
   * Vue3 has breaking changes around the $listeners, and event listeners are now just attributes and prefixed with "on" see here: https://v3-migration.vuejs.org/breaking-changes/listeners-removed.html
   * To access the current event listener "list-scroll-end' emit event use "onList-scroll-end" props.
   */
  onListScrollEnd?: () => void
}>(), {
  selection: undefined,
  options: () => [],
  label: '',
  labelHidden: false,
  rules: undefined,
  allowEmpty: true,
  multiple: false,
  multipleLimit: undefined,
  collapseTags: false,
  collapseTagsLimit: 2,
  filterable: true,
  disabled: false,
  placeholder: '',
  errorDisabled: false,
  allowCreate: false,
  loading: false,
  loadingText: '',
  noMatchText: '',
  showGroupSelect: false,
  groupSelect: undefined,
  remote: false,
  internalSearch: true,
  clearOnSelect: true,
  onListScrollEnd: undefined,
})

const emit = defineEmits<{
  /**
   * Emits when the v-model is updated
   */
  change: [value: unknown]
  /**
   * Emits when close
   */
  close: []
  /**
   * Emits when scroll end
   */
  'list-scroll-end': []
  /**
   * Emits when open
   */
  open: []
  /**
   * Emits when search updated
   */
  'search-change': [value: unknown]
  /**
   * Emits when selected
   */
  select: [value: unknown]
  /**
   * Emits when tag added
   */
  'tag-added': [value: string]
  /**
   * Emits when the v-model is updated
   * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
   */
  'update:modelValue': [value: SmSelectModelValue]
  /**
   * Emits when the selection is updated
   */
  'update:selection': [value: SmSelectModelValue]
}>()

const { i18n } = useI18n()

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
})

/**
 * v-model for `modelValue` prop
 * Emits 'update:modelValue': [value: SmSelectModelValue] when this ref changes
 * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
 */
const modelValue = defineModel<SmSelectModelValue>({
  default: undefined,
})

const inputValue = computed<SmSelectOption | SmSelectOption[] | SmSelectModelValue>({
  get: () => {
    if (props.remote) {
      // Return as is if it's a remote data since we don't know the shape
      return modelValue.value ?? props.selection
    }

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

    // Don't check against props.options to get the codes
    if (props.remote) {
      // see: https://v3-migration.vuejs.org/breaking-changes/v-model.html
      // This will emit 'update:modelValue' internally by vue
      modelValue.value = state
      emit('update:selection', state)

      return
    }

    if (Array.isArray(state)) {
      const selectedValues = state.map(eachState => eachState.code)
      let selectedOptions

      if (props.options.length !== 0) {
        selectedOptions = props.options.filter(option => selectedValues.includes(option.code)).map(option => option.code)

        if (selectedOptions.length === 0 && props.showGroupSelect) {
          const setOptionGroup = props.options.filter(option => option.libs?.find(item => selectedValues.includes(item.code)))

          if (setOptionGroup.length !== 0) {
            // Get selected options per group and flatten the array of objects
            const set = setOptionGroup.reduce((items: SmSelectOptionLibs[], option) => {
              const groupItem = option.libs?.filter(item => selectedValues.includes(item.code))

              return groupItem ? items.concat(groupItem) : items
            }, [])

            selectedOptions = set.map(p => p.code)
          }
        }
      }

      // see: https://v3-migration.vuejs.org/breaking-changes/v-model.html
      modelValue.value = selectedOptions // Default v-model
      emit('update:selection', selectedOptions)
    } else {
      const selectedValue = state && typeof state === 'object' && 'code' in state ? state.code : null
      let selectedOption

      selectedOption = props.options.find(option => selectedValue === option.code)

      if (!selectedOption && props.showGroupSelect) {
        const setOptionGroup = props.options.find(option => option.libs?.find(item => selectedValue === item.code))

        if (setOptionGroup) {
          selectedOption = setOptionGroup.libs?.find(option => selectedValue === option.code)
        }
      }

      // see: https://v3-migration.vuejs.org/breaking-changes/v-model.html
      modelValue.value = selectedOption ? selectedOption.code : null // Default v-model
      emit('update:selection', selectedOption ? selectedOption.code : null)
    }
  },
})

// see https://vee-validate.logaretm.com/v4/guide/composition-api/caveats/
// for some caveats when using useField
const computedRules = computed(() => props.rules)
const { meta, errors, validate } = useField(() => props.name, computedRules, { syncVModel: true })
const { required } = useIsFieldRequired(computedRules)

const isListVisible = ref(false)

const { id: labelElementId } = useUniqueId('sm-select__label_')
const { id: inputElementId } = useUniqueId('sm-select__input_')

// data provided by sm-form
const formProvider = inject(FormProviderKey, { disabled: ref(false) })
const isFormDisabled = computed(() => formProvider.disabled.value)

const multiselect = ref() // multiselect plugin
const multiselectListEl = computed(() => multiselect.value?.$refs.list)

/**
 * Assumes a minimum height for each option for the keyboard navigation
 */
const optionHeight = computed(() => {
  const hasDescription = props.options.some((option) => {
    if (option.libs) {
      return option.libs.some((childOption) => {
        return !!childOption.description
      })
    }

    return !!option.description
  })

  return hasDescription ? 72 : 50
})

const tagLimit = (): string | number | undefined => {
  if (props.collapseTags) {
    return props.collapseTagsLimit
  }
}

/**
 * Handle event from v-multiselect component
 * See https://vue-multiselect.js.org/#sub-events
 */
const select = (selectedOption: unknown): void => {
  emit('select', selectedOption)
}

/**
 * Handle event from v-multiselect component
 * See https://vue-multiselect.js.org/#sub-events
 */
const searchChange = (query: unknown): void => {
  emit('search-change', query)
}

const eventBindings = ref()

const selectEvent = {
  select,
  searchChange,
}

eventBindings.value = selectEvent

const getOptionByCode = (selections: any, item: SmSelectOptionLibs): boolean => {
  return Array.isArray(selections) ? selections.includes(item.code) : selections === item.code
}

const getSelectedOptions = (selections: any): SmSelectOption | SmSelectOption[] | undefined => {
  if (props.multiple && !props.showGroupSelect) {
    return props.options.filter(option => selections.includes(option.code))
  }

  if (props.showGroupSelect) {
    // Get group(s) with selection
    const getOption = props.options.filter(option => option.libs?.find(p => getOptionByCode(selections, p)))

    if (getOption) {
      // Get selected options per group and flatten the array of objects
      const set = getOption.reduce((items: SmSelectOptionLibs[], option) => {
        const groupItem = option.libs?.filter(item => getOptionByCode(selections, item))

        return groupItem ? items.concat(groupItem) : items
      }, [])

      return set
    }
  }

  return props.options.find(option => selections === option.code)
}

const listOpened = (): void => {
  isListVisible.value = true
}

const listClosed = async (): Promise<void> => {
  isListVisible.value = false
  await validate()
}

const closeOnClick = (): boolean => {
  if (props.multiple) {
    return false
  }
  return true
}

const isAddedTag = (option: any): boolean => {
  if (option.isTag === true) {
    return true
  }
  return false
}

const tagAdded = (newTag: string): void => {
  /**
   * @event 'tag-added' triggers when a tag is added in multiple mode
   * @param any added tag value
   */
  emit('tag-added', newTag)
}

// Emit open / close events
watch(
  () => isListVisible.value,
  () => {
    if (isListVisible.value) {
      emit('open')
    } else {
      emit('close')
    }
  },
)

let lastScrollHeight: number

const handleListScrollEnd = (): void => {
  const currentScrollHeight = multiselectListEl.value.scrollHeight
  const currentScrollPosition = multiselectListEl.value.scrollTop + multiselectListEl.value.clientHeight

  // Check if the bottom of the list has been reached
  if (currentScrollPosition === currentScrollHeight) {
    // Safari fires the event multiple times depending on how hard you scroll
    // This limits event fired to one
    if (lastScrollHeight !== currentScrollHeight) {
      emit('list-scroll-end')
    }

    lastScrollHeight = currentScrollHeight
  }

  // Alternatively, check if the pointer is on the last available option
  // Sometimes the scroll position doesn't reach the edge of the list element's height
  // e.g when navigating options via keyboard and there are group titles, long labels, description, etc.
  if (currentScrollPosition < currentScrollHeight) {
    const pointerIndex = multiselect.value.pointer
    const optionsLength = multiselect.value.filteredOptions.length

    if (pointerIndex === optionsLength - 1) {
      emit('list-scroll-end')
    }
  }
}

onMounted(() => {
  // Attach event handler if needed
  // In Vue 3, $attrs is a catch-all bag of everything that was set on component that isn't declared/known.
  // As soon as you declare emit event within "defineEmits", useAttrs() is not going work.
  // Instead, use onListScrollEnd (prefixed with "on") props to access the event listener 'list-scroll-end'.
  if (multiselectListEl.value && props.onListScrollEnd) {
    multiselectListEl.value.addEventListener('scroll', handleListScrollEnd)
  }
})

onUnmounted(() => {
  if (multiselectListEl.value && props.onListScrollEnd) {
    multiselectListEl.value.removeEventListener('scroll', handleListScrollEnd)
  }
})

defineExpose ({
  inputElementId,
  inputValue,
  labelElementId,
  eventBindings,
  tagAdded,
  tagLimit,
  listOpened,
  listClosed,
  isListVisible,
  closeOnClick,
  isAddedTag,
  isFormDisabled,
  optionHeight,
  multiselect,
  // expose a `validate` function in case downstream projects
  // have internally accessed it via template refs
  validate,
})
</script>

<template>
  <span
    class="sm-select-container"
  >
    <sm-field-label
      v-if="!labelHidden"
      :id="labelElementId"
      :for="inputElementId"
      :required="required"
      :focussed="isListVisible"
      :state="meta"
    >
      <!-- @slot The field label. Overrides the label prop. -->
      <slot name="label">
        {{ label }}
      </slot>
    </sm-field-label>
    <span
      v-if="$slots.action"
      class="sm-select__action"
    >
      <!-- @slot The field action next to the label. Example usage: adding a helper icon to provide more context on the field. -->
      <slot name="action" />
    </span>
    <div
      class="sm-select"
      :class="{
        'sm-field--dirty': meta && meta.dirty,
        'sm-field--focussed': isListVisible,
        'sm-field--invalid': meta && (meta.validated || meta.touched) && !meta.valid,
        'sm-field--pristine': meta && !meta.dirty,
        'sm-field--touched': meta && meta.touched,
        'sm-field--untouched': meta && !meta.touched,
        'sm-field--valid': meta && (meta.dirty && meta.valid),
        'sm-field--validated': meta && meta.validated,
        'sm-select--filterable': filterable,
        'sm-select--prefix': $slots.prefix,
        'sm-select--suffix': $slots.suffix,
      }"
    >
      <span
        v-if="$slots.prefix"
        class="sm-select__prefix-slot"
      >
        <!-- @slot Appears to the left of the select. Can be used to create a mixed select. -->
        <slot name="prefix" />
      </span>
      <v-multiselect
        :id="inputElementId"
        ref="multiselect"
        v-model="inputValue"
        track-by="code"
        label="label"
        :options="options"
        :disabled="disabled || isFormDisabled"
        :multiple="multiple"
        :max="multipleLimit"
        :limit="tagLimit()"
        :loading="loading"
        :searchable="filterable"
        :allow-empty="allowEmpty && !required"
        :taggable="allowCreate"
        :close-on-select="closeOnClick()"
        :limit-text="(count: number) => i18n.t('sui-core.components.forms.sm-select.sm-select.limitText', { count })"
        selected-label=""
        select-label=""
        selected-option=""
        :clear-on-select="clearOnSelect"
        :internal-search="internalSearch"
        :placeholder="placeholder"
        :group-values="showGroupSelect ? 'libs' : null"
        :group-label="showGroupSelect ? 'title' : null"
        :group-select="groupSelect"
        :option-height="optionHeight"
        @tag="tagAdded"
        @open="listOpened()"
        @close="listClosed()"
        v-on="eventBindings"
      >
        <template #tag="{ option, remove }">
          <sm-tag
            :size="SmTagSize.MEDIUM"
            :closable="true"
            class="sm-select__tag"
            @close="remove(option)"
          >
            {{ option.label }}
          </sm-tag>
        </template>

        <template #option="props">
          <div
            v-if="props.option.$groupLabel"
            class="sm-select__group-content"
          >
            <span class="sm-select__title sm-text--x-small">{{ props.option.$groupLabel }}</span>
          </div>
          <span
            v-else
            class="sm-select__option"
            :class="{ 'sm-select__option--disabled': props.option.$isDisabled }"
          >
            <div
              v-if="multiple"
              class="sm-select__option-checkbox"
            >
              <span />
            </div>
            <div class="sm-select__option-content">
              <span
                v-if="isAddedTag(props.option)"
                :class="{ 'sm-select__option-label--truncated': props.option.truncateLabel }"
                :title="props.option.truncateLabel ? props.option.label : null"
              >
                {{ props.option.label }}
              </span>
              <span
                v-else
                :class="{ 'sm-select__option-label--truncated': props.option.truncateLabel }"
                :title="props.option.truncateLabel ? props.option.label : null"
              >
                {{ props.option.label }}
              </span>
              <span
                v-if="props.option.description"
                class="sm-select__option-description sm-text--small"
                :class="{ 'sm-select__option-description--truncated': props.option.truncateDescription }"
                :title="props.option.truncateDescription ? props.option.description : null"
              >
                {{ props.option.description }}
              </span>
            </div>
          </span>
        </template>

        <template
          #caret="{ toggle }"
        >
          <span @mousedown.prevent.stop="toggle">
            <div
              class="sm-select__indicator"
              :class="{ 'sm-select__indicator-opened': isListVisible }"
            >
              <span class="h-16 sm-icon sm-icon--arrow-up sm-select__indicator-icon w-16">
                <svg
                  version="1.1"
                  :viewBox="iconArrowUp.viewBox"
                  :style="{ width: '1em', height: '1em' }"
                  focusable="false"
                  :aria-hidden="true"
                  role="img"
                  v-html="iconArrowUp.path"
                ></svg>
              </span>
            </div>
          </span>
        </template>

        <template #noResult="props">
          {{ i18n.t("sui-core.components.forms.sm-select.sm-select.noResultSelections", { searchQuery: props.search }) }}
        </template>

        <template #maxElements>
          {{ i18n.t("sui-core.components.forms.sm-select.sm-select.maximumSelections") }}
        </template>

        <template #noOptions>
          {{ i18n.t("sui-core.components.forms.sm-select.sm-select.listIsEmpty") }}
        </template>
      </v-multiselect>
      <span
        v-if="$slots.suffix"
        class="sm-select__suffix-slot"
      >
        <!-- @slot Appears to the right of the select. Can be used to create a mixed select. -->
        <slot name="suffix" />
      </span>
    </div>

    <sm-field-error
      v-if="!errorDisabled"
      :errors="errors"
    />
  </span>
</template>

<style lang="scss">
@import "../../../common/variables";
@import "../../../common/mixins";
@import '../../../../../node_modules/vue-multiselect/dist/vue-multiselect.css';

$sm-input--placeholder-color: $grey-neu-black;
$sm-select--border-color: #c6ceda;
$sm-select--text-color: $grey-neu-black;
$sm-select--background-color: $true-white;
$sm-select--description--text-color: $grey-neu-dark;
$sm-select--list--text-color: $grey-neu-black;
$sm-select--list--background-color: $true-white;
$sm-select--list--border-color: #c6ceda;
$sm-select--list--scrollbar-color: $blue-neu-dark;
$sm-select--invalid--label-color: $app-warning;
$sm-select--invalid--border-color: $app-warning;
$sm-select--focus--label-color: $primary-blue;
$sm-select--focus--border-color: $primary-blue;
$sm-select--disabled--border-color: $grey-neu-med;
$sm-select--disabled--text-color: $grey-neu-mid;
$sm-select--disabled--label-color: $grey-neu-mid;
$sm-select--disabled--background-color: $grey-neu-white;
$sm-select-option--hover--text-color: $grey-neu-black;
$sm-select-option--hover--background-color: $blue-neu-med;
$sm-select-option--focus--text-color: $grey-neu-white;
$sm-select-option--focus--background-color: $grey-neu-black;
$sm-select-option--indicator--text-color: $true-white;
$sm-select-option--indicator--background-color: $primary-blue;
$sm-select-option--selected--text-color: $grey-neu-black;
$sm-select-option--selected--background-color: $blue-neu-med;
$sm-select--selected--border-color: $primary-blue;
$sm-select--selected--counter: $app-info-light;
$sm-select--mixed--background-color: $grey-neu-white;
$sm-select--mixed--color: $grey-neu-black;
$sm-select--option-group--border: $light-blue-grey;
$sm-select--option-group--text-color: #686868;
$sm-select--checkbox--control--border-color: $blue-neu-dark;
$sm-select--checkbox--control--background-color: $true-white;
$sm-select--checkbox--control--foreground-color: transparent;
$sm-select--checkbox--hover--control--border-color: $primary-blue;
$sm-select--checkbox--hover--control--background-color: $true-white;
$sm-select--checkbox--hover--control--foreground-color: transparent;
$sm-select--checkbox--checked--hover--control--border-color: $primary-blue-dark;
$sm-select--checkbox--checked--hover--control--background-color: $primary-blue-dark;
$sm-select--checkbox--checked--hover--control--foreground-color: $true-white;
$sm-select--checkbox--checked--control--border-color: $primary-blue;
$sm-select--checkbox--checked--control--background-color: $primary-blue;
$sm-select--checkbox--checked--control--foreground-color: $true-white;
$sm-select--checkbox--indeterminate--control--border-color: $primary-blue;
$sm-select--checkbox--indeterminate--control--background-color: $primary-blue;
$sm-select--checkbox--indeterminate--control--foreground-color: $true-white;
$sm-select--checkbox--indeterminate--hover--control--border-color: $primary-blue-dark;
$sm-select--checkbox--indeterminate--hover--control--background-color: $primary-blue-dark;
$sm-select--checkbox--indeterminate--hover--control--foreground-color: $true-white;
$sm-select--checkbox--disabled--control--border-color: $grey-neu-mid;
$sm-select--checkbox--disabled--control--background-color: $grey-neu-white;
$sm-select--checkbox--disabled--control--foreground-color: transparent;
$sm-select--checkbox--checked--disabled--control--border-color: $grey-neu-mid;
$sm-select--checkbox--checked--disabled--control--background-color: $grey-neu-white;
$sm-select--checkbox--checked--disabled--control--foreground-color: $grey-neu-mid;
$sm-select--checkbox--spinner--border-color: $primary-blue;

.sm-select {
  cursor: pointer;

  &__action {
    margin-right: auto;

    @include padding($left: rem($sm-xxsm),$top: rem($sm-xxsm));
  }

  &__title {
    text-transform: uppercase;
    font-weight: 600;
    color: $sm-select--option-group--text-color;
  }

  &__group-content {
    border-top: 1px solid $sm-select--option-group--border;
    margin-top: -14px;
    padding-top: 14px;
  }

  &__option {
    display: flex;
  }

  &__option-content {
    min-width: 0;
    flex: 1;
  }

  /**
    Remove slotted container workaround when this has been tagged for release
    https://github.com/shentao/vue-multiselect/pull/1125
   */
  &__option--disabled {
    background: $sm-select--disabled--background-color;
    border-left: 2px solid transparent;
    color: $sm-select--disabled--text-color;
    margin: -13px -12px -13px -14px;
    padding: 13px $sm-12;

    .sm-select__option-description {
      color: $sm-select--disabled--text-color;
    }
  }

  &__option-label {
    &--truncated {
      display: block;
      word-break: break-word;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__option-description {
    color: $sm-select--description--text-color;
    display: block;

    &--truncated {
      word-break: break-word;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .multiselect {
    box-sizing: content-box;
    box-shadow: none;
    display: block;
    position: relative;
    width: 100%;
    min-height: 38px;
    text-align: left;
    color: $sm-select--text-color;
    border-radius: 4px;
    border: 1px solid $sm-select--border-color;
    background: $sm-select--background-color;
    touch-action: manipulation;

    &--active {
      border-color: $sm-select--focus--border-color;
      box-shadow: inset 0 -1px 0 0 $sm-select--focus--border-color;
    }

    &--above {
      .multiselect__content-wrapper {
        bottom: calc(100% + 3px);
        top: auto;
        border: 1px solid $sm-select--list--border-color;
        border-radius: 4px;

        // taken from the boxShadow.default value from tailwind.config.js file
        // in PP: frontends/property/tailwind.config.js
        box-shadow: 0 5px 11px -5px rgba(24, 58, 108, 0.15), 0 6px 9px -5px rgba(24, 58, 108, 0.14), 0 1px 1px -1px rgba(24, 58, 108, 0.14);
      }
    }

    * {
      box-sizing: border-box;
    }

    &:focus {
      outline: none;
    }

    &-enter-active,
    &-leave-active {
      transition: all 0.15s ease;
    }

    &-enter,
    &-leave-active {
      opacity: 0;
    }

    &[dir="rtl"] {
      text-align: right;
    }

    fieldset[disabled] & {
      pointer-events: none;
      cursor: not-allowed;
    }

    &__spinner {
      position: absolute;
      right: 1px;
      top: 1px;
      bottom: 2px;
      width: 48px;
      background: $sm-select--list--background-color;
      display: block;
    }

    &__spinner::after,
    &__spinner::before {
      position: absolute;
      content: "";
      top: 50%;
      left: 50%;
      margin: -8px 0 0 -8px;
      width: 16px;
      height: 16px;
      border-radius: 100%;
      border-color: $sm-select--checkbox--spinner--border-color transparent transparent;
      border-style: solid;
      border-width: 2px;
      box-shadow: 0 0 0 1px transparent;
    }

    &__spinner::before {
      animation: a 2.4s cubic-bezier(0.41, 0.26, 0.2, 0.62);
      animation-iteration-count: infinite;
    }

    &__spinner::after {
      animation: a 2.4s cubic-bezier(0.51, 0.09, 0.21, 0.8);
      animation-iteration-count: infinite;
    }

    &__loading-enter-active,
    &__loading-leave-active {
      transition: opacity 0.4s ease-in-out;
      opacity: 1;
    }

    &__loading-enter,
    &__loading-leave-active {
      opacity: 0;
    }

    &__input,
    &__single {
      touch-action: manipulation;
    }

    &--disabled .multiselect__tags-wrap {
      opacity: 0.6;
    }

    &--active {
      z-index: $sm-select-z-index;
    }

    &--active:not(&--above) &__current,
    &--active:not(&--above) &__input,
    &--active:not(&--above) &__tags {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    &--active &__select {
      transform: rotate(180deg);
    }

    &--above &--active &__current,
    &--above &--active &__input,
    &--above &--active &__tags {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    &__input,
    &__single {
      position: relative;
      display: inline-block;
      min-height: 32px;
      line-height: 20px;
      border: none;
      box-shadow: none; // Browser override
      font: inherit;
      border-radius: 5px;
      background: transparent;
      width: 100%;
      transition: border 0.1s ease;
      box-sizing: border-box;
      vertical-align: top;
      padding: 0;
    }

    /**
     * Sync with fake placeholder colors
     */
    &__input::placeholder {
      color: rgba($sm-input--placeholder-color, 0.7);

      /* Firefox Only */
      @supports (-moz-appearance: none) {
        color: rgba($sm-input--placeholder-color, 0.9);
      }

      /* Safari Only */
      @supports (background: -webkit-named-image(i)) {
        color: rgba($sm-input--placeholder-color, 0.45);
      }
    }

    &__single {
      padding-top: 5px;
      word-break: break-word;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__tags-wrap {
      display: inline-block;
      padding-top: 3px;
      min-height: $sm-32;
    }

    &__tags {
      min-height: 38px;
      display: block;
      padding: 3px 50px 3px $sm-12;
      background: transparent;
    }

    &__current {
      min-height: 40px;
      overflow: hidden;
      padding: $sm-8 $sm-12 0;
      padding-right: 30px;
      white-space: nowrap;
      border-radius: 5px;
    }

    &__current,
    &__select {
      line-height: 16px;
      box-sizing: border-box;
      display: block;
      margin: 0;
      text-decoration: none;
      cursor: pointer;
    }

    &__select {
      position: absolute;
      width: $sm-40;
      height: 38px;
      right: 1px;
      top: 1px;
      padding: $sm-4 $sm-8;
      text-align: center;
      transition: transform 0.2s ease;
    }

    &__select::before {
      position: relative;
      right: 0;
      top: 65%;
      color: $grey-neu-mid;
      margin-top: 4px;
      border-style: solid;
      border-width: 5px 5px 0;
      border-color: $grey-neu-mid transparent transparent;
      content: "";
    }

    &__placeholder {
      color: rgba($sm-input--placeholder-color, 0.7);
      align-items: center;
      display: flex;
      min-height: 32px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      letter-spacing: normal;
      line-height: 22px;

      /**
       * Set the fake placeholder color as close as possible to the
       * browser default placeholder colors
       */

      /* Firefox Only */
      @supports (-moz-appearance: none) {
        color: rgba($sm-input--placeholder-color, 0.55);
      }

      /* Safari Only */
      @supports (background: -webkit-named-image(i)) {
        color: rgba($sm-input--placeholder-color, 0.45);
      }
    }

    &--active &__placeholder {
      display: none;
    }

    /**
     * Set the fake placeholder color as close as possible to the
     * browser default placeholder colors
     */
    &--disabled .multiselect__placeholder {
      /* Firefox Only */
      @supports (-moz-appearance: none) {
        color: rgba($sm-input--placeholder-color, 0.25);
      }

      /* Safari Only */
      @supports (background: -webkit-named-image(i)) {
        color: rgba($sm-input--placeholder-color, 0.45);
      }
    }

    &__content-wrapper {
      position: absolute;
      display: block;
      background: $sm-select--background-color;
      width: 100%;
      max-height: 240px;
      overflow-y: auto;
      border: 1px solid $sm-select--list--border-color;
      top: calc(100% + 3px);
      border-radius: 4px;
      z-index: $sm-select-z-index;
      -webkit-overflow-scrolling: touch;

      // taken from the boxShadow.default value from tailwind.config.js file
      // in PP: frontends/property/tailwind.config.js
      box-shadow: 0 5px 11px -5px rgba(24, 58, 108, 0.15), 0 6px 9px -5px rgba(24, 58, 108, 0.14), 0 1px 1px -1px rgba(24, 58, 108, 0.14);

      &::-webkit-scrollbar {
        width: 6px;
      }

      /* Track */
      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px $grey-neu-mid;
        border-top-right-radius: 4px;
        border-top-left-radius: 0;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 0;
      }

      /* Handle */
      &::-webkit-scrollbar-thumb {
        background: $sm-select--list--scrollbar-color;
        border-radius: 8px;
      }

      /* Handle on hover */
      &::-webkit-scrollbar-thumb:hover {
        background: $grey-neu-dark;
      }
    }

    &__content {
      list-style: none;
      display: inline-block;
      padding: 0;
      margin: 0;
      min-width: 100%;
      vertical-align: top;
      width: 100%;
    }

    &--above &__content-wrapper {
      bottom: 100%;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border-bottom: none;
      border-top: 1px solid red;
    }

    &__content::webkit-scrollbar {
      display: none;
    }

    &__element {
      display: block;

      &:first-child {
        .sm-select__group-content {
          border-top:0;
        }
      }
    }

    &__option {
      display: block;
      padding: 13px $sm-16 13px 9px;
      min-height: 40px;
      text-decoration: none;
      border-left: 3px solid transparent;
      text-transform: none;
      position: relative;
      cursor: pointer;
      white-space: normal;
      word-break: break-word;
      color: $sm-select-option--hover--text-color;
    }

    &__option::after {
      top: 0;
      right: 0;
      position: absolute;
      line-height: 40px;
      padding-right: $sm-12;
      padding-left: $sm-20;
      font-size: 13px;
    }

    &__option--selected {
      background: $sm-select-option--selected--background-color;
      color: $sm-select-option--selected--text-color;
      border-color: $sm-select--selected--border-color;
    }

    &__option--selected::after {
      content: attr(data-selected);
      color: $sm-select-option--selected--text-color;
    }

    &__option--highlight {
      background: $sm-select-option--hover--background-color;
      outline: none;
      color: $sm-select-option--hover--text-color;
    }

    &__option--highlight::after {
      content: attr(data-select);
      background: $sm-select-option--hover--background-color;
      color: $sm-select-option--hover--text-color;
    }

    &__option--selected &__option--highlight {
      background: $sm-select-option--selected--background-color;
      color: $sm-select-option--selected--text-color;
    }

    &__option--selected &__option--highlight::after {
      background: $sm-select-option--selected--background-color;
      color: $sm-select-option--selected--text-color;
      content: attr(data-deselect);
    }

    &--disabled {
      background: $sm-select--disabled--background-color;
      border-color: $sm-select--disabled--border-color;
      color: $sm-select--disabled--text-color;
      pointer-events: none;
    }

    &--disabled &__current,
    &--disabled &__select,
    &__option--disabled {
      background: $sm-select--disabled--background-color;
      color: $sm-select--disabled--text-color;
    }

    &__option--disabled {
      cursor: text;
      pointer-events: none;
    }

    &__option--group {
      background: $sm-select--list--background-color;
      color: $sm-select--list--text-color;
    }

    &__option--group &__option--highlight {
      background: $sm-select-option--hover--background-color;
      color: $sm-select-option--hover--text-color;
    }

    &__option--group &__option--highlight::after {
      background: $sm-select-option--hover--background-color;
    }

    &__option--disabled &__option--highlight {
      background: $sm-select--disabled--background-color;
    }

    &__option--group-selected &__option--highlight {
      background: $sm-select-option--selected--background-color;
      color: $sm-select-option--selected--text-color;
    }

    &__option--group-selected &__option--highlight::after {
      background: $sm-select-option--selected--background-color;
      color: $sm-select-option--selected--text-color;
      content: attr(data-deselect);
    }

    &__strong {
      margin-top: 3px;
      line-height: 20px;
      padding: 3px 10px;
      font-size: 13px;
      display: inline-block;
      vertical-align: top;
      font-weight: normal;
      border-radius: 12px;
      background: $sm-select--selected--counter;
    }

    [dir="rtl"] &__select {
      right: auto;
      left: 1px;
    }

    [dir="rtl"] &__tags {
      padding: 3px $sm-8 3px $sm-40;
    }

    [dir="rtl"] &__content {
      text-align: right;
    }

    [dir="rtl"] &__option::after {
      right: auto;
      left: 0;
    }

    [dir="rtl"] &__clear {
      right: auto;
      left: 12px;
    }

    [dir="rtl"] &__spinner {
      right: auto;
      left: 1px;
    }

    @keyframes a {
      0% {
        transform: rotate(0);
      }

      100% {
        transform: rotate(2turn);
      }
    }
  }

  .multiselect__element + .multiselect__element {
    margin-top: 2px;
  }

  &--filterable {
    cursor: text;
  }

  &__tag {
    margin-left: 0 !important; // Override default sm-tag margin
    margin-right: 4px;
    margin-bottom: 3px;
  }

  &__indicator {
    position: absolute;
    cursor: pointer;
    right: 0;
    height: 100%;
    width: 50px;
    padding: 4px 8px;
    text-align: center;
    transform: rotate(180deg);
    transition: transform 0.3s;

    &-opened {
      transform: rotate(0deg);
    }

    &-icon.sm-icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: inline-block;
      vertical-align: middle;
      width: 1em;
      height: 1em;
      line-height: 1;

      > svg {
        line-height: 1;
        fill: currentColor;
        display: inline-block;
      }
    }
  }

  &--prefix {
    display: flex;

    .multiselect {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
    }
  }

  &--suffix {
    display: flex;

    .multiselect {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
    }
  }

  &__prefix-slot,
  &__suffix-slot {
    display: flex;
    background: $sm-select--mixed--background-color;
    color: $sm-select--mixed--color;
  }

  &__prefix-slot {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border: 1px solid $sm-select--border-color;
    border-right: 0;

    .sm-button {
      height: 100%;

      .sm-button__content {
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
        height: 100%;
      }
    }
  }

  &__suffix-slot {
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid $sm-select--border-color;
    border-left: 0;

    .sm-button {
      height: 100%;

      .sm-button__content {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
        height: 100%;
      }
    }
  }

  .sm-select__option-checkbox {
    background: $sm-select--checkbox--control--background-color;
    border: 2px solid $sm-select--checkbox--control--border-color;
    border-radius: 2px;
    cursor: pointer;
    display: inline-block;
    margin-right: $sm-8;
    margin-top: 2px;
    position: relative;
    width: 18px;
    height: 18px;
    transition: all 0.3s ease;
    flex-shrink: 0;

    span {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      transform: rotate(40deg);

      &::before,
      &::after {
        content: '';
        position: absolute;
        background: $sm-select--checkbox--control--foreground-color;
      }

      &::before {
        width: 3px;
        height: 1px;
        bottom: 3px;
        left: 5px;
      }

      &::after {
        width: 1px;
        height: 9px;
        bottom: 3px;
        left: 8px;
      }

      &, &::before, &::after {
        transition: all 0.3s ease;
      }
    }

    /**
     * Hover state
     */
    &:hover {
      border-color: $sm-select--checkbox--hover--control--border-color;
      background: $sm-select--checkbox--hover--control--background-color;

      span::before,
      span::after {
        background: $sm-select--checkbox--hover--control--foreground-color;
      }
    }
  }

  /**
   * Active state
   */
  .multiselect__option--selected .sm-select__option-checkbox {
    border-color: $sm-select--checkbox--checked--control--border-color;
    background: $sm-select--checkbox--checked--control--background-color;

    span::before,
    span::after {
      background: $sm-select--checkbox--checked--control--foreground-color;
    }
  }

  .multiselect__option--selected .sm-select__option-checkbox:hover {
    border-color: $sm-select--checkbox--checked--hover--control--border-color;
    background: $sm-select--checkbox--checked--hover--control--background-color;

    span::before,
    span::after {
      background: $sm-select--checkbox--checked--hover--control--foreground-color;
    }
  }

  /**
   * Disabled state
   */
  .multiselect__option--disabled .sm-select__option-checkbox {
    cursor: not-allowed;
    opacity: 1;
    border-color: $sm-select--checkbox--disabled--control--border-color;
    background: $sm-select--checkbox--disabled--control--background-color;
    border-width: 1px;
    padding: 1px;

    span::before,
    span::after {
      background: $sm-select--checkbox--disabled--control--foreground-color;
    }
  }

  .multiselect__option--disabled.multiselect__option--selected .sm-select__option-checkbox {
    border-color: $sm-select--checkbox--checked--disabled--control--border-color;
    background: $sm-select--checkbox--checked--disabled--control--background-color;

    span::before,
    span::after {
      background: $sm-select--checkbox--checked--disabled--control--foreground-color;
    }
  }

  &.sm-field--focussed {
    .multiselect:not(.multiselect--disabled) {
      transition: box-shadow 0.3s ease, border-color 0.3s ease;
    }
  }

  &.sm-field--invalid {
    .multiselect:not(.multiselect--disabled) {
      border-color: $sm-select--invalid--border-color;
    }
  }

  &.sm-field--invalid.sm-field--focussed {
    .multiselect:not(.multiselect--disabled) {
      box-shadow: inset 0 -1px 0 0 $sm-select--invalid--border-color;
    }
  }

  // #region vue-multiselect@3.x style overrides
  .multiselect {
    font-size: 15px;

    .multiselect__placeholder {
      margin-bottom: 0;
      padding-top: 0;
    }

    .multiselect__input, .multiselect__single {
      margin-bottom: 0;
    }

    .multiselect__option {
      line-height: inherit;
    }

    .multiselect__option--selected {
      font-weight: 400;
    }

    .multiselect__strong {
      margin-bottom: 0;
    }

    .multiselect__tags {
      font-size: 15px;
      border: none;
    }

    .multiselect__option--disabled {
      // important is needed here as vue-multiselect has an !important we need to beat :(
      background: $sm-select--list--background-color !important;
    }
  }

  // #endregion
}
</style>
