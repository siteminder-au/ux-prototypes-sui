<template>
  <thead class="sm-table-thead">
    <!-- @slot The body of the header -->
    <slot />
  </thead>
</template>

<style lang="scss" scoped>
@import "./../../common/variables";
@import "./../../common/mixins";

$sm-table-header--background-color: $blue-neu-med;

thead {
  width: 100%;
  background-color: $sm-table-header--background-color;
}
</style>
