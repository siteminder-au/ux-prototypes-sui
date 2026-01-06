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
            <!-- Yield Rule Name Search Input - Always visible -->
            <SmInput
              v-model="yieldRuleName"
              label="Yield rule name"
              placeholder="Search yield rules"
              class="filter-input"
              suffix-icon="action-search"
            />

            <!-- Rule Types Multi-Select - Always visible -->
            <SmMultiSelect
              v-model="ruleTypes"
              label="Yield rule types"
              name="ruleTypes"
              placeholder="Filter rule types"
              class="filter-select"
              :options="ruleTypeOptions"
              :filterable="false"
              :multiple="true"
              :collapse-tags="true"
            />

            <!-- Rate Plans Multi-Select - Always visible -->
            <SmMultiSelect
              v-model="ratePlans"
              label="Rate plans"
              name="ratePlans"
              placeholder="Filter rate plans"
              class="filter-select"
              :options="ratePlanOptions"
              :filterable="false"
              :multiple="true"
              :collapse-tags="true"
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

          <!-- Right: Expand all button -->
          <div class="filter-bar-right">
            <SmButton
              type="text"
              class="expand-all-btn"
              @click="handleExpandAll"
            >
              <SmIcon name="action-expand-all" />
              Expand all
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
              <!-- Channels Multi-Select -->
              <SmMultiSelect
                v-model="tempChannels"
                label="Channel"
                name="channels"
                placeholder="Filter channels"
                class="filter-select"
                :options="channelOptions"
                :filterable="false"
                :multiple="true"
                :collapse-tags="true"
              />

              <!-- Date Range Calendar -->
              <SmCalendar
                v-model="tempDateRange"
                label="Date range"
                name="dateRange"
                class="filter-calendar"
                :range="true"
                placeholder="Select date range"
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
        <img src="/images/filters/image 9.png" alt="Yield rules filter with search, dropdowns, and more filters drawer" />
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
const ruleTypeOptions = ref([
  { label: 'Availability limit - Amount', code: 'availability-limit-amount' },
  { label: 'Availability limit - Percentage', code: 'availability-limit-percentage' },
  { label: 'Minimum stay', code: 'minimum-stay' },
])

const ratePlanOptions = ref([
  { label: 'Flexible Rate', code: 'flexible' },
  { label: 'Non-Refundable', code: 'non-refundable' },
  { label: 'Advanced Purchase', code: 'advanced-purchase' },
])

const channelOptions = ref([
  { label: 'Booking.com', code: 'booking-com' },
  { label: 'Expedia', code: 'expedia' },
  { label: 'Direct booking', code: 'direct' },
])

// Filter state - start with empty values
const yieldRuleName = ref('')
const ruleTypes = ref([])
const ratePlans = ref([])
const channels = ref([])
const dateRange = ref(null)
const showDrawer = ref(false)

// Temporary drawer filter state - only applies on submit
const tempChannels = ref([])
const tempDateRange = ref(null)

// Computed
const activeFilters = computed(() => {
  const filters = []

  // Yield rule name - single pill for text input
  if (yieldRuleName.value) {
    filters.push({
      key: 'yieldRuleName',
      filterKey: 'yieldRuleName',
      filterValue: yieldRuleName.value,
      label: `Yield rule name: ${yieldRuleName.value}`
    })
  }

  // Rule types - individual pill for each selection
  if (ruleTypes.value.length > 0) {
    ruleTypes.value.forEach(code => {
      const option = ruleTypeOptions.value.find(opt => opt.code === code)
      filters.push({
        key: `ruleTypes-${code}`,
        filterKey: 'ruleTypes',
        filterValue: code,
        label: `Yield rule types: ${option?.label || code}`
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
        label: `Channel: ${option?.label || code}`
      })
    })
  }

  // Date range - single pill if selected
  if (dateRange.value) {
    const dateLabel = Array.isArray(dateRange.value)
      ? `${dateRange.value[0]} - ${dateRange.value[1]}`
      : dateRange.value
    filters.push({
      key: 'dateRange',
      filterKey: 'dateRange',
      filterValue: dateRange.value,
      label: `Date range: ${dateLabel}`
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

const moreFiltersCount = computed(() => {
  let count = 0
  // Count channels
  count += channels.value.length
  // Count date range as 1 if selected
  if (dateRange.value) count++
  return count
})

// Methods
const openDrawer = () => {
  // Copy current state to temporary state when opening drawer
  tempChannels.value = [...channels.value]
  tempDateRange.value = dateRange.value
  showDrawer.value = true
}

const clearFilter = (filter) => {
  switch(filter.filterKey) {
    case 'yieldRuleName':
      yieldRuleName.value = ''
      break
    case 'ruleTypes':
      ruleTypes.value = ruleTypes.value.filter(v => v !== filter.filterValue)
      break
    case 'ratePlans':
      ratePlans.value = ratePlans.value.filter(v => v !== filter.filterValue)
      break
    case 'channels':
      channels.value = channels.value.filter(v => v !== filter.filterValue)
      break
    case 'dateRange':
      dateRange.value = null
      break
  }
}

const clearAllFilters = () => {
  yieldRuleName.value = ''
  ruleTypes.value = []
  ratePlans.value = []
  channels.value = []
  dateRange.value = null
}

const applyFilters = () => {
  // Apply temporary state to actual state
  channels.value = [...tempChannels.value]
  dateRange.value = tempDateRange.value
  showDrawer.value = false
}

const handleExpandAll = () => {
  console.log('Expand all clicked')
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

.more-filters-btn {
  align-self: flex-end;
}
</style>
