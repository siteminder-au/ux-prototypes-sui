<script setup lang="ts">
import { truncate } from 'lodash-es'
import { ref, computed, Ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useUniqueId } from '../use/unique-id'
import { useI18n } from '../../libs/vue-i18n'
import iconArrowDown from './icons/arrow-down'

const props = withDefaults(defineProps<{
  /**
   * Display text on the button
   */
  propertyName?: string
  /**
   * Whether the dropdown list can overflow to show popover submenus
   */
  overflowVisible?: boolean
}>(), {
  propertyName: '',
  overflowVisible: false,
})

const emit = defineEmits<{
  /**
   * Emitted menu is opened
   */
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
})

const { i18n } = useI18n()

const rootElementRef: Ref<HTMLElement | null> = ref(null)

const isOpen = ref(false)

onClickOutside(
  rootElementRef,
  () => { isOpen.value = false },
)

const toggle = (): void => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    emit('click')
  }
}

const open = (): void => {
  emit('click')
  isOpen.value = true
}

const itemsToggleA11yLabel = computed(() => {
  return isOpen.value
    ? i18n.t('sui-core.components.sm-property-menu.sm-property-menu.a11y__children-toggle-hide')
    : i18n.t('sui-core.components.sm-property-menu.sm-property-menu.a11y__children-toggle-show')
})

const { id: itemsElementId } = useUniqueId('sm-property-menu__items_')

const truncatedPropertyName = computed(() => truncate(props.propertyName, { length: 30 }))

defineExpose({
  isOpen,
  toggle,
  itemsToggleA11yLabel,
  itemsElementId,
  truncatedPropertyName,
  rootElementRef,
  open,
})
</script>

<template>
  <span
    ref="rootElementRef"
    class="sm-property-menu"
    :class="{ 'sm-property-menu--open': isOpen }"
  >
    <button
      v-if="isOpen"
      class="sm-property-menu__button-spacer"
      role="none"
      :aria-hidden="true"
    >
      <span class="sm-property-menu__content">
        <slot name="label">{{ truncatedPropertyName }}</slot>
        <span class="sm-property-menu__indicator">
          <span class="sm-icon sm-icon--arrow-down">
            <svg
              version="1.1"
              :viewBox="iconArrowDown.viewBox"
              :style="{ width: '1em', height: '1em' }"
              focusable="false"
              :aria-hidden="true"
              role="img"
              v-html="iconArrowDown.path"
            ></svg>
          </span>
        </span>
      </span>
    </button>

    <div class="sm-property-menu__container">
      <button
        type="button"
        class="sm-property-menu__button"
        :aria-expanded="isOpen"
        :aria-controls="itemsElementId || undefined"
        :aria-label="itemsToggleA11yLabel"
        :title="propertyName"
        @click="toggle"
      >
        <span
          class="sm-property-menu__content"
          tabindex="-1"
        >
          <span class="sm-property-menu__display-label">
            <slot name="label">{{ truncatedPropertyName }}</slot>
          </span>
          <span class="sm-property-menu__indicator">
            <span class="sm-icon sm-icon--arrow-down">
              <svg
                version="1.1"
                :viewBox="iconArrowDown.viewBox"
                :style="{ width: '1em', height: '1em' }"
                focusable="false"
                :aria-hidden="true"
                role="img"
                v-html="iconArrowDown.path"
              ></svg>
            </span>
          </span>
        </span>
      </button>

      <div
        v-show="isOpen"
        :id="itemsElementId || undefined"
        class="sm-property-menu__items"
        :class="{ 'sm-property-menu__items--overflow': overflowVisible }"
      >
        <slot />
      </div>
    </div>
  </span>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-property-menu--text-color: var(--secondary-foreground, var(--sm-c-app-header-menu-color-text, var(--color-pure-white, $true-white)));
$sm-property-menu--background-color: var(--sm-c-app-header-menu-color-background, transparent);
$sm-property-menu--border-color: #d9dee7; // not mapped to a color token
$sm-property-menu--hover--text-color: var(--tertiary-foreground, var(--sm-c-app-header-menu-color-text-hover, var(--color-pure-white, $true-white)));
$sm-property-menu--hover--background-color: var(--tertiary-background, var(--sm-c-app-header-menu-color-background-hover, $primary-blue-highlight));
$sm-property-menu--focus--text-color: var(--tertiary-foreground, var(--sm-c-app-header-menu-color-text-focus, var(--color-pure-white, $true-white)));
$sm-property-menu--focus--background-color: var(--tertiary-background, var(--sm-c-app-header-menu-color-background-focus, $primary-blue-highlight));
$sm-property-menu--open--text-color: var(--sm-c-app-header-vertical-nav-button-color-text-open, var(--color-black, $grey-neu-black));
$sm-property-menu--open--background-color: var(--sm-c-app-header-vertical-nav-button-color-background-open, var(--color-pure-white, $true-white));
$sm-property-menu--open--border-color: var(--sm-c-app-header-vertical-nav-button-color-border-open, $sm-property-menu--border-color);
$sm-property-menu-item--text-color: var(--color-black, $grey-neu-black);
$sm-property-menu-item--background-color: var(--color-pure-white, $true-white);
$sm-property-menu-item--border-color: var(--sm-c-app-header-vertical-nav-item-color-border, $sm-property-menu--border-color);

.sm-property-menu {
  position: relative;
  display: inline-block;

  &__button {
    background: $sm-property-menu--background-color;
    color: $sm-property-menu--text-color;
    border: 1px solid var(--sm-c-app-header-menu-color-border, transparent);
    border-radius: var(--sm-c-app-header-menu-border-radius, 4px);
    appearance: none;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
    position: relative;
    font-family: inherit;
    padding: 0;
    letter-spacing: var(--sm-c-app-header-property-menu-letter-spacing, -0.2px);
    font-size: var(--sm-c-app-header-property-menu-font-size, 15px);

    /* Focus State */
    &:focus {
      outline: none;
      box-shadow: none; // Remove global outline styles
      .sm-property-menu__content {
        border-radius: inherit;
        box-shadow: 0 0 0 var(--sm-c-app-header-menu-color-outline-width-focus, 2px) var(--sm-c-app-header-menu-color-outline-focus, var(--color-focus, $grey-neu-black));
      }
    }
  }

  &__button-spacer {
    border: 1px solid transparent;
    font-family: inherit;
    padding: 0;
    letter-spacing: var(--sm-c-app-header-property-menu-letter-spacing, -0.2px);
    font-size: var(--sm-c-app-header-property-menu-font-size, 15px);
    visibility: hidden;
  }

  &__indicator {
    display: inline-block;
    position: relative;
    margin-left: var(--sm-c-app-header-property-menu-indicator-margin-left, 1em);
    transform: translateY(1px);
    transform-origin: center center;
    transition: transform 0.3s ease;
  }

  &__indicator .sm-icon {
    transition: transform 0.3s ease;
    font-size: var(--sm-c-app-header-property-menu-icon-size, 16px);
  }

  &__items {
    background: var(--sm-c-app-header-vertical-nav-color-background, var(--color-pure-white, $true-white));
    display: none;
    position: absolute;
    top: var(--sm-c-app-header-property-menu-items-top, 100%);
    left: 0;
    width: 100%;
    box-shadow: 0 3px 17px -8px rgba(24, 58, 108, 0.19), 0 12px 11px -13px rgba(24, 58, 108, 0.18), 0 10px 24px -9px rgba(24, 58, 108, 0.12);
    border-bottom-left-radius: var(--sm-c-app-header-vertical-nav-border-radius, 4px);
    border-bottom-right-radius: var(--sm-c-app-header-vertical-nav-border-radius, 4px);
    border: 1px solid var(--sm-c-app-header-vertical-nav-color-border, $sm-property-menu--border-color);
    overflow: hidden;
    z-index: $sm-property-menu-z-index;
    margin-top: -1px; // Fix for Firefox
  }

  & &__items--overflow {
    overflow: visible;

    > .sm-vertical-nav > .sm-vertical-nav-item:last-of-type {
      &:not(.sm-vertical-nav-item--has-children) {
        border-bottom-left-radius: var(--sm-c-app-header-vertical-nav-border-radius, 4px);
        border-bottom-right-radius: var(--sm-c-app-header-vertical-nav-border-radius, 4px);

        > .sm-vertical-nav-item__container {
          border-bottom-left-radius: var(--sm-c-app-header-vertical-nav-border-radius, 4px);
          border-bottom-right-radius: var(--sm-c-app-header-vertical-nav-border-radius, 4px);
          overflow: hidden;
        }

      }
    }
  }

  /* Vertical Nav & Nav Item */
  .sm-vertical-nav-item {
    color: $sm-property-menu-item--text-color;
    background: $sm-property-menu-item--background-color;
    border-top: $sm-property-menu-item--border-color 1px solid;

    &:first-child {
      border-top: none;
    }
  }

  &__button-tablet:focus {
    background: $sm-property-menu--focus--background-color;
    color: $sm-property-menu--focus--text-color;
    box-shadow: 0 0 0 var(--sm-c-app-header-menu-color-outline-width-focus, 2px) var(--sm-c-app-header-menu-color-outline-focus, var(--color-focus, $grey-neu-black));
  }

  &__content {
    display: flex;
    white-space: nowrap;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 14px $sm-16;

    &:focus {
      box-shadow: none;
      outline: none;
    }
  }

  /* Hover State */
  &:hover &__button,
  &:hover &__button-tablet {
    outline: none;
  }

  &__button-tablet:hover {
    background: $sm-property-menu--hover--background-color;
    color: $sm-property-menu--hover--text-color;
  }

  /* Open State */
  &--open &__button {
    min-width: 200px;
    text-align: left;
    background: $sm-property-menu--open--background-color;
    color: $sm-property-menu--open--text-color;
    border-color: $sm-property-menu--open--border-color;
    border-radius: var(--sm-c-app-header-vertical-nav-border-radius, 4px) var(--sm-c-app-header-vertical-nav-border-radius, 4px) 0 0;
  }

  &--open {
    .sm-property-menu__container {
      position: absolute;
      right: 0;
      top: var(--sm-c-app-header-property-menu-top, 0);
    }

    .sm-property-menu__display-label {
      font-weight: 600;
    }
  }

  &:not(&--open) &__button {
    color: $sm-property-menu--text-color;

    &:hover {
      background: $sm-property-menu--hover--background-color;
      color: $sm-property-menu--hover--text-color;

      .sm-property-menu__content {
        background: $sm-property-menu--hover--background-color;
        color: $sm-property-menu--hover--text-color;
      }
    }

    &:focus {
      background: $sm-property-menu--focus--background-color;
      color: $sm-property-menu--focus--text-color;

      .sm-property-menu__content {
        background: $sm-property-menu--focus--background-color;
        color: $sm-property-menu--focus--text-color;
      }
    }
  }

  &--open &__indicator .sm-icon {
    transform: rotate(-180deg);
  }

  &--open &__items {
    display: block;
  }

  &--open &__button::after {
    display: none;
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
