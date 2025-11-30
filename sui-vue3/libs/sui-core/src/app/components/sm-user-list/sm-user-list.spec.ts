import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'
import { createTestRouter } from '../../../../test/utils'
import SmUserListItem from './sm-user-list-item.vue'
import SmUserList from './sm-user-list.vue'

describe('SmUserList', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should render the standard list items', async () => {
    // ARRANGE
    const mockClick = jest.fn()
    const ParentComponent = {
      components: { SmUserList, SmUserListItem },
      setup: () => {
        return { mockClick }
      },
      template: `
        <sm-user-list>
          <sm-user-list-item @click="mockClick">Item 1</sm-user-list-item>
          <sm-user-list-item>Item 2</sm-user-list-item>
        </sm-user-list>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const listItems = await screen.findAllByRole('listitem')
    expect(await screen.findByRole('list')).toBeVisible()
    expect(listItems).toHaveLength(2)
    expect(listItems.at(0)).toHaveTextContent('Item 1')
    expect(listItems.at(1)).toHaveTextContent('Item 2')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(mockClick).toHaveBeenCalledTimes(0)

    await userEvent.click(listItems[0])

    // No button or link, so click event should not bubble up
    expect(mockClick).toHaveBeenCalledTimes(0)
  })

  it('should render the list items with specified tag', async () => {
    // ARRANGE
    const mockButtonClick = jest.fn()
    const mockLinkClick = jest.fn()
    const ParentComponent = {
      components: { SmUserList, SmUserListItem },
      setup: () => {
        return { mockButtonClick, mockLinkClick }
      },
      template: `
        <sm-user-list>
          <sm-user-list-item
            tag="button"
            type="warning"
            :selected="false"
            @click="mockButtonClick"
          >
            Item as button
          </sm-user-list-item>
          <sm-user-list-item
            tag="router-link"
            to="/test"
            :selected="true"
            @click="mockLinkClick"
          >
            Item as router-link
          </sm-user-list-item>
        </sm-user-list>
      `,
    }

    const testRouter = createTestRouter()
    const testRouterSpy = jest.spyOn(testRouter, 'push')

    // ACT
    render(ParentComponent, {
      global: {
        plugins: [testRouter],
      },
    })

    // ASSERT
    expect(await screen.findByRole('list')).toBeVisible()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Item as button' })).toBeVisible()
    expect(screen.getByRole('link')).toHaveTextContent('Item as router-link')
    expect(mockButtonClick).toHaveBeenCalledTimes(0)
    expect(mockLinkClick).toHaveBeenCalledTimes(0)
    expect(testRouterSpy).toHaveBeenCalledTimes(0)

    await userEvent.click(screen.getByRole('button', { name: 'Item as button' }))

    // Button click event should bubble up
    expect(mockButtonClick).toHaveBeenCalledTimes(1)
    expect(mockLinkClick).toHaveBeenCalledTimes(0)
    expect(testRouterSpy).toHaveBeenCalledTimes(0)

    await userEvent.click(screen.getByRole('link', { name: 'Item as router-link' }))

    expect(mockButtonClick).toHaveBeenCalledTimes(1)
    expect(mockLinkClick).toHaveBeenCalledTimes(1)
    expect(testRouterSpy).toHaveBeenCalledTimes(1)
    expect(testRouterSpy).toHaveBeenCalledWith('/test')
  })

  it('should render the list items with date slot when provided', async () => {
    // ARRANGE
    const mockClick = jest.fn()
    const ParentComponent = {
      components: { SmUserList, SmUserListItem },
      setup: () => {
        return { mockClick }
      },
      template: `
        <sm-user-list>
          <sm-user-list-item @click="mockClick">
            <template #default>Default slot</template>
            <template #date>Date slot</template>
          </sm-user-list-item>
        </sm-user-list>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const listItem = await screen.findByRole('listitem')
    expect(await screen.findByRole('list')).toBeVisible()
    expect(listItem).toHaveTextContent('Default slot')
    expect(listItem).toHaveTextContent('Date slot')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(mockClick).toHaveBeenCalledTimes(0)

    await userEvent.click(listItem)

    // No button or link, so click event should not bubble up
    expect(mockClick).toHaveBeenCalledTimes(0)
  })
})
