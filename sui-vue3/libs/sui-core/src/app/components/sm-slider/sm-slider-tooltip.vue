<script setup lang="ts">
import { ref, onMounted, onBeforeUpdate, onBeforeUnmount, Ref } from 'vue'
import { Instance, createPopperLite as createPopper } from '@popperjs/core'
import { SmSliderValue } from './sm-slider.types'

const props = withDefaults(defineProps<{
  /**
   * Whether the tooltip is visible on start point
   */
  isStartTooltipVisible?: boolean
  /**
   * Whether the tooltip is visible on end point
   */
  isEndTooltipVisible?: boolean
  /**
   * Input Value
   */
  inputValue?: SmSliderValue
  /**
   * The minimum value
   */
  min?: number
  /**
   * maximum value
   */
  max?: number
  /**
   * Whether to display range mode
   */
  range?: boolean
}>(), {
  isStartTooltipVisible: false,
  isEndTooltipVisible: false,
  inputValue: 0,
  min: 0,
  max: 100,
  range: false,
})

const targetElement: Ref<HTMLElement | null> = ref(null)

const contentElement: Ref<HTMLElement | null> = ref(null)

const popper = ref<[Instance | null, Instance | null]>([null, null])

// Store left style for the range mode
const getTooltipLeftArray: Ref<unknown[]> = ref([])

// Store left style for default mode
const tooltipLeft = ref()

/**
 * initialize popper for range mode (for an Array) and default mode
 */
const initializePopper = (): void => {
  const placement = 'top'
  const strategy = 'absolute'
  if (Array.isArray(props.inputValue) && props.range && Array.isArray(targetElement.value) && Array.isArray(contentElement.value)) {
    for (let i = 0; i < props.inputValue.length; i += 1) {
      popper.value[i] = createPopper(targetElement.value[i], contentElement.value[i], {
        placement,
        strategy,
      })
    }
  } else if (!props.range && targetElement.value && contentElement.value) {
    popper.value[0] = createPopper(targetElement.value, contentElement.value, {
      placement,
      strategy,
    })
  }
}

/**
 * Function to apply left style as per the input attributes(currentValue, max and min)
 */
const getStopsPosition = (): void => {
  const inputHandleSize = 16
  const midPoint = inputHandleSize / 2
  if (props.range && Array.isArray(props.inputValue)) {
    for (let i = 0; i < props.inputValue.length; i += 1) {
      const getValue = Number(((props.inputValue[i] - props.min) * 100) / (props.max - props.min))
      if (props.inputValue[i] || props.inputValue[i] === 0 || props.inputValue[i] > props.min) {
        const left = `calc(${getValue}% + (${midPoint - getValue * 0.15}px));`
        getTooltipLeftArray.value[i] = left
      }
    }
  } else {
    const inputValue = Number(props.inputValue)
    const getValue = Number(((inputValue - props.min) * 100) / (props.max - props.min))
    if (props.inputValue || inputValue === 0 || inputValue > props.min) {
      const left = `calc(${getValue}% + (${midPoint - getValue * 0.15}px));`
      tooltipLeft.value = left
    }
  }
}

onMounted(() => {
  getStopsPosition()
  initializePopper()
})

/**
 * Update the position of tooltip, Useful in case of show-stops
 */
onBeforeUpdate(async () => {
  getStopsPosition()
  if (popper.value[0]) {
    await popper.value[0].update()
  }
  if (popper.value[1]) {
    await popper.value[1].update()
  }
})

onBeforeUnmount(() => {
  if (popper.value[0]) {
    popper.value[0].destroy()
    popper.value[0] = null
  }
  if (popper.value[1]) {
    popper.value[1].destroy()
    popper.value[1] = null
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
  targetElement,
  contentElement,
  getTooltipLeftArray,
  tooltipLeft,
})
</script>

<template>
  <div
    class="sm-slider-tooltip"
    :class="{
      'sm-slider-tooltip--tooltip-range': range,
      'sm-slider-tooltip--start-tooltip': range && isStartTooltipVisible,
      'sm-slider-tooltip--end-tooltip': range && isEndTooltipVisible,
    }"
  >
    <span
      v-if="range && Array.isArray(inputValue) && inputValue.length > 0"
      class="range"
    >
      <span
        v-for="(_, i) in inputValue"
        :key="i"
        :class="{
          'sm-slider-tooltip--start-point': i === 0,
          'sm-slider-tooltip--end-point': i === 1,
        }"
      >
        <span
          ref="targetElement"
          tabindex="-1"
          :style="`left:${getTooltipLeftArray[i]}`"
          aria-hidden="true"
          class="sm-slider-tooltip__tooltip-stops"
        />
        <output
          ref="contentElement"
          class="sm-slider-tooltip__content"
          role="tooltip"
        >
          <span class="sm-slider-tooltip__text">{{ inputValue[i] }} </span>
          <span
            data-popper-arrow
            class="sm-slider-tooltip__arrow"
          />
        </output>
      </span>
    </span>
    <span
      v-else
      class="default"
    >
      <span
        ref="targetElement"
        tabindex="-1"
        :style="`left:${tooltipLeft}`"
        aria-hidden="true"
        class="sm-slider-tooltip__tooltip-stops"
      />
      <output
        v-show="isStartTooltipVisible"
        ref="contentElement"
        :style="`left:${tooltipLeft}`"
        :aria-hidden="!isStartTooltipVisible"
        class="sm-slider-tooltip__content"
        role="tooltip"
      >
        <span class="sm-slider-tooltip__text">{{ inputValue }} </span>
        <span
          data-popper-arrow
          class="sm-slider-tooltip__arrow"
        />
      </output>
    </span>
  </div>
</template>

<style lang="scss" scoped>
@import "../../common/variables";
@import "../../common/mixins";

$sm-slider-tooltip--dark--text-color: $true-white;
$sm-slider-tooltip--dark--background-color: $grey-neu-black;

.sm-slider-tooltip {
  position: relative;

  $arrow-size: 12px;

  &__arrow {
    display: inline-block;
    bottom: 0;

    &::after {
      content: "";
      width: $arrow-size;
      height: $arrow-size;
      background: $sm-slider-tooltip--dark--background-color;
      border: 1px solid $sm-slider-tooltip--dark--background-color;
      transform: translate(-50%, -50%) rotate(45deg);
      position: absolute;
      left: 50%;
      bottom: -14px;
    }
  }

  &__content {
    padding: 9px 16px;
    border-radius: 4px;
    background: $sm-slider-tooltip--dark--background-color;
    color: $sm-slider-tooltip--dark--text-color;
    white-space: normal;
    z-index: $sm-slider-tooltip-z-index;
    pointer-events: all;
    height: 40px;
  }

  &__tooltip-stops {
    position: absolute;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
    pointer-events: none;
    bottom: 24px;
  }

  &--tooltip-range {
    .sm-slider-tooltip__tooltip-stops {
      top: -22px;
    }
  }

  &--start-point,
  &--end-point {
    opacity: 0;
    visibility: hidden;
  }

  &--end-tooltip {
    .sm-slider-tooltip--end-point {
      opacity: 1;
      visibility: visible;
    }
  }

  &--start-tooltip {
    .sm-slider-tooltip--start-point {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
