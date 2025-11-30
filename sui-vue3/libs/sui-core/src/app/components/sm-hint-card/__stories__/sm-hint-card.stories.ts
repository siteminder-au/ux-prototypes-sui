import vueRouter from 'storybook-vue3-router'
import SmHintCard from '../sm-hint-card.vue'

const EmptyComponent = () => ({
  template: '<div>Home</div>',
})
EmptyComponent.displayName = 'EmptyComponent'

export default {
  title: 'Components/Hint Card',
  decorators: [
    // See: https://corechasm.com/addons/storybook-vue3-router
    // Match all routes so we can test the active state of the nav items
    vueRouter([{
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: EmptyComponent,
    }]),
  ],
  component: SmHintCard,
}

export const Standard = () => ({
  components: { SmHintCard },
  setup: () => {
    const handleActionButtonClick = () => {
      console.info('Action button clicked')
    }

    return { handleActionButtonClick }
  },
  template: `
    <div class="w-full">

      <span class="sui-storybook-header">Default</span>
      <div class="grid gap-16">
        <sm-hint-card title="Looking to increase your direct bookings?" />

        <sm-hint-card body="Gain a competitive advantage by getting on metasearch channels via Demand Plus." />

        <sm-hint-card
          body="Gain a competitive advantage by getting on metasearch channels via Demand Plus."
          title="Looking to increase your direct bookings?"
          title-tag="h6"
        />

        <sm-hint-card>
          <template #title>
            Looking to increase your direct bookings?
          </template>
          <template #body>
            Gain a competitive advantage by getting on metasearch channels via <a href="#">Demand Plus</a>.
          </template>
        </sm-hint-card>
      </div>

      <br/><br/>

      <span class="sui-storybook-header">With action</span>
      <div class="grid gap-16">
        <sm-hint-card
          title="Looking to increase your direct bookings?"
          :action-button="{
            label: 'Action button',
            suffixIcon: 'arrow-go-forward',
            id: 'action-button-id',
            onClick: () => handleActionButtonClick(),
          }"
        />

        <sm-hint-card
          body="Gain a competitive advantage by getting on metasearch channels via Demand Plus."
          :action-button="{
            label: 'Action button',
            suffixIcon: 'arrow-go-forward',
            to: '/setup/general',
          }"
        />

        <sm-hint-card
          body="Gain a competitive advantage by getting on metasearch channels via Demand Plus."
          title="Looking to increase your direct bookings?"
          title-tag="h6"
          :action-button="{
            label: 'Learn more',
            suffixIcon: 'action-open-in-new',
            href: 'https://www.siteminder.com/',
            target: '_blank',
          }"
        />

        <sm-hint-card>
          <template #title>
            Looking to increase your direct bookings?
          </template>
          <template #body>
            Gain a competitive advantage by getting on metasearch channels via <a href="#">Demand Plus</a>.
          </template>
          <template #action>
            <sm-button size="medium" type="text">
              Action button
              <sm-icon
                class="ml-4"
                name="arrow-go-forward"
                style="font-size: 13px"
              />
            </sm-button>
          </template>
        </sm-hint-card>
      </div>

    </div>
  `,
})

const standardDescription = `
  Prefer using the <code>title</code> and <code>body</code> props to set the content of the hint card.

  The slot counterpart can be used if you need to add rich content like inlined links within the body.
`

Standard.parameters = {
  docs: {
    description: {
      // Uses `component` here since it's the primary story
      component: standardDescription,
    },
  },
  percy: {
    widths: [1025, 769, 360],
  },
}

export const Close = () => ({
  components: { SmHintCard },
  setup: () => {
    const handleClose = () => {
      console.info('close event emitted')
    }

    const handleActionButtonClick = () => {
      console.info('Action button clicked')
    }

    return { handleActionButtonClick, handleClose }
  },
  template: `
    <div class="w-full">

      <span class="sui-storybook-header">Closable</span>
      <div class="grid gap-16">
        <sm-hint-card
          title="Looking to increase your direct bookings?"
          :show-close="true"\
          @close="handleClose"
        />

        <sm-hint-card
          body="Gain a competitive advantage by getting on metasearch channels via Demand Plus."
          :show-close="true"
          @close="handleClose"
        />

        <sm-hint-card
          title="Looking to increase your direct bookings?"
          title-tag="h6"
          body="Gain a competitive advantage by getting on metasearch channels via Demand Plus."
          :show-close="true"
          @close="handleClose"
        />

        <sm-hint-card :show-close="true" @close="handleClose">
          <template #title>
            Looking to increase your direct bookings?
          </template>
          <template #body>
            Gain a competitive advantage by getting on metasearch channels via <a href="#">Demand Plus</a>.
          </template>
        </sm-hint-card>
      </div>

      <br/><br/>

      <span class="sui-storybook-header">Closable with action</span>
      <div class="grid gap-16">
        <sm-hint-card
          title="Looking to increase your direct bookings?"
          :show-close="true"
          :action-button="{
            label: 'Action button',
            suffixIcon: 'arrow-go-forward',
            onClick: () => handleActionButtonClick(),
          }"
          @close="handleClose"
        />

        <sm-hint-card
          body="Gain a competitive advantage by getting on metasearch channels via Demand Plus."
          :show-close="true"
          :action-button="{
            label: 'Action button',
            suffixIcon: 'arrow-go-forward',
            to: { path: '/setup/general' },
          }"
          @close="handleClose"
        />

        <sm-hint-card
          body="Gain a competitive advantage by getting on metasearch channels via Demand Plus."
          title="Looking to increase your direct bookings?"
          title-tag="h6"
          :show-close="true"
          :action-button="{
            label: 'Learn more',
            suffixIcon: 'action-open-in-new',
            href: 'https://www.siteminder.com/',
            target: '_blank',
          }"
          @close="handleClose"
        />

        <sm-hint-card :show-close="true" @close="handleClose">
          <template #title>
            Looking to increase your direct bookings?
          </template>
          <template #body>
            Gain a competitive advantage by getting on metasearch channels via <a href="#">Demand Plus</a>.
          </template>
          <template #action>
            <sm-button size="medium" type="text">
              Action button
              <sm-icon name="arrow-go-forward" style="font-size: 13px" />
            </sm-button>
          </template>
        </sm-hint-card>
      </div>

    </div>
  `,
})

Close.parameters = {
  docs: {
    description: {
      story: 'The built-in close button will emit a `close` event when clicked.',
    },
  },
  percy: {
    widths: [1025, 769, 360],
  },
}
