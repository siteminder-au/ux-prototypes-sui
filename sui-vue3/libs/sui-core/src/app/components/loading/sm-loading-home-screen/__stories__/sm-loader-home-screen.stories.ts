import SmLoadingHomeScreen from '../sm-loading-home-screen.vue'

export default {
  title: 'Components/Loading/Loading home screen',
  component: SmLoadingHomeScreen,
}

export const Standard = () => ({
  components: { SmLoadingHomeScreen },
  template: `
    <sm-loading-home-screen />
  `,
})

export const HiddenHeader = () => ({
  components: { SmLoadingHomeScreen },
  template: `
    <sm-loading-home-screen :showHeader="false" />
  `,
})

HiddenHeader.storyName = 'Hidden header'
HiddenHeader.parameters = {
  docs: {
    description: {
      story: 'By default, the header and top nav loaders are visible. To hide them, set the <code>showHeader</code> prop to false.',
    },
  },
}
