<script setup lang="ts">
import { computed } from 'vue'
import { useClickedState } from '../use/clicked-state'

const props = withDefaults(defineProps<{
  /**
   * A URL to navigate to. If provided this will override the `to` prop. Use this for external URLs outside of your application.
   */
  href?: string
  /**
   * Whether the link or button is a smart guide to style it accordingly
   */
  isSmartGuide?: boolean
  /**
   * The visible label for the smart-guide button
   */
  smartGuideLabel?: string
  /**
   * The target props specifies where to open the linked document
   */
  target?: string
  /**
   * A Vue-Router object or string specifying the URL to navigate to
   */
  to?: string | Record<string, unknown>
}>(), {
  href: undefined,
  isSmartGuide: false,
  smartGuideLabel: '',
  target: '_blank',
  to: undefined,
})

defineEmits<{
  click: []
}>()

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
  },
  // For Vue3: We explicitly set this to false so we can move the $attr binding
  // to an actual HTML element instead of the <router-link> component
  inheritAttrs: false,
})

const { isClicked, onMousedown } = useClickedState()

const isRouterLink = computed(() => props.to !== undefined)

defineExpose({
  isClicked,
  onMousedown,
})
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    v-if="!isRouterLink"
    class="sm-app-header-link__link sm-p"
    :class="{
      'sm-app-header-link__link--clicked': isClicked,
      'sm-app-header-link__link--smart-guide': isSmartGuide
    }"
    :href="href"
    :target="target"
    v-bind="$attrs"
    @click="$emit('click')"
    @mousedown="onMousedown"
  >
    <span
      class="sm-app-header-link__content"
      tabindex="-1"
    >
      <figure class="sm-app-header-link__display-image">
        <span
          v-if="$slots.icon"
          class="sm-app-header-link__icon"
        >
          <!-- @slot The icon slot -->
          <slot name="icon" />
        </span>
      </figure>
      <span
        v-if="isSmartGuide && smartGuideLabel"
        class="sm-app-header-link__smart-guide-label sm-p"
      >
        {{ smartGuideLabel }}
      </span>
    </span>
  </component>

  <router-link
    v-else
    v-slot="routerLink"
    :custom="true"
    :to="to || '#'"
  >
    <a
      class="sm-app-header-link__link sm-p"
      :class="{
        'sm-app-header-link__link--clicked': isClicked,
        'sm-app-header-link__link--smart-guide': isSmartGuide
      }"
      :href="routerLink.href ?? undefined"
      :target="target ?? undefined"
      v-bind="$attrs"
      @click="routerLink.navigate($event)"
      @mousedown="onMousedown"
    >
      <span
        class="sm-app-header-link__content"
        tabindex="-1"
      >
        <figure class="sm-app-header-link__display-image">
          <span
            v-if="$slots.icon"
            class="sm-app-header-link__icon"
          >
            <!-- @slot The icon slot -->
            <slot name="icon" />
          </span>
        </figure>
        <span
          v-if="isSmartGuide && smartGuideLabel"
          class="sm-app-header-link__smart-guide-label sm-p"
        >
          {{ smartGuideLabel }}
        </span>
      </span>
    </a>
  </router-link>
</template>

<style lang="scss">
@import "../../common/variables";

// White-labelling tokens > theming tokens
$sm-app-header-link--hover--background-color: var(--tertiary-background, var(--sm-c-app-header-menu-color-background-hover, $primary-blue-highlight));
$sm-app-header-link--focus--background-color: var(--tertiary-background, var(--sm-c-app-header-menu-color-background-focus, $primary-blue-highlight));
$sm-app-header-link--smart-guide--background-color: var(--tertiary-background, var(--sm-c-app-header-link-smart-guide-color-background, var(--color-pure-white, $true-white)));
$sm-app-header-link--smart-guide--text-color: var(--tertiary-foreground, var(--sm-c-app-header-link-smart-guide-color-text, var(--color-black, $grey-neu-black)));
$sm-app-header-link--smart-guide--hover--background-color: var(--primary-foreground, var(--sm-c-app-header-link-smart-guide-color-background-hover, var(--color-app-mid, $blue-neu-med)));
$sm-app-header-link--smart-guide--hover--text-color: var(--tertiary-foreground, var(--sm-c-app-header-link-smart-guide-color-text-hover, var(--color-black, $grey-neu-black)));
$sm-app-header-link--smart-guide--focus--background-color: var(--primary-foreground, var(--sm-c-app-header-link-smart-guide-color-background-focus, var(--color-app-mid, $blue-neu-med)));
$sm-app-header-link--smart-guide--focus--text-color: var(--tertiary-foreground, var(--sm-c-app-header-link-smart-guide-color-text-focus, var(--color-black, $grey-neu-black)));
$sm-app-header-link--smart-guide--clicked--background-color: var(--sm-c-app-header-link-smart-guide-color-background-clicked, var(--color-app, $blue-neu-mid));
$sm-app-header-link--smart-guide--clicked--text-color: var(--sm-c-app-header-link-smart-guide-color-text-clicked, var(--color-black, $grey-neu-black));

.sm-app-header-link {
  &__link {
    display: flex;
    background: var(--sm-c-app-header-menu-color-background, transparent);
    border: 1px solid var(--sm-c-app-header-menu-color-border, transparent);
    border-radius: var(--sm-c-app-header-menu-border-radius, var(--border-radius-sm, 4px));
    padding: 0;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
    position: relative;
    font-family: inherit;
    margin: var(--sm-c-app-header-link-margin, 4px 0);

    /* Focus State */
    &:focus {
      outline: none;
      box-shadow: none; // Remove global outline styles

      .sm-icon {
        color: var(--tertiary-foreground, var(--sm-c-app-header-menu-color-text-focus, var(--color-pure-white, $true-white)));
      }

      .sm-app-header-link__content {
        background: $sm-app-header-link--focus--background-color;
        border-radius: inherit;
        box-shadow: 0 0 0 var(--sm-c-app-header-menu-color-outline-width-focus, 2px) var(--sm-c-app-header-menu-color-outline-focus, var(--color-focus, $grey-neu-black));
      }
    }
  }

  &__content {
    display: flex;
    height: 100%;
    width: 100%;
    padding: $sm-12;

    &:focus {
      box-shadow: none;
      outline: none;
    }
  }

  /* Hover State */
  &__link:hover {
    background: $sm-app-header-link--hover--background-color;

    .sm-icon {
      color: var(--tertiary-foreground, var(--sm-c-app-header-menu-color-text-hover, var(--color-pure-white, $true-white)));
    }
  }

  &__display-image {
    margin: auto 0;
    padding: 0;
    display: inline-block;
    line-height: 1;
    width: 20px;
    height: 20px;
    position: relative;
  }

  &__icon .sm-icon {
    font-size: var(--sm-c-app-header-menu-icon-size, 24px);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--secondary-foreground, var(--sm-c-app-header-menu-color-text, var(--color-pure-white, $true-white)));
  }

  &__link &__smart-guide-label {
    font-size: var(--sm-c-app-header-link-smart-guide-font-size, 15px);
  }

  &__display-image + &__smart-guide-label {
    margin-left: 6px;
  }

  &__link--smart-guide {
    background: $sm-app-header-link--smart-guide--background-color;
    border-color: var(--sm-c-app-header-link-smart-guide-color-border, transparent);
    color: $sm-app-header-link--smart-guide--text-color;
    border-radius: var(--sm-c-app-header-link-smart-guide-border-radius, var(--border-radius-sm, 4px));

    .sm-app-header-link__content {
      padding: 6px 14px;
    }

    .sm-app-header-link__icon .sm-icon {
      font-size: var(--sm-c-app-header-link-smart-guide-icon-size, 16px);
      color: var(--tertiary-foreground, var(--sm-c-app-header-link-smart-guide-color-text, var(--color-black, grey-neu-black)));
      transition: color 0.3s ease;
    }

    &:hover {
      background: $sm-app-header-link--smart-guide--hover--background-color;
      color: $sm-app-header-link--smart-guide--hover--text-color;

      .sm-app-header-link__icon .sm-icon {
        color: $sm-app-header-link--smart-guide--hover--text-color;
      }
    }

    &:focus {
      .sm-app-header-link__content {
        background: $sm-app-header-link--smart-guide--focus--background-color;
        color: $sm-app-header-link--smart-guide--focus--text-color;
      }

      .sm-app-header-link__icon .sm-icon {
        color: $sm-app-header-link--smart-guide--focus--text-color;
      }
    }

    &.sm-app-header-link__link--clicked {
      background: $sm-app-header-link--smart-guide--clicked--background-color;
      color: $sm-app-header-link--smart-guide--clicked--text-color;

      .sm-app-header-link__icon .sm-icon {
        color: $sm-app-header-link--smart-guide--clicked--text-color;
      }
    }
  }
}
</style>
