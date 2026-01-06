<template>
  <div class="slide-wrapper">
    <!-- TOP: Proposed filter bar -->
    <div class="slide-top">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <!-- Filter Bar -->
        <div class="filter-bar">
          <!-- Left: Filters and More Filters button -->
          <div class="filter-bar-left">
            <!-- View by Multi-Select - Always visible -->
            <SmMultiSelect
              v-model="viewBy"
              label="View by"
              name="viewBy"
              placeholder="Select view"
              class="filter-select"
              :options="viewByOptions"
              :filterable="false"
              :multiple="true"
              :collapse-tags="true"
            />

            <!-- Room Types Multi-Select - Hidden on mobile -->
            <SmMultiSelect
              v-model="roomTypes"
              label="Room types"
              name="roomTypes"
              placeholder="All room types"
              class="filter-select filter-select--hide-mobile"
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
              placeholder="All rate plans"
              class="filter-select filter-select--hide-tablet"
              :options="ratePlanOptions"
              :filterable="false"
              :multiple="true"
              :collapse-tags="true"
            />

            <!-- Room Rates Search Input - Hidden on tablet and mobile -->
            <SmInput
              v-model="roomRates"
              label="Room rates"
              placeholder="Search room rates"
              class="filter-input filter-select--hide-tablet"
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
              <!-- Room Types - Only visible on mobile -->
              <SmMultiSelect
                v-model="tempRoomTypes"
                label="Room types"
                name="roomTypes"
                placeholder="All room types"
                class="filter-select filter-select--show-mobile"
                :options="roomTypeOptions"
                :filterable="false"
                :multiple="true"
                :collapse-tags="true"
              />

              <!-- Rate Plans - Always in drawer -->
              <SmMultiSelect
                v-model="tempRatePlans"
                label="Rate plans"
                name="ratePlans"
                placeholder="All rate plans"
                class="filter-select"
                :options="ratePlanOptions"
                :filterable="false"
                :multiple="true"
                :collapse-tags="true"
              />

              <!-- Room Rates Text Input -->
              <SmInput
                v-model="tempRoomRates"
                label="Room rates"
                placeholder="Search room rates"
                class="filter-input"
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
        <img src="/images/filters/image 3.png" alt="View selector with filters and search" />
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

// Options data for multi-selects
const viewByOptions = ref([
  { label: 'All rates and availability', code: 'all-rates' },
  { label: 'Channels Plus', code: 'channels-plus' },
])

const roomTypeOptions = ref([
  { label: 'Deluxe Single Room', code: 'deluxe-single' },
  { label: 'Deluxe Studio', code: 'deluxe-studio' },
  { label: 'Deluxe Suite', code: 'deluxe-suite' },
])

const ratePlanOptions = ref([
  { label: 'Advanced Purchase', code: 'advanced-purchase' },
  { label: 'Flexible Rate', code: 'flexible' },
  { label: 'Non-Refundable', code: 'non-refundable' },
])

// Filter state - start with empty values
const viewBy = ref([])
const roomTypes = ref([])
const ratePlans = ref([])
const roomRates = ref('')
const showDrawer = ref(false)

// Temporary drawer filter state - only applies on submit
const tempRoomTypes = ref([])
const tempRatePlans = ref([])
const tempRoomRates = ref('')

// Computed
const activeFilters = computed(() => {
  const filters = []

  // View by - individual pill for each selection
  if (viewBy.value.length > 0) {
    viewBy.value.forEach(code => {
      const option = viewByOptions.value.find(opt => opt.code === code)
      filters.push({
        key: `viewBy-${code}`,
        filterKey: 'viewBy',
        filterValue: code,
        label: `View by: ${option?.label || code}`
      })
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
  // Count individual room type selections (when in drawer on mobile)
  count += roomTypes.value.length
  // Count individual rate plan selections
  count += ratePlans.value.length
  // Count room rates as 1 if text is entered
  if (roomRates.value) count++
  return count
})

// Methods
const openDrawer = () => {
  // Copy current state to temporary state when opening drawer
  tempRoomTypes.value = [...roomTypes.value]
  tempRatePlans.value = [...ratePlans.value]
  tempRoomRates.value = roomRates.value
  showDrawer.value = true
}

const clearFilter = (filter) => {
  // filter is an object with { filterKey, filterValue }
  switch(filter.filterKey) {
    case 'viewBy':
      viewBy.value = viewBy.value.filter(v => v !== filter.filterValue)
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
  viewBy.value = []
  roomTypes.value = []
  ratePlans.value = []
  roomRates.value = ''
}

const applyFilters = () => {
  // Apply temporary state to actual state
  roomTypes.value = [...tempRoomTypes.value]
  ratePlans.value = [...tempRatePlans.value]
  roomRates.value = tempRoomRates.value
  showDrawer.value = false
  console.log('Filters applied:', activeFilters.value)
}

const handleCollapseAll = () => {
  console.log('Collapse all clicked')
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';
</style>
