import { InjectionKey } from 'vue'

export const openNavKey: InjectionKey<() => void> = Symbol('openNav')
