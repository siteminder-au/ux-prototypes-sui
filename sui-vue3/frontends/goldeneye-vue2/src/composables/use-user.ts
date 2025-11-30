import { computed, ComputedRef, Ref } from 'vue'
import { useStorage } from '@vueuse/core'

export type UserType = 'partner' | 'enterprise' | 'property' | 'staff'

export interface User {
  email: string
  type: UserType
  uuid: string
  hash?: string
  language?: string
}

interface UseUser {
  user: Ref<User | null>
  isPartner: ComputedRef<boolean>
  isStaff: ComputedRef<boolean>
  isEnterprise: ComputedRef<boolean>
}
const user = useStorage<User | null>('user', null, undefined, { serializer: {
  read: (v: string) => (v ? JSON.parse(v) as User : null),
  write: (v: User) => JSON.stringify(v),
} })

export const useUser = (): UseUser => {
  const isPartner = computed(() => user.value?.type === 'partner')
  const isStaff = computed(() => user.value?.type === 'staff')
  const isEnterprise = computed(() => user.value?.type === 'enterprise')

  return {
    user,
    isPartner,
    isStaff,
    isEnterprise,
  }
}
