import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'
import SmButton from '../sm-button/sm-button.vue'
import SmController from './sm-controller.vue'

describe('SmController', () => {

  it('should render the leftmost slot and emit event by default', async () => {
    // ARRANGE
    const mockLeftMost = jest.fn()
    const ParentComponent = {
      components: { SmButton, SmController },
      setup: () => {
        return { mockLeftMost }
      },
      template: `
        <sm-controller @leftmost="mockLeftMost">
          <template #leftmost>
            <sm-button aria-label="Jump to first" shape="square" type="text"><sm-icon name="arrow-left-alt" /></sm-button>
          </template>
        </sm-controller>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const leftMostButton = await screen.findByRole('button', { name: 'Jump to first' })
    expect(leftMostButton).toBeVisible()
    expect(mockLeftMost).toHaveBeenCalledTimes(0)

    await userEvent.click(leftMostButton)

    expect(mockLeftMost).toHaveBeenCalledTimes(1)
  })

  it('should not emit event in the leftmost slot when leftMostDisabled prop is true', async () => {
    // ARRANGE
    const mockLeftMost = jest.fn()
    const ParentComponent = {
      components: { SmButton, SmController },
      setup: () => {
        return { mockLeftMost }
      },
      template: `
        <sm-controller :left-most-disabled="true" @leftmost="mockLeftMost">
          <template #leftmost>
            <sm-button aria-label="Jump to first" shape="square" type="text"><sm-icon name="arrow-left-alt" /></sm-button>
          </template>
        </sm-controller>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const leftMostButton = await screen.findByRole('button', { name: 'Jump to first' })
    expect(leftMostButton).toBeVisible()
    expect(mockLeftMost).toHaveBeenCalledTimes(0)

    await userEvent.click(leftMostButton)

    // Button is enabled but won't emit event
    expect(mockLeftMost).toHaveBeenCalledTimes(0)
  })

  it('should not emit event in the leftmost slot when the button is disabled', async () => {
    // ARRANGE
    const mockLeftMost = jest.fn()
    const ParentComponent = {
      components: { SmButton, SmController },
      setup: () => {
        return { mockLeftMost }
      },
      template: `
        <sm-controller @leftmost="mockLeftMost">
          <template #leftmost>
            <sm-button aria-label="Jump to first" shape="square" type="text" :disabled="true"><sm-icon name="arrow-left-alt" /></sm-button>
          </template>
        </sm-controller>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const leftMostButton = await screen.findByRole('button', { name: 'Jump to first' })
    expect(leftMostButton).toBeVisible()
    expect(leftMostButton).toBeDisabled()
    expect(mockLeftMost).toHaveBeenCalledTimes(0)

    await userEvent.click(leftMostButton)

    // Button is disabled and won't bubble up event
    expect(mockLeftMost).toHaveBeenCalledTimes(0)
  })

  it('should render the left slot and emit event by default', async () => {
    // ARRANGE
    const mockLeft = jest.fn()
    const ParentComponent = {
      components: { SmButton, SmController },
      setup: () => {
        return { mockLeft }
      },
      template: `
        <sm-controller @left="mockLeft">
          <template #left>
            <sm-button aria-label="Go back" shape="square" type="text"><sm-icon name="arrow-left" /></sm-button>
          </template>
        </sm-controller>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const leftButton = await screen.findByRole('button', { name: 'Go back' })
    expect(leftButton).toBeVisible()
    expect(mockLeft).toHaveBeenCalledTimes(0)

    await userEvent.click(leftButton)

    expect(mockLeft).toHaveBeenCalledTimes(1)
  })

  it('should not emit event in the left slot when leftDisabled prop is true', async () => {
    // ARRANGE
    const mockLeft = jest.fn()
    const ParentComponent = {
      components: { SmButton, SmController },
      setup: () => {
        return { mockLeft }
      },
      template: `
        <sm-controller :left-disabled="true" @left="mockLeft">
          <template #left>
            <sm-button aria-label="Go back" shape="square" type="text"><sm-icon name="arrow-left" /></sm-button>
          </template>
        </sm-controller>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const leftButton = await screen.findByRole('button', { name: 'Go back' })
    expect(leftButton).toBeVisible()
    expect(mockLeft).toHaveBeenCalledTimes(0)

    await userEvent.click(leftButton)

    // Button is enabled but won't emit event
    expect(mockLeft).toHaveBeenCalledTimes(0)
  })

  it('should not emit event in the left slot when the button is disabled', async () => {
    // ARRANGE
    const mockLeft = jest.fn()
    const ParentComponent = {
      components: { SmButton, SmController },
      setup: () => {
        return { mockLeft }
      },
      template: `
        <sm-controller @left="mockLeft">
          <template #left>
            <sm-button aria-label="Go back" shape="square" type="text" :disabled="true"><sm-icon name="arrow-left" /></sm-button>
          </template>
        </sm-controller>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const leftButton = await screen.findByRole('button', { name: 'Go back' })
    expect(leftButton).toBeVisible()
    expect(leftButton).toBeDisabled()
    expect(mockLeft).toHaveBeenCalledTimes(0)

    await userEvent.click(leftButton)

    // Button is disabled and won't bubble up event
    expect(mockLeft).toHaveBeenCalledTimes(0)
  })

  it('should render the rightmost slot and emit event by default', async () => {
    // ARRANGE
    const mockRightMost = jest.fn()
    const ParentComponent = {
      components: { SmButton, SmController },
      setup: () => {
        return { mockRightMost }
      },
      template: `
        <sm-controller @rightmost="mockRightMost">
          <template #rightmost>
            <sm-button aria-label="Jump to last" shape="square" type="text"><sm-icon name="arrow-right-alt" /></sm-button>
          </template>
        </sm-controller>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const rightMostButton = await screen.findByRole('button', { name: 'Jump to last' })
    expect(rightMostButton).toBeVisible()
    expect(mockRightMost).toHaveBeenCalledTimes(0)

    await userEvent.click(rightMostButton)

    expect(mockRightMost).toHaveBeenCalledTimes(1)
  })

  it('should not emit event in the rightmost slot when rightMostDisabled prop is true', async () => {
    // ARRANGE
    const mockRightMost = jest.fn()
    const ParentComponent = {
      components: { SmButton, SmController },
      setup: () => {
        return { mockRightMost }
      },
      template: `
        <sm-controller :right-most-disabled="true" @rightmost="mockRightMost">
          <template #rightmost>
            <sm-button aria-label="Jump to last" shape="square" type="text"><sm-icon name="arrow-right-alt" /></sm-button>
          </template>
        </sm-controller>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const rightMostButton = await screen.findByRole('button', { name: 'Jump to last' })
    expect(rightMostButton).toBeVisible()
    expect(mockRightMost).toHaveBeenCalledTimes(0)

    await userEvent.click(rightMostButton)

    // Button is enabled but won't emit event
    expect(mockRightMost).toHaveBeenCalledTimes(0)
  })

  it('should not emit event in the rightmost slot when the button is disabled', async () => {
    // ARRANGE
    const mockRightMost = jest.fn()
    const ParentComponent = {
      components: { SmButton, SmController },
      setup: () => {
        return { mockRightMost }
      },
      template: `
        <sm-controller @rightmost="mockRightMost">
          <template #rightmost>
            <sm-button aria-label="Jump to last" shape="square" type="text" :disabled="true"><sm-icon name="arrow-right-alt" /></sm-button>
          </template>
        </sm-controller>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const rightMostButton = await screen.findByRole('button', { name: 'Jump to last' })
    expect(rightMostButton).toBeVisible()
    expect(mockRightMost).toHaveBeenCalledTimes(0)

    await userEvent.click(rightMostButton)

    // Button is disabled and won't bubble up event
    expect(mockRightMost).toHaveBeenCalledTimes(0)
  })

  it('should render the right slot and emit event by default', async () => {
    // ARRANGE
    const mockRight = jest.fn()
    const ParentComponent = {
      components: { SmButton, SmController },
      setup: () => {
        return { mockRight }
      },
      template: `
        <sm-controller @right="mockRight">
          <template #right>
            <sm-button aria-label="Go forward" shape="square" type="text"><sm-icon name="arrow-right" /></sm-button>
          </template>
        </sm-controller>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const rightButton = await screen.findByRole('button', { name: 'Go forward' })
    expect(rightButton).toBeVisible()
    expect(mockRight).toHaveBeenCalledTimes(0)

    await userEvent.click(rightButton)

    expect(mockRight).toHaveBeenCalledTimes(1)
  })

  it('should not emit event in the right slot when rightDisabled prop is true', async () => {
    // ARRANGE
    const mockRight = jest.fn()
    const ParentComponent = {
      components: { SmButton, SmController },
      setup: () => {
        return { mockRight }
      },
      template: `
        <sm-controller :right-disabled="true" @right="mockRight">
          <template #right>
            <sm-button aria-label="Go forward" shape="square" type="text"><sm-icon name="arrow-right" /></sm-button>
          </template>
        </sm-controller>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const rightButton = await screen.findByRole('button', { name: 'Go forward' })
    expect(rightButton).toBeVisible()
    expect(mockRight).toHaveBeenCalledTimes(0)

    await userEvent.click(rightButton)

    // Button is enabled but won't emit event
    expect(mockRight).toHaveBeenCalledTimes(0)
  })

  it('should not emit event in the right slot when the button is disabled', async () => {
    // ARRANGE
    const mockRight = jest.fn()
    const ParentComponent = {
      components: { SmButton, SmController },
      setup: () => {
        return { mockRight }
      },
      template: `
        <sm-controller @right="mockRight">
          <template #right>
            <sm-button aria-label="Go forward" shape="square" type="text" :disabled="true"><sm-icon name="arrow-right" /></sm-button>
          </template>
        </sm-controller>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    const rightButton = await screen.findByRole('button', { name: 'Go forward' })
    expect(rightButton).toBeVisible()
    expect(mockRight).toHaveBeenCalledTimes(0)

    await userEvent.click(rightButton)

    // Button is disabled and won't bubble up event
    expect(mockRight).toHaveBeenCalledTimes(0)
  })

  it('should render the body slot when provided', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmController },
      template: `
        <sm-controller>
          <template #body>
            Text in here
          </template>
        </sm-controller>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    expect(await screen.findByText('Text in here')).toBeVisible()
  })

})
