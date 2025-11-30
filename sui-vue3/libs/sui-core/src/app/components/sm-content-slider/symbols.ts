import { ComputedRef, InjectionKey } from 'vue'

export const ContentSliderProviderKey: InjectionKey<{
  itemsData: ComputedRef<unknown[]>
  itemWidth: ComputedRef<number>
}> = Symbol('contentSliderProvider')
