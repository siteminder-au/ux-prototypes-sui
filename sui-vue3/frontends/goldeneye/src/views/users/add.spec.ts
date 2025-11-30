import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, within } from '@testing-library/vue'
import { createTestRouter } from '@/test-utils'
import Add from './add.vue'

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

describe('users add page', () => {

  // When jest.useFakeTimers() is used, we need to configure userEvent package
  // such that it is aware that fake timers are used.
  // this is after upgrading user-event package to v14+
  // see: https://github.com/testing-library/user-event/issues/833
  const userEventInstance = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

  beforeEach(() => {
    // We fake timers here since our fake data persistence has timeouts to simulate async operations
    jest.useFakeTimers()
  })

  // See: https://testing-library.com/docs/using-fake-timers/
  // Running all pending timers and switching to real timers using Jest
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should display an empty form and validate required fields on submit', async () => {
    render(
      Add,
      {
        global: {
          plugins: [createTestRouter()],
        },
      },
    )

    // sm-page-title
    expect(await screen.findByRole('heading', { name: 'Add user', level: 1 })).toBeVisible()

    // Form fields
    const emailField = screen.getByRole('textbox', { name: 'E-mail address' })
    const firstNameField = screen.getByRole('textbox', { name: 'First name' })
    const lastNameField = screen.getByRole('textbox', { name: 'Last name' })
    const preferredLanguageField = screen.getByRole('textbox', { name: 'Preferred language' })
    const phoneNumberField = screen.getByRole('textbox', { name: 'Phone number' })
    const userRoleField = screen.getByRole('textbox', { name: 'User role' })

    // Assert initial validation states
    expect(screen.getByRole('group', { name: 'User details' })).toBeVisible()
    expect(emailField).toBeValid()
    expect(firstNameField).toBeValid()
    expect(lastNameField).toBeValid()
    expect(preferredLanguageField).toBeValid()
    expect(phoneNumberField).toBeValid()
    expect(screen.getByRole('group', { name: 'Platform permissions' })).toBeVisible()
    expect(userRoleField).toBeValid()

    // Submit empty form to trigger validation
    await userEventInstance.click(screen.getByRole('button', { name: 'Create user' }))

    // Warning toast
    expect(await screen.findByRole('heading', { name: 'Failed to create user', level: 4 })).toBeVisible()
    expect(screen.getByText('Please fill in all required fields and try again.')).toBeVisible()

    // Assert validation states for plain inputs
    expect(emailField).toHaveAccessibleErrorMessage('This field is required')
    expect(firstNameField).toHaveAccessibleErrorMessage('This field is required')
    expect(lastNameField).toHaveAccessibleErrorMessage('This field is required')
    expect(phoneNumberField).not.toHaveAccessibleErrorMessage('This field is required') // Not required
    // sm-select's accessibility is not fully polished so we count the instances of the error message within the component for now
    expect(screen.getAllByText('This field is required')).toHaveLength(4)
  })

  it('should validate email address format', async () => {
    render(
      Add,
      {
        global: {
          plugins: [createTestRouter()],
        },
      },
    )

    // Form fields
    const emailField = await screen.findByRole('textbox', { name: 'E-mail address' })

    // Assert initial validation states
    expect(emailField).toBeValid()

    // Type invalid email address
    await userEventInstance.type(emailField, 'invalid-email')

    // Assert validation states
    await waitFor(() => expect(emailField).toBeInvalid())
    expect(emailField).toHaveAccessibleErrorMessage('This field must be a valid e-mail')
  })

  it('should successfully submit the form when fields are valid', async () => {
    const testRouter = createTestRouter()
    const testRouterSpy = jest.spyOn(testRouter, 'push')

    render(
      Add,
      {
        global: {
          plugins: [testRouter],
        },
      },
    )

    // Form fields
    const emailField = await screen.findByRole('textbox', { name: 'E-mail address' })
    const firstNameField = await screen.findByRole('textbox', { name: 'First name' })
    const lastNameField = await screen.findByRole('textbox', { name: 'Last name' })
    const phoneNumberField = await screen.findByRole('textbox', { name: 'Phone number' })

    // Fill in the form
    await userEventInstance.type(emailField, 'hello@test.com')
    await userEventInstance.type(firstNameField, 'John')
    await userEventInstance.type(lastNameField, 'Doe')
    await userEventInstance.type(phoneNumberField, '123456789')

    // sm-select's accessibility is not fully polished so we can't use `userEventInstance.selectOptions`
    // nor getByRole('option') directly to select the option
    await userEventInstance.click(screen.getByRole('textbox', { name: 'Preferred language' })) // Click to open the dropdown
    await userEventInstance.click(within(screen.getByRole('listbox')).getByText('French'))

    // Submit the form
    await userEventInstance.click(screen.getByRole('button', { name: 'Create user' }))

    // Since the useUserManagement is faked via setTimeout, we need to advance the timers
    jest.runOnlyPendingTimers()

    // Redirect to the user manage page
    await waitFor(() => expect(testRouterSpy).toHaveBeenCalledWith({
      name: 'users/manage',
    }))
  })

})
