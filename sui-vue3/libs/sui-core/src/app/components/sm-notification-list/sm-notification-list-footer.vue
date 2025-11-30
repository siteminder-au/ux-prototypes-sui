<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * Text at the end of the panel
   */
  footer?: string
}>(), {
  footer: '',
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
  <div class="sm-notification-list-footer">
    <p>{{ footer }}</p>
  </div>
</template>

<style lang="scss">
@import "../../common/variables";

.sm-notification-list-footer {
  width: 100%;
  color: $grey-neu-black;
  padding: $sm-24 $sm-32;
  display: flex;
  justify-content: center;
  text-align: center;
  overflow-wrap: anywhere;

  p {
    margin-bottom: 0;
  }
}
</style>
