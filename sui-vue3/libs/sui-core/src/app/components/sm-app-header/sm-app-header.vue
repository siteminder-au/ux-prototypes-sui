<script setup lang="ts">
import { computed } from 'vue'
import { useUniqueId } from '../use/unique-id'
import { useI18n } from '../../libs/vue-i18n'
import iconActionMenu from './icons/action-menu'

const props = withDefaults(defineProps<{
  /**
   * Hide logo for small screens (<=1024)
   */
  hideLogoTablet?: boolean
  /**
   * Whether to display the tablet navigation bar for small screens (<=1024)
   */
  isTablet?: boolean
  /**
   * Header logo src for large screens (>1024)
   */
  logo?: string
  /**
   * Header logo href link
   */
  logoLink?: string
  /**
   * Set the height props to specifies the height of an image, in pixels. Default is '40'
   */
  logoHeight?: string
  /**
   * Set the width props to specifies the width of an image, in pixels. Default is '40'
   */
  logoWidth?: string
  /**
   * Set the height props to specifies the height of an image for small screens (<=1024), in pixels. Default is '40'
   */
  logoHeightTablet?: string
  /**
   * Set the width props to specifies the width of an image for small screens (<=1024), in pixels. Default is '40'
   */
  logoWidthTablet?: string
  /**
   * Header logo src for small screens (<=1024). Use when compact version of a logo is needed on smaller screens.
   * If not set, the logo prop will be used.
   */
  logoTablet?: string
  /**
   * Whether the left navigation bar is visible
   */
  navVisible?: boolean
  /**
   * Whether the page title is visible
   */
  pageTitle?: string
  /**
   * Whether the page subtitle is visible
   */
  pageSubtitle?: string
  /**
   * Header logo alt text
   */
  partnerName?: string
  /**
   * A custom class to apply on the header to override child elements styles
   */
  rootClass?: string
  /**
   * The target props specifies where to open the Home icon and title link.
   */
  target?: string
  /**
   * title link
   */
  titleLink?: string
}>(), {
  hideLogoTablet: false,
  isTablet: false,
  logo: '',
  logoLink: '',
  logoHeight: '40',
  logoWidth: '40',
  logoHeightTablet: '40',
  logoWidthTablet: '40',
  logoTablet: '',
  navVisible: false,
  pageTitle: '',
  pageSubtitle: '',
  partnerName: '',
  rootClass: '',
  target: '_blank',
  titleLink: '',
})

const emit = defineEmits<{
  click: [e: Event]
  /**
   * Emitted when app header's visibility is updated with the payload
   * see: https://v3-migration.vuejs.org/breaking-changes/v-model.html#_2-x-syntax
   */
  'update:visible': [value: boolean]
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
  // For Vue3: We explicitly set this to false so we can prevent fallthrough attributes and listeners
  // to be automatically attached at the root node of this component template.
  // For example, onClick handler being attached at the root node will mean anywhere we click in the header
  // the onClick handler will trigger which is probably not wanted.
  inheritAttrs: false,
})

const { i18n } = useI18n()

const isCollapsed = computed<boolean>({
  get: () => props.navVisible,
  set: state => emit('update:visible', state),
})
const { id: a11yContentElementId } = useUniqueId('sm-app-header__content_')

const toggleHiddenA11yLabel = computed(() => {
  return isCollapsed.value
    ? i18n.t('sui-core.components.sm-app-header.sm-app-header.a11y__toggle-hide-menu')
    : i18n.t('sui-core.components.sm-app-header.sm-app-header.a11y__toggle-show-menu')
})

defineExpose({
  a11yContentElementId,
  toggleHiddenA11yLabel,
  isCollapsed,
})
</script>

<template>
  <header
    class="sm-app-header"
    :class="[{ 'sm-app-header--tablet-navigation': isTablet }, rootClass]"
  >
    <div class="sm-app-header__top-bar">
      <button
        v-if="isTablet"
        type="button"
        class="sm-app-header__toggle"
        :aria-expanded="!isCollapsed"
        :aria-controls="a11yContentElementId || undefined"
        :aria-label="toggleHiddenA11yLabel"
        :title="toggleHiddenA11yLabel"
        @click="(e) => $emit('click', e)"
      >
        <span
          class="sm-app-header__toggle-content"
          tabindex="-1"
        >
          <span class="sm-app-header__icon sm-icon sm-icon--action-menu">
            <svg
              version="1.1"
              :viewBox="iconActionMenu.viewBox"
              :style="{ width: '1em', height: '1em' }"
              focusable="false"
              :aria-hidden="true"
              role="img"
              v-html="iconActionMenu.path"
            ></svg>
          </span>
        </span>
      </button>

      <figure
        v-if="logoTablet"
        class="sm-app-header__logo sm-app-header__logo--tablet"
        :class="{ 'sm-app-header__logo--hide-on-tablet': hideLogoTablet }"
        :aria-label="partnerName"
      >
        <a
          :href="logoLink"
          :target="target"
        >
          <span
            class="sm-app-header__logo-content"
            tabindex="-1"
          >
            <img
              :src="logoTablet"
              :alt="partnerName"
              :height="logoHeightTablet"
              :width="logoWidthTablet"
            >
          </span>
        </a>
      </figure>
      <figure
        v-if="logo"
        class="sm-app-header__logo"
        :class="{ 'sm-app-header__logo--hide-on-tablet': hideLogoTablet }"
        :aria-label="partnerName"
      >
        <a
          :href="logoLink"
          :target="target"
        >
          <span
            class="sm-app-header__logo-content"
            tabindex="-1"
          >
            <img
              :src="logo"
              :alt="partnerName"
              :height="logoHeight"
              :width="logoWidth"
            >
          </span>
        </a>
      </figure>
      <component
        :is="titleLink ? 'a' : 'div'"
        class="sm-app-header__page-title"
        :target="titleLink ? target : null"
        :href="titleLink ? titleLink : null"
        :class="{
          'sm-app-header__page-title--link': titleLink,
        }"
      >
        <span
          tabindex="-1"
          class="sm-app-header__page-title-content"
        >
          {{ pageTitle }}
          <span
            v-if="pageSubtitle"
            class="sm-app-header__page-subtitle"
          >
            {{ pageSubtitle }}
          </span>
        </span>
      </component>

      <div class="sm-app-header__top-right">
        <!-- Header for larger screen > 1024 -->
        <div
          v-if="$slots['smart-guide']"
          class="sm-app-header__menu sm-app-header__smart-guide"
        >
          <slot name="smart-guide" />
        </div>

        <div class="sm-app-header__menu sm-app-header__property-menu">
          <!-- @slot A space to the left of the header for the sm-property-menu component -->
          <slot name="property-menu" />
        </div>
        <!-- @slot A space to the right of the header for the sm-user-menu component, app switcher section -->
        <span
          v-if="$slots['app-switcher']"
          class="sm-app-header__app-switcher sm-app-header__menu"
        >
          <slot name="app-switcher" />
        </span>
        <!-- @slot A space to the right of the header for the help icon -->
        <span
          v-if="$slots['help']"
          class="sm-app-header__help sm-app-header__menu"
        >
          <slot name="help" />
        </span>
        <!-- @slot A space to the right of the header for the sm-user-menu component, notification section -->
        <span
          v-if="$slots['notification']"
          class="sm-app-header__menu sm-app-header__notification"
        >
          <slot name="notification" />
        </span>

        <!-- @slot A space to the right of the header for the sm-user-menu component -->
        <span class="sm-app-header__menu sm-app-header__user-menu">
          <slot name="user-menu" />
        </span>
      </div>
      <!-- Header for smaller screen size < 1024 -->
    </div>
    <div class="sm-app-header__nav-left">
      <!-- @slot A space to the left navigation header bar for small screen -->
      <slot name="tablet-navigation" />
    </div>
    <nav
      v-if="$slots.nav"
      class="sm-app-header__bottom-bar"
    >
      <!-- @slot A space below the header for the sm-horizontal-nav component -->
      <slot name="nav" />
    </nav>
  </header>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-app-header--border-color: #d9dee7; // not mapped to a color token
$sm-app-header--notification--border-color: $light-blue-grey;
$sm-app-header--notification--background-color: $blue-neu-med;
$sm-user-list-item--background-color: $blue-neu-light;

// White-labelling tokens > theming tokens
// But we're breaking that format in the app-header background-color here since the theming token can be a gradient
$sm-app-header--background-color: var(--sm-c-app-header-top-bar-color-background, linear-gradient(-225deg, var(--secondary-background, #006ade) 0%, var(--secondary-background, #0058b8) 100%));
$sm-app-header--logo--hover--background-color: var(--tertiary-background, var(--sm-c-app-header-menu-color-background-hover, $primary-blue-highlight));
$sm-app-header--logo--focus--background-color: var(--tertiary-background, var(--sm-c-app-header-menu-color-background-focus, $primary-blue-highlight));
$sm-app-header--page-title-color: var(--secondary-foreground, var(--sm-c-app-header-page-title-color-text, var(--color-pure-white, $true-white)));
$sm-app-header--page-subtitle-color: var(--secondary-foreground, var(--sm-c-app-header-page-subtitle-color-text, var(--color-pure-white, $true-white)));
$sm-app-header--page-subtitle-color-border-left: var(--secondary-foreground, var(--sm-c-app-header-page-subtitle-color-border-left, var(--color-pure-white, $true-white)));

.sm-app-header {
  border-bottom: var(--sm-c-app-header-color-border, $sm-app-header--border-color) var(--sm-c-app-header-border-width, 1px) solid;

  &__page-title {
    display: flex;
    align-items: center;
    color: $sm-app-header--page-title-color;
    font-size: var(--sm-c-app-header-page-title-font-size, 18px);
    line-height: var(--sm-c-app-header-page-title-line-height, 24px);
    letter-spacing: var(--sm-c-app-header-page-title-letter-spacing, -0.5px);
    padding-left: var(--sm-c-app-header-page-title-padding-left, 0.5em);

    &--link {
      &:hover, &:focus {
        color: $sm-app-header--page-title-color;
      }

      /* Focus State */
      &:focus {
        outline: none;
        box-shadow: none;

        .sm-app-header__page-title-content {
          border-radius: inherit;
          box-shadow: 0 0 0 2px $grey-neu-black;
        }
      }
    }
  }

  &__page-title-content:focus {
    outline: none;
    box-shadow: none;
  }

  &__page-subtitle {
    border-left: var(--sm-c-app-header-page-subtitle-border-left-width, 1px) solid $sm-app-header--page-subtitle-color-border-left;
    color: $sm-app-header--page-subtitle-color;
    font-size: var(--sm-c-app-header-page-subtitle-font-size, 16px);
    line-height: var(--sm-c-app-header-page-subtitle-line-height, 20px);
    letter-spacing: var(--sm-c-app-header-page-subtitle-letter-spacing, -0.5px);
    padding-left: var(--sm-c-app-header-page-subtitle-padding-left, 0.5em);
    margin-left: var(--sm-c-app-header-page-subtitle-margin-left, 0.5em);
  }

  &--tablet-navigation {
    .sm-app-header__page-title {
      display: none;

      @media #{$large-desktop} {
        display: flex;
      }
    }

    .sm-app-header__nav-left {
      display: flex;
      width: 100%;

      @media #{$large-desktop} {
        display: none;
      }

      img {
        display: block;
      }
    }

    .sm-app-header__bottom-bar {
      display: none;

      @media #{$large-desktop} {
        display: block;
      }
    }

    .sm-app-header__smart-guide {
      display: none;

      @media #{$large-desktop} {
        display: flex;
      }
    }
  }

  &__toggle {
    border: 0;
    background: var(--sm-c-app-header-menu-color-background, transparent);
    padding: 0;
    display: block;
    cursor: pointer;
    margin: var(--sm-c-app-header-toggle-margin, auto 4px);
    height: auto;
    border-radius: var(--sm-c-app-header-menu-border-radius, var(--border-radius-sm, 4px));

    @media #{$large-desktop} {
      display: none;
    }

    .sm-app-header__icon {
      top: 0;
      font-size: var(--sm-c-app-header-toggle-icon-size, 24px);
      color: var(--secondary-foreground, var(--sm-c-app-header-menu-color-text, var(--color-pure-white, $true-white)));
      display: inline-block;
      position: relative;
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

    &:hover {
      background: $sm-app-header--logo--hover--background-color;

      .sm-icon {
        color: var(--tertiary-foreground, var(--sm-c-app-header-menu-color-text-hover, var(--color-pure-white, $true-white)));
      }
    }

    &:focus {
      outline: none;
      box-shadow: none; // Remove global outline styles

      .sm-app-header__toggle-content {
        background: $sm-app-header--logo--focus--background-color;
        border-radius: inherit;
        box-shadow: 0 0 0 var(--sm-c-app-header-menu-color-outline-width-focus, 2px) var(--sm-c-app-header-menu-color-outline-focus, var(--color-focus, $grey-neu-black));
      }

      .sm-icon {
        color: var(--tertiary-foreground, var(--sm-c-app-header-menu-color-text-focus, var(--color-pure-white, $true-white)));
      }
    }
  }

  &__toggle-content {
    display: block;
    padding: var(--sm-c-app-header-toggle-padding, $sm-12);
    position: relative;

    &:focus {
      box-shadow: none;
      outline: none;
    }
  }

  &__bottom-bar {
    display: block;
  }

  &__top-bar {
    min-height: var(--sm-c-app-header-top-bar-min-height, 56px);
    display: flex;
    padding: var(--sm-c-app-header-top-bar-padding-y, 0) var(--sm-c-app-header-top-bar-padding-x, $sm-4);
    background: $sm-app-header--background-color;
    position: relative;
  }

  &__menu {
    position: relative;
    margin-right: $sm-4;
  }

  &__smart-guide {
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: var(--sm-c-app-header-link-smart-guide-margin-right, $sm-4);
  }

  &__property-menu {
    margin-top: var(--sm-c-app-header-property-menu-top, 0);
  }

  &__top-right {
    margin: auto 0 auto auto;
    position: relative;
    display: flex;
    align-items: center;
  }

  &__logo {
    display: block;
    margin: var(--sm-c-app-header-logo-margin, auto 0);
    height: auto;

    a {
      display: inline-block;
      margin-bottom: -4px;
      padding: 0;
      line-height: 1;
      border-radius: var(--sm-c-app-header-menu-border-radius, var(--border-radius-sm, 4px));
      position: relative;
    }

    img {
      display: block;
    }

    /* Hover State */
    a:hover {
      background: $sm-app-header--logo--hover--background-color;
    }

    /* Focus State */
    a:focus {
      outline: none;
      box-shadow: none; // Remove global outline styles

      .sm-app-header__logo-content {
        background: $sm-app-header--logo--focus--background-color;
        border-radius: inherit;
        box-shadow: 0 0 0 var(--sm-c-app-header-menu-color-outline-width-focus, 2px) var(--sm-c-app-header-menu-color-outline-focus, var(--color-focus, $grey-neu-black));
      }
    }

    /* Responsive logo */
    &--tablet ~ & {
      display: none;

      @media #{$large-desktop} {
        display: block;
      }
    }

    &--tablet {
      display: block;

      @media #{$large-desktop} {
        display: none;
      }
    }

    &--hide-on-tablet {
      display: none;

      @media #{$large-desktop} {
        display: block;
      }
    }
  }

  &__logo-content {
    display: block;
    padding: var(--sm-c-app-header-logo-padding, $sm-4);

    &:focus {
      box-shadow: none;
      outline: none;
    }
  }

  &__aside {
    margin-left: auto;
  }

  .sm-user-list {
    .sm-user-list-item--clicked {
      background: $sm-user-list-item--background-color;
    }

    .sm-user-list-item {
      cursor: pointer;

      @include padding($left: rem($sm-sm));
      @include padding($top: rem($sm-sm));

      border-bottom: 1px solid $sm-app-header--notification--border-color;

      & {
        &::before {
          top: 25px;
        }
      }

      &:hover,
      &:focus {
        background-color: $sm-app-header--notification--background-color;
      }
    }
  }
}
</style>
