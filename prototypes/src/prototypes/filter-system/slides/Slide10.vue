<template>
  <div class="slide-wrapper">
    <!-- TOP: Proposed filter bar -->
    <div class="slide-top">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <!-- Filter Bar with Tag-style Filters -->
        <div class="filter-bar filter-bar--tags">
          <!-- Filter Tags Row -->
          <div class="filter-tags">
            <SmTag
              v-for="tag in filterTags"
              :key="tag.key"
              :label="tag.label"
              :closable="tag.active"
              @close="clearFilterTag(tag.key)"
              @click="openFilterTag(tag.key)"
              class="filter-tag"
            >
              {{ tag.label }}
            </SmTag>
          </div>
        </div>
      </div>
    </div>

    <!-- BOTTOM: Reference images -->
    <div class="slide-bottom">
      <div class="container-header">Reference</div>
      <div class="container-content">
        <img src="/images/filter-system/image 10.png" alt="Inventory filter with tag-style filters and calendar interface" />
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
import PrototypeSettings from '@/shared/components/PrototypeSettings.vue'
import DisplaySettings from '@/shared/components/DisplaySettings.vue'

// Filter tag data
const filterTags = ref([
  { key: 'room', label: 'Room', active: false },
  { key: 'checkInDate', label: 'Check-in date', active: false },
  { key: 'stayLength', label: 'Stay length', active: false },
  { key: 'ratePlans', label: 'Rate plans', active: false },
  { key: 'maxLengthOfStay', label: 'Max length of stay', active: false },
])

// Methods
const openFilterTag = (key) => {
  console.log(`Opening filter for: ${key}`)
  // In a real implementation, this would open a modal or drawer for that specific filter
}

const clearFilterTag = (key) => {
  const tag = filterTags.value.find(t => t.key === key)
  if (tag) {
    tag.active = false
  }
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

.filter-bar--tags {
  display: flex;
  flex-direction: column;
  gap: var(--sm-spacing-3x);
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sm-spacing-2x);
}

.filter-tag {
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}
</style>
