import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { required } from '@vee-validate/rules'
import { defineRule } from 'vee-validate'
import { ref } from 'vue'
import SmPagination from './sm-pagination.vue'

describe('SmPagination', () => {

  beforeAll(() => {
    // Built-in sm-select within the pagination has `rules="required"` configured
    defineRule('required', required)
  })

  it('should initialize the active page using the required props', async () => {
    // ARRANGE
    const props = {
      currentPage: 5,
      totalItems: 100,
      itemsPerPage: 10,
    }

    // ACT
    render(SmPagination, {
      props,
    })

    // ASSERT
    const inputField = screen.getByRole('spinbutton', { name: 'Page number' }) // sm-input
    await waitFor(() => expect(inputField).toHaveValue(5))
    expect(inputField).toHaveAttribute('min', '1')
    expect(inputField).toHaveAttribute('max', '10')
    expect(screen.getByText('of 10')).toBeVisible()
    expect(screen.queryByText('Go to')).not.toBeInTheDocument()
    expect(screen.getByText('41 - 50 of 100 results')).toBeVisible()

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled()
    expect(screen.queryByRole('button', { name: '5' })).not.toBeInTheDocument() // Expanded buttons

    const itemsPerPageSelect = screen.getByRole('combobox')
    const selectLabels = screen.getAllByText('10/page')
    expect(itemsPerPageSelect).toBeEnabled() // sm-select
    expect(selectLabels[0]).toBeVisible() // text inside sm-select's input field
    expect(selectLabels.length).toBe(2) // second one is the text inside sm-select's dropdown

    // Click on the select to open dropdown so we can count the options
    await userEvent.click(itemsPerPageSelect)

    const options = screen.getAllByRole('option')
    await waitFor(() => expect(options).toHaveLength(5))
    expect(options[0]).toHaveAccessibleName('10/page')
    expect(options[1]).toHaveAccessibleName('20/page')
    expect(options[2]).toHaveAccessibleName('50/page')
    expect(options[3]).toHaveAccessibleName('75/page')
    expect(options[4]).toHaveAccessibleName('100/page')
  })

  it('should display page buttons if the type is expanded', async () => {
    // ARRANGE
    const props = {
      currentPage: 5,
      totalItems: 100,
      itemsPerPage: 10,
      type: 'expanded',
    }

    // ACT
    render(SmPagination, {
      props,
    })

    // ASSERT
    await waitFor(() => expect(screen.queryByRole('spinbutton', { name: 'Page number' })).not.toBeInTheDocument())
    expect(screen.queryByText('of 10')).not.toBeInTheDocument()
    expect(screen.queryByText('Go to')).not.toBeInTheDocument()
    expect(screen.getByText('41 - 50 of 100 results')).toBeVisible()

    const selectLabels = screen.getAllByText('10/page')
    expect(screen.getByRole('combobox')).toBeEnabled() // sm-select
    expect(selectLabels[0]).toBeVisible() // text inside sm-select's input field
    expect(selectLabels.length).toBe(2) // second one is the text inside sm-select's dropdown

    // Prev, next, page buttons with default maxVisibleButtons of 5
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(7) // 7 because of prev and next buttons
    expect(buttons.at(0)).toHaveAccessibleName('Previous page')
    expect(buttons.at(1)).toHaveAccessibleName('1')
    expect(buttons.at(2)).toHaveAccessibleName('Jump pages backward')
    expect(buttons.at(3)).toHaveAccessibleName('5')
    expect(buttons.at(4)).toHaveAccessibleName('Jump pages forward')
    expect(buttons.at(5)).toHaveAccessibleName('10')
    expect(buttons.at(6)).toHaveAccessibleName('Next page')
  })

  it('should limit page buttons if the type is expanded and maxVisibleButtons is provided', async () => {
    // ARRANGE
    const props = {
      currentPage: 5,
      totalItems: 100,
      itemsPerPage: 10,
      type: 'expanded',
      maxVisibleButtons: 9,
    }

    // ACT
    render(SmPagination, {
      props,
    })

    // ASSERT
    await waitFor(() => expect(screen.queryByRole('spinbutton', { name: 'Page number' })).not.toBeInTheDocument())
    expect(screen.queryByText('of 10')).not.toBeInTheDocument()
    expect(screen.queryByText('Go to')).not.toBeInTheDocument()
    expect(screen.getByText('41 - 50 of 100 results')).toBeVisible()

    const selectLabels = screen.getAllByText('10/page')
    expect(screen.getByRole('combobox')).toBeEnabled() // sm-select
    expect(selectLabels[0]).toBeVisible() // text inside sm-select's input field
    expect(selectLabels.length).toBe(2) // second one is the text inside sm-select's dropdown

    // Prev, next, page buttons with maxVisibleButtons
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(11) // 11 because of prev and next buttons
    expect(buttons.at(0)).toHaveAccessibleName('Previous page')
    expect(buttons.at(1)).toHaveAccessibleName('1')
    expect(buttons.at(2)).toHaveAccessibleName('2')
    expect(buttons.at(3)).toHaveAccessibleName('3')
    expect(buttons.at(4)).toHaveAccessibleName('4')
    expect(buttons.at(5)).toHaveAccessibleName('5')
    expect(buttons.at(6)).toHaveAccessibleName('6')
    expect(buttons.at(7)).toHaveAccessibleName('7')
    expect(buttons.at(8)).toHaveAccessibleName('Jump pages forward')
    expect(buttons.at(9)).toHaveAccessibleName('10')
    expect(buttons.at(10)).toHaveAccessibleName('Next page')
  })

  it('should show the page number input if type is expanded and showGoToInput is true', async () => {
    // ARRANGE
    const props = {
      currentPage: 9,
      totalItems: 100,
      itemsPerPage: 10,
      type: 'expanded',
      showGoToInput: true,
    }

    // ACT
    render(SmPagination, {
      props,
    })

    // ASSERT
    const inputField = screen.getByRole('spinbutton', { name: 'Page number' }) // sm-input
    await waitFor(() => expect(inputField).toHaveValue(9))
    expect(inputField).toHaveAttribute('min', '1')
    expect(inputField).toHaveAttribute('max', '10')
    expect(screen.getByText('Go to')).toBeVisible()
    expect(screen.queryByText('of 10')).not.toBeInTheDocument()
    expect(screen.getByText('81 - 90 of 100 results')).toBeVisible()

    const selectLabels = screen.getAllByText('10/page')
    expect(screen.getByRole('combobox')).toBeEnabled() // sm-select
    expect(selectLabels[0]).toBeVisible() // text inside sm-select's input field
    expect(selectLabels.length).toBe(2) // second one is the text inside sm-select's dropdown

    // Prev, next, page buttons with default maxVisibleButtons of 5
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(7) // 7 because of prev and next buttons
    expect(buttons.at(0)).toHaveAccessibleName('Previous page')
    expect(buttons.at(1)).toHaveAccessibleName('1')
    expect(buttons.at(2)).toHaveAccessibleName('Jump pages backward')
    expect(buttons.at(3)).toHaveAccessibleName('8')
    expect(buttons.at(4)).toHaveAccessibleName('9')
    expect(buttons.at(5)).toHaveAccessibleName('10')
    expect(buttons.at(6)).toHaveAccessibleName('Next page')
  })

  it('should not display page cyclers if all page buttons are already displayed', async () => {
    // ARRANGE
    const props = {
      currentPage: 1,
      totalItems: 50,
      itemsPerPage: 10,
      type: 'expanded',
      maxVisibleButtons: 10,
    }

    // ACT
    render(SmPagination, {
      props,
    })

    // ASSERT
    await waitFor(() => expect(screen.queryByRole('spinbutton', { name: 'Page number' })).not.toBeInTheDocument())
    expect(screen.queryByText('of 10')).not.toBeInTheDocument()
    expect(screen.queryByText('Go to')).not.toBeInTheDocument()
    expect(screen.getByText('1 - 10 of 50 results')).toBeVisible()

    const selectLabels = screen.getAllByText('10/page')
    expect(screen.getByRole('combobox')).toBeEnabled() // sm-select
    expect(selectLabels[0]).toBeVisible() // text inside sm-select's input field
    expect(selectLabels.length).toBe(2) // second one is the text inside sm-select's dropdown

    // Prev, next, page buttons with maxVisibleButtons
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(7) // 7 because of prev and next buttons
    expect(buttons.at(0)).toHaveAccessibleName('Previous page')
    expect(buttons.at(1)).toHaveAccessibleName('1')
    expect(buttons.at(2)).toHaveAccessibleName('2')
    expect(buttons.at(3)).toHaveAccessibleName('3')
    expect(buttons.at(4)).toHaveAccessibleName('4')
    expect(buttons.at(5)).toHaveAccessibleName('5')
    expect(buttons.at(6)).toHaveAccessibleName('Next page')
  })

  it('should hide the displayed counter when showItemCount is false', async () => {
    // ARRANGE
    const props = {
      currentPage: 9,
      totalItems: 100,
      itemsPerPage: 10,
      showItemCount: false,
    }

    // ACT
    render(SmPagination, {
      props,
    })

    // ASSERT
    await waitFor(() => expect(screen.queryByText('81 - 90 of 100 results')).not.toBeInTheDocument())
  })

  it('should change the items per page options when itemsPerPageSets is provided', async () => {
    // ARRANGE
    const props = {
      currentPage: 1,
      totalItems: 1000,
      itemsPerPage: 10,
      itemsPerPageSets: [10, 20, 30],
    }

    // ACT
    render(SmPagination, {
      props,
    })

    // ASSERT
    const itemsPerPageSelect = screen.getByRole('combobox')
    const selectLabels = screen.getAllByText('10/page')
    expect(itemsPerPageSelect).toBeEnabled() // sm-select
    expect(selectLabels[0]).toBeVisible() // text inside sm-select's input field
    expect(selectLabels.length).toBe(2) // second one is the text inside sm-select's dropdown

    // Click on the select to open dropdown so we can count the options
    await userEvent.click(itemsPerPageSelect)

    const options = screen.getAllByRole('option')
    await waitFor(() => expect(options).toHaveLength(3))
    expect(options[0]).toHaveAccessibleName('10/page')
    expect(options[1]).toHaveAccessibleName('20/page')
    expect(options[2]).toHaveAccessibleName('30/page')
  })

  it('should change the current page when next or previous buttons are clicked', async () => {
    // ARRANGE
    const mockPrevPage = jest.fn()
    const mockNextPage = jest.fn()
    const mockBeforePrevPageChange = jest.fn()
    const mockBeforeNextPageChange = jest.fn()
    const mockUpdateCurrentPage = jest.fn()
    const ParentComponent = {
      components: { SmPagination },
      setup: () => {
        const currentPage = ref(1)
        const itemsPerPage = ref(10)
        const totalItems = ref(100)

        mockBeforePrevPageChange.mockImplementation((setPrevPage: () => void) => {
          setPrevPage()
        })

        mockBeforeNextPageChange.mockImplementation((setNextPage: () => void) => {
          setNextPage()
        })

        return {
          currentPage,
          itemsPerPage,
          totalItems,
          mockPrevPage,
          mockNextPage,
          mockBeforePrevPageChange,
          mockBeforeNextPageChange,
          mockUpdateCurrentPage,
        }
      },
      template: `
        <div>
          <sm-pagination
            v-model:current-page="currentPage"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalItems"
            :before-prev-page-change="mockBeforePrevPageChange"
            :before-next-page-change="mockBeforeNextPageChange"
            @prevPage="mockPrevPage"
            @nextPage="mockNextPage"
            @update:currentPage="mockUpdateCurrentPage"
          />
          <span>Current page: {{ currentPage }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent, {
    })

    // ASSERT
    const prevButton = screen.getByRole('button', { name: 'Previous page' })
    const nextButton = screen.getByRole('button', { name: 'Next page' })
    await waitFor(() => expect(prevButton).toBeDisabled())
    expect(screen.getByText('Current page: 1')).toBeVisible()
    expect(mockPrevPage).toHaveBeenCalledTimes(0)
    expect(mockNextPage).toHaveBeenCalledTimes(0)
    expect(mockBeforePrevPageChange).toHaveBeenCalledTimes(0)
    expect(mockBeforeNextPageChange).toHaveBeenCalledTimes(0)
    expect(mockUpdateCurrentPage).toHaveBeenCalledTimes(0)

    await userEvent.click(nextButton)

    await waitFor(() => expect(prevButton).toBeEnabled())
    expect(screen.getByText('Current page: 2')).toBeVisible()
    expect(mockPrevPage).toHaveBeenCalledTimes(0)
    expect(mockNextPage).toHaveBeenCalledTimes(1)
    expect(mockBeforePrevPageChange).toHaveBeenCalledTimes(0)
    expect(mockBeforeNextPageChange).toHaveBeenCalledTimes(1)
    expect(mockUpdateCurrentPage).toHaveBeenCalledTimes(1)

    await userEvent.click(prevButton)

    await waitFor(() => expect(prevButton).toBeDisabled())
    expect(screen.getByText('Current page: 1')).toBeVisible()
    expect(mockPrevPage).toHaveBeenCalledTimes(1)
    expect(mockNextPage).toHaveBeenCalledTimes(1)
    expect(mockBeforePrevPageChange).toHaveBeenCalledTimes(1)
    expect(mockBeforeNextPageChange).toHaveBeenCalledTimes(1)
    expect(mockUpdateCurrentPage).toHaveBeenCalledTimes(2)
  })

  it('should change the current page when expanded page buttons are clicked', async () => {
    // ARRANGE
    const mockPrevPage = jest.fn()
    const mockNextPage = jest.fn()
    const mockUpdateCurrentPage = jest.fn()
    const mockBeforePageNumberChange = jest.fn()
    const ParentComponent = {
      components: { SmPagination },
      setup: () => {
        const currentPage = ref(1)
        const itemsPerPage = ref(10)

        mockBeforePageNumberChange.mockImplementation((pageNumber: number, from: number, next: () => void) => {
          next()
        })

        return {
          currentPage,
          itemsPerPage,
          mockPrevPage,
          mockNextPage,
          mockUpdateCurrentPage,
          mockBeforePageNumberChange,
        }
      },
      template: `
        <div>
          <sm-pagination
            v-model:current-page="currentPage"
            v-model:items-per-page="itemsPerPage"
            type="expanded"
            :max-visible-buttons="9"
            :total-items="1001"
            :before-page-number-change="mockBeforePageNumberChange"
            @prevPage="mockPrevPage"
            @nextPage="mockNextPage"
            @update:currentPage="mockUpdateCurrentPage"
          />
          <span>Current page: {{ currentPage }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent, {
    })

    // ASSERT
    const prevButton = screen.getByRole('button', { name: 'Previous page' })
    const nextButton = screen.getByRole('button', { name: 'Next page' })
    await waitFor(() => expect(prevButton).toBeDisabled())
    expect(screen.getByText('Current page: 1')).toBeVisible()
    expect(mockPrevPage).toHaveBeenCalledTimes(0)
    expect(mockNextPage).toHaveBeenCalledTimes(0)
    expect(mockUpdateCurrentPage).toHaveBeenCalledTimes(0)

    await userEvent.click(screen.getByRole('button', { name: '101' })) // last page

    await waitFor(() => expect(prevButton).toBeEnabled())
    expect(nextButton).toBeDisabled()
    expect(screen.getByText('Current page: 101')).toBeVisible()
    expect(mockPrevPage).toHaveBeenCalledTimes(0)
    expect(mockNextPage).toHaveBeenCalledTimes(0)
    expect(mockUpdateCurrentPage).toHaveBeenCalledTimes(1)

    await userEvent.click(screen.getByRole('button', { name: '1' })) // first page

    await waitFor(() => expect(prevButton).toBeDisabled())
    expect(nextButton).toBeEnabled()
    expect(screen.getByText('Current page: 1')).toBeVisible()
    expect(mockPrevPage).toHaveBeenCalledTimes(0)
    expect(mockNextPage).toHaveBeenCalledTimes(0)
    expect(mockUpdateCurrentPage).toHaveBeenCalledTimes(2)

    await userEvent.click(screen.getByRole('button', { name: 'Jump pages forward' })) // page cycler (>> icon)
    await userEvent.click(screen.getByRole('button', { name: 'Jump pages forward' })) // page cycler (>> icon)

    await waitFor(() => expect(screen.getByText('Current page: 11')).toBeVisible())
    expect(mockPrevPage).toHaveBeenCalledTimes(0)
    expect(mockNextPage).toHaveBeenCalledTimes(0)
    expect(mockUpdateCurrentPage).toHaveBeenCalledTimes(4)

    await userEvent.click(screen.getByRole('button', { name: 'Jump pages backward' })) // page cycler (<< icon)

    await waitFor(() => expect(screen.getByText('Current page: 6')).toBeVisible())
    expect(mockPrevPage).toHaveBeenCalledTimes(0)
    expect(mockNextPage).toHaveBeenCalledTimes(0)
    expect(mockUpdateCurrentPage).toHaveBeenCalledTimes(5)
  })

  it('should go to page when input field is updated and type is standard', async () => {
    // ARRANGE
    const mockPrevPage = jest.fn()
    const mockNextPage = jest.fn()
    const mockUpdateCurrentPage = jest.fn()
    const ParentComponent = {
      components: { SmPagination },
      setup: () => {
        const currentPage = ref(1)
        const itemsPerPage = ref(1)
        const totalItems = ref(100)

        return {
          currentPage,
          itemsPerPage,
          totalItems,
          mockPrevPage,
          mockNextPage,
          mockUpdateCurrentPage,
        }
      },
      template: `
        <div>
          <sm-pagination
            v-model:current-page="currentPage"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalItems"
            @prevPage="mockPrevPage"
            @nextPage="mockNextPage"
            @update:currentPage="mockUpdateCurrentPage"
          />
          <span>Current page: {{ currentPage }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent, {
    })

    // ASSERT
    const input = screen.getByRole('spinbutton', { name: 'Page number' })
    await waitFor(() => expect(input).toBeVisible())
    expect(screen.getByText('Current page: 1')).toBeVisible()
    expect(mockPrevPage).toHaveBeenCalledTimes(0)
    expect(mockNextPage).toHaveBeenCalledTimes(0)
    expect(mockUpdateCurrentPage).toHaveBeenCalledTimes(0)

    // Appends 3 to the input field
    await userEvent.type(input, '3')

    await waitFor(() => expect(input).toHaveValue(13))
    expect(screen.getByText('Current page: 13')).toBeVisible()
    expect(mockPrevPage).toHaveBeenCalledTimes(0)
    expect(mockNextPage).toHaveBeenCalledTimes(0)
    expect(mockUpdateCurrentPage).toHaveBeenCalledTimes(1)
  })

  it('should go to page when input field is updated and type is expanded with input', async () => {
    // ARRANGE
    const mockPrevPage = jest.fn()
    const mockNextPage = jest.fn()
    const mockUpdateCurrentPage = jest.fn()
    const ParentComponent = {
      components: { SmPagination },
      setup: () => {
        const currentPage = ref(1)
        const itemsPerPage = ref(1)
        const totalItems = ref(100)

        return {
          currentPage,
          itemsPerPage,
          totalItems,
          mockPrevPage,
          mockNextPage,
          mockUpdateCurrentPage,
        }
      },
      template: `
        <div>
          <sm-pagination
            v-model:current-page="currentPage"
            v-model:items-per-page="itemsPerPage"
            type="expanded"
            :show-go-to-input="true"
            :total-items="totalItems"
            @prevPage="mockPrevPage"
            @nextPage="mockNextPage"
            @update:currentPage="mockUpdateCurrentPage"
          />
          <span>Current page: {{ currentPage }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent, {
    })

    // ASSERT
    const input = screen.getByRole('spinbutton', { name: 'Page number' })
    await waitFor(() => expect(input).toBeVisible())
    expect(screen.getByText('Current page: 1')).toBeVisible()
    expect(mockPrevPage).toHaveBeenCalledTimes(0)
    expect(mockNextPage).toHaveBeenCalledTimes(0)
    expect(mockUpdateCurrentPage).toHaveBeenCalledTimes(0)

    // Appends 7 to the input field
    await userEvent.type(input, '7')

    await waitFor(() => expect(input).toHaveValue(17))
    expect(screen.getByText('Current page: 17')).toBeVisible()
    expect(mockPrevPage).toHaveBeenCalledTimes(0)
    expect(mockNextPage).toHaveBeenCalledTimes(0)
    expect(mockUpdateCurrentPage).toHaveBeenCalledTimes(1)
  })

  it('should change the page size when select option is updated', async () => {
    // ARRANGE
    const mockUpdateCurrentPage = jest.fn()
    const mockUpdateItemsPerPage = jest.fn()
    const mockBeforePageSizeChange = jest.fn()
    const ParentComponent = {
      components: { SmPagination },
      setup: () => {
        const currentPage = ref(8)
        const itemsPerPage = ref(10)
        const totalItems = ref(100)

        mockBeforePageSizeChange.mockImplementation((to: number, from: number, next: () => void) => {
          next()
        })

        return {
          currentPage,
          itemsPerPage,
          totalItems,
          mockBeforePageSizeChange,
          mockUpdateItemsPerPage,
          mockUpdateCurrentPage,
        }
      },
      template: `
        <div>
          <sm-pagination
            v-model:current-page="currentPage"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalItems"
            :beforePageSizeChange="mockBeforePageSizeChange"
            @update:itemsPerPage="mockUpdateItemsPerPage"
            @update:currentPage="mockUpdateCurrentPage"
          />
          <span>Current page: {{ currentPage }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent, {
    })

    // ASSERT
    const itemsPerPageSelect = screen.getByRole('combobox')
    await waitFor(() => expect(itemsPerPageSelect).toBeVisible())
    expect(screen.getAllByText('10/page')[0]).toBeVisible() // text inside sm-select's input field
    expect(screen.getByText('Current page: 8')).toBeVisible()
    expect(mockBeforePageSizeChange).toHaveBeenCalledTimes(0)
    expect(mockUpdateItemsPerPage).toHaveBeenCalledTimes(0)
    expect(mockUpdateCurrentPage).toHaveBeenCalledTimes(0)

    // Select an option from items per page
    await userEvent.click(itemsPerPageSelect)
    await userEvent.click(screen.getByText('50/page')) // Inside the dropdown

    const selectLabels = screen.getAllByText('50/page')
    await waitFor(() => expect(selectLabels[0]).toBeVisible()) // text inside sm-select's input field
    expect(selectLabels.length).toBe(2) // second one is the text inside sm-select's dropdown
    expect(screen.getByText('Current page: 1')).toBeVisible() // goes back to first page
    expect(mockBeforePageSizeChange).toHaveBeenCalledTimes(1)
    expect(mockUpdateItemsPerPage).toHaveBeenCalledTimes(1)
    expect(mockUpdateCurrentPage).toHaveBeenCalledTimes(1)
  })

})
