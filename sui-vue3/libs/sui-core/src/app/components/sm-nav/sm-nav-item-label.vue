<script setup lang="ts">
defineProps<{
  /**
   * The content of the navigation item
   */
  label: string
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
  <span
    class="sm-nav-item-label"
    tabindex="-1"
  >
    <span class="sm-nav-item-label__active-indicator" />

    <span
      v-if="$slots['prefix-icon']"
      class="sm-nav-item-label__prefix-icon"
    >
      <!-- @slot prefix Icon slot for navigation item label -->
      <slot name="prefix-icon" />
    </span>
    <span class="sm-nav-item-label__label">{{ label }}</span>

    <span v-if="$slots.content">
      <!-- @slot To write the custom content of the nav item -->
      <slot name="content" />
    </span>

    <span
      v-if="$slots['suffix-icon']"
      class="sm-nav-item-label__suffix-icon"
    >
      <!-- @slot suffix Icon slot for navigation item label -->
      <slot name="suffix-icon" />
    </span>
  </span>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-nav-item--content--text-color: $grey-neu-black;
$sm-nav-item--icon-color: $grey-neu-dark;

.sm-nav-item-label {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 13px 0;
  margin-left: $sm-24;
  margin-right: $sm-24;

  &:focus,
  &:hover {
    outline: 0;
    box-shadow: none;
  }

  &__label {
    color: $sm-nav-item--content--text-color;
  }

  &__active-indicator {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    background: transparent;
    transition: background 0.3s ease;
  }

  &__prefix-icon {
    @include padding($right: rem($sm-xxsm));

    color: $sm-nav-item--icon-color;
    font-size: 20px;
  }

  &__suffix-icon {
    @include padding($left: rem($sm-xxsm));

    color: $sm-nav-item--icon-color;
  }
}
</style>
