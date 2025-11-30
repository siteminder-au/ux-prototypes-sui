import { ref } from 'vue'
import SmList from '../sm-list.vue'
import SmListItem from '../sm-list-item.vue'
import defaultExample from './images/list-default.png'
import themedExample from './images/list-themed.png'

export default {
  title: 'Components/List',
  component: SmList,
  subcomponents: {
    'sm-list-item': SmListItem,
  },
  parameters: {
    docs: {
      description: {
        // Uses `component` here since it's the primary story
        component: 'The sm-list and sm-list-item components provide a simple interface for listing data.',
      },
    },
  },
}

export const Standard = () => ({
  components: { SmList, SmListItem },
  template: `
    <sm-list>
      <sm-list-item label="Meat balls" />
      <sm-list-item label="Pasta" />
      <sm-list-item label="Noodles" />
      <sm-list-item label="Pizza" />
    </sm-list>
  `,
})

export const CustomContent = () => ({
  components: { SmList, SmListItem },
  setup: () => {

    const colours = ref([
      { label: 'Red', id: 1 },
      { label: 'Green', id: 2 },
      { label: 'Blue', id: 3 },
    ])
    return {
      colours,
    }
  },
  template: `
    <sm-list draggable :list="colours">
      <template #list="{item}">
        <sm-list-item :key="item.id" root-class="sm-overflow-visible">
          <div class="flex flex-grow justify-between">
            <span>{{ item.label }}</span>
            <div>
              <a class="mr-8" href="#" target='_blank'>Learn more</a>
              <sm-tooltip placement="bottom" trigger="hover">
                <sm-icon class="text-primary-blue" name="utility-information-alt" />
                <template v-slot:content>
                  Overflowing content inside <span style="font-weight: 600;">{{ item.label }}</span>
                  list item
                </template>
              </sm-tooltip>
            </div>
          </div>
        </sm-list-item>
      </template>
    <pre>{{list1}}</pre>

    </sm-list>
  `,
})
CustomContent.storyName = 'Custom content'

CustomContent.parameters = {
  docs: {
    description: {
      // Can't use template literals here, because Storybook will convert backticks to code blocks
      story: `
        The sm-list-item components default slot supports any amount of custom content.

        When adding a dropdown, tooltip, popover or color-picker component inside
        <code>sm-list-item</code>, considering adding <code>position="fixed"</code> prop on
        said components if pop outs are getting cutoff.

        Alternatively, add "sm-overflow-visible" class to <code>rootClass</code> prop in
        <code>sm-list-item</code> to set overflow to "visible" if any other child component has
        tendency to overflow.
      `,

    },
  },
}

export const DraggableList = () => ({
  components: { SmList, SmListItem },
  setup: () => {
    const favouriteFoods = ref([
      { id: '1', label: 'Meat balls' },
      { id: '2', label: 'Pasta' },
      { id: '3', label: 'Noodles' },
    ])

    const favouriteRestaurants = ref([
      { id: '1', label: 'Marios' },
      { id: '2', label: 'Luigis' },
      { id: '3', label: 'Frankies' },
    ])

    return {
      favouriteFoods,
      favouriteRestaurants,
    }
  },
  template: `
    <div>

      <span class="sui-storybook-header">Drag by the row</span>
      <sm-list draggable :list="favouriteFoods">
        <template #list="{item}">
          <sm-list-item
            :label="item.label"
            :key="item.id">
          </sm-list-item>
        </template>
      </sm-list>

      <br/>

      <span class="sui-storybook-header">Drag by the icon</span>
      <sm-list draggable handle="icon" :list="favouriteRestaurants">
        <template #list="{item}">
          <sm-list-item
            :label="item.label"
            :key="item.id">
          </sm-list-item>
        </template>
      </sm-list>

    </div>
  `,
})

DraggableList.storyName = 'Draggable list'

DraggableList.parameters = {
  docs: {
    description: {
      // Can't use template literals here, because Storybook will convert backticks to code blocks
      story: `
        Use the <code>draggable</code> and <code>list</code> props to allow the user to sort the list.

        The <code>list</code> prop should contain an array of unique items. For example:
        <pre>
          const favouriteFoods = ref([
            { id: '1', label: 'Meat balls' },
            { id: '2', label: 'Pasta' },
            { id: '3', label: 'Noodles' },
          ])
        </pre>

        It's also essential to use the <code>key</code> prop on each of the <code>sm-list-item</code> components to allow Vue to track changes correctly.

        By default the whole row becomes draggable. Alternatively you can use the <code>handle</code> prop to specify which part of the <code>sm-list-item</code> can be dragged.
        The <code>handle</code> prop accepts both a DOM selector such as <code>.my-handle</code> along with a special value of <code>icon</code> which will make the row's icon element the drag handle.

        Events:
        <pre>
          const start = (event) => {
            Emits event when dragging started
          }

          const end = (event) => {
            Emits event when dragging ended
          }

          const change = (states) => {
            This event emits one argument containing one of the properties:
            - added: contains information of an element added to the array (newIndex, element)
            - removed: contains information of an element removed from to the array (oldIndex, element)
            - moved: contains information of an element moved within the array (newIndex, oldIndex, element)
          }

          const move = (evt) => {
            Emits events when you move an item in the list or between lists
            Returning false will cancel the drag operation.
            - draggedContext: context linked to dragged element
              index: dragged element index
              element: dragged element underlying view model element
              futureIndex: potential index of the dragged element if the drop operation is accepted
            - relatedContext: context linked to current drag operation
              index: target element index
              element: target element view model element
              list: target list
              component: target VueComponent
          }

          const add = (evt) => {
            Emits event when element is dropped into the list from another list
          }

          const remove = (evt) => {
            Emits event when element is removed from the list into another list
          }
        </pre>
      `,

    },
  },
}

export const ConnectedLists = () => ({
  components: { SmList, SmListItem },
  setup: () => {
    const primaryColours = ref([
      { id: '1', label: 'Yellow' },
      { id: '2', label: 'Blue' },
      { id: '3', label: 'Red' },
    ])

    const secondaryColours = ref([
      { id: '4', label: 'Green' },
      { id: '5', label: 'Orange' },
      { id: '6', label: 'Violet' },
    ])

    return {
      primaryColours,
      secondaryColours,
    }
  },
  template: `
    <div>

      <h4>Colours</h4>

      <div class="flex">
        <div class="w-1/2 pr-12">
          <h5>Primary</h5>
          <sm-list draggable :list="primaryColours" group="colours">
            <template #list="{item}">
              <sm-list-item
                :label="item.label"
                :key="item.id">
              </sm-list-item>
            </template>
          </sm-list>
        </div>

        <div class="w-1/2 pl-12">
          <h5>Secondary</h5>
          <sm-list draggable :list="secondaryColours" group="colours">
            <template #list="{item}">
              <sm-list-item
                :label="item.label"
                :key="item.id">
              </sm-list-item>
            </template>
          </sm-list>
        </div>
      </div>

    </div>
  `,
})

ConnectedLists.storyName = 'Connected lists'

ConnectedLists.parameters = {
  docs: {
    description: {
      // Can't use template literals here, because Storybook will convert backticks to code blocks
      story: `
        Use the <code>group</code> prop to integrate multiple draggable lists together.

        Example data:
        <pre>
        const primaryColours = ref([
          { id: '1', label: 'Yellow' },
          { id: '2', label: 'Blue' },
          { id: '3', label: 'Red' },
        ])

        const secondaryColours = ref([
          { id: '4', label: 'Green' },
          { id: '5', label: 'Orange' },
          { id: '6', label: 'Violet' },
        ])
        </pre>
      `,

    },
  },
}

export const NestedLists = () => ({
  components: { SmList, SmListItem },
  setup: () => {
    const colours = ref([
      {
        id: '1',
        label: 'Green',
        children: [
          { id: '4', label: 'Yellow' },
          { id: '5', label: 'Blue' },
        ],
      },
      { id: '2', label: 'Orange', children: [] },
      { id: '3', label: 'Violet', children: [] },
    ])

    return {
      colours,
    }
  },
  template: `
    <div>

      <h4>Colours</h4>

      <sm-list draggable :list="colours" group="colours">
        <template #list="{item}">
          <sm-list-item
            :key="item.id">
            {{ item.label }}

            <sm-list draggable :list="item.children" group="colours">
              <template #list="{item}">
                <sm-list-item
                  :key="item.id">
                  {{ item.label }}
                </sm-list-item>
              </template>
            </sm-list>

          </sm-list-item>
        </template>
      </sm-list>

    </div>
  `,
})

NestedLists.storyName = 'Nested lists'

NestedLists.parameters = {
  docs: {
    description: {
      // Can't use template literals here, because Storybook will convert backticks to code blocks
      story: `
        Use a combination of the <code>group</code> prop and a tree-like data structure to allow draggable lists to nest within eachother.

        Example data:
        <pre>
        const colours = ref([
          {
            id: '1',
            label: 'Green',
            children: [
              { id: '4', label: 'Yellow' },
              { id: '5', label: 'Blue' },
            ],
          },
          { id: '2', label: 'Orange', children: [] },
          { id: '3', label: 'Violet', children: [] },
        ])
        </pre>

        To create a more dynamic tree structure, consider using a [recursive component](https://medium.com/js-dojo/build-a-collapsible-tree-menu-with-vue-js-recursive-components-e598306dc3d1).
      `,

    },
  },
}

export const StaticHeader = () => ({
  components: { SmList, SmListItem },
  template: `
    <sm-list>
      <template v-slot:header>
        <div>Header</div>
      </template>
      <template v-slot:default>
        <sm-list-item label="Meat balls">
          <sm-list>
            <sm-list-item label="Pasta" />
          </sm-list>
        </sm-list-item>
        <sm-list-item label="Noodles" />
        <sm-list-item label="Pizza" />
      </template>
    </sm-list>
  `,
})
StaticHeader.storyName = 'Static Header'

StaticHeader.parameters = {
  docs: {
    description: {
      // Can't use template literals here, because Storybook will convert backticks to code blocks
      story: `
        Use <code>header</code> slot to display static list header on top.

        Note: Use <code>header</code> slot on non-draggable list only

        Best Practices, Whenever there are multiple slots, use the full <code>template</code> based syntax for all slots including <code>default</code>
      `,

    },
  },
}

export const Stacked = () => ({
  components: { SmList, SmListItem },
  template: `
  <div>
    <div>
      <sm-list stacked>
        <template v-slot:header>
        <div><sm-icon name="amenity-bedroom"/><h5 style="padding-left:8px; display:inline">Header</h5></div>
        </template>
        <sm-list-item label="Pasta" />
        <sm-list-item label="Noodles" />
        <sm-list-item label="Pizza" />
      </sm-list>
      <sm-list stacked>
        <template v-slot:header>
          <div><sm-icon name="amenity-bedroom"/><h5 style="padding-left:8px; display:inline">Header</h5></div>
        </template>
        <sm-list-item label="Pasta" />
      </sm-list>
    </div>
    <div style="margin-top:50px">
      <sm-list stacked>
        <template v-slot:header>
        <div><sm-icon name="amenity-bedroom"/><h5 style="padding-left:8px; display:inline">Header</h5></div>
        </template>
        <sm-list-item label="Pasta" />
        <sm-list-item label="Noodles" />
        <sm-list-item label="Pizza" />
      </sm-list>
      <sm-list stacked>
        <template v-slot:header>
          <div><sm-icon name="amenity-bedroom"/><h5 style="padding-left:8px; display:inline">Header</h5></div>
        </template>
        <sm-list-item label="Pasta" />
      </sm-list>
      <sm-list stacked>
        <template v-slot:header>
          <div><sm-icon name="amenity-bedroom"/><h5 style="padding-left:8px; display:inline">Header</h5></div>
        </template>
      </sm-list>
      <sm-list stacked>
        <template v-slot:header>
          <div><sm-icon name="amenity-bedroom"/><h5 style="padding-left:8px; display:inline">Header</h5></div>
        </template>
      </sm-list>
    </div>
  </div>
  `,
})

Stacked.storyName = 'Stacked'

Stacked.parameters = {
  docs: {
    description: {
      // Can't use template literals here, because Storybook will convert backticks to code blocks
      story: `
        Use <code>stacked</code> props to display list stacked on top of each other.
      `,

    },
  },
}

export const NestedDraggableItems = () => ({
  components: { SmList, SmListItem },
  setup: () => {
    const colours = ref([
      {
        id: '2',
        label: 'yellow',
        children: [
          {
            id: '41',
            label: 'Yellow1',
            children: [],
          },
        ],
      },
      {
        id: '1',
        label: 'Orange',
        children: [
          { id: '4', label: 'Orange1', children: [] },
          { id: '12', label: 'Orange2', children: [] },
        ],
      },
      {
        id: '3',
        label: 'green',
        children: [],
      },
    ])

    return {
      colours,
    }
  },
  template: `
    <div>

      <h4>Colours</h4>

      <sm-list draggable :list="colours" group="colours" :itemStacked="false">
        <template #list="{item}">
          <sm-list-item
            :key="item.id">

            {{ item.label }}

            <sm-list draggable :list="item.children" group="colours">
              <template #list="{item}">
                <sm-list-item
                  :key="item.id">
                  {{ item.label }}
                </sm-list-item>
              </template>
            </sm-list>

          </sm-list-item>
        </template>
      </sm-list>

    </div>
  `,
})

NestedDraggableItems.storyName = 'Nested Draggable items'

NestedDraggableItems.parameters = {
  docs: {
    description: {
      // Can't use template literals here, because Storybook will convert backticks to code blocks
      story: `
        Use a combination of the <code>group</code> prop and a tree-like data structure to allow draggable lists to nest within eachother.

        Use <code>children: []</code> to set empty array to provide space for draggable children inside each group.

        Example data:
        <pre>
        const colours = ref([
          {
            id: '1',
            label: 'yellow',
            children: [
              {
                id: '2',
                label: 'Yellow1',
                children: []
              },
            ],
          },
          {
            id: '3',
            label: 'Orange',
            children: [
              {
                id: '4',
                label: 'Orange1',
                children: []
              },
            ],
          },
          {
            id: '5',
            label: 'green',
            children: [],
          },
        ])
        </pre>

        To create a more dynamic tree structure, consider using a [recursive component](https://medium.com/js-dojo/build-a-collapsible-tree-menu-with-vue-js-recursive-components-e598306dc3d1).
      `,

    },
  },
}

export const NestedNonDraggableChildItems = () => ({
  components: { SmList, SmListItem },
  setup: () => {
    const colours = ref([
      {
        id: '2',
        label: 'yellow',
        children: [
          {
            id: '21',
            label: 'Yellow1',
            children: [],
          },
        ],
      },
      {
        id: '1',
        label: 'Orange',
        children: [
          { id: '4', label: 'Orange1', children: [] },
          { id: '42', label: 'Orange2', children: [] },
        ],
      },
      {
        id: '3',
        label: 'green',
        children: [],
      },
    ])

    return {
      colours,
    }
  },
  template: `
    <div>

      <h4>Colours</h4>

      <sm-list draggable :list="colours" group="colours" :itemStacked="false">
        <template #list="{item}">
          <sm-list-item
            :key="item.id" v-if="item.label">

            {{ item.label }}

            <sm-list draggable :list="item.children">
              <template #list="{item}">
                <sm-list-item
                  :key="item.id" v-if="item.label">
                  {{ item.label }}
                </sm-list-item>
              </template>
            </sm-list>

          </sm-list-item>
        </template>
      </sm-list>

    </div>
  `,
})

NestedNonDraggableChildItems.storyName = 'Nested Non-Draggable child items'

NestedNonDraggableChildItems.parameters = {
  docs: {
    description: {
      // Can't use template literals here, because Storybook will convert backticks to code blocks
      story: `
        For non-draggable items outside the list, Avoid using <code>group</code> props inside the list item to not allow integration with other list items.

        Example data:
        <pre>
        const colours = ref([
          {
            id: '2',
            label: 'yellow',
            children: [
              {
                id: '41',
                label: 'Yellow1',
                children: []
              },
            ],
          },
          {
            id: '1',
            label: 'Orange',
            children: [
              { id: '4', label: 'Orange1', children: []},
              { id: '41', label: 'Orange2', children: []},
            ],
          },
          {
            id: '3',
            label: 'green',
            children: [],
          },
        ])
        </pre>

        To create a more dynamic tree structure, consider using a [recursive component](https://medium.com/js-dojo/build-a-collapsible-tree-menu-with-vue-js-recursive-components-e598306dc3d1).
      `,

    },
  },
}

export const SampleConditionalDraggableItem = () => ({
  components: { SmList, SmListItem },
  setup: () => {
    const isMove = ref()

    const colours = ref([
      {
        id: '2',
        label: 'yellow',
        children: [
          {
            id: '41',
            label: 'Yellow1',
            children: [],
          },
        ],
      },
      {
        id: '1',
        label: 'Orange',
        children: [
          { id: '4', label: 'Orange1', children: [] },
          { id: '12', label: 'Orange2', children: [] },
        ],
      },
      {
        id: '3',
        label: 'green',
        children: [],
      },
    ])

    const checkMove = (evt: any) => {
      if (evt.relatedContext.element && evt.relatedContext.element.label === 'Orange2') {
        isMove.value = false
      } else if (evt.relatedContext.list.length === 0) {
        isMove.value = false
      } else {
        isMove.value = true
      }
    }

    return {
      colours,
      checkMove,
      isMove,
    }
  },
  template: `
    <div>

      <h4>Colours</h4>

      <sm-list draggable :list="colours" group="colours" :itemStacked="false" :checkMove.sync="isMove" @move="(evt) =>checkMove(evt)">
        <template #list="{item}">
          <sm-list-item
            :key="item.id"
            :id="item.id">

            {{ item.label }}

            <sm-list draggable :list="item.children" group="colours" :checkMove.sync="isMove" @move="(evt) =>checkMove(evt)">
              <template #list="{item}">
                <sm-list-item
                  :key="item.id"
                  :id="item.id">
                  {{ item.label }}
                </sm-list-item>
              </template>
            </sm-list>

          </sm-list-item>
        </template>
      </sm-list>

    </div>
  `,
})

SampleConditionalDraggableItem.storyName = 'Sample: Conditional Draggable item'

SampleConditionalDraggableItem.parameters = {
  docs: {
    description: {
      // Can't use template literals here, because Storybook will convert backticks to code blocks
      story: `
        Control the dragging of the item using the <code>checkMove</code> prop combined with the <code>.sync</code> modifier on <code>move</code> event.
        In this example, The user will not be able to drag an item inside the standalone group "Orange2".

        <code>
          const checkMove = (evt) => {s

            // Callback function on move event when you move an item in the list or between list
            // Sync checkMove props to true and false on condition, Returning false will cancel the drag operation
            // Example one: Stop dragging the item inside "Orange2" standalone group
              if (evt.relatedContext.element && evt.relatedContext.element.label === "Orange2") {
                return false
              } else if (evt.relatedContext.list.length === 0) {
                return false
              } else {
                // Do stuff
                return true
              }

            // Example two: Stop dragging the item inside the standalone group if the children array does not exist
              if (evt.relatedContext.element && !evt.relatedContext.element.children) {
                // Do stuff
                return false
              } else if (evt.relatedContext.list === undefined || evt.relatedContext.list === null) {
                // Do stuff
                return false
              } else {
                // Do stuff
                return true
              }
          }

        </code>
          Example data:
          <pre>
          const colours = ref([
            {
              id: '1',
              label: 'yellow',
              children: [
                {
                  id: '2',
                  label: 'Yellow1',
                  children: []
                },
              ],
            },
            {
              id: '3',
              label: 'Orange',
              children: [
                {
                  id: '4',
                  label: 'Orange1',
                  children: []
                },
                {
                  id: '32',
                  label: 'Orange2',
                  children: []
                },
              ],
            },
            {
              id: '5',
              label: 'green',
              children: [],
            },
          ])
          </pre>

          To create a more dynamic tree structure, consider using a [recursive component](https://medium.com/js-dojo/build-a-collapsible-tree-menu-with-vue-js-recursive-components-e598306dc3d1).
      `,

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

      <p>Below is an example of the SUI list and the brand list using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 396px; height: auto; min-width: 0"
          alt="List default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 396px; height: auto; min-width: 0"
          alt="List themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the list customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>
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
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              border <br/>
              border-radius
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-list-border
                --sm-c-list-border-radius
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Nested list</sm-table-td>
            <sm-table-td>
              margin-top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-list-margin-top-nested
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Header</sm-table-td>
            <sm-table-td>
              color-background <br/>
              color-text <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-list-header-color-background
                --sm-c-list-header-color-text
                --sm-c-list-header-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>List item</sm-table-td>
            <sm-table-td>
              color-background <br/>
              color-text <br/>
              font-weight <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-list-item-color-background
                --sm-c-list-item-color-text
                --sm-c-list-item-font-weight
                --sm-c-list-item-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>List item draggable (hover)</sm-table-td>
            <sm-table-td>
              color-background <br/>
              color-text <br/>
              outline <br/>
              outline-offset
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-list-item-draggable-color-background-hover
                --sm-c-list-item-draggable-color-text-hover
                --sm-c-list-item-draggable-outline-hover
                --sm-c-list-item-draggable-outline-offset-hover
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>List item draggable (ghost)</sm-table-td>
            <sm-table-td>
              color-background <br/>
              color-border <br/>
              color-text
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-list-item-draggable-color-background-ghost
                --sm-c-list-item-draggable-color-border-ghost
                --sm-c-list-item-draggable-color-text-ghost
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
