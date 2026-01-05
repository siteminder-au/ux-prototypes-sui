<template>
  <div class="slide-wrapper">
    <!-- TOP: Proposed filter bar -->
    <div class="slide-top">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <!-- Filter Bar -->
        <div class="filter-bar">
          <!-- Month and Year - Always visible -->
          <SmInput
            v-model="monthYear"
            label="Month and year"
            placeholder="Select month and year"
            class="filter-input"
            type="month"
          />

          <!-- Status Multi-Select - Always visible -->
          <SmMultiSelect
            v-model="status"
            label="Status"
            name="status"
            placeholder="All statuses"
            class="filter-select"
            :options="statusOptions"
            :filterable="false"
            :multiple="true"
            :collapse-tags="true"
          />

          <!-- Booking Reference Search - Hidden on tablet and mobile -->
          <SmInput
            v-model="bookingReference"
            label="Booking reference"
            placeholder="Enter booking reference"
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

          <!-- Search Button - Always visible -->
          <SmButton
            type="primary"
            class="search-btn"
            @click="handleSearch"
          >
            Search
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
              <!-- Booking Reference - Only visible on tablet and mobile -->
              <SmInput
                v-model="tempBookingReference"
                label="Booking reference"
                placeholder="Enter booking reference"
                class="filter-input"
              />

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

              <!-- Invoicing Method Multi-Select -->
              <SmMultiSelect
                v-model="tempInvoicingMethod"
                label="Invoicing method"
                name="invoicingMethod"
                placeholder="All methods"
                class="filter-select"
                :options="invoicingMethodOptions"
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
        <img src="/images/filter-system/image 5.png" alt="Month/year selector with comprehensive filters" />
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
const statusOptions = ref([
  { label: 'Booked', code: 'booked' },
  { label: 'Booked | Adjusted', code: 'booked-adjusted' },
  { label: 'Cancelled', code: 'cancelled' },
])

const channelOptions = ref([
  { label: 'Airbnb', code: 'airbnb' },
  { label: 'Booking.com', code: 'booking' },
  { label: 'Expedia', code: 'expedia' },
  { label: 'Direct booking', code: 'direct' },
])

const invoicingMethodOptions = ref([
  { label: 'Gross', code: 'gross' },
  { label: 'Net - prepaid commission', code: 'net-prepaid' },
])

// Filter state - start with empty values
const monthYear = ref('')
const status = ref([])
const bookingReference = ref('')
const channels = ref([])
const invoicingMethod = ref([])
const showDrawer = ref(false)

// Temporary drawer filter state - only applies on submit
const tempBookingReference = ref('')
const tempChannels = ref([])
const tempInvoicingMethod = ref([])

// Computed
const activeFilters = computed(() => {
  const filters = []

  // Month and year - single pill for date input
  if (monthYear.value) {
    filters.push({
      key: 'monthYear',
      filterKey: 'monthYear',
      filterValue: monthYear.value,
      label: `Month and year: ${monthYear.value}`
    })
  }

  // Status - individual pill for each selection
  if (status.value.length > 0) {
    status.value.forEach(code => {
      const option = statusOptions.value.find(opt => opt.code === code)
      filters.push({
        key: `status-${code}`,
        filterKey: 'status',
        filterValue: code,
        label: `Status: ${option?.label || code}`
      })
    })
  }

  // Booking reference - single pill for text input
  if (bookingReference.value) {
    filters.push({
      key: 'bookingReference',
      filterKey: 'bookingReference',
      filterValue: bookingReference.value,
      label: `Booking reference: ${bookingReference.value}`
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

  // Invoicing method - individual pill for each selection
  if (invoicingMethod.value.length > 0) {
    invoicingMethod.value.forEach(code => {
      const option = invoicingMethodOptions.value.find(opt => opt.code === code)
      filters.push({
        key: `invoicingMethod-${code}`,
        filterKey: 'invoicingMethod',
        filterValue: code,
        label: `Invoicing method: ${option?.label || code}`
      })
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

const moreFiltersCount = computed(() => {
  let count = 0
  // Count booking reference as 1 if text is entered
  if (bookingReference.value) count++
  // Count individual channel selections
  count += channels.value.length
  // Count individual invoicing method selections
  count += invoicingMethod.value.length
  return count
})

// Methods
const openDrawer = () => {
  // Copy current state to temporary state when opening drawer
  tempBookingReference.value = bookingReference.value
  tempChannels.value = [...channels.value]
  tempInvoicingMethod.value = [...invoicingMethod.value]
  showDrawer.value = true
}

const clearFilter = (filter) => {
  switch(filter.filterKey) {
    case 'monthYear':
      monthYear.value = ''
      break
    case 'status':
      status.value = status.value.filter(v => v !== filter.filterValue)
      break
    case 'bookingReference':
      bookingReference.value = ''
      break
    case 'channels':
      channels.value = channels.value.filter(v => v !== filter.filterValue)
      break
    case 'invoicingMethod':
      invoicingMethod.value = invoicingMethod.value.filter(v => v !== filter.filterValue)
      break
  }
}

const clearAllFilters = () => {
  monthYear.value = ''
  status.value = []
  bookingReference.value = ''
  channels.value = []
  invoicingMethod.value = []
}

const applyFilters = () => {
  // Apply temporary state to actual state
  bookingReference.value = tempBookingReference.value
  channels.value = [...tempChannels.value]
  invoicingMethod.value = [...tempInvoicingMethod.value]
  showDrawer.value = false
  console.log('Filters applied:', activeFilters.value)
}

const handleSearch = () => {
  console.log('Search clicked with filters:', activeFilters.value)
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

.search-btn {
  height: 40px;
  align-self: flex-end;
}
</style>
