<script setup lang="ts">
import { useRoute } from 'vue-router/composables'
import { useResponsive } from '@/composables/use-responsive'

const _route = useRoute()

// we use useResponsive here to prevent an extra div element from being rendered
// so we improve our semantic DOM structure
const { desktopUp } = useResponsive()
</script>

<template>
  <main
    :class="{
      page: true,
      'page--desktop': desktopUp,
      'page--tablet': !desktopUp,
    }"
  >
    <slot />
  </main>
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
