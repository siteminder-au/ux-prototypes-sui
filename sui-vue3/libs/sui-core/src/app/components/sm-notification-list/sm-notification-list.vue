<script setup lang="ts">
import { onUnmounted, ref, VNode, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import {
  SmNotificationListHeaderConfig,
  SmNotificationListItem as SmNotificationListItemType,
  ShowUnreadOnlyConfig,
  SmNotificationListItemStatus,
} from './sm-notification-list.types'
import SmNotificationListItem from './sm-notification-list-item.vue'
import SmNotificationListHeader from './sm-notification-list-header.vue'
import SmNotificationListFooter from './sm-notification-list-footer.vue'
import SmLoadingList from '../loading/sm-loading-list/sm-loading-list.vue'

const props = withDefaults(defineProps<{
  /**
   * List of notification items
   */
  notificationItems: SmNotificationListItemType[]
  /**
   * Text at the end of the panel
   */
  footer?: string
  /**
   * Whether the list has an error
   */
  hasError?: boolean
  /**
   * Configuration object for the header. Supports edge-to-edge which removes
   * the horizontal padding from the header.
   */
  headerConfig?: SmNotificationListHeaderConfig
  /**
   * Appends a loading state to the list. Use this when implementing a load more
   * feature to indicate that the list is still loading more items.
   */
  isLoading?: boolean
  /**
   * Whether the list is empty
   */
  isEmpty?: boolean
  /**
   * Configuration object for the "Show Unread Only" switch.
   */
  showUnreadOnlyConfig?: ShowUnreadOnlyConfig
  /**
   * Whether to show the footer or not. Helpful when you want to attach a load
   * more feature to the list and only show the footer when there are no more items.
   */
  showFooter?: boolean
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
}>(), {
  notificationItems: () => [],
  footer: '',
  hasError: false,
  isEmpty: false,
  showUnreadOnlyConfig: () => ({
    key: 'show-unread-only',
    label: '',
    disabled: false,
    defaultToggleValue: false,
  }),
  headerConfig: () => ({
    edgeToEdge: false,
  }),
  isLoading: false,
  showFooter: true,
  showMoreText: '',
  showLessText: '',
  clampLine: undefined,
})

const emit = defineEmits<{
  /**
   * Emits an event to expose the value of the "Show Unread Only" switch.
   */
  'toggle-show-unread-only': [value: boolean]
  /**
   * Emitted when the user scrolls to the end of the list. Use in tandem
   * with the `is-loading` prop to load more items when the end is visible.
   * For the event to be re-emitted, the end of the list must become out of view
   * first before becoming visible again, therefore you need to plan your page
   * sizing accordingly.
   */
  'end-of-list-visible': [visible: boolean]
  /**
   * Emits when the status of the notification changes (read/unread)
   */
  'update:status': [id: string, status: SmNotificationListItemStatus]
  /**
   * Emits when a notification item is clicked
   */
  'click-list-item': [id: string]
}>()

/**
 * defineSlots macro used to declare expected slots and their respective expected slot
 */
defineSlots<{
  /**
   * Slot for custom action in the header's top right area.
   */
  action?: () => VNode[]
  /**
   * Slot for custom content when the list is empty or there's no unread notification.
   */
  empty?: () => VNode[]
  /**
   * Slot for custom content when the list has an error.
   */
  error?: () => VNode[]
}>()

const handleStatusUpdate = (id: string, newStatus: SmNotificationListItemStatus): void => {
  emit('update:status', id, newStatus)
}

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
  },
})

const handleClickItem = (id: string): void => {
  emit('click-list-item', id)
}

const listEndTargetRef = ref<HTMLElement | null>(null)
const isListEndTargetVisible = ref(false)

const { stop: stopIntersectionObserver } = useIntersectionObserver(
  listEndTargetRef,
  ([entry], _observerElement) => {
    isListEndTargetVisible.value = entry.isIntersecting || false
  },
)

watch(
  isListEndTargetVisible,
  (isVisible) => {
    if (props.notificationItems.length) {
      emit('end-of-list-visible', isVisible)
    }
  },
)

onUnmounted(() => {
  stopIntersectionObserver()
})

defineExpose({
  stopIntersectionObserver,
})
</script>

<template>
  <div class="sm-notification-list">
    <sm-notification-list-header
      :header-config="headerConfig"
      :show-unread-only-config="showUnreadOnlyConfig"
      @toggle-show-unread-only="emit('toggle-show-unread-only', $event)"
    >
      <template #action>
        <slot name="action" />
      </template>
    </sm-notification-list-header>

    <ul v-if="!hasError && notificationItems.length > 0">
      <sm-notification-list-item
        v-for="item in notificationItems"
        :key="item.id"
        :description="item.description"
        :message-label="item.messageLabel"
        :property-label="item.propertyLabel"
        :status="item.status"
        :status-disabled="item.statusDisabled"
        :timestamp="item.timestamp"
        :title="item.title"
        :title-tag="item.titleTag"
        :show-more-text="showMoreText"
        :show-less-text="showLessText"
        :clamp-line="clampLine"
        :is-actionable="item.isActionable"
        @update:status="(newStatus) => handleStatusUpdate(item.id, newStatus)"
        @click-list-item="handleClickItem(item.id)"
      />
    </ul>

    <sm-loading-list
      v-show="isLoading"
      class="sm-notification-list__loading"
      count="3"
    />

    <div
      v-if="hasError"
      class="sm-notification-list__error"
    >
      <slot name="error" />
    </div>

    <div
      v-else-if="isEmpty"
      class="sm-notification-list__empty"
    >
      <slot name="empty" />
    </div>

    <sm-notification-list-footer
      v-else-if="showFooter"
      :footer="footer"
    />

    <div
      ref="listEndTargetRef"
      class="sm-notification-list__listEnd"
    />
  </div>
</template>

<style lang="scss">
@import "../../common/variables";

.sm-notification-list {
  background-color: $true-white;
  position: relative;

  ul {
    padding: 0;
    margin: 0;
  }

  &__empty,
  &__error {
    padding: 0 $sm-16 $sm-16;
  }

  &__listEnd {
    /* Don't introduce wild spaces */
    position: absolute;
    bottom: 0;
    height: 120px;
    width: 100%;
    pointer-events: none;
  }

  &__loading {
    padding: $sm-24 $sm-32;
  }
}
</style>
