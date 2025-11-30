<script setup lang="ts">
import SmLoadingBar from '../sm-loading-bar/sm-loading-bar.vue'

withDefaults(defineProps<{
  /**
   * The number of rows to show
   */
  totalRows?: number | string
  /**
   * The number of column to show
   */
  totalColumns?: number | string
}
>(), {
  totalRows: 3,
  totalColumns: 3,
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
</script>

<template>
  <div class="sm-loading-table">
    <table>
      <thead>
        <tr>
          <th />
          <th
            v-for="k in Number(totalColumns)"
            :key="k"
            class="sm-loading-table__th"
          >
            <sm-loading-bar class="sm-loading-table__th__loading-bar" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="i in Number(totalRows)"
          :key="i"
        >
          <td class="sm-loading-table__first-column">
            <sm-loading-bar
              class="sm-loading-table__first-column__loading-bar"
            />
          </td>
          <td
            v-for="j in Number(totalColumns)"
            :key="j"
            class="sm-loading-table__td"
          >
            <sm-loading-bar class="sm-loading-table__td__loading-bar" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../common/variables';
@import '../../../common/mixins';

.sm-loading-table {
  table {
    height: 100%;
    width: 100%;
  }

  &__th {
    &__loading-bar {
      height: 16px;
      width: 40%;
      margin-bottom: 32px;
    }
  }

  &__td {
    &__loading-bar {
      height: 16px;
      width: 85%;
      margin-bottom: 32px;
    }
  }

  &__first-column {
    width: 50px;

    &__loading-bar {
      height: 16px;
      width: 16px;
      margin-bottom: 32px;
    }
  }

  tr {
    &:nth-child(2n) {
      .sm-loading-table__td__loading-bar {
        width: 75%;
      }
    }
  }
}
</style>
