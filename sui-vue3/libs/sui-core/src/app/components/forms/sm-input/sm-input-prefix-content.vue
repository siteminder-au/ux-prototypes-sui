<template>
  <span class="sm-input-prefix-content">
    <!-- @slot The content of the prefix -->
    <slot />
  </span>
</template>

<style lang="scss" scoped>
@import "../../../common/variables";

.sm-input-prefix-content {
  padding: $sm-8 $sm-12;
  width: 100%;
}
</style>
