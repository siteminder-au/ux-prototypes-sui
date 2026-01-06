<template>
  <div class="slide-wrapper">
    <!-- TOP: Proposed filter bar -->
    <div class="slide-top">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <!-- Filter Bar -->
        <div class="filter-bar">
          <!-- Mapping Status Radio Group - Always visible -->
          <SmRadioGroup
            label="Mapping status"
            name="mappingStatus"
            class="filter-radio-group"
            :is-button-style-group="true"
          >
            <SmRadioButton name="mappingStatus" selected-value="mapped" label="Mapped" v-model="mappingStatus" />
            <SmRadioButton name="mappingStatus" selected-value="unmapped" label="Unmapped" v-model="mappingStatus" />
            <SmRadioButton name="mappingStatus" selected-value="all" label="All" v-model="mappingStatus" />
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

          <!-- Search Name Input - Always visible -->
          <SmInput
            v-model="searchName"
            label="Search name"
            placeholder="Search name"
            class="filter-input"
            suffix-icon="action-search"
          />

          <!-- Active Filters Pills -->
          <ActiveFiltersPills
            v-if="hasActiveFilters"
            :active-filters="activeFilters"
            @clear-filter="clearFilter"
            @clear-all="clearAllFilters"
          />
        </div>
      </div>
    </div>

    <!-- BOTTOM: Reference images -->
    <div class="slide-bottom">
      <div class="container-header">Reference</div>
      <div class="container-content">
        <img src="/images/filter-system/image 21.png" alt="Opera eXchange Interface with mapping status radio group and filters" />
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
const mappingStatus = ref('mapped')
const roomTypes = ref([])
const ratePlans = ref([])
const searchName = ref('')

// Computed
const activeFilters = computed(() => {
  const filters = []

  // Mapping status - don't show as pill since it's always visible in the filter bar
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

  // Search name - single pill for text input
  if (searchName.value) {
    filters.push({
      key: 'searchName',
      filterKey: 'searchName',
      filterValue: searchName.value,
      label: `Search name: ${searchName.value}`
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

// Methods
const clearFilter = (filter) => {
  switch(filter.filterKey) {
    case 'roomTypes':
      roomTypes.value = roomTypes.value.filter(v => v !== filter.filterValue)
      break
    case 'ratePlans':
      ratePlans.value = ratePlans.value.filter(v => v !== filter.filterValue)
      break
    case 'searchName':
      searchName.value = ''
      break
  }
}

const clearAllFilters = () => {
  // Keep mappingStatus at default 'mapped'
  roomTypes.value = []
  ratePlans.value = []
  searchName.value = ''
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

.filter-radio-group {
  align-self: flex-end;
}
</style>
