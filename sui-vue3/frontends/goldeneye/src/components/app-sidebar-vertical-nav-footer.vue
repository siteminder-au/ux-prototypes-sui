<script setup lang="ts">
import { useTranslate } from '@/composables/use-translate'

const { t } = useTranslate('components.app-sidebar-vertical-nav-footer')
</script>

<template>
  <sm-vertical-nav>
    <sm-vertical-nav-item
      :disabled="true"
      :label="t('my-account-label')"
      suffix-icon="action-open-in-new"
    />
  </sm-vertical-nav>
</template>
