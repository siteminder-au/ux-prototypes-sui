<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * To bind the aria-* attributes to your inputs, part of the available validation state
   */
  ariaMsg?: Record<string, unknown>
  /**
   * To display error, the errors array is a part of the available validation state
   */
  errors: string[]
}>(), {
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
  <div
    class="sm-field-error sm-text--small"
    :class="{ 'sm-field-error--error': errors[0] }"
    role="alert"
    v-bind="ariaMsg"
  >
    {{ errors[0] }}
  </div>
</template>

<style lang="scss" scoped>
@import "../../../common/variables";

$sm-field-error--text-color: $app-warning;

.sm-field-error {
  opacity: 0;
  max-height: 32px;
  transition: opacity 0.3s, height 0.3s 0.1s;
  padding-top: 3px;
  padding-bottom: 6px;
  color: $sm-field-error--text-color;

  &--error {
    opacity: 1;
    max-height: 150px;
    transition: opacity 0.3s 0.1s, max-height 0.3s;
  }
}
</style>
