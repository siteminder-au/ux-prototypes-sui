<script setup lang="ts">
import SmLoadingBar from '../sm-loading-bar/sm-loading-bar.vue'

withDefaults(defineProps<{
  /**
   * The number of cards to show
   */
  count?: number | string
  /**
   * Whether the loaders should be stacked on top of each other, as opposed to being displayed in a grid
   */
  stacked?: boolean
}
>(), {
  count: 1,
  stacked: false,
})

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
    class="sm-loading-card"
    :class="{ 'sm-loading-card--stacked': stacked }"
  >
    <div
      v-for="i in Number(count)"
      :key="i"
      class="sm-loading-card__item"
    >
      <sm-loading-bar class="sm-loading-card__loading-bar" />
      <sm-loading-bar class="sm-loading-card__loading-bar" />

      <template v-if="stacked">
        <sm-loading-bar class="sm-loading-card__loading-bar" />
        <sm-loading-bar class="sm-loading-card__loading-bar" />
        <sm-loading-bar class="sm-loading-card__loading-bar" />
      </template>

      <sm-loading-bar
        v-else
        class="sm-loading-card__loading-bar"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../../common/variables";
@import "../../../common/mixins";

$sm-loading-card--border-color: $light-blue-grey;

.sm-loading-card {
  display: flex;
  flex-flow: row wrap;

  &__item {
    flex: 1;
    max-width: 348px;
    min-width: 300px;
    margin-right: $sm-32;
    margin-bottom: $sm-32;
    padding: $sm-24;
    border: 1px solid $sm-loading-card--border-color;
    border-radius: 8px;
  }

  &__loading-bar:nth-child(1) {
    height: 32px;
    width: 80%;
    margin-bottom: 32px;
  }

  &__loading-bar:nth-child(2) {
    height: 16px;
    width: 95%;
    margin-bottom: 16px;
  }

  &__loading-bar:nth-child(3) {
    height: 16px;
    width: 60%;
    margin-bottom: 55px;
  }

  &--stacked &__item {
    width: 100%;
    max-width: none;
    display: flex;
    flex-flow: row wrap;
    flex: none;
    justify-content: space-between;
  }

  &--stacked &__loading-bar:nth-child(1) {
    width: 33%;
    margin-bottom: 16px;
  }

  &--stacked &__loading-bar:nth-child(2) {
    width: 100%;
  }

  &--stacked &__loading-bar:nth-child(3),
  &--stacked &__loading-bar:nth-child(4),
  &--stacked &__loading-bar:nth-child(5) {
    width: 30%;
    height: 16px;
    margin-bottom: 0;
  }

}
</style>
