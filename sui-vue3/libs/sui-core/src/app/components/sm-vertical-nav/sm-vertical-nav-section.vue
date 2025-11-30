<script setup lang="ts">
import { computed, VNode } from 'vue'

withDefaults(defineProps<{
  /**
   * The label of the vertical nav section
   */
  label?: string
}>(), {
  label: '',
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

/**
 * defineSlots macro used to declare expected slots and their respective expected slot
 */
const slots = defineSlots<{
  default?: () => VNode[]
  label?: () => VNode[]
}>()

const hasChildren = computed(() => !!slots.default)
</script>

<template>
  <li class="sm-vertical-nav-section">
    <span
      class="sm-vertical-nav-section__active-indicator"
      aria-hidden="true"
    />
    <h6
      v-if="$slots.label || label"
      class="sm-section-heading sm-vertical-nav-section__label"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </h6>

    <ul
      v-if="hasChildren"
      class="sm-vertical-nav-section__children"
    >
      <slot />
    </ul>
  </li>
</template>

<style lang="scss">
@import '../../common/variables';
@import '../../common/mixins';

$sm-vertical-nav-section--text-color: $grey-neu-black;
$sm-vertical-nav-section--background-color: transparent;

.sm-vertical-nav-section {
  width: 100%;
  list-style: none;
  background: $sm-vertical-nav-section--background-color;

  &__label {
    display: block;
    padding-left: $sm-16;
    margin-bottom: 15px;
    color: $sm-vertical-nav-section--text-color;
  }

  &__children {
    margin: 0;
    padding: 0;
  }

  & + .sm-vertical-nav-section {
    padding-top: $sm-48;
  }
}
</style>
