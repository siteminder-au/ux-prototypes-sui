<template>
  <div
    v-if="$slots.default"
    class="sm-card-actions"
  >
    <!-- @slot Place the primary action associated with the card here. The contents will appear in the top right of the card. -->
    <slot />
  </div>
</template>

<style lang="scss" scoped>
  .sm-card-actions {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
    padding: 0;
  }
</style>
