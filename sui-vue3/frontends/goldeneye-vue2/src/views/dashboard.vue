<script setup lang="ts">
import { computed, ComputedRef, ref, onMounted } from 'vue'
import { useTranslate } from '@/composables/use-translate'
import cmStatusList from '@/components/cm-status-list/cm-status-list.vue'
import { CmStatus, CmStatusTypes } from '@/components/cm-status-list/cm-status.types'

const { t } = useTranslate('views.dashboard')

const asyncTimeout = (delay = 2000): Promise<unknown> => new Promise((resolve) => { setTimeout(resolve, delay) })

const loadingDashboard = ref(false)
const loadingReservations = ref(false)
const loadingNotifications = ref(false)

const inlineCardVisible = ref(true)

// #region sm-html-truncator
const channelsStatus: ComputedRef<CmStatus[]> = computed(() => ([
  {
    id: 1,
    name: 'Agoda',
    description: t('channel-status-delay-description'),
    status: CmStatusTypes.ALERT,
  },
  {
    id: 2,
    name: 'Airbnb',
    description: t('channel-status-awaiting-setup-description'),
    status: CmStatusTypes.ALERT,
  },
  {
    id: 3,
    name: 'Campers.com',
    description: t('channel-status-rate-disabled-description'),
    status: CmStatusTypes.WARNING,
  },
  {
    id: 4,
    name: 'Traveloka',
    description: t('channel-status-connection-interrupted-description'),
    status: CmStatusTypes.WARNING,
  },
  {
    id: 5,
    name: 'Booking.com',
    description: t('channel-status-connection-interrupted-description'),
    status: CmStatusTypes.WARNING,
  },
  {
    id: 6,
    name: 'TripAdvisor',
    description: t('channel-status-connection-interrupted-description'),
    status: CmStatusTypes.WARNING,
  },
]))
// #endregion sm-html-truncator

const fetchData = async (): Promise<void> => {
  loadingDashboard.value = true
  loadingReservations.value = true
  loadingNotifications.value = true

  await asyncTimeout()
  loadingDashboard.value = false
  await asyncTimeout(3000)
  loadingReservations.value = false
  await asyncTimeout()
  loadingNotifications.value = false
}

const onTagClose = (e: Event): void => {}

onMounted(() => {
  fetchData().then(
    () => {},
    () => {},
  )
})
</script>

<template>
  <sm-section>
    <sm-container :full-width="true">
      <sm-page-title :title="t('page-title')" />
      <sm-loading-dashboard v-if="loadingDashboard">
        <sm-loading-long-card />
        <div class="cm-flex">
          <sm-loading-small-card class="cm-flex-1" />
          <sm-loading-small-card class="cm-flex-1" />
        </div>
        <sm-loading-graph-card />
      </sm-loading-dashboard>
      <div
        v-else
        class="cm-flex cm-flex-row--gap-24 cm-flex-wrap cm-place-items-stretch"
      >
        <sm-card root-class="cm-w-full">
          <sm-card-content>
            <h4>{{ t('reservations-card.title') }}</h4>
            <sm-loading-table
              v-if="loadingReservations"
              total-rows="2"
              total-columns="5"
            />
            <div
              v-else
              class="cm-flex cm-flex-row--gap-24 cm-flex-wrap cm-place-content-between cm-place-items-stretch"
              data-sm-test-id="reservations-info"
            >
              <div class="cm-flex cm-flex-col cm-flex-row--gap-12 cm-p-24">
                <span>{{ 15 }}</span>
                <sm-tag>{{ t('reservations-card.arrivals') }}</sm-tag>
              </div>
              <div class="cm-flex cm-flex-col cm-flex-row--gap-12 cm-p-24">
                <span>{{ 5 }}</span>
                <sm-tag type="warning">
                  {{ t('reservations-card.departures') }}
                </sm-tag>
              </div>
              <div class="cm-flex cm-flex-col cm-flex-row--gap-12 cm-p-24">
                <span>{{ 3 }}</span>
                <sm-tag type="success">
                  <sm-icon name="arrow-go-up" />
                  {{ t('reservations-card.new-bookings') }}
                </sm-tag>
              </div>
              <div class="cm-flex cm-flex-col cm-flex-row--gap-12 cm-p-24">
                <span>{{ 45 }}</span>
                <sm-tag type="alert">
                  {{ t('reservations-card.stays') }}
                </sm-tag>
              </div>
              <div class="cm-flex cm-flex-col cm-flex-row--gap-12 cm-p-24">
                <span>{{ 3 }}</span>
                <sm-tag :disabled="true">
                  <sm-icon name="utility-alert" />{{ t('reservations-card.cancellations') }}
                </sm-tag>
              </div>
            </div>
          </sm-card-content>
        </sm-card>

        <sm-card root-class="cm-flex-1">
          <sm-card-content>
            <h4>{{ t('notifications-card.title') }}</h4>
            <sm-loading-list
              v-if="loadingNotifications"
              count="8"
            />
            <div
              v-else
              data-sm-test-id="notifications-info"
            >
              <div>
                <h6>{{ t('notifications-card.small') }}</h6>

                <sm-tag size="small">{{ t('notifications-card.default') }}</sm-tag>
                <sm-tag
                  size="small"
                  type="success"
                >
                  {{ t('notifications-card.success') }}
                </sm-tag>
                <sm-tag
                  size="small"
                  type="warning"
                >
                  {{ t('notifications-card.warning') }}
                </sm-tag>
                <sm-tag
                  size="small"
                  type="alert"
                >
                  {{ t('notifications-card.alert') }}
                </sm-tag>
                <sm-tag
                  size="small"
                  :disabled="true"
                >
                  {{ t('notifications-card.disabled') }}
                </sm-tag>

                <br><br>

                <sm-tag size="small"><sm-icon name="rating-default" />{{ t('notifications-card.default') }}</sm-tag>
                <sm-tag
                  size="small"
                  type="success"
                >
                  <sm-icon name="arrow-go-up" />{{ `${12}%` }}
                </sm-tag>
                <sm-tag
                  size="small"
                  type="warning"
                >
                  <sm-icon name="arrow-go-down" />{{ `${12}%` }}
                </sm-tag>
                <sm-tag
                  size="small"
                  type="alert"
                >
                  <sm-icon name="utility-alert" />{{ t('notifications-card.alert') }}
                </sm-tag>
                <sm-tag
                  size="small"
                  :disabled="true"
                >
                  <sm-icon name="rating-default" />{{ t('notifications-card.disabled') }}
                </sm-tag>
              </div>

              <br><br>

              <div>
                <h6>{{ t('notifications-card.medium') }}</h6>

                <sm-tag size="medium">{{ t('notifications-card.default') }}</sm-tag>
                <sm-tag
                  size="medium"
                  type="success"
                >
                  {{ t('notifications-card.success') }}
                </sm-tag>
                <sm-tag
                  size="medium"
                  type="warning"
                >
                  {{ t('notifications-card.warning') }}
                </sm-tag>
                <sm-tag
                  size="medium"
                  type="alert"
                >
                  {{ t('notifications-card.alert') }}
                </sm-tag>
                <sm-tag
                  size="medium"
                  :disabled="true"
                >
                  {{ t('notifications-card.disabled') }}
                </sm-tag>

                <br><br>

                <sm-tag size="medium"><sm-icon name="rating-default" />{{ t('notifications-card.default') }}</sm-tag>
                <sm-tag
                  size="medium"
                  type="success"
                >
                  <sm-icon name="arrow-go-up" />{{ `${12}%` }}
                </sm-tag>
                <sm-tag
                  size="medium"
                  type="warning"
                >
                  <sm-icon name="arrow-go-down" />{{ `${12}%` }}
                </sm-tag>
                <sm-tag
                  size="medium"
                  type="alert"
                >
                  <sm-icon name="utility-alert" />{{ t('notifications-card.alert') }}
                </sm-tag>
                <sm-tag
                  size="medium"
                  :disabled="true"
                >
                  <sm-icon name="rating-default" />{{ t('notifications-card.disabled') }}
                </sm-tag>

                <br><br>

                <sm-tag
                  size="medium"
                  :closable="true"
                  @close="onTagClose"
                >
                  {{ t('notifications-card.default') }}
                </sm-tag>
                <sm-tag
                  size="medium"
                  type="success"
                  :closable="true"
                  @close="onTagClose"
                >
                  {{ t('notifications-card.success') }}
                </sm-tag>
                <sm-tag
                  size="medium"
                  type="warning"
                  :closable="true"
                  @close="onTagClose"
                >
                  {{ t('notifications-card.warning') }}
                </sm-tag>
                <sm-tag
                  size="medium"
                  type="alert"
                  :closable="true"
                  @close="onTagClose"
                >
                  {{ t('notifications-card.alert') }}
                </sm-tag>
                <sm-tag
                  size="medium"
                  :disabled="true"
                  :closable="true"
                  @close="onTagClose"
                >
                  {{ t('notifications-card.disabled') }}
                </sm-tag>

                <br><br>

                <sm-tag
                  size="medium"
                  :closable="true"
                  @close="onTagClose"
                >
                  <sm-icon name="rating-default" />{{ t('notifications-card.default') }}
                </sm-tag>
                <sm-tag
                  size="medium"
                  type="success"
                  :closable="true"
                  @close="onTagClose"
                >
                  <sm-icon name="arrow-go-up" />{{ `${12}%` }}
                </sm-tag>
                <sm-tag
                  size="medium"
                  type="warning"
                  :closable="true"
                  @close="onTagClose"
                >
                  <sm-icon name="arrow-go-down" />{{ `${12}%` }}
                </sm-tag>
                <sm-tag
                  size="medium"
                  type="alert"
                  :closable="true"
                  @close="onTagClose"
                >
                  <sm-icon name="utility-alert" />{{ t('notifications-card.alert') }}
                </sm-tag>
                <sm-tag
                  size="medium"
                  :disabled="true"
                  :closable="true"
                  @close="onTagClose"
                >
                  <sm-icon name="rating-default" />{{ t('notifications-card.disabled') }}
                </sm-tag>
              </div>

              <br><br>

              <div>
                <h6>{{ t('notifications-card.large') }}</h6>

                <sm-tag>{{ t('notifications-card.default') }}</sm-tag>
                <sm-tag type="success">{{ t('notifications-card.success') }}</sm-tag>
                <sm-tag type="warning">{{ t('notifications-card.warning') }}</sm-tag>
                <sm-tag type="alert">{{ t('notifications-card.alert') }}</sm-tag>
                <sm-tag :disabled="true">{{ t('notifications-card.disabled') }}</sm-tag>

                <br><br>

                <sm-tag><sm-icon name="rating-default" />{{ t('notifications-card.default') }}</sm-tag>
                <sm-tag type="success"><sm-icon name="arrow-go-up" />{{ `${12}%` }}</sm-tag>
                <sm-tag type="warning"><sm-icon name="arrow-go-down" />{{ `${12}%` }}</sm-tag>
                <sm-tag type="alert"><sm-icon name="utility-alert" />{{ t('notifications-card.alert') }}</sm-tag>
                <sm-tag :disabled="true"><sm-icon name="rating-default" />{{ t('notifications-card.disabled') }}</sm-tag>

                <br><br>

                <sm-tag
                  :closable="true"
                  @close="onTagClose"
                >
                  {{ t('notifications-card.default') }}
                </sm-tag>
                <sm-tag
                  type="success"
                  :closable="true"
                  @close="onTagClose"
                >
                  {{ t('notifications-card.success') }}
                </sm-tag>
                <sm-tag
                  type="warning"
                  :closable="true"
                  @close="onTagClose"
                >
                  {{ t('notifications-card.warning') }}
                </sm-tag>
                <sm-tag
                  type="alert"
                  :closable="true"
                  @close="onTagClose"
                >
                  {{ t('notifications-card.alert') }}
                </sm-tag>
                <sm-tag
                  :disabled="true"
                  :closable="true"
                  @close="onTagClose"
                >
                  {{ t('notifications-card.disabled') }}
                </sm-tag>

                <br><br>

                <sm-tag
                  :closable="true"
                  @close="onTagClose"
                >
                  <sm-icon name="rating-default" />{{ t('notifications-card.default') }}
                </sm-tag>
                <sm-tag
                  type="success"
                  :closable="true"
                  @close="onTagClose"
                >
                  <sm-icon name="arrow-go-up" />{{ `${12}%` }}
                </sm-tag>
                <sm-tag
                  type="warning"
                  :closable="true"
                  @close="onTagClose"
                >
                  <sm-icon name="arrow-go-down" />{{ `${12}%` }}
                </sm-tag>
                <sm-tag
                  type="alert"
                  :closable="true"
                  @close="onTagClose"
                >
                  <sm-icon name="utility-alert" />{{ t('notifications-card.alert') }}
                </sm-tag>
                <sm-tag
                  :closable="true"
                  :disabled="true"
                  @close="onTagClose"
                >
                  <sm-icon name="rating-default" />{{ t('notifications-card.disabled') }}
                </sm-tag>
              </div>
            </div>
            <sm-divider
              margin-top="3.5rem"
              margin-bottom="3.5rem"
              min-width="0"
            />
            <h6>{{ t('notifications-card.sm-loading-image') }}</h6>
            <sm-loading-image class="cm-aspect-image" />
          </sm-card-content>
        </sm-card>

        <div class="cm-flex-1">
          <sm-card root-class="cm-mb-24">
            <sm-card-content>
              <h4>{{ t('camp-status-card.title') }}</h4>
              <h6>{{ t('camp-status-card.sm-loader') }}</h6>
              <sm-loader />
              <sm-divider
                margin-top="3.5rem"
                margin-bottom="3.5rem"
                min-width="0"
              />
              <h6>{{ t('camp-status-card.sm-loading-card') }}</h6>
              <sm-loading-card count="2" />
              <sm-loading-card
                count="2"
                :stacked="true"
              />
            </sm-card-content>
          </sm-card>

          <sm-expandable-card
            class="cm-mb-24"
            data-sm-test-id="channel-status-expandable-card"
          >
            <template #header>
              <h4 class="cm-mb-0">{{ t('channel-status-card-title') }}</h4>
            </template>

            <template #default>
              <sm-expandable-card-body>
                <template #header>{{ t('channel-status-card-active-subtitle') }}</template>
                <template #body>
                  <sm-html-truncator
                    height="120px"
                    max-height="240px"
                  >
                    <cm-status-list :list="channelsStatus" />

                    <template #less>
                      <sm-button type="text">
                        {{ t('channel-status-less-channels-button') }}
                      </sm-button>
                    </template>
                    <template #more>
                      <sm-button type="text">
                        {{ t('channel-status-more-channels-button') }}
                      </sm-button>
                    </template>
                  </sm-html-truncator>
                </template>
              </sm-expandable-card-body>
            </template>
          </sm-expandable-card>

          <sm-card
            theme="light"
            :show-border-on-top="false"
          >
            <sm-card-brand-graphic
              :dark="true"
              image-src="/static/images/sm-blocks-cropped.svg"
            />
            <sm-card-content width="90%">
              <h4>{{ t('upsell-card.hotel-app-store.title') }}</h4>
              <p>{{ t('upsell-card.hotel-app-store.content') }}</p>
            </sm-card-content>
            <sm-card-footer content-class="cm-flex cm-flex-row-end">
              <sm-button
                type="secondary"
                suffix-icon="arrow-go-forward"
              >
                {{ t('upsell-card.hotel-app-store.learn-more-action') }}
              </sm-button>
            </sm-card-footer>
          </sm-card>
        </div>

        <sm-card root-class="cm-w-full">
          <sm-card-content>
            <h4>{{ t('smart-guide-card.title') }}</h4>
            <h6>{{ t('smart-guide-card.sm-loading-form') }}</h6>
            <sm-loading-form count="1" />
            <sm-divider
              margin-top="3.5rem"
              margin-bottom="3.5rem"
              min-width="0"
            />
            <h6>{{ t('smart-guide-card.sm-loading-home-screen') }} </h6>
            <sm-loading-home-screen />
          </sm-card-content>
        </sm-card>

        <div class="cm-flex-1">
          <h4>{{ t('inline-card.general-info-inline-card-header-text') }}</h4>
          <sm-inline-card
            :title="t('inline-card.reservations.title')"
            :message="t('inline-card.reservations.message')"
          >
            <template #body>
              <p>{{ t('inline-card.reservations.body') }}</p>
            </template>
            <template #footer>
              <sm-button
                type="primary"
              >
                {{ t('inline-card.reservations.more-info-button-text') }}
              </sm-button>
            </template>
          </sm-inline-card>

          <sm-inline-card
            :title="t('inline-card.notifications.title')"
            :message="t('inline-card.notifications.message')"
            type="info"
          >
            <template #body>
              <p>{{ t('inline-card.notifications.body') }}</p>
            </template>
            <template #footer>
              <sm-button
                type="primary"
              >
                {{ t('inline-card.notifications.more-info-button-text') }}
              </sm-button>
            </template>
          </sm-inline-card>
        </div>
        <div class="cm-flex-1">
          <h4>{{ t('inline-card.warning.warning-info') }}</h4>
          <sm-inline-card
            v-if="inlineCardVisible"
            size="small"
            :title="t('inline-card.warning.title')"
            :message="t('inline-card.warning.message')"
            type="warning"
            :show-close="true"
            @close="inlineCardVisible = false"
          >
            <template #body>
              <p>{{ t('inline-card.warning.body') }}</p>
            </template>
            <template #footer>
              <sm-button type="warning">{{ t('inline-card.warning.more-info-button-text') }}</sm-button>
            </template>
          </sm-inline-card>
        </div>
      </div>
    </sm-container>
  </sm-section>
</template>
