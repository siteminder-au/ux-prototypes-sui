<script setup lang="ts">
import { useTranslate } from '@/composables/use-translate'

const { t } = useTranslate('views.payments')
</script>

<template>
  <sm-section>
    <sm-container :full-width="true">
      <sm-page-title :title="t('payments-title')" />
    </sm-container>
  </sm-section>
</template>
