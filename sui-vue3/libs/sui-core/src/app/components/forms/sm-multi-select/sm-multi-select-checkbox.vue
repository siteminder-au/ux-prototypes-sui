<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * Whether the checkbox is selected or not
   */
  checked?: boolean
  /**
   * Whether the checkbox should be visually displayed as indeterminate
   */
  indeterminate?: boolean
  /**
   * Whether the checkbox is disabled
   */
  disabled?: boolean
}>(), {
  checked: false,
  indeterminate: false,
  disabled: false,
})

defineOptions({
  compatConfig: {
    MODE: 3,
  },
})
</script>

<template>
  <div
    :class="{
      'sm-multi-select-checkbox': true,
      'sm-multi-select-checkbox--checked': checked,
      'sm-multi-select-checkbox--disabled': disabled,
      'sm-multi-select-checkbox--indeterminate': indeterminate,
    }"
  >
    <span />
  </div>
</template>

<style lang="scss">
@import "../../../common/variables";

:root {
  /* Port over selected tokens from sui-themes and co-locate them here */

  /* Dropdown - Option checkbox - Default state */
  --sm-c-multi-select-dropdown-option-checkbox-color-border: #828ea3;
  --sm-c-multi-select-dropdown-option-checkbox-color-background: #fff;
  --sm-c-multi-select-dropdown-option-checkbox-color-foreground: transparent;
  --sm-c-multi-select-dropdown-option-checkbox-border-width: 2px;

  /* Dropdown - Option checkbox - Checked state */
  --sm-c-multi-select-dropdown-option-checkbox-color-border-checked: #006add;
  --sm-c-multi-select-dropdown-option-checkbox-color-background-checked: #006add;
  --sm-c-multi-select-dropdown-option-checkbox-color-foreground-checked: #fff;

  /* Dropdown - Option checkbox - Hovered state */
  --sm-c-multi-select-dropdown-option-checkbox-color-border-hover: #006add;
  --sm-c-multi-select-dropdown-option-checkbox-color-background-hover: #fff;
  --sm-c-multi-select-dropdown-option-checkbox-color-foreground-hover: transparent;

  /* Dropdown - Option checkbox - Checked & hovered state */
  --sm-c-multi-select-dropdown-option-checkbox-color-border-checked-hover: #0057b5;
  --sm-c-multi-select-dropdown-option-checkbox-color-background-checked-hover: #0057b5;
  --sm-c-multi-select-dropdown-option-checkbox-color-foreground-checked-hover: #fff;

  /* Dropdown - Option checkbox - Disabled state */
  --sm-c-multi-select-dropdown-option-checkbox-color-border-disabled: #9a9a9a;
  --sm-c-multi-select-dropdown-option-checkbox-color-background-disabled: #f6f6f6;
  --sm-c-multi-select-dropdown-option-checkbox-color-foreground-disabled: transparent;

  /* Dropdown - Option checkbox - Checked & disabled state */
  --sm-c-multi-select-dropdown-option-checkbox-color-border-checked-disabled: #9a9a9a;
  --sm-c-multi-select-dropdown-option-checkbox-color-background-checked-disabled: #f6f6f6;
  --sm-c-multi-select-dropdown-option-checkbox-color-foreground-checked-disabled: #9a9a9a;
}

.sm-multi-select-checkbox {
  background: var(--sm-c-multi-select-dropdown-option-checkbox-color-background);
  border-color: var(--sm-c-multi-select-dropdown-option-checkbox-color-border);
  border-width: var(--sm-c-multi-select-dropdown-option-checkbox-border-width);
  border-style: solid;
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  margin-right: $sm-8;
  margin-top: 2px;
  position: relative;
  width: 18px;
  height: 18px;
  transition: background-color 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease;

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
      background-color: var(--sm-c-multi-select-dropdown-option-checkbox-color-foreground);
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
      transition: background-color 0.3s ease,
        border-color 0.3s ease,
        color 0.3s ease,
        transform 0.3s ease;
    }
  }

  /**
   * Active state
   */
  &--checked {
    background: var(--sm-c-multi-select-dropdown-option-checkbox-color-background-checked);
    border-color: var(--sm-c-multi-select-dropdown-option-checkbox-color-border-checked);

    span::before,
    span::after {
      background-color: var(--sm-c-multi-select-dropdown-option-checkbox-color-foreground-checked);
    }
  }

  /**
   * Indeterminate state
   */
  &--indeterminate {
    background: var(--sm-c-multi-select-dropdown-option-checkbox-color-background-checked);
    border-color: var(--sm-c-multi-select-dropdown-option-checkbox-color-border-checked);

    span {
      transform: none;
    }

    span::before {
      background-color: var(--sm-c-multi-select-dropdown-option-checkbox-color-foreground-checked);
      width: 70%;
      left: 50%;
      top: 50%;
      transform: translateX(-50%);
    }

    span::after {
      display: none;
    }
  }

  /**
   * Hover state
   */
  &:hover {
    background: var(--sm-c-multi-select-dropdown-option-checkbox-color-background-hover);
    border-color: var(--sm-c-multi-select-dropdown-option-checkbox-color-border-hover);

    span::before,
    span::after {
      background-color: var(--sm-c-multi-select-dropdown-option-checkbox-color-foreground-hover);
    }
  }

  &--checked:hover {
    background: var(--sm-c-multi-select-dropdown-option-checkbox-color-background-checked-hover);
    border-color: var(--sm-c-multi-select-dropdown-option-checkbox-color-border-checked-hover);

    span::before,
    span::after {
      background-color: var(--sm-c-multi-select-dropdown-option-checkbox-color-foreground-checked-hover);
    }
  }

  &--indeterminate:hover {
    background: var(--sm-c-multi-select-dropdown-option-checkbox-color-background-checked-hover);
    border-color: var(--sm-c-multi-select-dropdown-option-checkbox-color-border-checked-hover);

    span::before,
    span::after {
      background-color: var(--sm-c-multi-select-dropdown-option-checkbox-color-foreground-checked-hover);
    }
  }

  /**
   * Disabled state
   */
  &.sm-multi-select-checkbox--disabled,
  &.sm-multi-select-checkbox--disabled:hover {
    cursor: not-allowed;
    opacity: 1;
    background: var(--sm-c-multi-select-dropdown-option-checkbox-color-background-disabled);
    border-color: var(--sm-c-multi-select-dropdown-option-checkbox-color-border-disabled);
    border-width: 1px;
    padding: 1px;

    span::before,
    span::after {
      background-color: var(--sm-c-multi-select-dropdown-option-checkbox-color-foreground-disabled);
    }
  }

  &.sm-multi-select-checkbox--disabled.sm-multi-select-checkbox--indeterminate,
  &.sm-multi-select-checkbox--disabled.sm-multi-select-checkbox--checked {
    background: var(--sm-c-multi-select-dropdown-option-checkbox-color-background-checked-disabled);
    border-color: var(--sm-c-multi-select-dropdown-option-checkbox-color-border-checked-disabled);

    span::before,
    span::after {
      background-color: var(--sm-c-multi-select-dropdown-option-checkbox-color-foreground-checked-disabled);
    }
  }
}
</style>
