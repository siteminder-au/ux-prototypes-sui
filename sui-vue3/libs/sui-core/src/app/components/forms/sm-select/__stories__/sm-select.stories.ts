import { onMounted, ref, watch } from 'vue'
import SmSelect from '../sm-select.vue'
import SmSelectPrefixContent from '../sm-select-prefix-content.vue'
import SmSelectSuffixContent from '../sm-select-suffix-content.vue'
import { isPercyContext } from '../../../../../../test/percy/helpers'
import defaultExample from './images/select-default.png'
import themedExample from './images/select-themed.png'

export default {
  title: 'Components/Form/Select',
  component: SmSelect,
  subcomponents: {
    'sm-select-prefix-content': SmSelectPrefixContent,
    'sm-select-suffix-content': SmSelectSuffixContent,
  },
}

export const Standard = () => ({
  components: { SmSelect },
  setup: () => {
    const selection = ref('')
    const selection2 = ref('apple')
    const selection3 = ref(null)
    const selection4 = ref('blueberry')
    const select = ref()

    const options = ref([
      { label: 'Strawberry', code: 'strawberry' },
      { label: 'Grapes', code: 'grapes' },
      { label: 'Watermelon', code: 'watermelon' },
      { label: 'Apple', code: 'apple' },
      { label: 'Kiwi', code: 'kiwi' },
      { label: 'Blueberry', code: 'blueberry' },
      { label: 'Lemon', code: 'lemon' },
      { label: 'Tomato', code: 'tomato' },
      { label: 'Green apple', code: 'green-apple' },
    ])

    onMounted(() => {
      // Open the dropdown when running in Percy
      // This is manually done here because we don't have a prop or a method
      // that we can just set to true to display the hidden content
      if (isPercyContext() && select.value?.multiselect) {
        // https://vue-multiselect.js.org/#sub-programmatic-control
        select.value.multiselect.activate()
      }
    })

    watch(selection, () => {
      console.info('selection', selection.value)
    }, { immediate: true })

    // add custom rule
    const selectRules = {
      not_one_of: ['strawberry'],
    }

    return { select, selection, selection2, selection3, selection4, options, selectRules }
  },
  template: `
    <div>
      <span class="sui-storybook-header">Standard</span>
      <sm-select
        label="Favourite icecream"
        v-model="selection"
        :options="options"
        placeholder="Search keywords..."
        :rules="selectRules"
        name="selection"
      />

      <sm-select
        label="Favourite icecream"
        v-model="selection2"
        :options="options"
        placeholder="Search keywords..."
        name="selection2"
      />

      <br/><br/>

      <span class="sui-storybook-header">Standard without keyword search</span>
      <sm-select
        label="Favourite icecream"
        v-model="selection3"
        placeholder="Please select your favourite ice cream"
        :options="options"
        :filterable="false"
        name="selection3"
      />

      <sm-select
        label="Favourite icecream"
        ref="select"
        v-model="selection4"
        class="percy-mt-320"
        placeholder="Please select your favourite ice cream"
        :options="options"
        :filterable="false"
        name="selection4"
      />
    </div>
  `,
})

Standard.storyName = 'Standard'

const standardDescription = `
  The <code>sm-select</code> component exposes a <code>validate()</code> method property to support validation.

  You can access them by assigning a <code>ref</code> to <code>sm-select</code> component.
`
Standard.parameters = {
  docs: {
    description: {
      component: standardDescription,
    },
  },
  percy: {
    // Needed for the Percy to capture dropdown content after some action
    // It is unfortunate we have to use the internal implementation of the
    // component but we are limited to CSS class selectors from the Percy API
    waitForSelector: '.multiselect__content',
  },
}

export const Multiple = () => ({
  components: { SmSelect },
  setup: () => {
    const select = ref()
    const selection = ref([])
    const selection2 = ref(['watermelon', 'green-apple'])
    const selection3 = ref([])
    const selection4 = ref(['strawberry', 'blueberry', 'lemon', 'tomato'])

    const options = ref([
      { label: 'Strawberry', code: 'strawberry' },
      { label: 'Grapes', code: 'grapes' },
      { label: 'Watermelon', code: 'watermelon' },
      { label: 'Apple', code: 'apple' },
      { label: 'Kiwi', code: 'kiwi' },
      { label: 'Blueberry', code: 'blueberry' },
      { label: 'Lemon', code: 'lemon' },
      { label: 'Tomato', code: 'tomato' },
      { label: 'Green apple', code: 'green-apple' },
    ])

    onMounted(() => {
      // Open the dropdown when running in Percy
      // This is manually done here because we don't have a prop or a method
      // that we can just set to true to display the hidden content
      if (isPercyContext() && select.value?.multiselect) {
        // https://vue-multiselect.js.org/#sub-programmatic-control
        select.value.multiselect.activate()
      }
    })

    return { select, selection, selection2, selection3, selection4, options }
  },
  template: `
    <div>
      <span class="sui-storybook-header">Standard</span>
      <sm-select
        label="Favourite icecream"
        v-model="selection"
        :options="options"
        :multiple="true"
        placeholder="Search keywords..."
        name="selection"
      />

      <sm-select
        label="Favourite icecream"
        v-model="selection2"
        :options="options"
        :multiple="true"
        placeholder="Search keywords..."
        name="selection2"
      />

      <br/><br/>

      <span class="sui-storybook-header">Collapse tags</span>
      <sm-select
        label="Favourite icecream"
        v-model="selection3"
        :options="options"
        :multiple="true"
        :collapseTags="true"
        :collapseTagsLimit="1"
        placeholder="Search keywords..."
        name="selection3"
      />

      <sm-select
        label="Favourite icecream"
        ref="select"
        v-model="selection4"
        class="percy-mt-320"
        :options="options"
        :multiple="true"
        :collapseTags="true"
        :collapseTagsLimit="1"
        placeholder="Search keywords..."
        name="selection4"
      />
    </div>
  `,
})

Multiple.parameters = {
  percy: {
    // Needed for the Percy to capture dropdown content after some action
    // It is unfortunate we have to use the internal implementation of the
    // component but we are limited to CSS class selectors from the Percy API
    waitForSelector: '.multiselect__content',
  },
}

export const MultipleAndCreateNew = () => ({
  components: { SmSelect },
  setup: () => {
    const selection = ref(['strawberry'])

    const options = ref([
      { label: 'Strawberry', code: 'strawberry' },
      { label: 'Grapes', code: 'grapes' },
      { label: 'Watermelon', code: 'watermelon' },
      { label: 'Apple', code: 'apple' },
      { label: 'Kiwi', code: 'kiwi' },
      { label: 'Blueberry', code: 'blueberry' },
      { label: 'Lemon', code: 'lemon' },
      { label: 'Tomato', code: 'tomato' },
      { label: 'Green apple', code: 'green-apple' },
    ])

    const addTag = (newTag: string) => {
      const tag = {
        label: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      }
      options.value.push(tag)
      selection.value.push(tag.code)
    }
    return { selection, options, addTag }
  },
  template: `
  <div>
    <sm-select
      label="Favourite icecream"
      v-model="selection"
      :options="options"
      :multiple="true"
      :allow-create="true"
      @tag-added="addTag"
      placeholder="Search keywords..."
      name="selection"
    />

    <p>Selected values: {{ selection }}</p>
    <p>Options: {{ options }}</p>
  </div>
  `,
})

MultipleAndCreateNew.storyName = 'Multiple and create new'

const multipleAndCreateNewDescription = `
  To handle new tags, listen to the <code>tag-added</code> event and handle the payload like so:

  <pre>
    const addTag = (newTag: string) => {
      const tag = {
        label: newTag,
        code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }
      options.value.push(tag)
      selection.value.push(tag.code)
    }
  </pre>
`
MultipleAndCreateNew.parameters = {
  docs: {
    description: {
      story: multipleAndCreateNewDescription,
    },
  },
}

export const MixedMultiselects = () => ({
  components: { SmSelect, SmSelectPrefixContent, SmSelectSuffixContent },
  setup: () => {
    const selection = ref('')
    const selections = ref()

    const options = ref([
      { label: 'Strawberry', code: 'strawberry' },
      { label: 'Grapes', code: 'grapes' },
      { label: 'Watermelon', code: 'watermelon' },
      { label: 'Apple', code: 'apple' },
      { label: 'Kiwi', code: 'kiwi' },
      { label: 'Blueberry', code: 'blueberry' },
      { label: 'Lemon', code: 'lemon' },
      { label: 'Tomato', code: 'tomato' },
      { label: 'Green apple', code: 'green-apple' },
    ])
    const enabled = ref(false)

    return { selection, selections, options, enabled }
  },
  template: `
    <div>
      <sm-select
        label="Favourite icecream"
        v-model="selection"
        :options="options"
        :filterable="false"
        placeholder="Please select an option"
        name="selection"
      >
        <template v-slot:suffix>
          <sm-select-suffix-content>Sqft</sm-select-suffix-content>
        </template>
      </sm-select>
      <sm-select
        label="Favourite icecream"
        v-model="selection"
        :options="options"
        :filterable="false"
        placeholder="Please select an option"
        name="selection"
      >
        <template v-slot:prefix>
          <sm-select-prefix-content>Sqft</sm-select-prefix-content>
        </template>
      </sm-select>
      <sm-select
        label="Favourite icecream"
        v-model="selection"
        :options="options"
        :filterable="false"
        placeholder="Please select an option"
        name="selection"
      >
        <template v-slot:prefix>
          <sm-select-prefix-content>Sqft</sm-select-prefix-content>
        </template>
        <template v-slot:suffix>
          <sm-select-suffix-content>Sqft</sm-select-suffix-content>
        </template>
      </sm-select>
      <sm-select
        label="Favourite icecream"
        v-model="selections"
        :options="options"
        :multiple="true"
        placeholder="Search keywords..."
        name="selections"
        >
        <template v-slot:suffix>
          <sm-button
            @click="enabled = !enabled"
            type="primary"
            :aria-label="enabled ? 'Lock field' : 'Unlock field'"
            :title="enabled ? 'Lock field' : 'Unlock field'"
          >
            <sm-icon :name="enabled ? 'action-lock-open' : 'action-lock'" />
          </sm-button>
        </template>
        <template v-slot:prefix>
          <sm-button
            @click="enabled = !enabled"
            type="primary"
            :aria-label="enabled ? 'Lock field' : 'Unlock field'"
            :title="enabled ? 'Lock field' : 'Unlock field'"
          >
            <sm-icon :name="enabled ? 'action-lock-open' : 'action-lock'" />
          </sm-button>
        </template>
      </sm-select>
    </div>

  `,
})

export const OptionGroups = () => ({
  components: { SmSelect },
  setup: () => {
    const selection = ref()
    const selection2 = ref()
    const groupSelect = ref(false)

    const options = ref([
      {
        title: 'Apples and pears',
        libs: [
          { label: 'Apple', code: 'apple' },
          { label: 'Green apple', code: 'green-apple' },
        ],
      },
      {
        title: 'Berries',
        libs: [
          { label: 'Strawberry', code: 'strawberry' },
          { label: 'Raspberry', code: 'raspberry' },
          { label: 'Blueberry', code: 'blueberry' },
          { label: 'Grape', code: 'grape' },
        ],
      },
      {
        title: 'Stone fruits',
        libs: [
          { label: 'Nectarine', code: 'nectarine' },
          { label: 'Apricot', code: 'apricot' },
          { label: 'Plum', code: 'plum' },
        ],
      },
      {
        title: 'Citrus',
        libs: [
          { label: 'Orange', code: 'orange' },
          { label: 'Grapefruit', code: 'grapefruit' },
        ],
      },
      {
        title: 'Tropical',
        libs: [
          { label: 'Mango', code: 'mango' },
          { label: 'Mangosteen', code: 'mangosteen' },
          { label: 'Pineapple', code: 'pineapple' },
          { label: 'Jackfruit', code: 'jackfruit' },
        ],
      },
    ])

    return { selection, selection2, options, groupSelect }
  },
  template: `
    <div>
      <span class="sui-storybook-header">Single</span>
      <sm-select
        label="Favourite fruit"
        v-model="selection"
        :options="options"
        :filterable="false"
        :group-select="groupSelect"
        :show-group-select="true"
        placeholder="Please select your favourite fruit"
        name="selection"
      />

      <br/><br/>

      <span class="sui-storybook-header">Multiple</span>
      <sm-select
        label="Favourite fruits"
        v-model="selection2"
        :options="options"
        :filterable="false"
        :show-group-select="true"
        :group-select="groupSelect"
        :multiple="true"
        placeholder="Please select your favourite fruits"
        name="selection2"
      />
    </div>
  `,
})

OptionGroups.storyName = 'Option groups'

const optionGroupsDescription = `
  Use <code>show-group-select</code> props to display option groups.

  Please follow the below structure for the option grouping

  <pre>
    [
      { title: 'abc', libs: [{ label: 'Text label1', code: 'label1' }, { label: 'Text label2', code: 'label2' }] },
      { title: 'bcd', libs: [{ label: 'Text label3', code: 'label3' }, { label: 'Text label4', code: 'label4' }] },
    ]
  </pre>

  group-label is used to locate the group label, Use <code>title</code> to define group-label.

  group-values should point to the group’s option list, Use <code>libs</code> array of objects to define group-values

  <pre>
    interface libs {
      label: string
      code: any
    }
  </pre>
`
OptionGroups.parameters = {
  docs: {
    description: {
      story: optionGroupsDescription,
    },
  },
}

export const LabelAndDescription = () => ({
  components: { SmSelect },
  setup: () => {
    const selection1 = ref('')
    const selection2 = ref('')

    const options = ref([
      { label: 'Strawberry', code: 'strawberry', description: '$2.99 per scoop' },
      { label: 'Grapes', code: 'grapes', description: '$2.99 per scoop' },
      { label: 'Watermelon', code: 'watermelon', description: '$2.99 per scoop' },
      { label: 'Apple', code: 'apple', description: '$2.99 per scoop' },
      { label: 'Kiwi', code: 'kiwi', description: '$3.50 per scoop' },
      { label: 'Blueberry', code: 'blueberry', description: '$3.50 per scoop' },
      { label: 'Lemon', code: 'lemon', description: '$2.99 per scoop' },
      { label: 'Tomato', code: 'tomato', description: '$2.99 per scoop' },
      { label: 'Green apple', code: 'green-apple', description: '$2.49 per scoop' },
    ])

    const groupedOptions = ref([
      {
        title: 'New',
        libs: [
          { label: 'Cold Brew', code: 'cold-brew', description: '$2.99 per scoop' },
          { label: 'Salted Caramel', code: 'salted-caramel', description: '$2.99 per scoop' },
          { label: 'Tiramisu', code: 'tiramisu', description: '$3.20 per scoop' },
          { label: 'Matcha Cheesecake', code: 'matcha-cheesecake', description: '$3.99 per scoop' },
        ],
      },
      {
        title: 'Classic',
        libs: [
          { label: 'Chocolate Chip', code: 'chocolate-chip', description: '$2.99 per scoop' },
          { label: 'Cherry Garcia', code: 'cherry-garcia', description: '$2.99 per scoop' },
          { label: 'Chunky Monkey', code: 'chunky-monkey', description: '$2.99 per scoop' },
          { label: 'Peanut Butter Cup', code: 'peanut-butter-cup', description: '$3.99 per scoop' },
          { label: 'Cheesecake', code: 'cheesecake', description: '$3.49 per scoop' },
          {
            label: 'Strawberry Cheesecake',
            code: 'strawberry-cheesecake',
            description: '$3.99 per scoop',
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

    return {
      groupedOptions,
      options,
      selection1,
      selection2,
    }
  },
  template: `
    <div>
      <sm-select
        label="Standard"
        placeholder="Please select your favourite ice cream"
        v-model="selection1"
        :options="options"
        name="selection1"
      />

      <p>Selected value: {{ selection1 }}</p>

      <sm-select
        label="Grouped"
        placeholder="Please select your favourite ice cream"
        v-model="selection2"
        :options="groupedOptions"
        :show-group-select="true"
        :multiple="true"
        name="selection2"
      />

      <p>Selected values: {{ selection2 }}</p>

    </div>
  `,
})

LabelAndDescription.storyName = 'Label and description'

const labelAndDescriptionDescription = `
  Use <code>description</code> property on the option object to add more details to it.

  This added text will not appear on the input field once selected, nor be used in the search feature.

  For instance:

  <pre>
    [{
      label: 'Strawberry', // Searchable string
      description: '$2.99 per scoop',
      code: 'strawberry',
    }]
  </pre>
`
LabelAndDescription.parameters = {
  docs: {
    description: {
      story: labelAndDescriptionDescription,
    },
  },
}

export const Disabled = () => ({
  components: { SmSelect },
  setup: () => {
    const select = ref()
    const selection1 = ref('')
    const selection2 = ref('')
    const selection3 = ref('')
    const selection4 = ref('')
    const selection5 = ref('')
    const groupSelect = ref(true)

    const options = ref([
      { label: 'Strawberry', code: 'strawberry' },
      { label: 'Grapes', code: 'grapes' },
      { label: 'Watermelon', code: 'watermelon', $isDisabled: true },
      { label: 'Apple', code: 'apple' },
      { label: 'Kiwi', code: 'kiwi' },
      { label: 'Blueberry', code: 'blueberry' },
      { label: 'Lemon', code: 'lemon' },
      { label: 'Tomato', code: 'tomato', $isDisabled: true },
      { label: 'Green apple', code: 'green-apple' },
    ])

    const groupedOptions = ref([
      {
        title: 'Strawberry',
        libs: [
          { label: 'Text label1', code: 'label1' },
          { label: 'Text label2', code: 'label2' },
        ],
      },
      {
        title: 'Grapes',
        libs: [
          { label: 'Text label3', code: 'label3', $isDisabled: true },
          { label: 'Text label4', code: 'label4' },
        ],
      },
      { title: 'Watermelon', libs: [{ label: 'Text label6', code: 'label6' }] },
      {
        title: 'Apple',
        libs: [
          { label: 'Text label7', code: 'label7' },
          { label: 'Text label8', code: 'label8', $isDisabled: true },
        ],
      },
    ])

    const optionsWithDescription = ref([
      { label: 'Strawberry', code: 'strawberry', description: '$2.99 per scoop' },
      { label: 'Grapes', code: 'grapes', description: '$2.99 per scoop' },
      {
        label: 'Watermelon',
        code: 'watermelon',
        $isDisabled: true,
        description: '$2.99 per scoop',
      },
      { label: 'Apple', code: 'apple', description: '$2.99 per scoop' },
      { label: 'Kiwi', code: 'kiwi', description: '$3.50 per scoop' },
      { label: 'Blueberry', code: 'blueberry', description: '$3.50 per scoop' },
      { label: 'Lemon', code: 'lemon', description: '$2.99 per scoop' },
      { label: 'Tomato', code: 'tomato', $isDisabled: true, description: '$2.99 per scoop' },
    ])

    onMounted(() => {
      // Open the dropdown when running in Percy
      // This is manually done here because we don't have a prop or a method
      // that we can just set to true to display the hidden content
      if (isPercyContext() && select.value?.multiselect) {
        // https://vue-multiselect.js.org/#sub-programmatic-control
        select.value.multiselect.activate()
      }
    })

    return {
      groupedOptions,
      groupSelect,
      options,
      optionsWithDescription,
      select,
      selection1,
      selection2,
      selection3,
      selection4,
      selection5,
    }
  },
  template: `
    <div>
      <sm-select
        label="Disabled select"
        placeholder="Please select your favourite ice cream"
        v-model="selection1"
        :options="options"
        :disabled="true"
        name="selection1"
      />

      <sm-select
        label="Disabled option"
        placeholder="Please select your favourite ice cream"
        v-model="selection2"
        :options="options"
        name="selection2"
      />

      <sm-select
        label="Disabled option in a group"
        placeholder="Please select your favourite ice cream"
        v-model="selection3"
        :options="groupedOptions"
        :show-group-select="true"
        :multiple="true"
        name="selection3"
      />

      <sm-select
        label="Disabled option with group select"
        placeholder="Please select your favourite ice cream"
        v-model="selection4"
        :options="groupedOptions"
        :show-group-select="true"
        :group-select="groupSelect"
        :multiple="true"
        name="selection4"
      />

      <sm-select
        ref="select"
        label="Disabled option with description"
        placeholder="Please select your favourite ice cream"
        v-model="selection5"
        class="percy-mt-320"
        :options="optionsWithDescription"
        :multiple="true"
        name="selection5"
      />
    </div>
  `,
})

const disabledDescription = `
  Use <code>disabled</code> prop to enable/disable the select component and
  <code>$isDisabled</code> property for specific option/s.

  For instance:

  <pre>
    [{
      label: 'Watermelon',
      code: 'watermelon',
      $isDisabled: true,
    }]
  </pre>
`
Disabled.parameters = {
  docs: {
    description: {
      story: disabledDescription,
    },
  },
  percy: {
    // Needed for the Percy to capture dropdown content after some action
    // It is unfortunate we have to use the internal implementation of the
    // component but we are limited to CSS class selectors from the Percy API
    waitForSelector: '.multiselect__content',
  },
}

export const LabelAndDescriptionTruncation = () => ({
  components: { SmSelect },
  setup: () => {
    const select = ref()
    const selection1 = ref('option-2')
    const selection2 = ref(['option-2'])

    const options = ref([
      {
        label: 'Long label without truncation will wrap into multiple lines by default',
        code: 'option-1',
        description:
          'Long description without truncation will wrap into multiple lines by default. Resize viewport to see it in action.',
      },
      {
        label: 'Long label with truncation will be limited to a single line',
        code: 'option-2',
        description:
          'Long description with truncation will be limited to a single line. Resize viewport to see it in action.',
        truncateDescription: true,
        truncateLabel: true,
      },
      {
        label: 'Long label with truncation will be limited to a single line',
        code: 'option-3',
        description:
          'Long description with truncation will be limited to a single line. Resize viewport to see it in action.',
        truncateDescription: true,
        truncateLabel: true,
      },
    ])

    onMounted(() => {
      // Open the dropdown when running in Percy
      // This is manually done here because we don't have a prop or a method
      // that we can just set to true to display the hidden content
      if (isPercyContext() && select.value?.multiselect) {
        // https://vue-multiselect.js.org/#sub-programmatic-control
        select.value.multiselect.activate()
      }
    })

    return {
      options,
      select,
      selection1,
      selection2,
    }
  },
  template: `
    <div>
      <sm-select
        label="Standard and single selection"
        placeholder="Please select an option"
        v-model="selection1"
        :options="options"
        name="selection1"
      />
      <sm-select
        ref="select"
        label="Standard and multi-select"
        placeholder="Please select an option"
        v-model="selection2"
        :options="options"
        :multiple="true"
        name="selection2"
      />
    </div>
  `,
})

LabelAndDescriptionTruncation.storyName = 'Label and description Truncation'

const labelAndDescriptionTruncationDescription = `
  Use <code>truncateLabel</code> or <code>truncateDescription</code>
  property on the option object to truncate either the label or description.

  This will limit the text to a single line.

  For instance:
  <pre>
    [{
      label: 'Really long label goes here',
      description: 'Really long description goes here',
      code: 'some-identifier',
      truncateLabel: true, // Set label's truncation (default: false)
      truncateDescription: true, // Set description's truncation (default: false)
    }]
  </pre>
`
LabelAndDescriptionTruncation.parameters = {
  docs: {
    description: {
      story: labelAndDescriptionTruncationDescription,
    },
  },
  percy: {
    // Needed for the Percy to capture dropdown content after some action
    // It is unfortunate we have to use the internal implementation of the
    // component but we are limited to CSS class selectors from the Percy API
    waitForSelector: '.multiselect__content',
  },
}

export const RemoteLoadAndSearch = () => ({
  components: { SmSelect },
  setup: () => {
    interface FakeData {
      code: number
      label: string
      groupId?: number // for generating grouped options
    }

    interface fakeAPIResponse {
      data: FakeData[]
      totalItems: number // to check if there are more items available
    }

    // Limit API results by
    const PAGER_COUNT = 50
    const TOTAL_ITEMS = 1000

    // Fake server data
    const FULL_LIST: FakeData[] = Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
      code: i + 1,
      label: `Selection ${i + 1}`,
    }))

    // Fake server data with group id
    const FULL_LIST_GROUPED: FakeData[] = Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
      code: i + 1,
      label: `Selection ${i + 1}`,
      groupId: Math.floor(i / 30) + 1, // Split options into groups of 30 items
    }))

    // v-model
    const groupedSelection = ref([{ code: 777, label: 'Selection 777' }])
    const standardSelection = ref()

    // Dynamic options
    const standardOptions = ref([])
    const groupedOptions = ref([])

    // sm-select's loading state
    const groupedLoading = ref(false)
    const standardLoading = ref(false)

    // Search string for the fake API
    let standardQuery = ''
    let groupedQuery = ''

    // Pager for the fake API
    let standardPager = 0
    let groupedPager = 0

    // Check if all available data has been loaded or not
    let standardHasMoreItems = true
    let groupedHasMoreItems = true

    // Debounce timer for the sample search handlers
    let standardTimer: ReturnType<typeof setTimeout>
    let groupedTimer: ReturnType<typeof setTimeout>

    /**
     * Fake asynchronous API query that returns filtered fake data
     */
    const fakeRemoteQuery = (list: FakeData[], query = '', start = 0, limit = PAGER_COUNT) => {
      // eslint-disable-next-line no-console
      console.log(`Fake remote query: "${query}" from ${start + 1} to ${start + limit}`)

      return new Promise((resolve) => {
        setTimeout(() => {
          const results = list.filter(
            item => item.label.toLowerCase().includes(query.toLowerCase()),
          )
          resolve({
            data: results.slice(start, start + limit),
            totalItems: results.length,
          })
        }, 700) // Fake delay to check loading states
      })
    }

    /**
     * Generate grouped options from the fake data
     */
    const groupOptions = (data: FakeData[]) => {
      return data.reduce((acc, item) => {
        const groupTitle = `Group ${item.groupId}`
        const groupIndex = acc.map(g => g.title).indexOf(groupTitle)
        const { groupId: _groupId, ...option } = item

        if (groupIndex >= 0) {
          acc[groupIndex].libs.push(option)
        } else {
          acc.push({
            title: groupTitle,
            libs: [option],
          })
        }

        return acc
      }, [])
    }

    /**
     * Sample implementation of remote load
     */
    const groupedLoadMore = () => {
      // eslint-disable-next-line no-console
      console.log('emitted @list-scroll-end')

      if (!groupedHasMoreItems) {
        return
      }

      groupedLoading.value = true
      groupedPager += PAGER_COUNT

      fakeRemoteQuery(FULL_LIST_GROUPED, groupedQuery, groupedPager).then((result: fakeAPIResponse) => {
        const newOptions = groupOptions(result.data)

        // Merge groups
        groupedOptions.value = groupedOptions.value.concat(newOptions).reduce((acc, item) => {
          const groupIndex = acc.map(g => g.title).indexOf(item.title)

          if (groupIndex >= 0) {
            acc[groupIndex].libs = acc[groupIndex].libs.concat(item.libs)
          } else {
            acc.push(item)
          }

          return acc
        }, [])

        groupedLoading.value = false
        groupedHasMoreItems = groupedOptions.value.length < result.totalItems
      })
    }

    /**
     * Sample implementation of remote load
     */
    const standardLoadMore = () => {
      // eslint-disable-next-line no-console
      console.log('emitted @list-scroll-end')

      if (!standardHasMoreItems) {
        return
      }

      standardLoading.value = true
      standardPager += PAGER_COUNT

      fakeRemoteQuery(FULL_LIST, standardQuery, standardPager).then((result: fakeAPIResponse) => {
        standardOptions.value = standardOptions.value.concat(result.data)
        standardLoading.value = false
        standardHasMoreItems = standardOptions.value.length < result.totalItems
      })
    }

    /**
     * Sample implementation of remote search
     */
    const groupedRemoteSearch = (query: string) => {
      // eslint-disable-next-line no-console
      console.log('emitted @search-change')

      // Debounce the action to limit the requests
      clearTimeout(groupedTimer)

      groupedTimer = setTimeout(() => {
        groupedQuery = query
        groupedPager = 0
        groupedLoading.value = true

        fakeRemoteQuery(FULL_LIST_GROUPED, groupedQuery, groupedPager).then((result: fakeAPIResponse) => {
          groupedOptions.value = groupOptions(result.data)
          groupedLoading.value = false
          groupedHasMoreItems = result.data.length < result.totalItems
        })
      }, 250)
    }

    /**
     * Sample implementation of remote search
     */
    const standardRemoteSearch = (query: string) => {
      // eslint-disable-next-line no-console
      console.log('emitted @search-change')

      // Debounce the action to limit the requests
      clearTimeout(standardTimer)

      standardTimer = setTimeout(() => {
        standardQuery = query
        standardPager = 0
        standardLoading.value = true

        fakeRemoteQuery(FULL_LIST, standardQuery, standardPager).then((result: fakeAPIResponse) => {
          standardOptions.value = result.data
          standardLoading.value = false
          standardHasMoreItems = result.data.length < result.totalItems
        })
      }, 250)
    }
    onMounted(() => {
      // Initialize standard select example
      fakeRemoteQuery(FULL_LIST, standardQuery, standardPager).then((result: fakeAPIResponse) => {
        standardOptions.value = result.data
        standardHasMoreItems = result.data.length < result.totalItems
      })

      // Initialize grouped select example
      fakeRemoteQuery(FULL_LIST_GROUPED, groupedQuery, groupedPager).then((result: fakeAPIResponse) => {
        groupedOptions.value = groupOptions(result.data)
        groupedHasMoreItems = result.data.length < result.totalItems
      })
    })

    return {
      groupedLoading,
      groupedOptions,
      groupedSelection,
      standardLoading,
      standardOptions,
      standardSelection,
      groupedLoadMore,
      groupedRemoteSearch,
      standardLoadMore,
      standardRemoteSearch,
    }
  },
  template: `
    <div>
      <div style="width: 100%; max-width: 384px">
        <sm-select
          label="Standard select"
          placeholder="Please select an option"
          v-model="standardSelection"
          :remote="true"
          :loading="standardLoading"
          :options="standardOptions"
          :internal-search="false"
          :clear-on-select="false"
          @list-scroll-end="standardLoadMore"
          @search-change="standardRemoteSearch"
          name="standardSelection"
        />
      </div>

      <code class="block mb-32">
        Selected values: {{ standardSelection }}
      </code>

      <div style="width: 100%; max-width: 384px">
        <sm-select
          label="Grouped multi-select"
          placeholder="Please select an option"
          v-model="groupedSelection"
          :remote="true"
          :loading="groupedLoading"
          :multiple="true"
          :options="groupedOptions"
          :internal-search="false"
          :clear-on-select="false"
          :show-group-select="true"
          @list-scroll-end="groupedLoadMore"
          @search-change="groupedRemoteSearch"
          name="groupedSelection"
        />
      </div>

      <code class="block mb-32">
        Selected values: {{ groupedSelection }}
      </code>
    </div>
  `,
})

RemoteLoadAndSearch.storyName = 'Remote load and search'

const remoteLoadAndSearchDescription = `
  The select component's <code>options</code> prop can be updated on the fly to achieve remote load and search.

  To do that, the following events are available:

  - <code>@search-change</code> - emitted when search query changes. It receives the query string as the first param
  which can be used to make an asynchronous API call in the consumer's event handler

  - <code>@list-scroll-end</code> - emitted when the options dropdown has been scrolled and reached the bottom of the list.
  This can be used to make another API call and load another set of data.

  And the following props:

  - <code>remote</code> - makes the v-model save the option's object rather than just the code.
  Since the option may not be loaded in the dropdown, the selected options require more details to set up the component.

  - <code>internal-search</code> - disables the multiselect's internal search.
  The <code>options</code> prop is manually updated when doing the remote search so this can be turned off

  - <code>loading</code> - adds loading spinner on the select to provide visual feedback when doing asynchronous API calls

  - <code>clear-on-select</code> - optionally disable this feature if clearing the search query on select causes unnecessary API calls,
  or to simply improve the user experience

  Please see setup snippet for this example:

  <pre>

  // Limit API results by
  const PAGER_COUNT = 50
  const TOTAL_ITEMS = 1000

  // Fake server data
  const FULL_LIST = Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
    code: i + 1,
    label: Selection ...,
  }))

  const fakeRemoteQuery = (list, query = '', start = 0, limit = PAGER_COUNT) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = list
          .filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1)

        resolve({
          data: results.slice(start, start + limit),
          totalItems: results.length,
        })

      }, 700)
    })
  }

  const standardLoadMore = () => {
    if (!standardHasMoreItems) {
      return
    }

    standardLoading.value = true
    standardPager += PAGER_COUNT

    fakeRemoteQuery(FULL_LIST, standardQuery, standardPager)
      .then((result) => {
        standardOptions.value = standardOptions.value.concat(result.data)
        standardLoading.value = false
        standardHasMoreItems = standardOptions.value.length < result.totalItems
      })
  }

  const standardRemoteSearch = (query: string) => {
    // Debounce the action to limit the requests
    clearTimeout(standardTimer)

    standardTimer = setTimeout(() => {
      standardQuery = query
      standardPager = 0
      standardLoading.value = true

      fakeRemoteQuery(FULL_LIST, standardQuery, standardPager)
        .then((result) => {
          standardOptions.value = result.data
          standardLoading.value = false
          standardHasMoreItems = result.data.length < result.totalItems
        })
    }, 250)
  }

  onMounted(() => {
    // Initialize standard select example
    fakeRemoteQuery(FULL_LIST, standardQuery, standardPager)
      .then((result) => {
        standardOptions.value = result.data
        standardHasMoreItems = result.data.length < result.totalItems
      })
  })

  </pre>
`
RemoteLoadAndSearch.parameters = {
  docs: {
    description: {
      story: remoteLoadAndSearchDescription,
    },
  },
}

export const NotAllowEmptyOption = () => ({
  components: { SmSelect },
  setup: () => {
    const selection = ref('')

    const options = ref([
      { label: 'Strawberry', code: 'strawberry' },
      { label: 'Grapes', code: 'grapes' },
      { label: 'Watermelon', code: 'watermelon' },
      { label: 'Apple', code: 'apple' },
      { label: 'Kiwi', code: 'kiwi' },
      { label: 'Blueberry', code: 'blueberry' },
      { label: 'Lemon', code: 'lemon' },
      { label: 'Tomato', code: 'tomato' },
    ])

    return { selection, options }
  },
  template: `
    <sm-select
      label="Favourite icecream"
      v-model="selection"
      :options="options"
      :filterable="false"
      placeholder="Please select an option"
      :allow-empty="false"
      name="selection"
    />
  `,
})

NotAllowEmptyOption.storyName = 'Not allow empty option'

const notAllowEmptyOptionDescription = `
  Use props <code>allow-empty</code> to control the selected value.

  Set <code>allow-empty</code> props to <code>false</code> will not allow value to be deselected.
`
NotAllowEmptyOption.parameters = {
  docs: {
    description: {
      story: notAllowEmptyOptionDescription,
    },
  },
}

export const StylingHooks = () => ({
  components: { SmSelect },
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

      <p>Below is an example of the SUI select and the brand select using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 308px; height: auto; min-width: 0"
          alt="Select default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 308px; height: auto; min-width: 0"
          alt="Select themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the select customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

      <p>For the <span style="font-weight: 600;">shared label and error field variables</span>, please refer to the table in <a href="/?path=/story/components-form-input--styling-hooks">input styling hooks</a></p>

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
            <sm-table-th colspan="3">Input</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              border-radius
              <br/>
              border-width
              <br/>
              color-background
              <br/>
              color-border
              <br/>
              color-icon
              <br/>
              color-text
              <br/>
              padding-y
              <br/>
              padding-x
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-select-border-radius
                --sm-c-select-border-width
                --sm-c-select-color-background
                --sm-c-select-color-border
                --sm-c-select-color-icon
                --sm-c-select-color-text
                --sm-c-select-padding-y
                --sm-c-select-padding-x

                --sm-c-select-color-background-disabled
                --sm-c-select-color-border-disabled
                --sm-c-select-color-icon-disabled
                --sm-c-select-color-text-disabled

                --sm-c-select-color-border-focus
                --sm-c-select-box-shadow-focus

                --sm-c-select-color-border-invalid
                --sm-c-select-box-shadow-focus-invalid
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Prefix/Suffix slots</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-border
              <br/>
              color-text
              <br/>
              border-width
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-select-prefix-slot-color-background
                --sm-c-select-prefix-slot-color-border
                --sm-c-select-prefix-slot-color-text
                --sm-c-select-prefix-slot-border-width

                --sm-c-select-suffix-slot-color-background
                --sm-c-select-suffix-slot-color-border
                --sm-c-select-suffix-slot-color-text
                --sm-c-select-suffix-slot-border-width
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Prefix/Suffix content</sm-table-td>
            <sm-table-td>
              padding-y
              <br/>
              padding-x
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-select-prefix-content-padding-y
                --sm-c-select-prefix-content-padding-x

                --sm-c-select-suffix-content-padding-y
                --sm-c-select-suffix-content-padding-x
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Tags <span class="inline-block text-grey-neu-dark text-section-header">(Multi-select variant)</span></sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>
              Common
            </sm-table-td>
            <sm-table-td>
              border-radius
              <br/>
              color-background
              <br/>
              color-text
              <br/>
              font-size
              <br/>
              font-weight
              <br/>
              letter-spacing
              <br/>
              line-height
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-select-tag-border-radius
                --sm-c-select-tag-color-background
                --sm-c-select-tag-color-text
                --sm-c-select-tag-font-size
                --sm-c-select-tag-font-weight
                --sm-c-select-tag-letter-spacing
                --sm-c-select-tag-line-height
                --sm-c-select-tag-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Close button
            </sm-table-td>
            <sm-table-td>
              margin-left
              <br/>
              padding
              <br/>
              width
              <br/>
              height
              <br/>
              icon-size
              <br/>
              color-icon
              <br/>
              color-background
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-select-tag-close-margin-left
                --sm-c-select-tag-close-padding
                --sm-c-select-tag-close-width
                --sm-c-select-tag-close-height
                --sm-c-select-tag-close-icon-size
                --sm-c-select-tag-close-color-icon
                --sm-c-select-tag-close-color-background-hover
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Collapsed tags counter
            </sm-table-td>
            <sm-table-td>
              padding
              <br/>
              line-height
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-select-collapsed-tag-close-padding
                --sm-c-select-collapsed-tag-line-height
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Dropdown</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>
              Wrapper
            </sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-border
              <br/>
              border-radius
              <br/>
              border-width
              <br/>
              box-shadow
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-select-dropdown-color-background
                --sm-c-select-dropdown-color-border
                --sm-c-select-dropdown-border-radius
                --sm-c-select-dropdown-border-width
                --sm-c-select-dropdown-box-shadow
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Group title <span class="block text-grey-neu-dark text-section-header">(Grouped options variant)</span>
            </sm-table-td>
            <sm-table-td>
              color-border
              <br/>
              color-text
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-select-dropdown-group-color-border
                --sm-c-select-dropdown-group-title-color-text
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Option
            </sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-text
              <br/>
              color-border
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-select-dropdown-option-color-text
                --sm-c-select-dropdown-option-description-color-text

                --sm-c-select-dropdown-option-color-background-hover

                --sm-c-select-dropdown-option-color-background-selected
                --sm-c-select-dropdown-option-color-border-selected

                --sm-c-select-dropdown-option-color-background-disabled
                --sm-c-select-dropdown-option-color-text-disabled
                --sm-c-select-dropdown-option-description-color-text-disabled
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
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-select-dropdown-option-checkbox-color-border
                --sm-c-select-dropdown-option-checkbox-color-background
                --sm-c-select-dropdown-option-checkbox-color-foreground
                --sm-c-select-dropdown-option-checkbox-border-width
                --sm-c-select-dropdown-option-checkbox-padding

                --sm-c-select-dropdown-option-checkbox-color-border-checked
                --sm-c-select-dropdown-option-checkbox-color-background-checked
                --sm-c-select-dropdown-option-checkbox-color-foreground-checked

                --sm-c-select-dropdown-option-checkbox-color-border-hover
                --sm-c-select-dropdown-option-checkbox-color-background-hover
                --sm-c-select-dropdown-option-checkbox-color-foreground-hover

                --sm-c-select-dropdown-option-checkbox-color-border-checked-hover
                --sm-c-select-dropdown-option-checkbox-color-background-checked-hover
                --sm-c-select-dropdown-option-checkbox-color-foreground-checked-hover

                --sm-c-select-dropdown-option-checkbox-color-border-disabled
                --sm-c-select-dropdown-option-checkbox-color-background-disabled
                --sm-c-select-dropdown-option-checkbox-color-foreground-disabled
                --sm-c-select-dropdown-option-checkbox-border-width-disabled
                --sm-c-select-dropdown-option-checkbox-padding-disabled

                --sm-c-select-dropdown-option-checkbox-color-border-checked-disabled
                --sm-c-select-dropdown-option-checkbox-color-background-checked-disabled
                --sm-c-select-dropdown-option-checkbox-color-foreground-checked-disabled
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
