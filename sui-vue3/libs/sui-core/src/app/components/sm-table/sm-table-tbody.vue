<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * Whether the alternating rows are visible
   */
  alternatingRows?: boolean
}>(), {
  alternatingRows: false,
})

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
  },
})
</script>

<template>
  <tbody
    class="sm-table-tbody"
    :class="{ 'sm-table-tbody--alternating-rows': alternatingRows }"
  >
    <!-- @slot The body of the tbody -->
    <slot />
  </tbody>
</template>

<style lang="scss">
@import './../../common/variables';
@import './../../common/mixins';

$sm-table-tbody--background-color: $blue-neu-light;
$sm-table-row--hover--background-color: $app-extra-4;

.sm-table-tbody {
  &--alternating-rows {
    tr:nth-child(even) {
      background-color: $sm-table-tbody--background-color;

      .sm-table-td {
        background-color: $sm-table-tbody--background-color;
      }

      &:hover,
      &:focus {
        background-color: $sm-table-row--hover--background-color;
      }
    }
  }
}
</style>
