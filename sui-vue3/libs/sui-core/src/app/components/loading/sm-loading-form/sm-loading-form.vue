<script setup lang="ts">
import SmLoadingBar from '../sm-loading-bar/sm-loading-bar.vue'
import SmInput from '../../forms/sm-input/sm-input.vue'
import { useUniqueId } from '../../use/unique-id'

withDefaults(defineProps<{
  /**
   * The number of form sections to show
   */
  count?: number | string
}
>(), {
  count: 1,
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

// Auto-generate required name props for the skeleton inputs
// In the future maybe we can replace this with custom, presentation inputs
// and not load the full input component
const { id: loadingInputId } = useUniqueId('sm-loading-form__input-')
</script>

<template>
  <div class="sm-loading-form">
    <div
      v-for="i in Number(count)"
      :key="i"
      class="sm-loading-form__item"
    >
      <sm-loading-bar class="sm-loading-form__loading-bar-header" />
      <div class="sm-loading-form__row">
        <div class="sm-loading-form__col sm-loading-form__col--left">
          <sm-loading-bar class="sm-loading-form__loading-bar" />
          <sm-input :name="`${loadingInputId}-${i}`" />
        </div>
        <div class="sm-loading-form__col">
          <sm-loading-bar class="sm-loading-form__loading-bar" />
          <sm-input :name="`${loadingInputId}-${i + 1}`" />
        </div>
      </div>
      <div>
        <sm-loading-bar class="sm-loading-form__loading-bar" />
        <sm-input :name="`${loadingInputId}-${i + 2}`" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../common/variables';
@import '../../../common/mixins';

$sm-loading-form--border-color: $light-blue-grey;

.sm-loading-form {
  display: flex;
  flex-flow: column wrap;

  &__item {
    flex: 1;

    + .sm-loading-form__item {
      margin-top: 32px;
    }
  }

  &__loading-bar-header {
    height: 24px;
    max-width: 115px;
    margin-bottom: 32px;
  }

  &__loading-bar {
    height: 16px;
    max-width: 150px;
  }

  &__row {
    display: flex;
  }

  &__col {
    width: 50%;

    &--left {
      padding-right: $sm-24;
    }
  }
}
</style>
