<template>
  <div class="slide-wrapper">
    <!-- TOP: Proposed filter bar -->
    <div class="slide-top">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <!-- Filter Bar -->
        <div class="filter-bar">
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

          <!-- Rate Plans Multi-Select -->
          <SmMultiSelect
            v-model="ratePlans"
            label="Rate plans"
            name="ratePlans"
            placeholder="All rate plans"
            class="filter-select"
            :options="ratePlanOptions"
            :filterable="false"
            :multiple="true"
            :collapse-tags="true"
          />

          <!-- More Filters Icon Button -->
          <div class="more-filters-container">
            <SmButton
              shape="square"
              type="tertiary"
              class="more-filters-btn"
              @click="openDrawer"
              :aria-label="`More Filters${moreFiltersCount > 0 ? ` (${moreFiltersCount} active)` : ''}`"
            >
              <SmIcon name="action-filter" />
            </SmButton>
            <SmBadge v-if="moreFiltersCount > 0" type="info" size="small" class="filter-badge">
              {{ moreFiltersCount }}
            </SmBadge>
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
            <template #header>
              <div class="sm-drawer__header-section sm-drawer__header-section--title">
                <h2>More Filters</h2>
                <p class="drawer-page-subtitle" v-if="moreFiltersCount > 0">
                  {{ moreFiltersCount }} {{ moreFiltersCount === 1 ? 'filter' : 'filters' }} active
                </p>
              </div>
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
              <!-- Channels Multi-Select -->
              <SmMultiSelect
                v-model="tempChannels"
                label="Channels"
                name="channels"
                placeholder="All channels"
                class="filter-select"
                :options="channelOptions"
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

              <!-- Occupancy Based Pricing Multi-Select -->
              <SmMultiSelect
                v-model="tempOccupancyPricing"
                label="Occupancy based pricing"
                name="occupancyPricing"
                placeholder="Select occupancy"
                class="filter-select"
                :options="occupancyPricingOptions"
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
        <img src="/images/filter-system/image 1.png" alt="Standard filter system overview" />
        <img src="/images/filter-system/active-filters.png" alt="Active filters display" />
        <img src="/images/filter-system/image 18.png" alt="Filter system with modal" />
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

const channelOptions = ref([
  { label: 'Airbnb', code: 'airbnb' },
  { label: 'Booking.com', code: 'booking' },
  { label: 'Expedia', code: 'expedia' },
  { label: 'Direct booking', code: 'direct' },
])

const occupancyPricingOptions = ref([
  { label: '1 adult', code: '1-adult' },
  { label: '2 adults', code: '2-adults' },
  { label: '3 adults', code: '3-adults' },
  { label: '4 adults', code: '4-adults' },
])

// Filter state - start with empty values
const roomTypes = ref([])
const ratePlans = ref([])
const channels = ref([])
const roomRates = ref('')
const occupancyPricing = ref([])
const showDrawer = ref(false)

// Temporary drawer filter state - only applies on submit
const tempChannels = ref([])
const tempRoomRates = ref('')
const tempOccupancyPricing = ref([])

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

  // Channels - individual pill for each selection
  if (channels.value.length > 0) {
    channels.value.forEach(code => {
      const option = channelOptions.value.find(opt => opt.code === code)
      filters.push({
        key: `channels-${code}`,
        filterKey: 'channels',
        filterValue: code,
        label: `Channels: ${option?.label || code}`
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

  // Occupancy pricing - individual pill for each selection
  if (occupancyPricing.value.length > 0) {
    occupancyPricing.value.forEach(code => {
      const option = occupancyPricingOptions.value.find(opt => opt.code === code)
      filters.push({
        key: `occupancyPricing-${code}`,
        filterKey: 'occupancyPricing',
        filterValue: code,
        label: `Occupancy based pricing: ${option?.label || code}`
      })
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

const moreFiltersCount = computed(() => {
  let count = 0
  if (channels.value.length > 0) count++
  if (roomRates.value) count++
  if (occupancyPricing.value.length > 0) count++
  return count
})

// Methods
const openDrawer = () => {
  // Copy current state to temporary state when opening drawer
  tempChannels.value = [...channels.value]
  tempRoomRates.value = roomRates.value
  tempOccupancyPricing.value = [...occupancyPricing.value]
  showDrawer.value = true
}

const clearFilter = (filter) => {
  // filter is an object with { filterKey, filterValue }
  switch(filter.filterKey) {
    case 'roomTypes':
      roomTypes.value = roomTypes.value.filter(v => v !== filter.filterValue)
      break
    case 'ratePlans':
      ratePlans.value = ratePlans.value.filter(v => v !== filter.filterValue)
      break
    case 'channels':
      channels.value = channels.value.filter(v => v !== filter.filterValue)
      break
    case 'roomRates':
      roomRates.value = ''
      break
    case 'occupancyPricing':
      occupancyPricing.value = occupancyPricing.value.filter(v => v !== filter.filterValue)
      break
  }
}

const clearAllFilters = () => {
  roomTypes.value = []
  ratePlans.value = []
  channels.value = []
  roomRates.value = ''
  occupancyPricing.value = []
}

const applyFilters = () => {
  // Apply temporary state to actual state
  channels.value = [...tempChannels.value]
  roomRates.value = tempRoomRates.value
  occupancyPricing.value = [...tempOccupancyPricing.value]
  showDrawer.value = false
  console.log('Filters applied:', activeFilters.value)
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';
</style>
