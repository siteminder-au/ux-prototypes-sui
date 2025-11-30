import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { ref } from 'vue'
import SmButton from '../sm-button/sm-button.vue'
import SmProgressBar from './sm-progress-bar.vue'

describe('SmProgressBar', () => {

  const linearAriaLabel = 'Linear Progress Bar'
  const ringAriaLabel = 'Ring Progress Bar'

  it('should display a line progress bar by default', async () => {
    // ARRANGE
    const changeMock = jest.fn()
    const ParentComponent = {
      components: { SmButton, SmProgressBar },
      setup: () => {
        const percentage = ref(10)

        return { percentage, changeMock }
      },
      template: `
        <div>
          <sm-progress-bar :percentage="percentage" @change="changeMock" />
          <sm-button @click="percentage = 90">Update percentage</sm-button>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('progressbar', { name: linearAriaLabel, value: { min: 0, max: 100, now: 10 } })).toBeVisible())
    expect(screen.getByText('10%')).toBeVisible()
    expect(changeMock).toHaveBeenCalledTimes(1) // watchEffect is called immediately

    // Update percentage prop
    await userEvent.click(screen.getByRole('button', { name: 'Update percentage' }))

    await waitFor(() => expect(screen.getByRole('progressbar', { name: linearAriaLabel, value: { min: 0, max: 100, now: 90 } })).toBeVisible())
    expect(screen.getByText('90%')).toBeVisible()
    expect(changeMock).toHaveBeenCalledTimes(2)
  })

  it('should display a circle progress bar if type prop is circle', async () => {
    const changeMock = jest.fn()
    const ParentComponent = {
      components: { SmButton, SmProgressBar },
      setup: () => {
        const percentage = ref(80.333)

        return { percentage, changeMock }
      },
      template: `
        <div>
          <sm-progress-bar type="circle" :percentage="percentage" @change="changeMock" />
          <sm-button @click="percentage = 0">Update percentage</sm-button>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('progressbar', { name: ringAriaLabel, value: { min: 0, max: 100, now: 80.333 } })).toBeVisible())
    expect(screen.getByText('80.333%')).toBeVisible()
    expect(changeMock).toHaveBeenCalledTimes(1) // watchEffect is called immediately

    // Update percentage prop
    await userEvent.click(screen.getByRole('button', { name: 'Update percentage' }))

    await waitFor(() => expect(screen.getByRole('progressbar', { name: ringAriaLabel, value: { min: 0, max: 100, now: 0 } })).toBeVisible())
    expect(screen.getByText('0%')).toBeVisible()
    expect(changeMock).toHaveBeenCalledTimes(2)
  })

  it('should render the default label outside the progress bar', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmProgressBar },
      template: `
        <div>
          <sm-progress-bar type="line" transition-timing="0.2s" :percentage="0" :stroke-height="24" />
          <sm-progress-bar type="circle" transition-timing="0.2s" :percentage="0" :stroke-height="24" :width="100" />

          <sm-progress-bar type="line" transition-timing="0.2s" :percentage="100" :stroke-height="20.5" />
          <sm-progress-bar type="circle" transition-timing="0.2s" :percentage="100" :stroke-height="20.5" :width="124.8" />
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('progressbar', { name: linearAriaLabel, value: { min: 0, max: 100, now: 0 } })).toBeVisible())
    expect(screen.getAllByText('0%')[0]).toBeVisible() // Line type
    expect(screen.getByRole('progressbar', { name: ringAriaLabel, value: { min: 0, max: 100, now: 0 } })).toBeVisible()
    expect(screen.getAllByText('0%')[1]).toBeVisible() // Circle type

    expect(screen.getByRole('progressbar', { name: linearAriaLabel, value: { min: 0, max: 100, now: 100 } })).toBeVisible()
    expect(screen.getAllByText('100%')[0]).toBeVisible() // Line type
    expect(screen.getByRole('progressbar', { name: ringAriaLabel, value: { min: 0, max: 100, now: 100 } })).toBeVisible()
    expect(screen.getAllByText('100%')[1]).toBeVisible() // Circle type
  })

  it('should render the default label inside the progress bar', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmProgressBar },
      template: `
        <div>
          <sm-progress-bar type="line" :text-inside="true" :percentage="0" />
          <sm-progress-bar type="circle" :text-inside="true" :percentage="0" />

          <sm-progress-bar type="line" :text-inside="true" :percentage="100" />
          <sm-progress-bar type="circle" :text-inside="true" :percentage="100" />
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('progressbar', { name: linearAriaLabel, value: { min: 0, max: 100, now: 0 } })).toBeVisible())
    expect(screen.getByText('0%')).toBeVisible() // Only 1 instance because inside text is not supported by circle type
    expect(screen.getByRole('progressbar', { name: ringAriaLabel, value: { min: 0, max: 100, now: 0 } })).toBeVisible()

    expect(screen.getByRole('progressbar', { name: linearAriaLabel, value: { min: 0, max: 100, now: 100 } })).toBeVisible()
    expect(screen.getByText('100%')).toBeVisible() // Only 1 instance because inside text is not supported by circle type
    expect(screen.getByRole('progressbar', { name: ringAriaLabel, value: { min: 0, max: 100, now: 100 } })).toBeVisible()
  })

  it('should render the custom label slot outside the progress bar', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmProgressBar },
      template: `
        <div>
          <sm-progress-bar type="line" transition-timing="0.2s" :percentage="0" :stroke-height="24">
            Custom label - line (zero)
          </sm-progress-bar>
          <sm-progress-bar type="circle" transition-timing="0.2s" :percentage="0" :stroke-height="24" :width="100">
            Custom label - circle (zero)
          </sm-progress-bar>

          <sm-progress-bar type="line" transition-timing="0.2s" :percentage="100" :stroke-height="20.5">
            Custom label - line (full)
          </sm-progress-bar>
          <sm-progress-bar type="circle" transition-timing="0.2s" :percentage="100" :stroke-height="20.5" :width="124.8">
            Custom label - circle (full)
          </sm-progress-bar>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('progressbar', { name: linearAriaLabel, value: { min: 0, max: 100, now: 0 } })).toBeVisible())
    expect(screen.getByText('Custom label - line (zero)')).toBeVisible()
    expect(screen.getByRole('progressbar', { name: ringAriaLabel, value: { min: 0, max: 100, now: 0 } })).toBeVisible()
    expect(screen.getByText('Custom label - circle (zero)')).toBeVisible()
    expect(screen.queryByText('0%')).not.toBeInTheDocument()

    expect(screen.getByRole('progressbar', { name: linearAriaLabel, value: { min: 0, max: 100, now: 100 } })).toBeVisible()
    expect(screen.getByText('Custom label - line (full)')).toBeVisible()
    expect(screen.getByRole('progressbar', { name: ringAriaLabel, value: { min: 0, max: 100, now: 100 } })).toBeVisible()
    expect(screen.getByText('Custom label - circle (full)')).toBeVisible()
    expect(screen.queryByText('100%')).not.toBeInTheDocument()
  })

  it('should render the custom label slot inside the progress bar', async () => {
    // ARRANGE
    const ParentComponent = {
      components: { SmProgressBar },
      template: `
        <div>
          <sm-progress-bar type="line" :text-inside="true" :percentage="0">
            Custom label - line (zero)
          </sm-progress-bar>
          <sm-progress-bar type="circle" :text-inside="true" :percentage="0">
            Custom label - circle (zero)
          </sm-progress-bar>

          <sm-progress-bar type="line" :text-inside="true" :percentage="100">
            Custom label - line (full)
          </sm-progress-bar>
          <sm-progress-bar type="circle" :text-inside="true" :percentage="100">
            Custom label - circle (full)
          </sm-progress-bar>
        </div>
      `,
    }

    // ACT
    render(ParentComponent)

    // ASSERT
    await waitFor(() => expect(screen.getByRole('progressbar', { name: linearAriaLabel, value: { min: 0, max: 100, now: 0 } })).toBeVisible())
    expect(screen.getByText('Custom label - line (zero)')).toBeVisible()
    expect(screen.getByRole('progressbar', { name: ringAriaLabel, value: { min: 0, max: 100, now: 0 } })).toBeVisible()
    // Not supported in the component
    expect(screen.queryByText('Custom label - circle (zero)')).not.toBeInTheDocument()
    expect(screen.queryByText('0%')).not.toBeInTheDocument()

    expect(screen.getByRole('progressbar', { name: linearAriaLabel, value: { min: 0, max: 100, now: 100 } })).toBeVisible()
    expect(screen.getByText('Custom label - line (full)')).toBeVisible()
    expect(screen.getByRole('progressbar', { name: ringAriaLabel, value: { min: 0, max: 100, now: 100 } })).toBeVisible()
    // Not supported in the component
    expect(screen.queryByText('Custom label - circle (full)')).not.toBeInTheDocument()
    expect(screen.queryByText('100%')).not.toBeInTheDocument()
  })

})
