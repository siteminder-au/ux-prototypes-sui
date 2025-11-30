import SmLoader from '../sm-loader.vue'

export default {
  title: 'Components/Loading/Loader',
  component: SmLoader,
}

export const Standard = () => ({
  components: { SmLoader },
  template: '<sm-loader />',
})
