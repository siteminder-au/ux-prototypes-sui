<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { SmBannerTextAlign, SmBannerType } from './sm-banner.types'
import { useUniqueId } from '../use/unique-id'
import SmButton from '../sm-button/sm-button.vue'
import { SmButtonShape } from '../sm-button/sm-button.types'
import { useI18n } from '../../libs/vue-i18n'

const props = withDefaults(defineProps<{
  /**
   * Custom class names for the banner
   */
  customClass?: string
  /**
   * Whether to show the close button
   */
  showClose?: boolean
  /**
   * Whether to show icon
   */
  showIcon?: boolean
  /**
   * Whether to show component on top of all components by setting the highest z-index
   */
  showOnTop?: boolean
  /**
   * Banner body content alignment
   */
  textAlign?: SmBannerTextAlign
  /**
   * The content of the banner. Can be overridden by the default slot.
   */
  title?: string
  /**
   * The style of the banner. Accepts: 'success', 'info', 'alert', 'warning'
   */
  type?: SmBannerType
  /**
   * Whether the banner is visible. Use the `v-model:visible` to receive updates.
   */
  visible?: boolean
  /**
   * Callback before banner closes, and it will prevent banner from closing. Calling close() will close the banner
   * @default function(close)
   */
  beforeClose?: (close: () => void) => void
}>(), {
  customClass: '',
  showClose: false,
  showIcon: true,
  showOnTop: false,
  textAlign: SmBannerTextAlign.CENTER,
  title: '',
  type: SmBannerType.INFO,
  visible: false,
  beforeClose: (close: () => void) => close(),
})

const emit = defineEmits<{
  /**
   * Emitted when banner's visibility is updated with the payload
   */
  'update:visible': [state: boolean]
  /**
   * Emitted when banner is opened without parameters
   */
  open: []
  /**
   * Emitted when banner is closed without parameters
   */
  close: []
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

const iconName = computed(() => {
  const icons = {
    [SmBannerType.SUCCESS]: 'utility-success-alt',
    [SmBannerType.ALERT]: 'utility-alert',
    [SmBannerType.WARNING]: 'utility-warning',
    [SmBannerType.INFO]: undefined,
  }

  return icons[props.type]
})

const { id: contentElementId } = useUniqueId('sm-banner__content_')

const isVisible = computed<boolean>({
  get: () => props.visible,
  set: state => emit('update:visible', state),
})

const close = (): void => {
  if (typeof props.beforeClose === 'function') {
    props.beforeClose(() => {
      isVisible.value = false
    })
  } else {
    isVisible.value = false
  }
}

// Emit open / close events
watchEffect(() => {
  if (isVisible.value) {
    emit('open')
  } else {
    emit('close')
  }
})

defineExpose({
  isVisible,
  close,
})
</script>

<template>
  <transition name="sm-banner-transition">
    <div
      v-show="isVisible"
      class="sm-banner"
      :role="type === 'success' || type === 'info' ? 'status' : 'alert'"
      :aria-describedby="contentElementId || undefined"
      :class="[
        {
          [`sm-banner--type-${type}`]: !!type,
          'sm-visible-on-top': showOnTop,
          'sm-banner--visible': isVisible,
        },
        customClass,
      ]"
    >
      <div
        class="sm-banner__container"
      >
        <div
          class="sm-banner__content"
          :class="{
            [`sm-banner__content--text-${textAlign}`]: !!textAlign,
          }"
        >
          <span
            v-if="iconName && showIcon"
            class="sm-banner__icon"
          >
            <sm-icon
              :name="iconName"
              aria-hidden="true"
            />
          </span>

          <h6
            v-if="title"
            class="sm-banner__title"
          >
            {{ title }}
          </h6>

          <template v-else-if="$slots.default">
            <!-- @slot The main content of the banner. Overrides the title props. -->
            <slot />
          </template>

          <span v-if="$slots.action">
            <!-- @slot A primary action item. -->
            <slot name="action" />
          </span>
        </div>

        <sm-button
          v-show="showClose"
          class="sm-banner__close-icon"
          :shape="SmButtonShape.SQUARE"
          :title="i18n.t('sui-core.components.sm-banner.sm-banner.a11y__click-to-close')"
          :aria-label="i18n.t('sui-core.components.sm-banner.sm-banner.a11y__click-to-close')"
          @click="close"
        >
          <sm-icon
            name="action-cross"
            aria-hidden="true"
          />
        </sm-button>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-banner--text-color: (
  info: $true-white,
  success: $true-white,
  alert: $grey-neu-black,
  warning: $true-white,
);
$sm-banner--background-color: (
  info: $primary-blue-midnight,
  success: $app-success,
  alert: $app-alert,
  warning: $app-warning,
);

.sm-banner {
  position: relative;

  &__container {
    display: flex;
    align-items: center;
    min-height: $sm-56;
    padding: 0 $sm-8;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;

    &--text {
      &-center {
        justify-content: center;
      }

      &-start {
        justify-content: flex-start;
      }
    }
  }

  &__close-icon.sm-button {
    transition: all 0.3s;
    margin-left: auto;

    .sm-button__content {
      color: white;
      background: transparent;
    }
  }

  &--type-alert {
    .sm-banner__close-icon.sm-button {
      .sm-button__content {
        color: black;
      }
    }
  }

  &__title {
    margin-bottom: 0;

    @include margin($right: rem($sm-xxsm), $left: rem($sm-xxsm));
  }

  &__icon {
    margin-top: 0;
    width: $sm-24;
    height: $sm-24;
    position: relative;

    .sm-icon {
      font-size: 24px;
    }
  }

  /* Type */
  @each $type in "info", "success", "alert", "warning" {
    &--type-#{$type} {
      .sm-banner__container {
        color: map-get($sm-banner--text-color, $type);
        background: map-get($sm-banner--background-color, $type);
      }
    }
  }
}
</style>
