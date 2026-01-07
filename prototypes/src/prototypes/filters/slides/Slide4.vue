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
            <!-- Channel Name Search Input - Always visible -->
            <SmInput
              v-model="channelName"
              label="Channel name"
              name="channelName"
              placeholder="Search by channel name"
              class="filter-input"
            />

            <!-- Connection Type Multi-Select - Always visible -->
            <SmMultiSelect
              v-model="connectionType"
              label="Connection type"
              name="connectionType"
              placeholder="All connection types"
              class="filter-select"
              :options="connectionTypeOptions"
              :filterable="false"
              :multiple="true"
              :collapse-tags="true"
            />
          </div>

          <!-- Right: Reorder button -->
          <div class="filter-bar-right">
            <SmButton
              type="text"
              class="reorder-btn"
              @click="handleReorder"
            >
              <SmIcon name="action-reorder" />
              Reorder
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
        <img src="/images/filters/image 4.png" alt="Search with channel status multi-select" />
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
const connectionTypeOptions = ref([
  { label: 'Awaiting setup', code: 'awaiting-setup' },
  { label: 'Enabled', code: 'enabled' },
  { label: 'Disabled', code: 'disabled' },
])

// Filter state - start with empty values
const channelName = ref('')
const connectionType = ref([])

// Computed
const activeFilters = computed(() => {
  const filters = []

  // Channel name - single pill for text input
  if (channelName.value) {
    filters.push({
      key: 'channelName',
      filterKey: 'channelName',
      filterValue: channelName.value,
      label: `Channel name: ${channelName.value}`
    })
  }

  // Connection type - individual pill for each selection
  if (connectionType.value.length > 0) {
    connectionType.value.forEach(code => {
      const option = connectionTypeOptions.value.find(opt => opt.code === code)
      filters.push({
        key: `connectionType-${code}`,
        filterKey: 'connectionType',
        filterValue: code,
        label: `Connection type: ${option?.label || code}`
      })
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

// Methods
const clearFilter = (filter) => {
  switch(filter.filterKey) {
    case 'channelName':
      channelName.value = ''
      break
    case 'connectionType':
      connectionType.value = connectionType.value.filter(v => v !== filter.filterValue)
      break
  }
}

const clearAllFilters = () => {
  channelName.value = ''
  connectionType.value = []
}

const handleReorder = () => {
  console.log('Reorder clicked')
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';
</style>
