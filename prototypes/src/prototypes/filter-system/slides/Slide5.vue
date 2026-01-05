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
            <!-- Month and Year - Always visible -->
            <SmCalendar
              v-model="monthYear"
              label="Month and year"
              name="monthYear"
              placeholder="Select month and year"
              class="filter-input"
              mode="month-year"
            />

            <!-- Status Multi-Select - Hidden on tablet and mobile -->
            <SmMultiSelect
              v-model="status"
              label="Status"
              name="status"
              placeholder="All statuses"
              class="filter-select filter-select--hide-tablet"
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

            <!-- More Filters Icon Button - Visible on mobile or always if needed -->
            <SmButton
              type="tertiary"
              class="more-filters-btn"
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
          </div>

          <!-- Right: Download CSV button -->
          <div class="filter-bar-right">
            <SmButton
              type="text"
              class="download-csv-btn"
              @click="handleDownloadCSV"
            >
              <SmIcon name="action-download" />
              Download CSV
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
              <!-- Status Multi-Select - Visible on tablet and mobile -->
              <SmMultiSelect
                v-model="tempStatus"
                label="Status"
                name="status"
                placeholder="All statuses"
                class="filter-select"
                :options="statusOptions"
                :filterable="false"
                :multiple="true"
                :collapse-tags="true"
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

              <!-- Invoicing Method Single-Select -->
              <SmSelect
                v-model="tempInvoicingMethod"
                label="Invoicing method"
                name="invoicingMethod"
                placeholder="Select method"
                class="filter-select"
                :options="invoicingMethodOptions"
                :filterable="false"
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
const monthYear = ref(null) // SmCalendar expects null or { month, year }
const status = ref([])
const bookingReference = ref('')
const channels = ref([])
const invoicingMethod = ref('') // Single select - string value
const showDrawer = ref(false)

// Temporary drawer filter state - only applies on submit
const tempStatus = ref([])
const tempBookingReference = ref('')
const tempChannels = ref([])
const tempInvoicingMethod = ref('') // Single select - string value

// Computed
const activeFilters = computed(() => {
  const filters = []

  // Month and year - single pill for date input
  if (monthYear.value) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December']
    const monthName = monthNames[monthYear.value.month - 1] || monthYear.value.month
    const displayValue = `${monthName} ${monthYear.value.year}`
    filters.push({
      key: 'monthYear',
      filterKey: 'monthYear',
      filterValue: monthYear.value,
      label: `Month and year: ${displayValue}`
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

  // Invoicing method - single pill for single selection
  if (invoicingMethod.value) {
    const option = invoicingMethodOptions.value.find(opt => opt.code === invoicingMethod.value)
    filters.push({
      key: 'invoicingMethod',
      filterKey: 'invoicingMethod',
      filterValue: invoicingMethod.value,
      label: `Invoicing method: ${option?.label || invoicingMethod.value}`
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

const moreFiltersCount = computed(() => {
  let count = 0
  // Count individual status selections (when hidden on tablet/mobile)
  count += status.value.length
  // Count individual channel selections
  count += channels.value.length
  // Count invoicing method as 1 if selected (single select)
  if (invoicingMethod.value) count++
  return count
})

// Methods
const openDrawer = () => {
  // Copy current state to temporary state when opening drawer
  tempStatus.value = [...status.value]
  tempBookingReference.value = bookingReference.value
  tempChannels.value = [...channels.value]
  tempInvoicingMethod.value = invoicingMethod.value
  showDrawer.value = true
}

const clearFilter = (filter) => {
  switch(filter.filterKey) {
    case 'monthYear':
      monthYear.value = null
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
      invoicingMethod.value = ''
      break
  }
}

const clearAllFilters = () => {
  monthYear.value = null
  status.value = []
  bookingReference.value = ''
  channels.value = []
  invoicingMethod.value = ''
}

const applyFilters = () => {
  // Apply temporary state to actual state
  status.value = [...tempStatus.value]
  bookingReference.value = tempBookingReference.value
  channels.value = [...tempChannels.value]
  invoicingMethod.value = tempInvoicingMethod.value
  showDrawer.value = false
  console.log('Filters applied:', activeFilters.value)
}

const handleSearch = () => {
  console.log('Search clicked with filters:', activeFilters.value)
}

const handleDownloadCSV = () => {
  console.log('Download CSV clicked')
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';
</style>
