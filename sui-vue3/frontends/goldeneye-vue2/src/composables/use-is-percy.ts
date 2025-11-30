import { useRouter } from 'vue-router/composables'

export const useIsPercy = (): boolean => {
  const router = useRouter()
  return router.currentRoute.query.isPercy === 'true'
}
