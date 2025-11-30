<script setup lang="ts">
import { VNode } from 'vue'
import { SmUserListItemType } from './sm-user-list.types'

withDefaults(defineProps<{
  /**
   * Whether the list item is clicked
   */
  selected?: boolean
  /**
   * The Vue Component or HTML Element to use for the card
   */
  tag?: string
  /**
   * A vue-router route object to be used when the `tag` is set to `router-link`
   */
  to?: string | Record<string, unknown>
  /**
   * The colour of the list circle. Accepts: warning
   */
  type?: SmUserListItemType
}>(), {
  selected: false,
  tag: 'div',
  to: undefined,
  type: undefined,
})

const emit = defineEmits<{
  /**
   * Emits when the clickable default slot is clicked
   */
  click: [e: MouseEvent]
}>()

/**
 * defineSlots macro used to declare expected slots and their respective expected slot
 */
defineSlots<{
  default?: () => VNode[]
  date?: () => VNode[]
}>()

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
 * @event Click - Native click
 */
const onClick: GlobalEventHandlers['onclick'] = (e) => {
  emit('click', e)
}

defineExpose({
  onClick,
})
</script>

<template>
  <li
    class="sm-user-list-item"
    :class="{
      'sm-user-list-item--clicked': selected,
      [`sm-user-list-item--type-${type}`]: !!type,
    }"
  >
    <component
      :is="tag"
      class="sm-user-list-item__content"
      :to="to"
      @click="onClick"
    >
      <div
        class="sm-user-list-item__list"
        tabindex="-1"
      >
        <slot />
      </div>
    </component>
    <div
      v-if="$slots.date"
      class="sm-text--x-small sm-user-list-item__date"
    >
      <slot name="date" />
    </div>
  </li>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-user-list-item--date-color: var(--sm-c-user-list-date-color-text, var(--color-disabled-dark, $grey-neu-dark));
$sm-user-list-item--focus: var(--color-black, $grey-neu-black);

// White labelling for notification bar in app-header
.sm-app-header {
  .sm-user-list .sm-user-list-item {
    background: var(--sm-c-app-header-notification-color-background, transparent);
    border-color: var(--sm-c-app-header-notification-color-border, $light-blue-grey);

    &::before {
      background: var(--sm-c-app-header-notification-indicator-color-background, transparent);
      border: 1px solid var(--sm-c-app-header-notification-indicator-color-border, $light-blue-grey);
      border-radius: var(--sm-c-app-header-notification-indicator-border-radius, 50%);
      width: var(--sm-c-app-header-notification-indicator-width, $sm-8);
      height: var(--sm-c-app-header-notification-indicator-height, $sm-8);
      top: var(--sm-c-app-header-notification-indicator-top, 25px);
    }

    &--clicked {
      background: var(--sm-c-app-header-notification-background-color-selected, var(--color-app-light, $blue-neu-light));

      &::before {
        background: var(--primary-background, var(--sm-c-app-header-notification-indicator-color-background-selected, var(--color-primary, $primary-blue)));
        border: 1px solid var(--primary-background, var(--sm-c-app-header-notification-indicator-color-border-selected, var(--color-primary, $primary-blue)));
      }
    }

    &--type-warning {
      &::before {
        background: var(--sm-c-app-header-notification-indicator-color-background-warning, var(--color-warning, $app-warning));
        border: 1px solid var(--sm-c-app-header-notification-indicator-color-border-warning, var(--color-warning, $app-warning));
      }
    }

    &:hover {
      background-color: var(--sm-c-app-header-notification-color-background-hover, var(--color-app-mid, $blue-neu-med));
    }
  }
}

.sm-user-list-item {
  padding: 0;
  margin: 0;
  list-style: none;
  width: 100%;
  position: relative;
  display: flex;
  gap: $sm-8;

  & {
    // Second level list style (the dot)
    &::before {
      content: "";
      display: inline-block;
      width: var(--sm-c-user-list-indicator-width, $sm-8);
      height: var(--sm-c-user-list-indicator-height, $sm-8);
      border: 1px solid var(--sm-c-user-list-indicator-color-border, $light-blue-grey);
      border-radius: var(--sm-c-user-list-indicator-border-radius, 50%);
      background: var(--sm-c-user-list-indicator-color-background, transparent);

      @include margin($right: rem($sm-xxsm));

      position: absolute;
      top: var(--sm-c-user-list-indicator-top, 6px);
    }
  }

  &--type-warning {
    & {
      // Second level list style (the dot)
      &::before {
        background: var(--sm-c-user-list-indicator-color-background-warning, var(--color-warning, $app-warning));
        border: 1px solid var(--sm-c-user-list-indicator-color-border-warning, var(--color-warning, $app-warning));
      }
    }
  }

  &:focus {
    outline: 0;
    box-shadow: 0;
  }

  &__date {
    padding-right: $sm-16;
    color: $sm-user-list-item--date-color;
    text-align: right;
    max-width: 80px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &--clicked {
    & {
      &::before {
        background-color: var(--sm-c-user-list-indicator-color-background-selected, var(--color-info, $primary-blue));
        border: 1px solid var(--sm-c-user-list-indicator-color-border-selected, var(--color-info, $primary-blue));
      }
    }
  }

  &__list {
    &:focus {
      outline: 0;
      box-shadow: none;
    }
  }

  &__content {
    cursor: pointer;
    width: 100%;
    text-align: left;
    background: none;
    border: 0;
    box-shadow: none;
    min-width: 0;
    padding-right: 0;
    padding-left: var(--sm-c-user-list-content-padding-left, 1.25em);

    &:focus {
      outline: 0;
      box-shadow: none;

      .sm-user-list-item__list {
        box-shadow: 0 0 0 1px $sm-user-list-item--focus;
      }
    }

    h1,
    h2,
    h4,
    h5,
    h6,
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
