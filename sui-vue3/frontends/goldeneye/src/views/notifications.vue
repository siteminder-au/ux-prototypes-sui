<script setup lang="ts">
import { useTranslate } from '@/composables/use-translate'
import { SmButton, SmButtonType } from '@siteminder/sui-core/components/sm-button'
import NotificationsList from '@/components/notifications/notifications-list.vue'

const { t } = useTranslate('views.notifications')
</script>

<template>
  <sm-section>
    <sm-container :full-width="true">
      <sm-page-title :title="t('notifications-title')">
        <template #actions>
          <sm-button
            prefix-icon="action-settings"
            :type="SmButtonType.TEXT"
          >
            {{ t('settings') }}
          </sm-button>
        </template>
      </sm-page-title>

      <notifications-list :header-config="{ edgeToEdge: true }">
        <template #action>
          <sm-button
            prefix-icon="social-mark-as-read"
            :type="SmButtonType.TEXT"
          >
            {{ t('mark-all-as-read') }}
          </sm-button>
        </template>
      </notifications-list>
    </sm-container>
  </sm-section>
</template>
