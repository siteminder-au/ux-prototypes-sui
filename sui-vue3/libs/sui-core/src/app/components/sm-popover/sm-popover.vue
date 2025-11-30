<script setup lang="ts">
import { first } from 'lodash-es'
import {
  onMounted,
  ref,
  watchEffect,
  onUpdated,
  computed,
  onBeforeUnmount,
  Ref,
  VNode,
} from 'vue'
import { Instance, createPopperLite as createPopper, flip, arrow, preventOverflow } from '@popperjs/core'
import { useUniqueId } from '../use/unique-id'
import { SmPopoverPlacement, SmPopoverPosition, SmPopoverTextAlign, SmPopoverTrigger, SmPopoverType } from './sm-popover.types'

const props = withDefaults(defineProps<{
  /**
   * Determines whether the popover should be appended to the body element.
   * If true, the popover will be rendered outside of its parent container, directly attached to the body.
   * This can be useful for avoiding clipping issues caused by overflow or z-index constraints.
   */
  appendToBody?: boolean
  /**
   * Close the popover automatically when the user clicks outside of the popover
   */
  closeOnClickOutside?: boolean
  /**
   * Whether the popover will change the placement when it doesn't fit the boundary.
   * For instance, if the popover is set to bottom, but it doesn't fit, opposite top placement will be used.
   * See https://popper.js.org/docs/v2/modifiers/flip/ for more details.
   */
  fallbackPlacements?: boolean
  /**
   * Whether to turn off the popover closing and opening transition, default: all 0.3s ease
   */
  isTransition?: boolean
  /**
   * Whether the popover is visible on the page load
   */
  isVisible?: boolean
  /**
   * The side of the target element the popover should be placed against. Accepts 'top', 'right', 'bottom' and 'left'
   */
  placement?: SmPopoverPlacement
  /**
   * Whether to use `fixed` or `absolute` positioning. Absolute is more performant if you have a lot of popovers; fixed is more robust
   */
  position?: SmPopoverPosition
  /**
   * Whether to show component on top of all components by setting the highest z-index
   */
  showOnTop?: boolean
  /**
   * The text alignment of the popover content should be placed against. Accepts 'center', 'right' and 'left'
   */
  textAlign?: SmPopoverTextAlign
  /**
   * The title of the popover
   */
  title?: string
  /**
   * The input event which causes the popover to show. Accepts 'click' and 'hover'
   */
  trigger?: SmPopoverTrigger
  /**
   * The style of the popover. Accepts 'info', 'success', 'alert', 'warning'
   */
  type?: SmPopoverType | null
}>(), {
  appendToBody: false,
  closeOnClickOutside: true,
  fallbackPlacements: true,
  isTransition: true,
  isVisible: false,
  placement: SmPopoverPlacement.BOTTOM,
  position: SmPopoverPosition.ABSOLUTE,
  showOnTop: false,
  textAlign: SmPopoverTextAlign.LEFT,
  title: '',
  trigger: SmPopoverTrigger.CLICK,
  type: null,
})

const emit = defineEmits<{
  /**
   * Triggers when the dropdown is closed
   */
  close: []
  /**
   * Triggers when the dropdown is opened
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
const timer = ref<NodeJS.Timeout | null>(null)
const isInfoPopOver = ref(false)

const isVisibleRef = ref(props.isVisible)
const popper = ref<Instance | null>(null)
const visible = computed({
  get: () => {
    return isVisibleRef.value
  },
  set: (state) => {
    if (state && !props.isVisible && popper.value === null && targetElement.value && contentElement.value) {
      if (props.fallbackPlacements) {
        popper.value = createPopper(targetElement.value, contentElement.value, {
          placement: props.placement,
          strategy: props.position,
          modifiers: [flip, preventOverflow, arrow],
        })
      } else {
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

/**
 * defineSlots macro used to declare expected slots and their respective expected slot
 */
const slots = defineSlots<{
  close?: () => VNode[]
  content?: (props: { close: () => void }) => VNode[]
  default?: () => VNode[]
}>()

const computedVisible = computed(() => {
  return visible.value && (props.title || slots.content)
})

const onHover = (): void => {
  if (props.trigger === SmPopoverTrigger.HOVER || props.trigger === SmPopoverTrigger.FOCUS) {
    timer.value = setTimeout(() => {
      visible.value = true
    }, 600)
  }
}

const hide = (): void => {
  visible.value = false
}

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

const onLeave = (): void => {
  if (props.trigger === SmPopoverTrigger.HOVER || props.trigger === SmPopoverTrigger.FOCUS) {
    if (timer.value) {
      clearTimeout(timer.value)
    }

    timer.value = setTimeout(() => {
      if (!isInfoPopOver.value) {
        visible.value = false
      }
    }, 200)
  }
}
const onInfoHover = (): void => {
  if (props.trigger === SmPopoverTrigger.HOVER || props.trigger === SmPopoverTrigger.FOCUS) {
    isInfoPopOver.value = true
  }
}
const onInfoLeave = (): void => {
  if (props.trigger === SmPopoverTrigger.HOVER || props.trigger === SmPopoverTrigger.FOCUS) {
    isInfoPopOver.value = false
    onLeave()
  }
}

const onClick = (): void => {
  if (props.trigger === SmPopoverTrigger.CLICK) {
    visible.value = !visible.value
  }
}

const onClickOutside = (e: MouseEvent): void => {
  if (
    props.closeOnClickOutside
    // Check if the click happened inside the popover
    && !contentElement.value?.contains(e.target as Node)
    // Check if the click happened inside the button
    && !targetElement.value?.contains(e.target as Node)
  ) {
    visible.value = false
  }
}
watchEffect(() => {
  if (computedVisible.value) {
    document.addEventListener('click', onClickOutside)
  } else {
    document.removeEventListener('click', onClickOutside)
  }
})
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

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

const { id: contentElementId } = useUniqueId('sm-popover__content_')

const setTargetElementAriaDescribedBy = (): void => {
  const targetElementFirstChild = first(targetElement.value?.children)

  if (
    targetElementFirstChild
    && targetElementFirstChild.getAttribute('aria-describedby') === null
  ) {
    targetElementFirstChild.setAttribute(
      'aria-describedby',
      contentElementId.value ?? '',
    )
  }
}

onMounted(setTargetElementAriaDescribedBy)
watchEffect(setTargetElementAriaDescribedBy)

defineExpose({
  targetElement,
  contentElement,
  contentElementId,
  computedVisible,
  onHover,
  onClick,
  onLeave,
  onInfoHover,
  onInfoLeave,
  visible,
  hide,
})
</script>

<template>
  <span
    class="sm-popover"
    :class="{
      'sm-popover--visible': computedVisible,
      [`sm-popover--placement-${placement}`]: !!placement,
      'sm-visible-on-top': showOnTop,
    }"
  >
    <div
      ref="targetElement"
      class="sm-popover__target"
      @mouseenter="onHover"
      @mouseleave="onLeave"
      @click="onClick"
      @focusin="onHover"
      @focusout="onLeave"
    >
      <!-- @slot The popover target. For example, an `sm-button` component. -->
      <slot />
    </div>

    <teleport
      :disabled="!appendToBody"
      to="body"
    >
      <span
        v-show="computedVisible"
        :id="contentElementId || undefined"
        ref="contentElement"
        :aria-hidden="!computedVisible"
        class="sm-popover__content"
        :class="{
          'sm-popover__content--visible': appendToBody && computedVisible,
          [`sm-popover__content--${textAlign}`]: !!textAlign,
          [`sm-popover--type-${type}`]: !!type,
          'sm-popover--has-transition': isTransition,
        }"
        role="popover"
        @mouseleave="onInfoLeave"
        @mouseenter="onInfoHover"
        @focusin="onInfoHover"
        @focusout="onInfoLeave"
      >
        <!-- @slot The dropdown close button here -->
        <span v-if="computedVisible">
          <span
            v-if="$slots.close"
            @click="hide"
          >
            <slot name="close" />
          </span>
          <!-- @slot The popover content. Overrides the title prop. -->
          <slot
            name="content"
            :close="() => hide()"
          >{{ title }}</slot>
        </span>
        <span
          data-popper-arrow
          class="sm-popover__arrow"
        />
      </span>
    </teleport>
  </span>
</template>

<style lang="scss" scoped>
@import "../../common/variables";

$sm-popover--light--text-color: $grey-neu-black;
$sm-popover--light--background-color: $true-white;
$sm-popover--light--border-color: $light-blue-grey;
$sm-popover--type--info: $primary-blue;
$sm-popover--type--alert: $app-alert;
$sm-popover--type--warning: $app-warning;
$sm-popover--type--success: $app-success;

.sm-popover {
  &__content {
    padding: $sm-16 15px;
    border-radius: 4px;
    background: $sm-popover--light--background-color;
    color: $sm-popover--light--text-color;
    pointer-events: none;
    white-space: nowrap;
    z-index: $sm-popover-z-index;
    white-space: initial;

    &--center {
      text-align: center;
    }

    &--left {
      text-align: left;
    }

    &--right {
      text-align: right;
    }

    &[aria-hidden="true"] {
      visibility: hidden;
    }

    &--visible {
      pointer-events: all;
    }

    &--visible.sm-popover--has-transition {
      -webkit-animation: popoverFadeIn 0.3s;
      animation: popoverFadeIn 0.3s;
    }
  }

  &--visible &--has-transition {
    -webkit-animation: popoverFadeIn 0.3s;
    animation: popoverFadeIn 0.3s;
  }

  &--visible &__content {
    pointer-events: all;
  }

  $arrow-size: 12px;

  &__arrow {
    display: inline-block;

    &::after {
      content: "";
      width: $arrow-size;
      height: $arrow-size;
      background: $sm-popover--light--background-color;
      border: 1px solid $sm-popover--light--background-color;
      transform: translate(-50%, -50%) rotate(45deg);
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  &__content[data-popper-placement="top"] {
    margin-bottom: $arrow-size !important;
  }

  &__content[data-popper-placement="right"] {
    margin-left: $arrow-size !important;
  }

  &__content[data-popper-placement="bottom"] {
    margin-top: $arrow-size !important;
  }

  &__content[data-popper-placement="left"] {
    margin-right: $arrow-size !important;
  }

  &__content[data-popper-placement="top"] &__arrow {
    bottom: 0;
  }

  &__content[data-popper-placement="right"] &__arrow {
    left: 0;
  }

  &__content[data-popper-placement="bottom"] &__arrow {
    top: 0;
  }

  &__content[data-popper-placement="left"] &__arrow {
    right: 0;
  }

  &__content {
    background: $sm-popover--light--background-color;
    border: 1px solid $sm-popover--light--border-color;
    color: $sm-popover--light--text-color;
    box-shadow: 0 1px 1px -1px rgba(24, 58, 108, 0.14), 0 6px 9px -5px rgba(24, 58, 108, 0.14), 0 5px 11px -5px rgba(24, 58, 108, 0.15);
  }

  &__arrow::after {
    border: 1px solid $sm-popover--light--border-color;
    background: $sm-popover--light--background-color;
  }

  &__content[data-popper-placement="top"] &__arrow {
    bottom: -1px;

    &::after {
      border-top: none;
      border-left: none;
    }
  }

  &__content[data-popper-placement="right"] &__arrow {
    left: -1px;

    &::after {
      border-top: none;
      border-right: none;
    }
  }

  &__content[data-popper-placement="bottom"] &__arrow {
    top: -1px;

    &::after {
      border-bottom: none;
      border-right: none;
    }
  }

  &__content[data-popper-placement="left"] &__arrow {
    right: -1px;

    &::after {
      border-bottom: none;
      border-left: none;
    }
  }

  &--type {
    &-info {
      border-top: 2px solid $sm-popover--type--info;
    }

    &-alert {
      border-top: 2px solid $sm-popover--type--alert;
    }

    &-warning {
      border-top: 2px solid $sm-popover--type--warning;
    }

    &-success {
      border-top: 2px solid $sm-popover--type--success;
    }
  }

  &--type-info[data-popper-placement="bottom"] &__arrow {
    &::after {
      border-top: 2px solid $sm-popover--type--info;
      border-left: 2px solid $sm-popover--type--info;
    }
  }

  &--type-alert[data-popper-placement="bottom"] &__arrow {
    &::after {
      border-top: 2px solid $sm-popover--type--alert;
      border-left: 2px solid $sm-popover--type--alert;
    }
  }

  &--type-warning[data-popper-placement="bottom"] &__arrow {
    &::after {
      border-top: 2px solid $sm-popover--type--warning;
      border-left: 2px solid $sm-popover--type--warning;
    }
  }

  &--type-success[data-popper-placement="bottom"] &__arrow {
    &::after {
      border-top: 2px solid $sm-popover--type--success;
      border-left: 2px solid $sm-popover--type--success;
    }
  }
}

@-webkit-keyframes popoverFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes popoverFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
