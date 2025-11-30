import { ref } from 'vue'
import SmAccordion from '../sm-accordion.vue'
import SmAccordionGraphic from '../sm-accordion-graphic.vue'
import defaultExample from './images/accordion-default.png'
import themedExample from './images/accordion-themed.png'

export default {
  title: 'Components/Accordion',
  component: SmAccordion,
  subcomponents: {
    'sm-accordion-graphic': SmAccordionGraphic,
  },
  parameters: {
    docs: {
      description: {
        component: 'The <code>sm-accordion</code> component has overflow property that will display scrollbar if height exceeds then given max-height. <br/>Please use <code>contentClass</code> props to apply any custom class to the wrapper. <br/>Please note that, Use "sm-overflow-visible" class to <code>contentClass</code> props to set overflow "unset" on card expand if the child component has tendency to overflow. For example Dropdown, Select, Popover, Tooltip. <br/>Best practice: whenever there are multiple slots, use the full <code>template</code> based syntax for all slots including <code>default</code>',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Au1waCRAR4SpFvIgEMASgf/sui-documentation?node-id=12%3A150439&t=sGu82gtorMoaiAZm-0',
    },
  },
}

export const Standard = () => ({
  components: {
    SmAccordion,
  },
  setup: () => {
    const expanded = ref(false)
    const expandedTwo = ref(true)
    const expandedGraphic = ref(true)
    return {
      expanded,
      expandedTwo,
      expandedGraphic,
    }
  },
  template: `
  <div>
    <span class="sui-storybook-header">Standard</span>
    <sm-accordion :expanded="expanded" @expanded="expanded = true" @collapse="expanded = false">
      <template v-slot:header>
        <div>Header</div>
      </template>
      <sm-html-truncator>
        <div>Text in here</div>
        <div>Text in here</div>
        <div>Text in here</div>
        <div>Text in here</div>
        <div>Text in here</div>
        <div>Text in here</div>
        <div>Text in here</div>
        <div>Text in here</div>
        <div>Text in here</div>
        <div>Text in here</div>
        <template v-slot:less>
          <sm-button type="text" class="sm-html-truncator__button" suffix-icon="arrow-up">Read less</sm-button>
        </template>
        <template v-slot:more>
          <sm-button type="text" class="sm-html-truncator__button" suffix-icon="arrow">Read more</sm-button>
        </template>
      </sm-html-truncator>
    </sm-accordion>
    <sm-accordion :expanded="expandedTwo" @expanded="expandedTwo = true" @collapse="expandedTwo = false">
      <template v-slot:header>
        <div>Header</div>
      </template>
      <div>Text in here</div>
    </sm-accordion>

    <br/><br/>

    <span class="sui-storybook-header">With Graphic</span>
    <sm-accordion :expanded="expandedGraphic" @expanded="expandedGraphic = true" @collapse="expandedGraphic = false" >
      <template v-slot:header>
        <sm-accordion-graphic
          src="https://pix10.agoda.net/hotelImages/104/104972/104972_16072716330044991252.jpg?s=1024x768"
          alt="A picture of a hotel"
          style="height: 150px; width: 248px; right: 0"
        />
      </template>
      <template v-slot:default>
        <div>Text in here</div>
      </template>
    </sm-accordion>
  </div>
  `,
})

export const Nested = () => ({
  components: { SmAccordion },
  setup: () => {
    const expandedL2 = ref(true)
    const expandedChildL2 = ref(true)
    const expandedChildTwoL2 = ref(false)

    const expandedL3 = ref(true)
    const expandedChildL3 = ref(true)
    const expandedSubChildL3 = ref(true)

    return {
      expandedL2,
      expandedChildL2,
      expandedChildTwoL2,
      expandedL3,
      expandedChildL3,
      expandedSubChildL3,
    }
  },
  template: `
    <div class="grid gap-32 grid-cols-1 tablet:grid-cols-2">
      <div>
        <span class="sui-storybook-header">Level 2</span>
        <sm-accordion :expanded="expandedL2" @expanded="expandedL2 = true" @collapse="expandedL2 = false">
          <template v-slot:header>
            <div>Header</div>
          </template>
          <div>Text in here</div>
          <sm-accordion :expanded="expandedChildL2" @expanded="expandedChildL2 = true" @collapse="expandedChildL2 = false">
            <template v-slot:header>
              <div>Header</div>
            </template>
            <div>Text in here</div>
            <div>Text in here</div>
          </sm-accordion>
          <sm-accordion :expanded="expandedChildTwoL2" @expanded="expandedChildTwoL2 = true" @collapse="expandedChildTwoL2 = false">
            <template v-slot:header>
              <div>Header</div>
            </template>
            <div>Text in here</div>
            <div>Text in here</div>
          </sm-accordion>
        </sm-accordion>
      </div>

      <div>
        <span class="sui-storybook-header">Level 3</span>
        <sm-accordion :expanded="expandedL3" @expanded="expandedL3 = true" @collapse="expandedL3 = false">
        <template v-slot:header>
          <div>Header</div>
        </template>
        <div>Text in here</div>
        <sm-accordion :expanded="expandedChildL3" @expanded="expandedChildL3 = true" @collapse="expandedChildL3 = false">
          <template v-slot:header>
            <div>Header</div>
          </template>
          <div>Text in here</div>
          <sm-accordion :expanded="expandedSubChildL3" @expanded="expandedSubChildL3 = true" @collapse="expandedSubChildL3 = false">
            <template v-slot:header>
              <div>Header</div>
            </template>
            <div>Text in here</div>
            <div>Text in here</div>
          </sm-accordion>
        </sm-accordion>
      </sm-accordion>
      </div>
    </div>
  `,
})

Nested.storyName = 'Nested'

export const StaticHeader = () => ({
  components: { SmAccordion, SmAccordionGraphic },
  setup: () => {
    const expanded = ref(true)
    const expandedChild = ref(true)
    const expandedSubChild = ref(false)

    return {
      expanded,
      expandedChild,
      expandedSubChild,
    }
  },
  template: `
    <div>
      <sm-accordion :expanded="expanded" @expanded="expanded = true" @collapse="expanded = false">
        <template v-slot:fixed>
          <div><sm-icon name="action-stop-sell-availability"/><h5 style="padding-left:8px; display:inline">Static header</h5></div>
        </template>
        <template v-slot:header>
          <div>Header</div>
        </template>
        <div>Text in here</div>
        <sm-accordion :expanded="expandedChild" @expanded="expandedChild = true" @collapse="expandedChild = false">
          <template v-slot:fixed>
            <div>Static header</div>
          </template>
          <template v-slot:header>
            <div>Header</div>
          </template>
          <div>Text in here</div>
          <sm-accordion :expanded="expandedSubChild" @expanded="expandedSubChild = true" @collapse="expandedSubChild = false">
            <template v-slot:fixed>
              <div>Static header</div>
            </template>
            <template v-slot:header>
              <div>Header</div>
            </template>
            <div>Text in here</div>
            <div>Text in here</div>
          </sm-accordion>
        </sm-accordion>
      </sm-accordion>
    </div>
      `,
})

StaticHeader.storyName = 'Static header'
StaticHeader.parameters = {
  docs: {
    description: {
      story: 'Use the <code>fixed</code> slot to display static header on top of accordion card',
    },
  },
}

export const AccordionStacked = () => ({
  components: { SmAccordion, SmAccordionGraphic },
  setup: () => {
    const expanded = ref(false)
    const expandedTwo = ref(false)
    const expandedThree = ref(false)

    return {
      expanded,
      expandedTwo,
      expandedThree,
    }
  },
  template: `
  <div>
    <sm-accordion :expanded="expanded" @expanded="expanded = true" @collapse="expanded = false" :stacked="true">
    <template v-slot:fixed>
      <div><sm-icon name="action-stop-sell-availability"/><h5 style="padding-left:8px; display:inline">Header</h5></div>
    </template>
      <template v-slot:header>
        <div>Header</div>
      </template>
      <div>Text in here</div>
      <div>Text in here</div>
    </sm-accordion>
    <sm-accordion :expanded="expandedTwo" @expanded="expandedTwo = true" @collapse="expandedTwo = false" :stacked="true">
      <template v-slot:header>
        <div>Header</div>
      </template>
      <div>Text in here</div>
    </sm-accordion>
    <sm-accordion :expanded="expandedThree" @expanded="expandedThree = true" @collapse="expandedThree = false" :stacked="true">
      <template v-slot:header>
        <div>Header</div>
      </template>
      <div>Text in here</div>
    </sm-accordion>
  </div>
      `,
})

AccordionStacked.storyName = 'Stacked'
AccordionStacked.parameters = {
  docs: {
    description: {
      story: 'Use the <code>stacked</code> props to display a list view of accordion components with no bottom space. <br/><br/>Note: This props should apply to the parent accordion component in case of nesting, for example, parent accordion component of level 2 and level 3 card types.',
    },
  },
}

export const CollapseContent = () => ({
  components: {
    SmAccordion,
    // SmDropdown,
    // SmVerticalNav,
    // SmVerticalNavItem,
  },
  setup: () => {
    const expanded = ref(true)
    const expandedTwo = ref(false)
    const expandedThree = ref(false)
    return {
      expanded,
      expandedTwo,
      expandedThree,
    }
  },
  template: `
  <div>
    <sm-accordion :expanded="expanded" @expanded="expanded = true, expandedTwo =  false, expandedThree =  false" @collapse="expanded = false" :stacked="true">
      <template v-slot:header>
        <div>Header</div>
      </template>
      <div>Text in here</div>
      <div>Text in here</div>
      <div>Text in here</div>
      <div>Text in here</div>
      <div>Text in here</div>
      <div>Text in here</div>
    </sm-accordion>
    <sm-accordion :expanded="expandedTwo" @expanded="expanded = false, expandedTwo =  true, expandedThree =  false" @collapse="expandedTwo = false" :stacked="true">
      <template v-slot:header>
        <div>Header</div>
      </template>
      <div>Text in here</div>
    </sm-accordion>
    <sm-accordion :expanded="expandedThree" @expanded="expanded = false, expandedTwo =  false, expandedThree =  true" @collapse="expandedThree = false" :stacked="true">
    <template v-slot:header>
      <div>Header</div>
    </template>
    <div>Text in here</div>
  </sm-accordion>
  </div>
  `,
})

CollapseContent.storyName = 'Collapse content'
CollapseContent.parameters = {
  docs: {
    description: {
      story: 'By default, accordions always keep all sections open. To allow for one sections to be open at a time or add a custom behavior, use <code>expanded</code> and <code>collapse</code> emit events to set the <code>expanded</code> props conditionally.',
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

      <p>Below is an example of the SUI accordion and the brand accordion using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 404px; height: auto; min-width: 0"
          alt="Accordion default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 404px; height: auto; min-width: 0"
          alt="Accordion themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the accordion customization variables, followed by <a href="/?path=/docs/guides-theming--styling-hooks#theme-categories">theme categories</a> and <a href="/?path=/docs/guides-theming--styling-hooks#naming-conventions">naming convention</a></p>
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
              border-top
              <br/>
              border-right
              <br/>
              border-bottom
              <br/>
              border-left
              <br/>
              border-radius
              <br/>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-accordion-border-top
                --sm-c-accordion-border-right
                --sm-c-accordion-border-bottom
                --sm-c-accordion-border-left
                --sm-c-accordion-border-radius
                --sm-c-accordion-color-background<br/>

                --sm-c-accordion-border-radius-inner
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Static header</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-accordion-static-header-color-background
                --sm-c-accordion-static-header-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Header content</sm-table-td>
            <sm-table-td>
              padding
              <br/>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-accordion-header-content-padding
                --sm-c-accordion-header-content-color-background
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Arrow
            </sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-icon
              <br/>
              border-right
              <br/>
              padding-top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-accordion-arrow-color-background
                --sm-c-accordion-arrow-color-icon
                --sm-c-accordion-arrow-border-right
                --sm-c-accordion-arrow-padding-top<br/>

                --sm-c-accordion-arrow-color-background-open<br/>

                --sm-c-accordion-arrow-color-background-hover<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Body
            </sm-table-td>
            <sm-table-td>
              border-top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-accordion-body-border-top
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
