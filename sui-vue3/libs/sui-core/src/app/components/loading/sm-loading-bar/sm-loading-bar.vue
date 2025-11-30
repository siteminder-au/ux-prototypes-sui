<template>
  <div
    class="sm-loading-bar"
    aria-hidden="true"
  />
</template>

<style lang="scss">
@import '../../../common/variables';
@import '../../../common/mixins';

@mixin sm-loading-gradient-animation($start, $end, $transTime) {
  &::before {
    border-radius: inherit;
    background-color: var(--sm-c-loading-color-background, #dce3ec);
    background-size: 200% 200%;
    background-image: var(--sm-c-loading-image-background, linear-gradient(to right, $start, $end, $start));
    content: '';
    display: block;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1;
    z-index: $sm-loading-bar-z-index;
    animation: SmLoadingBarKeyframes ease $transTime infinite;
  }
}

@keyframes SmLoadingBarKeyframes {
  0% {
    background-position: 0% 0%;
  }

  50% {
    background-position: 100% 0%;
  }

  100% {
    background-position: 0% 0%;
  }
}

.sm-loading-bar {
  @include sm-loading-gradient-animation(
    #dce3ec,
    #eff3f8 50%,
    3s
  ); // gradient animation mixin usage

  border-radius: 4px;
  position: relative;
}
</style>
