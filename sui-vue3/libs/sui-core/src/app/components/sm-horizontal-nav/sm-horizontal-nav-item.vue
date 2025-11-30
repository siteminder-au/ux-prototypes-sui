<script setup lang="ts">
import { computed, ref, watchEffect, onBeforeUnmount, Ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { useClickedState } from '../use/clicked-state'
import { useUniqueId } from '../use/unique-id'
import { useI18n } from '../../libs/vue-i18n'
import { useInnerBlur } from '../use/inner-blur'
import { SmHorizontalNavItemActiveState } from './sm-horizontal-nav-item.types'
import { useIsNavItemActive } from '../use/is-nav-item-active'
import { useIsNavItemExactActive } from '../use/is-nav-item-exact-active'

const props = withDefaults(defineProps<{
  /**
   * The content of the nav item
   */
  label?: string
  /**
   * A Vue-Router object or string specifying the URL to navigate to
   */
  to?: RouteLocationRaw
  /**
   * A URL to navigate to. If provided this will override the `to` prop. Use this for external URLs outside of your application.
   */
  href?: string
  /**
   * The target props specifies where to open the linked document.
   */
  target?: string
  /**
   * By default the active state of the nav item is determined based on the `to` param. You can override that here.
   * Accepts 'active', 'exact-active' or 'in-active' or a custom function.
   */
  forceActiveState?: SmHorizontalNavItemActiveState | ((isActive: boolean, isExactActive: boolean) => SmHorizontalNavItemActiveState)
}>(), {
  label: '',
  to: undefined,
  href: undefined,
  target: undefined,
  forceActiveState: undefined,
})

const emit = defineEmits<{
  /**
   * Emitted when the nav item is toggled
   */
  toggle: [isOpen: boolean]
}>()

defineOptions({
  // For Vue3: We explicitly set this to false so we can move the $attr binding
  // to an actual HTML element (i.e. the <li> tag) instead of the <router-link> component
  inheritAttrs: false,
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

/**
 * defineSlots macro used to declare expected slots and their respective expected slot
 */
const slots = defineSlots<{
  default(): any
  icon(): any
  label(): any
}>()

const { i18n } = useI18n()

const isRouterLink = computed(() => props.to !== undefined)

const { isClicked, onMousedown } = useClickedState()
const hasChildren = computed(() => !!slots.default)

const rootElementRef: Ref<Element | null> = ref(null)

const contentElementRef: Ref<Element | null> = ref(null)

const buttonElementRef: Ref<Element | null> = ref(null)

const { id: horizontalNavItemId } = useUniqueId('sm-horizontal-nav-item__children_')

const isOpen = ref(false)

const open = (): void => {
  isOpen.value = true

  if (rootElementRef.value) {
    useInnerBlur(rootElementRef.value, close).bind()
  }
}
const close = (): void => {
  isOpen.value = false
}
const toggle = (): void => {
  emit('toggle', isOpen.value)
  return isOpen.value ? close() : open()
}

const childrenToggleA11yLabel = computed<string>(() => {
  return isOpen.value
    ? i18n.t('sui-core.components.sm-horizontal-nav.sm-horizontal-nav.a11y__children-toggle-hide')
    : i18n.t('sui-core.components.sm-horizontal-nav.sm-horizontal-nav.a11y__children-toggle-show')
})

const onClickOutside = (e: MouseEvent): void => {
  // Check if the click happened inside the Horizontal menu
  if (!rootElementRef.value?.contains(e.target as Node) && !buttonElementRef.value?.contains(e.target as Node)) {
    close()
  }
}

watchEffect(() => {
  if (isOpen.value) {
    document.addEventListener('click', onClickOutside)
  } else {
    document.removeEventListener('click', onClickOutside)
  }
})

onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

const vueRouterActiveState = ref(false)
const vueRouterExactActiveState = ref(false)

const isActive = computed(() => useIsNavItemActive(vueRouterActiveState.value, vueRouterExactActiveState.value, props.forceActiveState))

const isExactActive = computed(() => useIsNavItemExactActive(vueRouterActiveState.value, vueRouterExactActiveState.value, props.forceActiveState))

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

defineExpose({
  isClicked,
  onMousedown,
  hasChildren,
  horizontalNavItemId,
  childrenToggleA11yLabel,
  isOpen,
  toggle,
  rootElementRef,
  contentElementRef,
  buttonElementRef,
})
</script>

<template>
  <li
    ref="rootElementRef"
    class="sm-horizontal-nav-item"
    :class="{
      'sm-horizontal-nav-item--active': isActive,
      'sm-horizontal-nav-item--exact-active': isExactActive,
      'sm-horizontal-nav-item--has-children': hasChildren,
      'sm-horizontal-nav-item--open': isOpen,
    }"
    v-bind="$attrs"
  >
    <router-link
      v-if="isRouterLink"
      v-slot="routerLink"
      :custom="true"
      :to="to || '#'"
    >
      {{ setVueRouterActiveState(routerLink.isActive, routerLink.isExactActive) }}

      <component
        :is="to ? 'a' : 'button'"
        ref="buttonElementRef"
        class="sm-horizontal-nav-item__link sm-p"
        :href="to ? routerLink.href : undefined"
        :target="to ? target : undefined"
        :aria-expanded="isOpen"
        :aria-controls="hasChildren ? horizontalNavItemId : undefined"
        :aria-label="hasChildren ? childrenToggleA11yLabel : undefined"
        :title="label ?? undefined"
        @click="to ? routerLink.navigate($event) : toggle()"
      >
        <div
          class="sm-horizontal-nav-item__content"
          tabindex="-1"
        >
          <span class="sm-horizontal-nav-item__label">
            <!-- @slot The custom label -->
            <slot name="label">{{ label }}</slot>
          </span>
          <span
            v-if="$slots.icon"
            class="sm-horizontal-nav-item__icon"
          >
            <!-- @slot The icon slot -->
            <slot name="icon" />
          </span>
          <span
            v-if="hasChildren"
            class="sm-horizontal-nav-item__arrow-icon"
          >
            <sm-icon
              name="arrow-down"
              tabindex="-1"
            />
          </span>
          <span
            class="sm-horizontal-nav-item__active-indicator"
            aria-hidden="true"
          />
        </div>
      </component>
    </router-link>

    <component
      :is="href ? 'a' : 'button'"
      v-else
      ref="buttonElementRef"
      class="sm-horizontal-nav-item__link sm-p"
      :href="href"
      :target="target"
      :aria-expanded="isOpen"
      :aria-controls="(hasChildren && horizontalNavItemId) || undefined"
      :aria-label="hasChildren ? childrenToggleA11yLabel : undefined"
      :title="label ?? undefined"
      @click="toggle"
    >
      <div
        class="sm-horizontal-nav-item__content"
        tabindex="-1"
      >
        <span class="sm-horizontal-nav-item__label">
          <!-- @slot The custom label -->
          <slot name="label">{{ label }}</slot>
        </span>
        <span
          v-if="$slots.icon"
          class="sm-horizontal-nav-item__icon"
        >
          <!-- @slot The icon slot -->
          <slot name="icon" />
        </span>
        <span
          v-if="hasChildren"
          class="sm-horizontal-nav-item__arrow-icon"
        >
          <sm-icon
            name="arrow-down"
            tabindex="-1"
          />
        </span>
        <span
          class="sm-horizontal-nav-item__active-indicator"
          aria-hidden="true"
        />
      </div>
    </component>

    <div
      v-if="isOpen"
      :id="horizontalNavItemId || undefined"
      ref="contentElementRef"
      class="sm-horizontal-nav-item__container"
    >
      <!-- @slot The default slot here -->
      <slot />
    </div>
  </li>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

// White-labelling tokens > theming tokens
$sm-horizontal-nav-item--text-color: var(--tertiary-foreground, var(--sm-c-horizontal-nav-item-color-text, var(--color-black, $grey-neu-black)));
$sm-horizontal-nav-item--background-color: var(--tertiary-background, var(--sm-c-horizontal-nav-item-color-background, var(--color-pure-white, $true-white)));
$sm-horizontal-nav-item--hover--text-color: var(--tertiary-foreground, var(--sm-c-horizontal-nav-item-color-text-hover, var(--color-black, $grey-neu-black)));
$sm-horizontal-nav-item--hover--background-color: var(--primary-foreground, var(--sm-c-horizontal-nav-item-color-background-hover, var(--color-app-mid, $blue-neu-med)));
$sm-horizontal-nav-item--disabled--text-color: rgba($sm-horizontal-nav-item--text-color, 20%);
$sm-horizontal-nav-item--disabled--background-color: $sm-horizontal-nav-item--background-color;
$sm-horizontal-nav-item--clicked--text-color: $sm-horizontal-nav-item--text-color;
$sm-horizontal-nav-item--clicked--background-color: #d9dee7;
$sm-horizontal-nav-item--active--text-color: var(--tertiary-foreground, var(--sm-c-horizontal-nav-item-color-text-active, var(--color-black, $grey-neu-black)));
$sm-horizontal-nav-item--active--background-color: var(--primary-foreground, var(--sm-c-horizontal-nav-item-color-background-active, var(--color-app-mid, $blue-neu-med)));
$sm-horizontal-nav-item--active--indicator-color: var(--primary-background, var(--sm-c-horizontal-nav-item-indicator-color-active, var(--color-primary, $primary-blue)));
$sm-horizontal-nav-item--exact-active--indicator-color: var(--primary-background, var(--sm-c-horizontal-nav-item-indicator-color-exact-active, var(--color-primary, $primary-blue)));
$sm-horizontal-nav-item--open--text-color: var(--tertiary-foreground, var(--sm-c-horizontal-nav-item-color-text-open, var(--color-black, $grey-neu-black)));
$sm-horizontal-nav-item--open--background-color: var(--primary-foreground, var(--sm-c-horizontal-nav-item-color-background-open, var(--color-app-mid, $blue-neu-med)));

.sm-horizontal-nav-item {
  padding: 0;
  margin: 0;
  list-style: none;

  &__link {
    display: inline-block;
    position: relative;
    height: 100%;
    outline: none;
    padding: 0;
    background: transparent;
    border: 0;
    cursor: pointer;
    margin-bottom: 0;
  }

  &__content {
    color: $sm-horizontal-nav-item--text-color;
    background: $sm-horizontal-nav-item--background-color;
    font-size: var(--sm-c-horizontal-nav-item-font-size, var(--p-lg-font-size, 15px));
    font-weight: var(--sm-c-horizontal-nav-item-font-weight, var(--font-weight-regular, 400));
    text-decoration: none;
    display: inline-block;
    padding: 13px $sm-24;
    position: relative;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    height: 100%;

    /* Hover State */
    &:hover {
      color: $sm-horizontal-nav-item--hover--text-color;
      background: $sm-horizontal-nav-item--hover--background-color;
    }
  }

  /* Active State */
  &--active &__content {
    color: $sm-horizontal-nav-item--active--text-color;
    background: $sm-horizontal-nav-item--active--background-color;
    border-bottom-color: $sm-horizontal-nav-item--active--indicator-color;
    font-weight: var(--sm-c-horizontal-nav-item-font-weight-active, var(--font-weight-bold, 600));
  }

  &--exact-active &__content {
    color: $sm-horizontal-nav-item--active--text-color;
    background: $sm-horizontal-nav-item--active--background-color;
    border-bottom-color: $sm-horizontal-nav-item--exact-active--indicator-color;
    font-weight: var(--sm-c-horizontal-nav-item-font-weight-active, var(--font-weight-bold, 600));
  }

  &--has-children &__content {
    border-bottom-color: transparent;
    background: $sm-horizontal-nav-item--background-color;
    font-weight: var(--sm-c-horizontal-nav-item-font-weight, var(--font-weight-regular, 400));
    display: flex;
    align-items: center;
  }

  &--has-children &__content:hover {
    color: $sm-horizontal-nav-item--hover--text-color;
    background: $sm-horizontal-nav-item--hover--background-color;
  }

  /* Focus State */
  &__link:focus,
  &__content:focus {
    outline: none;
    box-shadow: none;
  }

  &__link:focus::after {
    content: "";
    position: absolute;
    top: -1px;
    left: -1px;
    width: calc(100% - 2px);
    height: calc(100% - 2px);

    @include shadow-outline;
  }

  /* Clicked State */
  &--clicked &__content {
    color: $sm-horizontal-nav-item--clicked--text-color;
    background: $sm-horizontal-nav-item--clicked--background-color;
  }

  &__icon {
    @include padding($left: rem($sm-xxsm));
  }

  &--open &__content {
    color: $sm-horizontal-nav-item--open--text-color;
    background: $sm-horizontal-nav-item--open--background-color;
  }

  &__container {
    position: absolute;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 3px 17px -8px rgba(24, 58, 108, 0.19), 0 12px 11px -13px rgba(24, 58, 108, 0.18), 0 10px 24px -9px rgba(24, 58, 108, 0.12);
    border-radius: 4px;
    border: 1px solid $sm-horizontal-nav-item--clicked--background-color;
    box-sizing: border-box;
    background: White;
    transition: transform 0.3s ease;
    max-width: 232px;
    top: calc(100% + 3px);
    overflow-y: auto;
    z-index: $sm-horizontal-nav-z-index;
  }

  &__arrow-icon {
    padding-left: $sm-8;
    transform: translateY(1px);
    transform-origin: center center;
    transition: transform 0.3s ease;
  }

  &__arrow-icon .sm-icon {
    transition: transform 0.3s ease;

    &:focus {
      box-shadow: none;
      outline: 0;
    }
  }

  &--open &__arrow-icon .sm-icon {
    transform: rotate(-180deg);
  }
}
</style>
