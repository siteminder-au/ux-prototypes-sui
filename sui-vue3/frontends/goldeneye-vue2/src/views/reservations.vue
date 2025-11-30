<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTranslate } from '@/composables/use-translate'
import ReservationsListFilters from '@/components/reservations/reservations-list-filters.vue'
import { ReservationsListFiltersParams } from '@/components/reservations/reservations-list-filters.types'
import { getReservations } from '@/mocks/reservations'
import { Reservations } from '@/views/reservations.types'

type SortingOrder = 'asc' | 'desc' | null

const { t } = useTranslate('views.reservations')

const columns = ref(8)
const currentReservationsPage = ref(1)
const itemsToShow = ref(10)
const filteredReservations = ref<Reservations[]>([])
const searchQuery = ref()
const searchFeedbackDialog = ref(false)
const sortingBookingRef = ref<SortingOrder>('asc')
const reservationsList = ref<Reservations[]>(getReservations())

const paginatedReservations = computed(() => {
  const start = (currentReservationsPage.value - 1) * itemsToShow.value
  const end = start + itemsToShow.value

  // Sort whole list first
  const sortedReservations = [...reservationsList.value].sort((a, b) => {
    if (sortingBookingRef.value === 'asc') {
      return a.bookingId.localeCompare(b.bookingId)
    }

    return b.bookingId.localeCompare(a.bookingId)
  })

  // Then paginate
  return sortedReservations.slice(start, end)
})

const onBeforePrevPageChange = (setPrevPage: () => void): void => {
  console.info('onBeforePrevPageChange')
  // do stuff
  setPrevPage()
}

const onBeforeNextPageChange = (setNextPage: () => void): void => {
  console.info('onBeforeNextPageChange')
  // do stuff
  setNextPage()
}

const onBeforePageNumberChange = (pageNumber: number, from: number, next: () => void): void => {
  console.info('onBeforePageNumberChange', pageNumber, from)
  // do stuff
  next()
}

const onBeforePageSizeChange = (to: number, from: number, next: () => void): void => {
  console.info('onBeforePageSizeChange', to, from)
  // do stuff
  next()
}

// Not implemented, but log the inputs so we can validate the v-models
const searchReservations = (searchParams: ReservationsListFiltersParams): void => {
  console.info('searchReservations', searchParams)
  searchQuery.value = searchParams
  searchFeedbackDialog.value = true
}

const sortByBookingReference = (newOrder: SortingOrder): void => {
  sortingBookingRef.value = newOrder
}

// Controller
// Initializing const for controller
const table = ref<HTMLElement>()

// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
const tableContainer = computed<HTMLElement>(() => (table.value ? (table.value as any).getTableCotnainerRef() : ''))

const totalItemsLength = ref(7)
const tableWidth = ref(195)
const steps = ref<number>(0)

const moveToColumn = (): void => {
  const itemWidth = steps.value * tableWidth.value
  tableContainer.value.scrollLeft = itemWidth
}

// Click on left arrow
const goBack = (): void => {
  if (steps.value > 0) {
    steps.value -= 1
    moveToColumn()
  }
}

// Click on right arrow
const goNext = (): void => {
  if (steps.value < totalItemsLength.value) {
    steps.value += 1
    moveToColumn()
  }
}

// Click on left most arrow
const goToFirst = (): void => {
  tableContainer.value.scrollLeft = 0
  steps.value = 0
}

// Click on right most arrow
const goToLast = (): void => {
  const getTotalItemWidth = (totalItemsLength.value + 1) * tableWidth.value
  const getCurrentOffsetWidth = tableContainer.value.offsetWidth
  const getSteps = Math.round((getTotalItemWidth - getCurrentOffsetWidth) / tableWidth.value)
  tableContainer.value.scrollLeft = getTotalItemWidth
  steps.value = getSteps === 0 ? 1 : getSteps
}
</script>

<template>
  <sm-section class="reservations">
    <sm-container :full-width="true">
      <sm-page-title :title="t('page-title')" />

      <reservations-list-filters @search="searchReservations" />

      <template v-if="!filteredReservations.length">
        <sm-404-page
          :full-page="false"
          :responsive="false"
        >
          <template #image>
            <img
              width="200"
              height="200"
              alt=""
              role="presentation"
              src="https://sui-assets.siteminder.com/sm/illu-md/illu-md-system-down.svg"
            >
          </template>
          <template #header>
            <h3>{{ t('not-implemented') }}</h3>
          </template>
          <template #description>
            {{ t('not-implemented-description') }}
          </template>
        </sm-404-page>
      </template>

      <sm-divider
        margin-top="72px"
        margin-bottom="48px"
      />
      <sm-controller
        class="cm-mb-24"
        @left="goBack"
        @leftmost="goToFirst"
        @right="goNext"
        @rightmost="goToLast"
      >
        <template #leftmost>
          <sm-button
            shape="square"
            type="text"
          >
            <sm-icon name="arrow-left-alt" />
          </sm-button>
        </template>
        <template #left>
          <sm-button
            shape="square"
            type="text"
          >
            <sm-icon name="arrow-left" />
          </sm-button>
        </template>
        <template #right>
          <sm-button
            shape="square"
            type="text"
          >
            <sm-icon name="arrow-right" />
          </sm-button>
        </template>
        <template #rightmost>
          <sm-button
            shape="square"
            type="text"
          >
            <sm-icon name="arrow-right-alt" />
          </sm-button>
        </template>
        <template #body>
          {{ t('hide-show-table-columns-controller-text') }}
        </template>
      </sm-controller>
      <sm-table
        ref="table"
        :visible-scrollbar-x="true"
        class="cm-mb-32"
        min-width="1558px"
        :fixed-header-left="true"
      >
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th
              :sortable="true"
              :sorting-order="sortingBookingRef"
              :width="tableWidth + 'px'"
              @sortingTableOrder="sortByBookingReference"
            >
              {{ t('table.booking-reference') }}
            </sm-table-th>
            <sm-table-th :width="tableWidth + 'px'">
              {{ t('table.guest-name') }}
            </sm-table-th>
            <sm-table-th :width="tableWidth + 'px'">
              {{ t('table.check-in') }}
            </sm-table-th>
            <sm-table-th :width="tableWidth + 'px'">
              {{ t('table.check-out') }}
            </sm-table-th>
            <sm-table-th :width="tableWidth + 'px'">
              {{ t('table.room') }}
            </sm-table-th>
            <sm-table-th :width="tableWidth + 'px'">
              {{ t('table.booked-on-date') }}
            </sm-table-th>
            <sm-table-th :width="tableWidth + 'px'">
              {{ t('table.status') }}
            </sm-table-th>
            <sm-table-th :width="tableWidth + 'px'">
              {{ t('table.price') }}
            </sm-table-th>
          </sm-table-tr>
        </sm-table-thead>
        <sm-table-tbody>
          <sm-table-tr
            v-for="reservation in paginatedReservations"
            :key="reservation.bookingId"
          >
            <sm-table-td>
              {{ reservation.bookingId }}
            </sm-table-td>
            <sm-table-td>
              {{ reservation.guest.firstName }} {{ reservation.guest.lastName }}
            </sm-table-td>
            <sm-table-td>
              {{ reservation.checkIn }}
            </sm-table-td>
            <sm-table-td>
              {{ reservation.checkOut }}
            </sm-table-td>
            <sm-table-td>
              {{ reservation.room.name }}
            </sm-table-td>
            <sm-table-td>
              {{ reservation.createdAt }}
            </sm-table-td>
            <sm-table-td>
              <span
                :class="{
                  'sm-text--success': reservation.status === 'Booked',
                  'sm-text--warning': reservation.status === 'Cancelled',
                }"
              >
                <sm-icon
                  v-if="reservation.status === 'Booked'"
                  name="utility-success-alt"
                />
                <sm-icon
                  v-else-if="reservation.status === 'Cancelled'"
                  name="action-cancelled"
                />
                <sm-icon
                  v-else-if="reservation.status === 'Modified'"
                  name="action-modified"
                />
                {{ reservation.status }}
              </span>
            </sm-table-td>
            <sm-table-td>
              {{ reservation.price }}
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
        <sm-table-tfoot>
          <sm-table-tr>
            <sm-table-td
              v-for="index in columns"
              :key="index"
            >
              {{ t('table.footer') }}
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tfoot>
      </sm-table>

      <sm-pagination
        :current-page.sync="currentReservationsPage"
        :items-per-page.sync="itemsToShow"
        class="reservations__pagination-custom-class"
        type="expanded"
        :show-go-to-input="true"
        :max-visible-buttons="9"
        :total-items="reservationsList.length"
        :before-prev-page-change="onBeforePrevPageChange"
        :before-next-page-change="onBeforeNextPageChange"
        :before-page-number-change="onBeforePageNumberChange"
        :before-page-size-change="onBeforePageSizeChange"
      />

      <sm-dialog
        :visible.sync="searchFeedbackDialog"
        type="alert"
        :show-cancel="false"
        :show-confirm="false"
        :title="t('search-dialog.title')"
      >
        <div class="cm-code-block">
          <span
            v-for="(value, key) in searchQuery"
            :key="key"
          >
            {{ key }}: {{ value }} <br>
          </span>
        </div>
      </sm-dialog>
    </sm-container>
  </sm-section>
</template>
