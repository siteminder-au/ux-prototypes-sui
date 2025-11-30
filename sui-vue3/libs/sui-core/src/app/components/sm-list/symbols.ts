import { ComputedRef, InjectionKey } from 'vue'

// Using list component as provide to allow draggable props to be used in list-item
export const ListProviderKey: InjectionKey<{
  draggable: ComputedRef<boolean>
}> = Symbol('formProvider')
