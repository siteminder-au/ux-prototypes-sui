<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import image1 from '@/assets/images/image1.png'
import image2 from '@/assets/images/image2.png'
import image3 from '@/assets/images/image3.png'
import { useTranslate } from '@/composables/use-translate'

const { t } = useTranslate('views.sites-and-rates.rate-plans')

const asyncTimeout = (delay = 2000): Promise<unknown> => new Promise((resolve) => { setTimeout(resolve, delay) })

const data = ref<{ src: string, alt: string }[]>([])
const fetchImages = ref(false)
const ratePlans = [
  { name: 'New Years Special', progress: 77 },
  { name: 'Easter Special', progress: 40 },
  { name: 'Summer Special', progress: 100 },
  { name: 'Winter Special', progress: 0 },
  { name: 'Spring Special', progress: 100 },
  { name: 'Fall Special', progress: 94 },
  // { name: 'Thanksgiving Special' },
  // { name: 'Halloween Special' },
  // { name: 'Independence Day Special' },
  // { name: 'Memorial Day Special' },
  // { name: 'Labor Day Special' },
  // { name: 'Columbus Day Special' },
  // { name: 'Veterans Day Special' },
  // { name: 'Martin Luther King Jr. Day Special' },
  // { name: 'Presidents Day Special' },
  // { name: 'Mothers Day Special' },
  // { name: 'Fathers Day Special' },
  // { name: 'Black Friday Special' },
  // { name: 'Cyber Monday Special' },
]

watch(fetchImages, async () => {
  if (!fetchImages.value) {
    return
  }

  await asyncTimeout()

  data.value = [
    { src: image1, alt: 'A picture of a Campsite 1' },
    { src: image2, alt: 'A picture of a Campsite 2' },
    { src: image3, alt: 'A picture of a Campsite 3' },
    { src: image1, alt: 'A picture of a Campsite 4' },
    { src: image2, alt: 'A picture of a Campsite 5' },
    { src: image3, alt: 'A picture of a Campsite 6' },
  ]

  fetchImages.value = false
})

onMounted(() => {
  fetchImages.value = true
})

const handleRefresh = (): void => {
  data.value = []
  fetchImages.value = true
}
</script>

<template>
  <sm-section>
    <sm-container :full-width="true">
      <sm-breadcrumbs
        class="cm-mb-24"
        separator-icon="arrow-right"
      >
        <sm-breadcrumb-item :to="{ name: 'sites-and-rates' }">{{ t('sites-and-rates') }}</sm-breadcrumb-item>
        <sm-breadcrumb-item>{{ t('rate-plans-title') }}</sm-breadcrumb-item>
      </sm-breadcrumbs>

      <sm-page-title
        :title="t('rate-plans-title')"
        :sub-title="`(${ratePlans.length})`"
      >
        <template #actions>
          <sm-button
            type="primary"
            :loading="fetchImages"
            :disabled="fetchImages"
            @click="handleRefresh"
          >
            {{ t('refresh-data-button-label') }}
          </sm-button>
        </template>
      </sm-page-title>

      <sm-section>
        <sm-table
          :is-responsive="true"
          min-width="360px"
        >
          <sm-table-thead>
            <sm-table-tr>
              <sm-table-th width="100px">
                {{ t('rate-plan-table-column-header') }}
              </sm-table-th>
              <sm-table-th width="360px">
                {{ t('rate-setup-table-column-header') }}
              </sm-table-th>
              <sm-table-th width="140px">
                {{ t('status-table-column-header') }}
                <sm-tooltip
                  placement="left"
                  trigger="hover"
                  :title="t('status-table-tooltip')"
                >
                  <sm-icon
                    class="cm-disabled-dark"
                    name="utility-information-alt"
                  />
                </sm-tooltip>
              </sm-table-th>
            </sm-table-tr>
          </sm-table-thead>
          <sm-table-tbody>
            <sm-table-tr>
              <sm-table-td>
                {{ ratePlans[0].name }}
              </sm-table-td>
              <sm-table-td>
                <sm-loading-image
                  v-if="!data.length"
                  class="cm-image-container"
                />
                <div
                  v-show="data.length"
                  class="cm-image-container"
                >
                  <sm-carousel
                    :data="data"
                    height="200px"
                    :number-counter="true"
                  />
                </div>
              </sm-table-td>
              <sm-table-td>
                <div>
                  <sm-progress-bar
                    :percentage="ratePlans[0].progress"
                    :text-inside="true"
                  />
                </div>
              </sm-table-td>
            </sm-table-tr>
            <sm-table-tr>
              <sm-table-td>
                {{ ratePlans[1].name }}
              </sm-table-td>
              <sm-table-td>
                <sm-loading-image
                  v-if="!data.length"
                  class="cm-image-container"
                />
                <div
                  v-show="data.length"
                  class="cm-image-container"
                >
                  <sm-carousel
                    :data="data"
                    height="200px"
                    :number-counter="true"
                    :lazy="true"
                  />
                </div>
              </sm-table-td>
              <sm-table-td>
                <sm-progress-bar
                  status="alert"
                  :percentage="ratePlans[1].progress"
                  :text-inside="true"
                />
              </sm-table-td>
            </sm-table-tr>
            <sm-table-tr>
              <sm-table-td>
                {{ ratePlans[2].name }}
              </sm-table-td>
              <sm-table-td>
                <sm-loading-image
                  v-if="!data.length"
                  class="cm-image-container"
                />
                <div
                  v-show="data.length"
                  class="cm-image-container"
                >
                  <sm-carousel
                    :data="data"
                    height="200px"
                  />
                </div>
              </sm-table-td>
              <sm-table-td>
                <sm-progress-bar
                  status="success"
                  :percentage="ratePlans[2].progress"
                  :text-inside="true"
                />
              </sm-table-td>
            </sm-table-tr>
            <sm-table-tr>
              <sm-table-td>
                {{ ratePlans[3].name }}
              </sm-table-td>
              <sm-table-td>
                <sm-lazy-image
                  :src="image1"
                  :alt="t('lazy-image.camping-site')"
                  class="cm-image-container"
                />
              </sm-table-td>
              <sm-table-td>
                <sm-progress-bar
                  status="warning"
                  :percentage="ratePlans[3].progress"
                  :stroke-height="8"
                />
              </sm-table-td>
            </sm-table-tr>
            <sm-table-tr>
              <sm-table-td>
                {{ ratePlans[4].name }}
              </sm-table-td>
              <sm-table-td>
                <sm-lazy-image
                  type="background"
                  :src="image2"
                  :alt="t('lazy-image.camping-site')"
                  class="cm-image-container"
                />
              </sm-table-td>
              <sm-table-td>
                <sm-progress-bar
                  type="circle"
                  :percentage="ratePlans[4].progress"
                  :stroke-height="6"
                  :width="80"
                />
              </sm-table-td>
            </sm-table-tr>
            <sm-table-tr>
              <sm-table-td>
                {{ ratePlans[5].name }}
              </sm-table-td>
              <sm-table-td>
                <sm-lazy-image
                  src="not a url"
                  :alt="t('camping-site-description')"
                  class="cm-image-container"
                />
              </sm-table-td>
              <sm-table-td>
                <sm-progress-bar
                  status="warning"
                  :percentage="ratePlans[5].progress"
                  :text-inside="true"
                >
                  {{ t('status-table-error') }}
                </sm-progress-bar>
              </sm-table-td>
            </sm-table-tr>
          </sm-table-tbody>
        </sm-table>
      </sm-section>
    </sm-container>
  </sm-section>
</template>
