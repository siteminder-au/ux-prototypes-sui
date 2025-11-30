import SmLoadingCard from '../sm-loading-card.vue'

export default {
  title: 'Components/Loading/Loading card',
  component: SmLoadingCard,
}

export const Standard = () => ({
  components: { SmLoadingCard },
  template: `
    <div>
      <sm-loading-card count="4" />
    </div>
  `,
})

export const Stacked = () => ({
  components: { SmLoadingCard },
  template: `
    <div>
      <sm-loading-card count="4" stacked />
    </div>
  `,
})
