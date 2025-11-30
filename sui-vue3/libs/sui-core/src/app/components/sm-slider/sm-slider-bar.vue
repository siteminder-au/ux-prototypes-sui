<script setup lang="ts">
import { ref, computed, watchEffect, reactive, onBeforeUpdate, onMounted, Ref } from 'vue'
import SmSliderTooltip from './sm-slider-tooltip.vue'
import { SmSliderType, SmSliderValue } from './sm-slider.types'

interface GradientColorSetting {
  background: string
  fill: string
}

const props = withDefaults(defineProps<{
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
   * maximum value
   */
  max?: number
  /**
   * Whether to select a range mode
   */
  range?: boolean
  /**
   * step size
   */
  step?: number
  /**
   * Whether to display stops
   */
  showStops?: boolean
  /**
   * Whether to display tooltip on top
   */
  showTooltip?: boolean
  /**
   * The type of the slider. Accepts: SliderType.SUCCESS, SliderType.INFO, SliderType.WARNING
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

defineEmits<{
  /**
   * Emits when the v-model is updated
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
  set: (state) => { modelValue.value = state },
})

const isMouseEventStart = ref(false)

const isMouseEventEnd = ref(false)

const targetListItem: Ref<HTMLElement[] | null> = ref(null)
/**
 * Set an empty array to store the the stops
 */
const stepsArray: Ref<(number | false | undefined)[]> = ref([])

/**
 * minGap between range start and end points
 */
const minGap = ref(0)

const activeTrack = reactive<{ background?: string }>({})

const rangeActiveTrack = reactive<{ background?: string }>({})

/**
 * Show tooltip for start point
 */
const showTooltipStart = (): void => {
  isMouseEventStart.value = true
}
/**
 * Hide tooltip for start point
 */
const hideTooltipStart = (): void => {
  isMouseEventStart.value = false
}

/**
 * Show tooltip for end point
 */
const showTooltipEnd = (): void => {
  isMouseEventEnd.value = true
}

/**
 * Hide tooltip for end point
 */
const hideTooltipEnd = (): void => {
  isMouseEventEnd.value = false
}

/**
 * Apply color on slider type
 */
const sliderType = computed(() => {
  // --sm-c-slider-bar-* variables should be used and defined in the sui-themes layer
  const primaryInfo = 'var(--sm-c-slider-bar-active-color-background-info, #006add)'
  const success = 'var(--sm-c-slider-bar-active-color-background-success, #1b7b3e)'
  const warning = 'var(--sm-c-slider-bar-active-color-background-warning, #d11d1d)'

  switch (props.type) {
    case 'success':
      return success

    case 'warning':
      return warning

    default:
      return primaryInfo
  }
})

/**
 * Add validation on slider start point for range mode
 */
const slideStart = (): void => {
  if (Array.isArray(inputValue.value) && parseInt(inputValue.value[1].toString(), 10) - parseInt(inputValue.value[0].toString(), 10) <= minGap.value) {
    inputValue.value[0] = parseInt(inputValue.value[1].toString(), 10) - minGap.value
  }
}

/**
 * Add validation on slider end point for range mode
 */
const slideEnd = (): void => {
  if (Array.isArray(inputValue.value) && parseInt(inputValue.value[1].toString(), 10) - parseInt(inputValue.value[0].toString(), 10) <= minGap.value) {
    inputValue.value[1] = parseInt(inputValue.value[0].toString(), 10) + minGap.value
  }
}

/**
 * Function to get the gradient styles
 */
const getSliderStyle = (): void => {
  // --sm-c-slider-bar-* variables should be used and defined in the sui-themes layer
  const defaultBackground = 'var(--sm-c-slider-bar-inactive-color-background, #c6ceda)'
  const disabled = 'var(--sm-c-slider-bar-active-color-background-disabled, #c1c1c1)'
  const disabledBackground = 'var(--sm-c-slider-bar-inactive-color-background-disabled, #E6EBF2)'
  const settings = {
    fill: sliderType.value,
    background: props.disabled ? disabledBackground : defaultBackground,
  }
  if (props.range && Array.isArray(inputValue.value)) {
    setValidationRangeInput()
    fillGradientRangeColor(settings, disabled)
  } else {
    setValidationDefaultInput()
    fillGradientColor(settings, disabled)
  }
}

/**
 * Function to apply gradient styles for the range mode
 */
const fillGradientRangeColor = (settings: GradientColorSetting, disabled: string): void => {
  let percentageStart
  let percentageEnd

  if (Array.isArray(inputValue.value) && (inputValue.value[0] >= 0 || inputValue.value[0] > props.min)) {
    percentageStart = (100 * (inputValue.value[0] - props.min)) / (props.max - props.min)
    // Check for end point in range mode
    if (inputValue.value[1] || inputValue.value[1] < props.max) {
      percentageEnd = (100 * (inputValue.value[1] - props.min)) / (props.max - props.min)
      if (props.disabled) {
        rangeActiveTrack.background = `linear-gradient(to right, ${settings.background} ${percentageStart}% , ${disabled} ${percentageStart}% , ${disabled} ${percentageEnd}%, ${settings.background} ${percentageEnd}%)`
      } else {
        rangeActiveTrack.background = `linear-gradient(to right, ${settings.background} ${percentageStart}% , ${settings.fill} ${percentageStart}% , ${settings.fill} ${percentageEnd}%, ${settings.background} ${percentageEnd}%)`
      }
    }
  }
}

/**
 * Function to apply gradient styles for the default slider
 */
const fillGradientColor = (settings: GradientColorSetting, disabled: string): void => {
  const percentageStart = (100 * (Number(inputValue.value) - props.min)) / (props.max - props.min)
  if (props.disabled) {
    activeTrack.background = `linear-gradient(90deg, ${disabled} ${percentageStart}%, ${settings.background} ${percentageStart}%)`
  } else {
    activeTrack.background = `linear-gradient(90deg, ${settings.fill} ${percentageStart}%, ${settings.background} ${percentageStart}%)`
  }
}

/**
 * Apply validation for the slider range values
 */
const setValidationRangeInput = (): void => {
  if (Array.isArray(inputValue.value)) {
    if (inputValue.value[0] < props.min) {
      inputValue.value[0] = props.min
    } else if (inputValue.value[1] > props.max) {
      inputValue.value[1] = props.max
    }
  }
}

/**
 * Apply validation for the default slider values
 */
const setValidationDefaultInput = (): void => {
  if (inputValue.value === '' || Number(inputValue.value) < props.min) {
    inputValue.value = props.min
  } else if (Number(inputValue.value) > props.max) {
    inputValue.value = props.max
  }
}

/**
 * Find the stops if props showStops is true
 */
const calculateStops = (): void => {
  if (props.showStops) {
    findStops(props.max, props.min, props.step)
  }
}

/**
 * Find the stops and store in a new Array on mount
 */
const findStops = (upper: number, lower: number, steps: number): void => {
  const range: number = (props.max - props.min) / props.step
  const arrayOfStops = Math.round(range + 1)

  stepsArray.value = new Array(arrayOfStops)
    .fill(undefined)
    .map((v, idx) => {
      const step = upper - steps * idx
      if (step >= lower) {
        return step
      }
      return undefined
    })
    .filter(notUndefined => notUndefined !== undefined)
    .reverse()
}

/**
 * Calculate the stops on mount
 */
onMounted(() => {
  calculateStops()
})

/**
 * Watch the v-model update
 */
watchEffect(() => {
  getSliderStyle()
  if (props.range && Array.isArray(inputValue.value)) {
    slideStart()
    slideEnd()
  }
})

/**
 * Apply style, Useful in case of external v-model value manipulation
 */
onBeforeUpdate(() => {
  getSliderStyle()
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
  activeTrack,
  isMouseEventStart,
  isMouseEventEnd,
  rangeActiveTrack,
  slideStart,
  slideEnd,
  showTooltipStart,
  hideTooltipStart,
  showTooltipEnd,
  hideTooltipEnd,
  stepsArray,
  targetListItem,
})
</script>

<template>
  <div class="sm-slider-bar">
    <div
      v-if="showStops"
      class="sm-slider-bar__datalist"
      :class="{ 'sm-slider-bar--datalist-range': range }"
    >
      <span
        v-for="(item, i) in stepsArray"
        ref="targetListItem"
        :key="i"
        :value="item"
        class="sm-slider-bar__datalist-option"
        :class="{
          'sm-slider-bar--datalist-active': Array.isArray(inputValue) ? item == inputValue[0] || item == inputValue[1] : item == inputValue,
        }"
      />
    </div>
    <div v-if="range && Array.isArray(inputValue)">
      <div
        class="sm-slider-bar__track"
        :style="rangeActiveTrack"
      />
      <input
        v-model="inputValue[0]"
        type="range"
        class="sm-slider-bar__input"
        :class="{
          [`sm-slider-bar--type-${type}`]: !!type,
          'sm-slider-bar--mousedown': isMouseEventStart,
          'sm-slider-bar--range': range,
          'sm-slider-bar--disabled': disabled,
        }"
        :min="min"
        :max="max"
        :step="step"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="inputValue[0]"
        :aria-label="label"
        @focusin="showTooltipStart"
        @focusout="hideTooltipStart"
        @mousedown="showTooltipStart"
        @mouseup="hideTooltipStart"
        @input="slideStart"
      >
      <input
        v-model="inputValue[1]"
        type="range"
        class="sm-slider-bar__input sm-slider-bar__input-range"
        :class="{
          [`sm-slider-bar--type-${type}`]: !!type,
          'sm-slider-bar--mousedown': isMouseEventEnd,
          'sm-slider-bar--range': range,
          'sm-slider-bar--disabled': disabled,
        }"
        :min="min"
        :max="max"
        :step="step"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="inputValue[1]"
        :aria-label="label"
        @focusin="showTooltipEnd"
        @focusout="hideTooltipEnd"
        @mousedown="showTooltipEnd"
        @mouseup="hideTooltipEnd"
        @input="slideEnd"
      >
    </div>
    <div
      v-else
      class="sm-slider-bar__container"
    >
      <input
        v-model="inputValue"
        type="range"
        class="sm-slider-bar__input"
        :class="{
          [`sm-slider-bar--type-${type}`]: !!type,
          'sm-slider-bar--mousedown': isMouseEventStart,
          'sm-slider-bar--range': range,
          'sm-slider-bar--disabled': disabled,
        }"
        :min="min"
        :max="max"
        :step="step"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="Number(inputValue)"
        :style="activeTrack"
        :aria-label="label"
        @focusin="showTooltipStart"
        @focusout="hideTooltipStart"
        @mousedown="showTooltipStart"
        @mouseup="hideTooltipStart"
      >
    </div>
    <div
      v-if="showTooltip"
      class="sm-slider-bar__tooltip"
    >
      <sm-slider-tooltip
        :is-start-tooltip-visible="isMouseEventStart"
        :is-end-tooltip-visible="isMouseEventEnd"
        :input-value="inputValue"
        :range="range"
        :min="min"
        :max="max"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../common/variables";
@import "../../common/mixins";

$sm-slider-bar-input-background-color: $blue-neu-mid;
$sm-slider-bar-input-thumb-background-color: $true-white;
$sm-slider-bar-input-thumb-background-color-hover: $blue-neu-med;
$sm-slider-bar-input-thumb-color: $primary-blue;
$sm-slider-bar-input-focus-color: $grey-neu-black;
$sm-slider-bar-input-focus-background-color: $true-white;
$sm-slider-bar-datalist-option-color: $grey-neu-black;
$sm-slider-bar--dark--text-color: $true-white;
$sm-slider-bar--dark--background-color: $grey-neu-black;
$sm-slider-bar-input-thumb-background-color-disabled: $grey-neu-med;
$sm-slider-bar-input-handle-size: 16px !default;
$sm-slider-bar-input-track-height: 4px !default;
$sm-slider-bar-datalist-option-color: $grey-neu-black;
$sm-slider-bar--thumb-border-color: (
  info: $primary-blue,
  success: $app-success,
  warning: $app-warning,
);
$sm-slider-bar--thumb-background-color: (
  info: $blue-neu-med,
  success: $app-success-light,
  warning: $app-warning-light,
);
$sm-slider-bar--thumb-background-color-mouse-down: (
  info: $primary-blue,
  success: $app-success,
  warning: $app-warning,
);

.sm-slider-bar {
  position: relative;
  width: 100%;

  &__container {
    display: flex;
  }

  &__input {
    height: $sm-slider-bar-input-track-height;
    border-radius: 4px;
    background-color: $sm-slider-bar-input-background-color;
    outline: none;
    -webkit-appearance: none;
    padding: 0;
    width: 100%;
    position: relative;
    z-index: 1;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: $sm-slider-bar-input-handle-size;
      height: $sm-slider-bar-input-handle-size;
      background: $sm-slider-bar-input-thumb-background-color;
      cursor: pointer;
      border: 2px solid $sm-slider-bar-input-thumb-color;
      border-radius: 50%;
      transition: all 0.1s ease-in-out;
      pointer-events: auto;
    }

    &::-moz-range-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: $sm-slider-bar-input-handle-size;
      height: $sm-slider-bar-input-handle-size;
      background: $sm-slider-bar-input-thumb-background-color;
      cursor: pointer;
      border: 2px solid $sm-slider-bar-input-thumb-color;
      border-radius: 50%;
      margin-left: -12px;
      transition: all 0.1s ease-in-out;
      pointer-events: auto;
    }

    &::-ms-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: $sm-slider-bar-input-handle-size;
      height: $sm-slider-bar-input-handle-size;
      background: $sm-slider-bar-input-thumb-background-color;
      cursor: pointer;
      border: 2px solid $sm-slider-bar-input-thumb-color;
      border-radius: 50%;
      transition: all 0.1s ease-in-out;
      pointer-events: auto;
    }

    &:hover {
      &::-webkit-slider-thumb {
        transform: scale(1.25);
        border: 2px solid $sm-slider-bar-input-thumb-color;
        box-shadow: none;
        background: $sm-slider-bar-input-thumb-background-color-hover;
      }

      &::-moz-range-thumb {
        transform: scale(1.25);
        border: 2px solid $sm-slider-bar-input-thumb-color;
        box-shadow: none;
        background: $sm-slider-bar-input-thumb-background-color-hover;
      }

      &::-ms-thumb {
        transform: scale(1.25);
        border: 2px solid $sm-slider-bar-input-thumb-color;
        box-shadow: none;
        background: $sm-slider-bar-input-thumb-background-color-hover;
      }
    }
  }

  &__track {
    width: 100%;
    height: 4px;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    border-radius: 4px;
  }

  /* Base Types */
  @each $type in "info", "success", "warning" {
    &--type-#{$type} {
      &::-webkit-slider-thumb {
        border: 2px solid map-get($sm-slider-bar--thumb-border-color, $type);
      }

      &::-moz-range-thumb {
        border: 2px solid map-get($sm-slider-bar--thumb-border-color, $type);
      }

      &::-ms-thumb {
        border: 2px solid map-get($sm-slider-bar--thumb-border-color, $type);
      }

      &:hover {
        &::-webkit-slider-thumb {
          background: map-get($sm-slider-bar--thumb-background-color, $type);
          border: 2px solid map-get($sm-slider-bar--thumb-border-color, $type);
        }

        &::-moz-range-thumb {
          background: map-get($sm-slider-bar--thumb-background-color, $type);
          border: 2px solid map-get($sm-slider-bar--thumb-border-color, $type);
        }

        &::-ms-thumb {
          background: map-get($sm-slider-bar--thumb-background-color, $type);
          border: 2px solid map-get($sm-slider-bar--thumb-border-color, $type);
        }
      }
    }
    &--type-#{$type}.sm-slider-bar--mousedown {
      &::-webkit-slider-thumb {
        transform: scale(1.25);
        background: map-get($sm-slider-bar--thumb-background-color-mouse-down, $type);
        border: 2px solid map-get($sm-slider-bar--thumb-border-color, $type);
      }

      &::-moz-range-thumb {
        transform: scale(1.25);
        background: map-get($sm-slider-bar--thumb-background-color-mouse-down, $type);
        border: 2px solid map-get($sm-slider-bar--thumb-border-color, $type);
      }

      &::-ms-thumb {
        transform: scale(1.25);
        background: map-get($sm-slider-bar--thumb-background-color-mouse-down, $type);
        border: 2px solid map-get($sm-slider-bar--thumb-border-color, $type);
      }
    }
  }

  &--disabled {
    background: $sm-slider-bar-input-thumb-background-color-disabled;
    pointer-events: none;

    &::-webkit-slider-thumb {
      pointer-events: none;
      cursor: not-allowed;
      border: 2px solid $sm-slider-bar-input-thumb-background-color-disabled;
    }

    &::-moz-range-thumb {
      pointer-events: none;
      cursor: not-allowed;
      border: 2px solid $sm-slider-bar-input-thumb-background-color-disabled;
    }

    &::-ms-thumb {
      pointer-events: none;
      cursor: not-allowed;
      border: 2px solid $sm-slider-bar-input-thumb-background-color-disabled;
    }
  }

  &--range {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    outline: none;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    background-color: transparent;
    pointer-events: none;
  }

  &__datalist {
    position: absolute;
    display: flex;
    justify-content: space-between;
    height: auto;
    bottom: 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: none;
    width: 100%;
    z-index: 2;
  }

  &__datalist-option {
    width: 4px;
    height: 4px;
    min-height: 4px;
    border-radius: 100px;
    white-space: nowrap;
    padding: 0;
    line-height: 40px;
    background-color: $sm-slider-bar-datalist-option-color;
    opacity: 0.5;
  }

  &--datalist-range {
    bottom: -2px;
  }

  &--datalist-active {
    visibility: hidden;
  }
}
</style>
