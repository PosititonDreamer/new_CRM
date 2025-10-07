import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    name: 'UI',
    path: '/',
    component: () => import('../pages/UI/UI.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;