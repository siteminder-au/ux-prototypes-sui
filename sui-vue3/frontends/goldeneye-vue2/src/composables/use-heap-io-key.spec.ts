import { render, screen, waitFor } from '@testing-library/vue'
import { provide } from 'vue'
import { CM_PAGE_ID_KEY, CM_SECTION_ID_KEY, CM_TAB_ID_KEY, useHeapIoKey } from './use-heap-io-key'

describe('use-heap-io-key composable', () => {
  it('should generate heap io key with the provided page/tab/section keys', async () => {
    const ChildComponent = {
      setup: () => {
        const { generateHeapIoKey } = useHeapIoKey('components.base.some-key')

        return {
          generateHeapIoKey,
        }
      },
      template: `
        <div>
          <h1>{{ generateHeapIoKey('hello') }}</h1>
        </div>
      `,
    }

    const ParentComponent = {
      components: {
        ChildComponent,
      },
      setup: () => {
        provide(CM_PAGE_ID_KEY, 'PageKey')
        provide(CM_TAB_ID_KEY, 'TabKey')
        provide(CM_SECTION_ID_KEY, 'SectionKey')
      },
      template: `
        <div>
          <child-component/>
        </div>
      `,
    }

    render(
      ParentComponent,
      {
        router: undefined,
      },
    )

    await waitFor(() => expect(screen.getByText('PageKey-TabKey-SectionKey-components-base-some-key__hello')).toBeVisible())
  })
})
