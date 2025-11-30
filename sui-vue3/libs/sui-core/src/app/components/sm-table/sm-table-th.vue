<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '../../libs/vue-i18n'
import { SmTableThSortingOrder } from './sm-table-th.types'

const props = withDefaults(defineProps<{
  /**
   * Display sortable icon on header
   */
  sortable?: boolean
  /**
   * Current sorting order, default ascending. Accepts: 'asc' and 'desc'
   */
  sortingOrder?: SmTableThSortingOrder
  /**
   * Sorting icon, used to manually manipulate icon
   */
  sortingIcon?: string
  /**
   * The number of columns a cell should span.
   */
  colspan?: string | number
  /**
   * Display static sub-header on top
   */
  staticHeader?: boolean
  /**
   * Set the width to column header , accept only units of measurement. For example '100px', '100em', '100rem'
   */
  width?: string
  /**
   * Whether to add a custom class
   */
  rootClass?: string | null
}>(), {
  sortable: false,
  sortingOrder: SmTableThSortingOrder.ASC,
  sortingIcon: undefined,
  colspan: undefined,
  staticHeader: false,
  width: '',
  rootClass: null,
})

const emit = defineEmits<{
  /** Emitted on click of sort order for 'asc' and 'desc' */
  sortingTableOrder: [value: string]
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

const sortingOrderValue = ref<SmTableThSortingOrder>(props.sortingOrder as any)

/**
 * Internal sortable icon when sortingIcon prop is not provided
 */
const icon = ref<string>('action-switch-vert')

const displayedIcon = computed(() => props.sortingIcon ?? icon.value)

const tableSortA11yLabel = computed(() => {
  return sortingOrderValue.value === SmTableThSortingOrder.ASC
    ? i18n.t('sui-core.components.sm-table.sm-table.a11y__table-sort-descending')
    : i18n.t('sui-core.components.sm-table.sm-table.a11y__table-sort-ascending')
})

const onClick = () => {
  if (sortingOrderValue.value === SmTableThSortingOrder.ASC) {
    sortingOrderValue.value = SmTableThSortingOrder.DESC
    icon.value = 'sort-descending'
    emit('sortingTableOrder', sortingOrderValue.value)
  } else {
    sortingOrderValue.value = SmTableThSortingOrder.ASC
    icon.value = 'sort-ascending'
    emit('sortingTableOrder', sortingOrderValue.value)
  }
}

defineExpose ({
  onClick,
  displayedIcon,
  tableSortA11yLabel,
})
</script>

<template>
  <th
    class="sm-table-th"
    :class="[{ 'sm-table-th--static-header': staticHeader }, rootClass]"
    :colspan="colspan"
    :scope="colspan ? 'colgroup' : undefined"
    :style="{ width: width }"
    @click="onClick"
  >
    <div>
      <!-- @slot The body of the header column -->
      <slot />
      <!-- The sortable button -->
      <button
        v-if="sortable"
        class="sm-table-th__sort-button"
        :aria-label="tableSortA11yLabel"
      >
        <sm-icon
          class="sm-table-th__icon"
          :name="displayedIcon"
        />
      </button>
    </div>
  </th>
</template>

<style lang="scss" scoped>
@import "./../../common/variables";
@import "./../../common/mixins";

$sm-table-th--border: $light-blue-grey;
$sm-table-th--icon--color: $blue-neu-dark;
$sm-table-th--top--color: $grey-neu-white;
$sm-table-th--background--color: $blue-neu-med;

.sm-table-th {
  border: 1px solid $sm-table-th--border;
  border-right: 0;
  padding: $sm-12;
  min-height: 46px;
  text-align: left;
  background-color: $sm-table-th--background--color;
  font-weight: 600;

  &:last-child {
    border-right: 1px solid $sm-table-th--border;
  }

  &--static-header {
    background-color: $sm-table-th--top--color;
    padding: $sm-8 $sm-12;
    border-bottom: 0;
  }

  &__icon {
    font-size: 16px;
    color: $sm-table-th--icon--color;
  }

  &__sort-button {
    border: 0;
    background: transparent;
    cursor: pointer;
    padding: 0 6px;

    &:focus:not(:focus-visible) {
      box-shadow: none;
      outline: none;
    }

    &:focus:focus-visible {
      @include shadow-outline;
    }
  }
}
</style>
