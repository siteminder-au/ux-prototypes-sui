import { defineRule } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { isPercyContext } from '../../../../../../test/percy/helpers'
import SmMultiSelect from '../sm-multi-select.vue'
import defaultExample from './images/multi-select-default.png'
import themedExample from './images/multi-select-themed.png'

export default {
  title: 'Components/Form/Multi-select',
  component: SmMultiSelect,
}

interface MultiSelectType { open: () => void, close: () => void }

export const SingleSelect = () => ({
  components: { SmMultiSelect },
  setup: () => {
    const multiselectRef = ref<MultiSelectType>()
    const selection = ref()
    const selection2 = ref('3')
    const selection3 = ref()
    const selection4 = ref('3')

    const options = ref([
      { label: 'Selection 1', code: '1' },
      { label: 'Selection 2', code: '2' },
      { label: 'Selection 3', code: '3' },
      { label: 'Selection 4', code: '4' },
      { label: 'Selection 5', code: '5' },
    ])

    const handleEvent = (e: Event, eventName: string): void => {
      console.info(`${eventName}:`, e)
    }

    onMounted(() => {
      // Open the dropdown when running in Percy
      // This is manually done here because we don't have a prop
      // that we can just set to true to display the hidden content
      if (isPercyContext() && multiselectRef.value) {
        multiselectRef.value.open()
      }
    })

    return { multiselectRef, selection, selection2, selection3, selection4, options, handleEvent }
  },
  template: `
    <div>
      <span class="sui-storybook-header">Standard</span>
      <sm-multi-select
        v-model="selection"
        style="min-width: 288px"
        label="Input label"
        name="multiselect1"
        placeholder="Search keywords..."
        :options="options"
        @change="handleEvent($event, 'change')"
        @update:model-value="handleEvent($event, 'update:model-value')"
      />
      <sm-multi-select
        v-model="selection2"
        style="min-width: 288px"
        label="Input label"
        name="multiselect2"
        placeholder="Search keywords..."
        :options="options"
        @change="handleEvent($event, 'change')"
        @update:model-value="handleEvent($event, 'update:model-value')"
      />

      <br/><br/>

      <span class="sui-storybook-header">Standard without keyword search</span>
      <sm-multi-select
        v-model="selection3"
        style="min-width: 288px"
        label="Input label"
        name="multiselect3"
        placeholder="Select an option"
        :filterable="false"
        :options="options"
        @change="handleEvent($event, 'change')"
        @update:model-value="handleEvent($event, 'update:model-value')"
      />

      <sm-multi-select
        v-model="selection4"
        ref="multiselectRef"
        class="percy-mt-320"
        style="min-width: 288px"
        label="Input label"
        name="multiselect4"
        placeholder="Select an option"
        :filterable="false"
        :options="options"
        @change="handleEvent($event, 'change')"
        @update:model-value="handleEvent($event, 'update:model-value')"
      />
    </div>
  `,
})

SingleSelect.storyName = 'Single select'

SingleSelect.parameters = {
  percy: {
    // Needed for the Percy to capture dropdown content after some action
    // It is unfortunate we have to use the internal implementation of the
    // component but we are limited to CSS class selectors from the Percy API
    waitForSelector: '.sm-multi-select__list',
  },
}

export const SingleSelectOptionGroups = () => ({
  components: { SmMultiSelect },
  setup: () => {
    const multiselectRef = ref<MultiSelectType>()
    const selection = ref()
    const selection2 = ref('11')
    const selection3 = ref()
    const selection4 = ref('4')

    const options = ref([
      {
        title: 'Group 1',
        libs: [
          { label: 'Selection 1', code: '1' },
          { label: 'Selection 2', code: '2' },
          { label: 'Selection 3', code: '3' },
          { label: 'Selection 4', code: '4' },
          { label: 'Selection 5', code: '5' },
        ],
      },
      {
        title: 'Group 2',
        libs: [
          { label: 'Selection 6', code: '6' },
          { label: 'Selection 7', code: '7' },
          { label: 'Selection 8', code: '8' },
        ],
      },
      {
        title: 'Group 3',
        libs: [
          { label: 'Selection 9', code: '9' },
          { label: 'Selection 10', code: '10' },
          { label: 'Selection 11', code: '11' },
          { label: 'Selection 12', code: '12' },
          { label: 'Selection 111', code: '111' },
        ],
      },
    ])

    const handleEvent = (e: Event, eventName: string): void => {
      console.info(`${eventName}:`, e)
    }

    onMounted(() => {
      // Open the dropdown when running in Percy
      // This is manually done here because we don't have a prop
      // that we can just set to true to display the hidden content
      if (isPercyContext() && multiselectRef.value) {
        multiselectRef.value.open()
      }
    })

    return { multiselectRef, selection, selection2, selection3, selection4, options, handleEvent }
  },
  template: `
    <div>
      <span class="sui-storybook-header">Grouped</span>
      <sm-multi-select
        v-model="selection"
        label="Input label"
        name="multiselect1"
        placeholder="Search keywords..."
        :options="options"
        :show-group-select="true"
        @change="handleEvent($event, 'change')"
        @update:model-value="handleEvent($event, 'update:model-value')"
      />

      <sm-multi-select
        v-model="selection2"
        label="Input label"
        name="multiselect2"
        placeholder="Search keywords..."
        :options="options"
        :show-group-select="true"
        @change="handleEvent($event, 'change')"
        @update:model-value="handleEvent($event, 'update:model-value')"
      />

      <br/><br/>

      <span class="sui-storybook-header">Grouped without keyword search</span>
      <sm-multi-select
        v-model="selection3"
        label="Input label"
        name="multiselect3"
        placeholder="Select an option"
        :filterable="false"
        :options="options"
        :show-group-select="true"
        @change="handleEvent($event, 'change')"
        @update:model-value="handleEvent($event, 'update:model-value')"
      />

      <sm-multi-select
        v-model="selection4"
        ref="multiselectRef"
        class="percy-mt-320"
        label="Input label"
        name="multiselect4"
        placeholder="Select an option"
        :filterable="false"
        :options="options"
        :show-group-select="true"
        @change="handleEvent($event, 'change')"
        @update:model-value="handleEvent($event, 'update:model-value')"
      />
    </div>
  `,
})

SingleSelectOptionGroups.storyName = 'Single select: Option groups'

const singleSelectOptionsGroupsDescription = `
  Use <code>show-group-select</code> props to display option groups.

  Use <code>title</code> to define group label/title.

  Use <code>libs</code> to define group values.
`

SingleSelectOptionGroups.parameters = {
  docs: {
    description: {
      story: singleSelectOptionsGroupsDescription,
    },
  },
  percy: {
    // Needed for the Percy to capture dropdown content after some action
    // It is unfortunate we have to use the internal implementation of the
    // component but we are limited to CSS class selectors from the Percy API
    waitForSelector: '.sm-multi-select__list',
  },
}

export const MultiSelect = () => ({
  components: { SmMultiSelect },
  setup: () => {
    const selection = ref()
    const selection2 = ref()
    const tags = ref()
    const tags2 = ref()

    const options = ref([
      { label: 'Selection 1', code: '1' },
      { label: 'Selection 2', code: '2' },
      { label: 'Selection 3', code: '3' },
      { label: 'Selection 4', code: '4' },
      { label: 'Selection 5', code: '5' },
    ])

    // const handleRemove = (option) => {
    //   selection.value = selection.value.filter(item => item !== option.code)
    // }

    // const handleRemove2 = (option) => {
    //   selection2.value = selection2.value.filter(item => item !== option.code)
    // }

    const handleEvent = (e: Event, eventName: string): void => {
      console.info(`${eventName}:`, e)
    }

    return {
      selection,
      selection2,
      options,
      tags,
      tags2,
      // handleRemove,
      // handleRemove2,
      handleEvent,
    }
  },
  template: `
    <div>
      <sm-help-card class="percy-hidden mb-24" type="warning">
        <template #header>
          <code>sm-tag-filters</code>&nbsp; hasn't been migrated yet.
        </template>
      </sm-help-card>

      <span class="sui-storybook-header">Multi-select</span>
      <sm-multi-select
        v-model="selection"
        label="Input label"
        name="multiselect1"
        placeholder="Search keywords..."
        :multiple="true"
        :options="options"
        @change="handleEvent($event, 'change')"
        @update:model-value="handleEvent($event, 'update:model-value')"
      />

      <!--
      <sm-tag-filters
        style="margin-bottom: 8px;"
        label="Input label"
        :tags="tags"
        @remove="handleRemove"
      />
      -->

      <br/><br/>

      <span class="sui-storybook-header">Multi-select without keyword search</span>
      <sm-multi-select
        v-model="selection2"
        label="Input label"
        name="multiselect2"
        placeholder="Select options"
        :filterable="false"
        :multiple="true"
        :options="options"
        @change="handleEvent($event, 'change')"
        @update:model-value="handleEvent($event, 'update:model-value')"
      />

      <!--
      <sm-tag-filters
        style="margin-bottom: 8px;"
        label="Input label"
        :tags="tags2"
        @remove="handleRemove2"
      />
      -->
    </div>
  `,
})

MultiSelect.storyName = 'Multi-select'

// Add back once we have sm-tag-filters support
// const multiSelectDescription = `
//   When using <code>multiple</code> variant of the component, add <code>sm-tag-filters</code> component.

//   This is a separate and presentational component that displays a list of tags that corresponds
//   to the selected options in the multi-select.

//   If the <code>sm-multi-select</code> component appears at the same time as the tag-filters,
//   <code>v-model:tags</code> can be used in the multi-select component to easily hook the updates on the tag-filters.

//   On the other-hand, if the multi-select component can't appear at the same time as the tag-filters,
//   for instance when it is conditionally loaded via popover, the tag-filters' <code>tags</code>
//   prop can be independently computed.

//   In both cases, clicking the close/remove button from the individual tags will emit a
//   <code>remove</code> event on click. Model updates should be handled from the parent component/view:

//   <pre>
//     // Example implementation of @remove="handleRemoveOption" event
//     const handleRemoveOption = (option) => {
//       selection.value = selection.value.filter(item => item !== option.code)
//     }
//   </pre>

//   If there are no selections, the tag-filters will be hidden entirely.
// `

MultiSelect.parameters = {
  docs: {
    description: {
      story: 'Allows multiple selections to be made.<br/> <code>sm-tag-filters</code> hasn\'t been migrated yet.',
    },
  },
}

export const MultiSelectOptionGroups = () => ({
  components: { SmMultiSelect },
  setup: () => {
    const selection = ref()
    const selection2 = ref()
    // const tags = ref()
    // const tags2 = ref()

    const options = ref([
      {
        title: 'Group 1',
        libs: [
          { label: 'Selection 1', code: '1' },
          { label: 'Selection 2', code: '2' },
          { label: 'Selection 3', code: '3' },
          { label: 'Selection 4', code: '4' },
          { label: 'Selection 5', code: '5' },
        ],
      },
      {
        title: 'Group 2',
        libs: [
          { label: 'Selection 6', code: '6' },
          { label: 'Selection 7', code: '7' },
          { label: 'Selection 8', code: '8' },
        ],
      },
      {
        title: 'Group 3',
        libs: [
          { label: 'Selection 9', code: '9' },
          { label: 'Selection 10', code: '10' },
          { label: 'Selection 11', code: '11' },
          { label: 'Selection 12', code: '12' },
          { label: 'Selection 111', code: '111' },
        ],
      },
    ])

    // const handleRemove = (option) => {
    //   selection.value = selection.value.filter(item => item !== option.code)
    // }
    // const handleRemove2 = (option) => {
    //   selection2.value = selection2.value.filter(item => item !== option.code)
    // }

    const handleEvent = (e: Event, eventName: string): void => {
      console.info(`${eventName}:`, e)
    }

    return {
      selection,
      selection2,
      options,
      // tags,
      // tags2,
      // handleRemove,
      // handleRemove2,
      handleEvent,
    }
  },
  template: `
    <div>
      <sm-help-card class="percy-hidden mb-24" type="warning">
        <template #header>
          <code>sm-tag-filters</code>&nbsp; hasn't been migrated yet.
        </template>
      </sm-help-card>

      <span class="sui-storybook-header">Grouped multi-select</span>
      <sm-multi-select
        v-model="selection"
        label="Input label"
        name="multiselect1"
        placeholder="Search keywords..."
        :options="options"
        :show-group-select="true"
        :multiple="true"
        @change="handleEvent($event, 'change')"
        @update:model-value="handleEvent($event, 'update:model-value')"
      />

      <!--
      <sm-tag-filters
        style="margin-bottom: 8px;"
        label="Input label"
        :tags="tags"
        :show-group-label="true"
        @remove="handleRemove"
      />
      -->

      <br/><br/>

      <span class="sui-storybook-header">Grouped multi-select without keyword search</span>
      <sm-multi-select
        v-model="selection2"
        label="Input label"
        name="multiselect2"
        placeholder="Select options"
        :options="options"
        :filterable="false"
        :show-group-select="true"
        :multiple="true"
        @change="handleEvent($event, 'change')"
        @update:model-value="handleEvent($event, 'update:model-value')"
      />

      <!--
      <sm-tag-filters
        style="margin-bottom: 8px;"
        label="Input label"
        :tags="tags2"
        :show-group-label="true"
        @remove="handleRemove2"
      />
      -->
    </div>
  `,
})

MultiSelectOptionGroups.storyName = 'Multi-select: Option groups'

// Add back once we have sm-tag-filters support
// const multiSelectOptionGroupsDescription = `
//   When using <code>multiple</code> and <code>show-group-select</code> variant of the component,
//   use <code>sm-tag-filters</code>.

//   This is a separate and presentational component that displays a list of tags that corresponds
//   to the selected options in the multi-select.

//   The tags can display the group label using <code>show-group-label</code> prop in the tag-filters.

//   If the <code>sm-multi-select</code> component appears at the same time as the tag-filters,
//   <code>v-model:tags</code> can be used in the multi-select component to easily hook the updates on the tag-filters.

//   On the other-hand, if the multi-select component can't appear at the same time as the tag-filters,
//   for instance it is conditionally loaded via popover, the tag-filters' <code>tags</code>
//   prop can be independently computed.

//   In both cases, clicking the close/remove button from the individual tags will emit a
//   <code>remove</code> event on click. Model updates should be handled from the parent component/view:

//   <pre>
//     // Example implementation of @remove="handleRemoveOption" event
//     const handleRemoveOption = (option) => {
//       selection.value = selection.value.filter(item => item !== option.code)
//     }
//   </pre>

//   If there are no selections, the tag-filters will be hidden entirely.

//   Setting <code>filterable</code> prop to <code>false</code> will turn off search feature.
// `

MultiSelectOptionGroups.parameters = {
  docs: {
    description: {
      story: 'Allows multiple selections to be made.<br/> <code>sm-tag-filters</code> hasn\'t been migrated yet.',
    },
  },
}

// Add back once we have sm-tag-filters support
// export const MultiSelectTagsLength = () => ({
//   components: { SmMultiSelect },
//   setup: () => {
//     const selection = ref(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
//     // const tags = ref()

//     const options = ref([
//       { label: 'Selection 1', code: '1' },
//       { label: 'Selection 2', code: '2' },
//       { label: 'Selection 3', code: '3' },
//       { label: 'Selection 4', code: '4' },
//       { label: 'Selection 5', code: '5' },
//       { label: 'Selection 6', code: '6' },
//       { label: 'Selection 7', code: '7' },
//       { label: 'Selection 8', code: '8' },
//       { label: 'Selection 9', code: '9' },
//       { label: 'Selection 10', code: '10' },
//     ])

//     // const handleRemove = (option) => {
//     //   selection.value = selection.value.filter(item => item !== option.code)
//     // }

//     return {
//       selection,
//       options,
//       // tags,
//       // handleRemove,
//     }
//   },
//   template: `
//     <div>
//       <sm-multi-select
//         v-model="selection"
//         label="Max three tags"
//         name="multiselect1"
//         placeholder="Search keywords..."
//         :multiple="true"
//         :options="options"
//       />

//       <!--
//         Spacer to prevent Percy visual diff between Vue2 and Vue3
//         since sm-tag-filters will be migrated later on
//       -->
//       <div style="height: 70.8px;" />
//       <!--
//       <sm-tag-filters
//         class="mb-8"
//         label="Max three tags"
//         :tags="tags"
//         :max-length="3"
//         @remove="handleRemove"
//       />
//       -->

//       <sm-multi-select
//         v-model="selection"
//         label="Responsive tags"
//         name="multiselect2"
//         placeholder="Search keywords..."
//         :multiple="true"
//         :options="options"
//       />

//       <!--
//       <sm-tag-filters
//         class="mb-8"
//         label="Responsive tags"
//         max-length="responsive"
//         :tags="tags"
//         @remove="handleRemove"
//       />
//       -->
//     </div>
//   `,
// })

// MultiSelectTagsLength.storyName = 'Multi-select: Tags length'

// const multiSelectTagsLengthDescription = `
//   By default, the tag filters will limit the displayed items to five (5) and can be updated by
//   providing <code>max-length</code> prop in <code>sm-tag-filters</code>.

//   Truncated items can be toggled by a show more / show less button.

//   Setting the prop to zero (0) will display all items.

//   Alternatively, set the prop to 'responsive' to fit items in a single row and hide overflowing items.

//   Note that the responsive feature may have a performance impact since it continuously watches for
//   change in the container's dimension to recalculate the placement and truncation.
// `

// MultiSelectTagsLength.parameters = {
//   docs: {
//     description: {
//       story: multiSelectTagsLengthDescription,
//     },
//   },
//   percy: {
//     // Load media queries in tag filters
//     enableJavascript: true,
//   },
// }

export const MultiSelectHideSelectAllOrGroup = () => ({
  components: { SmMultiSelect },
  setup: () => {
    const selection1 = ref()
    const selection2 = ref()
    // const tags1 = ref()
    // const tags2 = ref()

    const OPTIONS_LIST = Array.from({ length: 11 }, (_, i) => ({
      code: i + 1,
      label: `Selection ${i + 1}`,
    }))

    const options = ref(OPTIONS_LIST)

    const groupedOptions = ref([
      {
        title: 'Group 1',
        libs: OPTIONS_LIST.slice(0, 5),
      },
      {
        title: 'Group 2',
        libs: OPTIONS_LIST.slice(5, 8),
      },
      {
        title: 'Group 3',
        libs: OPTIONS_LIST.slice(8),
      },
    ])

    // Handle removal from tags
    // const handleRemove = (option) => {
    //   selection1.value = selection1.value.filter(item => item !== option.code)
    // }

    // // Handle removal from tags2
    // const handleRemove2 = (option) => {
    //   selection2.value = selection2.value.filter(item => item !== option.code)
    // }

    return {
      groupedOptions,
      options,
      selection1,
      selection2,
      // tags1,
      // tags2,
      // handleRemove,
      // handleRemove2,
    }
  },
  template: `
    <div>
      <sm-help-card class="percy-hidden mb-24" type="warning">
        <template #header>
          <code>sm-tag-filters</code>&nbsp; hasn't been migrated yet.
        </template>
      </sm-help-card>

      <sm-multi-select
        label="Standard multi-select"
        name="multiselect1"
        placeholder="Please select an option"
        v-model="selection1"
        :multiple="true"
        :options="options"
        :show-select-all-option="false"
      />

      <!--
      <sm-tag-filters
        class="mb-32"
        label="Standard multi-select"
        :show-group-label="true"
        :tags="tags1"
        @remove="handleRemove"
      />
      -->

      <sm-multi-select
        label="Grouped multi-select"
        name="multiselect2"
        placeholder="Please select an option"
        v-model="selection2"
        :multiple="true"
        :options="groupedOptions"
        :show-group-select="true"
        :show-select-group-option="false"
      />

      <!--
      <sm-tag-filters
        label="Grouped multi-select"
        :show-group-label="true"
        :tags="tags2"
        @remove="handleRemove2"
      />
      -->
    </div>
  `,
})

MultiSelectHideSelectAllOrGroup.storyName = 'Multi-select: hide select all or group'

const multiSelectHideSelectAllOrGroupDescription = `
  By default, multi-select has the select all option on the dropdown when <code>multiple</code> option is true.

  Use <code>show-select-all-option</code> for standard multi-select and <code>show-select-group-option</code>
  for the grouped multi-select to remove the 'Select all' / 'Select group' options on the dropdown.
`

MultiSelectHideSelectAllOrGroup.parameters = {
  docs: {
    description: {
      story: multiSelectHideSelectAllOrGroupDescription,
    },
  },
}

export const MixedInputs = () => ({
  components: { SmMultiSelect },
  setup: () => {
    const enabled = ref(false)
    const selection = ref()

    const options = ref([
      { label: 'Selection 1', code: '1' },
      { label: 'Selection 2', code: '2' },
      { label: 'Selection 3', code: '3' },
      { label: 'Selection 4', code: '4' },
      { label: 'Selection 5', code: '5' },
    ])

    return { selection, options, enabled }
  },
  template: `
    <div>
      <sm-multi-select
        v-model="selection"
        label="Input label"
        name="multiselect1"
        placeholder="Search keywords..."
        :options="options"
        rules="required"
      >
        <template #action>
          <sm-tooltip title="Action slot" trigger="hover" placement="right">
            <sm-icon name="utility-information-alt" class="text-grey-neu-dark" />
          </sm-tooltip>
        </template>
        <template #suffix>
          <span class="sm-multi-select-suffix-content">Sqft</span>
        </template>
      </sm-multi-select>

      <sm-multi-select
        label="Input label"
        name="multiselect2"
        v-model="selection"
        :options="options"
        placeholder="Search keywords..."
        rules="required"
      >
        <template #label>
          <span class="sm-text--small">Input label slot</span>
        </template>
        <template #action>
          <sm-tooltip title="Action slot" trigger="hover" placement="right" class="sm-p">
            <sm-icon name="utility-information-alt" class="text-grey-neu-dark" />
          </sm-tooltip>
        </template>
        <template #prefix>
          <span class="sm-multi-select-prefix-content">Sqft</span>
        </template>
      </sm-multi-select>

      <sm-multi-select
        label="Input label"
        name="multiselect3"
        v-model="selection"
        :options="options"
        placeholder="Search keywords..."
      >
        <template #prefix>
          <span class="sm-multi-select-prefix-content">Sqft</span>
        </template>
        <template #suffix>
          <span class="sm-multi-select-suffix-content">Sqft</span>
        </template>
      </sm-multi-select>

      <sm-multi-select
        label="Input label"
        name="multiselect4"
        v-model="selection"
        :options="options"
        placeholder="Search keywords..."
      >
        <template #suffix>
          <sm-button
            @click="enabled = !enabled"
            type="primary"
            :aria-label="enabled ? 'Lock field' : 'Unlock field'"
            :title="enabled ? 'Lock field' : 'Unlock field'"
          >
            <sm-icon :name="enabled ? 'action-lock-open' : 'action-lock'" />
          </sm-button>
        </template>
        <template #prefix>
          <sm-button
            @click="enabled = !enabled"
            type="primary"
            :aria-label="enabled ? 'Lock field' : 'Unlock field'"
            :title="enabled ? 'Lock field' : 'Unlock field'"
          >
            <sm-icon :name="enabled ? 'action-lock-open' : 'action-lock'" />
          </sm-button>
        </template>
      </sm-multi-select>
    </div>
  `,
})

MixedInputs.storyName = 'Mixed inputs'

const mixedInputsDescription = `
  Use <code>prefix</code> and <code>suffix</code> slots to create mixed multi-selects.

  Use <code>label</code> and <code>action</code> slots to customize the multi-select's label.
`

MixedInputs.parameters = {
  docs: {
    description: {
      story: mixedInputsDescription,
    },
  },
}

export const LabelAndDescription = () => ({
  components: { SmMultiSelect },
  setup: () => {
    const selection1 = ref()
    const selection2 = ref(['cold-brew'])
    // const tags = ref([{ label: 'Cold Brew', code: 'cold-brew' }])
    const multiselectRef = ref<MultiSelectType>()

    const options = ref([
      { label: 'Strawberry', code: 'strawberry', description: '$2.99 per scoop' },
      { label: 'Grapes', code: 'grapes', description: '$2.99 per scoop' },
      { label: 'Watermelon', code: 'watermelon', description: '$2.99 per scoop' },
      { label: 'Apple', code: 'apple', description: '$2.99 per scoop' },
      { label: 'Kiwi', code: 'kiwi', description: '$3.50 per scoop' },
      { label: 'Blueberry', code: 'blueberry', description: '$3.50 per scoop' },
      { label: 'Lemon', code: 'lemon', description: '$2.99 per scoop' },
      { label: 'Tomato', code: 'tomato', description: '$2.99 per scoop' },
    ])

    const groupedOptions = ref([
      {
        title: 'New',
        libs: [
          { label: 'Cold Brew', code: 'cold-brew', description: '$2.99 per scoop' },
          { label: 'Salted Caramel', code: 'salted-caramel', description: '$2.99 per scoop' },
          { label: 'Tiramisu', code: 'tiramisu', description: '$3.20 per scoop' },
        ],
      },
      {
        title: 'Classic',
        libs: [
          { label: 'Chocolate Chip', code: 'chocolate-chip', description: '$2.99 per scoop' },
          { label: 'Cherry Garcia', code: 'cherry-garcia', description: '$2.99 per scoop' },
          { label: 'Chunky Monkey', code: 'chunky-monkey', description: '$2.99 per scoop' },
          { label: 'Peanut Butter Cup', code: 'peanut-butter-cup', description: '$3.99 per scoop' },
          {
            label: 'Strawberry Cheesecake',
            code: 'strawberry-cheesecake',
            description: '$3.99 per scoop',
          },
          {
            label: 'Blueberry Cheesecake',
            code: 'blueberry-cheesecake',
            description: '$3.99 per scoop',
            disabled: true,
          },
        ],
      },
      {
        title: 'Frozen Yogurt',
        libs: [
          { label: 'Cherry', code: 'fy-cherry', description: '$3.00 per scoop' },
          { label: 'Half Baked', code: 'fy-half-baked', description: '$3.50 per scoop' },
        ],
      },
    ])

    // const handleRemove = (option) => {
    //   selection2.value = selection2.value.filter(item => item !== option.code)
    // }

    onMounted(() => {
      // Open the dropdown when running in Percy
      // This is manually done here because we don't have a prop
      // that we can just set to true to display the hidden content
      if (isPercyContext() && multiselectRef.value) {
        multiselectRef.value.open()
      }
    })

    return {
      groupedOptions,
      multiselectRef,
      options,
      selection1,
      selection2,
      // tags,
      // handleRemove,
    }
  },
  template: `
    <div>
      <sm-multi-select
        style="max-width: 300px"
        label="Single select"
        name="multiselect1"
        placeholder="Search keywords..."
        v-model="selection1"
        :options="options"
      />

      <sm-multi-select
        style="max-width: 300px"
        label="Multi-select"
        name="multiselect2"
        placeholder="Search keywords..."
        v-model="selection2"
        ref="multiselectRef"
        :options="groupedOptions"
        :show-group-select="true"
        :multiple="true"
      />

      <!--
      <sm-tag-filters
        style="margin-bottom: 8px;"
        label="Multi-select"
        :show-group-label="true"
        :tags="tags"
        @remove="handleRemove"
      />
      -->

    </div>
  `,
})

LabelAndDescription.storyName = 'Label and description'

const labelAndDescriptionDescription = `
  Use <code>description</code> property on the option object to add more details.

  This added text will not appear on the input field once selected, nor be used in the search feature.
`

LabelAndDescription.parameters = {
  docs: {
    description: {
      story: labelAndDescriptionDescription,
    },
  },
  percy: {
    // Needed for the Percy to capture dropdown content after some action
    // It is unfortunate we have to use the internal implementation of the
    // component but we are limited to CSS class selectors from the Percy API
    waitForSelector: '.sm-multi-select__list',
  },
}

export const Truncation = () => ({
  components: { SmMultiSelect },
  setup: () => {
    const selection1 = ref()
    const selection2 = ref(['option-2'])
    const selection3 = ref(['3'])
    // const tags = ref([{ label: 'Long label with truncation will be limited to a single line', code: 'option-2' }])
    // const tags2 = ref([{ label: 'Selection 3 really long option label', code: '3' }])

    const options = ref([
      {
        label: 'Short label',
        code: 'option-1',
        description: 'Short description',
      },
      {
        label: 'Long label with truncation will be limited to a single line',
        code: 'option-2',
        description:
          'Long description with truncation will be limited to a single line. Resize viewport to see it in action.',
      },
      {
        label: 'Long label with truncation will be limited to a single line',
        code: 'option-3',
        description:
          'Long description with truncation will be limited to a single line. Resize viewport to see it in action.',
      },
    ])

    const groupedOptions = ref([
      {
        title: 'Group 1',
        libs: [
          { label: 'Selection 1', code: '1' },
          { label: 'Selection 2 exact', code: '2' },
          { label: 'Selection 3 really long option label', code: '3' },
        ],
      },
      {
        title: 'Really long group label',
        libs: [
          { label: 'Selection 4', code: '4' },
          { label: 'Selection 5', code: '5' },
        ],
      },
    ])

    // // Handle removal from tags
    // const handleRemove = (option) => {
    //   selection2.value = selection2.value.filter(item => item !== option.code)
    // }

    // // Handle removal from tags2
    // const handleRemove2 = (option) => {
    //   selection3.value = selection3.value.filter(item => item !== option.code)
    // }

    return {
      groupedOptions,
      options,
      selection1,
      selection2,
      selection3,
      // tags,
      // tags2,
      // handleRemove,
      // handleRemove2,
    }
  },
  template: `
    <div>
      <sm-multi-select
        label="Single select"
        name="multiselect1"
        placeholder="Please select an option"
        v-model="selection1"
        :options="options"
        :truncate-option-label="true"
        :truncate-option-description="true"
      />

      <sm-multi-select
        label="Multi-select"
        name="multiselect2"
        placeholder="Please select an option"
        v-model="selection2"
        :multiple="true"
        :options="options"
        :truncate-option-label="true"
        :truncate-option-description="true"
      />

      <!--
        Spacer to prevent Percy visual diff between Vue2 and Vue3
        since sm-tag-filters will be migrated later on
      -->
      <div style="height: 94px;" />
      <!--
      <sm-tag-filters
        style="margin-bottom: 32px;"
        label="Multi-select"
        :show-group-label="true"
        :tags="tags"
        @remove="handleRemove"
      />
      -->

      <sm-multi-select
        label="Grouped multi-select"
        name="multiselect3"
        placeholder="Please select an option"
        v-model="selection3"
        :multiple="true"
        :options="groupedOptions"
        :show-group-select="true"
        :truncate-option-label="true"
        :truncate-option-description="true"
      />

      <!--
      <sm-tag-filters
        style="margin-bottom: 8px;"
        label="Grouped multi-select"
        :show-group-label="true"
        :tags="tags2"
        :tag-max-char-length="26"
        @remove="handleRemove2"
      />
      -->
    </div>
  `,
})

// Add back once we have sm-tag-filters support
// For multi-selects, the tags in tag-filters are also truncated to 23 characters by default.
// Use <code>tag-max-char-length</code> prop in <code>sm-tag-filters</code> to override. Set to <code>0</code> if truncation is not required.
// If the tag is truncated, a tooltip will appear on hover to display the full text.
const truncationDescription = `
  Use <code>truncate-option-label</code> and <code>truncate-option-description</code> props in <code>sm-multi-select</code>
  to truncate text in the option listing.

  This will limit the text to a single line.
`

Truncation.parameters = {
  docs: {
    description: {
      story: truncationDescription,
    },
  },
}

export const Disabled = () => ({
  components: { SmMultiSelect },
  setup: () => {
    // Single selects
    const selection1 = ref()
    const selection2 = ref('s1')
    const selection3 = ref('s5')
    const selection4 = ref('4')

    // Multi-selects
    const selection5 = ref([])
    const selection6 = ref(['s1', 's2'])
    const selection7 = ref()
    const selection8 = ref()

    // const tags1 = ref([])
    // const tags2 = ref([])
    // const tags3 = ref([])
    // const tags4 = ref([])

    const options = ref([
      { label: 'Selection 1', code: 's1' },
      { label: 'Selection 2', code: 's2' },
      { label: 'Selection 3', code: 's3', disabled: true },
      { label: 'Selection 4', code: 's4' },
      {
        label: 'Selection 5',
        code: 's5',
        description: 'This is a very long descriptive text for the option',
        disabled: true,
      },
    ])

    const groupedOptions = ref([
      {
        title: 'Group 1',
        libs: [
          { label: 'Selection 1', code: '1' },
          { label: 'Selection 2', code: '2' },
          { label: 'Selection 3', code: '3', disabled: true },
          { label: 'Selection 4', code: '4', disabled: true },
          { label: 'Selection 5', code: '5' },
        ],
      },
      {
        title: 'Group 2',
        libs: [
          { label: 'Selection 6', code: '6' },
          { label: 'Selection 7', code: '7' },
          {
            label: 'Selection 8',
            code: '8',
            description: 'This is a very long descriptive text for the option',
            disabled: true,
          },
        ],
      },
      {
        title: 'Group 3',
        libs: [
          {
            label: 'Selection 9',
            code: '9',
            description: 'This is a very long descriptive text for the option',
          },
          { label: 'Selection 10', code: '10', disabled: true },
        ],
      },
    ])

    // const handleRemove = (option) => {
    //   selection1.value = selection1.value.filter(item => item !== option.code)
    //   selection3.value = selection3.value.filter(item => item !== option.code)
    //   selection5.value = selection5.value.filter(item => item !== option.code)
    //   selection7.value = selection7.value.filter(item => item !== option.code)
    // }

    return {
      groupedOptions,
      options,
      selection1,
      selection2,
      selection3,
      selection4,
      selection5,
      selection6,
      selection7,
      selection8,
      // tags1,
      // tags2,
      // tags3,
      // tags4,
      // handleRemove,
    }
  },
  template: `
    <div>
      <sm-multi-select
        label="Select disabled field"
        name="multiselect1"
        placeholder="Search keywords..."
        v-model="selection1"
        :options="options"
        :disabled="true"
      />

      <sm-multi-select
        label="Select disabled field with value"
        name="multiselect2"
        placeholder="Search keywords..."
        v-model="selection2"
        :options="options"
        :disabled="true"
        :filterable="false"
      />

      <sm-multi-select
        label="Select disabled option"
        name="multiselect3"
        placeholder="Search keywords..."
        v-model="selection3"
        :options="options"
      />

      <sm-multi-select
        label="Select disabled group option"
        name="multiselect4"
        placeholder="Search keywords..."
        v-model="selection4"
        :options="groupedOptions"
        :show-group-select="true"
      />

      <sm-multi-select
        label="Multi-select disabled field"
        name="multiselect5"
        placeholder="Search keywords..."
        v-model="selection5"
        :multiple="true"
        :options="options"
        :disabled="true"
      />

      <sm-multi-select
        label="Multi-select disabled field with value"
        name="multiselect6"
        placeholder="Search keywords..."
        v-model="selection6"
        :multiple="true"
        :options="options"
        :disabled="true"
      />

      <!--
        Spacer to prevent Percy visual diff between Vue2 and Vue3
        since sm-tag-filters will be migrated later on
      -->
      <div style="height: 78px;" />
      <!--
      <sm-tag-filters
        class="col-span-1 small-desktop:col-span-2 mb-8"
        style="margin-bottom: 16px;"
        label="Multi-select disabled field with value"
        :tags="tags2"
        :show-group-label="true"
        :disabled="true"
        @remove="handleRemove"
      />
      -->

      <sm-multi-select
        label="Multi-select disabled option"
        name="multiselect7"
        placeholder="Search keywords..."
        v-model="selection7"
        :options="options"
        :multiple="true"
      />

      <!--
      <sm-tag-filters
        class="col-span-1 small-desktop:col-span-2 mb-8"
        style="margin-bottom: 16px;"
        label="Multi-select disabled option"
        :tags="tags3"
        :show-group-label="true"
        @remove="handleRemove"
      />
      -->

      <sm-multi-select
        label="Multi-select disabled group option"
        name="multiselect8"
        placeholder="Search keywords..."
        v-model="selection7"
        :options="groupedOptions"
        :show-group-select="true"
        :multiple="true"
      />

      <!--
      <sm-tag-filters
        class="col-span-1 small-desktop:col-span-2 mb-8"
        label="Multi-select disabled group option"
        :tags="tags4"
        :show-group-label="true"
        @remove="handleRemove"
      />
      -->
    </div>
  `,
})

// The tag-filters component should also be set to <code>disabled</code>.
const disabledDescription = `
  Use <code>disabled</code> prop to disable the entire multi-select component and
  <code>disabled</code> property for specific option/s.
`

Disabled.parameters = {
  docs: {
    description: {
      story: disabledDescription,
    },
  },
}

export const DisallowEmpty = () => ({
  components: { SmMultiSelect },
  setup: () => {
    const selection1 = ref()
    const selection2 = ref()
    const selection3 = ref()
    // const tags1 = ref()
    // const tags2 = ref()

    const options = ref([
      { label: 'Selection 1', code: 's1' },
      { label: 'Selection 2', code: 's2' },
      { label: 'Selection 3', code: 's3' },
      { label: 'Selection 4', code: 's4' },
      { label: 'Selection 5', code: 's5' },
    ])

    const groupedOptions = ref([
      {
        title: 'Group 1',
        libs: [
          { label: 'Selection 1', code: '1' },
          { label: 'Selection 2', code: '2' },
          { label: 'Selection 3', code: '3' },
        ],
      },
      {
        title: 'Group 2',
        libs: [
          { label: 'Selection 4', code: '4' },
          { label: 'Selection 5', code: '5' },
        ],
      },
      {
        title: 'Group 3',
        libs: [
          { label: 'Selection 6', code: '6' },
          { label: 'Selection 7', code: '7' },
        ],
      },
    ])

    // const handleRemove = (option) => {
    //   selection2.value = selection2.value.filter(item => item !== option.code)
    // }

    // const handleRemove2 = (option) => {
    //   selection3.value = selection3.value.filter(item => item !== option.code)
    // }

    return {
      groupedOptions,
      options,
      selection1,
      selection2,
      selection3,
      // tags1,
      // tags2,
      // handleRemove,
      // handleRemove2,
    }
  },
  template: `
    <div>
      <sm-multi-select
        label="Single select"
        name="multiselect1"
        placeholder="Search keywords..."
        v-model="selection1"
        :allow-empty="false"
        :options="options"
      />

      <sm-multi-select
        label="Multi-select"
        name="multiselect2"
        placeholder="Search keywords..."
        v-model="selection2"
        :allow-empty="false"
        :options="options"
        :multiple="true"
      />

      <!--
      <sm-tag-filters
        style="margin-bottom: 32px;"
        label="Multi-select"
        :tags="tags1"
        @remove="handleRemove"
      />
      -->

      <sm-multi-select
        label="Grouped multi-select"
        name="multiselect3"
        placeholder="Search keywords..."
        v-model="selection3"
        :allow-empty="false"
        :options="groupedOptions"
        :show-group-select="true"
        :multiple="true"
      />

      <!--
      <sm-tag-filters
        style="margin-bottom: 32px;"
        label="Grouped multi-select"
        :tags="tags2"
        @remove="handleRemove2"
      />
      -->
    </div>
  `,
})

DisallowEmpty.storyName = 'Disallow empty'

DisallowEmpty.parameters = {
  docs: {
    description: {
      story: 'Use <code>allow-empty</code> prop to disallow empty selection in multi-select.',
    },
  },
}

export const Validation = () => ({
  components: { SmMultiSelect },
  setup: () => {
    const selection1 = ref()
    const selection2 = ref()
    // const tags = ref()

    const first = ref()
    const second = ref()

    const options = ref([
      { label: 'Selection 1', code: 's1' },
      { label: 'Selection 2', code: 's2' },
      { label: 'Selection 3', code: 's3' },
      { label: 'Selection 4', code: 's4' },
      { label: 'Selection 5', code: 's5' },
      { label: 'Selection 6', code: 's6' },
      { label: 'Selection 7', code: 's7' },
      { label: 'Selection 8', code: 's8' },
      { label: 'Selection 9', code: 's9' },
      { label: 'Selection 10', code: 's10' },
      { label: 'Selection 11', code: 's11' },
      { label: 'Selection 12', code: 's12' },
      { label: 'Selection 111', code: 's111' },
    ])

    defineRule('minmax', (value: string[], [min, max]: [number, number]) => {
      // Target here is the value of the target field
      if (value.length >= min && value.length <= max) {
        return true
      }

      // here it is its name, because we are generating a message
      return `Selected items must be within ${min} to ${max}`
    })

    defineRule('confirmedBy', (value: string, [target]: [string]) => {
      // Target here is the value of the target field
      if (value === target) {
        return true
      }

      // here it is its name, because we are generating a message
      return 'The value does not match the second field'
    })

    // const handleRemove = (option) => {
    //   selection2.value = selection2.value.filter(item => item !== option.code)
    // }

    return {
      first,
      second,
      options,
      selection1,
      selection2,
      // tags,
      // handleRemove,
    }
  },
  template: `
    <div>
      <sm-multi-select
        label="Single select"
        name="multiselect1"
        placeholder="Search keywords..."
        v-model="selection1"
        rules="required"
        :options="options"
      />

      <sm-multi-select
        label="Multi-select"
        name="multiselect2"
        placeholder="Search keywords..."
        v-model="selection2"
        rules="required|minmax:2,4"
        :options="options"
        :multiple="true"
      />

      <!--
      <sm-tag-filters
        style="margin-bottom: 32px;"
        label="Multi-select"
        :tags="tags"
        @remove="handleRemove"
      />
      -->

      <sm-form>
        <div class="grid grid-cols-2 gap-32">
          <sm-multi-select
            v-model="first"
            placeholder="Search keywords..."
            label="First field"
            name="multiselect3"
            :rules="{
              required: true,
              confirmedBy: '@multiselect4',
            }"
            :options="options"
          />

          <sm-multi-select
            v-model="second"
            placeholder="Search keywords..."
            label="Second field"
            name="multiselect4"
            rules="required"
            :options="options"
          />
        </div>
      </sm-form>
    </div>
  `,
})

const validationDescription = `
  The <code>sm-multi-select</code> component exposes a <code>validate()</code> method property to support validation.

  You can access them by assigning a <code>ref</code> to <code>sm-multi-select</code> component.
`

Validation.parameters = {
  docs: {
    description: {
      story: validationDescription,
    },
  },
}

export const Footer = () => ({
  components: { SmMultiSelect },
  setup: () => {
    const draftSelection = ref<string[]>()
    const draftTags = ref<string[]>()

    const confirmedSelection = ref<string[]>()
    // const confirmedTags = ref()

    const multiselectRef = ref<MultiSelectType>()

    const options = ref([
      { label: 'Selection 1', code: '1' },
      { label: 'Selection 2', code: '2' },
      { label: 'Selection 3', code: '3' },
      { label: 'Selection 4', code: '4' },
      { label: 'Selection 5', code: '5' },
      { label: 'Selection 6', code: '6' },
      { label: 'Selection 7', code: '7' },
      { label: 'Selection 8', code: '8' },
      { label: 'Selection 9', code: '9' },
      { label: 'Selection 10', code: '10' },
      { label: 'Selection 11', code: '11' },
      { label: 'Selection 12', code: '12' },
    ])

    // const handleRemove = (option) => {
    //   confirmedSelection.value = confirmedSelection.value.filter(item => item !== option.code)
    //   confirmedTags.value = confirmedTags.value.filter(item => item.code !== option.code)
    //   resetSelection()
    // }

    const resetSelection = () => {
      draftSelection.value = confirmedSelection.value
    }

    const confirmSelection = () => {
      confirmedSelection.value = draftSelection.value
      // confirmedTags.value = draftTags.value
      multiselectRef.value?.close()
    }

    const cancelSelection = () => {
      resetSelection()
      multiselectRef.value?.close()
    }

    onMounted(() => {
      // Open the dropdown when running in Percy
      // This is manually done here because we don't have a prop
      // that we can just set to true to display the hidden content
      if (isPercyContext() && multiselectRef.value) {
        multiselectRef.value.open()
      }
    })

    return {
      confirmedSelection,
      // confirmedTags,
      draftSelection,
      draftTags,
      multiselectRef,
      options,
      cancelSelection,
      confirmSelection,
      // handleRemove,
      resetSelection,
    }
  },
  template: `
    <div>
      <sm-multi-select
        ref="multiselectRef"
        v-model="draftSelection"
        label="Input label"
        name="multiselect1"
        placeholder="Search keywords..."
        :multiple="true"
        :options="options"
        @close="resetSelection"
      >
        <template #footer>
          <sm-button type="tertiary" size="small" @click="cancelSelection">Cancel</sm-button>
          <sm-button type="primary" size="small" @click="confirmSelection">Add</sm-button>
        </template>
      </sm-multi-select>

      <!--
      <sm-tag-filters
        style="margin-bottom: 8px;"
        label="Input label"
        :tags="confirmedTags"
        @remove="handleRemove"
      />
      -->
    </div>
  `,
})

const footerDescription = `
  Use <code>footer</code> slot to add a sticky footer on the dropdown list.

  The default styles can be overridden by providing a <code>footer-class</code> prop.

  The component also exposes some methods to attach relevant functionality to the slotted content:

  - <code>open</code>: open the dropdown

  - <code>close</code>: close the dropdown, e.g when footer action is clicked


  Events of the same name are also available to attach custom handlers.

  The save on trigger functionality is not handled by the component itself as it needs to keep track
  of the selected/unselected item(s) and update the UI real-time.

  Products would need to manage their models/values and add the desired behavior on their end,
  e.g adding draft state and saving only when a specific action is triggered.
`

Footer.parameters = {
  docs: {
    description: {
      story: footerDescription,
    },
  },
  percy: {
    // Needed for the Percy to capture dropdown content after some action
    // It is unfortunate we have to use the internal implementation of the
    // component but we are limited to CSS class selectors from the Percy API
    waitForSelector: '.sm-multi-select__list',
  },
}

// Add back once we have sm-tag-filters support
// export const AdvancedFiltersSeparateSections = () => ({
//   components: { SmMultiSelect },
//   setup: () => {
//     const selectedRoomTypes = ref([
//       'double-double',
//       'presidential-suite',
//       'executive-suite',
//       'executive-floor',
//       'adjacent-rooms',
//       'cabana',
//       'villa',
//       'deluxe-double-double',
//     ])

//     const selectedRatePlans = ref(['weekday', 'holiday-suite', '3-3-holiday-suite'])

//     const selectedChannels = ref(['abb', 'agd', 'tbb', 'bcm'])

//     const selectedRoomRates = ref<string[]>()

//     const roomTypeOptions = ref([
//       { label: 'Single Bedroom', code: 'single' },
//       { label: 'Double Bedroom', code: 'double' },
//       { label: 'Twin Bedroom', code: 'twin' },
//       { label: 'Queen Bedroom', code: 'queen' },
//       { label: 'King Bedroom', code: 'king' },
//       { label: 'Double-double Bedroom', code: 'double-double' },
//       {
//         label: 'Deluxe double-double Bedroom - an extremely long label',
//         code: 'deluxe-double-double',
//       },
//       { label: 'Suite', code: 'suite' },
//       { label: 'Mini Suite', code: 'mini-suite' },
//       { label: 'Presidential Suite', code: 'presidential-suite' },
//       { label: 'Executive Suite', code: 'executive-suite' },
//       { label: 'Executive Floor', code: 'executive-floor' },
//       { label: 'Adjacent Rooms', code: 'adjacent-rooms' },
//       { label: 'Cabana', code: 'cabana' },
//       { label: 'Villa', code: 'villa' },
//     ])

//     const ratePlanOptions = ref([
//       {
//         title: 'Standard',
//         libs: [
//           { label: 'Weekday deal', code: 'weekday' },
//           { label: 'Weekend deal', code: 'weekend' },
//         ],
//       },
//       {
//         title: 'Deluxe',
//         libs: [
//           { label: 'Weekday deal', code: 'weekday-deluxe' },
//           { label: 'Weekend', code: 'weekend-deluxe' },
//         ],
//       },
//       {
//         title: 'Suite',
//         libs: [
//           { label: 'Holiday', code: 'holiday-suite' },
//           { label: 'Three days, three nights holiday promo', code: '3-3-holiday-suite' },
//         ],
//       },
//     ])

//     const channelOptions = ref([
//       { label: 'Agoda', code: 'agd' },
//       { label: 'Airbnb', code: 'abb' },
//       { label: 'Direct Booking', code: 'tbb' },
//       { label: 'Booking.com', code: 'bcm' },
//       { label: 'Easy Travels', code: 'etr' },
//       { label: 'TripAdvisor Instant Booking', code: 'taib' },
//     ])

//     const roomRateOptions = ref([])

//     const tags1 = ref()
//     const tags2 = ref()
//     const tags4 = ref()

//     // Hidden in popover and won't be initialized until it's visible
//     // therefore setting the value here as an alternative
//     const tags3 = computed(() => {
//       return channelOptions.value.filter(channel => selectedChannels.value.includes(channel.code))
//     })

//     const badgeCounter = computed(() => {
//       return (selectedRoomRates.value?.length ?? 0) + (selectedChannels.value.length || 0)
//     })

//     // const handleRemoveRoomType = (option) => {
//     //   selectedRoomTypes.value = selectedRoomTypes.value.filter(item => item !== option.code)
//     // }

//     // const handleRemoveRatePlan = (option) => {
//     //   selectedRatePlans.value = selectedRatePlans.value.filter(item => item !== option.code)
//     // }

//     // const handleRemoveChannels = (option) => {
//     //   selectedChannels.value = selectedChannels.value.filter(item => item !== option.code)
//     // }

//     const handleClearAll1 = () => {
//       selectedRoomTypes.value = []
//       selectedRoomRates.value = []
//       selectedChannels.value = []
//       selectedRatePlans.value = []
//     }

//     return {
//       badgeCounter,
//       channelOptions,
//       roomTypeOptions,
//       roomRateOptions,
//       ratePlanOptions,
//       selectedRoomTypes,
//       selectedRoomRates,
//       selectedRatePlans,
//       selectedChannels,
//       tags1,
//       tags2,
//       tags3,
//       tags4,
//       // handleRemoveChannels,
//       // handleRemoveRatePlan,
//       // handleRemoveRoomType,
//       handleClearAll1,
//     }
//   },
//   template: `
//     <div>
//       <div
//         class="flex flex-wrap gap-16 mb-16"
//         style="max-width: 768px;"
//       >
//         <sm-multi-select
//           style="min-width: 252px"
//           label="Room types"
//           name="multiselect1"
//           v-model="selectedRoomTypes"
//           placeholder="Search keywords..."
//           :options="roomTypeOptions"
//           :multiple="true"
//           error-disabled
//         />

//         <sm-multi-select
//           style="min-width: 252px"
//           label="Rate plans"
//           name="multiselect2"
//           v-model="selectedRatePlans"
//           placeholder="Search keywords..."
//           :options="ratePlanOptions"
//           :multiple="true"
//           :show-group-select="true"
//           error-disabled
//         />

//         <div class="flex gap-16 self-end relative" style="bottom: 1px">
//           <sm-popover>
//             <template #default>
//               <sm-button type="tertiary" aria-label="More filters" size="mini">
//                 <span class="inline-block" style="padding: 4.5px 0">
//                   <sm-icon name="section-settings" />
//                   <sm-badge v-if="badgeCounter" class="ml-4" size="medium" type="info">{{ badgeCounter }}</sm-badge>
//                 </span>
//               </sm-button>
//             </template>

//             <template #content="slotProps">
//               <div style="width: 364px">
//                 <div class="flex justify-between items-center">
//                   <span class="sm-h6 sm-section-heading mb-0"><sm-icon name="section-settings" class="mr-8" /> More filters</span>
//                   <sm-button shape="square" size="medium" type="text" style="margin: -6px -4px -4px 0" aria-label="Close more filters" @click="slotProps.close">
//                     <sm-icon name="action-cross" class="text-grey-neu-black" />
//                   </sm-button>
//                 </div>
//                 <sm-divider margin-top="8px" margin-bottom="8px" min-width="100%" class="-ml-16 -mr-16" />
//                 <div>
//                   <div class="mb-8">
//                     <sm-multi-select
//                       label="Channels"
//                       name="multiselect3"
//                       v-model="selectedChannels"
//                       placeholder="Search keywords..."
//                       :options="channelOptions"
//                       :multiple="true"
//                       error-disabled
//                     />
//                   </div>
//                   <div class="mb-8">
//                     <sm-multi-select
//                       label="Room rates"
//                       name="multiselect4"
//                       v-model="selectedRoomRates"
//                       placeholder="Search keywords..."
//                       :options="roomRateOptions"
//                       :multiple="true"
//                       error-disabled
//                     />
//                   </div>
//                 </div>
//               </div>
//             </template>
//           </sm-popover>

//           <sm-button type="text" @click="handleClearAll1">Clear all</sm-button>
//         </div>
//       </div>

//       <!--
//       <sm-tag-filters
//         class="mb-8"
//         label="Room types"
//         max-length="responsive"
//         :tags="tags1"
//         @remove="handleRemoveRoomType"
//       />

//       <sm-tag-filters
//         class="mb-8"
//         label="Rate plans"
//         max-length="responsive"
//         :tags="tags2"
//         @remove="handleRemoveRatePlan"
//       />

//       <sm-tag-filters
//         class="mb-8"
//         label="Channels"
//         max-length="responsive"
//         :tags="tags3"
//         @remove="handleRemoveChannels"
//       />

//       <sm-tag-filters
//         class="mb-8"
//         label="Room rates"
//         max-length="responsive"
//         :tags="tags4"
//       />
//       -->
//     </div>
//   `,
// })

// AdvancedFiltersSeparateSections.storyName = 'Advanced filters: Separate sections'

// const advancedFiltersSeparateSectionsDescription = `
//   Each <code>sm-multi-select</code> component can have a corresponding <code>sm-tag-filters</code>.

//   They are separate and presentational components that can be stacked below the form fields.

//   If the <code>sm-multi-select</code> component appears at the same time as the tag-filters,
//   <code>tags.sync</code> modifier can be used in the multi-select component to easily hook the updates on the tag-filters.

//   On the other-hand, if the multi-select component can't appear at the same time as the tag-filters,
//   for instance it is conditionally loaded via popover, the tag-filters' <code>tags</code>
//   prop can be independently computed.

//   In both cases, clicking the close/remove button from the individual tags will emit a
//   <code>remove</code> event on click. Model updates should be handled from the parent component/view:

//   <pre>
//     // Example implementation of @remove="handleRemoveOption" event
//     const handleRemoveOption = (option) => {
//       selection.value = selection.value.filter(item => item !== option.code)
//     }
//   </pre>
// `,

// AdvancedFiltersSeparateSections.parameters = {
//   docs: {
//     description: {
//       story: advancedFiltersSeparateSectionsDescription,
//     },
//   },
// }

// Add back once we have sm-tag-filters support
// export const AdvancedFiltersCombinedSections = () => ({
//   components: { SmMultiSelect },
//   setup: () => {
//     const selectedRoomTypes = ref([
//       'double-double',
//       'presidential-suite',
//       'executive-suite',
//       'executive-floor',
//       'adjacent-rooms',
//       'cabana',
//       'villa',
//       'deluxe-double-double',
//     ])

//     const selectedRatePlans = ref(['weekday', 'holiday-suite', '3-3-holiday-suite'])

//     const selectedChannels = ref(['abb', 'agd', 'tbb', 'bcm'])

//     const selectedRoomRates = ref<string[]>()

//     const roomTypeOptions = ref([
//       { label: 'Single Bedroom', code: 'single' },
//       { label: 'Double Bedroom', code: 'double' },
//       { label: 'Twin Bedroom', code: 'twin' },
//       { label: 'Queen Bedroom', code: 'queen' },
//       { label: 'King Bedroom', code: 'king' },
//       { label: 'Double-double Bedroom', code: 'double-double' },
//       {
//         label: 'Deluxe double-double Bedroom - an extremely long label',
//         code: 'deluxe-double-double',
//       },
//       { label: 'Suite', code: 'suite' },
//       { label: 'Mini Suite', code: 'mini-suite' },
//       { label: 'Presidential Suite', code: 'presidential-suite' },
//       { label: 'Executive Suite', code: 'executive-suite' },
//       { label: 'Executive Floor', code: 'executive-floor' },
//       { label: 'Adjacent Rooms', code: 'adjacent-rooms' },
//       { label: 'Cabana', code: 'cabana' },
//       { label: 'Villa', code: 'villa' },
//     ])

//     const ratePlanOptions = ref([
//       {
//         title: 'Standard',
//         libs: [
//           { label: 'Weekday deal', code: 'weekday' },
//           { label: 'Weekend deal', code: 'weekend' },
//         ],
//       },
//       {
//         title: 'Deluxe',
//         libs: [
//           { label: 'Weekday deal', code: 'weekday-deluxe' },
//           { label: 'Weekend', code: 'weekend-deluxe' },
//         ],
//       },
//       {
//         title: 'Suite',
//         libs: [
//           { label: 'Holiday', code: 'holiday-suite' },
//           { label: 'Three days, three nights holiday promo', code: '3-3-holiday-suite' },
//         ],
//       },
//     ])

//     const channelOptions = ref([
//       { label: 'Agoda', code: 'agd' },
//       { label: 'Airbnb', code: 'abb' },
//       { label: 'Direct Booking', code: 'tbb' },
//       { label: 'Booking.com', code: 'bcm' },
//       { label: 'Easy Travels', code: 'etr' },
//       { label: 'TripAdvisor Instant Booking', code: 'taib' },
//     ])

//     const roomRateOptions = ref([])

//     const tags1 = ref()
//     const tags2 = ref()
//     const tags4 = ref()

//     // const tagsCombined = computed(() => {
//     //   const tags = []

//     //   if (tags1.value) {
//     //     tags.push(...tags1.value)
//     //   }

//     //   if (tags2.value) {
//     //     tags.push(...tags2.value)
//     //   }

//     //   // Hidden in popover and won't be initialized until it's visible
//     //   // therefore setting the value here as an alternative
//     //   const tags3 = channelOptions.value.filter(channel => selectedChannels.value.includes(channel.code))
//     //   tags.push(...tags3)

//     //   if (tags4.value) {
//     //     tags.push(...tags4.value)
//     //   }

//     //   return tags
//     // })

//     const badgeCounter = computed(() => {
//       return (selectedRoomRates.value?.length ?? 0) + (selectedChannels.value.length || 0)
//     })

//     // const handleRemove = (option) => {
//     //   if (selectedRoomTypes.value.find(item => item === option.code)) {
//     //     selectedRoomTypes.value = selectedRoomTypes.value.filter(item => item !== option.code)
//     //   }

//     //   if (selectedRatePlans.value.find(item => item === option.code)) {
//     //     selectedRatePlans.value = selectedRatePlans.value.filter(item => item !== option.code)
//     //   }

//     //   if (selectedChannels.value.find(item => item === option.code)) {
//     //     selectedChannels.value = selectedChannels.value.filter(item => item !== option.code)
//     //   }
//     // }

//     const handleClearAll1 = () => {
//       selectedRoomTypes.value = []
//       selectedRoomRates.value = []
//       selectedChannels.value = []
//       selectedRatePlans.value = []
//     }
//     return {
//       badgeCounter,
//       channelOptions,
//       roomTypeOptions,
//       roomRateOptions,
//       ratePlanOptions,
//       selectedRoomTypes,
//       selectedRoomRates,
//       selectedRatePlans,
//       selectedChannels,
//       // tagsCombined,
//       tags1,
//       tags2,
//       tags4,
//       // handleRemove,
//       handleClearAll1,
//     }
//   },
//   template: `
//     <div>
//       <div
//         class="flex flex-wrap gap-16 mb-16"
//         style="max-width: 768px;"
//       >
//         <sm-multi-select
//           style="min-width: 252px"
//           label="Room types"
//           name="multiselect1"
//           v-model="selectedRoomTypes"
//           placeholder="Search keywords..."
//           :options="roomTypeOptions"
//           :multiple="true"
//           error-disabled
//         />

//         <sm-multi-select
//           style="min-width: 252px"
//           label="Rate plans"
//           name="multiselect2"
//           v-model="selectedRatePlans"
//           placeholder="Search keywords..."
//           :options="ratePlanOptions"
//           :multiple="true"
//           :show-group-select="true"
//           error-disabled
//         />

//         <div class="flex gap-16 self-end relative" style="bottom: 1px">
//           <sm-popover>
//             <template #default>
//               <sm-button type="tertiary" aria-label="More filters" size="mini">
//                 <span class="inline-block" style="padding: 4.5px 0">
//                   <sm-icon name="section-settings" />
//                   <sm-badge v-if="badgeCounter" class="ml-4" size="medium" type="info">{{ badgeCounter }}</sm-badge>
//                 </span>
//               </sm-button>
//             </template>

//             <template #content="slotProps">
//               <div style="width: 364px">
//                 <div class="flex justify-between items-center">
//                   <span class="sm-h6 sm-section-heading mb-0"><sm-icon name="section-settings" class="mr-8" /> More filters</span>
//                   <sm-button shape="square" size="medium" type="text" style="margin: -6px -4px -4px 0" aria-label="Close more filters" @click="slotProps.close">
//                     <sm-icon name="action-cross" class="text-grey-neu-black" />
//                   </sm-button>
//                 </div>
//                 <sm-divider margin-top="8px" margin-bottom="8px" min-width="100%" class="-ml-16 -mr-16" />
//                 <div>
//                   <div class="mb-8">
//                     <sm-multi-select
//                       label="Channels"
//                       name="multiselect3"
//                       v-model="selectedChannels"
//                       placeholder="Search keywords..."
//                       :options="channelOptions"
//                       :multiple="true"
//                       error-disabled
//                     />
//                   </div>
//                   <div class="mb-8">
//                     <sm-multi-select
//                       label="Room rates"
//                       name="multiselect4"
//                       v-model="selectedRoomRates"
//                       placeholder="Search keywords..."
//                       :options="roomRateOptions"
//                       :multiple="true"
//                       error-disabled
//                     />
//                   </div>
//                 </div>
//               </div>
//             </template>
//           </sm-popover>

//           <sm-button type="text" @click="handleClearAll1">Clear all</sm-button>
//         </div>
//       </div>

//       <!--
//       <sm-tag-filters
//         class="mb-8"
//         label="Combined filters"
//         max-length="responsive"
//         :tags="tagsCombined"
//         @remove="handleRemove"
//       />
//       -->
//     </div>
//   `,
// })

// AdvancedFiltersCombinedSections.storyName = 'Advanced filters: Combined sections'

// const advancedFiltersCombinedSectionsDescription = `
//   Multiple <code>sm-multi-select</code> components can be mapped to a single <code>sm-tag-filters</code>.

//   The tag-filters' <code>tags</code> prop can be computed to combine selections from different fields.

//   If the <code>sm-multi-select</code> component appears at the same time as the tag-filters,
//   <code>tags.sync</code> modifier can be used in the multi-select component to conveniently get the tags array.

//   On the other-hand, if the multi-select component can't appear at the same time as the tag-filters,
//   for instance it is conditionally loaded via popover, the tag-filters' <code>tags</code>
//   prop can be independently computed.

//   In both cases, clicking the close/remove button from the individual tags will emit a
//   <code>remove</code> event on click. Model updates should be handled from the parent component/view:

//   <pre>
//     // Example implementation of @remove="handleRemoveOption" event
//     const handleRemoveOption = (option) => {
//       selection.value = selection.value.filter(item => item !== option.code)
//     }
//   </pre>
// `,

// AdvancedFiltersCombinedSections.parameters = {
//   docs: {
//     description: {
//       story: advancedFiltersCombinedSectionsDescription,
//     },
//   },
// }

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

      <sm-help-card class="mb-24">
        <template #header>Does not require sui-themes package installation</template>
      </sm-help-card>

      <p>Styling hooks will enable customization for your components. Styling hooks are constructed using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">CSS custom properties</a>.</p>

      <p>Below is an example of the SUI multi-select and the brand multi-select using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 308px; height: auto; min-width: 0"
          alt="Multi-select default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 308px; height: auto; min-width: 0"
          alt="Multi-select themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the multi-select customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

      <p>For the <span style="font-weight: 600;">shared input, label and error field variables</span>, please refer to the table in <a href="/?path=/story/components-form-input--styling-hooks">input styling hooks</a></p>

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
            <sm-table-th colspan="3">Input field overrides</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Input</sm-table-td>
            <sm-table-td>
              color-icon
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-multi-select-color-icon
                --sm-c-multi-select-color-icon-disabled
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Dropdown</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Container</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-text
              <br/>
              border
              <br/>
              border-radius
              <br/>
              box-shadow
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-multi-select-dropdown-color-background
                --sm-c-multi-select-dropdown-color-text
                --sm-c-multi-select-dropdown-border
                --sm-c-multi-select-dropdown-border-radius
                --sm-c-multi-select-dropdown-box-shadow
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Group title <span class="block text-grey-neu-dark text-section-header">(Grouped options variant)</span></sm-table-td>
            <sm-table-td>
              color-text
              <br/>
              border-top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-multi-select-dropdown-group-color-text
                --sm-c-multi-select-dropdown-group-border-top
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Option</sm-table-td>
            <sm-table-td>
              color-text
              <br/>
              color-background
              <br/>
              box-shadow
              <br/>
              border-left
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-multi-select-dropdown-option-color-text
                --sm-c-multi-select-dropdown-option-description-color-text

                --sm-c-multi-select-dropdown-option-color-background-hover

                --sm-c-multi-select-dropdown-option-color-background-selected
                --sm-c-multi-select-dropdown-option-color-border-left-selected

                --sm-c-multi-select-dropdown-option-color-background-disabled
                --sm-c-multi-select-dropdown-option-color-text-disabled
                --sm-c-multi-select-dropdown-option-description-color-text-disabled

                --sm-c-multi-select-dropdown-option-color-border-left-selected-disabled

                --sm-c-multi-select-dropdown-option-box-shadow-focus
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>
              Option checkbox <span class="block text-grey-neu-dark text-section-header">(Multi-select variant)</span>
            </sm-table-td>
            <sm-table-td>
              color-border
              <br/>
              color-background
              <br/>
              color-foreground
              <br/>
              border-width
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-multi-select-dropdown-option-checkbox-color-border
                --sm-c-multi-select-dropdown-option-checkbox-color-background
                --sm-c-multi-select-dropdown-option-checkbox-color-foreground
                --sm-c-multi-select-dropdown-option-checkbox-border-width

                --sm-c-multi-select-dropdown-option-checkbox-color-border-checked
                --sm-c-multi-select-dropdown-option-checkbox-color-background-checked
                --sm-c-multi-select-dropdown-option-checkbox-color-foreground-checked

                --sm-c-multi-select-dropdown-option-checkbox-color-border-hover
                --sm-c-multi-select-dropdown-option-checkbox-color-background-hover
                --sm-c-multi-select-dropdown-option-checkbox-color-foreground-hover

                --sm-c-multi-select-dropdown-option-checkbox-color-border-checked-hover
                --sm-c-multi-select-dropdown-option-checkbox-color-background-checked-hover
                --sm-c-multi-select-dropdown-option-checkbox-color-foreground-checked-hover

                --sm-c-multi-select-dropdown-option-checkbox-color-border-disabled
                --sm-c-multi-select-dropdown-option-checkbox-color-background-disabled
                --sm-c-multi-select-dropdown-option-checkbox-color-foreground-disabled

                --sm-c-multi-select-dropdown-option-checkbox-color-border-checked-disabled
                --sm-c-multi-select-dropdown-option-checkbox-color-background-checked-disabled
                --sm-c-multi-select-dropdown-option-checkbox-color-foreground-checked-disabled
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>
              Footer
            </sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              border-top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-multi-select-dropdown-footer-color-background
                --sm-c-multi-select-dropdown-footer-border-top
              </code>
            </sm-table-td>
          </sm-table-tr>

          <!--
          <sm-table-tr>
            <sm-table-th colspan="3">Tag filters</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>List container</sm-table-td>
            <sm-table-td>
              padding
              <br/>
              margin
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-tag-filters-list-padding
                --sm-c-tag-filters-list-margin
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>List item</sm-table-td>
            <sm-table-td>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-tag-filters-list-item-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td rowspan="2">Tag</sm-table-td>
            <sm-table-td>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-tag-filters-tag-padding
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td colspan="2">
            For the <span style="font-weight: 600;">tag component variables</span>, please refer to <a href="/?path=/story/components-tag--styling-hooks">tag styling hooks</a>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Action</sm-table-td>
            <sm-table-td>
              align-self
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-tag-filters-action-align-self
              </code>
            </sm-table-td>
          </sm-table-tr>
          -->

        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
