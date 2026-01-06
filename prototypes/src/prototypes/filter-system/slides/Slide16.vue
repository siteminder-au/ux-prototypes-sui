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
              placeholder="Enter booking reference"
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
            <SmCalendar
              v-model="selectDates"
              label="Select dates"
              name="selectDates"
              class="filter-calendar filter-select--hide-tablet"
              :range="true"
              placeholder="29/10/2025 - 12/11/2025"
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

          <!-- Right: Search button -->
          <div class="filter-bar-right">
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
              <!-- Select Dates - Only visible on tablet and mobile -->
              <SmCalendar
                v-model="tempSelectDates"
                label="Select dates"
                name="selectDates"
                class="filter-calendar"
                :range="true"
                placeholder="29/10/2025 - 12/11/2025"
              />

              <!-- Guest Last Name Search -->
              <SmInput
                v-model="tempGuestLastName"
                label="Guest last name"
                placeholder="Enter a guest last name"
                class="filter-input"
                suffix-icon="action-search"
              />

              <!-- Channels Select -->
              <SmSelect
                v-model="tempChannels"
                label="Channels"
                name="channels"
                placeholder="Select channel"
                class="filter-select"
                :options="channelOptions"
                :filterable="false"
              />

              <!-- Booking Status Select -->
              <SmSelect
                v-model="tempBookingStatus"
                label="Booking status"
                name="bookingStatus"
                placeholder="Select status"
                class="filter-select"
                :options="bookingStatusOptions"
                :filterable="false"
              />

              <!-- PMS Delivery Status Select -->
              <SmSelect
                v-model="tempPmsDeliveryStatus"
                label="PMS delivery status"
                name="pmsDeliveryStatus"
                placeholder="Select PMS status"
                class="filter-select"
                :options="pmsDeliveryStatusOptions"
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
  { label: 'Check-in', code: 'check-in' },
  { label: 'Check-out', code: 'check-out' },
  { label: 'Booking date', code: 'booking-date' },
])

const channelOptions = ref([
  { label: 'Booking.com', code: 'booking-com' },
  { label: 'Expedia', code: 'expedia' },
  { label: 'Direct booking', code: 'direct' },
])

const bookingStatusOptions = ref([
  { label: 'Confirmed', code: 'confirmed' },
  { label: 'Pending', code: 'pending' },
  { label: 'Cancelled', code: 'cancelled' },
])

const pmsDeliveryStatusOptions = ref([
  { label: 'Delivered', code: 'delivered' },
  { label: 'Failed', code: 'failed' },
  { label: 'Pending', code: 'pending' },
])

// Filter state
const bookingReference = ref('')
const dateType = ref('check-in')
const selectDates = ref(null)
const guestLastName = ref('')
const channels = ref('')
const bookingStatus = ref('')
const pmsDeliveryStatus = ref('')
const showDrawer = ref(false)

// Temporary drawer filter state
const tempSelectDates = ref(null)
const tempGuestLastName = ref('')
const tempChannels = ref('')
const tempBookingStatus = ref('')
const tempPmsDeliveryStatus = ref('')

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
    const dateLabel = Array.isArray(selectDates.value)
      ? `${selectDates.value[0]} - ${selectDates.value[1]}`
      : selectDates.value
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

  if (channels.value) {
    const option = channelOptions.value.find(opt => opt.code === channels.value)
    filters.push({
      key: 'channels',
      filterKey: 'channels',
      filterValue: channels.value,
      label: `Channels: ${option?.label || channels.value}`
    })
  }

  if (bookingStatus.value) {
    const option = bookingStatusOptions.value.find(opt => opt.code === bookingStatus.value)
    filters.push({
      key: 'bookingStatus',
      filterKey: 'bookingStatus',
      filterValue: bookingStatus.value,
      label: `Booking status: ${option?.label || bookingStatus.value}`
    })
  }

  if (pmsDeliveryStatus.value) {
    const option = pmsDeliveryStatusOptions.value.find(opt => opt.code === pmsDeliveryStatus.value)
    filters.push({
      key: 'pmsDeliveryStatus',
      filterKey: 'pmsDeliveryStatus',
      filterValue: pmsDeliveryStatus.value,
      label: `PMS delivery status: ${option?.label || pmsDeliveryStatus.value}`
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

const moreFiltersCount = computed(() => {
  let count = 0
  if (selectDates.value) count++
  if (guestLastName.value) count++
  if (channels.value) count++
  if (bookingStatus.value) count++
  if (pmsDeliveryStatus.value) count++
  return count
})

// Methods
const openDrawer = () => {
  tempSelectDates.value = selectDates.value
  tempGuestLastName.value = guestLastName.value
  tempChannels.value = channels.value
  tempBookingStatus.value = bookingStatus.value
  tempPmsDeliveryStatus.value = pmsDeliveryStatus.value
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
      channels.value = ''
      break
    case 'bookingStatus':
      bookingStatus.value = ''
      break
    case 'pmsDeliveryStatus':
      pmsDeliveryStatus.value = ''
      break
  }
}

const clearAllFilters = () => {
  bookingReference.value = ''
  dateType.value = 'check-in'
  selectDates.value = null
  guestLastName.value = ''
  channels.value = ''
  bookingStatus.value = ''
  pmsDeliveryStatus.value = ''
}

const applyFilters = () => {
  selectDates.value = tempSelectDates.value
  guestLastName.value = tempGuestLastName.value
  channels.value = tempChannels.value
  bookingStatus.value = tempBookingStatus.value
  pmsDeliveryStatus.value = tempPmsDeliveryStatus.value
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
