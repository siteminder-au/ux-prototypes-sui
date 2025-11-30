<script setup lang="ts">
import { computed, ref, inject, watch, VNode } from 'vue'
import { RouteLocationRaw } from 'vue-router'
import { useUniqueId } from '../use/unique-id'
import SmPopover from '../sm-popover/sm-popover.vue'
import SmButton from '../sm-button/sm-button.vue'
import SmNavItemLabel from './sm-nav-item-label.vue'
import { closeNavKey, deepLinkProviderKey } from './symbols'
import { useI18n } from '../../libs/vue-i18n'
import { SmNavItemActiveState } from './sm-nav-item.types'
import { SmPopoverPlacement, SmPopoverType, SmPopoverPosition } from '../sm-popover/sm-popover.types'
import { useIsNavItemActive } from '../use/is-nav-item-active'
import { useIsNavItemExactActive } from '../use/is-nav-item-exact-active'
import { SmButtonShape, SmButtonSize } from '../sm-button/sm-button.types'

const props = withDefaults(defineProps<{
  /**
   * The content of the navigation bar item
   */
  label: string
  /**
   * A Vue-Router object or string specifying the URL to navigate to
   */
  to?: RouteLocationRaw
  /**
   * A URL to navigate to. If provided this will override the `to` prop. Use this for external URLs outside of your application.
   */
  href?: string | Record<string, unknown>
  /**
   * By default the active state of the navigation bar item is determines based on the `to` param. You can override that here.
   */
  forceActiveState?: SmNavItemActiveState | ((isActive: boolean, isExactActive: boolean) => SmNavItemActiveState)
  /**
   * The target props specifies where to open the linked document
   */
  target?: string
  /**
   * The title of the navigation bar item
   */
  title?: string
  /**
   * Determine whether the navigation item is disabled. To "disable" <a> tag remove its href/to attribute, or add a click handler that returns false.
   */
  disabled?: boolean
  /**
   * The title of the popover
   */
  popoverTitle?: string
  /**
   * The side of the target element the popover should be placed against. Accepts 'top', 'right', 'bottom' and 'left'
   */
  popoverPlacement?: SmPopoverPlacement
  /**
   * The style of the popover. Accepts 'info', 'success', 'alert', 'warning'
   */
  popoverType?: SmPopoverType
  /**
   * Whether the navigation items has popover
   */
  isPopover?: boolean
  /**
   * Populate this to be able to associate nested nav items to a parent nav item
   * to enable deep linking persistence to work
   */
  navItemId?: string
  /**
   * Mainly for initialising sm-nav to the right submenu when coming from a deep link
   */
  parentNavItems?: string[]
}>(), {
  to: undefined,
  href: undefined,
  forceActiveState: SmNavItemActiveState.ACTIVE,
  target: '',
  title: '',
  disabled: false,
  popoverTitle: '',
  popoverPlacement: SmPopoverPlacement.BOTTOM,
  popoverType: SmPopoverType.INFO,
  isPopover: false,
  navItemId: '',
  parentNavItems: () => [],
})

const emit = defineEmits<{
  back: []
  click: []
  toggle: []
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

// provided by sm-nav
const closeNav = inject(closeNavKey)
const deepLinkProvider = inject(
  deepLinkProviderKey,
  {
    deepLinkParentNavItems: ref([]),
    setDeepLinkParentNavItems: (_parentNavItems: string[]) => {},
  },
)

const childrenVisible = ref(false)

const isVisible = ref(false)
const { id: navItemsId } = useUniqueId(`${props.label}_`)
const navItemsAriaControlId = computed(() => `${navItemsId.value}__body_`)
const navItemslabelledbyId = computed(() => `${navItemsId.value}__id_`)

/**
 * defineSlots macro used to declare expected slots and their respective expected slot
 */
const slots = defineSlots<{
  content?: () => VNode[]
  default?: () => VNode[]
  'prefix-icon'?: () => VNode[]
  'popover-content'?: (slotProps: Record<string, unknown>) => VNode[]
  'suffix-icon'?: () => VNode[]
  title?: () => VNode[]
}>()

const hasChildren = computed(() => !!slots.default)

const { id: childrenElementId } = useUniqueId('sm-vertical-nav-item__children_')

const toggle = (): void => {
  if (props.disabled || props.isPopover) {
    return
  }

  if ((props.to || props.href) && !hasChildren.value) {
    // for leaf nav items
    closeNav?.()
  } else {
    // for non-leaf nav items
    childrenVisible.value = true
  }

  emit('toggle')
}

const back = (): void => {
  // this function is only for non-leaf nav items
  childrenVisible.value = false
  emit('back')
}

// TODO: consider refactoring this post-vue3.
// This function is executed in the <template> block and has nothing to render
// Find a better way to do this
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

  if (!exactActive) {
    return
  }

  if (hasChildren.value) {
    return
  }

  // on a full page reload of a deep link
  // we want to store the parentNavItems of this leaf nav item
  // so we can reconstruct what sub menus are open
  deepLinkProvider.setDeepLinkParentNavItems(props.parentNavItems)
}

const isActive = computed(() => useIsNavItemActive(vueRouterActiveState.value, vueRouterExactActiveState.value, props.forceActiveState))
const isExactActive = computed(() => useIsNavItemExactActive(vueRouterActiveState.value, vueRouterExactActiveState.value, props.forceActiveState))

/**
 * Add class visible on popover open
 */
const open = (): void => {
  isVisible.value = true
}

/**
 * Remove class visible on popover close
 */
const close = (): void => {
  isVisible.value = false
}

/**
 * This logic is mainly for toggling on visibility of the children of
 * each parent sm-nav-items that is part of a deep link path.
 */
watch(
  deepLinkProvider.deepLinkParentNavItems,
  () => {
    // don't run this for leaf nav items
    if (!hasChildren.value) {
      return
    }

    // we check if this is at least one of the parent sm-nav-items that is part of the deep link path
    if (deepLinkProvider.deepLinkParentNavItems.value.includes(props.navItemId)) {
      toggle()
    }
  },
  {
    immediate: true,
    // we want `deep: true` to remove the vue/compat warning:
    // [Vue warn]: (deprecation WATCH_ARRAY)
    // deepLinkProvider.deepLinkParentNavItems array is replaced entirely via setDeepLinkParentNavItems
    // defined in in sm-nav, so having deep: true here doesn't really matter.
    deep: true,
  },
)

const isRouterLink = computed(() => props.to !== undefined)

defineExpose({
  hasChildren,
  navItemsAriaControlId,
  toggle,
  childrenVisible,
  setVueRouterActiveState,
  isActive,
  isExactActive,
  navItemslabelledbyId,
  back,
  childrenElementId,
  open,
  close,
  isVisible,
})
</script>

<template>
  <li
    v-if="!isRouterLink"
    class="sm-nav-items"
    :class="{
      'sm-nav-items--active': isActive,
      'sm-nav-items--exact-active': isExactActive,
      'sm-nav-items__has-children': hasChildren,
    }"
    role="none"
    v-bind="$attrs"
  >
    <div
      class="sm-nav-items__container"
      :class="{
        'sm-nav-items--has-popover': isPopover,
        'sm-nav-items--popover-visible': isVisible,
      }"
      @click="toggle"
    >
      <sm-popover
        v-if="isPopover"
        :is-transition="false"
        :placement="popoverPlacement"
        :title="popoverTitle"
        :type="popoverType"
        :position="SmPopoverPosition.FIXED"
        @close="close"
        @open="open"
      >
        <template #default>
          <button
            :disabled="disabled"
            class="sm-nav-items__button"
            :class="{ 'sm-nav-items--disabled': disabled }"
            :title="i18n.t('sui-core.components.sm-nav.sm-nav.a11y__side-nav-items')"
            :aria-disabled="disabled"
          >
            <sm-nav-item-label :label="label">
              <template
                v-if="$slots['prefix-icon']"
                #prefix-icon
              >
                <slot name="prefix-icon" />
              </template>
              <template
                v-if="$slots['content']"
                #content
              >
                <slot name="content" />
              </template>
              <template
                v-if="$slots['suffix-icon']"
                #suffix-icon
              >
                <slot name="suffix-icon" />
              </template>
            </sm-nav-item-label>
          </button>
        </template>
        <template
          v-if="$slots['popover-content']"
          #content="slotProps"
        >
          <slot
            name="popover-content"
            v-bind="slotProps"
          />
        </template>
      </sm-popover>
      <component
        :is="href ? 'a' : 'button'"
        v-else
        :id="navItemslabelledbyId || undefined"
        :disabled="href ? null : disabled"
        :target="href ? target : null"
        class="sm-nav-items__button"
        :class="{ 'sm-nav-items--disabled': disabled }"
        :href="href"
        :title="i18n.t('sui-core.components.sm-nav.sm-nav.a11y__side-nav-items')"
        :aria-controls="navItemsAriaControlId"
        role="menuitem"
        :aria-expanded="childrenVisible && hasChildren"
        @click="$emit('click')"
      >
        <sm-nav-item-label :label="label">
          <template
            v-if="$slots['prefix-icon']"
            #prefix-icon
          >
            <slot name="prefix-icon" />
          </template>
          <template
            v-if="$slots['content']"
            #content
          >
            <slot name="content" />
          </template>
          <template
            v-if="$slots['suffix-icon']"
            #suffix-icon
          >
            <slot name="suffix-icon" />
          </template>
        </sm-nav-item-label>
      </component>
      <template v-if="hasChildren">
        <button
          type="button"
          class="sm-nav-items__children-toggle"
          :aria-expanded="childrenVisible"
          :aria-controls="childrenElementId || undefined"
          :disabled="disabled"
          :class="{ 'sm-nav-items--arrow-right-disabled': disabled }"
          :aria-label="i18n.t('sui-core.components.sm-nav.sm-nav.a11y__children-toggle-show')"
        >
          <sm-icon name="arrow-right" />
        </button>
      </template>
    </div>
    <template v-if="hasChildren">
      <ul
        v-show="childrenVisible"
        :id="navItemsAriaControlId"
        role="menubar"
        class="sm-nav-items__list"
        :aria-labelledby="navItemslabelledbyId"
      >
        <li role="none">
          <div class="sm-nav-items__heading">
            <sm-button
              class="sm-nav-items__left-arrow"
              :shape="SmButtonShape.SQUARE"
              :size="SmButtonSize.MEDIUM"
              :title="i18n.t('sui-core.components.sm-nav.sm-nav.a11y__go-back')"
              :aria-label="i18n.t('sui-core.components.sm-nav.sm-nav.a11y__go-back')"
              @click="back"
            >
              <sm-icon
                name="arrow-go-back"
                aria-hidden="true"
              />
            </sm-button>
            <span class="sm-nav-items__title">
              <!-- @slot The title of the navigation bar -->
              <slot name="title">{{ title }}</slot>
            </span>
          </div>
        </li>
        <!-- @slot The content of navigation bar children -->
        <slot />
      </ul>
    </template>
  </li>

  <router-link
    v-else
    v-slot="routerLink"
    :custom="true"
    :to="to!"
  >
    <li
      class="sm-nav-items"
      :class="{
        'sm-nav-items--active': isActive,
        'sm-nav-items--exact-active': isExactActive,
        'sm-nav-items__has-children': hasChildren,
      }"
      role="none"
      v-bind="$attrs"
    >
      {{ setVueRouterActiveState(routerLink.isActive, routerLink.isExactActive) }}
      <div
        class="sm-nav-items__container"
        :class="{
          'sm-nav-items--has-popover': isPopover,
          'sm-nav-items--popover-visible': isVisible,
        }"
        @click="toggle"
      >
        <sm-popover
          v-if="isPopover"
          :is-transition="false"
          :placement="popoverPlacement"
          :title="popoverTitle"
          :type="popoverType"
          :position="SmPopoverPosition.FIXED"
          @close="close"
          @open="open"
        >
          <template #default>
            <button
              :disabled="disabled"
              class="sm-nav-items__button"
              :class="{ 'sm-nav-items--disabled': disabled }"
              :title="i18n.t('sui-core.components.sm-nav.sm-nav.a11y__side-nav-items')"
              :aria-disabled="disabled"
            >
              <sm-nav-item-label :label="label">
                <template
                  v-if="$slots['prefix-icon']"
                  #prefix-icon
                >
                  <slot name="prefix-icon" />
                </template>
                <template
                  v-if="$slots['content']"
                  #content
                >
                  <slot name="content" />
                </template>
                <template
                  v-if="$slots['suffix-icon']"
                  #suffix-icon
                >
                  <slot name="suffix-icon" />
                </template>
              </sm-nav-item-label>
            </button>
          </template>
          <template
            v-if="$slots['popover-content']"
            #content="slotProps"
          >
            <slot
              name="popover-content"
              v-bind="slotProps"
            />
          </template>
        </sm-popover>
        <a
          v-else
          :id="navItemslabelledbyId || undefined"
          :target="target"
          class="sm-nav-items__button"
          :class="{ 'sm-nav-items--disabled': disabled }"
          :href="routerLink.href"
          :title="i18n.t('sui-core.components.sm-nav.sm-nav.a11y__side-nav-items')"
          :aria-controls="navItemsAriaControlId"
          role="menuitem"
          :aria-expanded="childrenVisible && hasChildren"
          @click="routerLink.navigate($event)"
        >
          <sm-nav-item-label :label="label">
            <template
              v-if="$slots['prefix-icon']"
              #prefix-icon
            >
              <slot name="prefix-icon" />
            </template>
            <template
              v-if="$slots['content']"
              #content
            >
              <slot name="content" />
            </template>
            <template
              v-if="$slots['suffix-icon']"
              #suffix-icon
            >
              <slot name="suffix-icon" />
            </template>
          </sm-nav-item-label>
        </a>
        <template v-if="hasChildren">
          <button
            type="button"
            class="sm-nav-items__children-toggle"
            :aria-expanded="childrenVisible"
            :aria-controls="childrenElementId || undefined"
            :disabled="disabled"
            :class="{ 'sm-nav-items--arrow-right-disabled': disabled }"
            :aria-label="i18n.t('sui-core.components.sm-nav.sm-nav.a11y__children-toggle-show')"
          >
            <sm-icon name="arrow-right" />
          </button>
        </template>
      </div>
      <template v-if="hasChildren">
        <ul
          v-show="childrenVisible"
          :id="navItemsAriaControlId"
          role="menubar"
          class="sm-nav-items__list"
          :aria-labelledby="navItemslabelledbyId"
        >
          <li role="none">
            <div class="sm-nav-items__heading">
              <sm-button
                class="sm-nav-items__left-arrow"
                :shape="SmButtonShape.SQUARE"
                :size="SmButtonSize.MEDIUM"
                :title="i18n.t('sui-core.components.sm-nav.sm-nav.a11y__go-back')"
                :aria-label="i18n.t('sui-core.components.sm-nav.sm-nav.a11y__go-back')"
                @click="back"
              >
                <sm-icon
                  name="arrow-go-back"
                  aria-hidden="true"
                />
              </sm-button>
              <span class="sm-nav-items__title">
                <!-- @slot The title of the navigation bar -->
                <slot name="title">{{ title }}</slot>
              </span>
            </div>
          </li>
          <!-- @slot The content of navigation bar children -->
          <slot />
        </ul>
      </template>
    </li>
  </router-link>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-nav-items--list-border-color: var(--color-app, $blue-neu-mid);
$sm-body--background-color: var(--sm-c-app-header-tablet-nav-item-color-background, var(--color-app-light, $blue-neu-light));
$sm-nav-items--list-background-color: var(--sm-c-app-header-tablet-nav-item-color-background-active, var(--color-app-mid, $blue-neu-med));
$sm-nav-items--content--text-color: var(--color-black, $grey-neu-black);
$sm-nav-items--border-color: #d9dee7; // not mapped to a color token
$sm-nav-items--disabled-color: var(--sm-c-app-header-tablet-nav-item-color-text-disabled, $grey-neu-mid);

.sm-nav-items {
  position: relative;
  background: $sm-body--background-color;

  &__container {
    @include margin($top: rem($sm-xxsm));

    transition: transform 0.3s cubic-bezier(0.42, 0.15, 0.22, 0.96);
    position: relative;

    &:focus,
    &:hover {
      background: var(--sm-c-app-header-tablet-nav-item-color-background-hover, var(--color-app-mid, $blue-neu-med));
    }
  }

  .sm-nav-items__list {
    height: 100%;
    visibility: visible;
    opacity: 1;
  }

  &--exact-active {
    background: $sm-nav-items--list-background-color;

    > .sm-nav-items__container {
      .sm-nav-item-label__active-indicator {
        background: var(--sm-c-app-header-tablet-nav-item-active-indicator-color, var(--color-primary, $primary-blue));
      }

      .sm-nav-item-label__label {
        font-weight: 600;
      }
    }
  }

  .sm-user-list {
    li {
      @include padding($top: rem($sm-lg), $left: rem($sm-sm), $bottom: rem($sm-sm));

      border-bottom: 1px solid $sm-nav-items--list-border-color;

      p {
        padding: 0;
        margin: 0;
      }

      &::before {
        top: 32px;
      }
    }
  }

  &__button:focus .sm-nav-item-label::after {
    @include outline;
  }

  &__list {
    // `fixed` so the nav is positioned relative to the viewport
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    transform: none;
    will-change: transform;
    transition: transform 0.3s cubic-bezier(0.42, 0.15, 0.22, 0.96);
    overflow: visible;
    background: $sm-body--background-color;
    list-style-type: none;
    padding: 0;
  }

  &__button {
    border: 0;
    background: transparent;
    width: 100%;
    height: 100%;
    text-align: left;
    cursor: pointer;
    display: block;
    line-height: 22px;
    margin: 0;
    padding: 0;

    &:focus,
    &:hover {
      outline: none;
      box-shadow: none;
    }
  }

  &__children-toggle {
    position: absolute;
    top: 8px;
    right: 15px;
    height: 32px;
    width: 32px;
    line-height: 1;
    color: $sm-nav-items--content--text-color;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    outline: none;
    z-index: 0;
    appearance: none;
    padding: 0;
    background: transparent;

    .sm-icon {
      top: 0;
    }

    &:focus:not(:focus-visible) {
      /** Remove focus styles on click */
      outline: none;
      box-shadow: none;
    }

    &:focus-visible {
      @include shadow-outline;
    }
  }

  &__notification-subtitle {
    position: absolute;
    top: 10px;
    right: 42px;
  }

  &__heading {
    padding: var(--sm-c-app-header-tablet-nav-sub-menu-heading-padding, $sm-16 18px $sm-16 18px);
    background: var(--sm-c-app-header-tablet-nav-sub-menu-heading-color-background, var(--color-pure-white, $true-white));
    border-bottom: var(--sm-c-app-header-tablet-nav-sub-menu-heading-border-bottom, 1px solid $sm-nav-items--border-color);
    font-weight: 600;
    height: var(--sm-c-app-header-tablet-nav-sub-menu-heading-height, $sm-56);
    min-height: var(--sm-c-app-header-tablet-nav-sub-menu-heading-height, $sm-56);
    display: flex;
    position: relative;
    align-items: center;
    transition: transform 0.3s cubic-bezier(0.42, 0.15, 0.22, 0.96);
    margin-top: 0;
    color: var(--sm-c-app-header-tablet-nav-sub-menu-heading-color-text, var(--color-black, $grey-neu-black));

    .sm-nav-item-label {
      display: flex;
      align-items: center;
    }
  }

  &__left-arrow {
    @include margin($right: rem($sm-xxsm));

    .sm-button__content {
      background: var(--sm-c-app-header-tablet-nav-sub-menu-heading-left-button-color-background, transparent);
      color: var(--sm-c-app-header-tablet-nav-sub-menu-heading-left-button-color-text, var(--color-black, $grey-neu-black));

      &:hover {
        background: transparent;
      }
    }
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    width: var(--sm-c-app-header-tablet-nav-sub-menu-heading-title-width, 368px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }

  &--disabled {
    pointer-events: none;

    .sm-nav-item-label__label {
      color: $sm-nav-items--disabled-color;
    }
  }

  &--arrow-right-disabled {
    pointer-events: none;
    color: $sm-nav-items--disabled-color;
  }

  &--popover-visible {
    z-index: 1;
  }
}
</style>
