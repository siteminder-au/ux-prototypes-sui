<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * The title of the page
   */
  title?: string
  /**
   * A sub title, which will appear next to the title text
   */
  subTitle?: string

}>(), {
  title: '',
  subTitle: '',
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
  <header class="sm-page-title">
    <div class="sm-page-title__content">
      <h1 class="sm-page-title__title">
        <!-- @slot The title content -->
        <slot>{{ title }}</slot>
      </h1>

      <p
        v-if="subTitle || $slots['sub-title']"
        class="sm-h1 sm-page-title__sub-title"
      >
        <!-- @slot The sub title content -->
        <slot name="sub-title">
          {{ subTitle }}
        </slot>
      </p>
    </div>

    <div
      v-if="$slots.actions"
      class="sm-page-title__actions"
    >
      <!-- @slot A space for primary actions, such as a create new button -->
      <slot name="actions" />
    </div>
  </header>
</template>

<style lang="scss" scoped>
@import "../../common/variables";
@import "../../common/mixins";

.sm-page-title {
  display: flex;
  flex-flow: row wrap;

  &__content,
  &__actions {
    flex: 1;
  }

  &__content {
    padding-right: 30px;
  }

  &__title {
    display: inline-block;
  }

  &__sub-title {
    display: inline-block;
    margin-left: $sm-8;
    color: $blue-neu-dark;
  }

  &__actions {
    text-align: right;
  }
}
</style>
