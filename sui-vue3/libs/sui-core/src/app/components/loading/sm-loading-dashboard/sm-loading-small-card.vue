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
    class="sm-loading-small-card"
    :style="{ height: height }"
  >
    <div class="sm-loading-small-card__item">
      <sm-loading-bar class="sm-loading-small-card__header" />
      <div class="sm-loading-small-card__grid">
        <sm-loading-bar class="sm-loading-small-card__loading-bar" />
        <sm-loading-bar class="sm-loading-small-card__loading-bar" />
      </div>
      <div class="sm-loading-small-card__grid">
        <sm-loading-bar class="sm-loading-small-card__loading-bar" />
        <sm-loading-bar class="sm-loading-small-card__loading-bar" />
      </div>
      <div class="sm-loading-small-card__grid">
        <sm-loading-bar class="sm-loading-small-card__loading-bar" />
        <sm-loading-bar class="sm-loading-small-card__loading-bar" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../../common/variables";
@import "../../../common/mixins";

$sm-loading-small-card--border-color: $light-blue-grey;

.sm-loading-small-card {
  display: flex;
  flex-flow: row wrap;
  margin-right: $sm-32;

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
    border: 1px solid $sm-loading-small-card--border-color;
    border-radius: 8px;
  }

  &__grid {
    display: flex;
    flex-flow: row wrap;
    margin-bottom: $sm-16;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__loading-bar:nth-child(1) {
    height: $sm-16;
    width: 40%;
    flex: 1;
    margin-right: 40%;
  }

  &__loading-bar:nth-child(2) {
    width: 19px;
    height: $sm-16;
  }

}
</style>
