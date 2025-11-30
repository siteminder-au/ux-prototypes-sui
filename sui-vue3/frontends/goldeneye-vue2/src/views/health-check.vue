<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTranslate } from '@/composables/use-translate'

const { t } = useTranslate('views.health-check')

const asyncTimeout = (delay = 2000): Promise<unknown> => new Promise((resolve) => { setTimeout(resolve, delay) })

const loadingDashboard = ref(false)
const loadingReservations = ref(false)
const loadingNotifications = ref(false)

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

const showInfoToast = ref(true)
</script>

<template>
  <sm-section>
    <sm-container :full-width="true">
      <sm-page-title :title="t('page-title')" />
      <div class="cm-flex cm-flex-column--gap-16">
        <sm-toast
          v-if="showInfoToast"
          :message=" t('customer-arrival-toast-text', [15])"
          type="info"
          :show-close="true"
          @close="showInfoToast = false"
        />
        <sm-toast
          :message=" t('customer-booking-toast-text', [3])"
          type="success"
          :show-close="true"
        />
        <sm-toast
          :message=" t('customer-staying-toast-text', [45])"
          type="alert"
          :show-close="true"
        />
        <sm-toast
          :message=" t('customer-checkout-toast-text', [5])"
          type="warning"
          :show-close="true"
        />
      </div>

      <sm-loading-dashboard v-if="loadingDashboard">
        <sm-loading-long-card />
        <div class="loading-dashboard-long-card">
          <sm-loading-small-card />
          <sm-loading-small-card />
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
              class="notifications-info"
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

        <sm-card root-class="cm-flex-1">
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
      </div>
    </sm-container>
  </sm-section>
</template>
