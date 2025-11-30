<script setup lang="ts">
import { ref } from 'vue'
import { SmHintCard } from '@siteminder/sui-core/components/sm-hint-card'
import { useTranslate } from '@/composables/use-translate'
import { useFormatDateTime } from '@/composables/use-format-date-time'
import { SmTable, SmTableThead, SmTableTr, SmTableTh, SmTableTbody, SmTableTd, SmTableTfoot } from '@siteminder/sui-core/components/sm-table'
import { SmPopover, SmPopoverPlacement, SmPopoverTrigger } from '@siteminder/sui-core/components/sm-popover'
import BookingPerformanceFilters from './booking-performance-filters.vue'

interface SignalSingleEvent {
  title: string
  description: string
}

interface SignalCollapsedEvent {
  isCollapsed: boolean
  collapsedCount: number
  collapsedEvents: SignalSingleEvent[]
}

type SignalFooterEvent = SignalSingleEvent | SignalCollapsedEvent

interface SignalTableData {
  header: { label: string }
  rows: string[]
  footerEvents: SignalFooterEvent[]
}

const { d, t, tc } = useTranslate('views.insights.booking-performance')
const { formatDate } = useFormatDateTime(d)

const activeTab = ref(0)

const events = [
  {
    title: t('demand-events.event-1.title'),
    description: t('demand-events.event-1.description'),
  },
  {
    title: t('demand-events.event-2.title'),
    description: t('demand-events.event-2.description'),
  },
  {
    title: t('demand-events.event-3.title'),
    description: t('demand-events.event-3.description'),
  },
  {
    title: t('demand-events.event-4.title'),
    description: t('demand-events.event-4.description'),
  },
  {
    title: t('demand-events.event-5.title'),
    description: t('demand-events.event-5.description'),
  },
]

const tableData: SignalTableData[] = [
  {
    header: { label: t('table.room-type') },
    rows: ['Apartment suite', 'Bungalow', 'Delux suite', 'Junior suite', 'Penthouse suite'],
    footerEvents: [],
  },
  {
    header: { label: formatDate('2025-06-01') },
    rows: [],
    footerEvents: [
      ...events.slice(0, 2),
      {
        isCollapsed: true,
        collapsedCount: events.slice(2, 5).length,
        collapsedEvents: events.slice(2, 5),
      },
    ],
  },
  {
    header: { label: formatDate('2025-06-02') },
    rows: [],
    footerEvents: [
      ...events.slice(0, 2),
    ],
  },
]
</script>

<template>
  <sm-section>
    <sm-container :full-width="true">
      <sm-page-title :title="t(('page-title'))">
        <template #actions>
          <sm-button
            type="text"
            prefix-icon="action-download"
          >
            {{ t('buttons.download-csv') }}
          </sm-button>
        </template>
      </sm-page-title>

      <p>{{ t('page-description') }}</p>

      <!--
        This is an example use case of the `title-tag` prop. If we set it to h6
        here, it would raise an accessibility issue because it jumps from h1
        (from the sm-page-title) to h6, which violates the requirement for
        heading levels to be in order and increase sequentially. Therefore, we
        set it to h2. Building accessible pages requires some finesse.
      -->
      <sm-hint-card
        class="cm-mb-32"
        title-tag="h2"
        :action-button="{
          href: 'https://www.siteminder.com/',
          id: 'hint-card-learn-more',
          label: t('hint-card.action-label'),
          suffixIcon: 'action-open-in-new',
          target: '_blank',
        }"
        :body="t('hint-card.description')"
        :title="t('hint-card.title')"
      />

      <booking-performance-filters />
      <sm-tabs
        v-model:active-tab="activeTab"
        :show-underline="true"
      >
        <sm-tab
          :label="t(('tabs.source-market'))"
          prefix-icon="section-languages"
        >
          <sm-section>
            <p class="cm-font-bold">
              {{ t('charts.bookings-by-country') }}
            </p>
            <div class="chart" />

            <div class="table-container">
              <sm-table
                :fixed-footer="true"
                :fixed-header="true"
              >
                <sm-table-thead>
                  <sm-table-tr>
                    <sm-table-th
                      v-for="(column, columnIndex) in tableData"
                      :key="columnIndex"
                      width="150px"
                    >
                      {{ column.header.label }}
                    </sm-table-th>
                  </sm-table-tr>
                </sm-table-thead>

                <sm-table-tbody>
                  <sm-table-tr
                    v-for="(row, rowIndex) in tableData[0].rows"
                    :key="rowIndex"
                  >
                    <sm-table-td
                      v-for="(column, columnIndex) in tableData"
                      :key="columnIndex"
                      :disabled="columnIndex === 2"
                    >
                      {{ column.rows[rowIndex] }}
                    </sm-table-td>
                  </sm-table-tr>
                </sm-table-tbody>

                <sm-table-tfoot>
                  <sm-table-tr>
                    <sm-table-td
                      v-for="(column, columnIndex) in tableData"
                      :key="columnIndex"
                      root-class="table-cell"
                    >
                      <div class="timeline-container">
                        <div
                          v-for="(event, index) in column.footerEvents"
                          :key="index"
                        >
                          <!-- Render a single popover for collapsed events -->
                          <sm-popover
                            v-if="'isCollapsed' in event && event.isCollapsed"
                            :placement="columnIndex === tableData.length - 1 ? SmPopoverPlacement.LEFT : SmPopoverPlacement.TOP"
                            :trigger="SmPopoverTrigger.CLICK"
                          >
                            <div class="signals signals-collapsed">
                              {{ tc('demand-events.collapsed-count', { count: event.collapsedCount }) }}
                            </div>
                            <template #content>
                              <div class="popover-collapsed-events">
                                <div
                                  v-for="(collapsedEvent, collapsedIndex) in event.collapsedEvents"
                                  :key="collapsedIndex"
                                >
                                  <sm-popover
                                    :append-to-body="true"
                                    :placement="SmPopoverPlacement.TOP"
                                    :trigger="SmPopoverTrigger.HOVER"
                                  >
                                    <div class="signals">{{ collapsedEvent.title }}</div>
                                    <template #content>
                                      <h6 class="sm-h6">{{ collapsedEvent.title }}</h6>
                                      <div class="popover">{{ collapsedEvent.description }}</div>
                                    </template>
                                  </sm-popover>
                                </div>
                              </div>
                            </template>
                          </sm-popover>

                          <!-- Render individual popovers for non-collapsed events -->
                          <sm-popover
                            v-else
                            :placement="columnIndex === tableData.length - 1 ? SmPopoverPlacement.LEFT : SmPopoverPlacement.TOP"
                            :trigger="SmPopoverTrigger.HOVER"
                          >
                            <div
                              v-if="'title' in event"
                              class="signals"
                            >
                              {{ event.title }}
                            </div>
                            <template #content="slotProps">
                              <div class="popover-header">
                                <h6
                                  v-if="'title' in event"
                                  class="sm-h6"
                                >
                                  {{ event.title }}
                                </h6>
                                <sm-icon
                                  name="action-cross"
                                  class="popover-close-icon"
                                  @click="slotProps.close"
                                />
                              </div>
                              <div
                                v-if="'description' in event"
                                class="popover"
                              >
                                {{ event.description }}
                              </div>
                            </template>
                          </sm-popover>
                        </div>
                      </div>
                    </sm-table-td>
                  </sm-table-tr>
                </sm-table-tfoot>
              </sm-table>
            </div>
          </sm-section>
        </sm-tab>

        <sm-tab
          :label="t(('tabs.channel-mix'))"
          prefix-icon="products-distribution"
        >
          <sm-section>
            <p class="cm-font-bold">{{ t('charts.room-nights-by-channel') }}</p>
          </sm-section>
        </sm-tab>

        <sm-tab
          :label="t(('tabs.room-type'))"
          prefix-icon="section-room-types"
        >
          <sm-section>
            <p class="cm-font-bold">{{ t('charts.room-nights-by-room-type') }}</p>
          </sm-section>
        </sm-tab>

        <sm-tab
          prefix-icon="section-rate-plans"
          :label="t(('tabs.rate-plan'))"
          :disabled="true"
        />
      </sm-tabs>
    </sm-container>
  </sm-section>
</template>

<style lang="scss" scoped>
.popover {
  width: 200px;
  height: 200px;
}

.popover-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.popover-header h6 {
  margin: 0;
}

.popover-close-icon {
  cursor: pointer;
}

.popover-collapsed-events {
  display: flex;
  flex-direction: column;
  gap: var(--sm-8);
}

.signals {
  padding: var(--sm-4) var(--sm-8);
  flex-grow: 1;
  align-items: center;
  border-radius: 6px;
  border: 1px solid var(--color-info-mid);
  background: var(--color-info-light);
  color: var(--color-primary-mid);
}

.signals-collapsed {
  color: var(--color-disabled-dark);
  border-color: var(--color-disabled-mid);
  background: var(--color-extra-1);
}

.table-cell {
  vertical-align: top;
}

.table-container {
  overflow: hidden scroll;
  max-height: calc(100vh - 500px);
}

.timeline-container {
  top: 0;
  display: flex;
  flex-direction: column;
  gap: var(--sm-8);
}
</style>
