<script setup lang="ts">
import { CmStatus, CmStatusTypes } from './cm-status.types'

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
        'cm-status__content': true,
        'cm-status__content--alert': item.status === CmStatusTypes.ALERT,
        'cm-status__content--warning': item.status === CmStatusTypes.WARNING,
      }"
    >
      <div>
        <span class="sm-h6 sm-section-heading">{{ item.name }}</span>
        <p class="cm-disabled-dark cm-mb-8">{{ item.description }}</p>
      </div>
      <sm-icon
        v-if="item.status === CmStatusTypes.ALERT"
        class="cm-status-icon"
        name="utility-alert"
      />
      <sm-icon
        v-if="item.status === CmStatusTypes.WARNING"
        class="cm-status-icon"
        name="utility-warning"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cm-status {
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

    .cm-status-icon {
      color: var(--color-alert-dark);
    }
  }

  &__content--warning {
    border-left-color: var(--color-warning);

    .cm-status-icon {
      color: var(--color-warning);
    }
  }
}
</style>
