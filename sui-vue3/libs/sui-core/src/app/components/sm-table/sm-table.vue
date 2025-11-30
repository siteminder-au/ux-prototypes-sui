<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
import { SmTableSize } from './sm-table.types'

const props = withDefaults(defineProps<{
  /**
   * Show fixed header on top
   */
  fixedHeader?: boolean
  /**
   * Show fixed column header on left
   */
  fixedHeaderLeft?: boolean
  /**
   * Show fixed column header on right
   */
  fixedHeaderRight?: boolean
  /**
   * Show fixed footer on bottom
   */
  fixedFooter?: boolean
  /**
   * Whether to show gradient from left and right corner
   */
  showGradient?: boolean
  /**
   * Whether to add a custom class to table element
   */
  rootClass?: string | null
  /**
   * Whether to add a custom class to the scrollbar container of the table element
   */
  contentClass?: string | null
  /**
   * Whether the scrollbar vertical/horizontal is visible all times
   */
  visibleScrollbar?: boolean
  /**
   * Whether the scrollbar horizontal is visible all times
   */
  visibleScrollbarX?: boolean
  /**
   * Set the min-width of a table element, it limits the width property to be not smaller than the value specified in min-width
   */
  minWidth?: string
  /**
   * The size of the table. Accepts: 'x-small', 'small', 'medium', 'large', 'x-large'
   */
  size?: SmTableSize
  /**
   * Whether the table is responsive
   */
  isResponsive?: boolean
}>(), {
  fixedHeader: false,
  fixedHeaderLeft: false,
  fixedHeaderRight: false,
  fixedFooter: false,
  showGradient: false,
  rootClass: null,
  contentClass: null,
  visibleScrollbar: false,
  visibleScrollbarX: false,
  minWidth: '',
  size: SmTableSize.MEDIUM,
  isResponsive: false,
})

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
  },
})

const targetElement: Ref<HTMLElement | null> = ref(null)
const tableScrollbarRef = ref<any>(null)
const gradientLeft = ref<boolean>(true)
const gradientRight = ref<boolean>(true)
const isShadowLeft = ref<boolean>(false)
const isShadowRight = ref<boolean>(false)

const getTableCotnainerRef = (): any => tableScrollbarRef.value

const onScrollEvent = () => {
  const contnetWidth: any = tableScrollbarRef.value.offsetWidth
  const scrollPosition = tableScrollbarRef.value?.scrollLeft
  const targetWidth = targetElement.value?.offsetWidth
  let diff
  if (targetWidth) {
    if (targetWidth > contnetWidth) {
      diff = targetWidth - contnetWidth
    }
  }
  // const diff = targetWidth > contnetWidth ? !!targetWidth - contnetWidth : false
  if (props.showGradient || props.fixedHeaderLeft || props.fixedHeaderRight) {
    if (diff === scrollPosition) {
      gradientRight.value = false
      isShadowRight.value = false
    } else if (scrollPosition === 0) {
      gradientLeft.value = false
      isShadowLeft.value = false
    } else {
      gradientRight.value = true
      gradientLeft.value = true
      isShadowLeft.value = true
      isShadowRight.value = true
    }
  }
}
/* c8 ignore stop */

onMounted(() => {
  onScrollEvent()
})

defineExpose({
  targetElement,
  onScrollEvent,
  gradientLeft,
  gradientRight,
  tableScrollbarRef,
  getTableCotnainerRef,
  isShadowLeft,
  isShadowRight,
})
</script>

<template>
  <div
    ref="tableScrollbarRef"
    class="sm-table-container"
    :class="[
      {
        'sm-table-container--scrollbar sm-table-container--scrollbar--x': visibleScrollbarX,
        'sm-table-container--scrollbar': visibleScrollbar,
        'sm-table-container--linear-gradient': showGradient,
        'sm-table-container--linear-gradient-left': showGradient && gradientLeft,
        'sm-table-container--linear-gradient-right': showGradient && gradientRight,
        'sm-table-container--fixed-column': fixedHeaderLeft || fixedHeaderRight,
      },
      contentClass,
    ]"
    @scroll="onScrollEvent"
  >
    <table
      ref="targetElement"
      class="sm-table"
      :style="{ minWidth: minWidth }"
      :class="[
        {
          'sm-table--fixed-header-left': fixedHeaderLeft,
          'sm-table--fixed-header-right': fixedHeaderRight,
          'sm-table--fixed-footer': fixedFooter,
          'sm-table--fixed-header': fixedHeader,
          'sm-table--shadow-left': isShadowLeft,
          'sm-table--shadow-right': isShadowRight,
          [`sm-table--size-${size}`]: !!size,
          'sm-table--is-responsive': !!isResponsive
        },
        rootClass,
      ]"
    >
      <!-- @slot The header, body and footer of the table -->
      <slot />
    </table>
  </div>
</template>

<style lang="scss">
@import "./../../common/variables";
@import "./../../common/mixins";

$sm-table--header--background-color: $blue-neu-med;
$sm-table--border: $light-blue-grey;
$sm-table-th--background--color: $grey-neu-white;
$sm-table--scrollbar-color: $blue-neu-dark;
$sm-table-td--border-active: $primary-blue;

.sm-table {
  --horizontal-gutter: 56px;

  position: relative;
  width: 100%;
  border-spacing: 0;
  border-radius: 4px;
  overflow: auto;
  table-layout: fixed;

  /**
   * fixed column header left
   */
  td {
    background: white;
  }

  &--fixed-header-left {
    td:first-child,
    th:first-child {
      position: sticky;
      background-color: white;
      left: 0;
      border-radius: 0;
      z-index: 1;

      &::after {
        content: "";
        width: 15px;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
      }
    }

    td:first-child:not(.sm-table-td--expandableRow),
    th:first-child:not(.sm-table-td--expandableRow) {
      background-color: $sm-table--header--background-color;
    }

    th:first-child {
      z-index: $sm-table-sticky-column;
    }
  }

  &--shadow-left {
    td:first-child,
    th:first-child {
      box-shadow: inset 1px 0 0 0 #c6d0e0, inset -1px 0 0 0 #c6d0e0;
      border-left: 0;

      &::after {
        box-shadow: 1px 0 1px -4px rgba(24, 58, 108, 0.14), 6px 0 9px -3px rgba(24, 58, 108, 0.14), 5px 0 11px -15px rgba(24, 58, 108, 0.15);
      }
    }

    td:nth-child(2),
    th:nth-child(2) {
      border-left: 0;
    }
  }

  /**
   * fixed column header right
   */
  &--fixed-header-right {
    td:last-child,
    th:last-child {
      position: sticky;
      background-color: $sm-table--header--background-color;
      right: 0;
      border-right: 0;
      border-radius: 0;
      z-index: 1;

      &::after {
        content: "";
        width: 15px;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    }

    tr {
      &:focus,
      &:hover {
         td:last-child {
          background-color: $sm-table--header--background-color;
        }
      }
    }
  }

  &--shadow-right {
    td:last-child,
    th:last-child {
      &::after {
        box-shadow: 1px 0 1px -4px rgba(24, 58, 108, 0.14), -6px 0 9px -3px rgba(24, 58, 108, 0.14), -5px 0 11px -15px rgba(24, 58, 108, 0.15);
      }
    }
  }

  /**
   * fixed footer
   */
  &--fixed-footer {
    tfoot {
      td {
        position: sticky;
        bottom: 0;
        border-radius: 0;
        background-color: white;
        border-bottom: 0;
        box-shadow: inset 0 1px 0 #c6d0e0, inset 0 -1px 0 #c6d0e0;
        z-index: $sm-table-sticky-row;

        &::after {
          content: "";
          width: 100%;
          height: 15px;
          position: absolute;
          top: 0;
          left: 0;
          box-shadow: 0 -1px 1px -4px rgba(24, 58, 108, 0.14), 0 -6px 9px -3px rgba(24, 58, 108, 0.14), 0 -5px 11px -15px rgba(24, 58, 108, 0.15);
        }

        &:first-child {
          z-index: $sm-table-sticky-column;
        }
      }
    }
  }

  &--fixed-header,
  &--fixed-header-left,
  &--fixed-header-right {
    .sm-table-th {
      &::after {
        box-shadow: none !important;
      }
    }
  }

  /**
   * fixed header
   */
  &--fixed-header {
    .sm-table-th {
      position: sticky;
      top: 0;
      background-color: $sm-table-th--background--color;
      font-weight: normal;
      border-top: 0;
      z-index: $sm-table-sticky-row;

      &::after {
        content: "";
        width: 100%;
        height: 15px;
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }

    .sm-table-thead {
      tr {
        &:first-child {
          .sm-table-th {
            top: -1px;
            font-weight: 600;
            border-top: 1px solid $sm-table--border;

            &::after {
              box-shadow: 0 6px 9px -5px rgba(24, 58, 108, 0.14), 0 5px 11px -5px rgba(24, 58, 108, 0.15);
            }

            &:not(.sm-table-th--static-header) {
              background-color: $sm-table--header--background-color;
            }
          }
        }

        &:nth-child(2) {
          .sm-table-th {
            background-color: $sm-table--header--background-color;
            top: 34px;
            font-weight: 600;
            border-top: 1px solid $sm-table--border;

            &::after {
              box-shadow: 0 6px 9px -5px rgba(24, 58, 108, 0.14), 0 5px 11px -5px rgba(24, 58, 108, 0.15);
            }
          }
        }
      }
    }
  }

  .sm-table-tbody {
    th {
      background-color: $sm-table-th--background--color;
      font-weight: normal;
      border-top: 0;
    }
  }

  tbody:last-child {
    tr:last-of-type {
      td {
        &:first-of-type {
          border-bottom-left-radius: 4px;
        }

        &:last-of-type {
          border-bottom-right-radius: 4px;
        }
      }
    }
  }

  tfoot:last-child {
    tr:last-of-type {
      td {
        &:first-of-type {
          border-bottom-left-radius: 4px;
        }

        &:last-of-type {
          border-bottom-right-radius: 4px;
        }
      }
    }
  }

  .sm-table-thead {
    tr {
      &:first-of-type {
        th {
          &:first-of-type {
            border-top-left-radius: 4px;
          }

          &:last-of-type {
            border-top-right-radius: 4px;
          }
        }
      }
    }
  }

  .sm-input--type-textarea .sm-input__body,
  .sm-input--type-textarea textarea {
    min-height: 46px;
    width: 100% !important;
  }

  // table size x-small
  &--size-x-small {
    .sm-table-tr {
      .sm-table-th, .sm-table-td__content, .sm-input--editable-cell.sm-input .sm-input__field,
      .sm-select .multiselect .multiselect__tags, .sm-table-td__heading {
        padding: $sm-8;
        font-size: 13px;
        line-height: 20px;
        letter-spacing: -0.1px;
      }

      .sm-table-td__arrow {
        padding-top: $sm-12;
      }

      .sm-input--type-textarea .sm-input__body,
      .sm-input--type-textarea textarea {
        min-height: 36px;
      }
    }
  }

  // table size small
  &--size-small {
    .sm-table-tr {
      .sm-table-th.sm-table-th--static-header {
        padding: $sm-8 $sm-12;
      }

      .sm-table-th, .sm-table-td__content, .sm-input--editable-cell.sm-input .sm-input__field,
      .sm-select .multiselect .multiselect__tags, .sm-table-td__heading {
        padding: $sm-12;
        font-size: 13px;
        line-height: 20px;
        letter-spacing: -0.1px;
      }

      .sm-input--type-textarea .sm-input__body,
      .sm-input--type-textarea textarea {
        min-height: 44px;
      }
    }
  }

  // table size large
  &--size-large {
    .sm-table-tr {
      .sm-table-th.sm-table-th--static-header {
        padding: $sm-12 $sm-16;
      }

      .sm-table-td__arrow {
        padding-top: $sm-20;
      }

      .sm-table-th, .sm-table-td__content, .sm-input--editable-cell.sm-input .sm-input__field,
      .sm-select .multiselect .multiselect__tags, .sm-table-td__heading {
        padding: $sm-16;
      }
    }
  }

  // table size x-large
  &--size-x-large {
    .sm-table-tr {
      .sm-table-th.sm-table-th--static-header {
        padding: $sm-16 $sm-24;
      }

      .sm-table-th {
        .sm-table-th--static-header {
          padding: $sm-16 $sm-24;
        }
      }

      .sm-table-td__arrow {
        padding-top: $sm-24;
      }

      .sm-table-th, .sm-table-td__content, .sm-input--editable-cell.sm-input .sm-input__field,
      .sm-select .multiselect .multiselect__tags, .sm-table-td__heading {
        padding: $sm-20 $sm-24;
      }
    }
  }

  .sm-table-td__content.sm-table-td__no-padding {
    padding: 0;
  }

  // Responsive table Style
  &--is-responsive {
    .sm-table-td__heading {
      display: none;
    }

    @media (max-width: #{$viewport--mobile}) {
      .sm-table-thead {
        position: absolute;
        left: -9999px;
        overflow: hidden;
        width: 0;
        height: 0;
      }

      .sm-table-tr {
        display: block;
        margin-bottom: $sm-24;
        border-bottom: 1px solid $sm-table--border;

        .sm-table-td {
          display: flex;
          border-top: 1px solid $sm-table--border;
          border-right: 1px solid $sm-table--border;
          border-left: 1px solid $sm-table--border;
          border-bottom: 0;
          min-height: auto;
        }
      }

      .sm-table-td--active-cell {
        .sm-table-td__container {
          outline: 1px solid $sm-table-td--border-active;
        }
      }

      .sm-table-td__heading {
        padding: $sm-12;
        width: 38%;
        background: $sm-table--header--background-color;
        display: flex;
        align-items: center;
        margin: -1px;
        border-right: 1px solid $sm-table--border;
        font-weight: 600;
      }
    }

    tfoot:last-child {
      tr:last-of-type {
        td {
          &:first-of-type {
            border-bottom-left-radius: 0;
          }

          &:last-of-type {
            border-bottom-right-radius: 0;
          }
        }
      }
    }
  }
}

.sm-table-container {
  &--fixed-column {
    overflow: auto;
    scroll-behavior: smooth;
  }

  &--linear-gradient {
    overflow: auto;
    scroll-behavior: smooth;
  }

  &--linear-gradient-left {
    &::before {
      left: 0;
      content: "";
      position: absolute;
      top: 0;
      height: 100%;
      z-index: $sm-table-gradient;
      pointer-events: none;
      width: 32px;
      background-image: linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.84), rgba(255, 255, 255, 0));
    }
  }

  &--linear-gradient-right {
    &::after {
      right: 0;
      content: "";
      position: absolute;
      top: 0;
      height: 100%;
      z-index: $sm-table-gradient;
      pointer-events: none;
      width: 32px;
      background-image: linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.84), rgba(255, 255, 255, 0));
    }
  }

  &--scrollbar {
    overflow: auto;

    // Note that We could not use 100vh since that would hide the scrollbar partially due to the space that's automatically added to the container
    max-height: 95vh;
    height: auto;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;

    // taken from the boxShadow.default value from tailwind.config.js file
    // in PP: frontends/property/tailwind.config.js
    box-shadow: 0 5px 11px -5px rgba(24, 58, 108, 0.15), 0 6px 9px -5px rgba(24, 58, 108, 0.14), 0 1px 1px -1px rgba(24, 58, 108, 0.14);

    &::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      pointer-events: auto;
      z-index: 2;
      background: $sm-table--scrollbar-color;
      border-radius: 8px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: $grey-neu-dark;
    }

    &::-webkit-scrollbar-track {
      border-radius: 8px;
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }

    .sm-table-thead {
      tr {
        &:first-child {
          .sm-table-th {
            top: 0;
          }
        }

        &:nth-child(2) {
          .sm-table-th {
            top: 35px;
          }
        }
      }
    }
  }

  &--scrollbar--x {
    &::-webkit-scrollbar {
      -webkit-appearance: none;

      &:horizontal {
        width: 8px;
        height: 8px;
      }

      &:vertical {
        width: 0;
        height: 0;
      }
    }
  }
}
</style>
