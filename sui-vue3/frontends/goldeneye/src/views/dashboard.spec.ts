import { render, screen, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import Dashboard from './dashboard.vue'

describe('dashboard page', () => {

  // When jest.useFakeTimers() is used, we need to configure userEvent package
  // such that it is aware that fake timers are used.
  // this is after upgrading user-event package to v14+
  // see: https://github.com/testing-library/user-event/issues/833
  const userEventInstance = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

  // Fake timers using Jest
  beforeEach(() => {
    jest.useFakeTimers()
  })

  // Running all pending timers and switching to real timers using Jest
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should display the dashboard page', async () => {
    render(Dashboard)
    // Fast-forward to fully "load" the page
    // We have `setTimeout`s in the component to simulate staggered loading states
    await jest.runAllTimersAsync()

    // sm-page-title
    expect(await screen.findByRole('heading', { level: 1, name: 'CampMinder Dashboard' })).toBeVisible()

    // sm-card
    expect(screen.getByRole('heading', { level: 4, name: 'Notifications' }))

    // sm-tag
    expect(screen.getByText('Arrivals')).toBeVisible()
    expect(screen.getByText('Departures')).toBeVisible()
    expect(screen.getByText('New bookings')).toBeVisible()
    expect(screen.getByText('Stays')).toBeVisible()
    expect(screen.getByText('Cancellations')).toBeVisible()
  })

  it('should expand and collapse the channel status card when clicked', async () => {
    render(Dashboard)
    // Fast-forward to fully "load" the page
    // We have `setTimeout`s in the component to simulate staggered loading states
    await jest.runAllTimersAsync()

    // sm-page-title
    expect(await screen.findByRole('heading', { level: 1, name: 'CampMinder Dashboard' })).toBeVisible()

    // sm-expandable-card/sm-expandable-card-body
    const channelStatusExpandableCard = screen.getByTestId('channel-status-expandable-card')
    const withinChannelStatus = within(channelStatusExpandableCard) // Limit the scope to the expandable card

    expect(withinChannelStatus.getByRole('heading', { name: 'Channel status', level: 4 })).toBeVisible()
    expect(withinChannelStatus.getByRole('region', { hidden: false })).toBeInTheDocument()
    expect(withinChannelStatus.getByRole('button', { name: 'Click to collapse the section' })).toHaveTextContent('Active channels')
    expect(withinChannelStatus.queryByRole('button', { name: 'Click to expand the section' })).not.toBeInTheDocument()

    // sm-html-truncator inside the sm-expandable-card-body
    expect(withinChannelStatus.getByText('Agoda')).toBeVisible()
    expect(withinChannelStatus.getByRole('button', { name: 'More channels' })).toBeVisible()

    // Collapse the expanded card's body
    await userEventInstance.click(withinChannelStatus.getByRole('button', { name: 'Click to collapse the section' }))

    // sm-expandable-card/sm-expandable-card-body
    expect(await withinChannelStatus.findByRole('button', { name: 'Click to expand the section' })).toBeVisible()
    expect(withinChannelStatus.queryByRole('button', { name: 'Click to collapse the section' })).not.toBeInTheDocument()
    expect(withinChannelStatus.getByRole('region', { hidden: true })).toBeInTheDocument()

    // Expand the expanded card's body again
    await userEventInstance.click(withinChannelStatus.getByRole('button', { name: 'Click to expand the section' }))

    // sm-expandable-card/sm-expandable-card-body
    expect(await withinChannelStatus.findByRole('button', { name: 'Click to collapse the section' })).toBeVisible()
    expect(withinChannelStatus.queryByRole('button', { name: 'Click to expand the section' })).not.toBeInTheDocument()
    expect(withinChannelStatus.getByRole('region', { hidden: false })).toBeInTheDocument()
  })

})
