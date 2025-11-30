<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * Set the margin
   */
  margin?: string
  /**
   * Set the margin-bottom of a divider component, requires a unit of measurement. For example '1px', '1em', '1rem'
   */
  marginBottom?: string
  /**
   * Set the margin-top of a divider component, requires a unit of measurement. For example '1px', '1em', '1rem'
   */
  marginTop?: string
  /**
   * Set the min-width of a divider component, requires a unit of measurement. For example '300px'
   */
  minWidth?: string
}>(), {
  margin: '',
  marginBottom: '1rem',
  marginTop: '1rem',
  minWidth: '464px',
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
  <hr
    class="sm-divider"
    :style="{ 'margin': margin, 'margin-top': marginTop, 'margin-bottom': marginBottom, 'min-width': minWidth }"
  >
</template>

<style lang="scss" scoped>
@import '../../common/variables';

$sm-divider--border-color: $blue-neu-mid;

.sm-divider {
  height: 1px;
  border: none;
  color: $sm-divider--border-color;
  background-color: $sm-divider--border-color;
}
</style>
