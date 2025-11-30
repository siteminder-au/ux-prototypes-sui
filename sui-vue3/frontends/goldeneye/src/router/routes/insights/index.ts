import { RouteRecordRaw } from 'vue-router'

export default [
  {
    // for vue-router v4, this `path` should be the same as the parent `path`
    path: '/insights',
    // if a parent route has a default child route
    // we should give the default child route a name
    // and omit giving a name to the parent route.
    // see: https://github.com/vuejs/vue-router/issues/777
    name: 'insights',
    // important redirect matches the names of the `path` props in this file
    // prefer using `name` alias when doing redirect in vue-router v4
    redirect: { name: 'insights/booking-performance' },
  },
  {
    // important path does not have a prefix `/` otherwise vue-router treats it as an absolute path
    path: 'booking-performance',
    name: 'insights/booking-performance',
    props: true,
    meta: {
      title: 'Booking performance',
      permissions: ['Admin'],
    },
    component: () => import('@/views/insights/booking-performance.vue'),
  },
] as RouteRecordRaw[]
