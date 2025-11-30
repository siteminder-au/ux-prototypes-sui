<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from '../../libs/vue-i18n'
import { useUniqueId } from '../use/unique-id'
import SmButton from '../sm-button/sm-button.vue'
import { SmButtonShape, SmButtonType } from '../sm-button/sm-button.types'
import SmInput from '../forms/sm-input/sm-input.vue'
import { SmInputType } from '../forms/sm-input/sm-input.types'
import { SmPaginationType } from './sm-pagination.types'
import SmSelect from '../forms/sm-select/sm-select.vue'

const props = withDefaults(defineProps<{
  /**
   * The current page number
   */
  currentPage: number
  /**
   * The total number of items
   */
  totalItems: number
  /**
   * The number of items to show per page
   */
  itemsPerPage: number
  /**
   * The max number of page buttons to show
   */
  maxVisibleButtons?: number
  /**
   * The dropdown list of user selected items to show per page
   */
  itemsPerPageSets?: number[]
  /**
   * The input field to help go directly to a page
   */
  showGoToInput?: boolean
  /**
   * The totalItem counter and active set of items text
   */
  showItemCount?: boolean
  /**
   * The style of the pagination. Accepts 'standard', 'expanded'
   */
  type?: SmPaginationType
  /**
   * Callback before clicking on prev button, and it will prevent page to change
   * @default function(setPrevPage) setPrevPage is used to go previous page
   */
  beforePrevPageChange?: (setPrevPage: () => void) => void
  /**
   * Callback before clicking on next button, and it will prevent page to change
   * @default function(setNextPage) setNextPage is used to go next page
   */
  beforeNextPageChange?: (setNextPage: () => void) => void
  /**
   * Callback before page number change, and it will prevent page to change
   * @default function (to: number, from: number, next: (index: number = to) => void)
   */
  beforePageNumberChange?: (pageNumber: number, from: number, next: (index?: number) => void) => void
  /**
   * Callback before page size change, and it will prevent page to change
   * @default function (to: number, from: number, next: (index: number = to) => void)
   */
  beforePageSizeChange?: (to: number, from: number, next: (index?: number) => void) => void
}>(), {
  currentPage: undefined,
  totalItems: undefined,
  itemsPerPage: undefined,
  maxVisibleButtons: 5,
  itemsPerPageSets: () => [10, 20, 50, 75, 100],
  showGoToInput: false,
  showItemCount: true,
  type: SmPaginationType.STANDARD,
  beforePrevPageChange: (setPrevPage: () => void) => setPrevPage(),
  beforeNextPageChange: (setNextPage: () => void) => setNextPage(),
  beforePageNumberChange: (pageNumber: number, from: number, next: (index: number) => void) => next(pageNumber),
  beforePageSizeChange: (to: number, from: number, next: (index: number) => void) => next(to),
})

const emit = defineEmits<{
  nextPage: []
  prevPage: []
  'update:currentPage': [value: number]
  'update:itemsPerPage': [value: number]
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
// Auto-generate required name props for the pagination inputs and select
const { id: paginationId } = useUniqueId('sm-pagination__')
const paginationInputId = computed(() => `${paginationId.value ?? ''}__input`)
const paginationSelectId = computed(() => `${paginationId.value ?? ''}__select`)

const itemsPerPage = computed<number>({
  get: () => props.itemsPerPage,
  set: (state) => {
    emit('update:itemsPerPage', Number(state))
  },
})

const totalPages = computed(() => Math.ceil(props.totalItems / itemsPerPage.value))

const totalResults = computed(() => props.totalItems)

const activePage = computed<number>({
  get: () => props.currentPage,
  set: (state) => {
    if (state >= 1 && state <= totalPages.value) {
      emit('update:currentPage', Number(state))
    }
  },
})

const isFirstPage = computed(() => activePage.value <= 1)

const isLastPage = computed(() => activePage.value >= totalPages.value)

/**
 * Goes to the previous page for the Previous button
 */
const setPrevPage = (): void => {
  if (isFirstPage.value) {
    return
  }
  if (typeof props.beforePrevPageChange === 'function') {
    props.beforePrevPageChange(() => {
      activePage.value -= 1
    })
  } else {
    activePage.value -= 1
  }
  emit('prevPage')
}

/**
 * Goes to the next page for the Next button
 */
const setNextPage = (): void => {
  if (isLastPage.value) {
    return
  }
  if (typeof props.beforeNextPageChange === 'function') {
    props.beforeNextPageChange(() => {
      activePage.value += 1
    })
  } else {
    activePage.value += 1
  }
  emit('nextPage')
}

/**
 * Go directly to a page or cycle through a set of pages based on page number
 */
const goToPage = (pageNumber: number): void => {
  const from = activePage.value
  props.beforePageNumberChange(pageNumber, from, (tabIndex: number = pageNumber) => {
    if (tabIndex === -1) {
      activePage.value += (props.maxVisibleButtons - 4)
    } else if (tabIndex === -2) {
      activePage.value -= (props.maxVisibleButtons - 4)
    } else {
      activePage.value = tabIndex
    }
  })
}

/**
 * Function to check if the the button is a cycler button
 * Cycler button is used to cycle through the next set of pages
 */
const isPageCycler = (page: number): boolean => {
  if (page === -1 || page === -2) {
    return true
  }
  return false
}

/**
 * Find the active range of numbers for the expanded view
 */
const activeRange = (start: number, end: number): number[] => {
  return Array.from(Array(end - start + 1), (_, i) => i + start)
}

/**
 * Returns an array of page numbers based on the totalPages, currentPage & maxVisibleButtons
 * where a negative number in the returned array denotes a gap in the series.
 */
const getPageList = (): number[] => {

  const availablePages = totalPages.value
  const current = activePage.value
  const maxButtons = props.maxVisibleButtons
  if (maxButtons < 5) throw new Error('maxButtons must be at least 5')
  const sideBreaks = 1
  const leftBreak = (maxButtons - sideBreaks * 2 - 3) >> 1 // eslint-disable-line no-bitwise
  const rightBreak = (maxButtons - sideBreaks * 2 - 2) >> 1 // eslint-disable-line no-bitwise

  if (availablePages <= maxButtons) {

    // No breaks in list
    return activeRange(1, availablePages)
  }

  if (current <= maxButtons - sideBreaks - 1 - rightBreak) {

    // No break to the left
    return activeRange(1, maxButtons - sideBreaks - 1)
      .concat(-1, activeRange(availablePages - sideBreaks + 1, availablePages))
  }
  if (current >= availablePages - sideBreaks - 1 - rightBreak) {

    // No break to the right
    return activeRange(1, sideBreaks)
      .concat(-2, activeRange(availablePages - sideBreaks - 1 - rightBreak - leftBreak, availablePages))
  }

  // Breaks on both sides
  return activeRange(1, sideBreaks)
    .concat(
      -2,
      activeRange(current - leftBreak, current + rightBreak),
      -1,
      activeRange(availablePages - sideBreaks + 1, availablePages),
    )
}

/**
 * Start page of the current set of items within the page
 */
const currentSetStart = (): number => {
  return (activePage.value - 1) * itemsPerPage.value + 1
}

/**
 * End page of the current set of items within the page
 */
const currentSetEnd = (): number => {

  if (isLastPage.value) {
    return props.totalItems
  }
  return (activePage.value * itemsPerPage.value)
}

const selection = ref(itemsPerPage.value.toString())

/**
 * Watch the select field value and default to the first page on change
 */
watch(() => selection.value, (newVal: string, oldVal: string) => {
  if (typeof oldVal === 'undefined') {
    return
  }
  if (newVal !== oldVal) {
    pageSizeChange(newVal)
  }
})

/**
 * Set default value to the first on page size change
 */
const pageSizeChange = (newVal: string): void => {
  const from = activePage.value
  const to = 1
  props.beforePageSizeChange(to, from, (tabIndex: number = to) => {
    activePage.value = tabIndex // reset the page to the first pages
    itemsPerPage.value = Number(newVal)
  })
}

/**
 * Options for the per page select field
 */
const options = (): any[] => {
  const dropdownOptions: any[] = []
  props.itemsPerPageSets.forEach((pageSet) => {
    dropdownOptions.push({
      label: i18n.t('sui-core.components.sm-pagination.sm-pagination.dropdown-items-per-page', { itemsPerPage: pageSet }),
      code: pageSet.toString(),
    })
  })
  return dropdownOptions
}

/**
 * Button type for the cycler buttons
 */
const buttonType = (page: number): SmButtonType | undefined => {
  if (isPageCycler(page)) {
    return SmButtonType.TEXT
  }
}

const focussed = ref(false)

/**
 * Changes the cycler icons on hover and focus
 */
const changeCyclerIcon = (page: number, isFocussed: boolean): void => {
  if (isPageCycler(page)) {
    focussed.value = isFocussed
  }
}

const pageCyclerA11yLabel = (page: number) => {
  if (page === -1) {
    return i18n.t(
      'sui-core.components.sm-pagination.sm-pagination.a11y__jump-forward-button',
    )
  }

  if (page === -2) {
    return i18n.t(
      'sui-core.components.sm-pagination.sm-pagination.a11y__jump-backward-button',
    )
  }

  // Don't add aria-label and use text content (page number) instead
  return null
}

const inputSize = computed(() => totalPages.value.toString().length)

defineExpose({
  props,
  totalResults,
  totalPages,
  activePage,
  setPrevPage,
  setNextPage,
  isFirstPage,
  isLastPage,
  goToPage,
  getPageList,
  isPageCycler,
  currentSetStart,
  currentSetEnd,
  selection,
  options,
  buttonType,
  changeCyclerIcon,
  focussed,
  pageCyclerA11yLabel,
})
</script>

<template>
  <div class="sm-pagination">
    <div class="sm-pagination__wrap">
      <div class="sm-pagination__controls">
        <sm-button
          :type="SmButtonType.TERTIARY"
          class="sm-pagination__prev"
          :class="{ 'sm-pagination__prev--expanded': type === 'expanded'}"
          :disabled="isFirstPage"
          :shape="SmButtonShape.SQUARE"
          :aria-label="i18n.t('sui-core.components.sm-pagination.sm-pagination.a11y__click-to-previous-button')"
          @click="setPrevPage()"
        >
          <sm-icon name="arrow-left" />
        </sm-button>

        <div
          v-if="type === 'standard'"
          class="sm-pagination--standard"
        >
          <sm-input
            v-model="activePage"
            :error-disabled="true"
            :max="String(totalPages)"
            min="1"
            class="sm-pagination--input"
            :label="i18n.t('sui-core.components.sm-pagination.sm-pagination.a11y__input-field-label')"
            :label-hidden="true"
            :name="`${paginationInputId}-standard`"
            :type="SmInputType.NUMBER"
            :size="inputSize"
          />
          {{ i18n.t('sui-core.components.sm-pagination.sm-pagination.of-total-pages', { totalPages: totalPages }) }}
        </div>

        <div
          v-if="type === 'expanded'"
          class="sm-pagination--expanded"
        >
          <sm-button
            v-for="(page, i) in getPageList()"
            :key="i"
            :type="buttonType(page)"
            class="sm-pagination--expanded-page-button"
            :aria-label="pageCyclerA11yLabel(page)"
            :class="{
              'sm-pagination--current': page === activePage
            }"
            @click="goToPage(page)"
            @mouseover="changeCyclerIcon(page, true)"
            @focusin="changeCyclerIcon(page, true)"
            @mouseout="changeCyclerIcon(page, false)"
            @focusout="changeCyclerIcon(page, false)"
          >
            <span v-if="!isPageCycler(page)">{{ page }}</span>
            <div
              v-else
              class="sm-pagination--cycler"
            >
              <sm-icon
                v-show="!focussed"
                name="action-context-menu"
              />
              <sm-icon
                v-show="focussed && page === -2"
                name="arrow-left-alt"
              />
              <sm-icon
                v-show="focussed && page === -1"
                name="arrow-right-alt"
              />
            </div>
          </sm-button>
        </div>

        <sm-button
          :type="SmButtonType.TERTIARY"
          class="sm-pagination__next"
          :class="{ 'sm-pagination__next--expanded': type === 'expanded'}"
          :disabled="isLastPage"
          :shape="SmButtonShape.SQUARE"
          :aria-label="i18n.t('sui-core.components.sm-pagination.sm-pagination.a11y__click-to-next-button')"
          @click="setNextPage()"
        >
          <sm-icon name="arrow-right" />
        </sm-button>

        <div
          v-if="showGoToInput"
          class="sm-pagination__go-to"
        >
          <span class="sm-pagination__go-to-label">{{ i18n.t('sui-core.components.sm-pagination.sm-pagination.go-to-label') }}</span>

          <sm-input
            v-model.number="activePage"
            :error-disabled="true"
            :max="String(totalPages)"
            min="1"
            class="sm-pagination--input"
            :label-hidden="true"
            :label="i18n.t('sui-core.components.sm-pagination.sm-pagination.a11y__input-field-label')"
            :name="`${paginationInputId}-expanded`"
            :type="SmInputType.NUMBER"
            :size="inputSize"
          />
        </div>
      </div>

      <sm-select
        v-model="selection"
        :label-hidden="true"
        :error-disabled="true"
        class="sm-pagination__items-per-page"
        rules="required"
        :name="paginationSelectId"
        :options="options()"
        :filterable="false"
      />
    </div>

    <div
      v-if="showItemCount"
      class="sm-pagination--page-count"
    >
      {{ i18n.t('sui-core.components.sm-pagination.sm-pagination.page-count',
                { totalResults: totalResults, startPage: currentSetStart(), endPage: currentSetEnd() })
      }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../common/variables";

$sm-pagination--prev-next-icon-color: $primary-blue;
$sm-pagination--clicked-button-background-color: $blue-neu-mid;
$sm-pagination--current-button-background-color: $light-blue-grey;
$sm-pagination--page-button-hover-background-color: $blue-neu-med;
$sm-pagination--text-icon-color: $primary-blue;

.sm-pagination {
  &__wrap {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
  }

  &__controls {
    display: flex;
    align-items: center;
  }

  &__prev {
    margin-right: $sm-24;

    &--expanded {
      margin-right: $sm-8;
    }
  }

  &__next {
    margin-left: $sm-24;

    &--expanded {
      margin-left: $sm-8;
    }
  }

  &__go-to {
    margin-left: $sm-24;
    display: flex;
    align-items: center;

    &-label {
      margin-right: $sm-8;
    }
  }

  &__items-per-page {
    margin-left: $sm-20;
  }

  &--standard {
    align-items: center;
    display: flex;
  }

  &--expanded {
    display: inline-block;
  }

  &--expanded {
    &-page-button.sm-button {
      padding-bottom: 3px;

      :deep(.sm-button__content) {
        border-radius: 16px;
        height: $sm-32;
        justify-content: center;
        min-width: $sm-32;
        padding: 5px $sm-4;
      }
    }

    &-page-button + &-page-button {
      margin-left: $sm-8;
    }
  }

  &--current.sm-button {
    :deep(.sm-button__content) {
      background: $sm-pagination--current-button-background-color;
    }
  }

  &--input {
    display: inline-block;
    margin-right: $sm-8;

    :deep(input) {
      text-align: center;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        appearance: none;
      }
    }
  }
}
</style>
