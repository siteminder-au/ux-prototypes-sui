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
            <!-- Show Performance By Radio Group - Always visible -->
            <SmRadioGroup
              label="Show performance by"
              name="performanceBy"
              class="filter-radio-group"
              :is-button-style-group="true"
            >
              <SmRadioButton name="performanceBy" selected-value="booked-on-date" label="Booked-on date" v-model="performanceBy" />
              <SmRadioButton name="performanceBy" selected-value="stay-date" label="Stay date" v-model="performanceBy" />
            </SmRadioGroup>

            <!-- Stay Date Calendar - Always visible -->
            <SmDatePicker
              v-model="stayDate"
              label="Stay date"
              name="stayDate"
              class="filter-calendar filter-select--hide-tablet"
              :is-range="true"
              :columns="2"
              startDatePlaceholder="Start date"
              endDatePlaceholder="End date"
            />

            <!-- Time Period Select - Always visible -->
            <SmSelect
              v-model="timePeriod"
              label="Time period"
              name="timePeriod"
              placeholder="Month to date"
              class="filter-select filter-select--hide-tablet"
              :options="timePeriodOptions"
              :filterable="false"
            />

            <!-- Comparison Select - Hidden on tablet and mobile -->
            <SmSelect
              v-model="comparison"
              label="Comparison"
              name="comparison"
              placeholder="Last year"
              class="filter-select filter-select--hide-tablet"
              :options="comparisonOptions"
              :filterable="false"
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
              <!-- Stay Date - Only show in drawer on tablet and mobile (when hidden from main page) -->
              <SmDatePicker
                v-model="tempStayDate"
                label="Stay date"
                name="stayDate"
                class="filter-calendar drawer-field--tablet-only"
                :is-range="true"
                :columns="2"
                startDatePlaceholder="Start date"
                endDatePlaceholder="End date"
              />

              <!-- Time Period - Only show in drawer on tablet and mobile (when hidden from main page) -->
              <SmSelect
                v-model="tempTimePeriod"
                label="Time period"
                name="timePeriod"
                placeholder="Month to date"
                class="filter-select drawer-field--tablet-only"
                :options="timePeriodOptions"
                :filterable="false"
              />

              <!-- Comparison - Only show in drawer on tablet and mobile (when hidden from main page) -->
              <SmSelect
                v-model="tempComparison"
                label="Comparison"
                name="comparison"
                placeholder="Last year"
                class="filter-select drawer-field--tablet-only"
                :options="comparisonOptions"
                :filterable="false"
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

              <!-- Countries Multi-Select -->
              <SmMultiSelect
                v-model="tempCountries"
                label="Countries"
                name="countries"
                placeholder="All countries"
                class="filter-select"
                :options="countryOptions"
                :filterable="false"
                :multiple="true"
                :collapse-tags="true"
              />

              <!-- Room Types Multi-Select -->
              <SmMultiSelect
                v-model="tempRoomTypes"
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
            </div>
          </SmDrawer>
        </div>
      </div>
    </div>

    <!-- BOTTOM: Reference images -->
    <div class="slide-bottom">
      <div class="container-header">Reference</div>
      <div class="container-content">
        <img src="/images/filter-system/image 18.png" alt="Booking performance with radio group, date pickers, and more filters drawer" />
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
const timePeriodOptions = ref([
  { label: 'Month to date', code: 'month-to-date' },
  { label: 'Year to date', code: 'year-to-date' },
  { label: 'Custom dates', code: 'custom-dates' },
  { label: 'Choose month', code: 'choose-month' },
  { label: 'Tomorrow', code: 'tomorrow' },
  { label: 'Next 7 days', code: 'next-7-days' },
])

const comparisonOptions = ref([
  { label: 'Last year', code: 'last-year' },
  { label: 'Last month', code: 'last-month' },
  { label: 'Last week', code: 'last-week' },
])

const channelOptions = ref([
  { label: 'Booking.com', code: 'booking-com' },
  { label: 'Expedia', code: 'expedia' },
  { label: 'Direct booking', code: 'direct' },
])

const countryOptions = ref([
  { label: 'United States', code: 'us' },
  { label: 'United Kingdom', code: 'uk' },
  { label: 'Australia', code: 'au' },
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

// Filter state
const performanceBy = ref('booked-on-date')
const timePeriod = ref('month-to-date')
const stayDate = ref(null)
const comparison = ref('last-year')
const channels = ref([])
const countries = ref([])
const roomTypes = ref([])
const ratePlans = ref([])
const showDrawer = ref(false)

// Temporary drawer filter state
const tempStayDate = ref(null)
const tempTimePeriod = ref('month-to-date')
const tempComparison = ref('last-year')
const tempChannels = ref([])
const tempCountries = ref([])
const tempRoomTypes = ref([])
const tempRatePlans = ref([])

// Computed
const activeFilters = computed(() => {
  const filters = []

  // Performance by - don't show as pill since it's always visible in the filter bar
  // (radio button groups should not create active filter pills)

  if (stayDate.value) {
    const formatDate = (date) => {
      if (!date) return ''
      const d = new Date(date)
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const year = d.getFullYear()
      return `${month}/${day}/${year}`
    }

    let dateLabel = ''
    if (stayDate.value.start && stayDate.value.end) {
      dateLabel = `${formatDate(stayDate.value.start)} - ${formatDate(stayDate.value.end)}`
    } else if (Array.isArray(stayDate.value) && stayDate.value.length === 2) {
      dateLabel = `${formatDate(stayDate.value[0])} - ${formatDate(stayDate.value[1])}`
    } else {
      dateLabel = JSON.stringify(stayDate.value)
    }

    filters.push({
      key: 'stayDate',
      filterKey: 'stayDate',
      filterValue: stayDate.value,
      label: `Stay date: ${dateLabel}`
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

  // Countries - individual pill for each selection
  if (countries.value.length > 0) {
    countries.value.forEach(code => {
      const option = countryOptions.value.find(opt => opt.code === code)
      filters.push({
        key: `countries-${code}`,
        filterKey: 'countries',
        filterValue: code,
        label: `Countries: ${option?.label || code}`
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

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

const moreFiltersCount = computed(() => {
  let count = 0
  // Count fields that are hidden on tablet/mobile
  if (stayDate.value) count++
  if (timePeriod.value !== 'month-to-date') count++
  if (comparison.value !== 'last-year') count++
  // Count multi-select fields (always in drawer)
  count += channels.value.length
  count += countries.value.length
  count += roomTypes.value.length
  count += ratePlans.value.length
  return count
})

// Methods
const openDrawer = () => {
  tempStayDate.value = stayDate.value
  tempTimePeriod.value = timePeriod.value
  tempComparison.value = comparison.value
  tempChannels.value = [...channels.value]
  tempCountries.value = [...countries.value]
  tempRoomTypes.value = [...roomTypes.value]
  tempRatePlans.value = [...ratePlans.value]
  showDrawer.value = true
}

const clearFilter = (filter) => {
  switch(filter.filterKey) {
    case 'stayDate':
      stayDate.value = null
      break
    case 'channels':
      channels.value = channels.value.filter(v => v !== filter.filterValue)
      break
    case 'countries':
      countries.value = countries.value.filter(v => v !== filter.filterValue)
      break
    case 'roomTypes':
      roomTypes.value = roomTypes.value.filter(v => v !== filter.filterValue)
      break
    case 'ratePlans':
      ratePlans.value = ratePlans.value.filter(v => v !== filter.filterValue)
      break
  }
}

const clearAllFilters = () => {
  // Keep performanceBy at default
  timePeriod.value = 'month-to-date'
  stayDate.value = null
  comparison.value = 'last-year'
  channels.value = []
  countries.value = []
  roomTypes.value = []
  ratePlans.value = []
}

const applyFilters = () => {
  stayDate.value = tempStayDate.value
  timePeriod.value = tempTimePeriod.value
  comparison.value = tempComparison.value
  channels.value = [...tempChannels.value]
  countries.value = [...tempCountries.value]
  roomTypes.value = [...tempRoomTypes.value]
  ratePlans.value = [...tempRatePlans.value]
  showDrawer.value = false
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

.filter-radio-group {
  align-self: flex-end;
}

.more-filters-btn {
  align-self: flex-end;
}
</style>
