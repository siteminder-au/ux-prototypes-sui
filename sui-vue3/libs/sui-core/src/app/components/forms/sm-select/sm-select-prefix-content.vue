<template>
  <span class="sm-select-prefix-content">
    <!-- @slot The content of the prefix -->
    <slot />
  </span>
</template>

<style lang="scss" scoped>
@import "../../../common/variables";

.sm-select-prefix-content {
  padding: $sm-8 $sm-12;
}
</style>
