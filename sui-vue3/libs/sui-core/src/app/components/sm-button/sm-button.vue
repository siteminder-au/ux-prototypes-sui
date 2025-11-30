<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClickedState } from '../use/clicked-state'
import { SmButtonShape, SmButtonSize, SmButtonType } from './sm-button.types'

// We can import from the types file once
// https://github.com/vuejs/core/issues/8301 is resolved
// In the meantime, please keep them in sync
const props = withDefaults(defineProps<{
  /**
   * Native `autofocus`
   */
  autofocus?: boolean
  /**
   * Determine whether it's disabled
   */
  disabled?: boolean
  /**
   * This events include handlers for events that ultimately assign new dates and manage the appearance of the popover in in date-picker component
   */
  eventBinding?: unknown[] | object | number | null
  /**
   * A URL to link to using a native anchor element
   */
  href?: string
  /**
   * Determine whether it's loading
   */
  loading?: boolean
  /**
   * Native `type` - Accepts 'button' / 'submit' / 'reset'
   */
  nativeType?: string
  /**
   * An sm-icon name, to be placed left of the content
   */
  prefixIcon?: string
  /**
   * The button's shape. Accepts: 'round' and 'square'
   */
  shape?: SmButtonShape | null
  /**
   * The size of the button. Accepts: 'large', 'medium', 'small'
   * @deprecated The "mini" size will be deprecated and removed in the future version.
   */
  size?: SmButtonSize
  /**
   * An sm-icon name, to be placed right of the content
   */
  suffixIcon?: string
  /**
   * A `router-link` path or object
   */
  to?: string | object
  /**
   * The style of the button. Accepts 'text', 'primary', 'secondary', 'tertiary', 'success', 'alert', 'warning'
   * @deprecated The "info" type will be deprecated and removed in the future version.
   */
  type?: SmButtonType
}>(), {
  autofocus: false,
  disabled: false,
  eventBinding: null,
  href: undefined,
  loading: false,
  nativeType: 'button',
  prefixIcon: '',
  shape: null,
  size: SmButtonSize.LARGE,
  suffixIcon: '',
  to: undefined,
  type: SmButtonType.DEFAULT,
})

defineEmits<{
  /** Native click */
  click: [e: MouseEvent]
  /** Native hover */
  mouseover: [e: MouseEvent]
  /** Native hover out */
  mouseout: [e: MouseEvent]
  /** Native focusin */
  focusin: [e: FocusEvent]
  /** Native focusout */
  focusout: [e: FocusEvent]
}>()

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
    // In particular, sm-wizard's built-in buttons have aria-disabled/disabled attribute
    ATTR_FALSE_VALUE: 'suppress-warning',
  },
})

const { isClicked, onMousedown } = useClickedState()

const tagName = computed(() => {

  if (props.to) return 'router-link'
  if (props.href) return 'a'

  return 'button'

})

const customsEvents = ref(props.eventBinding)
</script>

<template>
  <component
    :is="tagName"
    class="sm-button"
    :to="to"
    :href="disabled ? null : href"
    :type="tagName === 'button' ? nativeType : null"
    :disabled="disabled"
    :autofocus="autofocus"
    :class="{
      'sm-button--clicked': isClicked,
      'sm-button--disabled': disabled,
      'sm-button--loading': loading,
      [`sm-button--shape_${shape}`]: !!shape,
      [`sm-button--type-${type}`]: !!type,
      [`sm-button--size-${size}`]: !!size,
    }"
    @click="$emit('click', $event)"
    @focusin="$emit('focusin', $event)"
    @focusout="$emit('focusout', $event)"
    @mouseover="$emit('mouseover', $event)"
    @mouseout="$emit('mouseout', $event)"
    @mousedown="onMousedown"
    v-on="customsEvents ? customsEvents : {}"
  >
    <span
      class="sm-button__content"
      tabindex="-1"
    >
      <span
        v-if="prefixIcon"
        class="sm-button__prefix-icon"
      >
        <!-- TODO: convert this so we don't depend on sm-icon https://siteminder-jira.atlassian.net/browse/SUI-2065 -->
        <sm-icon :name="prefixIcon" />
      </span>

      <span
        class="sm-button__inner-content"
        :class="{ 'sm-button__inner-content-loading': loading }"
      >
        <!-- @slot The button content -->
        <slot />
      </span>

      <span
        v-if="suffixIcon"
        class="sm-button__suffix-icon"
      >
        <!-- TODO: convert this so we don't depend on sm-icon https://siteminder-jira.atlassian.net/browse/SUI-2065 -->
        <sm-icon :name="suffixIcon" />
      </span>

      <span
        v-if="$slots.badge"
        class="sm-button__badge"
      >
        <slot name="badge" />
      </span>
      <div
        v-if="loading"
        class="sm-button__loading-spinner"
        :class="{
          [`sm-button__loading-spinner--type-${type}`]: !!type,
          'sm-button__loading-spinner--disabled': disabled,
        }"
      >
        <svg
          viewBox="25 25 50 50"
          class="circular"
        >
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            class="path"
          />
        </svg>
      </div>
    </span>
  </component>
</template>

<style lang="scss">
@import './../../common/variables';
@import './../../common/mixins';
@import './variables/base-types';

$y-padding: var(--sm-c-button-padding-y, 9px);
$x-padding: var(--sm-c-button-padding-x, 23px);
$sm-button--disabled--border-color: var(--sm-c-button-color-border-disabled, var(--color-disabled-mid, $grey-neu-med));
$sm-button--disabled--text-color: var(--sm-c-button-color-text-disabled, var(--color-disabled, $grey-neu-mid));
$sm-button--disabled--background-color: var(--sm-c-button-color-background-disabled, var(--color-disabled-light, $grey-neu-white));
$sm-button--loading-spinner-color: var(--sm-c-button-color-icon-loading-default, var(--color-primary, $primary-blue));
$sm-button--loading-spinner-color--disabled: var(--sm-c-button-color-icon-loading-disabled, var(--color-disabled, $grey-neu-mid));
$sm-button--tertiary-icon-color: $primary-blue;

.sm-button {
  vertical-align: top;
  display: inline-block;
  cursor: pointer;
  font-size: var(--sm-c-button-font-size-large, var(--p-lg-font-size, 15px));
  line-height: var(--sm-c-button-line-height-large, 18px);
  font-weight: var(--sm-c-button-font-weight-large, var(--font-weight-regular, 400));
  letter-spacing: var(--sm-c-button-letter-spacing-large, var(--p-lg-letter-spacing, -0.2px));
  background: none;
  border: none;
  padding: 0;
  outline: none;
  box-shadow: none;
  font-family: inherit;
  font-style: normal;
  position: relative;

  + .sm-button {
    margin-left: $sm-12;

    @media #{$small-desktop} {
      margin-left: $sm-24;
    }
  }

  &__content {
    display: inline-flex;
    padding: $y-padding $x-padding;
    box-shadow: none;
    border-width: var(--sm-c-button-border-width-large, 2px);
    border-style: solid;
    border-color: transparent;
    border-radius: var(--sm-c-button-border-radius, var(--border-radius-sm, 4px));
    width: 100%;
    transition:
        color 0.3s ease,
        background 0.3s ease;

    &:focus {
      outline: none;
      box-shadow: none !important;
    }
  }

  &__badge {
    position: relative;

    .sm-badge {
      position: absolute;
    }

    .sm-badge--size_small {
      top: -18px;
      left: 18px;
    }

    .sm-badge--size_medium {
      top: -18px;
      left: 14px;
    }
  }

  &--size-medium {
    .sm-badge--size_small {
      top: -14px;
      left: 14px;
    }

    .sm-badge--size_medium {
      top: -18px;
      left: 10px;
    }
  }

  &--size-small {
    .sm-badge--size_small {
      top: -12px;
      left: 10px;
    }

    .sm-badge--size_medium {
      top: -16px;
      left: 6px;
    }
  }

  &--size-mini {
    .sm-badge--size_small {
      top: -12px;
      left: 5px;
    }

    .sm-badge--size_medium {
      top: -18px;
      left: 2px;
    }
  }

  /* Icons */
  &__prefix-icon,
  &__suffix-icon {
    margin-bottom: -0.1em; // Offset the lineheight
  }

  &__prefix-icon { margin-right: 0.35em; }
  &__suffix-icon { margin-left: 0.35em; }

  /* Sizes */
  &--size-medium &__content {
    padding: calc($y-padding * 0.8) calc($x-padding * 0.8);
    font-size: var(--sm-c-button-font-size-medium, var(--p-sm-font-size, 13px));
    letter-spacing: var(--sm-c-button-letter-spacing-medium, var(--p-sm-letter-spacing, -0.1px));
  }

  &--size-small &__content {
    padding: calc($y-padding * 0.6) calc($x-padding * 0.6);
    font-size: var(--sm-c-button-font-size-small, var(--p-xs-font-size, 12px));
    letter-spacing: var(--sm-c-button-letter-spacing-small, 0.2px);
  }

  &--size-mini &__content {
    padding: calc($y-padding * 0.4) calc($x-padding * 0.4);
    font-size: var(--sm-c-button-font-size-mini, 10px);
  }

  /* Shape */
  &--shape_square &__content {
    position: relative;
    width: 40px;
    height: 40px;
    font-size: var(--sm-c-button-font-size-square, var(--font-size-base, 15px));
    padding: 0;
    border-radius: var(--sm-c-button-border-radius-square, var(--border-radius-sm, 4px));
    vertical-align: middle;
  }

  &__inner-content {
    text-align: center;
  }

  &--shape_square &__inner-content {
    position: absolute;
    top: calc(50% + 1px);
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &--shape_square.sm-button--size-medium &__content {
    width: 28px;
    height: 28px;
  }

  &--shape_round &__content {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: var(--sm-c-button-border-radius-round, var(--border-radius-xlg, 50%));
    font-size: var(--sm-c-button-font-size-round, var(--font-size-base, 15px));
    padding: 0;
    vertical-align: middle;
  }

  &--shape_round &__inner-content {
    position: absolute;
    top: calc(50% + 1px);
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &--shape_round.sm-button--size-medium &__content {
    width: 28px;
    height: 28px;
  }

  &--shape_square.sm-button--type-tertiary &__content {
    color: var(--sm-c-button-color-icon-tertiary-square, var(--color-primary, $sm-button--tertiary-icon-color));

    &:hover, &:focus {
      color: var(--sm-c-button-color-icon-tertiary-square, var(--color-primary, $sm-button--tertiary-icon-color));
    }
  }

  &--shape_round.sm-button--type-tertiary &__content {
    color: var(--sm-c-button-color-icon-tertiary-round, var(--color-primary, $sm-button--tertiary-icon-color));

    &:hover, &:focus {
      color: var(--sm-c-button-color-icon-tertiary-round, var(--color-primary, $sm-button--tertiary-icon-color));
    }
  }

  &--type-text,
  &--type-text-success,
  &--type-text-warning,
  &--type-default {
    .sm-button__content {
      padding-left: var(--sm-c-button-padding-text-left, 8px);
      padding-right: var(--sm-c-button-padding-text-right, 8px);
    }
  }

  &--type-tertiary &__content {
    border-width: var(--sm-c-button-border-width-tertiary, 1px);
    padding-top: calc($y-padding + 1px);
    padding-bottom: calc($y-padding + 1px);
    box-shadow: var(--sm-c-button-shadow-tertiary, 0 1px 1px 0 rgba(0, 57, 85, 0.19)) !important;
  }

  &--type-tertiary.sm-button--size-medium &__content {
    padding-top: calc($y-padding * 0.8 + 1px);
    padding-bottom: calc($y-padding * 0.8 + 1px);
  }

  &--type-tertiary.sm-button--size-small &__content {
    padding-top: calc($y-padding * 0.6 + 1px);
    padding-bottom: calc($y-padding * 0.6 + 1px);
  }

  &--type-tertiary.sm-button--size-mini &__content {
    padding-top: calc($y-padding * 0.4 + 1px);
    padding-bottom: calc($y-padding * 0.4 + 1px);
  }

  /* Base Types */
  @each $type in 'default', 'primary', 'secondary', 'tertiary', 'info', 'success', 'alert', 'warning', 'text', 'text-warning', 'text-success', 'secondary-warning', 'secondary-success' {

    &--type-#{$type} {
      .sm-button__content {
        border-color: map-get($sm-button--border-color, $type);
        color: map-get($sm-button--text-color, $type);
        background: map-get($sm-button--background-color, $type);
      }

      &:hover .sm-button__content {
        border-color: map-get($sm-button--border-color, #{$type}#{'-hover'});
        color: map-get($sm-button--text-color, #{$type}#{'-hover'});
        background: map-get($sm-button--background-color, #{$type}#{'-hover'});
      }

      &:focus .sm-button__content  {
        border-color: map-get($sm-button--border-color, #{$type}#{'-focus'});
        color: map-get($sm-button--text-color, #{$type}#{'-focus'});
        background: map-get($sm-button--background-color, #{$type}#{'-focus'});
      }

      &.sm-button--clicked .sm-button__content {
        border-color: map-get($sm-button--border-color, #{$type}#{'-clicked'});
        color: map-get($sm-button--text-color, #{$type}#{'-clicked'});
        background: map-get($sm-button--background-color, #{$type}#{'-clicked'});
      }

    }

  }

  .sm-button--shape-square &__content {
    background: rgba(#000, 0.25);
  }

  /* Focus State */
  &:focus,
  &__content {
    outline: none;
    box-shadow: none; // Remove global outline styles
  }

  /* Clicked State */
  &--clicked {
    transition: all 0.1s ease;
  }

  /* Disabled State */
  &--disabled {
    pointer-events: none;

    .sm-button__content {
      color: $sm-button--disabled--text-color !important;
      background: $sm-button--disabled--background-color !important;
      border-color: $sm-button--disabled--border-color !important;
      cursor: not-allowed;
      border-width: var(--sm-c-button-border-width-disabled, 1px);
    }

    &.sm-button--type-text,
    &.sm-button--type-text-success,
    &.sm-button--type-text-warning {
      .sm-button__content {
        background: none !important;
        border-color: transparent !important;
        padding-left: 9px !important;
        padding-right: 9px !important;
      }
    }

    &:not(.sm-button--type-tertiary):not(.sm-button--shape_round):not(.sm-button--shape_square) {
      .sm-button__content {
        padding: calc($y-padding + 1px) calc($x-padding + 1px);
      }

      &.sm-button--size-medium .sm-button__content {
        padding: calc($y-padding * 0.8 + 1px) calc($x-padding * 0.8 + 1px);
      }

      &.sm-button--size-small .sm-button__content {
        padding: calc($y-padding * 0.6 + 1px) calc($x-padding * 0.6 + 1px);
      }

      &.sm-button--size-mini .sm-button__content {
        padding: calc($y-padding * 0.4 + 1px) calc($x-padding * 0.4 + 1px);
      }
    }
  }

  /* Loading State */
  &--loading {
    cursor: wait;
    opacity: 0.8;
  }

  &__inner-content-loading {
    opacity: 0.1;
  }

  &__loading-spinner {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .circular {
      height: 16px;
      width: 16px;
      animation: sm-button-loading-rotate 2s linear infinite;
    }

    .path {
      animation: sm-button-loading-dash 1.5s ease-in-out infinite;
      stroke-width: 5;
      stroke: $sm-button--loading-spinner-color;
      stroke-dasharray: 90, 150;
      stroke-dashoffset: 0;
    }

    /* Loading */
    @each $type in (primary, success, alert, info, warning, 'secondary-success', 'secondary-warning', 'text-success', 'text-warning') {
      &--type-#{$type} {
        .path {
          stroke: map-get($--sm-c-button-color-loading, $type);
        }
      }
    }

    &--disabled {
      .path {
        stroke: $sm-button--loading-spinner-color--disabled;
      }
    }
  }

  @keyframes sm-button-loading-rotate {
    to {
      transform: rotate(1turn);
    }
  }

  @keyframes sm-button-loading-dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -40px;
    }

    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -120px;
    }
  }
}

// NOTE: sm-button has its own focus styling
// TODO: consider removing bespoke sm-button custom styling
// and have a single css focus style for all interactive elements
// see: https://siteminder-jira.atlassian.net/browse/SUI-1712
a:focus.sm-button,
button:focus.sm-button
{
  box-shadow: none;
}
</style>
