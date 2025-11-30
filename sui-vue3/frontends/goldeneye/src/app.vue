<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

// Import all global styles
import '@siteminder/sui-core/sui-global.css'

// Alternatively, you can import individual global styles.
// However, this is not recommended as it can lead to missing styles which are
// required for the components to work correctly.
// import '@siteminder/sui-core/sui-common.css'
// import '@siteminder/sui-core/sui-resets.css'
// import '@siteminder/sui-core/sui-scaffolding.css'
// import '@siteminder/sui-core/sui-typography.css'
// import '@siteminder/sui-core/sui-utilities.css'

// Project specific styles
import './assets/styles/styles.css'

import TheAppHeader from '@/components/the-app-header.vue'
import DefaultLayout from '@/layouts/default.vue'
import FullLayout from '@/layouts/full.vue'

const route = useRoute()
const layoutMap: Record<string, unknown> = {
  default: DefaultLayout,
  full: FullLayout,
}
const layout = computed(() => layoutMap[(route.meta.layout as string | undefined) ?? 'default'])
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
