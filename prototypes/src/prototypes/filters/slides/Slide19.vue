<template>
  <div class="slide-wrapper">
    <!-- TOP: Proposed filter bar -->
    <div class="slide-top">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <!-- Filter Bar -->
        <div class="filter-bar">
          <!-- Stay Date Calendar -->
          <SmCalendar
            v-model="stayDate"
            label="Stay date"
            name="stayDate"
            class="filter-calendar"
            :range="true"
            placeholder="19 Sep 2025 - 19 Oct 2025"
          />

          <!-- Comparison Select -->
          <SmSelect
            v-model="comparison"
            label="Comparison"
            name="comparison"
            placeholder="Last year"
            class="filter-select"
            :options="comparisonOptions"
            :filterable="false"
          />

          <!-- Same Day of Week Select -->
          <SmSelect
            v-model="sameDayOfWeek"
            label=""
            name="sameDayOfWeek"
            placeholder="Same day of the week"
            class="filter-select"
            :options="sameDayOptions"
            :filterable="false"
          />

          <!-- View Radio Group -->
          <SmRadioGroup
            label="View"
            name="view"
            class="filter-radio-group"
            :is-button-style-group="true"
          >
            <SmRadioButton name="view" selected-value="reservation-revenue" label="Reservation revenue" v-model="view" />
            <SmRadioButton name="view" selected-value="adr" label="ADR" v-model="view" />
          </SmRadioGroup>

          <!-- Active Filters Pills -->
          <ActiveFiltersPills
            v-if="hasActiveFilters"
            :active-filters="activeFilters"
            @clear-filter="clearFilter"
            @clear-all="clearAllFilters"
          />
        </div>
      </div>
    </div>

    <!-- BOTTOM: Reference images -->
    <div class="slide-bottom">
      <div class="container-header">Reference</div>
      <div class="container-content">
        <img src="/images/filters/image 19.png" alt="Pace with date pickers, comparison filters, and radio button view toggle" />
      </div>
    </div>

    <!-- Settings Panel -->
    <PrototypeSettings>
      <DisplaySettings />
    </PrototypeSettings>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ActiveFiltersPills from '../components/ActiveFiltersPills.vue'
import PrototypeSettings from '@/shared/components/PrototypeSettings.vue'
import DisplaySettings from '@/shared/components/DisplaySettings.vue'

// Options data
const comparisonOptions = ref([
  { label: 'Last year', code: 'last-year' },
  { label: 'Last month', code: 'last-month' },
  { label: 'Last week', code: 'last-week' },
])

const sameDayOptions = ref([
  { label: 'Same day of the week', code: 'same-day' },
  { label: 'Same day of the month', code: 'same-day-month' },
])

// Filter state
const stayDate = ref(null)
const comparison = ref('last-year')
const sameDayOfWeek = ref('same-day')
const view = ref('reservation-revenue')

// Computed
const activeFilters = computed(() => {
  const filters = []

  // View - don't show as pill since it's always visible in the filter bar
  // (radio button groups should not create active filter pills)

  if (stayDate.value) {
    const dateLabel = Array.isArray(stayDate.value)
      ? `${stayDate.value[0]} - ${stayDate.value[1]}`
      : stayDate.value
    filters.push({
      key: 'stayDate',
      filterKey: 'stayDate',
      filterValue: stayDate.value,
      label: `Stay date: ${dateLabel}`
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

// Methods
const clearFilter = (filter) => {
  if (filter.filterKey === 'stayDate') {
    stayDate.value = null
  }
}

const clearAllFilters = () => {
  stayDate.value = null
  comparison.value = 'last-year'
  sameDayOfWeek.value = 'same-day'
  // Keep view at default
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

.filter-radio-group {
  align-self: flex-end;
}
</style>
