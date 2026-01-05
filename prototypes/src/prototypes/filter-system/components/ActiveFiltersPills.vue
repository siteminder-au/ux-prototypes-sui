<template>
  <div class="active-filters">
    <div class="tags-container">
      <SmTag
        v-for="filter in activeFilters"
        :key="filter.key"
        :closable="true"
        @close="$emit('clear-filter', filter)"
      >
        {{ filter.label }}
      </SmTag>
    </div>
    <SmButton
      type="text"
      class="clear-all-btn"
      @click="$emit('clear-all')"
    >
      Clear all
    </SmButton>
  </div>
</template>

<script setup>
defineProps({
  activeFilters: {
    type: Array,
    required: true
  }
})

defineEmits(['clear-filter', 'clear-all'])
</script>

<style scoped lang="scss">
.active-filters {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: start;
  width: 100%;

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: flex-start;

    // Ensure consistent height for pills
    :deep(.sm-tag) {
      display: inline-flex;
      align-items: center;
      margin: 0;
    }
  }

  .clear-all-btn {
    font-size: 14px;
    padding: 0 0.5rem;
    align-self: center;
    white-space: nowrap;
  }
}
</style>
