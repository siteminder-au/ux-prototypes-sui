<template>
  <div class="slide-wrapper">
    <!-- TOP: Proposed filter bar -->
    <div class="slide-top">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <!-- Filter Bar -->
        <div class="filter-bar">
          <!-- Left: Filters -->
          <div class="filter-bar-left">
            <!-- Room Types Search Input -->
            <SmInput
              v-model="roomTypes"
              label="Room types"
              placeholder="Search room types"
              class="filter-input"
              suffix-icon="action-search"
            />

            <!-- Rate Plans Search Input -->
            <SmInput
              v-model="ratePlans"
              label="Rate plans"
              placeholder="Search rate plans"
              class="filter-input"
              suffix-icon="action-search"
            />
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
        </div>
      </div>
    </div>

    <!-- BOTTOM: Reference images -->
    <div class="slide-bottom">
      <div class="container-header">Reference</div>
      <div class="container-content">
        <img src="/images/filters/image 15.png" alt="Property cancellation settings with filter dropdowns" />
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

// Filter state
const roomTypes = ref('')
const ratePlans = ref('')

// Computed
const activeFilters = computed(() => {
  const filters = []

  // Room types - single pill for text input
  if (roomTypes.value) {
    filters.push({
      key: 'roomTypes',
      filterKey: 'roomTypes',
      filterValue: roomTypes.value,
      label: `Room types: ${roomTypes.value}`
    })
  }

  // Rate plans - single pill for text input
  if (ratePlans.value) {
    filters.push({
      key: 'ratePlans',
      filterKey: 'ratePlans',
      filterValue: ratePlans.value,
      label: `Rate plans: ${ratePlans.value}`
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

// Methods
const clearFilter = (filter) => {
  switch(filter.filterKey) {
    case 'roomTypes':
      roomTypes.value = ''
      break
    case 'ratePlans':
      ratePlans.value = ''
      break
  }
}

const clearAllFilters = () => {
  roomTypes.value = ''
  ratePlans.value = ''
}

const handleExpandAll = () => {
  console.log('Expand all clicked')
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

.expand-all-btn {
  align-self: flex-end;
}
</style>
