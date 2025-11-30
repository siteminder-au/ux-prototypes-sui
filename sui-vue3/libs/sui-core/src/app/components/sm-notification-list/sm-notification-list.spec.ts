import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { computed, ref } from 'vue'
import SmButton from '../sm-button/sm-button.vue'
import SmNotificationList from './sm-notification-list.vue'

describe('SmNotificationList', () => {

  it('should render the notification body correctly', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => {
        const notificationItems = [
          {
            id: '1',
            status: 'unread',
            title: 'Heading 1',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'Some description.',
          },
        ]

        return { notificationItems }
      },
      template: `
        <sm-notification-list :notification-items="notificationItems" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findByRole('list')).toBeVisible()

    const notificationItem = await screen.findByRole('listitem')
    expect(notificationItem).toHaveTextContent('Heading 1')
    expect(notificationItem).toHaveTextContent('7:30 PM Sat 25 Nov')
    expect(notificationItem).toHaveTextContent('Some description.')
  })

  it('should render the correct number of notification items', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => {
        const notificationItems = [
          {
            id: '1',
            status: 'unread',
            title: 'Heading 1',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'Some notification.',
            messageLabel: 'Label',
            propertyLabel: 'Property label',
          },
          {
            id: '2',
            status: 'unread',
            title: 'Heading 2',
            description: 'Another notification.',
            messageLabel: 'Label2',
          },
          {
            id: '3',
            status: 'unread',
            title: 'Heading 3',
            timestamp: '6:30 PM Sat 25 Nov',
            description: 'Yet another notification.',
          },
        ]

        return { notificationItems }
      },
      template: `
        <sm-notification-list :notification-items="notificationItems" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const notificationItems = await screen.findAllByRole('listitem')
    expect(notificationItems).toHaveLength(3)
    expect(notificationItems.at(0)).toHaveTextContent('Heading 1')
    expect(notificationItems.at(0)).toHaveTextContent('Some notification')
    expect(notificationItems.at(0)).toHaveTextContent('Label • 7:30 PM Sat 25 Nov')

    expect(notificationItems.at(1)).toHaveTextContent('Heading 2')
    expect(notificationItems.at(1)).toHaveTextContent('Another notification.')
    expect(notificationItems.at(1)).toHaveTextContent('Label2')
    expect(notificationItems.at(1)).not.toHaveTextContent(' • ')

    expect(notificationItems.at(2)).toHaveTextContent('Heading 3')
    expect(notificationItems.at(2)).toHaveTextContent('Yet another notification.')
    expect(notificationItems.at(2)).toHaveTextContent('6:30 PM Sat 25 Nov')
    expect(notificationItems.at(2)).not.toHaveTextContent(' • ')
  })

  it('should render the title with the correct heading tag', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => {
        const notificationItems = [
          {
            id: '1',
            status: 'unread',
            title: 'Heading level 3',
            titleTag: 'h3',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'Some description.',
          },
        ]

        return { notificationItems }
      },
      template: `
        <sm-notification-list :notification-items="notificationItems" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Heading level 3', level: 3 })).toBeVisible())
  })

  it('should render the messageLabel prop when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => {
        const notificationItems = [
          {
            id: '1',
            status: 'unread',
            title: 'Heading 1',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'Some description.',
            messageLabel: 'Message label',
          },
        ]

        return { notificationItems }
      },
      template: `
        <sm-notification-list :notification-items="notificationItems" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const notificationItem = await screen.findByRole('listitem')
    expect(notificationItem).toHaveTextContent('Message label')
  })

  it('should render the propertyLabel prop when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => {
        const notificationItems = [
          {
            id: '1',
            status: 'unread',
            title: 'Heading 1',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'Some description.',
            propertyLabel: 'Property label',
          },
        ]

        return { notificationItems }
      },
      template: `
        <sm-notification-list :notification-items="notificationItems" />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const notificationItem = await screen.findByRole('listitem')
    expect(notificationItem).toHaveTextContent('Property label')
  })

  it('should render the action button slot when provided', async () => {
    // ARRANGE
    const mockClick = jest.fn()

    const ParentComponent = {
      components: { SmNotificationList, SmButton },
      setup: () => {
        const notificationItems = [
          {
            id: '1',
            status: 'unread',
            title: 'Heading 1',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'Some description.',
          },
        ]

        return {
          notificationItems,
          mockClick,
        }
      },
      template: `
        <sm-notification-list :notification-items="notificationItems">
          <template #action>
            <sm-button @click="mockClick">action-slot-button</sm-button>
          </template>
        </sm-notification-list>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const actionButton = await screen.findByRole('button', { name: 'action-slot-button' })
    expect(actionButton).toBeVisible()
    expect(actionButton).toBeEnabled()
    expect(mockClick).toHaveBeenCalledTimes(0)

    await userEvent.click(actionButton)

    expect(mockClick).toHaveBeenCalledTimes(1)
  })

  it('should render the footer prop when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => {
        const notificationItems = [
          {
            id: '1',
            status: 'unread',
            title: 'Heading 1',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'Some description.',
          },
        ]

        const footer = 'footer-prop'

        return {
          notificationItems,
          footer,
        }
      },
      template: `
        <sm-notification-list
          :notification-items="notificationItems"
          :footer="footer"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('footer-prop')).toBeVisible())
  })

  it('should not render the footer prop when provided but show-footer is false', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => {
        const notificationItems = [
          {
            id: '1',
            status: 'unread',
            title: 'Heading 1',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'Some description.',
          },
        ]

        return { notificationItems }
      },
      template: `
        <sm-notification-list
          footer="footer-prop"
          :notification-items="notificationItems"
          :show-footer="false"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.queryByText('footer-prop')).not.toBeInTheDocument())
  })

  it('should render empty state when no notifications are provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => ({ notificationItems: [] }),
      template: `
        <sm-notification-list :notification-items="notificationItems" :is-empty="true" >
          <template #empty>
            <h5>No unread messsages</h5>
            <h6>That's all your notifications for the last 90 days</h6>
          </template>
        </sm-notification-list>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('heading', { name: 'No unread messsages', level: 5 })).toBeVisible())
    await waitFor(() => expect(screen.getByRole('heading', { name: 'That\'s all your notifications for the last 90 days', level: 6 })).toBeVisible())
  })

  it('should render error state when there is an error from the consumer side', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => ({ notificationItems: [] }),
      template: `
        <sm-notification-list :notification-items="notificationItems" :has-error="true" >
          <template #error>
            <h5>Something went wrong</h5>
            <h6>We couln't load your notifications. Please try again later.</h6>
          </template>
        </sm-notification-list>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Something went wrong', level: 5 })).toBeVisible())
    await waitFor(() => expect(screen.getByRole('heading', { name: 'We couln\'t load your notifications. Please try again later.', level: 6 })).toBeVisible())
  })

  it('should filter and display only unread notifications when the "Show Unread Only" toggle is clicked', async () => {
    const mockToggleShowUnreadOnly = jest.fn()

    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => {
        const notificationItems = ref([
          {
            id: '1',
            status: 'unread',
            title: 'Heading 1',
            titleTag: 'h3',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'Some description.',
          },
          {
            id: '2',
            status: 'read',
            title: 'Heading 2',
            titleTag: 'h3',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'Some description.',
          },
          {
            id: '3',
            status: 'unread',
            title: 'Heading 3',
            titleTag: 'h3',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'Some description.',
          },
        ])

        const showUnreadOnly = ref(false)

        mockToggleShowUnreadOnly.mockImplementation((value: boolean) => {
          showUnreadOnly.value = value
        })

        const displayedNotifications = computed(() => {
          return showUnreadOnly.value
            ? notificationItems.value.filter(item => item.status === 'unread')
            : notificationItems.value
        })

        return { displayedNotifications, mockToggleShowUnreadOnly }
      },
      template: `
        <sm-notification-list
          :notification-items="displayedNotifications"
          @toggle-show-unread-only="mockToggleShowUnreadOnly"
        />
      `,
    }

    render(ParentComponent)

    const toggleButton = screen.getByRole('checkbox')

    expect(mockToggleShowUnreadOnly).toHaveBeenCalledTimes(0)
    expect(await screen.findByRole('checkbox')).not.toBeChecked()
    expect(toggleButton).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Heading 1' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Heading 2' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Heading 3' })).toBeVisible()

    // Toggle on
    await userEvent.click(toggleButton)

    expect(mockToggleShowUnreadOnly).toHaveBeenCalledTimes(1)
    expect(mockToggleShowUnreadOnly).toHaveBeenNthCalledWith(1, true)
    expect(await screen.findByRole('checkbox')).toBeChecked()
    expect(screen.getByRole('heading', { name: 'Heading 1' })).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Heading 2' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Heading 3' })).toBeVisible()

    // Toggle off
    await userEvent.click(toggleButton)

    expect(mockToggleShowUnreadOnly).toHaveBeenCalledTimes(2)
    expect(mockToggleShowUnreadOnly).toHaveBeenNthCalledWith(2, false)
  })

  it('should render loading state when is-loading prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => ({ notificationItems: [
        {
          id: '1',
          status: 'unread',
          title: 'Heading 1',
        },
      ] }),
      template: `
        <sm-notification-list :notification-items="notificationItems" :is-loading="true"/>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Heading 1')).toBeVisible())
  })

  it('should update the status of the notification item when the control button is clicked', async () => {
    const mockUpdateStatus = jest.fn()
    const mockClickListItem = jest.fn()

    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => {
        const notificationItems = ref([
          {
            id: '1',
            status: 'unread',
            title: 'Heading 1',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'Some notification.',
          },
        ])

        const handleStatusUpdate = (id: string, newStatus: string): void => {
          notificationItems.value = notificationItems.value.map(item => (item.id === id ? { ...item, status: newStatus } : item))
          mockUpdateStatus(id, newStatus)
        }

        return {
          notificationItems,
          handleStatusUpdate,
          mockUpdateStatus,
          mockClickListItem,
        }
      },
      template: `
        <div>
          <sm-notification-list
            :notification-items="notificationItems"
            @update:status="handleStatusUpdate"
            @click-list-item="mockClickListItem"
          />
          <span>Status: {{ notificationItems[0].status }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const controlButton = await screen.findByRole('button', { name: 'Mark as read' })
    expect(controlButton).toBeVisible()
    expect(controlButton).toBeEnabled()
    expect(screen.getByText('Status: unread')).toBeVisible()
    expect(mockUpdateStatus).toHaveBeenCalledTimes(0)
    expect(mockClickListItem).toHaveBeenCalledTimes(0)

    // Mark as read - pointer
    await userEvent.click(controlButton)

    expect(await screen.findByText('Status: read')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Mark as unread' })).toBeVisible()
    expect(mockUpdateStatus).toHaveBeenCalledTimes(1)
    expect(mockUpdateStatus).toHaveBeenNthCalledWith(1, '1', 'read')
    expect(mockClickListItem).toHaveBeenCalledTimes(0)

    // Mark as unread - pointer
    await userEvent.click(controlButton)

    expect(await screen.findByText('Status: unread')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Mark as read' })).toBeVisible()
    expect(mockUpdateStatus).toHaveBeenCalledTimes(2)
    expect(mockUpdateStatus).toHaveBeenNthCalledWith(2, '1', 'unread')

    // Mark as read - keyboard enter
    await userEvent.keyboard('{Enter}')

    expect(await screen.findByText('Status: read')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Mark as unread' })).toBeVisible()
    expect(mockUpdateStatus).toHaveBeenCalledTimes(3)
    expect(mockUpdateStatus).toHaveBeenNthCalledWith(3, '1', 'read')
    expect(mockClickListItem).toHaveBeenCalledTimes(0)

    // Mark as unread - keyboard enter
    await userEvent.keyboard('{Enter}')

    expect(await screen.findByText('Status: unread')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Mark as read' })).toBeVisible()
    expect(mockUpdateStatus).toHaveBeenCalledTimes(4)
    expect(mockUpdateStatus).toHaveBeenNthCalledWith(4, '1', 'unread')
    expect(mockClickListItem).toHaveBeenCalledTimes(0)
  })

  it('should not update the status of the notification item when the status-disabled config is true', async () => {
    const mockUpdateStatus = jest.fn()
    const mockClickListItem = jest.fn()

    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => {
        const notificationItems = ref([
          {
            id: '1',
            status: 'unread',
            statusDisabled: true,
            title: 'Heading 1',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'Some notification.',
          },
        ])

        const handleStatusUpdate = (id: string, newStatus: string): void => {
          notificationItems.value = notificationItems.value.map(item => (item.id === id ? { ...item, status: newStatus } : item))
          mockUpdateStatus(id, newStatus)
        }

        return {
          notificationItems,
          handleStatusUpdate,
          mockUpdateStatus,
          mockClickListItem,
        }
      },
      template: `
        <div>
          <sm-notification-list
            :notification-items="notificationItems"
            @update:status="handleStatusUpdate"
            @click-list-item="mockClickListItem"
          />
          <span>Status: {{ notificationItems[0].status }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const controlButton = await screen.findByRole('button', { name: 'Mark as read' })
    expect(controlButton).toBeVisible()
    expect(controlButton).toBeDisabled()
    expect(screen.getByText('Status: unread')).toBeVisible()
    expect(mockUpdateStatus).toHaveBeenCalledTimes(0)
    expect(mockClickListItem).toHaveBeenCalledTimes(0)

    // Mark as read - pointer
    await userEvent.click(controlButton)

    expect(await screen.findByText('Status: unread')).toBeVisible()
    expect(mockUpdateStatus).toHaveBeenCalledTimes(0)
    expect(mockClickListItem).toHaveBeenCalledTimes(0)
  })

  it('should emit click-list-item when actionable notification item is clicked', async () => {
    const mockUpdateStatus = jest.fn()
    const mockClickListItem = jest.fn()

    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => {
        const notificationItems = ref([
          {
            id: '1',
            status: 'unread',
            title: 'Heading 1',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'Some notification.',
            isActionable: true,
          },
        ])

        const handleStatusUpdate = (id: string, newStatus: string): void => {
          notificationItems.value = notificationItems.value.map(item => (item.id === id ? { ...item, status: newStatus } : item))
          mockUpdateStatus(id, newStatus)
        }

        return {
          notificationItems,
          handleStatusUpdate,
          mockUpdateStatus,
          mockClickListItem,
        }
      },
      template: `
        <div>
          <sm-notification-list
            :notification-items="notificationItems"
            @update:status="handleStatusUpdate"
            @click-list-item="mockClickListItem"
          />
          <span>Status: {{ notificationItems[0].status }}</span>
        </div>
      `,
    }

    render(ParentComponent)

    // get the first list item
    const listItem = screen.getAllByRole('listitem')[0]
    expect(listItem).toBeVisible()
    expect(mockUpdateStatus).toHaveBeenCalledTimes(0)
    expect(mockClickListItem).toHaveBeenCalledTimes(0)

    // click the list item
    await userEvent.click(listItem)

    expect(mockUpdateStatus).toHaveBeenCalledTimes(0)
    expect(mockClickListItem).toHaveBeenCalledTimes(1)
    expect(mockClickListItem).toHaveBeenCalledWith('1')

    // click the list item with keyboard
    await userEvent.keyboard('{Enter}')

    expect(mockUpdateStatus).toHaveBeenCalledTimes(0)
    expect(mockClickListItem).toHaveBeenCalledTimes(2)
    expect(mockClickListItem).toHaveBeenCalledWith('1')
  })

  it('should display the "Show more" button if the description overflows the truncation limit', async () => {
    // ARRANGE
    jest
      .spyOn(HTMLElement.prototype, 'clientHeight', 'get')
      .mockImplementation(() => 200)

    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => {
        const notificationItems = [
          {
            id: '1',
            status: 'unread',
            title: 'Heading level 3',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'This is a long description that should overflow and trigger truncation.',
          },
        ]
        return { notificationItems }
      },
      template: `
        <sm-notification-list
          :notification-items="notificationItems"
          show-more-text="Show more"
          show-less-text="Show less"
          clamp-line="2"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // Initial "Show more" button
    const showMoreButton = await screen.findByRole('button', { name: 'Show more' })
    expect(showMoreButton).toBeInTheDocument()
    await userEvent.click(showMoreButton)

    // "Show less" button
    const showLessButton = await screen.findByRole('button', { name: 'Show less' })
    expect(showLessButton).toBeInTheDocument()
    await userEvent.click(showLessButton)

    // "Show more" button
    const showMoreAgain = await screen.findByRole('button', { name: 'Show more' })
    expect(showMoreAgain).toBeInTheDocument()
  })

  it('should not display the "Show more" button if the description fits within the truncation limit', async () => {
    // ARRANGE
    jest
      .spyOn(HTMLElement.prototype, 'clientHeight', 'get')
      .mockImplementation(() => 20)

    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => {
        const notificationItems = [
          {
            id: '1',
            status: 'unread',
            title: 'Heading',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'Short description.',
          },
        ]
        return { notificationItems }
      },
      template: `
        <sm-notification-list
          :notification-items="notificationItems"
          show-more-text="Show more"
          show-less-text="Show less"
          clamp-line="2"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Show more' })).not.toBeInTheDocument())
  })

  it('should not emit click-list-item when clicking on "Show more" button', async () => {
    // ARRANGE
    const mockClickListItem = jest.fn()

    jest
      .spyOn(HTMLElement.prototype, 'clientHeight', 'get')
      .mockImplementation(() => 200)

    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => {
        const notificationItems = ref([
          {
            id: '1',
            status: 'unread',
            title: 'Heading 1',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'This is a long description that should overflow and trigger truncation.',
            isActionable: true,
          },
        ])

        return {
          notificationItems,
          mockClickListItem,
        }
      },
      template: `
        <sm-notification-list
          :notification-items="notificationItems"
          show-more-text="Show more"
          show-less-text="Show less"
          clamp-line="2"
          @click-list-item="mockClickListItem"
        />
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const showMoreButton = await screen.findByRole('button', { name: 'Show more' })
    expect(showMoreButton).toBeVisible()

    // Click "Show more" button
    await userEvent.click(showMoreButton)
    expect(mockClickListItem).toHaveBeenCalledTimes(0)

    // Click on description
    const description = await screen.findByText(/This is a long description/i)
    await userEvent.click(description)
    expect(mockClickListItem).toHaveBeenCalledTimes(1)
  })

  it('should NOT emit click-list-item when non-actionable notification item is clicked', async () => {
    const mockUpdateStatus = jest.fn()
    const mockClickListItem = jest.fn()

    const ParentComponent = {
      components: { SmNotificationList },
      setup: () => {
        const notificationItems = ref([
          {
            id: '1',
            status: 'unread',
            title: 'Heading 1',
            timestamp: '7:30 PM Sat 25 Nov',
            description: 'Some notification.',
            isActionable: false,
          },
        ])

        const handleStatusUpdate = (id: string, newStatus: string): void => {
          notificationItems.value = notificationItems.value.map(item => (item.id === id ? { ...item, status: newStatus } : item))
          mockUpdateStatus(id, newStatus)
        }

        return {
          notificationItems,
          handleStatusUpdate,
          mockUpdateStatus,
          mockClickListItem,
        }
      },
      template: `
        <div>
          <sm-notification-list
            :notification-items="notificationItems"
            @update:status="handleStatusUpdate"
            @click-list-item="mockClickListItem"
          />
          <span>Status: {{ notificationItems[0].status }}</span>
        </div>
      `,
    }

    render(ParentComponent)

    // get the first list item
    const listItem = screen.getAllByRole('listitem')[0]
    expect(listItem).toBeVisible()
    expect(mockUpdateStatus).toHaveBeenCalledTimes(0)
    expect(mockClickListItem).toHaveBeenCalledTimes(0)

    // click the list item
    await userEvent.click(listItem)

    expect(mockUpdateStatus).toHaveBeenCalledTimes(0)
    expect(mockClickListItem).toHaveBeenCalledTimes(0)

    // click the list item with keyboard
    await userEvent.keyboard('{Enter}')

    expect(mockUpdateStatus).toHaveBeenCalledTimes(0)
    expect(mockClickListItem).toHaveBeenCalledTimes(0)
  })
})
