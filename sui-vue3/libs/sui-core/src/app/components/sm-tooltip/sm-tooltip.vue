<script setup lang="ts">
import { TriggerEvent, Tooltip as VTooltip } from 'floating-vue'
import { computed, VNode } from 'vue'
import { SmTooltipPlacement, SmTooltipPosition, SmTooltipTheme, SmTooltipTrigger, SmTooltipType } from './sm-tooltip.types'

const props = withDefaults(defineProps<{
  /**
   * Whether the target element is block element
   */
  blockElement?: boolean
  /**
   * Close the tooltip automatically when the user clicks outside of the tooltip
   */
  closeOnClickOutside?: boolean
  /**
   * Whether the tooltip has disabled state, the tooltip will be hidden
   */
  disabled?: boolean
  /**
   * The side of the target element the tooltip should be placed against. Accepts 'top', 'right', 'bottom' and 'left'
   */
  placement?: SmTooltipPlacement
  /**
   * Whether to use `fixed` or `absolute` positioning. Absolute is more performant if you have a lot of tooltips; fixed is more robust
   */
  position?: SmTooltipPosition
  /**
   * Whether to show component on top of all components by setting the highest z-index
   */
  showOnTop?: boolean
  /**
   * The appearance of the tooltip. Accepts: 'dark' and 'light'
   */
  theme?: SmTooltipTheme
  /**
   * The title of the tooltip
   */
  title?: string
  /**
   * The input event which causes the tooltip to show. Accepts 'click' and 'hover'
   */
  trigger?: SmTooltipTrigger
  /**
   * The style of the button. Accepts 'info', 'success', 'alert', 'warning'
   */
  type?: SmTooltipType | null
}>(), {
  blockElement: false,
  closeOnClickOutside: true,
  disabled: false,
  placement: SmTooltipPlacement.TOP,
  position: SmTooltipPosition.ABSOLUTE,
  showOnTop: false,
  textAlign: 'left',
  theme: SmTooltipTheme.DARK,
  title: '',
  trigger: SmTooltipTrigger.CLICK,
  type: null,
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

/**
 * defineSlots macro used to declare expected slots and their respective expected slot
 */
defineSlots<{
  content?: () => VNode[]
  default?: () => VNode[]
}>()

// fallback to 'hover' trigger in the event downstream project passes in an invalid trigger value
const triggers = computed<TriggerEvent[]>(() => (['click', 'hover'].includes(props.trigger) ? [props.trigger] : ['hover']))

// NOTE: there is a current issue about WATCH_ARRAY warning coming from popper used by floating-vue:
// [Vue warn]: (deprecation WATCH_ARRAY) "watch" option
// see: https://github.com/Akryum/floating-vue/issues/962
// TODO: currently this approach below doesn't work :(
// so we wait until the github issue is resolved
// ;(VPopper as unknown as { compatConfig: Record<string, unknown> }).compatConfig = {
//   MODE: 3,
//   WATCH_ARRAY: 'suppress-warning',
// }
</script>

<template>
  <v-tooltip
    :class="{
      'sm-tooltip': true,
      'sm-tooltip--inline': !blockElement,
    }"
    :popper-class="{
      'sm-text--x-small': true,
      'sm-tooltip__popper': true,
      'sm-tooltip__popper--light': theme === 'light',
      'sm-tooltip__popper--show-on-top': showOnTop,
      [`sm-tooltip__popper--${type}`]: !!type,
    }"
    :auto-hide="closeOnClickOutside"
    :disabled="disabled"
    :distance="8"
    :placement="placement"
    :popper-triggers="['click', 'hover']"
    :strategy="position"
    :triggers="triggers"
  >
    <slot />

    <template #popper>
      <template v-if="title">{{ title }}</template>
      <slot
        v-else
        name="content"
      />
    </template>
  </v-tooltip>
</template>

<style lang="scss">
@import '../../../../node_modules/floating-vue/dist/style.css';

:root {
  /* port over existing css variable names and co-locate them here */

  /* dark theme */
  --sm-c-tooltip-color-background-dark: #333;
  --sm-c-tooltip-color-border-dark: transparent;
  --sm-c-tooltip-color-text-dark: #fff;

  /* light theme */
  --sm-c-tooltip-color-background-light: #fff;
  --sm-c-tooltip-color-border-light: #c6d0e0;
  --sm-c-tooltip-color-text-light: #333;

  /* info */
  --sm-c-tooltip-color-background-info: #e6f0ff;
  --sm-c-tooltip-color-border-info: #b0d2f8;
  --sm-c-tooltip-color-text-info: #333;

  /* success */
  --sm-c-tooltip-color-background-success: #e2f4eb;
  --sm-c-tooltip-color-border-success: #9ae0bd;
  --sm-c-tooltip-color-text-success: #1b7b3e;

  /* alert */
  --sm-c-tooltip-color-background-alert: #fff6c0;
  --sm-c-tooltip-color-border-alert: #fccc0b;
  --sm-c-tooltip-color-text-alert: #333;

  /* warning */
  --sm-c-tooltip-color-background-warning: #fceeee;
  --sm-c-tooltip-color-border-warning: #f1bfbf;
  --sm-c-tooltip-color-text-warning: #d11d1d;
}

.sm-tooltip {
  &--inline {
    width: fit-content;
    display: inline-block;
  }

  &__popper {
    &:focus {
      box-shadow: none;
    }

    &.sm-tooltip__popper--show-on-top.v-popper__popper {
      z-index: var(--sm-visible-on-top-z-index);
    }

    &.v-popper--theme-tooltip {
      .v-popper__inner {
        padding: var(--sm-4) var(--sm-8);
        border-radius: 4px;

        /* default dark theme */
        background: var(--sm-c-tooltip-color-background-dark);
        border: 1px solid var(--sm-c-tooltip-color-border-dark);
        color: var(--sm-c-tooltip-color-text-dark);
      }

      .v-popper__arrow-outer {
        border-color: var(--sm-c-tooltip-color-background-dark);
      }
    }

    /* light theme */
    &.v-popper--theme-tooltip.sm-tooltip__popper--light {
      .v-popper__inner {
        background: var(--sm-c-tooltip-color-background-light);
        border: 1px solid var(--sm-c-tooltip-color-border-light);
        color: var(--sm-c-tooltip-color-text-light);

        /* porting over legacy box-shadow styling */
        box-shadow:
          0 1px 1px -1px rgba(24, 58, 108, 0.14),
          0 6px 9px -5px rgba(24, 58, 108, 0.14),
          0 5px 11px -5px rgba(24, 58, 108, 0.15);
      }

      .v-popper__arrow-outer {
        border-color: var(--sm-c-tooltip-color-border-light);
      }

      .v-popper__arrow-inner {
        visibility: visible;
        border-color: var(--sm-c-tooltip-color-background-light);
      }
    }

    /* info type */
    &.v-popper--theme-tooltip.sm-tooltip__popper--info {
      .v-popper__inner {
        background: var(--sm-c-tooltip-color-background-info);
        border: 1px solid var(--sm-c-tooltip-color-border-info);
        color: var(--sm-c-tooltip-color-text-info);
      }

      .v-popper__arrow-outer {
        border-color: var(--sm-c-tooltip-color-border-info);
      }

      .v-popper__arrow-inner{
        visibility: visible;
        border-color: var(--sm-c-tooltip-color-background-info);
      }
    }

    /* success type */
    &.v-popper--theme-tooltip.sm-tooltip__popper--success {
      .v-popper__inner {
        background: var(--sm-c-tooltip-color-background-success);
        border: 1px solid var(--sm-c-tooltip-color-border-success);
        color: var(--sm-c-tooltip-color-text-success);
      }

      .v-popper__arrow-outer {
        border-color: var(--sm-c-tooltip-color-border-success);
      }

      .v-popper__arrow-inner {
        visibility: visible;
        border-color: var(--sm-c-tooltip-color-background-success);
      }
    }

    /* alert type */
    &.v-popper--theme-tooltip.sm-tooltip__popper--alert {
      .v-popper__inner {
        background: var(--sm-c-tooltip-color-background-alert);
        border: 1px solid var(--sm-c-tooltip-color-border-alert);
        color: var(--sm-c-tooltip-color-text-alert);
      }

      .v-popper__arrow-outer {
        border-color: var(--sm-c-tooltip-color-border-alert);
      }

      .v-popper__arrow-inner {
        visibility: visible;
        border-color: var(--sm-c-tooltip-color-background-alert);
      }
    }

    /* warning type */
    &.v-popper--theme-tooltip.sm-tooltip__popper--warning {
      .v-popper__inner {
        background: var(--sm-c-tooltip-color-background-warning);
        border: 1px solid var(--sm-c-tooltip-color-border-warning);
        color: var(--sm-c-tooltip-color-text-warning);
      }

      .v-popper__arrow-outer {
        border-color: var(--sm-c-tooltip-color-border-warning);
      }

      .v-popper__arrow-inner {
        visibility: visible;
        border-color: var(--sm-c-tooltip-color-background-warning);
      }
    }
  }
}
</style>
