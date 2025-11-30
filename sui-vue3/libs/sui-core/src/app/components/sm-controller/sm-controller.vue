<script setup lang="ts">
const props = withDefaults(defineProps<{
  /**
   * Whether the left most button is disabled
   */
  leftMostDisabled?: boolean
  /**
   * Whether the left button is disabled
   */
  leftDisabled?: boolean
  /**
   * Whether the right button is disabled
   */
  rightDisabled?: boolean
  /**
   * Whether the right most button is disabled
   */
  rightMostDisabled?: boolean
}>(), {
  leftMostDisabled: false,
  leftDisabled: false,
  rightDisabled: false,
  rightMostDisabled: false,
})

const emit = defineEmits<{
  /**
   * Triggers when click on left arrow
   */
  left: []
  /**
   * Triggers when click on left most arrow
   */
  leftmost: []
  /**
   * Triggers when click on right arrow
   */
  right: []
  /**
   * Triggers when click on right most arrow
   */
  rightmost: []
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

/**
 * Click on left arrow
 */
const leftDisabledClick = () => {
  if (!props.leftDisabled) {
    emit('left')
  }
}

/**
 * Click on left most arrow
 */
const leftMostDisabledClick = () => {
  if (!props.leftMostDisabled) {
    emit('leftmost')
  }
}
/**
 * Click on right arrow
 */
const rightDisabledClick = () => {
  if (!props.rightDisabled) {
    emit('right')
  }
}
/**
 * Click on right most arrow
 */
const rightMostDisabledClick = () => {
  if (!props.rightMostDisabled) {
    emit('rightmost')
  }
}

defineExpose({
  leftDisabledClick,
  leftMostDisabledClick,
  rightDisabledClick,
  rightMostDisabledClick,
})
</script>

<template>
  <span class="sm-controller">
    <span
      class="sm-controller__content sm-controller__leftmost"
      @click="leftMostDisabledClick"
    >
      <!-- @slot The leftmost button here -->
      <slot name="leftmost" />
    </span>
    <span
      class="sm-controller__content sm-controller__left"
      @click="leftDisabledClick"
    >
      <!-- @slot The left button here -->
      <slot name="left" />
    </span>
    <span class="sm-controller__body sm-controller__content">
      <!-- @slot The custom content will be placed here in the middle -->
      <slot name="body" />
    </span>
    <span
      class="sm-controller__content sm-controller__right"
      @click="rightDisabledClick"
    >
      <!-- @slot The right button here -->
      <slot name="right" />
    </span>
    <span
      class="sm-controller__content sm-controller__rightmost"
      @click="rightMostDisabledClick"
    >
      <!-- @slot The rightmost button here -->
      <slot name="rightmost" />
    </span>
  </span>
</template>

<style lang="scss" scoped>
@import "../../common/variables";
@import "../../common/mixins";

$sm-controller--border--color: $light-blue-grey;

.sm-controller {
  display: flex;
  border: 1px solid $sm-controller--border--color;
  border-radius: 4px;
  box-shadow: 0 1px 1px 0 rgba(0, 57, 85, 0.19);
  width: max-content;
  align-items: center;
  justify-content: center;

  &__content {
    border-right: 1px solid $sm-controller--border--color;
    height: 40px;

    &:last-of-type {
      border: 0;
    }
  }

  &__body {
    align-items: center;
    justify-content: center;
    display: flex;
    padding: 0 $sm-8;
  }
}
</style>
