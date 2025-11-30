<script setup lang="ts">
import { useTranslate } from '@/composables/use-translate'

const { t } = useTranslate('views.error')
</script>

<template>
  <sm-section>
    <sm-container :full-width="true">
      <sm-404-page>
        <template #image>
          <img
            alt=""
            role="presentation"
            src="https://sui-assets.siteminder.com/sm/illu-lg/non-payment.svg"
          >
        </template>
        <template #header>
          <h3 class="cm-mb-8">{{ t('page-title') }}</h3>
        </template>
        <template #description>
          {{ t('page-description') }}
        </template>
        <template #actions>
          <sm-button type="secondary">{{ t('go-to-previous-page-button') }}</sm-button>
          <sm-button type="primary">{{ t('go-to-homepage-button') }}</sm-button>
        </template>
      </sm-404-page>
    </sm-container>
  </sm-section>
</template>
