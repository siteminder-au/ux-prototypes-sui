<script setup lang="ts">
import { SmLoadingSpinnerColor, SmLoadingSpinnerSize, SmLoadingSpinnerType } from './sm-loading-spinner.types'
import { useI18n } from '../../../libs/vue-i18n'

withDefaults(
  defineProps<{
    /**
     * The message to be read by screen readers when the loading spinner is displayed.
     * If not provided, a default message will be used.
     */
    ariaLoadingMessage?: string
    /**
     * The style of the loading spinner. Accepts 'fullscreen', 'inline'
     */
    type?: SmLoadingSpinnerType
    /**
     * The style of the loading spinner. Accepts 'primary', 'neutral'
     */
    color?: SmLoadingSpinnerColor
    /**
     * The size of the loading spinner. Accepts 'small', 'large'
     */
    size?: SmLoadingSpinnerSize
  }>(),
  {
    ariaLoadingMessage: undefined,
    type: SmLoadingSpinnerType.INLINE,
    color: SmLoadingSpinnerColor.PRIMARY,
    size: SmLoadingSpinnerSize.SMALL,
  },
)

const { i18n } = useI18n()
</script>

<template>
  <div
    class="sm-loading-spinner__loading-spinner"
    :class="{
      [`sm-loading-spinner__color-${color}`]: color,
      [`sm-loading-spinner__size-${size}`]: size,
      'sm-loading-spinner__inline': type === SmLoadingSpinnerType.INLINE,
    }"
    aria-live="polite"
    role="status"
  >
    <span class="sm-loading-spinner__label">
      {{ ariaLoadingMessage ?? i18n.t('sui-core.components.loading.sm-loading-spinner.sm-loading-spinner.a11y__label') }}
    </span>
    <svg
      viewBox="25 25 50 50"
      class="circular"
      :aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        r="20"
        fill="none"
        class="path"
      />
    </svg>
  </div>
</template>

<style lang="scss">
:root {
  --sm-loading-spinner-primary-color: var(--color-primary);
  --sm-loading-spinner-neutral-color: var(--color-disabled-dark);
}

.sm-loading-spinner__color-primary .circular .path {
  stroke: var(--sm-loading-spinner-primary-color);
}

.sm-loading-spinner__color-neutral .circular .path {
  stroke: var(--sm-loading-spinner-neutral-color);
}

.sm-loading-spinner__loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.sm-loading-spinner__loading-spinner.sm-loading-spinner__inline {
  display: inline;
  vertical-align: middle;
}

.sm-loading-spinner__size-small .circular {
  height: 16px;
  width: 16px;
  animation: sm-loading-spinner-loading-rotate 2s linear infinite;
}

.sm-loading-spinner__size-large .circular {
  height: 48px;
  width: 48px;
  animation: sm-loading-spinner-loading-rotate 2s linear infinite;
}

.sm-loading-spinner__loading-spinner .circular .path {
  animation: sm-loading-spinner-loading-dash 1.5s ease-in-out infinite;
  stroke-width: 5;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-linecap: round;
}

.sm-loading-spinner__loading-spinner.sm-loading-spinner__size-large .circular .path {
  stroke-width: 4;
}

.sm-loading-spinner__label {
  /* Hide the label visually but keep it accessible for screen readers */
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(50%);
}

@keyframes sm-loading-spinner-loading-rotate {
  to {
    transform: rotate(1turn);
  }
}

@keyframes sm-loading-spinner-loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }

  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
</style>
