<script setup lang="ts">
import { useTranslate } from '@/composables/use-translate'
import { Ref, onMounted, ref } from 'vue'
import DirectBookingDropdownSiteRateActions from '@/components/direct-booking/direct-booking-dropdown-site-rate-actions.vue'
import { toastService } from '@siteminder/sui-core/services'
import { useIsPercy } from '@/composables/use-is-percy'

const { t } = useTranslate('views.direct-booking')

// mock data
const siteTypes = [
  'Single Tent',
  'Double Tent',
  'King Tent',
]
const siteRates = [
  'Some site rate 1',
  'Some site rate 2',
  'Some site rate 3',
  'Some site rate 4',
  'Some site rate 5',
  'Some site rate 6',
]
const siteRateExtras: Record<string, { name: string, summary: string, availability: string }> = {
  'Some site rate 1': {
    name: 'Extras Available 1',
    summary: 'Firepit, Toilets, BBQ, Drinking water',
    availability: 'Any date',
  },
  'Some site rate 2': {
    name: 'Extras Available 2',
    summary: 'Firepit, Toilets, BBQ, Drinking water',
    availability: 'Any date',
  },
  'Some site rate 3': {
    name: 'Extras Available 3',
    summary: 'Firepit, Toilets, BBQ, Drinking water',
    availability: 'Any date',
  },
  'Some site rate 4': {
    name: 'Extras Available 4',
    summary: 'Firepit, Toilets, BBQ, Drinking water',
    availability: 'Any date',
  },
  'Some site rate 5': {
    name: 'Extras Available 5',
    summary: 'Firepit, Toilets, BBQ, Drinking water',
    availability: 'Any date',
  },
  'Some site rate 6': {
    name: 'Extras Available 6',
    summary: 'Firepit, Toilets, BBQ, Drinking water',
    availability: 'Any date',
  },
}

// sm-select
const siteTypeFilter = ref('')
const siteTypeOptions = ref([
  { label: 'Single Tent', code: 'single' },
  { label: 'Double Tent', code: 'double' },
  { label: 'King Tent', code: 'king' },
])

const statusFilter = ref([])
const statusOptions = ref([
  { label: 'Added', code: 'added' },
  { label: 'Draft', code: 'draft' },
  { label: 'Deleted', code: 'deleted' },
])

// sm-dialog
const editRateDialogVisible = ref(false)
const copyToolDialogVisible = ref(false)
const suspendDialogVisible = ref(false)
const beforeConfirmSuspendHandler = (): void => {
  // immediately simulate success
  toastService({
    type: 'success',
    message: t('site-rate-suspended-successfully-toast-text'),
    placement: 'top',
  })

  suspendDialogVisible.value = false
}

// #region sm-media
const csvData = ref('')
const handleCsvUpload = (files: FileList[]): void => {
  const fileReader = new FileReader()
  fileReader.readAsBinaryString(files[0] as unknown as Blob)
  fileReader.addEventListener('load', ({ target }) => {
    console.info('contents', target?.result)
    csvData.value = target?.result as string
    if (csvData.value) {
      toastService({
        type: 'success',
        message: t('successfully-uploaded-site-types-toast-text'),
      })
    }
  })
}

const acceptMime = ref(['image/png', 'image/jpg', 'image/jpeg', 'image/gif'])

const singleTentImages: Ref<{src: string, id: string}[]> = ref([])
const selectedSingleTentImages: Ref<string[]> = ref([])
const doubleTentImages: Ref<{src: string, id: string}[]> = ref([])

const uploadedFiles = (files: FileList[], siteType: string): void => {
  if (siteType === siteTypes[0]) {
    files.forEach((_, i) => {
      singleTentImages.value.push({
        src: `https://picsum.photos/1150/940?random=${singleTentImages.value.length + 1}`,
        id: `${i}${i}${i}`,
      })
    })
  }

  if (siteType === siteTypes[1]) {
    files.forEach((_, i) => {
      doubleTentImages.value.push({
        src: `https://picsum.photos/1150/940?random=${doubleTentImages.value.length + 1}`,
        id: `${i}${i}${i}`,
      })
    })
  }

  console.info('Uploaded - files', files)
}

const linkMaker = (): void => {
  for (let i = 0; i < 6; i += 1) {
    singleTentImages.value.push({ src: `https://picsum.photos/id/${i + 10}/940`, id: `${i}${i}${i}` })
  }
}

const openSysUpload = (index: number): void => {
  // Taken from storybook example. We should find a more elegant API for this in the future
  // as this looks like a very common thing downstream projects want to do.
  (document.querySelectorAll('.sm-media__input-hidden input')[index] as HTMLInputElement).click()
}

const selectedItemHandler = (id: string, selected: boolean): void => {
  if (selected && !selectedSingleTentImages.value.includes(id)) {
    // single selection
    // selectedSingleTentImages.value = [id]

    // multi select
    selectedSingleTentImages.value.push(id)

    return
  }

  if (!selected && selectedSingleTentImages.value.includes(id)) {
    selectedSingleTentImages.value = selectedSingleTentImages.value.filter(item => item !== id)
  }
}

const editTentImageHandler = (src: string): void => {
  console.info('Edit image:', src)
}

onMounted(() => {
  linkMaker()

  const isPercyContext = useIsPercy()
  if (isPercyContext) {
    const tooltips = document.querySelectorAll('.sm-tag')
    tooltips.forEach(tooltip => (tooltip as HTMLElement).click())

    const popovers = document.querySelectorAll('.sm-popover__target')
    ;(popovers[2] as HTMLElement | null)?.click()

    const dropdowns = document.querySelectorAll('.sm-dropdown__label')
    ;(dropdowns[1] as HTMLElement | null)?.click()
  }
})
// #endregion
</script>

<template>
  <sm-section>
    <sm-container :full-width="true">
      <sm-page-title
        :title="t('direct-booking-rates-heading-text')"
        sub-title="(6)"
      />

      <sm-select
        v-model="siteTypeFilter"
        :label="t('filter-by-site-type-label')"
        :options="siteTypeOptions"
        :placeholder="t('select-site-type-placeholder-text')"
      />

      <sm-select
        :selection.sync="statusFilter"
        label="Filter by status"
        :options="statusOptions"
        :multiple="true"
        placeholder="Select status..."
      />

      <ul>
        <li>{{ siteTypeFilter }}</li>
        <li>{{ statusFilter }}</li>
      </ul>

      <sm-section>
        <sm-table
          :is-responsive="true"
        >
          <sm-table-thead>
            <sm-table-tr>
              <sm-table-th
                colspan="4"
                :static-header="true"
              >
                {{ siteTypes[0] }}
              </sm-table-th>
            </sm-table-tr>
            <sm-table-tr>
              <sm-table-th colspan="4">
                {{ t('direct-booking-rates-table-header-text') }}
              </sm-table-th>
              <sm-table-th colspan="1">
                {{ t('status-table-header-text') }}
              </sm-table-th>
              <sm-table-th colspan="1">
                {{ t('extras-table-header-text') }}
              </sm-table-th>
            </sm-table-tr>
          </sm-table-thead>
          <sm-table-tbody>
            <sm-table-tr>
              <sm-table-td colspan="4">
                <direct-booking-dropdown-site-rate-actions
                  :site-rate-label="siteRates[0]"
                  @suspend="suspendDialogVisible = true"
                  @edit="editRateDialogVisible = true"
                  @copy-tool="copyToolDialogVisible = true"
                />
              </sm-table-td>
              <sm-table-td colspan="1">
                <sm-tooltip
                  placement="left"
                  :title="t('success-tooltip-text')"
                  trigger="hover"
                >
                  <sm-tag
                    type="success"
                    size="small"
                  >
                    {{ t('added-status-text') }}
                  </sm-tag>
                </sm-tooltip>
              </sm-table-td>
              <sm-table-td colspan="1">
                <sm-popover
                  placement="left"
                  trigger="hover"
                >
                  <sm-button class="cm-w-full">{{ siteRateExtras[siteRates[0]].name }}</sm-button>
                  <template #content>
                    <p><b>{{ t('summary-popover-heading') }}</b></p>
                    <p>{{ siteRateExtras[siteRates[0]].summary }}</p>
                    <br>
                    <p><b>{{ t('availability-popover-heading') }}</b></p>
                    <p>{{ siteRateExtras[siteRates[0]].availability }}</p>
                  </template>
                </sm-popover>
              </sm-table-td>
            </sm-table-tr>
            <sm-table-tr>
              <sm-table-td colspan="4">
                <direct-booking-dropdown-site-rate-actions
                  :site-rate-label="siteRates[1]"
                  @suspend="suspendDialogVisible = true"
                  @edit="editRateDialogVisible = true"
                  @copy-tool="copyToolDialogVisible = true"
                />
              </sm-table-td>
              <sm-table-td colspan="1">
                <sm-tooltip
                  placement="top"
                  :title="t('success-tooltip-text')"
                  trigger="click"
                >
                  <sm-tag
                    type="success"
                    size="small"
                  >
                    {{ t('added-status-text') }}
                  </sm-tag>
                </sm-tooltip>
              </sm-table-td>
              <sm-table-td colspan="1">
                <sm-popover
                  placement="top"
                >
                  <sm-button class="cm-w-full">{{ siteRateExtras[siteRates[1]].name }}</sm-button>
                  <template #content>
                    <p><b>{{ t('summary-popover-heading') }}</b></p>
                    <p>{{ siteRateExtras[siteRates[1]].summary }}</p>
                    <br>
                    <p><b>{{ t('availability-popover-heading') }}</b></p>
                    <p>{{ siteRateExtras[siteRates[1]].availability }}</p>
                  </template>
                </sm-popover>
              </sm-table-td>
            </sm-table-tr>
            <sm-table-tr>
              <sm-table-td colspan="4">
                <direct-booking-dropdown-site-rate-actions
                  :site-rate-label="siteRates[2]"
                  @suspend="suspendDialogVisible = true"
                  @edit="editRateDialogVisible = true"
                  @copy-tool="copyToolDialogVisible = true"
                />
              </sm-table-td>
              <sm-table-td colspan="1">
                <sm-tooltip
                  placement="left"
                  :title="t('success-tooltip-text')"
                  type="info"
                >
                  <sm-tag
                    type="success"
                    size="small"
                  >
                    {{ t('added-status-text') }}
                  </sm-tag>
                </sm-tooltip>
              </sm-table-td>
              <sm-table-td colspan="1">
                <sm-popover
                  placement="left"
                  type="info"
                >
                  <sm-button class="cm-w-full">{{ siteRateExtras[siteRates[2]].name }}</sm-button>
                  <template #content>
                    <p><b>{{ t('summary-popover-heading') }}</b></p>
                    <p>{{ siteRateExtras[siteRates[2]].summary }}</p>
                    <br>
                    <p><b>{{ t('availability-popover-heading') }}</b></p>
                    <p>{{ siteRateExtras[siteRates[2]].availability }}</p>
                  </template>
                </sm-popover>
              </sm-table-td>
            </sm-table-tr>
            <sm-table-tr>
              <sm-table-td colspan="4">
                <direct-booking-dropdown-site-rate-actions
                  :site-rate-label="siteRates[3]"
                  @suspend="suspendDialogVisible = true"
                  @edit="editRateDialogVisible = true"
                  @copy-tool="copyToolDialogVisible = true"
                />
              </sm-table-td>
              <sm-table-td colspan="1">
                <sm-tooltip
                  placement="top"
                  :title="t('success-tooltip-text')"
                  type="success"
                >
                  <sm-tag
                    type="success"
                    size="small"
                  >
                    {{ t('added-status-text') }}
                  </sm-tag>
                </sm-tooltip>
              </sm-table-td>
              <sm-table-td colspan="1">
                <sm-popover
                  placement="top"
                  type="success"
                >
                  <sm-button class="cm-w-full">{{ siteRateExtras[siteRates[3]].name }}</sm-button>
                  <template #content>
                    <p><b>{{ t('summary-popover-heading') }}</b></p>
                    <p>{{ siteRateExtras[siteRates[3]].summary }}</p>
                    <br>
                    <p><b>{{ t('availability-popover-heading') }}</b></p>
                    <p>{{ siteRateExtras[siteRates[3]].availability }}</p>
                  </template>
                </sm-popover>
              </sm-table-td>
            </sm-table-tr>
            <sm-table-tr>
              <sm-table-td colspan="4">
                <direct-booking-dropdown-site-rate-actions
                  :site-rate-label="siteRates[4]"
                  @suspend="suspendDialogVisible = true"
                  @edit="editRateDialogVisible = true"
                  @copy-tool="copyToolDialogVisible = true"
                />
              </sm-table-td>
              <sm-table-td colspan="1">
                <sm-tooltip
                  placement="bottom"
                  :title="t('success-tooltip-text')"
                  type="warning"
                >
                  <sm-tag
                    type="success"
                    size="small"
                  >
                    {{ t('added-status-text') }}
                  </sm-tag>
                </sm-tooltip>
              </sm-table-td>
              <sm-table-td colspan="1">
                <sm-popover
                  placement="bottom"
                  type="warning"
                >
                  <sm-button class="cm-w-full">{{ siteRateExtras[siteRates[4]].name }}</sm-button>
                  <template #content>
                    <p><b>{{ t('summary-popover-heading') }}</b></p>
                    <p>{{ siteRateExtras[siteRates[4]].summary }}</p>
                    <br>
                    <p><b>{{ t('availability-popover-heading') }}</b></p>
                    <p>{{ siteRateExtras[siteRates[4]].availability }}</p>
                  </template>
                </sm-popover>
              </sm-table-td>
            </sm-table-tr>
            <sm-table-tr>
              <sm-table-td colspan="4">
                <direct-booking-dropdown-site-rate-actions
                  :site-rate-label="siteRates[5]"
                  @suspend="suspendDialogVisible = true"
                  @edit="editRateDialogVisible = true"
                  @copy-tool="copyToolDialogVisible = true"
                />
              </sm-table-td>
              <sm-table-td colspan="1">
                <sm-tooltip
                  placement="right"
                  :title="t('success-tooltip-text')"
                  type="alert"
                  :close-on-click-outside="false"
                  :show-on-top="true"
                >
                  <sm-tag
                    type="success"
                    size="small"
                  >
                    {{ t('added-status-text') }}
                  </sm-tag>
                </sm-tooltip>
              </sm-table-td>
              <sm-table-td colspan="1">
                <sm-popover
                  placement="right"
                  type="alert"
                  :close-on-click-outside="false"
                  :show-on-top="true"
                >
                  <sm-button class="cm-w-full">{{ siteRateExtras[siteRates[5]].name }}</sm-button>
                  <template #content>
                    <p><b>{{ t('summary-popover-heading') }}</b></p>
                    <p>{{ siteRateExtras[siteRates[5]].summary }}</p>
                    <br>
                    <p><b>{{ t('availability-popover-heading') }}</b></p>
                    <p>{{ siteRateExtras[siteRates[5]].availability }}</p>
                  </template>
                </sm-popover>
              </sm-table-td>
            </sm-table-tr>
          </sm-table-tbody>
        </sm-table>
      </sm-section>

      <h2 v-show="!csvData">{{ t('import-site-types-heading-text') }}</h2>
      <sm-section v-show="!csvData">
        <sm-media
          data-sm-test-id="media-empty"
          :accept-mime="['text/csv']"
          :multiple="false"
          @filesAdded="handleCsvUpload"
        >
          <template #empty>
            <sm-404-page
              :full-page="false"
              :responsive="false"
            >
              <template #image>
                <img
                  width="200"
                  height="200"
                  role="presentation"
                  src="https://sui-assets.siteminder.com/sm/illu-md/illu-md-loading.svg"
                >
              </template>
              <template #header>
                <h3>{{ t('upload-csv-empty-state-header') }}</h3>
              </template>
              <template #description>
                {{ t('upload-csv-description-text') }}
              </template>
              <template #actions>
                <sm-button
                  type="primary"
                  @click="openSysUpload(0)"
                >
                  {{ t('upload-csv-button-text') }}
                </sm-button>
              </template>
            </sm-404-page>
            <br>
          </template>
        </sm-media>
      </sm-section>

      <h2>{{ t('media-library-heading-text') }}</h2>
      <sm-section>
        <h3>{{ siteTypes[0] }}</h3>
        <sm-media
          :accept-mime="acceptMime"
          :images.sync="singleTentImages"
          group="group1"
          data-sm-test-id="media-single-tent"
          @filesAdded="uploadedFiles($event, siteTypes[0])"
        >
          <sm-media-item
            v-for="(image, index) in singleTentImages"
            :key="image.src"
            :data-sm-test-id="'media-single-tent-item-' + index"
            :src="image.src"
            :is-selectable="true"
            :selected="selectedSingleTentImages.includes(image.src)"
            @selected="selectedItemHandler(image.src, true)"
            @un-selected="selectedItemHandler(image.src, false)"
          >
            <sm-button
              shape="square"
              :aria-label="t('edit-media-item-aria-label')"
              @click="editTentImageHandler(image.src)"
            >
              <sm-icon
                name="action-edit"
                aria-hidden="true"
              />
            </sm-button>
          </sm-media-item>
        </sm-media>
        <ul>
          <li
            v-for="image in singleTentImages"
            :key="image.src"
          >
            {{ image }} {{ selectedSingleTentImages.some(item => item === image.src) ? '(Selected)' : '' }}
          </li>
        </ul>
      </sm-section>

      <sm-section>
        <h3>{{ siteTypes[1] }}</h3>
        <sm-media
          :accept-mime="acceptMime"
          :images.sync="doubleTentImages"
          group="group1"
          data-sm-test-id="media-double-tent"
          :empty-state-drop="true"
          @filesAdded="uploadedFiles($event, siteTypes[1])"
        >
          <sm-media-item
            v-for="image in doubleTentImages"
            :key="image.src"
            :src="image.src"
          >
            <sm-button
              shape="square"
              :aria-label="t('edit-media-item-aria-label')"
              @click="editTentImageHandler(image.src)"
            >
              <sm-icon
                name="action-edit"
                aria-hidden="true"
              />
            </sm-button>
          </sm-media-item>

          <template #empty>
            <sm-404-page
              :full-page="false"
              :responsive="false"
            >
              <template #image>
                <img
                  width="200"
                  height="200"
                  role="presentation"
                  src="https://sui-assets.siteminder.com/sm/illu-md/illu-md-media.svg"
                >
              </template>
              <template #header>
                <h3>{{ t('upload-images-empty-state-header') }}</h3>
              </template>
              <template #description>
                {{ t('upload-images-recommended-size-text') }}
              </template>
              <template #actions>
                <sm-button
                  type="primary"
                  @click="openSysUpload(2)"
                >
                  {{ t('upload-images-button-text') }}
                </sm-button>
              </template>
            </sm-404-page>
            <br>
          </template>
        </sm-media>
      </sm-section>

      <sm-dialog
        :visible.sync="editRateDialogVisible"
        :title="t('edit-rate-dialog-title')"
        :body-content="t('edit-rate-dialog-body-text')"
        :fullscreen="true"
      >
        <template #footer>
          <sm-button
            type="primary"
            suffix-icon="arrow-go-forward"
            @click="editRateDialogVisible = false"
          >
            {{ t('edit-rate-dialog-button-text') }}
          </sm-button>
        </template>
      </sm-dialog>

      <sm-dialog
        :visible.sync="copyToolDialogVisible"
        :title="t('copy-tool-dialog-title')"
        :body-content="t('copy-tool-dialog-body-text')"
        :cancel-button-disabled="true"
        :confirm-button-disabled="true"
        :confirm-button-loading="true"
      />

      <sm-dialog
        :visible.sync="suspendDialogVisible"
        type="alert"
        :title="t('suspend-direct-booking-rate-dialog-title')"
        :body-content="t('suspend-direct-booking-rate-dialog-body-text')"
      >
        <!--
          ideally downstream projects should not be using footer slot and use built-in cancel and confirm buttons.
          but we test the slot since there's lots of usages of it
        -->
        <template #footer>
          <sm-button
            type="tertiary"
            @click="suspendDialogVisible = false"
          >
            {{ t('cancel-suspend-dialog-button-text') }}
          </sm-button>
          <sm-button
            type="alert"
            @click="beforeConfirmSuspendHandler"
          >
            {{ t('suspend-dialog-button-text') }}
          </sm-button>
        </template>
      </sm-dialog>
    </sm-container>
  </sm-section>
</template>
