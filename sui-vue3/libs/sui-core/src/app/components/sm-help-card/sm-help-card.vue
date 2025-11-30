<script setup lang="ts">
import { computed } from 'vue'
import { SmHelpCardType } from './sm-help-card.types'

const props = withDefaults(defineProps<{
  /**
   * The style of the help card. Accepts: 'success', 'info', 'alert', 'warning'
   */
  type?: SmHelpCardType
}>(), {
  type: SmHelpCardType.INFO,
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

const iconName = computed(() => {
  /**
   * Built-in icons for each type of the help card
   */
  const icons = {
    [SmHelpCardType.ALERT]: 'utility-alert',
    [SmHelpCardType.INFO]: 'utility-information-alt',
    [SmHelpCardType.SUCCESS]: 'utility-success-alt',
    [SmHelpCardType.WARNING]: 'utility-warning',
  }

  return icons[props.type]
})
</script>

<template>
  <div
    class="sm-help-card"
    :class="{
      [`sm-help-card--type-${type}`]: !!type
    }"
  >
    <div
      v-if="$slots.header"
      class="sm-help-card__header sm-p"
    >
      <sm-icon
        v-if="iconName"
        class="sm-help-card__icon"
        :name="iconName"
      />

      <!-- @slot Header of the help card. Includes a built-in icon based on the type. -->
      <slot name="header" />
    </div>

    <div
      v-if="$slots.body"
      class="sm-help-card__body sm-text--small"
    >
      <!-- @slot Body of the help card -->
      <slot name="body" />
    </div>
  </div>
</template>

<style lang="scss">
@import "../../common/variables";

.sm-help-card {
  border-radius: 0 $sm-8 $sm-8 0;
  color: $grey-neu-black;
  padding: $sm-12 $sm-8 $sm-12 19px; // 16px + 3px "border-left" style
  word-break: break-word;

  .sm-help-card__header {
    align-items: flex-start;
    display: flex;
    font-weight: 600;
  }

  .sm-help-card__header + .sm-help-card__body {
    padding-left: $sm-24;
  }

  .sm-help-card__icon {
    margin-right: $sm-8;

    /* Optimizes alignment of icon next to header text */
    margin-top: 5px;
  }

  &--type-info {
    /* $blue-neu-mid (#c6ceda) with opacity applied */
    background-color: var(--sm-c-help-card-color-background-info, rgba(198, 206, 218, 0.12));

    /* Mimic overlapping border styles */
    box-shadow:
      inset 3px 0 0 0 var(--sm-c-help-card-color-border-left-info, var(--color-info, $primary-blue)),
      inset 0 0 0 1px var(--sm-c-help-card-color-border-info, var(--color-app, $blue-neu-mid));

    .sm-help-card__icon {
      color: var(--sm-c-help-card-color-icon-info, var(--color-info, $primary-blue));
    }
  }

  &--type-warning {
    background-color: var(--sm-c-help-card-color-background-warning, var(--color-warning-light, $app-warning-light));

    /* Mimic overlapping border styles */
    box-shadow:
      inset 3px 0 0 0 var(--sm-c-help-card-color-border-left-warning, var(--color-warning, $app-warning)),
      inset 0 0 0 1px var(--sm-c-help-card-color-border-warning, var(--color-warning-mid, $app-warning-mid));

    .sm-help-card__icon {
      color: var(--sm-c-help-card-color-icon-warning, var(--color-warning, $app-warning));
    }
  }

  &--type-alert {
    background-color: var(--sm-c-help-card-color-background-alert, var(--color-alert-light, $app-alert-light));

    /* Mimic overlapping border styles */
    box-shadow:
      inset 3px 0 0 0 var(--sm-c-help-card-color-border-left-alert, var(--color-alert, $app-alert)),
      inset 0 0 0 1px var(--sm-c-help-card-color-border-alert, var(--color-alert-mid, $app-alert-mid));

    .sm-help-card__icon {
      color: var(--sm-c-help-card-color-icon-alert, var(--color-black, $grey-neu-black));
    }
  }

  &--type-success {
    background-color: var(--sm-c-help-card-color-background-success, var(--color-success-light, $app-success-light));

    /* Mimic overlapping border styles */
    box-shadow:
      inset 3px 0 0 0 var(--sm-c-help-card-color-border-left-success, var(--color-success, $app-success)),
      inset 0 0 0 1px var(--sm-c-help-card-color-border-success, var(--color-success-mid, $app-success-mid));

    .sm-help-card__icon {
      color: var(--sm-c-help-card-color-icon-success, var(--color-success, $app-success));
    }
  }
}
</style>
