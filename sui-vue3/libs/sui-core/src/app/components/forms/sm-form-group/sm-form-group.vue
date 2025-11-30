<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * Optional group legend text
   */
  legend?: string
}>(), {
  legend: '',
})

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
  },
  inheritAttrs: false,
})
</script>

<template>
  <fieldset
    class="sm-form-group"
    v-bind="$attrs"
  >
    <legend
      v-if="legend"
      class="sm-p"
    >
      {{ legend }}
    </legend>

    <slot />
  </fieldset>
</template>

<style lang="scss">
.sm-form-group {
  display: block;
  border: none;
  margin: 0;
  min-inline-size: 0;
  padding: 0;

  legend {
    font-weight: 600;
    text-transform: uppercase;
    padding: 0;
    margin-bottom: 24px;
  }
}
</style>
