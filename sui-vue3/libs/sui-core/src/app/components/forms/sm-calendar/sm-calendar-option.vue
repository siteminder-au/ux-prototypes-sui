<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * Whether the option is selected
   */
  active?: boolean
  /**
   * Descriptive label for the option
   */
  ariaLabel?: string
  /**
   * Whether the option is the current date
   */
  current?: boolean
  /**
   * Whether the option is disabled
   */
  disabled?: boolean
  /**
   * Whether the option can be focused via keyboard tab
   */
  focusable?: boolean
  /**
   * Unique ID for the option
   */
  id?: string
  /**
   * Visible label for the option
   */
  label?: string | number
}>(), {
  active: false,
  ariaLabel: undefined,
  current: false,
  disabled: false,
  focusable: false,
  id: undefined,
  label: undefined,
})

defineEmits<{
  /**
   * Emitted when the user navigates to the option via keyboard
   */
  navigate: [value: KeyboardEvent]
  /**
   * Emitted when the option is selected
   */
  select: []
}>()

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
    // we suppress ATTR_FALSE_VALUE as we want to keep
    // `aria-disabled` attribute attached even if the value of it is false
    // in vue2, aria-disabled was removed if the value was false.
    ATTR_FALSE_VALUE: 'suppress-warning',
  },
})
</script>

<template>
  <button
    :id="id"
    class="sm-calendar-option sm-text--small"
    type="button"
    :class="{
      'sm-calendar-option--current': current,
      'sm-calendar-option--active': active,
      'sm-calendar-option--disabled': disabled,
    }"
    :aria-disabled="disabled"
    :tabindex="focusable ? 0 : -1"
    :aria-label="ariaLabel"
    @click="$emit('select')"
    @keydown="(e) => $emit('navigate', e)"
  >
    {{ label }}
  </button>
</template>

<style lang="scss" scoped>
@import "../../../common/variables";
@import "../../../common/mixins";

$sm-calendar-option--background-color: $true-white;
$sm-calendar-option--text-color: $grey-neu-black;
$sm-calendar-option--hover--background-color: $primary-blue-dark;
$sm-calendar-option--hover--text-color: $true-white;
$sm-calendar-option--active--background-color: $primary-blue;
$sm-calendar-option--active--text-color: $true-white;
$sm-calendar-option--active--disabled--background-color: $grey-neu-white;
$sm-calendar-option--current--background-color: $true-white;
$sm-calendar-option--current--border-color: $blue-neu-mid;
$sm-calendar-option--current--text-color: $grey-neu-black;
$sm-calendar-option--disabled--background-color: $true-white;
$sm-calendar-option--disabled--text-color: $grey-neu-mid;
$sm-calendar-option--focused--disabled--background-color: $grey-neu-white;

.sm-calendar-option {
  background-color: $sm-calendar-option--background-color;
  border: 1px solid transparent;
  border-radius: 999px;
  color: $sm-calendar-option--text-color;
  cursor: pointer;
  min-width: 56px;
  padding: 3px $sm-12;
  text-align: center;

  /**
   * Current state
   */
  &--current {
    background-color: $sm-calendar-option--current--background-color;
    border-color: $sm-calendar-option--current--border-color;
    color: $sm-calendar-option--current--text-color;
  }

  /**
   * Active / selected state
   */
  &--active {
    background-color: $sm-calendar-option--active--background-color;
    color: $sm-calendar-option--active--text-color;
  }

  /**
   * Disabled state
   */
  &--disabled {
    background-color: $sm-calendar-option--disabled--background-color;
    border-color: transparent;
    color: $sm-calendar-option--disabled--text-color;
    cursor: not-allowed;
    pointer-events: none;
  }

  &--disabled.sm-calendar-option--current {
    border-color: $sm-calendar-option--current--border-color;
  }

  &--disabled.sm-calendar-option--active {
    background-color: $sm-calendar-option--active--disabled--background-color;
    color: $sm-calendar-option--disabled--text-color;
  }

  /**
   * Hovered state
   * Exclude style from touch devices so it doesn't "stick" on tap
   */
  @media (hover: hover) {
    &:hover {
      background-color: $sm-calendar-option--hover--background-color;
      color: $sm-calendar-option--hover--text-color;
    }
  }

  /**
   * Focus state
   */
  &:focus {
    /* Fallback for browsers that don't support focus-visible */
    background-color: $sm-calendar-option--hover--background-color;
    box-shadow: none;
    color: $sm-calendar-option--hover--text-color;
    outline: 2px solid $grey-neu-black;
    outline-offset: -2px;
  }

  &:focus:not(:focus-visible) {
    /** Remove focus styles on click */
    outline: none;
    box-shadow: none;
  }

  &:focus-visible {
    background-color: $sm-calendar-option--hover--background-color;
    box-shadow: none;
    color: $sm-calendar-option--hover--text-color;
    outline: 2px solid $grey-neu-black;
    outline-offset: -2px;
  }

  &:focus.sm-calendar-option--disabled {
    /* Fallback for browsers that don't support focus-visible */
    background-color: $sm-calendar-option--focused--disabled--background-color;
    color: $sm-calendar-option--disabled--text-color;
  }

  &:focus-visible.sm-calendar-option--disabled {
    background-color: $sm-calendar-option--focused--disabled--background-color;
    color: $sm-calendar-option--disabled--text-color;
  }
}
</style>
