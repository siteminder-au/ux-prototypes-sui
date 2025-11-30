/**
 * Mock globally for sm-date-picker > v-calendar to work anywhere in the tests
 * After upgrading to v-calendar@3 we need to mock the ResizeObserver
 */
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
