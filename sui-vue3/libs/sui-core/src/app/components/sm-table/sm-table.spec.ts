import userEvent from '@testing-library/user-event'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { Ref, ref } from 'vue'
import SmButton from '../sm-button/sm-button.vue'
import SmTableTbody from './sm-table-tbody.vue'
import SmTableTd from './sm-table-td.vue'
import SmTableTfoot from './sm-table-tfoot.vue'
import SmTableTh from './sm-table-th.vue'
import SmTableThead from './sm-table-thead.vue'
import SmTableTr from './sm-table-tr.vue'
import SmTable from './sm-table.vue'

describe('SmTable', () => {

  it('should display the table elements', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTable, SmTableTh, SmTableTr, SmTableTbody, SmTableTd, SmTableThead, SmTableTfoot },
      template: `
        <sm-table>
          <sm-table-thead>
            <sm-table-tr>
              <sm-table-th>Header 1</sm-table-th>
              <sm-table-th colspan="2">Header 2</sm-table-th>
            </sm-table-tr>
          </sm-table-thead>
          <sm-table-tbody>
            <sm-table-tr>
              <sm-table-td>Body 1</sm-table-td>
              <sm-table-td>Body 2</sm-table-td>
              <sm-table-td>Body 3</sm-table-td>
            </sm-table-tr>
            <sm-table-tr>
              <!-- empty -->
            </sm-table-tr>
          </sm-table-tbody>
          <sm-table-tfoot>
            <sm-table-tr>
              <sm-table-td>Footer 1</sm-table-td>
              <sm-table-td>Footer 2</sm-table-td>
              <sm-table-td>Footer 3</sm-table-td>
            </sm-table-tr>
          </sm-table-tfoot>
        </sm-table>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('table')).toBeVisible())
    expect(screen.getAllByRole('columnheader')).toHaveLength(2)
    expect(screen.getAllByRole('row')).toHaveLength(4)
    expect(screen.getByRole('row', { name: 'Header 1 Header 2' })).toBeVisible()
    expect(screen.getByRole('row', { name: 'Body 1 Body 2 Body 3' })).toBeVisible()
    expect(screen.getByRole('row', { name: 'Footer 1 Footer 2 Footer 3' })).toBeVisible()
    expect(screen.getByRole('row', { name: '' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Sort by descending order' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Sort by ascending order' })).not.toBeInTheDocument()
  })

  it('should emit sort events when sortable prop is true in sm-table-th', async () => {
    // ARRANGE
    const mockSortByColOne = jest.fn()
    const mockSortByColTwo = jest.fn()
    const ParentComponent = {
      components: { SmTable, SmTableTh, SmTableTr, SmTableTbody, SmTableTd, SmTableThead },
      setup: () => {
        const tableItems: Ref<Record<string, number>[]> = ref([
          { colOne: 1, colTwo: 4 },
          { colOne: 3, colTwo: 2 },
        ])

        mockSortByColOne.mockImplementation((order: 'asc' | 'desc') => {
          if (order === 'asc') {
            tableItems.value = [
              { colOne: 1, colTwo: 4 },
              { colOne: 3, colTwo: 2 },
            ]
          } else {
            tableItems.value = [
              { colOne: 3, colTwo: 2 },
              { colOne: 1, colTwo: 4 },
            ]
          }
        })

        mockSortByColTwo.mockImplementation((order: 'asc' | 'desc') => {
          if (order === 'asc') {
            tableItems.value = [
              { colOne: 3, colTwo: 2 },
              { colOne: 1, colTwo: 4 },
            ]
          } else {
            tableItems.value = [
              { colOne: 1, colTwo: 4 },
              { colOne: 3, colTwo: 2 },
            ]
          }
        })

        return { tableItems, mockSortByColOne, mockSortByColTwo }
      },
      template: `
        <sm-table>
          <sm-table-thead>
            <sm-table-tr>
              <sm-table-th
                sortable
                @sortingTableOrder="mockSortByColOne"
              >
                Column 1
              </sm-table-th>
              <sm-table-th
                sorting-icon="arrow-down"
                sorting-order="desc"
                :sortable="true"
                @sortingTableOrder="mockSortByColTwo"
              >
                Column 2
              </sm-table-th>
            </sm-table-tr>
          </sm-table-thead>
          <sm-table-tbody>
            <sm-table-tr v-for="(row, rowIndex) in tableItems" :key="rowIndex">
              <sm-table-td v-for="(col, colIndex) in row" :key="colIndex">
                {{ col }}
              </sm-table-td>
            </sm-table-tr>
          </sm-table-tbody>
        </sm-table>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('button', { name: 'Sort by descending order' })).toBeVisible())
    expect(screen.getByRole('button', { name: 'Sort by ascending order' })).toBeVisible()
    const rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent(/1\s*4/) // v-for test setup may or may not render whitespace
    expect(rows[2]).toHaveTextContent(/3\s*2/) // v-for test setup may or may not render whitespace
    expect(mockSortByColOne).toHaveBeenCalledTimes(0)
    expect(mockSortByColTwo).toHaveBeenCalledTimes(0)

    // Sort first column in descending order
    await userEvent.click(screen.getByRole('button', { name: 'Sort by descending order' }))
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'Sort by ascending order' })).toHaveLength(2))
    expect(rows[1]).toHaveTextContent(/3\s*2/) // v-for test setup may or may not render whitespace
    expect(rows[2]).toHaveTextContent(/1\s*4/) // v-for test setup may or may not render whitespace
    expect(mockSortByColOne).toHaveBeenCalledTimes(1)
    expect(mockSortByColOne).toHaveBeenCalledWith('desc')
    expect(mockSortByColTwo).toHaveBeenCalledTimes(0)

    // Sort first column in ascending order
    await userEvent.click(screen.getAllByRole('button', { name: 'Sort by ascending order' })[0])
    await waitFor(() => expect(screen.getByRole('button', { name: 'Sort by descending order' })).toBeVisible())
    expect(screen.getByRole('button', { name: 'Sort by ascending order' })).toBeVisible()
    expect(rows[1]).toHaveTextContent(/1\s*4/) // v-for test setup may or may not render whitespace
    expect(rows[2]).toHaveTextContent(/3\s*2/) // v-for test setup may or may not render whitespace
    expect(mockSortByColOne).toHaveBeenCalledTimes(2)
    expect(mockSortByColOne).toHaveBeenCalledWith('asc')
    expect(mockSortByColTwo).toHaveBeenCalledTimes(0)
  })

  it('should toggle expandable rows when sm-table-td toggle button clicked', async () => {
    // ARRANGE
    const mockExpand = jest.fn()
    const mockCollapse = jest.fn()
    const ParentComponent = {
      components: { SmTable, SmTableTh, SmTableTr, SmTableTbody, SmTableTd, SmTableThead },
      setup: () => {
        const isExpanded = ref(false)

        mockCollapse.mockImplementation(() => {
          isExpanded.value = false
        })

        mockExpand.mockImplementation(() => {
          isExpanded.value = true
        })

        return { isExpanded, mockExpand, mockCollapse }
      },
      template: `
        <sm-table>
          <sm-table-thead>
            <sm-table-tr>
              <sm-table-th>Column 1</sm-table-th>
              <sm-table-th>Column 2</sm-table-th>
            </sm-table-tr>
          </sm-table-thead>
          <sm-table-tbody>
            <sm-table-tr>
              <sm-table-td
                :expandable-row="true"
                :expanded="isExpanded"
                :aria-controls="isExpanded ? 'hidden-row-1 hidden-row-2' : null"
                @expanded="mockExpand"
                @collapse="mockCollapse"
              >
                Expandable row
              </sm-table-td>
              <sm-table-td>Cell</sm-table-td>
            </sm-table-tr>
            <sm-table-tr id="hidden-row-1" :expanded-row.sync="isExpanded">
              <sm-table-td>Hidden row 1</sm-table-td>
              <sm-table-td>Cell</sm-table-td>
            </sm-table-tr>
            <sm-table-tr id="hidden-row-2" :expanded-row.sync="isExpanded">
              <sm-table-td>Hidden row 2</sm-table-td>
              <sm-table-td>Cell</sm-table-td>
            </sm-table-tr>
          </sm-table-tbody>
        </sm-table>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('button', { name: 'Click to expand the table' })).toBeVisible())
    expect(screen.getByRole('row', { name: 'Column 1 Column 2' })).toBeVisible()
    expect(screen.getByRole('row', { name: 'Expandable row Cell' })).toBeVisible()
    expect(screen.queryByRole('row', { name: 'Hidden row 1 Cell' })).not.toBeInTheDocument()
    expect(screen.queryByRole('row', { name: 'Hidden row 2 Cell' })).not.toBeInTheDocument()
    expect(mockExpand).toHaveBeenCalledTimes(0)
    expect(mockCollapse).toHaveBeenCalledTimes(0)

    await userEvent.click(screen.getByRole('button', { name: 'Click to expand the table' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Click to collapse the table', expanded: true })).toBeVisible())
    expect(screen.getByRole('row', { name: 'Column 1 Column 2' })).toBeVisible()
    expect(screen.getByRole('row', { name: 'Expandable row Cell' })).toBeVisible()
    expect(screen.getByRole('row', { name: 'Hidden row 1 Cell' })).toBeVisible()
    expect(screen.getByRole('row', { name: 'Hidden row 2 Cell' })).toBeVisible()
    expect(mockExpand).toHaveBeenCalledTimes(1)
    expect(mockCollapse).toHaveBeenCalledTimes(0)

    await userEvent.click(screen.getByRole('button', { name: 'Click to collapse the table' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Click to expand the table' })).toBeVisible())
    expect(screen.getByRole('row', { name: 'Column 1 Column 2' })).toBeVisible()
    expect(screen.getByRole('row', { name: 'Expandable row Cell' })).toBeVisible()
    expect(screen.queryByRole('row', { name: 'Hidden row 1 Cell' })).not.toBeInTheDocument()
    expect(screen.queryByRole('row', { name: 'Hidden row 2 Cell' })).not.toBeInTheDocument()
    expect(mockExpand).toHaveBeenCalledTimes(1)
    expect(mockCollapse).toHaveBeenCalledTimes(1)
  })

  it('should emit selected events in sm-table-tr when selected prop changes', async () => {
    // ARRANGE
    const mockSelected = jest.fn()
    const ParentComponent = {
      components: { SmTable, SmTableTh, SmTableTr, SmTableTbody, SmTableTd, SmTableThead, SmButton },
      setup: () => {
        const isSelected = ref(false)

        return { isSelected, mockSelected }
      },
      template: `
        <sm-table>
          <sm-table-thead>
            <sm-table-tr>
              <sm-table-th>Column 1</sm-table-th>
              <sm-table-th>Column 2</sm-table-th>
            </sm-table-tr>
          </sm-table-thead>
          <sm-table-tbody>
            <sm-table-tr :selected="isSelected" @selected="mockSelected">
              <sm-table-td>Is selected: {{ isSelected }}</sm-table-td>
              <sm-table-td><sm-button @click="isSelected = !isSelected">Toggle</sm-button></sm-table-td>
            </sm-table-tr>
          </sm-table-tbody>
        </sm-table>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Is selected: false')).toBeVisible())
    expect(mockSelected).toHaveBeenCalledTimes(1) // watchEffect emits immediately
    expect(mockSelected).toHaveBeenLastCalledWith(false)

    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }))
    await waitFor(() => expect(screen.getByText('Is selected: true')).toBeVisible())
    expect(mockSelected).toHaveBeenCalledTimes(2)
    expect(mockSelected).toHaveBeenLastCalledWith(true)

    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }))
    await waitFor(() => expect(screen.getByText('Is selected: false')).toBeVisible())
    expect(mockSelected).toHaveBeenCalledTimes(3)
    expect(mockSelected).toHaveBeenLastCalledWith(false)
  })

  it('should disable sm-table-td content when disabled prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTable, SmTableTh, SmTableTr, SmTableTbody, SmTableTd, SmTableThead, SmButton },
      template: `
        <sm-table>
          <sm-table-thead>
            <sm-table-tr>
              <sm-table-th>Enabled</sm-table-th>
              <sm-table-th>Disabled</sm-table-th>
            </sm-table-tr>
          </sm-table-thead>
          <sm-table-tbody>
            <sm-table-tr>
              <sm-table-td>
                <sm-button>Button 1</sm-button>
              </sm-table-td>
              <sm-table-td :disabled="true">
                <sm-button>Button 2</sm-button>
              </sm-table-td>
            </sm-table-tr>
          </sm-table-tbody>
        </sm-table>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('button', { name: 'Button 1' })).toBeEnabled())
    expect(screen.getByRole('button', { name: 'Button 2' })).toBeDisabled()
  })

  it('should render mobile headers when responsive prop is true', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmTable, SmTableTh, SmTableTr, SmTableTbody, SmTableTd, SmTableThead },
      template: `
        <sm-table is-responsive>
          <sm-table-thead>
            <sm-table-tr>
              <sm-table-th> Column 1 </sm-table-th>
              <sm-table-th> Column 2</sm-table-th>
            </sm-table-tr>
          </sm-table-thead>
          <sm-table-tbody>
            <sm-table-tr>
              <sm-table-td>
                <template v-slot:data-header>
                Column 1
                </template>
                Cell 1
              </sm-table-td>
              <sm-table-td>
                <template v-slot:data-header>
                  Column 2
                </template>
                Cell 1
              </sm-table-td>
            </sm-table-tr>
            <sm-table-tr>
              <sm-table-td>
                <template v-slot:data-header>
                  Column 1
                </template>
                Cell 3
              </sm-table-td>
              <sm-table-td>
                <template v-slot:data-header>
                  Column 2
                </template>
                Cell 4
              </sm-table-td>
            </sm-table-tr>
            <sm-table-tr>
              <sm-table-td>
                <template v-slot:data-header>
                  Column 1
                </template>
                Cell 5
              </sm-table-td>
              <sm-table-td>
                <template v-slot:data-header>
                  Column 2
                </template>
                Cell 6
              </sm-table-td>
            </sm-table-tr>
          </sm-table-tbody>
        </sm-table>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.queryAllByText('Column 1')).toHaveLength(4))
    expect(screen.queryAllByText('Column 2')).toHaveLength(4)
  })

  it('should return the values when public APIs are called', async () => {
    // ARRANGE
    const cellRef = ref()
    const tableRef = ref()
    const ParentComponent = {
      components: { SmTable, SmTableTh, SmTableTr, SmTableTbody, SmTableTd, SmTableThead, SmTableTfoot },
      setup: () => {
        return { cellRef, tableRef }
      },
      template: `
        <sm-table
          ref="tableRef"
          min-width="800px"
          visible-scrollbar
          :fixed-header="true"
          :fixed-header-left="true"
          :fixed-footer="true"
        >
          <sm-table-thead>
            <sm-table-tr>
              <sm-table-th width="160px">Column 1</sm-table-th>
              <sm-table-th>Column 2</sm-table-th>
              <sm-table-th>Column 3</sm-table-th>
            </sm-table-tr>
          </sm-table-thead>
          <sm-table-tbody :alternating-rows="true">
            <sm-table-tr selected>
              <sm-table-td ref="cellRef">Cell 1</sm-table-td>
              <sm-table-td>Cell 2</sm-table-td>
              <sm-table-td>Cell 3</sm-table-td>
            </sm-table-tr>
          </sm-table-tbody>
          <sm-table-tfoot>
            <sm-table-tr>
              <sm-table-td>Footer 1</sm-table-td>
              <sm-table-td>Footer 2</sm-table-td>
              <sm-table-td>Footer 3</sm-table-td>
            </sm-table-tr>
          </sm-table-tfoot>
        </sm-table>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    // Include these in the test since these are public APIs
    const tableContainerRef = tableRef.value.getTableCotnainerRef()
    await waitFor(() => expect(tableContainerRef).toBeTruthy())
    await fireEvent.scroll(tableContainerRef as HTMLElement, { scrollX: 400 })
    expect(cellRef.value.tableRowBodyId).toBeTruthy()
  })

})
