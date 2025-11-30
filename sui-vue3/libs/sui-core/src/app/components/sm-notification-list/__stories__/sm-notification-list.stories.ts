import { computed, ref } from 'vue'
import SmNotificationListItem from '../sm-notification-list-item.vue'
import SmNotificationListHeader from '../sm-notification-list-header.vue'
import SmNotificationListFooter from '../sm-notification-list-footer.vue'
import SmNotificationList from '../sm-notification-list.vue'
import { SmNotificationListItemStatus, SmNotificationListItem as SmNotificationListItemType } from '../sm-notification-list.types'

export default {
  title: 'Components/Notification List',
  component: SmNotificationList,
  subcomponents: {
    'sm-notification-list-item': SmNotificationListItem,
    'sm-notification-list-header': SmNotificationListHeader,
    'sm-notification-list-footer': SmNotificationListFooter,
  },
}

export const Standard = () => ({
  components: { SmNotificationList, SmNotificationListItem, SmNotificationListHeader, SmNotificationListFooter },
  setup: () => {

    const notificationItems = ref<SmNotificationListItemType[]>([
      {
        id: '1',
        status: SmNotificationListItemStatus.UNREAD,
        title: 'Test title',
        titleTag: 'h6',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        timestamp: '7:30 PM Sat 25 Nov',
        messageLabel: 'Reservations',
        isActionable: true,
      },
      {
        id: '2',
        status: SmNotificationListItemStatus.UNREAD,
        title: 'Demand Plus Reconciliation Reminder',
        titleTag: 'h6',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        timestamp: '9:45 AM Mon 26 Nov',
        messageLabel: 'Payments',
        isActionable: true,
      },
      {
        id: '3',
        status: SmNotificationListItemStatus.UNREAD,
        title: 'Urgent Notification: Critical Demand Plus Reconciliation Deadline Approaching - Immediate Action Required to Prevent Potential Account Disruptions and Ensure Seamless Transaction Processing',
        titleTag: 'h6',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        timestamp: '9:45 AM Mon 26 Nov',
        messageLabel: 'Payments',
        propertyLabel: 'SUI High Rise Campminder Hotel',
        isActionable: false,
      },
      {
        id: '4',
        status: SmNotificationListItemStatus.READ,
        title: 'Urgent Notification: Critical Demand Plus Reconciliation Deadline Approaching - Immediate Action Required to Prevent Potential Account Disruptions and Ensure Seamless Transaction Processing',
        titleTag: 'h6',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        timestamp: '9:45 AM Mon 26 Nov',
        messageLabel: 'Payments',
        propertyLabel: 'SUI High Rise Campminder Hotel',
        isActionable: true,
      },
      {
        id: '5',
        status: SmNotificationListItemStatus.UNREAD,
        title: 'Urgent Notification: Critical Demand Plus Reconciliation Deadline Approaching - Immediate Action Required to Prevent Potential Account Disruptions and Ensure Seamless Transaction Processing',
        titleTag: 'h6',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        timestamp: '9:45 AM Mon 26 Nov',
        messageLabel: 'Payments',
        propertyLabel: 'SUI High Rise Campminder Hotel',
        isActionable: true,
      },
    ])

    const handleEndOfListVisible = (isVisible: boolean): void => {
      console.info('@end-of-list-visible emitted', isVisible)
    }

    const showUnreadOnly = ref(false)

    const handleToggleShowUnreadOnly = (value: boolean) => {
      showUnreadOnly.value = value
      console.info('toggle-show-unread-only', value)
    }

    const displayedNotifications = computed(() => {
      return showUnreadOnly.value
        ? notificationItems.value.filter(item => item.status === SmNotificationListItemStatus.UNREAD)
        : notificationItems.value
    })

    const handleStatusUpdate = (id: string, newStatus: SmNotificationListItemStatus) => {
      notificationItems.value = notificationItems.value.map(item => (item.id === id ? { ...item, status: newStatus } : item))
      console.info('@update:status emitted', id, newStatus)
    }

    const handleClickItem = (id: string): void => {
      console.info('@click emitted', id)
    }

    return {
      displayedNotifications,
      handleToggleShowUnreadOnly,
      handleEndOfListVisible,
      handleStatusUpdate,
      handleClickItem,
    }
  },
  template: `
    <div>
      <sm-notification-list
        :notification-items="displayedNotifications"
        footer="That's all your notifications for the last 90 days"
        show-more-text="Show more"
        show-less-text="Show less"
        clamp-line="2"
        @end-of-list-visible="handleEndOfListVisible"
        @toggle-show-unread-only="handleToggleShowUnreadOnly"
        @update:status="handleStatusUpdate"
        @click-list-item="handleClickItem"
      >
        <template #action>
          <sm-button type="text">Mark all as read</sm-button>
        </template>
      </sm-notification-list>
    </div>
  `,
})

const standardDescription = `
  The component includes a header, a list of notification items, and a footer.

  The action slot is displayed on the right side of the header.
`

Standard.parameters = {
  docs: {
    description: {
      component: standardDescription,
    },
  },
  percy: {
    widths: [1025, 769, 360],
  },
}

export const Empty = () => ({
  components: { SmNotificationList, SmNotificationListItem, SmNotificationListHeader, SmNotificationListFooter },
  setup: () => {
    const handleEndOfListVisible = (isVisible: boolean): void => {
      console.info('@end-of-list-visible emitted', isVisible)
    }

    const showUnreadOnlyConfig = {
      disabled: true,
    }

    return {
      handleEndOfListVisible,
      showUnreadOnlyConfig,
    }
  },
  template: `
    <div>
      <sm-notification-list
        :notification-items="[]"
        :is-empty="true"
        :show-unread-only-config="showUnreadOnlyConfig"
        @end-of-list-visible="handleEndOfListVisible"
      >
        <template #action>
          <sm-button type="text" :disabled="true">Mark all as read</sm-button>
        </template>
        <template #empty>
          <figure class="m-0 text-center">
            <img
              src="https://sui-assets.siteminder.com/sm/illu-md/illu-md-notification.svg"
              alt=""
              height="200px"
              width="200px"
            />
            <h3 class="mb-8">No unread messsages</h3>
            <p class="mb-0">That's all your notifications for the last 90 days</p>
          </figure>
        </template>
      </sm-notification-list>
    </div>
  `,
})

Empty.parameters = {
  docs: {
    description: {
      component: 'The empty slot is used to display a message when the list is empty, and it\'s controled by isEmpty.',
    },
  },
  percy: {
    widths: [1025, 769, 360],
  },
}

export const Error = () => ({
  components: { SmNotificationList, SmNotificationListItem, SmNotificationListHeader, SmNotificationListFooter },
  setup: () => {
    const handleEndOfListVisible = (isVisible: boolean): void => {
      console.info('@end-of-list-visible emitted', isVisible)
    }

    const showUnreadOnlyConfig = {
      disabled: true,
    }

    return {
      handleEndOfListVisible,
      showUnreadOnlyConfig,
    }
  },
  template: `
    <div>
      <sm-notification-list
        :notification-items="[]"
        :has-error="true"
        :show-unread-only-config="showUnreadOnlyConfig"
        @end-of-list-visible="handleEndOfListVisible"
      >
        <template #action>
          <sm-button type="text" :disabled="true">Mark all as read</sm-button>
        </template>
        <template #error>
          <div class="text-center">
            <figure class="m-0 mb-8">
              <img
                src="https://sui-assets.siteminder.com/sm/illu-md/illu-md-error.svg"
                alt=""
                width="200px"
                height="200px"
              />
              <h3 class="mb-8">Something went wrong</h3>
              <p class="mb-24">We couln't load your notifications. Please try again later.</p>
            </figure>
            <sm-button type="primary" prefix-icon="action-reset">Retry</sm-button>
          </div>
        </template>
      </sm-notification-list>
    </div>
  `,
})

Error.parameters = {
  docs: {
    description: {
      component: 'The error slot is used to display an error message when the list fails to load, and it\'s controled by hasError.',
    },
  },
  percy: {
    widths: [1025, 769, 360],
  },
}

export const Loading = () => ({
  components: { SmNotificationList, SmNotificationListItem, SmNotificationListHeader, SmNotificationListFooter },
  setup: () => {

    const notificationItems = ref<SmNotificationListItemType[]>([
      {
        id: '1',
        status: SmNotificationListItemStatus.READ,
        statusDisabled: true,
        title: 'Failed auto-pay payment processing',
        description: 'Scheduled Payment for Pete Jones failed to process.',
        messageLabel: 'Payments',
      },
      {
        id: '2',
        status: SmNotificationListItemStatus.UNREAD,
        statusDisabled: true,
        title: 'Demand Plus Reconciliation Reminder',
        description: 'You have 7 days remaining to reconcile your Demand+ transactions.',
        timestamp: '7:30 PM Sat 25 Nov',
      },
    ])

    const handleClickItem = (id: string): void => {
      console.info('@click emitted', id)
    }

    const handleEndOfListVisible = (isVisible: boolean): void => {
      console.info('@end-of-list-visible emitted', isVisible)
    }

    const handleStatusUpdate = (id: string, newStatus: SmNotificationListItemStatus) => {
      notificationItems.value = notificationItems.value.map(item => (item.id === id ? { ...item, status: newStatus } : item))
    }

    return {
      notificationItems,
      handleClickItem,
      handleEndOfListVisible,
      handleStatusUpdate,
    }
  },
  template: `
    <sm-notification-list
      footer="That's all your notifications for the last 90 days"
      :notification-items="notificationItems"
      :is-loading="true"
      :show-footer="false"
      @end-of-list-visible="handleEndOfListVisible"
      @update:status="handleStatusUpdate"
      @click-list-item="handleClickItem"
    >
      <template #action>
        <sm-button type="text" :disabled="true">Mark all as read</sm-button>
      </template>
    </sm-notification-list>
  `,
})

Loading.parameters = {
  docs: {
    description: {
      story: 'Displays a loading state. It will be appended to the list of notifications. Use this when implementing a load more feature.',
    },
  },
  percy: {
    widths: [1025, 769, 360],
  },
}
