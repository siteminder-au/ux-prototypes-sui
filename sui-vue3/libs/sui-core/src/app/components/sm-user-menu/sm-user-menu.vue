<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useUniqueId } from '../use/unique-id'
import { useI18n } from '../../libs/vue-i18n'

withDefaults(defineProps<{
  /**
   * CSS classes which will be applied to the root element
   */
  contentClass?: string
  /**
   * A URL which will be displayed as the user icon
   */
  displayImageUrl?: string
  /**
   * The user's display name
   */
  displayName?: string
  /**
   * Arbitrary attributes which will be attached to the display name element. Use this to aid testing or to mask PII data.
   */
  displayNameAttrs?: Record<string, unknown> | null
  /**
   * The min-width of the open container
   */
  minWidth?: string
}>(), {
  contentClass: '',
  displayImageUrl: '',
  displayName: '',
  displayNameAttrs: null,
  minWidth: '',
})

const emit = defineEmits<{
  /**
   * Emits when the user menu is opened
   */
  open: []
  /**
   * Emits when the user menu is closed
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

const rootElementRef: Ref<HTMLElement | null> = ref(null)

const contentElementRef: Ref<HTMLElement | null> = ref(null)

const buttonElementRef: Ref<HTMLElement | null> = ref(null)

const isOpen = ref(false)

const close = (): void => {
  isOpen.value = false
  emit('close')
}

const open = (): void => {
  isOpen.value = true
  emit('open')
}

const toggle = (): void => {
  return isOpen.value ? close() : open()
}

const itemsToggleA11yLabel = computed(() => {
  return isOpen.value
    ? i18n.t('sui-core.components.sm-user-menu.sm-user-menu.a11y__children-toggle-hide')
    : i18n.t('sui-core.components.sm-user-menu.sm-user-menu.a11y__children-toggle-show')

})

const { id: itemsElementId } = useUniqueId('sm-user-menu__items_')

onClickOutside(rootElementRef, close)

defineExpose({
  isOpen,
  open,
  close,
  toggle,
  itemsToggleA11yLabel,
  itemsElementId,
  contentElementRef,
  buttonElementRef,
})
</script>

<template>
  <span
    ref="rootElementRef"
    class="sm-user-menu"
    :class="[{ 'sm-user-menu--open': isOpen }, contentClass ]"
  >
    <button
      v-if="isOpen"
      class="sm-user-menu__button-spacer"
      role="none"
      :aria-hidden="true"
    >
      <span class="sm-user-menu__content">
        <figure class="sm-user-menu__display-image">
          <img
            v-if="displayImageUrl"
            :src="displayImageUrl"
            :alt="displayName"
          >
          <span v-if="$slots.icon">
            <slot name="icon" />
          </span>
          <sm-icon
            v-else
            name="action-user"
            :aria-hidden="true"
          />
        </figure>
        <span
          v-if="$slots.label"
          class="sm-user-menu__display-label"
        >
          <slot name="label" />
        </span>
      </span>
    </button>

    <div
      class="sm-user-menu__container"
      :style="isOpen ? { 'min-width' : minWidth } : ''"
    >

      <button
        ref="buttonElementRef"
        type="button"
        class="sm-user-menu__button"
        :aria-expanded="isOpen"
        :aria-controls="itemsElementId || undefined"
        :aria-label="itemsToggleA11yLabel"
        :title="displayName"
        @click="toggle"
      >
        <span
          class="sm-user-menu__content"
          tabindex="-1"
        >
          <span
            class="sm-user-menu__display-name"
            :class="{ 'sm-user-menu__display-name--fullwidth': !$slots['display-name'] }"
            v-bind="displayNameAttrs"
            :style="isOpen && !$slots['display-name'] ? { 'min-width' : minWidth } : ''"
          >
            {{ displayName }}
          </span>
          <span class="sm-user-menu__display-content">
            <!-- @slot The display name here -->
            <slot name="display-name" />
          </span>

          <figure class="sm-user-menu__display-image">
            <img
              v-if="displayImageUrl"
              :src="displayImageUrl"
              :alt="displayName"
            >
            <span v-if="$slots.icon">
              <!-- @slot The icon here -->
              <slot name="icon" />
            </span>
            <sm-icon
              v-else
              name="action-user"
              :aria-hidden="true"
            />
          </figure>
          <span
            v-if="$slots.label"
            class="sm-user-menu__display-label"
          >
            <!-- @slot The label here -->
            <slot name="label" />
          </span>
        </span>
      </button>

      <div
        v-if="isOpen"
        :id="itemsElementId || undefined"
        ref="contentElementRef"
        class="sm-user-menu__items"
      >
        <!-- @slot The default slot here -->
        <slot />
      </div>
    </div>

  </span>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-user-menu--display-name--text-color: var(--sm-c-app-header-user-menu-display-name-color-text, var(--color-disabled-dark, $grey-neu-dark));
$sm-user-menu--display-image--border-color: var(--color-pure-white, $true-white);
$sm-user-menu--hover--background-color: var(--tertiary-background, var(--sm-c-app-header-menu-color-background-hover, $primary-blue-highlight));
$sm-user-menu--focus--background-color: var(--tertiary-background, var(--sm-c-app-header-menu-color-background-focus, $primary-blue-highlight));
$sm-user-menu--open--text-color: var(--sm-c-app-header-vertical-nav-button-color-border-open, var(--color-black, $grey-neu-black));
$sm-user-menu--open--background-color: var(--sm-c-app-header-vertical-nav-button-color-background-open, var(--color-pure-white, $true-white));
$sm-user-menu--open--border-color: var(--sm-c-app-header-vertical-nav-button-color-border-open, #d9dee7); // not mapped to a color token
$sm-user-menu--border-color: var(--sm-c-app-header-vertical-nav-color-border, #d9dee7);
$sm-user-menu--icon-color: var(--color-pure-white, $true-white);
$sm-user-menu-item--text-color: var(--color-black, $grey-neu-black);
$sm-user-menu-item--background-color: var(--color-pure-white, $true-white);
$sm-user-menu-item--border-color: var(--sm-c-app-header-vertical-nav-item-color-border, #d9dee7);
$sm-user-menu--display-text--color: $primary-blue;

.sm-user-menu {
  position: relative;
  padding: var(--sm-c-app-header-menu-padding, $sm-4 0);
  display: inline-block;

  &__button {
    display: flex;
    background: var(--sm-c-app-header-menu-color-background, transparent);
    border: 1px solid var(--sm-c-app-header-menu-color-border, transparent);
    border-radius: var(--sm-c-app-header-menu-border-radius, 4px);
    font-size: 15px;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
    position: relative;
    font-family: inherit;
    letter-spacing: -0.2px;

    /* Focus State */
    &:focus {
      outline: none;
      box-shadow: none; // Remove global outline styles

      .sm-user-menu__display-image .sm-icon {
        color: var(--tertiary-foreground, var(--sm-c-app-header-menu-color-text-focus, var(--color-pure-white, $true-white)));
      }

      .sm-user-menu__content .sm-user-menu__display-label {
        color: var(--tertiary-foreground, var(--sm-c-app-header-menu-color-text-focus, var(--color-pure-white, $true-white)));
      }

      .sm-user-menu__content {
        border-radius: inherit;
        box-shadow: 0 0 0 var(--sm-c-app-header-menu-color-outline-width-focus, 2px) var(--sm-c-app-header-menu-color-outline-focus, var(--color-focus, $grey-neu-black));
      }
    }
  }

  &__button-spacer {
    display: flex;
    border: 1px solid transparent;
    font-size: 15px;
    padding: 0;
    font-family: inherit;
    letter-spacing: -0.2px;
    visibility: hidden;
  }

  &__display-image {
    margin: auto 0;
    padding: 0;
    display: inline-block;
    line-height: 1;
    width: $sm-20;
    height: $sm-20;
    position: relative;

    .sm-icon {
      font-size: var(--sm-c-app-header-menu-icon-size, 24px);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--secondary-foreground, var(--sm-c-app-header-menu-color-text, $sm-user-menu--icon-color));
    }

    img {
      display: inline-block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid $sm-user-menu--display-image--border-color;
    }

  }

  &__display-name {
    display: none;
    opacity: 0;
    padding: $sm-4 1em 3px $sm-4;
    margin-right: auto;
    font-size: var(--sm-c-app-header-user-menu-display-name-font-size, 12px);
    color: $sm-user-menu--display-name--text-color;
    text-transform: uppercase;
    font-weight: var(--sm-c-app-header-user-menu-display-name-font-weight, 600);
    transition: opacity 1s;
    text-align: left;

    &--fullwidth {
      width: 225px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  &__display-content {
    display: none;
    opacity: 0;
    margin-left: auto;
    transition: opacity 1s;
    margin-right: -22px;
    line-height: 20px;
    font-weight: 400;
    color: $sm-user-menu--display-text--color;
  }

  &__display-label {
    font-weight: 400;
    margin-left: $sm-8;
    color: var(--secondary-foreground, var(--sm-c-app-header-menu-color-text, $sm-user-menu--icon-color));
    white-space: nowrap;
    max-width: 190px;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 22px;
  }

  &__items {
    display: none;
    position: absolute;
    top: var(--sm-c-app-header-user-menu-items-top, 100%);
    left: 0;
    width: 100%;
    box-shadow:
      0 3px 17px -8px rgba(24, 58, 108, 0.19),
      0 12px 11px -13px rgba(24, 58, 108, 0.18),
      0 10px 24px -9px rgba(24, 58, 108, 0.12);
    border-bottom-left-radius: var(--sm-c-app-header-vertical-nav-border-radius, 4px);
    border-bottom-right-radius: var(--sm-c-app-header-vertical-nav-border-radius, 4px);
    border: 1px solid $sm-user-menu--border-color;
    overflow: hidden;
    transform: translateY(-1px);
    box-sizing: border-box;
    background: var(--sm-c-app-header-vertical-nav-color-background, var(--color-pure-white, $true-white));
  }

  /* Vertical Nav & Nav Item */
  .sm-vertical-nav-item {
    color: $sm-user-menu-item--text-color;
    background: $sm-user-menu-item--background-color;
    border-top: $sm-user-menu-item--border-color 1px solid;

    &:first-child {
      border-top: none;
    }
  }

  &__content {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: $sm-12;

    &:focus {
      box-shadow: none;
      outline: none;
    }
  }

  /* Hover State */
  &__button:hover {
    background: $sm-user-menu--hover--background-color;

    .sm-user-menu__display-image .sm-icon {
      color: var(--tertiary-foreground, var(--sm-c-app-header-menu-color-text-hover, var(--color-pure-white, $true-white)));
    }

    .sm-user-menu__content .sm-user-menu__display-label {
      color: var(--tertiary-foreground, var(--sm-c-app-header-menu-color-text-hover, var(--color-pure-white, $true-white)));
    }
  }

  /* Open State */
  &--open {
    .sm-user-menu__container {
      min-width: 225px;
      z-index: $sm-user-menu-open-z-index;
      position: absolute;
      right: 0;
      top: $sm-4;
    }
  }

  &--open &__button {
    width: 100%;
    background: $sm-user-menu--open--background-color;
    color: $sm-user-menu--open--text-color;
    font-weight: 600;
    border-radius: var(--sm-c-app-header-vertical-nav-border-radius, 4px) var(--sm-c-app-header-vertical-nav-border-radius, 4px) 0 0;
    border-color: $sm-user-menu--open--border-color;

    .sm-user-menu__display-label {
      // We set display none to prevent it from taking up space when the button is clicked
      display: none;
    }

    .sm-user-menu__display-image {
      visibility: hidden;
    }
  }

  &--open &__button::after { // The outline
    display: none;
  }

  &:not(&--open) &__button:focus {
    .sm-user-menu__content {
      background: $sm-user-menu--focus--background-color;
    }

    .sm-user-menu__display-label,
    .sm-icon {
      color: var(--tertiary-foreground, var(--sm-c-app-header-menu-color-text-focus, var(--color-pure-white, $true-white)));
    }
  }

  &--open &__display-name {
    display: inline-block;
    opacity: 1;
  }

  &--open &__display-content {
    display: inline-block;
    opacity: 1;
    z-index: 1;
  }

  &--open &__items {
    display: block;
  }

  &:not(.sm-user-menu--open) {
    .sm-user-menu__button {
      &:hover {
        .sm-user-menu__display-label,
        .sm-icon {
          color: var(--tertiary-foreground, var(--sm-c-app-header-menu-color-text-hover, var(--color-pure-white, $true-white)));
        }
      }
    }
  }

}
</style>
