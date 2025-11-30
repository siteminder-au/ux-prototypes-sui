import SmLoadingForm from '../sm-loading-form.vue'

export default {
  title: 'Components/Loading/Loading form',
  component: SmLoadingForm,
}

export const Standard = () => ({
  components: { SmLoadingForm },
  template: `
    <div class="w-512">
      <sm-loading-form count="2" />
    </div>
  `,
})
