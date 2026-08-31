import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('@/views/CreateArtistView.vue'),
    },
    {
      path: '/career',
      name: 'career',
      component: () => import('@/views/CareerView.vue'),
    },
    {
      path: '/legacy',
      name: 'legacy',
      component: () => import('@/views/LegacyView.vue'),
    },
    {
      // TEMPORARY — design-partner preview of the four visual directions.
      // Remove this route + src/views/DesignDirections.vue once a direction is chosen.
      path: '/design',
      name: 'design',
      component: () => import('@/views/DesignDirections.vue'),
    },
  ],
})

export default router
