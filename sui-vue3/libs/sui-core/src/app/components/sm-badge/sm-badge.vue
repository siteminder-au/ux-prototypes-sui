<script setup lang="ts">
import { SmBadgeLightThemeType, SmBadgeSize, SmBadgeType } from './sm-badge.types'

withDefaults(defineProps<{
  /**
   * Whether the badge is disabled
   */
  disabled?: boolean
  /**
   * The light theme badge. Accepts: success, info, warning, alert
   */
  lightThemeType?: SmBadgeLightThemeType | null
  /**
   * The size of the badge. Accepts: medium, small, large
   */
  size?: SmBadgeSize
  /**
   * The colour of the badge. Accepts: success, info, warning, alert
   */
  type?: SmBadgeType
}>(), {
  disabled: false,
  lightThemeType: null,
  size: SmBadgeSize.SMALL,
  type: SmBadgeType.WARNING,
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
  <span
    class="sm-badge"
    :class="{
      [`sm-badge--type-${type}`]: !!type,
      [`sm-badge--size_${size}`]: !!size,
      [`sm-badge--light-type-${lightThemeType}`]: !!lightThemeType,
      'sm-badge--disabled': disabled,
      'sm-badge--light-disabled': disabled && !!lightThemeType,
    }"
  >

    <span class="sm-badge__content">
      <!-- @slot The content of the badge -->
      <slot />
    </span>

  </span>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-badge--light-disabled--background-color: var(--sm-c-badge-color-background-light-disabled, $grey-neu-light);
$sm-badge--disabled--text-color: var(--color-black, $grey-neu-black);
$sm-badge--disabled--background-color: var(--sm-c-badge-color-background-disabled, var(--color-disabled-mid, $grey-neu-med));
$sm-badge--text-color: var(--color-disabled-light, $grey-neu-white);
$sm-badge--info--background-color: var(--sm-c-badge-color-background-info, var(--color-info, $primary-blue));
$sm-badge--success--background-color: var(--sm-c-badge-color-background-success, var(--color-success, $app-success));
$sm-badge--warning--background-color: var(--sm-c-badge-color-background-warning, var(--color-warning, $app-warning));
$sm-badge--alert--background-color: var(--sm-c-badge-color-background-alert, var(--color-alert, $app-alert));
$sm-badge--light-info--background-color: var(--sm-c-badge-color-background-light-info, var(--color-info-light, $app-info-light));
$sm-badge--light-success--background-color: var(--sm-c-badge-color-background-light-success, var(--color-success-light, $app-success-light));
$sm-badge--light-success--text: var(--sm-c-badge-color-text-light-success, var(--color-success, $app-success));
$sm-badge--light-warning--background-color: var(--sm-c-badge-color-background-light-warning, var(--color-warning-light, $app-warning-light));
$sm-badge--light-warning--text: var(--sm-c-badge-color-text-light-warning, var(--color-warning, $app-warning));
$sm-badge--light-alert--background-color: var(--sm-c-badge-color-background-light-alert, var(--color-alert-light, $app-alert-light));
$sm-badge--light--text: var(--color-black, $grey-neu-black);

.sm-badge {
  font-size: 12px;
  display: inline-block;
  height:12px;
  width:12px;
  border-radius: 50%;
  background: $sm-badge--warning--background-color;

  + .sm-badge {
    margin-left: 13px;
    text-align: center;
  }

  &__content {
    line-height: 1;
    color: $sm-badge--text-color;
    padding-top: 1px;
    text-transform: var(--sm-c-badge-text-transform, uppercase);
  }

  /* Sizes */
  &--size_small {
    border-radius: var(--sm-c-badge-border-radius-small, var(--border-radius-xlg, 50%));
    font-size: var(--sm-c-badge-font-size-small, var(--p-xs-font-size, $sm-12));
    height: var(--sm-c-badge-height-small, $sm-12);
    width: var(--sm-c-badge-width-small, $sm-12);

    .sm-badge__content {
      line-height: var(--sm-c-badge-line-height-small, 1);
    }
  }

  &--size_medium {
    height: var(--sm-c-badge-height-medium, 19px);
    border-radius: var(--sm-c-badge-border-radius-medium, 10px);
    min-width: var(--sm-c-badge-min-width-medium, 19px);
    display: inline-flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: var(--sm-c-badge-padding-medium, 0 6px);
    width: auto;
    font-size: var(--sm-c-badge-font-size-medium, 12px);

    .sm-badge__content {
      line-height: var(--sm-c-badge-line-height-medium, 1);
    }
  }

  &--size_large {
    font-size: var(--sm-c-badge-font-size-large, 14px);
    height: var(--sm-c-badge-height-large, $sm-24);
    border-radius: var(--sm-c-badge-border-radius-large, $sm-12);
    min-width: var(--sm-c-badge-min-width-large, $sm-24);
    display: inline-flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: var(--sm-c-badge-padding-large, 0 6px);
    width: auto;

    .sm-badge__content {
      line-height: var(--sm-c-badge-line-height-large, 1.43);
      padding-top: 0;
    }
  }

  /* Types */
  &--type-info {
    background: $sm-badge--info--background-color;

    .sm-badge__content {
      color: var(--sm-c-badge-color-text-info, var(--color-disabled-light, $grey-neu-white));
    }
  }

  &--type-success {
    background: $sm-badge--success--background-color;

    .sm-badge__content {
      color: var(--sm-c-badge-color-text-success, var(--color-disabled-light, $grey-neu-white));
    }
  }

  &--type-alert {
    background: $sm-badge--alert--background-color;

    .sm-badge__content {
      color: var(--sm-c-badge-color-text-alert, var(--color-black, $grey-neu-black));
    }
  }

  &--type-warning {
    background: $sm-badge--warning--background-color;

    .sm-badge__content {
      color: var(--sm-c-badge-color-text-warning, var(--color-disabled-light, #f6f6f6));
    }
  }

  /* Light Theme Types */
  &--light-type-warning {
    background: $sm-badge--light-warning--background-color;

    .sm-badge__content {
      color: $sm-badge--light-warning--text;
    }
  }

  &--light-type-info {
    background: $sm-badge--light-info--background-color;

    .sm-badge__content {
      color: var(--sm-c-badge-color-text-light-info, $sm-badge--light--text);
    }
  }

  &--light-type-success {
    background: $sm-badge--light-success--background-color;

    .sm-badge__content {
      color: $sm-badge--light-success--text;
    }
  }

  &--light-type-alert {
    background: $sm-badge--light-alert--background-color;

    .sm-badge__content {
      color: var(--sm-c-badge-color-text-light-alert, $sm-badge--light--text);
    }
  }

  &--disabled {
    background: $sm-badge--disabled--background-color;

    .sm-badge__content {
      color: var(--sm-c-badge-color-text-disabled, $sm-badge--disabled--text-color);
    }
  }

  &--light-disabled {
    background: $sm-badge--light-disabled--background-color;

    .sm-badge__content {
      color: var(--sm-c-badge-color-text-light-disabled, $sm-badge--disabled--text-color);
    }
  }
}
</style>
