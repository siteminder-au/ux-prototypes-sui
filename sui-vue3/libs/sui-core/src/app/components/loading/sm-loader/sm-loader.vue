<script setup lang="ts">
import { useI18n } from '../../../libs/vue-i18n'

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
  },
})

const { i18n } = useI18n()
</script>

<template>
  <div class="sm-loader">
    {{ i18n.t('sui-core.components.loading.sm-loader.sm-loader.loading-text') }}
  </div>
</template>
