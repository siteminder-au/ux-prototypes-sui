<script setup lang="ts">
import { computed, ref, provide, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { SmTabState, TabsProviderKey } from './symbols'
import { useResponsive } from '../use/responsive'
import { useI18n } from '../../libs/vue-i18n'

const props = withDefaults(defineProps<{
  /**
   * The active tab. Use the `v-model:activeTab` to keep track of tab changes (0 indexed)
   */
  activeTab: number
  /**
   * Whether to show underline at the bottom of the list item
   */
  showUnderline?: boolean
  /**
   * Custom text for the tab list
   */
  customTablistText?: string
  /**
   * Whether to show tablet view for small screens
   */
  isTablet?: boolean
  /**
   * Callback before active tab changes, and can prevent step from changing
   * @default function (to: number, from: number, next: (index: number = to) => void)
   */
  beforeTabChange?: (to: number, from: number, next: (index?: number) => void) => void
}>(), {
  activeTab: 0,
  showUnderline: true,
  customTablistText: undefined,
  isTablet: true,
  beforeTabChange: (to: number, from: number, next: (index: number) => void) => next(to),
})

const emit = defineEmits<{
  /**
   * Emitted when switching between tabs
   */
  'update:activeTab': [state: number]
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

// #region small screen related logic
const isMobileScreen = useMediaQuery(`(max-width: ${useResponsive.mobileBreakpoint}px)`)
const toggleTabDropdown = ref(false)
// #endregion

// keep as a writable computed property for backwards compatibility
// see: https://vuejs.org/guide/components/v-model.html#component-v-model
const activeTab = computed({
  get: () => props.activeTab,
  set: state => emit('update:activeTab', state),
})

const switchTab = (to: number): void => {
  const from = activeTab.value

  props.beforeTabChange(to, from, (tabIndex: number = to) => {
    // used by upstream components that want to listen to change in active tab
    // we maintain this for backwards compatibility purposes
    activeTab.value = tabIndex
  })
}

const updateActiveTab = (tabIndex: number): void => {
  switchTab(tabIndex)

  /**
   * Toggle the dropdown for smaller screen
   */
  if (isMobileScreen.value) {
    toggleTabDropdown.value = !toggleTabDropdown.value
  }
}

// for when upstream components programmatically changes the active tab
watch(activeTab, () => {
  switchTab(activeTab.value)
})

// #region tab states
const tabs = ref<SmTabState[]>([])

provide(TabsProviderKey, {
  activeTab,
  addTab: (tab: SmTabState) => {
    // add ability to adds tabs to sm-tabs
    // which will be the source of truth re: state
    tabs.value.push(tab)
  },
  tabs,
})
// #endregion

defineExpose({
  tabs,
  toggleTabDropdown,
  updateActiveTab,
})
</script>

<template>
  <div class="sm-tabs">
    <div
      class="sm-tabs-container"
      :class="{
        'sm-tabs__small-screen-container': toggleTabDropdown,
        'sm-tabs--is-tablet': isTablet,
      }"
    >
      <div class="sm-tabs__list-wrapper">
        <div
          class="sm-tabs__list"
          role="tablist"
          :aria-label="
            customTablistText || i18n.t('sui-core.components.sm-tabs.sm-tabs.a11y__tabListContent')
          "
        >
          <span
            class="sm-tabs__arrow"
            tabindex="-1"
          >
            <sm-icon
              name="arrow-down"
              aria-hidden="true"
              class="arrow-rotate"
            />
          </span>

          <template v-for="(tab, i) in tabs">
            <button
              v-if="!tab.hidden"
              :id="tab.controlId"
              :key="i"
              class="sm-tabs__button"
              :aria-selected="activeTab === i ? 'true' : 'false'"
              :class="{
                'sm-tabs__button--active': activeTab === i && !tab.disabled,
                'sm-tabs__button--disabled': tab.disabled,
              }"
              role="tab"
              type="button"
              :aria-controls="tab.panelId"
              :disabled="tab.disabled"
              :tabindex="activeTab !== i ? '-1' : undefined"
              @click="tab.disabled ? null : updateActiveTab(i)"
            >
              <span
                tabindex="-1"
                class="button-content"
              >
                <template v-if="tab.label && $slots[tab.label]">
                  <slot :name="tab.label" />
                </template>
                <span v-else>
                  <sm-icon
                    v-if="tab.prefixIcon"
                    aria-hidden="true"
                    :name="tab.prefixIcon"
                    class="sm-tabs__tab-prefix-icon"
                  />
                  {{ tab.label }}
                  <span
                    v-if="tab.value"
                    class="sm-tabs__value"
                  >({{ tab.value }})</span>
                  <sm-icon
                    v-if="tab.suffixIcon"
                    aria-hidden="true"
                    :name="tab.suffixIcon"
                    class="sm-tabs__tab-suffix-icon"
                  />
                </span>
              </span>
            </button>
          </template>
        </div>
        <!-- @slot Place tabs header action component here -->
        <slot name="action" />
      </div>
      <span
        v-if="showUnderline"
        class="sm-tabs__border-bottom"
      />
      <div
        role="tabpanel"
        class="sm-tabs__tabpanel"
        tabindex="0"
      >
        <span
          tabindex="-1"
          class="sm-tabs__tabpanel-container"
        >
          <!-- @slot Place sm-tab components here -->
          <slot />
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../common/variables";

$sm-tabs--list-active-background-color: $primary-blue;
$sm-tabs--list-active-text-color: $true-white;
$sm-tabs--list-background-color--hover: $blue-neu-med;
$sm-tabs--list-color--hover: $grey-neu-black;
$sm-tabs--list-color: $grey-neu-black;
$sm-tabs--border-bottom-color: $light-blue-grey;
$sm-tabs--header--scrollbar-color: $blue-neu-dark;
$sm-tab--disabled: $grey-neu-mid;

.sm-tabs {
  position: relative;

  &__list-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__value {
    padding-left: 2px;
  }

  &__list {
    position: relative;
    padding: 0;
    margin: 0;
    overflow-x: auto;
    border: 0;
    display: flex;
    border-bottom: 0;
    width: 100%;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      height: 4px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px $grey-neu-mid;
      border-radius: 4px;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: $sm-tabs--header--scrollbar-color;
      border-radius: 8px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: $grey-neu-dark;
    }
  }

  &__border-bottom {
    height: 1px;
    background-color: $sm-tabs--border-bottom-color;
    display: block;
  }

  &__button {
    text-decoration: none;
    background: $sm-tabs--list-active-text-color;
    color: $sm-tabs--list-color;
    position: relative;
    white-space: nowrap;
    border: 0;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: center;
    text-transform: uppercase;
    width: auto;
    padding: 0;
    margin: 0;

    &:focus {
      box-shadow: none;
      outline: none;

      > .button-content {
        outline: 1px solid $sm-tabs--list-color--hover;
        outline-offset: -1px;
      }
    }

    .button-content {
      cursor: pointer;
      height: 100%;
      width: 100%;
      padding: 15px 16px;
      display: block;

      &:focus {
        box-shadow: none;
        outline: none;
      }
    }

    &:hover {
      background: $sm-tabs--list-background-color--hover;
    }

    &:not(.sm-tabs__button--active) {
      display: block;
      border-bottom: 0;
    }

    &--active {
      color: $sm-tabs--list-active-background-color;
      background: $sm-tabs--list-active-text-color;
      transition: all 0.3s ease;
      border-bottom: 0;

      &:hover {
        color: $sm-tabs--list-active-background-color;
        background: $sm-tabs--list-active-text-color;
      }
    }

    &::before {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      opacity: 0;
      will-change: background-color, opacity;
      content: " ";
      background-color: $sm-tabs--list-active-background-color;
      height: 2px;
      transition: 0.3s cubic-bezier(0.5, 0.5, 1, 1);
      max-width: 100%;
      min-width: 100%;
    }

    &--disabled {
      color: $sm-tab--disabled;

      &:hover {
        background: transparent;
        color: $sm-tab--disabled;
      }
    }
  }

  .sm-tabs__button--active {
    &::before {
      opacity: 1;
    }
  }

  &__tabpanel {
    &:focus {
      box-shadow: none;
      outline: none;

      > .sm-tabs__tabpanel-container {
        outline: 1px solid $sm-tabs--list-color--hover;
        outline-offset: -1px;
        display: block;
      }
    }
  }

  &__tabpanel-container {
    &:focus {
      box-shadow: none;
    }
  }

  &__arrow {
    display: none;
  }

  &__tab-prefix-icon {
    margin-right: 4px;
  }

  &__tab-suffix-icon {
    margin-left: 4px;
  }

  &--is-tablet {
    .sm-tabs__list {
      @media (max-width: #{$viewport--tablet}) {
        border: 1px solid transparent;
        display: block;
      }
    }

    .sm-tabs__arrow {
      @media (max-width: #{$viewport--tablet}) {
        position: absolute;
        right: 16px;
        top: 15px;
        color: $sm-tabs--list-active-background-color;
        display: block;

        .arrow-rotate {
          transform: rotate(0deg);
          transition-duration: 0.3s;
          top: 0;
        }
      }
    }

    .sm-tabs__border-bottom {
      @media (max-width: #{$viewport--tablet}) {
        display: none;
      }
    }

    .sm-tabs__button {
      @media (max-width: #{$viewport--tablet}) {
        text-align: left;
        font-size: 15px;
        font-weight: normal;
        line-height: 22px;
        letter-spacing: -0.2px;
        background-color: transparent;
        text-transform: unset;
        width: 100%;

        &:hover {
          background: transparent;
        }
      }

      &:not(.sm-tabs__button--active) {
        @media (max-width: #{$viewport--tablet}) {
          display: none;
        }
      }

      &--active {
        @media (max-width: #{$viewport--tablet}) {
          color: $sm-tabs--list-active-background-color;
          border-bottom: 1px solid $sm-tabs--border-bottom-color;
          background: transparent;
        }
      }

      &::before {
        @media (max-width: #{$viewport--tablet}) {
          max-width: 30%;
          min-width: 160px;
        }
      }

      &--disabled {
        color: $sm-tab--disabled;

        &:hover {
          background: transparent;
          color: $sm-tab--disabled;
        }
      }
    }

    &.sm-tabs__small-screen-container {
      @media (max-width: #{$viewport--tablet}) {
        .sm-tabs__list {
          height: initial;
          border: 1px solid $sm-tabs--border-bottom-color;
          border-radius: 4px;
          box-shadow: 0 3px 17px -8px rgba(24, 58, 108, 0.19), 0 12px 11px -13px rgba(24, 58, 108, 0.18), 0 10px 24px -9px rgba(24, 58, 108, 0.12);
          transition: all 0.2s ease;

          .arrow-rotate {
            transform: rotate(180deg);
            transition-duration: 0.3s;
          }

          .sm-tabs__button {
            display: block;
            border-bottom: 1px solid $sm-tabs--border-bottom-color;
          }
        }
      }
    }
  }
}
</style>
