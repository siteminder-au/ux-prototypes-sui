<script setup lang="ts">
import { reactive, ref, computed, Ref } from 'vue'
import { useI18n } from '../../libs/vue-i18n'
import { useUniqueId } from '../use/unique-id'
import { SmExpandableCardBodyArrowPosition } from './sm-expandable-card-body.types'

const props = withDefaults(defineProps<{
  /**
   * Set the position of the expandable/collapsible arrow. Accepts: 'left', 'right'
   */
  arrowPosition?: SmExpandableCardBodyArrowPosition
  /**
   * A custom class name to apply to the sm-expandable-card-body's wrapper
   */
  contentClass?: string
  /**
   * Set the props to true to allow customization for the expandable/collapsible card functionality using component emit events
   */
  customCollapsible?: boolean
  /**
   * Whether the card is expanded (or collapsed)
   */
  expanded?: boolean
  /**
   * Whether the card is a help card, Setting the props to true will apply the help card styling
   */
  isHelpCard?: boolean
  /**
   * Set the max-height of body to show scrollbar on overflow, accept only units of measurement. For example '100px', '100em', '100rem'
   */
  maxHeight?: string
  /**
   * Whether to display expandable arrow icon
   */
  showArrowIcon?: boolean
  /**
   * Whether to show outer border to card
   */
  showOuterBorder?: boolean
}>(), {
  arrowPosition: SmExpandableCardBodyArrowPosition.LEFT,
  contentClass: '',
  customCollapsible: false,
  expanded: true,
  isHelpCard: false,
  maxHeight: '600px',
  showArrowIcon: true,
  showOuterBorder: false,
})

const emit = defineEmits<{
  /**
   * Emitted when banner is opened without parameters
   */
  close: []
  /**
   * Emitted when banner is closed without parameters
   */
  open: []
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

const componentStyles = reactive({ height: undefined })

const { i18n } = useI18n()

const { id: expandableId } = useUniqueId('sm-expandable_')
const expandableBodyId = computed(() => (expandableId.value ? `${expandableId.value}__body` : undefined))

const isExpanded: Ref<boolean> | boolean = props.customCollapsible ? computed(() => (props.expanded)) : ref(props.expanded)

const expandableToggleA11yLabel = computed(() => {
  return isExpanded.value
    ? i18n?.t('sui-core.components.sm-expandable-card.sm-expandable-card.a11y__collapsable-card-button').toString()
    : i18n?.t('sui-core.components.sm-expandable-card.sm-expandable-card.a11y__expandable-card-button').toString()
})

/**
 * expanded/ collapsed function
 */
const toggle = (): void => {
  if (isExpanded.value) {
    isExpanded.value = false
    emit('close')
  } else {
    isExpanded.value = true
    emit('open')
  }
}

/**
 * expanded/ collapsed function for customization to emit events
 */
const customToggle = (): void => {
  if (props.expanded) {
    emit('close')
  } else {
    emit('open')
  }
}

defineExpose({
  isExpanded,
  toggle,
})
</script>

<template>
  <div
    class="sm-expandable-card-body"
    :style="componentStyles"
    :class="[
      {
        'sm-expandable-card-body--outer-border': showOuterBorder,
        'sm-expandable-card-body--help-card': isHelpCard
      },
      contentClass
    ]"
  >
    <button
      :id="expandableId || undefined"
      type="button"
      :aria-label="expandableToggleA11yLabel"
      :aria-expanded="isExpanded"
      :title="expandableToggleA11yLabel"
      :aria-controls="expandableBodyId"
      class="sm-expandable-card-body__header-button"
      @click="customCollapsible ? customToggle() :toggle()"
    >
      <div
        v-if="$slots.header"
        tabindex="-1"
        class="sm-expandable-card-body__button"
        :class="{
          'sm-expandable-card-body__button--expanded': isExpanded,
          [`sm-expandable-card-body__button--position-${arrowPosition}`]: !!arrowPosition,
        }"
      >
        <sm-icon
          v-if="showArrowIcon"
          name="arrow-down"
          class="sm-expandable-card-body__icon"
        />
        <!-- @slot Header of the expandable card -->
        <slot name="header" />
      </div>
    </button>
    <!-- eslint-disable-next-line max-len -->
    <div
      v-if="$slots.body"
      :id="expandableBodyId"
      class="sm-expandable-card-body__body"
      :aria-hidden="!isExpanded"
      role="region"
      :class="{'sm-expandable-card-body__body--expanded': isExpanded}"
      :aria-labelledby="expandableId || undefined"
      :tabindex="!isExpanded ? '-1' : undefined"
      :style="[isExpanded ? { 'max-height' : maxHeight } : { 'max-height' : 0 }]"
    >
      <!-- @slot Body of the expandable card -->
      <slot name="body" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../common/variables";
@import "../../common/mixins";

$sm-expandable-card-body--icon-color: $primary-blue;
$sm-expandable-card-body--button-focus: $grey-neu-dark;
$sm-expandable-card-body--border-color: $light-blue-grey;
$sm-expandable-card-body--help-card-background: rgba(198, 206, 218, 0.12);
$sm-expandable-card-body--text-color: $grey-neu-black;

.sm-expandable-card-body {
  border-radius: 8px;

  + .sm-expandable-card-body {
    border-top: 1px solid $sm-expandable-card-body--border-color;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  &--outer-border {
    border: 1px solid $sm-expandable-card-body--border-color;
  }

  &--outer-border.sm-expandable-card-body--help-card {
    background: $sm-expandable-card-body--help-card-background;
    border: 0;
    border-left: 3px solid $sm-expandable-card-body--border-color;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;

    .sm-expandable-card-body__header-button {
      background: transparent;
    }

    .sm-expandable-card-body__body {
      padding-left: 21px;
      padding-right: 21px;
    }

    .sm-expandable-card-body__button {
      padding: $sm-20 $sm-20 21px 21px
    }

  }

  &__icon {
    margin-right: 18px;
    transition: transform 0.3s;
    color: $sm-expandable-card-body--icon-color;
  }

  &__header-button {
    cursor: pointer;
    font-weight: 600;
    border: 0;
    background-color: white;
    padding: 0;
    text-align: left;
    width: 100%;
    border-radius: 8px;

    &:focus {
      box-shadow: none;
      outline: none;

      > .sm-expandable-card-body__button {
        outline: 2px solid $sm-expandable-card-body--button-focus;
        outline-offset: -2px;
      }
    }
  }

  &__button {
    padding: 21px $sm-24 21px $sm-24;
    color: $sm-expandable-card-body--text-color;
    width: 100%;
    height: 100%;

    &:focus {
      box-shadow: none;
      outline: none;
    }

    &--expanded {
      .sm-expandable-card-body__icon {
        transform: rotate(180deg);
      }
    }

    &--position {
      &-right {
        position: relative;

        .sm-expandable-card-body__icon {
          position: absolute;
          top: 21px;
          right: 8px;
        }
      }
    }
  }

  &__body {
    overflow-y: auto;
    max-height: 0;
    padding: 0 $sm-24 0 $sm-24;
    transition: all 0.3s ease;

    &--expanded {
      padding-bottom: 21px;
    }

    &[aria-hidden="true"] {
      visibility: hidden;
    }
  }

  &.sm-overflow-visible {
    .sm-expandable-card-body__body--expanded {
      overflow-y: unset;
    }
  }
}
</style>
