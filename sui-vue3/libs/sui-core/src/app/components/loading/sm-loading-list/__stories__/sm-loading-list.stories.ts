import SmLoadingList from '../sm-loading-list.vue'

export default {
  title: 'Components/Loading/Loading list',
  component: SmLoadingList,
}

export const Standard = () => ({
  components: { SmLoadingList },
  template: `
    <sm-loading-list count="8" />
  `,
})

Standard.parameters = {
  docs: {
    description: {
      component: 'The sm-loading-list is a skeleton loader for the sm-list component.',
    },
  },
}
