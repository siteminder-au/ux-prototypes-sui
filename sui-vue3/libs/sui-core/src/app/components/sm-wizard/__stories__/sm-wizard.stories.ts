import { onBeforeUnmount, ref } from 'vue'
import SmExpandableCardBody from '../../sm-expandable-card/sm-expandable-card-body.vue'
import { SmTable, SmTableTbody, SmTableTd, SmTableTh, SmTableThead, SmTableTr } from '../../sm-table'
import defaultExample from './images/wizard-default.png'
import defaultTabletExample from './images/wizard-tablet-default.png'
import themedTabletExample from './images/wizard-tablet-themed.png'
import themedExample from './images/wizard-themed.png'
import SmWizardStep from '../sm-wizard-step.vue'
import SmWizard from '../sm-wizard.vue'

/**
 * NOTE: There's an issue when changing tabs from Canvas to Docs
 * where the wizard is visible and doesn't trigger the onBeforeUnmount
 * hook. This means the scroll lock is still active and the user won't be able
 * to scroll in the Docs tab.
 *
 * There is a workaround to hide the wizard manually before switching tabs in
 * each of the story. Alternatively, one can also refresh the page to reset the
 * scroll lock until we can figure out a better solution.
 *
 * This is common across components with dialogs and overlays,
 * e.g. sm-dialog, sm-wizard, sm-drawer, etc.
 *
 * In addition, there is a whitespace difference between Vue2 Storybook and Vue3 Storybook,
 * but is not present in Goldeneyes. Could be caused by https://github.com/storybookjs/storybook/issues/18288
 * and the `app.config.compilerOptions.whitespace = 'preserve'` in preview.cjs doesn't seem to fix it
 * https://siteminder-jira.atlassian.net/browse/SUI-2176
 */

const standardDescription = `
<em>Please refresh the page if you can't scroll on this page.</em>

Control the visibility of the wizard using the <code>v-model:visible</code> prop.

Add <code>tabindex="0"</code> to an appropriate landmark within the wizard step content
if there is no focusable element (e.g input fields, buttons, etc.) within it and if it is
scrollable to support keyboard navigation.

Additional reading https://accessibilityinsights.io/info-examples/web/scrollable-region-focusable/
`

const EmptyComponent = () => ({
  template: '<div>Home</div>',
})
EmptyComponent.displayName = 'EmptyComponent'

export default {
  title: 'Components/Wizard',
  component: SmWizard,
  subcomponents: {
    'sm-wizard-step': SmWizardStep,
  },
  parameters: {
    docs: {
      description: {
        component: standardDescription,
      },
      inlineStories: true,
    },
  },
}

export const Standard = (_args: unknown, { viewMode }: { viewMode: string }) => ({
  components: { SmWizard, SmWizardStep },
  setup: () => {
    const isStoryTab = viewMode === 'story'
    const activeStep = ref(null)
    const wizardVisible = ref(isStoryTab) // Don't show the wizard in Storybook Docs tab by default

    const change = (array: any, i: number) => {
      console.info('step-change', array, i)
    }

    return {
      wizardVisible,
      activeStep,
      change,
    }
  },
  template: `
    <div>
      <sm-button @click="wizardVisible = true" type="primary">Open wizard</sm-button>
      <sm-wizard @stepChange="(array, i) => change(array, i)" v-model:visible="wizardVisible" v-model:active-step="activeStep" title="Title here">
        <sm-wizard-step label="General" subtitle="Step one">
          Content for step #1 here...
        </sm-wizard-step>
        <sm-wizard-step label="Advanced" subtitle="Step two">
          Content for step #2 here...
        </sm-wizard-step>
        <sm-wizard-step label="Review" subtitle="Step three">
          Content for step #3 here...
        </sm-wizard-step>
      </sm-wizard>
    </div>
  `,
})

export const InterceptingStepChanges = (_args: unknown, { viewMode }: { viewMode: string }) => ({
  components: { SmWizard, SmWizardStep },
  setup: () => {
    const isStoryTab = viewMode === 'story'
    const wizardVisible = ref(isStoryTab) // Don't show the wizard in Storybook Docs tab by default

    const activeStep = ref(null)

    const blockBack = (to, from, next) => {
      if (to < from) {
        // eslint-disable-next-line no-alert
        window.alert('You cannot go back...')
      } else {
        next(to)
      }
    }

    onBeforeUnmount(() => {
      wizardVisible.value = false
    })

    return {
      wizardVisible,
      blockBack,
      activeStep,
    }
  },
  template: `
    <div>
      <sm-button @click="wizardVisible = true" type="primary">Open wizard</sm-button>
      <sm-wizard v-model:visible="wizardVisible" v-model:active-step="activeStep" :before-step-change="blockBack" title="Title here">
        <sm-wizard-step label="General" subtitle="Step one">
          Content for step #1 here...
        </sm-wizard-step>
        <sm-wizard-step label="Advanced" subtitle="Step two">
          Content for step #2 here...
        </sm-wizard-step>
        <sm-wizard-step label="Review" subtitle="Step three">
          Content for step #3 here...
        </sm-wizard-step>
      </sm-wizard>
    </div>
  `,
})

InterceptingStepChanges.storyName = 'Intercepting step changes'

const interceptingStepChangesDescription = `
Use the <code>:before-step-change</code> prop to intercept step changes.

The :before-step-change accepts a function which will be passed three arguments:

1. <code>to</code> The index of the next step
2. <code>from</code> The index of the current step
3. <code>next</code> A callback to be called with the next index
`

InterceptingStepChanges.parameters = {
  docs: {
    description: {
      story: interceptingStepChangesDescription,
    },
  },
}

export const DisableNavSteps = (_args: unknown, { viewMode }: { viewMode: string }) => ({
  components: { SmWizard, SmWizardStep },
  setup: () => {
    const isStoryTab = viewMode === 'story'
    const activeStep = ref(null)
    const wizardVisible = ref(isStoryTab) // Don't show the wizard in Storybook Docs tab by default

    const change = (array: any, i: number) => {
      console.info('step-change', array, i)
    }

    onBeforeUnmount(() => {
      wizardVisible.value = false
    })

    return {
      wizardVisible,
      activeStep,
      change,
    }
  },
  template: `
    <div>
      <sm-button @click="wizardVisible = true" type="primary">Open wizard</sm-button>
      <sm-wizard @stepChange="(array, i) => change(array, i)" v-model:visible="wizardVisible" v-model:active-step="activeStep" :disable-nav="true" title="Title here">
        <sm-wizard-step label="General" subtitle="Step one">
          Content for step #1 here...
        </sm-wizard-step>
        <sm-wizard-step label="Advanced" subtitle="Step two">
          Content for step #2 here...
        </sm-wizard-step>
        <sm-wizard-step label="Review" subtitle="Step three">
          Content for step #3 here...
        </sm-wizard-step>
      </sm-wizard>
    </div>
  `,
})

DisableNavSteps.storyName = 'Disable nav steps'
DisableNavSteps.parameters = {
  docs: {
    description: {
      story: 'Use the <code>disableNav</code> prop to disable all step buttons on the side.',
    },
  },
}

export const Overlay = (_args: unknown, { viewMode }: { viewMode: string }) => ({
  components: { SmWizard, SmWizardStep },
  setup: () => {
    const isStoryTab = viewMode === 'story'
    const isExpandable = ref(true)
    const activeStep = ref(null)
    const wizardVisible = ref(isStoryTab) // Don't show the wizard in Storybook Docs tab by default
    const showOverlay = ref(false)

    const addTax = ref(false)
    const search = ref()

    const change = (array: any, i: number) => {
      console.info('step-change', array, i)
    }

    const onBeforeStepChange = (to, from, next) => {
      if (!showOverlay.value) {
        next(to)
      }
    }

    const onBeforeClose = (close) => {
      showOverlay.value = false
      close()
    }

    onBeforeUnmount(() => {
      wizardVisible.value = false
    })

    return {
      activeStep,
      addTax,
      search,
      isExpandable,
      showOverlay,
      wizardVisible,
      change,
      onBeforeClose,
      onBeforeStepChange,
    }
  },
  template: `
    <div>
      <sm-button @click="wizardVisible = true" type="primary">Open wizard</sm-button>
      <sm-wizard
        @stepChange="(array, i) => change(array, i)"
        title="Title here"
        :close-button-attrs="{ id: 'wizard-close-button', 'data-testid': 'close' }"
        :next-button-attrs="{ id: 'wizard-next-button', 'data-testid': 'next' }"
        :back-button-attrs="{ id: 'wizard-back-button', 'data-testid': 'back' }"
        :confirm-button-attrs="{ id: 'wizard-confirm-button', 'data-testid': 'confirm' }"
        v-model:visible="wizardVisible"
        v-model:active-step="activeStep"
        :before-close="onBeforeClose"
        :before-step-change="onBeforeStepChange"
      >
        <sm-wizard-step
          label="Getting started"
          subtitle="Step one"
          :show-overlay="showOverlay"
          :stepper-button-attrs="{ id: 'step-1', 'data-testid': 'step-1' }"
        >
          <template v-slot:default>
            <div class="grid grid-cols-1 large-desktop:grid-cols-5 gap-48">
              <div class="col-span-1 large-desktop:col-span-3 text-grey-neu-black">
                <h3>Let’s set up metasearch listings for your property</h3>
                <p class="mb-48">Maximise reach and increase revenue by listing your property on popular metasearch sites like Google Hotel Ads, Trivago and TripAdvisor.</p>

                <h4 class="sm-h5">Property details</h4>
                <sm-input label="Property search" placeholder="Search for your property by name" suffix-icon="action-search" v-model="search" name="search-property"></sm-input>
                <span class="mr-8">Can’t find your property via the search bar?</span>
                <a href="#">Enter your property details manually</a>

                <sm-divider margin-bottom="32px" margin-top="32px" min-width="100%"></sm-divider>

                <h4 class="sm-h5">Tax settings</h4>
                <p class="mb-12">Configuring a tax for your booking engine will ensure that you are only charged a commission fee for reservations sourced through Demand Plus based on the net reservation value*.</p>
                <div class="flex flex-wrap items-center mb-24">
                  <span class="mr-24 pt-8">Do you want to add a tax for your direct booking reservations?</span>
                  <sm-radio-group button-alignment="horizontal" error-disabled name="addTax">
                    <sm-radio name="addTax" label="Yes" :selected-value="true" v-model="addTax"></sm-radio>
                    <sm-radio name="addTax" label="No" :selected-value="false" v-model="addTax"></sm-radio>
                  </sm-radio-group>
                </div>

                <sm-inline-card type="info" size="small" class="w-full">
                  <p class="m-0">
                    Adding a tax here will apply this tax against your property and will be applied to all your direct bookings.
                    Taxes can be updated by going to Payments > Taxes.
                  </p>
                </sm-inline-card>
              </div>
              <div class="col-span-1 large-desktop:col-span-2">
                <sm-expandable-card-body isHelpCard :expanded.sync="isExpandable" :show-outer-border="true" arrowPosition="right">
                  <template v-slot:header>
                    <sm-icon name="utility-information-alt" style="color:#006ADD"/><span style="padding-left:8px">Commission rates</span>
                  </template>
                  <template v-slot:body>
                    <section style="color:#717171;margin-bottom:8px;" class="sm-text--small">
                      <span style="display: block; font-weight: 600;">Google Hotel Ads, Trivago, and TripAdvisor:</span>
                      <span class="block mb-16">12% on completed stays + GST</span>
                      <span style="display: block; font-weight: 600;">GST Google All Options Booking Links:</span>
                      <span class="block">3% on completed stays + GST</span>
                    </section>
                    <div style="margin-left: -8px;">
                      <sm-button type="text" suffix-icon="action-open-in-new" @click="showOverlay = true">View Google Hotel Ads example</sm-button>
                    </div>
                    <sm-divider min-width="100%" margin-top="16px" margin-bottom="16px"></sm-divider>
                    <h5 class="sm-h6" style="color:#333">
                      <sm-icon name="utility-information-alt" style="color:#006ADD"/><span style="padding-left:8px">Billing Period</span>
                    </h5>
                    <p class="sm-text--small m-0">
                      Invoices are generated on the 20th of every month and will include all 'Completed' reservations.
                    </p>
                  </template>
                </sm-expandable-card-body>
              </div>
            </div>
          </template>

          <template v-slot:overlay>
            <sm-button
              class="-ml-12 -mt-12 mb-4"
              type="text"
              prefix-icon="arrow-left"
              @click="showOverlay = false"
            >
              Go back
            </sm-button>
            <h2 class="text-grey-neu-black mb-32">Compare the different commission rates</h2>
            <p>Overlay content for step #1</p>
            <div class="grid grid-cols-1 tablet:grid-cols-5 gap-40">
              <div class="col-span-1 tablet:col-span-3 h-320">
                <sm-loading-image style="width: 100%; height: 100%" />
              </div>
              <div class="col-span-1 tablet:col-span-2 h-320">
                <sm-loading-image style="width: 100%; height: 100%" />
              </div>
              <div class="col-span-1 tablet:col-span-3 h-320">
                <sm-loading-image style="width: 100%; height: 100%" />
              </div>
              <div class="col-span-1 tablet:col-span-2 h-320">
                <sm-loading-image style="width: 100%; height: 100%" />
              </div>
            </div>
          </template>
        </sm-wizard-step>

        <sm-wizard-step label="Contact details" subtitle="Step two" :show-overlay="showOverlay">
          <p class="mb-16">Content for step #2 here...</p>
          <sm-button class="-ml-8" type="text" @click="showOverlay = true" suffix-icon="action-open-in-new">Show overlay</sm-button>

          <template v-slot:overlay>
            <sm-button
              class="-ml-12 -mt-12 mb-4"
              type="text"
              prefix-icon="arrow-left"
              @click="showOverlay = false"
            >
              Go back
            </sm-button>
            <h2 class="text-grey-neu-black">Overlay</h2>
            <p>Overlay content for step #2</p>
          </template>
        </sm-wizard-step>

        <sm-wizard-step label="Review and activate" subtitle="Step three">
          Content for step #3 here...
        </sm-wizard-step>
      </sm-wizard>
    </div>
  `,
})

const overlayDescription = `
Use <code>overlay</code> slot within <code>sm-wizard-step</code> to display additional content related to the step.

The views can be switched using <code>show-overlay</code> prop in the wizard step.

By default, switching between views are animated but can be turned off using <code>animate-overlay</code> prop.

In addition, <code>before-step-change</code> and/or <code>before-close</code> can be used to control the overlay logic further.

For instance:

<pre>
/* Sample only - disallow navigating to other steps while in overlay */
const onBeforeStepChange = (to, from, next) => {
  if (!showOverlay.value) {
    next(to)
  }
}
</pre>

<pre>
/* Sample only - hide overlay when wizard is closed */
const onBeforeClose = (close) => {
  showOverlay.value = false
  close()
}
</pre>
`
Overlay.parameters = {
  parameters: {
    docs: {
      description: {
        story: overlayDescription,
      },
    },
    percy: {
      widths: [1025, 769, 360],
    },
  },
}

export const SampleHelpCard = (_args: unknown, { viewMode }: { viewMode: string }) => ({
  components: {
    SmWizard,
    SmWizardStep,
    SmTable,
    SmTableTh,
    SmTableTd,
    SmTableTr,
    SmTableTbody,
    SmTableThead,
    SmExpandableCardBody,
  },
  setup: () => {
    const isStoryTab = viewMode === 'story'
    const isExpandable = ref(true)
    const isExpandableTwo = ref(false)
    const activeStep = ref(null)
    const wizardVisible = ref(isStoryTab) // Don't show the wizard in Storybook Docs tab by default

    const change = (array: any, i: number) => {
      console.info('step-change', array, i)
    }

    onBeforeUnmount(() => {
      wizardVisible.value = false
    })

    return {
      wizardVisible,
      activeStep,
      change,
      isExpandable,
      isExpandableTwo,
    }
  },
  template: `
    <div>
      <sm-button @click="wizardVisible = true" type="primary">Open wizard</sm-button>
      <sm-wizard @stepChange="(array, i) => change(array, i)" v-model:visible="wizardVisible" v-model:active-step="activeStep" title="Title here">
        <sm-wizard-step label="Room rate" subtitle="Step one">

          <div class="grid grid-cols-2 gap-48">
            <div style="overflow:auto">
              <sm-table :fixed-header-left="true" tabindex="0">
                <sm-table-thead>
                  <sm-table-tr>
                    <sm-table-th width="158px"> Name </sm-table-th>
                    <sm-table-th> Date</sm-table-th>
                    <sm-table-th> City</sm-table-th>
                  </sm-table-tr>
                </sm-table-thead>
                <sm-table-tbody>
                  <sm-table-tr>
                    <sm-table-td>Nick</sm-table-td>
                    <sm-table-td>Apr 21 2020</sm-table-td>
                    <sm-table-td>Sydney</sm-table-td>
                  </sm-table-tr>
                  <sm-table-tr>
                    <sm-table-td>Andy</sm-table-td>
                    <sm-table-td>Jan 21 2020</sm-table-td>
                    <sm-table-td>Melbourne</sm-table-td>
                  </sm-table-tr>
                  <sm-table-tr>
                    <sm-table-td>Mike</sm-table-td>
                    <sm-table-td>June 21 2020</sm-table-td>
                    <sm-table-td>Brisbane</sm-table-td>
                  </sm-table-tr>
                  <sm-table-tr>
                    <sm-table-td>Jack</sm-table-td>
                    <sm-table-td>Jan 21 2020</sm-table-td>
                    <sm-table-td>Sydney</sm-table-td>
                  </sm-table-tr>
                  <sm-table-tr>
                    <sm-table-td>Jack</sm-table-td>
                    <sm-table-td>Jan 21 2020</sm-table-td>
                    <sm-table-td>Sydney</sm-table-td>
                  </sm-table-tr>
                    <sm-table-tr>
                    <sm-table-td>Jack</sm-table-td>
                    <sm-table-td>Jan 21 2020</sm-table-td>
                    <sm-table-td>Sydney</sm-table-td>
                  </sm-table-tr>
                </sm-table-tbody>
              </sm-table>
            </div>
            <div>
              <sm-expandable-card-body isHelpCard :expanded.sync="isExpandable" :show-outer-border="true" arrowPosition="right">
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
                  </template>
                </sm-expandable-card-body>
              </div>
            </div>
          </div>

        </sm-wizard-step>
        <sm-wizard-step label="Import room rates" subtitle="Step two">
          <div style="margin-bottom:24px">
            <sm-expandable-card-body isHelpCard :expanded.sync="isExpandable" :show-outer-border="true" arrowPosition="right">
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
          </div>
          <div style="overflow:auto">
            <sm-table :fixed-header-left="true" tabindex="0">
              <sm-table-thead>
                <sm-table-tr>
                  <sm-table-th width="158px"> Name </sm-table-th>
                  <sm-table-th> Date</sm-table-th>
                  <sm-table-th> City</sm-table-th>
                </sm-table-tr>
              </sm-table-thead>
              <sm-table-tbody>
                <sm-table-tr>
                  <sm-table-td>Nick</sm-table-td>
                  <sm-table-td>Apr 21 2020</sm-table-td>
                  <sm-table-td>Sydney</sm-table-td>
                </sm-table-tr>
                <sm-table-tr>
                  <sm-table-td>Andy</sm-table-td>
                  <sm-table-td>Jan 21 2020</sm-table-td>
                  <sm-table-td>Melbourne</sm-table-td>
                </sm-table-tr>
                <sm-table-tr>
                  <sm-table-td>Mike</sm-table-td>
                  <sm-table-td>June 21 2020</sm-table-td>
                  <sm-table-td>Brisbane</sm-table-td>
                </sm-table-tr>
                <sm-table-tr>
                  <sm-table-td>Jack</sm-table-td>
                  <sm-table-td>Jan 21 2020</sm-table-td>
                  <sm-table-td>Sydney</sm-table-td>
                </sm-table-tr>
                <sm-table-tr>
                  <sm-table-td>Jack</sm-table-td>
                  <sm-table-td>Jan 21 2020</sm-table-td>
                  <sm-table-td>Sydney</sm-table-td>
                </sm-table-tr>
                  <sm-table-tr>
                  <sm-table-td>Jack</sm-table-td>
                  <sm-table-td>Jan 21 2020</sm-table-td>
                  <sm-table-td>Sydney</sm-table-td>
                </sm-table-tr>
              </sm-table-tbody>
            </sm-table>
          </div>
        </sm-wizard-step>
        <sm-wizard-step label="Review" subtitle="Step three">
          Content for step #3 here...
        </sm-wizard-step>
      </sm-wizard>
    </div>
  `,
})

SampleHelpCard.storyName = 'Sample: Help Card'

const sampleHelpCardDescription = `
Use <code>isHelpCard</code> props to apply help card styling to the <code>sm-expandable-card-body</code> component.

Apply custom styling to <code>sm-expandable-card-body</code> component <code>body</code> slot, For the reference please find the below code example.
`
SampleHelpCard.parameters = {
  docs: {
    description: {
      story: sampleHelpCardDescription,
    },
  },
}

export const StylingHooks = () => ({
  setup: () => {
    const defaultImage = defaultExample
    const themedImage = themedExample
    const defaultTabletImage = defaultTabletExample
    const themedTabletImage = themedTabletExample

    return {
      defaultImage,
      defaultTabletImage,
      themedImage,
      themedTabletImage,
    }
  },
  template: `
    <div>
      <h3>Styling hooks</h3>
      <p>Styling hooks will enable customization for your components. Styling hooks are constructed using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">CSS custom properties</a>.</p>

      <p>Below is an example of the SUI wizard and the brand wizard using Styling hooks</p>

      <h4 class="sm-h5">Desktop</h4>
      <div class="flex items-start gap-24 mb-16">
        <img
          style="width: 100%; max-width: 1012px; height: auto; min-width: 0; border: 1px solid #c6d0e0"
          alt="Wizard default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 742px; height: auto; min-width: 0; border: 1px solid #c6d0e0"
          alt="Wizard themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <h4 class="sm-h5">Tablet/mobile</h4>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 1012px; height: auto; min-width: 0; border: 1px solid #c6d0e0"
          alt="Tablet wizard default example"
          class="block mb-16 flex-1"
          :src="defaultTabletImage"
        />
        <img
          style="width: 100%; max-width: 742px; height: auto; min-width: 0; border: 1px solid #c6d0e0"
          alt="Tablet wizard themed example"
          class="block mb-16 flex-1"
          :src="themedTabletImage"
        />
      </div>

      <p>Below are the wizard customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
            <sm-table-td>Underlay</sm-table-td>
            <sm-table-td>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-wizard-underlay-color-background
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Close button</sm-table-td>
            <sm-table-td>
              width <br/>
              height
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-wizard-close-button-width
                --sm-c-wizard-close-button-height
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Wrapper</sm-table-td>
            <sm-table-td>
              color-background <br/>
              color-text <br/>
              border <br/>
              border-radius <br/>
              box-shadow
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-wizard-wrapper-color-background
                --sm-c-wizard-wrapper-color-text

                --sm-c-wizard-wrapper-border-extra-large-desktop
                --sm-c-wizard-wrapper-border-radius-extra-large-desktop
                --sm-c-wizard-wrapper-box-shadow-extra-large-desktop
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Header</sm-table-td>
            <sm-table-td>
              border-bottom <br/>
              color-background <br/>
              color-text <br/>
              padding <br/>
              height <br/>
              box-shadow <br/>
              top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-wizard-header-border-bottom
                --sm-c-wizard-header-color-background
                --sm-c-wizard-header-color-text
                --sm-c-wizard-header-padding
                --sm-c-wizard-header-height
                --sm-c-wizard-header-top

                --sm-c-wizard-header-border-bottom-large-desktop
                --sm-c-wizard-header-padding-large-desktop
                --sm-c-wizard-header-box-shadow-large-desktop
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Title</sm-table-td>
            <sm-table-td>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-wizard-title-padding
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Tab list small
              <span class="block text-grey-neu-dark text-section-header">(Subheader on small screen)</span>
            </sm-table-td>
            <sm-table-td>
              color-background <br/>
              padding <br/>
              box-shadow <br/>
              border-bottom <br/>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-wizard-tablist-color-background
                --sm-c-wizard-tablist-padding
                --sm-c-wizard-tablist-box-shadow
                --sm-c-wizard-tablist-border-bottom

                --sm-c-wizard-tablist-padding-small-desktop
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Tab list label
              <span class="block text-grey-neu-dark text-section-header">(Subheader content on small screen)</span>
            </sm-table-td>
            <sm-table-td>
              margin-left <br/>
              color-text <br/>
              text-transform <br/>
              left
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-wizard-tablist-label-margin-left

                --sm-c-wizard-tablist-label-heading-color-text

                --sm-c-wizard-tablist-label-text-color-text
                --sm-c-wizard-tablist-label-text-text-transform

                --sm-c-wizard-tablist-label-count-left
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Tab list progress ring
              <span class="block text-grey-neu-dark text-section-header">(Progress indicator on small screen)</span>
            </sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-foreground
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-wizard-tablist-progress-ring-color-background
                --sm-c-wizard-tablist-progress-ring-color-foreground
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Tab list large
              <span class="block text-grey-neu-dark text-section-header">(Sidebar on large screen)</span>
            </sm-table-td>
            <sm-table-td>
              width <br/>
              border-right <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-wizard-tablist-width-large-desktop
                --sm-c-wizard-tablist-border-right-large-desktop
                --sm-c-wizard-tablist-padding-large-desktop
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Tab control common
              <span class="block text-grey-neu-dark text-section-header">(Sidebar steps in large screen)</span>
            </sm-table-td>
            <sm-table-td>
              margin-top <span class="block text-grey-neu-dark text-section-header">(Sidebar steps spacer)</span>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-wizard-tab-control-margin-top
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Tab control index
              <span class="block text-grey-neu-dark text-section-header">(Sidebar steps container)</span>
            </sm-table-td>
            <sm-table-td>
              color-background <br/>
              color-text <br/>
              font-size <br/>
              border-radius
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-wizard-tab-control-index-color-background
                --sm-c-wizard-tab-control-index-color-text
                --sm-c-wizard-tab-control-index-font-size
                --sm-c-wizard-tab-control-index-border-radius

                --sm-c-wizard-tab-control-index-outer-color-background
                --sm-c-wizard-tab-control-index-outer-border-radius
                --sm-c-wizard-tab-control-index-outer-border-color

                --sm-c-wizard-tab-control-index-color-background-complete
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Tab control label
              <span class="block text-grey-neu-dark text-section-header">(Sidebar steps label)</span>
            </sm-table-td>
            <sm-table-td>
              color-text <br/>
              font-size <br/>
              font-weight <br/>
              padding-left <br/>
              text-transform
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-wizard-tab-control-label-color-text
                --sm-c-wizard-tab-control-label-font-size
                --sm-c-wizard-tab-control-label-font-weight
                --sm-c-wizard-tab-control-label-padding-left
                --sm-c-wizard-tab-control-label-text-transform

                --sm-c-wizard-tab-control-label-color-text-active
                --sm-c-wizard-tab-control-label-font-weight-active

                --sm-c-wizard-tab-control-label-color-text-complete
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Tab control connector & progress
              <span class="block text-grey-neu-dark text-section-header">(Sidebar steps connector with progress)</span>
            </sm-table-td>
            <sm-table-td>
              color-background <br/>
              height
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-wizard-tab-control-connector-color-background
                --sm-c-wizard-tab-control-connector-height

                --sm-c-wizard-tab-control-progress-color-background

                --sm-c-wizard-tab-control-progress-height-active
                --sm-c-wizard-tab-control-progress-color-background-active
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Body
            </sm-table-td>
            <sm-table-td>
              color-background <br/>
              padding-top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-wizard-body-color-background
                --sm-c-wizard-body-padding-top
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Content
            </sm-table-td>
            <sm-table-td>
              color-background <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-wizard-content-color-background
                --sm-c-wizard-content-padding

                --sm-c-wizard-content-padding-small-desktop

                --sm-c-wizard-content-padding-large-desktop
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Footer
            </sm-table-td>
            <sm-table-td>
              color-background <br/>
              color-text <br/>
              padding <br/>
              height <br/>
              box-shadow <br/>
              border-top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-wizard-footer-color-background
                --sm-c-wizard-footer-color-text
                --sm-c-wizard-footer-padding
                --sm-c-wizard-footer-height
                --sm-c-wizard-footer-box-shadow
                --sm-c-wizard-footer-border-top

                --sm-c-wizard-footer-padding-small-desktop
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>
              Wizard step
            </sm-table-td>
            <sm-table-td>
              color-text <br/>
              text-transform
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-wizard-step-title-color-text

                --sm-c-wizard-step-subtitle-color-text
                --sm-c-wizard-step-subtitle-text-transform
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>
    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
