<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * A label describing the group
   */
  label?: string
  /**
   * Whether the group should have a border
   */
  hasBorder?: boolean
}>(), {
  label: '',
  hasBorder: false,
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
  <fieldset
    :class="{
      'sm-switch-group': true,
      'sm-switch-group--border': hasBorder,
    }"
  >
    <div class="sm-switch-group__header">
      <legend
        v-if="label || $slots.label"
        class="sm-switch-group__label"
      >
        <!-- @slot A label describing the group -->
        <slot name="label">
          {{ label }}
        </slot>
      </legend>
      <span
        v-if="$slots.action"
        class="sm-switch-group__action"
      >
        <!-- @slot The field action next to the label. Example usage: adding a helper icon to provide more context on the field. -->
        <slot name="action" />
      </span>
    </div>

    <slot />
  </fieldset>
</template>

<style lang="scss">
@import "../../../common/variables";
@import "../../../common/mixins";

$sm-switch-group--text-color: $grey-neu-black;
$sm-switch-group--item--focussed--background-color: $grey-neu-light;

.sm-switch-group {
  border: none;
  padding: 0;
  margin: 0 0 32px;

  &__header {
    justify-content: space-between;
    display: flex;
  }

  &__action {
    margin-right: auto;

    @include padding($left: rem($sm-xxsm));
  }

  &__label {
    font-weight: 600;
    margin-bottom: 10px;
  }

  &--border {
    border: 1px solid $blue-neu-mid;
    border-radius: 4px;
  }

  .sm-switch {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    width: 100%;
    padding: $sm-20 15px 0 15px;

    &__label {
      margin: auto 0;
      font-weight: 600;
    }

    &__error {
      width: 100%;
      min-height: 20px;
      padding: 5px 0;
    }

    &--focussed {
      background: $sm-switch-group--item--focussed--background-color;
    }

    .sm-field-error {
      min-height: 20px;
      width: 100%;
    }
  }

  span:last-child .sm-switch {
    border: none;
  }
}
</style>
