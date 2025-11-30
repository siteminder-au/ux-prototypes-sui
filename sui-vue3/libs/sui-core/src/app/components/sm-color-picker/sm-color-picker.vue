<script setup lang="ts">
import {
  ref,
  onMounted,
  watchEffect,
  onBeforeUnmount,
  computed,
  onUpdated,
  Ref,
} from 'vue'
import { Photoshop as SmPhotoshop } from '@ckpack/vue-color'
import { createPopperLite as createPopper, flip, arrow, preventOverflow } from '@popperjs/core'
import { SmColorPickerPlacement, SmColorPickerPosition } from './sm-color-picker.types'
import { useI18n } from '../../libs/vue-i18n'
import SmButton from '../sm-button/sm-button.vue'
import { SmButtonType } from '../sm-button/sm-button.types'

const props = withDefaults(defineProps<{
  /**
   * Set the default color of color-picker, requires a hex color code. For example '#000000'
   */
  hexColor?: string
  /**
   * Whether the color-picker is visible
   */
  visibleColorPicker?: boolean
  /**
   * The side of the target element the color-picker should be placed against. Accepts 'top', 'right', 'bottom' and 'left'
   */
  placement?: SmColorPickerPlacement
  /**
   * Custom text for the select color button
   */
  selectColorButtonText?: string
  /**
   * Whether to use `fixed` or `absolute` positioning. Absolute is more performant if you have a lot of popovers; fixed is more robust
   */
  position?: SmColorPickerPosition
}>(), {
  hexColor: '#000000',
  visibleColorPicker: false,
  placement: SmColorPickerPlacement.BOTTOM,
  selectColorButtonText: '',
  position: SmColorPickerPosition.ABSOLUTE,
})

const emit = defineEmits<{
  /**
   * Visibility of the color-picker
   */
  'update:visibleColorPicker': [state: boolean]
  /**
   * When the color is changed
   */
  'update:hexColor': [state: string]
  /**
   * Triggers when the dropdown is opened
   */
  showPicker: []
  /**
   * Triggers when the dropdown is opened
   */
  hidePicker: []
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
    // we suppress ATTR_FALSE_VALUE as we want to keep
    // `aria-hidden` attribute attached even if the value of it is false
    // in vue2, aria-hidden was removed if the value was false.
    ATTR_FALSE_VALUE: 'suppress-warning',
  },
})

const colorPickerElement: Ref<HTMLElement | null> = ref(null)
const targetElement: Ref<HTMLElement | null> = ref(null)
const contentElement: Ref<HTMLElement | null> = ref(null)
const selectedColor = ref('')

const { i18n } = useI18n()

const isVisiblePicker = computed<boolean>({
  get: () => props.visibleColorPicker,
  set: state => emit('update:visibleColorPicker', state),
})

const inputColor = computed<string>({
  get: () => {
    return props.hexColor
  },
  set: (state) => {
    emit('update:hexColor', state)
  },
})

const popper = ref<any | null>(null)

onMounted(() => {
  setColorOnPicker(props.hexColor)
  if (targetElement.value && contentElement.value) {
    popper.value = createPopper(targetElement.value, contentElement.value, {
      placement: props.placement,
      strategy: props.position,
      modifiers: [flip, preventOverflow, arrow],
    })
  }
})

onUpdated(async () => {
  if (popper.value) {
    await popper.value.update()
  }
})

onBeforeUnmount(() => {
  if (popper.value) {
    popper.value.destroy()
    popper.value = null
  }
})

const setColorOnPicker = (color: string) => {
  selectedColor.value = color
}

const updateInputColor = (color: string) => {
  inputColor.value = color
}

const showPicker = () => {
  isVisiblePicker.value = true
}

const hidePicker = () => {
  isVisiblePicker.value = false
}

const selectColorButton = () => {
  updateInputColor(selectedColor.value)
  hidePicker()
}

const updateColorPicker = (color: { hex: string }) => {
  selectedColor.value = color.hex
}

const onClickOutside = (e: MouseEvent) => {
  // Check if the click happened inside the color-picker
  if (colorPickerElement.value && !colorPickerElement.value.contains(e.target as Node)) {
    hidePicker()
  }
}

onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

watchEffect(() => {
  if (isVisiblePicker.value) {
    /**
     * @event showPicker Triggers when the dropdown is opened
     */
    emit('showPicker')
    document.addEventListener('click', onClickOutside)
  } else {
    /**
     * @event hidePicker Triggers when the dropdown is closed
     */
    emit('hidePicker')
    document.removeEventListener('click', onClickOutside)
  }
})

defineExpose({
  colorPickerElement,
  updateColorPicker,
  isVisiblePicker,
  inputColor,
  selectColorButton,
  targetElement,
  contentElement,
  showPicker,
})
</script>

<template>
  <span
    ref="colorPickerElement"
    class="sm-color-picker"
    :class="{
      'sm-color-picker--visible': isVisiblePicker,
    }"
  >
    <span
      ref="targetElement"
      class="sm-color-picker__target-element"
    >
      <!-- @slot The input content to trigger color-picker -->
      <slot name="input" />
    </span>

    <div
      ref="contentElement"
      class="sm-color-picker__container"
    >
      <span>
        <sm-photoshop
          :model-value="inputColor"
          :aria-hidden="!isVisiblePicker || undefined"
          @update:model-value="updateColorPicker"
        />
      </span>
      <div class="sm-color-picker__select-button">
        <sm-button
          :type="SmButtonType.PRIMARY"
          class="sm-color-picker__button"
          :aria-label="
            selectColorButtonText ||
              i18n.t(
                'sui-core.components.sm-color-picker.sm-color-picker.selectColorButtonText'
              )
          "
          @click="selectColorButton"
        >
          {{
            selectColorButtonText ||
              i18n.t(
                'sui-core.components.sm-color-picker.sm-color-picker.selectColorButtonText'
              )
          }}</sm-button>
      </div>
    </div>
  </span>
</template>

<style lang="scss">
@import '../../common/variables';
@import '../../common/mixins';

$sm-color-picker--border-color: $light-blue-grey;
$sm-color-picker--border-color--active: $primary-blue;
$sm-color-picker--input-border-color: $grey-neu-med;
$sm-color-picker--input-background-color: $grey-neu-white;
$sm-color-picker--input--color: $grey-neu-black;

.sm-color-picker {
  position: relative;
  display: inline-block;

  &--visible {
    .sm-color-picker__container {
      opacity: 1;
      z-index: $sm-color-picker-z-index;
      pointer-events: all;
      visibility: visible;
    }
  }

  &__target-element {
    display: inline-block;
  }

  &__container {
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
    visibility: hidden;
  }

  &__select-button {
    overflow: hidden;
    position: absolute;
    top: 268px;
    margin: 0 20px
  }

  &__button {
    min-width: 195px;

    .sm-button__inner-content {
      width: 100%;
    }
  }

  .vc-photoshop {
    border: 1px solid $sm-color-picker--border-color;
    border-radius: 8px;
    padding: $sm-20;
    background: white;
    box-shadow: 0 3px 17px -8px rgba(24, 58, 108, 0.19),
      0 12px 11px -13px rgba(24, 58, 108, 0.18),
      0 10px 24px -9px rgba(24, 58, 108, 0.12);
    max-width: 194px;
    min-height: 288px;
    transition: all 0.3s ease;
  }

  .vc-ps-body {
    padding: 0;
    display: block;
  }

  .vc-ps-saturation-wrap {
    width: 168px;
    height: 168px;
    border-radius: 4px;
    border: 1px solid $sm-color-picker--border-color;
    display: inline-block;
  }

  .vc-ps-head {
    display: none;
  }

  .vc-hue-container {
    margin: -3px 0 0;
  }

  .vc-hue-picker {
    width: 10px;
    height: 10px;
    box-shadow: 0 0 0 2.5px #fff, inset 0 0 1px 1px rgba(0, 0, 0, 0.3),
      0 0 1px 3px rgba(0, 0, 0, 0.4);
    background: transparent;
    border-radius: 50%;
    margin-top: 0;
  }

  .vc-ps-saturation-wrap .vc-saturation-circle {
    width: 10px;
    height: 10px;
    box-shadow: 0 0 0 2.5px #fff, inset 0 0 1px 0 rgba(0, 0, 0, 0.3),
      0 0 1px 2px rgba(0, 0, 0, 0.4);
  }

  .vc-ps-hue-wrap {
    width: 6px;
    border: 0;
    height: 168px;
    display: inline-block;
    margin-left: 14px;
  }

  .vc-ps-previews__pr-color {
    width: 56px;
    height: 40px;
    border-radius: 4px;
    border: solid 1px $sm-color-picker--border-color;
    box-shadow: none;
  }

  .vc-ps-previews__swatches {
    margin: 0;
    padding: 0;
    border: 0;
  }

  .vc-ps-ac-btn,
  .vc-editable-input,
  .vc-ps-fields__divider,
  .vc-ps-previews__label,
  .vc-ps-previews__pr-color:last-child {
    display: none;
  }

  .vc-ps-controls {
    display: block;
    position: relative;
    margin-left: 0;
    margin-top: 8px;
  }

  .vc-ps-fields {
    position: static;
    padding: 0;
    margin: 0;
  }

  .vc-ps-fields__hex {
    display: block;
    position: absolute;
    top: 0;
    right: -24px;
  }

  .vc-ps-fields__hex .vc-input__label {
    width: 34px;
    height: 40px;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    border: 1px solid $sm-color-picker--input-border-color;
    border-right: 0;
    background-color: $sm-color-picker--input-background-color;
    align-items: center;
    display: flex;
    justify-content: center;
    font-size: 15px;
    font-family: 'Noto Sans', Helvetica, sans-serif;
  }

  .vc-ps-fields__hex .vc-input__input {
    margin-left: 34px;
    width: 88px;
    height: $sm-40;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border: 1px solid $sm-color-picker--border-color;
    box-shadow: none;
    color: $sm-color-picker--input--color;
    font-size: 15px;
    font-family: 'Noto Sans', Helvetica, sans-serif;
    padding-left: $sm-12;
    line-height: 22px;
    font-weight: 400;
    letter-spacing: -0.2px;
    transition: box-shadow 0.3s ease, border-color 0.3s ease;

    &:focus {
      border-color: $sm-color-picker--border-color--active;
      box-shadow: inset 0 -1px 0 0 $sm-color-picker--border-color--active;
    }
  }
}
</style>
