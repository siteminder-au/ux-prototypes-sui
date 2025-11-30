<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { SmUserListItemType } from '@siteminder/sui-core/components/sm-user-list'
import { differenceInTimeString } from '@/composables/relative-time'
import { useTranslate } from '@/composables/use-translate'
import NotificationsList from '@/components/notifications/notifications-list.vue'

const { t } = useTranslate('components.the-app-header')

// sm-app-header
const appHeaderTitle = 'CampMinder'
// Please update this version number when you bump sui-core
const appHeaderSubtitle = 'sui-core@23.4.0-vue3, vue@3.4.38'
const logoLink = ''
const syncWithVue2 = ref(true)

// sm-nav/sm-nav-item
const mobileNavVisible = ref(false)

// sm-nav > sm-vertical-nav* variant
const useVerticalNavInTablet = ref(false)
const navDropdownLabel = 'NSW'

// Toggle this to see new notification in url query params like: http://localhost:8080/dashboard?newNotifications=true
// Added feature flag here so that sui cypress will not fail
// Remove it after everything has been updated
const route = useRoute()
const showNewNotifications = computed(() => route.query.newNotifications === 'true')

// sm-user-list/sm-user-list-item
// We're simulating the notification title and body as dynamic data
// from the backend so they won't be translated here.
const notifications = computed(() => [
  {
    id: 111,
    body: 'Sample alert here...',
    title: 'Notification title',
    type: SmUserListItemType.WARNING,
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
      <!-- Hide by default to align visual test with Vue2 -->
      <template
        v-if="!syncWithVue2"
        #smart-guide
      >
        <sm-app-header-link
          smart-guide-label="Smart guide"
          :is-smart-guide="true"
          @click="eventLogger('Smart guide')"
        >
          <template #icon>
            <sm-icon
              name="section-guide-sml"
              aria-hidden="true"
            />
          </template>
        </sm-app-header-link>
      </template>

      <template #property-menu>
        <sm-property-menu
          :property-name="t('property-menu.title')"
          :overflow-visible="true"
        >
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
            <template v-if="!syncWithVue2">
              <sm-vertical-nav-item label="Property settings">
                <template #header-subnav>
                  <sm-vertical-nav-item
                    label="General"
                    to="/property-settings/general"
                  />
                  <sm-vertical-nav-item
                    label="Property details"
                    to="/property-settings/property-details"
                  />
                  <sm-vertical-nav-item
                    label="Services"
                    to="/property-settings/services"
                  />
                  <sm-vertical-nav-item
                    label="Policies"
                    to="/property-settings/policies"
                  />
                  <sm-vertical-nav-item
                    label="Media library"
                    to="/property-settings/media-library"
                  />
                </template>
              </sm-vertical-nav-item>
              <sm-vertical-nav-item
                label="Billing"
                to="/billing"
              >
                <template #header-subnav>
                  <sm-vertical-nav-item
                    label="Link"
                    to="/some-path"
                  />
                  <sm-vertical-nav-item
                    label="Subpath link"
                    to="/billing/subpath"
                  />
                  <sm-vertical-nav-item
                    label="Button"
                    @click="eventLogger('subnav button')"
                  />
                  <sm-vertical-nav-item
                    label="Disabled"
                    :disabled="true"
                  />
                  <sm-vertical-nav-item
                    label="External link"
                    href="https://google.com"
                    target="blank"
                    suffix-icon="action-open-in-new"
                  />
                </template>
              </sm-vertical-nav-item>
            </template>
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

      <!-- Hide by default to align visual test with Vue2 -->
      <template
        v-if="!syncWithVue2"
        #app-switcher
      >
        <sm-user-menu :display-name="t('app-switcher-label')">
          <template #icon>
            <sm-icon
              name="section-app-switcher"
              aria-hidden="true"
            />
          </template>
          <!-- New in Vue3 -->
          <template #label>
            {{ t('app-switcher-label') }}
          </template>
          <template #default>
            <sm-vertical-nav>
              <sm-vertical-nav-item
                to="/link-2"
                label="Link 2"
                prefix-icon="products-doorbell"
              />
              <sm-vertical-nav-item
                to="/link-3"
                label="Link 3"
                prefix-icon="products-distribution"
              />
              <sm-vertical-nav-item
                to="/link-4"
                label="Link 4"
                prefix-icon="products-booking-engine"
              />
            </sm-vertical-nav>
          </template>
        </sm-user-menu>
      </template>

      <template #notification>
        <template v-if="showNewNotifications">
          <sm-user-menu
            min-width="min(100vw - 80px, 560px)"
            :display-name="t('notifications-display-name')"
          >
            <template #display-name>
              <sm-icon
                name="social-notifications"
                aria-hidden="true"
              />
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
            <div class="the-app-header__notifications">
              <notifications-list>
                <template #action>
                  <sm-button
                    type="text"
                    suffix-icon="arrow-right"
                    :to="{ path: '/notifications', query: { newNotifications: 'true' } }"
                  >
                    {{ t('notifications-view-all-button') }}
                  </sm-button>
                </template>
              </notifications-list>
            </div>
          </sm-user-menu>
        </template>
        <template v-else>
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
              <sm-user-list-item
                v-for="notification in notifications"
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
            </sm-user-list>
          </sm-user-menu>
        </template>
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
          v-model:visible="mobileNavVisible"
          content-class="sm-nav__fixed-width"
          logo="/static/favicon/sm-logo.svg"
          logo-height="24"
          logo-width="24"
          :title="appHeaderTitle"
        >
          <template
            v-if="!useVerticalNavInTablet"
            #default
          >
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

          <template
            v-if="useVerticalNavInTablet"
            #subheader="{ closeNav }"
          >
            <sm-dropdown>
              <template #label="{ visible }">
                {{ navDropdownLabel }}
                <sm-icon
                  class="ml-12"
                  :name="visible ? 'arrow-up' : 'arrow-down'"
                />
              </template>

              <template #default="{ close: closeDropdown }">
                <sm-vertical-nav>
                  <sm-vertical-nav-item
                    label="ACT"
                    to="/setup/act"
                    @toggle="closeDropdown"
                  />
                  <sm-vertical-nav-item
                    label="VC"
                    to="/setup/vc"
                    @toggle="closeDropdown"
                  />
                  <sm-vertical-nav-item
                    label="QLD"
                    to="/setup/qld"
                    :disabled="true"
                    @toggle="closeDropdown"
                  />
                  <sm-vertical-nav-item
                    label="WA"
                    :disabled="true"
                    @toggle="closeDropdown"
                  />
                  <sm-vertical-nav-item
                    label="Close nav"
                    @toggle="closeNav"
                  />
                </sm-vertical-nav>
              </template>
            </sm-dropdown>
          </template>

          <template
            v-if="useVerticalNavInTablet"
            #vertical-nav="{ closeNav }"
          >
            <sm-vertical-nav>
              <sm-vertical-nav-section>
                <sm-vertical-nav-item
                  label="Properties"
                  to="/setup/properties"
                  @toggle="closeNav"
                />

                <sm-vertical-nav-item
                  label="Media"
                  to="/setup/media"
                >
                  <sm-vertical-nav-item
                    label="Rooms"
                    to="/setup/media/rooms"
                    @toggle="closeNav"
                  />
                  <sm-vertical-nav-item
                    label="Property"
                    to="/setup/media/property"
                    @toggle="closeNav"
                  />
                  <sm-vertical-nav-item
                    label="Guest Marketing Info Table"
                    to="/setup/media/property1"
                    :disabled="true"
                    @toggle="closeNav"
                  />
                </sm-vertical-nav-item>

                <!-- Use the 'href' prop to send the user to an external URL -->
                <sm-vertical-nav-item
                  label="Terms & Conditions"
                  href="https://terms-and-conditions.com"
                />

                <!-- Providing neither a "to" or "href" prop will render an HTML button -->
                <sm-vertical-nav-item label="Text in here" />
                <sm-vertical-nav-item label="Text in here" />
                <sm-vertical-nav-item label="Text in here" />

                <sm-vertical-nav-item
                  label="Button with close"
                  @toggle="closeNav"
                />
                <sm-vertical-nav-item
                  label="Disabled link"
                  to="/disabled"
                  :disabled="true"
                  @toggle="closeNav"
                />
                <sm-vertical-nav-item
                  label="Disabled button"
                  :disabled="true"
                  @toggle="closeNav"
                />
              </sm-vertical-nav-section>
            </sm-vertical-nav>
          </template>
        </sm-nav>
      </template>
    </sm-app-header>
    <sm-banner
      v-model:visible="isAlertBannerVisible"
      type="alert"
      :title="t('all-data-on-this-site-is-mocked-banner-title')"
      :show-icon="true"
      :show-close="true"
    />
  </div>
</template>

<style lang="scss">
.the-app-header {
  &__notifications {
    max-height: 75vh;
    overflow-y: auto;
  }
}
</style>
