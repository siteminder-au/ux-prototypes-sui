<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, reactive, Ref, provide } from 'vue'
import { useUniqueId } from '../use/unique-id'
import { useOnEscape } from '../use/on-escape'
import SmButton from '../sm-button/sm-button.vue'
import { useCycleFocus } from '../use/cycle-focus'
import { useReturnToFocus } from '../use/return-to-focus'
import { useScrollLock } from '../use/scroll-lock'
import { closeNavKey, deepLinkProviderKey } from './symbols'
import { SmButtonShape, SmButtonSize } from '../sm-button/sm-button.types'
import { useI18n } from '../../libs/vue-i18n'
import iconActionCross from './icons/action-cross'

const props = withDefaults(defineProps<{
  /**
   * Whether the navigation bar can be closed by clicking the underlay
   */
  closeOnClickModal?: boolean
  /**
   * Whether the navigation bar can be closed by pressing ESC
   */
  closeOnPressEscape?: boolean
  /**
   * CSS classes which will be applied to the root navigation bar content element. Useful for specifying
   * responsive widths.
   */
  contentClass?: string
  /**
   * The navigation header logo src
   */
  logo?: string
  /**
   * The navigation header logo alt text. Use when there is no visible header title
   */
  logoAlt?: string
  /**
   * Header logo and title link
   */
  logoLink?: string
  /**
   * Set the height props to specifies the height of an image, in pixels. Default is '32'
   */
  logoHeight?: string
  /**
   * Set the width props to specifies the width of an image, in pixels. Default is '32'
   */
  logoWidth?: string
  /**
   * Whether to show a close button on navigation bar
   */
  showClose?: boolean
  /**
   * Whether to show component on top of all components by setting the highest z-index
   */
  showOnTop?: boolean
  /**
   * The target props specifies where to open the Home icon and title link
   */
  target?: string
  /**
   * The navigation header title when on the main screen
   */
  title?: string
  /**
   * The navigation bar transition. Accepts: 'left', 'right'
   */
  transition?: string
  /**
   * Whether the navigation bar is visible. Use the `v-model:visible` syntax to receive updates
   */
  visible?: boolean
}>(), {
  closeOnClickModal: true,
  closeOnPressEscape: true,
  contentClass: '',
  logo: '',
  logoAlt: '',
  logoLink: '',
  logoHeight: '32',
  logoWidth: '32',
  showClose: true,
  showOnTop: false,
  target: '_blank',
  title: '',
  transition: 'left',
  visible: false,
})

const emit = defineEmits<{
  /**
   * Emitted when nav's visibility is updated with the payload
   */
  'update:visible': [state: boolean]
  /**
   * Emitted when nav is opened without parameters
   */
  open: []
  /**
   * Emitted when nav is closed without parameters
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
    // we suppress ATTR_FALSE_VALUE as we want to keep
    // `aria-expanded` attribute attached even if the value of it is false
    // in vue2, aria-expanded was removed if the value was false.
    ATTR_FALSE_VALUE: 'suppress-warning',
  },
})

const { i18n } = useI18n()

const navContent: Ref<HTMLElement | null> = ref(null)
const subheader: Ref<HTMLElement | null> = ref(null)
const footer: Ref<HTMLElement | null> = ref(null)
const header: Ref<HTMLElement | null> = ref(null)

const isVisible = computed<boolean>({
  get: () => props.visible,
  set: state => emit('update:visible', state),
})

const listHeight = reactive({
  height: '',
})

const contentClasses = computed<string>(() => (props.contentClass ? `sm-nav__content ${props.contentClass}` : 'sm-nav__content'))

const close = (): void => {
  isVisible.value = false
}

// Emit open / close events
watch(
  isVisible,
  () => {
    if (isVisible.value) {
      emit('open')
    } else {
      emit('close')
    }
  },
)

// Close when the user hits Escape
useOnEscape(() => {
  if (isVisible.value && props.closeOnPressEscape) {
    close()
  }
})

// Lock the body scroll
const scrollLock = useScrollLock('sm-nav-')

watch(
  isVisible,
  () => {
    if (isVisible.value) {
      scrollLock.lock()
    } else {
      scrollLock.unlock()
    }
  },
)

// Shift focus on open & close
const returnToFocus = useReturnToFocus()

watch(
  isVisible,
  () => {
    if (isVisible.value) {
      returnToFocus.capture()
      if (navContent.value) {
        navContent.value.focus()
      }
    } else {
      returnToFocus.returnTo()
    }
  },
)

/**
 * Calculate the height of the vertical nav list items dynamically
 */
const calculateListHeight = (): void => {
  const subheaderHeight = subheader.value ? subheader.value.offsetHeight : 0
  const footerHeight = footer.value ? footer.value.offsetHeight : 0
  const headerHeight = header.value ? header.value.offsetHeight : 0

  const total = subheaderHeight + footerHeight + headerHeight
  listHeight.height = `calc(100% - ${total}px)`
}

onMounted(() => {
  // Cycle the focus within the nav
  if (navContent.value) {
    useCycleFocus(navContent.value)
  }

  calculateListHeight()

  // Auto-close on window resize so navigation that happens on desktop
  // will be calculated again on open when switched back to tablet mode
  window.addEventListener('resize', close)
})

onBeforeUnmount(() => {
  scrollLock.unlock()
  window.removeEventListener('resize', close)
})

const { id: titleElementId } = useUniqueId('sm-nav__item-list_')
const { id: bodyElementId } = useUniqueId('sm-nav__list_')

// #region deep link logic
const deepLinkParentNavItems = ref([] as string[])
const setDeepLinkParentNavItems = (parentNavItems: string[]): void => {
  // we only want to set it once when the page initially loads from a deep link
  if (deepLinkParentNavItems.value.length === 0 && parentNavItems.length !== 0) {
    deepLinkParentNavItems.value = parentNavItems
  }
}

const deepLinkProvider = {
  deepLinkParentNavItems,
  setDeepLinkParentNavItems,
}

provide(closeNavKey, close)
provide(deepLinkProviderKey, deepLinkProvider)
// #endregion

defineExpose({
  isVisible,
  close,
  titleElementId,
  bodyElementId,
  contentClasses,
  navContent,
  subheader,
  footer,
  header,
  listHeight,
})
</script>

<template>
  <nav
    class="sm-nav"
    aria-live="polite"
    :aria-labelledby="titleElementId || undefined"
    :aria-describedby="bodyElementId || undefined"
    :aria-hidden="!isVisible"
    :aria-expanded="isVisible"
    :class="{ 'sm-visible-on-top': showOnTop, [`sm-nav--${transition}`]: !!transition, 'sm-nav--collapsed': !isVisible,
              'sm-nav--overflow-list': $slots['vertical-nav']
    }"
  >
    <div
      class="sm-nav__underlay"
      :aria-hidden="true"
      @click.stop="() => (closeOnClickModal ? close() : null)"
    />

    <div
      ref="navContent"
      :class="[contentClasses]"
      tabindex="-1"
    >
      <sm-button
        v-if="showClose"
        class="sm-nav__close"
        :shape="SmButtonShape.SQUARE"
        :size="SmButtonSize.MEDIUM"
        :title="i18n.t('sui-core.components.sm-nav.sm-nav.a11y__click-to-close')"
        :aria-label="i18n.t('sui-core.components.sm-nav.sm-nav.a11y__click-to-close')"
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
      <div class="sm-nav__main-container">
        <ul
          :id="bodyElementId || undefined"
          class="sm-nav__list"
          role="menubar"
          :aria-labelledby="titleElementId || undefined"
        >
          <li
            :id="titleElementId || undefined"
            ref="header"
            class="sm-nav__header"
            role="none"
          >
            <component
              :is="logoLink ? 'a' : 'div'"
              class="sm-nav__header-title"
              :target="logoLink ? target : null"
              :href="logoLink ? logoLink : null"
              :class="{
                'sm-nav__header-title--link': logoLink,
              }"
            >
              <span
                tabindex="-1"
                class="sm-nav__header-title-content"
              >
                <figure
                  v-if="logo"
                  class="sm-nav__logo"
                >
                  <img
                    :src="logo"
                    :alt="logoAlt"
                    :height="logoHeight"
                    :width="logoWidth"
                  >
                </figure>
                <span
                  v-if="title"
                  class="sm-nav__title"
                >
                  {{ title }}
                </span>
              </span>
            </component>
          </li>
          <li
            v-if="$slots.subheader && $slots['vertical-nav']"
            ref="subheader"
            class="sm-nav__subheader"
            role="none"
          >
            <!-- @slot The subheader slot for the tablet vertical navigation -->
            <slot
              name="subheader"
              :close-nav="close"
            />
          </li>
          <!-- @slot The list of navigation submenu items -->
          <slot />
          <li
            v-if="$slots['vertical-nav']"
            class="sm-nav__vertical-nav"
            :style="listHeight"
            role="none"
          >
            <!-- @slot The list of vertical navigation items -->
            <slot
              name="vertical-nav"
              :close-nav="close"
            />
          </li>
        </ul>
        <div
          v-if="$slots.footer && $slots['vertical-nav']"
          ref="footer"
          class="sm-nav__footer"
        >
          <!-- @slot The footer slot for the tablet vertical navigation -->
          <slot
            name="footer"
            :close-nav="close"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-nav--header--text-color: var(--color-black, $grey-neu-black);
$sm-nav--content--text-color: var(--color-black, $grey-neu-black);
$sm-nav--underlay--background-color: var(--sm-c-app-header-tablet-nav-underlay-color-background, rgba($grey-neu-dark, 0.3));
$sm-nav--border-color: #d9dee7; // not mapped to a color token
$sm-body--background-color: var(--color-app-light, $blue-neu-light);
$sm-nav--list-background-color: var(--sm-c-app-header-tablet-nav-list-color-background, var(--color-app-light, $blue-neu-light));
$sm-nav--footer--background-color: var(--sm-c-app-header-tablet-nav-footer-color-background, var(--color-pure-white, $true-white));
$sm-nav--subheader--background-color: var(--sm-c-app-header-tablet-nav-subheader-color-background, var(--color-pure-white, $true-white));
$sm-nav--subheader--border-color: var(--color-app, $blue-neu-mid);
$sm-nav--footer--border-color: var(--color-app-mid, $blue-neu-med);

.sm-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: $sm-nav-z-index;
  opacity: 1;

  &--left {
    .sm-nav__content {
      left: 0;
      transform: translateX(0);
      transition: all 0.3s ease-in-out;
    }
  }

  &--left.sm-nav--collapsed {
    z-index: -1;
    opacity: 0;
    transition: all 0.3s ease-in-out;

    .sm-nav__content {
      left: -10%;
      transform: translateX(-100%);
      transition: all 0.3s ease-in-out;
    }

    .sm-nav__underlay {
      opacity: 0;
    }
  }

  &__notification-title {
    position: absolute;
    right: 50px;
  }

  &--right {
    .sm-nav__content {
      right: 0;
      margin-left: auto;
      transform: translateX(0);
      transition: all 0.3s ease-in-out;
    }
  }

  &--right.sm-nav--collapsed {
    z-index: -1;
    opacity: 0;
    transition: all 0.3s ease-in-out;

    .sm-nav__content {
      right: -10%;
      transform: translateX(100%);
      transition: all 0.3s ease-in-out;
    }

    .sm-nav__underlay {
      opacity: 0;
    }
  }

  &__button-container {
    width: 34px;
  }

  &__left-arrow {
    position: absolute;
    top: 15px;
    left: 20px;

    .sm-button {
      width: 28px;
      height: 28px;
    }
  }

  &__underlay {
    background: $sm-nav--underlay--background-color;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 1;
  }

  &__content {
    background-color: $sm-body--background-color;
    position: relative;
    display: flex;
    flex-flow: column;
    height: 100%;
    box-shadow: var(--sm-c-app-header-tablet-nav-box-shadow, 0 3px 17px -8px rgba(24, 58, 108, 0.43), 0 22px 7px -21px rgba(24, 58, 108, 0.14), 0 15px 38px -11px rgba(24, 58, 108, 0.15)) !important;
    overflow: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  &--overflow-list {
    .sm-nav__content {
      overflow-y: hidden;
    }
  }

  &__fixed-width {
    width: 480px;
  }

  &__close.sm-button {
    position: absolute;
    top: 13px;
    right: 16px;
    z-index: 100;

    .sm-button__content {
      background: var(--sm-c-app-header-tablet-nav-close-button-color-background, transparent);
      color: var(--sm-c-app-header-tablet-nav-close-button-color-text, $sm-nav--content--text-color);
    }

    &::after {
      /**
        Overlay mask behind the button so sliding submenu heading
        is not visible until it gets past it
      */
      background: var(--sm-c-app-header-tablet-nav-close-button-color-background, var(--color-pure-white, $true-white));
      content: "";
      height: 100%;
      pointer-events: none;
      position: absolute;
      right: -16px;
      width: 56px;
      z-index: -1;
    }
  }

  &__list {
    padding: 0;
    margin: 0;
    list-style-type: none;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    transform: translateX(0%);
    will-change: transform;
    transition: transform 0.3s cubic-bezier(0.42, 0.15, 0.22, 0.96);
    overflow: visible;
    background: $sm-nav--list-background-color;
    color: var(--sm-c-app-header-tablet-nav-list-color-text, $sm-nav--content--text-color);
    list-style-type: none;
  }

  &__main-container {
    height: 100%;
    position: relative;
  }

  li {
    color: var(--sm-c-app-header-tablet-nav-list-color-text, $sm-nav--content--text-color);
  }

  &__header {
    display: flex;
    align-items: center;
    padding: var(--sm-c-app-header-tablet-nav-header-padding, $sm-12 18px $sm-12 $sm-20);
    background: var(--sm-c-app-header-tablet-nav-header-color-background, var(--color-pure-white, $true-white));
    border-bottom: var(--sm-c-app-header-tablet-nav-header-border-bottom, 1px solid $sm-nav--border-color);
    font-weight: 600;
    height: var(--sm-c-app-header-tablet-nav-header-height, $sm-56);
    min-height: var(--sm-c-app-header-tablet-nav-header-height, $sm-56);
    width: 100%;

    &__content {
      display: flex;
      align-items: center;
    }
  }

  &__header-title {
    &--link {
      /* Focus State */
      &:focus {
        outline: none;
        box-shadow: none;

        .sm-nav__header-title-content {
          border-radius: inherit;
          box-shadow: 0 0 0 2px $sm-nav--header--text-color;
        }
      }
    }
  }

  &__header-title-content {
    display: flex;
    align-items: center;

    &:focus {
      outline: none;
      box-shadow: none;
    }
  }

  &__logo {
    margin-left: 0;
    height: $sm-32;
    width: $sm-32;

    @include margin($right: rem($sm-xsm));
  }

  &__title {
    font-size: 18px;
    font-weight: normal;
    margin-right: 44px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--sm-c-app-header-tablet-nav-header-title-color-text, $sm-nav--content--text-color)
  }

  &__footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: $sm-nav--footer--background-color;
    border-top: var(--sm-c-app-header-tablet-nav-footer-border-top, 1px solid $sm-nav--footer--border-color);
  }

  &__subheader {
    background: $sm-nav--subheader--background-color;
    border-bottom: var(--sm-c-app-header-tablet-nav-subheader-border-bottom, 1px solid $sm-nav--subheader--border-color);
  }

  &__vertical-nav {
    overflow: hidden;
    overflow-y: auto;
    padding-top: var(--sm-c-app-header-tablet-vertical-nav-padding-top, $sm-16);
    -webkit-overflow-scrolling: touch;
  }

  .sm-icon {
    display: inline-block;
    position: relative;
    top: -2px;
    vertical-align: middle;
    width: 1em;
    height: 1em;
    line-height: 1;

    > svg {
      line-height: 1;
      fill: currentColor;
      display: inline-block;
    }
  }
}
</style>
