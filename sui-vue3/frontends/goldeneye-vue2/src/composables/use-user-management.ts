import { ref, Ref } from 'vue'

export type UserRole = 'admin' | 'general'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  preferredLanguage: string
  phoneNumber?: string
  role: UserRole
}

export interface UseUserManagement {
  users: Ref<User[]>
  addUser: (user: User) => Promise<void>
}

const users = ref<User[]>([])

const asyncTimeout = (delay = 2000): Promise<void> => new Promise((resolve) => { setTimeout(resolve, delay) })

export const addUser = async (user: User): Promise<void> => {
  await asyncTimeout()

  users.value.push(user)
}

export const useUserManagement = (): UseUserManagement => {
  return {
    users,
    addUser,
  }
}
