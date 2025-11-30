import { InjectionKey, Ref } from 'vue'

export const closeNavKey: InjectionKey<() => void> = Symbol('closeNav')

export const deepLinkProviderKey: InjectionKey<{
  deepLinkParentNavItems: Ref<string[]>
  setDeepLinkParentNavItems: (parentNavItems: string[]) => void
}> = Symbol('deepLinkProvider')
