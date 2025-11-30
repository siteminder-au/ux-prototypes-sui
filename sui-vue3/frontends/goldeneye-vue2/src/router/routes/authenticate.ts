import { NavigationGuard, RouteConfig } from 'vue-router'
import { i18n } from '@/services/i18n'

export const beforeEnter: NavigationGuard = async (to, from, next) => {
  return next('/')
}

export default [
  {
    path: '/authenticate',
    meta: {
      title: i18n.t('router.routes.authenticate.authenticatingPageTitle'),
      auth: 'none',
    },
    beforeEnter,
  },
] as RouteConfig[]
