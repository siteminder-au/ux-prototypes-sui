<script setup lang="ts">
import { computed, ref, inject, onBeforeMount, reactive } from 'vue'
import { useUniqueId } from '../use/unique-id'
import { TabsProviderKey } from './symbols'

const props = withDefaults(defineProps<{
  /**
   * The label of the tab component used as the tag label
   */
  label: string
  /**
   * The value of the label used as the tag label
   */
  value?: string | number
  /**
   * An icon name to be displayed to the left of the tab label
   */
  prefixIcon?: string
  /**
   * An icon name to be displayed to the right of the tab label
   */
  suffixIcon?: string
  /**
   * Whether the tab is displayed but disabled
   */
  disabled?: boolean
  /**
   * Whether the tab is hidden from the list
   */
  hidden?: boolean
}>(), {
  label: '',
  value: 0,
  prefixIcon: '',
  suffixIcon: '',
  disabled: false,
  hidden: false,
})

const emit = defineEmits<{
  /**
   * Emitted when switching between tabs
   */
  'update:tabValue': [state: string | number]
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

const { id: baseElementId } = useUniqueId('sm-tab_')

const panelId = computed(() => `${baseElementId.value}__tab-panel`)
const controlId = computed(() => `${baseElementId.value}__tab-control`)

// tab label suffix count
const tabValue = computed({
  get: () => props.value,
  set: (state) => {
    emit('update:tabValue', state)
  },
})

// data provided by sm-tabs
const tabsProvider = inject(TabsProviderKey)

// internal state
const tabId = ref()
const active = computed(() => tabId.value === tabsProvider?.activeTab.value)
const isDisabled = computed(() => props.disabled)
const isHidden = computed(() => props.hidden)

onBeforeMount(() => {
  tabId.value = tabsProvider?.tabs.value.length ?? 0
  tabsProvider?.addTab(reactive({
    controlId,
    disabled: isDisabled,
    hidden: isHidden,
    index: tabsProvider.tabs.value.length,
    label: props.label,
    panelId,
    prefixIcon: props.prefixIcon,
    suffixIcon: props.suffixIcon,
    value: tabValue,
  }))
})

defineExpose({
  active,
})
</script>

<template>
  <div
    v-if="active && !disabled && !hidden"
    :id="panelId"
    class="sm-tab"
    role="tabpanel"
    :aria-labelledby="controlId"
  >
    <!-- @slot Place components here -->
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.sm-tab {
  min-width: 100%;
}
</style>
