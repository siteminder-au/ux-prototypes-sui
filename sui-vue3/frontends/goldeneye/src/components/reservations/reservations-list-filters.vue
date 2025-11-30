<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTranslate } from '@/composables/use-translate'
import { ReservationsListFiltersDateRange, ReservationsListFiltersParams } from './reservations-list-filters.types'

const emit = defineEmits({
  search: (searchParams: ReservationsListFiltersParams) => searchParams,
})

// Per-component opt-in is not working? Tried it with @vue/compat@3.3.4, vue@3.3.4 and @vue/compiler-sfc@3.3.4
// defineOptions({
//   // The form fields (sm-input, sm-date-picker, etc.) in here are already Vue3 compatible.
//   // We turn off the the v-model compat mode for this component to make sm-date-picker fully functional.
//   // It has a dependency on v-calendar which is not configured for Vue3 compat.
//   // See https://v3-migration.vuejs.org/breaking-changes/v-model.html
//   COMPONENT_V_MODEL: false,
//   // or, for full vue 3 compat in this component:
//   MODE: 3,
// })

const { t } = useTranslate('components.reservations.reservations-list-filters')

const bookingId = ref<string | null>()
const guestLastName = ref<string | null>()

const TODAY = new Date()

const dateRange = ref<ReservationsListFiltersDateRange | null>(null)
const dateTime = ref<Date | null>()

const time = ref<string | null>('2020-05-24T12:00:00.000')

const moreFiltersCounter = computed(() => {
  let counter = 0

  if (dateTime.value) {
    counter += 1
  }

  if (time.value) {
    counter += 1
  }

  return counter
})

const handleSearch = (): void => {
  const searchParams = {
    bookingId: bookingId.value,
    guestLastName: guestLastName.value,
    dateRange: dateRange.value,
    dateTime: dateTime.value,
    time: time.value,
  }

  emit('search', searchParams)
}

const resetSearchFields = (): void => {
  bookingId.value = null
  guestLastName.value = null
  dateRange.value = null
  dateTime.value = null
  time.value = '2020-05-24T12:00:00.000'
}
</script>

<template>
  <div class="reservations-list-filters">
    <sm-input
      v-model="bookingId"
      class="reservations-list-filters__input"
      rules="alpha_num"
      suffix-icon="action-search"
      name="search-booking-id"
      :label="t('booking-ref-label')"
      :placeholder="t('booking-ref-placeholder')"
    />

    <sm-input
      v-model="guestLastName"
      class="reservations-list-filters__input"
      suffix-icon="action-search"
      name="search-guest-last-name"
      :label="t('guest-last-name-label')"
      :placeholder="t('guest-last-name-placeholder')"
    />

    <sm-date-picker
      id="filterDateRange"
      v-model="dateRange"
      class="reservations-list-filters__date-picker"
      suffix-icon="action-calendar"
      name="filter-date-range"
      :columns="2"
      :is-range="true"
      :end-date-placeholder="t('end-date-placeholder')"
      :start-date-placeholder="t('start-date-placeholder')"
      :label="t('select-dates-label')"
      :time-rules="{
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }"
    />

    <div class="reservations-list-filters__button-container">
      <sm-popover
        placement="bottom"
      >
        <template #default>
          <sm-button
            type="tertiary"
            :aria-label="t('more-filters-btn')"
          >
            <sm-icon name="action-filter" />
            <sm-badge
              v-if="moreFiltersCounter"
              class="reservations-list-filters__badge"
              type="info"
              size="medium"
            >
              {{ moreFiltersCounter }}
            </sm-badge>
          </sm-button>
        </template>
        <template #content>
          <sm-date-picker
            v-model="dateTime"
            class="reservations-list-filters__date-picker"
            mode="dateTime"
            suffix-icon="action-calendar"
            name="filter-date-time"
            :label="t('select-date-time-label')"
            :min-date="TODAY"
          />
          <sm-date-picker
            v-model="time"
            class="reservations-list-filters__date-picker"
            mode="time"
            suffix-icon="action-time"
            name="filter-time"
            :label="t('select-time-label')"
            :time-rules="{
              minutes: { interval: 10 },
            }"
            :model-modifiers="{ string: true }"
          />
        </template>
      </sm-popover>
    </div>

    <div class="reservations-list-filters__button-container">
      <sm-button
        type="text"
        @click="resetSearchFields"
      >
        {{ t('reset-all-btn') }}
      </sm-button>
    </div>

    <div class="reservations-list-filters__button-container reservations-list-filters__button-container--search">
      <sm-button
        type="primary"
        @click="handleSearch"
      >
        {{ t('search-btn') }}
      </sm-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.reservations-list-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  column-gap: var(--sm-12);
  margin-bottom: var(--sm-32);
  padding: var(--sm-16) var(--sm-16) 0;
  // sm-card's border-radius is 8px, that's why this is currently customized
  border: 1px solid var(--color-app);
  border-radius: 5px;

  &__badge {
    margin-left: var(--sm-4);
  }

  &__input {
    flex: 1;
    flex-basis: 200px;
    max-width: 320px;
  }

  &__date-picker {
    flex: 1;
    flex-basis: 278px;
    max-width: 320px;
  }

  &__button-container {
    // 36px is custom to follow the input label's height and position
    // the buttons regardless if the input has validation errors or not
    margin: 36px 0 var(--sm-32);
  }
}
</style>
