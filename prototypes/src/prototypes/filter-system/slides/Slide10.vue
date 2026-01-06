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
            <!-- View by Select -->
            <SmSelect
              v-model="viewBy"
              label="View by"
              name="viewBy"
              placeholder="All rates and availability"
              class="filter-select"
              :options="viewByOptions"
              :filterable="false"
            />

            <!-- Room Types Multi-Select -->
            <SmMultiSelect
              v-model="roomTypes"
              label="Room types"
              name="roomTypes"
              placeholder="Filter room types"
              class="filter-select"
              :options="roomTypeOptions"
              :filterable="false"
              :multiple="true"
              :collapse-tags="true"
            />

            <!-- Rate Plans Multi-Select -->
            <SmMultiSelect
              v-model="ratePlans"
              label="Rate plans"
              name="ratePlans"
              placeholder="Filter rate plans"
              class="filter-select"
              :options="ratePlanOptions"
              :filterable="false"
              :multiple="true"
              :collapse-tags="true"
            />

            <!-- Room Rates Search Input -->
            <SmInput
              v-model="roomRates"
              label="Room rates"
              placeholder="Search room rates"
              class="filter-input"
              suffix-icon="action-search"
            />
          </div>

          <!-- Right: Collapse all button -->
          <div class="filter-bar-right">
            <SmButton
              type="text"
              class="collapse-all-btn"
              @click="handleCollapseAll"
            >
              <SmIcon name="action-collapse-all" />
              Collapse all
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
        <img src="/images/filter-system/image 10.png" alt="Inventory filter with view by, room types, rate plans, and room rates search" />
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

// Options data for selects
const viewByOptions = ref([
  { label: 'All rates and availability', code: 'all' },
  { label: 'Rates only', code: 'rates' },
  { label: 'Availability only', code: 'availability' },
])

const roomTypeOptions = ref([
  { label: 'Deluxe Single Room', code: 'deluxe-single' },
  { label: 'Deluxe Studio', code: 'deluxe-studio' },
  { label: 'Deluxe Suite', code: 'deluxe-suite' },
])

const ratePlanOptions = ref([
  { label: 'Flexible Rate', code: 'flexible' },
  { label: 'Non-Refundable', code: 'non-refundable' },
  { label: 'Advanced Purchase', code: 'advanced-purchase' },
])

// Filter state - start with default value for viewBy
const viewBy = ref('all')
const roomTypes = ref([])
const ratePlans = ref([])
const roomRates = ref('')

// Computed
const activeFilters = computed(() => {
  const filters = []

  // View by - only show if not default
  if (viewBy.value && viewBy.value !== 'all') {
    const option = viewByOptions.value.find(opt => opt.code === viewBy.value)
    filters.push({
      key: 'viewBy',
      filterKey: 'viewBy',
      filterValue: viewBy.value,
      label: `View by: ${option?.label || viewBy.value}`
    })
  }

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

  // Rate plans - individual pill for each selection
  if (ratePlans.value.length > 0) {
    ratePlans.value.forEach(code => {
      const option = ratePlanOptions.value.find(opt => opt.code === code)
      filters.push({
        key: `ratePlans-${code}`,
        filterKey: 'ratePlans',
        filterValue: code,
        label: `Rate plans: ${option?.label || code}`
      })
    })
  }

  // Room rates - single pill for text input
  if (roomRates.value) {
    filters.push({
      key: 'roomRates',
      filterKey: 'roomRates',
      filterValue: roomRates.value,
      label: `Room rates: ${roomRates.value}`
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

// Methods
const clearFilter = (filter) => {
  switch(filter.filterKey) {
    case 'viewBy':
      viewBy.value = 'all'
      break
    case 'roomTypes':
      roomTypes.value = roomTypes.value.filter(v => v !== filter.filterValue)
      break
    case 'ratePlans':
      ratePlans.value = ratePlans.value.filter(v => v !== filter.filterValue)
      break
    case 'roomRates':
      roomRates.value = ''
      break
  }
}

const clearAllFilters = () => {
  viewBy.value = 'all'
  roomTypes.value = []
  ratePlans.value = []
  roomRates.value = ''
}

const handleCollapseAll = () => {
  console.log('Collapse all clicked')
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

.collapse-all-btn {
  align-self: flex-end;
}
</style>
