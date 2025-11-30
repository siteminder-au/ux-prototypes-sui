<script setup lang="ts">
import { ref } from 'vue'
import { useTranslate } from '@/composables/use-translate'

const { t } = useTranslate('views.insights.booking-performance-filters')
const priceRange = ref([200, 800])
const dayRange = ref([2, 40])
const overBookingNumber = ref([0, 10])
const channelNumber = ref([1, 10])
</script>

<template>
  <div class="cm-flex cm-flex-column--gap-24 cm-flex-wrap cm-mb-32">
    <sm-slider
      v-model="priceRange"
      class="cm-mb-24 cm-min-w-248"
      :min="100"
      :max="1000"
      :range="true"
      type="success"
      :label="t('booking-price-slider-label')"
    />

    <sm-slider
      v-model="dayRange"
      class="cm-mb-24 cm-min-w-248"
      :min="1"
      :max="100"
      :range="true"
      :label="t('booking-days-slider-label')"
    />
    <sm-slider
      v-model="overBookingNumber"
      class="cm-mb-24 cm-min-w-248"
      type="warning"
      :min="0"
      :max="100"
      :range="true"
      :label="t('number-of-over-booking-slider-label')"
    />
    <sm-slider
      v-model="channelNumber"
      class="cm-mb-24 cm-min-w-248"
      :min="1"
      :max="100"
      :range="true"
      :disabled="true"
      :label="t('number-of-booking-channels-slider-label')"
    />
  </div>
</template>
