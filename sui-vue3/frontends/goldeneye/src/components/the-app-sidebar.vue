<script setup lang="ts">
import AppSidebarVerticalNav from '@/components/app-sidebar-vertical-nav.vue'
import AppSidebarVerticalNavFooter from '@/components/app-sidebar-vertical-nav-footer.vue'
import { useTranslate } from '@/composables/use-translate'

const { t } = useTranslate('components.the-app-sidebar')
</script>

<template>
  <sm-aside
    :aria-label="t('sidebar-aria-label')"
    min-height="auto"
  >
    <app-sidebar-vertical-nav />
    <template #footer>
      <app-sidebar-vertical-nav-footer />
    </template>
  </sm-aside>
</template>
