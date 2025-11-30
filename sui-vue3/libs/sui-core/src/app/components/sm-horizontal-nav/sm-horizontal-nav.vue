<script setup lang="ts">
defineOptions({
  name: 'sm-horizontal-nav',
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
defineSlots<{
  default(): any
}>()
</script>

<template>
  <div class="sm-horizontal-nav">
    <ul class="sm-horizontal-nav__items">
      <slot />
    </ul>
  </div>
</template>

<style lang="scss">
@import "../../common/variables";

.sm-horizontal-nav {
  background: $true-white;

  &__items {
    background: var(--tertiary-background, var(--sm-c-horizontal-nav-color-background, var(--color-pure-white, $true-white)));
    display: flex;
    margin: 0;
    padding: 0;
    list-style: none;
    position: relative;
  }
}

/* Use the sm-app-header tokens to theme the sm-horizontal-nav under it */
.sm-app-header .sm-horizontal-nav {
  --sm-c-horizontal-nav-color-background: var(--sm-c-app-header-horizontal-nav-color-background);
  --sm-c-horizontal-nav-item-color-background: var(--sm-c-app-header-horizontal-nav-item-color-background);
  --sm-c-horizontal-nav-item-color-text: var(--sm-c-app-header-horizontal-nav-item-color-text);
  --sm-c-horizontal-nav-item-font-size: var(--sm-c-app-header-horizontal-nav-item-font-size);
  --sm-c-horizontal-nav-item-font-weight: var(--sm-c-app-header-horizontal-nav-item-font-weight);
  --sm-c-horizontal-nav-item-color-background-hover: var(--sm-c-app-header-horizontal-nav-item-color-background-hover);
  --sm-c-horizontal-nav-item-color-text-hover: var(--sm-c-app-header-horizontal-nav-item-color-text-hover);
  --sm-c-horizontal-nav-item-color-background-active: var(--sm-c-app-header-horizontal-nav-item-color-background-active);
  --sm-c-horizontal-nav-item-color-text-active: var(--sm-c-app-header-horizontal-nav-item-color-text-active);
  --sm-c-horizontal-nav-item-font-weight-active: var(--sm-c-app-header-horizontal-nav-item-font-weight-active);
  --sm-c-horizontal-nav-item-indicator-color-active: var(--sm-c-app-header-horizontal-nav-item-indicator-color-active);
  --sm-c-horizontal-nav-item-indicator-color-exact-active: var(--sm-c-app-header-horizontal-nav-item-indicator-color-exact-active);
  --sm-c-horizontal-nav-item-color-background-open: var(--sm-c-app-header-horizontal-nav-item-color-background-open);
  --sm-c-horizontal-nav-item-color-text-open: var(--sm-c-app-header-horizontal-nav-item-color-text-open);
}
</style>
