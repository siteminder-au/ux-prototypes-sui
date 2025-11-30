import { RouteRecordRaw } from 'vue-router'
import insightsChildren from './insights'
import sitesAndRatesChildren from './sites-and-rates'
import usersChildren from './users'

export default [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    props: true,
    meta: {
      title: 'Dashboard',
      permissions: ['Admin'],
      layout: 'full',
    },
    component: () => import('@/views/dashboard.vue'),
  },
  {
    path: '/direct-booking',
    name: 'direct-booking',
    props: true,
    meta: {
      title: 'Direct Booking',
      permissions: ['Admin'],
      layout: 'full',
    },
    component: () => import('@/views/direct-booking.vue'),
  },
  {
    path: '/distribution',
    name: 'distribution',
    props: true,
    meta: {
      title: 'Distribution',
      permissions: ['Admin'],
      layout: 'full',
    },
    component: () => import('@/views/distribution.vue'),
  },
  {
    path: '/health-check',
    name: 'health-check',
    props: true,
    meta: {
      title: 'Health check',
      permissions: ['Admin'],
      layout: 'full',
    },
    component: () => import('@/views/health-check.vue'),
  },
  {
    // this route doesn't have a `name` as it has a
    // default child route.
    path: '/insights',
    props: true,
    meta: {
      title: 'Insights',
      permissions: ['Admin'],
    },
    component: () => import('@/views/insights.vue'),
    children: [
      ...insightsChildren,
    ],
  },
  {
    path: '/payments',
    name: 'payments',
    props: true,
    meta: {
      title: 'Payments',
      permissions: ['Admin'],
      layout: 'full',
    },
    component: () => import('@/views/payments.vue'),
  },
  {
    path: '/notifications',
    name: 'notifications',
    props: true,
    meta: {
      title: 'Notifications',
      permissions: ['Admin'],
      layout: 'full',
    },
    component: () => import('@/views/notifications.vue'),
  },
  {
    path: '/reservations',
    name: 'reservations',
    props: true,
    meta: {
      title: 'Reservations',
      permissions: ['Admin'],
      layout: 'full',
    },
    component: () => import('@/views/reservations.vue'),
  },
  {
    path: '/sandbox',
    name: 'sandbox',
    props: true,
    meta: {
      title: 'Sandbox',
      permissions: ['Admin'],
      layout: 'full',
    },
    component: () => import('@/views/sandbox.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    props: true,
    meta: {
      title: 'Settings',
      permissions: ['Admin'],
      layout: 'full',
    },
    component: () => import('@/views/settings.vue'),
  },
  {
    // this route doesn't have a `name` as it has a
    // default child route.
    path: '/sites-and-rates',
    props: true,
    meta: {
      title: 'Sites and Rates',
      permissions: ['Admin'],
    },
    component: () => import('@/views/sites-and-rates.vue'),
    children: [
      ...sitesAndRatesChildren,
    ],
  },
  {
    // this route doesn't have a `name` as it has a
    // default child route.
    path: '/users',
    props: true,
    meta: {
      title: 'Users',
      permissions: ['Admin'],
      layout: 'full',
    },
    component: () => import('@/views/user-management.vue'),
    children: [
      ...usersChildren,
    ],
  },
  {
    // https://router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/error.vue'),
    props: true,
    meta: {
      title: 'Error',
      layout: 'full',
    },
  },
] as RouteRecordRaw[]
