<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useFieldArray } from 'vee-validate'
import SmInput from '../sm-input/sm-input.vue'
import SmDropdown from '../../sm-dropdown/sm-dropdown.vue'
import { SmTranslationsInputTranslationValue, SmTranslationsInputSupportedTranslation } from './sm-translations-input.types'
import { SmInputResize, SmInputType } from '../sm-input/sm-input.types'
import { SmDropdownPlacement } from '../../sm-dropdown/sm-dropdown.types'
import { SmButtonType, SmButtonSize } from '../../sm-button/sm-button.types'
import { useI18n } from '../../../libs/vue-i18n'
import SmButton from '../../sm-button/sm-button.vue'

const props = withDefaults(defineProps<{
  /**
   * The default language
   */
  defaultLanguage?: string
  /**
   * The supported translations with field and dropdown labels. [{ code: 'en', translationLabel: "English-translation", dropdownLabel: "English" }].
   * Optionally add `disableDeletion: true` to prevent deleting a specific language
   */
  supportedTranslations: SmTranslationsInputSupportedTranslation[]
  /**
   * The label for the 'Add' button
   */
  buttonLabel?: string
  /**
   * Max height in 'px' of the dropdown content
   */
  maxHeight?: number
  /**
   * Whether the field is disabled
   */
  disabled?: boolean
  /**
   * An sm-icon name to be displayed to the left of the input
   */
  prefixIcon?: string
  /**
   * The placeholder of the input field
   */
  placeholder?: string
  /**
   * An sm-icon name to be displayed to the right of the input
   */
  suffixIcon?: string
  /**
   * The vee-validate rules - see: https://vee-validate.logaretm.com/v4/guide/global-validators/#available-rules
   */
  rules?: string | Record<string, unknown>
  /**
   * The HTML element ID
   */
  id?: string
  /**
   * The HTML input type. Accepts 'text', 'textarea'
   */
  type?: SmInputType
  /**
   * The minimum input length
   */
  minlength?: number | string
  /**
   * The maximum input length
   */
  maxlength?: number | string
  /**
   * Whether to show a character counter
   */
  counter?: boolean
  /**
   * The number of rows in a textarea type input
   */
  rows?: number | string
  /**
   * Native auto-complete attribute
   */
  autoComplete?: string
  /**
   * Native name attribute
   */
  name: string
  /**
   * Native readonly attribute
   */
  readonly?: string
  /**
   * Native resize attribute. Accepts 'none', 'both', 'horizontal', 'vertical'
   */
  resize?: SmInputResize
  /**
   * Native autofocus attribute
   */
  autofocus?: boolean
  /**
   * The label of the input element
   */
  label?: string
  /**
   * Hides the label visually but still keeps it accessible to screen readers
   */
  labelHidden?: boolean
  /**
   * Native form attribute
   */
  form?: string
}>(), {
  autofocus: false,
  type: SmInputType.TEXT,
  defaultLanguage: 'en',
  disabled: false,
  rules: undefined,
  counter: false,
  id: undefined,
  rows: undefined,
  minlength: undefined,
  maxlength: undefined,
  autoComplete: undefined,
  readonly: undefined,
  resize: undefined,
  label: '',
  labelHidden: false,
  form: '',
  maxHeight: 300,
  prefixIcon: undefined,
  suffixIcon: undefined,
  placeholder: undefined,
  buttonLabel: '',
})

defineOptions({
  inheritAttrs: false,
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
  },
})

/**
 * v-model for `modelValue` prop
 * Emits 'update:modelValue': [value: ModelValue] when this ref changes
 * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
 */
const modelValue = defineModel<SmTranslationsInputTranslationValue[]>({
  required: true,
})

const { i18n } = useI18n()

const dropdownVisible = ref(false)

const inputTag = computed(() => (props.type === SmInputType.TEXTAREA ? 'textarea' : 'input'))

const { remove, push } = useFieldArray<SmTranslationsInputTranslationValue>(props.name)

// Find an item with the code
const findItemByCode = <T extends { code: string }>(
  arrToSearch: T[],
  codeToFind: string,
  ): T | undefined => {

  return arrToSearch.find((e) => {
    return e.code === codeToFind
  })

}

// Find the item for the default input's v-model
const findDefaultByCode = (): SmTranslationsInputTranslationValue => {

  const foundItem = modelValue.value.find(e => e.code === props.defaultLanguage)

  if (foundItem) {
    return foundItem
  }

  return {
    code: props.defaultLanguage,
    value: '',
  }

}

// The default code's input v-model
const defaultInput = computed<SmTranslationsInputTranslationValue>(() => findDefaultByCode())

// Function to dynamically add a new input field based on 'code'
const createField = (code: string): void => {

  if (!modelTranslations.value.some(modelTranslation => modelTranslation.code === code)) {

    modelTranslations.value = [
      ...modelTranslations.value,
      { code, value: '' },
    ]
    push({ code, value: '' })
  }

}

const defaultLanguageIndex = computed(() => modelTranslations.value.findIndex(field => field.code === props.defaultLanguage))

// Dropdown list without the default and already existing input field
const dropdownList = computed(() => {

  return props.supportedTranslations.filter((translation) => {

    if (translation.code !== props.defaultLanguage && !modelTranslations.value.some(modelTranslation => modelTranslation.code === translation.code)) {
      return true
    }
    return false

  })
})

// Remove's a created field and resets it's value
const removeCreatedField = (code: string, index: number): void => {
  modelTranslations.value = modelTranslations.value.filter(modelTranslation => modelTranslation.code !== code)
  remove(index)
}

const modelTranslations = computed({
  get: () => modelValue.value,
  set: (state) => { modelValue.value = state },
})

// Combines all the input's into one consolidated value (v-model)
const combineInputModels = (inputCode: string, inputVal: string): void => {
  const clonedModel = [...modelTranslations.value]
  const index = clonedModel.findIndex(p => p.code === inputCode)

  if (index < 0) {
    clonedModel.push({ code: inputCode, value: inputVal })
  } else {
    clonedModel[index].value = inputVal
  }

  modelTranslations.value = clonedModel

}

// Used to create fields dynamically on mount
const createFields = (): void => {

  // Make sure default language is created
  createField(props.defaultLanguage)

  for (const translation of modelTranslations.value) {
    if (translation.code !== props.defaultLanguage) {
      createField(translation.code)
    }
  }
}

onMounted(() => {
  createFields()
})

defineExpose({
  inputTag,
  defaultInput,
  createField,
  dropdownVisible,
  dropdownList,
  combineInputModels,
  removeCreatedField,
  modelTranslations,
  findItemByCode,
})
</script>

<template>
  <div class="sm-translations-input">
    <sm-input
      v-if="defaultLanguageIndex >= 0"
      :id="id"
      v-model="modelTranslations[defaultLanguageIndex].value"
      :type="type"
      :name="`${name}[${defaultLanguageIndex}].value`"
      :placeholder="placeholder"
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      :disabled="disabled"
      :rules="rules"
      :counter="counter"
      :rows="rows"
      :minlength="minlength"
      :maxlength="maxlength"
      :autocomplete="autoComplete"
      :readonly="readonly"
      :resize="resize"
      :autofocus="autofocus"
      :label="label"
      :label-hidden="labelHidden"
      :form="form"
      @update:model-value="combineInputModels(defaultLanguage, defaultInput.value)"
    />

    <div class="sm-translations-input__created">
      <div class="sm-translations-input__created-inner">
        <div
          v-for="(field, index) in modelTranslations"
          :key="index"
          class="sm-translations-input__created-item"
        >
          <div
            v-if="field.code !== defaultLanguage"
            class="sm-translations-input__created-wrap"
          >
            <div class="sm-translations-input__created-item-indicator" />
            <sm-input
              v-model="field.value"
              :type="type"
              :name="`${name}[${index}].value`"
              :rules="rules"
              :label="findItemByCode(supportedTranslations, field.code)?.translationLabel"
            >
              <template #action>
                <sm-button
                  :size="SmButtonSize.MEDIUM"
                  :type="SmButtonType.TEXT_WARNING"
                  :disabled="findItemByCode(supportedTranslations, field.code)?.disableDeletion"
                  @click="removeCreatedField(field.code, index)"
                >
                  {{ i18n.t('sui-core.components.forms.sm-translations-input.sm-translations-input.deleteButtonText') }}
                </sm-button>
              </template>
            </sm-input>
          </div>
        </div>
      </div>
    </div>

    <sm-dropdown
      v-if="dropdownList.length > 0"
      :type="SmButtonType.TEXT"
      :placement="SmDropdownPlacement.BOTTOM"
      :close-on-menu-click="true"
    >
      <template #label>
        <sm-icon name="controls-add" />
        {{ buttonLabel || i18n.t('sui-core.components.forms.sm-translations-input.sm-translations-input.addTranslationsButtonText') }}
      </template>

      <template #default>
        <div
          class="sm-translations-input__items"
          :style="`max-height: ${maxHeight}px;`"
        >
          <div
            v-for="(supportedTranslation, i) in dropdownList"
            :key="i"
            class="sm-translations-input__item"
            @click="createField(supportedTranslation.code)"
          >
            {{ supportedTranslation['dropdownLabel'] }}
          </div>
        </div>
      </template>
    </sm-dropdown>
  </div>
</template>

<style lang="scss">
@import "../../../common/variables";
@import "../../../common/mixins";

$sm-vertical-nav-item--hover--text-color: $grey-neu-black;
$sm-vertical-nav-item--hover--background-color: $blue-neu-med;
$sm-vertical-created-item-border-ends-color: $blue-neu-light;
$sm-vertical-created-item-border-color: $light-blue-grey;
$sm-indicator-background-color: $blue-neu-dark;

.sm-translations-input {
  &__created-inner {
    border: none;
    border-left-style: solid;
    border-left-width: 2px;
    border-image: linear-gradient(
      $sm-vertical-created-item-border-ends-color,
      $sm-vertical-created-item-border-color,
      $sm-vertical-created-item-border-color,
      $sm-vertical-created-item-border-ends-color
      ) 1;
  }

  &__created-item {
    padding-left: 30px;
    position: relative;

    &-indicator {
      position: absolute;
      width: 5px;
      height: 5px;
      left: -3.5px;
      top: 17px;
      background: $sm-indicator-background-color;
      border-radius: 100%;
    }

    &:focus-within &-indicator {
      background: blue;
    }

    .sm-input__header {
      align-items: center;
    }

    .sm-input .sm-input__action {
      margin-right: 0;
      padding-top: 0;
    }
  }

  &__items {
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 5px;
      }

      /* Track */
      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px $grey-neu-mid;
        border-radius: 0;
        border-bottom-right-radius: 4px;
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

  &__item {
    padding: 10px 15px;
    cursor: pointer;

    &:hover, &:focus {
      color: $sm-vertical-nav-item--hover--text-color;
      background: $sm-vertical-nav-item--hover--background-color;
    }
  }
}
</style>
