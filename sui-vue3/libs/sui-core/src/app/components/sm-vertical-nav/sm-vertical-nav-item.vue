<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount, onMounted, Ref, VNode, inject, provide } from 'vue'
import { createPopperLite as createPopper, flip, offset, preventOverflow } from '@popperjs/core'
import { useUniqueId } from '../use/unique-id'
import { useI18n } from '../../libs/vue-i18n'
import { SmBadgeProps, SmBadgeSize } from '../sm-badge/sm-badge.types'
import { SmVerticalNavItemActiveState } from './sm-vertical-nav-item.types'
import { openNavKey } from './symbols'
import { useIsNavItemActive } from '../use/is-nav-item-active'
import { useIsNavItemExactActive } from '../use/is-nav-item-exact-active'

import SmBadge from '../sm-badge/sm-badge.vue'

const props = withDefaults(defineProps<{
  /**
   * The content of the nav item
   */
  label?: string
  /**
   * A Vue-Router object or string specifying the URL to navigate to
   */
  to?: string | Record<string, unknown>
  /**
   * A URL to navigate to. If provided this will override the `to` prop. Use this for external URLs outside of your application.
   */
  href?: string
  /**
   * By default the active state of the nav item is determined based on the `to` param. You can override that here.
   * Accepts 'active', 'exact-active' or 'in-active' or a custom function.
   */
  forceActiveState?: SmVerticalNavItemActiveState | ((isActive: boolean, isExactActive: boolean) => SmVerticalNavItemActiveState)
  /**
   * A custom class to apply to the list item element (anchor or button) wrapper
   */
  contentClass?: string
  /**
   * The target props specifies where to open the linked document
   */
  target?: string
  /**
   * Determine whether the button is disabled. To "disable" <a> tag remove its href/to attribute, or add a click handler that returns false.
   */
  disabled?: boolean
  /**
   * Determine whether the button is readonly but allows the event interaction
   */
  readonly?: boolean
  /**
   * An sm-icon name to be displayed to the left of the text
   */
  prefixIcon?: string
  /**
   * An sm-icon name to be displayed to the right of the text
   */
  suffixIcon?: string
  /**
   * An sm-badge config to be displayed to the right of the text
   */
  suffixBadge?: { text: string, config: SmBadgeProps } | null
  /**
   * Whether to hide the popover sub-navigation on larger screens (>1024px)
   * By default, the popover will show regardless of viewport width
   */
  hideSubnavOnDesktop?: boolean
}>(), {
  label: '',
  to: undefined,
  href: undefined,
  forceActiveState: undefined,
  contentClass: '',
  target: undefined,
  disabled: false,
  readonly: false,
  prefixIcon: '',
  suffixIcon: '',
  suffixBadge: null,
  hideSubnavOnDesktop: false,
})

const emit = defineEmits<{
  toggle: []
  click: []
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
  // For Vue3: We explicitly set this to false so we can move the $attr binding
  // to an actual HTML element (i.e. the <li> tag) instead of the <router-link> component
  inheritAttrs: false,
})

const { i18n } = useI18n()

const isRouterLink = computed(() => props.to !== undefined)

// provided by closest parent sm-vertical-nav-item
// when there are multiple provides, vue will use the closest provide in the component tree
// see: https://vuejs.org/api/composition-api-dependency-injection.html
const openParentNav = inject(openNavKey, () => {})

/**
 * defineSlots macro used to declare expected slots and their respective expected slot
 */
const slots = defineSlots<{
  default?: () => VNode[]
  content?: () => VNode[]
  'header-subnav'?: () => VNode[]
}>()
const hasChildren = computed(() => !!slots.default)

// TODO: consider creating an `sm-dropdown-nav-item` base component
// and pull out all logic related to rendering nav items in a dropdown (i.e. any references to `hasPopoverChildren` and popper usages)
// Then, we can reserve this sm-vertical-nav-item specifically for usage in sm-aside context.
// Rationale: we want to stop overloading this sm-vertical-nav-item with too many branches of code and styling
const hasPopoverChildren = computed(() => !!slots['header-subnav'])

const childrenVisible = ref(false)

// popper variables to support nested subnavs (see sm-app-header stories)
let popper: any
const popoverMenuVisible = ref(false)
const popoverBodyElement: Ref<HTMLElement | null> = ref(null)
const popoverContentElement: Ref<HTMLElement | null> = ref(null)
const popoverTargetElement: Ref<HTMLElement | null> = ref(null)

const open = (): void => {
  childrenVisible.value = true
}

const close = (): void => {
  childrenVisible.value = false
}

/**
 * Close popover when clicked outside
 */
const closePopover = (e: MouseEvent): void => {
  if (!popoverMenuVisible.value) {
    return
  }

  if (!popoverBodyElement.value?.contains(e.target as Node)) {
    popoverMenuVisible.value = false
  }
}

const toggle = (): void => {
  childrenVisible.value = !childrenVisible.value

  if (!hasChildren.value && hasPopoverChildren.value) {
    popoverMenuVisible.value = !popoverMenuVisible.value
  }

  if (!props.disabled) {
    emit('toggle')
  }
}

const childrenToggleA11yLabel = computed(() => {
  return childrenVisible.value
    ? i18n.t('sui-core.components.sm-vertical-nav.sm-vertical-nav.a11y__children-toggle-hide')
    : i18n.t('sui-core.components.sm-vertical-nav.sm-vertical-nav.a11y__children-toggle-show')
})

const popoverToggleA11yLabel = computed(() => {
  return popoverMenuVisible.value
    ? i18n.t('sui-core.components.sm-vertical-nav.sm-vertical-nav.a11y__children-toggle-hide')
    : i18n.t('sui-core.components.sm-vertical-nav.sm-vertical-nav.a11y__children-toggle-show')
})

const { id: childrenElementId } = useUniqueId('sm-vertical-nav-item__children_')

const vueRouterActiveState = ref(false)
const vueRouterExactActiveState = ref(false)

/**
 * This function is kept intentionally lightweight to avoid adding performance overhead.
 *
 * Future optimizations may be explored if the scales and performance becomes
 * a concern, but for now, keeping it simple reduces the risk of breaking changes.
 */
const setVueRouterActiveState = (active: boolean, exactActive: boolean): void => {
  // For Vue3: handle case where `to` prop is empty, i.e when using `href` or making it a button instead
  // In the latest vue-router they are always marked as active/exact-active
  // See https://router.vuejs.org/guide/migration/#Removal-of-the-exact-prop-in-router-link-
  const isEmptyPath = !props.to

  vueRouterActiveState.value = isEmptyPath ? false : active
  vueRouterExactActiveState.value = isEmptyPath ? false : exactActive
}

const isActive = computed(() => useIsNavItemActive(vueRouterActiveState.value, vueRouterExactActiveState.value, props.forceActiveState))
const isExactActive = computed(() => useIsNavItemExactActive(vueRouterActiveState.value, vueRouterExactActiveState.value, props.forceActiveState))

const destroyPopper = (): void => {
  if (popper) {
    popper.destroy()
    popper = null
  }
}

/**
 * Create a popper instance for the subnav
 */
const setupPopper = async (): Promise<void> => {
  if (!popoverTargetElement.value || !popoverContentElement.value) {
    return
  }

  if (popper) {
    await popper.update()
    return
  }

  const defaultPlacement = 'right-start'
  const defaultStrategy = 'absolute'

  // TODO: remove popper package and use floating-vue instead which is less error prone
  popper = createPopper(
    popoverTargetElement.value,
    popoverContentElement.value,
    {
      placement: defaultPlacement,
      strategy: defaultStrategy,
      modifiers: [
        {
          ...flip,
          options: {
            fallbackPlacements: [
              'left-start',
              'auto',
            ],
          },
        },
        {
          ...offset,
          options: {
            offset: ({ placement, reference }: { placement: string, reference: { width: string, height: string } }) => {
              // If popover can't be placed on the sides,
              // overlay it from the left of the target
              if (placement === 'bottom' || placement === 'top') {
                return [
                  -(reference.width), // Move to the left
                  -(reference.height) - 1, // Top align with the target
                ]
              }

              return [-1, 0] // Move 1px up
            },
          },
        },
        {
          ...preventOverflow,
          options: {
            // Adds padding on the popover so it is not completely
            // sticking to the side of the screen
            padding: { left: 4, right: 4 },
          },
        },
      ],
    },
  )
}

watch(
  isExactActive,
  () => {
    if (isExactActive.value || childrenVisible.value) {
      // If this nav item is active, or it's children are already open, open the parent
      openParentNav()
    }
  },
  { immediate: true },
)

watch(
  popoverMenuVisible,
  async () => {
    if (popoverMenuVisible.value && popper) {
      await popper.update()
    }
  },
)

onMounted(async () => {
  if (hasPopoverChildren.value) {
    await setupPopper()
    window.addEventListener('click', closePopover)
  }
})

onBeforeUnmount(() => {
  if (hasPopoverChildren.value) {
    destroyPopper()
    window.removeEventListener('click', closePopover)
  }
})

provide(openNavKey, open)

defineExpose({
  hasChildren,
  hasPopoverChildren,
  childrenVisible,
  popoverMenuVisible,
  open,
  close,
  toggle,
  childrenToggleA11yLabel,
  childrenElementId,
  setVueRouterActiveState,
  isActive,
  isExactActive,
  popoverBodyElement,
  popoverContentElement,
  popoverTargetElement,
  popoverToggleA11yLabel,
})
</script>

<template>
  <li
    ref="popoverBodyElement"
    class="sm-p sm-vertical-nav-item"
    :class="{
      'sm-vertical-nav-item--children-visible': childrenVisible,
      'sm-vertical-nav-item--active': isActive,
      'sm-vertical-nav-item--exact-active': isExactActive,
      'sm-vertical-nav-item--has-children': hasChildren && childrenVisible,
      'sm-vertical-nav-item--has-popover-children': !hasChildren && hasPopoverChildren,
      'sm-vertical-nav-item--hide-subnav-on-desktop': hideSubnavOnDesktop
    }"
    v-bind="$attrs"
  >
    <div
      ref="popoverTargetElement"
      class="sm-vertical-nav-item__container"
      @click="toggle"
    >
      <router-link
        v-if="isRouterLink"
        v-slot="routerLink"
        :custom="true"
        :to="to || '#'"
      >
        {{ setVueRouterActiveState(routerLink.isActive, routerLink.isExactActive) }}

        <a
          :disabled="disabled"
          :class="[{ 'sm-vertical-nav-item--readonly': readonly, 'sm-vertical-nav-item--disabled': disabled }, contentClass]"
          class="sm-vertical-nav-item__link"
          :href="routerLink.href"
          :target="target"
          @click="routerLink.navigate($event)"
        >
          <div
            :class="{
              'sm-vertical-nav-item__content': true,
              'sm-vertical-nav-item__content--has-children': hasChildren || hasPopoverChildren
            }"
            tabindex="-1"
          >
            <span
              class="sm-vertical-nav-item__active-indicator"
              aria-hidden="true"
            />

            <!--
              /**
              * Whether to eject from the default preset labelling provided by sm-vertical-nav-item
              * This is not recommended. Only do this if the UX required is not supported by sm-vertical-nav-item
              * TODO: investigate vue3 compatibility of using v-if="!$slots.content". see: https://github.com/vuejs/vue/issues/11084
              */
            -->
            <!-- @slot To write the custom content of the vertical nav item -->
            <slot name="content">
              <!-- fallback content -->
              <span
                class="sm-vertical-nav-item__label-container"
              >
                <!-- the cross-browser compatible dot -->
                <span class="sm-vertical-nav-item__dot-marker-container">
                  <span class="sm-vertical-nav-item__dot-marker" />
                </span>

                <!-- prefix icon section -->
                <span
                  v-if="prefixIcon"
                  class="sm-vertical-nav-item__prefix-icon"
                >
                  <sm-icon
                    :name="prefixIcon"
                    :aria-hidden="true"
                  />
                </span>

                <!-- label section -->
                <span class="sm-vertical-nav-item__label">
                  <span class="sm-vertical-nav-item__label-text">{{ label }}</span><sm-badge
                    v-if="suffixBadge"
                    :type="suffixBadge.config.type"
                    :light-theme-type="suffixBadge.config.lightThemeType"
                    :size="SmBadgeSize.MEDIUM"
                    class="sm-vertical-nav-item__suffix-badge"
                  >{{ suffixBadge.text }}</sm-badge>
                </span>
              </span>

              <!-- suffix icon section -->
              <span
                v-if="suffixIcon"
                class="sm-vertical-nav-item__suffix-icon"
              >
                <sm-icon
                  :name="suffixIcon"
                  :aria-hidden="true"
                />
              </span>
            </slot>
          </div>
        </a>
      </router-link>

      <component
        :is="href ? 'a' : 'button'"
        v-else
        :disabled="disabled"
        :class="[{ 'sm-vertical-nav-item--readonly': readonly, 'sm-vertical-nav-item--disabled': disabled }, contentClass]"
        class="sm-vertical-nav-item__link"
        :href="href"
        :target="target"
        @click="$emit('click')"
      >
        <div
          :class="{
            'sm-vertical-nav-item__content': true,
            'sm-vertical-nav-item__content--has-children': hasChildren || hasPopoverChildren
          }"
          tabindex="-1"
        >
          <span
            class="sm-vertical-nav-item__active-indicator"
            aria-hidden="true"
          />

          <!--
            /**
            * Whether to eject from the default preset labelling provided by sm-vertical-nav-item
            * This is not recommended. Only do this if the UX required is not supported by sm-vertical-nav-item
            * TODO: investigate vue3 compatibility of using v-if="!$slots.content". see: https://github.com/vuejs/vue/issues/11084
            */
          -->
          <!-- @slot To write the custom content of the vertical nav item -->
          <slot name="content">
            <!-- fallback content -->
            <span
              class="sm-vertical-nav-item__label-container"
            >
              <!-- the cross-browser compatible dot -->
              <span class="sm-vertical-nav-item__dot-marker-container">
                <span class="sm-vertical-nav-item__dot-marker" />
              </span>

              <!-- prefix icon section -->
              <span
                v-if="prefixIcon"
                class="sm-vertical-nav-item__prefix-icon"
              >
                <sm-icon
                  :name="prefixIcon"
                  :aria-hidden="true"
                />
              </span>

              <!-- label section -->
              <span class="sm-vertical-nav-item__label">
                <span class="sm-vertical-nav-item__label-text">{{ label }}</span><sm-badge
                  v-if="suffixBadge"
                  :type="suffixBadge.config.type"
                  :light-theme-type="suffixBadge.config.lightThemeType"
                  :size="SmBadgeSize.MEDIUM"
                  class="sm-vertical-nav-item__suffix-badge"
                >{{ suffixBadge.text }}</sm-badge>
              </span>
            </span>

            <!-- suffix icon section -->
            <span
              v-if="suffixIcon"
              class="sm-vertical-nav-item__suffix-icon"
            >
              <sm-icon
                :name="suffixIcon"
                :aria-hidden="true"
              />
            </span>
          </slot>
        </div>
      </component>

      <template v-if="hasChildren">
        <button
          type="button"
          class="sm-vertical-nav-item__children-toggle"
          :aria-expanded="childrenVisible"
          :aria-controls="childrenElementId || undefined"
          :aria-label="childrenToggleA11yLabel"
        >
          <sm-icon
            name="arrow-up"
            tabindex="-1"
          />
        </button>
      </template>
      <template v-if="!hasChildren && hasPopoverChildren">
        <button
          type="button"
          class="sm-vertical-nav-item__popover-toggle"
          :aria-expanded="popoverMenuVisible"
          :aria-controls="childrenElementId || undefined"
          :aria-label="popoverToggleA11yLabel"
        >
          <sm-icon
            name="arrow-left"
            tabindex="-1"
          />
        </button>
      </template>
    </div>

    <template v-if="hasChildren">
      <ul
        v-show="childrenVisible"
        :id="childrenElementId || undefined"
        class="sm-vertical-nav-item__children"
      >
        <slot />
      </ul>
    </template>

    <template v-if="!hasChildren && hasPopoverChildren">
      <div
        v-show="popoverMenuVisible"
        :id="childrenElementId || undefined"
        ref="popoverContentElement"
        class="sm-vertical-nav-item__popover"
      >
        <ul class="sm-vertical-nav-item__popover-children">
          <!-- @slot To add sub-navigation items for the header component to be displayed on the popover -->
          <slot name="header-subnav" />
        </ul>
      </div>
    </template>
  </li>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-vertical-nav-item--active--indicator-color: var(--sm-c-vertical-nav-item-indicator-color-active, #d9dee7); // not mapped to a color token
$sm-vertical-nav-item--popover--border-color: var(--sm-c-vertical-nav-color-border, #d9dee7);

.sm-vertical-nav-item {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  position: relative;

  &__link {
    display: block;
    width: 100%;
    background: none;
    border: none;
    appearance: none;
    text-align: inherit;
    padding: 0;
    margin: 0;
    font: inherit;
    cursor: pointer;
  }

  &__container {
    width: 100%;
    display: block;
  }

  &__prefix-icon {
    // we add a margin only when we display a prefix icon
    margin-right: $sm-8;
  }

  &__label-container {
    // to ensure that the prefix icon has its own dedicated column
    display: flex;
  }

  &__suffix-badge {
    // we use margin-left instead of flex+gap because:
    // we want the suffix label to be at the end of the nav label text.
    margin-left: $sm-8;
  }

  &__content {
    // we want flex spacing here between suffix icon and the rest of the label contents
    display: flex;
    justify-content: space-between;
    color: var(--sm-c-vertical-nav-item-color-text, var(--color-black, $grey-neu-black));
    background: var(--sm-c-vertical-nav-item-color-background, transparent);
    font-size: var(--sm-c-vertical-nav-item-font-size, var(--p-lg-font-size, 15px));
    font-weight: var(--sm-c-vertical-nav-item-font-weight, var(--font-weight-regular, 400));
    text-decoration: none;
    width: 100%;
    padding: var(--sm-c-vertical-nav-item-padding, 13px $sm-16); /* Configurable under sm-nav */
    position: relative;
    word-break: break-word;
    outline: none;

    &:focus {
      outline: none;
      box-shadow: none;
    }

    &--has-children {
      padding-right: $sm-48;
    }
  }

  // we don't display the dot unless
  // its a nested sm-vertical-nav-item
  .sm-vertical-nav-item__dot-marker-container {
    display: none;
  }

  // Second level indentation
  // we use sm-vertical-nav-item__children class
  // so we target only when vertical-nav-item is used outside of an sm-dropdown
  .sm-vertical-nav-item__children {
    .sm-vertical-nav-item__dot-marker-container {
      display: block;
      margin-right: $sm-12;
    }

    // the cross browser compatible "dot"
    .sm-vertical-nav-item__dot-marker {
      // we want inline so we can set width/height css properties
      display: inline-block;
      width: 6px;
      height: 6px;
      border: 1px solid rgba($grey-neu-black, 0.8);
      border-radius: 50%;

      // need absolute+top combo here to vertically center the "dot"
      position: absolute;

      // 22px as this is the line-height of the label
      top: 22px;
    }
  }

  &__children-toggle,
  &__popover-toggle {
    position: absolute;
    top: var(--sm-c-vertical-nav-item-toggle-button-top, $sm-8); /* nav-item-toggle-button tokens below are configurable under sm-nav */
    right: var(--sm-c-vertical-nav-item-toggle-button-right, $sm-8);
    height: $sm-32;
    width: $sm-32;
    color: var(--sm-c-vertical-nav-item-toggle-button-color-text, var(--sm-c-vertical-nav-item-color-text, var(--color-black, $grey-neu-black)));
    background: var(--sm-c-vertical-nav-item-color-background, inherit);
    line-height: inherit;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    outline: none;
    z-index: 30;
    appearance: none;
    padding: 0;

    .sm-icon {
      font-size: 13px;
      transform: rotate(180deg);
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      top: 0;

      &:focus {
        box-shadow: none;
        outline: 0;
      }
    }

    &, .sm-icon {
      &:hover,
      &:focus {
        transition: all 0.3s ease;
      }
    }
  }

  &__children,
  &__popover-children {
    width: 100%;
    padding: 0;
    margin: 0;
  }

  &__popover {
    background-color: $true-white;
    border: 1px solid $sm-vertical-nav-item--popover--border-color;
    border-radius: 4px;
    box-shadow: 0 5px 11px -5px rgba(24, 58, 108, 0.15), 0 6px 9px -5px rgba(24, 58, 108, 0.14), 0 1px 1px -1px rgba(24, 58, 108, 0.14);
    padding: 0;
    margin: 0;
    overflow: hidden;
    width: 100%;
    z-index: $sm-dropdown-content-z-index;

    .sm-vertical-nav-section__label {
      margin-top: 15px;
    }
  }

  &__active-indicator {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: $sm-4;
    height: 100%;
    background: transparent;
    z-index: 2;
    transition: all 0.3s ease;
  }

  &--hide-subnav-on-desktop {
    @media #{$large-desktop} {
      .sm-vertical-nav-item__popover,
      .sm-vertical-nav-item__popover-toggle {
        display: none;
      }
    }
  }

  /* Open State */
  &--children-visible &__children-toggle {
    /* nav-item-toggle-button token below is configurable under sm-nav */
    background: var(--sm-c-vertical-nav-item-toggle-button-color-background-active, var(--color-app-mid, $blue-neu-med));

    .sm-icon {
      transition: all 0.3s ease;
      transform: rotate(0);
    }
  }

  /* Hover State */
  &__children-toggle:hover {
    /* nav-item-toggle-button token below is configurable under sm-nav */
    color: var(--sm-c-vertical-nav-item-toggle-button-color-text, var(--sm-c-vertical-nav-item-color-text-hover, var(--color-black, $grey-neu-black)));
    background: var(--sm-c-vertical-nav-item-toggle-button-color-background-hover, var(--sm-c-vertical-nav-item-color-background-hover, var(--color-app-mid, $blue-neu-med)));
  }

  &__link:hover + &__children-toggle {
    color: var(--sm-c-vertical-nav-item-toggle-button-color-text, var(--sm-c-vertical-nav-item-color-text-hover, var(--color-black, $grey-neu-black)));
  }

  &__link:hover &__content,
  &__popover-toggle:hover,
  &__link:hover + &__popover-toggle {
    color: var(--sm-c-vertical-nav-item-color-text-hover, var(--color-black, $grey-neu-black));
    background: var(--sm-c-vertical-nav-item-color-background-hover, var(--color-app-mid, $blue-neu-med));
  }

  /* Focus State */
  &__link:focus &__content,
  &__children-toggle:focus,
  &__popover-toggle:focus,
  &__link:focus + &__children-toggle,
  &__link:focus + &__popover-toggle {
    color: var(--sm-c-vertical-nav-item-color-text-focus, var(--color-black, $grey-neu-black));
    background: var(--sm-c-vertical-nav-item-color-background-focus, transparent);
  }

  &--exact-active > &__container &__children-toggle {
    background: $blue-neu-med;
  }

  &__link:focus &__content::after,
  &__children-toggle:focus::after,
  &__popover-toggle:focus::after {
    @include outline;
  }

  /* Active State */
  &--exact-active > &__container &__link &__content,
  &--exact-active > &__container &__popover-toggle {
    font-weight: var(--sm-c-vertical-nav-item-font-weight-active, var(--font-weight-bold, 600));
    color: var(--sm-c-vertical-nav-item-color-text-active, var(--color-black, $grey-neu-black));
    background: var(--sm-c-vertical-nav-item-color-background-active, var(--color-app-mid, $blue-neu-med));
  }

  // Second level list style (the dot)
  &--exact-active > &__container &__link &__dot-marker {
    background: var(--primary-background, var(--sm-c-vertical-nav-item-indicator-color-exact-active, var(--color-primary, $primary-blue)));
    border-color: var(--primary-background, var(--sm-c-vertical-nav-item-indicator-color-exact-active, var(--color-primary, $primary-blue)));
  }

  &--active &__active-indicator {
    background: $sm-vertical-nav-item--active--indicator-color;
  }

  &--has-children &__active-indicator {
    background: $sm-vertical-nav-item--active--indicator-color;
  }

  &--has-popover-children:not(&--active) &__active-indicator,
  &--has-popover-children &__popover-children &__active-indicator,
  &--children-visible &__popover-children .sm-vertical-nav-section__active-indicator {
    background: transparent;
  }

  &--children-visible {
    .sm-vertical-nav-section__active-indicator {
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: $sm-4;
      height: 100%;
      z-index: 2;
      transition: all 0.3s ease;
      background: $sm-vertical-nav-item--active--indicator-color;
    }

    .sm-vertical-nav-section__label {
      margin-top: 15px;
    }
  }

  &--exact-active > &__container &__link &__active-indicator {
    background: var(--primary-background, var(--sm-c-vertical-nav-item-indicator-color-exact-active, var(--color-primary, $primary-blue)));
  }

  /* Disabled State */
  &--disabled {
    pointer-events: none;

    .sm-vertical-nav-item__content {
      color: var(--sm-c-vertical-nav-item-color-text-disabled, var(--color-disabled, $grey-neu-mid));
      background: var(--sm-c-vertical-nav-item-color-background-disabled, transparent);
      cursor: not-allowed;
    }
  }

  /* Readonly */
  &--readonly,
  &--readonly:hover,
  &--readonly:focus {
    .sm-vertical-nav-item__content {
      color: var(--sm-c-vertical-nav-item-color-text-disabled, var(--color-disabled, $grey-neu-mid));
      background: var(--sm-c-vertical-nav-item-color-background-disabled, transparent);
    }
  }

  // Nested content slot styling
  &--has-children {
    .sm-vertical-nav-item__children {
      .sm-vertical-nav-item__nested-content {
        padding-left: $sm-12;
      }
    }
  }
}
</style>
