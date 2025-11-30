<script setup lang="ts">
import SmLoadingBar from '../sm-loading-bar/sm-loading-bar.vue'

withDefaults(defineProps<{
  /**
   * The number of lines to show
   */
  count?: number | string
}
>(), {
  count: 1,
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
  <div class="sm-loading-list">
    <sm-loading-bar
      v-for="i in Number(count)"
      :key="i"
      class="sm-loading-list__item"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "../../../common/variables";
@import "../../../common/mixins";

.sm-loading-list {
  &__item {
    margin-bottom: 28px;
    height: $sm-16;
    border-radius: 4px;
    width: 100%;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
