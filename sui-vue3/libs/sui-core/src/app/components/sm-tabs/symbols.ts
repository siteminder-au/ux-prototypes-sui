import { InjectionKey, Ref, WritableComputedRef } from 'vue'

export interface SmTabState {
  controlId: string
  disabled: boolean
  hidden: boolean
  index: number
  label: string
  panelId: string
  prefixIcon: string | undefined
  suffixIcon: string | undefined
  value: string | number | undefined
}

export const TabsProviderKey: InjectionKey<{
  activeTab: WritableComputedRef<number>
  addTab: (tab: SmTabState) => void
  tabs: Ref<SmTabState[]>
}> = Symbol('tabsProvider')
