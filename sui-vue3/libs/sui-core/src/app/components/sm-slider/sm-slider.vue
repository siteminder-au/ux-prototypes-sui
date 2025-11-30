<script setup lang="ts">
import { watchEffect, VNode, computed } from 'vue'
import SmSliderBar from './sm-slider-bar.vue'
import { SmSliderType, SmSliderValue } from './sm-slider.types'

withDefaults(defineProps<{
  /**
   * Whether the slider is disabled
   */
  disabled?: boolean
  /**
   * A descriptive text label for default slider
   */
  label?: string
  /**
   * The minimum value
   */
  min?: number
  /**
   * The maximum value
   */
  max?: number
  /**
   * Whether to select a range mode
   */
  range?: boolean
  /**
   * Whether to display tooltip on top
   */
  showTooltip?: boolean
  /**
   * Whether to display stops
   */
  showStops?: boolean
  /**
   * Step size
   */
  step?: number
  /**
   * The type of the slider. Accepts: SmSliderType.SUCCESS, SmSliderType.INFO, SmSliderType.WARNING
   */
  type?: SmSliderType
}>(), {
  disabled: false,
  label: '',
  min: 0,
  max: 100,
  range: false,
  showStops: false,
  showTooltip: true,
  step: 1,
  type: SmSliderType.INFO,
})

const emit = defineEmits<{
  /**
   * Emits when the v-model is updated
   */
  change: [value: SmSliderValue]
  /**
   * Emits when the input value changes
   * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
   */
  'update:modelValue': [value: SmSliderValue | null]
}>()

/**
 * v-model for `modelValue` prop
 * Emits 'update:modelValue': [value: ModelValue] when this ref changes
 * IMPORTANT: Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
 */
const modelValue = defineModel<SmSliderValue>({
  default: 0,
})

const inputValue = computed({
  get: () => modelValue.value,
  set: (state) => { modelValue.value = state }, // this will emit 'update:modelValue' internally by vue
})

/**
 * defineSlots macro used to declare expected slots and their respective expected slot
 */
defineSlots<{
  prefix?: () => VNode[]
  suffix?: () => VNode[]
  label?: () => VNode[]
}>()

/**
 * Watch the v-model
 */
watchEffect(() => {
  if (inputValue.value || inputValue.value === 0) {
    emit('change', inputValue.value)
  }
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

defineExpose({
  inputValue,
})
</script>

<template>
  <div class="sm-slider">
    <div
      v-if="label || $slots.label"
      class="sm-slider__label"
      :class="{ 'sm-slider__label--range': range, 'sm-slider__label--has-slot': $slots.prefix || $slots.suffix }"
    >
      <!-- @slot The slider label. Overrides the label prop -->
      <slot name="label">
        {{ label }}
      </slot>
    </div>
    <div :class="{ 'sm-slider__container': $slots.prefix || $slots.suffix }">
      <span
        v-if="$slots.prefix"
        class="sm-slider__prefix"
        :class="{ 'sm-slider--slot-prefix': $slots.prefix }"
      >
        <!-- @slot Add prefix for the slider -->
        <slot name="prefix" />
      </span>
      <sm-slider-bar
        v-model="inputValue"
        :show-tooltip="showTooltip"
        :range="range"
        :type="type"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :show-stops="showStops"
        :label="label"
      />

      <span
        v-if="$slots.suffix"
        class="sm-slider__input"
        :class="{ 'sm-slider--slot-suffix': $slots.suffix }"
      >
        <!-- @slot Add suffix for the slider -->
        <slot name="suffix" />
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../common/variables";
@import "../../common/mixins";

$sm-slider-label-color: $grey-neu-dark;

.sm-slider {
  position: relative;

  &__container {
    display: flex;
    align-items: center;
    vertical-align: middle;
  }

  &__prefix,
  &__input {
    /* Chrome, Safari, Edge, Opera */
    :deep(input::-webkit-outer-spin-button),
    :deep(input::-webkit-inner-spin-button) {
      -webkit-appearance: none;
    }

    /* Firefox */
    :deep(input[type="number"]) {
      -moz-appearance: textfield;
    }
  }

  &--slot-prefix {
    margin-right: 16px;
  }

  &--slot-suffix {
    margin-left: 16px;
  }

  &--slot-input {
    margin-left: 16px;
  }

  &__label {
    color: $sm-slider-label-color;
    padding-bottom: 19px;
    font-size: 13px;
    line-height: 20px;

    &--has-slot {
      padding-bottom: 12px;
    }
  }
}
</style>
