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
            <!-- Show Rates by Status Radio Group - Always visible -->
            <SmRadioGroup
              label="Show rates by status"
              name="rateStatus"
              class="filter-radio-group"
              :is-button-style-group="true"
            >
              <SmRadioButton name="rateStatus" selected-value="added" label="Added" v-model="rateStatus" />
              <SmRadioButton name="rateStatus" selected-value="not-added" label="Not added" v-model="rateStatus" />
              <SmRadioButton name="rateStatus" selected-value="all" label="All" v-model="rateStatus" />
            </SmRadioGroup>

            <!-- Room Types Multi-Select - Always visible -->
            <SmMultiSelect
              v-model="roomTypes"
              label="Room types"
              name="roomTypes"
              placeholder="Filter room types"
              class="filter-select"
              :options="roomTypeOptions"
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
              <!-- Rate Type Multi-Select -->
              <SmMultiSelect
                v-model="tempRateType"
                label="Rate type"
                name="rateType"
                placeholder="Filter rate types"
                class="filter-select"
                :options="rateTypeOptions"
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
        <img src="/images/filter-system/image 11.png" alt="Direct booking rates with status radio group and filter dropdowns" />
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
  { label: 'Advanced Purchase', code: 'advanced-purchase' },
])

const rateTypeOptions = ref([
  { label: 'Suspended rates', code: 'suspended' },
  { label: 'Restricted rates', code: 'restricted' },
])

// Filter state - start with 'added' as default
const rateStatus = ref('added')
const roomTypes = ref([])
const ratePlans = ref([])
const rateType = ref([])
const showDrawer = ref(false)

// Temporary drawer filter state - only applies on submit
const tempRateType = ref([])

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

  // Rate type - individual pill for each selection
  if (rateType.value.length > 0) {
    rateType.value.forEach(code => {
      const option = rateTypeOptions.value.find(opt => opt.code === code)
      filters.push({
        key: `rateType-${code}`,
        filterKey: 'rateType',
        filterValue: code,
        label: `Rate type: ${option?.label || code}`
      })
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

const moreFiltersCount = computed(() => {
  let count = 0
  count += rateType.value.length
  return count
})

// Methods
const openDrawer = () => {
  // Copy current state to temporary state when opening drawer
  tempRateType.value = [...rateType.value]
  showDrawer.value = true
}

const applyFilters = () => {
  // Apply temporary state to actual state
  rateType.value = [...tempRateType.value]
  showDrawer.value = false
}
const clearFilter = (filter) => {
  switch(filter.filterKey) {
    case 'roomTypes':
      roomTypes.value = roomTypes.value.filter(v => v !== filter.filterValue)
      break
    case 'ratePlans':
      ratePlans.value = ratePlans.value.filter(v => v !== filter.filterValue)
      break
    case 'rateType':
      rateType.value = rateType.value.filter(v => v !== filter.filterValue)
      break
  }
}

const clearAllFilters = () => {
  // Keep rateStatus at default 'added'
  roomTypes.value = []
  ratePlans.value = []
  rateType.value = []
}

const handleExpandAll = () => {
  console.log('Expand all clicked')
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

.expand-all-btn {
  align-self: flex-end;
}
</style>
