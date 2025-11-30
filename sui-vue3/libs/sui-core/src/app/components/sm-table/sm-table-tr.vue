<script setup lang="ts">
import { watchEffect, computed } from 'vue'

const props = withDefaults(defineProps<{
  /**
   * Show selected state of the row
   */
  selected?: boolean
  /**
   * Whether the table row is expanded (or collapsed)
   */
  expandedRow?: boolean
  /**
   * Set an expandable region id that is controlled by the interactive element
   */
  id?: string
  /**
   * Apply a highlight styling on this row
   *
   * NOTE: Only available for non-header rows
   */
  highlight?: boolean
}>(), {
  selected: false,
  expandedRow: true,
  id: '',
  highlight: false,
})

const emit = defineEmits<{
  /** Emitted the selected events */
  selected: [value: boolean]
  /** Emitted the selected visible state */
  'selected:visible': [value: boolean]
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

/**
 * TODO: perhaps the name of the emitted event 'selected:visible' should be
 * renamed to 'update:selected' instead if the intention here was to create a v-model 2-way binding.
 * Currently v-model won't work in this instance since the requirement must be:
 * 'update:propName' where propName is the name of the prop we want 2-way binding on.
 * We leave this alone for now since its possible downstream projects
 * may already be using this emitted event.
 */
const isSelected = computed<boolean>({
  get: () => props.selected,
  set: state => emit('selected:visible', state),
})

// Emit selected events
watchEffect(() => {
  if (isSelected.value) {
    emit('selected', isSelected.value)
  } else {
    emit('selected', isSelected.value)
  }
})
</script>

<template>
  <keep-alive>
    <tr
      v-if="expandedRow"
      :id="id"
      class="sm-table-tr"
      :class="{
        'sm-table-tr--selected': selected,
        'sm-table-tr--aria-control': id,
        'sm-table-tr--highlight': highlight,
      }"
    >
      <!-- @slot The body of the row -->
      <slot />
    </tr>
  </keep-alive>
</template>

<style lang="scss">
@import "./../../common/variables";
@import "./../../common/mixins";

$sm-table-row--hover--background-color: $app-extra-4;
$sm-table-row-columns--border: $light-blue-grey;
$sm-table-row--selected--border: $primary-blue;
$sm-table-row--selected--background-color: $app-info-light;
$sm-table-row--expanded--color: #f5f6f6;
$sm-table-row--columns--border: $light-blue-grey;
$sm-table-row--expanded--background-color: $blue-neu-light;
$sm-table-th--background--color: $blue-neu-med;
$sm-table-td---background--color-active: $true-white;

.sm-table-tr {
  position: relative;

  &:hover,
  &:focus {
    background-color: $sm-table-row--hover--background-color;

    .sm-table-th {
      background-color: $sm-table-th--background--color;
    }

    td {
      background-color: $sm-table-row--hover--background-color;
    }

    .sm-table-td--active-cell {
      background: $sm-table-td---background--color-active;
    }

    .sm-table--fixed-header-right {
      td:last-child {
        background-color: $sm-table-th--background--color;
      }
    }
  }

  &--selected {
    outline: 1px solid $sm-table-row--selected--border;
    outline-offset: -1px;

    .sm-table-td {
      background-color: $sm-table-row--selected--background-color;
    }

    &:hover,
    &:focus {
      .sm-table-td {
        background-color: $sm-table-row--selected--background-color;
      }
    }
  }

  &--aria-control {
    &:hover,
    &:focus {
      .sm-table-td {
        background-color: $sm-table-row--hover--background-color !important;
      }

      .sm-table-td__container {
        background-color: $sm-table-row--hover--background-color;
      }
    }

    .sm-table-td__content {
      padding-left: $sm-12;
    }

    transition: all 0.3s ease;

    .sm-table-td--expandableRow {
      border-bottom: 1px solid $sm-table-row--columns--border;

      .sm-table-td__button {
        background: transparent;
        border: 0;
      }

      .sm-table-td__content {
        padding-left: $sm-48 !important;
        border-bottom: 0;
      }
    }

    td {
      // Override default table style
      background-color: $sm-table-row--expanded--color !important;

      &:first-child {
        .sm-table-td__container {
          padding-left: $sm-48;
        }
      }

      &:not(.sm-table-td--expandableRow) {
        &:first-child {
          .sm-table-td__container {
            padding-left: 52px;
          }
        }
      }
    }
  }
}

.sm-table-tr--highlight {
  > .sm-table-td {
    background-color: $sm-table-row--expanded--background-color !important;
  }
}

.sm-table-tr--highlight {
  &:hover,
  &:focus {
    > .sm-table-td {
      background-color: $sm-table-row--hover--background-color !important;
    }
  }
}
</style>
