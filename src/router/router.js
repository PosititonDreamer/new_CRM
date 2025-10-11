import { createRouter, createWebHistory } from 'vue-router';
import UI from "@/pages/UI/UI.vue";
const routes = [
  {
    name: 'UI',
    path: '/',
    component: UI,
    meta: {
      layout: 'Sidebar',
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;