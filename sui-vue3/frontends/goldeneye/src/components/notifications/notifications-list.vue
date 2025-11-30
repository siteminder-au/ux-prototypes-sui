<script setup lang="ts">
import { computed, configureCompat, ref, watch, VNode } from 'vue'
import { SmNotificationList, SmNotificationListItem, SmNotificationListItemStatus } from '@siteminder/sui-core/components/sm-notification-list'
import { useTranslate } from '@/composables/use-translate'

defineProps<{
  headerConfig?: InstanceType<typeof SmNotificationList>['headerConfig']
}>()

defineSlots<{
  action?: () => VNode[]
}>()

/**
 * NOTE: Suppresses warning from `useIntersectionObserver`
 * [Vue warn]: (deprecation WATCH_ARRAY) "watch" option or vm.$watch on an array
 * value will no longer trigger on array mutation unless the "deep" option is specified.
 *
 * This does not appear when running in non-compat mode.
 */
configureCompat({ WATCH_ARRAY: false })

const { t } = useTranslate('components.notifications.notifications-list')

// sm-notification-list
const mockNotificationItems = ref<SmNotificationListItem[]>([
  {
    id: '1',
    status: SmNotificationListItemStatus.UNREAD,
    title: t('demand-plus-reconciliation-reminder-title'),
    titleTag: 'h6',
    description: t('demand-plus-reconciliation-reminder-body'),
    timestamp: '7:30 PM Sat 26 Nov',
    messageLabel: t('demand-plus-label'),
    isActionable: true,
  },
  {
    id: '2',
    status: SmNotificationListItemStatus.READ,
    title: t('payment-failed-auto-pay-title'),
    titleTag: 'h6',
    description: t('payment-failed-auto-pay-body'),
    timestamp: '9:45 AM Mon 26 Nov',
    messageLabel: t('payments-label'),
    isActionable: false,
  },
  {
    id: '3',
    status: SmNotificationListItemStatus.READ,
    title: t('dynamic-revenue-plus-recommendation-title'),
    titleTag: 'h6',
    description: t('dynamic-revenue-plus-recommendation-body-1'),
    timestamp: '9:45 AM Mon 26 Nov',
    messageLabel: t('dynamic-revenue-plus-label'),
    propertyLabel: 'SUI High Rise Campminder Hotel',
    isActionable: true,
  },
  {
    id: '4',
    status: SmNotificationListItemStatus.UNREAD,
    title: t('guest-message-title'),
    titleTag: 'h6',
    description: t('guest-message-body'),
    timestamp: '9:30 AM Mon 26 Nov',
    messageLabel: t('guest-engagement-label'),
    isActionable: true,
  },
  {
    id: '5',
    status: SmNotificationListItemStatus.UNREAD,
    title: t('new-reservations-title'),
    titleTag: 'h6',
    description: t('new-reservations-body'),
    timestamp: '9:00 AM Mon 26 Nov',
    messageLabel: 'Reservations',
  },
  {
    id: '6',
    status: SmNotificationListItemStatus.UNREAD,
    statusDisabled: true,
    title: t('dynamic-revenue-plus-recommendation-title'),
    titleTag: 'h6',
    description: t('dynamic-revenue-plus-recommendation-body-2'),
    timestamp: '9:00 AM Mon 26 Nov',
    // This can be taken out if we are on a specific category page
    // messageLabel: t('dynamic-revenue-plus-label'),
  },
  {
    id: '7',
    status: SmNotificationListItemStatus.READ,
    statusDisabled: true,
    title: t('urgent-notification-title'),
    titleTag: 'h6',
    description: t('urgent-notification-body'),
    // To cover the other case just coz
    // timestamp: '8:15 AM Tue 27 Nov',
    messageLabel: t('demand-plus-label'),
  },
])

const TOTAL_NOTIFICATIONS = 30
const PAGE_SIZE = 7

const isLoading = ref(false)
const isEndOfListVisible = ref(false)
const notificationListRef = ref<InstanceType<typeof SmNotificationList> | null>(null)
const paginatedNotifications = ref(mockNotificationItems.value.slice(0, PAGE_SIZE))

let pagerIndex = 0
let timeout: NodeJS.Timeout

const hasMoreNotifications = computed(() => {
  return paginatedNotifications.value.length < TOTAL_NOTIFICATIONS
})

const loadMoreNotifications = async (): Promise<void> => {
  if (!hasMoreNotifications.value) {
    return
  }

  isLoading.value = true
  pagerIndex += 1
  console.info('-- loadMoreNotifications', pagerIndex)

  // We'll call the BEEF here since we are expecting paginated notifs
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const currentLength = paginatedNotifications.value.length
        const newItems = mockNotificationItems.value
          .slice(0, PAGE_SIZE)
          .map(item => ({
            ...item,
            id: `${item.id}-${currentLength}`,
            title: `${item.title} (${pagerIndex})`,
          }))

        paginatedNotifications.value = [...paginatedNotifications.value, ...newItems]
        updateLoadingState(false)

        resolve()
      } catch (error) {
        reject(error)
      }
    }, 850) // Arbitrary number to give asynchronous feel
  })
}

const updateLoadingState = (newState: boolean): void => {
  clearTimeout(timeout)

  // We delay updating the state to avoid abrupt transitions and flickering,
  // allowing the loading state to appear smoother and more continuous.
  timeout = setTimeout(() => {
    isLoading.value = newState
  }, 200)
}

const handleEndOfListVisible = (isVisible: boolean): void => {
  isEndOfListVisible.value = isVisible
}

const handleStatusUpdate = (id: string, newStatus: SmNotificationListItemStatus): void => {
  console.info('@update:status emitted', id, newStatus)
  paginatedNotifications.value = paginatedNotifications.value.map(item => (item.id === id ? { ...item, status: newStatus } : item))
}

const handleClickItem = (id: string): void => {
  console.info('@click emitted', id)
}

watch([isLoading, isEndOfListVisible], async () => {
  // Load more notifications when the end of the list is visible
  // and load batch by batch until we fill the screen
  if (!isLoading.value && isEndOfListVisible.value) {
    await loadMoreNotifications()
  }
})

watch(hasMoreNotifications, (hasMore) => {
  if (!hasMore) {
    console.info('-- stopIntersectionObserver')
    notificationListRef.value?.stopIntersectionObserver()
  }
})

const showUnreadOnly = ref(false)

const handleToggleShowUnreadOnly = (value: boolean): Promise<void> => {
  showUnreadOnly.value = value
  console.info('-- handleToggleShowUnreadOnly', value)

  // We'll call the BEEF here since we are expecting paginated notifs
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const currentLength = paginatedNotifications.value.length
        const newItems = mockNotificationItems.value
          .filter(item => (showUnreadOnly.value ? item.status === SmNotificationListItemStatus.UNREAD : true))
          .slice(0, PAGE_SIZE)
          .map(item => ({
            ...item,
            id: `${item.id}-${currentLength}`,
            title: `${item.title} (${pagerIndex})`,
          }))

        paginatedNotifications.value = newItems
        updateLoadingState(false)

        resolve()
      } catch (error) {
        reject(error)
      }
    }, 850) // Arbitrary number to give asynchronous feel
  })
}
</script>

<template>
  <sm-notification-list
    ref="notificationListRef"
    :notification-items="paginatedNotifications"
    :footer="t('notifications-footer')"
    :is-loading="hasMoreNotifications"
    :show-footer="!hasMoreNotifications"
    :header-config="headerConfig"
    :show-more-text="t('show-more-button')"
    :show-less-text="t('show-less-button')"
    :clamp-line="2"
    @end-of-list-visible="handleEndOfListVisible"
    @toggle-show-unread-only="handleToggleShowUnreadOnly"
    @update:status="handleStatusUpdate"
    @click-list-item="handleClickItem"
  >
    <template #action>
      <slot name="action" />
    </template>
  </sm-notification-list>
</template>
