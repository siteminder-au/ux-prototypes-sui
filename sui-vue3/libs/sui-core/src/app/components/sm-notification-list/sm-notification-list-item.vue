<script setup lang="ts">
import { useI18n } from '../../libs/vue-i18n'
import { SmNotificationListItemStatus } from './sm-notification-list.types'
import iconArrowGoForward from './icons/arrow-go-forward'
import SmTextTruncator from '../sm-text-truncator/sm-text-truncator.vue'

// *NOTE*: Also update `SmNotificationListItem` in `./sm-notification-list.types` to maintain consistency for both. Tried using the interface here but its causing lint errors
// https://github.com/vuejs/core/issues/8301
const props = withDefaults(defineProps<{
  /**
   * Title or heading of the notification item
   */
  title: string
  /**
   * If the notification is READ or UNREAD. This will also be denoted by a 'dot'.
   */
  status: SmNotificationListItemStatus
  /**
   * Whether the notification item status toggle is disabled or not
   */
  statusDisabled?: boolean
  /**
   * description or body of the notification item
   */
  description?: string
  /**
   * Time and date of the notification item
   */
  timestamp?: Date | string
  /**
   * Label that can indicate the notification type and can also be used for grouping
   */
  messageLabel?: string
  /**
   * Label indicating the property that will be displayed above the heading
   */
  propertyLabel?: string
  /**
   * HTML Element to use for the item title. Use this if you need to
   * use headings (h1-h6) and optimize the levels on your page.
   */
  titleTag?: string
  /**
   * Optional override for the "Read more" button text.
   */
  showMoreText?: string
  /**
   * Optional override for the "Read less" button text.
   */
  showLessText?: string
  /**
   * Set the number of lines to display ellipsis at the end
   */
  clampLine?: number | string
  /**
   * Whether the notification item is actionable or not
   */
  isActionable?: boolean
}>(), {
  title: '',
  description: '',
  timestamp: '',
  statusDisabled: false,
  status: SmNotificationListItemStatus.UNREAD,
  messageLabel: '',
  propertyLabel: '',
  titleTag: 'div',
  showMoreText: '',
  showLessText: '',
  clampLine: undefined,
  isActionable: false,
})

const emit = defineEmits<{
  /**
   * Emits when the notification is clicked
   */
  'click-list-item': [event: MouseEvent | KeyboardEvent]
  /**
   * Emits when the status of the notification changes (read/unread)
   */
  'update:status': [status: SmNotificationListItemStatus]
}>()

const toggleStatus = (): void => {
  const newStatus = props.status === SmNotificationListItemStatus.UNREAD
    ? SmNotificationListItemStatus.READ
    : SmNotificationListItemStatus.UNREAD

  emit('update:status', newStatus)
}

const { i18n } = useI18n()

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
  },
})

const labelDelimiter = '•'

const clickListItem = (event: MouseEvent | KeyboardEvent): void => {
  if (!props.isActionable) {
    return
  }

  // Emit the click event only if the item is actionable
  emit('click-list-item', event)
}
</script>

<template>
  <li
    :class="{
      'sm-notification-list-item': true,
      'sm-notification-list-item--unread': status === SmNotificationListItemStatus.UNREAD,
      'sm-notification-list-item--actionable': isActionable,
    }"
    :tabindex="isActionable ? 0 : undefined"
    @keydown.enter.self="clickListItem"
    @click="clickListItem"
  >
    <div class="sm-notification-list-item__header">
      <button
        type="button"
        :class="{
          'sm-notification-list-item__indicator': true,
          'sm-notification-list-item__indicator--unread': status === SmNotificationListItemStatus.UNREAD,
          'sm-notification-list-item__indicator--disabled': statusDisabled,
        }"
        :disabled="statusDisabled"
        :aria-label="status === SmNotificationListItemStatus.UNREAD
          ? i18n.t('sui-core.components.sm-notification-list.sm-notification-list.a11y__mark-as-read')
          : i18n.t('sui-core.components.sm-notification-list.sm-notification-list.a11y__mark-as-unread')"
        @click.stop="toggleStatus"
      >
        <div class="sm-notification-list-item__indicator-inner" />
      </button>

      <div class="sm-notification-list-item__header-content">
        <div class="sm-notification-list-item__title-wrapper">
          <div
            v-if="propertyLabel"
            class="sm-notification-list-item__property-label"
          >
            {{ propertyLabel }}
          </div>

          <div class="sm-notification-list-item__title-inner">
            <component
              :is="titleTag"
              class="sm-notification-list-item__title"
            >
              {{ title }}
            </component>

            <span
              v-if="isActionable"
              class="sm-notification-list-item__icon-link"
            >
              <span class="sm-icon sm-icon--arrow-go-forward">
                <svg
                  version="1.1"
                  :viewBox="iconArrowGoForward.viewBox"
                  focusable="false"
                  :aria-hidden="true"
                  role="img"
                  :style="{ width: '1em', height: '1em' }"
                  v-html="iconArrowGoForward.path"
                ></svg>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <sm-text-truncator
      :clamp-line="clampLine"
      :show-more-text="showMoreText"
      :show-less-text="showLessText"
      class="sm-notification-list-item__description"
    >
      {{ description }}
    </sm-text-truncator>

    <div class="sm-notification-list-item__message-label">
      {{ messageLabel }}<span v-if="messageLabel && timestamp">&nbsp;{{ labelDelimiter }}&nbsp;</span>{{ timestamp }}
    </div>

    <!--
      <div class="sm-notification-list-item__truncator">
      <sm-button
      class="sm-notification-list-item__truncator-button"
      :type="SmButtonType.TEXT"
      suffix-icon="arrow"
      >
      {{ i18n.t('sui-core.components.sm-notification-list.sm-notification-list.show-all-button') }}
      </sm-button>
      </div>
    -->
  </li>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

.sm-notification-list-item {
  padding: $sm-16 $sm-24 $sm-16 $sm-16;
  gap: $sm-4;
  display: flex;
  flex-direction: column;
  background-color: $true-white;
  align-items: stretch;
  border-bottom: 1px solid $blue-neu-mid;
  user-select: none;
  overflow-wrap: anywhere;

  &__description {
    padding-left: $sm-40;
    display: block;
    margin: 0;
  }

  &__description .sm-text-truncator__text,
  &__message-label,
  &__property-label {
    font-size: 13px;
    line-height: 20px;
    letter-spacing: -0.1px;
    font-weight: 400;
  }

  &__header {
    display: flex;
    align-items: baseline;
    gap: $sm-8;
    width: 100%;
  }

  &__header-content {
    flex-wrap: wrap;
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: $sm-8 $sm-4;
  }

  &__icon-link {
    transform: translateX(-70%);
    opacity: 0;
    transition: transform 0.3s ease-in, opacity 0.3s ease-in;

    .sm-icon {
      font-size: 12px;
    }
  }

  &__indicator {
    width: $sm-32;
    height: $sm-32;
    background-color: transparent;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    border-radius: 2px;
  }

  &__indicator-inner {
    width: $sm-16;
    height: $sm-16;
    border: 1px solid transparent;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;

    &::before {
      content: "";
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: transparent;
      transition: background-color 0.2s ease-in-out;
    }
  }

  &__indicator--unread .sm-notification-list-item__indicator-inner::before {
    background-color: $primary-blue;
  }

  &__message-label {
    padding-left: $sm-40;
  }

  &__message-label,
  &__property-label {
    color: $grey-neu-dark;
  }

  &__property-label {
    text-transform: uppercase;
  }

  &__title-wrapper {
    flex-grow: 1;
    gap: $sm-4;
    display: flex;
    flex-direction: column;
  }

  &__title {
    color: $grey-neu-black;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: $sm-4 0;
    font-size: 15px;
    line-height: 22px;
    letter-spacing: -0.2px;
    font-weight: 600;
  }

  &__title-inner {
    display: flex;
    align-items: baseline;
    gap: $sm-8;
  }

  &__truncator {
    padding-left: 30px;
  }

  &--actionable {
    cursor: pointer;

    &:hover,
    &:active,
    &:focus-visible {
      transition: background-color 0.3s ease-in-out;

      .sm-notification-list-item__icon-link {
        opacity: 1;
        transform: translateX(0%);
      }
    }

    /**
    * Hover State for actionable items
    */
    &:hover {
      background-color: $blue-neu-light;

      .sm-notification-list-item__indicator-inner {
        border-color: $blue-neu-mid;
      }
    }

    &__indicator:hover &__indicator-inner {
      background-color: $blue-neu-mid;
      border-color: transparent;
    }

    /**
    * Active State for actionable items
    */
    &:active {
      background-color: $blue-neu-med;

      .sm-notification-list-item__indicator-inner {
        border-color: $blue-neu-mid;
      }
    }

    &__indicator:active &__indicator-inner {
      background-color: $blue-neu-dark;
      border-color: transparent;
    }

    /**
    * Focus State for actionable items
    */
    &:focus-visible {
      background-color: $true-white;
      box-shadow: inset 0 0 0 2px $grey-neu-black;
      outline: none;

      .sm-notification-list-item__indicator-inner {
        border-color: transparent;
      }
    }

    &__indicator:focus-visible &__indicator-inner {
      outline: 2px solid $grey-neu-black;
      border-color: transparent;
    }
  }

  /**
   * Hover State
   */
  &:hover .sm-notification-list-item__indicator-inner {
    border-color: $blue-neu-mid;
  }

  &__indicator:hover &__indicator-inner {
    background-color: $blue-neu-mid;
    border-color: transparent;
  }

  /**
   * Active State
   */
  &:active .sm-notification-list-item__indicator-inner {
    border-color: $blue-neu-mid;
  }

  &__indicator:active &__indicator-inner {
    background-color: $blue-neu-dark;
    border-color: transparent;
  }

  /**
   * Focus State
   */
  &:focus-visible .sm-notification-list-item__indicator-inner {
    border-color: transparent;
  }

  &__indicator:focus-visible &__indicator-inner {
    outline: 2px solid $grey-neu-black;
    border-color: transparent;
  }

  /* Remove global fallback style */
  &.sm-notification-list-item &__indicator:focus,
  &.sm-notification-list-item &__indicator:focus-visible {
    box-shadow: none;
    outline: none;
  }

  /**
   * Disabled State
   */
  &__indicator--disabled {
    cursor: not-allowed;
  }

  &__indicator--disabled.sm-notification-list-item__indicator--unread {
    .sm-notification-list-item__indicator-inner::before {
      background-color: $grey-neu-mid;
    }
  }

  &__indicator--disabled:hover &__indicator-inner,
  &__indicator--disabled:active &__indicator-inner {
    border-color: $grey-neu-mid;
    background-color: transparent;
  }

  @media (hover: none) {
    .sm-notification-list-item__icon-link {
      transform: translateX(0%);
      opacity: 1;
    }
  }
}
</style>
