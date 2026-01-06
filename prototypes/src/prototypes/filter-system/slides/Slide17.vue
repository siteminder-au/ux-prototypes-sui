<template>
  <div class="slide-wrapper">
    <!-- TOP: Proposed filter bar -->
    <div class="slide-top">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <!-- Filter Bar -->
        <div class="filter-bar">
          <!-- Left: Filters -->
          <div class="filter-bar-left">
            <!-- Show Check-ins For Select -->
            <SmSelect
              v-model="showCheckInsFor"
              label="Show check-ins for"
              name="showCheckInsFor"
              placeholder="Next 7 days"
              class="filter-select"
              :options="checkInPeriodOptions"
              :filterable="false"
            />

            <!-- Select Dates Calendar -->
            <SmCalendar
              v-model="selectDates"
              label="Select dates"
              name="selectDates"
              class="filter-calendar"
              :range="true"
              placeholder="Select date range"
            />
          </div>

          <!-- Right: Search button -->
          <div class="filter-bar-right">
            <SmButton
              type="primary"
              class="search-btn"
              @click="handleSearch"
            >
              Search
            </SmButton>
          </div>

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
        <img src="/images/filter-system/image 17.png" alt="Check-in reports with dropdowns, date picker, and search button" />
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
const checkInPeriodOptions = ref([
  { label: 'Next 7 days', code: 'next-7-days' },
  { label: 'Next 14 days', code: 'next-14-days' },
  { label: 'Next 30 days', code: 'next-30-days' },
  { label: 'Custom', code: 'custom' },
])

// Filter state
const showCheckInsFor = ref('next-7-days')
const selectDates = ref(null)

// Computed
const activeFilters = computed(() => {
  const filters = []

  if (selectDates.value) {
    const dateLabel = Array.isArray(selectDates.value)
      ? `${selectDates.value[0]} - ${selectDates.value[1]}`
      : selectDates.value
    filters.push({
      key: 'selectDates',
      filterKey: 'selectDates',
      filterValue: selectDates.value,
      label: `Select dates: ${dateLabel}`
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

// Methods
const clearFilter = (filter) => {
  if (filter.filterKey === 'selectDates') {
    selectDates.value = null
  }
}

const clearAllFilters = () => {
  showCheckInsFor.value = 'next-7-days'
  selectDates.value = null
}

const handleSearch = () => {
  console.log('Search clicked', { showCheckInsFor: showCheckInsFor.value, selectDates: selectDates.value })
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

.search-btn {
  height: 40px;
  align-self: flex-end;
}
</style>
