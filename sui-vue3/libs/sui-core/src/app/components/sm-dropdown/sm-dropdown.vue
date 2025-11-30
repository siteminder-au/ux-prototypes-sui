<script setup lang="ts">
import { ref, onMounted, watchEffect, onBeforeUnmount, computed, onUpdated, Ref } from 'vue'
import { createPopperLite as createPopper, flip, arrow, preventOverflow } from '@popperjs/core'
import { useUniqueId } from '../use/unique-id'
import SmButton from '../sm-button/sm-button.vue'
import { SmDropdownPlacement, SmDropdownPosition } from './sm-dropdown.types'
import { SmButtonShape, SmButtonType } from '../sm-button/sm-button.types'

const props = withDefaults(defineProps<{
  /**
   * The label of the button element
   */
  label?: string
  /**
   * An extra label, to be displayed when the dropdown is open
   */
  activeLabel?: string
  /**
   * The button type. Supports all accepted types in the sm-button component
   */
  type?: SmButtonType
  /**
   * Shapes the button the same as the sm-button "square" style
   */
  square?: boolean
  /**
   * Visibility of the dropdown items
   */
  closeOnMenuClick?: boolean
  /**
   * An sm-icon name, to be placed left of the button content
   */
  prefixIcon?: string
  /**
   * An sm-icon name, to be placed right of the button content
   */
  suffixIcon?: string
  /**
   * The side of the target element the dropdown items should be placed against. Accepts 'top', 'bottom', 'right', 'right-start', 'right-end'
   */
  placement?: SmDropdownPlacement
  /**
   * Whether the dropdown is disabled
   */
  disabled?: boolean
  /**
   * A custom class name to apply to the dropdown's button
   */
  targetClass?: string | null
  /**
   * A custom class name to apply to the dropdown's menu item wrapper
   */
  contentClass?: string | null
  /**
   * A custom class to apply on the dropdown's parent element to override child elements style if required
   */
  rootClass?: string | null
  /**
   * Set the width of the dropdown content, accept only units of measurement. For example '100px', '100em', '100rem'
   */
  width?: string
  /**
   * Whether the popover will change the placement when it doesn't fit the boundary.
   * For instance, if the popover is set to bottom, but it doesn't fit, opposite top placement will be used.
   * See https://popper.js.org/docs/v2/modifiers/flip/ for more details.
   */
  fallbackPlacements?: boolean
  /**
   * Whether to use `fixed` or `absolute` positioning. Absolute is more performant if you have a lot of popovers; fixed is more robust
   */
  position?: SmDropdownPosition
}>(), {
  label: '',
  activeLabel: '',
  type: SmButtonType.DEFAULT,
  square: false,
  closeOnMenuClick: false,
  prefixIcon: '',
  suffixIcon: '',
  placement: SmDropdownPlacement.TOP,
  disabled: false,
  targetClass: null,
  contentClass: null,
  rootClass: null,
  width: '',
  fallbackPlacements: true,
  position: SmDropdownPosition.ABSOLUTE,
})

const emit = defineEmits<{
  /**
   * Emitted when the dropdown is closed
   */
  close: []
  /**
   * Emitted when the dropdown is opened
   */
  open: []
}>()

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
    // we suppress ATTR_FALSE_VALUE as we want to keep
    // `aria-hidden` attribute attached even if the value of it is false
    // in vue2, aria-hidden was removed if the value was false.
    ATTR_FALSE_VALUE: 'suppress-warning',
  },
})

const targetElement: Ref<HTMLElement | null> = ref(null)
const contentElement: Ref<HTMLElement | null> = ref(null)
const dropdownBodyElement: Ref<HTMLElement | null> = ref(null)

const { id: contentElementId } = useUniqueId('sm-dropdown__content_')

const popper = ref<any | null>(null)

const isVisibleRef = ref(false)
const visible = computed({
  get: () => {
    return isVisibleRef.value
  },
  set: (state) => {
    if (state && popper.value === null) {
      if (targetElement.value && contentElement.value && props.fallbackPlacements) {
        popper.value = createPopper(targetElement.value, contentElement.value, {
          placement: props.placement,
          strategy: props.position,
          modifiers: [flip, preventOverflow, arrow],
        })
      } else if (targetElement.value && contentElement.value) {
        popper.value = createPopper(targetElement.value, contentElement.value, {
          placement: props.placement,
          strategy: props.position,
          modifiers: [arrow, preventOverflow],
        })
      }
    }
    isVisibleRef.value = state
  },
})

const toggle = (): void => {
  visible.value = !visible.value
}

const closeMenuOnClick = (): void => {
  if (props.closeOnMenuClick) {
    visible.value = !visible.value
  }
}
const close = (e: MouseEvent): void => {
  if (!dropdownBodyElement.value?.contains(e.target as Node)) {
    visible.value = false
  }
}

const hide = (): void => {
  visible.value = false
}
onMounted(() => {
  window.addEventListener('click', close)
})

onBeforeUnmount(() => {
  if (popper.value) {
    popper.value.destroy()
    popper.value = null
  }
  window.removeEventListener('click', close)
})

onUpdated(async () => {
  if (popper.value) {
    await popper.value.update()
  }
})

watchEffect(() => {
  if (visible.value) {
    /**
     * @event open Triggers when the dropdown is opened
     */
    emit('open')
  } else {
    /**
     * @event close Triggers when the dropdown is closed
     */
    emit('close')
  }

})

defineExpose ({
  targetElement,
  contentElement,
  contentElementId,
  visible,
  toggle,
  closeMenuOnClick,
  dropdownBodyElement,
  hide,
})
</script>

<template>
  <span
    ref="dropdownBodyElement"
    class="sm-dropdown"
    :class="[{
      'sm-dropdown--menu-icon': activeLabel && visible,
      'sm-dropdown--visible': visible,
      [`sm-dropdown--${placement}`]: placement,
    }, rootClass]"
  >

    <span
      ref="targetElement"
      class="sm-dropdown__target"
    >

      <sm-button
        :aria-controls="contentElementId"
        :aria-expanded="visible ? 'true' : 'false'"
        :prefix-icon="prefixIcon"
        :suffix-icon="suffixIcon"
        :type="type"
        :disabled="disabled"
        :class="targetClass"
        :shape="square ? SmButtonShape.SQUARE : null"
        @click="toggle"
      >

        <span class="sm-dropdown__target-content">

          <span
            v-show="activeLabel && visible"
            class="sm-dropdown__active-label sm-text--x-small"
          >
            <!-- @slot A description displayed when the dropdown is open. -->
            <slot name="active-label">{{ activeLabel }}</slot>
          </span>

          <span class="sm-dropdown__label">
            <!-- @slot The dropdown button's content. Overrides the label prop. This slot receives a context object: `{ visible: Boolean }`. Visible indicates whether the menu is currently open. -->
            <slot
              name="label"
              :visible="visible"
            >{{ label }}</slot>
          </span>

        </span>

      </sm-button>

    </span>

    <div
      v-show="visible"
      :id="contentElementId || undefined"
      ref="contentElement"
      :aria-hidden="!visible"
      class="sm-dropdown__content"
      :class="contentClass"
      :style="{ width: width }"
      @click="closeMenuOnClick"
    >
      <span v-if="visible">
        <!-- @slot The dropdown items -->
        <slot :close="() => hide()" />
      </span>
    </div>

  </span>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-dropdown--active-label--text-color: #333;
$sm-dropdown--target--visible--text-color: $grey-neu-black;
$sm-dropdown--target--visible--background-color: $true-white;
$sm-dropdown--target--visible--border-color: #d9dee7;
$sm-dropdown--items--background-color: $true-white;
$sm-dropdown--items--border-color: $sm-dropdown--target--visible--border-color;
$sm-dropdown--target--z-index: $sm-dropdown-target-z-index;

.sm-dropdown {
  position: relative;
  display: inline-block;

  &__target {
    display: inline-block;
  }

  &__content {
    opacity: 0;
    z-index: $sm-dropdown-content-z-index;
    background: $sm-dropdown--items--background-color;
    border: 1px solid $sm-dropdown--items--border-color;
    border-top: none;
    border-radius: 0 0 4px 4px;
    width: 200px;
    pointer-events: none;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 4px;

    &[aria-hidden="true"] {
      visibility: hidden;
    }
  }

  &__target-content {
    display: flex;
  }

  .sm-dropdown__active-label {
    font-weight: 600;
    color: $sm-dropdown--active-label--text-color;
    margin: auto 0;
  }

  &__content .sm-vertical-nav-item {
    border-top: 1px solid $sm-dropdown--items--border-color;
  }

  /**
   * Visible state
   */

  &--menu-icon &__target {
    width: 200px;
    text-align: right;
    position: absolute;
    top: 0;
    right: 0;
    z-index: $sm-dropdown--target--z-index;
  }

  &--visible &__target .sm-button,
  &--visible &__target .sm-button__inner-content {
    width: 100%;
    position: static;
  }

  &--menu-icon.sm-dropdown--visible &__target .sm-button {
    &:hover {
      .sm-button__content {
        color: $sm-dropdown--target--visible--text-color;
        background: $sm-dropdown--target--visible--background-color;
        border: 1px solid $sm-dropdown--target--visible--border-color;
      }
    }
  }

  &--menu-icon &__target .sm-button .sm-button__content {
    width: 100%;
    display: inline-block;
    color: $sm-dropdown--target--visible--text-color;
    background: $sm-dropdown--target--visible--background-color;
    border: 1px solid $sm-dropdown--target--visible--border-color;
    padding: 10px 11px 11px $sm-16;
    height: 42px;
  }

  &--visible &__label {
    margin-left: auto;
  }

  &--visible &__content {
    opacity: 1;
    pointer-events: all;
    text-align: left;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    border-radius: 4px;
    box-shadow: 0 1px 1px -1px rgba(24, 58, 108, 0.14), 0 6px 9px -5px rgba(24, 58, 108, 0.14), 0 5px 11px -5px rgba(24, 58, 108, 0.15);
  }

  &__content[data-popper-placement="top"] {
    margin-bottom: 2px !important;
  }

  &__content[data-popper-placement="bottom"] {
    margin-top: 2px !important;
  }

  &--menu-icon {
    width: $sm-40;
    height: $sm-40;
  }

  &--menu-icon &__content[data-popper-placement="bottom"] {
    margin-top: -2px !important;
    border-radius: 0 0 4px 4px;
  }

  &--menu-icon &__content[data-popper-placement="top"] {
    margin-bottom: -2px !important;
    border-radius: 4px 4px 0 0;
  }
}
</style>
