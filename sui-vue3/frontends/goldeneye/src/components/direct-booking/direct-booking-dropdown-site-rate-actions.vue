<script setup lang="ts">
import { dialogService, toastService } from '@siteminder/sui-core/services'
import { useTranslate } from '@/composables/use-translate'

defineProps<{
  siteRateLabel: string
}>()

const emit = defineEmits({
  'copy-tool': () => true,
  edit: () => true,
  suspend: () => true,
})

const { t } = useTranslate('components.direct-booking.direct-booking-dropdown-site-rate-actions')

const removeSiteRate = (): void => {
  // dialogVNodeRef.value = dialogService(app, {
  dialogService({
    type: 'warning',
    title: t('delete-direct-booking-rate-dialog-title'),
    bodyContent: t('delete-direct-booking-rate-dialog-body-text'),
    beforeClose: (close: () => void) => {
      // destroyDialog.value = true
      return close()
    },
    beforeConfirm: (confirm: () => void) => {
      // immediately simulate success
      toastService({
        type: 'success',
        message: t('site-rate-deleted-successfully-toast-text'),
        placement: 'top',
      })
      // destroyDialog.value = true
      return confirm()
    },
    cancelButtonText: t('cancel-dialog-button-text'),
    confirmButtonText: t('delete-dialog-button-text'),
    confirmButtonType: 'warning',
  })
}
</script>

<template>
  <sm-dropdown
    :label="siteRateLabel"
    placement="bottom"
  >
    <sm-vertical-nav>
      <sm-vertical-nav-item
        :label="t('edit-dropdown-action-text')"
        prefix-icon="action-edit"
        @click="emit('edit')"
      />
      <sm-vertical-nav-item
        :label="t('copy-tool-dropdown-action-text')"
        prefix-icon="action-copy"
        @click="emit('copy-tool')"
      />
      <sm-vertical-nav-item
        :label="t('suspend-dropdown-action-text')"
        prefix-icon="controls-pause"
        @click="emit('suspend')"
      />
      <sm-vertical-nav-item
        :label="t('delete-direct-booking-rate-dropdown-action-text')"
        prefix-icon="action-remove"
        @click="removeSiteRate"
      />
    </sm-vertical-nav>
  </sm-dropdown>
</template>
