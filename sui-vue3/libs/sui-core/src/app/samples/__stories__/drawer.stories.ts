import vueRouter from 'storybook-vue3-router'
import { ref } from 'vue'
import LayoutAside from '../common/layout-aside.vue'
import { dialogService } from '../../services'

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

export const Drawer = () => ({
  components: { LayoutAside },
  setup: () => {
    const drawerVisible = ref(true)
    const dialogOneVisible = ref(false)

    const draft = ref({
      field1: null,
      field2: null,
      field3: null,
      field4: null,
    })

    const formRef = ref()

    const loading = ref(false)
    const onSubmit = async (): Promise<void> => {

      loading.value = true

      return new Promise((resolve) => {

        window.setTimeout(() => {
          loading.value = false
          resolve()
        }, 3000)

      })

    }

    const showDialog = (): void => {
      dialogService({
        type: 'prompt',
        title: 'Title here',
        bodyContent: 'Dialog as a service...',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm',
      })
    }

    return {
      dialogOneVisible,
      drawerVisible,
      formRef,
      draft,
      loading,
      onSubmit,
      showDialog,
    }
  },
  template: `
    <layout-aside>
      <sm-section>
        <sm-button
          type="primary"
          @click="drawerVisible = true"
        >
          Open drawer
        </sm-button>

        <sm-button
          type="secondary"
          @click="dialogOneVisible = true"
        >
          Open dialog
        </sm-button>
      </sm-section>

      <sm-drawer
        v-model:visible="drawerVisible"
        content-class="max-w-lg"
        title="Drawer title"
      >
        <template #actions>
          <sm-button
            class="ml-4"
            type="tertiary"
            :disabled="loading"
            @click="drawerVisible = false"
          >
            Cancel
          </sm-button>
          <sm-button
            type="primary"
            :disabled="loading"
            native-type="submit"
            form="drawer-form"
            @click="onSubmit"
          >
            Submit
          </sm-button>
        </template>

        <template #mobile-actions>
          <sm-button
            type="tertiary"
            :disabled="loading"
            @click="drawerVisible = false"
          >
            Cancel
          </sm-button>
          <sm-button
            type="primary"
            :disabled="loading"
            native-type="submit"
            form="drawer-form"
            @click="onSubmit"
          >
            Submit
          </sm-button>
        </template>

        <sm-form
          id="drawer-form"
          ref="formRef"
          class="mb-16"
          :disabled="loading"
          @submit="onSubmit"
        >
          <sm-form-group legend="A Form Group">
            <div class="gap-x-24 grid grid-cols-1 tablet:grid-cols-2">
              <sm-input
                v-model="draft.field1"
                type="text"
                label="Field 1"
                rules="required"
                name="field-1"
              />
              <sm-input
                v-model="draft.field2"
                type="text"
                label="Field 2"
                rules="required"
                name="field-2"
              />
            </div>
            <div class="gap-x-24 grid grid-cols-1 tablet:grid-cols-2">
              <sm-input
                v-model="draft.field3"
                type="text"
                label="Field 3"
                rules="required"
                name="field-3"
              />
              <sm-input
                v-model="draft.field4"
                type="text"
                label="Field 4"
                rules="required"
                name="field-4"
              />
            </div>
          </sm-form-group>
        </sm-form>

        <sm-button
          class="mb-16"
          type="secondary"
          @click="showDialog()"
        >
          Open dialog
        </sm-button>

        <sm-divider
          margin-bottom="32px"
          margin-top="32px"
          min-width="100%"
        />

        <span class="block sm-h3 sm-section-heading">Scrollable content</span>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Odio eu feugiat pretium nibh
          ipsum. Leo a diam sollicitudin tempor id eu nisl nunc. Fames ac turpis egestas integer eget aliquet nibh praesent tristique. Eget dolor morbi non arcu
          risus quis varius quam quisque. Eu scelerisque felis imperdiet proin fermentum leo vel orci. Nullam ac tortor vitae purus faucibus ornare. Tortor
          pretium viverra suspendisse potenti nullam ac. Nunc mi ipsum faucibus vitae. Vestibulum lectus mauris ultrices eros in cursus. Ultrices tincidunt arcu
          non sodales neque sodales ut etiam. Id neque aliquam vestibulum morbi blandit cursus. Pellentesque nec nam aliquam sem et. Quis enim lobortis
          scelerisque fermentum dui faucibus in ornare.
        </p>
        <p>
          Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Cursus eget nunc scelerisque viverra. Tortor aliquam nulla facilisi cras fermentum.
          Sagittis eu volutpat odio facilisis mauris sit amet massa. Arcu cursus euismod quis viverra. Diam in arcu cursus euismod quis viverra nibh cras
          pulvinar. Pellentesque massa placerat duis ultricies lacus sed turpis tincidunt id. Amet mattis vulputate enim nulla aliquet porttitor lacus luctus.
          Morbi blandit cursus risus at ultrices mi tempus. Diam phasellus vestibulum lorem sed risus ultricies.
        </p>
      </sm-drawer>

      <sm-dialog
        v-model:visible="dialogOneVisible"
        title="Dialog title"
      >
        <template #default>
          <p>Dialog content goes here</p>
        </template>
        <template #footer>
          <sm-button
            type="tertiary"
            @click="dialogOneVisible = false"
          >
            Cancel
          </sm-button>
          <sm-button
            type="primary"
            @click="dialogOneVisible = false"
          >
            Save
          </sm-button>
        </template>
      </sm-dialog>
    </layout-aside>
  `,
})
