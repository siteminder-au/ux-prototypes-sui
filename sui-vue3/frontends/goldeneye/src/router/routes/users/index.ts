import { RouteRecordRaw } from 'vue-router'

/**
 * IMPORTANT
 *
 * This section will be used for training/onboarding purposes.
 * Please refrain from adding/updating any code unless it's for that purpose.
 */

export default [
  {
    // for vue-router v4, this `path` should be the same as the parent `path`
    path: '/users',
    // if a parent route has a default child route
    // we should give the default child route a name
    // and omit giving a name to the parent route.
    // see: https://github.com/vuejs/vue-router/issues/777
    name: 'users',
    // important redirect matches the names of the `path` props in this file
    // prefer using `name` alias when doing redirect in vue-router v4
    redirect: { name: 'users/manage' },
  },
  {
    // important path does not have a prefix `/` otherwise vue-router treats it as an absolute path
    path: 'manage',
    name: 'users/manage',
    props: true,
    meta: {
      title: 'Manage users',
      permissions: ['Admin'],
      layout: 'full',
    },
    component: () => import('@/views/users/manage.vue'),
  },
  {
    // important path does not have a prefix `/` otherwise vue-router treats it as an absolute path
    path: 'add',
    name: 'users/add',
    props: true,
    meta: {
      title: 'Add user',
      permissions: ['Admin'],
      layout: 'full',
    },
    component: () => import('@/views/users/add.vue'),
  },
] as RouteRecordRaw[]
