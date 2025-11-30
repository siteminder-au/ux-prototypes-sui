<script setup lang="ts">
import { useTranslate } from '@/composables/use-translate'
import { ref } from 'vue'
import BookingPerformanceFilters from './booking-performance-filters.vue'

const { t } = useTranslate('views.insights.booking-performance')

const activeTab = ref(0)
</script>

<template>
  <sm-section>
    <sm-container :full-width="true">
      <sm-page-title :title="t(('page-title'))">
        <template #actions>
          <sm-button
            type="text"
            prefix-icon="action-download"
          >
            {{ t('buttons.download-csv') }}
          </sm-button>
        </template>
      </sm-page-title>

      <p>{{ t('page-description') }}</p>

      <booking-performance-filters />

      <sm-tabs
        :active-tab.sync="activeTab"
        :show-underline="true"
      >
        <sm-tab
          :label="t(('tabs.source-market'))"
          prefix-icon="section-languages"
        >
          <sm-section>
            <p class="cm-font-bold">
              {{ t('charts.bookings-by-country') }}
            </p>
            <div class="chart" />
          </sm-section>
        </sm-tab>

        <sm-tab
          :label="t(('tabs.channel-mix'))"
          prefix-icon="products-distribution"
        >
          <sm-section>
            <p class="cm-font-bold">{{ t('charts.room-nights-by-channel') }}</p>
          </sm-section>
        </sm-tab>

        <sm-tab
          :label="t(('tabs.room-type'))"
          prefix-icon="section-room-types"
        >
          <sm-section>
            <p class="cm-font-bold">{{ t('charts.room-nights-by-room-type') }}</p>
          </sm-section>
        </sm-tab>

        <sm-tab
          prefix-icon="section-rate-plans"
          :label="t(('tabs.rate-plan'))"
          :disabled="true"
        />
      </sm-tabs>
    </sm-container>
  </sm-section>
</template>
