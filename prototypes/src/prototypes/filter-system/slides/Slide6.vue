<template>
  <div class="slide-wrapper">
    <!-- TOP: Proposed filter bar -->
    <div class="slide-top">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <!-- Filter Bar -->
        <div class="filter-bar">
          <!-- Channels Search Input - Always visible -->
          <SmInput
            v-model="channels"
            label="Channels"
            placeholder="Search channels"
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
        <img src="/images/filter-system/image 6.png" alt="Simple search filter" />
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

// Filter state - start with empty value
const channels = ref('')

// Computed
const activeFilters = computed(() => {
  const filters = []

  // Channels - single pill for text input
  if (channels.value) {
    filters.push({
      key: 'channels',
      filterKey: 'channels',
      filterValue: channels.value,
      label: `Channels: ${channels.value}`
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

// Methods
const clearFilter = (filter) => {
  if (filter.filterKey === 'channels') {
    channels.value = ''
  }
}

const clearAllFilters = () => {
  channels.value = ''
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';
</style>
