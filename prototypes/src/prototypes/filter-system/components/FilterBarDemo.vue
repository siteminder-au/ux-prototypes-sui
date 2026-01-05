<template>
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
    />

    <!-- More Filters Icon Button -->
    <SmButton
      shape="square"
      type="tertiary"
      class="more-filters-btn"
      @click="showDrawer = true"
      :aria-label="`More Filters${moreFiltersCount > 0 ? ` (${moreFiltersCount} active)` : ''}`"
    >
      <SmIcon name="action-filter" />
      <SmBadge v-if="moreFiltersCount > 0" class="filter-badge">{{ moreFiltersCount }}</SmBadge>
    </SmButton>

    <!-- Clear All Link -->
    <SmButton
      type="text"
      class="clear-all-btn"
      @click="clearAllFilters"
      v-if="hasActiveFilters"
    >
      Clear all
    </SmButton>

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
      title="More Filters"
      :action-buttons-visible="true"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      content-class="sm-drawer__fixed-width"
    >
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
          v-model="channels"
          label="Channels"
          name="channels"
          placeholder="All channels"
          class="filter-select"
          :options="channelOptions"
          :filterable="false"
          :multiple="true"
        />

        <!-- Room Rates Text Input -->
        <SmInput
          v-model="roomRates"
          label="Room rates"
          placeholder="Search room rates"
          class="filter-input"
        />

        <!-- Occupancy Based Pricing Multi-Select -->
        <SmMultiSelect
          v-model="occupancyPricing"
          label="Occupancy based pricing"
          name="occupancyPricing"
          placeholder="Select occupancy"
          class="filter-select"
          :options="occupancyPricingOptions"
          :filterable="false"
          :multiple="true"
        />
      </div>
    </SmDrawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ActiveFiltersPills from './ActiveFiltersPills.vue'

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

// Computed
const activeFilters = computed(() => {
  const filters = {}
  if (roomTypes.value.length > 0) {
    filters.roomTypes = `${roomTypes.value.length} selected`
  }
  if (ratePlans.value.length > 0) {
    filters.ratePlans = `${ratePlans.value.length} selected`
  }
  if (channels.value.length > 0) {
    filters.channels = `${channels.value.length} selected`
  }
  if (roomRates.value) {
    filters.roomRates = roomRates.value
  }
  if (occupancyPricing.value.length > 0) {
    const labels = occupancyPricing.value.map(code =>
      occupancyPricingOptions.value.find(opt => opt.code === code)?.label || code
    )
    filters.occupancyPricing = labels.join(', ')
  }
  return filters
})

const hasActiveFilters = computed(() => Object.keys(activeFilters.value).length > 0)

const moreFiltersCount = computed(() => {
  let count = 0
  if (channels.value.length > 0) count++
  if (roomRates.value) count++
  if (occupancyPricing.value.length > 0) count++
  return count
})

// Methods
const handleReorder = () => {
  console.log('Reorder triggered')
}

const clearFilter = (filterKey) => {
  switch(filterKey) {
    case 'roomTypes': roomTypes.value = []; break
    case 'ratePlans': ratePlans.value = []; break
    case 'channels': channels.value = []; break
    case 'roomRates': roomRates.value = ''; break
    case 'occupancyPricing': occupancyPricing.value = []; break
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
  showDrawer.value = false
  console.log('Filters applied:', activeFilters.value)
}
</script>

<style scoped lang="scss">
@import '../styles/filter-system-component.scss';
</style>
