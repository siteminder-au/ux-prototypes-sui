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
            <!-- Booking Reference Search -->
            <SmInput
              v-model="bookingReference"
              label="Booking reference"
              placeholder="Search booking reference"
              class="filter-input"
              suffix-icon="action-search"
            />

            <!-- Date Type Select -->
            <SmSelect
              v-model="dateType"
              label="Date type"
              name="dateType"
              placeholder="Check-in"
              class="filter-select"
              :options="dateTypeOptions"
              :filterable="false"
            />

            <!-- Select Dates Calendar - Hidden on tablet and mobile -->
            <SmDatePicker
              v-model="selectDates"
              label="Select dates"
              name="selectDates"
              class="filter-calendar filter-select--hide-tablet"
              :is-range="true"
              :columns="2"
              startDatePlaceholder="Start date"
              endDatePlaceholder="End date"
            />

            <!-- More Filters Icon Button - Always visible -->
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

            <!-- Search button - At end of left group -->
            <SmButton
              type="primary"
              class="search-btn"
              @click="handleSearch"
            >
              Search
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
              <!-- Guest Last Name Search -->
              <SmInput
                v-model="tempGuestLastName"
                label="Guest last name"
                placeholder="Enter a guest last name"
                class="filter-input"
                suffix-icon="action-search"
              />

              <!-- Channels Multi-Select -->
              <SmMultiSelect
                v-model="tempChannels"
                label="Channels"
                name="channels"
                placeholder="Select channels"
                class="filter-select"
                :options="channelOptions"
                :filterable="false"
                :multiple="true"
                :collapse-tags="true"
              />

              <!-- Booking Status Multi-Select -->
              <SmMultiSelect
                v-model="tempBookingStatus"
                label="Booking status"
                name="bookingStatus"
                placeholder="Select status"
                class="filter-select"
                :options="bookingStatusOptions"
                :filterable="false"
                :multiple="true"
                :collapse-tags="true"
              />

              <!-- PMS Delivery Status Multi-Select -->
              <SmMultiSelect
                v-model="tempPmsDeliveryStatus"
                label="PMS delivery status"
                name="pmsDeliveryStatus"
                placeholder="Select PMS status"
                class="filter-select"
                :options="pmsDeliveryStatusOptions"
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
        <img src="/images/filter-system/image 16.png" alt="Reservations with filters, more filters drawer, and search button" />
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
const dateTypeOptions = ref([
  { label: 'Booked-on', code: 'booked-on' },
  { label: 'Modified-on', code: 'modified-on' },
  { label: 'Cancelled-on', code: 'cancelled-on' },
  { label: 'Check-in', code: 'check-in' },
  { label: 'Check-out', code: 'check-out' },
])

const channelOptions = ref([
  { label: 'Direct Booking', code: 'direct-booking' },
  { label: 'Altura Destination Services', code: 'altura' },
  { label: 'AsiaYo', code: 'asiayo' },
  { label: 'Bing Hotel Ads', code: 'bing' },
  { label: 'Channels Plus', code: 'channels-plus' },
  { label: 'DER Touristik', code: 'der-touristik' },
])

const bookingStatusOptions = ref([
  { label: 'Booked', code: 'booked' },
  { label: 'Modified', code: 'modified' },
  { label: 'Cancelled', code: 'cancelled' },
])

const pmsDeliveryStatusOptions = ref([
  { label: 'Pending', code: 'pending' },
  { label: 'Delivered', code: 'delivered' },
  { label: 'Failed', code: 'failed' },
])

// Filter state
const bookingReference = ref('')
const dateType = ref('check-in')
const selectDates = ref(null)
const guestLastName = ref('')
const channels = ref([])
const bookingStatus = ref([])
const pmsDeliveryStatus = ref([])
const showDrawer = ref(false)

// Temporary drawer filter state
const tempGuestLastName = ref('')
const tempChannels = ref([])
const tempBookingStatus = ref([])
const tempPmsDeliveryStatus = ref([])

// Computed
const activeFilters = computed(() => {
  const filters = []

  if (bookingReference.value) {
    filters.push({
      key: 'bookingReference',
      filterKey: 'bookingReference',
      filterValue: bookingReference.value,
      label: `Booking reference: ${bookingReference.value}`
    })
  }

  if (selectDates.value) {
    console.log('selectDates.value:', selectDates.value)
    console.log('Type:', typeof selectDates.value)
    console.log('Keys:', Object.keys(selectDates.value))

    const formatDate = (date) => {
      if (!date) return ''
      const d = new Date(date)
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const year = d.getFullYear()
      return `${month}/${day}/${year}`
    }

    let dateLabel = ''
    if (selectDates.value.start && selectDates.value.end) {
      dateLabel = `${formatDate(selectDates.value.start)} - ${formatDate(selectDates.value.end)}`
    } else if (Array.isArray(selectDates.value) && selectDates.value.length === 2) {
      dateLabel = `${formatDate(selectDates.value[0])} - ${formatDate(selectDates.value[1])}`
    } else {
      dateLabel = JSON.stringify(selectDates.value)
    }

    filters.push({
      key: 'selectDates',
      filterKey: 'selectDates',
      filterValue: selectDates.value,
      label: `Select dates: ${dateLabel}`
    })
  }

  if (guestLastName.value) {
    filters.push({
      key: 'guestLastName',
      filterKey: 'guestLastName',
      filterValue: guestLastName.value,
      label: `Guest last name: ${guestLastName.value}`
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

  // Booking status - individual pill for each selection
  if (bookingStatus.value.length > 0) {
    bookingStatus.value.forEach(code => {
      const option = bookingStatusOptions.value.find(opt => opt.code === code)
      filters.push({
        key: `bookingStatus-${code}`,
        filterKey: 'bookingStatus',
        filterValue: code,
        label: `Booking status: ${option?.label || code}`
      })
    })
  }

  // PMS delivery status - individual pill for each selection
  if (pmsDeliveryStatus.value.length > 0) {
    pmsDeliveryStatus.value.forEach(code => {
      const option = pmsDeliveryStatusOptions.value.find(opt => opt.code === code)
      filters.push({
        key: `pmsDeliveryStatus-${code}`,
        filterKey: 'pmsDeliveryStatus',
        filterValue: code,
        label: `PMS delivery status: ${option?.label || code}`
      })
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

const moreFiltersCount = computed(() => {
  let count = 0
  if (guestLastName.value) count++
  count += channels.value.length
  count += bookingStatus.value.length
  count += pmsDeliveryStatus.value.length
  return count
})

// Methods
const openDrawer = () => {
  tempGuestLastName.value = guestLastName.value
  tempChannels.value = [...channels.value]
  tempBookingStatus.value = [...bookingStatus.value]
  tempPmsDeliveryStatus.value = [...pmsDeliveryStatus.value]
  showDrawer.value = true
}

const clearFilter = (filter) => {
  switch(filter.filterKey) {
    case 'bookingReference':
      bookingReference.value = ''
      break
    case 'selectDates':
      selectDates.value = null
      break
    case 'guestLastName':
      guestLastName.value = ''
      break
    case 'channels':
      channels.value = channels.value.filter(v => v !== filter.filterValue)
      break
    case 'bookingStatus':
      bookingStatus.value = bookingStatus.value.filter(v => v !== filter.filterValue)
      break
    case 'pmsDeliveryStatus':
      pmsDeliveryStatus.value = pmsDeliveryStatus.value.filter(v => v !== filter.filterValue)
      break
  }
}

const clearAllFilters = () => {
  bookingReference.value = ''
  dateType.value = 'check-in'
  selectDates.value = null
  guestLastName.value = ''
  channels.value = []
  bookingStatus.value = []
  pmsDeliveryStatus.value = []
}

const applyFilters = () => {
  guestLastName.value = tempGuestLastName.value
  channels.value = [...tempChannels.value]
  bookingStatus.value = [...tempBookingStatus.value]
  pmsDeliveryStatus.value = [...tempPmsDeliveryStatus.value]
  showDrawer.value = false
}

const handleSearch = () => {
  console.log('Search clicked', activeFilters.value)
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

.search-btn {
  height: 40px;
  align-self: flex-end;
}
</style>
