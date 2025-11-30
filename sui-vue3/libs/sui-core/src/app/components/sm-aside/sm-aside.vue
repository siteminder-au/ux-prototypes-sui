<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUniqueId } from '../use/unique-id'
import { useI18n } from '../../libs/vue-i18n'
import SmTooltip from '../sm-tooltip/sm-tooltip.vue'
import { SmTooltipPlacement, SmTooltipTrigger } from '../sm-tooltip/sm-tooltip.types'

withDefaults(defineProps<{
  /**
   * Whether the component can be collapsed by the user
   */
  isCollapsable?: boolean
  /**
  * CSS classes which will be applied to the root element
   */
  contentClass?: string
  /**
   * When "sticky" the component will fix itself to the top of the screen as soon as it reaches the top of the viewport
   */
  sticky?: boolean
  /**
   * The arrow color of the expand/collapse button
   */
  arrowColor?: string
  /**
   * CSS classes which will be applied to the footer element
   */
  footerClass?: string
  /**
   * Min height added to the root and inner elements to override. Default is '100vh'
   */
  minHeight?: string
}>(), {
  isCollapsable: true,
  contentClass: undefined,
  sticky: false,
  arrowColor: undefined,
  footerClass: undefined,
  minHeight: undefined,
})

const emit = defineEmits<{
  /**
   * Emitted when aside is opened
   */
  open: []
  /**
   * Emitted when aside is closed
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
    // `aria-hidden` attribute attached even if the value of it is false
    // in vue2, aria-hidden was removed if the value was false.
    ATTR_FALSE_VALUE: 'suppress-warning',
  },
})

const { i18n } = useI18n()

const isCollapsed = ref(false)
const isFocus = ref(false)
const toggleTooltip = ref<any | null>(null)
const toggleTooltipDisabled = ref<boolean>(false)

const open = () => {
  isCollapsed.value = false
  emit('open')
}

const close = () => {
  isCollapsed.value = true
  emit('close')
}

const toggle = () => {
  // Hide the tooltip when aside is animating
  if (toggleTooltip.value && typeof toggleTooltip.value.hide === 'function') {
    toggleTooltip.value.hide()
  }

  if (isCollapsed.value) {
    open()
  } else {
    close()
  }
}

const { id: a11yContentElementId } = useUniqueId('sm-aside__content_')

const toggleHiddenA11yLabel = computed(() => {
  return isCollapsed.value
    ? i18n.t('sui-core.components.sm-aside.sm-aside.a11y__toggle-show-menu')
    : i18n.t('sui-core.components.sm-aside.sm-aside.a11y__toggle-hide-menu')
})

const toggleTooltipTitle = computed(() => {
  return isCollapsed.value
    ? i18n.t('sui-core.components.sm-aside.sm-aside.toggle-tooltip-show-menu')
    : i18n.t('sui-core.components.sm-aside.sm-aside.toggle-tooltip-hide-menu')
})

onMounted(() => {
  /**
   * Disable the tooltip on touch devices so it doesn't appear when
   * "sticky hover" kicks in when tapping the toggle.
   * See https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
   */
  if (window && typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches) {
    toggleTooltipDisabled.value = true
  }
})

defineExpose({
  open,
  close,
  toggle,
  isCollapsed,
  toggleHiddenA11yLabel,
  a11yContentElementId,
  isFocus,
  toggleTooltip,
  toggleTooltipDisabled,
  toggleTooltipTitle,
})
</script>

<template>
  <aside
    class="sm-aside"
    :class="{
      'sm-aside--collapsed': isCollapsed && isCollapsable,
      'sm-aside--sticky': sticky,
      'sm-aside--has-footer': !!$slots.footer,
      contentClass
    }"
    :style="{ minHeight: minHeight }"
  >
    <div
      :id="a11yContentElementId ?? undefined"
      class="sm-aside__content"
      :class="{
        'sm-aside--has-focus': isFocus,
      }"
      :aria-hidden="isCollapsed"
      :style="{ minHeight: minHeight }"
      @focusin="isFocus = true"
      @focusout="isFocus = false"
      @mouseenter="isFocus = true"
      @mouseleave="isFocus = false"
    >
      <!-- @slot The content of the component -->
      <slot />

      <div
        v-if="!!$slots.footer"
        class="sm-aside__footer"
        :class="footerClass"
      >
        <!-- @slot The footer slot placed at the bottom of the component -->
        <slot name="footer" />
      </div>

      <div
        v-if="isCollapsable"
        class="sm-aside__toggle-wrapper"
      >
        <sm-tooltip
          ref="toggleTooltip"
          class="sm-aside__toggle-tooltip"
          :placement="SmTooltipPlacement.RIGHT"
          :trigger="SmTooltipTrigger.HOVER"
          :disabled="toggleTooltipDisabled"
          :title="toggleTooltipTitle"
        >
          <button
            type="button"
            class="sm-aside__toggle"
            :aria-expanded="!isCollapsed"
            :aria-controls="a11yContentElementId ?? undefined"
            :aria-label="toggleHiddenA11yLabel"
            @click="toggle"
          >
            <span
              class="sm-aside__toggle__icon"
              tabindex="-1"
            >
              <sm-icon
                name="sm-sidebar-arrow"
                :style="{ color : arrowColor}"
                aria-hidden="true"
              />
            </span>
          </button>
        </sm-tooltip>
      </div>
    </div>
  </aside>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-aside--text-color: $grey-neu-black;
$sm-aside--background-color: $blue-neu-light;
$sm-aside--toggle--icon-color: #007dbb;
$sm-aside--toggle--background-color: $true-white;
$sm-aside--toggle--hover--icon-color: $sm-aside--toggle--icon-color;
$sm-aside--toggle--hover--background-color: $blue-neu-med;
$sm-aside--toggle--has-focus--icon-color: $sm-aside--toggle--icon-color;
$sm-aside--toggle--has-focus--background-color: $blue-neu-med;
$sm-aside-z-index: $sm-aside-z-index;
$sm-aside--toggle--border-color: $light-blue-grey;
$sm-aside--footer--border-color: $light-blue-grey;

.sm-aside {
  color: $sm-aside--text-color;
  display: inline-block;
  transition: all 0.5s ease;
  z-index: $sm-aside-z-index;
  height: 100%;
  min-height: 100vh;

  &--sticky {
    position: sticky;
    top: 0;
    height: auto;
  }

  background: $sm-aside--background-color;

  &__toggle-wrapper {
    position: absolute;
    top: 16px;
    right: 0;
    padding: 0;
    transform: translateX(50%);
    z-index: $sm-aside-z-index;
  }

  &__toggle {
    visibility: hidden;
    transition: visibility 0.3s linear, opacity 0.3s linear;
    opacity: 0;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    background: $sm-aside--toggle--background-color;
    border: 1px solid $sm-aside--toggle--border-color;
    box-shadow: 0 1px 1px -1px rgba(24, 58, 108, 0.14), 0 3px 4px -2px rgba(24, 58, 108, 0.1), 0 3px 9px -2px rgba(24, 58, 108, 0.1);
    outline: none;
    padding-left: 6px;
    padding-right: 6px;
    cursor: pointer;

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.3s ease;

      &:focus {
        box-shadow: none;
        outline: 0;
      }

      .sm-icon {
        top: 0;
        font-size: 12px;
        color: $sm-aside--toggle--icon-color;
      }
    }
  }

  &__toggle-tooltip .sm-tooltip__content {
    max-width: 200px;
    width: max-content;
    word-break: break-word;
  }

  &__content {
    background: inherit;
    height: 100%;
    top: 0;
    padding-top: $sm-40;
    position: relative;
    transition: top 0.3s linear;
    min-height: 100vh;

    // The inner box shadow
    // using a :before element to prevent the box shadow from affecting the top of the component
    &::before {
      content: "";
      width: 15px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      background: linear-gradient(90deg, transparent, rgba(#000, 0.02), rgba(#000, 0.1));
      z-index: 10;
    }

    &:hover,
    &:focus {
      &::before {
        background: linear-gradient(90deg, transparent, rgba(0, 106, 221, 0.04), rgba(0, 87, 181, 0.2));
      }

      .sm-aside__toggle {
        visibility: visible;
        opacity: 1;
      }
    }

    /* The primary input mechanism of the device includes a pointing device of limited accuracy. */

    /* Primary input mechanism cannot hover
      at all or cannot conveniently hover
      (e.g., many mobile devices emulate hovering
      when the user performs an inconvenient long tap),
      or there is no primary pointing input mechanism */
    @media (pointer: coarse) and (hover: none) {
      .sm-aside__toggle {
        visibility: visible;
        opacity: 1;
      }
    }
  }

  &--has-footer {
    .sm-aside__content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .sm-aside__content > .sm-vertical-nav {
      z-index: 0;
    }
  }

  &--has-focus {
    &::before {
      background: linear-gradient(90deg, transparent, rgba(0, 106, 221, 0.04), rgba(0, 87, 181, 0.2));
    }

    .sm-aside__toggle {
      visibility: visible;
      opacity: 1;
    }
  }

  --sidebar-width: 208px;

  &__footer {
    background-color: $sm-aside--background-color;
    border-top: 1px solid $sm-aside--footer--border-color;
    bottom: 0;
    position: sticky;
  }

  &,
  &__content {
    width: var(--sidebar-width);
  }

  /* Collapsed State */
  &--collapsed {
    margin-left: calc(-1 * calc(var(--sidebar-width) - 24px));

    .sm-aside__toggle {
      visibility: visible;
      opacity: 1;
    }
  }

  &--collapsed &__content {
    box-sizing: border-box;
    padding-right: $sm-40;
  }

  &--collapsed {
    .sm-aside__toggle-wrapper {
      transform: translateX(50%);
    }

    .sm-aside__toggle__icon {
      transform: rotate(180deg);
    }
  }

  /* Hover State */
  &__toggle:hover {
    color: $sm-aside--toggle--hover--icon-color;
    background: $sm-aside--toggle--hover--background-color;
  }
}
</style>
