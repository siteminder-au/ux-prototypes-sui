import SmLoadingDashboard from '../sm-loading-dashboard.vue'
import SmLoadingLongCard from '../sm-loading-long-card.vue'
import SmLoadingSmallCard from '../sm-loading-small-card.vue'
import SmLoadingGraphCard from '../sm-loading-graph-card.vue'

export default {
  title: 'Components/Loading/Loading Dashboard',
  component: SmLoadingDashboard,
  subcomponents: {
    'sm-loading-graph-card': SmLoadingGraphCard,
    'sm-loading-long-card': SmLoadingLongCard,
    'sm-loading-small-card': SmLoadingSmallCard,
  },
}

export const Standard = () => ({
  components: { SmLoadingDashboard, SmLoadingLongCard, SmLoadingSmallCard, SmLoadingGraphCard },
  template: `
    <div>
      <sm-loading-dashboard>
        <sm-loading-long-card></sm-loading-long-card>
        <div style="display:flex">
          <sm-loading-small-card class="w-1/2"></sm-loading-small-card>
          <sm-loading-small-card class="w-1/2"></sm-loading-small-card>
        </div>
        <sm-loading-graph-card></sm-loading-graph-card>
      </sm-loading-dashboard>
    </div>
  `,
})

Standard.parameters = {
  docs: {
    description: {
      component: 'The sm-loading-dashboard provide a simple skeleton loading bar. The width and height of the bar must be set in the implementation.',
    },
  },
}

export const LongCard = () => ({
  components: { SmLoadingDashboard, SmLoadingLongCard },
  template: `
    <div>
      <sm-loading-dashboard>
        <sm-loading-long-card></sm-loading-long-card>
      </sm-loading-dashboard>
    </div>
  `,
})

LongCard.storyName = 'Long card'

LongCard.parameters = {
  docs: {
    description: {
      story: 'The sm-loading-dashboard provide a simple skeleton loading bar. The width and height of the bar must be set in the implementation.',
    },
  },
}

export const SmallCard = () => ({
  components: { SmLoadingDashboard, SmLoadingLongCard, SmLoadingSmallCard },
  template: `
    <div>
      <sm-loading-dashboard>
        <sm-loading-small-card class="w-1/2"></sm-loading-small-card>
      </sm-loading-dashboard>
      <sm-loading-dashboard>
        <sm-loading-small-card class="w-1/2" height="300px"></sm-loading-small-card>
      </sm-loading-dashboard>
    </div>
  `,
})

SmallCard.storyName = 'Small card'

SmallCard.parameters = {
  docs: {
    description: {
      story: 'The sm-loading-dashboard provide a simple skeleton loading bar. The width and height of the bar must be set in the implementation.',
    },
  },
}

export const GraphCard = () => ({
  components: { SmLoadingDashboard, SmLoadingLongCard, SmLoadingSmallCard, SmLoadingGraphCard },
  template: `
    <div>
      <sm-loading-dashboard>
        <sm-loading-graph-card class="w-1/3"></sm-loading-graph-card>
      </sm-loading-dashboard>
    </div>
  `,
})

GraphCard.storyName = 'Graph card'

GraphCard.parameters = {
  docs: {
    description: {
      story: 'The sm-loading-dashboard provide a simple skeleton loading bar. The width and height of the bar must be set in the implementation.',
    },
  },
}
