import { render, screen } from '@testing-library/vue'
import SmLoadingTable from './sm-loading-table.vue'

describe('SmLoadingTable', () => {

  it('should load the table skeleton loaders based on the default rows and cols', () => {
    render(SmLoadingTable)
    expect(screen.getAllByRole('columnheader')).toHaveLength(4)
    expect(screen.getAllByRole('row')).toHaveLength(4)
  })

  it('should load the table skeleton loaders based on the provided rows and cols', () => {
    render(SmLoadingTable, {
      props: { totalRows: 5, totalColumns: '7' },
    })
    expect(screen.getAllByRole('columnheader')).toHaveLength(8)
    expect(screen.getAllByRole('row')).toHaveLength(6)
  })

})
