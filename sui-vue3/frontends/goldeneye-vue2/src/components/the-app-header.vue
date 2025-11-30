<script setup lang="ts">
import { ref, computed } from 'vue'
import { differenceInTimeString } from '@/composables/relative-time'
import { useTranslate } from '@/composables/use-translate'

const { t } = useTranslate('components.the-app-header')

// sm-app-header
const appHeaderTitle = 'CampMinder'
// Please update this version number when you bump sui-core
const appHeaderSubtitle = 'sui-core@9.1.0, vue@2.7.16'
const logoLink = ''

// sm-nav/sm-nav-item
const mobileNavVisible = ref(false)

// sm-user-list/sm-user-list-item
// We're simulating the notification title and body as dynamic data
// from the backend so they won't be translated here.
const notifications = computed(() => [
  {
    id: 111,
    body: 'Sample alert here...',
    title: 'Notification title',
    type: 'warning',
  },
  {
    id: 222,
    body: 'A new booking has been received for the weekend!',
    title: 'New Booking',
    date: differenceInTimeString(1000 * 60 * 60 * 1), // About an hour ago
    isSelected: true,
  },
  {
    id: 333,
    body: 'A guest is checking in today!',
    title: 'Check-in Reminder',
    date: differenceInTimeString(1000 * 60 * 60 * 24), // Yesterday
    isSelected: false,
  },
])
const email = 'john.wick@siteminder.com'
const unreadNotifications = ref(1)

// sm-banner
const isAlertBannerVisible = ref(true)

const eventLogger = (eventName: string): void => {
  console.info('clicked', eventName)
}
</script>

<template>
  <div>
    <sm-app-header
      :nav-visible="mobileNavVisible"
      :partner-name="appHeaderTitle"
      :logo-link="logoLink"
      :page-title="appHeaderTitle"
      :page-subtitle="appHeaderSubtitle"
      logo="/static/favicon/sm-logo.svg"
      logo-height="24"
      logo-width="24"
      :is-tablet="true"
      target="_self"
      @click="mobileNavVisible = true"
    >
      <template #property-menu>
        <sm-property-menu :property-name="t('property-menu.title')">
          <sm-vertical-nav>
            <sm-vertical-nav-item
              :label="t('property-menu.campsites')"
              to="/sites-and-rates/campsites"
            />
            <sm-vertical-nav-item
              :label="t('property-menu.campsite-settings')"
              to="/settings"
            />
            <sm-vertical-nav-item
              :label="t('property-menu.user-management')"
              to="/users"
            />
          </sm-vertical-nav>
        </sm-property-menu>
      </template>
      <template #help>
        <sm-app-header-link
          href="https://www.siteminder.com/contact/"
          :aria-label="t('help.go-to-support')"
        >
          <template #icon>
            <sm-icon
              class="cm-pure-white"
              name="utility-information"
            />
          </template>
        </sm-app-header-link>
      </template>

      <template #notification>
        <sm-user-menu
          min-width="350px"
          :display-name="t('notifications-display-name')"
        >
          <template #display-name>
            <span>{{ t('notifications-clear-all-button') }}</span>
            <sm-badge
              type="warning"
              size="medium"
            >
              {{ unreadNotifications }}
            </sm-badge>
          </template>
          <template #icon>
            <sm-icon
              name="social-notifications"
              aria-hidden="true"
            >
              <template #badge>
                <sm-badge
                  type="warning"
                  size="medium"
                >
                  {{ unreadNotifications }}
                </sm-badge>
              </template>
            </sm-icon>
          </template>
          <sm-user-list>
            <template v-for="notification in notifications">
              <sm-user-list-item
                :key="notification.id"
                tag="button"
                :type="notification.type"
                :selected="notification.isSelected"
              >
                <template #default>
                  <span class="sm-h6">{{ notification.title }}</span>
                  <p>{{ notification.body }}</p>
                </template>
                <template
                  v-if="notification.date"
                  #date
                >
                  {{ notification.date }}
                </template>
              </sm-user-list-item>
            </template>
          </sm-user-list>
        </sm-user-menu>
      </template>

      <template #user-menu>
        <sm-user-menu :display-name="email">
          <sm-vertical-nav>
            <sm-vertical-nav-item
              data-sm-test-id="user-menu-internal-link"
              prefix-icon="section-dashboard"
              to="/dashboard"
              :label="t('visit-dashboard-user-menu-link')"
            />
            <sm-vertical-nav-item
              data-sm-test-id="user-menu-external-link"
              prefix-icon="action-open-in-new"
              href="https://www.siteminder.com/"
              target="_blank"
              :label="t('visit-land-on-multi-land-user-menu-link')"
            />
            <sm-vertical-nav-item
              data-sm-test-id="user-menu-logout"
              prefix-icon="action-checkout"
              :label="t('logout-user-menu-link')"
              @click="eventLogger('logout')"
            />
          </sm-vertical-nav>
        </sm-user-menu>
      </template>

      <template #nav>
        <sm-horizontal-nav>
          <sm-horizontal-nav-item
            tag="router-link"
            to="/dashboard"
            :label="t('nav-item.dashboard')"
          />
          <sm-horizontal-nav-item
            tag="router-link"
            to="/sites-and-rates"
            :label="t('nav-item.sites-and-rates')"
          />
          <sm-horizontal-nav-item
            tag="router-link"
            to="/distribution"
            :label="t('nav-item.distribution')"
          />
          <sm-horizontal-nav-item
            tag="router-link"
            to="/direct-booking"
            :label="t('nav-item.direct-booking')"
          />
          <sm-horizontal-nav-item
            tag="router-link"
            to="/reservations"
            :label="t('nav-item.reservations')"
          />
          <sm-horizontal-nav-item
            tag="router-link"
            to="/insights"
            :label="t('nav-item.insights')"
          />
          <sm-horizontal-nav-item
            tag="router-link"
            to="/payments"
            :label="t('nav-item.payments')"
          />
          <sm-horizontal-nav-item
            tag="router-link"
            to="/health-check"
            :label="t('nav-item.health-check')"
          />
          <sm-horizontal-nav-item
            tag="router-link"
            :label="t('nav-item.sandbox.title')"
          >
            <template #icon>
              <sm-icon name="amenity-floorplan" />
            </template>

            <template #default>
              <sm-vertical-nav>
                <sm-vertical-nav-item
                  :label="t('nav-item.sandbox.components')"
                  to="/sandbox"
                />
                <sm-vertical-nav-item
                  :label="t('nav-item.sandbox.storybook')"
                  href="https://sui-dev-v3-sui-docs.dev.siteminderlabs.com/"
                  suffix-icon="action-open-in-new"
                  target="_blank"
                />
              </sm-vertical-nav>
            </template>
          </sm-horizontal-nav-item>
        </sm-horizontal-nav>
      </template>

      <template #tablet-navigation>
        <sm-nav
          :visible.sync="mobileNavVisible"
          content-class="sm-nav__fixed-width"
          logo="/static/favicon/sm-logo.svg"
          logo-height="24"
          logo-width="24"
          :title="appHeaderTitle"
        >
          <template #default>
            <sm-nav-item
              :label="t('nav-item.dashboard')"
              :to="{ name: 'dashboard' }"
            />

            <sm-nav-item
              :label="t('nav-item.sites-and-rates')"
              :to="{ name: 'sites-and-rates/rate-plans' }"
            />

            <sm-nav-item
              :label="t('nav-item.distribution')"
              :title="t('nav-item.distribution')"
              nav-item-id="distribution"
            >
              <sm-nav-item
                :label="t('nav-item.distribution')"
                :to="{ name: 'distribution' }"
                :parent-nav-items="['distribution']"
              />
              <sm-nav-item
                :label="t('nav-item.direct-booking-rates')"
                :disabled="true"
                :is-popover="true"
                :popover-title="t('direct-booking-rates-not-available')"
                popover-type="warning"
                popover-placement="top"
              />
              <sm-nav-item
                label="Extras"
                :disabled="true"
              />
            </sm-nav-item>

            <sm-nav-item
              :label="t('nav-item.direct-booking')"
              :title="t('nav-item.direct-booking')"
              nav-item-id="direct-booking"
            >
              <sm-nav-item
                :label="t('nav-item.health-check')"
                :to="{ name: 'health-check' }"
                :parent-nav-items="['direct-booking']"
              />
              <sm-nav-item
                :label="t('nav-item.direct-booking-rates')"
                :disabled="true"
              />
              <sm-nav-item
                :label="t('nav-item.extras')"
                :disabled="true"
              />
              <sm-nav-item
                :label="t('nav-item.configuration')"
                :title="t('nav-item.configuration')"
                nav-item-id="direct-booking-configuration"
              >
                <sm-nav-item
                  :label="t('nav-item.payments')"
                  :to="{ name: 'payments' }"
                  :parent-nav-items="['direct-booking', 'direct-booking-configuration']"
                />
                <sm-nav-item
                  :label="t('nav-item.widgets')"
                  :title="t('nav-item.widgets')"
                  nav-item-id="direct-booking-widgets"
                >
                  <sm-nav-item
                    :label="t('nav-item.branding')"
                    :disabled="true"
                  />
                </sm-nav-item>
              </sm-nav-item>
            </sm-nav-item>

            <sm-nav-item
              href="https://sui.siteminder.systems/?path=/story/components-vertical-nav--standard"
              label="External Links"
            >
              <template #suffix-icon>
                <sm-icon
                  name="action-open-in-new"
                  aria-hidden="true"
                />
              </template>
            </sm-nav-item>

            <sm-divider
              margin="0 24px"
              margin-top="8px"
              margin-bottom="8px"
              min-width="432px"
            />

            <sm-nav-item
              :label="t('nav-item.sandbox.title')"
              :to="{ name: 'sandbox' }"
            />
          </template>
        </sm-nav>
      </template>
    </sm-app-header>
    <sm-banner
      :visible.sync="isAlertBannerVisible"
      type="alert"
      :title="t('all-data-on-this-site-is-mocked-banner-title')"
      :show-icon="true"
      :show-close="true"
    />
  </div>
</template>
