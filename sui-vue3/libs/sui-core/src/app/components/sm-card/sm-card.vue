<script setup lang="ts">
import { SmCardType, SmCardTheme } from './sm-card.types'

withDefaults(defineProps<{
  /**
   * The Vue Component or HTML Element to use for the card
   */
  tag?: string
  /**
   * Shows the card is in an editing state
   */
  editing?: boolean
  /**
   * A vue-router route object to be used when the `tag` is set to `router-link`
   */
  to?: string | object
  /**
   * When the card is disabled
   */
  disabled?: boolean
  /**
   * When the card is interactive show hover state
   */
  interactive?: boolean
  /**
   * Whether to show card border on top
   */
  showBorderOnTop?: boolean
  /**
   * Whether to show card border on top, Accepts: 'bright', 'light'
   */
  theme?: SmCardTheme | null
  /**
   * When the card is in selected state
   */
  selected?: boolean
  /**
   * The colour of the Card. Accepts: warning
   */
  type?: SmCardType | null
  /**
   * A custom class to apply on the card element to override child elements styles
   */
  rootClass?: string
}>(), {
  tag: 'div',
  editing: false,
  to: undefined,
  disabled: false,
  interactive: true,
  showBorderOnTop: true,
  theme: null,
  selected: false,
  type: null,
  rootClass: '',
})

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
  },
})
</script>

<template>
  <component
    :is="tag"
    :to="to"
    class="sm-card"
    :class="{
      'sm-card--editing': editing,
      'sm-card--disabled': disabled,
      'sm-card--interactive': interactive,
      'sm-card--topBorder' : showBorderOnTop,
      'sm-card--selected' : selected,
      [`sm-card--theme-${theme}`]: !!theme,
      [`sm-card--type-${type}`]: !!type,
      [`${rootClass}`] : !!rootClass
    }"
  >
    <!-- @slot The body of the card. Place <code>sm-card-actions</code>, <code>sm-card-content</code>, <code>sm-card-brand-graphic</code>, <code>sm-card-footer</code> and <code>sm-card-graphic</code> components here -->
    <slot />
  </component>
</template>

<style lang="scss">
@import "../../common/variables";

$sm-card--bright--background-color: $blue-neu-light;
$sm-card--border-color: #c6ceda;
$sm-card--text-color: $grey-neu-black;
$sm-card--background-color: $true-white;
$sm-card--dark--text-color: $true-white;
$sm-card--editing--text-color: $sm-card--text-color;
$sm-card--disabled--background-color: $blue-neu-light;
$sm-card--top-border-color: $blue-neu-dark;
$sm-card--hover--top-border-color: $primary-blue;
$sm-card--editing--background-color: $blue-neu-light;
$sm-card--warning-type--border-color: $app-warning;
$sm-card--warning-type--background-color: $app-warning-light;

.sm-card {
  border: 1px solid $sm-card--border-color;
  color: $sm-card--text-color;
  background: $sm-card--background-color;
  transition: all 0.5s ease;
  position: relative;
  display: flex;
  flex-flow: row wrap;

  /** Generic border radius */
  &,
  > *:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &,
  > *:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  /** Optimized border radius */
  > .sm-card-graphic:first-child,
  > .sm-card-brand-graphic:first-child {
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
  }

  > .sm-card-graphic:last-child,
  > .sm-card-brand-graphic:last-child,
  > .sm-card-footer:last-child {
    border-bottom-left-radius: 7px;
    border-bottom-right-radius: 7px;
  }

  &--topBorder {
    border-top: 2px solid $sm-card--top-border-color;

    .sm-card-brand-graphic__background-color {
      background-position: right bottom;
    }
  }

  &--theme-bright {
    background: $sm-card--bright--background-color;

    .sm-card-footer {
      background: $sm-card--background-color;
    }

    .sm-card-content {
      width: 65%;
    }

    .sm-card-brand-graphic__background-color {
      background-position: right center;
    }
  }

  &--theme-light {
    background: $sm-card--background-color;

    // override the style as per the theme type
    .sm-card-footer {
      background: transparent;
      padding-top: 0;
    }

    .sm-card-content {
      width: 65%;
    }

    .sm-card-brand-graphic__background-color {
      background-position: right bottom;
    }
  }

  .sm-card-brand-graphic--dark ~ .sm-card-content {
    color: $sm-card--dark--text-color;
  }

  /* Editing State */
  &--editing {
    color: $sm-card--editing--text-color;
    background: $sm-card--editing--background-color;

    .sm-card-actions {
      .sm-button--shape_square {
        .sm-button__content {
          // Overridden by parent style
          background: transparent !important;
        }
      }
    }
  }

  &--selected {
    background: $sm-card--editing--background-color;
  }

  /* disabled State */
  &--disabled {
    background: $sm-card--disabled--background-color;
    opacity: 0.5;
  }

  /* Hover State */
  &--interactive:hover,
  &--interactive:focus,
  &--editing {
    color: inherit;
    text-decoration: none;
    box-shadow:
      0 3px 17px -8px rgba(24, 58, 108, 0.19),
      0 12px 11px -13px rgba(24, 58, 108, 0.18),
      0 10px 24px -9px rgba(24, 58, 108, 0.12);
    border-top-color: $sm-card--hover--top-border-color;

    &.sm-card--dark {
      color: $sm-card--dark--text-color;
    }
  }

  &:not(.sm-card--noninteractive):hover,
  &:not(.sm-card--noninteractive):focus {
    color: inherit;
    text-decoration: none;

    &.sm-card--dark {
      color: $sm-card--dark--text-color;
    }
  }

  &:not(.sm-card--topBorder) {
    border-top-color: $sm-card--border-color;
  }

  &--type-warning {
    border-top: 2px solid $sm-card--warning-type--border-color;
    background: $sm-card--warning-type--background-color;

    &:hover, &:focus{
      border-top: 2px solid $sm-card--warning-type--border-color;
    }
  }

  .sm-card-brand-graphic ~ .sm-card-content {
    // Position content on top of background image
    z-index: $sm-card-z-index;
  }
}
</style>
