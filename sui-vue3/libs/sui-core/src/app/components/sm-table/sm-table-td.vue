<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from '../../libs/vue-i18n'

import { useUniqueId } from '../use/unique-id'

const props = withDefaults(defineProps<{
  /**
   * Whether to add a custom class in the root td element
   */
  rootClass?: string | null
  /**
   * Whether to add a custom class in the inner element
   */
  contentClass?: string | null
  /**
   * Whether the table is expanded (or collapsed)
   */
  expanded?: boolean
  /**
   * Whether to display expandableRow row
   */
  expandableRow?: boolean
  /**
   * Set the list of element (or elements) whose contents are controlled by the current element. For example "element1 element2"
   */
  ariaControls?: string
  /**
   * Set the border left to the cell, the default border color is primary-blue (#006add)
   */
  borderLeft?: boolean
  /**
   * The number of columns a cell should span.
   */
  colspan?: string | number
  /**
   * Whether the field is disabled
   */
  disabled?: boolean
  /**
   * Whether the cell has no padding
   */
  noPadding?: boolean
  /**
   * A stacking context so adjusting the z-index of the position:absolute elements
   */
  showOnTopIndex?: number | null
  /**
   * Whether the component has sm-select component as the default slot for the cell selection
   */
  selectedCell?: boolean
  /**
   * Whether to change the cell border color to represent active cell on selection
   */
  activeCell?: boolean
}>(), {
  rootClass: null,
  contentClass: null,
  expanded: false,
  expandableRow: false,
  ariaControls: undefined,
  borderLeft: false,
  colspan: undefined,
  disabled: false,
  noPadding: false,
  showOnTopIndex: null,
  selectedCell: false,
  activeCell: false,
})

const emit = defineEmits<{
  /** Emitted when dialog is collapse */
  collapse: []
  /** Emitted when dialog is expanded */
  expanded: []
}>()

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
    // we suppress ATTR_FALSE_VALUE as we want to keep
    // `aria-disabled/aria-expanded` attribute attached even if the value of it is false
    // in vue2, aria-disabled/aria-expanded was removed if the value was false.
    ATTR_FALSE_VALUE: 'suppress-warning',
  },
})

const { i18n } = useI18n()

const { id: tableId } = useUniqueId('sm-table-row_')
const tableRowBodyId = computed(() => `${tableId.value}__body`)

/**
 * Expand and collapse the table
 */
const toggletable = (): void => {
  if (props.expanded) {
    emit('collapse')
  } else {
    emit('expanded')
  }
}

const componentStyles = reactive({ height: null })
const tableToggleA11yLabel = computed(() => {
  return props.expanded
    ? i18n.t('sui-core.components.sm-table.sm-table.a11y__table-collapse-button')
    : i18n.t('sui-core.components.sm-table.sm-table.a11y__table-expand-button')
})

defineExpose ({
  tableId,
  tableRowBodyId,
  toggletable,
  componentStyles,
  tableToggleA11yLabel,
})
</script>

<template>
  <td
    :style="[ showOnTopIndex ? { 'z-index' : showOnTopIndex } : '' ]"
    class="sm-table-td"
    :class="[{
      'sm-table-td--expandableRow': expandableRow,
      'sm-table-td--border-left': borderLeft,
      'sm-table-td--disabled': disabled,
      'sm-table-td--selected-cell' : !!selectedCell,
      'sm-table-td--active-cell' : !!activeCell
    }, rootClass]"
    :colspan="colspan"
  >
    <div
      v-if="$slots['data-header']"
      class="sm-table-td__heading"
    >
      <!-- @slot The small screen responsive header title -->
      <slot name="data-header" />
    </div>
    <div
      class="sm-table-td__container"
      :class="contentClass"
      :aria-disabled="disabled"
    >
      <button
        v-if="expandableRow"
        :id="tableId || undefined"
        type="button"
        :aria-label="tableToggleA11yLabel"
        :aria-expanded="expanded"
        :title="tableToggleA11yLabel"
        :aria-controls="ariaControls"
        class="sm-table-td__button"
        :class="{ 'sm-table-td__button-expanded': expanded }"
        @click="toggletable"
      >
        <span
          class="sm-table-td__arrow"
          tabindex="-1"
        >
          <sm-icon
            name="arrow-down"
            aria-hidden="true"
            class="arrow-rotate"
          />
        </span>
      </button>
      <!-- @slot The body of the column -->
      <fieldset
        class="sm-table-td__content"
        :disabled="disabled"
        :class="{ 'sm-table-td__no-padding' : noPadding }"
      >
        <slot />
      </fieldset>
    </div>
  </td>
</template>

<style lang="scss" scoped>
@import "../../common/variables";
@import "../../common/mixins";

$sm-table-td--columns--border: $light-blue-grey;
$sm-table-td-button--color: $primary-blue;
$sm-table-td--expanded--color: #f5f6f6;
$sm-table-td--arrow--focus: $grey-neu-dark;
$sm-table-td--active-cell: $primary-blue;

.sm-table-td {
  border: 1px solid $sm-table-td--columns--border;
  border-top: 0;
  border-right: 0;
  min-height: $sm-48;
  box-sizing: border-box;
  cursor: pointer;
  word-break: break-all;

  &:last-child {
    border-right: 1px solid $sm-table-td--columns--border;
  }

  &--disabled {
    background: repeating-linear-gradient(-55deg, #e6ebf2, #e6ebf2 1.5px, #f6f6f6 1.5px, #f6f6f6 4px);
    border-collapse: collapse;
    opacity: 0.8;
    cursor: not-allowed;

    .sm-table-td__container, .sm-table-td__content {
      pointer-events: none;
      opacity: 0.7;
    }
  }

  &--border-left {
    // override default table style
    border-left: 4px solid $sm-table-td-button--color !important;
  }

  &__container {
    display: flex;
    width: 100%;
  }

  .arrow-rotate {
    &:hover,
    &:focus {
      box-shadow: none;
      outline: none;
    }
  }

  &__button {
    position: relative;
    cursor: pointer;

    &:hover,
    &:focus {
      box-shadow: none;
    }

    &:focus {
      box-shadow: none;
      outline: none;

      > .sm-table-td__arrow {
        box-shadow: 0 0 0 2px $sm-table-td--arrow--focus;
      }
    }
  }

  &__arrow {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    padding-top: $sm-16;

    &:focus {
      box-shadow: none;
      outline: none;
    }
  }

  &--expandableRow {
    // Override default table style
    .sm-table-td__button {
      position: absolute;
      top: 0;
      height: 100%;
      width: 49px;
      min-width: 49px;
      background: inherit;
      border: 0;
      border-right: 1px solid $sm-table-td--columns--border;
      border-bottom: 0;
      border-top: 0;

      .arrow-rotate {
        transition: transform 0.3s;
      }
    }

    .sm-table-td__button + .sm-table-td__content {
      padding-left: 60px;
    }

    .arrow-rotate {
      color: $sm-table-td-button--color;
    }

    .sm-table-td__button-expanded {
      .arrow-rotate {
        transform: rotate(180deg);
      }
    }
  }

  &__content {
    width: 100%;
    padding: $sm-12;
    border: 0;
    margin: 0;
  }

  &__no-padding {
    padding: 0;
  }

  &--selected-cell {
    .sm-table-td__content {
      min-width: 100%;

      :deep(.sm-select) .multiselect {
        height: 100%;
        border-radius: 0;
        border: none;
        background: transparent;
        min-height: auto;

        &--active {
          border: none;
        }

        &__single {
          width: 90%;
          padding-top:0;
          min-height: auto;
        }

        &__placeholder, &__input, &__single, &__tags {
          min-height: auto;
        }
      }

      :deep(.multiselect__tags) {
        padding: $sm-12;
      }
    }
  }

  &--active-cell {
    border: 1px solid $sm-table-td--active-cell;
  }
}
</style>
