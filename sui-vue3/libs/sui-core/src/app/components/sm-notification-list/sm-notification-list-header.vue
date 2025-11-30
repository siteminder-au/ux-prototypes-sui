<script setup lang="ts">
import { VNode, computed, ref, watch } from 'vue'
import { useI18n } from '../../libs/vue-i18n'
import { ShowUnreadOnlyConfig, SmNotificationListHeaderConfig } from './sm-notification-list.types'
import SmSwitch from '../forms/sm-switch/sm-switch.vue'

const props = defineProps<{
  headerConfig: SmNotificationListHeaderConfig
  /**
   * Configuration object for the "Show Unread Only" switch.
   */
  showUnreadOnlyConfig: ShowUnreadOnlyConfig
}>()

const emit = defineEmits<{
  /**
   * Emits an event to expose the value of the "Show Unread Only" switch.
   * @event 'toggle-show-unread-only'
   * @type {boolean}
   * @property {boolean} value - The new value of the switch.
   */
  'toggle-show-unread-only': [value: boolean]
}>()

/**
 * defineSlots macro used to declare expected slots and their respective expected slot
 */
defineSlots<{
  /**
   * @slot action - Slot for custom action in the header's top right area.
   */
  action?: () => VNode[]
}>()

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

// Maintain toggleValue locally
const toggleValue = ref<boolean>(props.showUnreadOnlyConfig.defaultToggleValue ?? false)

// Emit event when toggleValue changes
watch(toggleValue, (newValue) => {
  emit('toggle-show-unread-only', newValue)
})

const label = computed(() => {
  return props.showUnreadOnlyConfig.label && props.showUnreadOnlyConfig.label !== ''
    ? props.showUnreadOnlyConfig.label
    : (i18n.t('sui-core.components.sm-notification-list.sm-notification-list.show-unread-only-label') as string)
})
</script>

<template>
  <div
    :class="{
      'sm-notification-list-header': true,
      'sm-notification-list-header--edge-to-edge': props.headerConfig.edgeToEdge,
    }"
  >
    <sm-switch
      v-model="toggleValue"
      layout="horizontal-reverse"
      :name="showUnreadOnlyConfig.key ?? 'show-unread-only'"
      :disabled="showUnreadOnlyConfig.disabled"
      :error-disabled="true"
    >
      <template #label>
        <span class="sm-notification-list-header__switchLabel">{{ label }}</span>
      </template>
    </sm-switch>

    <slot
      name="action"
    />
  </div>
</template>

<style lang="scss">
@import "../../common/variables";

.sm-notification-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: $sm-16;
  gap: $sm-8;
  flex-wrap: wrap;

  &__switchLabel {
    font-weight: 600;
  }

  &--edge-to-edge {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
