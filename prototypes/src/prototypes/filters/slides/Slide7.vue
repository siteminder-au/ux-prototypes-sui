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
            <!-- Rate Status Radio Group - Always visible -->
            <SmRadioGroup
              label="Rate Status"
              name="rateStatus"
              class="filter-radio-group"
              :is-button-style-group="true"
            >
              <SmRadioButton name="rateStatus" selected-value="active" label="Active" v-model="rateStatus" />
              <SmRadioButton name="rateStatus" selected-value="inactive" label="Inactive" v-model="rateStatus" />
            </SmRadioGroup>

            <!-- Room Types Multi-Select - Always visible -->
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

            <!-- Only show recommended rates Checkbox - Hidden on tablet and mobile -->
            <SmCheckbox
              v-model="showRecommendedOnly"
              label="Only show recommended rates"
              name="showRecommendedOnly"
              class="filter-checkbox filter-select--hide-tablet"
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

          <!-- Right: Deactivate rates button -->
          <div class="filter-bar-right">
            <SmButton
              type="secondary"
              class="deactivate-rates-btn"
              :disabled="true"
              @click="handleDeactivateRates"
            >
              Deactivate rates
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
              <!-- Rate Plans - Only visible on tablet and mobile -->
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

              <!-- Recommended Rates Checkbox -->
              <SmCheckbox
                v-model="tempShowRecommendedOnly"
                label="Only show recommended rates"
                name="showRecommendedOnly"
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
        <img src="/images/filters/image 7.png" alt="Rate status segmented control with multi-select filters" />
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
  { label: 'Flexible Rate', code: 'flexible' },
  { label: 'Non-Refundable', code: 'non-refundable' },
])

// Filter state - start with empty values
const rateStatus = ref('active')
const roomTypes = ref([])
const ratePlans = ref([])
const showRecommendedOnly = ref(false)
const showDrawer = ref(false)

// Temporary drawer filter state - only applies on submit
const tempRatePlans = ref([])
const tempShowRecommendedOnly = ref(false)

// Computed
const activeFilters = computed(() => {
  const filters = []

  // Rate status - don't show as pill since it's always visible in the filter bar
  // (radio button groups should not create active filter pills)

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

  // Show recommended only - only if checked
  if (showRecommendedOnly.value) {
    filters.push({
      key: 'showRecommendedOnly',
      filterKey: 'showRecommendedOnly',
      filterValue: true,
      label: 'Only show recommended rates'
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

const moreFiltersCount = computed(() => {
  let count = 0
  // Count individual rate plan selections (hidden on tablet/mobile)
  count += ratePlans.value.length
  // Count checkbox as 1 if checked (hidden on tablet/mobile)
  if (showRecommendedOnly.value) count++
  return count
})

// Methods
const openDrawer = () => {
  // Copy current state to temporary state when opening drawer
  tempRatePlans.value = [...ratePlans.value]
  tempShowRecommendedOnly.value = showRecommendedOnly.value
  showDrawer.value = true
}

const clearFilter = (filter) => {
  switch(filter.filterKey) {
    case 'rateStatus':
      // Don't clear rate status - it should always have a value
      break
    case 'roomTypes':
      roomTypes.value = roomTypes.value.filter(v => v !== filter.filterValue)
      break
    case 'ratePlans':
      ratePlans.value = ratePlans.value.filter(v => v !== filter.filterValue)
      break
    case 'showRecommendedOnly':
      showRecommendedOnly.value = false
      break
  }
}

const clearAllFilters = () => {
  // Keep rateStatus at default 'active'
  roomTypes.value = []
  ratePlans.value = []
  showRecommendedOnly.value = false
}

const applyFilters = () => {
  // Apply temporary state to actual state
  ratePlans.value = [...tempRatePlans.value]
  showRecommendedOnly.value = tempShowRecommendedOnly.value
  showDrawer.value = false
  console.log('Filters applied:', activeFilters.value)
}

const handleDeactivateRates = () => {
  console.log('Deactivate rates clicked')
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

.filter-radio-group {
  align-self: flex-end;
}

.filter-checkbox {
  align-self: flex-end;
}

.deactivate-rates-btn {
  height: 40px;
  align-self: flex-end;
}
</style>
