<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useUniqueId } from '../use/unique-id'
import { useI18n } from '../../libs/vue-i18n'

import SmButton from '../sm-button/sm-button.vue'
import { SmToastType, SmToastPlacement } from './sm-toast.types'
import { SmButtonShape, SmButtonType } from '../sm-button/sm-button.types'

import iconActionCross from './icons/action-cross'
import iconUtilityAlert from './icons/utility-alert'
import iconUtilityInformation from './icons/utility-information'
import iconUtilitySuccessAlt from './icons/utility-success-alt'
import iconUtilityWarning from './icons/utility-warning'

interface IconDefinition {
  width: number
  height: number
  viewBox: string
  path: string
}

const props = withDefaults(defineProps<{
  /**
   * Whether the "close" event will be automatically emitted after the timeout.
   * This will only work if isTimeout is true and showClose is false
   */
  isTimeout?: boolean
  /**
   * The content of the toast. Can be overridden by the default slot.
   */
  message?: string
  /**
   * Whether to show mini info toast
   */
  miniInfo?: boolean
  /**
   * The position of the toast, relative to the screen. Accepts: 'static', 'top', 'top-right', 'top-left', 'bottom', 'bottom-left', 'bottom-right'
   */
  placement?: SmToastPlacement
  /**
   * Whether toast's close button should be displayed
   */
  showClose?: boolean
  /**
   * Whether to show component on top of all components by setting the highest z-index
   */
  showOnTop?: boolean
  /**
   * The title of the toast. Can be overridden by the title slot.
   */
  title?: string
  /**
   * The style of the toast. Accepts: 'success', 'info', 'alert', 'warning'
   */
  type?: SmToastType
  /**
   * Delay in milliseconds before the toast automatically emits "close" event.
   * This will only work if isTimeout is true and showClose is false
   */
  timeout?: number
  /**
   * Whether the toast is visible
   */
  visible?: boolean
}>(), {
  isTimeout: false,
  message: '',
  miniInfo: false,
  placement: SmToastPlacement.STATIC,
  showClose: false,
  showOnTop: false,
  title: '',
  type: SmToastType.INFO,
  timeout: 5000,
  visible: false,
})

const emit = defineEmits<{
  close: [value?: Event]
  click: [value: MouseEvent]
  mouseenter: [value: MouseEvent]
  mouseleave: [value: MouseEvent]
  'update:visible': [state: boolean]
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

const timer = ref<any>(null)

const iconName = computed(() => {
  const icons = {
    [SmToastType.ALERT]: 'sm-icon--utility-alert',
    [SmToastType.INFO]: 'sm-icon--utility-information',
    [SmToastType.SUCCESS]: 'sm-icon--utility-success-alt',
    [SmToastType.WARNING]: 'sm-icon--utility-warning',
  }
  return icons[props.type]
})

const iconData: Record<string, IconDefinition> = {
  'sm-icon--utility-information': iconUtilityInformation,
  'sm-icon--utility-success-alt': iconUtilitySuccessAlt,
  'sm-icon--utility-alert': iconUtilityAlert,
  'sm-icon--utility-warning': iconUtilityWarning,
}

const { id: contentElementId } = useUniqueId('sm-toast__content_')

const isVisible = computed<boolean>({
  get: () => props.visible,
  set: state => emit('update:visible', state),
})

const mouseenter: GlobalEventHandlers['onmouseenter'] = (e) => {
  emit('mouseenter', e)
}
const mouseleave: GlobalEventHandlers['onmouseleave'] = (e) => {
  emit('mouseleave', e)
}
const click: GlobalEventHandlers['onclick'] = (e) => {
  emit('click', e)
}
const eventBindings = ref()

const mouseEvents = {
  mouseenter,
  mouseleave,
  click,
}
eventBindings.value = mouseEvents

onMounted(() => {
  if (props.isTimeout && !props.showClose) {
    timer.value = setTimeout(() => {
      emit('close')
    }, props.timeout)
  }
})

onBeforeUnmount(() => {
  if (props.isTimeout && !props.showClose) {
    clearTimeout(timer.value)
  }
})

defineExpose ({
  // we end up inlining the icons in sm-toast to avoid the toastService from having to rely on sm-icon being registered
  // this is also good for tree-shaking purposes and allows downstream projects to consume toastService without having to install @siteminder/sui-icons package
  // toastService also requires to be attached to a separate vue app instance which is separate to the main app instance
  iconActionCross,
  iconData,
  iconName,
  contentElementId,
  isVisible,
  eventBindings,
})
</script>

<template>
  <div
    class="sm-toast"
    role="alert"
    :aria-describedby="contentElementId || undefined"
    :class="{
      [`sm-toast--type-${type}`]: !!type,
      [`sm-toast--placement-${placement}`]: !!placement,
      'sm-toast--has-title': (title || $slots.title),
      'sm-visible-on-top': showOnTop,
      'sm-toast--mini-info': miniInfo
    }"
    v-on="eventBindings"
  >
    <!-- @event click Same as native click -->

    <div class="sm-toast__icon">
      <span :class="['sm-icon', iconName]">
        <svg
          version="1.1"
          :viewBox="iconData[iconName].viewBox"
          :style="{ width: '1em', height: '1em' }"
          focusable="false"
          :aria-hidden="true"
          role="img"
          v-html="iconData[iconName].path"
        ></svg>
      </span>
    </div>

    <div class="sm-toast__body">
      <div class="sm-toast__content">
        <!-- @slot The main content of the toast. Overrides the title and message props. -->
        <slot v-if="$slots.default" />

        <template v-else>
          <h4
            v-if="title"
            class="sm-toast__title"
          >
            {{ title }}
          </h4>
          <p
            v-if="message"
            class="sm-toast__message"
          >
            {{ message }}
          </p>
        </template>

        <div
          v-if="$slots.action"
          class="sm-toast__action"
        >
          <!-- @slot A primary action for the toast. -->
          <slot name="action" />
        </div>
      </div>
    </div>

    <div
      v-if="showClose"
      class="sm-toast__close"
    >
      <!-- @event close Emits when the toast is closed -->
      <sm-button
        :shape="SmButtonShape.SQUARE"
        :type="SmButtonType.TEXT"
        :aria-label="i18n.t('sui-core.components.sm-toast.sm-toast.a11y__click-to-close')"
        @click="(e) => $emit('close', e)"
      >
        <span class="sm-icon sm-icon--action-cross">
          <svg
            version="1.1"
            :viewBox="iconActionCross.viewBox"
            :style="{ width: '1em', height: '1em' }"
            focusable="false"
            :aria-hidden="true"
            role="img"
            v-html="iconActionCross.path"
          ></svg>
        </span>
      </sm-button>
    </div>
  </div>
</template>

<style lang="scss">
@import "../../common/variables";

$sm-toast--text-color: (
  info: $grey-neu-black,
  success: $grey-neu-black,
  alert: $grey-neu-black,
  warning: $grey-neu-black,
);
$sm-toast--icon-color: (
  info: $app-info,
  success: $app-success,
  alert: $grey-neu-black,
  warning: $app-warning,
);
$sm-toast--icon-background-color: (
  info: $app-info-mid,
  success: $app-success-mid,
  alert: $app-alert-mid,
  warning: $app-warning-mid,
);
$sm-toast--background-color: (
  info: $app-info-light,
  success: $app-success-light,
  alert: $app-alert-light,
  warning: $app-warning-light,
);
$sm-toast--border-color: (
  info: $app-info-mid,
  success: $app-success-mid,
  alert: $app-alert-mid,
  warning: $app-warning-mid,
);
$sm-toast--border-top-color: (
  info: $app-info,
  success: $app-success,
  alert: $app-alert,
  warning: $app-warning,
);
$sm-toast--close-color: $grey-neu-dark;

.sm-toast {
  display: flex;
  border-radius: 8px;
  border-width: 1px;
  border-style: solid;
  border-top-width: 2px;
  padding: $sm-16;
  margin-bottom: $sm-32;

  > * {
    margin: auto 10px auto 0;

    &:last-child {
      margin-right: 0;
    }
  }

  &--mini-info {
    width: max-content !important;

    .sm-toast__icon {
      display: none;
    }

    .sm-toast__message {
      display: inline;
    }

    .sm-toast__action {
      display: inline;
      margin-left: 18px;
    }
  }

  &__icon {
    font-size: 24px;
    line-height: 1;
    margin-top: 0;
  }

  &__body {
    flex-grow: 1;
    display: flex;
  }

  &__content {
    padding: 6px 0; // Offsets the heading with the icon element
  }

  &__title {
    margin-bottom: $sm-8;
  }

  &__message:last-child {
    margin-bottom: 0;
  }

  &__close .sm-button {
    .sm-button__content {
      color: $sm-toast--close-color;
      margin-top: -9px;
      margin-bottom: -9px;
      margin-right: -9px;
    }
  }

  &__icon,
  &__close {
    align-self: flex-start;
  }

  &--has-title &__close {
    margin-top: 0;
  }

  &__icon {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    position: relative;

    .sm-icon {
      position: absolute;
      z-index: 2;
      top: 50%;
      left: 50%;
      font-size: 20px;
      transform: translate(-50%, -50%);
    }
  }

  /* Type */
  @each $type in 'info', 'success', 'alert', 'warning' {

    &--type-#{$type} {
      color: map-get($sm-toast--text-color, $type);
      background: map-get($sm-toast--background-color, $type);
      border-color: map-get($sm-toast--border-color, $type);
      border-top-color: map-get($sm-toast--border-top-color, $type);
    }

    &--type-#{$type} &__icon {
      color: map-get($sm-toast--icon-color, $type);
      background: map-get($sm-toast--icon-background-color, $type);
    }

  }

  /* Placement */

  & {
    position: fixed;
    max-width: calc(100vw - 32px);
    width: 743px;
    z-index: $sm-toast-z-index;
    transition: all 0.3s ease;
    opacity: 0;
    margin-top: $sm-40;
    box-shadow:
      0 3px 17px -8px rgba(24, 58, 108, 0.19),
      0 12px 11px -13px rgba(24, 58, 108, 0.18),
      0 10px 24px -9px rgba(24, 58, 108, 0.12);
  }

  &--placement-static {
    position: relative;
    min-width: none;
    box-shadow: none;
    margin-top: 0;
    opacity: 1;
  }

  &--placement-top {
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
  }

  &--placement-top-left {
    top: 30px;
    left: 30px;
  }

  &--placement-top-right {
    top: 30px;
    right: 30px;
  }

  &--placement-bottom {
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
  }

  &--placement-bottom-left {
    bottom: 30px;
    left: 30px;
  }

  &--placement-bottom-right {
    bottom: 30px;
    right: 30px;
  }

  /* Enter / exit animation */
  &--in {
    opacity: 1;
    margin-top: 0;
  }

}
</style>
