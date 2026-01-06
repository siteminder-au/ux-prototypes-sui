<template>
  <div class="slide-wrapper">
    <!-- TOP: Proposed filter bar -->
    <div class="slide-top">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <!-- Filter Bar -->
        <div class="filter-bar">
          <!-- Promotion Code Search Input -->
          <SmInput
            v-model="searchQuery"
            label="Search promotion code"
            placeholder="Search promotion code"
            class="filter-input"
            suffix-icon="action-search"
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
        <img src="/images/filter-system/image 12.png" alt="Promotion codes with search input" />
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

// Filter state
const searchQuery = ref('')

// Computed
const activeFilters = computed(() => {
  const filters = []

  if (searchQuery.value) {
    filters.push({
      key: 'searchQuery',
      filterKey: 'searchQuery',
      filterValue: searchQuery.value,
      label: `Search: ${searchQuery.value}`
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

// Methods
const clearFilter = (filter) => {
  if (filter.filterKey === 'searchQuery') {
    searchQuery.value = ''
  }
}

const clearAllFilters = () => {
  searchQuery.value = ''
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';
</style>
