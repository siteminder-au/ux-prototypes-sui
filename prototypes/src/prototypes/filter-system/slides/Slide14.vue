<template>
  <div class="slide-wrapper">
    <!-- TOP: Proposed filter bar -->
    <div class="slide-top">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <!-- Filter Bar -->
        <div class="filter-bar">
          <!-- Sort By Select -->
          <SmSelect
            v-model="sortBy"
            label="Sort by"
            name="sortBy"
            placeholder="Select sort option"
            class="filter-select"
            :options="sortByOptions"
            :filterable="false"
          />

          <!-- Filter By Multi-Select -->
          <SmMultiSelect
            v-model="filterBy"
            label="Filter by"
            name="filterBy"
            placeholder="All plugins"
            class="filter-select"
            :options="filterByOptions"
            :filterable="false"
            :multiple="true"
            :collapse-tags="true"
          />

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
        <img src="/images/filter-system/image 14.png" alt="Direct booking plug-ins with sort and filter dropdowns" />
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
const sortByOptions = ref([
  { label: 'Name (A-Z)', code: 'name-asc' },
  { label: 'Name (Z-A)', code: 'name-desc' },
  { label: 'Recently added', code: 'recent' },
])

const filterByOptions = ref([
  { label: 'Analytics', code: 'analytics' },
  { label: 'Marketing', code: 'marketing' },
  { label: 'Booking', code: 'booking' },
  { label: 'Conversion', code: 'conversion' },
])

// Filter state
const sortBy = ref('')
const filterBy = ref([])

// Computed
const activeFilters = computed(() => {
  const filters = []

  // Sort by - single pill if selected
  if (sortBy.value) {
    const option = sortByOptions.value.find(opt => opt.code === sortBy.value)
    filters.push({
      key: 'sortBy',
      filterKey: 'sortBy',
      filterValue: sortBy.value,
      label: `Sort by: ${option?.label || sortBy.value}`
    })
  }

  // Filter by - individual pill for each selection
  if (filterBy.value.length > 0) {
    filterBy.value.forEach(code => {
      const option = filterByOptions.value.find(opt => opt.code === code)
      filters.push({
        key: `filterBy-${code}`,
        filterKey: 'filterBy',
        filterValue: code,
        label: `Filter by: ${option?.label || code}`
      })
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

// Methods
const clearFilter = (filter) => {
  switch(filter.filterKey) {
    case 'sortBy':
      sortBy.value = ''
      break
    case 'filterBy':
      filterBy.value = filterBy.value.filter(v => v !== filter.filterValue)
      break
  }
}

const clearAllFilters = () => {
  sortBy.value = ''
  filterBy.value = []
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';
</style>
