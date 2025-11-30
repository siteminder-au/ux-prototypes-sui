import SmLoadingSpinner from '../sm-loading-spinner.vue'

export default {
  title: 'Components/Loading/Loading spinner',
  component: SmLoadingSpinner,
}

export const Standard = () => ({
  components: { SmLoadingSpinner },
  template: `
    <div>
      <span class="sui-storybook-header">Inline loading spinner</span>
      <span class="mr-16"> inline content small size </span> <sm-loading-spinner />
      <span class="mx-16"> inline content large size </span> <sm-loading-spinner color="neutral" size="large" />
    </div>
    <div>
      <span class="sui-storybook-header">Fullscreen loading spinner</span>
        <div class="flex items-center my-20">
          <div class="w-1/3 h-512 border-1 border-gray-300 border-solid mr-20">
            <sm-loading-spinner type="fullscreen" class="mr-20"/>
          </div>
          <div class="w-1/3 h-512 border-1 border-gray-300 border-solid">
            <sm-loading-spinner
              aria-loading-message="Custom loading message"
              type="fullscreen"
              color="neutral"
              size="large"
            />
          </div>
        </div>
    </div>
  `,
})

Standard.parameters = {
  docs: {
    description: {
      component: 'Loading indicator for use in full-screen and data table contexts, etc. Provides a visual cue to users when content is loading or processing.',
    },
  },
}
