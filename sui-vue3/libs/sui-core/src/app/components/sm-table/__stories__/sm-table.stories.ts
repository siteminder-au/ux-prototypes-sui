import vueRouter from 'storybook-vue3-router'
import { orderBy } from 'lodash-es'
import { onMounted, ref } from 'vue'
import SmTable from '../sm-table.vue'
import SmTableTh from '../sm-table-th.vue'
import SmTableTd from '../sm-table-td.vue'
import SmTableTr from '../sm-table-tr.vue'
import SmTableTbody from '../sm-table-tbody.vue'
import SmTableThead from '../sm-table-thead.vue'
import SmTableTfoot from '../sm-table-tfoot.vue'
import SmDropdown from '../../sm-dropdown/sm-dropdown.vue'
import SmPopover from '../../sm-popover/sm-popover.vue'
import { SmTooltip } from '../../sm-tooltip'
import { SmVerticalNav, SmVerticalNavItem } from '../../sm-vertical-nav'
import { SmSelect } from '../../forms/sm-select'
import defaultExample from './images/table-default.png'
import themedExample from './images/table-themed.png'

const EmptyComponent = () => ({
  template: '<div>Home</div>',
})
EmptyComponent.displayName = 'EmptyComponent'

export default {
  title: 'Components/Table',
  decorators: [
    // See: https://corechasm.com/addons/storybook-vue3-router
    // Match all routes so we can test the active state of the nav items
    vueRouter([
      {
        path: '/:catchAll(.*)',
        name: 'not-found',
        component: EmptyComponent,
      },
    ]),
  ],
  component: SmTable,
  subcomponents: {
    'sm-table-tbody': SmTableTbody,
    'sm-table-td': SmTableTd,
    'sm-table-tfoot': SmTableTfoot,
    'sm-table-th': SmTableTh,
    'sm-table-thead': SmTableThead,
    'sm-table-tr': SmTableTr,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Au1waCRAR4SpFvIgEMASgf/sui-documentation?node-id=19%3A340925&t=hCpfPUmCPPZSF5zx-0',
    },
  },
}

export const Standard = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  template: `
    <div>
      <sm-table min-width="1558px">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>
    </div>
  `,
})

Standard.parameters = {
  docs: {
    description: {
      component: 'The <code>sm-table</code> component exposes a <code>getTableContainerRef()</code> method. You can access them by assigning a <code>ref</code>. <br/> Use <code>min-width</code> to set the minimum width of a table element. It limits the width property to be not smaller than the value specified in min-width.',
    },
  },
}

export const Sorting = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  setup: () => {
    const tableItems = ref([
      {
        name: 'Nick',
        date: 'Apr 21, 2020',
        city: 'Sydney',
        state: 'NSW',
        Total: '2000',
      },
      {
        name: 'Andy',
        date: 'Jan 20, 2020',
        city: 'Melbourne',
        state: 'VIC',
        Total: '3000',
      },
      {
        name: 'Mike',
        date: 'March 10 2020',
        city: 'Brisbane',
        state: 'QLD',
        Total: '4000',
      },
      {
        name: 'Jack',
        date: 'June 20 2020',
        city: 'Brisbane',
        state: 'QLD',
        Total: '4001',
      },
      {
        name: 'Rahul',
        date: 'Apr 21 2020',
        city: 'Sydney',
        state: 'NSW',
        Total: '2000',
      },
    ])

    const tableItems2 = ref([
      {
        name: 'Nick',
        date: 'Apr 21, 2020',
        city: 'Sydney',
        state: 'NSW',
        Total: '2000',
      },
      {
        name: 'Andy',
        date: 'Jan 20, 2020',
        city: 'Melbourne',
        state: 'VIC',
        Total: '3000',
      },
      {
        name: 'Mike',
        date: 'March 10 2020',
        city: 'Brisbane',
        state: 'QLD',
        Total: '4000',
      },
      {
        name: 'Jack',
        date: 'June 20 2020',
        city: 'Brisbane',
        state: 'QLD',
        Total: '4001',
      },
      {
        name: 'Rahul',
        date: 'Apr 21 2020',
        city: 'Sydney',
        state: 'NSW',
        Total: '2000',
      },
    ])

    const sortingTableOrder = (order: 'asc' | 'desc') => {
      tableItems.value = orderBy(tableItems.value, ['name'], [order])
    }
    const sortByName = (order: 'asc' | 'desc') => {
      sortingIconForName.value = order === 'asc' ? 'sort-ascending' : 'sort-descending'
      sortingIconForCity.value = 'action-switch-vert'
      tableItems2.value = orderBy(tableItems2.value, ['name'], [order])
    }
    const sortByCity = (order: 'asc' | 'desc') => {
      sortingIconForCity.value = order === 'asc' ? 'sort-ascending' : 'sort-descending'
      sortingIconForName.value = 'action-switch-vert'
      tableItems2.value = orderBy(tableItems2.value, ['city'], [order])
    }
    const sortingIconForName = ref('action-switch-vert')
    const sortingIconForCity = ref('action-switch-vert')

    return {
      tableItems,
      tableItems2,
      sortingIconForName,
      sortingIconForCity,
      sortingTableOrder,
      sortByName,
      sortByCity,
    }
  },
  template: `
    <div>
      <span class="sui-storybook-header">Single column</span>
      <sm-table min-width="1558px">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th :sortable="true" @sortingTableOrder="sortingTableOrder"> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr v-for="(row, j) in tableItems" :key='j'>
            <sm-table-td v-for="(col,k) in row" :key='k'>{{col}}</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">Multiple columns</span>
      <sm-table min-width="1558px">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th :sortable="true" @sortingTableOrder="sortByName" :sortingIcon="sortingIconForName"> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th :sortable="true" @sortingTableOrder="sortByCity" :sortingIcon="sortingIconForCity"> City </sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr v-for="(row, j) in tableItems2" :key='j'>
            <sm-table-td v-for="(col,k) in row" :key='k'>{{col}}</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>
    </div>
  `,
})

Sorting.parameters = {
  docs: {
    description: {
      story: 'The component supports sorting. To enable sorting the <code>sm-table-th</code> component should have the sorting prop set to true. Listen to the <code>sortingTableOrder</code> event which will emit the sorting order on click of the sort icon and provide the sorting value \'asc/desc\' by default: \'asc\'.',
    },
  },
}

export const AlternatingRows = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  template: `
    <div>
      <sm-table min-width="1558px">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody :alternating-rows="true">
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>
    </div>
  `,
})

AlternatingRows.storyName = 'Alternating rows'

export const SelectedState = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  setup: () => {
    const selected = ref(true)
    const selectedAll = ref(false)
    const isChecked = ref(false)
    const selected1 = ref(false)
    const selected2 = ref(true)
    const selected3 = ref(false)

    const isSelected = (a: any) => {
      console.info('isSelected', a)
    }
    const change = (is: boolean) => {
      if (is) {
        selected1.value = true
        selected2.value = true
        selected3.value = true
      } else {
        selected1.value = false
        selected2.value = false
        selected3.value = false
      }
    }

    return {
      selected,
      selectedAll,
      selected1,
      selected2,
      selected3,
      isChecked,
      isSelected,
      change,
    }
  },
  template: `
    <div>
      <span class="sui-storybook-header">Default</span>
      <sm-table min-width="1558px">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Header One</sm-table-th>
            <sm-table-th> Header Two</sm-table-th>
            <sm-table-th> Header Three</sm-table-th>
            <sm-table-th> Header Four</sm-table-th>
            <sm-table-th> Header Five</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr :selected="selected">
            <sm-table-td>Column One</sm-table-td>
            <sm-table-td> Column Two</sm-table-td>
            <sm-table-td> Column Three</sm-table-td>
            <sm-table-td> Column Four</sm-table-td>
            <sm-table-td> Column Five</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">With checkbox</span>
      <sm-table min-width="1558px">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th class="border-none">
              <sm-checkbox @change="change(isChecked=!isChecked)" :error-disabled="true" :selected-value="selected" v-model="selectedAll" name="selected"></sm-checkbox>
            </sm-table-th>
            <sm-table-th> Header One</sm-table-th>
            <sm-table-th> Header Two</sm-table-th>
            <sm-table-th> Header Three</sm-table-th>
            <sm-table-th> Header Four</sm-table-th>
            <sm-table-th> Header Five</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr :selected="selected1" @selected="(a) => isSelected(a)">
            <sm-table-td class="border-none">
              <sm-checkbox :error-disabled="true" :selected-value="selected1" v-model="selected1" name="selected1"></sm-checkbox>
            </sm-table-td>
            <sm-table-td>Column One</sm-table-td>
            <sm-table-td> Column Two</sm-table-td>
            <sm-table-td> Column Three</sm-table-td>
            <sm-table-td> Column Four</sm-table-td>
            <sm-table-td> Column Five</sm-table-td>
          </sm-table-tr>
          <sm-table-tr :selected="selected2">
            <sm-table-td class="border-none">
              <sm-checkbox :error-disabled="true" :selected-value="selected2" v-model="selected2" name="selected2"></sm-checkbox>
            </sm-table-td>
            <sm-table-td>Column One</sm-table-td>
            <sm-table-td> Column Two</sm-table-td>
            <sm-table-td> Column Three</sm-table-td>
            <sm-table-td> Column Four</sm-table-td>
            <sm-table-td> Column Five</sm-table-td>
          </sm-table-tr>
          <sm-table-tr :selected="selected3">
            <sm-table-td class="border-none">
              <sm-checkbox :error-disabled="true" :selected-value="selected3" v-model="selected3" name="selected3"></sm-checkbox>
            </sm-table-td>
            <sm-table-td>Column One</sm-table-td>
            <sm-table-td> Column Two</sm-table-td>
            <sm-table-td> Column Three</sm-table-td>
            <sm-table-td> Column Four</sm-table-td>
            <sm-table-td> Column Five</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>
    </div>
  `,
})

SelectedState.storyName = 'Selected state'
SelectedState.parameters = {
  docs: {
    description: {
      story: 'The <code>sm-table-tr</code> component emits <code>selected</code> events in order to return true or false selected states of the table row. <br/> If using with a checkbox, use checkbox \'change/click\' events in order to manipulate the table selected props',
    },
  },
}

export const FixedHeader = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
    SmVerticalNav,
    SmVerticalNavItem,
    SmDropdown,
  },
  template: `
    <div>
      <sm-table :fixed-header="true" :fixed-header-left="true" min-width="1558px" visibleScrollbarX tabindex="0">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th width="300px"> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>
    </div>
  `,
})

export const FixedColumnHeaderLeft = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  template: `
    <div style="overflow:auto">
      <sm-table :fixed-header-left="true" min-width="1558px" tabindex="0">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th width="200px"> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
          </sm-table-tr>
            <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>
    </div>
  `,
})

FixedColumnHeaderLeft.storyName = 'Fixed column header left'

FixedColumnHeaderLeft.parameters = {
  docs: {
    description: {
      story: 'In order to show fixed table column left parent element should have style of given width and overflow scroll. <br/> Use <code>min-width</code> to set the minimum width of a table element. It limits the width property to be not smaller than the value specified in min-width. <br/> Add <code>tabindex="0"</code> to table component to make it keyboard accessible if the table does not contain any focusable elements. <br/> Additional reading https://accessibilityinsights.io/info-examples/web/scrollable-region-focusable/',
    },
  },
}

export const FixedColumnHeaderRight = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  template: `
    <div style="overflow:auto">
      <sm-table :fixed-header-right="true" min-width="1558px" tabindex="0">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
          </sm-table-tr>
            <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>
    </div>
  `,
})

FixedColumnHeaderRight.storyName = 'Fixed column header right'

FixedColumnHeaderRight.parameters = {
  docs: {
    description: {
      story: 'In order to show fixed table column right parent element should have style of given width and overflow scroll. <br/> Use <code>min-width</code> to set the minimum width of a table element. It limits the width property to be not smaller than the value specified in min-width.',
    },
  },
}

export const FixedFooter = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  template: `
    <div>
      <sm-table :fixed-footer="true" min-width="1558px">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>
    </div>
  `,
})

FixedFooter.storyName = 'Fixed footer'

export const StaticHeader = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  template: `
    <div>
      <span class="sui-storybook-header">X-small</span>
      <sm-table :fixed-header="true" min-width="1558px" size="x-small">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th colspan="4" :static-header="true"> Name </sm-table-th>
            <sm-table-th colspan="3" :static-header="true"> Date</sm-table-th>
            <sm-table-th colspan="3" :static-header="true"> Date</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">Small</span>
      <sm-table :fixed-header="true" min-width="1558px" size="small">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th colspan="4" :static-header="true"> Name </sm-table-th>
            <sm-table-th colspan="3" :static-header="true"> Date</sm-table-th>
            <sm-table-th colspan="3" :static-header="true"> Date</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">Medium (Standard)</span>
      <sm-table :fixed-header="true" min-width="1558px">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th colspan="4" :static-header="true"> Name </sm-table-th>
            <sm-table-th colspan="3" :static-header="true"> Date</sm-table-th>
            <sm-table-th colspan="3" :static-header="true"> Date</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">Large</span>
      <sm-table :fixed-header="true" min-width="1558px" size="large">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th colspan="4" :static-header="true"> Name </sm-table-th>
            <sm-table-th colspan="3" :static-header="true"> Date</sm-table-th>
            <sm-table-th colspan="3" :static-header="true"> Date</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">X-large</span>
      <sm-table :fixed-header="true" min-width="1558px" size="x-large">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th colspan="4" :static-header="true"> Name </sm-table-th>
            <sm-table-th colspan="3" :static-header="true"> Date</sm-table-th>
            <sm-table-th colspan="3" :static-header="true"> Date</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>
    </div>
  `,
})

StaticHeader.storyName = 'Static header'

StaticHeader.parameters = {
  docs: {
    description: {
      story: 'Use <code>static-header</code> props to display static header on top.',
    },
  },
}

export const ExpandableRowLevel1 = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  setup: () => {
    const expandedL1 = ref(true)
    return {
      expandedL1,
    }
  },
  template: `
    <div>
      <sm-table :fixed-header-left="true" min-width="1558px">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th width="368px"> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Name </sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td :expanded="expandedL1" @expanded="expandedL1 = true" @collapse="expandedL1 = false" :aria-controls="expandedL1 ? 'one_id two_id' : null" expandableRow>
              <div>
                <sm-icon name="section-rate-plans" />
                <span style="font-weight: 600; padding-left: 16px">Body/L1-{{ expandedL1 ? 'open' : 'closed' }}</span>
                <span style="margin: -12px 0; position: absolute; right: 2px; top: 16px">
                  <sm-button shape="square" type="text" aria-label="Add row"><sm-icon name="controls-add" /></sm-button>
                </span>
              </div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="one_id" v-model:expanded-row="expandedL1">
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="two_id" v-model:expanded-row="expandedL1">
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>
    </div>
  `,
})

ExpandableRowLevel1.storyName = 'Expandable Row: level 1'

ExpandableRowLevel1.parameters = {
  docs: {
    description: {
      story: 'The <code>aria-controls</code> props is a \'relationship attribute\' which denotes which elements in a page an interactive element or set of elements has control over. <br/> It\'s commonly used to describe a relationship between a button and the expandable region revealed by that button. <br/> An <code>aria-controls</code> attributes use the <code>id</code> of expandable component to relate each other. <br/>For example, <code>sm-table-td</code> component <code>aria-controls</code> props to control <code>sm-table-tr</code> component region by <code>id</code> props. <br/>Use <code>min-width</code> to set the minimum width of a table element. It limits the width property to be not smaller than the value specified in min-width.',
    },
  },
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/Au1waCRAR4SpFvIgEMASgf/sui-documentation?node-id=19%3A343042&t=FGmzw9zDCzDJPXEp-0',
  },
}

export const ExpandableRowLevel2 = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  setup: () => {
    const expanded = ref(false)
    const expandedOne = ref(false)
    const expandedTwo = ref(true)
    const expandedThree = ref(true)
    const expandedFour = ref(false)

    const expanded1 = ref(false)
    const expandedOne1 = ref(false)
    const expandedTwo1 = ref(true)
    const expandedThree1 = ref(true)
    const expandedFour1 = ref(false)

    const expanded2 = ref(false)
    const expandedOne2 = ref(false)
    const expandedTwo2 = ref(true)
    const expandedThree2 = ref(true)
    const expandedFour2 = ref(false)

    const expanded3 = ref(false)
    const expandedOne3 = ref(false)
    const expandedTwo3 = ref(true)
    const expandedThree3 = ref(true)
    const expandedFour3 = ref(false)

    const expanded4 = ref(false)
    const expandedOne4 = ref(false)
    const expandedTwo4 = ref(true)
    const expandedThree4 = ref(true)
    const expandedFour4 = ref(false)
    return {
      expanded,
      expandedOne,
      expandedTwo,
      expandedThree,
      expandedFour,
      expanded1,
      expandedOne1,
      expandedTwo1,
      expandedThree1,
      expandedFour1,
      expanded2,
      expandedOne2,
      expandedTwo2,
      expandedThree2,
      expandedFour2,
      expanded3,
      expandedOne3,
      expandedTwo3,
      expandedThree3,
      expandedFour3,
      expanded4,
      expandedOne4,
      expandedTwo4,
      expandedThree4,
      expandedFour4,
    }
  },
  template: `
    <div style="overflow:auto">
     <span class="sui-storybook-header">X-Small</span>
      <sm-table :fixed-header-left="true" min-width="1558px" size="x-small">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th width="368px"> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Name </sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td :expanded="expanded" @expanded="expanded = true" @collapse="expanded = false; expandedOne = false" :aria-controls="expanded ? 'one_id five_id' : null" expandableRow>
              <div><sm-icon name="section-rate-plans"/><span style="font-weight: 600; padding-left: 16px">Body/L1-open</span><span style="position: absolute; right: 2px; top: 0px"><sm-button shape="square" type="text" aria-label="Add row"><sm-icon name="controls-add"/></sm-button></span></div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="one_id" v-model:expanded-row="expanded">
            <sm-table-td :expanded="expandedOne" @expanded="expandedOne = true" @collapse="expandedOne = false" :aria-controls="expandedOne ? 'two_id three_id' : null" expandableRow>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="two_id" v-model:expanded-row="expandedOne" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="three_id" v-model:expanded-row="expandedOne" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="five_id" v-model:expanded-row="expanded">
            <sm-table-td :expanded="expandedFour" @expanded="expandedFour = true" @collapse="expandedFour = false" :aria-controls="expandedFour ? 'six_id' : null" expandableRow>Text</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="six_id" v-model:expanded-row="expandedFour" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td :expanded="expandedTwo" @expanded="expandedTwo = true" @collapse="expandedTwo = false; expandedThree = false" :aria-controls="expandedTwo ? 'four_id' : null" expandableRow>
              <div><sm-icon name="section-rate-plans"/><span style="font-weight: 600; padding-left: 16px">Body/L1-open</span><span style="position: absolute; right: 2px; top: 0px"><sm-button shape="square" type="text" aria-label="Add row"><sm-icon name="controls-add"/></sm-button></span></div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="four_id" v-model:expanded-row="expandedTwo">
            <sm-table-td :expanded="expandedThree" @expanded="expandedThree = true" @collapse="expandedThree = false" :aria-controls="expandedThree ? 'seven_id' : null" expandableRow>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="seven_id" v-model:expanded-row="expandedThree" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">Small</span>
      <sm-table :fixed-header-left="true" min-width="1558px" size="small">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th width="368px"> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Name </sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td :expanded="expanded1" @expanded="expanded1 = true" @collapse="expanded1 = false; expandedOne1 = false" :aria-controls="expanded1 ? 'one_id five_id' : null" expandableRow>
              <div><sm-icon name="section-rate-plans"/><span style="font-weight: 600; padding-left: 16px">Body/L1-open</span><span style="margin: -13px 0;position: absolute; right: 2px; top: 16px"><sm-button shape="square" type="text" aria-label="Add row"><sm-icon name="controls-add"/></sm-button></span></div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="one_id" v-model:expanded-row="expanded1">
            <sm-table-td :expanded="expandedOne1" @expanded="expandedOne1 = true" @collapse="expandedOne1 = false" :aria-controls="expandedOne1 ? 'two_id three_id' : null" expandableRow>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="two_id" v-model:expanded-row="expandedOne1" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="three_id" v-model:expanded-row="expandedOne1" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="five_id" v-model:expanded-row="expanded1">
            <sm-table-td :expanded="expandedFour1" @expanded="expandedFour1 = true" @collapse="expandedFour1 = false" :aria-controls="expandedFour1 ? 'six_id' : null" expandableRow>Text</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="six_id" v-model:expanded-row="expandedFour1" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td :expanded="expandedTwo1" @expanded="expandedTwo1 = true" @collapse="expandedTwo1 = false; expandedThree1 = false" :aria-controls="expandedTwo1 ? 'four_id' : null" expandableRow>
              <div><sm-icon name="section-rate-plans"/><span style="font-weight: 600; padding-left: 16px">Body/L1-open</span><span style="margin: -13px 0; position: absolute; right: 2px; top: 16px"><sm-button shape="square" type="text" aria-label="Add row"><sm-icon name="controls-add"/></sm-button></span></div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="four_id" v-model:expanded-row="expandedTwo1">
            <sm-table-td :expanded="expandedThree1" @expanded="expandedThree1 = true" @collapse="expandedThree1 = false" :aria-controls="expandedThree1 ? 'seven_id' : null" expandableRow>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="seven_id" v-model:expanded-row="expandedThree1" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">Medium (Standard)</span>
      <sm-table :fixed-header-left="true" min-width="1558px">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th width="368px"> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Name </sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td :expanded="expanded2" @expanded="expanded2 = true" @collapse="expanded2 = false; expandedOne2 = false" :aria-controls="expanded2 ? 'one_id five_id' : null" expandableRow>
              <div><sm-icon name="section-rate-plans"/><span style="font-weight: 600; padding-left: 16px">Body/L1-open</span><span style="margin: -12px 0; position: absolute; right: 2px; top: 16px"><sm-button shape="square" type="text" aria-label="Add row"><sm-icon name="controls-add"/></sm-button></span></div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="one_id" v-model:expanded-row="expanded2">
            <sm-table-td :expanded="expandedOne2" @expanded="expandedOne2 = true" @collapse="expandedOne2 = false" :aria-controls="expandedOne2 ? 'two_id three_id' : null" expandableRow>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="two_id" v-model:expanded-row="expandedOne2" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="three_id" v-model:expanded-row="expandedOne2" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="five_id" v-model:expanded-row="expanded2">
            <sm-table-td :expanded="expandedFour2" @expanded="expandedFour2 = true" @collapse="expandedFour2 = false" :aria-controls="expandedFour2 ? 'six_id' : null" expandableRow>Text</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="six_id" v-model:expanded-row="expandedFour2" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td :expanded="expandedTwo2" @expanded="expandedTwo2 = true" @collapse="expandedTwo2 = false; expandedThree2 = false" :aria-controls="expandedTwo2 ? 'four_id' : null" expandableRow>
              <div><sm-icon name="section-rate-plans"/><span style="font-weight: 600; padding-left: 16px">Body/L1-open</span><span style="margin: -12px 0; position: absolute; right: 2px; top: 16px"><sm-button shape="square" type="text" aria-label="Add row"><sm-icon name="controls-add"/></sm-button></span></div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="four_id" v-model:expanded-row="expandedTwo2">
            <sm-table-td :expanded="expandedThree2" @expanded="expandedThree2 = true" @collapse="expandedThree2 = false" :aria-controls="expandedThree2 ? 'seven_id' : null" expandableRow>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="seven_id" v-model:expanded-row="expandedThree2" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">Large</span>
      <sm-table :fixed-header-left="true" min-width="1558px" size="large">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th width="368px"> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Name </sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td :expanded="expanded3" @expanded="expanded3 = true" @collapse="expanded3 = false; expandedOne3 = false" :aria-controls="expanded3 ? 'one_id five_id' : null" expandableRow>
              <div><sm-icon name="section-rate-plans"/><span style="font-weight: 600; padding-left: 16px">Body/L1-open</span><span style="margin: -12px 0; position: absolute; right: 2px; top: 20px"><sm-button shape="square" type="text" aria-label="Add row"><sm-icon name="controls-add"/></sm-button></span></div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="one_id" v-model:expanded-row="expanded3">
            <sm-table-td :expanded="expandedOne3" @expanded="expandedOne3 = true" @collapse="expandedOne3 = false" :aria-controls="expandedOne3 ? 'two_id three_id' : null" expandableRow>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="two_id" v-model:expanded-row="expandedOne3" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="three_id" v-model:expanded-row="expandedOne3" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="five_id" v-model:expanded-row="expanded3">
            <sm-table-td :expanded="expandedFour3" @expanded="expandedFour3 = true" @collapse="expandedFour3 = false" :aria-controls="expandedFour3 ? 'six_id' : null" expandableRow>Text</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="six_id" v-model:expanded-row="expandedFour3" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td :expanded="expandedTwo3" @expanded="expandedTwo3 = true" @collapse="expandedTwo3 = false; expandedThree3 = false" :aria-controls="expandedTwo3 ? 'four_id' : null" expandableRow>
              <div><sm-icon name="section-rate-plans"/><span style="font-weight: 600; padding-left: 16px">Body/L1-open</span><span style="margin: -12px 0; position: absolute; right: 2px; top: 20px"><sm-button shape="square" type="text" aria-label="Add row"><sm-icon name="controls-add"/></sm-button></span></div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="four_id" v-model:expanded-row="expandedTwo3">
            <sm-table-td :expanded="expandedThree3" @expanded="expandedThree3 = true" @collapse="expandedThree3 = false" :aria-controls="expandedThree3 ? 'seven_id' : null" expandableRow>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="seven_id" v-model:expanded-row="expandedThree3" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">X-Large</span>
      <sm-table :fixed-header-left="true" min-width="1558px" size="x-large">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th width="368px"> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Name </sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td :expanded="expanded4" @expanded="expanded4 = true" @collapse="expanded4 = false; expandedOne4 = false" :aria-controls="expanded4 ? 'one_id five_id' : null" expandableRow>
              <div><sm-icon name="section-rate-plans"/><span style="font-weight: 600; padding-left: 16px">Body/L1-open</span><span style="margin: -12px 0; position: absolute; right: 2px; top: 24px"><sm-button shape="square" type="text" aria-label="Add row"><sm-icon name="controls-add"/></sm-button></span></div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="one_id" v-model:expanded-row="expanded4">
            <sm-table-td :expanded="expandedOne4" @expanded="expandedOne4 = true" @collapse="expandedOne4 = false" :aria-controls="expandedOne4 ? 'two_id three_id' : null" expandableRow>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="two_id" v-model:expanded-row="expandedOne4" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="three_id" v-model:expanded-row="expandedOne4" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="five_id" v-model:expanded-row="expanded4">
            <sm-table-td :expanded="expandedFour4" @expanded="expandedFour4 = true" @collapse="expandedFour4 = false" :aria-controls="expandedFour4 ? 'six_id' : null" expandableRow>Text</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="six_id" v-model:expanded-row="expandedFour4" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td :expanded="expandedTwo4" @expanded="expandedTwo4 = true" @collapse="expandedTwo4 = false; expandedThree4 = false" :aria-controls="expandedTwo4 ? 'four_id' : null" expandableRow>
              <div><sm-icon name="section-rate-plans"/><span style="font-weight: 600; padding-left: 16px">Body/L1-open</span><span style="margin: -12px 0; position: absolute; right: 2px; top: 24px"><sm-button shape="square" type="text" aria-label="Add row"><sm-icon name="controls-add"/></sm-button></span></div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="four_id" v-model:expanded-row="expandedTwo4">
            <sm-table-td :expanded="expandedThree4" @expanded="expandedThree4 = true" @collapse="expandedThree4 = false" :aria-controls="expandedThree4 ? 'seven_id' : null" expandableRow>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="seven_id" v-model:expanded-row="expandedThree4" :highlight="true">
            <sm-table-td :borderLeft="true">
              <div><span style="padding-left: 30px">Body/L1-open</span></div>
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>
    </div>
  `,
})

ExpandableRowLevel2.storyName = 'Expandable Row: level 2'

ExpandableRowLevel2.parameters = {
  docs: {
    description: {
      story: 'The <code>aria-controls</code> props is a \'relationship attribute\' which denotes which elements in a page an interactive element or set of elements has control over. <br/> It\'s commonly used to describe a relationship between a button and the expandable region revealed by that button. <br/> An <code>aria-controls</code> attributes use the <code>id</code> of expandable component to relate each other. <br/>For example, <code>sm-table-td</code> component <code>aria-controls</code> props to control <code>sm-table-tr</code> component region by <code>id</code> props. <br/><br/> Use <code>expandable-row</code> props to display expandable row to <code>sm-table-td</code> component. <br/><br/> Use <code>aria-controls</code> and <code>expanded</code> props to <code>sm-table-td</code> component to expanded (or collapsed). <br/><code>sm-table-td</code> component emits <code>expanded</code> and <code>collapse</code> events to notify expandable components <code>sm-table-tr</code> on state change. <br/><br/>Use <code>sm-table-tr</code> component as an expandable component. <br/><br/>Use <code>sm-table-tr</code> component <code>id</code> props to match with <code>sm-table-td</code> component props <code>aria-controls</code> and <code>expanded-row</code> props to sync expanded (or collapsed) state with <code>sm-table-td</code> component <code>expanded</code> props. <br/><br/>Note: Use same pattern of <code>aria-controls</code> and <code>id</code> attributes for the nested elements. <br/>Use <code>min-width</code> to set the minimum width of a table element. It limits the width property to be not smaller than the value specified in min-width.',
    },
  },
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/Au1waCRAR4SpFvIgEMASgf/sui-documentation?node-id=19%3A343042&t=FGmzw9zDCzDJPXEp-0',
  },
}

export const Disabled = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  template: `
    <div>
      <sm-table :fixed-header="true" min-width="1558px">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td disabled>Melbourne</sm-table-td>
            <sm-table-td disabled>VIC</sm-table-td>
            <sm-table-td disabled>3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td disabled>Brisbane</sm-table-td>
            <sm-table-td disabled>QLD</sm-table-td>
            <sm-table-td disabled>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td disabled noPadding>
              <sm-input placeholder="Your full name..." errorDisabled labelHidden label="City" name="city" />
            </sm-table-td>
            <sm-table-td disabled></sm-table-td>
            <sm-table-td disabled></sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>
    </div>
  `,
})

Disabled.parameters = {
  docs: {
    description: {
      story: 'Use <code>disabled</code> props <code>sm-table-td</code> component to disabled the interaction with cell items.',
    },
  },
}

export const MultipleStickyHeaders = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  template: `
    <div>
      <sm-table :fixed-header="true" min-width="1558px">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td >Melbourne</sm-table-td>
            <sm-table-td >VIC</sm-table-td>
            <sm-table-td >3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td >Brisbane</sm-table-td>
            <sm-table-td >QLD</sm-table-td>
            <sm-table-td >4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>text</sm-table-td>
            <sm-table-td></sm-table-td>
            <sm-table-td></sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-th colspan="5">Mike one</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td >Melbourne</sm-table-td>
            <sm-table-td >VIC</sm-table-td>
            <sm-table-td >3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td >Brisbane</sm-table-td>
            <sm-table-td >QLD</sm-table-td>
            <sm-table-td >4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>text</sm-table-td>
            <sm-table-td></sm-table-td>
            <sm-table-td></sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-th>Mike two</sm-table-th>
            <sm-table-th>June 21 2020</sm-table-th>
            <sm-table-th>Brisbane</sm-table-th>
            <sm-table-th>QLD</sm-table-th>
            <sm-table-th>4000</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td >Melbourne</sm-table-td>
            <sm-table-td >VIC</sm-table-td>
            <sm-table-td >3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td >Brisbane</sm-table-td>
            <sm-table-td >QLD</sm-table-td>
            <sm-table-td >4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>text</sm-table-td>
            <sm-table-td></sm-table-td>
            <sm-table-td></sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td >Melbourne</sm-table-td>
            <sm-table-td >VIC</sm-table-td>
            <sm-table-td >3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td >Brisbane</sm-table-td>
            <sm-table-td >QLD</sm-table-td>
            <sm-table-td >4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>text</sm-table-td>
            <sm-table-td></sm-table-td>
            <sm-table-td></sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-th>Mike three</sm-table-th>
            <sm-table-th>June 21 2020</sm-table-th>
            <sm-table-th>Brisbane</sm-table-th>
            <sm-table-th>QLD</sm-table-th>
            <sm-table-th>4000</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td >Melbourne</sm-table-td>
            <sm-table-td >VIC</sm-table-td>
            <sm-table-td >3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td >Brisbane</sm-table-td>
            <sm-table-td >QLD</sm-table-td>
            <sm-table-td >4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>text</sm-table-td>
            <sm-table-td></sm-table-td>
            <sm-table-td></sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td >Melbourne</sm-table-td>
            <sm-table-td >VIC</sm-table-td>
            <sm-table-td >3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td >Brisbane</sm-table-td>
            <sm-table-td >QLD</sm-table-td>
            <sm-table-td >4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>text</sm-table-td>
            <sm-table-td></sm-table-td>
            <sm-table-td></sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td >Melbourne</sm-table-td>
            <sm-table-td >VIC</sm-table-td>
            <sm-table-td >3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td >Brisbane</sm-table-td>
            <sm-table-td >QLD</sm-table-td>
            <sm-table-td >4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>text</sm-table-td>
            <sm-table-td></sm-table-td>
            <sm-table-td></sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td >Melbourne</sm-table-td>
            <sm-table-td >VIC</sm-table-td>
            <sm-table-td >3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td >Brisbane</sm-table-td>
            <sm-table-td >QLD</sm-table-td>
            <sm-table-td >4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>text</sm-table-td>
            <sm-table-td></sm-table-td>
            <sm-table-td></sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td >Melbourne</sm-table-td>
            <sm-table-td >VIC</sm-table-td>
            <sm-table-td >3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td >Brisbane</sm-table-td>
            <sm-table-td >QLD</sm-table-td>
            <sm-table-td >4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>text</sm-table-td>
            <sm-table-td></sm-table-td>
            <sm-table-td></sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>
    </div>
  `,
})

MultipleStickyHeaders.storyName = 'Multiple sticky headers'

MultipleStickyHeaders.parameters = {
  docs: {
    description: {
      story: 'Use <code>disabled</code> props <code>sm-table-td</code> component to disabled the interaction with cell items. <br/><br/>Use <code>min-width</code> to set the minimum width of a table element. It limits the width property to be not smaller than the value specified in min-width.',
    },
  },
}

export const VisibleScrollbarFixedHeight = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
    SmVerticalNav,
    SmVerticalNavItem,
    SmDropdown,
  },
  template: `
    <div>
      <!--
        Please note that <code>::-webkit-scrollbar</code> may not be supported in Firefox.
        In Firefox there will be no visible scrollbar until we start scrolling.

        Add following CSS inside the wrapper, element to display scrollbar visible

        <code>
          ::-webkit-scrollbar {
            -webkit-appearance: none;
            width: 0.7em;
            height: 0.7em;
          }

          ::-webkit-scrollbar-thumb {
            pointer-events: auto;
            z-index: 2;
            background: #828ea3;
            border-radius: 8px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #717171;
          }

          ::-webkit-scrollbar-track {
            border-radius: 8px;
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          }
        </code>
      -->
      <sm-table :fixed-header="true" :fixed-header-left="true" visibleScrollbar min-width="1558px" tabindex="0">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th width="300px"> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>
    </div>
  `,
})

VisibleScrollbarFixedHeight.storyName = 'Visible scrollbar - fixed height'

VisibleScrollbarFixedHeight.parameters = {
  docs: {
    description: {
      story: 'Use <code>visibleScrollbar</code> props to set the scrollbar visible at all times. <br/> To make sure the scrollbar is always visible at the bottom of the page by setting the <code>height</code> of the container. <br/><br/>Use <code>contentClass</code> props to override style of table wrapper element.',
    },
  },
}

export const TableGradient = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  template: `
    <div style="position: relative; width: 100%;">
      <sm-table :showGradient="true" min-width="1558px" tabindex="0">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>
    </div>
  `,
})

TableGradient.parameters = {
  docs: {
    description: {
      story: 'Use <code>min-width</code> to set the minimum width of a table element. It limits the width property to be not smaller than the value specified in min-width.',
    },
  },
}

export const SamplePopoverAndDropdown = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
    SmDropdown,
    SmPopover,
  },
  setup: () => {
    const open = ref(false)
    const activeRow = ref()

    return { activeRow, open }
  },
  template: `
  <div>
    <sm-table min-width="1558px" :fixed-header="true" :fixed-header-left="true" visibleScrollbarX :contentClass="open ? 'addClass' : 'removeClass'" tabindex="0">
      <sm-table-thead>
        <sm-table-tr>
          <sm-table-th width="min(300px, 50vw)"> Name </sm-table-th>
          <sm-table-th> Date</sm-table-th>
          <sm-table-th> City</sm-table-th>
          <sm-table-th> State</sm-table-th>
          <sm-table-th> Zip code</sm-table-th>
          <sm-table-th> Header</sm-table-th>
          <sm-table-th> Header</sm-table-th>
          <sm-table-th> Header</sm-table-th>
        </sm-table-tr>
      </sm-table-thead>
      <sm-table-tbody>
        <sm-table-tr v-for="row in 15" :key="row">
          <sm-table-td content-class="relative" :show-on-top-index="row === activeRow ? 2 : null">
            <sm-popover placement="bottom" position="absolute" @open="activeRow = row">
              <template #default>Popover {{ row }}</template>
              <template #content>
                <p>Item</p>
                <sm-dropdown type="primary" label="Dropdown" placement="right-start" :fallbackPlacements="false">
                  <sm-vertical-nav style="max-height: 75vh; overflow-y: auto">
                    <sm-vertical-nav-item v-for="count in 5" :key="count" :label="'Link' + count" to="/setup/details" />
                  </sm-vertical-nav>
                </sm-dropdown>
              </template>
            </sm-popover>
          </sm-table-td>
          <sm-table-td>Jan 21 2020</sm-table-td>
          <sm-table-td>Sydney</sm-table-td>
          <sm-table-td>NSW</sm-table-td>
          <sm-table-td>2000</sm-table-td>
          <sm-table-td>2000</sm-table-td>
          <sm-table-td>3000</sm-table-td>
          <sm-table-td>4000</sm-table-td>
        </sm-table-tr>
      </sm-table-tbody>
    </sm-table>
  </div>
  `,
})

SamplePopoverAndDropdown.storyName = 'Sample: Popover and Dropdown'

SamplePopoverAndDropdown.parameters = {
  docs: {
    description: {
      story: 'The <code>sm-table</code> component exposes a <code>getTableContainerRef()</code> method to get ref of table container. You can access them by assigning a <code>ref</code>. <br/><br/> Use <code>contentClass</code> props to override styles of popper if required.',
    },
  },
}

export const SampleDropdown = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
    SmVerticalNav,
    SmVerticalNavItem,
    SmDropdown,
  },
  template: `
    <div>
      <sm-table :fixed-header="true" :fixed-header-left="true" min-width="1558px">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th width="300px"> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
            <sm-table-th> Header</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td :show-on-top-index="5">
              <sm-dropdown type="primary" label="Dropdown" placement="bottom" :fallbackPlacements="false">
                <sm-vertical-nav>
                  <sm-vertical-nav-item label="General" to="/setup/general" />
                  <sm-vertical-nav-item label="Details" to="/setup/details" />
                </sm-vertical-nav>
              </sm-dropdown>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td :show-on-top-index="4">
              <sm-dropdown type="primary" label="Dropdown" placement="bottom">
                <sm-vertical-nav>
                  <sm-vertical-nav-item label="General" to="/setup/general" />
                  <sm-vertical-nav-item label="Details" to="/setup/details" />
                </sm-vertical-nav>
              </sm-dropdown>
            </sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td :show-on-top-index="3">
              <sm-dropdown type="primary" label="Dropdown" placement="bottom" :fallbackPlacements="false">
                <sm-vertical-nav>
                  <sm-vertical-nav-item label="General" to="/setup/general" />
                  <sm-vertical-nav-item label="Details" to="/setup/details" />
                </sm-vertical-nav>
              </sm-dropdown>
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td :show-on-top-index="2">
              <sm-dropdown type="primary" label="Dropdown" placement="bottom" :fallbackPlacements="false">
                <sm-vertical-nav>
                  <sm-vertical-nav-item label="General" to="/setup/general" />
                  <sm-vertical-nav-item label="Details" to="/setup/details" />
                </sm-vertical-nav>
              </sm-dropdown>
            </sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Jack</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td :show-on-top-index="1">
              <sm-dropdown type="primary" label="Dropdown" placement="bottom" :fallbackPlacements="false">
                <sm-vertical-nav>
                  <sm-vertical-nav-item label="General" to="/setup/general" />
                  <sm-vertical-nav-item label="Details" to="/setup/details" />
                  <sm-vertical-nav-item label="General" to="/setup/general" />
                  <sm-vertical-nav-item label="Details" to="/setup/details" />
                  <sm-vertical-nav-item label="General" to="/setup/general" />
                  <sm-vertical-nav-item label="Details" to="/setup/details" />
                  <sm-vertical-nav-item label="General" to="/setup/general" />
                  <sm-vertical-nav-item label="Details" to="/setup/details" />
                  <sm-vertical-nav-item label="General" to="/setup/general" />
                  <sm-vertical-nav-item label="Details" to="/setup/details" />
                </sm-vertical-nav>
              </sm-dropdown>
            </sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>2000</sm-table-td>
            <sm-table-td>3000</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>
    </div>
  `,
})

SampleDropdown.storyName = 'Sample: Dropdown'

SampleDropdown.parameters = {
  docs: {
    description: {
      story: 'Use <code>show-on-top-index</code> props <code>sm-table-td</code> component to consider the tree order to stacked the z-index elements. <br/><br/>For example, sticky columns with a dropdown opening at the bottom should have <code>show-on-top-index</code> props values in descending order and sticky columns with a dropdown opening on top should have <code>show-on-top-index</code> prop in ascending order. <br/><br/>This creates a stacking context to adjust the z-index of the position: absolute elements inside the table column. <br/><br/>Please note: The sticky header does not go well with position absolute elements so it is recommended to use a dropdown/popover opening at the bottom with a sticky header',
    },
  },
}

export const Editable = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  setup: () => {
    const tableViewModel = ref([
      {
        name: 'Nick',
        city: 'Sydney',
        state: 'NSW',
        zipCode: 2000,
      },
      {
        name: 'Andy',
        city: 'Melbourne',
        state: 'VIC',
        zipCode: 3000,
      },
      {
        name: 'Mike',
        city: 'Brisbane',
        state: 'QLD',
        zipCode: 4000,
      },
      {
        name: 'Jack',
        city: 'Sydney',
        state: 'NSW',
        zipCode: 2000,
      },
      {
        name: 'Rahul',
        city: 'Melbourne',
        state: 'VIC',
        zipCode: 3000,
      },
    ])
    const tableViewModel1 = ref([
      {
        name: 'Nick',
        city: 'Sydney',
        state: 'NSW',
        zipCode: 2000,
      },
      {
        name: 'Andy',
        city: 'Melbourne',
        state: 'VIC',
        zipCode: 3000,
      },
      {
        name: 'Mike',
        city: 'Brisbane',
        state: 'QLD',
        zipCode: 4000,
      },
      {
        name: 'Jack',
        city: 'Sydney',
        state: 'NSW',
        zipCode: 2000,
      },
      {
        name: 'Rahul',
        city: 'Melbourne',
        state: 'VIC',
        zipCode: 3000,
      },
    ])
    const tableViewModel2 = ref([
      {
        name: 'Nick',
        city: 'Sydney',
        state: 'NSW',
        zipCode: 2000,
      },
      {
        name: 'Andy',
        city: 'Melbourne',
        state: 'VIC',
        zipCode: 3000,
      },
      {
        name: 'Mike',
        city: 'Brisbane',
        state: 'QLD',
        zipCode: 4000,
      },
      {
        name: 'Jack',
        city: 'Sydney',
        state: 'NSW',
        zipCode: 2000,
      },
      {
        name: 'Rahul',
        city: 'Melbourne',
        state: 'VIC',
        zipCode: 3000,
      },
    ])
    const tableViewModel3 = ref([
      {
        name: 'Nick',
        city: 'Sydney',
        state: 'NSW',
        zipCode: 2000,
      },
      {
        name: 'Andy',
        city: 'Melbourne',
        state: 'VIC',
        zipCode: 3000,
      },
      {
        name: 'Mike',
        city: 'Brisbane',
        state: 'QLD',
        zipCode: 4000,
      },
      {
        name: 'Jack',
        city: 'Sydney',
        state: 'NSW',
        zipCode: 2000,
      },
      {
        name: 'Rahul',
        city: 'Melbourne',
        state: 'VIC',
        zipCode: 3000,
      },
    ])
    const tableViewModel4 = ref([
      {
        name: 'Nick',
        city: 'Sydney',
        state: 'NSW',
        zipCode: 2000,
      },
      {
        name: 'Andy',
        city: 'Melbourne',
        state: 'VIC',
        zipCode: 3000,
      },
      {
        name: 'Mike',
        city: 'Brisbane',
        state: 'QLD',
        zipCode: 4000,
      },
      {
        name: 'Jack',
        city: 'Sydney',
        state: 'NSW',
        zipCode: 2000,
      },
      {
        name: 'Rahul',
        city: 'Melbourne',
        state: 'VIC',
        zipCode: 3000,
      },
    ])

    return {
      tableViewModel,
      tableViewModel1,
      tableViewModel2,
      tableViewModel3,
      tableViewModel4,
    }
  },
  template: `
    <div>
      <span class="sui-storybook-header">X-small</span>
      <sm-table size="x-small">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th>Name</sm-table-th>
            <sm-table-th>City</sm-table-th>
            <sm-table-th>State</sm-table-th>
            <sm-table-th>Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr v-for="(row, i) in tableViewModel" :key="i">
            <sm-table-td no-padding>
              <sm-input
                v-model="row.name"
                editable-cell
                error-disabled
                label-hidden
                :name="'name-1-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' name'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td no-padding>
              <sm-input
                v-model="row.city"
                editable-cell
                error-disabled
                label-hidden
                :name="'city-1-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' city'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td no-padding>
              <sm-input
                v-model="row.state"
                editable-cell
                error-disabled
                label-hidden
                :name="'state-1-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' state'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td disabled no-padding>
              <sm-input
                v-model.number="row.zipCode"
                editable-cell
                error-disabled
                label-hidden
                :name="'zipCode-1-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' zip code'"
              ></sm-input>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">Small</span>
      <sm-table size="small">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th>Name</sm-table-th>
            <sm-table-th>City</sm-table-th>
            <sm-table-th>State</sm-table-th>
            <sm-table-th>Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr v-for="(row, i) in tableViewModel1" :key="i">
            <sm-table-td no-padding>
              <sm-input
                v-model="row.name"
                editable-cell
                error-disabled
                label-hidden
                :name="'name-2-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' name'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td no-padding>
              <sm-input
                v-model="row.city"
                editable-cell
                error-disabled
                label-hidden
                :name="'city-2-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' city'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td no-padding>
              <sm-input
                v-model="row.state"
                editable-cell
                error-disabled
                label-hidden
                :name="'state-2-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' state'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td disabled no-padding>
              <sm-input
                v-model.number="row.zipCode"
                editable-cell
                error-disabled
                label-hidden
                :name="'zipCode-2-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' zip code'"
              ></sm-input>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">Medium (Standard)</span>
      <sm-table>
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th>Name</sm-table-th>
            <sm-table-th>City</sm-table-th>
            <sm-table-th>State</sm-table-th>
            <sm-table-th>Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr v-for="(row, i) in tableViewModel2" :key="i">
            <sm-table-td no-padding>
              <sm-input
                v-model="row.name"
                editable-cell
                error-disabled
                label-hidden
                :name="'name-3-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' name'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td no-padding>
              <sm-input
                v-model="row.city"
                editable-cell
                error-disabled
                label-hidden
                :name="'city-3-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' city'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td no-padding>
              <sm-input
                v-model="row.state"
                editable-cell
                error-disabled
                label-hidden
                :name="'state-3-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' state'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td disabled no-padding>
              <sm-input
                v-model.number="row.zipCode"
                editable-cell
                error-disabled
                label-hidden
                :name="'zipCode-3-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' zip code'"
              ></sm-input>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">Large</span>
      <sm-table size="large">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th>Name</sm-table-th>
            <sm-table-th>City</sm-table-th>
            <sm-table-th>State</sm-table-th>
            <sm-table-th>Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr v-for="(row, i) in tableViewModel3" :key="i">
            <sm-table-td no-padding>
              <sm-input
                v-model="row.name"
                editable-cell
                error-disabled
                label-hidden
                :name="'name-4-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' name'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td no-padding>
              <sm-input
                v-model="row.city"
                editable-cell
                error-disabled
                label-hidden
                :name="'city-4-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' city'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td no-padding>
              <sm-input
                v-model="row.state"
                editable-cell
                error-disabled
                label-hidden
                :name="'state-4-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' state'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td disabled no-padding>
              <sm-input
                v-model.number="row.zipCode"
                editable-cell
                error-disabled
                label-hidden
                :name="'zipCode-4-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' zip code'"
              ></sm-input>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">X-Large</span>
      <sm-table size="x-large">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th>Name</sm-table-th>
            <sm-table-th>City</sm-table-th>
            <sm-table-th>State</sm-table-th>
            <sm-table-th>Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr v-for="(row, i) in tableViewModel4" :key="i">
            <sm-table-td no-padding>
              <sm-input
                v-model="row.name"
                editable-cell
                error-disabled
                label-hidden
                :name="'name-5-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' name'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td no-padding>
              <sm-input
                v-model="row.city"
                editable-cell
                error-disabled
                label-hidden
                :name="'city-5-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' city'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td no-padding>
              <sm-input
                v-model="row.state"
                editable-cell
                error-disabled
                label-hidden
                :name="'state-5-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' state'"
              ></sm-input>
            </sm-table-td>
            <sm-table-td disabled no-padding>
              <sm-input
                v-model.number="row.zipCode"
                editable-cell
                error-disabled
                label-hidden
                :name="'zipCode-5-' + (i + 1)"
                :label="'Row ' + (i + 1) + ' zip code'"
              ></sm-input>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>
    </div>
  `,
})

Editable.parameters = {
  docs: {
    description: {
      story: '<code>sm-input</code> can be used inside the table cell to present editable data. The style can be achieved by using a combination of props on the table and input components. See example below.',
    },
  },
}

export const EditableTextarea = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  setup: () => {
    const tableViewModel = ref([
      {
        default: 'Single line',
        input: null,
      },
      {
        default: `Multi-line: Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Vestibulum sed dui ut augue laoreet imperdiet.
          Praesent blandit nec urna ac fringilla.`,
        input: null,
      },
      {
        default: `Multi-line: Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Vestibulum sed dui ut augue laoreet imperdiet.
          Praesent blandit nec urna ac fringilla. Aliquam luctus nibh tempus
          nibh pulvinar consequat. Praesent velit enim, pretium in ultricies
          id, maximus vel mauris. Curabitur fringilla ullamcorper pulvinar.
          Praesent id velit augue. Maecenas bibendum ex at nisl commodo
          aliquam. Vestibulum ut ultricies eros. Mauris porttitor neque quis mi
          pretium, ac congue ante porttitor. Quisque eros sapien, dictum nec
          euismod finibus, molestie ac orci.`,
        input: null,
      },
    ])

    return {
      tableViewModel,
    }
  },
  template: `
    <div>
      <div v-for="(size, index) in ['x-small', 'small', 'medium', 'large', 'x-large']">
        <template v-if="index > 0"><br/><br/></template>
        <span class="sui-storybook-header" style="text-transform: capitalize;">
          {{ size }}
          <span v-if="size === 'medium'">(Standard)</span>
        </span>
        <sm-table root-class="h-full" :size="size">
          <sm-table-thead>
            <sm-table-tr>
              <sm-table-th>Default</sm-table-th>
              <sm-table-th>Input</sm-table-th>
              <sm-table-th>Disabled</sm-table-th>
            </sm-table-tr>
          </sm-table-thead>
          <sm-table-tbody>
            <sm-table-tr v-for="(row, i) in tableViewModel" :key="i">
              <sm-table-td>
                {{ row.default }}
              </sm-table-td>
              <sm-table-td no-padding root-class="h-full" content-class="h-full">
                <sm-input
                  v-model="row.input"
                  editable-cell
                  error-disabled
                  label-hidden
                  type="textarea"
                  resize="none"
                  rows="1"
                  placeholder="Enter text here..."
                  :name="'cell-1-' + index + '-' + (i + 1)"
                  :label="'Row ' + (i + 1) + ' input'"
                ></sm-input>
              </sm-table-td>
              <sm-table-td disabled no-padding root-class="h-full" content-class="h-full">
                <sm-input
                  v-model="row.input"
                  editable-cell
                  error-disabled
                  label-hidden
                  type="textarea"
                  resize="none"
                  rows="1"
                  placeholder="Enter text here..."
                  :name="'cell-2-' + index + '-' + (i + 1)"
                  :label="'Row ' + (i + 1) + ' input'"
                ></sm-input>
              </sm-table-td>
            </sm-table-tr>
          </sm-table-tbody>
        </sm-table>
      </div>
    </div>
  `,
})

EditableTextarea.storyName = 'Editable: textarea'

EditableTextarea.parameters = {
  docs: {
    description: {
      story: '<code>sm-input</code> as textarea can be used inside the table cell to present editable data. The style can be achieved by using a combination of props on the table and input components. See example below.',
    },
  },
}

export const EditableValidation = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
    SmTooltip,
  },
  setup: () => {
    const tableViewModel = ref([
      {
        name: 'Nick',
        city: 'Sydney',
        state: 'NSW',
        zipCode: 2000,
      },
      {
        name: 'Andy',
        city: 'Melbourne',
        state: 'VIC',
        zipCode: 3000,
      },
      {
        name: 'Mike',
        city: 'Brisbane',
        state: null,
        zipCode: 4000,
      },
      {
        name: 'Jack',
        city: 'Sydney',
        state: null,
        zipCode: 2000,
      },
      {
        name: 'Rahul',
        city: 'Melbourne',
        state: 'VIC',
        zipCode: 3000,
      },
    ])

    onMounted(() => {
      // When sm-form has been refactored to useForm, we can grab the validate
      // function from the form context instead and execute it on mount
      document.getElementById('validate-button')?.click()
    })

    return {
      tableViewModel,
    }
  },
  template: `
    <!--
      Please note that the Vue3 sm-form has breaking changes around the API
      (please see the changelog). That said, the sample implementation here to
      grab the errors and put them into the tooltip is different from the Vue2
      version. We are now grabbing the errors from the scoped slot rather than
      accessing the form context directly.
    -->
    <sm-form>
      <template #default="{ errors, validate }">
        <sm-table>
          <sm-table-thead>
            <sm-table-tr>
              <sm-table-th>Name</sm-table-th>
              <sm-table-th>City</sm-table-th>
              <sm-table-th>State</sm-table-th>
              <sm-table-th>Zip code</sm-table-th>
            </sm-table-tr>
          </sm-table-thead>
          <sm-table-tbody>
            <sm-table-tr v-for="(row, i) in tableViewModel" :key="i">
              <sm-table-td no-padding>
                <sm-tooltip
                  placement="bottom"
                  position="fixed"
                  trigger="hover"
                  type="warning"
                  :block-element="true"
                  :disabled="!errors['name-' + (i + 1)]"
                  :id="'name-' + (i + 1)"
                  :title="errors['name-' + (i + 1)]"
                >
                  <sm-input
                    rules="required"
                    v-model="row.name"
                    editable-cell
                    error-disabled
                    label-hidden
                    :label="'Row ' + (i + 1) + ' name'"
                    :suffix-icon="errors['name-' + (i + 1)] ? 'utility-warning' : null"
                    :name="'name-' + (i + 1)"
                  ></sm-input>
                </sm-tooltip>
              </sm-table-td>
              <sm-table-td no-padding>
                <sm-tooltip
                  placement="bottom"
                  position="fixed"
                  trigger="hover"
                  type="warning"
                  :block-element="true"
                  :disabled="!errors['city-' + (i + 1)]"
                  :id="'city-' + (i + 1)"
                  :title="errors['city-' + (i + 1)]"
                >
                  <sm-input
                    rules="required"
                    v-model="row.city"
                    editable-cell
                    error-disabled
                    label-hidden
                    :label="'Row ' + (i + 1) + ' city'"
                    :suffix-icon="errors['city-' + (i + 1)] ? 'utility-warning' : null"
                    :name="'city-' + (i + 1)"
                  ></sm-input>
                </sm-tooltip>
              </sm-table-td>
              <sm-table-td no-padding>
                <sm-tooltip
                  placement="bottom"
                  position="fixed"
                  trigger="hover"
                  type="warning"
                  :block-element="true"
                  :disabled="!errors['state-' + (i + 1)]"
                  :id="'state-' + (i + 1)"
                  :title="errors['state-' + (i + 1)]"
                >
                  <sm-input
                    rules="required|max:5"
                    v-model="row.state"
                    editable-cell
                    error-disabled
                    label-hidden
                    :label="'Row ' + (i + 1) + ' state'"
                    :suffix-icon="errors['state-' + (i + 1)] ? 'utility-warning' : null"
                    :name="'state-' + (i + 1)"
                  ></sm-input>
                </sm-tooltip>
              </sm-table-td>
              <sm-table-td no-padding>
                <sm-tooltip
                  placement="bottom"
                  position="fixed"
                  trigger="hover"
                  type="warning"
                  :block-element="true"
                  :disabled="!errors['zip-code-' + (i + 1)]"
                  :id="'zip-code-' + (i + 1)"
                  :title="errors['zip-code-' + (i + 1)]"
                >
                  <sm-input
                    rules="required|numeric"
                    v-model.number="row.zipCode"
                    editable-cell
                    error-disabled
                    label-hidden
                    :label="'Row ' + (i + 1) + ' zip code'"
                    :suffix-icon="errors['zip-code-' + (i + 1)] ? 'utility-warning' : null"
                    :name="'zip-code-' + (i + 1)"
                  ></sm-input>
                </sm-tooltip>
              </sm-table-td>
            </sm-table-tr>
          </sm-table-tbody>
        </sm-table>

        <!--
          When sm-form has been refactored to useForm, we can grab the
          validate function from the form context and we can remove this extra button
          to setup the demo to validate on load (done to make Percy coverage easier)
          Also, this button is visibly hidden to keep the stories consistent
        -->
        <sm-button
          class="sr-only"
          id="validate-button"
          type="primary"
          @click="validate"
        >
          Validate
        </sm-button>
      </template>
    </sm-form>
  `,
})

EditableValidation.storyName = 'Editable: validation'

const editableValidationDescription = `
  <code>sm-input</code> can be used inside the table cell to present editable data

  The style can be achieved by using a combination of props:

  - Set <code>noPadding</code> prop to true on <code>sm-table-td</code>
  - Enable the following config in <code>sm-input</code>
    - <code>editableCell</code> to make input styles compatible with table cell
    - <code>labelHidden</code> and provide <code>label</code> to remove visible label while still keeping it accessible
    - <code>errorDisabled</code> to remove inline validation below the input field
    - Optionally add <code>suffixIcon</code> to reinforce validation state
      - The icon and the logic will be handled by the developers
  - <code>sm-tooltip</code> can be used to display validation error if needed
      - The error message and tooltip config will be handled by the developers
`
EditableValidation.parameters = {
  docs: {
    description: {
      story: editableValidationDescription,
    },
  },
  percy: {
    // Needed for the Percy setup steps in onMounted hook to run
    // Take note of the defaults when upgrading Storybook or Percy in the future
    // https://docs.percy.io/docs/storybook#unexpected-diffs
    enableJavascript: true,
  },
}

export const UtilityStates = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  setup: () => {
    const expandableRows = ref([
      { expanded: false, children: 'one_id' },
      { expanded: false, children: 'three_id four_id' },
      { expanded: false, children: 'five_id' },
      { expanded: false, children: 'six_id' },
      { expanded: false, children: 'seven_id' },
      { expanded: false, children: 'two_id' },
    ])

    return {
      expandableRows,
    }
  },
  template: `
    <div>
      <sm-table :fixed-header-left="true" min-width="1558px">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th width="368px"> Name </sm-table-th>
            <sm-table-th> Date </sm-table-th>
            <sm-table-th> Conv </sm-table-th>
            <sm-table-th> Conv rate </sm-table-th>
            <sm-table-th> GMV code</sm-table-th>
            <sm-table-th> ROAS </sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td
              expandableRow
              :aria-controls="expandableRows[0].children"
              :expanded="expandableRows[0].expanded"
              @expanded="expandableRows[0].expanded = true"
              @collapse="expandableRows[0].expanded = false"
            >
              <div class="flex justify-between">
                Stay Margaret River
                <sm-tag size="medium">CPA</sm-tag>
              </div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td style="background-color: #fceeee; position: relative">
              290
              <sm-icon
                class="text-app-warning"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-back"
              ></sm-icon>
            </sm-table-td>
            <sm-table-td style="background-color: #e2f4eb; position: relative">
              6%
              <sm-icon
                class="text-app-success"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-forward"
              ></sm-icon>
            </sm-table-td>
            <sm-table-td style="background-color: #fceeee; position: relative">
              $0
              <sm-icon
                class="text-app-warning"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-back"
              ></sm-icon>
            </sm-table-td>
            <sm-table-td style="background-color: #fceeee; position: relative">
              $0
              <sm-icon
                class="text-app-warning"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-back"
              ></sm-icon>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="one_id" v-model:expanded-row="expandableRows[0].expanded">
            <sm-table-td
              expandableRow
              :aria-controls="expandableRows[5].children"
              :expanded="expandableRows[5].expanded"
              @expanded="expandableRows[5].expanded = true"
              @collapse="expandableRows[5].expanded = false"
            >
              King Deluxe
            </sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>145</sm-table-td>
            <sm-table-td>3%</sm-table-td>
            <sm-table-td>$0</sm-table-td>
            <sm-table-td>$0</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="two_id" v-model:expanded-row="expandableRows[5].expanded" :highlight="true">
            <sm-table-td><span style="padding-left: 34px">King</span></sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>145</sm-table-td>
            <sm-table-td>3%</sm-table-td>
            <sm-table-td>$0</sm-table-td>
            <sm-table-td>$0</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td
              expandableRow
              :aria-controls="expandableRows[1].children"
              :expanded="expandableRows[1].expanded"
              @expanded="expandableRows[1].expanded = true"
              @collapse="expandableRows[1].expanded = false"
            >
              <div class="flex justify-between">
                Alex Perry Hotel & Apartments
                <sm-tag size="medium">CPC</sm-tag>
              </div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td style="background-color: #fceeee; position: relative">
              240
              <sm-icon
                class="text-app-warning"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-back"
              ></sm-icon>
            </sm-table-td>
            <sm-table-td style="background-color: #e2f4eb; position: relative">
              6%
              <sm-icon
                class="text-app-success"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-forward"
              ></sm-icon>
            </sm-table-td>
            <sm-table-td style="background-color: #fceeee; position: relative">
              $0
              <sm-icon
                class="text-app-warning"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-back"
              ></sm-icon>
            </sm-table-td>
            <sm-table-td style="background-color: #fceeee; position: relative">
              $0
              <sm-icon
                class="text-app-warning"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-back"
              ></sm-icon>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="three_id" v-model:expanded-row="expandableRows[1].expanded" :highlight="true">
            <sm-table-td>King Deluxe</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>192</sm-table-td>
            <sm-table-td>3%</sm-table-td>
            <sm-table-td>$0</sm-table-td>
            <sm-table-td>$0</sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="four_id" v-model:expanded-row="expandableRows[1].expanded" :highlight="true">
            <sm-table-td>Standard</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>48</sm-table-td>
            <sm-table-td>3%</sm-table-td>
            <sm-table-td>$0</sm-table-td>
            <sm-table-td>$0</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td
              expandableRow
              :aria-controls="expandableRows[2].children"
              :expanded="expandableRows[2].expanded"
              @expanded="expandableRows[2].expanded = true"
              @collapse="expandableRows[2].expanded = false"
            >
              <div class="flex justify-between">
                Hobart City Apartments
                <sm-tag size="medium">CPA</sm-tag>
              </div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td style="background-color: #fceeee; position: relative">
              283
              <sm-icon
                class="text-app-warning"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-back"
              ></sm-icon>
            </sm-table-td>
            <sm-table-td style="background-color: #e2f4eb; position: relative">
              5%
              <sm-icon
                class="text-app-success"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-forward"
              ></sm-icon>
            </sm-table-td>
            <sm-table-td style="background-color: #fceeee; position: relative">
              $0
              <sm-icon
                class="text-app-warning"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-back"
              ></sm-icon>
            </sm-table-td>
            <sm-table-td style="background-color: #e2f4eb; position: relative">
              $0
              <sm-icon
                class="text-app-success"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-forward"
              ></sm-icon>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="five_id" v-model:expanded-row="expandableRows[2].expanded" :highlight="true">
            <sm-table-td>King Deluxe</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>192</sm-table-td>
            <sm-table-td>3%</sm-table-td>
            <sm-table-td>$0</sm-table-td>
            <sm-table-td>$0</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td
              expandableRow
              :aria-controls="expandableRows[3].children"
              :expanded="expandableRows[3].expanded"
              @expanded="expandableRows[3].expanded = true"
              @collapse="expandableRows[3].expanded = false"
            >
              <div class="flex justify-between">
                Vue Apartments Geelong
                <sm-tag size="medium">CPA</sm-tag>
              </div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td style="background-color: #fceeee; position: relative">
              337
              <sm-icon
                class="text-app-warning"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-back"
              ></sm-icon>
            </sm-table-td>
            <sm-table-td style="background-color: #fff9d6; position: relative">
              2%
              <sm-icon
                class="text-app-alert"
                style="font-size: 10px; position: absolute; right: 6px; top: 6px"
                name="arrow-go-forward"
              ></sm-icon>
            </sm-table-td>
            <sm-table-td style="background-color: #fceeee; position: relative">
              $0
              <sm-icon
                class="text-app-warning"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-back"
              ></sm-icon>
            </sm-table-td>
            <sm-table-td style="background-color: #e2f4eb; position: relative">
              $0
              <sm-icon
                class="text-app-success"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-forward"
              ></sm-icon>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="six_id" v-model:expanded-row="expandableRows[3].expanded" :highlight="true">
            <sm-table-td>King Deluxe</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>192</sm-table-td>
            <sm-table-td>3%</sm-table-td>
            <sm-table-td>$0</sm-table-td>
            <sm-table-td>$0</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td
              expandableRow
              :aria-controls="expandableRows[4].children"
              :expanded="expandableRows[4].expanded"
              @expanded="expandableRows[4].expanded = true"
              @collapse="expandableRows[4].expanded = false"
            >
              <div class="flex justify-between">
                Macedon Ranges Hotel & Spa
                <sm-tag size="medium">CPA</sm-tag>
              </div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td style="background-color: #fceeee; position: relative">
              162
              <sm-icon
                class="text-app-warning"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-back"
              ></sm-icon>
            </sm-table-td>
            <sm-table-td style="background-color: #fceeee; position: relative">
              0%
              <sm-icon
                class="text-app-warning"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-forward"
              ></sm-icon>
            </sm-table-td>
            <sm-table-td style="background-color: #fceeee; position: relative">
              $0
              <sm-icon
                class="text-app-warning"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-back"
              ></sm-icon>
            </sm-table-td>
            <sm-table-td style="background-color: #e2f4eb; position: relative">
              $0
              <sm-icon
                class="text-app-success"
                style="font-size: 10px; transform: rotate(-90deg); position: absolute; right: 6px; top: 6px"
                name="arrow-go-forward"
              ></sm-icon>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr id="seven_id" v-model:expanded-row="expandableRows[4].expanded" :highlight="true">
            <sm-table-td>King Deluxe</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>192</sm-table-td>
            <sm-table-td>3%</sm-table-td>
            <sm-table-td>$0</sm-table-td>
            <sm-table-td>$0</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>
    </div>
  `,
})

UtilityStates.storyName = 'Utility states'

UtilityStates.parameters = {
  docs: {
    description: {
      story: 'This is not part of the SUI components, we include this here for documentation & guide purposes. <br/>It will be up to the product engineers to deliver if something like this is required. <br/> Please include icons when a utility state is required to display/reinforce the data presented. This is because background colours by themselves are not accessible for colour blind users. <br/>Placement and positioning of the icons are up to designer\'s discretion. <br/>Background colour = Utility light colours (Warning light, Alert light). <br/>Icon colour = Utility colour (Warning, Alert, etc)',
    },
  },
}

export const Size = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  setup: () => {
    const selected1 = ref(false)
    const selected2 = ref(false)
    const selected3 = ref(false)
    const selected4 = ref(false)
    const selected5 = ref(false)

    const isSelected = (a: any) => {
      console.info('isSelected', a)
    }
    const change = (is: boolean) => {
      if (is) {
        selected1.value = true
        selected2.value = true
        selected3.value = true
        selected4.value = true
        selected5.value = true
      } else {
        selected1.value = false
        selected2.value = false
        selected3.value = false
        selected4.value = false
        selected5.value = false
      }
    }

    return {
      selected1,
      selected2,
      selected3,
      selected4,
      selected5,
      isSelected,
      change,
    }
  },
  template: `
    <div>
      <span class="sui-storybook-header">X-Small</span>
      <sm-table min-width="1558px" size="x-small">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Name</sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">Checkbox</span>
      <sm-table min-width="1558px" size="x-small">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th>
              <div style="display:flex">
                <sm-checkbox :error-disabled="true" :selected-value="selected1" v-model="selected1" name="selected1"></sm-checkbox>
                <span style="margin-left: -2px;">Name</span>
              </div>
            </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr :selected="selected2">
            <sm-table-td class="border-none">
              <div style="display:flex">
                <sm-checkbox :error-disabled="true" :selected-value="selected2" v-model="selected2" name="selected2"></sm-checkbox>
                <span style="margin-left: -2px;">Nick</span>
              </div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr :selected="selected3">
            <sm-table-td>
              <div style="display:flex">
                <sm-checkbox :error-disabled="true" :selected-value="selected3" v-model="selected3" name="selected3"></sm-checkbox>
                <span style="margin-left: -2px;">Andy</span>
              </div>
            </sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr :selected="selected4">
            <sm-table-td>
              <div style="display:flex">
                <sm-checkbox :error-disabled="true" :selected-value="selected4" v-model="selected4" name="selected4"></sm-checkbox>
                <span style="margin-left: -2px;">Mike</span>
              </div>
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr :selected="selected5">
            <sm-table-td>
                <div style="display:flex">
                <sm-checkbox :error-disabled="true" :selected-value="selected5" v-model="selected5" name="selected5"></sm-checkbox>
                <span style="margin-left: -2px;">Rahul</span>
              </div>
            </sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">Small</span>
      <sm-table min-width="1558px" size="small">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">Medium (Standard)</span>
      <sm-table min-width="1558px">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">Large</span>
      <sm-table min-width="1558px" size="large">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>

      <br/><br/>

      <span class="sui-storybook-header">X-Large</span>
      <sm-table min-width="1558px" size="x-large">
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>Nick</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Sydney</sm-table-td>
            <sm-table-td>NSW</sm-table-td>
            <sm-table-td>2000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Andy</sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
            <sm-table-td>3000</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Mike</sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>Rahul</sm-table-td>
            <sm-table-td>Apr 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
            <sm-table-td>4000</sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>
    </div>
  `,
})

export const TableSelected = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
    SmSelect,
  },
  setup: () => {
    const selection = ref(null)
    const selection1 = ref(null)
    const selection2 = ref(null)
    const selection3 = ref(null)
    const selection4 = ref(null)
    const selection5 = ref(null)
    const selection6 = ref(null)

    const isActive = ref(false)
    const isActive1 = ref(false)
    const isActive2 = ref(false)
    const isActive3 = ref(false)
    const isActive4 = ref(false)
    const isActive5 = ref(false)
    const isActive6 = ref(false)

    const options = ref([
      { label: 'Strawberry Strawberry Strawberry Strawberry', code: 'strawberry' },
      { label: 'Grapes', code: 'grapes' },
      { label: 'Watermelon', code: 'watermelon' },
      { label: 'Apple', code: 'apple' },
      { label: 'Kiwi', code: 'kiwi' },
      { label: 'Blueberry', code: 'blueberry' },
      { label: 'Lemon', code: 'lemon' },
      { label: 'Tomato', code: 'tomato' },
    ])

    return {
      selection,
      options,
      isActive,
      isActive1,
      isActive2,
      isActive3,
      isActive4,
      isActive5,
      isActive6,
      selection1,
      selection2,
      selection3,
      selection4,
      selection5,
      selection6,
    }
  },
  template: `
    <div>
      <sm-table>
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td no-padding selected-cell :activeCell="isActive">
              <sm-select
              v-model="selection"
              :options="options"
              placeholder="Search keywords..."
              labelHidden
              errorDisabled
              name="selection"
              @open="isActive = true"
              @close="isActive = false"
              />
            </sm-table-td>
            <sm-table-td no-padding selected-cell :activeCell="isActive1">
              <sm-select
              v-model="selection1"
              :options="options"
              placeholder="Search keywords..."
              labelHidden
              errorDisabled
              name="selection1"
              @open="isActive1 = true"
              @close="isActive1 = false"
              />
            </sm-table-td>
            <sm-table-td no-padding selected-cell :activeCell="isActive2">
              <sm-select
              v-model="selection2"
              :options="options"
              placeholder="Search keywords..."
              labelHidden
              errorDisabled
              name="selection2"
              @open="isActive2 = true"
              @close="isActive2 = false"
              />
            </sm-table-td>
            <sm-table-td no-padding selected-cell :activeCell="isActive3">
              <sm-select
              v-model="selection3"
              :options="options"
              placeholder="Search keywords..."
              labelHidden
              errorDisabled
              name="selection3"
              @open="isActive3 = true"
              @close="isActive3 = false"
              />
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td no-padding selected-cell :activeCell="isActive4">
              <sm-select
              v-model="selection4"
              :options="options"
              placeholder="Search keywords..."
              labelHidden
              errorDisabled
              name="selection4"
              @open="isActive4 = true"
              @close="isActive4 = false"
              />
            </sm-table-td>
            <sm-table-td>Jan 21 2020</sm-table-td>
            <sm-table-td>Melbourne</sm-table-td>
            <sm-table-td>VIC</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td no-padding selected-cell :activeCell="isActive5">
              <sm-select
              v-model="selection5"
              :options="options"
              placeholder="Search keywords..."
              labelHidden
              errorDisabled
              name="selection5"
              @open="isActive5 = true"
              @close="isActive5 = false"
              />
            </sm-table-td>
            <sm-table-td>June 21 2020</sm-table-td>
            <sm-table-td>Brisbane</sm-table-td>
            <sm-table-td>QLD</sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td no-padding selected-cell :activeCell="isActive6" style="background-color: #f6dafe;">
              <sm-select
              v-model="selection6"
              :options="options"
              placeholder="Search keywords..."
              labelHidden
              errorDisabled
              name="selection6"
              @open="isActive6 = true"
              @close="isActive6 = false"
              />
            </sm-table-td>
            <sm-table-td style="background-color: #f6dafe;">Jan 21 2020</sm-table-td>
            <sm-table-td style="background-color: #f6dafe;">Sydney</sm-table-td>
            <sm-table-td style="background-color: #f6dafe;">NSW</sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>
    </div>
  `,
})

TableSelected.storyName = 'Table: Selected'

const tableSelectedDescription = `
  Use <code>selected-cell</code> props to the <code>sm-table-td</code> component to provide seamless styles across the table cells that contain <code>sm-select</code> component.

  Use <code>activeCell</code> props to change the cell border color on selection.

  Use <code>sm-select</code> component <code>open</code> and <code>close</code> events to toggle the <code>sm-table-td</code> component props <code>activeCell</code> value dynamically.
`
TableSelected.parameters = {
  docs: {
    description: {
      story: tableSelectedDescription,
    },
  },
}

export const Responsive = () => ({
  components: {
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmTableTfoot,
  },
  template: `
    <div>
      <sm-table isResponsive>
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Name </sm-table-th>
            <sm-table-th> Date</sm-table-th>
            <sm-table-th> City</sm-table-th>
            <sm-table-th> State</sm-table-th>
            <sm-table-th> Zip code</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-td>
              <template v-slot:data-header>
                Name
              </template>
              Nick
            </sm-table-td>
            <sm-table-td>
              <template v-slot:data-header>
                Date
              </template>
              Apr 21 2020
            </sm-table-td>
            <sm-table-td>
              <template v-slot:data-header>
                City
              </template>
              Sydney
            </sm-table-td>
            <sm-table-td>NSW
              <template v-slot:data-header>
                State
              </template>
            </sm-table-td>
            <sm-table-td>
              2000
              <template v-slot:data-header>
                Zip code
              </template>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>
              <template v-slot:data-header>
                Name
              </template>
              Andy
            </sm-table-td>
            <sm-table-td>
              <template v-slot:data-header>
                Date
              </template>
              June 21 2022
            </sm-table-td>
            <sm-table-td>
              <template v-slot:data-header>
                City
              </template>
              Brisbane
            </sm-table-td>
            <sm-table-td>
              <template v-slot:data-header>
                State
              </template>
              QLD
            </sm-table-td>
            <sm-table-td>
              <template v-slot:data-header>
                Zip code
              </template>
              4000
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>
              <template v-slot:data-header>
                Name
              </template>
              Mike
            </sm-table-td>
            <sm-table-td>
              <template v-slot:data-header>
                Date
              </template>
              Jan 22 2022
            </sm-table-td>
            <sm-table-td>
              <template v-slot:data-header>
                City
              </template>
              Melbourne
            </sm-table-td>
            <sm-table-td>
              <template v-slot:data-header>
                State
              </template>
              VIC
            </sm-table-td>
            <sm-table-td>
              <template v-slot:data-header>
                Zip code
              </template>
              3000
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>
              <template v-slot:data-header>
                Name
              </template>
              Nick
            </sm-table-td>
            <sm-table-td>
              <template v-slot:data-header>
                Date
              </template>
              Apr 21 2020
            </sm-table-td>
            <sm-table-td>
              <template v-slot:data-header>
                City
              </template>
              Sydney
            </sm-table-td>
            <sm-table-td>NSW
              <template v-slot:data-header>
                State
              </template>
            </sm-table-td>
            <sm-table-td>2000
              <template v-slot:data-header>
                Zip code
              </template>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td>
              <template v-slot:data-header>
                Name
              </template>
              Mike
            </sm-table-td>
            <sm-table-td>
              <template v-slot:data-header>
                Date
              </template>
              Jan 22 2022
            </sm-table-td>
            <sm-table-td>
              <template v-slot:data-header>
                City
              </template>
              Melbourne
            </sm-table-td>
            <sm-table-td>
              <template v-slot:data-header>
                State
              </template>
              VIC
            </sm-table-td>
            <sm-table-td>
              <template v-slot:data-header>
                Zip code
              </template>
              3000
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>
    </div>
  `,
})

Responsive.parameters = {
  docs: {
    description: {
      story: 'Use <code>isResponsive</code> props to make the standard table responsive along with the <code>data-header</code> slots to give header titles for the smaller screen table cells. <br/>To make the table full responsive do not add min-width to the <code>sm-table</code> component (<= 640px). <br/>Please note: The responsive table does not include expandable row tables, multiple headers, fixed headers, rows, and columns to avoid complexity of the current table structure at the moment.',
    },
  },
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/Au1waCRAR4SpFvIgEMASgf/sui-documentation?node-id=19%3A343699&t=hCpfPUmCPPZSF5zx-0',
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
      <p>Below is an example of the SUI table and the brand table using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 504px; height: auto; min-width: 0"
          alt="Table default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 504px; height: auto; min-width: 0"
          alt="Table themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the table customization variables, followed by <a href="/?path=/docs/guides-theming--styling-hooks#theme-categories">theme categories</a> and <a href="/?path=/docs/guides-theming--styling-hooks#naming-conventions">naming convention</a></p>
      <sm-table>
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Element </sm-table-th>
            <sm-table-th> Category + Property </sm-table-th>
            <sm-table-th class="w-1/2 small-desktop:w-3/5"> Styling Hooks</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-th colspan="3">Container</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              border
              <br/>
              border-radius
              <br/>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-table-border<br/>
                --sm-c-table-border-radius<br/>
                --sm-c-table-color-background
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td rowspan="2">Size</sm-table-td>
            <sm-table-td>xsmall</sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-table-font-size-xsmall<br/>
                --sm-c-table-line-height-xsmall<br/>
                --sm-c-table-letter-spacing-xsmall
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
          <sm-table-td>small</sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-table-font-size-small<br/>
                --sm-c-table-line-height-small<br/>
                --sm-c-table-letter-spacing-small
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Gradient</sm-table-td>
            <sm-table-td>
              gradient-left
              <br/>
              gradient-right
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-table-gradient-left<br/>
                --sm-c-table-gradient-right
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>
              Scrollbar
            </sm-table-td>
            <sm-table-td>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-table-scrollbar-thumb-color-background
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-th colspan="3">Header (th)</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-table-th-color-background<br/>
                --sm-c-table-th-padding<br/><br/>

                --sm-c-table-th-color-background-static<br/>
                --sm-c-table-th-padding-static<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Sort icon</sm-table-td>
            <sm-table-td>
              color-icon
              <br/>
              font-size
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-table-th-sort-color-icon<br/>
                --sm-c-table-th-sort-font-size
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Fixed header left/right</sm-table-td>
            <sm-table-td>
              shadow
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-table-th-fixed-header-shadow
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-th colspan="3">Row (tr)</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>
              Common
            </sm-table-td>
            <sm-table-td>
              color-background <span class="block text-grey-neu-dark text-section-header">(on hover)</span>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-table-tr-color-background-hover
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Alternating rows</sm-table-td>
            <sm-table-td>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-table-tr-color-background-alternate
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Selected</sm-table-td>
            <sm-table-td>
              outline
              <br/>
              outline-offset
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-table-tr-outline-selected<br/>
                --sm-c-table-tr-outline-offset-selected<br/>
                --sm-c-table-tr-color-background-selected
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>
              Expandable rows
            </sm-table-td>
            <sm-table-td>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-table-tr-color-background-expanded-level-one<br/>
                --sm-c-table-tr-color-background-expanded-level-two
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-th colspan="3">Data (td)</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              border-left
              <br/>
              color-icon
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-table-td-border-left<br/>
                --sm-c-table-td-arrow-color-icon
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Disabled</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              opacity
              <br/>
              content-opacity
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-table-td-color-background-disabled<br/>
                --sm-c-table-td-opacity-disabled<br/>
                --sm-c-table-td-content-opacity-disabled
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Active</sm-table-td>
            <sm-table-td>
              border
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-table-td-border-active
              </code>
            </sm-table-td>
          </sm-table-tr>
        <sm-table-tr>
          <sm-table-th colspan="3">Footer (tfoot)</sm-table-th>
        </sm-table-tr>
        <sm-table-tr>
          <sm-table-td>Common</sm-table-td>
          <sm-table-td>
            color-background
            <br/>
            shadow
          </sm-table-td>
          <sm-table-td>
            <code
              class="sui-storybook-code sui-storybook-code--block"
            >--sm-c-table-tfoot-color-background<br/>
              --sm-c-table-tfoot-shadow
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
  design: null,
}
