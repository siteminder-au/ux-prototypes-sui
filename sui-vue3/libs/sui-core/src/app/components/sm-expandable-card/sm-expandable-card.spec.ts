import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { ref } from 'vue'
import SmButton from '../sm-button/sm-button.vue'
import SmExpandableCard from './sm-expandable-card.vue'

describe('SmExpandableCard', () => {

  it('should render the header slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmExpandableCard },
      template: `
        <sm-expandable-card>
          <template #header>Header slot</template>
        </sm-expandable-card>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Header slot')).toBeVisible())
  })

  it('should render the footer slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmExpandableCard },
      template: `
        <sm-expandable-card>
          <template #footer>Footer slot</template>
        </sm-expandable-card>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Footer slot')).toBeVisible())
  })

  it('should render the default slot', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmExpandableCard },
      template: `
        <sm-expandable-card>
          <template #default>Default slot</template>
        </sm-expandable-card>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByText('Default slot')).toBeVisible())
  })

  it('should not render the body slot until card is added', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmExpandableCard },
      template: `
        <sm-expandable-card>
          <template #body>Body slot</template>
        </sm-expandable-card>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.queryByText('Body slot')).not.toBeInTheDocument())
  })

  it('should add and delete card on the list when footer action and delete buttons are clicked', async () => {
    const addCardMock = jest.fn()
    const deletedCardMock = jest.fn()
    // ARRANGE
    const ParentComponent = {
      components: { SmExpandableCard, SmButton },
      setup: () => {
        const count = ref(0)

        addCardMock.mockImplementation((list: { id: number }[]) => {
          count.value = list.length
        })

        deletedCardMock.mockImplementation(() => {
          count.value -= 1
        })

        return { count, addCardMock, deletedCardMock }
      },
      template: `
        <div>
          <sm-expandable-card @addCard="addCardMock" @deleteCard="deletedCardMock">
            <template #body>Body slot</template>
            <template #footer>
              <sm-button>Add card</sm-button>
            </template>
          </sm-expandable-card>
          <span>Items: {{ count }}</span>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const addCard = screen.getByRole('button', { name: 'Add card' })
    await waitFor(() => expect(screen.queryByText('Body slot')).not.toBeInTheDocument())
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    expect(screen.getByText('Items: 0')).toBeVisible()
    expect(addCardMock).toHaveBeenCalledTimes(0)
    expect(deletedCardMock).toHaveBeenCalledTimes(0)

    await userEvent.click(addCard)
    await waitFor(() => expect(screen.getAllByText('Body slot')[0]).toBeVisible())
    expect(screen.getAllByRole('button', { name: 'Delete' })[0]).toBeVisible()
    expect(screen.getByText('Items: 1')).toBeVisible()
    expect(addCardMock).toHaveBeenCalledTimes(1)
    expect(addCardMock).toHaveBeenLastCalledWith([{ id: 1 }])
    expect(deletedCardMock).toHaveBeenCalledTimes(0)

    await userEvent.click(addCard)
    await waitFor(() => expect(screen.getAllByText('Body slot')[1]).toBeVisible())
    expect(screen.getAllByRole('button', { name: 'Delete' })[1]).toBeVisible()
    expect(screen.getByText('Items: 2')).toBeVisible()
    expect(addCardMock).toHaveBeenCalledTimes(2)
    expect(addCardMock).toHaveBeenLastCalledWith([{ id: 1 }, { id: 2 }])
    expect(deletedCardMock).toHaveBeenCalledTimes(0)

    await userEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0])
    await waitFor(() => expect(screen.getAllByText('Body slot')[0]).toBeVisible())
    expect(screen.getAllByRole('button', { name: 'Delete' })[0]).toBeVisible()
    expect(screen.getByText('Items: 1')).toBeVisible()
    expect(addCardMock).toHaveBeenCalledTimes(2)
    expect(deletedCardMock).toHaveBeenCalledTimes(1)
    expect(deletedCardMock).toHaveBeenLastCalledWith([{ id: 1 }])

    await userEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0])
    await waitFor(() => expect(screen.queryByText('Body slot')).not.toBeInTheDocument())
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    expect(screen.getByText('Items: 0')).toBeVisible()
    expect(addCardMock).toHaveBeenCalledTimes(2)
    expect(deletedCardMock).toHaveBeenCalledTimes(2)
    expect(deletedCardMock).toHaveBeenLastCalledWith([{ id: 2 }])
  })

})
