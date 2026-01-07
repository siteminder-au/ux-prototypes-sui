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
            <!-- Stay Date - Always visible -->
            <SmDatePicker
              v-model="stayDate"
              label="Stay date"
              name="stayDate"
              class="filter-calendar"
              :is-range="true"
              :columns="2"
              startDatePlaceholder="Start date"
              endDatePlaceholder="End date"
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

            <!-- Compare by Select - Hidden on tablet and mobile -->
            <SmSelect
              v-model="sameDayOfWeek"
              label="Compare by"
              name="sameDayOfWeek"
              placeholder="Same day of the week"
              class="filter-select filter-select--hide-tablet"
              :options="sameDayOptions"
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
              <!-- Comparison - Only show in drawer on tablet and mobile -->
              <SmSelect
                v-model="tempComparison"
                label="Comparison"
                name="comparison"
                placeholder="Last year"
                class="filter-select drawer-field--tablet-only"
                :options="comparisonOptions"
                :filterable="false"
              />

              <!-- Compare by - Only show in drawer on tablet and mobile -->
              <SmSelect
                v-model="tempSameDayOfWeek"
                label="Compare by"
                name="sameDayOfWeek"
                placeholder="Same day of the week"
                class="filter-select drawer-field--tablet-only"
                :options="sameDayOptions"
                :filterable="false"
              />

              <!-- Booked-on Period Select -->
              <SmSelect
                v-model="tempBookedOnPeriod"
                label="Booked-on period"
                name="bookedOnPeriod"
                placeholder="Bookings made this year to date"
                class="filter-select"
                :options="bookedOnPeriodOptions"
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
        <img src="/images/filters/image 19.png" alt="Pace with date pickers, comparison filters, and radio button view toggle" />
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
const comparisonOptions = ref([
  { label: 'Last year', code: 'last-year' },
  { label: 'Last month', code: 'last-month' },
  { label: 'Last week', code: 'last-week' },
])

const sameDayOptions = ref([
  { label: 'Same day of the week', code: 'same-day' },
  { label: 'Same day of the month', code: 'same-day-month' },
])

const bookedOnPeriodOptions = ref([
  { label: 'Bookings made all time', code: 'all-time' },
  { label: 'Bookings made this year to date', code: 'year-to-date' },
  { label: 'Bookings made this month', code: 'this-month' },
  { label: 'Bookings made yesterday', code: 'yesterday' },
  { label: 'Bookings made during a custom date range', code: 'custom-range' },
])

// Filter state
const stayDate = ref(null)
const comparison = ref('last-year')
const sameDayOfWeek = ref('same-day')
const bookedOnPeriod = ref('year-to-date')

// Drawer state
const showDrawer = ref(false)
const tempComparison = ref('last-year')
const tempSameDayOfWeek = ref('same-day')
const tempBookedOnPeriod = ref('year-to-date')

// Computed
const activeFilters = computed(() => {
  const filters = []

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

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

const moreFiltersCount = computed(() => {
  let count = 0
  // Count fields that are hidden on tablet/mobile
  if (comparison.value !== 'last-year') count++
  if (sameDayOfWeek.value !== 'same-day') count++
  // Count drawer-only field
  if (bookedOnPeriod.value !== 'year-to-date') count++
  return count
})

// Methods
const openDrawer = () => {
  tempComparison.value = comparison.value
  tempSameDayOfWeek.value = sameDayOfWeek.value
  tempBookedOnPeriod.value = bookedOnPeriod.value
  showDrawer.value = true
}

const applyFilters = () => {
  comparison.value = tempComparison.value
  sameDayOfWeek.value = tempSameDayOfWeek.value
  bookedOnPeriod.value = tempBookedOnPeriod.value
  showDrawer.value = false
}

const clearFilter = (filter) => {
  if (filter.filterKey === 'stayDate') {
    stayDate.value = null
  }
}

const clearAllFilters = () => {
  stayDate.value = null
  comparison.value = 'last-year'
  sameDayOfWeek.value = 'same-day'
  bookedOnPeriod.value = 'year-to-date'
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';
</style>
