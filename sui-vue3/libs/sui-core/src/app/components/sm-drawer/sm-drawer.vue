<script setup lang="ts">
import { computed, watchEffect, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useUniqueId } from '../use/unique-id'
import { useScrollLock } from '../use/scroll-lock'
import { useCycleFocus } from '../use/cycle-focus'
import { useOnEscape } from '../use/on-escape'
import { useReturnToFocus } from '../use/return-to-focus'
import { useI18n } from '../../libs/vue-i18n'
import { SmButtonShape } from '../sm-button/sm-button.types'
import SmButton from '../sm-button/sm-button.vue'
import { SmDrawerHeight } from './sm-drawer.types'

const props = withDefaults(defineProps<{
  /**
   * The drawer has action buttons
   */
  actionButtonsVisible?: boolean
  /**
   * Callback before drawer closes, and it will prevent drawer from closing
   * @default function(close) close is used to close the drawer
   */
  beforeClose?: (close: () => void) => void
  /**
   * Whether the drawer can be closed by clicking the underlay
   */
  closeOnClickModal?: boolean
  /**
   * Whether the drawer can be closed by pressing ESC
   */
  closeOnPressEscape?: boolean
  /**
   * CSS classes which will be applied to the root drawer content element. Useful for specifying
   * responsive widths.
   */
  contentClass?: string
  /**
   * Overrides the default 64px header height when drawer height is set to below-header
   */
  headerHeight?: string
  /**
   * Whether the drawer takes up the full viewport. Accepts: 'full-height', 'below-header'
   */
  height?: SmDrawerHeight
  /**
   * Whether to show a close button
   */
  showClose?: boolean
  /**
   * Whether to show component on top of all components by setting the highest z-index
   */
  showOnTop?: boolean
  /**
   * The title of the drawer. Can also be passed as a named slot.
   */
  title?: string
  /**
   * Whether the dialog is visible. Use the `v-model:visible` syntax to receive updates
   */
  visible?: boolean
}>(), {
  actionButtonsVisible: true,
  beforeClose: (close: () => void) => close(),
  closeOnClickModal: true,
  closeOnPressEscape: true,
  contentClass: '',
  headerHeight: '',
  height: SmDrawerHeight.FULL_HEIGHT,
  showClose: true,
  showOnTop: false,
  title: '',
  visible: false,
})

const emit = defineEmits<{
  /** Emitted when the drawer visibility is changed */
  'update:visible': [state: boolean]
  /** Emitted when the drawer is opened */
  open: []
  /** Emitted when the drawer is closed */
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

// Template refs and we keep the naming consistent with Vue2 for backwards compatibility
const content = ref<HTMLElement>()

const isVisible = computed({
  get: () => props.visible,
  set: state => emit('update:visible', state),
})

const actionButtonVisible = computed(() => props.actionButtonsVisible)

const contentClasses = computed<string>(() => (props.contentClass ? `sm-drawer__content ${props.contentClass}` : 'sm-drawer__content'))

const open = (): void => {
  isVisible.value = true
}

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

// Close when the user hits Escape
useOnEscape(() => {

  if (isVisible.value && props.closeOnPressEscape) {
    close()
  }

})

// Lock the body scroll
const scrollLock = useScrollLock('sm-drawer-')
watchEffect(() => {

  if (isVisible.value) {
    scrollLock.lock()
  } else {
    scrollLock.unlock()
  }

})
onBeforeUnmount(() => scrollLock.unlock())

// Shift focus on open & close
const returnToFocus = useReturnToFocus()
watch(
  () => isVisible.value,
  () => {
    if (isVisible.value) {
      returnToFocus.capture()
      if (content.value) {
        content.value.focus()
      }
    } else {
      returnToFocus.returnTo()
    }
  },
  { immediate: true },
)

// Cycle the focus within the drawer
onMounted(() => {
  if (content.value) {
    useCycleFocus(content.value)
  }
})

const { id: titleElementId } = useUniqueId('sm-drawer__header-section--title_')
const { id: bodyElementId } = useUniqueId('sm-drawer__body_')

defineExpose({
  isVisible,
  open,
  close,
  titleElementId,
  bodyElementId,
  contentClasses,
  actionButtonVisible,
})
</script>

<template>
  <transition name="sm-drawer-transition">
    <div
      v-show="isVisible"
      class="sm-drawer"
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      :aria-labelledby="titleElementId || undefined"
      :aria-describedby="bodyElementId || undefined"
      :class="{[`sm-drawer--${height}`] : !!height,
               'sm-visible-on-top': showOnTop,
               'sm-drawer--not-visible': !isVisible
      }"
    >
      <div
        class="sm-drawer__underlay"
        aria-hidden="true"
        @click.stop="() => closeOnClickModal ? close() : null"
      />

      <div
        ref="content"
        tabindex="-1"
        :class="contentClasses"
        :style="{
          height: !!headerHeight ? `calc(100vh - ${headerHeight})` : undefined,
          top: !!headerHeight ? headerHeight : undefined
        }"
      >
        <sm-button
          v-if="showClose"
          class="sm-drawer__close"
          :shape="SmButtonShape.ROUND"
          :title="i18n.t('sui-core.components.sm-drawer.sm-drawer.a11y__click-to-close')"
          :aria-label="i18n.t('sui-core.components.sm-drawer.sm-drawer.a11y__click-to-close')"
          @click="close"
        >
          <sm-icon
            name="action-cross"
            aria-hidden="true"
          />
        </sm-button>

        <div class="sm-drawer__header">
          <div
            :id="titleElementId || undefined"
            class="sm-drawer__header-section sm-drawer__header-section--title"
          >
            <!-- @slot The title of the drawer -->
            <slot name="title">
              <h3>{{ title }}</h3>
            </slot>
          </div>
          <div
            v-show="actionButtonVisible"
            class="sm-drawer__action-buttons"
            :class="{ 'sm-drawer__action-buttons--hide-on-mobile': $slots['mobile-actions'] }"
          >
            <div
              class="sm-drawer__header-section sm-drawer__header-section--actions"
            >
              <!-- @slot The action section of the drawer. E.g. a "submit" & "cancel" or "next" button -->
              <slot
                name="actions"
                :close="close"
              />
            </div>
          </div>
        </div>

        <div
          v-if="$slots.default"
          :id="bodyElementId || undefined"
          class="sm-drawer__body"
        >
          <!-- @slot The body of the drawer -->
          <slot />
        </div>

        <div
          v-if="actionButtonVisible && $slots['mobile-actions']"
          class="sm-drawer__footer-actions sm-drawer__footer-actions--mobile"
        >
          <!--
            @slot The footer action section of the drawer in mobile viewport (640px and below).
            When this is provided, the header action will automatically be hidden when this is displayed.
          -->
          <slot
            name="mobile-actions"
            :close="close"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@import "../../common/variables";

$sm-drawer--header--text-color: $grey-neu-black;
$sm-drawer--content--background-color: $true-white;
$sm-drawer--content--text-color: $grey-neu-black;
$sm-drawer--underlay--background-color: rgba($grey-neu-dark, 0.3);
$sm-drawer--border-color: $light-blue-grey;

.sm-drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: $sm-drawer-z-index;

  &--not-visible {
    z-index: -1;
    opacity: 0;
    transition: all 0.3s ease;
    visibility: hidden;

    .sm-drawer__content {
      right: -10%;
      transform: translateX(100%);
      transition: all 0.3s ease;
    }
  }

  &__underlay {
    background: $sm-drawer--underlay--background-color;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__content {
    margin-left: auto;
    background: $sm-drawer--content--background-color;
    color: $sm-drawer--content--text-color;
    position: relative;
    transform: translateX(0);
    transition: all 0.3s ease;
    right: 0;
    display: flex;
    flex-flow: column;
    max-height: 100vh;
    box-shadow:
      0 3px 17px -8px rgba(24, 58, 108, 0.43),
      0 22px 7px -21px rgba(24, 58, 108, 0.14),
      0 15px 38px -11px rgba(24, 58, 108, 0.15) !important; // Important used to override global focus state
  }

  &__fixed-width {
    width: 100%;

    @media #{$small-desktop} {
      width: 576px;
    }
  }

  &__action-buttons {
    display: flex;
    position: relative;
    width: auto;
    border: unset;
    box-shadow: none;
    padding: 0;

    &--hide-on-mobile {
      display: none;

      @media #{$mobile} {
        display: flex;
      }
    }
  }

  &__close {
    position: absolute;
    top: 8px;
    left: 48px;
    transform: translateX(-100%);

    @media #{$small-desktop} {
      left: -24px;
      top: 24px;
    }
  }

  &__body {
    padding: $sm-32 $sm-24;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    height: 100vh;

    @media #{$small-desktop} {
      padding: 39px $sm-56;
    }
  }

  &__header {
    padding: $sm-8 $sm-24 7px 60px;
    border-bottom: 1px solid $sm-drawer--border-color;
    display: flex;
    color: $sm-drawer--header--text-color;
    box-shadow: 0 1px 1px -1px rgba(24, 58, 108, 0.14), 0 3px 4px -2px rgba(24, 58, 108, 0.1), 0 3px 9px -2px rgba(24, 58, 108, 0.1);

    @media #{$small-desktop} {
      padding: $sm-24 $sm-56 23px;
    }
  }

  &__header-section {
    margin: auto 0;
    flex: 1;
  }

  &__header-section--title {
    flex-grow: 2;

    h3 {
      margin: 6px 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      word-break: break-word;

      @media #{$mobile} {
        margin: 5px 0;
      }

      /* Fix Safari bug where line-clamp doesn't work right away */
      @supports (background: -webkit-named-image(i)) {
        visibility: visible;
      }
    }
  }

  &__header-section--actions {
    display: flex;
    justify-content: flex-end;
  }

  &__footer-actions {
    border-top: 1px solid $sm-drawer--border-color;
    box-shadow: 0 -3px 9px -2px rgba(24, 58, 108, 0.1),
      0 -3px 4px -2px rgba(24, 58, 108, 0.1),
      0 -1px 1px -1px rgba(24, 58, 108, 0.14);
    color: $sm-drawer--header--text-color;
    display: flex;
    justify-content: space-between;
    padding: $sm-12 $sm-24;
    z-index: 1;

    &--mobile {
      @media #{$mobile} {
        display: none;
      }
    }
  }

  /**
   * Different heights
   */
  &--full-height &__content {
    height: 100vh;
    top: 0;
  }

  &--below-header &__content {
    height: calc(100vh - 64px); // Full screen minus the height of the top header
    top: $sm-64;
  }

}
</style>
