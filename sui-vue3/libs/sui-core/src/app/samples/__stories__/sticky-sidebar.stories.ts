import vueRouter from 'storybook-vue3-router'
import { reactive, ref } from 'vue'
import LayoutAside from '../common/layout-aside.vue'

const EmptyComponent = () => ({
  template: '<div>Home</div>',
})
EmptyComponent.displayName = 'EmptyComponent'

export default {
  title: 'Examples/Components',
  decorators: [
    // See: https://corechasm.com/addons/storybook-vue3-router
    // Match all routes so we can test the active state of the nav items
    // we also need to resolve storybook-vue3-router in .storybook/main.cjs file
    vueRouter([{
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: EmptyComponent,
    }]),
  ],
}

export const StickySidebar = () => ({
  components: { LayoutAside },
  setup: () => {
    const sending = ref(false)

    const send = (): void => {
      sending.value = true

      // Call the backend
      setTimeout(() => {
        sending.value = false
      }, 2000)
    }

    const form = reactive({
      field1: null,
      field2: null,
      field3: null,
      number1: null,
      number2: null,
      number3: null,
    })

    const reset = (): void => {
      console.info('Form resetting...')
    }

    const handleSubmit = (): void => {
      console.info('Submitting...')
    }

    return {
      sending,
      send,
      form,
      reset,
      handleSubmit,
    }
  },
  template: `
    <layout-aside :is-sticky-sidebar="true">
      <sm-section style="height: 200vh">
        <sm-page-title
          title="Page Title"
        >
          <template #actions>
            <sm-button
              native-type="submit"
              form="the-form"
              type="primary"
              @click.prevent="handleSubmit"
            >
              Submit
            </sm-button>
          </template>
        </sm-page-title>

        <div class="max-w-lg">
          <sm-form
            id="the-form"
            :disabled="sending"
            @submit="send"
            @reset="reset"
          >
            <sm-form-group legend="Section 1">
              <div class="flex">
                <div class="w-full">
                  <sm-input
                    v-model="form.field1"
                    type="text"
                    label="Field 1"
                    rules="required"
                    name="field-1"
                  />
                </div>
              </div>

              <div class="flex">
                <div class="pr-12 w-1/2">
                  <sm-input
                    v-model="form.field2"
                    type="text"
                    label="Field 2"
                    rules="required"
                    name="field-2"
                  />
                </div>
                <div class="pl-12 w-1/2">
                  <sm-input
                    v-model="form.field3"
                    type="text"
                    label="Field 3"
                    rules="required"
                    name="field-3"
                  />
                </div>
              </div>
            </sm-form-group>

            <sm-form-group legend="Section 2">
              <div class="flex">
                <div class="pr-12 w-1/3">
                  <sm-input
                    v-model="form.number1"
                    type="number"
                    label="Field"
                    name="number-1"
                  />
                </div>
                <div class="pl-12 pr-12 w-1/3">
                  <sm-input
                    v-model="form.number2"
                    type="text"
                    label="Field"
                    name="number-2"
                  />
                </div>
                <div class="pl-12 w-1/3">
                  <sm-input
                    v-model="form.number3"
                    type="text"
                    label="Field"
                    name="number-3"
                  />
                </div>
              </div>
            </sm-form-group>
          </sm-form>
        </div>
      </sm-section>
    </layout-aside>
  `,
})
