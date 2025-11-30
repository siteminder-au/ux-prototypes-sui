import { RouteConfig } from 'vue-router'
import { i18n } from '@/services/i18n'

const commonMeta = {
  auth: 'none',
  layout: {
    sidebar: false,
  },
}

const notFoundProps = {
  hero: '/static/images/general-error.svg',
  title: i18n.t('router.routes.errors.not-found.title'),
  subtitle: i18n.t('router.routes.errors.not-found.subtitle'),
}

export default [
  {
    path: '/error/not-found',
    component: () => import('@/components/error.vue'),
    meta: {
      title: i18n.t('router.routes.errors.not-found.title'),
    },
    props: notFoundProps,
  },
  {
    path: '/error/unauthorized',
    component: () => import('@/components/error.vue'),
    meta: {
      title: i18n.t('router.routes.errors.unauthorized.title'),
    },
    props: {
      hero: '/static/images/unauthorized-error.svg',
      title: i18n.t('router.routes.errors.unauthorized.title'),
      subtitle: i18n.t('router.routes.errors.unauthorized.subtitle'),
    },
  },
  {
    path: '/error*',
    component: () => import('@/components/error.vue'),
    meta: {
      title: i18n.t('router.routes.errors.unknown.title'),
    },
    props: {
      hero: '/static/images/general-error.svg',
      title: i18n.t('router.routes.errors.unknown.title'),
      subtitle: i18n.t('router.routes.errors.unknown.subtitle'),
    },
  },
  {
    path: '*',
    component: () => import('@/components/error.vue'),
    meta: {
      title: i18n.t('router.routes.errors.not-found.title'),
    },
    props: notFoundProps,
  },
].map(route => ({ ...route, meta: { ...route.meta, ...commonMeta } })) as RouteConfig[]
