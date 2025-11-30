import { render, screen } from '@testing-library/vue'
import { createTestRouter } from '@/test-utils'
import { ref } from 'vue'
import Manage from './manage.vue'

/**
 * Read more about Vue Testing Library (VTL) at https://testing-library.com/
 *
 * In addition, you can look at https://github.com/testing-library/jest-dom
 * for the available matchers and utilities.
 *
 * TIP: Use accessible queries like `getByRole`, `getByText`, `getByLabelText`,
 * etc. whenever possible, we want to make sure our pages are built with
 * accessibility in mind from the start rather than retrofitting them later.
 */

const useUserManagementMock = jest.fn()

jest.mock('@/composables/use-user-management', () => {
  return { useUserManagement: () => useUserManagementMock() }
})

describe('users manage page', () => {

  it('should display an empty state when there are no users added', async () => {
    useUserManagementMock.mockReturnValue({
      users: ref([]),
      addUser: jest.fn(),
    })

    render(
      Manage,
      {
        global: {
          plugins: [createTestRouter()],
        },
      },
    )

    // sm-page-title
    expect(await screen.findByRole('heading', { name: 'Manage users', level: 1 })).toBeVisible()
    expect(screen.getByText('(0)')).toBeVisible()

    // sm-404-page
    expect(screen.getByRole('heading', { name: 'No users added', level: 3 })).toBeVisible()
    expect(screen.getByText('Add users to your account to manage them here.')).toBeVisible()
  })

  it('should display a list of users when there are users added', async () => {
    useUserManagementMock.mockReturnValue({
      users: ref([
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@test.com',
          preferredLanguage: 'en',
          role: 'admin',
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@test.com',
          preferredLanguage: 'en',
          role: 'general',
        },
      ]),
      addUser: jest.fn(),
    })

    render(
      Manage,
      {
        global: {
          plugins: [createTestRouter()],
        },
      },
    )

    // sm-page-title
    expect(await screen.findByRole('heading', { name: 'Manage users', level: 1 })).toBeVisible()
    expect(screen.getByText('(2)')).toBeVisible()

    // sm-404-page
    expect(screen.queryByRole('heading', { name: 'No users added', level: 3 })).not.toBeInTheDocument()

    // sm-card user one
    expect(screen.getByRole('heading', { name: 'John Doe', level: 2 })).toBeVisible()
    expect(screen.getByText('john.doe@test.com')).toBeVisible()
    expect(screen.getByText('Admin')).toBeVisible()

    // sm-card user two
    expect(screen.getByRole('heading', { name: 'Jane Doe', level: 2 })).toBeVisible()
    expect(screen.getByText('jane.doe@test.com')).toBeVisible()
    expect(screen.getByText('General')).toBeVisible()
  })

})
