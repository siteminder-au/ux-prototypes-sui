<script setup lang="ts">
import { useRoute } from 'vue-router/composables'
import { useResponsive } from '@/composables/use-responsive'
import TheAppSidebar from '@/components/the-app-sidebar.vue'

// Static atm. But we can watch on route to change the sidebar nav items
const _route = useRoute()

// we use useResponsive here to prevent an extra div element from being rendered
// so we improve our semantic DOM structure
const { desktopUp } = useResponsive()
</script>

<template>
  <div
    :class="{
      page: true,
      'page--desktop': desktopUp,
      'page--tablet': !desktopUp,
    }"
  >
    <the-app-sidebar />
    <main>
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  flex: 1;
  min-height: 0;
}

main {
  // flex-grow: 1; so we want the <main> element to take up the rest of the width
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0 var(--sm-20) var(--sm-48) var(--sm-20);
  overflow-y: scroll;
}
</style>
