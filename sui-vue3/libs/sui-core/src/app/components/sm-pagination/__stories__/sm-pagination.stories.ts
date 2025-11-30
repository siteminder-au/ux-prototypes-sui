import { ref } from 'vue'
import SmPagination from '../sm-pagination.vue'
import defaultExample from './images/pagination-default.png'
import themedExample from './images/pagination-themed.png'

export default {
  title: 'Components/Pagination',
  decorators: [],
  component: SmPagination,
}

export const Variants = () => ({
  components: { SmPagination },
  setup: () => {
    const currentPage = ref(5)
    const currentPage2 = ref(1)

    const itemsToShow = ref(10)
    const itemsToShow2 = ref(10)

    return {
      currentPage,
      currentPage2,
      itemsToShow,
      itemsToShow2,
    }
  },
  template: `
    <div>
      <span class="sui-storybook-header">Standard</span>
      <p>Current page: {{ currentPage }}</p>
      <!-- Vue3 syntax requires v-model:current-page rather than current-page.sync and so on -->
      <sm-pagination
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsToShow"
        :max-visible-buttons="7"
        :total-items="91"
      ></sm-pagination>

      <br/><br/>

      <span class="sui-storybook-header">Expanded</span>
      <!-- Vue3 syntax requires v-model:current-page rather than current-page.sync and so on -->
      <sm-pagination
        v-model:current-page="currentPage2"
        v-model:items-per-page="itemsToShow2"
        show-go-to-input
        type="expanded"
        :max-visible-buttons="9"
        :total-items="1001"
      />
    </div>
  `,
})

Variants.parameters = {}

export const Callbacks = () => ({
  components: { SmPagination },
  setup: () => {
    const currentPage = ref(5)

    const itemsToShow = ref(10)

    const onBeforePrevPageChange = (setPrevPage: () => void): void => {
      console.info('beforePrevPageChange')
      // do stuff
      setPrevPage()
    }

    const onBeforeNextPageChange = (setNextPage: () => void): void => {
      console.info('beforeNextPageChange')
      // do stuff
      setNextPage()
    }

    const onBeforePageNumberChange = (pageNumber: number, from: number, next: () => void): void => {
      console.info('beforePageNumberChange', pageNumber, from)
      // do stuff
      next()
    }

    const onBeforePageSizeChange = (to: number, from: number, next: () => void): void => {
      console.info('beforePageSizeChange', to, from)
      // do stuff
      next()
    }

    return {
      currentPage,
      itemsToShow,
      onBeforePrevPageChange,
      onBeforeNextPageChange,
      onBeforePageNumberChange,
      onBeforePageSizeChange,
    }
  },
  template: `
    <div>
      <p>Current page: {{ currentPage }}</p>

      <!-- Vue3 syntax requires v-model:current-page rather than current-page.sync and so on -->
      <sm-pagination
        type="expanded"
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsToShow"
        :show-go-to-input="false"
        :max-visible-buttons="9"
        :total-items="1001"
        :before-page-number-change="onBeforePageNumberChange"
        :before-page-size-change="onBeforePageSizeChange"
        :before-prev-page-change="onBeforePrevPageChange"
        :before-next-page-change="onBeforeNextPageChange"
        >

      </sm-pagination>

    </div>
  `,
})

const callbacksDocs = `
  Use the <code>before-prev-page-change</code> and <code>before-next-page-change</code> props to intercept page change on previous and next button click, it will prevent page from changing.

  Use <code>before-page-number-change</code> prop callback to prevent page number change.
  This will accept three arguments:
  1. <code>pageNumber</code> The next page number, For page PageCycler buttons It will return -1 and -2
  2. <code>from</code> The index of the current tab
  3. <code>next</code> A callback function


  Use <code>before-page-size-change</code> prop callback to prevent page size change.
  This will accept three arguments:
  1. <code>to</code> The next page index
  2. <code>from</code> The index of the current tab
  3. <code>next</code> A callback function


  Please note: Input callback is out of scope at the moment.
`

Callbacks.parameters = {
  docs: {
    description: {
      story: callbacksDocs,
    },
  },
}

export const StylingHooks = () => ({
  setup: () => {
    const defaultImage = defaultExample
    const themedImage = themedExample

    return {
      defaultImage,
      themedImage,
    }
  },
  template: `
    <div>
    <h3>Styling hooks</h3>
    <p>Styling hooks will enable customization for your components. Styling hooks are constructed using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">CSS custom properties</a>.</p>

      <p>Below is an example of the SUI pagination and the themed pagination using Styling hooks</p>
      <div class="flex flex-col items-start gap-24">
        <img
          style="width: 100%; max-width: 778px; height: auto; min-width: 0"
          alt="Pagination default example"
          class="block flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 778px; height: auto; min-width: 0"
          alt="Pagination themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the pagination customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

      <sm-table>
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Properties </sm-table-th>
            <sm-table-th> Category</sm-table-th>
            <sm-table-th class="w-1/2 small-desktop:w-3/5"> Styling Hooks</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
         <sm-table-tr>
            <sm-table-td>Previous button</sm-table-td>
            <sm-table-td>
              margin
              <br/>
              text-color
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-pagination-prev-button-margin
                --sm-c-pagination-prev-button-color-text
                --sm-c-pagination-prev-button-margin-expanded
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Next button</sm-table-td>
            <sm-table-td>
              margin
              <br/>
              text-color
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-pagination-next-button-margin
                --sm-c-pagination-next-button-color-text
                --sm-c-pagination-next-button-margin-expanded
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Go to</sm-table-td>
            <sm-table-td>
              margin
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-pagination-go-to-margin
                --sm-c-pagination-go-to-label-margin
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Expanded</sm-table-td>
            <sm-table-td>
              border-radius
              <br/>
              height
              <br/>
              min-width
              <br/>
              padding
              <br/>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-pagination-button-border-radius-expanded
                --sm-c-pagination-button-height-expanded
                --sm-c-pagination-button-min-width-expanded
                --sm-c-pagination-button-padding-expanded

                --sm-c-pagination-button-color-background-expanded-clicked
                --sm-c-pagination-button-color-background-expanded-current

                --sm-c-pagination-button-margin-expanded-gap
                --sm-c-pagination-button-color-expanded
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Input</sm-table-td>
            <sm-table-td>
              margin
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-pagination-input-margin
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'

StylingHooks.parameters = {
  info: false,
}
