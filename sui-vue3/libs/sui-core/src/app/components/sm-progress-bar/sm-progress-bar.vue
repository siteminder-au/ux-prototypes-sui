<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { SmProgressBarStatus, SmProgressBarType } from './sm-progress-bar.types'
import { useI18n } from '../../libs/vue-i18n'

const props = withDefaults(defineProps<{
  /**
   * Set the percentage of the progress bar. Default is 0
   */
  percentage: number
  /**
   * The status of progress bar. Accepts: success, info, alert, warning. Default is 'info'
   */
  status?: SmProgressBarStatus
  /**
   * Set the height of the line progress bar stroke. Default is 18
   */
  strokeHeight?: number
  /**
   * Whether to place the percentage inside progress bar, only works when type is 'line'
   */
  textInside?: boolean
  /**
   * Set the liner transition timing
   */
  transitionTiming?: string
  /**
   * The type of progress bar. Accepts: line, circle
   */
  type?: SmProgressBarType
  /**
   * Set the canvas width of circle progress bar
   */
  width?: number
}>(), {
  percentage: 0,
  status: SmProgressBarStatus.INFO,
  strokeHeight: 18,
  textInside: false,
  transitionTiming: '0.3s',
  type: SmProgressBarType.LINE,
  width: 72,
})

const emit = defineEmits<{
  'update:percentage': [percentage: number]
  change: []
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

const setWidth = ref<string>()
const getTrackPath = ref<string>()

const getPercentage = computed({
  get: () => props.percentage,
  set: (state) => {
    emit('update:percentage', state)
  },
})

const relativeStrokeWidth = computed(() => ((props.strokeHeight / props.width) * 100).toFixed(1))

const circlePathStyle = computed(() => {
  const radius = 50 - parseFloat(relativeStrokeWidth.value) / 2
  const getRadius = 2 * Math.PI * radius

  return {
    strokeDasharray: `${getRadius}px,${getRadius}px`,
    strokeDashoffset: `${(1 - getPercentage.value / 100) * getRadius}px`,
    transition: 'stroke-dashoffset 0.3s ease 0s, stroke 0.3s ease',
  }
})

const trackPath = (): void => {
  const radius = Number(50 - parseFloat(relativeStrokeWidth.value) / 2)
  getTrackPath.value = `M 50 50 m 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${radius * 2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}`
}

onMounted(() => {
  setTimeout(() => {
    setWidth.value = `${getPercentage.value}%`
  }, 300)
  trackPath()
})

// Emit change event
watchEffect(() => {
  if (typeof getPercentage.value === 'number') {
    setWidth.value = `${getPercentage.value}%`
    emit('change')
  }
})

defineExpose({
  setWidth,
  relativeStrokeWidth,
  getTrackPath,
  circlePathStyle,
  getPercentage,
})
</script>

<template>
  <div
    class="sm-progress-bar"
    :class="{
      [`sm-progress-bar--type-${type}`]: !!type,
      [`sm-progress-bar--status-${status}`]: !!status,
    }"
  >
    <div
      v-if="type === SmProgressBarType.LINE"
      class="sm-progress-bar__line"
      :aria-label="i18n.t('sui-core.components.sm-progress-bar.sm-progress-bar.a11y__lineProgressBar')"
      role="progressbar"
      :aria-valuenow="getPercentage"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="sm-progress-bar__stroke"
        :class="{ 'sm-progress-bar__stroke-empty': textInside && getPercentage === 0 }"
        :style="{ height: strokeHeight + 'px', width: setWidth, transition: `width ${transitionTiming}` }"
      >
        <span
          v-if="textInside"
          class="sm-progress-bar__text-inside sm-text--x-small"
        >
          <!-- @slot The custom label -->
          <slot>{{ setWidth }}</slot>
        </span>
      </div>
    </div>
    <div
      v-else
      role="progressbar"
      :aria-label="i18n.t('sui-core.components.sm-progress-bar.sm-progress-bar.a11y__circleProgressBar')"
      :aria-valuenow="getPercentage"
      aria-valuemin="0"
      aria-valuemax="100"
      class="sm-progress-bar__circle"
      :style="{ height: width + 'px', width: width + 'px', transition: `width ${transitionTiming}` }"
    >
      <svg viewBox="0 0 100 100">
        <path
          :class="{ [`sm-progress-bar__circle-track--status-${status}`]: !!status }"
          :d="getTrackPath"
          :stroke-width="relativeStrokeWidth"
          fill="none"
        />
        <path
          class="sm-progress-bar__path"
          :d="getTrackPath"
          stroke-linecap="round"
          :class="{ [`sm-progress-bar__circle-path--status-${status}`]: !!status }"
          :stroke-width="relativeStrokeWidth"
          fill="none"
          :style="circlePathStyle"
        />
      </svg>
    </div>

    <span
      v-if="!textInside"
      class="sm-progress-bar__text-outside sm-text--x-small"
    >
      <!-- @slot The custom label -->
      <slot>{{ setWidth }}</slot>
    </span>
  </div>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-progress-bar--info-background-color: $blue-neu-med;
$sm-progress-bar--info-color: $primary-blue;
$sm-progress-bar--text-color: $true-white;
$sm-progress-bar--text-color-dark: $grey-neu-black;
$sm-progress-bar--success-background-color: $app-success-light;
$sm-progress-bar--success-color: $app-success;
$sm-progress-bar--alert-background-color: $app-alert-light;
$sm-progress-bar--alert-color: $app-alert-mid;
$sm-progress-bar--warning-background-color: $app-warning-light;
$sm-progress-bar--warning-color: $app-warning;

.sm-progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  position: relative;

  + .sm-progress-bar {
    margin-top: 26px;
  }

  &--type-line {
    .sm-progress-bar__line {
      width: 100%;
      border-radius: 100px;
      max-width: 100%;
    }
  }

  &--type-circle {
    .sm-progress-bar__text-outside {
      transition: width 0.3s;
      transition-timing-function: linear;
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      text-align: center;
      margin: 0;
      transform: translateY(-50%);
    }
  }

  &--status-info {
    .sm-progress-bar__line {
      background-color: $sm-progress-bar--info-background-color;

      .sm-progress-bar__stroke {
        background-color: $sm-progress-bar--info-color;
      }

      .sm-progress-bar__stroke-empty {
        background-color: transparent;
      }
    }
  }

  &--status-success {
    .sm-progress-bar__line {
      background-color: $sm-progress-bar--success-background-color;

      .sm-progress-bar__stroke {
        background-color: $sm-progress-bar--success-color;
      }

      .sm-progress-bar__stroke-empty {
        background-color: transparent;
      }
    }
  }

  &--status-alert {
    .sm-progress-bar__line {
      background-color: $sm-progress-bar--alert-background-color;

      .sm-progress-bar__stroke {
        background-color: $sm-progress-bar--alert-color;
      }

      .sm-progress-bar__stroke-empty {
        background-color: transparent;
      }

      .sm-progress-bar__text-inside {
        color: $sm-progress-bar--text-color-dark;
      }
    }
  }

  &--status-warning {
    .sm-progress-bar__line {
      background-color: $sm-progress-bar--warning-background-color;

      .sm-progress-bar__stroke {
        background-color: $sm-progress-bar--warning-color;
      }

      .sm-progress-bar__stroke-empty {
        background-color: transparent;
      }
    }
  }

  &__stroke {
    transition: width 0.3s;
    transition-timing-function: linear;
    border-radius: 99px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    flex-direction: column;
    width: 0;
  }

  &__circle {
    width: 0;
    transition: width 0.3s;
    transition-timing-function: linear;
    background: $sm-progress-bar--text-color;

    &-track--status-info {
      stroke: $sm-progress-bar--info-background-color;
    }

    &-track--status-success {
      stroke: $sm-progress-bar--success-background-color;
    }

    &-track--status-alert {
      stroke: $sm-progress-bar--alert-background-color;
    }

    &-track--status-warning {
      stroke: $sm-progress-bar--warning-background-color;
    }

    &-path--status-info {
      stroke: $sm-progress-bar--info-color;
    }

    &-path--status-success {
      stroke: $sm-progress-bar--success-color;
    }

    &-path--status-alert {
      stroke: $sm-progress-bar--alert-color;
    }

    &-path--status-warning {
      stroke: $sm-progress-bar--warning-color;
    }
  }

  .sm-progress-bar__text-inside {
    transition: width 0.3s;
    transition-timing-function: linear;
    color: $sm-progress-bar--text-color;
    padding: 0 $sm-8;
    font-weight: 600;
  }

  .sm-progress-bar__text-outside {
    font-weight: 600;
    padding-left: $sm-4;
  }

  &__stroke-empty {
    width: auto;
    align-items: flex-start;

    .sm-progress-bar__text-inside {
      color: $sm-progress-bar--text-color-dark;
    }
  }
}
</style>
