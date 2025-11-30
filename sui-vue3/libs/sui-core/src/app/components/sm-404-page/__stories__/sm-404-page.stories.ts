import Sm404Page from '../sm-404-page.vue'
import { SmCard, SmCardContent } from '../../sm-card'

export default {
  title: 'Components/404 page',
  decorators: [],
  component: Sm404Page,
  parameters: {
    docs: {
      description: {
        // Uses `component` here since it's the primary story
        component: 'By default, the component is in <code>full-page</code> and <code>responsive</code> modes. <br/> The responsive mode will automatically layout, space and scale the component on different breakpoints.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Au1waCRAR4SpFvIgEMASgf/sui-documentation?node-id=2%3A44389&t=sGu82gtorMoaiAZm-1',
    },
  },
}

export const FullPage = (args: unknown) => ({
  components: { Sm404Page },
  setup: () => {
    return { args }
  },
  template: `
    <sm-404-page v-bind="args">
      <template v-slot:image>
        <img alt="" role="presentation" src="https://sui-assets.siteminder.com/sm/illu-lg/non-payment.svg" />
      </template>
      <template v-slot:header>
        <h3 class="mb-8">Page not found</h3>
      </template>
      <template v-slot:description>
        We can't find the page you're looking for. Try using your browser's back button or visit our homepage.
      </template>
      <template v-slot:actions>
        <sm-button type="secondary">Go to previous page</sm-button>
        <sm-button type="primary">Go home</sm-button>
      </template>
    </sm-404-page>
  `,
})

FullPage.storyName = 'Full page'
FullPage.args = {
  fullPage: true,
  responsive: true,
  imageClass: undefined,
  contentClass: undefined,
}

export const InApp = (args: unknown) => ({
  components: { Sm404Page },
  setup: () => {
    return { args }
  },
  template: `
    <sm-404-page v-bind="args">
      <template v-slot:image>
        <img width="200" height="200" alt="" role="presentation" src="https://sui-assets.siteminder.com/sm/illu-md/illu-md-error.svg" />
      </template>
      <template v-slot:header>
        <h3 class="mb-8">Unauthorised access</h3>
      </template>
      <template v-slot:description>
        You don't have authorisation to view this page. Please contact your administrator to gain access.
      </template>
      <template v-slot:actions>
        <sm-button type="primary">Go to dashboard</sm-button>
      </template>
    </sm-404-page>
  `,
})

InApp.storyName = 'In app'
InApp.args = {
  fullPage: false,
  responsive: false,
  imageClass: undefined,
  contentClass: undefined,
}
InApp.parameters = {
  docs: {
    description: {
      // The rest uses `story`
      story: 'Set the <code>full-page</code> and <code>responsive</code> props to false when using it as an in-app status.',
    },
  },
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/Au1waCRAR4SpFvIgEMASgf/sui-documentation?node-id=2%3A44578&t=sGu82gtorMoaiAZm-1',
  },
}

export const InCard = (args: unknown) => ({
  components: { Sm404Page, SmCard, SmCardContent },
  setup: () => {
    return { args }
  },
  template: `
    <div class="flex">
      <sm-card style="width: 388px" :show-border-on-top="false">
        <sm-card-content>
          <sm-404-page v-bind="args">
            <template v-slot:image>
              <img width="120" height="120" alt="" role="presentation" src="https://sui-assets.siteminder.com/sm/illu-md/illu-md-no-results.svg" />
            </template>
            <template v-slot:description>
              No channels connected
            </template>
            <template v-slot:actions>
              <sm-button type="tertiary">
                Go to dashboard
                <sm-icon class="ml-4" name="arrow-go-forward" />
              </sm-button>
            </template>
          </sm-404-page>
        </sm-card-content>
      </sm-card>
    </div>
  `,
})

InCard.storyName = 'In card'
InCard.args = {
  fullPage: false,
  responsive: false,
  imageClass: undefined,
  contentClass: undefined,
}
InCard.parameters = {
  design: null,
}
