<script setup lang="ts">
import { VNode } from 'vue'

withDefaults(defineProps<{
  /**
   * The name of the separator icon
   */
  separatorIcon?: string
}>(), {
  separatorIcon: 'sm-forward-slash',
})

/**
 * defineSlots macro used to declare expected slots and their respective expected slot
 */
const slots = defineSlots<{
  default?: () => VNode[]
}>()

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
  <nav class="sm-breadcrumbs">
    <ol
      v-if="slots.default"
      class="sm-breadcrumbs-list"
    >
      <component
        :is="item"
        v-for="(item, index) in slots.default()"
        :key="index"
        :separator-icon="index !== slots.default().length - 1 ? separatorIcon : undefined"
      />
    </ol>
  </nav>
</template>

<style lang="scss">
@import "../../common/variables";

.sm-breadcrumbs {
  &-list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
  }
}
</style>
