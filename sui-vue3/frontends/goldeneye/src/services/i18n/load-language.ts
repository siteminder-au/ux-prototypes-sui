import { User } from '@/composables/use-user'

export const loadUserLanguage = async (user: User | null): Promise<string> => {
  if (!user) {
    return 'en'
  }

  if (user.type === 'staff') {
    return user.language ?? 'en'
  }

  // fallback to english
  return 'en'

}
