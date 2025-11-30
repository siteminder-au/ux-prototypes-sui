<script setup lang="ts">
import SmLoadingBar from '../sm-loading-bar/sm-loading-bar.vue'
</script>

<template>
  <div class="sm-loading-long-card">
    <div class="sm-loading-long-card__item">
      <sm-loading-bar class="sm-loading-long-card__loading-bar" />
      <sm-loading-bar class="sm-loading-long-card__loading-bar" />
      <sm-loading-bar class="sm-loading-long-card__loading-bar" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../../common/variables";
@import "../../../common/mixins";

$sm-loading-long-card--border-color: $light-blue-grey;

.sm-loading-long-card {
  display: flex;
  flex-flow: row wrap;

  &__item {
    flex: 1;
    width: 100%;
    margin-bottom: $sm-32;
    padding: $sm-24;
    border: 1px solid $sm-loading-long-card--border-color;
    border-radius: 8px;
  }

  &__loading-bar:nth-child(1) {
    height: 32px;
    width: 40%;
    margin-bottom: $sm-32;
  }

  &__loading-bar:nth-child(2) {
    height: 16px;
    width: 100%;
    margin-bottom: $sm-16;
  }

  &__loading-bar:nth-child(3) {
    height: 16px;
    width: 100%;
  }

}
</style>
