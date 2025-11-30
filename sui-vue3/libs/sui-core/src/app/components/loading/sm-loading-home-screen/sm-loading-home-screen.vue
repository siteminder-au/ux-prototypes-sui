<script setup lang="ts">
import SmLoadingBar from '../sm-loading-bar/sm-loading-bar.vue'

withDefaults(defineProps<{
  /**
   * Set the visibility of the header nav
   */
  showHeader?: boolean
}>(), {
  showHeader: true,
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
  <div class="sm-loading-home-screen">
    <template v-if="showHeader">
      <header><sm-loading-bar class="sm-loading-home-screen__header" /></header>
      <nav>
        <ul class="sm-loading-home-screen__nav-list">
          <li><sm-loading-bar class="sm-loading-home-screen__nav-item" /></li>
          <li><sm-loading-bar class="sm-loading-home-screen__nav-item" /></li>
          <li><sm-loading-bar class="sm-loading-home-screen__nav-item" /></li>
          <li><sm-loading-bar class="sm-loading-home-screen__nav-item" /></li>
          <li><sm-loading-bar class="sm-loading-home-screen__nav-item" /></li>
        </ul>
      </nav>
    </template>
    <section>
      <aside>
        <ul class="sm-loading-home-screen__sidebar">
          <li><sm-loading-bar class="sm-loading-home-screen__list-item" /></li>
          <li><sm-loading-bar class="sm-loading-home-screen__list-item" /></li>
          <li><sm-loading-bar class="sm-loading-home-screen__list-item" /></li>
          <li><sm-loading-bar class="sm-loading-home-screen__list-item" /></li>
          <li><sm-loading-bar class="sm-loading-home-screen__list-item" /></li>
        </ul>
      </aside>
      <div class="sm-loading-home-screen__container-right">
        <sm-loading-bar class="sm-loading-home-screen__header-item" />
        <sm-loading-bar class="sm-loading-home-screen__content" />
        <sm-loading-bar class="sm-loading-home-screen__content" />
        <sm-loading-bar class="sm-loading-home-screen__content" />
        <sm-loading-bar class="sm-loading-home-screen__content" />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../common/variables';
@import '../../../common/mixins';

$sm-loading-home-screen--nav--border-color: $light-blue-grey;

.sm-loading-home-screen {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  &__header {
    height: $sm-56;
    width: 100%;
  }

  &__nav-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: row wrap;
    border-bottom: 1px solid $sm-loading-home-screen--nav--border-color;
  }

  &__nav-item {
    width: 113px;
    height: $sm-16;
    border-radius: 4px;
    margin: 17px $sm-24;
  }

  section {
    display: flex;
  }

  &__list-item {
    width: 100%;
    height: 16px;
    border-radius: 4px;
    margin-bottom: 35px;
  }

  &__header-item {
    width: 234px;
    height: 34px;
    border-radius: 4px;
    margin: $sm-56 $sm-56 0 $sm-56;
  }

  &__content {
    width: 113px;
    height: 16px;
    border-radius: 4px;
    margin: 90px $sm-56 $sm-16 $sm-56;

    &:nth-child(2n + 1) {
      width: 50%;
      height: 16px;
      border-radius: 4px;
      margin: 0 $sm-56 90px $sm-56;
    }
  }

  &__sidebar {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: none;
    flex-flow: column wrap;
    border-right: 1px solid $sm-loading-home-screen--nav--border-color;
    padding: 50px $sm-24;
    width: 208px;
    height: 100vh;

    @media #{$large-desktop} {
      width: 208px;
      display: flex;
    }

    @media #{$extra-large-desktop} {
      width: 280px;
    }
  }

  &__container-right {
    min-width: calc(100% - 208px);
    max-width: 100%;

    @media #{$extra-large-desktop} {
      min-width: calc(100% - 280px);
    }
  }
}
</style>
