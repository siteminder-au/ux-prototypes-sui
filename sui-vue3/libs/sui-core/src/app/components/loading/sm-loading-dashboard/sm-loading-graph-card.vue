<script setup lang="ts">
import SmLoadingBar from '../sm-loading-bar/sm-loading-bar.vue'

defineProps<{
  /**
   * Set the height of image slides, accept only units of measurement. For example '100px', '100em', '100rem'
   */
  height?: string
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
  <div
    class="sm-loading-graph-card"
    :style="{ height: height }"
  >
    <div class="sm-loading-graph-card__item">
      <sm-loading-bar class="sm-loading-graph-card__loading-bar" />
      <sm-loading-bar class="sm-loading-graph-card__loading-bar" />
      <div class="sm-loading-graph-card__grid">
        <sm-loading-bar class="sm-loading-graph-card__content" />
        <sm-loading-bar class="sm-loading-graph-card__content" />
        <sm-loading-bar class="sm-loading-graph-card__content" />
        <sm-loading-bar class="sm-loading-graph-card__content" />
        <sm-loading-bar class="sm-loading-graph-card__content" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../../common/variables";
@import "../../../common/mixins";

$sm-loading-graph-card--border-color: $light-blue-grey;

.sm-loading-graph-card {
  display: flex;
  flex-flow: row wrap;
  margin-right: 32px;

  &:last-child {
    margin-right: 0;
  }

  &__header {
    height: 32px;
    width: 25%;
    margin-bottom: 27px;
  }

  &__item {
    flex: 1;
    width: 100%;
    margin-bottom: $sm-32;
    padding: $sm-24;
    border: 1px solid $sm-loading-graph-card--border-color;
    border-radius: 8px;
  }

  &__grid {
    display: flex;
    height: 200px;
  }

  &__content {
    max-width: $sm-32;
    width: $sm-32;
    margin-right: $sm-24;
    text-align: center;
    line-height: 75px;
    align-self: flex-end;
  }

  &__content:nth-child(1) {
    height: 80%;
  }

  &__content:nth-child(2) {
    height: 40%;
  }

  &__content:nth-child(3) {
    height: 60%;
  }

  &__content:nth-child(4) {
    height: 100%;
  }

  &__content:nth-child(5) {
    height: 30%;
  }

  &__loading-bar:nth-child(1) {
    height: 32px;
    width: 30%;
    margin-bottom: 27px;
  }

  &__loading-bar:nth-child(2) {
    width: 50%;
    height: 16px;
    margin-bottom: 40px;
  }
}
</style>
