<script setup lang="ts">
import { ref } from 'vue'
import { useUniqueId } from '../use/unique-id'
import { SmTagSize, SmTagType } from './sm-tag.types'
import { useI18n } from '../../libs/vue-i18n'

withDefaults(defineProps<{
  /**
   * Whether the close (delete) button should be shown
   */
  closable?: boolean
  /**
   * The colour of the tag. Accepts: success, info, alert, warning
   */
  type?: SmTagType
  /**
   * The size of the tag. Accepts: large, medium, small
   */
  size?: SmTagSize
  /**
   * Determine whether it's disabled
   */
  disabled?: boolean
  /**
   * Sets the close button's tabindex. Useful when adding custom navigation behavior
   * on a list of tags.
   */
  tabindex?: number | null
}>(), {
  closable: false,
  type: SmTagType.INFO,
  size: SmTagSize.LARGE,
  disabled: false,
  tabindex: null,
})

defineEmits<{
  click: [e: MouseEvent]
  close: [e: MouseEvent]
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

const { i18n } = useI18n()

const focussed = ref(false)

const { id: contentElementId } = useUniqueId('sm-tag__content_')
</script>

<template>
  <span
    class="sm-tag"
    :class="{
      [`sm-tag--type-${type}`]: !!type,
      [`sm-tag--size_${size}`]: !!size,
      'sm-tag--focussed': focussed,
      'sm-tag--disabled': disabled,
    }"
    @click.stop="(event) => $emit('click', event)"
  >

    <span
      :id="contentElementId || undefined"
      class="sm-tag__content"
    >
      <slot />
    </span>

    <button
      v-if="closable"
      class="sm-tag__close"
      type="button"
      :disabled="disabled"
      :aria-label="i18n.t('sui-core.components.sm-tag.sm-tag.a11y__click-to-remove')"
      :aria-describedby="contentElementId || undefined"
      :tabindex="tabindex || undefined"
      @click.stop="(event) => $emit('close', event)"
      @focus="focussed = true"
      @blur="focussed = false"
    >
      <sm-icon name="action-cross" />
    </button>

  </span>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-tag--info--text-color: $grey-neu-black;
$sm-tag--info--background-color: $app-info-light;
$sm-tag--success--text-color: $app-success;
$sm-tag--success--background-color: $app-success-light;
$sm-tag--alert--text-color: $grey-neu-black;
$sm-tag--alert--background-color: $app-alert-light;
$sm-tag--warning--text-color: $app-warning;
$sm-tag--warning--background-color: $app-warning-light;
$sm-tag--info--hover--icon--background-color: $app-info-mid;
$sm-tag--success--hover--icon--background-color: $app-success-mid;
$sm-tag--alert--hover--icon--background-color: $app-alert-mid;
$sm-tag--warning--hover--icon--background-color: $app-warning-mid;
$sm-tag--disabled--text-color: $grey-neu-dark;
$sm-tag--disabled--background-color: $grey-neu-white;

.sm-tag {
  display: inline-flex;
  font-size: 13px;
  padding: 7px $sm-16;
  border-radius: 1em;

  + .sm-tag {
    margin-left: 4px;
  }

  &__content {
    line-height: 14px;

    .sm-icon {
      margin-right: 5px;
      font-size: 12px;
    }
  }

  &__close {
    align-self: center;
    display: inline-block;
    background: none;
    color: $grey-neu-black;
    appearance: none;
    border: none;
    border-radius: 4px;
    padding: 2px 0;
    margin-left: 5px;
    margin-bottom: -1px;
    width: $sm-16;
    height: $sm-16;
    line-height: 12px;
    cursor: pointer;
    position: relative;
    outline: none;

    svg {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .sm-icon {
      font-size: 12px;
    }
  }

  /* Sizes */
  &--size_small {
    padding: 3px 10px;
  }

  &--size_medium {
    padding: 5px $sm-12;
  }

  /* Types */
  &--type-info {
    color: $sm-tag--info--text-color;
    background: $sm-tag--info--background-color;
  }

  &--type-success {
    color: $sm-tag--success--text-color;
    background: $sm-tag--success--background-color;
  }

  &--type-alert {
    color: $sm-tag--alert--text-color;
    background: $sm-tag--alert--background-color;
  }

  &--type-warning {
    color: $sm-tag--warning--text-color;
    background: $sm-tag--warning--background-color;
  }

  /* Close - Focus State */
  &--focussed {
    @include shadow-outline;
  }

  &--disabled {
    color: $sm-tag--disabled--text-color;
    background: $sm-tag--disabled--background-color;
  }

  &--disabled &__close {
    cursor: not-allowed;
    color: $grey-neu-dark;
  }

  &__close:focus {
    outline: none;
    box-shadow: inset 0 0 0 1px $grey-neu-black;
  }

  /* Close - Hover State */

  &--type-info:not(&--disabled) &__close:hover {
    background: $sm-tag--info--hover--icon--background-color;
  }

  &--type-success:not(&--disabled) &__close:hover {
    background: $sm-tag--success--hover--icon--background-color;
  }

  &--type-alert:not(&--disabled) &__close:hover {
    background: $sm-tag--alert--hover--icon--background-color;
  }

  &--type-warning:not(&--disabled) &__close:hover {
    background: $sm-tag--warning--hover--icon--background-color;
  }
}
</style>
