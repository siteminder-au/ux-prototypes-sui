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
            <!-- View by Select - Always visible -->
            <SmSelect
              v-model="viewBy"
              label="View by"
              name="viewBy"
              placeholder="All rates and availability"
              class="filter-select"
              :options="viewByOptions"
              :filterable="false"
            />

            <!-- Room Types Multi-Select - Hidden on tablet and mobile -->
            <SmMultiSelect
              v-model="roomTypes"
              label="Room types"
              name="roomTypes"
              placeholder="Filter room types"
              class="filter-select filter-select--hide-tablet"
              :options="roomTypeOptions"
              :filterable="false"
              :multiple="true"
              :collapse-tags="true"
            />

            <!-- Rate Plans Multi-Select - Hidden on tablet and mobile -->
            <SmMultiSelect
              v-model="ratePlans"
              label="Rate plans"
              name="ratePlans"
              placeholder="Filter rate plans"
              class="filter-select filter-select--hide-tablet"
              :options="ratePlanOptions"
              :filterable="false"
              :multiple="true"
              :collapse-tags="true"
            />

            <!-- Room Rates Search Input - Always visible -->
            <SmInput
              v-model="roomRates"
              label="Room rates"
              placeholder="Search room rates"
              class="filter-input"
              suffix-icon="action-search"
            />

            <!-- More Filters Icon Button - Only visible on tablet and mobile -->
            <SmButton
              type="tertiary"
              class="more-filters-btn filter-select--show-tablet"
              @click="openDrawer"
              :aria-label="`More Filters${moreFiltersCount > 0 ? ` (${moreFiltersCount} active)` : ''}`"
            >
              <SmIcon name="action-filter" />
              <SmBadge v-if="moreFiltersCount > 0" type="info" size="medium" class="filter-badge">
                {{ moreFiltersCount }}
              </SmBadge>
            </SmButton>
          </div>

          <!-- Right: Collapse all button -->
          <div class="filter-bar-right">
            <SmButton
              type="text"
              class="collapse-all-btn"
              @click="handleCollapseAll"
            >
              <SmIcon name="action-collapse" />
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

          <!-- More Filters Drawer -->
          <SmDrawer
            v-model:visible="showDrawer"
            :action-buttons-visible="true"
            :close-on-click-modal="true"
            :close-on-press-escape="true"
            content-class="sm-drawer__fixed-width"
          >
            <template #title>
              <h2>Filters</h2>
            </template>

            <template #actions="{ close }">
              <SmButton type="tertiary" @click="close">Cancel</SmButton>
              <SmButton type="primary" @click="applyFilters">Apply Filters</SmButton>
            </template>

            <template #mobile-actions="{ close }">
              <SmButton type="tertiary" @click="close">Cancel</SmButton>
              <SmButton type="primary" @click="applyFilters">Apply Filters</SmButton>
            </template>

            <!-- Drawer Body -->
            <div class="drawer-filters">
              <!-- Room Types Multi-Select -->
              <SmMultiSelect
                v-model="tempRoomTypes"
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
                v-model="tempRatePlans"
                label="Rate plans"
                name="ratePlans"
                placeholder="Filter rate plans"
                class="filter-select"
                :options="ratePlanOptions"
                :filterable="false"
                :multiple="true"
                :collapse-tags="true"
              />
            </div>
          </SmDrawer>
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
const showDrawer = ref(false)

// Temporary drawer filter state - only applies on submit
const tempRoomTypes = ref([])
const tempRatePlans = ref([])

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

const moreFiltersCount = computed(() => {
  let count = 0
  count += roomTypes.value.length
  count += ratePlans.value.length
  return count
})

// Methods
const openDrawer = () => {
  // Copy current state to temporary state when opening drawer
  tempRoomTypes.value = [...roomTypes.value]
  tempRatePlans.value = [...ratePlans.value]
  showDrawer.value = true
}

const applyFilters = () => {
  // Apply temporary state to actual state
  roomTypes.value = [...tempRoomTypes.value]
  ratePlans.value = [...tempRatePlans.value]
  showDrawer.value = false
}
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

.more-filters-btn {
  align-self: flex-end;
}
</style>
