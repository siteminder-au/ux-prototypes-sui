import { useRouter } from 'vue-router'

export const useIsPercy = (): boolean => {
  const router = useRouter()
  return router.currentRoute.value.query.isPercy === 'true'
}
