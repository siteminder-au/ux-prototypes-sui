import { RouteRecordRaw } from 'vue-router'

export default [
  {
    // for vue-router v4, this `path` should be the same as the parent `path`
    path: '/sites-and-rates',
    // if a parent route has a default child route
    // we should give the default child route a name
    // and omit giving a name to the parent route.
    // see: https://github.com/vuejs/vue-router/issues/777
    name: 'sites-and-rates',
    // important redirect matches the names of the `path` props in this file
    // prefer using `name` alias when doing redirect in vue-router v4
    redirect: { name: 'sites-and-rates/rate-plans' },
  },
  {
    // important path does not have a prefix `/` otherwise vue-router treats it as an absolute path
    path: 'rate-plans',
    name: 'sites-and-rates/rate-plans',
    props: true,
    meta: {
      title: 'Rate Plans',
      permissions: ['Admin'],
    },
    component: () => import('@/views/sites-and-rates/rate-plans.vue'),
  },
  {
    // important path does not have a prefix `/` otherwise vue-router treats it as an absolute path
    path: 'campsites',
    name: 'sites-and-rates/campsites',
    props: true,
    meta: {
      title: 'Campsites',
      permissions: ['Admin'],
    },
    component: () => import('@/views/sites-and-rates/campsites.vue'),
  },
  {
    // important path does not have a prefix `/` otherwise vue-router treats it as an absolute path
    path: 'promotions',
    name: 'sites-and-rates/promotions',
    props: true,
    meta: {
      title: 'Promotions',
      permissions: ['Admin'],
    },
    component: () => import('@/views/sites-and-rates/promotions.vue'),
  },
  {
    // important path does not have a prefix `/` otherwise vue-router treats it as an absolute path
    path: 'enquiry-form',
    name: 'sites-and-rates/enquiry-form',
    props: true,
    meta: {
      title: 'Enquiry Form',
      permissions: ['Admin'],
    },
    component: () => import('@/views/sites-and-rates/enquiry-form.vue'),
  },
  {
    // important path does not have a prefix `/` otherwise vue-router treats it as an absolute path
    path: 'translations',
    name: 'sites-and-rates/translations',
    props: true,
    meta: {
      title: 'Translations',
      permissions: ['Admin'],
    },
    component: () => import('@/views/sites-and-rates/translations.vue'),
  },
] as RouteRecordRaw[]
