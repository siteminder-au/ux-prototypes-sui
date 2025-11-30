import vueRouter from 'storybook-vue3-router'
import { ref, reactive } from 'vue'
import { SmDropdown } from '../../sm-dropdown'
import { SmVerticalNav, SmVerticalNavItem } from '../../sm-vertical-nav'
import defaultExample from './images/expandable-card-default.png'
import SmExpandableCard from '../sm-expandable-card.vue'
import SmExpandableCardBody from '../sm-expandable-card-body.vue'
import themedExample from './images/expandable-card-themed.png'

const EmptyComponent = () => ({
  template: '<div>Home</div>',
})
EmptyComponent.displayName = 'EmptyComponent'

export default {
  title: 'Components/Expandable card',
  decorators: [
    // See: https://corechasm.com/addons/storybook-vue3-router
    // Match all routes so we can test the active state of the nav items
    vueRouter([{
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: EmptyComponent,
    }]),
  ],
  component: SmExpandableCard,
  subcomponents: {
    'sm-expandable-card-body': SmExpandableCardBody,
  },
  parameters: {
    docs: {
      description: {
        // Uses `component` here since it's the primary story
        component: 'An <code>sm-expandable-card</code> component is designed to support expandable/Collapsible cards layout with custom header, body and add a new card button at footer. <br/> Use the <code>header</code> slot to provide custom static header. <br/> Use the default slot to define custom content of the card. <br/> Use the <code>footer</code> slot to provide a custom button or other clickable element to add expandable card <code>sm-expandable-card-body</code> using <code>body</code> slot. <br/> Use the <code>body</code> slot to provide custom expandable card body <code>sm-expandable-card-body</code>. <br/><br/> Please note that the <code>sm-expandable-card-body</code> component has overflow property that will display scrollbar if height exceeds then given max-height. <br/><br/> Use <code>contentClass</code> props to apply any custom class to the wrapper. <br/><br/> Add "sm-overflow-visible" class to <code>contentClass</code> props to set overflow "unset" on card expand if the child component has tendency to overflow <br/>For example Dropdown, Select, Popover, Tooltip',
      },
    },
  },
}

export const Standard = () => ({
  components: {
    SmExpandableCard,
    SmExpandableCardBody,
    SmDropdown,
    SmVerticalNav,
    SmVerticalNavItem,
  },
  setup: () => {
    const form = reactive({
      to: 'joe.blob@somewhere.com',
      subject: null,
      message: null,
      signature: null,
    })

    const form2 = reactive({
      signature: null,
    })

    const sending = ref(false)

    const send = () => {
      sending.value = true
      setTimeout(() => {
        sending.value = false
      }, 3000)
    }

    const reset = () => {
      form.to = ''
      form.subject = null
      form.message = null
      form.signature = null
    }

    const addCard = (list) => {
      // eslint-disable-next-line no-console
      console.log('add', list)
    }

    const deleteCard = (list) => {
      // eslint-disable-next-line no-console
      console.log('delete', list)
    }

    return {
      form,
      form2,
      sending,
      send,
      reset,
      addCard,
      deleteCard,
    }
  },
  template: `
    <div>
      <span class="sui-storybook-header">Standard</span>
      <sm-expandable-card @deleteCard="deleteCard" @addCard="addCard">
        <template v-slot:header>
          <sm-form-group legend="Fieldset Legend">

          <sm-input type="email" label="To" rules="required|email" v-model="form.to" name="to" />
          <sm-input type="text" label="Subject" rules="required" placeholder="No subject..." v-model="form.subject" name="subject" />

          </sm-form-group>
        </template>

        <template v-slot:footer>
          <sm-button type="text" prefix-icon="controls-add">Add seasonal override</sm-button>
        </template>

        <template v-slot:body>
          <sm-expandable-card-body contentClass="sm-overflow-visible">
            <template v-slot:header>
              Seasonal override (17 Jul 2020 - 25 Jul 2020)
            </template>
            <template v-slot:body>
              <sm-form-group legend="">
                <sm-radio-group label="Signature" v-model="form.signature" rules="required" name="signature">
                  <sm-radio name="signature" v-model="form.signature" label="Work" selected-value="work" :error-disabled="true"/>
                  <sm-radio name="signature" v-model="form.signature" label="Personal" selected-value="personal" :error-disabled="true"/>
                </sm-radio-group>
                <sm-dropdown type="primary" label="Dropdown">

                  <sm-vertical-nav>
                    <sm-vertical-nav-item label="General" to="/setup/general" />
                    <sm-vertical-nav-item label="Details" to="/setup/details" />
                    <sm-vertical-nav-item label="General" to="/setup/general" />
                    <sm-vertical-nav-item label="Details" to="/setup/details" />
                  </sm-vertical-nav>

                </sm-dropdown>
              </sm-form-group>
            </template>
          </sm-expandable-card-body>
        </template>
      </sm-expandable-card>

      <br/><br/>

      <span class="sui-storybook-header">Without fixed header</span>
      <sm-expandable-card>
        <template v-slot:body>
          <sm-expandable-card-body>
            <template v-slot:header>
              Seasonal override (17 Jul 2020 - 25 Jul 2020)
            </template>
            <template v-slot:body>
              <sm-form-group legend="" name="signature2">
                <sm-radio-group label="Signature" v-model="form2.signature" rules="required" name="signature2">
                  <sm-radio name="signature2" v-model="form2.signature" label="Work" selected-value="work" />
                  <sm-radio name="signature2" v-model="form2.signature" label="Personal" selected-value="personal" />
                </sm-radio-group>
              </sm-form-group>
            </template>
          </sm-expandable-card-body>
        </template>

        <template v-slot:footer>
          <sm-button type="text" prefix-icon="controls-add">Add seasonal override</sm-button>
        </template>
      </sm-expandable-card>
    </div>
  `,
})

export const ExpandableCardBody = () => ({
  components: { SmExpandableCard, SmExpandableCardBody },
  setup: () => {
    const isExpandable = ref(true)
    const isLevelOneExpanded = ref(true)
    const isLevelTwoExpanded = ref(true)

    const open = (label: string) => {
      // eslint-disable-next-line no-console
      console.log('open:', label)
    }

    const close = (label: string) => {
      // eslint-disable-next-line no-console
      console.log('close:', label)
    }

    return {
      isLevelOneExpanded,
      isLevelTwoExpanded,
      isExpandable,
      open,
      close,
    }
  },
  template: `
    <div>
      <span class="sui-storybook-header">Standard</span>
      <sm-expandable-card-body :expanded.sync="isExpandable" @open="open" @close="close" :show-outer-border="true">
        <template v-slot:header>
          Seasonal override (17 Jul 2020 - 25 Jul 2020)
        </template>
        <template v-slot:body>
          <div>Text in here</div>
          <div>Text in here</div>
          <div>Text in here</div>
        </template>
      </sm-expandable-card-body>

      <br/><br/>

      <span class="sui-storybook-header">Nested</span>
      <sm-expandable-card-body
        arrow-position="right"
        :expanded="isLevelOneExpanded"
        :show-outer-border="true"
        @open="open('level 1')"
        @close="close('level 1')"
      >
        <template v-slot:header>
          Level one card header
        </template>
        <template v-slot:body>
          <sm-expandable-card-body
            arrow-position="left"
            :expanded="isLevelTwoExpanded"
            :show-outer-border="true"
            @open="open('level 2')"
            @close="close('level 2')"
          >
            <template v-slot:header>
              Level two card header
            </template>
            <template v-slot:body>
              <div>Text in here</div>
              <div>Text in here</div>
              <div>Text in here</div>
            </template>
          </sm-expandable-card-body>
        </template>
      </sm-expandable-card-body>
    </div>
  `,
})

ExpandableCardBody.storyName = 'Expandable card body'

ExpandableCardBody.parameters = {
  docs: {
    description: {
      story: 'An <code>sm-expandable-card-body</code> component is designed to support expandable/Collapsible cards with custom header and body. <br/><br/> Use the <code>header</code> slot to provide a custom button or other clickable element to expandable/Collapsible the card. <br/><br/> Use the <code>body</code> slot to provide custom expandable card body',
    },
  },
}

export const ExpandableCardTypeTwo = () => ({
  components: { SmExpandableCard, SmExpandableCardBody },
  setup: () => {
    const isExpandable = ref(true)
    const isExpandable1 = ref(false)
    const isExpandable2 = ref(false)

    const isExpandable3 = ref(true)
    const isExpandable4 = ref(false)
    const isExpandable5 = ref(false)

    const collapseAll = () => {
      isExpandable3.value = false
      isExpandable4.value = false
      isExpandable5.value = false
    }

    const expandAll = () => {
      isExpandable3.value = true
      isExpandable4.value = true
      isExpandable5.value = true
    }

    return {
      isExpandable,
      isExpandable1,
      isExpandable2,
      isExpandable3,
      isExpandable4,
      isExpandable5,
      collapseAll,
      expandAll,
    }
  },
  template: `
    <div>
      <div>
        <span class="sui-storybook-header">Standard</span>
        <sm-expandable-card>
          <template v-slot:header>
            <div class="relative">
              <div>
                <span style="font-weight: 600; text-transform: uppercase; margin-right: 4px;">Channel status</span>
                <sm-icon class="text-grey-neu-dark" name="utility-information-alt" />
              </div>
              <sm-button type="text" suffix-icon="arrow-go-forward" style="position: absolute; top: -10px; right: 0">My channels</sm-button>
            </div>
          </template>

          <template v-slot:default>
            <sm-expandable-card-body :expanded.sync="isExpandable">
              <template v-slot:header>
                <span>Connected channels</span>
                <sm-badge light-theme-type="success" size="large" style="float:right">5</sm-badge>
              </template>
              <template v-slot:body>
                <!-- Sample implementation only -->
                <sm-html-truncator height="120px">
                  <div v-for="i in 5" :key="i" class="m-4 mb-16 pl-12" style="border-left: 2px solid #D11D1D">
                    <span style="font-weight: 600; display: block;">Title</span>
                    <p class="mb-0 text-grey-neu-dark">Content here</p>
                  </div>
                  <template v-slot:less>
                    <sm-button type="text" class="sm-html-truncator__button">Less channels</sm-button>
                  </template>
                  <template v-slot:more>
                    <sm-button type="text" class="sm-html-truncator__button">More channels</sm-button>
                  </template>
                </sm-html-truncator>
              </template>
            </sm-expandable-card-body>

            <sm-expandable-card-body :expanded.sync="isExpandable1" max-height="300px">
              <template v-slot:header>
                <span>Disabled channels</span>
                <sm-badge light-theme-type="success" disabled size="large" style="float:right">5</sm-badge>
              </template>
              <template v-slot:body>
                <!-- Sample implementation only -->
                <sm-html-truncator height="120px">
                  <div v-for="i in 5" :key="i" class="m-4 mb-16 pl-12" style="border-left: 2px solid #d57800">
                    <span style="font-weight: 600; display: block;">Title</span>
                    <p class="mb-0 text-grey-neu-dark">Content here</p>
                  </div>
                  <template v-slot:less>
                    <sm-button type="text" class="sm-html-truncator__button">Less channels</sm-button>
                  </template>
                  <template v-slot:more>
                    <sm-button type="text" class="sm-html-truncator__button">More channels</sm-button>
                  </template>
                </sm-html-truncator>
              </template>
            </sm-expandable-card-body>

            <sm-expandable-card-body :expanded.sync="isExpandable2" max-height="300px">
              <template v-slot:header>
                <span>Awaiting setup</span>
                <sm-badge light-theme-type="info" size="large" style="float:right">2</sm-badge>
              </template>
              <template v-slot:body>
                <!-- Sample implementation only -->
                <div v-for="i in 2" :key="i" class="m-4 mb-16 pl-12" style="border-left: 2px solid #d57800">
                  <span style="font-weight: 600; display: block;">Title</span>
                  <p class="mb-0 text-grey-neu-dark">Content here</p>
                </div>
              </template>
            </sm-expandable-card-body>
          </template>
        </sm-expandable-card>
      </div>

      <br/><br/>

      <div>
        <span class="sui-storybook-header">Custom collapsible</span>
        <div class="flex items-center justify-end mb-16">
          <sm-button @click="collapseAll" type="text">Collapse All</sm-button>
          <sm-button @click="expandAll" type="primary">Expand All</sm-button>
        </div>

        <sm-expandable-card>
          <template v-slot:header>
            <div class="relative">
              <div>
                <span style="font-weight: 600; text-transform: uppercase; margin-right: 4px;">Channel status</span>
                <sm-icon class="text-grey-neu-dark" name="utility-information-alt" />
              </div>
              <sm-button type="text" suffix-icon="arrow-go-forward" style="position: absolute; top: -10px; right: 0">My channels</sm-button>
            </div>
          </template>

          <template v-slot:default>
            <sm-expandable-card-body custom-collapsible :expanded="isExpandable3" @open="isExpandable3 = true, isExpandable4 = false, isExpandable5 = false" @close="isExpandable3 = true">
              <template v-slot:header>
                <span>Connected channels</span>
                <sm-badge light-theme-type="success" size="large" style="float:right">5</sm-badge>
              </template>
              <template v-slot:body>
                <!-- Sample implementation only -->
                <sm-html-truncator height="120px">
                  <div v-for="i in 5" :key="i" class="m-4 mb-16 pl-12" style="border-left: 2px solid #D11D1D">
                    <span style="font-weight: 600; display: block;">Title</span>
                    <p class="mb-0 text-grey-neu-dark">Content here</p>
                  </div>
                  <template v-slot:less>
                    <sm-button type="text" class="sm-html-truncator__button">Less channels</sm-button>
                  </template>
                  <template v-slot:more>
                    <sm-button type="text" class="sm-html-truncator__button">More channels</sm-button>
                  </template>
                </sm-html-truncator>
              </template>
            </sm-expandable-card-body>

            <sm-expandable-card-body custom-collapsible :expanded="isExpandable4" @open="isExpandable4 = true, isExpandable3 = false, isExpandable5 = false" @close="isExpandable4 = true" max-height="300px">
              <template v-slot:header>
                <span>Disabled channels</span>
                <sm-badge light-theme-type="success" disabled size="large" style="float:right">5</sm-badge>
              </template>
              <template v-slot:body>
                <!-- Sample implementation only -->
                <sm-html-truncator height="120px">
                  <div v-for="i in 5" :key="i" class="m-4 mb-16 pl-12" style="border-left: 2px solid #d57800">
                    <span style="font-weight: 600; display: block;">Title</span>
                    <p class="mb-0 text-grey-neu-dark">Content here</p>
                  </div>
                  <template v-slot:less>
                    <sm-button type="text" class="sm-html-truncator__button">Less channels</sm-button>
                  </template>
                  <template v-slot:more>
                    <sm-button type="text" class="sm-html-truncator__button">More channels</sm-button>
                  </template>
                </sm-html-truncator>
              </template>
            </sm-expandable-card-body>

            <sm-expandable-card-body custom-collapsible :expanded="isExpandable5" @open="isExpandable5 = true, isExpandable3 = false, isExpandable4 = false" @close="isExpandable5 = true" max-height="300px">
              <template v-slot:header>
                <span>Awaiting setup</span>
                <sm-badge light-theme-type="info" size="large" style="float:right">2</sm-badge>
              </template>
              <template v-slot:body>
                <!-- Sample implementation only -->
                <div v-for="i in 2" :key="i" class="m-4 mb-16 pl-12" style="border-left: 2px solid #d57800">
                  <span style="font-weight: 600; display: block;">Title</span>
                  <p class="mb-0 text-grey-neu-dark">Content here</p>
                </div>
              </template>
            </sm-expandable-card-body>
          </template>
        </sm-expandable-card>

      </div>
    </div>
  `,
})

ExpandableCardTypeTwo.storyName = 'Expandable card - type two'

ExpandableCardTypeTwo.parameters = {
  docs: {
    description: {
      story: 'An <code>sm-expandable-card</code> component is designed to support expandable/Collapsible cards layout. <br/><br/> Use the default slot to define custom content to the card. <br/><br/> Use <code>sm-expandable-card-body</code> component to support expandable/Collapsible cards with custom header and body. <br/><br/> By default, <code>sm-expandable-card-body</code> component always keep all sections open. To allow for one sections to be open at a time or add a custom behaviour, use the <code>customCollapsible</code> props set to true and use <code>open</code> and <code>close</code> emit events to sync the <code>expanded</code> props conditionally.',
    },
  },
}

export const ExpandableCardHelpCard = () => ({
  components: { SmExpandableCard, SmExpandableCardBody },
  setup: () => {
    const isExpandable = ref(true)
    const isExpandableTwo = ref(true)
    const open = () => {
      // eslint-disable-next-line no-console
      console.log('open')
    }
    const close = () => {
      // eslint-disable-next-line no-console
      console.log('close')
    }
    return {
      isExpandable,
      open,
      close,
      isExpandableTwo,
    }
  },
  template: `
    <div style="width:450px">

      <sm-expandable-card-body isHelpCard :expanded.sync="isExpandable" @open="open" @close="close" :show-outer-border="true" arrowPosition="right">
        <template v-slot:header>
          <sm-icon name="utility-information-alt" style="color:#006ADD"/><span style="padding-left:8px">Commission rates</span>
        </template>
        <template v-slot:body>
          <section style="color:#717171;margin-bottom:8px;font-size:13px">
            <div><span style="font-weight: 600;">Google Hotel Ads, Trivago, and TripAdvisor:</span> 12% on completed stays + GST </div>
            <div><span style="font-weight: 600;">GST Google All Options Booking Links:</span> 3% on completed stays + GST</div>
          </section>
            <div style="margin-left: -8px;"><sm-button type="text" suffix-icon="action-open-in-new">View Google Hotel Ads example</sm-button></div>
        </template>
      </sm-expandable-card-body>

      <div style="margin-top: 16px;">
        <sm-expandable-card-body isHelpCard :expanded.sync="isExpandableTwo" :show-outer-border="true" arrowPosition="right">
          <template v-slot:header>
            <sm-icon name="utility-information-alt" style="color:#006ADD"/><span style="padding-left:8px">Commission rates</span>
          </template>
          <template v-slot:body>
            <section style="color:#717171;font-size:13px">
              <div><span style="font-weight: 600;">Definition 1:</span> Copy here</div>
              <div><span style="font-weight: 600;">Definition 2:</span> Copy here</div>
            </section>
            <sm-divider min-width="100%" margin-top="16px" margin-bottom="16px"></sm-divider>
            <h6 style="color:#333">Header</h6>
            <section style="color:#717171;font-size:13px">
              <div><span style="font-weight: 600;">Definition 1:</span> Copy here</div>
              <div><span style="font-weight: 600;">Definition 2:</span> Copy here</div>
            </section>
            <sm-divider min-width="100%" margin-top="16px" margin-bottom="16px"></sm-divider>
            <h6 style="color:#333">Header</h6>
            <section style="color:#717171;font-size:13px">
              <div><span style="font-weight: 600;">Definition 1:</span> Copy here</div>
              <div><span style="font-weight: 600;">Definition 2:</span> Copy here</div>
            </section>
            <sm-divider min-width="100%" margin-top="16px" margin-bottom="16px"></sm-divider>
            <h6 style="color:#333">Header</h6>
            <section style="color:#717171;font-size:13px">
              <div><span style="font-weight: 600;">Definition 1:</span> Copy here</div>
              <div><span style="font-weight: 600;">Definition 2:</span> Copy here</div>
            </section>
            </template>
          </sm-expandable-card-body>
        </div>
    </div>
  `,
})

ExpandableCardHelpCard.storyName = 'Expandable card: Help Card'

ExpandableCardHelpCard.parameters = {
  docs: {
    description: {
      story: 'Use <code>isHelpCard</code> props to apply help card styling to the <code>sm-expandable-card-body</code> component. <br/><br/> Apply custom styling to <code>sm-expandable-card-body</code> component <code>body</code> slot, For the reference please find the below code example.',
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

      <p>Below is an example of the SUI expandable card and the brand expandable card using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 400px; height: auto; min-width: 0"
          alt="Expandable card default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 400px; height: auto; min-width: 0"
          alt="Expandable card themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the expandable card customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>
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
              border
              <br/>
              border-radius
              <br/>
              color-background
              <br/>
              color-text
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-expandable-card-border<br/>
                --sm-c-expandable-card-border-radius<br/>
                --sm-c-expandable-card-color-background<br/>
                --sm-c-expandable-card-color-text<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Header</sm-table-td>
            <sm-table-td>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-expandable-card-header-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Footer</sm-table-td>
            <sm-table-td>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-expandable-card-footer-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Delete button</sm-table-td>
            <sm-table-td>
              right
              <br/>
              top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-expandable-card-delete-right<br/>
                --sm-c-expandable-card-delete-top<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Expandable card body</sm-table-th>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Toggle icon</sm-table-td>
            <sm-table-td>
              margin-right
              <br/>
              color-icon
              <br/>
              right
              <br/>
              top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-expandable-card-body-toggle-icon-margin-right<br/>
                --sm-c-expandable-card-body-toggle-icon-color-icon<br/><br/>

                <em>// Right positioned</em><br/>
                --sm-c-expandable-card-body-toggle-icon-right-right<br/>
                --sm-c-expandable-card-body-toggle-icon-top-right<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Header button</sm-table-td>
            <sm-table-td>
              color-text
              <br/>
              font-size
              <br/>
              font-weight
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-expandable-card-body-header-color-text<br/>
                --sm-c-expandable-card-body-header-font-size<br/>
                --sm-c-expandable-card-body-header-font-weight<br/>
                --sm-c-expandable-card-body-header-padding<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Body</sm-table-td>
            <sm-table-td>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-expandable-card-body-body-padding-right<br/>
                --sm-c-expandable-card-body-body-padding-left<br/>

                --sm-c-expandable-card-body-body-padding-bottom-expanded<br/>
                --sm-c-expandable-card-body-body-padding-top-expanded<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Expandable card body - help card</sm-table-th>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Container</sm-table-td>
            <sm-table-td>
              border-left
              <br/>
              color-background
              <br/>
              color-text
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-expandable-card-body-help-card-border-left<br/>
                --sm-c-expandable-card-body-help-card-color-background<br/>
                --sm-c-expandable-card-body-help-card-color-text<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Toggle icon</sm-table-td>
            <sm-table-td>
              margin-right
              <br/>
              color-icon
              <br/>
              right
              <br/>
              top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-expandable-card-body-help-card-toggle-icon-margin-right<br/>
                --sm-c-expandable-card-body-help-card-toggle-icon-color-icon<br/><br/>

                <em>// Right positioned</em><br/>
                --sm-c-expandable-card-body-help-card-toggle-icon-right-right<br/>
                --sm-c-expandable-card-body-help-card-toggle-icon-top-right<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Header button</sm-table-td>
            <sm-table-td>
              color-text
              <br/>
              font-size
              <br/>
              font-weight
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-expandable-card-body-help-card-header-color-text<br/>
                --sm-c-expandable-card-body-help-card-header-font-size<br/>
                --sm-c-expandable-card-body-help-card-header-font-weight<br/>
                --sm-c-expandable-card-body-help-card-header-padding<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Body</sm-table-td>
            <sm-table-td>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-expandable-card-body-help-card-body-padding-left<br/>
                --sm-c-expandable-card-body-help-card-body-padding-right<br/><br/>

                --sm-c-expandable-card-body-help-card-body-padding-top-expanded<br/>
                --sm-c-expandable-card-body-help-card-body-padding-bottom-expanded<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
