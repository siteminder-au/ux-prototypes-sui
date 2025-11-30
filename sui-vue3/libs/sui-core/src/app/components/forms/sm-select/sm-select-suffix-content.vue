<template>
  <span class="sm-select-suffix-content">
    <!-- @slot The content of the suffix -->
    <slot />
  </span>
</template>

<style lang="scss" scoped>
@import "../../../common/variables";

.sm-select-suffix-content {
  padding: $sm-8 $sm-12;
}
</style>
