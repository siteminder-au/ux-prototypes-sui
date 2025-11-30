<script setup lang="ts">
import '@siteminder/sui-core/sui-core.esm.css'

import { useRoute } from 'vue-router/composables'
import { computed } from 'vue'
import TheAppHeader from '@/components/the-app-header.vue'
import DefaultLayout from '@/layouts/default.vue'
import FullLayout from '@/layouts/full.vue'

const route = useRoute()
const layoutMap = {
  default: DefaultLayout,
  full: FullLayout,
} as Record<string, unknown>
const layout = computed(() => layoutMap[route.meta?.layout ?? 'default'])
</script>

<template>
  <div id="app">
    <the-app-header />
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<style lang="scss" scoped>
#app {
  // position: fixed here to ensure some poppers (e.g. tree-select)
  // are visible without worrying about manually setting their z-indexes
  // fixed also ensures we don't have a parent level scrollbar
  // In addition, removing this will cause some Cypress tests to fail since around
  // the clipped content.
  position: fixed;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
