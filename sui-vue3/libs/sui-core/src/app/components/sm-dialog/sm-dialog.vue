<script setup lang="ts">
import { watch, ref, onMounted, onBeforeUnmount, nextTick, Ref, watchEffect } from 'vue'
import { useUniqueId } from '../use/unique-id'
import { useScrollLock } from '../use/scroll-lock'
import { useCycleFocus } from '../use/cycle-focus'
import { useOnEscape } from '../use/on-escape'
import { useReturnToFocus } from '../use/return-to-focus'
import { useI18n } from '../../libs/vue-i18n'
import iconActionCross from './icons/action-cross'
import iconUtilityAlert from './icons/utility-alert'
import iconUtilityWarning from './icons/utility-warning'
import SmButton from '../sm-button/sm-button.vue'
import { SmDialogType } from './sm-dialog.types'
import { SmButtonType, SmButtonShape } from '../sm-button/sm-button.types'

const props = withDefaults(defineProps<{
  /**
   * The v-model value
   * IMPORTANT: The .sync modifier for v-bind has been removed as per the Vue3 breaking change - https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
   * Use v-model with argument instead.
   *
   * Whether the modal is visible
   */
  visible?: boolean | object
  /**
   * The title of the dialog. Can also be passed as a named slot.
   */
  title?: string
  /**
   * The body content of the dialog (accepts html). Can also be passed as the default slot.
   */
  bodyContent?: string
  /**
   * The style of the dialog. Accepts: 'prompt', 'alert'
   */
  type?: SmDialogType
  /**
   * Whether the dialog takes up the full viewport
   */
  fullscreen?: boolean
  /**
   * Whether the dialog can be closed by clicking the underlay
   */
  closeOnClickModal?: boolean
  /**
   * Whether the dialog can be closed by pressing ESC
   */
  closeOnPressEscape?: boolean
  /**
   * Whether to show a close button
   */
  showClose?: boolean
  /**
   * Whether to show the cancel button
   */
  showCancel?: boolean
  /**
   * Whether to show the confirm button
   */
  showConfirm?: boolean
  /**
   * Callback before dialog closes, and it will prevent dialog from closing. Calling close() will close the dialog
   * @default function(close)
   */
  beforeClose?: (close: () => void) => void
  /**
   * Callback before dialog's confirm action, and it will prevent dialog from closing. Calling confirm() will close the dialog
   * @default function(confirm)
   */
  beforeConfirm?: (confirm: () => void) => void
  /**
   * Custom class names for the dialog
   */
  customClass?: string
  /**
   * Custom text for the cancel button
   */
  cancelButtonText?: string
  /**
   * Button type for the cancel button
   */
  cancelButtonType?: SmButtonType
  /**
   * Custom text for the confirm button
   */
  confirmButtonText?: string
  /**
   * Button type for the confirm button
   */
  confirmButtonType?: SmButtonType
  /**
   * Whether scroll of body is disabled while dialog is displayed
   */
  lockScroll?: boolean
  /**
   * Value for margin-top of the dialog CSS
   */
  top?: string
  /**
   * Whether to show component on top of all components by setting the highest z-index
   */
  showOnTop?: boolean
  /**
   * Whether to hide border on top
   */
  hideBorderOnTop?: boolean
  /**
   * Determine whether cancel button is loading
   */
  cancelButtonLoading?: boolean
  /**
   * Determine whether cancel button is disabled
   */
  cancelButtonDisabled?: boolean
  /**
   * Determine whether confirm button is loading
   */
  confirmButtonLoading?: boolean
  /**
   * Determine whether confirm button is disabled
   */
  confirmButtonDisabled?: boolean
  /**
   * Custom class names for the dialog content
   */
  contentClass?: string
}>(), {
  visible: false,
  title: '',
  bodyContent: '',
  type: SmDialogType.PROMPT,
  fullscreen: false,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showClose: true,
  showCancel: true,
  showConfirm: true,
  beforeClose: (close: () => void) => close(),
  beforeConfirm: (confirm: () => void) => confirm(),
  customClass: '',
  cancelButtonText: '',
  cancelButtonType: SmButtonType.TERTIARY,
  confirmButtonText: '',
  confirmButtonType: SmButtonType.PRIMARY,
  lockScroll: true,
  top: '',
  showOnTop: false,
  hideBorderOnTop: false,
  cancelButtonLoading: false,
  cancelButtonDisabled: false,
  confirmButtonLoading: false,
  confirmButtonDisabled: false,
  contentClass: '',
})

const emit = defineEmits<{
  /** Emitted when dialog is close */
  close: []
  /** Emitted when dialog is open */
  open: []
  /** Emitted when dialog is visible */
  'update:visible': [value: boolean]
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

const content: Ref<HTMLElement | null> = ref(null)

// internal visible state
const isVisible = ref<boolean | object>(false)

watch(() => props.visible, () => {
  isVisible.value = props.visible
}, { immediate: true })

const open = (): void => {
  isVisible.value = true
  emit('update:visible', true)
}

const close = (): void => {
  if (typeof props.beforeClose === 'function') {
    props.beforeClose(() => {
      isVisible.value = false
    })
  } else {
    isVisible.value = false
  }
  emit('update:visible', false)
}

const confirm = (): void => {
  if (typeof props.beforeConfirm === 'function') {
    props.beforeConfirm(() => {
      isVisible.value = false
    })
  } else {
    isVisible.value = false
  }
  emit('update:visible', false)
}

// Emit open / close events
watchEffect(() => {
  if (isVisible.value) {
    emit('open')
  } else {
    emit('close')
  }
})

// Close when the user hits Escape
useOnEscape(() => {
  if (isVisible.value && props.closeOnPressEscape) {
    close()
  }
})

// Lock the body scroll
const scrollLock = useScrollLock('sm-dialog-')
watchEffect(() => {
  if (props.lockScroll) {
    if (isVisible.value) {
      scrollLock.lock()
    } else {
      scrollLock.unlock()
    }
  }
})

onBeforeUnmount(() => scrollLock.unlock())

// Shift focus on open & close
const returnToFocus = useReturnToFocus()
watchEffect(async () => {
  if (isVisible.value) {
    returnToFocus.capture()
    if (content.value) {
      // Wait for DOM insertion via service to complete
      await nextTick()
      content.value.focus()
    }
  } else {
    returnToFocus.returnTo()
  }
})

// Cycle the focus within the dialog
onMounted(() => {
  if (content.value) {
    useCycleFocus(content.value)
  }
})

const { id: titleElementId } = useUniqueId('sm-dialog__title_')
const { id: bodyElementId } = useUniqueId('sm-dialog__body_')

defineExpose ({
  // we end up inlining these 3 icons in sm-dialog to avoid the dialogService from having to rely on sm-icon being registered
  // this is also good for tree-shaking purposes and allows downstream projects to consume dialogService without having to install @siteminder/sui-icons package
  // dialogService also requires to be attached to a separate vue app instance which is separate to the main app instance
  iconActionCross,
  iconUtilityAlert,
  iconUtilityWarning,
  isVisible,
  open,
  close,
  confirm,
  titleElementId,
  bodyElementId,
  i18n,
  content,
})
</script>

<template>
  <transition name="sm-dialog-transition">
    <div
      v-show="isVisible"
      class="sm-dialog"
      role="alertdialog"
      aria-modal="true"
      aria-live="polite"
      :aria-labelledby="titleElementId || undefined"
      :aria-describedby="bodyElementId || undefined"
      :class="{
        [`sm-dialog--type-${type}`]: !!type,
        [customClass]: !!customClass,
        'sm-dialog--fullscreen': fullscreen,
        'sm-visible-on-top': showOnTop,
        'sm-dialog--hide-border': hideBorderOnTop,
      }"
    >
      <div
        class="sm-dialog__underlay"
        aria-hidden="true"
        @click.stop="() => (closeOnClickModal ? close() : null)"
      />

      <div
        ref="content"
        tabindex="-1"
        :class="contentClass"
        :style="{ marginTop: top }"
        class="sm-dialog__content"
      >
        <div
          v-if="showClose"
          class="sm-dialog__close"
        >
          <sm-button
            :shape="SmButtonShape.SQUARE"
            class="sm-dialog__close-button"
            :title="i18n.t('sui-core.components.sm-dialog.sm-dialog.a11y__click-to-close')"
            :aria-label="i18n.t('sui-core.components.sm-dialog.sm-dialog.a11y__click-to-close')"
            @click="close"
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

        <div
          v-if="$slots.title || title"
          :id="titleElementId || undefined"
          class="sm-dialog__title"
        >
          <div
            v-if="type === 'alert'"
            class="sm-dialog--type-alert-icon"
          >
            <span class="sm-icon sm-icon--utility-alert">
              <svg
                version="1.1"
                :viewBox="iconUtilityAlert.viewBox"
                :style="{ width: '1em', height: '1em' }"
                focusable="false"
                :aria-hidden="true"
                role="img"
                v-html="iconUtilityAlert.path"
              ></svg>
            </span>
          </div>
          <div
            v-if="type === 'warning'"
            class="sm-dialog--type-warning-icon"
          >
            <span class="sm-icon sm-icon--utility-warning">
              <svg
                version="1.1"
                :viewBox="iconUtilityWarning.viewBox"
                :style="{ width: '1em', height: '1em' }"
                focusable="false"
                :aria-hidden="true"
                role="img"
                v-html="iconUtilityWarning.path"
              ></svg>
            </span>
          </div>
          <!-- @slot The title of the dialog -->
          <slot name="title">
            <h4>{{ title }}</h4>
          </slot>
        </div>

        <div
          v-if="$slots.default"
          :id="bodyElementId || undefined"
          class="sm-dialog__body"
        >
          <!-- @slot The body of the dialog -->
          <slot />
        </div>

        <div
          v-else-if="bodyContent"
          :id="bodyElementId || undefined"
          class="sm-dialog__body"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p v-html="bodyContent" />
        </div>

        <div
          v-if="$slots.footer"
          class="sm-dialog__footer sm-dialog__stickyfooter"
        >
          <!-- @slot The footer of the dialog -->
          <slot name="footer" />
        </div>

        <div
          v-else-if="showCancel || showConfirm"
          class="sm-dialog__footer"
        >
          <sm-button
            v-if="showCancel"
            :loading="cancelButtonLoading"
            :disabled="cancelButtonDisabled"
            :type="cancelButtonType"
            :aria-label="cancelButtonText || i18n.t('sui-core.components.sm-dialog.sm-dialog.cancelButtonText')"
            data-sm-button-test="sm-dialog-cancel"
            @click="close"
          >
            {{ cancelButtonText || i18n.t("sui-core.components.sm-dialog.sm-dialog.cancelButtonText") }}
          </sm-button>

          <sm-button
            v-if="showConfirm"
            :type="confirmButtonType"
            :loading="confirmButtonLoading"
            :disabled="confirmButtonDisabled"
            :aria-label="confirmButtonText || i18n.t('sui-core.components.sm-dialog.sm-dialog.confirmButtonText')"
            data-sm-button-test="sm-dialog-confirm"
            @click="confirm"
          >
            {{ confirmButtonText || i18n.t("sui-core.components.sm-dialog.sm-dialog.confirmButtonText") }}
          </sm-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
@import "../../common/variables";

.sm-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: $sm-dialog-z-index;
  display: flex;
  align-items: center;
  justify-content: center;

  &--type {
    &-alert {
      .sm-dialog__content {
        padding-left: 70px;
        border-color: var(--sm-c-dialog-color-border-alert, var(--color-alert, $app-alert));
      }
    }

    &-alert-icon {
      color: var(--sm-c-dialog-color-icon-alert, var(--color-alert, $app-alert));
      position: absolute;
      left: 32px;
      top: 34px;

      .sm-icon {
        font-size: var(--sm-c-dialog-icon-font-size-alert, 22px);
      }
    }

    &-warning {
      .sm-dialog__content {
        padding-left: 70px;
        border-color: var(--sm-c-dialog-color-border-warning, var(--color-warning, $app-warning));
      }
    }

    &-warning-icon {
      color: var(--sm-c-dialog-color-icon-warning, var(--color-warning, $app-warning));
      position: absolute;
      left: 32px;
      top: 34px;

      .sm-icon {
        font-size: var(--sm-c-dialog-icon-font-size-warning, 22px);
      }
    }
  }

  &--hide-border {
    .sm-dialog__content {
      border-top: 0;
    }
  }

  &__content {
    min-height: var(--sm-c-dialog-min-height, 100px);
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 30px;
    width: 100%;
    max-width: var(--sm-c-dialog-max-width, 600px);
    padding: var(--sm-c-dialog-padding, $sm-32);
    background: var(--sm-c-dialog-color-background, var(--color-pure-white, $true-white));
    color: var(--sm-c-dialog-color-text, var(--color-black, $grey-neu-black));
    position: relative;
    z-index: 2;
    border-top: var(--sm-c-dialog-border-width, 2px) solid var(--sm-c-dialog-color-border, var(--color-primary, $primary-blue));
    border-radius: 8px;
    transform: translateY(0);
    box-shadow: var(--sm-c-dialog-shadow,
      0 3px 17px -8px rgba(24, 58, 108, 0.43),
      0 22px 7px -21px rgba(24, 58, 108, 0.14),
      0 15px 38px -11px rgba(24, 58, 108, 0.15)) !important; // Important used to override global focus styling
  }

  &__underlay {
    /* 113, 113, 113 is #717171, the `var()` fallback doesn't work with hex */
    background: rgba(var(--sm-c-dialog-underlay-color-background, 113, 113, 113), 0.3);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__title {
    margin-bottom: $sm-12;

    h4 {
      margin: 0;
      padding-right: $sm-16;
    }
  }

  &__footer {
    margin: var(--sm-c-dialog-footer-margin, $sm-24 0 0 0);
    text-align: right;
  }

  &__close {
    position: absolute;
    top: 12px;
    right: 12px;
  }

  &__close-button.sm-button {
    .sm-button__content {
      background: transparent;
    }
  }

  /**
   * fullscreen
   */
  &--fullscreen &__content {
    overflow: hidden;
    height: 100%;
    margin: var(--sm-c-dialog-margin-fullscreen, 40px);
    max-width: var(--sm-c-dialog-max-width-fullscreen, calc(100% - 80px));
    max-height: var(--sm-c-dialog-max-height-fullscreen, calc(100% - 80px));
    width: 100%;
    padding: 0;
    background: var(--sm-c-dialog-color-background-fullscreen, var(--color-pure-white, $true-white));
    color: var(--sm-c-dialog-color-text-fullscreen, var(--color-black, $grey-neu-black));
    position: relative;
    border-top: var(--sm-c-dialog-border-width, 2px) solid var(--sm-c-dialog-color-border-fullscreen, var(--color-pure-white, $true-white));
    z-index: 2;
    border-radius: 8px;
    transform: translateY(0);

    @media #{$large-desktop} {
      max-width: var(--sm-c-dialog-max-width-fullscreen, 1296px);
      max-height: var(--sm-c-dialog-max-height-fullscreen, 705px);
      margin: var(--sm-c-dialog-margin-fullscreen, 30px);
    }

    @media #{$extra-large-desktop} {
      max-height: var(--sm-c-dialog-max-height-fullscreen, 902px);
      max-width: var(--sm-c-dialog-max-width-fullscreen, 1301px);
    }
  }

  /**
   * stickyfooter
   */
  &--fullscreen &__stickyfooter {
    width: 100%;
    background: var(--sm-c-dialog-footer-color-background-fullscreen, var(--color-app-light, $blue-neu-light));
    color: var(--sm-c-dialog-footer-color-text-fullscreen, var(--color-disabled-dark, $grey-neu-dark));
    padding: var(--sm-c-dialog-footer-padding-fullscreen, $sm-40 $sm-32 $sm-40 $sm-40);
    height: var(--sm-c-dialog-footer-height-fullscreen, 114px);
    box-shadow: var(--sm-c-dialog-footer-shadow-fullscreen,
      0 -1px 1px -1px rgba(24, 58, 108, 0.14),
      0 -3px 4px -2px rgba(24, 58, 108, 0.1),
      0 -3px 9px -2px rgba(24, 58, 108, 0.1));
    border-top: solid var(--sm-c-dialog-border-width-fullscreen, 1px) var(--sm-c-dialog-footer-color-border-top-fullscreen, $light-blue-grey);
    text-align: right;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1;
  }

  &--fullscreen {
    .sm-dialog__title {
      padding: var(--sm-c-dialog-title-padding-fullscreen, $sm-40 $sm-40 0 $sm-40);
    }

    .sm-dialog__footer {
      padding-right: $sm-32;
    }

    .sm-dialog__body {
      padding: var(--sm-c-dialog-body-padding-fullscreen, 0 $sm-32 0 $sm-40);
      overflow: hidden;
      height: 100%;
      overflow-y: auto;
      padding-bottom: $sm-40;
      max-height: var(--sm-c-dialog-body-max-height-fullscreen, calc(100% - 200px));
    }
  }
}
</style>
