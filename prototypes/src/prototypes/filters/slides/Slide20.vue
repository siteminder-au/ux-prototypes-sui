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
            <!-- Channels Search Input - Always visible -->
            <SmInput
              v-model="searchQuery"
              label="Channels"
              name="channels"
              placeholder="Search channels"
              class="filter-input"
              suffix-icon="action-search"
            />

            <!-- Channel Status Multi-Select - Hidden on tablet and mobile -->
            <SmMultiSelect
              v-model="channelStatus"
              label="Channel status"
              name="channelStatus"
              placeholder="All statuses"
              class="filter-select filter-select--hide-tablet"
              :options="channelStatusOptions"
              :filterable="false"
              :multiple="true"
              :collapse-tags="true"
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
              <!-- Channel Status - Only show in drawer on tablet and mobile -->
              <SmMultiSelect
                v-model="tempChannelStatus"
                label="Channel status"
                name="channelStatus"
                placeholder="All statuses"
                class="filter-select drawer-field--tablet-only"
                :options="channelStatusOptions"
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
        <img src="/images/filters/image 20.png" alt="Channels with search input" />
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
const channelStatusOptions = ref([
  { label: 'Awaiting setup', code: 'awaiting-setup' },
  { label: 'Enabled', code: 'enabled' },
  { label: 'Disabled', code: 'disabled' },
])

// Filter state
const searchQuery = ref('')
const channelStatus = ref([])

// Drawer state
const showDrawer = ref(false)
const tempChannelStatus = ref([])

// Computed
const activeFilters = computed(() => {
  const filters = []

  if (searchQuery.value) {
    filters.push({
      key: 'searchQuery',
      filterKey: 'searchQuery',
      filterValue: searchQuery.value,
      label: `Channels: ${searchQuery.value}`
    })
  }

  // Channel status - individual pill for each selection
  if (channelStatus.value.length > 0) {
    channelStatus.value.forEach(code => {
      const option = channelStatusOptions.value.find(opt => opt.code === code)
      filters.push({
        key: `channelStatus-${code}`,
        filterKey: 'channelStatus',
        filterValue: code,
        label: `Channel status: ${option?.label || code}`
      })
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

const moreFiltersCount = computed(() => {
  let count = 0
  // Count fields that are hidden on tablet/mobile
  count += channelStatus.value.length
  return count
})

// Methods
const openDrawer = () => {
  tempChannelStatus.value = [...channelStatus.value]
  showDrawer.value = true
}

const applyFilters = () => {
  channelStatus.value = [...tempChannelStatus.value]
  showDrawer.value = false
}

const clearFilter = (filter) => {
  switch(filter.filterKey) {
    case 'searchQuery':
      searchQuery.value = ''
      break
    case 'channelStatus':
      channelStatus.value = channelStatus.value.filter(v => v !== filter.filterValue)
      break
  }
}

const clearAllFilters = () => {
  searchQuery.value = ''
  channelStatus.value = []
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

.more-filters-btn {
  align-self: flex-end;
}
</style>
