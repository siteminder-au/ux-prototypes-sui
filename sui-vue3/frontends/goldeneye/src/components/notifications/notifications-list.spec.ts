import { render, screen } from '@testing-library/vue'
import NotificationsList from './notifications-list.vue'

describe('notifications-list', () => {

  it('should display the notifications', async () => {
    render(NotificationsList)

    // sm-notification-list
    expect(await screen.findByRole('checkbox', { name: 'Show unread only' })).toBeVisible()
    expect(screen.getByRole('list')).toBeVisible()
    expect(screen.getAllByRole('listitem')).toHaveLength(7)
  })

})
