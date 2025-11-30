<script setup lang="ts">
import { CmStatus, CmStatusTypes } from './dashboard-status.types'

defineProps<{
  list: CmStatus[]
}>()
</script>

<template>
  <div>
    <div
      v-for="item in list"
      :key="item.id"
      :class="{
        'dashboard-status__content': true,
        'dashboard-status__content--alert': item.status === CmStatusTypes.ALERT,
        'dashboard-status__content--warning': item.status === CmStatusTypes.WARNING,
      }"
    >
      <div>
        <span class="sm-h6 sm-section-heading">{{ item.name }}</span>
        <p class="cm-disabled-dark cm-mb-8">{{ item.description }}</p>
      </div>
      <sm-icon
        v-if="item.status === CmStatusTypes.ALERT"
        class="dashboard-status-icon"
        name="utility-alert"
      />
      <sm-icon
        v-if="item.status === CmStatusTypes.WARNING"
        class="dashboard-status-icon"
        name="utility-warning"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-status {
  &__content {
    border-left: 2px solid var(--color-info);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sm-12);
    margin-bottom: var(--sm-12);
    padding-left: var(--sm-12);
  }

  &-icon {
    font-size: var(--h4-font-size);
    margin-right: var(--sm-24);
  }

  &__content--alert {
    border-left-color: var(--color-alert);

    .dashboard-status-icon {
      color: var(--color-alert-dark);
    }
  }

  &__content--warning {
    border-left-color: var(--color-warning);

    .dashboard-status-icon {
      color: var(--color-warning);
    }
  }
}
</style>
