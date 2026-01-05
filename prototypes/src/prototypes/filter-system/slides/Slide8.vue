<template>
  <div class="slide-wrapper">
    <!-- TOP: Proposed filter bar -->
    <div class="slide-top">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <!-- Filter Bar -->
        <div class="filter-bar">
          <!-- Deal Status Segmented Control - Always visible -->
          <div class="filter-segmented">
            <label class="sm-field-label">Deal status</label>
            <div class="segmented-control">
              <SmButton
                :type="dealStatus === 'all' ? 'primary' : 'secondary'"
                @click="dealStatus = 'all'"
                class="segmented-button"
              >
                All
              </SmButton>
              <SmButton
                :type="dealStatus === 'active' ? 'primary' : 'secondary'"
                @click="dealStatus = 'active'"
                class="segmented-button"
              >
                Active
              </SmButton>
              <SmButton
                :type="dealStatus === 'inactive' ? 'primary' : 'secondary'"
                @click="dealStatus = 'inactive'"
                class="segmented-button"
              >
                Inactive
              </SmButton>
            </div>
          </div>

          <!-- View by Deal Type Multi-Select - Always visible -->
          <SmMultiSelect
            v-model="dealType"
            label="View by deal type"
            name="dealType"
            placeholder="All deal types"
            class="filter-select"
            :options="dealTypeOptions"
            :filterable="false"
            :multiple="true"
            :collapse-tags="true"
          />

          <!-- Deal Name Search Input - Always visible -->
          <SmInput
            v-model="dealName"
            label="Deal name"
            placeholder="Search a deal name"
            class="filter-input"
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
        <img src="/images/filter-system/image 8.png" alt="Deal status segmented control with view selector and search" />
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

// Options data for multi-select
const dealTypeOptions = ref([
  { label: 'Campaign', code: 'campaign' },
  { label: 'Flash sale', code: 'flash-sale' },
  { label: 'Package', code: 'package' },
])

// Filter state - start with empty values (except dealStatus defaults to 'all')
const dealStatus = ref('all')
const dealType = ref([])
const dealName = ref('')

// Computed
const activeFilters = computed(() => {
  const filters = []

  // Deal status - always show since there's always a selection
  filters.push({
    key: 'dealStatus',
    filterKey: 'dealStatus',
    filterValue: dealStatus.value,
    label: `Deal status: ${dealStatus.value.charAt(0).toUpperCase() + dealStatus.value.slice(1)}`
  })

  // Deal type - individual pill for each selection
  if (dealType.value.length > 0) {
    dealType.value.forEach(code => {
      const option = dealTypeOptions.value.find(opt => opt.code === code)
      filters.push({
        key: `dealType-${code}`,
        filterKey: 'dealType',
        filterValue: code,
        label: `View by deal type: ${option?.label || code}`
      })
    })
  }

  // Deal name - single pill for text input
  if (dealName.value) {
    filters.push({
      key: 'dealName',
      filterKey: 'dealName',
      filterValue: dealName.value,
      label: `Deal name: ${dealName.value}`
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

// Methods
const clearFilter = (filter) => {
  switch(filter.filterKey) {
    case 'dealStatus':
      // Don't clear deal status - it should always have a value
      break
    case 'dealType':
      dealType.value = dealType.value.filter(v => v !== filter.filterValue)
      break
    case 'dealName':
      dealName.value = ''
      break
  }
}

const clearAllFilters = () => {
  // Keep dealStatus at default 'all'
  dealType.value = []
  dealName.value = ''
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

.filter-segmented {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-self: flex-end;
}

.segmented-control {
  display: flex;
  gap: 0;
  border-radius: 4px;
  overflow: hidden;

  .segmented-button {
    border-radius: 0;

    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
}
</style>
