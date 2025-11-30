import { ComputedRef, InjectionKey } from 'vue'

export const FormProviderKey: InjectionKey<{
  disabled: ComputedRef<boolean>
}> = Symbol('formProvider')
