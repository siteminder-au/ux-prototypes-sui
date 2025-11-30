import { render, screen } from '@testing-library/vue'
import Notifications from './notifications.vue'

describe('notifications page', () => {

  it('should display the notifications page', async () => {
    render(Notifications)

    // sm-page-title
    expect(await screen.findByRole('heading', { level: 1, name: 'Notifications' })).toBeVisible()

    // sm-notification-list
    expect(screen.getByRole('button', { name: 'Mark all as read' })).toBeVisible()
  })

})
