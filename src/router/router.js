import { createRouter, createWebHistory } from 'vue-router';
import UI from "@/pages/UI/UI.vue";
import Auth from "@/pages/Auth/Auth.vue";
import Admin from "@/pages/Admin/Admin.vue";
import Products from "@/pages/Admin/Products/Products.vue";
const routes = [
  {
    name: 'UI',
    path: '/ui',
    component: UI,
    meta: {
      layout: 'Sidebar',
    },
  },
  {
    name: 'Auth',
    path: '/',
    component: Auth,
    meta: {
      layout: 'Default',
    }
  },
  {
    name: 'Admin',
    path: '/admin',
    component: Admin,
    meta: {
      layout: 'Sidebar',
    },
  },
  {
    name: "Products",
    path: '/admin/products',
    component: Products,
    meta: {
      layout: 'Sidebar',
    },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;