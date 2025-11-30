<script setup lang="ts">
import { useTranslate } from '@/composables/use-translate'
import { useUserManagement } from '@/composables/use-user-management'

/**
 * IMPORTANT
 *
 * This section will be used for training/onboarding purposes.
 * Please refrain from adding/updating any code unless it's for that purpose.
 */

const { t } = useTranslate('views.users.manage')
const { users } = useUserManagement()
</script>

<template>
  <sm-section>
    <sm-container :full-width="true">
      <sm-page-title
        :title="t('page-title')"
        :sub-title="`(${users.length})`"
      >
        <template #actions>
          <sm-button
            type="primary"
            to="/users/add"
          >
            {{ t('add-user-button') }}
          </sm-button>
        </template>
      </sm-page-title>

      <sm-section>
        <template v-if="users.length">
          <sm-card
            v-for="user in users"
            :key="user.id"
          >
            <sm-card-content class="cm-flex cm-flex-row--gap-32">
              <div class="cm-flex-1">
                <h2 class="sm-h5">{{ user.firstName }} {{ user.lastName }}</h2>
                <div><span>{{ user.email }}</span></div>
              </div>
              <div class="cm-flex cm-flex-row--gap-32">
                <sm-tag size="large">
                  <template v-if="user.role === 'admin'">{{ t('tag-admin-role') }}</template>
                  <template v-else>{{ t('tag-general-role') }}</template>
                </sm-tag>

                <sm-dropdown
                  type="text"
                  placement="bottom"
                  :square="true"
                  :active-label="t('dropdown-active-label')"
                >
                  <template #label>
                    <sm-icon
                      name="action-context-menu"
                      :aria-label="t('dropdown-label')"
                    />
                  </template>

                  <template #default>
                    <sm-vertical-nav>
                      <sm-vertical-nav-item
                        prefix-icon="action-edit"
                        :disabled="true"
                        :label="t('dropdown-edit-user-label')"
                      />
                      <sm-vertical-nav-item
                        prefix-icon="action-remove"
                        :disabled="true"
                        :label="t('dropdown-delete-user-label')"
                      />
                    </sm-vertical-nav>
                  </template>
                </sm-dropdown>
              </div>
            </sm-card-content>
          </sm-card>
        </template>

        <sm-404-page
          v-else
          :full-page="false"
          :responsive="false"
        >
          <template #image>
            <img
              width="200"
              height="200"
              alt=""
              role="presentation"
              src="https://sui-assets.siteminder.com/sm/illu-md/illu-md-no-results.svg"
            >
          </template>
          <template #header>
            <h3>{{ t('empty-state-title') }}</h3>
          </template>
          <template #description>
            {{ t('empty-state-description') }}
          </template>
        </sm-404-page>
      </sm-section>
    </sm-container>
  </sm-section>
</template>
