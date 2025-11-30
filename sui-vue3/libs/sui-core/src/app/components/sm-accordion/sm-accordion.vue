<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from '../../libs/vue-i18n'
import { useUniqueId } from '../use/unique-id'

const props = withDefaults(defineProps<{
  /**
   * Whether the accordion is expanded (or collapsed)
   */
  expanded?: boolean
  /**
   * Whether the accordion should be stacked on top of each other
   */
  stacked?: boolean
  /**
   * Set the max-height of body to show scrollbar on overflow, accept only units of measurement. For example '100px', '100em', '100rem'
   */
  maxHeight?: string
  /**
   * CSS classes which will be applied to the root drawer content element
   */
  contentClass?: string
}>(), {
  expanded: false,
  stacked: false,
  maxHeight: '600px',
  contentClass: '',
})

const emit = defineEmits<{
  collapse: []
  expanded: []
}>()

const { i18n } = useI18n()

const { id: accordionId } = useUniqueId('sm-accordion_')
const accordionBodyId = computed(() => `${accordionId.value}__body`)

/**
 * Expand and collapse the accordion
 */
const toggleAccordion = (): void => {
  if (props.expanded) {
    emit('collapse')
  } else {
    emit('expanded')
  }
}

const componentStyles = reactive({ height: null })
const accordionToggleA11yLabel = computed(() => {
  return props.expanded
    ? i18n.t(
      'sui-core.components.sm-accordion.sm-accordion.a11y__accordion-collapse-button',
    )
    : i18n.t(
      'sui-core.components.sm-accordion.sm-accordion.a11y__accordion-expand-button',
    )
})

defineExpose({
  accordionId,
  accordionBodyId,
  componentStyles,
  accordionToggleA11yLabel,
  toggleAccordion,
})

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
    ATTR_FALSE_VALUE: 'suppress-warning',
  },
})
</script>

<template>
  <div
    class="sm-accordion"
    :class="[{ 'sm-accordion--list-view': stacked }, contentClass]"
  >
    <div
      v-if="$slots.fixed"
      class="sm-accordion__static-header"
    >
      <!-- @slot Content to display fixed header on top -->
      <slot name="fixed" />
    </div>
    <div class="sm-accordion__header">
      <button
        :id="accordionId || undefined"
        type="button"
        :aria-label="accordionToggleA11yLabel"
        :aria-expanded="expanded"
        :title="accordionToggleA11yLabel"
        :aria-controls="accordionBodyId"
        class="sm-accordion__arrow-up"
        :class="{ 'sm-accordion__arrow-down': expanded, 'sm-accordion__arrow-contnent': $slots.fixed }"
        @click="toggleAccordion"
      >
        <span
          class="sm-accordion__arrow"
          tabindex="-1"
        >
          <sm-icon
            name="arrow-down"
            aria-hidden="true"
            class="arrow-rotate"
          />
        </span>
      </button>
      <div class="sm-accordion__header-content">
        <!-- @slot The accordion header content -->
        <slot name="header" />
      </div>
    </div>
    <div
      :id="accordionBodyId"
      class="sm-accordion__body"
      :aria-hidden="!expanded"
      :tabindex="!expanded ? '-1' : undefined"
      :class="{ 'sm-accordion__body--expanded': expanded }"
      :style="[expanded ? { 'max-height': maxHeight } : { 'max-height': 0 }]"
      role="region"
      :aria-labelledby="accordionId || undefined"
    >
      <div class="sm-accordion__body-inner">
        <!-- @slot The accordion body content -->
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../common/variables';
@import '../../common/mixins';

$sm-accordion--header--border: $light-blue-grey;
$sm-accordion--body--background-color: $app-extra-4;
$sm-accordion--arrow--hover: $light-blue-grey;
$sm-accordion--arrow--color: $primary-blue;
$sm-accordion--arrow-down--background-color: $blue-neu-med;
$sm-accordion--arrow--focus: $grey-neu-dark;

.sm-accordion {
  border: 1px solid $sm-accordion--header--border;
  border-radius: 8px;
  background-color: $sm-accordion--body--background-color;

  + .sm-accordion:not(.sm-accordion--list-view) {
    margin-top: 8px;
  }

  &--list-view {
    border-bottom: 0;
    border-radius: 0;

    .sm-accordion__arrow-up {
      &:hover,
      &:focus {
        border-radius: 0;
      }
    }

    &:first-child {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;

      .sm-accordion__arrow-up {
        &:hover,
        &:focus {
          border-top-left-radius: 6px;
        }
      }

      .sm-accordion__arrow-up.sm-accordion__arrow-contnent {
        &:hover,
        &:focus {
          border-top-left-radius: 0;
        }
      }
    }

    &:last-child {
      border-bottom: 1px solid $sm-accordion--header--border;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;

      .sm-accordion__arrow-up {
        &:hover,
        &:focus {
          border-bottom-left-radius: 6px;
        }
      }

      .sm-accordion__arrow-down {
        &:hover,
        &:focus {
          border-bottom-left-radius: 0;
        }
      }
    }
  }

  &__static-header {
    padding: 11px;
    background-color: $sm-accordion--arrow-down--background-color;
    border-bottom: 1px solid $sm-accordion--header--border;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &__header {
    cursor: pointer;
    position: relative;
  }

  &__header-content {
    padding: 11px 0 11px $sm-64;
    background-color: white;
    border-radius: 8px;
  }

  &__body {
    position: relative;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    overflow-y: auto;
    max-height: 0;
    transition: all 0.3s ease;

    &[aria-hidden="true"] {
      visibility: hidden;
    }
  }

  &__arrow-up {
    cursor: pointer;
    padding: 1px;
    width: 48px;
    color: $sm-accordion--arrow--color;
    position: absolute;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    border: 0;
    border-right: 1px solid $sm-accordion--header--border;
    height: 100%;
    background-color: white;

    &:hover,
    &:focus {
      background-color: $sm-accordion--arrow--hover;
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }

    &:focus {
      box-shadow: none;
      outline: none;

      > .sm-accordion__arrow {
        box-shadow: 0 0 0 2px $sm-accordion--arrow--focus;
      }
    }

    .arrow-rotate {
      transition: transform 0.3s;
      top: 0;
    }
  }

  &__arrow {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    padding-top: 13px;

    &:focus {
      box-shadow: none;
      outline: none;
    }
  }

  &__arrow-down {
    border-bottom-left-radius: 0;
    background-color: $sm-accordion--body--background-color;

    .arrow-rotate {
      transform: rotate(180deg);
    }

    &:hover,
    &:focus {
      border-bottom-left-radius: 0;
    }
  }

  &__body-inner {
    padding: $sm-20 $sm-16 $sm-20 63px;
    display: block;
    border-top: 1px solid $sm-accordion--header--border;
    background-color: $sm-accordion--body--background-color;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;

    > .sm-accordion {
      background-color: $sm-accordion--body--background-color;
      margin-left: -63px;
      border-radius: 0;
      border-left: 0;
      margin-right: -16px;
      border-right: 0;
      border-bottom: 0;
      margin-top: $sm-20;

      &:last-of-type {
        margin-bottom: -20px;
      }

      &:last-child {
        margin-bottom: -20px;
      }

      .sm-accordion__static-header {
        border-radius: 0;
      }

      + .sm-accordion {
        margin-top: 0;
      }

      > .sm-accordion__body > .sm-accordion__body-inner {
        padding: $sm-20 $sm-32 $sm-20 63px;
      }

      .sm-accordion__arrow-up {
        border-radius: 0;
        background-color: $sm-accordion--body--background-color;

        &:hover,
        &:focus {
          background-color: $sm-accordion--arrow--hover;
        }
      }

      .sm-accordion__header-content {
        background-color: $sm-accordion--body--background-color;
      }

      .sm-accordion {
        margin: 0;
        border: 1px solid $sm-accordion--header--border;
        border-radius: 8px;
        margin-top: $sm-20;

        .sm-accordion__static-header {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }

        .sm-accordion__arrow-up {
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
          background-color: white;
        }

        .sm-accordion__arrow-down {
          background-color: $sm-accordion--body--background-color;

          &:hover,
          &:focus {
            border-bottom-left-radius: 0;
          }
        }

        .sm-accordion__header-content {
          background-color: white;
          border-radius: 8px;
        }

        .sm-accordion__body-inner {
          padding: $sm-20 $sm-16 $sm-20 $sm-16;
          background-color: white;
        }
      }
    }
  }

  &__arrow-contnent {
    &:hover,
    &:focus {
      border-top-left-radius: 0;
    }
  }

  &.sm-overflow-visible {
    .sm-accordion__body--expanded {
      overflow-y: unset;
    }
  }
}
</style>
