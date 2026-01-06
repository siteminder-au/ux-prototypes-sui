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
            <!-- Check Date Select -->
            <SmSelect
              v-model="checkDate"
              label="Check Date"
              name="checkDate"
              placeholder="Check-in date"
              class="filter-select"
              :options="checkDateOptions"
              :filterable="false"
            />

            <!-- Next Date Select -->
            <SmSelect
              v-model="nextDate"
              label="Next Date"
              name="nextDate"
              placeholder="Next date"
              class="filter-select"
              :options="nextDateOptions"
              :filterable="false"
            />

            <!-- Rate Plans Select -->
            <SmSelect
              v-model="ratePlan"
              label="Rate plans"
              name="ratePlan"
              placeholder="Rate plans"
              class="filter-select"
              :options="ratePlanOptions"
              :filterable="false"
            />

            <!-- Room Rate Select -->
            <SmSelect
              v-model="roomRate"
              label="Room rate"
              name="roomRate"
              placeholder="Room rate"
              class="filter-select"
              :options="roomRateOptions"
              :filterable="false"
            />
          </div>

          <!-- Right: Search button -->
          <div class="filter-bar-right">
            <SmButton
              type="tertiary"
              class="search-btn"
              @click="handleSearch"
              aria-label="Search"
            >
              <SmIcon name="action-search" />
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
        <img src="/images/filter-system/image 10.png" alt="Inventory filter with date and rate plan dropdowns" />
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

// Options data for selects
const checkDateOptions = ref([
  { label: 'Check-in date', code: 'check-in' },
  { label: 'Check-out date', code: 'check-out' },
])

const nextDateOptions = ref([
  { label: 'Next 7 days', code: 'next-7' },
  { label: 'Next 14 days', code: 'next-14' },
  { label: 'Next 30 days', code: 'next-30' },
])

const ratePlanOptions = ref([
  { label: 'Flexible Rate', code: 'flexible' },
  { label: 'Non-Refundable', code: 'non-refundable' },
  { label: 'Advanced Purchase', code: 'advanced-purchase' },
])

const roomRateOptions = ref([
  { label: 'Standard Rate', code: 'standard' },
  { label: 'Premium Rate', code: 'premium' },
  { label: 'Discount Rate', code: 'discount' },
])

// Filter state - start with empty values
const checkDate = ref('')
const nextDate = ref('')
const ratePlan = ref('')
const roomRate = ref('')

// Computed
const activeFilters = computed(() => {
  const filters = []

  // Check Date
  if (checkDate.value) {
    const option = checkDateOptions.value.find(opt => opt.code === checkDate.value)
    filters.push({
      key: 'checkDate',
      filterKey: 'checkDate',
      filterValue: checkDate.value,
      label: `Check Date: ${option?.label || checkDate.value}`
    })
  }

  // Next Date
  if (nextDate.value) {
    const option = nextDateOptions.value.find(opt => opt.code === nextDate.value)
    filters.push({
      key: 'nextDate',
      filterKey: 'nextDate',
      filterValue: nextDate.value,
      label: `Next Date: ${option?.label || nextDate.value}`
    })
  }

  // Rate Plans
  if (ratePlan.value) {
    const option = ratePlanOptions.value.find(opt => opt.code === ratePlan.value)
    filters.push({
      key: 'ratePlan',
      filterKey: 'ratePlan',
      filterValue: ratePlan.value,
      label: `Rate plans: ${option?.label || ratePlan.value}`
    })
  }

  // Room Rate
  if (roomRate.value) {
    const option = roomRateOptions.value.find(opt => opt.code === roomRate.value)
    filters.push({
      key: 'roomRate',
      filterKey: 'roomRate',
      filterValue: roomRate.value,
      label: `Room rate: ${option?.label || roomRate.value}`
    })
  }

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

// Methods
const clearFilter = (filter) => {
  switch(filter.filterKey) {
    case 'checkDate':
      checkDate.value = ''
      break
    case 'nextDate':
      nextDate.value = ''
      break
    case 'ratePlan':
      ratePlan.value = ''
      break
    case 'roomRate':
      roomRate.value = ''
      break
  }
}

const clearAllFilters = () => {
  checkDate.value = ''
  nextDate.value = ''
  ratePlan.value = ''
  roomRate.value = ''
}

const handleSearch = () => {
  console.log('Search clicked')
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

.search-btn {
  align-self: flex-end;
}
</style>
