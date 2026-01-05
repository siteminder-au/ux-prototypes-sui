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
            <!-- Room Types Multi-Select -->
            <SmMultiSelect
              v-model="roomTypes"
              label="Room types"
              name="roomTypes"
              placeholder="All room types"
              class="filter-select"
              :options="roomTypeOptions"
              :filterable="false"
              :multiple="true"
              :collapse-tags="true"
            />
          </div>

          <!-- Right: Action buttons -->
          <div class="filter-bar-right">
            <SmButton
              type="text"
              class="expand-all-btn"
              @click="handleExpandAll"
            >
              <SmIcon name="action-expand-all" />
              Expand all
            </SmButton>
            <SmButton
              type="text"
              class="reorder-btn"
              @click="handleReorder"
            >
              <SmIcon name="action-reorder" />
              Reorder
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
        <img src="/images/filter-system/image 2.png" alt="Single filter with expand all control" />
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
const roomTypeOptions = ref([
  { label: 'Deluxe Single Room', code: 'deluxe-single' },
  { label: 'Deluxe Studio', code: 'deluxe-studio' },
  { label: 'Deluxe Suite', code: 'deluxe-suite' },
])

// Filter state
const roomTypes = ref([])

// Computed
const activeFilters = computed(() => {
  const filters = []

  // Room types - individual pill for each selection
  if (roomTypes.value.length > 0) {
    roomTypes.value.forEach(code => {
      const option = roomTypeOptions.value.find(opt => opt.code === code)
      filters.push({
        key: `roomTypes-${code}`,
        filterKey: 'roomTypes',
        filterValue: code,
        label: `Room types: ${option?.label || code}`
      })
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

// Methods
const clearFilter = (filter) => {
  if (filter.filterKey === 'roomTypes') {
    roomTypes.value = roomTypes.value.filter(v => v !== filter.filterValue)
  }
}

const clearAllFilters = () => {
  roomTypes.value = []
}

const handleExpandAll = () => {
  console.log('Expand all clicked')
}

const handleReorder = () => {
  console.log('Reorder clicked')
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';
</style>
