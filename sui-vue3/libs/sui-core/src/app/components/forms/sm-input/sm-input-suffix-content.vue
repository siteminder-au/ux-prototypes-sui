<template>
  <span class="sm-input-suffix-content">
    <!-- @slot The content of the suffix -->
    <slot />
  </span>
</template>

<style lang="scss" scoped>
@import "../../../common/variables";

.sm-input-suffix-content {
  padding: $sm-8 $sm-12;
  width: 100%;
}
</style>
