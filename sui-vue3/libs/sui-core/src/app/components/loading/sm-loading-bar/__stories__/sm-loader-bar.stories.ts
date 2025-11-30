import SmLoadingBar from '../sm-loading-bar.vue'

export default {
  title: 'Components/Loading/Loading bar',
  component: SmLoadingBar,
}

export const Standard = () => ({
  components: { SmLoadingBar },
  template: `
    <div>
      <sm-loading-bar class="w-192 h-32" />
    </div>
  `,
})

Standard.parameters = {
  docs: {
    description: {
      component: 'The sm-loading-bar provide a simple skeleton loading bar. The width and height of the bar must be set in the implementation.',
    },
  },
}
